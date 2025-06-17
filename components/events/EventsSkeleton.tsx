"use client";

export function EventsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" data-testid="events-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="animate-pulse">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex justify-end mt-2">
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}