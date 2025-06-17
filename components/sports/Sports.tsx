"use client";

import { useMemo, useCallback } from 'react';
import { SportsProps, defaultSports } from './types';
import { SportButton } from './SportButton';
import { SportsSkeleton } from './SportsSkeleton';
import { useSports } from './useSports';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function Sports({
  variant = 'grid',
  sports: propsSports,
  selectedSports = [],
  onSportsSelect,
  showCounts = true,
  showPredictions = false,
  showHotBadge = true,
  showAllOption = true,
  allOptionLabel = 'Tümü',
  columns = { sm: 2, md: 3, lg: 4 },
  spacing = 'normal',
  filterByPopular = false,
  filterByMinCount,
  customFilter,
  className = '',
  buttonClassName = '',
  loading: propsLoading,
  error: propsError,
  onRetry,
  emptyMessage = 'Spor bulunamadı',
}: SportsProps) {
  // Use props data if provided, otherwise use default
  const { sports: hookSports, loading: hookLoading, error: hookError, refetch } = useSports({
    fetchFromAPI: false, // Will be changed when backend is ready
    initialData: propsSports || defaultSports,
  });

  const sports = propsSports || hookSports;
  const loading = propsLoading || hookLoading;
  const error = propsError || hookError;

  // Filter sports based on props
  const filteredSports = useMemo(() => {
    let result = [...sports];

    // Add "All" option if requested
    if (showAllOption && !result.find(s => s.id === 'all')) {
      const totalCount = result.reduce((sum, sport) => sum + (sport.count || 0), 0);
      const totalPredictions = result.reduce((sum, sport) => sum + (sport.predictions || 0), 0);
      
      result.unshift({
        id: 'all',
        name: allOptionLabel,
        icon: '🏆',
        count: totalCount,
        predictions: totalPredictions,
        isPopular: true,
      });
    }

    // Apply filters
    if (filterByPopular) {
      result = result.filter(sport => sport.isPopular);
    }

    if (filterByMinCount !== undefined) {
      result = result.filter(sport => (sport.count || 0) >= filterByMinCount);
    }

    if (customFilter) {
      result = result.filter(customFilter);
    }

    return result;
  }, [sports, showAllOption, allOptionLabel, filterByPopular, filterByMinCount, customFilter]);

  // Handle selection
  const handleSportSelect = useCallback((sportId: string) => {
    if (!onSportsSelect) return;

    let newSelection: string[];

    if (sportId === 'all') {
      // If "All" is clicked, select only "All"
      newSelection = ['all'];
    } else {
      // Remove "all" from selection if it exists
      const filteredSelection = selectedSports.filter(id => id !== 'all');
      
      if (selectedSports.includes(sportId)) {
        // Deselect the sport
        newSelection = filteredSelection.filter(id => id !== sportId);
      } else {
        // Select the sport
        newSelection = [...filteredSelection, sportId];
      }

      // If no sports selected, default to "all"
      if (newSelection.length === 0) {
        newSelection = ['all'];
      }
      
      // If all individual sports are selected, switch to "all"
      const allSportIds = sports.filter(s => s.id !== 'all').map(s => s.id);
      if (newSelection.length === allSportIds.length && 
          allSportIds.every(id => newSelection.includes(id))) {
        newSelection = ['all'];
      }
    }

    onSportsSelect(newSelection);
  }, [onSportsSelect, selectedSports, sports]);

  const isSelected = useCallback((sportId: string): boolean => {
    return selectedSports.includes(sportId);
  }, [selectedSports]);

  // Handle retry
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refetch();
    }
  };

  // Loading state
  if (loading) {
    return <SportsSkeleton variant={variant} columns={columns} />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-red-500 mb-4">Sporlar yüklenirken hata oluştu</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // Empty state
  if (filteredSports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6',
  };

  const containerClass = spacingClasses[spacing];

  // List variant
  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {filteredSports.map((sport) => (
          <SportButton
            key={sport.id}
            sport={sport}
            isSelected={isSelected(sport.id)}
            onClick={handleSportSelect}
            showCount={showCounts}
            showPredictions={showPredictions}
            showHotBadge={showHotBadge}
            variant="list"
            className={buttonClassName}
          />
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap ${containerClass} ${className}`}>
        {filteredSports.map((sport) => (
          <SportButton
            key={sport.id}
            sport={sport}
            isSelected={isSelected(sport.id)}
            onClick={handleSportSelect}
            showCount={showCounts}
            showPredictions={showPredictions}
            showHotBadge={showHotBadge}
            variant="compact"
            className={buttonClassName}
          />
        ))}
      </div>
    );
  }

  // Carousel variant
  if (variant === 'carousel') {
    return (
      <div className={`flex ${containerClass} overflow-x-auto pb-4 ${className}`}>
        {filteredSports.map((sport) => (
          <div key={sport.id} className="flex-shrink-0">
            <SportButton
              sport={sport}
              isSelected={isSelected(sport.id)}
              onClick={handleSportSelect}
              showCount={showCounts}
              showPredictions={showPredictions}
              showHotBadge={showHotBadge}
              className={buttonClassName}
            />
          </div>
        ))}
      </div>
    );
  }

  // Grid variant (default) - but using flex for better control
  return (
    <div className={`flex flex-wrap ${containerClass} ${className}`}>
      {filteredSports.map((sport) => (
        <SportButton
          key={sport.id}
          sport={sport}
          isSelected={isSelected(sport.id)}
          onClick={handleSportSelect}
          showCount={showCounts}
          showPredictions={showPredictions}
          showHotBadge={showHotBadge}
          className={buttonClassName}
        />
      ))}
    </div>
  );
}