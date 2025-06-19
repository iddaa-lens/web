"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockEvents } from "@/components/events";
import { Navigation } from "@/components/navigation";
import { LeftDrawer } from "@/components/left-drawer";
import { HeroSection } from "@/components/hero-section";
import { mockAIPredictions } from "@/components/ai-predictions";
import { ContentSections } from "@/components/content-sections";


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
      <HeroSection 
        selectedSports={selectedSports}
        onSportsSelect={setSelectedSports}
      />

      {/* Content Sections */}
      <ContentSections 
        events={mockEvents}
        predictions={mockAIPredictions}
        selectedSports={selectedSports}
      />
    </div>
  );
}
