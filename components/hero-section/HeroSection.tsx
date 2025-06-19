"use client";

import { SportsResponsive } from "@/components/sports";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  selectedSports?: string[];
  onSportsSelect?: (sports: string[]) => void;
  showSports?: boolean;
  className?: string;
}

export function HeroSection({
  title = "Akıllı bahis analizi",
  subtitle = "Yapay zeka destekli tahminler ve gerçek zamanlı oran takibi ile kazanma şansınızı artırın.",
  selectedSports = ["all"],
  onSportsSelect,
  showSports = true,
  className = "",
}: HeroSectionProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4 sm:px-0">
          {subtitle}
        </p>
      </div>

      {showSports && (
        <div className="mb-6 sm:mb-8 flex justify-center">
          <SportsResponsive
            selectedSports={selectedSports}
            onSportsSelect={onSportsSelect}
            showCounts={true}
            showPredictions={true}
            showHotBadge={true}
            variant="grid"
            spacing="tight"
          />
        </div>
      )}
    </div>
  );
}