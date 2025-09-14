import React from 'react';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Briefcase, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="cyber-border rounded-lg p-6 neon-glow hover:neon-glow transition-all duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden cyber-border neon-glow">
            <ImageWithFallback
              src={profile.avatar || `/api/placeholder/150/150`}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-background rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 neon-text terminal-font">
            {profile.name}
          </h2>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 justify-center md:justify-start mb-4">
            {profile.occupation.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs terminal-font"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {profile.age && (
              <div className="cyber-border p-2 rounded-md text-center">
                <Calendar className="w-3 h-3 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold text-primary terminal-font">{profile.age}</div>
                <div className="text-xs text-muted-foreground terminal-font">AGE</div>
              </div>
            )}
            
            {profile.nationality && (
              <div className="cyber-border p-2 rounded-md text-center">
                <Globe className="w-3 h-3 text-primary mx-auto mb-1" />
                <div className="text-xs font-semibold text-primary terminal-font">{profile.nationality}</div>
                <div className="text-xs text-muted-foreground terminal-font">NAT</div>
              </div>
            )}
            
            {profile.location && (
              <div className="cyber-border p-2 rounded-md text-center">
                <MapPin className="w-3 h-3 text-primary mx-auto mb-1" />
                <div className="text-xs font-semibold text-primary terminal-font">{profile.location}</div>
                <div className="text-xs text-muted-foreground terminal-font">LOC</div>
              </div>
            )}
            
            <div className="cyber-border p-2 rounded-md text-center">
              <Briefcase className="w-3 h-3 text-primary mx-auto mb-1" />
              <div className="text-sm font-semibold text-primary terminal-font">{profile.occupation.length}</div>
              <div className="text-xs text-muted-foreground terminal-font">ROLES</div>
            </div>
          </div>
          
          {/* Bio */}
          <p className="text-muted-foreground leading-relaxed text-sm terminal-font">
            {profile.bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;