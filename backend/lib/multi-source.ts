export interface PersonCandidate {
  name: string;
  descriptor: string;
  source_url: string;
  snippet: string;
  similarity_score: number;
  source_type: 'wikipedia' | 'facebook' | 'google' | 'youtube' | 'linkedin' | 'github' | 'geeksforgeeks' | 'twitter' | 'instagram' | 'education' | 'medium' | 'devto' | 'stackoverflow' | 'quora' | 'behance' | 'dribbble' | 'aboutme';
  profile_image?: string;
  verified: boolean;
  confidence: number;
}

export interface PersonProfile {
  name: string;
  summary: string;
  hero_image_url?: string;
  source_urls: string[];
  social_links: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  events: Array<{
    date: string;
    event_text: string;
    categories: string[];
    source_url: string;
    source_snippet: string;
    confidence: number;
  }>;
}

// Facebook search via Google (no API required)
export async function searchFacebookPeople(query: string): Promise<PersonCandidate[]> {
  const candidates: PersonCandidate[] = [];
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.log('Google Search API not configured - skipping Facebook search');
      return candidates;
    }

    // Search specifically for Facebook profiles
    const searchQueries = [
      `"${query}" site:facebook.com`,
      `"${query}" facebook profile`,
      `"${query}" facebook.com/`
    ];

    for (const searchQuery of searchQueries) {
      const api = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=5`;
      const response = await fetch(api, { cache: 'no-store' });
      
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        
        items.forEach((item: any, index: number) => {
          const url = item.link;
          const title = item.title.toLowerCase();
          const snippet = item.snippet.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Must be Facebook profile and contain the person's name
          if (url.includes('facebook.com/') && 
              !url.includes('/posts/') && !url.includes('/photos/') && !url.includes('/videos/') &&
              (title.includes(queryLower) || snippet.includes(queryLower))) {
            
            candidates.push({
              name: item.title.replace(/ - .*$/, '').trim(),
              descriptor: `Facebook Profile`,
              source_url: url,
              snippet: item.snippet,
              similarity_score: Math.max(0, 1 - index * 0.1),
              source_type: 'facebook',
              verified: false,
              confidence: 0.7
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Facebook search error:', error);
  }
  
  return candidates;
}

// Google Custom Search API - Enhanced for normal people
export async function searchGooglePeople(query: string): Promise<PersonCandidate[]> {
  const candidates: PersonCandidate[] = [];
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.log('Google Search API not configured - skipping Google search');
      return candidates;
    }

    // Multiple search queries for better coverage - targeting specific platforms
    const searchQueries = [
      `"${query}" site:geeksforgeeks.org`,
      `"${query}" site:github.com`,
      `"${query}" portfolio website`,
      `"${query}" college university student`,
      `"${query}" site:twitter.com`,
      `"${query}" about.me`,
      `"${query}" behance.net`,
      `"${query}" dribbble.com`,
      `"${query}" medium.com`,
      `"${query}" dev.to`,
      `"${query}" stackoverflow.com`,
      `"${query}" quora.com`
    ];

    for (const searchQuery of searchQueries) {
      const api = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=3`;
      const response = await fetch(api, { cache: 'no-store' });
      
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        
        items.forEach((item: any, index: number) => {
          const url = item.link;
          const title = item.title.toLowerCase();
          const snippet = item.snippet.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Accept broader range of person-related URLs
          const isPersonRelated = url.includes('twitter.com/') ||
                                 url.includes('github.com/') ||
                                 url.includes('geeksforgeeks.org/') ||
                                 url.includes('portfolio') ||
                                 url.includes('about.me/') ||
                                 url.includes('behance.net/') ||
                                 url.includes('dribbble.com/') ||
                                 url.includes('medium.com/@') ||
                                 url.includes('dev.to/') ||
                                 url.includes('stackoverflow.com/') ||
                                 url.includes('quora.com/') ||
                                 url.includes('university.edu') ||
                                 url.includes('college.edu') ||
                                 url.includes('edu.in') ||
                                 url.includes('ac.in') ||
                                 url.includes('wikipedia.org/wiki/');
          
          // Must mention the person's name
          const hasPersonName = title.includes(queryLower) || snippet.includes(queryLower);
          
          // Exclude non-person content
          const isNotMedia = !title.includes('tv') && !title.includes('channel') && 
                            !title.includes('show') && !title.includes('news') &&
                            !title.includes('media') && !title.includes('network') &&
                            !title.includes('company') && !title.includes('organization') &&
                            !title.includes('franchise') && !title.includes('universe');
          
          if (isPersonRelated && hasPersonName && isNotMedia) {
            // Determine source type based on URL
            let sourceType = 'google';
            if (url.includes('github.com')) sourceType = 'github';
            else if (url.includes('geeksforgeeks.org')) sourceType = 'geeksforgeeks';
            else if (url.includes('twitter.com')) sourceType = 'twitter';
            else if (url.includes('medium.com')) sourceType = 'medium';
            else if (url.includes('dev.to')) sourceType = 'devto';
            else if (url.includes('stackoverflow.com')) sourceType = 'stackoverflow';
            else if (url.includes('quora.com')) sourceType = 'quora';
            else if (url.includes('behance.net')) sourceType = 'behance';
            else if (url.includes('dribbble.com')) sourceType = 'dribbble';
            else if (url.includes('about.me')) sourceType = 'aboutme';
            else if (url.includes('university.edu') || url.includes('college.edu') || url.includes('edu.in') || url.includes('ac.in')) sourceType = 'education';
            
            candidates.push({
              name: item.title.replace(/ - .*$/, '').trim(),
              descriptor: new URL(url).hostname,
              source_url: url,
              snippet: item.snippet,
              similarity_score: Math.max(0, 1 - index * 0.1),
              source_type: sourceType as any,
              verified: false,
              confidence: 0.7
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Google Search API error:', error);
  }
  
  return candidates;
}

// YouTube Data API - Only for actual people
export async function searchYouTubePeople(query: string): Promise<PersonCandidate[]> {
  const candidates: PersonCandidate[] = [];
  
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.log('YouTube API key not configured - skipping YouTube search');
      return candidates;
    }

    // Search for videos about the person, not channels
    const api = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' interview biography documentary')}&type=video&key=${apiKey}&maxResults=10`;
    const response = await fetch(api, { cache: 'no-store' });
    
    if (response.ok) {
      const data = await response.json();
      const items = data.items || [];
      
      // Filter for videos that mention the person in title/description
      const personVideos = items.filter((item: any) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Must contain the person's name and be about them
        const hasPersonName = title.includes(queryLower) || description.includes(queryLower);
        const isAboutPerson = title.includes('interview') || title.includes('biography') || 
                             title.includes('documentary') || title.includes('profile') ||
                             description.includes('interview') || description.includes('biography');
        
        // Exclude TV shows, news channels, etc.
        const isNotMedia = !title.includes('tv') && !title.includes('channel') && 
                          !title.includes('show') && !title.includes('news') &&
                          !title.includes('media') && !title.includes('network');
        
        return hasPersonName && isAboutPerson && isNotMedia;
      });
      
      personVideos.slice(0, 3).forEach((item: any, index: number) => {
        const video = item.snippet;
        candidates.push({
          name: query, // Use the search query as the person's name
          descriptor: 'YouTube Video',
          source_url: `https://youtube.com/watch?v=${item.id.videoId}`,
          snippet: video.title,
          similarity_score: Math.max(0, 1 - index * 0.1),
          source_type: 'youtube',
          profile_image: video.thumbnails?.default?.url,
          verified: false,
          confidence: 0.5
        });
      });
    }
  } catch (error) {
    console.error('YouTube API error:', error);
  }
  
  return candidates;
}

// Unified multi-source search - Only actual people
export async function searchAllSources(query: string): Promise<PersonCandidate[]> {
  console.log('Searching all sources for:', query);
  
  const [wikipediaResults, facebookResults, googleResults, youtubeResults, linkedinResults, instagramResults] = await Promise.all([
    searchWikipediaCandidates(query),
    searchFacebookPeople(query),
    searchGooglePeople(query),
    searchYouTubePeople(query),
    searchLinkedInPeople(query),
    searchInstagramPeople(query)
  ]);

  console.log('Search results:', {
    wikipedia: wikipediaResults.length,
    facebook: facebookResults.length,
    google: googleResults.length,
    youtube: youtubeResults.length,
    linkedin: linkedinResults.length,
    instagram: instagramResults.length
  });

  // Combine and deduplicate results
  const allCandidates = [
    ...wikipediaResults.map(r => ({ ...r, source_type: 'wikipedia' as const, verified: true, confidence: 0.9 })),
    ...facebookResults,
    ...googleResults,
    ...youtubeResults,
    ...linkedinResults,
    ...instagramResults
  ];

  // Additional filtering to ensure only people
  const peopleOnly = allCandidates.filter(candidate => {
    const name = candidate.name.toLowerCase();
    const snippet = candidate.snippet.toLowerCase();
    
    // Exclude obvious non-people
    const isNotPerson = name.includes('tv') || name.includes('channel') || 
                       name.includes('show') || name.includes('news') ||
                       name.includes('media') || name.includes('network') ||
                       name.includes('company') || name.includes('organization') ||
                       name.includes('alert') || name.includes('common media') ||
                       snippet.includes('tv') || snippet.includes('channel') ||
                       snippet.includes('show') || snippet.includes('news');
    
    return !isNotPerson;
  });

  // Deduplicate by name similarity and source URL
  const deduplicated = deduplicateCandidates(peopleOnly);
  
  // Sort by confidence and similarity, prioritize Wikipedia, limit to unique people
  return deduplicated
    .sort((a, b) => {
      // Wikipedia results get priority
      if (a.source_type === 'wikipedia' && b.source_type !== 'wikipedia') return -1;
      if (b.source_type === 'wikipedia' && a.source_type !== 'wikipedia') return 1;
      
      const scoreA = (a.confidence * 0.6) + (a.similarity_score * 0.4);
      const scoreB = (b.confidence * 0.6) + (b.similarity_score * 0.4);
      return scoreB - scoreA;
    })
    .slice(0, 4); // Return top 4 unique people candidates
}

// Enhanced deduplication logic - eliminate duplicates and non-people
function deduplicateCandidates(candidates: PersonCandidate[]): PersonCandidate[] {
  const seen = new Set<string>();
  const result: PersonCandidate[] = [];
  
  for (const candidate of candidates) {
    const name = candidate.name.toLowerCase().trim();
    const snippet = candidate.snippet.toLowerCase();
    
    // Skip if it's clearly not a person
    const isNotPerson = name.includes('cinematic universe') || 
                       name.includes('universe') ||
                       name.includes('franchise') ||
                       name.includes('media') ||
                       name.includes('tv') ||
                       name.includes('channel') ||
                       name.includes('show') ||
                       name.includes('news') ||
                       name.includes('company') ||
                       name.includes('organization') ||
                       snippet.includes('franchise') ||
                       snippet.includes('media franchise') ||
                       snippet.includes('shared universe');
    
    if (isNotPerson) continue;
    
    // Create a normalized key for deduplication
    const normalizedName = name.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
    const key = `${normalizedName}-${candidate.source_type}`;
    
    // Check if we already have this person from a different source
    const existingIndex = result.findIndex(r => {
      const existingName = r.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      return existingName === normalizedName;
    });
    
    if (existingIndex >= 0) {
      // Keep the higher confidence result
      if (candidate.confidence > result[existingIndex].confidence) {
        result[existingIndex] = candidate;
      }
    } else if (!seen.has(key)) {
      seen.add(key);
      result.push(candidate);
    }
  }
  
  return result;
}

// LinkedIn search via Google (no API required)
export async function searchLinkedInPeople(query: string): Promise<PersonCandidate[]> {
  const candidates: PersonCandidate[] = [];
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.log('Google Search API not configured - skipping LinkedIn search');
      return candidates;
    }

    // Search specifically for LinkedIn profiles
    const searchQueries = [
      `"${query}" site:linkedin.com/in/`,
      `"${query}" linkedin profile`,
      `"${query}" linkedin.com/in/`
    ];

    for (const searchQuery of searchQueries) {
      const api = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=5`;
      const response = await fetch(api, { cache: 'no-store' });
      
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        
        items.forEach((item: any, index: number) => {
          const url = item.link;
          const title = item.title.toLowerCase();
          const snippet = item.snippet.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Must be LinkedIn profile and contain the person's name
          if (url.includes('linkedin.com/in/') && 
              (title.includes(queryLower) || snippet.includes(queryLower))) {
            
            // Extract LinkedIn username from URL
            const linkedinMatch = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
            const username = linkedinMatch ? linkedinMatch[1] : 'unknown';
            
            candidates.push({
              name: item.title.replace(/ - .*$/, '').trim(),
              descriptor: `LinkedIn Profile`,
              source_url: url,
              snippet: item.snippet,
              similarity_score: Math.max(0, 1 - index * 0.1),
              source_type: 'linkedin',
              verified: false,
              confidence: 0.8
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('LinkedIn search error:', error);
  }
  
  return candidates;
}

// Instagram search via Google (no API required)
export async function searchInstagramPeople(query: string): Promise<PersonCandidate[]> {
  const candidates: PersonCandidate[] = [];
  
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      console.log('Google Search API not configured - skipping Instagram search');
      return candidates;
    }

    // Search specifically for Instagram profiles
    const searchQueries = [
      `"${query}" site:instagram.com`,
      `"${query}" instagram profile`,
      `"${query}" instagram.com/`
    ];

    for (const searchQuery of searchQueries) {
      const api = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&num=5`;
      const response = await fetch(api, { cache: 'no-store' });
      
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        
        items.forEach((item: any, index: number) => {
          const url = item.link;
          const title = item.title.toLowerCase();
          const snippet = item.snippet.toLowerCase();
          const queryLower = query.toLowerCase();
          
          // Must be Instagram profile and contain the person's name
          if (url.includes('instagram.com/') && 
              !url.includes('/p/') && !url.includes('/reel/') && !url.includes('/tv/') &&
              (title.includes(queryLower) || snippet.includes(queryLower))) {
            
            // Extract Instagram username from URL
            const instagramMatch = url.match(/instagram\.com\/([^\/\?]+)/);
            const username = instagramMatch ? instagramMatch[1] : 'unknown';
            
            candidates.push({
              name: item.title.replace(/ - .*$/, '').trim(),
              descriptor: `Instagram Profile`,
              source_url: url,
              snippet: item.snippet,
              similarity_score: Math.max(0, 1 - index * 0.1),
              source_type: 'instagram',
              verified: false,
              confidence: 0.7
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Instagram search error:', error);
  }
  
  return candidates;
}

// Import Wikipedia function
import { searchWikipediaCandidates } from './wiki';
