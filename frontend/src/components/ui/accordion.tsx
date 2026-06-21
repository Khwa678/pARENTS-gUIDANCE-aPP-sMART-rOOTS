import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextProps {
  activeValue: string | null;
  toggleValue: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Accordion({ className, ...props }: AccordionProps) {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const toggleValue = (val: string) => {
    setActiveValue(prev => (prev === val ? null : val));
  };

  return (
    <AccordionContext.Provider value={{ activeValue, toggleValue }}>
      <div className={cn("space-y-2", className)} {...props} />
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

const AccordionItemContext = createContext<string | undefined>(undefined);

export function AccordionItem({ value, className, ...props }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn("border-b border-stone-200 pb-2", className)} {...props} />
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!context || !itemValue) {
    throw new Error("AccordionTrigger must be used within Accordion and AccordionItem");
  }

  const isOpen = context.activeValue === itemValue;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-4 text-xs font-bold transition-all hover:underline select-none cursor-pointer text-left text-stone-800",
        className
      )}
      onClick={() => context.toggleValue(itemValue)}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!context || !itemValue) {
    throw new Error("AccordionContent must be used within Accordion and AccordionItem");
  }

  const isOpen = context.activeValue === itemValue;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "overflow-hidden text-xs text-stone-605 pb-4 leading-relaxed font-sans text-stone-600 transition-all",
        className
      )}
      {...props}
    >
      <div className="pt-0">{children}</div>
    </div>
  );
}
