"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TimelineEvent, Profile } from '@/types';
import { TimelineNode } from '@/components/TimelineNode';
import { ArrowLeft, Filter, Calendar, Award, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelinePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, eventsResponse] = await Promise.all([
          fetch(`/api/profiles/${params.id}`),
          fetch(`/api/profiles/${params.id}/events`)
        ]);

        const profileData = await profileResponse.json();
        const eventsData = await eventsResponse.json();

        setProfile(profileData);
        setEvents(eventsData.events || []);
        setFilteredEvents(eventsData.events || []);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(event => 
          event.categories.some(cat => selectedCategories.includes(cat))
        )
      );
    }
  }, [events, selectedCategories]);

  const allCategories = [...new Set(events.flatMap(event => event.categories))];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categoryIcons: Record<string, any> = {
    birth: Calendar,
    education: GraduationCap,
    career: Briefcase,
    award: Award,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading timeline...</p>
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
            <h1 className="text-3xl font-bold text-white">{profile?.name} Timeline</h1>
            <p className="text-gray-400">Chronological life events and milestones</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {allCategories.map((category) => {
                  const Icon = categoryIcons[category] || Award;
                  const isSelected = selectedCategories.includes(category);
                  
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600 text-white border border-blue-500'
                          : 'bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{category}</span>
                      <span className="text-xs opacity-75">
                        ({events.filter(e => e.categories.includes(category)).length})
                      </span>
                    </button>
                  );
                })}
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {filteredEvents.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {filteredEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event, index) => (
                  <TimelineNode key={event.id} event={event} index={index} />
                ))}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No events match your filters</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Try adjusting your category filters to see more events.
            </p>
            <button
              onClick={() => setSelectedCategories([])}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}