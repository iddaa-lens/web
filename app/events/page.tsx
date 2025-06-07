"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, Clock, Radio, Activity } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

// Event interface matching backend API response
interface Event {
  id: number;
  external_id: string;
  slug: string;
  event_date: string;
  status: string;
  home_score?: number;
  away_score?: number;
  is_live: boolean;
  minute_of_match?: number;
  half?: number;
  betting_volume_percentage?: number;
  volume_rank?: number;
  has_king_odd: boolean;
  odds_count?: number;
  has_combine: boolean;
  home_team: string;
  home_team_country: string;
  away_team: string;
  away_team_country: string;
  league: string;
  league_country: string;
  sport: string;
  sport_code: string;
  match: string;
}

interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface PaginatedEventsResponse {
  data: Event[];
  pagination: PaginationInfo;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  const [filters, setFilters] = useState({
    sport: "all",
    league: "all",
    eventStatus: "all", // all, live, scheduled
    timeRange: "all", // all, today, tomorrow, next3days
  });

  // Extract unique values for filters
  const [availableFilters, setAvailableFilters] = useState({
    sports: [] as string[],
    leagues: [] as string[],
  });

  // Fetch events from the backend with pagination support
  const fetchEvents = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "20",
        hours_before: "24",
        hours_after: "24",
      });

      // Add filters if they're set
      if (filters.sport !== "all") {
        params.set("sport", filters.sport);
      }
      if (filters.league !== "all") {
        params.set("league", filters.league);
      }
      if (filters.eventStatus !== "all") {
        params.set("status", filters.eventStatus === "live" ? "live" : "scheduled");
      }

      // Use the main events endpoint with pagination
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?${params.toString()}`);

      if (response.ok) {
        const data: PaginatedEventsResponse = await response.json();
        
        setEvents(data.data);
        setPagination(data.pagination);

        // Extract unique sports and leagues for filter options
        // We'll do this on the first load or when filters change
        if (page === 1) {
          const uniqueSports = Array.from(
            new Set(data.data.map((e) => e.sport))
          ).sort();
          const uniqueLeagues = Array.from(
            new Set(data.data.map((e) => e.league))
          ).sort();

          setAvailableFilters({
            sports: uniqueSports,
            leagues: uniqueLeagues,
          });
        }
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents(1); // Reset to page 1 when filters change
  }, [filters, fetchEvents]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchEvents(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      sport: "all",
      league: "all",
      eventStatus: "all",
      timeRange: "all",
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainContentHeader title="Tüm Etkinlikler" showSearchBar={false} />

      <div className="p-4 space-y-6">
        {/* Search and Filters Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Takım ara (ev sahibi veya deplasman)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Spor</label>
              <Select
                value={filters.sport}
                onValueChange={(value) => handleFilterChange("sport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Spor seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sporlar</SelectItem>
                  {availableFilters.sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lig</label>
              <Select
                value={filters.league}
                onValueChange={(value) => handleFilterChange("league", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lig seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Ligler</SelectItem>
                  {availableFilters.leagues.map((league) => (
                    <SelectItem key={league} value={league}>
                      {league}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maç Durumu</label>
              <Select
                value={filters.eventStatus}
                onValueChange={(value) => handleFilterChange("eventStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Maçlar</SelectItem>
                  <SelectItem value="live">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500" />
                      Canlı Maçlar
                    </div>
                  </SelectItem>
                  <SelectItem value="scheduled">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-iddaa-600" />
                      Programlanmış Maçlar
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zaman Aralığı</label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) => handleFilterChange("timeRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Zaman seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Zamanlar</SelectItem>
                  <SelectItem value="today">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      Bugün
                    </div>
                  </SelectItem>
                  <SelectItem value="tomorrow">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-iddaa-600" />
                      Yarın
                    </div>
                  </SelectItem>
                  <SelectItem value="next3days">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Sonraki 3 Gün
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {pagination.total} etkinlik bulundu 
                  {pagination.total > 0 && (
                    <span className="ml-1">
                      ({((pagination.page - 1) * pagination.per_page) + 1}-{Math.min(pagination.page * pagination.per_page, pagination.total)} gösteriliyor)
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">{events.filter(e => e.is_live).length} canlı</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-iddaa-600" />
                    <span className="text-iddaa-600 dark:text-iddaa-800">{events.filter(e => !e.is_live).length} programlanmış</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-iddaa-600 dark:text-iddaa-800"
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {/* Loading overlay for page changes */}
          {isLoading && events.length > 0 && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iddaa-600"></div>
              </div>
            </div>
          )}
          
          {isLoading && events.length === 0 ? (
            // Loading state
            [...Array(9)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : events.length > 0 ? (
            // Real data
            events.map((event) => (
              <div
                key={event.slug}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all duration-200 cursor-pointer hover:shadow-md"
              >
                {/* Event Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {event.match}
                      </h3>
                      {event.is_live && (
                        <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          CANLI
                          {event.minute_of_match && (
                            <span className="ml-1">{event.minute_of_match}&apos;</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Score display for live matches */}
                    {event.is_live && event.home_score !== undefined && event.away_score !== undefined && (
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-bold text-gray-900 dark:text-white mb-2 inline-block">
                        {event.home_score} - {event.away_score}
                      </div>
                    )}
                  </div>
                </div>

                {/* League and Sport Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-iddaa-600 rounded-full"></span>
                    <span className="font-medium">{event.league}</span>
                    {event.league_country && (
                      <span className="text-xs">({event.league_country})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Activity className="w-3 h-3" />
                    <span>{event.sport}</span>
                  </div>
                </div>

                {/* Event Time and Status */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString([], {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {event.betting_volume_percentage && (
                      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>%{event.betting_volume_percentage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No results state
            <div className="col-span-full">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Etkinlik Bulunamadı
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Arama kriterlerinize uygun etkinlik bulunamadı. Filtreleri değiştirmeyi deneyin.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {events.length > 0 && pagination.total_pages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
              hasNext={pagination.has_next}
              hasPrevious={pagination.has_previous}
            />
          </div>
        )}
      </div>
    </div>
  );
}