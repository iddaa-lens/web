"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Header() {
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-iddaa-600 dark:text-iddaa-800">
              IddaaLens
            </h1>
            <p className="hidden md:block text-gray-600 dark:text-gray-400">
              Bahis Analiz Platformu
            </p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-iddaa-50 hover:bg-iddaa-100 dark:bg-iddaa-950 dark:hover:bg-iddaa-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5 text-iddaa-600 dark:text-iddaa-400" /> : <Moon className="h-5 w-5 text-iddaa-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
