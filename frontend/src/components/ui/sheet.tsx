import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open, onOpenChange }: SheetProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const activeOpen = open !== undefined ? open : localOpen;
  const handleOpenChange = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    setLocalOpen(val);
  };

  return (
    <SheetContext.Provider value={{ open: activeOpen, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children, asChild, render }: { children?: React.ReactNode; asChild?: boolean; render?: React.ReactNode }) {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used inside Sheet");

  const handleClick = (e: React.MouseEvent) => {
    context.setOpen(true);
  };

  const element = children || render;
  if (!element) return null;

  if (asChild && React.isValidElement(element)) {
    const child = element as React.ReactElement<any>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      className: cn(child.props.className, "cursor-pointer")
    });
  }

  if (React.isValidElement(element)) {
    const child = element as React.ReactElement<any>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      className: cn(child.props.className, "cursor-pointer")
    });
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {element}
    </span>
  );
}

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
}

export function SheetContent({ side = "right", className, children, ...props }: SheetContentProps) {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used inside Sheet");

  return (
    <AnimatePresence>
      {context.open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => context.setOpen(false)}
            className="fixed inset-0 bg-stone-950"
          />

          {/* Drawer Canvas */}
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={cn(
              "fixed bottom-0 top-0 z-50 h-full w-3/4 max-w-sm bg-white p-6 shadow-xl border-l border-stone-200/50 flex flex-col justify-between",
              side === "left" ? "left-0 border-r" : "right-0 border-l",
              className
            )}
            {...props}
          >
            <div>
              {/* Close pin */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => context.setOpen(false)}
                  className="rounded-full p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
