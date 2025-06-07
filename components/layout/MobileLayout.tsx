"use client";

import { useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={openDrawer} />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Main Content */}
      <main className="w-full min-h-screen safe-area-inset">
        {children}
      </main>
    </div>
  );
}