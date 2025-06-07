"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Star, Zap, Target } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";
import SmartMoneyMovements from "@/components/ui/SmartMoneyMovements";

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
          setOddsMovements(data ? data.slice(0, 4) : []); // Show only top 4 on homepage
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
        setUpcomingEvents(data || []); // Already limited by API
      } else {
        console.error('Failed to fetch upcoming events');
      }
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const navigateToEvents = () => router.push("/events");

  const handleSearch = (query: string) => {
    setHomeSearchQuery(query);
  };

  // Featured content for homepage - Sports store ad
  const renderFeaturedContent = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-blue-950 rounded-xl p-5 border border-blue-500 dark:border-blue-600 shadow-lg mb-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {/* Sponsor badge */}
        <div className="inline-flex items-center gap-1 bg-white text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Star className="w-3 h-3" />
          SPONSORLU İÇERİK
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl mb-2">
              Bilyoner.com - Resmi İddaa Sitesi 🏆
            </h3>
            <p className="text-blue-100 text-sm mb-3">
              Türkiye&apos;nin resmi ve yasal bahis platformu - Güvenli oyun
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Resmi & Yasal
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Hızlı Ödeme
                </span>
              </div>
              <div className="text-blue-200">
                <span className="font-semibold">Güvenli Platform</span>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <Badge color="yellow" className="animate-pulse mb-1">
              🎯 HOŞGELDİN BONUSU
            </Badge>
            <a href="https://bilyoner.com" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button 
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-base"
              >
                Oyuna Başla
              </Button>
            </a>
            <div className="text-center">
              <span className="text-blue-200 text-sm">Yasal ve</span>
              <span className="text-white font-bold text-lg block">Güvenli</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <div className="bg-gradient-to-r from-iddaa-600 to-iddaa-700 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">IddaaLens</h1>
            <p className="text-iddaa-100">Bahis analiz paneli</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {/* Smart Money Movements Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  🧠 Akıllı Para Hareketleri
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Profesyonel bahisçilerin tespit edilen hareketleri - değer fırsatları
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full font-medium">
                    ℹ️ Kalite odaklı - hacim değil
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push("/events/smart-money")}
                className="text-iddaa-600 dark:text-iddaa-800 hover:text-iddaa-700 dark:hover:text-iddaa-600"
              >
                Tümünü Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <SmartMoneyMovements />
          </div>


          {/* Odds Movement Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  📈 En Çok Değişen Oranlar
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Piyasa momentum - büyük hacimli oran değişiklikleri
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                    📊 Hacim odaklı - piyasa hareketi
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push("/events/odds/movements")}
                className="text-iddaa-600 dark:text-iddaa-800 hover:text-iddaa-700 dark:hover:text-iddaa-600"
              >
                Tümünü Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {isLoadingOdds ? (
                // Loading state - mobile optimized
                [...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="animate-pulse">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
              ) : oddsMovements.length > 0 ? (
                // Real data with featured content
                oddsMovements.map((movement, index) => (
                  <div key={`odds-section-${index}`}>
                    {/* Insert featured content after first item */}
                    {index === 1 && renderFeaturedContent()}
                    <div className="group bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all duration-200 cursor-pointer">
                    {/* Mobile-first responsive layout */}
                    <div className="space-y-3">
                      {/* Header row - match name and badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-iddaa-600 dark:group-hover:text-iddaa-800 transition-colors truncate">
                            {movement.match}
                          </h3>
                          {/* Mobile: League and sport info on second line */}
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{movement.league}</span>
                            <span>•</span>
                            <span>{movement.sport}</span>
                            {movement.league_country && (
                              <>
                                <span>•</span>
                                <span>({movement.league_country})</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Badges row */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {movement.is_live && (
                            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded-full text-xs font-bold">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                              CANLI
                              {movement.minute_of_match && <span className="ml-1">{movement.minute_of_match}&apos;</span>}
                            </div>
                          )}
                          {movement.home_score !== undefined && movement.away_score !== undefined && (
                            <div className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-bold text-gray-900 dark:text-white">
                              {movement.home_score} - {movement.away_score}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Market and odds row - responsive */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* Left side - Market info */}
                        <div className="flex items-center gap-2 text-xs">
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{movement.market}</span>
                            {movement.outcome && (
                              <>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="font-bold text-iddaa-600 dark:text-iddaa-800">{movement.outcome}</span>
                              </>
                            )}
                          </div>
                          {movement.betting_volume_percent && (
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">%{movement.betting_volume_percent.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Right side - Odds display */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400 line-through">
                            {movement.opening_odds.toFixed(2)}
                          </span>
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {movement.current_odds.toFixed(2)}
                          </span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            movement.direction === 'STEAMING' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : movement.direction === 'SHORTENING'
                              ? 'bg-iddaa-100 text-iddaa-700 dark:bg-iddaa-900/30 dark:text-iddaa-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {movement.direction === 'STEAMING' ? '↗' : '↙'}
                            {Math.abs(movement.change_percentage).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom info bar - mobile responsive */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <span>🕐 {new Date(movement.last_updated).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>📅 {new Date(movement.event_time).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium ${
                          movement.direction === 'STEAMING' ? 'text-green-600 dark:text-green-400' : 
                          movement.direction === 'SHORTENING' ? 'text-iddaa-600 dark:text-iddaa-800' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {movement.direction === 'STEAMING' && '🔥 Yoğun İlgi'}
                          {movement.direction === 'SHORTENING' && '⚡ Hızlı Düşüş'}
                          {movement.direction === 'DRIFTING' && '❄️ Azalan İlgi'}
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                ))
              ) : (
                // No data state
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-600 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">
                    Büyük Hareket Yok
                  </h4>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Şu anda büyük oran değişikliği bulunmuyor.
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
                className="text-iddaa-600 dark:text-iddaa-800 hover:text-iddaa-700 dark:hover:text-iddaa-600"
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
                  <div key={event.slug} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {event.match}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-iddaa-600 rounded-full"></span>
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