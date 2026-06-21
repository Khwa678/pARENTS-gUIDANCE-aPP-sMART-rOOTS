import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Frown, 
  BookOpen, 
  Award, 
  X, 
  MessageSquare,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';

export default function PeriodicReflectionModal() {
  const { currentUser, addReflection } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [mood, setMood] = useState('reflective');
  const [scale, setScale] = useState(4);
  const [successMsg, setSuccessMsg] = useState(false);

  // Auto trigger the modal for logged-in parents on first load after a short delay
  useEffect(() => {
    if (currentUser?.role === 'parent') {
      const timer = setTimeout(() => {
        // Read if user already dismissed or logged today
        const alreadyLogged = localStorage.getItem('parent_guidance_logged_today');
        if (!alreadyLogged) {
          setIsOpen(true);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const wordCount = reflectionText.trim() ? reflectionText.trim().split(/\s+/).length : 0;
  const isEligible = wordCount >= 10;

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) return;

    // Log the actual reflection in state
    addReflection(reflectionText, mood, scale);
    
    // Set localStorage flag so it doesn't auto-remind again soon
    localStorage.setItem('parent_guidance_logged_today', 'true');
    setSuccessMsg(true);

    // Spark victory confetti!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSuccessMsg(false);
      setIsOpen(false);
      setReflectionText('');
      setScale(4);
    }, 2000);
  };

  return (
    <>
      {/* Small floating test-trigger trigger for Admins/Users to examine the prompt live */}
      {currentUser?.role === 'parent' && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 font-bold text-[10px] px-3.5 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider transition-all duration-200 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-accent-sage animate-pulse" />
          <span>Launch Somatic Reflection Checkup 📝</span>
        </button>
      )}

      {/* Modal overlays and canvas */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass backdrop layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-stone-950"
            />

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden border border-stone-200/50"
            >
              
              {/* Decorative top header styling */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-sage via-amber-400 to-rose-400" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {successMsg ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center text-3xl">
                    🌱
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 leading-tight">Journal Reflection Locked!</h3>
                  <p className="text-stone-500 text-xs max-w-xs mx-auto">
                    Your parenting de-escalation reflections are securely synchronized with Supabase and your clinical team. You earned <strong>+25 bonus XP</strong>!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReflection} className="space-y-6">
                  
                  {/* Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4d7c0f] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 3-Day Somatic Review Loop
                    </span>
                    <h3 className="text-2xl font-serif text-stone-900 leading-tight font-black">
                      How was bedtime co-regulation?
                    </h3>
                    <p className="text-stone-500 text-xs">
                      Take 60 seconds to reflect on tantrums, breathing synchrony or device limits with Emma this week.
                    </p>
                  </div>

                  {/* Sentiment Sliders */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-600">Bedtime atmosphere rating:</span>
                      <strong className="text-stone-800 font-bold font-mono">
                        {scale === 5 ? '🧘 Sublimely Calm' : scale === 4 ? '😊 Peaceful Harmony' : scale === 3 ? '⚖️ Neutral Balance' : scale === 2 ? '⚡ Minor Tantrum' : '🚨 Severe Rage/Overload'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <Frown className="w-4 h-4 text-stone-400" />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-accent-sage"
                        value={scale}
                        onChange={e => setScale(Number(e.target.value))}
                      />
                      <Smile className="w-4 h-4 text-[#4d7c0f]" />
                    </div>
                  </div>

                  {/* Mood descriptor */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-600 block">Bedtime Emotional Tone:</span>
                    <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-bold text-center">
                      {[
                        { id: 'optimistic', label: '☀️ Optimistic' },
                        { id: 'exhausted', label: '🥱 Sleepy/Tired' },
                        { id: 'peaceful', label: '🧘 Somatic Calm' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMood(item.id)}
                          className={`py-2 rounded-xl border transition ${
                            mood === item.id
                              ? 'bg-stone-900 border-stone-800 text-white'
                              : 'bg-stone-50 border-stone-150 text-stone-500 hover:text-stone-850'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reflection Text Area */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-stone-600">Reflection Narrative:</span>
                      <span className={`font-mono text-[10px] ${isEligible ? 'text-[#4d7c0f] font-black' : 'text-stone-400'}`}>
                        {wordCount} / 10 words minimum
                      </span>
                    </div>

                    <textarea
                      placeholder="e.g. Practiced 4 counts synchrony during dinner. Emma responded beautifully when I got down on her level. It completely de-escalated bedtime resistance..."
                      required
                      className="w-full h-24 p-3 bg-stone-50 border border-stone-150 rounded-2xl focus:outline-none focus:border-accent-sage text-xs text-stone-800 leading-relaxed font-sans placeholder-stone-400"
                      value={reflectionText}
                      onChange={e => setReflectionText(e.target.value)}
                    />
                  </div>

                  {/* Actions summary */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 text-stone-500 hover:bg-stone-100 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Dismiss Loop
                    </button>
                    <button
                      type="submit"
                      disabled={!isEligible}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-center block transition cursor-pointer ${
                        isEligible
                          ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
                          : 'bg-stone-150 text-stone-400'
                      }`}
                    >
                      Lock Reflection (+25 XP)
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
