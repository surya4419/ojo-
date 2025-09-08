"use client";

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ProfileCard } from '@/components/ProfileCard';
import { Profile, Candidate } from '@/types';
import { Brain, Zap, Globe, Shield } from 'lucide-react';

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchMessage('');
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.profiles || []);
      setCandidates(data.candidates || []);
      setSearchMessage(data.message || '');
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchMessage('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCandidate = async (cand: Candidate) => {
    try {
      setIsLoading(true);
      const resp = await fetch('/api/profiles/create-from-wikipedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: cand.name,
          source_type: (cand as any).source_type || 'wikipedia'
        })
      });
      const data = await resp.json();
      if (data?.profile?.id) {
        window.location.href = `/profile/${data.profile.id}`;
      }
    } catch (e) {
      console.error('Candidate confirmation failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              BioScopeAgent
            </h1>
          </div>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            Intelligent biography research powered by AI. Search for any public figure and we'll instantly research, analyze, and create a comprehensive profile with verified timeline data.
          </p>
        </header>

        {/* Search section */}
        <section className="container mx-auto px-4 py-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Results section */}
        {hasSearched && (
          <section className="container mx-auto px-4 pb-12">
            {candidates.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-8">Select a person</h2>
                <div className="grid gap-4">
                  {candidates.map((c) => (
                    <div key={c.source_url} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl blur-xl group-hover:blur-none transition-all duration-500" />
                      <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                            <span className="text-xs text-gray-400">Score: {Math.round(c.similarity_score*100)}%</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              c.source_type === 'wikipedia' ? 'bg-blue-600/20 text-blue-400' :
                              c.source_type === 'facebook' ? 'bg-blue-500/20 text-blue-300' :
                              c.source_type === 'youtube' ? 'bg-red-600/20 text-red-400' :
                              c.source_type === 'linkedin' ? 'bg-blue-700/20 text-blue-200' :
                              c.source_type === 'github' ? 'bg-gray-600/20 text-gray-300' :
                              c.source_type === 'geeksforgeeks' ? 'bg-green-600/20 text-green-400' :
                              c.source_type === 'twitter' ? 'bg-sky-500/20 text-sky-300' :
                              c.source_type === 'instagram' ? 'bg-pink-600/20 text-pink-400' :
                              c.source_type === 'education' ? 'bg-purple-600/20 text-purple-400' :
                              c.source_type === 'medium' ? 'bg-green-500/20 text-green-300' :
                              c.source_type === 'devto' ? 'bg-black/20 text-white' :
                              c.source_type === 'stackoverflow' ? 'bg-orange-600/20 text-orange-400' :
                              c.source_type === 'quora' ? 'bg-red-500/20 text-red-300' :
                              c.source_type === 'behance' ? 'bg-blue-400/20 text-blue-200' :
                              c.source_type === 'dribbble' ? 'bg-pink-500/20 text-pink-300' :
                              c.source_type === 'aboutme' ? 'bg-indigo-600/20 text-indigo-400' :
                              'bg-gray-600/20 text-gray-400'
                            }`}>
                              {c.source_type}
                            </span>
                            {c.verified && <span className="text-xs text-green-400">✓ Verified</span>}
                          </div>
                          <p className="text-gray-300 text-sm mt-2 line-clamp-2">{c.snippet}</p>
                          <a href={c.source_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">View source</a>
                        </div>
                        <button
                          onClick={() => confirmCandidate(c)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium"
                          disabled={isLoading}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Found {searchResults.length} profile{searchResults.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid gap-6">
                  {searchResults.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try searching for a different public figure or check your spelling.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Features section */}
        {!hasSearched && (
          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "AI-Powered Analysis",
                  description: "Instantly researches any public figure using Gemini AI, creating comprehensive profiles with verified facts and sources."
                },
                {
                  icon: Globe,
                  title: "Dynamic Data Creation",
                  description: "Automatically fetches and structures biographical data, creating interactive timelines with categorized life events."
                },
                {
                  icon: Shield,
                  title: "Vector Search & Storage",
                  description: "Stores data with vector embeddings in TiDB for semantic search and intelligent event categorization."
                }
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-none transition-all duration-500" />
                  <div className="relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/30 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}