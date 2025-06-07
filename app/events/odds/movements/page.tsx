"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Star, Zap, Crown } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';

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

// Featured/Sponsored content interface
interface FeaturedContent {
  id: string;
  type: 'premium_tip' | 'sponsored_bet' | 'vip_prediction';
  title: string;
  description: string;
  provider: string;
  providerLogo?: string;
  odds?: number;
  confidence?: number;
  price?: string;
  discount?: string;
  cta: string;
  ctaLink: string;
  badge?: string;
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

  // Mock featured content - Sports streaming service ad
  const featuredContent: FeaturedContent = {
    id: "featured-1",
    type: 'sponsored_bet',
    title: "beIN Sports Connect - Canlı Maç İzle! ⚽",
    description: "Tüm lig maçları, özel içerikler ve HD kalitede canlı yayın",
    provider: "beIN Sports",
    odds: 2.35,
    confidence: 95,
    price: "₺29.90/ay",
    discount: "İLK AY ÜCRETSİZ",
    cta: "Ücretsiz İzle",
    ctaLink: "https://connect.beinsports.com",
    badge: "HD KALİTE"
  };

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
        
        if (data && Array.isArray(data)) {
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
          setGroupedEvents([]);
          setFilteredEvents([]);
        }
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

  // Render featured content component - Sports streaming service ad
  const renderFeaturedContent = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 dark:from-purple-800 dark:via-purple-900 dark:to-purple-950 rounded-lg p-4 md:p-6 border border-purple-500 dark:border-purple-600 shadow-lg">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {/* Badge */}
        {featuredContent.badge && (
          <div className="inline-flex items-center gap-1 bg-yellow-400 text-purple-800 text-xs font-bold px-2 py-1 rounded-full mb-3">
            <Star className="w-3 h-3" />
            {featuredContent.badge}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg md:text-xl mb-1">
              {featuredContent.title}
            </h3>
            <p className="text-purple-100 text-sm md:text-base mb-3">
              {featuredContent.description}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Canlı Yayın
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Premium İçerik
                </span>
              </div>
              <div className="text-purple-200">
                <span className="font-semibold">Multi-Device</span>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="flex flex-col items-center gap-2">
            {featuredContent.discount && (
              <Badge color="yellow" className="animate-pulse">
                {featuredContent.discount}
              </Badge>
            )}
            <a href={featuredContent.ctaLink} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button 
                className="bg-white text-purple-700 hover:bg-purple-50 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {featuredContent.cta}
              </Button>
            </a>
            {featuredContent.price && (
              <span className="text-purple-200 text-sm">
                {featuredContent.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainContentHeader title="Oran Hareketleri" showSearchBar={false} />

      <div className="p-4 space-y-4">
        {/* Compact Search and Filters Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Takım ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <details className="md:hidden">
            <summary className="text-sm font-medium text-iddaa-600 dark:text-iddaa-400 cursor-pointer">
              Filtreler ({filteredEvents.length} sonuç)
            </summary>
            <div className="mt-3 space-y-2">
              {/* Filters for mobile */}
              <Select value={filters.eventStatus} onValueChange={(value) => handleFilterChange("eventStatus", value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Maç Durumu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Maçlar</SelectItem>
                  <SelectItem value="live">🔴 Canlı</SelectItem>
                  <SelectItem value="scheduled">🕐 Programlı</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.minPercentage} onValueChange={(value) => handleFilterChange("minPercentage", value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Min %" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tümü</SelectItem>
                  <SelectItem value="10">%10+</SelectItem>
                  <SelectItem value="25">%25+</SelectItem>
                  <SelectItem value="50">%50+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </details>

          {/* Desktop Filters */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Select value={filters.eventStatus} onValueChange={(value) => handleFilterChange("eventStatus", value)}>
              <SelectTrigger className="h-9 text-sm w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="live">🔴 Canlı</SelectItem>
                <SelectItem value="scheduled">🕐 Programlı</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.sport} onValueChange={(value) => handleFilterChange("sport", value)}>
              <SelectTrigger className="h-9 text-sm w-32">
                <SelectValue placeholder="Spor" />
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
            
            <Select value={filters.minPercentage} onValueChange={(value) => handleFilterChange("minPercentage", value)}>
              <SelectTrigger className="h-9 text-sm w-28">
                <SelectValue placeholder="Min %" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tümü</SelectItem>
                <SelectItem value="10">%10+</SelectItem>
                <SelectItem value="25">%25+</SelectItem>
                <SelectItem value="50">%50+</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {filteredEvents.length} sonuç
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-3 text-xs"
              >
                Temizle
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-3">
          {isLoading ? (
            // Loading state - more compact
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            // Real data - more compact design
            filteredEvents.map((event, index) => (
              <div key={`${event.event_slug}-${index}`}>
                {/* Insert featured content after 2nd item */}
                {index === 2 && renderFeaturedContent()}
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700 hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all">
                  {/* Compact Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate">
                          {event.match}
                        </h3>
                        {event.is_live && (
                          <Badge color="red" size="sm" className="animate-pulse">
                            CANLI {event.minute_of_match && `${event.minute_of_match}'`}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{event.league}</span>
                        <span>•</span>
                        <span>{event.sport}</span>
                        {event.home_score !== undefined && (
                          <>
                            <span>•</span>
                            <span className="font-semibold">
                              {event.home_score} - {event.away_score}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Compact Stats */}
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">
                        {event.max_change_percentage.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.movement_count} hareket
                      </div>
                    </div>
                  </div>

                  {/* Top 3 Movements - Compact View */}
                  <div className="space-y-1.5">
                    {event.movements.slice(0, 3).map((movement, idx) => (
                      <div key={`${movement.market}-${idx}`} className="flex items-center justify-between gap-2 text-xs md:text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {movement.market}
                          </span>
                          {movement.outcome && (
                            <span className="text-iddaa-600 dark:text-iddaa-400 font-medium">
                              {movement.outcome}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-gray-500 hidden sm:inline">
                            {movement.opening_odds.toFixed(2)} → {movement.current_odds.toFixed(2)}
                          </span>
                          <Badge 
                            color={movement.direction === "STEAMING" ? "green" : "red"} 
                            size="sm"
                            className="min-w-[60px] justify-center"
                          >
                            {movement.direction === "STEAMING" ? "+" : ""}
                            {movement.change_percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {event.movements.length > 3 && (
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
                        +{event.movements.length - 3} hareket daha
                      </p>
                    )}
                  </div>

                  {/* Compact Footer */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(event.event_time).toLocaleDateString([], {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>
                      Son güncelleme: {new Date(event.last_updated).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No results state - compact
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Sonuç Bulunamadı
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun oran hareketi bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}