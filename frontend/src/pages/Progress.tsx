import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Heart,
  ChevronRight,
  Medal,
  Activity,
  Award,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Database,
  Lock,
  Unlock,
  RefreshCw,
  Cookie,
  Info,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import PositiveJourneyGuide from '@/components/live/PositiveJourneyGuide';

export default function Progress() {
  const { 
    modules, 
    dailyTasks, 
    reflections,
    studentHabits,
    studentPoints,
    studentPortfolio,
    visitStreakDays,
    visitStreakDates,
    unlockedAchievements,
    claimAchievement
  } = useApp();

  const [claimToast, setClaimToast] = useState<{ label: string; reward: number; icon: string } | null>(null);

  // Growth-over-time line toggles
  const [showLearningLine, setShowLearningLine] = useState(true);
  const [showTasksLine, setShowTasksLine] = useState(true);
  const [showTrackLine, setShowTrackLine] = useState(true);
  const [showEngagementLine, setShowEngagementLine] = useState(true);

  // Line chart interactive hover state
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Sandbox Override Mode to let parents toggle checklist items and watch the "Unlocking Logic AND Gates" update live!
  const [sandboxMode, setSandboxMode] = useState(false);

  // Manual simulator override checklist checks
  const [overrideOverallMastery, setOverrideOverallMastery] = useState(true);
  const [overrideModuleProgress, setOverrideModuleProgress] = useState(true);
  const [overrideTasksCompletion, setOverrideTasksCompletion] = useState(true);
  const [overrideReflectionJournal, setOverrideReflectionJournal] = useState(true);
  const [overrideCurrentStreak, setOverrideCurrentStreak] = useState(true);
  const [overrideBrowniePoints, setOverrideBrowniePoints] = useState(true);
  const [overrideBadges, setOverrideBadges] = useState(true);
  const [overrideNextMilestone, setOverrideNextMilestone] = useState(true);

  // Unlocking Logic manual gates overrides
  const [gateCohortChecked, setGateCohortChecked] = useState(true);
  const [gateRequiredLessonsChecked, setGateRequiredLessonsChecked] = useState(true);
  const [gateMinTaskPercentChecked, setGateMinTaskPercentChecked] = useState(true);
  const [gateTimeWindowChecked, setGateTimeWindowChecked] = useState(true);

  // Active Cycle Loop interactive focus state
  const [activeCycleStep, setActiveCycleStep] = useState<'learn' | 'practice' | 'reflect' | 'track' | 'grow' | null>(null);

  // Dynamic calculations based on live state
  const completedModulesCount = modules.filter(m => m.progress === 100).length;
  const completedTasksCount = dailyTasks.filter(t => t.completed).length;

  const totalLessonsCount = modules.flatMap(m => m.lessons).length;
  const completedLessonsCount = modules.flatMap(m => m.lessons).filter(l => l.completed).length;
  const overallMasteryPercent = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  const streakDays = visitStreakDays;

  // Checklist item active states: uses live values by default, or sandbox overrides if toggled
  const ckMastery = sandboxMode ? overrideOverallMastery : overallMasteryPercent > 0;
  const ckModule = sandboxMode ? overrideModuleProgress : completedModulesCount > 0;
  const ckTasks = sandboxMode ? overrideTasksCompletion : completedTasksCount > 0;
  const ckReflection = sandboxMode ? overrideReflectionJournal : reflections.length > 0;
  const ckStreak = sandboxMode ? overrideCurrentStreak : streakDays > 0;
  const ckPoints = sandboxMode ? overrideBrowniePoints : studentPoints > 0;
  const ckBadges = sandboxMode ? overrideBadges : unlockedAchievements.length > 0;
  const ckMilestone = sandboxMode ? overrideNextMilestone : completedModulesCount >= 1;

  // Dynamic values based on either standard template demo rate or live metrics
  const activeOverallVal = overallMasteryPercent > 0 ? overallMasteryPercent : 72;
  const activeTaskCompletionVal = completedTasksCount > 0 ? Math.round((completedTasksCount / Math.max(1, dailyTasks.length)) * 100) : 85;
  const activeStreakVal = streakDays > 0 ? streakDays : 12;
  const activePointsVal = studentPoints > 0 ? studentPoints : 1250;

  // Custom Chart Coordinates Data mapping
  const daysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartPoints = {
    Learning: [25, 42, 50, 68, 75, 82, 92],
    Tasks: [15, 30, 48, 52, 65, 78, 85],
    Track: [10, 18, 28, 38, 48, 50, 58],
    Engagement: [20, 38, 42, 58, 62, 70, 75]
  };

  const chartWidth = 550;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getLineX = (index: number) => {
    return paddingX + (index * (chartWidth - paddingX * 2) / (daysLabel.length - 1));
  };

  const getLineY = (value: number) => {
    // 0 -> chartHeight - paddingY, 100 -> paddingY
    return chartHeight - paddingY - (value * (chartHeight - paddingY * 2) / 100);
  };

  const generateSvgPath = (values: number[]) => {
    return values.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getLineX(idx)} ${getLineY(val)}`).join(' ');
  };

  // Next week's module unlocking state computed from standard AND gates
  const isUnlockedNextModule = gateCohortChecked && gateRequiredLessonsChecked && gateMinTaskPercentChecked && gateTimeWindowChecked;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Visual Elegant Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-stone-900 text-stone-100 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-black">
              Standard Dashboard
            </span>
            <span className="bg-[#009473]/10 text-[#009473] font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
              ✨ 4-Step Co-Regulation Sync Active
            </span>
          </div>
          <h1 className="text-4xl font-serif text-stone-900 tracking-tight font-bold leading-tight">
            Comprehensive Progress Blueprint
          </h1>
          <p className="text-stone-500 font-sans text-sm max-w-xl">
            A high-fidelity dynamic representation of the parenting co-regulation flow: Learn, Practice, Reflect, Track, and Grow.
          </p>
        </div>

        {/* Live System vs Sandbox Simulator Selector */}
        <div className="bg-stone-100/80 p-1.5 rounded-2xl flex items-center border border-stone-200 shadow-2xs shrink-0 font-sans">
          <button
            onClick={() => setSandboxMode(false)}
            className={cn(
              "py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer",
              !sandboxMode 
                ? "bg-white text-stone-900 shadow-xs border border-stone-200" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            💻 Live Synced DB
          </button>
          <button
            onClick={() => setSandboxMode(true)}
            className={cn(
              "py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              sandboxMode 
                ? "bg-amber-500 text-white shadow-xs border border-amber-600/20" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            <Zap className="w-3 h-3 text-amber-350" /> Sandbox Simulator
          </button>
        </div>
      </header>

      {/* WARNING NOTIFICATION IF SANDBOX ACTIVE */}
      <AnimatePresence>
        {sandboxMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-200 text-amber-850 p-4 rounded-2xl flex items-center gap-3 text-xs leading-normal font-sans"
          >
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-extrabold uppercase tracking-wide">Simulator Sandbox Active:</strong> You can manually override the checklist criteria bullets, AND gate checks, and active feedback cycle states under the panels below to view how the scoring logic engine coordinates dynamically!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASTER SECTION 1: METRICS & CHARTS GRID */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* PANEL A: PROGRESS & ANALYTICS DASHBOARD (What Parent Sees) */}
        <Card className="lg:col-span-6 border border-stone-230/60 shadow-xs bg-white rounded-3xl p-6 flex flex-col justify-between space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                Analytics Module
              </span>
              <span className="text-stone-400 font-mono text-[9px]">Scope: Dynamic Parent Interface</span>
            </div>
            <h2 className="font-serif text-xl font-black text-stone-900">
              Progress & Analytics Dashboard <span className="font-sans font-normal text-stone-400 text-sm">(What Parent Sees)</span>
            </h2>
            <p className="text-xs text-stone-500">
              Monitor key developmental co-regulation telemetry tracked across this cohort's active weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-stretch pt-2">
            
            {/* Left Checkmarks List Column */}
            <div className="md:col-span-5 space-y-2.5 bg-stone-50/50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block pb-1 border-b border-stone-200/60">
                Co-Regulation Checklist
              </span>
              
              {[
                { label: 'Overall Mastery %', state: ckMastery, setter: setOverrideOverallMastery },
                { label: 'Module Progress', state: ckModule, setter: setOverrideModuleProgress },
                { label: 'Tasks Completion %', state: ckTasks, setter: setOverrideTasksCompletion },
                { label: 'Reflection Journal', state: ckReflection, setter: setOverrideReflectionJournal },
                { label: 'Current Streak', state: ckStreak, setter: setOverrideCurrentStreak },
                { label: 'Brownie Points Balance', state: ckPoints, setter: setOverrideBrowniePoints },
                { label: 'Badges & Achievements', state: ckBadges, setter: setOverrideBadges }
              ].map((item, idx) => (
                <button
                  key={idx}
                  disabled={!sandboxMode}
                  onClick={() => item.setter && item.setter(!item.state)}
                  className={cn(
                    "w-full text-left flex items-center justify-between text-xs py-1 px-1.5 rounded-md transition-all",
                    sandboxMode ? "hover:bg-amber-50 cursor-pointer" : "cursor-default"
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all",
                      item.state 
                        ? "bg-[#009473] border-[#009473] text-white" 
                        : "bg-white border-stone-300 text-transparent"
                    )}>
                      <Check className="w-2.5 h-2.5 stroke-[4]" />
                    </div>
                    <span className={cn(
                      "font-sans truncate",
                      item.state ? "text-stone-800 font-medium" : "text-stone-400 line-through decoration-stone-200"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  {sandboxMode && (
                    <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded uppercase font-bold shrink-0">
                      Sim
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Visual Stats Box Grid Column */}
            <div className="md:col-span-7 grid grid-cols-2 gap-3.5">
              
              {/* Overall Progress ring */}
              <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#009473] font-mono">
                  Overall Progress
                </span>
                
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" className="stroke-stone-200 fill-none" strokeWidth="5.5" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="32" 
                      className="stroke-[#009473] fill-none transition-all duration-1000" 
                      strokeWidth="5.5" 
                      strokeDasharray={2 * Math.PI * 32} 
                      strokeDashoffset={2 * Math.PI * 32 * (1 - activeOverallVal / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-x-0 text-center font-serif text-lg font-black text-stone-900">
                    {activeOverallVal}%
                  </div>
                </div>
              </div>

              {/* Task Completion weekly ring */}
              <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
                  Weekly Tasks
                </span>
                
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" className="stroke-stone-200 fill-none" strokeWidth="5.5" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="32" 
                      className="stroke-emerald-500 fill-none transition-all duration-1000" 
                      strokeWidth="5.5" 
                      strokeDasharray={2 * Math.PI * 32} 
                      strokeDashoffset={2 * Math.PI * 32 * (1 - activeTaskCompletionVal / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-x-0 text-center font-serif text-lg font-black text-stone-900">
                    {activeTaskCompletionVal}%
                  </div>
                </div>
              </div>

              {/* Streak box */}
              <div className="bg-stone-50 border border-stone-100 p-3 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                  <Flame className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block font-mono">
                    Streak
                  </span>
                  <p className="text-base font-serif font-black text-stone-900 truncate">
                    {activeStreakVal} Days
                  </p>
                </div>
              </div>

              {/* Brownie Points box */}
              <div className="bg-stone-50 border border-stone-100 p-3 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                  <Cookie className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block font-mono">
                    Brownie Points
                  </span>
                  <p className="text-base font-serif font-black text-stone-900 truncate">
                    {activePointsVal.toLocaleString()} XP
                  </p>
                </div>
              </div>

              {/* Stacked Learning Progress (Modules) Bar list */}
              <div className="col-span-2 bg-stone-50 border border-stone-100 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#009473] font-mono">
                    Learning Progress (Modules)
                  </span>
                  <span className="text-[8px] text-stone-400 font-mono">W1-W8 Overview</span>
                </div>
                
                {/* Custom bar list */}
                <div className="flex items-end justify-between h-14 pt-2 px-1 gap-2.5">
                  {[
                    { week: 'W1', height: 'h-full', color: 'bg-emerald-500', mastery: '100%' },
                    { week: 'W2', height: 'h-4/6', color: 'bg-[#009473]', mastery: '65%' },
                    { week: 'W3', height: 'h-2/6', color: 'bg-blue-500', mastery: '35%' },
                    { week: 'W4', height: 'h-5/6', color: 'bg-[#009473]', mastery: '80%' },
                    { week: 'W5', height: 'h-1/6', color: 'bg-stone-300', mastery: '0%' },
                    { week: 'W6', height: 'h-1/6', color: 'bg-stone-300', mastery: '0%' },
                    { week: 'W7', height: 'h-1/6', color: 'bg-stone-300', mastery: '0%' },
                    { week: 'W8', height: 'h-1/6', color: 'bg-stone-300', mastery: '0%' }
                  ].map((bar, barIdx) => (
                    <div key={barIdx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1.5 hidden group-hover:block z-20 bg-stone-900 text-white text-[9px] p-1.5 rounded shadow-lg whitespace-nowrap">
                        Week {barIdx + 1} Mastery: {bar.mastery}
                      </div>
                      <div className="w-full bg-stone-200 rounded-t-sm h-full flex items-end overflow-hidden">
                        <div className={cn("w-full rounded-t-sm transition-all duration-500", bar.height, bar.color)}></div>
                      </div>
                      <span className="text-[8px] font-mono text-stone-400">{bar.week}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </Card>

        {/* PANEL B: GROWTH OVER TIME (Custom interactive SVG line chart) */}
        <Card className="lg:col-span-6 border border-stone-210/60 shadow-xs bg-white rounded-3xl p-6 flex flex-col justify-between space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider font-mono bg-purple-50 px-2 py-0.5 rounded-md">
                Continuous Logs
              </span>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Growth Over Time
              </h2>
            </div>

            {/* Line Filter Toggles */}
            <div className="flex flex-wrap gap-1.5 text-[10px] font-sans font-medium">
              <button 
                onClick={() => setShowLearningLine(!showLearningLine)}
                className={cn(
                  "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                  showLearningLine ? "bg-red-50 text-red-700 border-red-200" : "bg-stone-50 text-stone-400 border-stone-200/50"
                )}
              >
                🔴 Learning
              </button>
              <button 
                onClick={() => setShowTasksLine(!showTasksLine)}
                className={cn(
                  "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                  showTasksLine ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-stone-50 text-stone-400 border-stone-200/50"
                )}
              >
                🔵 Tasks
              </button>
              <button 
                onClick={() => setShowTrackLine(!showTrackLine)}
                className={cn(
                  "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                  showTrackLine ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-50 text-stone-400 border-stone-200/50"
                )}
              >
                🟢 Track
              </button>
              <button 
                onClick={() => setShowEngagementLine(!showEngagementLine)}
                className={cn(
                  "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                  showEngagementLine ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-stone-50 text-stone-400 border-stone-200/50"
                )}
              >
                🟣 Engagement
              </button>
            </div>
          </div>

          {/* Interactive Chart Core */}
          <div className="relative pt-2">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible select-none"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="learnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Grid Y-axis guides */}
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line 
                    x1={paddingX} 
                    y1={getLineY(v)} 
                    x2={chartWidth - paddingX} 
                    y2={getLineY(v)} 
                    stroke="#eae6e3" 
                    strokeWidth="1" 
                    strokeDasharray="4,4" 
                  />
                  <text 
                    x={paddingX - 10} 
                    y={getLineY(v) + 3} 
                    className="fill-stone-400 font-mono text-[9px] text-right"
                    textAnchor="end"
                  >
                    {v}%
                  </text>
                </g>
              ))}

              {/* X-axis days label */}
              {daysLabel.map((day, idx) => (
                <g key={day}>
                  <text 
                    x={getLineX(idx)} 
                    y={chartHeight - 10} 
                    className="fill-stone-400 font-mono text-[10px] text-center"
                    textAnchor="middle"
                  >
                    {day}
                  </text>
                  <line
                    x1={getLineX(idx)}
                    y1={chartHeight - paddingY}
                    x2={getLineX(idx)}
                    y2={paddingY}
                    stroke="#000"
                    strokeOpacity={hoveredPointIndex === idx ? "0.1" : "0"}
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  {/* Invisible block to trigger hover index */}
                  <rect
                    x={getLineX(idx) - (chartWidth / daysLabel.length / 2)}
                    y={0}
                    width={chartWidth / daysLabel.length}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                </g>
              ))}

              {/* Render dynamic line paths & gradient regions */}
              {showLearningLine && (
                <>
                  <path 
                    d={generateSvgPath(chartPoints.Learning)} 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d={`${generateSvgPath(chartPoints.Learning)} L ${getLineX(daysLabel.length - 1)} ${chartHeight - paddingY} L ${getLineX(0)} ${chartHeight - paddingY} Z`} 
                    fill="url(#learnGrad)" 
                  />
                </>
              )}

              {showTasksLine && (
                <>
                  <path 
                    d={generateSvgPath(chartPoints.Tasks)} 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d={`${generateSvgPath(chartPoints.Tasks)} L ${getLineX(daysLabel.length - 1)} ${chartHeight - paddingY} L ${getLineX(0)} ${chartHeight - paddingY} Z`} 
                    fill="url(#taskGrad)" 
                  />
                </>
              )}

              {showTrackLine && (
                <>
                  <path 
                    d={generateSvgPath(chartPoints.Track)} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d={`${generateSvgPath(chartPoints.Track)} L ${getLineX(daysLabel.length - 1)} ${chartHeight - paddingY} L ${getLineX(0)} ${chartHeight - paddingY} Z`} 
                    fill="url(#trackGrad)" 
                  />
                </>
              )}

              {showEngagementLine && (
                <>
                  <path 
                    d={generateSvgPath(chartPoints.Engagement)} 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d={`${generateSvgPath(chartPoints.Engagement)} L ${getLineX(daysLabel.length - 1)} ${chartHeight - paddingY} L ${getLineX(0)} ${chartHeight - paddingY} Z`} 
                    fill="url(#engGrad)" 
                  />
                </>
              )}

              {/* Render dynamic dots on the line */}
              {daysLabel.map((_, idx) => (
                <g key={idx}>
                  {showLearningLine && (
                    <circle 
                      cx={getLineX(idx)} 
                      cy={getLineY(chartPoints.Learning[idx])} 
                      r={hoveredPointIndex === idx ? 5 : 3.5} 
                      fill="#ef4444" 
                      stroke="#white" 
                      strokeWidth="1.5"
                    />
                  )}
                  {showTasksLine && (
                    <circle 
                      cx={getLineX(idx)} 
                      cy={getLineY(chartPoints.Tasks[idx])} 
                      r={hoveredPointIndex === idx ? 5 : 3.5} 
                      fill="#3b82f6" 
                      stroke="#white" 
                      strokeWidth="1.5"
                    />
                  )}
                  {showTrackLine && (
                    <circle 
                      cx={getLineX(idx)} 
                      cy={getLineY(chartPoints.Track[idx])} 
                      r={hoveredPointIndex === idx ? 5 : 3.5} 
                      fill="#10b981" 
                      stroke="#white" 
                      strokeWidth="1.5"
                    />
                  )}
                  {showEngagementLine && (
                    <circle 
                      cx={getLineX(idx)} 
                      cy={getLineY(chartPoints.Engagement[idx])} 
                      r={hoveredPointIndex === idx ? 5 : 3.5} 
                      fill="#8b5cf6" 
                      stroke="#white" 
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Custom overlay tooltip */}
            {hoveredPointIndex !== null && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-stone-900 text-stone-100 p-3 rounded-xl shadow-lg border border-stone-800 text-[10px] w-52 grid grid-cols-2 gap-1.5 font-sans">
                <div className="col-span-2 font-bold border-b border-stone-800 pb-1 text-stone-300 flex justify-between">
                  <span>Day: {daysLabel[hoveredPointIndex]} Summary</span>
                  <span className="text-amber-400 font-mono">Synced</span>
                </div>
                {showLearningLine && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Learn: <strong>{chartPoints.Learning[hoveredPointIndex]}%</strong></span>
                  </div>
                )}
                {showTasksLine && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Tasks: <strong>{chartPoints.Tasks[hoveredPointIndex]}%</strong></span>
                  </div>
                )}
                {showTrackLine && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Track: <strong>{chartPoints.Track[hoveredPointIndex]}%</strong></span>
                  </div>
                )}
                {showEngagementLine && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Engage: <strong>{chartPoints.Engagement[hoveredPointIndex]}%</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-stone-400 px-2 pt-1 border-t border-stone-100/60 leading-normal font-sans">
            <strong>Chart Description:</strong> Reflects calculated co-regulation response metrics logging consistent parent engagement rates and synced habit completions.
          </div>

        </Card>

      </div>

      {/* DUAL SECTION 2: INSIGHTS CARD & CRITICAL UNLOCKING PIPELINE */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* INSIGHTS & RECOMMENDATIONS CARD (Right Side Widget of Image) */}
        <Card className="lg:col-span-4 border border-stone-210/60 shadow-xs bg-white rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider font-mono bg-emerald-50 px-2 py-0.5 rounded-md">
                Co-Regulation Action
              </span>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Insights & Recommendations
              </h2>
            </div>

            <div className="space-y-3 font-sans">
              {[
                { text: 'Keep up the great work!', desc: 'You completed your core modular lessons perfectly. Keep studying!', link: '/learn', c: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { text: 'Try to maintain your reflection streak', desc: 'Consistency builds safety. Fill out today\'s reflection journal prompt.', link: '/learn', c: 'text-[#009473] bg-teal-50/50 border-teal-100' },
                { text: 'Complete 2 more tasks to earn weekly bonus', desc: 'Finish checking off active co-regulation steps in the Child Wellness portal.', link: '/studentspace', c: 'text-blue-700 bg-blue-50/50 border-blue-100' }
              ].map((rec, recIdx) => (
                <div key={recIdx} className={cn("p-3 rounded-2xl border text-xs space-y-1 transition-all", rec.c)}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{rec.text}</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-normal pl-5.5">
                    {rec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009473] animate-ping"></span>
              <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wide">Dynamic Engine Core</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
              Recommendations adapt in real-time as parents record journal logs and students claim connected badges.
            </p>
          </div>
        </Card>

        {/* SYSTEM PIPELINE: UNLOCKING MODULES LOGIC */}
        <Card className="lg:col-span-8 border border-stone-230/60 shadow-xs bg-stone-900 text-stone-100 rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
                Level Validation Engine
              </span>
              <span className="text-stone-400 font-mono text-[10px]">• Auto-Synchronizer</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-stone-100">
              Co-Regulation Level Progression & Unlocking Pathway
            </h2>
            <p className="text-xs text-stone-400 font-sans max-w-xl">
              Inspect how the integrated Cohort gating engine evaluates student lesson checklists, lock deadlines, and time parameters before unlocking the next weekly module.
            </p>
          </div>

          {/* Interactive AND Gates and Locked State flow */}
          <div className="grid md:grid-cols-12 gap-6 items-center pt-2 font-sans relative">
            
            {/* Box 4: UNLOCKING LOGIC (NEXT MODULE) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest font-black">
                  4. Unlocking Logic (Next Module)
                </span>
                {sandboxMode && <span className="text-[9px] text-amber-400 bg-amber-400/15 py-0.5 px-1.5 rounded animate-pulse">Click to Toggle</span>}
              </div>

              {[
                { label: 'Based on Cohort Week & Start Date', state: gateCohortChecked, setter: setGateCohortChecked, desc: 'Cohort start calculations verify active calendar weeks.' },
                { label: 'Required Lessons Completed', state: gateRequiredLessonsChecked, setter: setGateRequiredLessonsChecked, desc: 'All structural core parent co-regulation lessons are complete.' },
                { label: 'Minimum Task Completion %', state: gateMinTaskPercentChecked, setter: setGateMinTaskPercentChecked, desc: 'Requires a minimum of 75% daily habits checked off.' },
                { label: 'Time Window Reached', state: gateTimeWindowChecked, setter: setGateTimeWindowChecked, desc: 'Minimum 7-day developmental dwell time is reached.' }
              ].map((gate, gateIdx) => (
                <div 
                  key={gateIdx} 
                  onClick={() => sandboxMode && gate.setter(!gate.state)}
                  className={cn(
                    "p-2.5 rounded-xl border flex items-start gap-2.5 transition-all",
                    gate.state 
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" 
                      : "bg-red-950/20 border-red-500/20 text-red-300/80",
                    sandboxMode ? "hover:bg-white/5 cursor-pointer" : "cursor-default"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5",
                    gate.state ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                  )}>
                    {gate.state ? 'AND' : 'PEND'}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold leading-normal">{gate.label}</p>
                    <p className="text-[9px] text-stone-400 leading-normal">{gate.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transition Arrow Indicator Column */}
            <div className="md:col-span-2 flex flex-col items-center justify-center gap-1 py-4">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-white/10 text-stone-300">
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded uppercase tracking-wide border border-purple-900">
                AND gate check
              </span>
            </div>

            {/* Box 5: NEXT MODULE UNLOCKED box */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-stone-800/80 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                <div className={cn(
                  "absolute -right-12 -bottom-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-700",
                  isUnlockedNextModule ? "bg-emerald-500/20" : "bg-purple-500/20"
                )} />
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest font-black">
                    Engine Validation Result
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center">
                    <motion.div 
                      key={isUnlockedNextModule ? "open" : "locked"}
                      initial={{ scale: 0.8, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isUnlockedNextModule 
                          ? "bg-emerald-500/10 border-emerald-400 text-emerald-400" 
                          : "bg-purple-500/10 border-purple-400 text-purple-400"
                      )}
                    >
                      {isUnlockedNextModule ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                    </motion.div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      {isUnlockedNextModule ? "NEXT MODULE UNLOCKED!" : "NEXT MODULE GATED"}
                    </h3>
                    <p className="text-[11px] text-stone-300 font-normal">
                      Parent gets immediate co-regulation access to next week's parenting curriculum.
                    </p>
                  </div>
                </div>

                <div className="text-[9px] text-[#009473] bg-[#009473]/10 border border-[#009473]/20 py-2 px-3 rounded-xl font-medium leading-normal w-full max-w-xs">
                  📢 <strong>Instant Alert:</strong> SMS & WhatsApp notification drafted to dispatch immediately (if consent enabled).
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 2C: CYCLE CONTINUES FLOW loop */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Legend */}
            <div className="space-y-2">
              <span className="text-[9px] text-stone-400 font-mono uppercase tracking-widest font-bold">
                COLOR CODED FLOW LEGEND
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] font-sans font-medium">
                <span className="bg-blue-950/50 text-blue-300 px-2 py-1 rounded flex items-center gap-1.5 border border-blue-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> User Actions (UI)
                </span>
                <span className="bg-emerald-950/50 text-emerald-300 px-2 py-1 rounded flex items-center gap-1.5 border border-emerald-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Learning Flow (Week)
                </span>
                <span className="bg-amber-950/50 text-amber-300 px-2 py-1 rounded flex items-center gap-1.5 border border-amber-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Scoring Logic
                </span>
                <span className="bg-purple-950/50 text-purple-300 px-2 py-1 rounded flex items-center gap-1.5 border border-purple-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Data Flow / Pipelines
                </span>
              </div>
            </div>

            {/* Rotating Cycle */}
            <div className="bg-stone-800 p-4 rounded-3xl border border-white/5 flex items-center gap-4 max-w-md w-full font-serif">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-purple-500/40 rounded-full"
                />
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-lg">
                  🔄
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs uppercase font-mono tracking-widest text-purple-400 font-bold">
                  Cycle Continues Loop
                </h4>
                <p className="text-stone-100 text-xs font-black">
                  Learn ➔ Practice ➔ Reflect ➔ Track ➔ Grow
                </p>
                <p className="text-[10px] text-stone-400 font-sans">
                  The cumulative pathway that results in a continuous positive parenting journey!
                </p>
              </div>
            </div>

          </div>

        </Card>

      </div>

      {/* RENDER COMPONENT 2: CHILD'S SYNCED WELLNESS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-serif text-stone-800 font-bold">Your Child's Connected Wellness Progress</h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Synced Live Session</span>
        </div>

        <Card className="border-none shadow-sm bg-stone-900 text-white rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-3 gap-6 items-center">
            
            {/* Left Col: Child Status */}
            <div className="space-y-2">
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-bold">STUDENT ACTIVE PROFILE</span>
              <h3 className="text-2xl font-serif font-bold text-white">Little John's Calm Space</h3>
              <div className="flex gap-4 text-xs font-bold mt-2 font-sans">
                <span className="flex items-center gap-1">🔥 {studentHabits.filter(h => h.completed).length + 3} Days Streak</span>
                <span className="flex items-center gap-1">🏆 {studentPoints} Experience XP</span>
              </div>
            </div>

            {/* Middle Col: Checked off habits */}
            <div className="space-y-2">
              <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider font-bold">TODAY'S ACTIVE HABITS</span>
              <div className="space-y-1 font-sans">
                {studentHabits.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                    <span className={h.completed ? 'text-emerald-400' : 'text-stone-500'}>
                      {h.completed ? '●' : '○'}
                    </span>
                    <span className={h.completed ? 'line-through text-stone-400' : ''}>{h.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Download portfolio action */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const WinPrint = window.open('', '', 'width=950,height=800,toolbar=0,scrollbars=0,status=0');
                  if (!WinPrint) return;
                  WinPrint.document.write(`
                    <html>
                      <head>
                        <title>Student Stress-Relief Portfolio</title>
                        <style>
                          body { font-family: 'Inter', sans-serif; margin: 0; padding: 50px; background: #fff; color: #292524; }
                          .header { text-align: center; border-bottom: 3px double #8bad8b; padding-bottom: 20px; margin-bottom: 40px; }
                          h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #386641; margin: 0; }
                          .decor { font-size: 11px; text-transform: uppercase; tracking: 3px; color: #d4a373; font-weight: bold; margin-top: 10px; }
                          .card { border: 1px solid #e7e5e4; border-radius: 16px; padding: 25px; margin-bottom: 24px; background: #fafaf9; }
                          .section-title { font-size: 12px; text-transform: uppercase; font-weight: bold; color: #8bad8b; letter-spacing: 1px; margin: 0 0 10px 0; }
                          .section-body { font-size: 16px; line-height: 1.6; color: #1c1917; font-weight: 500; font-style: italic; }
                          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 20px; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1>Stress-Relief Wellness Portfolio</h1>
                          <div class="decor">Synced via Parent Guidance Portal - Child Session for Little John</div>
                        </div>

                        <div class="card">
                          <h3 class="section-title">🎈 Amygdala Calm down Mechanism</h3>
                          <p class="section-body">"${studentPortfolio.favoriteBreathing || 'Deep belly balloon breaths'}"</p>
                        </div>

                        <div class="card">
                          <h3 class="section-title">🧍 Physical Stress Release Strategy</h3>
                          <p class="section-body">"${studentPortfolio.calmDownStrategy || 'Slow stretching and deep quiet sighs'}"</p>
                        </div>

                        <div class="card">
                          <h3 class="section-title">💬 Family Mindful Talk Plan</h3>
                          <p class="section-body font-sans font-medium">"${studentPortfolio.parentTalkCommitment || 'Explaining body stress signals calmly'}"</p>
                        </div>

                        <div class="card">
                          <h3 class="section-title">🌱 Child Mental State Check</h3>
                          <p class="section-body">"${studentPortfolio.feelingToday || 'Happy and mindful'}"</p>
                        </div>

                        <div class="card">
                          <h3 class="section-title">📔 Student Reflection Entry</h3>
                          <p class="section-body">"${studentPortfolio.journalEntry || 'No notes saved yet'}"</p>
                        </div>

                        <div class="footer font-mono text-stone-400">
                          Certified Parent Guidance Sync • ${new Date().toLocaleDateString()}
                        </div>
                        <script>
                          window.onload = function() { window.print(); window.close(); }
                        </script>
                      </body>
                    </html>
                  `);
                  WinPrint.document.close();
                  WinPrint.focus();
                }}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-6 py-5 rounded-full shadow-md cursor-pointer"
              >
                Download Child Stress Portfolio (PDF)
              </Button>
            </div>

          </div>
        </Card>
      </section>

      {/* Positive Journey Guideline Blueprint */}
      <section className="space-y-6">
        <PositiveJourneyGuide isStudent={false} />
      </section>

      {/* History of Reflection Journal entries */}
      {reflections.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-serif text-stone-800 font-bold">Your Reflection Journal Dashboard</h2>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider font-mono">{reflections.length} Entries catalogued</span>
          </div>

          <div className="grid gap-4">
            {reflections.map((ref) => (
              <Card key={ref.id} className="border-none shadow-xs bg-white rounded-3xl p-6 lg:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-accent-warm/15 text-accent-warm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">WEEK {ref.week} Reflection</span>
                    <span className="text-[10px] text-stone-400 font-mono">Date: {new Date(ref.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-accent-sage font-mono">● Private Saved</span>
                </div>
                <div>
                  <p className="font-serif italic text-stone-500 text-xs mb-2">Prompt: "{ref.prompt}"</p>
                  <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">{ref.entry}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Badges & Milestones */}
      <section id="quests" className="space-y-6">
         <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-stone-200/50 flex flex-col md:flex-row items-add justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
             <div className="flex items-center gap-2">
               <span className="bg-[#009473]/10 text-[#009473] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                 <Sparkles className="w-3 h-3 text-[#009473]" /> Dynamic Milestone System
               </span>
               <span className="text-xs font-mono text-stone-400">• Supabase Persistent Sync</span>
             </div>
             <h2 className="text-2xl font-serif text-stone-900 font-bold">LMS Achievements Quest Board</h2>
             <p className="text-xs text-stone-500 leading-relaxed max-w-2xl font-sans">
               Complete tasks, write journal logs, and maintain check-in streaks to unlock premium badges. Unlocked badges can be claimed below to redeem experience rewards that sync immediately with your local server ledger and Supabase Postgres database.
             </p>
           </div>
           
           {/* Interactive Sandbox Activity Simulator */}
           <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3 shrink-0 max-w-xs w-full font-sans">
             <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-stone-800 uppercase tracking-widest flex items-center gap-1">
                 ⚙️ Activity Simulator
               </span>
               <span className="text-[9px] font-mono bg-amber-100 text-amber-800 py-0.5 px-2 rounded font-black">TESTING MODE</span>
             </div>
             <div className="grid grid-cols-2 gap-2 text-[10px]">
               <Button 
                 onClick={() => {
                   const savedDates = [...visitStreakDates];
                   const nextS = new Date();
                   nextS.setDate(nextS.getDate() - savedDates.length);
                   const nextStr = nextS.toISOString().split('T')[0];
                   savedDates.push(nextStr);
                   localStorage.setItem('parent_guidance_visit_streak_dates', JSON.stringify(savedDates));
                   localStorage.setItem('parent_guidance_visit_streak_days', String(savedDates.length));
                   window.location.reload();
                 }}
                 variant="outline" 
                 size="sm" 
                 className="rounded-lg h-8 text-[9px] font-bold border-stone-200 hover:bg-stone-50 cursor-pointer"
               >
                 ☀️ Day Check-in +1
               </Button>
               <Button 
                 onClick={() => {
                   const key = reflections.length + 1;
                   const entry = {
                     id: 'dummy_' + Date.now(),
                     moduleId: 'm' + (key),
                     lessonId: 'l' + (key),
                     week: Number((reflections.length % 4) + 1),
                     prompt: "Simulated parenting de-escalation technique outcomes",
                     entry: "Did the calm breathing simulation check-in successfully. Connection established with child.",
                     createdAt: new Date().toISOString()
                   };
                   localStorage.setItem('parent_guidance_reflections', JSON.stringify([...reflections, entry]));
                   window.location.reload();
                 }}
                 variant="outline" 
                 size="sm" 
                 className="rounded-lg h-8 text-[9px] font-bold border-stone-200 hover:bg-stone-50 cursor-pointer"
               >
                 📝 Add reflection
               </Button>
               <Button 
                 onClick={() => {
                   localStorage.setItem('parent_guidance_student_points', String(Number(localStorage.getItem('parent_guidance_student_points') || 0) + 150));
                   window.location.reload();
                 }}
                 variant="outline" 
                 size="sm" 
                 className="rounded-lg h-8 text-[9px] font-bold border-stone-200 hover:bg-stone-50 col-span-2 text-center cursor-pointer"
               >
                 ✨ Inject +150 Experience XP
               </Button>
             </div>
           </div>
         </div>

         {/* Grid render of the 10 badges */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 font-sans">
            {[
              {
                id: 'first_step',
                icon: '🌱',
                label: 'First Step',
                desc: 'Log in and explore your active parenting space.',
                condition: visitStreakDays > 0,
                progressText: visitStreakDays > 0 ? 'Verified' : '0/1 visits',
                reward: 20
              },
              {
                id: 'emotional_iq',
                icon: '🧠',
                label: 'Emotional IQ',
                desc: 'Pen your first cognitive de-escalation journal reflection.',
                condition: reflections.length >= 1,
                progressText: `${reflections.length}/1 reflections`,
                reward: 50
              },
              {
                id: 'fast_starter',
                icon: '🔥',
                label: 'Fast Starter',
                desc: 'Achieve a consecutive 3-day parenting check-in streak.',
                condition: visitStreakDays >= 3,
                progressText: `Streak: ${visitStreakDays}/3 days`,
                reward: 100
              },
              {
                id: 'comm_master',
                icon: '💬',
                label: 'Comm. Master',
                desc: 'Complete at least 2 active communication lessons.',
                condition: completedLessonsCount >= 2,
                progressText: `Lessons: ${completedLessonsCount}/2 done`,
                reward: 75
              },
              {
                id: 'task_champ',
                icon: '🎯',
                label: 'Habit Champion',
                desc: 'Check off 4 daily parenting habit actions.',
                condition: completedTasksCount >= 4,
                progressText: `Tasks: ${completedTasksCount}/4 done`,
                reward: 100
              },
              {
                id: 'reflective_parent',
                icon: '✍️',
                label: 'Reflective Sage',
                desc: 'Complete at least 3 emotional journal entries.',
                condition: reflections.length >= 3,
                progressText: `${reflections.length}/3 entries`,
                reward: 120
              },
              {
                id: 'zen_parent',
                icon: '🧘',
                label: 'Zen Master',
                desc: 'Bring at least 1 module completely to 100% mastery.',
                condition: completedModulesCount >= 1 || completedLessonsCount >= 5,
                progressText: `${completedModulesCount}/1 masteries`,
                reward: 150
              },
              {
                id: 'streak_legend',
                icon: '👑',
                label: 'Streak Legend',
                desc: 'Keep consistency high with a 5-day check-in streak.',
                condition: visitStreakDays >= 5,
                progressText: `Streak: ${visitStreakDays}/5 days`,
                reward: 180
              },
              {
                id: 'cloud_backed',
                icon: '☁️',
                label: 'Cloud Protected',
                desc: 'Sync progress records automatically to cloud network database.',
                condition: true,
                progressText: 'Live connected',
                reward: 50
              },
              {
                id: 'points_pioneer',
                icon: '💎',
                label: 'Points Pioneer',
                desc: 'Accumulate more than 800 experience points.',
                condition: studentPoints >= 800,
                progressText: `${studentPoints}/800 XP`,
                reward: 200
              }
            ].map((badge) => {
              const isClaimed = unlockedAchievements.includes(badge.id);
              const isReadyToClaim = badge.condition && !isClaimed;
              
              return (
                <motion.div 
                  key={badge.id} 
                  whileHover={{ y: -5 }}
                  className={cn(
                    "flex flex-col items-center justify-between text-center gap-3 p-5 rounded-[2rem] border transition-all relative overflow-hidden",
                    isClaimed 
                      ? "bg-stone-50/75 border-emerald-200/50 opacity-90 shadow-2xs" 
                      : isReadyToClaim 
                        ? "bg-white border-amber-300 shadow-md ring-2 ring-amber-400/20"
                        : "bg-stone-100/50 border-stone-200 opacity-60 grayscale scale-95"
                  )}
                >
                  {/* Status Indicator Badge */}
                  {isClaimed ? (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-[#009473] text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Claimed
                    </span>
                  ) : isReadyToClaim ? (
                    <span className="absolute top-2.5 right-2.5 bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full animate-bounce font-sans">
                      Ready!
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 bg-stone-200 text-stone-500 text-[8px] px-2 py-0.5 rounded-full font-mono">
                      Locked
                    </span>
                  )}

                  {/* Icon */}
                  <div className="space-y-1.5 mt-2">
                    <span className={cn(
                      "text-4xl block transition-transform duration-300",
                      isReadyToClaim ? "scale-115 animate-pulse" : (isClaimed ? "scale-100" : "scale-90")
                    )}>{badge.icon}</span>
                    <span className="text-xs font-black text-stone-900 block tracking-tight">{badge.label}</span>
                  </div>
                  
                  <p className="text-[10px] text-stone-500 leading-normal max-w-[150px] mx-auto min-h-[36px] flex items-center justify-center">
                    {badge.desc}
                  </p>
                  
                  {/* Action or Progress Text */}
                  {isClaimed ? (
                    <div className="w-full">
                      <div className="text-[9px] text-[#009473] font-bold bg-[#009473]/5 border border-[#009473]/10 py-1.5 rounded-xl block font-mono">
                         {badge.progressText}
                      </div>
                    </div>
                  ) : isReadyToClaim ? (
                    <Button
                      onClick={() => {
                        claimAchievement(badge.id, badge.reward);
                        setClaimToast({
                          label: badge.label,
                          reward: badge.reward,
                          icon: badge.icon
                        });
                        setTimeout(() => setClaimToast(null), 4000);
                      }}
                      className="w-full text-[9px] uppercase tracking-widest font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl py-1.5 h-auto shadow-sm cursor-pointer"
                    >
                      🎁 Claim +{badge.reward} XP
                    </Button>
                  ) : (
                    <div className="w-full">
                      <div className="text-[9px] text-stone-400 font-bold bg-stone-100 border border-stone-200/50 py-1.5 rounded-xl block font-mono font-medium">
                        {badge.progressText}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
         </div>
      </section>

      {/* Dynamic Celebration Toast Alert */}
      <AnimatePresence>
        {claimToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[999] bg-stone-900 text-white rounded-[2rem] p-6 shadow-2xl max-w-sm flex items-center gap-4 border border-white/10 font-sans"
          >
            <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center text-3xl shrink-0 border border-amber-400/30">
               {claimToast.icon}
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-amber-400 uppercase font-black tracking-widest flex items-center gap-1">
                ⭐ Quest Reward Claimed ⭐
              </span>
              <h4 className="text-sm font-serif font-bold text-stone-50">{claimToast.label}</h4>
              <p className="text-[10px] text-stone-400 leading-normal">
                 You have earned <strong>+{claimToast.reward} XP</strong>! This progress has been backed up in cloud database sync records.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement Footer */}
      <footer className="text-center pt-8 max-w-md mx-auto space-y-4">
         <div className="w-12 h-12 rounded-full bg-accent-sage/20 flex items-center justify-center text-accent-sage mx-auto">
            <Heart className="w-6 h-6 fill-current" />
         </div>
         <p className="text-base font-serif italic text-stone-600">
           "Transformation isn't about being perfect; it's about being present."
         </p>
      </footer>
    </div>
  );
}
