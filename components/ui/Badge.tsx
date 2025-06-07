import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white dark:bg-blue-600 dark:text-white",
        secondary:
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        outline: "border bg-transparent text-gray-900 dark:text-gray-100",
        destructive: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // Maintain backward compatibility with color prop
  color?: "gray" | "red" | "yellow" | "green" | "blue" | "purple" | "pink";
}

function Badge({
  className,
  variant,
  size,
  color,
  children,
  ...props
}: BadgeProps) {
  // Legacy color support
  const colorClasses = color
    ? {
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        yellow:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        green:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      }[color]
    : "";

  return (
    <div
      className={cn(badgeVariants({ variant, size }), colorClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
export default Badge;
