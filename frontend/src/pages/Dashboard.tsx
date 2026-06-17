import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Check,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { 
    currentUser, 
    modules, 
    visitStreakDays,
    parents
  } = useApp();

  const isModuleUnlocked = (m: any) => {
    if (!m) return false;
    const activeParent = currentUser?.role === 'parent' 
      ? (parents?.find(p => p.phone === currentUser.phone) || currentUser)
      : currentUser;
    return currentUser?.role === 'admin' || currentUser?.isMentor || (activeParent && (activeParent.unlockedWeeksList || []).includes(m.week));
  };

  // Active module & lesson tracking
  const currentModule = modules.find(m => isModuleUnlocked(m) && m.progress < 100) || modules[0];
  const nextLesson = currentModule?.lessons.find(l => !l.completed) || currentModule?.lessons[0];

  // Simple numbers
  const completedModulesCount = modules.filter(m => m.progress === 100).length;
  const totalLessonsCount = modules.flatMap(m => m.lessons).length;
  const completedLessonsCount = modules.flatMap(m => m.lessons).filter(l => l.completed).length;

  return (
    <motion.div 
      className="p-3 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto pb-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Welcome Banner */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-accent-sage/10 p-6 sm:p-10 lg:p-12 border border-accent-sage/20">
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-sage font-bold uppercase tracking-widest text-[10px]">
              <SparkleIcon className="w-4 h-4 fill-accent-sage" />
              Empathetic Connection Guides
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
              Good morning, {currentUser?.name?.split(' ')[0] || 'Parent'}.<br />
              <span className="text-accent-sage/80 italic">Ready for today’s guidance?</span>
            </h2>
            <p className="text-stone-605 text-sm sm:text-base leading-relaxed">
              We focus purely on bite-sized clinical parenting videos. Every video watched deepens safe co-regulation habits with {currentUser?.studentName || 'your child'}.
            </p>
            <div className="pt-2">
              {currentModule && nextLesson ? (
                <Link
                  to={`/learn/${currentModule.id}/${nextLesson.id}`}
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-accent-sage hover:bg-accent-sage/90 text-stone-900 px-8 py-6 h-auto font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center"
                  )}
                >
                  <Play className="mr-2 w-4 h-4 fill-current shrink-0" />
                  Play Active Video
                </Link>
              ) : (
                <Link
                  to="/learn"
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-accent-sage hover:bg-accent-sage/90 text-stone-900 px-8 py-6 h-auto font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center"
                  )}
                >
                  <BookOpen className="mr-2 w-4 h-4" />
                  Explore Course Map
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end pr-8">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-accent-warm/15 rounded-full blur-2xl animate-pulse" />
              <div className="absolute inset-4 bg-accent-sage/10 rounded-full blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-5 rounded-3xl shadow-md border border-stone-100 flex flex-col items-center justify-center gap-1">
                  <Flame className="w-8 h-8 text-accent-warm fill-current" />
                  <span className="text-3xl font-serif text-stone-900 font-bold">{visitStreakDays || 1}</span>
                  <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Course Stats */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white rounded-2xl p-5 border border-stone-100">
          <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
               <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-stone-850 font-bold">{completedModulesCount} of {modules.length}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Modules Fully Watched</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white rounded-2xl p-5 border border-stone-100">
          <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-stone-850 font-bold">{completedLessonsCount} of {totalLessonsCount}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Total Lessons Watched</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-2xl p-5 border border-stone-100">
          <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-550 shrink-0">
               <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif text-stone-850 font-bold">Self-Paced</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">No High-Pressure Schedules</p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Main content view: Guided video curriculum checklist */}
      <motion.div variants={itemVariants} className="space-y-12">
        
        {/* Continue Learning Callout */}
        {currentModule && nextLesson && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-stone-900 font-bold">Your Active Video Lesson</h3>
              <Link to="/learn" className="text-accent-sage font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline font-serif">
                View Mastery Path <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <Card className="group overflow-hidden border-none shadow-sm bg-white rounded-[2.2rem] hover:shadow-md transition-all border border-stone-100">
              <div className="p-6 sm:p-8 lg:p-10 grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <span className="bg-accent-warm/10 text-accent-warm text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                      Week {currentModule.week} Active
                    </span>
                    <h4 className="text-3xl font-serif text-stone-900 group-hover:text-accent-sage transition-colors leading-tight font-black">
                      {currentModule.title}
                    </h4>
                    <p className="text-stone-500 leading-relaxed text-sm sm:text-base font-normal mt-2">
                      Currently focusing on: <span className="font-semibold text-stone-800">{nextLesson.title}</span> – This clinical training video provides exact Co-Regulation protocols, verbal cues, and tone modulation guidelines to establish peaceful parenting structures.
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-w-md">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <span>Module Video Progress</span>
                      <span>{currentModule.progress}% Completed</span>
                    </div>
                    <Progress value={currentModule.progress} className="h-2 bg-stone-50 [&>div]:bg-accent-sage" />
                  </div>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <Link
                      to={`/learn/${currentModule.id}/${nextLesson.id}`}
                      className={cn(
                        buttonVariants(),
                        "rounded-full bg-stone-900 text-white hover:bg-stone-800 px-8 py-5 h-auto font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 group-hover:bg-accent-sage group-hover:text-stone-900 transition-all cursor-pointer shadow-md"
                      )}
                    >
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      Play Video Lesson
                    </Link>
                    <span className="text-xs text-stone-400 flex items-center gap-1.5 font-mono">
                      <Clock className="w-4 h-4 text-accent-sage" /> {nextLesson.duration || '5 mins'}
                    </span>
                  </div>
                </div>

                {/* Video Preview thumbnail image */}
                <div className="relative aspect-video md:aspect-square bg-stone-950 rounded-3xl overflow-hidden shadow-lg border border-stone-150 flex items-center justify-center group/thumb">
                  <img 
                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600"
                    alt="Active Video" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/thumb:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-xl group-hover/thumb:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-black/60 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider">Video Course Stream</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Video Course Modules Library Checklist */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-serif text-stone-900 font-bold">Your Structured Parenting Video Curriculum</h3>
            <p className="text-stone-500 text-sm">
              We guide you through premium, clinically vetted video courses step-by-step. Toggle or select any lesson to watch:
            </p>
          </div>

          <div className="grid gap-6">
            {modules.map((mod) => {
              const unlocked = isModuleUnlocked(mod);
              return (
                <Card 
                  key={mod.id} 
                  className={cn(
                    "border-none shadow-sm bg-white rounded-[2.2rem] overflow-hidden transition-all border border-stone-105",
                    !unlocked && "opacity-60"
                  )}
                >
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold font-mono",
                          unlocked ? "bg-teal-50 text-teal-700" : "bg-stone-100 text-stone-400"
                        )}>
                          {unlocked ? `Week ${mod.week} - Active` : `Locked (Week ${mod.week})`}
                        </span>
                        {mod.progress === 100 && (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded font-mono">
                            ✓ All Videos Watched
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-serif text-stone-900 font-bold">{mod.title}</h4>
                      <p className="text-xs text-stone-550 leading-relaxed max-w-2xl font-normal">{mod.description}</p>
                    </div>

                    <div className="w-full md:w-auto shrink-0 flex items-center md:justify-end gap-3 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-right hidden sm:block mr-2">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Module Completion</p>
                        <p className="text-sm font-bold text-stone-700">{mod.progress}% Completed</p>
                      </div>
                      <Link
                        to="/learn"
                        className={cn(
                          buttonVariants({ variant: unlocked ? "default" : "outline" }),
                          "rounded-full px-6 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer w-full md:w-auto text-center"
                        )}
                      >
                        {unlocked ? 'Explore Videos' : 'Learn More'}
                      </Link>
                    </div>
                  </div>

                  {/* Sub-lessons video/reflection checklist */}
                  {unlocked && (
                  <div className="border-t border-stone-100 bg-stone-50/30 divide-y divide-stone-100">
                    {mod.lessons.map((les) => (
                      <div key={les.id} className="p-4 sm:px-8 flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            les.completed ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"
                          )}>
                            {les.completed ? (
                              <Check className="w-4 h-4 font-black" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current text-stone-450 ml-0.5" />
                            )}
                          </div>
                          <div>
                            <p className={cn("text-xs sm:text-sm font-medium", les.completed ? "text-stone-400 line-through font-normal" : "text-stone-850")}>
                              {les.title}
                            </p>
                            <p className="text-[10px] text-stone-405 uppercase tracking-widest font-mono">
                              {les.type === 'video' ? '📺 Video Lecture' : '✍️ Written Self-Reflection'} • {les.duration || '5 mins'}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/learn/${mod.id}/${les.id}`}
                          className={cn(
                            buttonVariants({ variant: les.completed ? "ghost" : "link" }),
                            "text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer text-accent-sage hover:text-accent-sage/80"
                          )}
                        >
                          {les.completed ? 'Replay' : 'Watch Video'}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
