"use client";

import { useState } from "react";
import { Search, Menu, X, Sun, Moon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDarkMode } from "@/hooks/useDarkMode";

interface NavigationProps {
  onMenuClick: () => void;
  onRegisterClick?: () => void;
}

export function Navigation({ onMenuClick, onRegisterClick }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Search:", searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 transition-colors duration-300 shadow-sm dark:shadow-gray-900/50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              IddaaLens
            </h1>
            <Button
              onClick={onMenuClick}
              variant="navIcon"
              size="iconSm"
              aria-label="Open menu"
              className="touch-target"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showSearch ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false);
                    }}
                    className="w-40 sm:w-48 md:w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md py-1.5 pl-3 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all"
                    aria-label="Search"
                  />
                </div>
                <Button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  variant="navIcon"
                  size="iconSm"
                  type="button"
                  aria-label="Close search"
                  className="touch-target"
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <>
                <Button
                  onClick={() => setShowSearch(true)}
                  variant="navIcon"
                  size="iconSm"
                  className="rounded-md touch-target"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </Button>
                {mounted && (
                  <Button
                    onClick={toggleDarkMode}
                    variant="navIcon"
                    size="iconSm"
                    className="rounded-md touch-target"
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    )}
                  </Button>
                )}
                <Button
                  onClick={onRegisterClick}
                  variant="navIcon"
                  size="iconSm"
                  className="rounded-md touch-target"
                  aria-label="Register"
                >
                  <UserPlus className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}