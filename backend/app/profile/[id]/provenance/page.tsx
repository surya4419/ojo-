"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TimelineEvent, Profile, Provenance } from '@/types';
import { ArrowLeft, ExternalLink, Clock, Shield, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProvenancePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, eventsResponse] = await Promise.all([
          fetch(`/api/profiles/${params.id}`),
          fetch(`/api/profiles/${params.id}/events?includeProvenance=true`)
        ]);

        const profileData = await profileResponse.json();
        const eventsData = await eventsResponse.json();

        setProfile(profileData);
        setEvents(eventsData.events || []);
      } catch (error) {
        console.error('Error fetching provenance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const filteredEvents = events.filter(event =>
    event.event_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.source_snippet && event.source_snippet.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading provenance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          {profile?.id && (
            <a
              href={`/profile/${profile.id}`}
              className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
            >
              Back to profile
            </a>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{profile?.name} Sources</h1>
            <p className="text-gray-400">Verify data sources and provenance</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events and sources..."
              className="w-full pl-10 pr-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Events', value: events.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Verified Sources', value: events.filter(e => e.source_url).length, color: 'from-green-500 to-emerald-500' },
            { label: 'Avg Confidence', value: `${Math.round(events.reduce((acc, e) => acc + e.confidence, 0) / events.length * 100)}%`, color: 'from-purple-500 to-violet-500' },
            { label: 'Unique Domains', value: [...new Set(events.map(e => e.source_url ? new URL(e.source_url).hostname : '').filter(Boolean))].length, color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <div key={index} className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 rounded-2xl blur-xl`} />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Events with provenance */}
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-blue-400">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        {event.categories.slice(0, 3).map((category) => (
                          <span key={category} className="px-2 py-1 text-xs bg-white/10 text-white rounded-full capitalize">
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-gray-400">
                          {Math.round(event.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-4">{event.event_text}</h3>
                  </div>
                </div>

                {/* Source information */}
                <div className="space-y-4">
                  {event.source_snippet && (
                    <div className="bg-black/60 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Source Context
                      </h4>
                      <p className="text-sm text-gray-300 italic leading-relaxed">
                        "{event.source_snippet}"
                      </p>
                    </div>
                  )}

                  {event.source_url && (
                    <div className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm border border-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Verified Source</div>
                          <div className="text-xs text-gray-400">
                            {new URL(event.source_url).hostname}
                          </div>
                        </div>
                      </div>
                      <a
                        href={event.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                      >
                        View Source
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No matching results</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or clear the search to view all events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}