import React, { useState, useEffect } from 'react';
import BackgroundParticles from './components/background';
import SearchHero from './components/search-hero';
import ProfilePage from './components/profile-page';
import { mockProfiles, mockTimelines, mockSources, generatePlaceholderData } from './data/mock-data';
import { api, Profile, Event, API_BASE_URL } from './utils/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'search' | 'profile'>('search');
  const [currentQuery, setCurrentQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    profile: any;
    timeline: any[];
    sources: any[];
  } | null>(null);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setIsSearching(true);
    
    try {
      console.log('Starting search for:', query);
      const searchResult = await api.searchProfiles(query);
      console.log('Search result:', searchResult);
      
      if (searchResult.profiles && searchResult.profiles.length > 0) {
        console.log('Found profiles:', searchResult.profiles.length);
        const profileId = searchResult.profiles[0].id;
        setCurrentProfileId(profileId);
        
        const profileResult = await api.getProfile(profileId);
        console.log('Backend profile data:', profileResult);
        console.log('Backend events:', profileResult.events);
        
        const mappedData = api.mapProfileData(profileResult.profile, profileResult.events);
        console.log('Mapped timeline data:', mappedData.timeline);
        setProfileData(mappedData);
        setCurrentView('profile');
      } else if (searchResult.candidates && searchResult.candidates.length > 0) {
        console.log('Found candidates:', searchResult.candidates.length);
        const candidate = searchResult.candidates[0];
        
        try {
          const createResponse = await fetch(`${API_BASE_URL}/profiles/create-from-wikipedia`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: candidate.name,
              source_type: candidate.source_type || 'wikipedia'
            })
          });
          
          if (createResponse.ok) {
            const createResult = await createResponse.json();
            console.log('Create result:', createResult);
            
            if (createResult.profile) {
              setCurrentProfileId(createResult.profile.id);
              const mappedData = api.mapProfileData(createResult.profile, createResult.events || []);
              setProfileData(mappedData);
            } else {
              const candidateResult = await api.searchProfiles(candidate.name);
              
              if (candidateResult.profiles && candidateResult.profiles.length > 0) {
                const profileId = candidateResult.profiles[0].id;
                setCurrentProfileId(profileId);
                
                const profileResult = await api.getProfile(profileId);
                const mappedData = api.mapProfileData(profileResult.profile, profileResult.events);
                setProfileData(mappedData);
              } else {
                const data = getData();
                if (data) setProfileData(data);
              }
            }
          } else {
            const data = getData();
            if (data) setProfileData(data);
          }
        } catch (candidateError) {
          console.error('Error creating profile from candidate:', candidateError);
          const data = getData();
          if (data) setProfileData(data);
        }
        
        setCurrentView('profile');
      } else {
        console.log('No profiles or candidates found, using mock data');
        const data = getData();
        if (data) setProfileData(data);
        
        setCurrentView('profile');
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
      
      const data = getData();
      if (data) setProfileData(data);
      
      setCurrentView('profile');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setCurrentView('search');
    setCurrentQuery('');
    setCurrentProfileId(null);
    setProfileData(null);
  };

  // Get mock data for current query or use placeholder (fallback when API fails)
  const getData = () => {
    if (!currentQuery) return null;
    
    if (mockProfiles[currentQuery]) {
      return {
        profile: mockProfiles[currentQuery],
        timeline: mockTimelines[currentQuery] || [],
        sources: mockSources[currentQuery] || []
      };
    } else {
      return generatePlaceholderData(currentQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <BackgroundParticles />
      
      <div className="relative z-10">
        {/* Search View */}
        {currentView === 'search' && (
          <SearchHero onSearch={handleSearch} currentQuery="" isSearching={isSearching} />
        )}
        
        {/* Loading State - Only show for profile loading, not search */}
        {isSearching && currentView === 'profile' && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-sm animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border border-primary/40 rounded-sm mx-auto animate-pulse"></div>
              </div>
              <p className="text-lg text-primary animate-pulse terminal-font mb-2">
                NEURAL_SCAN_IN_PROGRESS
              </p>
              <p className="text-sm text-primary/60 terminal-font">
                analyzing_data_for: {currentQuery}
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-primary/40 animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Profile View */}
        {currentView === 'profile' && profileData && (
          <ProfilePage 
            profile={profileData.profile}
            timeline={profileData.timeline}
            sources={profileData.sources}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}