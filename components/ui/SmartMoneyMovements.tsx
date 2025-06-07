"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SmartMoneyMovement {
  id: number;
  event_external_id: string;
  home_team: string;
  away_team: string;
  match?: string; // API includes match field
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
  severity?: 'low' | 'medium' | 'high' | 'critical'; // API doesn't include this
}

interface SmartMoneyResponse {
  movements: SmartMoneyMovement[];
  total: number;
  time_range: string;
}

const mockData: SmartMoneyResponse = {
  movements: [
    {
      id: 1,
      event_external_id: "12345",
      home_team: "Galatasaray",
      away_team: "Fenerbahçe",
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
      severity: 'high'
    },
    {
      id: 2,
      event_external_id: "12346",
      home_team: "Manchester City",
      away_team: "Arsenal",
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
      severity: 'medium'
    },
    {
      id: 3,
      event_external_id: "12347",
      home_team: "Barcelona",
      away_team: "Real Madrid",
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
      severity: 'critical'
    },
    {
      id: 4,
      event_external_id: "12348",
      home_team: "Beşiktaş",
      away_team: "Trabzonspor",
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
      severity: 'high'
    },
    {
      id: 5,
      event_external_id: "12349",
      home_team: "Liverpool",
      away_team: "Chelsea",
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
      severity: 'low'
    }
  ],
  total: 5,
  time_range: "24 hours"
};

export default function SmartMoneyMovements() {
  const [movements, setMovements] = useState<SmartMoneyMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSmartMoneyData = async () => {
      try {
        setIsLoading(true);
        // Real API implementation:
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/smart-money/big-movers`);
        if (response.ok) {
          const result = await response.json();
          // API returns data nested in 'data' object
          setMovements(result.data?.movements || []);
        } else {
          console.error('Failed to fetch smart money movements');
          // Fallback to mock data if API fails
          setMovements(mockData.movements);
        }
      } catch (error) {
        console.error("Akıllı para hareketleri yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmartMoneyData();
  }, []);

  const calculateSeverity = (changePercent: number, multiplier: number) => {
    const absChange = Math.abs(changePercent);
    if (absChange >= 30 || multiplier >= 1.5) return 'critical';
    if (absChange >= 20 || multiplier >= 1.3) return 'high';
    if (absChange >= 10 || multiplier >= 1.2) return 'medium';
    return 'low';
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
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
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movements.length > 0 ? (
        movements.slice(0, 4).map((movement) => (
          <div key={movement.id} className="group bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-iddaa-300 dark:hover:border-iddaa-600 transition-all duration-200 cursor-pointer">
            {/* Mobile-first responsive layout */}
            <div className="space-y-3">
              {/* Header row - team names and badges */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base group-hover:text-iddaa-600 dark:group-hover:text-iddaa-800 transition-colors truncate">
                    {movement.match || `${movement.home_team || ''} vs ${movement.away_team || ''}`.replace(' vs ', ' vs ').trim() || 'Maç Bilgisi'}
                  </h3>
                  {/* Mobile: Market info on second line */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{movement.market_name}</span>
                    <span>•</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{movement.outcome}</span>
                  </div>
                </div>
                
                {/* Badges row */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {movement.is_live && (
                    <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded-full text-xs font-bold">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      CANLI
                    </div>
                  )}
                  <Badge className={`text-xs ${getSeverityColor(calculateSeverity(movement.change_percent, movement.multiplier))}`} size="sm">
                    {getSeverityText(calculateSeverity(movement.change_percent, movement.multiplier))}
                  </Badge>
                </div>
              </div>

              {/* Odds comparison row - responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* Left side - Smart Money indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">Akıllı Para</span>
                  <span className="text-gray-500 dark:text-gray-400">Multiplier: {movement.multiplier.toFixed(1)}x</span>
                </div>
                
                {/* Right side - Odds display */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400 line-through">
                    {movement.previous_odds.toFixed(2)}
                  </span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {movement.current_odds.toFixed(2)}
                  </span>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    movement.change_percent > 0 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {movement.change_percent > 0 ? '↗' : '↙'}
                    {Math.abs(movement.change_percent).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Alert message - mobile optimized */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2.5 border border-purple-200 dark:border-purple-700">
                <p className="text-xs md:text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
                  🧠 {movement.alert_message}
                </p>
              </div>
              
              {/* Bottom info bar - mobile responsive */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <span>⏱️ {formatTimeToKickoff(movement.minutes_to_kickoff)}</span>
                  <span>•</span>
                  <span>🕐 {new Date(movement.recorded_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="hidden xs:flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                  💡 Akıllı Analiz
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-600 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">
            Akıllı Para Hareketi Yok
          </h4>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Şu anda büyük akıllı para hareketi tespit edilmedi.
          </p>
        </div>
      )}
    </div>
  );
}