"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, TrendingDown, Activity, Clock, Radio } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

// Backend API response type for odds movements
interface OddsMovement {
  event_slug: string;
  match: string;
  sport: string;
  sport_code: string;
  league: string;
  league_country: string;
  market: string;
  market_description: string;
  outcome: string;
  opening_odds: number;
  current_odds: number;
  change_percentage: number;
  multiplier: number;
  direction: "STEAMING" | "DRIFTING" | "SHORTENING";
  last_updated: string;
  event_time: string;
  event_status: string;
  is_live: boolean;
  home_score?: number;
  away_score?: number;
  minute_of_match?: number;
  betting_volume_percent?: number;
  home_team_country: string;
  away_team_country: string;
}

// Grouped event with multiple movements
interface GroupedEvent {
  event_slug: string;
  match: string;
  sport: string;
  sport_code: string;
  league: string;
  league_country: string;
  event_time: string;
  event_status: string;
  is_live: boolean;
  home_score?: number;
  away_score?: number;
  minute_of_match?: number;
  betting_volume_percent?: number;
  home_team_country: string;
  away_team_country: string;
  movements: OddsMovement[];
  movement_count: number;
  max_change_percentage: number;
  last_updated: string;
}

export default function OddsMovementsPage() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<GroupedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sport: "all",
    league: "all",
    direction: "all",
    minPercentage: "0",
    eventStatus: "all", // all, live, scheduled
  });

  // Extract unique values for filters
  const [availableFilters, setAvailableFilters] = useState({
    sports: [] as string[],
    leagues: [] as string[],
  });

  // Group movements by event
  const groupMovementsByEvent = useCallback((movements: OddsMovement[]): GroupedEvent[] => {
    const grouped: { [key: string]: GroupedEvent } = {};

    movements.forEach((movement) => {
      if (!grouped[movement.event_slug]) {
        grouped[movement.event_slug] = {
          event_slug: movement.event_slug,
          match: movement.match,
          sport: movement.sport,
          sport_code: movement.sport_code,
          league: movement.league,
          league_country: movement.league_country,
          event_time: movement.event_time,
          event_status: movement.event_status,
          is_live: movement.is_live,
          home_score: movement.home_score,
          away_score: movement.away_score,
          minute_of_match: movement.minute_of_match,
          betting_volume_percent: movement.betting_volume_percent,
          home_team_country: movement.home_team_country,
          away_team_country: movement.away_team_country,
          movements: [],
          movement_count: 0,
          max_change_percentage: 0,
          last_updated: movement.last_updated,
        };
      }

      grouped[movement.event_slug].movements.push(movement);
      grouped[movement.event_slug].movement_count = grouped[movement.event_slug].movements.length;
      
      // Track the highest absolute change percentage
      const absChangePercentage = Math.abs(movement.change_percentage);
      if (absChangePercentage > grouped[movement.event_slug].max_change_percentage) {
        grouped[movement.event_slug].max_change_percentage = absChangePercentage;
      }

      // Use the most recent update time
      if (new Date(movement.last_updated) > new Date(grouped[movement.event_slug].last_updated)) {
        grouped[movement.event_slug].last_updated = movement.last_updated;
      }
    });

    // Sort by max change percentage (highest first)
    return Object.values(grouped).sort((a, b) => b.max_change_percentage - a.max_change_percentage);
  }, []);

  const fetchOddsMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/odds/big-movers?hours=48&threshold=5`
      );

      if (response.ok) {
        const data: OddsMovement[] = await response.json();
        
        // Group movements by event
        const grouped = groupMovementsByEvent(data);
        setGroupedEvents(grouped);
        setFilteredEvents(grouped);

        // Extract unique sports and leagues
        const uniqueSports = Array.from(
          new Set(data.map((m) => m.sport))
        ).sort();
        const uniqueLeagues = Array.from(
          new Set(data.map((m) => m.league))
        ).sort();

        setAvailableFilters({
          sports: uniqueSports,
          leagues: uniqueLeagues,
        });
      } else {
        console.error("Failed to fetch odds movements");
      }
    } catch (error) {
      console.error("Error fetching odds movements:", error);
    } finally {
      setIsLoading(false);
    }
  }, [groupMovementsByEvent]);

  useEffect(() => {
    fetchOddsMovements();
  }, [fetchOddsMovements]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...groupedEvents];

    // Search filter - search in match name (home or away team)
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.match.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sport filter
    if (filters.sport !== "all") {
      filtered = filtered.filter((event) => event.sport === filters.sport);
    }

    // League filter
    if (filters.league !== "all") {
      filtered = filtered.filter((event) => event.league === filters.league);
    }

    // Direction filter
    if (filters.direction !== "all") {
      filtered = filtered.filter((event) =>
        event.movements.some((movement) => movement.direction === filters.direction)
      );
    }

    // Minimum percentage filter
    const minPercentage = parseFloat(filters.minPercentage);
    if (minPercentage > 0) {
      filtered = filtered.filter((event) => event.max_change_percentage >= minPercentage);
    }

    // Event status filter (live vs scheduled)
    if (filters.eventStatus !== "all") {
      if (filters.eventStatus === "live") {
        filtered = filtered.filter((event) => event.is_live);
      } else if (filters.eventStatus === "scheduled") {
        filtered = filtered.filter((event) => !event.is_live);
      }
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filters, groupedEvents]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      sport: "all",
      league: "all",
      direction: "all",
      minPercentage: "0",
      eventStatus: "all",
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainContentHeader title="Oran Hareketleri" showSearchBar={false} />

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hareket Yönü</label>
              <Select
                value={filters.direction}
                onValueChange={(value) => handleFilterChange("direction", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yön seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Yönler</SelectItem>
                  <SelectItem value="STEAMING">🔥 Yoğun İlgi (Artış)</SelectItem>
                  <SelectItem value="SHORTENING">⚡ Hızlı Düşüş</SelectItem>
                  <SelectItem value="DRIFTING">❄️ Azalan İlgi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Değişim %</label>
              <Select
                value={filters.minPercentage}
                onValueChange={(value) => handleFilterChange("minPercentage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minimum % seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Hepsi</SelectItem>
                  <SelectItem value="10">%10+</SelectItem>
                  <SelectItem value="25">%25+</SelectItem>
                  <SelectItem value="50">%50+</SelectItem>
                  <SelectItem value="100">%100+</SelectItem>
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
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="font-medium">{filteredEvents.length} etkinlik bulundu</span>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">{groupedEvents.filter(e => e.is_live).length} canlı</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-iddaa-600" />
                    <span className="text-iddaa-600 dark:text-iddaa-800">{groupedEvents.filter(e => !e.is_live).length} programlanmış</span>
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

        {/* Results Section */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
            [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            // Real data - grouped events
            filteredEvents.map((event) => (
              <div
                key={event.event_slug}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all duration-200"
              >
                {/* Header with event info and live status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-iddaa-600 dark:group-hover:text-iddaa-800 transition-colors">
                        {event.match}
                      </h3>
                      {event.is_live && (
                        <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          CANLI
                          {event.minute_of_match && (
                            <span className="ml-1">
                              {event.minute_of_match}&apos;
                            </span>
                          )}
                        </div>
                      )}
                      {event.home_score !== undefined &&
                        event.away_score !== undefined && (
                          <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-bold text-gray-900 dark:text-white">
                            {event.home_score} - {event.away_score}
                          </div>
                        )}
                    </div>

                    {/* League and sport info */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-iddaa-600 rounded-full"></span>
                          <span className="font-medium">{event.league}</span>
                          {event.league_country && (
                            <span className="text-xs">
                              ({event.league_country})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Activity className="w-3 h-3" />
                        <span>{event.sport}</span>
                      </div>
                    </div>

                    {/* Event summary info */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 bg-iddaa-100 dark:bg-iddaa-900/30 px-3 py-1.5 rounded-full">
                        <TrendingUp className="w-4 h-4 text-iddaa-600 dark:text-iddaa-800" />
                        <span className="text-sm font-medium text-iddaa-700 dark:text-iddaa-300">
                          {event.movement_count} hareket
                        </span>
                      </div>
                      {event.betting_volume_percent && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">
                            %{event.betting_volume_percent.toFixed(1)} bahis hacmi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary change section */}
                  <div className="text-right ml-6">
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        En Yüksek Değişim
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-mono">
                        {event.max_change_percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Movements List */}
                <div className="space-y-3 mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Oran Hareketleri:
                  </div>
                  {event.movements.slice(0, 5).map((movement, movementIndex) => (
                    <div key={`${event.event_slug}-${movement.market}-${movement.outcome}-${movementIndex}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {movement.market}
                          </span>
                          {movement.outcome && (
                            <>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span className="text-sm text-iddaa-600 dark:text-iddaa-800 font-medium">
                                {movement.outcome}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {movement.opening_odds.toFixed(2)} → {movement.current_odds.toFixed(2)}
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            movement.direction === "STEAMING"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : movement.direction === "SHORTENING"
                              ? "bg-iddaa-100 text-iddaa-700 dark:bg-iddaa-900/30 dark:text-iddaa-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {movement.direction === "STEAMING" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {movement.direction === "STEAMING" ? "+" : ""}
                            {movement.change_percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {event.movements.length > 5 && (
                    <div className="text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{event.movements.length - 5} daha fazla hareket
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom info bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Güncelleme:{" "}
                        {new Date(event.last_updated).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Maç:{" "}
                        {new Date(event.event_time).toLocaleDateString(
                          [],
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    📊 {event.movement_count} toplam hareket
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No results state
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sonuç Bulunamadı
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun oran hareketi bulunamadı. Filtreleri
                değiştirmeyi deneyin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
