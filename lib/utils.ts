import { format, isToday, isThisWeek, parseISO } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // For today's date, show time only
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // For dates within the last 7 days, show day name and time
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  if (date > sevenDaysAgo) {
    return date.toLocaleString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // For older dates, show full date
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format a date string using standard formats or a custom format pattern
 *
 * @param dateString - ISO date string to format
 * @param formatPattern - Optional format pattern (date-fns syntax)
 * @returns Formatted date string
 */
export function formatDateWithPattern(dateString: string, formatPattern?: string): string {
  try {
    // Handle invalid or empty date strings
    if (!dateString) return "Date unknown";

    const date = parseISO(dateString);

    // If invalid date, return fallback
    if (isNaN(date.getTime())) return "Invalid date";

    // If format pattern is provided, use it directly
    if (formatPattern) {
      return format(date, formatPattern);
    }

    // Smart contextual formatting when no pattern provided
    if (isToday(date)) {
      return format(date, "'Today at' h:mm a");
    }

    if (isThisWeek(date)) {
      return format(date, "EEEE 'at' h:mm a"); // e.g., "Monday at 2:30 PM"
    }

    // This year
    const now = new Date();
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d 'at' h:mm a"); // e.g., "May 7 at 2:30 PM"
    }

    // Different year
    return format(date, "MMM d, yyyy 'at' h:mm a"); // e.g., "May 7, 2024 at 2:30 PM"
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date format error";
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
