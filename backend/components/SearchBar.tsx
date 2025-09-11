"use client";

import { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-blue-400/50 transition-colors duration-300" />
          <div className="relative flex items-center">
            <Search className="absolute left-6 w-6 h-6 text-blue-400 z-10" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any public figure..."
              className="w-full pl-16 pr-20 py-6 text-lg text-white placeholder-gray-400 bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-0 relative z-10"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={cn(
                "absolute right-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 z-10",
                isLoading || !query.trim()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Researching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Research</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}