"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Zap, Crown, Activity } from "lucide-react";
import MainContentHeader from "@/components/layout/MainContentHeader";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';

// Smart Money Movement interface
interface SmartMoneyMovement {
  id: number;
  event_external_id: string;
  home_team: string;
  away_team: string;
  match: string;
  market_name: string;
  outcome: string;
  previous_odds: number;
  current_odds: number;
  change_percent: number;
  multiplier: number;
  minutes_to_kickoff: number;
  recorded_at: string;
  is_live: boolean;
  alert_message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  league?: string;
  sport?: string;
}

// Featured content interface
interface FeaturedContent {
  id: string;
  type: 'premium_analysis' | 'ai_insight' | 'pro_tips';
  title: string;
  description: string;
  provider: string;
  badge?: string;
  price?: string;
  discount?: string;
  cta: string;
  ctaLink: string;
}

export default function SmartMoneyMovementsPage() {
  const [movements, setMovements] = useState<SmartMoneyMovement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<SmartMoneyMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    severity: "all",
    timeframe: "all",
    direction: "all",
    minPercentage: "0",
    status: "all", // all, live, scheduled
  });

  // Mock featured content - AI Analysis service ad
  const featuredContent: FeaturedContent = {
    id: "featured-ai-1",
    type: 'premium_analysis',
    title: "ProAnaliz AI - Akıllı Para Takip Sistemi 🤖",
    description: "Gelişmiş algoritmalara profesyonel bahis analizi ve akıllı para hareketleri",
    provider: "ProAnaliz",
    badge: "YAPay ZEKA",
    price: "₺49.90/ay",
    discount: "7 GÜN ÜCRETSİZ",
    cta: "Ücretsiz Dene",
    ctaLink: "https://proanaliz.com"
  };

  const fetchSmartMoneyMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      // Real API implementation:
      // Try the big-movers endpoint since /movements returns status text
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/smart-money/big-movers`);
      
      let movementsData: SmartMoneyMovement[] = [];
      
      if (response.ok) {
        const result = await response.json();
        // API returns data nested in 'data' object
        movementsData = result.data?.movements || [];
      } else {
        console.error('Failed to fetch smart money movements, using fallback data');
        // Fallback mock data
        movementsData = [
        {
          id: 1,
          event_external_id: "12345",
          home_team: "Galatasaray",
          away_team: "Fenerbahçe",
          match: "Galatasaray vs Fenerbahçe",
          market_name: "Maç Sonucu",
          outcome: "1",
          previous_odds: 2.85,
          current_odds: 2.35,
          change_percent: -17.5,
          multiplier: 1.21,
          minutes_to_kickoff: 45,
          recorded_at: "2025-01-07T10:30:00Z",
          is_live: false,
          alert_message: "Galatasaray kazanma oranında büyük düşüş - profesyonel bahis akışı tespit edildi",
          severity: 'high',
          league: "Süper Lig",
          sport: "Futbol"
        },
        {
          id: 2,
          event_external_id: "12346",
          home_team: "Manchester City",
          away_team: "Arsenal",
          match: "Manchester City vs Arsenal",
          market_name: "Toplam Gol",
          outcome: "Üst 2.5",
          previous_odds: 1.75,
          current_odds: 2.10,
          change_percent: 20.0,
          multiplier: 1.20,
          minutes_to_kickoff: 120,
          recorded_at: "2025-01-07T09:45:00Z",
          is_live: false,
          alert_message: "Toplam gol oranında ani yükseliş - değer fırsatı olabilir",
          severity: 'medium',
          league: "Premier League",
          sport: "Futbol"
        },
        {
          id: 3,
          event_external_id: "12347",
          home_team: "Barcelona",
          away_team: "Real Madrid",
          match: "Barcelona vs Real Madrid",
          market_name: "Çifte Şans",
          outcome: "1X",
          previous_odds: 1.45,
          current_odds: 1.85,
          change_percent: 27.6,
          multiplier: 1.28,
          minutes_to_kickoff: 35,
          recorded_at: "2025-01-07T11:15:00Z",
          is_live: true,
          alert_message: "Canlı maçta çifte şans oranında keskin artış",
          severity: 'critical',
          league: "La Liga",
          sport: "Futbol"
        },
        {
          id: 4,
          event_external_id: "12348",
          home_team: "Beşiktaş",
          away_team: "Trabzonspor",
          match: "Beşiktaş vs Trabzonspor",
          market_name: "Handikap",
          outcome: "Beşiktaş -1",
          previous_odds: 3.20,
          current_odds: 2.65,
          change_percent: -17.2,
          multiplier: 1.21,
          minutes_to_kickoff: 75,
          recorded_at: "2025-01-07T10:00:00Z",
          is_live: false,
          alert_message: "Handikap oranında büyük hareket - güçlü bahis akışı",
          severity: 'high',
          league: "Süper Lig",
          sport: "Futbol"
        },
        {
          id: 5,
          event_external_id: "12349",
          home_team: "Liverpool",
          away_team: "Chelsea",
          match: "Liverpool vs Chelsea",
          market_name: "Maç Sonucu",
          outcome: "X",
          previous_odds: 3.85,
          current_odds: 4.50,
          change_percent: 16.9,
          multiplier: 1.17,
          minutes_to_kickoff: 180,
          recorded_at: "2025-01-07T09:20:00Z",
          is_live: false,
          alert_message: "Beraberlik oranında yükseliş trendi",
          severity: 'low',
          league: "Premier League",
          sport: "Futbol"
        },
        {
          id: 6,
          event_external_id: "12350",
          home_team: "Bayern Munich",
          away_team: "Borussia Dortmund",
          match: "Bayern Munich vs Borussia Dortmund",
          market_name: "Korner",
          outcome: "Üst 10.5",
          previous_odds: 1.90,
          current_odds: 2.35,
          change_percent: 23.7,
          multiplier: 1.24,
          minutes_to_kickoff: 95,
          recorded_at: "2025-01-07T09:30:00Z",
          is_live: false,
          alert_message: "Korner sayısı oranında büyük artış - profesyonel değerlendirme",
          severity: 'medium',
          league: "Bundesliga",
          sport: "Futbol"
        }
        ];
      }
      
      setMovements(movementsData);
      setFilteredMovements(movementsData);
    } catch (error) {
      console.error("Error fetching smart money movements:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSmartMoneyMovements();
  }, [fetchSmartMoneyMovements]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...movements];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((movement) =>
        movement.match.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.away_team.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Severity filter
    if (filters.severity !== "all") {
      filtered = filtered.filter((movement) => movement.severity === filters.severity);
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "live") {
        filtered = filtered.filter((movement) => movement.is_live);
      } else if (filters.status === "scheduled") {
        filtered = filtered.filter((movement) => !movement.is_live);
      }
    }

    // Minimum percentage filter
    const minPercentage = parseFloat(filters.minPercentage);
    if (minPercentage > 0) {
      filtered = filtered.filter((movement) => Math.abs(movement.change_percent) >= minPercentage);
    }

    setFilteredMovements(filtered);
  }, [searchQuery, filters, movements]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      severity: "all",
      timeframe: "all",
      direction: "all",
      minPercentage: "0",
      status: "all",
    });
    setSearchQuery("");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Kritik';
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Bilinmiyor';
    }
  };

  const formatTimeToKickoff = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}dk`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}s ${remainingMinutes}dk`;
  };

  // Render featured content component
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
            <Activity className="w-3 h-3" />
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
            
            {/* Features */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Anlık Analiz
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold">
                  Pro Algoritmalar
                </span>
              </div>
              <div className="text-purple-200">
                <span className="font-semibold">24/7 Takip</span>
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
      <MainContentHeader title="Akıllı Para Hareketleri" showSearchBar={false} />

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
              Filtreler ({filteredMovements.length} sonuç)
            </summary>
            <div className="mt-3 space-y-2">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="live">🔴 Canlı</SelectItem>
                  <SelectItem value="scheduled">🕐 Programlı</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Önem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="critical">🔴 Kritik</SelectItem>
                  <SelectItem value="high">🟠 Yüksek</SelectItem>
                  <SelectItem value="medium">🟡 Orta</SelectItem>
                  <SelectItem value="low">🔵 Düşük</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </details>

          {/* Desktop Filters */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="h-9 text-sm w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="live">🔴 Canlı</SelectItem>
                <SelectItem value="scheduled">🕐 Programlı</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
              <SelectTrigger className="h-9 text-sm w-32">
                <SelectValue placeholder="Önem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="critical">🔴 Kritik</SelectItem>
                <SelectItem value="high">🟠 Yüksek</SelectItem>
                <SelectItem value="medium">🟡 Orta</SelectItem>
                <SelectItem value="low">🔵 Düşük</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.minPercentage} onValueChange={(value) => handleFilterChange("minPercentage", value)}>
              <SelectTrigger className="h-9 text-sm w-28">
                <SelectValue placeholder="Min %" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tümü</SelectItem>
                <SelectItem value="10">%10+</SelectItem>
                <SelectItem value="20">%20+</SelectItem>
                <SelectItem value="30">%30+</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {filteredMovements.length} sonuç
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
            // Loading state
            [...Array(5)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredMovements.length > 0 ? (
            // Real data
            filteredMovements.map((movement, index) => (
              <div key={`${movement.id}-${index}`}>
                {/* Insert featured content after 2nd item */}
                {index === 2 && renderFeaturedContent()}
                
                <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all duration-200 cursor-pointer">
                  {/* Header with match info and live status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-iddaa-600 dark:group-hover:text-iddaa-800 transition-colors">
                          {movement.match}
                        </h3>
                        {movement.is_live && (
                          <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            CANLI
                          </div>
                        )}
                        <Badge className={`text-xs ${getSeverityColor(movement.severity)}`}>
                          {getSeverityText(movement.severity)}
                        </Badge>
                      </div>
                      
                      {/* League and sport info */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-iddaa-600 rounded-full"></span>
                            <span className="font-medium">{movement.league || 'Bilinmiyor'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Activity className="w-3 h-3" />
                          <span>{movement.sport || 'Futbol'}</span>
                        </div>
                      </div>
                      
                      {/* Market and outcome */}
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {movement.market_name}
                          </span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="text-xs font-bold text-iddaa-600 dark:text-iddaa-800">
                            {movement.outcome}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Odds change section */}
                    <div className="text-right ml-6">
                      <div className="flex items-center justify-end gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Eski Oran</div>
                          <div className="text-base text-gray-500 line-through font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                            {movement.previous_odds.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Yeni Oran</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white font-mono bg-iddaa-50 dark:bg-iddaa-900/20 px-3 py-2 rounded border-2 border-iddaa-200 dark:border-iddaa-700">
                            {movement.current_odds.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Change indicator */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                        movement.change_percent > 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {movement.change_percent > 0 ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>
                          {movement.change_percent > 0 ? '+' : ''}{movement.change_percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alert message */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4 border border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      🧠 <strong>Akıllı Analiz:</strong> {movement.alert_message}
                    </p>
                  </div>
                  
                  {/* Bottom info bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tespit: {new Date(movement.recorded_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Başlamaya: {formatTimeToKickoff(movement.minutes_to_kickoff)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                      🎯 Multiplier: {movement.multiplier.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No results state
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Sonuç Bulunamadı
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun akıllı para hareketi bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}