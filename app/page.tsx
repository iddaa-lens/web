"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  ArrowRight,
  Flame,
  Activity,
  Menu,
  X,
  Calendar,
  Brain,
  Bot,
  Users,
  Trophy,
  Gamepad2,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDarkMode } from "@/hooks/useDarkMode";

// Mock data interfaces
interface SportCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  isPopular?: boolean;
  predictions?: number;
}

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  league: string;
  minute: number;
  status: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

interface TrendingMatch {
  id: string;
  teams: string;
  league: string;
  change: number;
  time: string;
}

// Mock data
const sportCategories: SportCategory[] = [
  {
    id: "all",
    name: "Tümü",
    icon: "🏆",
    count: 2468,
    isPopular: true,
    predictions: 45,
  },
  {
    id: "football",
    name: "Futbol",
    icon: "⚽",
    count: 1247,
    isPopular: true,
    predictions: 38,
  },
  {
    id: "basketball",
    name: "Basketbol",
    icon: "🏀",
    count: 324,
    isPopular: true,
    predictions: 22,
  },
  {
    id: "tennis",
    name: "Tenis",
    icon: "🎾",
    count: 189,
    isPopular: true,
    predictions: 15,
  },
  {
    id: "volleyball",
    name: "Voleybol",
    icon: "🏐",
    count: 89,
    predictions: 12,
  },
  { id: "hockey", name: "Hokey", icon: "🏒", count: 76, predictions: 10 },
  {
    id: "esports",
    name: "E-Spor",
    icon: "🎮",
    count: 156,
    isPopular: true,
    predictions: 28,
  },
];

const liveMatches: LiveMatch[] = [
  {
    id: "1",
    homeTeam: "Fenerbahçe",
    awayTeam: "Beşiktaş",
    homeScore: 2,
    awayScore: 1,
    league: "Süper Lig",
    minute: 78,
    status: "LIVE",
    homeOdds: 1.85,
    drawOdds: 3.2,
    awayOdds: 4.5,
  },
  {
    id: "2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 0,
    awayScore: 0,
    league: "La Liga",
    minute: 23,
    status: "LIVE",
    homeOdds: 2.4,
    drawOdds: 3.1,
    awayOdds: 2.9,
  },
  {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    homeScore: 1,
    awayScore: 1,
    league: "Premier League",
    minute: 67,
    status: "LIVE",
    homeOdds: 1.95,
    drawOdds: 3.4,
    awayOdds: 3.85,
  },
];

const trendingMatches: TrendingMatch[] = [
  {
    id: "1",
    teams: "Liverpool - Chelsea",
    league: "Premier League",
    change: 15.2,
    time: "20:00",
  },
  {
    id: "2",
    teams: "Inter - Milan",
    league: "Serie A",
    change: 12.8,
    time: "21:45",
  },
  {
    id: "3",
    teams: "Dortmund - Bayern",
    league: "Bundesliga",
    change: 18.5,
    time: "19:30",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [showSearch, setShowSearch] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">IddaaLens</h1>
              <Button
                onClick={() => setDrawerOpen(!drawerOpen)}
                variant="navIcon"
                size="iconSm"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {showSearch ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery) setShowSearch(false);
                      }}
                      className="w-48 sm:w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md py-1.5 pl-3 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  <Button
                    onClick={() => setShowSearch(false)}
                    variant="navIcon"
                    size="iconSm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setShowSearch(true)}
                    variant="navIcon"
                    size="iconSm"
                    className="rounded-md"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                  {mounted && (
                    <Button
                      onClick={toggleDarkMode}
                      variant="navIcon"
                      size="iconSm"
                      className="rounded-md"
                      aria-label="Toggle dark mode"
                    >
                      {isDarkMode ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-700" />
                      )}
                    </Button>
                  )}
                  <Button variant="primary" size="xs">
                    Kayıt Ol
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Left Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      </div>

      <div
        className={`fixed top-12 left-0 h-[calc(100vh-3rem)] w-64 bg-white dark:bg-gray-950 z-50 transform transition-all duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex items-center justify-center">
          <nav className="space-y-2">
            <Button
              onClick={() => {
                router.push("/events");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Calendar className="w-4 h-4" />}
              className="rounded-md"
            >
              Etkinlikler
            </Button>
            <Button
              onClick={() => {
                router.push("/predictions");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Brain className="w-4 h-4" />}
              className="rounded-md"
            >
              Tahminler
            </Button>
            <Button
              onClick={() => {
                router.push("/ai-models");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Bot className="w-4 h-4" />}
              className="rounded-md"
            >
              AI Modelleri
            </Button>
            <Button
              onClick={() => {
                router.push("/teams");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Users className="w-4 h-4" />}
              className="rounded-md"
            >
              Takımlar
            </Button>
            <Button
              onClick={() => {
                router.push("/leagues");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Trophy className="w-4 h-4" />}
              className="rounded-md"
            >
              Ligler
            </Button>
            <Button
              onClick={() => {
                router.push("/sports");
                setDrawerOpen(false);
              }}
              variant="navMenu"
              size="navMenu"
              leftIcon={<Gamepad2 className="w-4 h-4" />}
              className="rounded-md"
            >
              Sporlar
            </Button>
          </nav>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-12"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Akıllı bahis analizi
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Yapay zeka destekli tahminler ve gerçek zamanlı oran takibi ile
            kazanma şansınızı artırın.
          </p>
        </div>

        {/* Sports Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {sportCategories.map((sport) => (
              <Button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                variant={
                  selectedSport === sport.id ? "sportSelected" : "sportDefault"
                }
                size="sport"
                className="rounded-lg"
              >
                {sport.isPopular && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" />
                      HOT
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xl mb-1">{sport.icon}</div>
                  <div className="text-xs font-medium">{sport.name}</div>
                  <div className="text-[10px] opacity-75">
                    {sport.count} maç
                  </div>
                  <div className="text-[10px] opacity-75">
                    {sport.predictions || 10} tahmin
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Matches */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-red-500" />
                Canlı Maçlar
              </h2>
              <Button
                onClick={() => router.push("/events")}
                variant="link"
                size="xs"
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
              >
                Tümünü gör
              </Button>
            </div>

            <div className="space-y-2">
              {liveMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Time and League */}
                      <div className="w-24 flex-shrink-0">
                        <div className="flex items-center gap-1 text-red-500 mb-1">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-medium">
                            {match.minute}&apos;
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          {match.league}
                        </div>
                      </div>

                      {/* Home Team */}
                      <div className="w-48 flex items-center justify-start gap-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {match.homeTeam}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="w-20 text-center flex-shrink-0">
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          {match.homeScore} - {match.awayScore}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="w-48 flex items-center justify-end gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate text-right">
                          {match.awayTeam}
                        </span>
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                      </div>
                    </div>

                    {/* Odds */}
                    <div className="flex gap-1.5">
                      <Button
                        variant="odds"
                        size="odds"
                        className="rounded font-medium"
                      >
                        {match.homeOdds}
                      </Button>
                      <Button
                        variant="odds"
                        size="odds"
                        className="rounded font-medium"
                      >
                        {match.drawOdds}
                      </Button>
                      <Button
                        variant="odds"
                        size="odds"
                        className="rounded font-medium"
                      >
                        {match.awayOdds}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Popüler
              </h2>
            </div>

            <div className="space-y-2">
              {trendingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-xs">
                        {match.teams}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {match.league} • {match.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {match.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => router.push("/events/odds/movements")}
              variant="primary"
              size="sm"
              fullWidth
              className="mt-4 rounded-md font-medium"
            >
              Tüm oran hareketlerini gör
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
