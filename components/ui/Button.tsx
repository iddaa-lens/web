"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-iddaa-600 text-white hover:bg-iddaa-700 dark:bg-iddaa-800 dark:hover:bg-iddaa-600",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
        outline:
          "border border-gray-300 bg-transparent hover:bg-iddaa-50 hover:text-iddaa-900 dark:border-gray-600 dark:hover:bg-iddaa-950 dark:hover:text-white",
        secondary:
          "bg-iddaa-50 text-iddaa-900 hover:bg-iddaa-100 dark:bg-iddaa-950 dark:text-white dark:hover:bg-iddaa-900",
        ghost:
          "hover:bg-iddaa-50 hover:text-iddaa-900 dark:hover:bg-iddaa-950 dark:hover:text-white",
        link: "text-iddaa-600 underline-offset-4 hover:underline dark:text-iddaa-800",
        success:
          "bg-iddaa-500 text-white hover:bg-iddaa-600 dark:bg-iddaa-400 dark:hover:bg-iddaa-500",
        // Custom variants for our app
        primary: "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
        odds: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700/50 dark:text-gray-100 dark:hover:bg-gray-700/50",
        sport: "border transition-all hover:scale-105 relative",
        sportSelected: "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-300 text-white dark:text-gray-900",
        sportDefault: "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100",
        navIcon: "hover:bg-gray-100 dark:hover:bg-gray-800",
        navMenu: "w-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 justify-start",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        xs: "h-7 px-3 py-1.5 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8 p-1.5",
        // Custom sizes
        odds: "w-12 py-1 text-xs",
        sport: "w-28 h-20 p-3",
        navMenu: "px-6 py-3 text-sm",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will take up the full width of its container
   */
  fullWidth?: boolean;

  /**
   * If provided, the button will be rendered as a child of this element
   */
  asChild?: boolean;

  /**
   * Shows a loading spinner and disables the button
   */
  isLoading?: boolean;

  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component for user interaction
 *
 * @example
 * ```tsx
 * <Button>Click me</Button>
 * <Button variant="outline" size="sm">Small outline button</Button>
 * <Button isLoading>Loading state</Button>
 * <Button leftIcon={<Check />}>With icon</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2 -ml-1">{leftIcon}</span>
        )}
        {children}
        {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
