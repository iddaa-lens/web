"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ArrowRight,
  Flame,
  Activity,
  Calendar,
  Brain,
  Bot,
  Users,
  Trophy,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SportsResponsive } from "@/components/sports";
import { Events, mockEvents } from "@/components/events";
import { Navigation } from "@/components/navigation";

interface TrendingMatch {
  id: string;
  teams: string;
  league: string;
  change: number;
  time: string;
}

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
  const [selectedSports, setSelectedSports] = useState<string[]>(["all"]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navigation */}
      <Navigation 
        onMenuClick={() => setDrawerOpen(!drawerOpen)}
        onRegisterClick={() => router.push("/register")}
      />

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
      <div className="h-12 sm:h-14"></div>

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
        <div className="mb-8 flex justify-center">
          <SportsResponsive
            selectedSports={selectedSports}
            onSportsSelect={setSelectedSports}
            showCounts={true}
            showPredictions={true}
            showHotBadge={true}
            variant="grid"
            spacing="tight"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-red-500" />
                Maçlar
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

            <Events
              events={mockEvents}
              selectedSports={selectedSports}
              onEventClick={(event) => router.push(`/events/${event.id}`)}
              onOddsClick={(event, market) => console.log('Bet on', event.id, market)}
              showPredictions={true}
              showOdds={true}
              showLeague={true}
              showTime={true}
              variant="list"
              spacing="tight"
              maxItems={6}
            />
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
