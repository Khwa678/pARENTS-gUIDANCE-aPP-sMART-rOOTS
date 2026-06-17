import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Heart, 
  Plus, 
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Check,
  UserCheck,
  Award,
  BookOpen,
  Flame,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

export default function Assignments() {
  const { 
    dailyTasks, 
    toggleDailyTask, 
    modules, 
    unlockModuleManually,
    isWhatsAppActive,
    setIsWhatsAppActive,
    sendTestWhatsApp,
    currentUser,
    reflections,
    notificationLogs,
    parents
  } = useApp();

  const [activeTab, setActiveTab] = useState<'calendar' | 'streak'>('calendar');

  const checkWeekUnlocked = (m: any) => {
    if (!m) return false;
    const activeParent = currentUser?.role === 'parent' 
      ? (parents?.find(p => p.phone === currentUser.phone) || currentUser)
      : currentUser;
    return currentUser?.role === 'admin' || currentUser?.isMentor || (activeParent && (activeParent.unlockedWeeksList || []).includes(m.week));
  };

  // Find active/current week path
  const activeModuleDefault = modules.find(m => checkWeekUnlocked(m) && m.progress < 100) || modules[0];
  const [selectedModuleId, setSelectedModuleId] = useState<string>(activeModuleDefault?.id || 'm2');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  // Interactive note & journaling states
  const [selectedTaskIdForNote, setSelectedTaskIdForNote] = useState<string | null>(null);
  const [customNoteText, setCustomNoteText] = useState('');

  const [selectedTaskIdForReflection, setSelectedTaskIdForReflection] = useState<string | null>(null);
  const [customReflectionText, setCustomReflectionText] = useState('');

  // Get selected module details
  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0];
  
  // Filter appropriate tasks
  const weekTasks = dailyTasks.filter(t => t.moduleId === currentModule.id);
  const completedCount = weekTasks.filter(t => t.completed).length;
  const completionPercent = weekTasks.length > 0 
    ? Math.round((completedCount / weekTasks.length) * 100) 
    : 0;

  const handleToggleTask = (id: string) => {
    toggleDailyTask(id);
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8bad8b', '#d4a373', '#e9c46a']
    });
  };

  const handleSaveNote = (taskId: string) => {
    toggleDailyTask(taskId, customNoteText);
    setSelectedTaskIdForNote(null);
    setCustomNoteText('');
    confetti({ particleCount: 20, colors: ['#8bad8b'] });
  };

  const handleSaveReflection = (taskId: string) => {
    toggleDailyTask(taskId, undefined, customReflectionText);
    setSelectedTaskIdForReflection(null);
    setCustomReflectionText('');
    confetti({ particleCount: 40, colors: ['#d4a373', '#8bad8b'] });
  };

  const handleUnlockWeek = (moduleId: string) => {
    unlockModuleManually(moduleId, true);
    confetti({
      particleCount: 100,
      spread: 80,
      colors: ['#8bad8b', '#d4a373', '#f2e8cf']
    });
  };

  // Get active rendering list
  const getTasksToRender = () => {
    if (selectedDay === 'all') {
      return weekTasks;
    }
    return weekTasks.filter(t => t.day === selectedDay);
  };

  const renderWhatsAppDirectStream = () => {
    if (!isWhatsAppActive) return null;
    return (
      <section className="space-y-6 pt-6 animate-fade-in">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📲</span>
            <h3 className="text-xl font-serif text-stone-850">Your Live Outgoing WhatsApp Stream</h3>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            Active Connection Direct Links
          </span>
        </div>

        <Card className="border border-stone-200/60 shadow-md rounded-[2.5rem] bg-white p-6 md:p-8 space-y-5">
          <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
            Whenever you complete a challenge or milestone, an alert is queued for phone delivery to <strong className="font-mono text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">{currentUser?.phone || "6307686532"}</strong>. If you are not getting automated alerts on your device, click the green button on any item below to send it instantly via the official WhatsApp chat!
          </p>

          {notificationLogs.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stone-50/50 border border-stone-150 text-center text-stone-400 text-xs">
              No recent notifications generated. Click checkboxes on the calendar to trigger new connection cues!
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {notificationLogs.slice(0, 3).map((log) => {
                const targetNo = (currentUser?.phone || "6307686532").replace(/\D/g, "");
                const waClickUrl = log.waLink || `https://wa.me/${targetNo}?text=${encodeURIComponent(log.payload)}`;
                return (
                  <div key={log.id} className="p-4 rounded-3xl bg-stone-50/50 border border-stone-150 space-y-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-stone-50">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-800 text-xs">{log.templateName}</span>
                        <span className="text-[9px] text-stone-400 font-mono">({log.timestamp})</span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono bg-white p-3 rounded-xl border border-stone-100 whitespace-pre-wrap leading-relaxed max-h-[80px] overflow-y-auto">
                        {log.payload}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={waClickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer text-center font-sans"
                      >
                        📲 Send Now
                      </a>
                      {log.emailPreviewUrl && (
                        <a
                          href={log.emailPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer text-center font-mono"
                        >
                          📧 Email Sandbox
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    );
  };

  if (activeTab === 'streak') {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-10 pb-32 select-none">
        {/* Dynamic Master Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sage/10 text-accent-sage rounded-full text-[10px] font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> Parent Guidances Room
            </div>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">Everyday Parent-Child Connection</h1>
            <p className="text-stone-500 text-sm">Put parenting insights into live daily action. Day-by-day consistency shapes their tomorrow.</p>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-2xl shrink-0 border border-stone-200">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "rounded-xl px-5 font-bold text-[10px] uppercase tracking-wider transition-all",
                activeTab === 'calendar' 
                  ? "bg-white shadow-xs text-stone-900 font-extrabold" 
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              Daily Calendar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('streak')}
              className={cn(
                "rounded-xl px-5 font-bold text-[10px] uppercase tracking-wider transition-all",
                activeTab === 'streak' 
                  ? "bg-white shadow-xs text-stone-900 font-extrabold" 
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              Streak Reports
            </Button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -15 }}
          className="space-y-8"
        >
          {/* STREAK SUMMARY HERO CARD */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/60 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 text-9xl opacity-[0.03] select-none pointer-events-none">🔥</div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-pulse" /> Active Connection Milestone
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-950 font-bold leading-tight">
                  Your Parenting Streak is <span className="text-amber-600 block sm:inline font-extrabold">{reflections.length > 0 ? 5 + dailyTasks.filter(t => t.completed).length : 3 + dailyTasks.filter(t => t.completed).length} Days Steady</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed">
                  Every time you complete a task, co-regulate, or record a quiet parent-child reflection, you anchor your family's nervous system. Keep going!
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
                  <span className="bg-white/80 border border-stone-200 shadow-2xs font-mono text-[10px] font-bold px-3 py-1.5 rounded-xl text-stone-700 flex items-center gap-1">
                    🎯 Completed Tasks: {dailyTasks.filter(t => t.completed).length} items
                  </span>
                  <span className="bg-white/80 border border-stone-200 shadow-2xs font-mono text-[10px] font-bold px-3 py-1.5 rounded-xl text-stone-700 flex items-center gap-1">
                    💬 Reflection Journals: {reflections.length} sessions
                  </span>
                </div>
              </div>

              {/* GIANT COUNT PILL */}
              <div className="w-40 h-40 rounded-full bg-white shadow-xl border-4 border-amber-100 flex flex-col items-center justify-center relative shrink-0 transition-all hover:scale-[1.03] duration-300">
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-2 rounded-full shadow-md z-10 border border-white animate-bounce">
                  <Zap className="w-4 h-4 fill-current text-white" />
                </div>
                <span className="text-5xl font-black font-serif text-stone-900 tracking-tight leading-none">
                  {reflections.length > 0 ? 5 + dailyTasks.filter(t => t.completed).length : 3 + dailyTasks.filter(t => t.completed).length}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mt-1">Days Streak</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC PROGRESS ACCORDION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">Weekly Course Progression Metrics</h3>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-3 py-1 rounded-full font-bold">Dynamic Analytics</span>
            </div>

            <Card className="border border-stone-200/60 shadow-md rounded-[2.5rem] bg-white overflow-hidden p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((m) => {
                  const moduleTasks = dailyTasks.filter(t => t.moduleId === m.id);
                  const totalCount = moduleTasks.length;
                  const completedCount = moduleTasks.filter(t => t.completed).length;
                  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                  
                  return (
                    <div key={m.id} className="p-5 rounded-3xl bg-stone-50/50 border border-stone-150 flex flex-col justify-between space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase bg-stone-200/75 text-stone-500 px-2.5 py-0.5 rounded-full font-bold">Week {m.week} Pathway</span>
                          <h4 className="text-sm font-serif font-bold text-stone-850 mt-1 leading-tight">{m.title}</h4>
                        </div>
                        {percent === 100 ? (
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono">✓</span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-400 font-mono">{percent}% Done</span>
                        )}
                      </div>

                      {/* Progression bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-amber-400" : "bg-stone-300"
                            )} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-400">
                          <span>{completedCount} of {totalCount} tasks</span>
                          <span>{percent}% Completed</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* DYNAMIC WHATSAPP NOTIFICATION DISPATCH GATEWAY STATUS */}
          <Card className="border border-stone-200/60 shadow-md rounded-[2.5rem] bg-white overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all",
                isWhatsAppActive ? "bg-emerald-50 text-emerald-600 shadow-md shadow-emerald-500/10" : "bg-stone-100 text-stone-400"
              )}>
                📲
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-serif text-stone-900 font-bold">Dynamic WhatsApp Push Gateway</h4>
                  <span className={cn(
                    "text-[8px] font-mono uppercase font-black tracking-widest px-2 py-0.5 rounded-full",
                    isWhatsAppActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                  )}>
                    {isWhatsAppActive ? 'CONNECTED ON' : 'DISABLED OFF'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                  {isWhatsAppActive 
                    ? `Active. Real-time notifications for completed tasks and milestones are bound to send instantly to your phone/email target: ${currentUser?.phone || '+1 555-0199'}.`
                    : "Notifications are paused. Click below to turn them on inside your Account Preferences."
                  }
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsWhatsAppActive(!isWhatsAppActive);
                confetti({
                  particleCount: 50,
                  spread: 40,
                  origin: { y: 0.8 }
                });
              }}
              className={cn(
                "rounded-full font-bold text-[10px] uppercase tracking-wider px-6 h-10 shrink-0 cursor-pointer shadow-sm",
                isWhatsAppActive 
                  ? "bg-stone-900 border border-stone-900 text-white hover:bg-stone-800" 
                  : "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
              )}
            >
              {isWhatsAppActive ? "⏸ Pause Alerts" : "⚡ Turn WhatsApp ON"}
            </Button>
          </Card>
        </motion.div>

        {renderWhatsAppDirectStream()}

        {/* PARENTING EMPOWERMENT TIPS FOR TODAY */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center gap-2 px-1">
            <Info className="w-5 h-5 text-accent-warm shrink-0" />
            <h3 className="text-xl font-serif text-stone-800">Explore Connection Guidelines</h3>
          </div>
          <Card className="border-none shadow-xs bg-accent-warm/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
                <Heart className="w-9 h-9 text-orange-400 fill-current animate-pulse" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-serif text-stone-900 leading-snug">Empathetic Co-Presence Protocol</h4>
                <p className="text-stone-605 leading-relaxed text-xs sm:text-sm">
                  Whenever your child rebels, remember the three validation pillars: Acknowledge the emotional trigger, take 3 core breaths together, and offer structured options instead of loud command warnings. They learn to regulate their nervous systems by mapping your calm breathing.
                </p>
                <Button variant="link" className="text-accent-warm p-0 h-auto font-bold flex gap-2 underline underline-offset-4 text-xs">
                  View Complete Parent Training Blueprint <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-10 pb-32 select-none">
      {/* Dynamic Master Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sage/10 text-accent-sage rounded-full text-[10px] font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" /> Parent Guidances Room
          </div>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">Everyday Parent-Child Connection</h1>
          <p className="text-stone-500 text-sm">Put parenting insights into live daily action. Day-by-day consistency shapes their tomorrow.</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-2xl shrink-0 border border-stone-250">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveTab('calendar')}
            className={cn(
              "rounded-xl px-5 font-bold text-[10px] uppercase tracking-wider transition-all",
              activeTab === 'calendar' 
                ? "bg-white shadow-xs text-stone-950 font-extrabold" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            Daily Calendar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveTab('streak')}
            className={cn(
              "rounded-xl px-5 font-bold text-[10px] uppercase tracking-wider transition-all",
              activeTab === 'streak' 
                ? "bg-white shadow-xs text-stone-950 font-extrabold" 
                : "text-stone-500 hover:text-stone-800"
            )}
          >
            Streak Reports
          </Button>
        </div>
      </header>

      {/* 8-WEEK MASTER TIMELINE CAROUSEL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">Select Week Pathway</h3>
          <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-bold uppercase">8-Week Active Program</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {modules.map((m) => {
            const isSelected = m.id === selectedModuleId;
            const isWeekUnlocked = checkWeekUnlocked(m);
            const weekTasksCount = dailyTasks.filter(t => t.moduleId === m.id).length;
            const completedWeekTasks = dailyTasks.filter(t => t.moduleId === m.id && t.completed).length;
            const isWeekCompleted = weekTasksCount > 0 && completedWeekTasks === weekTasksCount;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedModuleId(m.id);
                  setSelectedDay('all'); // default to all tasks
                }}
                className={cn(
                  "p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between h-24 cursor-pointer",
                  isSelected 
                    ? "bg-stone-900 border-stone-900 text-white shadow-lg shadow-black/10 scale-[1.03] z-10" 
                    : isWeekUnlocked
                    ? "bg-white border-stone-200 hover:border-accent-sage/60 hover:bg-stone-50/50 text-stone-800"
                    : "bg-stone-50 border-stone-100 text-stone-350"
                )}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={cn(
                    "text-[10px] font-mono font-bold uppercase tracking-wider",
                    isSelected ? "text-accent-sage" : "text-stone-400"
                  )}>
                    Week {m.week}
                  </span>
                  {!isWeekUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  ) : isWeekCompleted ? (
                    <span className="w-4 h-4 bg-accent-sage rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 bg-accent-warm rounded-full animate-pulse" />
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-bold leading-none truncate w-full mt-2">
                    {m.title.replace('Understanding ', '').replace('Building ', '')}
                  </p>
                  <p className={cn(
                    "text-[9px] mt-1 font-semibold",
                    isSelected ? "text-stone-300" : "text-stone-400"
                  )}>
                    {isWeekUnlocked ? `${completedWeekTasks}/${weekTasksCount} Done` : "Locked"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* COHORT SNAPSHOT & MANUAL WEEK OVERRIDE DISPLAY */}
      {!checkWeekUnlocked(currentModule) ? (
        <Card className="border-2 border-dashed border-stone-200 shadow-md bg-stone-50/80 rounded-[2.5rem] p-8 lg:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-accent-warm/10 text-accent-warm flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-stone-800">Week {currentModule.week} is Locked</h3>
            <p className="text-sm text-stone-550 max-w-md mx-auto leading-relaxed">
              This module's assignment checklists and learning videos are managed directly by your supervisor.
            </p>
          </div>
          {currentUser?.role === 'admin' ? (
            <Button 
              onClick={() => handleUnlockWeek(currentModule.id)}
              className="rounded-2xl bg-accent-sage hover:bg-accent-sage/95 text-stone-900 border border-transparent font-extrabold h-14 px-8 text-xs uppercase tracking-wider shadow-lg shadow-accent-sage/10 cursor-pointer mx-auto"
            >
              <Unlock className="mr-2 w-4.5 h-4.5" /> Admin Bypass: Unlock Week {currentModule.week} Instantly
            </Button>
          ) : (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-sm mx-auto">
              <p className="text-xs font-bold text-amber-800">🔒 Waiting for Admin Unlock</p>
              <p className="text-[11px] text-amber-700 mt-1">Your parenting supervisor will grant unlock permissions from the backend when this milestone is reached.</p>
            </div>
          )}
        </Card>
      ) : (
        <>
          {/* INTERACTIVE 7-DAY CALENDAR STRIP */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest">Everyday Connect Calendar • Week {currentModule.week}</h3>
              <button 
                onClick={() => setSelectedDay('all')}
                className={cn(
                  "text-[10px] py-1 px-3.5 rounded-full font-bold uppercase transition-all tracking-wider",
                  selectedDay === 'all' 
                    ? "bg-accent-sage text-stone-900 shadow-xs" 
                    : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                )}
              >
                Show All Days Tasks
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                const dayTask = weekTasks.find(t => t.day === dayNum);
                const isDaySelected = selectedDay === dayNum;
                const isDayCompleted = dayTask?.completed;

                // Dates simulated relative to custom 7-day cohort progression
                const daysOfWeekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                const dayName = daysOfWeekNames[dayNum - 1];

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDay(dayNum)}
                    className={cn(
                      "p-3.5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer",
                      isDaySelected 
                        ? "bg-accent-sage border-accent-sage text-stone-900 shadow-md scale-105" 
                        : isDayCompleted
                        ? "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100/60"
                        : "bg-white border-stone-200 text-stone-800 hover:border-stone-300"
                    )}
                  >
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest leading-none",
                      isDaySelected ? "text-stone-700" : "text-stone-400"
                    )}>
                      {dayName}
                    </span>
                    
                    <span className="text-xl font-serif font-bold leading-none">
                      {dayNum}
                    </span>

                    {/* Completion Mini Status */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                      {isDayCompleted ? (
                        <Check className={cn("w-3.5 h-3.5", isDaySelected ? "text-stone-900" : "text-accent-sage")} />
                      ) : (
                        <div className={cn("w-1.5 h-1.5 rounded-full", isDaySelected ? "bg-stone-600" : "bg-stone-300")} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* BRONZE / STREAK STAT CARD */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            <Card className="border-none shadow-xs bg-stone-900 text-white rounded-[2.2rem] p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="bg-white/10 text-white/90 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Weekly Milestone</span>
                <h3 className="text-xl font-serif">Compounding Progress</h3>
              </div>
              <div className="my-4">
                <p className="text-xs text-white/60 leading-relaxed">
                  You have locked in <span className="text-accent-sage font-extrabold">{completedCount} of {weekTasks.length} parenting checklist items</span> this week. Small steps unlock heavy results!
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-white/50">
                  <span>Weekly Target</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-sage transition-all duration-1000" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            </Card>

            <div className="md:col-span-2">
              <Card className="border-none shadow-xs bg-gradient-to-br from-indigo-50/40 via-white to-stone-50 rounded-[2.2rem] p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 text-[10px] uppercase tracking-widest font-mono font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 fill-indigo-200" /> Wistia Live Master Guidance Lecture
                  </div>
                  <h3 className="text-2xl font-serif text-stone-900 leading-tight">Empowering Lecture Included</h3>
                  <p className="text-stone-550 text-xs mt-2 leading-relaxed">
                    Watch the live active lesson video covering "{currentModule.title}" to completely synchronize your checklist objectives with clinically proven co-regulation frameworks.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  {currentModule.lessons && currentModule.lessons[0] ? (
                    <Link 
                      to={`/learn/${currentModule.id}/${currentModule.lessons[0].id}`}
                      className={cn(
                        buttonVariants(),
                        "rounded-2xl bg-stone-900 hover:bg-stone-850 px-6 h-12 text-xs font-bold uppercase tracking-wider text-white cursor-pointer shadow-sm flex items-center justify-center"
                      )}
                    >
                      <BookOpen className="mr-2 w-4 h-4" /> Go Watch Guidance Lecture
                    </Link>
                  ) : (
                    <Button disabled className="rounded-2xl bg-stone-100 text-stone-400 h-10 text-xs font-bold uppercase">No Lesson Released</Button>
                  )}
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Core theory takes 10-15 minutes
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* DYNAMIC EVERYDAY ACTIVE CHORES & ASSIGNMENTS LIST */}
          <section className="space-y-6">
            {/* DYNAMIC REAL-LIFE PRACTICE ANALYTICS PANEL */}
            <div className="bg-stone-50 border border-stone-150 p-5 sm:p-6 rounded-[2.2rem] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-700 text-[10px] uppercase font-bold tracking-widest font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> Dynamic Somatic Reflection Tracker
                  </div>
                  <h4 className="text-base font-serif text-stone-800 mt-1 font-bold">
                    Real-Life Practice Analytics
                  </h4>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border text-[10px] font-mono text-stone-500 font-bold">
                  ⚡ Clinical Ratio: <span className="text-indigo-600">{Math.round((weekTasks.filter(t => t.completed && (t.note || t.reflection)).length / (weekTasks.filter(t => t.completed).length || 1)) * 100)}%</span> Deep Practice
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider block">Somatic Observations</span>
                    <span className="text-base font-bold text-stone-800">
                      {weekTasks.filter(t => t.completed && (t.note || t.reflection)).length} recorded
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider block">Simple Check-offs</span>
                    <span className="text-base font-bold text-stone-800">
                      {weekTasks.filter(t => t.completed && !t.note && !t.reflection).length} tasks
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider block">Active Week Progress</span>
                    <span className="text-base font-bold text-stone-800">
                      {weekTasks.filter(t => t.completed).length} / {weekTasks.length} completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress and Tips */}
              <div className="pt-1">
                {weekTasks.filter(t => t.completed && (t.note || t.reflection)).length === 0 && weekTasks.filter(t => t.completed).length > 0 ? (
                  <div className="text-[11px] text-amber-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Friendly Coach Advice:</strong> You are checking off tasks quickly! To truly master co-regulation, click on <strong>"Add Note"</strong> or <strong>"Save Observation Journal"</strong> below instead. This records physical feedback and awards <strong>+25 Bonus Points</strong>!</span>
                  </div>
                ) : weekTasks.filter(t => t.completed && (t.note || t.reflection)).length > 0 ? (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Amazing clinical reflection!</strong> Your private somatic notes build an extremely detailed observation trail of childhood muscle rest states. You've earned <strong>{weekTasks.filter(t => t.completed && (t.note || t.reflection)).length * 25} bonus points</strong>!</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-stone-800">
                {selectedDay === 'all' ? "Weekly Activities Overview" : `Day ${selectedDay} Connect Assignments`}
              </h3>
              <p className="text-xs text-stone-400">
                Showing {getTasksToRender().length} task{getTasksToRender().length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {getTasksToRender().length === 0 ? (
                <div className="p-12 text-center text-stone-400 font-serif border border-dashed border-stone-200 rounded-3xl">
                  No habits loaded for Day {selectedDay}. Click on other days to display contents.
                </div>
              ) : (
                getTasksToRender().map((task) => (
                  <Card 
                    key={task.id} 
                    className={cn(
                      "transition-all overflow-hidden rounded-[2.2rem] border-none shadow-xs",
                      task.completed ? "bg-stone-50/60" : "bg-white border hover:shadow-md cursor-pointer"
                    )}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <div className="p-6 sm:p-8 flex items-start gap-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0",
                        task.completed ? "bg-accent-sage text-white" : "bg-stone-50 text-stone-400"
                      )}>
                        {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                            task.completed ? "bg-stone-200 text-stone-500" : "bg-accent-sage/15 text-accent-sage"
                          )}>
                            Week {currentModule.week} • Day {task.day}
                          </span>
                          <span className="text-[10px] text-stone-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Est: {task.estimatedTime}
                          </span>
                        </div>

                        <h4 className={cn(
                          "text-xl font-serif leading-snug transition-colors",
                          task.completed ? "text-stone-450 line-through" : "text-stone-850"
                        )}>
                          {task.title}
                        </h4>
                        
                        <p className="text-xs text-stone-500 mt-1 lines-relaxed leading-[1.6]">
                          {task.instructions}
                        </p>

                        {/* Rendering stored notes and private journals feedback */}
                        {(task.note || task.reflection) && (
                          <div className="mt-4 p-4 bg-stone-50/90 rounded-2xl text-xs space-y-2 border border-stone-100/60 max-w-xl">
                            {task.note && (
                              <div className="flex items-start gap-1.5">
                                <span className="font-bold text-stone-600 block shrink-0">Parent Note:</span>
                                <span className="text-stone-750 font-medium">"{task.note}"</span>
                              </div>
                            )}
                            {task.reflection && (
                              <div className="flex items-start gap-1.5">
                                <span className="font-bold text-accent-warm block shrink-0">Observation:</span>
                                <span className="text-stone-750 italic">"{task.reflection}"</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-stone-300 hover:text-stone-500 shrink-0 self-center hidden sm:block">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Expandable Submission Triggers */}
                    {!task.completed && (
                      <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedTaskIdForNote(task.id)}
                          className="rounded-xl border-stone-200 text-xs font-bold text-stone-600 flex gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Note
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedTaskIdForReflection(task.id)}
                          className="rounded-xl border-stone-200 text-xs font-bold text-stone-600 flex gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-accent-warm" /> Save Observation Journal
                        </Button>
                        <Button 
                          onClick={() => handleToggleTask(task.id)}
                          className="ml-auto rounded-xl bg-accent-sage hover:bg-accent-sage/95 text-stone-900 font-bold px-5 text-xs uppercase"
                        >
                          Mark Done
                        </Button>
                      </div>
                    )}

                    {/* Overlaid Form Inputs */}
                    <AnimatePresence>
                      {selectedTaskIdForNote === task.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 space-y-2 border-t border-stone-100 pt-4" 
                          onClick={e => e.stopPropagation()}
                        >
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Write Parenting Note Details</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="e.g. Practised validation phrase during play. Aarav responded very happily." 
                              className="flex-1 h-11 px-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
                              value={customNoteText}
                              onChange={e => setCustomNoteText(e.target.value)}
                            />
                            <Button 
                              onClick={() => handleSaveNote(task.id)}
                              className="rounded-xl bg-stone-900 text-white font-bold text-xs px-5 h-11 shrink-0"
                            >
                              Save Note
                            </Button>
                            <Button 
                              variant="ghost"
                              onClick={() => setSelectedTaskIdForNote(null)}
                              className="rounded-xl text-stone-400 text-xs hover:bg-stone-50 h-11"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {selectedTaskIdForReflection === task.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 space-y-2 border-t border-stone-100 pt-4" 
                          onClick={e => e.stopPropagation()}
                        >
                          <label className="text-[10px] font-bold text-accent-warm uppercase tracking-widest block font-mono">Capture Private Journal Observation</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="e.g. I noticed my co-regulation state immediately tranquilized their frustration." 
                              className="flex-1 h-11 px-4 bg-stone-50 border border-accent-warm/20 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-accent-warm/30 focus:ring-1 focus:ring-accent-warm/25"
                              value={customReflectionText}
                              onChange={e => setCustomReflectionText(e.target.value)}
                            />
                            <Button 
                              onClick={() => handleSaveReflection(task.id)}
                              className="rounded-xl bg-accent-warm hover:bg-accent-warm/95 text-white font-bold text-xs px-5 h-11 shrink-0"
                            >
                              Save Journal
                            </Button>
                            <Button 
                              variant="ghost"
                              onClick={() => setSelectedTaskIdForReflection(null)}
                              className="rounded-xl text-stone-400 text-xs hover:bg-stone-50 h-11"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))
              )}
            </div>
          </section>
        </>
      )}

      {renderWhatsAppDirectStream()}

      {/* PARENTING EMPOWERMENT TIPS FOR TODAY */}
      <section className="space-y-6 pt-6">
         <div className="flex items-center gap-2 px-1">
            <Info className="w-5 h-5 text-accent-warm shrink-0" />
            <h3 className="text-xl font-serif text-stone-800">Explore Connection Guidelines</h3>
         </div>
         <Card className="border-none shadow-xs bg-accent-warm/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
               <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center shrink-0">
                  <Heart className="w-9 h-9 text-orange-400 fill-current animate-pulse" />
               </div>
               <div className="space-y-3">
                  <h4 className="text-2xl font-serif text-stone-900 leading-snug">Empathetic Co-Presence Protocol</h4>
                  <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
                    Whenever your child rebels, remember the three validation pillars: Acknowledge the emotional trigger, take 3 core breaths together, and offer structured options instead of loud command warnings. They learn to regulate their nervous systems by mapping your calm breathing.
                  </p>
                  <Button variant="link" className="text-accent-warm p-0 h-auto font-bold flex gap-2 underline underline-offset-4 text-xs">
                    View Complete Parent Training Blueprint <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </Card>
      </section>
    </div>
  );
}
