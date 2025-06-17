"use client";

import { useMemo, useState } from 'react';
import { AlertCircle, Grid3X3, List, Loader2 } from 'lucide-react';
import { EventsProps } from './types';
import { EventsList } from './EventsList';
import { EventsGrid } from './EventsGrid';
import { EventsFilters } from './EventsFilters';
import { EventsEmpty } from './EventsEmpty';
import { EventsSkeleton } from './EventsSkeleton';
import { useEventsFilters } from './useEventsFilters';
import { useEvents } from './useEvents';
import { Button } from '../ui/Button';

export function Events({
  events: providedEvents = [],
  fetchFromAPI = false,
  apiEndpoint = '/api/events',
  selectedSports = [],
  selectedLeagues: initialLeagues = [],
  selectedTimeRange: initialTimeRange = 'all',
  showLiveOnly: initialLiveOnly = false,
  variant: initialVariant = 'list',
  showOdds = true,
  showLeague = true,
  showTime = true,
  showStats = false,
  showPredictions = true,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 'normal',
  maxItems,
  onEventClick,
  onOddsClick,
  loading: providedLoading = false,
  error: providedError = null,
  onRetry,
  className = '',
  emptyMessage = 'Maç bulunamadı',
  showFilters: providedShowFilters,
}: EventsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialVariant === 'grid' ? 'grid' : 'list');

  // Use data fetching hook if needed
  const {
    events: fetchedEvents,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useEvents({
    fetchFromAPI,
    apiEndpoint,
    sports: selectedSports,
    initialData: providedEvents,
  });

  // Determine which data to use
  const events = fetchFromAPI ? fetchedEvents : providedEvents;
  const loading = fetchFromAPI ? fetchLoading : providedLoading;
  const error = fetchFromAPI ? fetchError : providedError;

  // Filter events by selected sports first
  const sportsFilteredEvents = useMemo(() => {
    if (selectedSports.length === 0 || selectedSports.includes('all')) {
      return events;
    }
    return events.filter(event => selectedSports.includes(event.sport.id));
  }, [events, selectedSports]);

  // Use filters hook
  const {
    selectedLeagues,
    selectedTimeRange,
    showLiveOnly,
    availableLeagues,
    filteredEvents,
    setSelectedLeagues,
    setSelectedTimeRange,
    setShowLiveOnly,
    setSearchQuery,
    hasActiveFilters,
  } = useEventsFilters(sportsFilteredEvents);

  // Initialize filter states
  useMemo(() => {
    if (initialLeagues.length > 0) setSelectedLeagues(initialLeagues);
    if (initialTimeRange !== 'all') setSelectedTimeRange(initialTimeRange);
    if (initialLiveOnly) setShowLiveOnly(initialLiveOnly);
  }, [initialLeagues, initialTimeRange, initialLiveOnly, setSelectedLeagues, setSelectedTimeRange, setShowLiveOnly]);

  // Apply max items limit
  const displayEvents = maxItems ? filteredEvents.slice(0, maxItems) : filteredEvents;

  // Group events by date (currently unused but kept for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof displayEvents> = {};
    
    displayEvents.forEach(event => {
      const date = new Date(event.startTime);
      const dateKey = date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    // Sort groups by date
    return Object.entries(groups).sort(([dateA], [dateB]) => {
      const a = new Date(displayEvents.find(e => 
        new Date(e.startTime).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) === dateA
      )?.startTime || '');
      const b = new Date(displayEvents.find(e => 
        new Date(e.startTime).toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) === dateB
      )?.startTime || '');
      return a.getTime() - b.getTime();
    });
  }, [displayEvents]);

  const handleRefresh = () => {
    if (fetchFromAPI) {
      refetch();
    } else {
      onRetry?.();
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <EventsSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {typeof error === 'string' ? error : error.message}
        </p>
        {(fetchFromAPI || onRetry) && (
          <Button
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            leftIcon={<Loader2 className="w-4 h-4" />}
          >
            Tekrar Dene
          </Button>
        )}
      </div>
    );
  }

  const showFilters = providedShowFilters !== undefined ? providedShowFilters : (initialVariant !== 'list' || fetchFromAPI);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters - only show if not in simple list mode */}
      {showFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Maçlar
            </h3>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="xs"
                leftIcon={<List className="w-3 h-3" />}
              >
                Liste
              </Button>
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="xs"
                leftIcon={<Grid3X3 className="w-3 h-3" />}
              >
                Izgara
              </Button>
            </div>
          </div>

          <EventsFilters
            selectedLeagues={selectedLeagues}
            selectedTimeRange={selectedTimeRange}
            showLiveOnly={showLiveOnly}
            availableLeagues={availableLeagues}
            onLeaguesChange={setSelectedLeagues}
            onTimeRangeChange={setSelectedTimeRange}
            onLiveOnlyChange={setShowLiveOnly}
            onSearch={setSearchQuery}
          />
        </div>
      )}

      {/* Events Display */}
      {displayEvents.length === 0 ? (
        <EventsEmpty
          message={hasActiveFilters ? 'Filtrelere uygun maç bulunamadı' : emptyMessage}
          showRefresh={fetchFromAPI || !!onRetry}
          onRefresh={handleRefresh}
        />
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <EventsGrid
              events={displayEvents}
              onEventClick={onEventClick}
              onOddsClick={onOddsClick}
              showOdds={showOdds}
              showPredictions={showPredictions}
              showLeague={showLeague}
              showTime={showTime}
              showStats={showStats}
              columns={columns}
              spacing={spacing}
            />
          ) : (
            <EventsList
              events={displayEvents}
              onEventClick={onEventClick}
              onOddsClick={onOddsClick}
              showOdds={showOdds}
              showPredictions={showPredictions}
              showLeague={showLeague}
              showTime={showTime}
              showStats={showStats}
              variant={initialVariant === 'compact' ? 'compact' : 'default'}
              spacing={spacing}
            />
          )}
          
          {maxItems && filteredEvents.length > maxItems && (
            <div className="text-center mt-6">
              <Button variant="secondary" size="sm">
                Daha fazla göster ({filteredEvents.length - maxItems} maç daha)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}