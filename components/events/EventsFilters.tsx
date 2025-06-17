"use client";

import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EventsFiltersProps, TimeRange } from './types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function EventsFilters({
  selectedLeagues,
  selectedTimeRange,
  showLiveOnly,
  availableLeagues,
  onLeaguesChange,
  onTimeRangeChange,
  onLiveOnlyChange,
  onSearch,
  className = '',
}: EventsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeagueFilter, setShowLeagueFilter] = useState(false);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 'today', label: 'Bugün' },
    { value: 'tomorrow', label: 'Yarın' },
    { value: 'thisWeek', label: 'Bu Hafta' },
    { value: 'all', label: 'Tümü' },
  ];

  const handleSearch = useCallback(() => {
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  const handleLeagueToggle = (leagueId: string) => {
    if (selectedLeagues.includes(leagueId)) {
      onLeaguesChange(selectedLeagues.filter(id => id !== leagueId));
    } else {
      onLeaguesChange([...selectedLeagues, leagueId]);
    }
  };

  const clearLeagues = () => {
    onLeaguesChange([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      {onSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Takım veya lig ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-iddaa-green-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch?.('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Time Range Filters */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              variant={selectedTimeRange === option.value ? 'primary' : 'ghost'}
              size="xs"
              className="rounded-md"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Live Only Toggle */}
        <Button
          onClick={() => onLiveOnlyChange(!showLiveOnly)}
          variant={showLiveOnly ? 'primary' : 'secondary'}
          size="xs"
          className="rounded-lg"
        >
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${showLiveOnly ? 'bg-white' : 'bg-red-500'} ${showLiveOnly ? '' : 'animate-pulse'}`} />
            Canlı
          </div>
        </Button>

        {/* League Filter Button */}
        <Button
          onClick={() => setShowLeagueFilter(!showLeagueFilter)}
          variant="secondary"
          size="xs"
          className="rounded-lg"
          rightIcon={<Filter className="w-3 h-3" />}
        >
          Ligler
          {selectedLeagues.length > 0 && (
            <Badge variant="secondary" size="sm" className="ml-1">
              {selectedLeagues.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* League Filter Dropdown */}
      {showLeagueFilter && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Lig Filtresi
            </h4>
            {selectedLeagues.length > 0 && (
              <Button
                onClick={clearLeagues}
                variant="ghost"
                size="xs"
                className="text-gray-500 hover:text-gray-700"
              >
                Temizle
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {availableLeagues.map((league) => (
              <label
                key={league.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-1.5"
              >
                <input
                  type="checkbox"
                  checked={selectedLeagues.includes(league.id)}
                  onChange={() => handleLeagueToggle(league.id)}
                  className="w-4 h-4 text-iddaa-green-500 border-gray-300 rounded focus:ring-iddaa-green-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                  {league.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedLeagues.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" size="sm">
              Arama: {searchQuery}
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch?.('');
                }}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedLeagues.length > 0 && (
            <Badge variant="secondary" size="sm">
              {selectedLeagues.length} lig seçili
              <button onClick={clearLeagues} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}