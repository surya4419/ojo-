"use client";

import { Profile } from '@/types';
import { User, Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-none transition-all duration-500" />
      <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            {profile.hero_image_url ? (
              <img
                src={profile.hero_image_url}
                alt={profile.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {profile.name}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {profile.summary}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Added {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Link
              href={`/profile/${profile.id}/timeline`}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors duration-200"
            >
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </Link>
            <Link
              href={`/profile/${profile.id}/provenance`}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Provenance</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}