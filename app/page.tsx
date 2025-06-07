"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";

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

// Event interface matching backend API response
interface UpcomingEvent {
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

export default function Home() {
  const router = useRouter();
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [oddsMovements, setOddsMovements] = useState<OddsMovement[]>([]);
  const [isLoadingOdds, setIsLoadingOdds] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchOddsMovements = async () => {
      try {
        setIsLoadingOdds(true);
        // Adjust the API URL based on your backend configuration
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/odds/big-movers?hours=24&threshold=10`);
        
        if (response.ok) {
          const data: OddsMovement[] = await response.json();
          setOddsMovements(data.slice(0, 4)); // Show only top 4 on homepage
        } else {
          console.error('Failed to fetch odds movements');
        }
      } catch (error) {
        console.error('Error fetching odds movements:', error);
      } finally {
        setIsLoadingOdds(false);
      }
    };

    fetchOddsMovements();
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setIsLoadingEvents(true);
      // Use the new upcoming events endpoint with timeframe parameter
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/upcoming?timeframe=6h&limit=6`);
      
      if (response.ok) {
        const data: UpcomingEvent[] = await response.json();
        setUpcomingEvents(data); // Already limited by API
      } else {
        console.error('Failed to fetch upcoming events');
      }
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const navigateToPredictions = () => router.push("/predictions");
  const navigateToEvents = () => router.push("/events");

  const handleSearch = (query: string) => {
    setHomeSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainContentHeader
        title="Ana Sayfa"
        showSearchBar={false}
        searchPlaceholder="Ara..."
        searchQuery={homeSearchQuery}
        onSearchChange={handleSearch}
      />

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">IddaaLens</h1>
            <p className="text-blue-100">Bahis analiz paneli</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {/* Sample Section 1 */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Popüler Maçlar</h2>
              <Button
                variant="ghost"
                onClick={navigateToPredictions}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Tümünü Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Örnek Maç {item}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Bu bir örnek maç kartıdır.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Odds Movement Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">En Çok Değişen Oranlar</h2>
              <Button
                variant="ghost"
                onClick={() => router.push("/events/odds/movements")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Tümünü Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {isLoadingOdds ? (
                // Loading state
                [...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
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
              ) : oddsMovements.length > 0 ? (
                // Real data
                oddsMovements.map((movement, index) => (
                  <div key={`${movement.event_slug}-${movement.market}-${movement.outcome}-${index}`} className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer">
                    {/* Header with match info and live status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {movement.match}
                          </h3>
                          {movement.is_live && (
                            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              CANLI
                              {movement.minute_of_match && <span className="ml-1">{movement.minute_of_match}&apos;</span>}
                            </div>
                          )}
                          {movement.home_score !== undefined && movement.away_score !== undefined && (
                            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-bold text-gray-900 dark:text-white">
                              {movement.home_score} - {movement.away_score}
                            </div>
                          )}
                        </div>
                        
                        {/* League and sport info */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span className="font-medium">{movement.league}</span>
                              {movement.league_country && (
                                <span className="text-xs">({movement.league_country})</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{movement.sport}</span>
                          </div>
                        </div>
                        
                        {/* Market and betting volume */}
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {movement.market}
                            </span>
                            {movement.outcome && (
                              <>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {movement.outcome}
                                </span>
                              </>
                            )}
                          </div>
                          {movement.betting_volume_percent && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">%{movement.betting_volume_percent.toFixed(1)} bahis hacmi</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Odds change section */}
                      <div className="text-right ml-6">
                        <div className="flex items-center justify-end gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Eski Oran</div>
                            <div className="text-base text-gray-500 line-through font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                              {movement.opening_odds.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Yeni Oran</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white font-mono bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded border-2 border-blue-200 dark:border-blue-700">
                              {movement.current_odds.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Change indicator */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          movement.direction === 'STEAMING' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : movement.direction === 'SHORTENING'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {movement.direction === 'STEAMING' ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span>
                            {movement.direction === 'STEAMING' ? '+' : ''}{movement.change_percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom info bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Güncelleme: {new Date(movement.last_updated).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Maç: {new Date(movement.event_time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        movement.direction === 'STEAMING' ? 'text-green-600 dark:text-green-400' : 
                        movement.direction === 'SHORTENING' ? 'text-blue-600 dark:text-blue-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {movement.direction === 'STEAMING' && '🔥 Yoğun İlgi'}
                        {movement.direction === 'SHORTENING' && '⚡ Hızlı Düşüş'}
                        {movement.direction === 'DRIFTING' && '❄️ Azalan İlgi'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No data state
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Büyük Hareket Yok
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Şu anda büyük oran değişikliği bulunmuyor. Yeni hareketler olduğunda burada görünecek.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Yaklaşan Maçlar (6 Saat)</h2>
              <Button
                variant="ghost"
                onClick={navigateToEvents}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Tüm Etkinlikler
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {isLoadingEvents ? (
                // Loading state
                [...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : upcomingEvents.length > 0 ? (
                // Real data
                upcomingEvents.map((event) => (
                  <div key={event.slug} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {event.match}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>{event.league}</span>
                            {event.league_country && (
                              <span className="text-xs">({event.league_country})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>{event.sport}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(event.event_date).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            const eventTime = new Date(event.event_date);
                            const now = new Date();
                            const diffMs = eventTime.getTime() - now.getTime();
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            
                            if (diffHours > 0) {
                              return `${diffHours}s ${diffMinutes}d içinde`;
                            } else if (diffMinutes > 0) {
                              return `${diffMinutes} dk içinde`;
                            } else {
                              return 'Çok yakında';
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No data state
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    Yaklaşan Maç Yok
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Önümüzdeki 6 saat içinde başlayacak maç bulunmuyor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}