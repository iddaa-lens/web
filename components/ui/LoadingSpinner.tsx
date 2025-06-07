import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Color of the spinner
   * @default "primary"
   */
  color?: "primary" | "secondary" | "muted" | "white";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * @default "Loading"
   */
  label?: string;
}

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className,
  label = "Loading",
}: LoadingSpinnerProps) => {
  // Map size to dimensions
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };

  // Map color to styles
  const colorClasses = {
    primary:
      "border-blue-600 border-t-transparent dark:border-blue-500 dark:border-t-transparent",
    secondary:
      "border-purple-600 border-t-transparent dark:border-purple-500 dark:border-t-transparent",
    muted:
      "border-gray-300 border-t-transparent dark:border-gray-600 dark:border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center" role="status">
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
