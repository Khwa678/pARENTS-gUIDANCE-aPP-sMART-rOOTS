import React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = (options: { variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link'; size?: 'default' | 'sm' | 'lg' | 'icon' } = {}) => {
  const base = "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";
  
  const variants = {
    default: "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm",
    outline: "border border-stone-200 bg-white hover:bg-stone-50 text-stone-700",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    ghost: "hover:bg-stone-100 hover:text-stone-900 text-stone-500",
    link: "text-stone-900 underline-offset-4 hover:underline"
  };

  const sizes = {
    default: "h-11 px-4 py-2",
    sm: "h-8 rounded-lg px-3 text-[10px]",
    lg: "h-12 rounded-xl px-8 text-sm",
    icon: "h-9 w-9"
  };

  const variant = options.variant || 'default';
  const size = options.size || 'default';

  return cn(base, variants[variant], sizes[size]);
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | any;
  type?: "button" | "submit" | "reset" | any;
  disabled?: boolean | any;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  key?: React.Key;
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
