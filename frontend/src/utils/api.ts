// API service to connect to TIDB backend

// Define the types based on the backend data structure
export interface Profile {
  id: string;
  name: string;
  summary?: string;
  bio?: string;
  birth_year?: number;
  birth_place?: string;
  occupation?: string;
  nationality?: string;
  image_url?: string;
  hero_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  person_id: string;
  title?: string;
  description?: string;
  date: string;
  year?: number;
  event_text?: string;
  location?: string;
  categories: string[];
  source_url?: string;
  source_snippet?: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  name: string;
  url: string;
  reliability: 'high' | 'medium' | 'low';
  lastUpdated: string;
  icon: string;
  verified: boolean;
  dataPoints: number;
}

// Get the API base URL from environment variables or use a default
// This will be replaced by Vite during build time
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

// API functions
export const api = {
  // Search for profiles
  async searchProfiles(query: string): Promise<{ profiles?: Profile[], candidates?: any[] }> {
    try {
      console.log('Searching profiles with query:', query);
      console.log('API URL:', `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
      console.log('Search response status:', response.status);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Search results:', data);
      return data;
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  },

  // Get profile by ID
  async getProfile(id: string): Promise<{ profile: Profile, events: Event[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Raw profile API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Get events for a profile
  async getEvents(profileId: string, includeProvenance: boolean = false): Promise<Event[]> {
    try {
      const url = `${API_BASE_URL}/profiles/${profileId}/events${includeProvenance ? '?includeProvenance=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      const data = await response.json();
      return data.events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Helper function to convert backend data to frontend format
  mapProfileData(profile: Profile, events: Event[]): {
    profile: {
      name: string;
      age?: number;
      nationality?: string;
      occupation: string[];
      bio: string;
      avatar?: string;
      birthYear?: number;
      location?: string;
    },
    timeline: {
      year: number;
      title: string;
      description: string;
      category: 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone';
      location?: string;
      details: string;
      sourceUrl?: string;
      sourceSnippet?: string;
    }[],
    sources: Source[]
  } {
    // Map profile data to the format expected by the frontend
    const mappedProfile = {
      name: profile.name,
      age: profile.birth_year ? new Date().getFullYear() - profile.birth_year : undefined,
      nationality: profile.nationality,
      occupation: profile.occupation ? profile.occupation.split(',').map(o => o.trim()) : [],
      bio: profile.summary || profile.bio || 'No biography available',
      avatar: profile.image_url || profile.hero_image_url,
      birthYear: profile.birth_year,
      location: profile.birth_place
    };

    // Map events to timeline format
    console.log('Mapping events from backend:', events);
    console.log('Number of events received:', events?.length || 0);
    console.log('Event structure:', events?.[0]);
    
    let timeline: Array<{
      year: number;
      title: string;
      description: string;
      category: 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone';
      location?: string;
      details: string;
      sourceUrl?: string;
      sourceSnippet?: string;
    }> = [];

    if (events && events.length > 0) {
      // Parse the long event text into timeline events
      timeline = events.flatMap(event => {
        if (event.event_text && event.event_text.length > 100) {
          // Parse long biography text into key timeline events
          const sentences = event.event_text.split(/[.!?]+/).filter(s => s.trim().length > 0);
          const yearRegex = /\b(18\d{2}|19\d{2}|20\d{2})\b/g;
          const timelineEvents: Array<{
            year: number;
            title: string;
            description: string;
            category: 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone';
            location?: string;
            details: string;
            sourceUrl?: string;
            sourceSnippet?: string;
          }> = [];
          
          let currentYear = profile.birth_year || 1879;
          let currentDescription = '';
          
          for (const sentence of sentences) {
            const yearMatch = sentence.match(yearRegex);
            if (yearMatch) {
              if (currentDescription) {
                timelineEvents.push({
                  year: currentYear,
                  title: currentDescription.substring(0, 50) + '...',
                  description: currentDescription,
                  category: mapEventCategory(event.categories || ['milestone']),
                  location: event.location,
                  details: currentDescription,
                  sourceUrl: event.source_url,
                  sourceSnippet: event.source_snippet
                });
              }
              currentYear = parseInt(yearMatch[0]);
              currentDescription = sentence.trim();
            } else if (sentence.trim().length > 10) {
              currentDescription += ' ' + sentence.trim();
            }
          }
          
          // Add the final event
          if (currentDescription) {
            timelineEvents.push({
              year: currentYear,
              title: currentDescription.substring(0, 50) + '...',
              description: currentDescription,
              category: mapEventCategory(event.categories || ['milestone']),
              location: event.location,
              details: currentDescription,
              sourceUrl: event.source_url,
              sourceSnippet: event.source_snippet
            });
          }
          
          return timelineEvents.length > 0 ? timelineEvents : [{
            year: new Date(event.date).getFullYear(),
            title: event.title || 'Key Event',
            description: event.event_text?.substring(0, 200) + '...' || 'No description',
            category: mapEventCategory(event.categories || ['milestone']),
            location: event.location,
            details: event.event_text || 'No additional details',
            sourceUrl: event.source_url,
            sourceSnippet: event.source_snippet
          }];
        } else {
          // Handle structured events
          return [{
            year: event.year || new Date(event.date).getFullYear(),
            title: event.title || event.event_text?.split('.')[0] || 'Event',
            description: event.description || event.event_text || 'No description available',
            category: mapEventCategory(event.categories || ['milestone']),
            location: event.location,
            details: event.description || event.event_text || event.source_snippet || 'No additional details available',
            sourceUrl: event.source_url,
            sourceSnippet: event.source_snippet
          }];
        }
      });
    } else {
      // Only add mock data if explicitly no events from backend
      console.log('No events from backend, adding minimal mock data');
      timeline = [
        {
          year: profile.birth_year || 1990,
          title: `Birth of ${profile.name}`,
          description: `${profile.name} was born`,
          category: 'birth' as const,
          location: profile.birth_place,
          details: `${profile.name} was born in ${profile.birth_place || 'unknown location'}`,
          sourceUrl: undefined,
          sourceSnippet: undefined
        }
      ];
    }
    
    console.log('Final timeline data:', timeline);

    // Create mock sources based on profile data
     // In a real implementation, you would fetch actual sources data
     const sources: Source[] = [
       {
         name: 'Wikipedia',
         url: `https://en.wikipedia.org/wiki/${encodeURIComponent(profile.name)}`,
         reliability: 'high',
         lastUpdated: new Date().toISOString(),
         icon: '📚',
         verified: true,
         dataPoints: timeline.length
       },
       {
         name: 'Neural Database',
         url: '#',
         reliability: 'medium',
         lastUpdated: new Date().toISOString(),
         icon: '🧠',
         verified: true,
         dataPoints: Math.floor(timeline.length * 1.5)
       }
     ];

    return {
      profile: mappedProfile,
      timeline,
      sources
    };
  }
};

// Helper function to map event categories from backend to frontend format
function mapEventCategory(categories: string[]): 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone' {
  if (!categories || categories.length === 0) {
    console.warn('No categories provided for event, defaulting to milestone');
    return 'milestone';
  }
  
  const category = categories[0]?.toLowerCase();
  
  if (category === 'birth') return 'birth';
  if (category === 'education') return 'education';
  if (category === 'career') return 'career';
  if (category === 'achievement') return 'achievement';
  if (category === 'personal') return 'personal';
  
  console.log('Unknown category:', category, 'using milestone');
  return 'milestone';
}