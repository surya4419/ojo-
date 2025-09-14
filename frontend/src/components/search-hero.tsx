import React, { useState, useEffect } from 'react';
import { Search, User, Sparkles } from 'lucide-react';
import { Input } from './ui/input';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  currentQuery: string;
  isSearching?: boolean;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, currentQuery, isSearching = false }) => {
  const [query, setQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const popularPeople = [
    'Elon Musk',
    'Steve Jobs',
    'Bill Gates',
    'Mark Zuckerberg',
    'Jeff Bezos',
    'Satya Nadella',
    'Sundar Pichai',
    'Tim Cook',
    'Jensen Huang',
    'Sam Altman',
    'Dharmateja Kadem',
    'Albert Einstein',
    'Marie Curie',
    'Ada Lovelace',
    'Alan Turing'
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = popularPeople.filter(person =>
        person.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setIsTyping(false);
    onSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      setIsTyping(false);
      onSearch(query);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Terminal Header */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-black/80 border-b border-primary/30 flex items-center px-4 z-50">
        <div className="flex gap-2">
         
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-primary/70 terminal-font">ojo://neural-interface</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="text-center mb-8 z-10 mt-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 cyber-border rounded-lg flex items-center justify-center neon-glow">
            <User className="w-6 h-6 text-primary neon-text" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3 text-primary tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0, 207, 255, 0.8)' }}>
          ojo
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-2 terminal-font">
          neural biography mapping system
        </p>
        <div className="flex items-center justify-center gap-2 text-primary/60">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs terminal-font">AI.NEURAL.NET.ACTIVE</span>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="w-full max-w-xl relative z-10">
        <div className="relative">
          <div 
  className="absolute left-3 z-20 transition-all duration-300"
  style={{
    top: isTyping || isSearching ? '25%' : '50%',
    transform: 'translateY(-50%)'
  }}
>
            <Search className="w-4 h-4 text-primary" />
          </div>
          <Input
            type="text"
            placeholder="> search_neural_database --target [name]"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="h-12 pl-10 pr-4 text-sm cyber-border terminal-font focus:neon-glow transition-all duration-300"
            disabled={isSearching}
          />
          
          {/* Auto-suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 cyber-border rounded-md overflow-hidden z-30">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors duration-200 flex items-center gap-2 terminal-font text-sm"
                >
                  <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                  <span className="text-foreground">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Quick access chips */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {popularPeople.slice(0, 5).map((person) => (
            <button
              key={person}
              onClick={() => handleSuggestionClick(person)}
              disabled={isSearching}
              className="px-3 py-1 cyber-border rounded-md text-xs terminal-font hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {person}
            </button>
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-8 flex items-center gap-2 text-xs text-primary/60 terminal-font">
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        <span>SYSTEM.STATUS: ONLINE</span>
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        <span>READY.FOR.NEURAL.SCAN</span>
      </div>

      {/* Loading indicator - placed immediately below the status text */}
      {isSearching && (
        <div className="mt-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-sm animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border border-primary/40 rounded-sm animate-pulse"></div>
          </div>
          <p className="text-sm text-primary animate-pulse terminal-font mt-2">
            NEURAL_SCAN_IN_PROGRESS
          </p>
          <p className="text-xs text-primary/60 terminal-font mt-1">
            analyzing_data_for: {query}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchHero;