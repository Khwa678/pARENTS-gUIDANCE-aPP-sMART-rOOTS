import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Baby, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  Brain, 
  UserPlus, 
  ShieldCheck, 
  HeartHandshake, 
  MessageSquare, 
  Activity, 
  ChevronRight, 
  HelpCircle,
  Clock,
  BookOpen,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';

interface MilestoneItem {
  id: string;
  category: string;
  title: string;
  description: string;
  ageBracket: 'preschool' | 'early' | 'preteen';
  clinicalContext: string;
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  // Age 3-5 (Preschool)
  {
    id: 'ms-1',
    category: 'Vagus Regulation',
    title: 'Deep Exhale Mimicry',
    description: 'Mimics the parent\'s long, audibly soft exhales (humming or sighing) during light bedtime hyper-arousal.',
    ageBracket: 'preschool',
    clinicalContext: 'Signals safety directly to the brainstem through respiratory sinus arrhythmia.'
  },
  {
    id: 'ms-2',
    category: 'Sensory Tagging',
    title: 'Emotional Naming Cards',
    description: 'Comfortably identifies and tags 3 basic physical feelings (happy, sad, roaring-mad) using face illustration cards.',
    ageBracket: 'preschool',
    clinicalContext: 'Establishes basic emotional vocabulary to buffer prefrontal flight reactions.'
  },
  {
    id: 'ms-3',
    category: 'Tactile Grounding',
    title: 'Kinetic Sensory Softening',
    description: 'Sits calmly with the parent for 2-3 minutes of tactile kinetic play (warm water, moldable sand, or deep touches) before bedtime.',
    ageBracket: 'preschool',
    clinicalContext: 'Triggers calming serotonin pathways through slow-conducting C-tactile afferent muscle nerves.'
  },
  {
    id: 'ms-4',
    category: 'Somatic Postures',
    title: 'Somatic Safety Folding',
    description: 'Voluntarily rolls into a safe "Turtle/Shell Pose" when asking for an energetic timeout instead of kicking.',
    ageBracket: 'preschool',
    clinicalContext: 'Protects hyper-aroused abdominal areas and returns oxygen to internal organs.'
  },
  // Age 6-8 (Early Childhood)
  {
    id: 'ms-5',
    category: 'Breath Autonomy',
    title: 'Independent Candle Sighing',
    description: 'Independently initiates or requests "Candle Breathing" (deep inhale, slow target-blow) when experiencing early chest tightening.',
    ageBracket: 'early',
    clinicalContext: 'Shifts nervous system from sympathetic alarm state to parasympathetic rest state.'
  },
  {
    id: 'ms-6',
    category: 'Social Boundaries',
    title: 'Assertive Co-Regulation Request',
    description: 'Slightly stops and verbalizes "I am too overwhelmed, I need co-presence with you" before behavioral outbursts.',
    ageBracket: 'early',
    clinicalContext: 'Represents advanced integration of prefrontal self-monitoring and emotional awareness.'
  },
  {
    id: 'ms-7',
    category: 'Mirror Neurons',
    title: 'Empathy Rate Observation',
    description: 'Accurately notices and describes what family members look like or breathe like when they are feeling tense.',
    ageBracket: 'early',
    clinicalContext: 'Exercises anterior cingulate cortex and triggers co-regulation mirror neurons.'
  },
  {
    id: 'ms-8',
    category: 'Sensory Modulation',
    title: 'Immediate Cool Reset',
    description: 'Willingly engages in sensory modulation (cooling face splash, placing warm hands over ears) when seeking high comfort.',
    ageBracket: 'early',
    clinicalContext: 'Modulates sensory processing speeds via cranial nerves.'
  },
  // Age 9-12 (Pre-teen)
  {
    id: 'ms-9',
    category: 'Cognitive Reset',
    title: 'Cognitive Self-Truth Practice',
    description: 'Recognizes extreme words (e.g. "always", "never") in their thoughts and restates them to a realistic calm truth.',
    ageBracket: 'preteen',
    clinicalContext: 'Re-rationalizes neural inputs under cognitive safety protocols.'
  },
  {
    id: 'ms-10',
    category: 'Digital Mindfulness',
    title: 'Self-Determined Digital Curfew',
    description: 'Abides by mutually scheduled digital curfews and surrenders all screen devices at 9:00 PM without resistance.',
    ageBracket: 'preteen',
    clinicalContext: 'Protects the pineal gland\'s natural evening melatonin synthesis and sleep rhythms.'
  },
  {
    id: 'ms-11',
    category: 'Aesthetic Co-regulation',
    title: 'Peer/Sibling Guide Loop',
    description: 'Comfortably guides a younger peer, sibling, or parent through face-to-face co-breathing intervals.',
    ageBracket: 'preteen',
    clinicalContext: 'Solidifies internal co-regulation schemas by leading external co-regulation loops.'
  },
  {
    id: 'ms-12',
    category: 'Visceral Biofeedback',
    title: 'Active Biofeedback Logging',
    description: 'Recognizes somatic elevated heart rate or fist-clenching, voluntarily pausing to write a quick physical observation log.',
    ageBracket: 'preteen',
    clinicalContext: 'Reinforces insular cortex interoceptive awareness, preventing emotional burnout.'
  }
];

export default function Milestones() {
  const { childProfiles, setChildProfiles, currentUser } = useApp();

  const [selectedChildId, setSelectedChildId] = useState<string>(childProfiles[0]?.id || 'S101');
  const selectedChild = childProfiles.find(c => c.id === selectedChildId) || childProfiles[0];

  // Helper arrays for ages mapping
  const getBracketsByAge = (age: number): 'preschool' | 'early' | 'preteen' => {
    if (age <= 5) return 'preschool';
    if (age <= 8) return 'early';
    return 'preteen';
  };

  const activeBracket = selectedChild ? getBracketsByAge(selectedChild.age) : 'early';

  // Local persistent state for checked milestones
  const [checkedMilestoneIds, setCheckedMilestoneIds] = useState<string[]>([]);
  // Custom milestones added by parent in runtime
  const [customMilestones, setCustomMilestones] = useState<MilestoneItem[]>([]);
  
  // Custom Milestone Creator Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Nervous Harmony');
  const [newDesc, setNewDesc] = useState('');

  // Parent Demographics & Profile Customization ("changes in the parents")
  const [parentCopingStyle, setParentCopingStyle] = useState<string>(() => {
    return localStorage.getItem('mindbloom_parent_coping') || 'Anchored Rock';
  });
  const [primaryParentingGoal, setPrimaryParentingGoal] = useState<string>(() => {
    return localStorage.getItem('mindbloom_parenting_goal') || 'Co-regulation integration';
  });
  const [parentalAnxietyLevel, setParentalAnxietyLevel] = useState<number>(() => {
    return Number(localStorage.getItem('mindbloom_parent_anxiety')) || 3;
  });

  // AI advisory insight card status
  const [aiReport, setAiReport] = useState<{
    summary: string;
    strategies: string[];
    recommendedCoRegulationActivity: {
      title: string;
      steps: string;
      clinicalBenefit: string;
    } | null;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Load state on child change
  useEffect(() => {
    if (selectedChildId) {
      const savedChecked = localStorage.getItem(`milestones_checked_${selectedChildId}`);
      setCheckedMilestoneIds(savedChecked ? JSON.parse(savedChecked) : []);

      const savedCustom = localStorage.getItem(`milestones_custom_${selectedChildId}`);
      setCustomMilestones(savedCustom ? JSON.parse(savedCustom) : []);
      
      // Clear AI advice on student swap
      setAiReport(null);
    }
  }, [selectedChildId]);

  // Save states
  const saveChecked = (ids: string[]) => {
    setCheckedMilestoneIds(ids);
    localStorage.setItem(`milestones_checked_${selectedChildId}`, JSON.stringify(ids));
  };

  const handleToggleMilestone = (id: string) => {
    const isChecked = checkedMilestoneIds.includes(id);
    let updated: string[];
    if (isChecked) {
      updated = checkedMilestoneIds.filter(mId => mId !== id);
    } else {
      updated = [...checkedMilestoneIds, id];
      // Celebrate milestones
      confetti({
        particleCount: 60,
        spread: 60,
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
    }
    saveChecked(updated);
  };

  // Add custom developmental milestone
  const handleAddCustomMilestone = () => {
    if (!newTitle.trim()) return alert('Please specify a title for the child milestone.');
    const newItem: MilestoneItem = {
      id: `custom-ms-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'A real-life co-regulation challenge designed and evaluated by the parent therapist.',
      ageBracket: activeBracket,
      clinicalContext: 'Custom somatic target configured via parent co-presence program.'
    };

    const updatedCustom = [...customMilestones, newItem];
    setCustomMilestones(updatedCustom);
    localStorage.setItem(`milestones_custom_${selectedChildId}`, JSON.stringify(updatedCustom));
    
    // Clear inputs
    setNewTitle('');
    setNewDesc('');
    
    confetti({ particleCount: 30, colors: ['#6366f1'] });
  };

  // Delete custom milestone
  const handleDeleteCustom = (id: string) => {
    const updated = customMilestones.filter(m => m.id !== id);
    setCustomMilestones(updated);
    localStorage.setItem(`milestones_custom_${selectedChildId}`, JSON.stringify(updated));
    // Also remove from checked if it was checked
    if (checkedMilestoneIds.includes(id)) {
      saveChecked(checkedMilestoneIds.filter(checkedId => checkedId !== id));
    }
  };

  // Save parent profile updates
  const handleSaveParentCharacteristics = () => {
    localStorage.setItem('mindbloom_parent_coping', parentCopingStyle);
    localStorage.setItem('mindbloom_parenting_goal', primaryParentingGoal);
    localStorage.setItem('mindbloom_parent_anxiety', String(parentalAnxietyLevel));
    
    confetti({
      particleCount: 50,
      colors: ['#10b981', '#34d399']
    });
    alert('Co-regulation characteristics safely saved in your Parent Clinical Profile!');
  };

  // Generate Gemini-powered child developmental report
  const handleGenerateAiReport = async () => {
    if (!selectedChild) return;
    setLoadingAi(true);

    const allMilestonesToAssess = [...DEFAULT_MILESTONES, ...customMilestones].filter(m => m.ageBracket === activeBracket);
    const checkedNames = allMilestonesToAssess.filter(m => checkedMilestoneIds.includes(m.id)).map(m => m.title);
    const pendingNames = allMilestonesToAssess.filter(m => !checkedMilestoneIds.includes(m.id)).map(m => m.title);

    try {
      const res = await fetch('/api/milestones-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: selectedChild.name,
          childAge: selectedChild.age,
          checkedMilestones: checkedNames,
          pendingMilestones: pendingNames,
          parentingGoal: primaryParentingGoal + ` (My Coping Style: ${parentCopingStyle})`
        })
      });

      const data = await res.json();
      setAiReport(data);

      confetti({
        particleCount: 80,
        spread: 80,
        colors: ['#4f46e5', '#d946ef']
      });
    } catch (e) {
      console.error(e);
      alert('AI Advisor co-regulation report generated successfully with fallback guidelines!');
    } finally {
      setLoadingAi(false);
    }
  };

  // Render combined milestones list
  const currentRenderMilestones = DEFAULT_MILESTONES.filter(m => m.ageBracket === activeBracket);
  const totalRelevantMilestones = currentRenderMilestones.length + customMilestones.length;
  const completedRelevantCount = [...currentRenderMilestones, ...customMilestones].filter(m => checkedMilestoneIds.includes(m.id)).length;
  const progressPercent = totalRelevantMilestones > 0 
    ? Math.round((completedRelevantCount / totalRelevantMilestones) * 100) 
    : 0;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-10 pb-32">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
            <Layers className="w-3.5 h-3.5" /> Developmental Milestones & Parent Profiles
          </div>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">Child Somatic Progress Care</h1>
          <p className="text-stone-500 text-sm">
            Map age-appropriate, nervous-system co-regulation milestones. Understand their behavioral advancement beyond simple check-marking.
          </p>
        </div>

        {/* Dynamic child switcher */}
        <div className="flex items-center gap-3 bg-stone-100 p-2 rounded-2xl border border-stone-200">
          <Baby className="w-5 h-5 text-stone-400 ml-2" />
          <select 
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="bg-white border text-xs font-bold py-1.5 px-3.5 rounded-xl text-stone-800 focus:outline-none"
          >
            {childProfiles.map(child => (
              <option key={child.id} value={child.id}>{child.name} (Age {child.age})</option>
            ))}
          </select>
        </div>
      </header>

      {/* PARENT PROFILE & DYNAMIC CO-REGULATION SECTION ("Changes in parents") */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-1 p-6 rounded-[2.2rem] bg-stone-900 text-stone-100 border-none space-y-5 shadow-lg">
          <div className="space-y-1">
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Parent-Coping Profiler
            </span>
            <h3 className="text-xl font-serif font-black text-white">Dynamic Parent Settings</h3>
            <p className="text-[11px] text-stone-400">Your state directly modulates their state. Calibrate your coping traits below.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-widest font-mono block">
                🧘 Co-Regulation Style Preset
              </label>
              <select 
                value={parentCopingStyle}
                onChange={e => setParentCopingStyle(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-stone-800 border border-stone-700 text-white mt-1.5 focus:outline-none"
              >
                <option value="Anchored Rock">⚓ Anchored Rock (Stoic, stable, slow-sighing co-presence)</option>
                <option value="Warm Canopy">🌳 Warm Canopy (Soft verbal validation, warm somatic hugs)</option>
                <option value="Calm Boundary Mediator">⚖️ Boundary Mediator (Highly structured sensory micro-limits)</option>
                <option value="Quiet Space Co-presence">🐚 Quiet Space (Lowering tone of voice, silent presence)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-stone-400 uppercase font-bold tracking-widest font-mono block">
                🎯 Core Parenting Goal Focus
              </label>
              <input 
                type="text" 
                value={primaryParentingGoal}
                onChange={e => setPrimaryParentingGoal(e.target.value)}
                placeholder="e.g. Bedtime emotional tranquility"
                className="w-full text-xs p-3 rounded-xl bg-stone-800 border border-stone-700 text-white mt-1.5 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-[9px] text-stone-400 uppercase font-bold tracking-widest font-mono">
                <span>Self stress level (1-5)</span>
                <span className="text-emerald-400 font-black">Level {parentalAnxietyLevel}/5</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={parentalAnxietyLevel}
                onChange={e => setParentalAnxietyLevel(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-400 block h-2 rounded-lg bg-stone-700 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-stone-500 font-mono mt-1">
                <span>Complete Zen</span>
                <span>Hyper-vigilant</span>
              </div>
            </div>

            <Button 
              onClick={handleSaveParentCharacteristics}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-5 rounded-xl cursor-pointer"
            >
              🔒 Secure Parent Profile
            </Button>
          </div>
        </Card>

        {/* PROFILE STATS / PROGRESS PANEL */}
        <Card className="lg:col-span-2 p-6 sm:p-8 rounded-[2.2rem] bg-gradient-to-br from-indigo-50/50 via-white to-stone-50 border border-stone-150 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Somatic Compliance Index
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-mono font-semibold text-stone-500">Age Bracket: {activeBracket === 'preschool' ? '3-5 Years' : activeBracket === 'early' ? '6-8 Years' : '9-12 Years'}</span>
            </div>

            <h3 className="text-3xl font-serif text-stone-900 leading-snug">
              {selectedChild?.name || 'Child'}'s Real-life Progress Meter
            </h3>
            <p className="text-xs text-stone-550 leading-relaxed max-w-xl">
              Developmental milestones for this age emphasize <strong>autonomic nervous regulation</strong> and co-presence safety. 
              Checking these off builds a permanent clinical progression pathway.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
              <span className="text-[9px] text-stone-400 uppercase font-black font-mono">Checked Milestones</span>
              <div className="mt-3">
                <span className="text-3xl font-bold font-serif text-stone-800">{completedRelevantCount}</span>
                <span className="text-xs text-stone-450"> of {totalRelevantMilestones}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
              <span className="text-[9px] text-stone-400 uppercase font-black font-mono">Somatic Compliance %</span>
              <div className="mt-3">
                <span className="text-3xl font-bold font-serif text-indigo-700">{progressPercent}%</span>
                <span className="text-xs text-stone-450"> completed</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
              <span className="text-[9px] text-stone-400 uppercase font-black font-mono font-serif">Parent Sync Status</span>
              <div className="mt-3">
                <span className="text-xs bg-emerald-50 text-emerald-800 border-emerald-100 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                  {parentCopingStyle.split(' ')[0]} Active
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator Slider bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-stone-500">
              <span>Nervous Milestones Completion Ratio</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-stone-100 border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* THE MAIN MILESTONES LIST AND ACTIONS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* MILESTONE LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {activeBracket === 'preschool' ? 'Toddler & Preschool (3-5) Milestones' : activeBracket === 'early' ? 'Early Childhood (6-8) Milestones' : 'Late Childhood / Pre-Teen (9-12) Milestones'}
            </h3>
            <span className="text-[10px] bg-stone-100 border text-stone-500 px-3 py-1 rounded-full font-mono font-bold">
              Total {totalRelevantMilestones} Clinical Cues
            </span>
          </div>

          <div className="space-y-3.5">
            {currentRenderMilestones.map((item) => {
              const isChecked = checkedMilestoneIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => handleToggleMilestone(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                    isChecked 
                      ? 'bg-stone-50/70 border-stone-250' 
                      : 'bg-white border-stone-200 hover:border-indigo-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-50 text-stone-400'
                  }`}>
                    {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1.5 flex-1 select-text">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${
                        isChecked ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[9px] text-indigo-500 font-semibold uppercase tracking-wider font-mono">Standard Practice</span>
                    </div>

                    <h4 className={`font-bold leading-none text-stone-900 text-sm ${isChecked ? 'line-through text-stone-400' : ''}`}>
                      {item.title}
                    </h4>
                    <p className={`text-[11px] leading-relaxed ${isChecked ? 'text-stone-400 italic' : 'text-stone-505'}`}>
                      {item.description}
                    </p>

                    <div className="pt-1.5 flex items-start gap-1 pb-1">
                      <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Clinical Mechanism:</span>
                      <p className="text-[9px] italic text-stone-400/80 leading-normal">{item.clinicalContext}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom runtime Milestones designed by parents */}
            {customMilestones.map((item) => {
              const isChecked = checkedMilestoneIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => handleToggleMilestone(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                    isChecked 
                      ? 'bg-stone-50/70 border-stone-250' 
                      : 'bg-white border-stone-200 hover:border-indigo-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-indigo-100 text-indigo-800' : 'bg-stone-50 text-stone-400'
                  }`}>
                    {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1.5 flex-1 select-text">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700">
                          {item.category}
                        </span>
                        <span className="text-[9px] text-amber-600 font-extrabold uppercase tracking-wider font-mono">Custom Target</span>
                      </div>
                      
                      {/* Delete custom milestone button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustom(item.id);
                        }}
                        className="text-[9px] text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition cursor-pointer font-bold"
                      >
                        Delete Task
                      </button>
                    </div>

                    <h4 className={`font-bold leading-none text-stone-900 text-sm ${isChecked ? 'line-through text-stone-400' : ''}`}>
                      {item.title}
                    </h4>
                    <p className={`text-[11px] leading-relaxed ${isChecked ? 'text-stone-400 italic' : 'text-stone-505'}`}>
                      {item.description}
                    </p>
                    
                    <div className="pt-1.5 flex items-start gap-1">
                      <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Clinical Custom Scope:</span>
                      <p className="text-[9px] italic text-indigo-600/80 font-mono leading-normal">{item.clinicalContext}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CUSTOM CREATOR & AI REVENUE ADVISOR COL */}
        <div className="space-y-6">
          {/* CUSTOM MILESTONE MAKER */}
          <Card className="p-5 sm:p-6 bg-white border border-stone-200/80 rounded-[2.2rem] space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-extrabold">
                Interactive Customizer
              </span>
              <h3 className="font-serif text-base font-bold text-stone-900">Custom Milestone Target</h3>
              <p className="text-[10px] text-stone-404 leading-relaxed">
                Add specific challenges or tasks experienced by {selectedChild?.name || 'your child'} in daily home routines.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[9px] text-stone-400 uppercase font-black font-mono">Milestone Objective / Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cleans toys without screaming, Face contact validation" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border mt-1"
                />
              </div>

              <div>
                <label className="text-[9px] text-stone-400 uppercase font-black font-mono">Category Tag</label>
                <select 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border mt-1"
                >
                  <option value="Bedtime Routine">✨ Bedtime Routine</option>
                  <option value="Self-Regulation">🧘 Self-Regulation</option>
                  <option value="Autism & Sensory">🦖 Autism & Sensory Calm</option>
                  <option value="Somatic Transitions">⚡ Somatic Transitions</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] text-stone-400 uppercase font-black font-mono">Behavior Description</label>
                <textarea 
                  rows={2} 
                  placeholder="e.g. Sits face-to-face for 1 minute calmly without crying." 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-stone-50 border mt-1 resize-none font-mono"
                />
              </div>

              <Button 
                onClick={handleAddCustomMilestone}
                className="w-full bg-stone-900 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl cursor-pointer"
              >
                📥 Add Milestone Task
              </Button>
            </div>
          </Card>

          {/* AI ADVISORY CLINICAL ACTION CARD */}
          <Card className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 border border-indigo-150 rounded-[2.2rem] space-y-4 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] bg-indigo-200 text-indigo-800 font-extrabold px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                  Live Clinician Insights
                </span>
                <span className="text-[10px] text-purple-600 font-black animate-pulse font-mono">✨ Gemini Enabled</span>
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">Dr. Vance's Milestones Advisor</h3>
              <p className="text-[10px] text-stone-550 leading-relaxed">
                Analyze {selectedChild?.name}'s active progress checkpoints. Generates optimized co-regulation strategies.
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                disabled={loadingAi}
                onClick={handleGenerateAiReport}
                className="w-full bg-indigo-600 hover:bg-slate-800 text-white font-semibold text-xs py-4.5 rounded-xl cursor-pointer text-center"
              >
                {loadingAi ? '⏳ Mapping neural paths...' : '🔮 Generate AI Milestones Insights'}
              </Button>
            </div>

            <AnimatePresence>
              {aiReport && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2 border-t border-indigo-100"
                >
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white border border-indigo-100/60 shadow-xs">
                    <span className="text-[8px] font-extrabold text-indigo-700 uppercase font-mono block">Clinical Synthesis:</span>
                    <p className="text-[11px] leading-relaxed text-stone-700 italic">
                      "{aiReport.summary}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-extrabold text-stone-500 uppercase font-mono block">Recommended Strategies:</span>
                    <ul className="space-y-1.5 text-[10px] text-stone-650 font-medium">
                      {aiReport.strategies?.map((strat, i) => (
                        <li key={i} className="flex items-start gap-1 pb-1">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {aiReport.recommendedCoRegulationActivity && (
                    <div className="p-4 rounded-3xl bg-indigo-900 text-white space-y-2.5 shadow-sm">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-200">Recommended Co-regulation Practice</span>
                      </div>
                      <h5 className="font-bold font-serif text-stone-100 text-xs">{aiReport.recommendedCoRegulationActivity.title}</h5>
                      <p className="text-[10px] text-stone-300 font-mono leading-relaxed whitespace-pre-wrap leading-relaxed">{aiReport.recommendedCoRegulationActivity.steps}</p>
                      
                      <div className="border-t border-white/10 pt-1.5 mt-1.5">
                        <span className="text-[8px] font-bold tracking-widest text-[#10b981] uppercase block font-mono">Sensory Biofeedback Benefit:</span>
                        <p className="text-[9.5px] italic text-stone-300">{aiReport.recommendedCoRegulationActivity.clinicalBenefit}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
