"use client";

import { Search } from "lucide-react";
import React from "react";

interface MainContentHeaderProps {
  title: string;
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function MainContentHeader({
  title,
  showSearchBar = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  searchQuery,
}: MainContentHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        <div className="flex items-center gap-4">
          {showSearchBar && (
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2.5 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                aria-label="Search"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={16}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
