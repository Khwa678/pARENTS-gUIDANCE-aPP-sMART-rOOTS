import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Compass, 
  Award, 
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquareCode
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';

interface Milestones {
  id: string;
  step: number;
  title: string;
  description: string;
  points: number;
}

export default function PositiveJourneyGuide() {
  const { studentPoints, addStudentPoints } = useApp();
  
  const [journeyMilestones, setJourneyMilestones] = useState<Milestones[]>([
    { id: 'jm-1', step: 1, title: 'Belly-breathing initiation', description: 'Synchronized 4-count breathing together twice in a single hyper-aroused evening block.', points: 30 },
    { id: 'jm-2', step: 2, title: 'Eye-level verbal validation', description: 'Crouched down to capture absolute raw eye alignment before delivering encouraging feedback.', points: 30 },
    { id: 'jm-3', step: 3, title: 'Emotional trigger indexing', description: 'Identified the 2 core somatic childhood anger triggers (Screen withdrawal & homework overload).', points: 40 },
    { id: 'jm-4', step: 4, title: 'Zero yelling day commitment', description: 'Resolved bedtime friction and withdrawal boundaries without raising voices or negative lectures.', points: 50 },
    { id: 'jm-5', step: 5, title: 'Joint template sketching', description: 'Sketched a friendly sleeping kitten representing calming down internal hyper-arousal.', points: 40 },
    { id: 'jm-6', step: 6, title: 'LMS livestream consultation', description: 'Attended a sunset clinical broadcast with Master Kenneth Chen and logged sessional remarks.', points: 35 },
    { id: 'jm-7', step: 7, title: 'Hydration wellness routines', description: 'Student consumed 4 complete wellness water glasses before afternoon study intervals.', points: 30 },
    { id: 'jm-8', step: 8, title: 'Clinical dialogue bridge', description: 'Booked and attended deep diagnostic assessment with Alicia Vance.', points: 60 }
  ]);

  const [completedSteps, setCompletedSteps] = useState<string[]>(['jm-1', 'jm-2']);

  const toggleStepCompleted = (id: string, pts: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(prev => prev.filter(item => item !== id));
      addStudentPoints(-pts);
    } else {
      setCompletedSteps(prev => [...prev, id]);
      addStudentPoints(pts);
      // Confetti visual highlight
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const percentage = Math.round((completedSteps.length / journeyMilestones.length) * 100);

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header and cumulative percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-serif text-stone-900 font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-accent-sage" /> Positive Co-Regulation Path 💖
          </h3>
          <p className="text-stone-500 text-xs">Transform physical anger into synchronized empathy & somatic listening habits.</p>
        </div>

        {/* Progress percent layout */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-150 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Goal complete</span>
            <strong className="text-xs font-mono font-bold text-stone-800">{completedSteps.length} of {journeyMilestones.length}</strong>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-stone-100 flex items-center justify-center font-bold text-sm text-accent-sage relative">
            <svg className="w-full h-full absolute inset-0 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent-sage transition-all duration-300"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="relative z-10 text-[11px] font-mono leading-none">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Grid of the milestone blocks */}
      <div className="grid md:grid-cols-2 gap-4">
        {journeyMilestones.map((m) => {
          const isDone = completedSteps.includes(m.id);
          return (
            <div 
              key={m.id}
              onClick={() => toggleStepCompleted(m.id, m.points)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start group select-none ${
                isDone 
                  ? 'bg-accent-sage/15 border-accent-sage/35 shadow-tiny' 
                  : 'bg-stone-50/50 border-stone-200/60 hover:bg-stone-50 hover:border-stone-200'
              }`}
            >
              {/* Done / Undone check marker button */}
              <button className="shrink-0 mt-0.5 text-accent-sage group-hover:scale-105 transition-transform duration-200">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-sage fill-accent-sage/10" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300 group-hover:text-stone-400" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold text-stone-400">STEP {m.step}</span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-black font-mono">+{m.points} XP</span>
                </div>
                <h4 className={`text-sm font-serif font-bold ${isDone ? 'text-stone-900 line-through decoration-stone-300' : 'text-stone-850'}`}>
                  {m.title}
                </h4>
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transformation quote */}
      <div className="bg-stone-50 border border-stone-250/20 p-4 rounded-2xl text-xs italic text-stone-500 font-sans leading-relaxed flex gap-3 items-center">
        <Brain className="w-8 h-8 text-accent-sage shrink-0 opacity-80" />
        <span>
          "By modeling somatic stillness instead of escalating the argument, you teach children to down-regulate high anger loops chemically. Emotional stability is a shared muscle." — Dr. Alicia Vance
        </span>
      </div>

    </div>
  );
}
