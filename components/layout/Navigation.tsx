"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  // Helper function to determine active link
  const isActive = (path: string) => pathname === path;

  // Navigation items config for easier maintenance
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/predictions", label: "Predictions" },
    { href: "/leagues", label: "Leagues" },
    { href: "/teams", label: "Teams" },
    { href: "/models", label: "All Models" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                isActive(item.href)
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
