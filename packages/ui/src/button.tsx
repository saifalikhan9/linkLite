import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utills";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center w-full",
    "cursor-pointer",
    "rounded-md",
    "transition-shadow duration-200",
    "focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "shadow-[inset_0_0_3px_1px_rgba(255,255,255,0)]",
    "hover:shadow-[inset_0_0_3px_1px_rgba(255,255,255,0.25)]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary",
          "text-white",
          "text-shadow-xs",
          "border border-blue-400",
          "ring-1 ring-primary",
        ].join(" "),
        secondary: [
          "bg-neutral-800",
          "text-white",
          "text-shadow-xs text-shadow-neutral-700",
          "border border-neutral-500",
          "ring-1 ring-neutral-800",
        ].join(" "),
        destructive: [
          "bg-red-500",
          "text-white",
          "text-shadow-xs text-shadow-neutral-700",
          "border border-red-300",
          "ring-1 ring-red-500",
        ].join(" "),
        outline: [
          "",
          "text-neutral-800",
          "text-shadow-xs text-shadow-neutral-400",
          "border border-neutral-300",
          "ring-1 ring-neutral-400",
          "shadow-[inset_0_0_3px_1px_rgba(0,0,0,0.075)]",
          "hover:shadow-[inset_0_0_3px_1px_rgba(0,0,0,0.25)]",
        ].join(" "),
      },

      size: {
        default: "px-3 py-1 text-base",
        sm: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps){
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
