import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  className?: string;
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-stone-100", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-accent-sage transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
}
