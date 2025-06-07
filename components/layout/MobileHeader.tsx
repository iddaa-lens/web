"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Center: Logo */}
        <div className="flex items-center">
          <Image
            src="/logo_transparent_larger.png"
            alt="Web Logo"
            width={28}
            height={28}
            className="mr-2"
          />
          <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Web
          </h1>
        </div>

        {/* Right: Placeholder */}
        <div className="w-8 h-8">
          {/* Empty space for layout balance */}
        </div>
      </div>
    </header>
  );
}