import { renderHook, act } from '@testing-library/react';
import { useEventsFilters } from '@/components/events/useEventsFilters';
import { Event } from '@/components/events/types';

const mockEvents: Event[] = [
  {
    id: '1',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: { id: 'tr-super', name: 'Süper Lig', country: 'Türkiye' },
    homeTeam: { id: 'gal', name: 'Galatasaray' },
    awayTeam: { id: 'fb', name: 'Fenerbahçe' },
    startTime: new Date().toISOString(),
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: false,
  },
  {
    id: '2',
    sport: { id: 'basketball', name: 'Basketbol', icon: '🏀' },
    league: { id: 'euroleague', name: 'EuroLeague', country: 'Avrupa' },
    homeTeam: { id: 'efes', name: 'Anadolu Efes' },
    awayTeam: { id: 'fener', name: 'Fenerbahçe Beko' },
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'scheduled',
    isLive: false,
    hasAIPredictions: false,
  },
  {
    id: '3',
    sport: { id: 'football', name: 'Futbol', icon: '⚽' },
    league: { id: 'eng-premier', name: 'Premier League', country: 'İngiltere' },
    homeTeam: { id: 'mci', name: 'Manchester City' },
    awayTeam: { id: 'ars', name: 'Arsenal' },
    startTime: new Date().toISOString(),
    status: 'live',
    isLive: true,
    minute: 45,
    hasAIPredictions: false,
  }
];

describe('useEventsFilters', () => {
  it('extracts unique leagues from events', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    expect(result.current.availableLeagues).toHaveLength(3);
    expect(result.current.availableLeagues.map(l => l.id)).toContain('tr-super');
    expect(result.current.availableLeagues.map(l => l.id)).toContain('euroleague');
    expect(result.current.availableLeagues.map(l => l.id)).toContain('eng-premier');
  });

  it('filters events by selected leagues', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    act(() => {
      result.current.setSelectedLeagues(['tr-super']);
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].id).toBe('1');
  });

  it('filters live events only', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    act(() => {
      result.current.setShowLiveOnly(true);
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].id).toBe('3');
    expect(result.current.filteredEvents[0].isLive).toBe(true);
  });

  it('filters by time range - today', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    act(() => {
      result.current.setSelectedTimeRange('today');
    });

    // Should include events 1 and 3 (today), but not 2 (tomorrow)
    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents.map(e => e.id)).toContain('1');
    expect(result.current.filteredEvents.map(e => e.id)).toContain('3');
  });

  it('filters by search query', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    act(() => {
      result.current.setSearchQuery('galatasaray');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].homeTeam.name).toBe('Galatasaray');
  });

  it('combines multiple filters', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    act(() => {
      result.current.setSelectedLeagues(['tr-super', 'eng-premier']);
      result.current.setShowLiveOnly(true);
    });

    // Only live event in selected leagues
    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].id).toBe('3');
  });

  it('resets all filters', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    // Set some filters
    act(() => {
      result.current.setSelectedLeagues(['tr-super']);
      result.current.setShowLiveOnly(true);
      result.current.setSearchQuery('test');
      result.current.setSelectedTimeRange('today');
    });

    // Reset
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.selectedLeagues).toEqual([]);
    expect(result.current.showLiveOnly).toBe(false);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedTimeRange).toBe('all');
    expect(result.current.filteredEvents).toHaveLength(3);
  });

  it('detects active filters', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.setSelectedLeagues(['tr-super']);
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('searches in team names, league names, and sport names', () => {
    const { result } = renderHook(() => useEventsFilters(mockEvents));

    // Search by away team
    act(() => {
      result.current.setSearchQuery('arsenal');
    });
    expect(result.current.filteredEvents).toHaveLength(1);

    // Search by league
    act(() => {
      result.current.setSearchQuery('euro');
    });
    expect(result.current.filteredEvents).toHaveLength(1);

    // Search by sport
    act(() => {
      result.current.setSearchQuery('basketbol');
    });
    expect(result.current.filteredEvents).toHaveLength(1);
  });
});