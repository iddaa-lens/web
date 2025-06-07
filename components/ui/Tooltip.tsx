import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  /**
   * Content to display in the tooltip
   */
  content: ReactNode;

  /**
   * Element that triggers the tooltip
   */
  children: ReactNode;

  /**
   * Position of the tooltip relative to the trigger
   * @default 'top'
   */
  position?: TooltipPosition;

  /**
   * Delay before showing tooltip (ms)
   * @default 300
   */
  delay?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
  className = "",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate tooltip position based on trigger element
  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.right + scrollX + 8;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + 8;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
    }

    // Keep tooltip within viewport
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width;
    }
    if (top + tooltipRect.height > window.innerHeight + scrollY) {
      top = window.innerHeight + scrollY - tooltipRect.height;
    }

    setTooltipPosition({ top, left });
  }, [position]);

  // Show tooltip after delay
  const handleMouseEnter = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after state update
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  // Hide tooltip
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Handle keyboard focus events for accessibility
  const handleFocus = handleMouseEnter;
  const handleBlur = handleMouseLeave;

  // Update position if window resizes
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isVisible, calculatePosition]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get appropriate classes based on position
  const getTooltipClasses = () => {
    const baseClasses =
      "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-800 dark:bg-gray-700 rounded shadow-md max-w-xs pointer-events-none whitespace-normal";

    const positionClasses = {
      top: "bottom-full mb-2",
      right: "left-full ml-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
    };

    return `${baseClasses} ${positionClasses[position] || ""} ${className}`;
  };

  return (
    <div
      className="inline-block relative"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={getTooltipClasses()}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
            aria-hidden={!isVisible}
          >
            <div className="relative z-10">{content}</div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Create a tooltip context
const TooltipContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: React.ReactNode;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}>({
  open: false,
  setOpen: () => {},
  content: null,
  setContent: () => {},
});

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen, content, setContent }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children, asChild = false }) => {
  const { setOpen } = useContext(TooltipContext);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  if (asChild) {
    // Type assertion to make TypeScript understand this element can accept mouse events
    return React.cloneElement(
      children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
      {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    );
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

export const TooltipContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { open } = useContext(TooltipContext); // Remove 'content' since it's not used

  if (!open) {
    return null;
  }

  // Just render the children passed to the component
  return <div>{children}</div>;
};

// Export both the original Tooltip and the new compound components
export default Tooltip;
