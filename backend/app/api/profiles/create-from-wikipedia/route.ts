import { NextRequest, NextResponse } from 'next/server';
import { insertProfile, insertEvent, insertProvenance, executeQuery } from '@/lib/database';
import { getWikipediaSummary, getWikidataDOB, getWikipediaFullText, extractTimelineEvents } from '@/lib/wiki';
import { searchAllSources } from '@/lib/multi-source';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, source_type } = body as { title?: string; source_type?: string };
    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    // Handle different source types
    let summary;
    if (source_type === 'wikipedia') {
      summary = await getWikipediaSummary(title);
      if (!summary) {
        return NextResponse.json({ error: 'Wikipedia summary not found' }, { status: 404 });
      }
    } else {
      // For non-Wikipedia sources, create a basic profile
      summary = {
        extract: `Profile information for ${title} from ${source_type || 'web search'}`,
        url: '',
        image: undefined,
        wikidataId: undefined
      };
    }

    // Create profile
    const profileId = await insertProfile(title, summary.extract || '', summary.image?.url);

    // Get full Wikipedia text for comprehensive timeline extraction
    const fullText = await getWikipediaFullText(title);
    
    // Extract comprehensive timeline events
    const timelineEvents = fullText ? await extractTimelineEvents(fullText, title) : [];
    
    // Add birth event from Wikidata if available
    if (summary.wikidataId) {
      const dob = await getWikidataDOB(summary.wikidataId);
      if (dob) {
        await insertEvent(
          profileId,
          dob,
          `Birth of ${title}`,
          ['birth'],
          summary.url,
          'Date of birth per Wikidata',
          undefined,
          0.9
        );
      }
    }

    // Insert extracted timeline events
    for (const event of timelineEvents) {
      try {
        const eventId = await insertEvent(
          profileId,
          event.date,
          event.event_text,
          event.categories,
          summary.url,
          event.source_snippet,
          undefined,
          event.confidence
        );

        // Add provenance for each event
        await insertProvenance(
          eventId,
          summary.url,
          event.source_snippet,
          `Extracted from Wikipedia full text for ${title}`
        );
      } catch (eventError) {
        console.error('Error inserting timeline event:', event.event_text, eventError);
      }
    }

    // Return created profile with events to render immediately
    const [profiles, events] = await Promise.all([
      executeQuery<any[]>(
        'SELECT * FROM profiles WHERE id = ? LIMIT 1',
        [profileId]
      ),
      executeQuery<any[]>(
        'SELECT * FROM events WHERE person_id = ? ORDER BY date ASC',
        [profileId]
      )
    ]);

    return NextResponse.json({ profile: profiles[0], events, created: true });
  } catch (error) {
    console.error('Create-from-Wikipedia error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


