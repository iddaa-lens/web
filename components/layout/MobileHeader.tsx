"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, Sun, Moon } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-iddaa-50 dark:hover:bg-iddaa-950 rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Center: Logo */}
        <div className="flex items-center">
          <Image
            src="/logo-200.png"
            alt="IddaaLens Logo"
            width={28}
            height={28}
            className="mr-2"
          />
          <h1 className="text-lg font-bold text-iddaa-600 dark:text-iddaa-800">
            IddaaLens
          </h1>
        </div>

        {/* Right: Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-iddaa-50 dark:hover:bg-iddaa-950 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} className="text-iddaa-600 dark:text-iddaa-400" /> : <Moon size={20} className="text-iddaa-600" />}
        </button>
      </div>
    </header>
  );
}