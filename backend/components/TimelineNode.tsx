"use client";

import { useState } from 'react';
import { TimelineEvent } from '@/types';
import { Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineNodeProps {
  event: TimelineEvent;
  index: number;
}

const categoryColors: Record<string, string> = {
  birth: 'from-green-500 to-emerald-600',
  education: 'from-blue-500 to-cyan-600',
  career: 'from-purple-500 to-violet-600',
  award: 'from-yellow-500 to-amber-600',
  achievement: 'from-red-500 to-rose-600',
  role: 'from-indigo-500 to-purple-600',
  default: 'from-gray-500 to-slate-600',
};

export function TimelineNode({ event, index }: TimelineNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const primaryCategory = event.categories[0] || 'default';
  const colorClass = categoryColors[primaryCategory] || categoryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}
    >
      {/* Timeline line connector */}
      <div className="absolute top-6 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-600 left-1/2 transform -translate-x-1/2" />
      
      {/* Timeline node */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colorClass} border-4 border-black/80 shadow-lg`} />
      </div>

      {/* Content card */}
      <div className={`relative ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
        <div className="group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-mono text-blue-400">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <div className="flex gap-1 ml-auto">
                  {event.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs font-medium bg-white/10 text-white rounded-full capitalize"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {event.event_text}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400">
                    Confidence: {Math.round(event.confidence * 100)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-gray-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="text-xs">Details</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="bg-black/60 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                {event.source_snippet && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Source Context:</h4>
                    <p className="text-sm text-gray-400 italic leading-relaxed">
                      "{event.source_snippet}"
                    </p>
                  </div>
                )}
                
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Original Source
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}