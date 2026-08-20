"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  Toast,
  type ToastData,
  type ToastType,
} from ".";

type ToastContextValue = {
  toast: (
    message: string,
    options?: {
      title?: string;
      type?: ToastType;
      duration?: number;
    }
  ) => void;

  success: (
    message: string,
    options?: {
      title?: string;
      duration?: number;
    }
  ) => void;

  error: (
    message: string,
    options?: {
      title?: string;
      duration?: number;
    }
  ) => void;

  warning: (
    message: string,
    options?: {
      title?: string;
      duration?: number;
    }
  ) => void;

  info: (
    message: string,
    options?: {
      title?: string;
      duration?: number;
    }
  ) => void;
};

const ToastContext =
  React.createContext<ToastContextValue | null>(null);

export function Toaster({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = React.useCallback(
    (
      message: string,
      options: {
        title?: string;
        type?: ToastType;
        duration?: number;
      } = {}
    ) => {
      const id = crypto.randomUUID();

      const newToast: ToastData = {
        id,
        description: message,
        title: options.title,
        type: options.type ?? "info",
      };

      setToasts((current) => [...current, newToast]);

      const duration = options.duration ?? 4000;

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toast: addToast,

      success: (message, options) =>
        addToast(message, {
          ...options,
          type: "success",
        }),

      error: (message, options) =>
        addToast(message, {
          ...options,
          type: "error",
        }),

      warning: (message, options) =>
        addToast(message, {
          ...options,
          type: "warning",
        }),

      info: (message, options) =>
        addToast(message, {
          ...options,
          type: "info",
        }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="
          pointer-events-none
          fixed
          right-4
          top-4
          z-50
          flex
          w-[calc(100%-2rem)]
          max-w-sm
          flex-col
          gap-3
        "
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{
                opacity: 0,
                x: 40,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 40,
                scale: 0.95,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="pointer-events-auto"
            >
              <Toast
                toast={toast}
                onClose={removeToast}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside <Toaster />"
    );
  }

  return context;
}