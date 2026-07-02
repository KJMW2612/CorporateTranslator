import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
          "h-10 px-4 py-2",
          variant === "default" &&
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
          variant === "outline" &&
            "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-300",
          variant === "ghost" &&
            "hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
