import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utills";


const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "cursor-pointer",
    "rounded-md",
    "transition-shadow duration-200",
    "focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary",
          "text-primary-foreground",
          "border border-blue-400",
          "ring-1 ring-primary",
          "shadow-[inset_0_0_3px_1px_rgba(255,255,255,0)]",
          "hover:shadow-[inset_0_0_3px_1px_rgba(255,255,255,0.25)]",
        ].join(" "),
      },
      size: {
        default: "px-3 py-1 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}