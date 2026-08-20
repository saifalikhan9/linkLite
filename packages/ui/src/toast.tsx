import * as React from "react";
import { Check, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "./lib/utills";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
};

type ToastProps = {
  toast: ToastData;
  onClose: (id: string) => void;
};

const icons = {
  success: Check,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
};

const typeStyles = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",

        typeStyles[toast.type],
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconStyles[toast.type])} />

      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}

        {toast.description && (
          <p className="mt-1 text-sm opacity-80">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
