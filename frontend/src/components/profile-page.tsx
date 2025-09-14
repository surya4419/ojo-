import React from 'react';
import { ArrowLeft, Terminal, Database, Shield } from 'lucide-react';
import ProfileCard from './profile-card';
import Timeline from './timeline';
import SourcesPanel from './sources-panel';

interface ProfileData {
  name: string;
  age?: number;
  nationality?: string;
  occupation: string[];
  bio: string;
  avatar?: string;
  birthYear?: number;
  location?: string;
}

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone';
  location?: string;
  details?: string;
  sourceUrl?: string;
  sourceSnippet?: string;
}

interface Source {
  name: string;
  url: string;
  reliability: 'high' | 'medium' | 'low';
  lastUpdated: string;
  icon: string;
  verified: boolean;
  dataPoints: number;
}

interface ProfilePageProps {
  profile: ProfileData;
  timeline: TimelineEvent[];
  sources: Source[];
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, timeline, sources, onBack }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Terminal Header */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-black/80 border-b border-primary/30 flex items-center px-4 z-50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-primary/70 terminal-font">ojo://neural-scan/{profile.name.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-8 px-6 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors terminal-font"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK_TO_SEARCH</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Neural scan header */}
        <div className="cyber-border rounded-lg p-4 mb-6 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="terminal-font text-sm">NEURAL_SCAN_COMPLETE</span>
            </div>
            <div className="flex items-center gap-4 text-xs terminal-font text-primary/60">
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>{timeline.length} EVENTS</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{sources.length} SOURCES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-8">
          <ProfileCard profile={profile} />
        </div>
        
        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-3">
            <Timeline events={timeline} />
          </div>
          
          {/* Sources Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-12">
              <SourcesPanel sources={sources} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;