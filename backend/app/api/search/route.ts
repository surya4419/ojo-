import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, insertProfile, insertEvent, insertProvenance } from '@/lib/database';
import { Profile } from '@/types';
import { fetchPersonData, generateEmbedding } from '@/lib/gemini';
import { searchWikipediaCandidates, getWikipediaSummary, getWikidataIsHuman } from '@/lib/wiki';
import { searchAllSources } from '@/lib/multi-source';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    console.log('Search query received:', query);

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // First, search existing profiles in the database (broad + exact-normalized)
    console.log('Searching existing profiles for:', query);

    // Broad fuzzy search
    const profiles = await executeQuery<Profile[]>(
      `SELECT * FROM profiles WHERE name LIKE ? OR summary LIKE ? ORDER BY created_at DESC LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );

    // Exact-normalized match (case- and space-insensitive)
    const exactProfiles = await executeQuery<Profile[]>(
      `SELECT * FROM profiles WHERE REPLACE(LOWER(name), ' ', '') = REPLACE(LOWER(?), ' ', '') LIMIT 1`,
      [query]
    );

    console.log('Found existing profiles:', profiles.length);

    // If any profiles found, prioritize exact match; otherwise return broad results
    if (exactProfiles.length > 0 || profiles.length > 0) {
      const response = NextResponse.json({
        profiles: exactProfiles.length > 0 ? exactProfiles : profiles,
        totalCount: (exactProfiles.length > 0 ? exactProfiles : profiles).length
      });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    // If no profiles found, search all sources (Wikipedia, Facebook, Google, YouTube)
    console.log('No existing profiles found. Searching all sources for:', query);
    const allCandidates = await searchAllSources(query);
    
    if (allCandidates.length > 0) {
      const response = NextResponse.json({
        candidates: allCandidates,
        profiles: [],
        totalCount: 0,
        message: 'Select the correct person from multiple verified sources.'
      });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    // Fallback: If no candidates, try Gemini AI first, then Google/Facebook
    console.log('No Wikipedia candidates. Trying Gemini AI for:', query);
    let personData;
    try {
      personData = await fetchPersonData(query);
    } catch (error) {
      console.log('Gemini AI error:', error);
      personData = null;
    }
    
    if (!personData) {
      console.log('Gemini AI found no data. Falling back to Google/Facebook search for:', query);
      // Try Google and Facebook search as final fallback
      const fallbackCandidates = await searchAllSources(query);
      
      if (fallbackCandidates.length > 0) {
        const response = NextResponse.json({
          candidates: fallbackCandidates,
          profiles: [],
          totalCount: 0,
          message: 'Found profiles from web search. Select the correct person.'
        });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
      }
      
      const response = NextResponse.json({
        profiles: [],
        totalCount: 0,
        message: 'No information found for this person. Please try searching for a notable public figure.'
      });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    console.log('Fetched person data:', personData.name);

    // Before inserting, check again by normalized name to avoid duplicates
    const existing = await executeQuery<Profile[]>(
      `SELECT * FROM profiles WHERE REPLACE(LOWER(name), ' ', '') = REPLACE(LOWER(?), ' ', '') LIMIT 1`,
      [personData.name]
    );

    let profileId: string;
    if (existing.length > 0) {
      console.log('Profile already exists, skipping insert:', existing[0].id);
      profileId = existing[0].id;
    } else {
      // Insert the profile into the database
      const insertedId = await insertProfile(
        personData.name,
        personData.summary,
        personData.hero_image_url
      );
      profileId = insertedId.toString();
    }

    console.log('Inserted profile with ID:', profileId);

    // Insert events with embeddings
    for (const event of personData.events) {
      try {
        // Generate embedding for the event text
        const embedding = await generateEmbedding(event.event_text);
        
        const eventId = await insertEvent(
          parseInt(profileId),
          event.date,
          event.event_text,
          event.categories,
          event.source_url,
          event.source_snippet,
          embedding || undefined,
          event.confidence
        );

        // Insert provenance if source information is available
        if (event.source_url && event.source_snippet) {
          await insertProvenance(
            eventId,
            event.source_url,
            event.source_snippet,
            'Auto-generated from Gemini AI research'
          );
        }

        console.log('Inserted event with ID:', eventId);
      } catch (eventError) {
        console.error('Error inserting event:', event.event_text, eventError);
        // Continue with other events even if one fails
      }
    }

    // Fetch the newly created profile to return
    const newProfile = await executeQuery<Profile[]>(
      'SELECT * FROM profiles WHERE id = ?',
      [profileId]
    );

    const response = NextResponse.json({
      profiles: newProfile,
      totalCount: newProfile.length,
      isNewProfile: true,
      message: `Successfully created profile for ${personData.name} with ${personData.events.length} events.`
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error('Search API error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}