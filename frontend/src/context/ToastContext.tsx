import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info' | 'warning', title?: string) => void;
  showReinforcement: (lessonOrTaskName: string, isLesson?: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  // A helper that generates beautiful, positive psychology parenting reinforcement messages
  const showReinforcement = useCallback((itemChecked: string, isLesson = false) => {
    const affirmations = [
      "Your positive energy is the calm anchor they need today.",
      "By modeling patience, you are planting seeds for their lifelong emotional health.",
      "Connection over perfection! You did a beautiful job showing up.",
      "Every small co-regulation breath builds a safer space for your child.",
      "You are a wonderful parent, learning and growing alongside your little one."
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    const title = isLesson 
      ? `📚 Lesson Mastered! (+10 XP)` 
      : `✅ Daily Habit Checked! (+15 XP)`;
    
    const fullMessage = `"${itemChecked}" was recorded! ${randomAffirmation}`;
    showToast(fullMessage, 'success', title);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showReinforcement }}>
      {children}
      
      {/* Toast Portal Container */}
      <div 
        id="toast-portal-container"
        className="fixed top-6 right-6 z-[9999] pointer-events-none flex flex-col gap-3 max-w-sm w-full outline-hidden"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            let bgClass = "bg-white border-stone-200/80 text-stone-900 shadow-xl";
            let iconColor = "text-stone-500";
            let Icon = Info;
            
            if (toast.type === 'success') {
              bgClass = "bg-[#fafdfa]/95 border-emerald-200/70 text-[#14532d] shadow-emerald-500/5 shadow-xl";
              iconColor = "text-[#009473]";
              Icon = CheckCircle2;
            } else if (toast.type === 'warning') {
              bgClass = "bg-[#fffbeb]/95 border-amber-200/70 text-[#78350f] shadow-amber-500/5 shadow-xl";
              iconColor = "text-[#d97706]";
              Icon = AlertCircle;
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                className={`pointer-events-auto border rounded-3xl p-5 flex gap-3.5 backdrop-blur-md ${bgClass}`}
                style={{ originY: 0 }}
              >
                <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                  {toast.type === 'success' ? (
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      <Sparkles className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-amber-500 animate-pulse" />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  {toast.title && (
                    <h4 className="text-xs font-bold leading-none tracking-tight font-sans uppercase">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs font-sans font-medium opacity-90 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
                
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 h-fit text-stone-400 hover:text-stone-600 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
