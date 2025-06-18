"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export interface AIPrediction {
  id: string;
  slug: string;
  homeTeam: string;
  homeTeamSlug: string;
  awayTeam: string;
  awayTeamSlug: string;
  league: string;
  leagueSlug: string;
  time: string;
  prediction: {
    outcome: "1" | "X" | "2" | "1X" | "X2" | "12"; // 1=Home, X=Draw, 2=Away
    confidence: number; // 0-100
    reasoning: string;
    odds: number;
  };
  predictor: {
    name: string;
    slug: string;
    avatar?: string; // Optional avatar/icon identifier
    specialty?: string; // e.g., "Premier League Uzmanı"
  };
  accuracy?: {
    last7Days: number;
    last30Days: number;
  };
}

interface AIPredictionsProps {
  predictions: AIPrediction[];
  onPredictionClick?: (prediction: AIPrediction) => void;
  maxItems?: number;
}

export function AIPredictions({
  predictions,
  onPredictionClick,
  maxItems = 5,
}: AIPredictionsProps) {
  const displayPredictions = predictions.slice(0, maxItems);

  const getOutcomeLabel = (outcome: string) => {
    const labels: Record<string, string> = {
      "1": "Ev Sahibi",
      "X": "Beraberlik",
      "2": "Deplasman",
      "1X": "Ev veya Beraberlik",
      "X2": "Beraberlik veya Deplasman",
      "12": "Ev veya Deplasman",
    };
    return labels[outcome] || outcome;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 dark:text-green-400";
    if (confidence >= 65) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="w-3 h-3" />;
    if (confidence >= 65) return <AlertCircle className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="space-y-2">
        {displayPredictions.map((prediction) => (
          <div
            key={prediction.id}
            onClick={() => onPredictionClick?.(prediction)}
            className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-2.5 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
          >
            <div className="space-y-1.5">
              {/* First row: Match info + Time + Prediction */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="text-[11px] sm:text-xs text-gray-900 dark:text-white truncate">
                    <Link 
                      href={`/teams/${prediction.homeTeamSlug}`}
                      className="font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {prediction.homeTeam}
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400 mx-1">-</span>
                    <Link 
                      href={`/teams/${prediction.awayTeamSlug}`}
                      className="font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {prediction.awayTeam}
                    </Link>
                  </div>
                  <Link 
                    href={`/leagues/${prediction.leagueSlug}`}
                    className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {prediction.league}
                  </Link>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {prediction.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                    {getOutcomeLabel(prediction.prediction.outcome)}
                  </span>
                  <span className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-medium">
                    @{prediction.prediction.odds.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Second row: AI info + Confidence */}
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px]">
                <Link 
                  href={`/models/${prediction.predictor.slug}`}
                  className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {prediction.predictor.name}
                </Link>
                <div className={`flex items-center gap-1 ${getConfidenceColor(prediction.prediction.confidence)}`}>
                  {getConfidenceIcon(prediction.prediction.confidence)}
                  <span className="font-medium">
                    %{prediction.prediction.confidence}
                  </span>
                </div>
                {prediction.predictor.specialty && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {prediction.predictor.specialty}
                  </span>
                )}
              </div>

              {/* Reasoning - always show but truncated in compact mode */}
              <div className="mt-1">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                  {prediction.prediction.reasoning}...
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// Mock data for development
export const mockAIPredictions: AIPrediction[] = [
  {
    id: "1",
    slug: "liverpool-chelsea-20241218-algoritma-usta",
    homeTeam: "Liverpool",
    homeTeamSlug: "liverpool",
    awayTeam: "Chelsea",
    awayTeamSlug: "chelsea",
    league: "Premier League",
    leagueSlug: "premier-league",
    time: "20:00",
    prediction: {
      outcome: "1",
      confidence: 87,
      reasoning: "Ev sahibi son 5 maçta yenilmedi, deplasman takımı 3 eksik",
      odds: 1.85,
    },
    predictor: {
      name: "Algoritma Usta",
      slug: "algoritma-usta",
      specialty: "Premier League Uzmanı",
    },
    accuracy: {
      last7Days: 82,
      last30Days: 79,
    },
  },
  {
    id: "2",
    slug: "real-madrid-barcelona-20241218-yapay-zeki",
    homeTeam: "Real Madrid",
    homeTeamSlug: "real-madrid",
    awayTeam: "Barcelona",
    awayTeamSlug: "barcelona",
    league: "La Liga",
    leagueSlug: "la-liga",
    time: "21:00",
    prediction: {
      outcome: "X",
      confidence: 72,
      reasoning: "Son 4 El Clasico'nun 3'ü berabere bitti",
      odds: 3.20,
    },
    predictor: {
      name: "Yapay Zeki",
      slug: "yapay-zeki",
      specialty: "El Clasico Analisti",
    },
  },
  {
    id: "3",
    slug: "bayern-munich-dortmund-20241218-robotahmin",
    homeTeam: "Bayern Munich",
    homeTeamSlug: "bayern-munich",
    awayTeam: "Dortmund",
    awayTeamSlug: "dortmund",
    league: "Bundesliga",
    leagueSlug: "bundesliga",
    time: "19:30",
    prediction: {
      outcome: "1",
      confidence: 91,
      reasoning: "Bayern evinde 15 maçtır kaybetmiyor",
      odds: 1.65,
    },
    predictor: {
      name: "RoboTahmin",
      slug: "robotahmin",
      specialty: "Bundesliga Uzmanı",
    },
  },
  {
    id: "4",
    slug: "milan-inter-20241218-akil-kupu",
    homeTeam: "Milan",
    homeTeamSlug: "milan",
    awayTeam: "Inter",
    awayTeamSlug: "inter",
    league: "Serie A",
    leagueSlug: "serie-a",
    time: "21:45",
    prediction: {
      outcome: "2",
      confidence: 68,
      reasoning: "Inter form üstünlüğüne sahip, son 7 maçta 6 galibiyet",
      odds: 2.40,
    },
    predictor: {
      name: "Akıl Küpü",
      slug: "akil-kupu",
      specialty: "Serie A Analisti",
    },
  },
  {
    id: "5",
    slug: "psg-lyon-20241218-veri-ustasi",
    homeTeam: "PSG",
    homeTeamSlug: "psg",
    awayTeam: "Lyon",
    awayTeamSlug: "lyon",
    league: "Ligue 1",
    leagueSlug: "ligue-1",
    time: "22:00",
    prediction: {
      outcome: "1X",
      confidence: 85,
      reasoning: "PSG evinde çok güçlü, Lyon deplasmanda zorlanıyor",
      odds: 1.25,
    },
    predictor: {
      name: "Veri Ustası",
      slug: "veri-ustasi",
      specialty: "Ligue 1 Uzmanı",
    },
  },
];