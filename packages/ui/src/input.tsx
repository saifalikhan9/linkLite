import * as React from "react";
import { cn } from "./lib/utills";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center rounded-xl  bg-background p-2 border border-neutral-400 shadow-input-1 transition-all duration-300   focus-within:border-blue-500 focus-within:shadow-input-2",
          className,
        )}
      >
        {startAdornment}

        <input
          ref={ref}

          //   onChange={(e) => onValueChange(e.target.value)}
          className="
  min-w-100 flex-1 bg-transparent px-4 py-2 text-sm
  outline-none placeholder:text-muted-foreground
  disabled:cursor-not-allowed disabled:opacity-50

"
          {...props}
        />

        {endAdornment}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
