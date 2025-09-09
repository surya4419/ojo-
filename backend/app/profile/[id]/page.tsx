// app/profile/[id]/page.tsx

import { Profile, Event } from '@/types';
import { ArrowLeft, Clock, FileText, User, Calendar, MapPin, Award } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';
import DownloadProfilePDFClient from '@/components/DownloadProfilePDFClient';

// Fetch data server-side
export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hdrs = await headers();
  const host = hdrs.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = host ? `${protocol}://${host}` : '';
  const response = await fetch(`${baseUrl}/api/profiles/${id}`, { cache: 'no-store' });
  const { profile, events }: { profile: Profile | null; events: Event[] } = await response.json();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to search
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar },
    {
      label: 'Categories',
      value: Array.from(new Set(events.flatMap((e) => e.categories))).length,
      icon: Award,
    },
    {
      label: 'Avg Confidence',
      value: `${Math.round(events.reduce((acc, e) => acc + e.confidence, 0) / (events.length || 1) * 100)}%`,
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to search
        </Link>

        {/* Profile header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />
          <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                {profile.hero_image_url ? (
                  <img
                    src={profile.hero_image_url}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold text-white mb-4">{profile.name}</h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{profile.summary}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href={`/profile/${profile.id}/timeline`}
            className="group relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Clock className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Timeline</h3>
            <p className="text-gray-400">View all chronological life events</p>
          </Link>

          <Link
            href={`/profile/${profile.id}/provenance`}
            className="group relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <FileText className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Provenance</h3>
            <p className="text-gray-400">Verify sources and data transparency</p>
          </Link>          <DownloadProfilePDFClient profileId={profile.id} profileName={profile.name} />
        </div>

        {/* Recent events preview */}
        {events.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Event Preview</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-blue-400">
                          {new Date(event.date as string).getFullYear()}
                        </span>
                        <div className="flex gap-1">
                          {event.categories.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="px-2 py-0.5 text-xs bg-white/10 text-white rounded-full capitalize"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-white font-medium truncate">{event.event_text}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(event.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mt-4">See full details and filters on the Timeline page.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}