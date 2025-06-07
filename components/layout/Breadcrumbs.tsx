"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Type for our breadcrumb items
type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrentPage: boolean;
};

// Custom labels for specific routes
const customLabels: Record<string, string> = {
  leagues: "Leagues",
  events: "Events",
  predictions: "Predictions",
  teams: "Teams",
  models: "Models",
  leaderboard: "Leaderboard",
  movements: "Movements",
  odds: "Odds",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on homepage
  if (pathname === "/") return null;

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/", isCurrentPage: pathname === "/" },
    ];

    // Split the path into segments, filter out empty segments
    const segments = pathname.split("/").filter((segment) => segment);

    // Build up paths progressively
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;

      // Check if the segment is a dynamic path parameter (UUID pattern)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        );

      // Determine the label based on the segment
      let label = segment;

      // If it's a known route, use the custom label
      if (customLabels[segment]) {
        label = customLabels[segment];
      }
      // For dynamic route parameters like IDs, create a more descriptive label
      else if (isUUID) {
        // Get the previous segment to determine what type of item this is
        const entityType = segments[index - 1];
        if (entityType) {
          // Remove trailing 's' if it exists (e.g., "leagues" -> "League")
          const singularEntityType = entityType.endsWith("s")
            ? entityType.slice(0, -1)
            : entityType;

          // Capitalize first letter
          label = `${singularEntityType
            .charAt(0)
            .toUpperCase()}${singularEntityType.slice(1)} Details`;
        } else {
          label = "Details";
        }
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLastSegment,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <ol className="max-w-7xl mx-auto flex flex-wrap items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={breadcrumb.href} className="flex items-center">
              {index === 0 ? (
                // Home icon for first item
                <Link
                  href={breadcrumb.href}
                  className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-current={breadcrumb.isCurrentPage ? "page" : undefined}
                >
                  <Home size={16} className="mr-1" />
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              ) : (
                <>
                  <ChevronRight
                    size={16}
                    className="mx-1 text-gray-400"
                    aria-hidden="true"
                  />
                  {isLast ? (
                    // Current page is not a link
                    <span
                      className="font-medium text-gray-800 dark:text-gray-200"
                      aria-current="page"
                    >
                      {breadcrumb.label}
                    </span>
                  ) : (
                    // Navigable breadcrumb
                    <Link
                      href={breadcrumb.href}
                      className="hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
