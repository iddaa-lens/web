import { useState, useCallback, useMemo } from 'react';
import { Event, TimeRange, League } from './types';

export function useEventsFilters(events: Event[]) {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('all');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique leagues from events
  const availableLeagues = useMemo((): League[] => {
    const leagueMap = new Map<string, League>();
    events.forEach(event => {
      if (!leagueMap.has(event.league.id)) {
        leagueMap.set(event.league.id, event.league);
      }
    });
    return Array.from(leagueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [events]);

  // Filter events based on all criteria
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // League filter
    if (selectedLeagues.length > 0) {
      filtered = filtered.filter(event => selectedLeagues.includes(event.league.id));
    }

    // Live only filter
    if (showLiveOnly) {
      filtered = filtered.filter(event => event.isLive);
    }

    // Time range filter
    if (selectedTimeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startTime);
        
        switch (selectedTimeRange) {
          case 'today':
            return eventDate >= today && eventDate < tomorrow;
          case 'tomorrow':
            return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case 'thisWeek':
            return eventDate >= today && eventDate < nextWeek;
          case 'nextWeek':
            const weekAfterNext = new Date(nextWeek);
            weekAfterNext.setDate(weekAfterNext.getDate() + 7);
            return eventDate >= nextWeek && eventDate < weekAfterNext;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.homeTeam.name.toLowerCase().includes(query) ||
        event.awayTeam.name.toLowerCase().includes(query) ||
        event.league.name.toLowerCase().includes(query) ||
        event.sport.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, selectedLeagues, selectedTimeRange, showLiveOnly, searchQuery]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedLeagues([]);
    setSelectedTimeRange('all');
    setShowLiveOnly(false);
    setSearchQuery('');
  }, []);

  return {
    // Filter states
    selectedLeagues,
    selectedTimeRange,
    showLiveOnly,
    searchQuery,
    availableLeagues,
    
    // Filtered results
    filteredEvents,
    
    // Filter setters
    setSelectedLeagues,
    setSelectedTimeRange,
    setShowLiveOnly,
    setSearchQuery,
    
    // Utils
    resetFilters,
    hasActiveFilters: selectedLeagues.length > 0 || selectedTimeRange !== 'all' || showLiveOnly || searchQuery !== '',
  };
}