"use client";

import { Search } from "lucide-react";

export default function RightSidebar() {
  return (
    <div className="hidden lg:block w-80 p-4 sticky top-0 h-screen overflow-y-auto">
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search SignalOdds"
          className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-3 px-12 focus:outline-none focus:ring-2 focus:ring-iddaa-600"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
      </div>

      {/* Trending Predictions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
        <h3 className="font-bold text-xl p-4">Trending Predictions</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <p className="text-xs text-gray-500 mb-1">Sports • Trending</p>
              <p className="font-bold">#{item} Lakers vs Warriors</p>
              <p className="text-sm text-gray-500 mt-1">1.2K predictions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Models to Follow */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h3 className="font-bold text-xl p-4">Models to Follow</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-iddaa-100 flex items-center justify-center mr-3">
                  <span className="font-semibold">M{item}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">ML Model {item}</p>
                  <p className="text-sm text-gray-500">@model{item}</p>
                </div>
                <button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-4 py-1.5 text-sm font-bold">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-2">
        <span>Terms of Service</span>
        <span>•</span>
        <span>Privacy Policy</span>
        <span>•</span>
        <span>Cookie Policy</span>
        <span>•</span>
        <span>© 2025 SignalOdds</span>
      </div>
    </div>
  );
}
