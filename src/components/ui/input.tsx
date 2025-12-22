"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Base
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors",

        // Dark theme
        "border-gray-700 bg-gray-800 text-gray-100",
        "placeholder:text-gray-500",

        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0",

        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-300",

        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
