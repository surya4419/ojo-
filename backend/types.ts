export interface Profile {
  id: string;
  name: string;
  summary: string;
  hero_image_url?: string;
  aiSummary?: string;
  source?: string;
  source_url?: string;
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  occupation?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  event_text: string;
  date: string;
  categories: string[];
  confidence: number;
  source?: string;
  source_url?: string;
  source_snippet?: string;
  provenance?: Provenance[];
}

export interface TimelineEvent extends Event {
  type: 'event' | 'milestone';
  importance: 'high' | 'medium' | 'low';
  source_snippet?: string;
}

export interface Provenance {
  id: string;
  source: string;
  source_url: string;
  confidence: number;
  extracted_at: string;
  event_id?: string;
}

export interface Candidate {
  name: string;
  descriptor: string;
  source_url: string;
  snippet: string;
  similarity_score: number;
  source_type?: string;
  verified?: boolean;
}

export interface ProfileResponse {
  profile: Profile | null;
  events: Event[];
}

export interface ReportData {
  profile: Profile;
  events: Event[];
  generatedAt: string;
  statistics: {
    totalEvents: number;
    categories: string[];
    avgConfidence: number;
    dateRange?: {
      earliest: string;
      latest: string;
    };
  };
}