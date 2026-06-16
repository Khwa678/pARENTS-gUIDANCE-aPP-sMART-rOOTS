import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Brain, Loader2, BookmarkCheck, History, Calendar, Star, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import confetti from 'canvas-confetti';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  bgSelected: string;
  borderColor: string;
}

const MOODS: MoodOption[] = [
  { id: 'exhausted', emoji: '😩', label: 'Exhausted', color: 'text-amber-600', bgSelected: 'bg-amber-500/10 border-amber-300', borderColor: 'border-amber-200' },
  { id: 'peaceful', emoji: '🧘', label: 'Peaceful', color: 'text-[#009473]', bgSelected: 'bg-emerald-500/10 border-emerald-300', borderColor: 'border-emerald-200' },
  { id: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed', color: 'text-rose-600', bgSelected: 'bg-rose-500/10 border-rose-300', borderColor: 'border-rose-200' },
  { id: 'joyful', emoji: '☀️', label: 'Joyful', color: 'text-amber-500', bgSelected: 'bg-yellow-500/10 border-yellow-300', borderColor: 'border-yellow-200' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'text-indigo-600', bgSelected: 'bg-indigo-500/10 border-indigo-300', borderColor: 'border-indigo-200' },
  { id: 'discouraged', emoji: '😔', label: 'Discouraged', color: 'text-stone-600', bgSelected: 'bg-stone-500/10 border-stone-300', borderColor: 'border-stone-200' }
];

export default function EmotionalCheckIn() {
  const { addReflection, reflections, currentUser } = useApp();
  const { showToast } = useToast();

  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Check if saved reflection matches today's date
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const finishedToday = reflections.some(r => r.date === todayStr && r.mood !== 'reflective');
    setIsCompletedToday(finishedToday);
  }, [reflections]);

  const handleGeneratePrompt = async () => {
    if (!selectedMood) return;
    setIsGenerating(true);
    setAiPrompt('');
    
    try {
      const response = await fetch('/api/emotional-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emotion: selectedMood.label,
          intensity: intensity,
          parentName: currentUser?.name || 'Jane Cooper',
          childName: 'Emma'
        })
      });
      const data = await response.json();
      setAiPrompt(data.prompt || 'How can you extend grace and comfort to yourself in this present moment?');
    } catch (err) {
      console.error(err);
      setAiPrompt(`You are experiencing ${selectedMood.label.toLowerCase()} feelings at level ${intensity}/5. Reflect on one small trigger during today's transitions. How can you model calm next time?`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !reflectionText) return;
    
    setIsLogging(true);
    try {
      // Formulate a beautiful combined representation
      const doubleCheckText = reflectionText;
      const moodVal = selectedMood.id;

      // Add reflection. In AppContext, we ensure it conforms to: (text, mood, scale)
      addReflection(doubleCheckText, moodVal, intensity);
      
      // Since Progress.tsx reads ref.prompt/ref.entry we customize how we push check-ins in local context as well
      // Our upgraded addReflection in AppContext handles both!

      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.7 }
        });
      } catch (err) {}

      showToast(
        `Your emotional check-in has been validated and logged. You earned +30 Brownie Points!`,
        'success',
        '☀️ Daily Reflection Logged!'
      );

      // Reset form states
      setSelectedMood(null);
      setIntensity(3);
      setAiPrompt('');
      setReflectionText('');
      setIsCompletedToday(true);
    } catch (err) {
      console.error(err);
      showToast('Oops, unable to log reflection. Try again.', 'warning');
    } finally {
      setIsLogging(false);
    }
  };

  // Get list of parent wellness entries
  const checkInEntries = reflections.filter(r => r.mood && r.mood !== 'reflective');

  return (
    <Card className="border-none shadow-xs bg-white rounded-[2rem] sm:rounded-[2.2rem] overflow-hidden font-sans">
      <CardHeader className="p-4 sm:p-6 md:p-8 pb-3 bg-gradient-to-b from-stone-50/50 to-white border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#009473] uppercase tracking-wider font-mono">
            <Smile className="w-4 h-4" /> Parent Wellness Tracker
          </div>
          <CardTitle className="text-xl sm:text-2xl font-serif text-stone-800">Daily Emotional Check-in</CardTitle>
          <CardDescription className="text-stone-500 text-xs sm:text-sm">
            Pausing to register your own nervous system stress level is the first step of co-regulation.
          </CardDescription>
        </div>
        
        {checkInEntries.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-full shrink-0 text-xs font-bold border-stone-200 text-stone-500 flex items-center gap-1 cursor-pointer hover:bg-stone-50"
          >
            {showHistory ? <Smile className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
            {showHistory ? 'Active Log' : `History (${checkInEntries.length})`}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">Your Wellness Chronicle</h4>
              {checkInEntries.length === 0 ? (
                <p className="text-stone-400 text-xs py-8 text-center">No emotional entries logs yet.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 divide-y divide-stone-50">
                  {checkInEntries.map((entry) => {
                    const matchedMood = MOODS.find(m => m.id === entry.mood);
                    return (
                      <div key={entry.id} className="pt-3 first:pt-0 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{matchedMood?.emoji || '📝'}</span>
                            <span className="font-bold text-stone-800 capitalize">{entry.mood}</span>
                            <span className="text-stone-400">•</span>
                            <span className="text-stone-400 flex items-center gap-0.5">
                              {Array.from({ length: entry.scale || 3 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                              ))}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {entry.date}
                          </span>
                        </div>
                        <p className="text-stone-600 text-xs leading-relaxed italic pr-4 bg-stone-50/50 p-2.5 rounded-xl border border-stone-100">
                          {entry.text || entry.entry}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : isCompletedToday ? (
            <motion.div
              key="completed-today"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 text-center bg-[#fafdfa] border border-emerald-100 rounded-3xl flex flex-col items-center gap-4 py-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#009473] flex items-center justify-center text-3xl shadow-xs">
                🌸
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-serif text-stone-800 font-bold leading-tight">Nervous System Centered!</h3>
                <p className="text-stone-500 text-xs leading-relaxed">
                  You have logged your emotional check-in for today. Taking this small step of self-reflection releases cortical pressure and validates the parent-child co-regulating flow.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-emerald-100/50 text-[#009473] px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-1">
                Completed today • +30 XP Redeeemed
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkin-panel"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Step 1: Mood Array Choice */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">
                  1. Current Emotional Climatology
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {MOODS.map((mood) => {
                    const isSelected = selectedMood?.id === mood.id;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => {
                          setSelectedMood(mood);
                          setAiPrompt('');
                        }}
                        className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer select-none gap-1 hover:bg-stone-50 ${
                          isSelected ? mood.bgSelected : 'bg-stone-50/50 border-stone-200/80 text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl mb-1 filter drop-shadow-2xs">{mood.emoji}</span>
                        <span className="text-[9px] sm:text-xs font-bold leading-none tracking-tight">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Intensity level */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-stone-400 uppercase tracking-widest font-mono">
                      2. Feeling Intensity Level: <span className="text-stone-700 normal-case font-sans font-bold">{intensity} / 5</span>
                    </label>
                    <span className="text-[10px] text-stone-400 italic">
                      {intensity >= 4 ? '🌊 Sensation is highly intense' : '🍃 Gentle presence'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starIdx = i + 1;
                      const active = starIdx <= intensity;
                      return (
                        <button
                          key={starIdx}
                          type="button"
                          onClick={() => setIntensity(starIdx)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            active 
                              ? 'bg-amber-100/50 border-amber-300 text-amber-500 shadow-3xs' 
                              : 'bg-stone-50 border-stone-205 text-stone-300'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${active ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* AI Prompt generator engine trigger */}
              {selectedMood && !aiPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-2"
                >
                  <Button
                    type="button"
                    onClick={handleGeneratePrompt}
                    disabled={isGenerating}
                    className="w-full bg-[#009473] hover:bg-[#009473]/90 text-stone-900 font-bold rounded-2xl py-5 h-auto text-xs shadow-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                        Generating Dr. Vance Prompt...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 text-stone-900 fill-current" />
                        Generate AI-Driven Reflection Prompt
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Reflection prompt and logging textbox */}
              <AnimatePresence>
                {aiPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-4"
                  >
                    {/* Compassionate AI Prompt Bubble */}
                    <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-100/60 space-y-2 relative overflow-hidden">
                      <div className="absolute right-3 top-3 text-amber-500/10 shrink-0">
                        <Smile className="w-16 h-16 rotate-12" />
                      </div>
                      
                      <div className="flex items-center gap-1 text-[9px] font-mono uppercase font-black tracking-widest text-[#d97706]">
                        <Sparkles className="w-3.5 h-3.5 fill-current text-[#d97706]" /> Dr. Vance (AI Guidance Mentor)
                      </div>
                      <p className="text-stone-700 font-serif italic text-sm leading-relaxed pr-6 relative z-10">
                        "{aiPrompt}"
                      </p>
                    </div>

                    <form onSubmit={handleSaveCheckIn} className="space-y-3">
                      <label htmlFor="reflection-text" className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono block">
                        3. Your Self-Compassion Journal Space
                      </label>
                      <Textarea
                        id="reflection-text"
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="Pour your thoughts, feelings, transitions, and parent reflections safely here... (What felt hard? Where did you pause?)"
                        className="rounded-2xl border-stone-200/80 p-4 focus-visible:ring-emerald-500/30 text-stone-800 text-xs min-h-[90px] leading-relaxed"
                      />

                      <Button
                        type="submit"
                        disabled={isLogging || !reflectionText}
                        className="w-full bg-[#1c1917] hover:bg-[#292524] text-white font-bold rounded-2xl py-6 h-auto text-xs shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLogging ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Logging Reflection Entry...
                          </>
                        ) : (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-emerald-300" />
                            Submit Check-In & Get +30 Brownie Points
                          </>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
