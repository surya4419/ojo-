import React, { useState } from 'react';
import { Calendar, ChevronRight, ExternalLink, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from './ui/dialog';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: 'birth' | 'education' | 'career' | 'achievement' | 'personal' | 'milestone';
  location?: string;
  details?: string;
  sourceUrl?: string;
  sourceSnippet?: string;
  provenance?: string;
  confidence?: number;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCategoryColor = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'birth': return 'text-blue-500 border-blue-500';
      case 'education': return 'text-green-500 border-green-500';
      case 'career': return 'text-purple-500 border-purple-500';
      case 'achievement': return 'text-yellow-500 border-yellow-500';
      case 'personal': return 'text-pink-500 border-pink-500';
      case 'milestone': return 'text-orange-500 border-orange-500';
      default: return 'text-primary border-primary';
    }
  };

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'birth': return '🎂';
      case 'education': return '🎓';
      case 'career': return '💼';
      case 'achievement': return '🏆';
      case 'personal': return '❤️';
      case 'milestone': return '⭐';
      default: return '📅';
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    console.log('Timeline event clicked:', event);
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2 neon-text terminal-font">NEURAL_TIMELINE</h3>
        <p className="text-muted-foreground text-sm terminal-font">chronological_data_visualization</p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10"></div>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground terminal-font">No timeline events available</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={index} className="relative mb-8">
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-6' : 'pl-6'}`}>
                    <div 
                      className="cyber-border rounded-lg p-4 hover:neon-glow transition-all duration-300 cursor-pointer group"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(event.category)}</span>
                        <span className={`text-sm font-semibold ${getCategoryColor(event.category).split(' ')[0]} terminal-font`}>
                          {event.year}
                        </span>
                        <ChevronRight className="w-3 h-3 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-semibold mb-1 text-foreground terminal-font text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground terminal-font">{event.description}</p>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                          <MapPin className="w-2 h-2" />
                          <span className="terminal-font">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-10">
                    <div className={`w-3 h-3 rounded-sm border bg-background ${getCategoryColor(event.category)} neon-glow`}></div>
                  </div>

                  {/* Year Badge */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pl-6' : 'pr-6 text-right'}`}>
                    <div className={`inline-block px-3 py-1 rounded-md cyber-border ${getCategoryColor(event.category)}`}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      <span className="text-sm terminal-font">{event.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground terminal-font">No timeline events available</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={index} className="relative pl-6">
              <div className="absolute left-0 top-0 w-px h-full bg-primary/30"></div>
              <div className={`absolute left-0 top-2 w-2 h-2 rounded-sm border bg-background -translate-x-1/2 ${getCategoryColor(event.category)}`}></div>
              
              <div 
                className="cyber-border p-3 rounded-lg hover:neon-glow transition-all duration-300 cursor-pointer group"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{getCategoryIcon(event.category)}</span>
                  <span className={`font-semibold text-sm ${getCategoryColor(event.category).split(' ')[0]} terminal-font`}>
                    {event.year}
                  </span>
                  <ChevronRight className="w-3 h-3 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-semibold mb-1 text-sm terminal-font">{event.title}</h4>
                <p className="text-xs text-muted-foreground terminal-font">{event.description}</p>
                {event.location && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <MapPin className="w-2 h-2" />
                    <span className="terminal-font">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Single Dialog for all events */}
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogPortal>
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0"
      onClick={handleClose}
    />
    <div
      className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-primary/30 backdrop-blur-sm p-6 shadow-lg duration-200"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0, 207, 255, 0.05) 0%, transparent 70%), #0A0F1C",
      }}
    >
      {selectedEvent && (
        <>
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-lg">
                {getCategoryIcon(selectedEvent.category)}
              </span>
              <span
                className={`${
                  getCategoryColor(selectedEvent.category).split(" ")[0]
                } neon-text terminal-font text-sm`}
              >
                {selectedEvent.year} - {selectedEvent.title}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-3">
            {selectedEvent.description && (
              <p className="text-muted-foreground text-sm terminal-font">
                {selectedEvent.description}
              </p>
            )}

            {selectedEvent.details && (
              <p className="text-xs terminal-font text-foreground">
                {selectedEvent.details}
              </p>
            )}

            {selectedEvent.location && (
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-3 h-3" />
                <span className="text-sm terminal-font">
                  {selectedEvent.location}
                </span>
              </div>
            )}

            {(selectedEvent.sourceUrl || selectedEvent.sourceSnippet) && (
              <div className="pt-3 border-t border-primary/20">
                {selectedEvent.sourceUrl && (
                  <a
                    href={selectedEvent.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-xs terminal-font"
                  >
                    <ExternalLink className="w-3 h-3" />
                    VIEW_SOURCE
                  </a>
                )}
                {selectedEvent.sourceSnippet && (
                  <p className="text-xs text-muted-foreground mt-2 terminal-font">
                    Source: {selectedEvent.sourceSnippet.substring(0, 100)}...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 text-primary hover:text-primary/80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </>
      )}
    </div>
  </DialogPortal>
</Dialog>


    </div>
  );
};

export default Timeline;