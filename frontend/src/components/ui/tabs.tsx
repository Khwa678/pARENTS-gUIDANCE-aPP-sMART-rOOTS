import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TabsContextProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, className, ...props }: TabsProps) {
  const [localValue, setLocalValue] = React.useState(defaultValue || "");
  
  const activeValue = value !== undefined ? value : localValue;
  const handleValueChange = React.useCallback((newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
    setLocalValue(newValue);
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props} />
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-2xl bg-stone-100 p-1 text-stone-500", className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children?: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  const isActive = context.value === value;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer bg-transparent text-stone-400",
        isActive && "bg-white text-stone-900 shadow-xs font-black",
        className
      )}
      onClick={() => context.onValueChange?.(value)}
      {...props}
    />
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div
      className={cn("mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950", className)}
      {...props}
    />
  );
}
