"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Activity,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SportsResponsive } from "@/components/sports";
import { Events, mockEvents } from "@/components/events";
import { Navigation } from "@/components/navigation";
import { LeftDrawer } from "@/components/left-drawer";
import { AIPredictions, mockAIPredictions } from "@/components/ai-predictions";


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
      <LeftDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

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

          {/* AI Predictions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-500" />
                AI Tahminleri
              </h2>
              <Button
                onClick={() => router.push("/predictions")}
                variant="link"
                size="xs"
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
              >
                Tümünü gör
              </Button>
            </div>

            <AIPredictions
              predictions={mockAIPredictions}
              onPredictionClick={(prediction) => router.push(`/predictions/${prediction.slug}`)}
              maxItems={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
