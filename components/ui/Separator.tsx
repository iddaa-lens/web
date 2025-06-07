import React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Decorative separators should be hidden from screen readers
   * @default true
   */
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-gray-200 dark:bg-gray-700",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...(decorative ? { "aria-hidden": true } : { role: "separator" })}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export default Separator;
