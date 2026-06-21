import React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-stone-200", className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, src, alt = "avatar", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-600",
        className
      )}
      {...props}
    />
  );
}
