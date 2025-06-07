"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  status?: ToastType;
  duration?: number;
  isClosable?: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

interface ToastContextValue {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

// Context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast component
const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
  title,
  description,
  status = "info",
  isClosable = true,
  onClose,
}) => {
  // Icons based on status
  const StatusIcon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[status];

  // Color classes based on status
  const statusClasses = {
    success:
      "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400",
    error:
      "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400",
    warning:
      "bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400",
    info: "bg-iddaa-50 border-iddaa-500 text-iddaa-700 dark:bg-iddaa-900/20 dark:border-iddaa-600 dark:text-iddaa-400",
  }[status];

  const iconClasses = {
    success: "text-green-500 dark:text-green-400",
    error: "text-red-500 dark:text-red-400",
    warning: "text-yellow-500 dark:text-yellow-400",
    info: "text-iddaa-500 dark:text-iddaa-400",
  }[status];

  return (
    <motion.div
      className={cn(
        "flex w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
        statusClasses
      )}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex w-full p-4">
        <div className="flex-shrink-0 mr-3">
          <StatusIcon className={cn("h-5 w-5", iconClasses)} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <div className="mt-1 text-sm opacity-90">{description}</div>
          )}
        </div>
        {isClosable && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 -mt-1 -mr-1 rounded-full p-1 
              hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = {
        ...props,
        id,
        duration: props.duration || 5000,
        isClosable: props.isClosable !== undefined ? props.isClosable : true,
        position: props.position || "top-right",
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Auto dismiss toast after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [removeToast]
  );

  const value = { toasts, toast, removeToast, removeAllToasts };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Container component
const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast } = context;

  // Group toasts by position
  const topRight = toasts.filter(
    (t) => t.position === "top-right" || !t.position
  );
  const topLeft = toasts.filter((t) => t.position === "top-left");
  const bottomRight = toasts.filter((t) => t.position === "bottom-right");
  const bottomLeft = toasts.filter((t) => t.position === "bottom-left");
  const topCenter = toasts.filter((t) => t.position === "top-center");
  const bottomCenter = toasts.filter((t) => t.position === "bottom-center");

  return (
    <>
      {/* Top Right */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {topRight.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Left */}
      <div className="fixed top-0 left-0 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {topLeft.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Right */}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {bottomRight.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Left */}
      <div className="fixed bottom-0 left-0 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {bottomLeft.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Center */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {topCenter.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Center */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 p-4 space-y-4 pointer-events-none">
        <AnimatePresence>
          {bottomCenter.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={() => removeToast(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

// Hook
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context.toast;
};

export default Toast;
