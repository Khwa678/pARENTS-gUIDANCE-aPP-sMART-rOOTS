import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Flame, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  Heart, 
  Brain, 
  Zap, 
  BookOpen, 
  CheckSquare,
  Sparkles,
  Award,
  BookMarked,
  CheckCircle2,
  X,
  MessageSquare,
  Video,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import LmsLiveStreams from '@/components/live/LmsLiveStreams';
import EmotionalCheckIn from '@/components/live/EmotionalCheckIn';

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
  const navigate = useNavigate();
  const { 
    currentUser, 
    modules, 
    dailyTasks, 
    reflections, 
    addReflection, 
    toggleDailyTask,
    notificationLogs,
    appointments,
    bookAppointment,
    updateAppointmentStatus,
    mentors,
    sendSessionReminderWhatsApp,
    visitStreakDays
  } = useApp();

  const { showReinforcement } = useToast();

  const handleTaskClick = (task: any) => {
    if (!task.completed) {
      showReinforcement(task.title, false);
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.85 }
        });
      } catch (e) {}
    }
    toggleDailyTask(task.id);
  };

  // Pick appropriate active module
  const currentModule = modules.find(m => m.unlocked && m.progress < 100) || modules[0];
  const nextLesson = currentModule?.lessons.find(l => !l.completed) || currentModule?.lessons[0];

  // Booking details setup
  const [showBookForm, setShowBookForm] = useState(false);
  const [pickedMentorId, setPickedMentorId] = useState('m_vance');
  const [pickedDate, setPickedDate] = useState('2026-05-30');
  const [pickedTime, setPickedTime] = useState('11:00 AM');
  const [phoneInput, setPhoneInput] = useState(() => currentUser?.phone || '6307686532');
  const [emailInput, setEmailInput] = useState(() => currentUser?.email || 'khwahishseth@gmail.com');
  const [sessionGoal, setSessionGoal] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  // Active call simulator setup for responsive "Join Session"
  const [activeRoomCall, setActiveRoomCall] = useState<any | null>(null);
  const [roomCallStatus, setRoomCallStatus] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [parentVideoEnabled, setParentVideoEnabled] = useState(true);
  const [breathingSyncTimer, setBreathingSyncTimer] = useState(4); // co-regulation rhythm tracker

  // Synchronize state outputs on load structure
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.phone) setPhoneInput(currentUser.phone);
      if (currentUser.email) setEmailInput(currentUser.email);
    }
  }, [currentUser]);

  // Dynamic metrics calculation
  const completedModulesCount = modules.filter(m => m.progress === 100).length;
  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  
  // Calculate dynamic brownie points:
  // Watched lessons (+20 each)
  // Reflections (+15 each)
  // Tasks (+10 each)
  const lessonPoints = modules.flatMap(m => m.lessons).filter(l => l.completed).length * 20;
  const reflectionPoints = reflections.length * 15;
  const taskPoints = completedTasksCount * 10;
  const totalBrowniePoints = 120 + lessonPoints + reflectionPoints + taskPoints; // baseline + earned

  const streakDays = visitStreakDays;

  // Reflection writing dialog state
  const [isWritingReflection, setIsWritingReflection] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState('How did you co-regulate your child\'s stress or big feelings today?');
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSuccess, setReflectionSuccess] = useState(false);

  // AI Co-Regulation Coach state
  const [coachingScenario, setCoachingScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [coachingResult, setCoachingResult] = useState('');
  const [isGeneratingCoaching, setIsGeneratingCoaching] = useState(false);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText) return;
    
    addReflection(
      currentModule?.id || 'm2',
      nextLesson?.id || 'l2-1',
      currentModule?.week || 2,
      reflectionPrompt,
      reflectionText
    );
    
    setReflectionText('');
    setReflectionSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#a7c957', '#f2e8cf', '#386641']
    });

    setTimeout(() => {
      setReflectionSuccess(false);
      setIsWritingReflection(false);
    }, 2000);
  };

  return (
    <motion.div 
      className="p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Welcome */}
      <motion.section variants={itemVariants} className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-accent-sage/10 p-5 sm:p-8 lg:p-12 border border-accent-sage/20">
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-sage font-semibold uppercase tracking-widest text-xs">
              <SparkleIcon className="w-4 h-4 fill-accent-sage" />
              Empathetic Connection
            </div>
            <h2 className="text-3xl lg:text-5xl font-serif text-stone-900 leading-tight">
              Good morning, {currentUser?.name?.split(' ')[0] || 'Jane'}.<br />
              <span className="text-accent-sage/80 italic">Ready for today’s guidance?</span>
            </h2>
            <p className="text-stone-600 max-w-md text-base leading-relaxed">
              Every small action compounds into a beautiful transformational habit. 
              {currentUser?.isAdmin ? ' You are in Admin mode, configure settings below.' : ' Your supportive weekly pathway is ready for implementation.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {currentModule && nextLesson ? (
                <Link
                  to={`/learn/${currentModule.id}/${nextLesson.id}`}
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-accent-sage hover:bg-accent-sage/90 text-stone-900 px-8 py-6 h-auto text-[15px] font-bold shadow-lg shadow-accent-sage/20 inline-flex items-center justify-center"
                  )}
                >
                  <Play className="mr-2 w-5 h-5 fill-current" />
                  Resume Active Lesson
                </Link>
              ) : (
                <Link
                  to="/learn"
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-accent-sage hover:bg-accent-sage/90 text-stone-900 px-8 py-6 h-auto text-[15px] font-bold shadow-lg shadow-accent-sage/20 inline-flex items-center justify-center"
                  )}
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Explore Modules
                </Link>
              )}
              <Link
                to="/progress"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full border-stone-200 text-stone-600 hover:bg-stone-50 px-8 py-6 h-auto text-base inline-flex items-center justify-center"
                )}
              >
                View Progress Report
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end pr-8">
             <div className="relative w-64 h-64">
                <motion.div 
                  className="absolute inset-0 bg-accent-warm/20 rounded-[40% 60% 70% 30% / 40% 50% 60% 50%] animate-[morph_8s_ease-in-out_infinite]"
                  style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                />
                <motion.div 
                  className="absolute inset-4 bg-accent-sage/20 rounded-[60% 40% 30% 70% / 50% 60% 40% 50%] animate-[morph_12s_ease-in-out_infinite_reverse]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-2">
                     <Flame className="w-8 h-8 text-accent-warm fill-current animate-pulse" />
                     <span className="text-3xl font-serif text-stone-800">{streakDays}</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Day Streak</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.section>      {/* Stats Widgets */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/learn" className="block focus:outline-none">
          <Card className="border-none shadow-sm bg-white rounded-2xl sm:rounded-3xl hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-6">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                 <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif text-stone-880">{completedModulesCount} of {modules.length}</p>
                <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-wider font-bold">Modules Completed</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/progress" className="block focus:outline-none">
          <Card className="border-none shadow-sm bg-white rounded-2xl sm:rounded-3xl hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-6">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                 <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif text-stone-880">{totalBrowniePoints}</p>
                <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-wider font-bold">Brownie Points</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/assignments" className="block focus:outline-none">
          <Card className="border-none shadow-sm bg-white rounded-2xl sm:rounded-3xl hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-6">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                 <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif text-stone-880">{completedTasksCount}</p>
                <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-wider font-bold">Habits Checked</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/learn" className="block focus:outline-none">
          <Card className="border-none shadow-sm bg-white rounded-2xl sm:rounded-3xl hover:shadow-md transition-shadow cursor-pointer p-4 sm:p-6">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                 <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif text-stone-880">7 Days</p>
                <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-wider font-bold">Automatic Unlock</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.section>

      {/* Main Grid: Learning & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Side: Learn module & Interactive Tasks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Emotional Check-in */}
          <motion.div variants={itemVariants}>
            <EmotionalCheckIn />
          </motion.div>
          
          {/* LMS Live Sessions Section */}
          <motion.div variants={itemVariants}>
            <LmsLiveStreams isStudent={false} />
          </motion.div>
          
          {/* Continue Learning card */}
          {currentModule && nextLesson && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-stone-800">Active Guidance Module</h3>
                <Link to="/learn" className="text-accent-sage font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  All Modules <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <Card className="group overflow-hidden border-none shadow-sm bg-white rounded-[2.2rem] hover:shadow-md transition-all">
                <div className="p-6 lg:p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="bg-accent-warm/10 text-accent-warm text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">Week {currentModule.week} Active</span>
                      <h4 className="text-2xl font-serif text-stone-900 group-hover:text-accent-sage transition-colors leading-snug">{currentModule.title}</h4>
                      <p className="text-sm text-stone-500">Working on: <span className="font-semibold text-stone-700">{nextLesson.title}</span></p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center text-accent-sage border border-stone-100 shrink-0">
                      <BookMarked className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-stone-400">
                      <span>Module Progress</span>
                      <span>{currentModule.progress}%</span>
                    </div>
                    <Progress value={currentModule.progress} className="h-2 bg-stone-50 [&>div]:bg-accent-sage" />
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <Link
                      to={`/learn/${currentModule.id}/${nextLesson.id}`}
                      className={cn(
                        buttonVariants(),
                        "rounded-full bg-stone-900 text-white hover:bg-stone-800 px-6 h-8 font-bold text-sm inline-flex items-center justify-center"
                      )}
                    >
                      Resume Lesson
                    </Link>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Play className="w-3 h-3 text-accent-sage" /> {nextLesson.duration} remaining
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Daily Implementation Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white rounded-[2.2rem] overflow-hidden">
              <CardHeader className="p-6 md:p-8 pb-2">
                <CardTitle className="text-2xl font-serif text-stone-800">Daily Habits & Tasks</CardTitle>
                <CardDescription className="text-stone-500">Complete small parenting gestures daily to lock consistency in.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-stone-50">
                    {dailyTasks.filter(t => t.moduleId === (currentModule?.id || 'm2')).slice(0, 4).map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center gap-4 p-6 hover:bg-stone-50/50 transition-colors cursor-pointer group"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className={cn(
                          "w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0",
                          task.completed ? "bg-accent-sage/20 text-accent-sage" : "bg-stone-50 text-stone-400 group-hover:bg-stone-100"
                        )}>
                          {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-medium text-sm leading-snug", task.completed ? "text-stone-400 line-through" : "text-stone-800")}>{task.title}</p>
                          <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                            <span className="bg-stone-100 text-[10px] px-1.5 py-0.5 rounded text-stone-500 font-bold uppercase tracking-wider">Est: {task.estimatedTime}</span>
                            {task.note && <span className="truncate italic">"{task.note}"</span>}
                          </p>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                          task.completed ? "bg-accent-sage border-accent-sage text-white" : "border-stone-200 text-transparent"
                        )}>
                           <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-6 flex justify-center bg-stone-50/40">
                    <Link
                      to="/assignments"
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "text-accent-sage hover:text-accent-sage/80 font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center"
                      )}
                    >
                      Manage Assignments Dashboard
                    </Link>
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI CO-REGULATION COACH SECTION */}
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/30 rounded-[2.2rem] overflow-hidden border border-indigo-100/30">
              <CardHeader className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-[#4f46e5] text-xs">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-500 fill-indigo-200" />
                  EMPATHETIC PARENTING DESK
                </div>
                <CardTitle className="text-2xl font-serif text-stone-800 mt-2">Dr. Vance's Co-Regulation AI Coach</CardTitle>
                <CardDescription className="text-stone-500">
                  Select a common trigger or type a custom scenario. Get a custom, trauma-informed clinical guidance blueprint to co-regulate with <span className="font-bold text-stone-700">{currentUser?.studentName || 'your child'}</span>.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 md:p-8 pt-0 space-y-5">
                {/* Preset Chips */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Common Behavioral Challenges</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Screen Time End 📱', text: 'My child has a massive breakdown and screams when screen time ends or I take the tablet away.' },
                      { label: 'Homework Avoidance 📝', text: 'My child refuses to do homework, yells that it is too hard, and rebels.' },
                      { label: 'Angry Meltdown 😡', text: 'My child experiences sudden intense anger, slams doors and screams.' },
                      { label: 'Bedtime Delay 🛌', text: 'My child makes constant excuses to delay sleep, refuses to stay in bed, and protests bedtime.' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCoachingScenario(preset.text);
                          setCustomScenario('');
                        }}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer",
                          coachingScenario === preset.text
                            ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                            : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-850"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Or Describe the Behavioral Challenge</label>
                  <div className="flex gap-2">
                    <input
                      id="custom-scenario-input"
                      type="text"
                      className="flex-1 h-12 px-4 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-stone-800 font-medium"
                      placeholder="e.g. He is throwing his meal on the ground because he wanted pasta instead..."
                      value={customScenario || coachingScenario}
                      onChange={(e) => {
                        setCustomScenario(e.target.value);
                        setCoachingScenario(e.target.value);
                      }}
                    />
                    <Button 
                      type="button"
                      onClick={async () => {
                        const finalPrompt = customScenario || coachingScenario;
                        if (!finalPrompt) return;
                        setIsGeneratingCoaching(true);
                        setCoachingResult('');
                        try {
                          const childName = currentUser?.studentName || "Emma Smith";
                          const childGrade = currentUser?.studentId === 'S101' ? "Grade 3" : "Grade 1";
                          const res = await fetch('/api/parent-coach', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ scenario: finalPrompt, childName, childGrade })
                          });
                          const data = await res.json();
                          setCoachingResult(data.text);
                        } catch (err) {
                          console.error(err);
                          setCoachingResult("Oops, unable to access Dr. Vance's advice right now. Please verify server connection.");
                        } finally {
                          setIsGeneratingCoaching(false);
                        }
                      }}
                      disabled={!(customScenario || coachingScenario) || isGeneratingCoaching}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl text-xs font-bold px-5 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      {isGeneratingCoaching ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-white text-indigo-300" />
                          <span>Consult Coach</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Coaching Result View */}
                <AnimatePresence mode="wait">
                  {coachingResult && (
                    <motion.div
                      key="coaching-result-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="border border-stone-150 rounded-2xl overflow-hidden bg-white shadow-md"
                    >
                      <div className="bg-indigo-50/40 px-4 py-3 border-b border-stone-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-700 tracking-wider flex items-center gap-1.5 uppercase font-mono">
                          🧘‍♀️ DR. VANCE'S CLINICAL RESET PLAN
                        </span>
                        <span className="text-[9px] font-bold text-stone-400 font-serif">
                          Client: {currentUser?.studentName || 'Emma Smith'} ({currentUser?.studentId || 'S102'})
                        </span>
                      </div>
                      
                      <div className="p-5 md:p-6 space-y-4">
                        <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line space-y-4 font-normal">
                          {coachingResult}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* NEW LIVE SESSIONS, BOOKING & CHOOSE RESPONSIVE JOIN CONSULTATION SPACE */}
          <motion.div variants={itemVariants} className="mt-8 space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-[2.2rem] overflow-hidden border border-stone-150">
              <CardHeader className="p-6 md:p-8 bg-gradient-to-r from-accent-sage/10 via-white to-accent-warm/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-mono font-black tracking-widest px-3 py-1 rounded-full">
                      📹 ACTIVE VIDEO STREAMS
                    </span>
                    <CardTitle className="text-2xl font-serif text-stone-800 mt-2">
                      Live Co-Regulation & Private Consultation
                    </CardTitle>
                    <CardDescription className="text-xs text-stone-550">
                      Arrange live 1-on-1 calls with licensed mentors to synchronize clinical structures.
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowBookForm(!showBookForm)}
                    className="rounded-full bg-accent-sage hover:bg-accent-sage/90 font-bold text-xs uppercase tracking-wider text-stone-900 py-3.5 h-auto px-5 gap-1 shadow-md"
                  >
                    {showBookForm ? 'Fold Form' : 'Book Session'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-6">
                
                {/* Book Session Form Section */}
                <AnimatePresence>
                  {showBookForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border border-stone-100 rounded-3xl p-5 bg-stone-50/50 space-y-4"
                    >
                      <h4 className="text-sm font-semibold text-stone-850 flex items-center gap-1.5 pb-2 border-b border-stone-100 font-serif">
                        🗓️ Consultation Booking Form
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Select Certified Coach</label>
                          <select 
                            value={pickedMentorId}
                            onChange={(e) => setPickedMentorId(e.target.value)}
                            className="w-full h-11 px-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-700"
                          >
                            {mentors.map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.specialty})</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Date of Consultation</label>
                          <input 
                            type="date"
                            value={pickedDate}
                            onChange={(e) => setPickedDate(e.target.value)}
                            className="w-full h-11 px-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-750"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Time Slot Selection</label>
                          <select 
                            value={pickedTime}
                            onChange={(e) => setPickedTime(e.target.value)}
                            className="w-full h-11 px-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-700"
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="05:00 PM">05:00 PM</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Target WhatsApp Phone No</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-350"><Phone className="w-3.5 h-3.5" /></span>
                            <input 
                              type="text"
                              required
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                              placeholder="e.g. 6307686532"
                              className="w-full h-11 pl-9 pr-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-800 font-mono font-semibold"
                            />
                          </div>
                          <span className="text-[9px] text-stone-400 block px-1">Your registered device for real-time mobile push.</span>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Your Contact Email Address</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-350"><Mail className="w-3.5 h-3.5" /></span>
                            <input 
                              type="email"
                              required
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              placeholder="khwahishseth@gmail.com"
                              className="w-full h-11 pl-9 pr-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-800 font-medium"
                            />
                          </div>
                          <span className="text-[9px] text-stone-404 block px-1">Email copy is simultaneously dispatched directly here.</span>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Session Target / Special Notes</label>
                          <textarea
                            value={sessionGoal}
                            onChange={(e) => setSessionGoal(e.target.value)}
                            placeholder="e.g. Discuss Little John's bedtime anger burst and sleep patterns..."
                            className="w-full min-h-[70px] p-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage text-stone-700 resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowBookForm(false)}
                          className="rounded-xl border-stone-200 font-bold text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (!phoneInput || !emailInput) return;
                            
                            const selectedMentor = mentors.find(m => m.id === pickedMentorId) || mentors[0];
                            bookAppointment({
                              mentorId: selectedMentor.id,
                              mentorName: selectedMentor.name,
                              patientName: currentUser?.name || 'Jane Doe',
                              phone: phoneInput.trim(),
                              date: pickedDate,
                              time: pickedTime,
                              type: 'video',
                              notes: sessionGoal || 'Focused co-regulation consultation strategy session.'
                            }, emailInput.trim());

                            setIsBookingSuccess(true);
                            setSessionGoal('');
                            setShowBookForm(false);
                            
                            confetti({
                              particleCount: 120,
                              spread: 70,
                              colors: ['#8bad8b', '#ebcd9e', '#f472b6']
                            });

                            setTimeout(() => {
                              setIsBookingSuccess(false);
                            }, 10000);
                          }}
                          className="rounded-xl bg-accent-sage hover:bg-accent-sage/90 text-stone-900 font-black text-xs uppercase px-6"
                        >
                          Schedule & Alert Me Now
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Successful Schedule Ribbon Alert */}
                <AnimatePresence>
                  {isBookingSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-stone-900 text-stone-100 border border-stone-800 rounded-2xl p-5 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Double Channel Dispatched</span>
                          </div>
                          <p className="text-sm font-serif text-white font-bold">Consultation Booked Successfully & Dispatched!</p>
                          <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
                            We've dispatched real email transactivity to <span className="text-emerald-400 font-bold font-mono">{emailInput}</span> and simulated live WhatsApp alerting for <span className="text-emerald-400 font-bold font-mono">{phoneInput}</span>. Review logs or check inbox!
                          </p>
                        </div>
                        <Button 
                          onClick={() => setIsBookingSuccess(false)}
                          variant="outline"
                          className="rounded-lg h-9 border-stone-700 text-[11px] font-bold hover:bg-stone-800 shrink-0 text-white"
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scheduled Consultations List viewport */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest font-mono">Your Upcoming Guidance Appointments</h3>
                  
                  {appointments.filter(a => a.phone === phoneInput || a.patientName === (currentUser?.name || 'Jane Doe')).length === 0 ? (
                    <div className="p-8 text-center text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                      <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs font-serif italic">No scheduled live consultations listed for your active profile.</p>
                      <p className="text-[10px] text-stone-400 mt-1">Click the 'Book Session' button above to schedule your first co-regulation video check-in.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {appointments
                        .filter(a => a.phone === phoneInput || a.patientName === (currentUser?.name || 'Jane Doe'))
                        .map((apt) => {
                          const isAptScheduled = apt.status === 'scheduled';
                          return (
                            <div 
                              key={apt.id}
                              className={cn(
                                "p-5 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white",
                                isAptScheduled ? "border-stone-150 hover:bg-stone-50/50" : "border-stone-100 bg-stone-50/20"
                              )}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-2 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold font-mono",
                                    isAptScheduled ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                                  )}>
                                    {isAptScheduled ? '● Pending Consultation' : '✓ Completed Session'}
                                  </span>
                                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono font-bold">
                                    📹 Video Session
                                  </span>
                                </div>
                                <h4 className="text-base font-serif text-stone-900 font-bold leading-tight">
                                  Check-in consultation with {apt.mentorName}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-medium">
                                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-stone-450" /> {apt.date}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-450" /> {apt.time}</span>
                                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-450" /> {apt.phone}</span>
                                </div>
                                <p className="text-xs text-stone-400 italic">
                                  Notes: "{apt.notes || 'Routine check-in sequence'}"
                                </p>
                              </div>

                              <div className="w-full md:w-auto shrink-0 flex flex-wrap items-center gap-2">
                                {isAptScheduled ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        sendSessionReminderWhatsApp(apt);
                                        setReminderSentId(apt.id);
                                        setTimeout(() => setReminderSentId(null), 3500);
                                      }}
                                      className="w-full md:w-auto bg-emerald-50 hover:bg-emerald-100/60 text-emerald-800 border border-emerald-200/50 font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 h-auto rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>{reminderSentId === apt.id ? '✓ Sent Live!' : 'Send WhatsApp Reminder'}</span>
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setActiveRoomCall(apt);
                                        setRoomCallStatus('calling');
                                        setTimeout(() => {
                                          setRoomCallStatus('connected');
                                        }, 2200);
                                      }}
                                      className="w-full md:w-auto bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-6 h-auto rounded-full shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <Video className="w-4 h-4 text-accent-sage animate-pulse" />
                                      <span>Join Video Consult</span>
                                    </Button>
                                  </>
                                ) : (
                                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 px-4 italic font-mono">
                                    <Check className="w-4 h-4 font-black" /> Evaluation Logged
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ACTIVE CALL WORKSPACE OVERLAY SIMULATOR */}
          <AnimatePresence>
            {activeRoomCall && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
              >
                <div className="bg-stone-900 rounded-[2.5rem] w-full max-w-4xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[650px] relative max-h-[800px]">
                  
                  {/* Left block: Live Host feeds & responsive UI */}
                  <div className="flex-1 bg-black flex flex-col justify-between relative overflow-hidden p-6">
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="bg-red-500 text-white text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
                        ● LIVE STREAM
                      </span>
                      <span className="bg-white/15 backdrop-blur text-white text-[9px] font-mono py-1 px-2.5 rounded-full">
                        Room ID: loop-co-regulate-{activeRoomCall.id}
                      </span>
                    </div>

                    {/* Stream main screen content */}
                    <div className="flex-1 flex items-center justify-center relative">
                      {roomCallStatus === 'calling' && (
                        <div className="text-center space-y-4">
                          <div className="relative mx-auto">
                            <div className="w-20 h-20 rounded-full border-4 border-dotted border-accent-sage animate-spin" />
                            <div className="absolute inset-2 bg-stone-850 rounded-full flex items-center justify-center text-white">
                              <Video className="w-8 h-8 animate-pulse text-accent-sage" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-lg font-serif font-black text-stone-100">Connecting Secure Pathway...</h4>
                            <p className="text-xs text-stone-400">Pinging {activeRoomCall.mentorName}'s secure consultant rig.</p>
                          </div>
                        </div>
                      )}

                      {roomCallStatus === 'connected' && (
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                          {/* Mentor simulation feed */}
                          <div className="absolute inset-0 w-full h-full">
                            <img 
                              src={activeRoomCall.mentorId === 'm_chen' 
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" 
                                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
                              } 
                              alt="Coach" 
                              className="w-full h-full object-cover opacity-60"
                              referrerPolicy="no-referrer"
                            />
                            {/* Dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                          </div>

                          {/* Coach instruction label overlay overlay */}
                          <div className="absolute top-20 left-6 right-6 bg-black/60 backdrop-blur border border-white/10 rounded-2xl p-4 text-center z-13">
                            <p className="text-[10px] font-black uppercase text-accent-sage tracking-widest font-mono">Live Clinician Co-Regulation Breathing Cue</p>
                            <p className="text-xs text-white/90 font-medium mt-1">
                              "Nurture Aarav with peaceful non-reactivity. Stand in the Forest Tree Pose or take strawberries breath together right now"
                            </p>
                          </div>

                          {/* Co-Regulation Heart rhythm tracker */}
                          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 mt-12 bg-black/40 p-6 rounded-3xl backdrop-blur-xs border border-white/5">
                            <motion.div 
                              animate={{ scale: [1, 1.15, 1] }} 
                              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                              className="w-24 h-24 rounded-full bg-accent-sage/35 border border-accent-sage flex items-center justify-center text-white font-black uppercase text-[10px] tracking-widest text-center flex-col shadow-inner"
                            >
                              <Heart className="w-7 h-7 text-white fill-current" />
                              <span className="mt-1 font-mono">{breathingSyncTimer}s</span>
                            </motion.div>
                            <span className="text-[10px] text-stone-300 font-bold font-mono tracking-widest text-center">CO-REGULATION HEART BEAT</span>
                          </div>
                        </div>
                      )}

                      {/* Parent small corner self-preview feed */}
                      {parentVideoEnabled && roomCallStatus === 'connected' && (
                        <div className="absolute bottom-4 right-4 w-32 h-24 bg-stone-900 rounded-xl overflow-hidden border border-white/20 shadow-xl z-20">
                          <img 
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(activeRoomCall.patientName || 'Jane')}`} 
                            alt="Self preview"
                            className="w-full h-full object-contain bg-stone-950"
                          />
                          <div className="absolute bottom-1 left-2 text-[8px] uppercase bg-black/60 px-1.5 rounded font-mono font-bold text-stone-300">Self Feed</div>
                        </div>
                      )}
                    </div>

                    {/* Consultation Controls dock */}
                    <div className="flex justify-between items-center bg-stone-900/90 py-3.5 px-4 rounded-2xl border border-white/10 z-20">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setParentVideoEnabled(!parentVideoEnabled)}
                          className={cn(
                            "p-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                            parentVideoEnabled ? "bg-white/10 border-white/10 text-stone-300 hover:bg-white/20" : "bg-red-500/20 border-red-500/20 text-red-400 hover:bg-red-550/30"
                          )}
                        >
                          {parentVideoEnabled ? 'Disable video' : 'Enable video'}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-stone-400">Consult Name: {activeRoomCall.patientName}</span>
                        <Button 
                          onClick={() => {
                            updateAppointmentStatus(activeRoomCall.id, 'com-guided');
                            
                            // Log the secure offline diagnostic co-regulation report log outcome
                            const auditLog = {
                              id: 'log_consult_fin_' + Date.now(),
                              timestamp: new Date().toLocaleString(),
                              templateName: 'Co-Regulation Live Video Room Terminated',
                              recipient: emailInput,
                              payload: `Live Video Room Finalized\n- Mentor: ${activeRoomCall.mentorName}\n- Parent Participant: ${activeRoomCall.patientName}\n- Tracked Number: ${activeRoomCall.phone}\n- Outcome: Co-regulating sequence finalized successfully. Experience +50 XP, check inbox.`,
                              status: 'sent' as const
                            };
                            
                            // Update local records
                            localStorage.setItem('parent_guidance_appointments', JSON.stringify(
                              appointments.map(a => a.id === activeRoomCall.id ? { ...a, status: 'com-guided' } : a)
                            ));

                            // Complete simulation
                            setRoomCallStatus('completed');
                            setTimeout(() => {
                              setActiveRoomCall(null);
                              setRoomCallStatus('idle');
                              confetti({
                                particleCount: 80,
                                spread: 50,
                                colors: ['#ebcd9e', '#f472b6']
                              });
                            }, 1200);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-stone-900 font-extrabold text-[10px] uppercase tracking-wider px-5 py-2 h-auto rounded-full"
                        >
                          Terminate Session
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right block: guidance slides & notes logs */}
                  <div className="w-full md:w-80 bg-stone-950 border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-stone-300 uppercase font-mono tracking-widest text-[9px] font-black">Live Consulting Guide</h4>
                        <h3 className="text-lg font-serif text-white font-bold leading-tight mt-1">{activeRoomCall.mentorName}</h3>
                        <p className="text-xs text-stone-405">{activeRoomCall.mentorId === 'm_vance' ? 'Child Psychologist' : 'Mindfulness Educator'}</p>
                      </div>

                      <div className="bg-stone-900 border border-white/5 rounded-2xl p-4 space-y-3">
                        <span className="text-[9px] uppercase font-mono font-black text-emerald-400">CLINICAL STABILITY AUDIT</span>
                        <p className="text-xs text-stone-300 leading-relaxed font-normal">
                          Focus on the child's raw physical responses. If there is fatigue, co-regulate by stabilizing your presence first.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-mono font-black text-stone-400 block">Session Objectives & Target</span>
                        <div className="text-xs text-stone-300 bg-stone-900/40 p-3 rounded-xl border border-white/5">
                          "{activeRoomCall.notes || 'Investigating co-regulation pathways.'}"
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] text-accent-sage uppercase font-mono font-black">
                        <ShieldCheck className="w-4 h-4" /> HIPAA Compliance Guard
                      </div>
                      <p className="text-[10px] text-stone-500 leading-snug">
                        Peer-to-peer room transmissions are fully encrypted and co-regulation checklists are stored locally.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Quick Action Widgets */}
        <div className="space-y-8">
           
           {/* Reflection Journal Section */}
           <motion.div variants={itemVariants}>
             <Card className="border-none shadow-sm bg-accent-warm/5 rounded-[2.2rem] border-l-4 border-l-accent-warm relative overflow-hidden">
               <CardHeader className="p-4 sm:p-6 lg:p-8">
                 <CardTitle className="text-xl font-serif text-accent-warm flex items-center gap-2">
                   <MessageSquare className="w-5 h-5 fill-current" /> Reflection Journal
                 </CardTitle>
                 <CardDescription className="text-stone-500">Your secure area to notice parenting breakthroughs.</CardDescription>
               </CardHeader>
               <CardContent className="p-4 sm:p-6 lg:p-8 pt-0 space-y-4">
                 
                 <AnimatePresence mode="wait">
                   {!isWritingReflection ? (
                     <motion.div 
                       key="widget-view"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="space-y-4"
                     >
                       <p className="text-sm text-stone-600 bg-white/70 p-4 rounded-2xl italic leading-relaxed">
                         "{reflectionPrompt}"
                       </p>
                       <Button 
                         onClick={() => setIsWritingReflection(true)}
                         className="w-full h-11 rounded-xl bg-accent-warm hover:bg-accent-warm/95 text-white text-xs font-bold uppercase tracking-widest shadow-sm"
                       >
                         Write Reflection
                       </Button>
                     </motion.div>
                   ) : (
                     <motion.form 
                       key="entry-form"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       onSubmit={handleSaveReflection}
                       className="space-y-3"
                     >
                       <div className="flex justify-between items-center px-1">
                         <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Write Draft</span>
                         <button 
                           type="button" 
                           onClick={() => setIsWritingReflection(false)} 
                           className="text-stone-400 hover:text-stone-700 p-1"
                         >
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                       <textarea
                         className="w-full min-h-[100px] p-3 text-xs bg-white border border-stone-100 rounded-xl focus:outline-none focus:border-accent-warm text-stone-800 resize-none leading-relaxed"
                         placeholder="Type honestly here..."
                         value={reflectionText}
                         onChange={e => setReflectionText(e.target.value)}
                       />
                       {reflectionSuccess ? (
                         <div className="p-3 bg-accent-sage/15 text-accent-sage rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-accent-sage/25">
                           <CheckCircle2 className="w-4.5 h-4.5 animate-bounce" /> Reflection Saved! +15 Points
                         </div>
                       ) : (
                         <Button 
                           type="submit" 
                           disabled={!reflectionText}
                           className="w-full h-11 rounded-xl bg-accent-warm hover:bg-accent-warm/90 text-white text-xs font-bold uppercase tracking-widest"
                         >
                           Save Draft to Journal
                         </Button>
                       )}
                     </motion.form>
                   )}
                 </AnimatePresence>
               </CardContent>
             </Card>
           </motion.div>

           {/* Parenting Streak graph */}
           <motion.div variants={itemVariants}>
             <Card className="border-none shadow-sm bg-white rounded-[2.2rem] overflow-hidden">
               <CardHeader className="p-4 sm:p-6">
                 <CardTitle className="text-lg font-serif text-stone-800">Activity & Habits</CardTitle>
               </CardHeader>
               <CardContent className="p-4 sm:p-6 pt-0">
                 <div className="flex justify-between items-end gap-2 mb-4 h-[60px]">
                    {[2, 3, 5, 4, 3, 2, 4].map((v, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className={cn(
                            "w-full rounded-t-lg transition-all duration-1000",
                            i === 6 ? "bg-accent-sage" : "bg-stone-100"
                          )} 
                          style={{ height: `${v * 10}px`, opacity: 0.3 + (v/5) }}
                        />
                        <span className="text-[10px] font-bold text-stone-400">{'MTWTFSS'[i]}</span>
                      </div>
                    ))}
                 </div>
                 <p className="text-xs text-stone-600 text-center leading-normal">
                    You've been active for <span className="font-bold text-stone-900">{streakDays} consecutive days</span>. Excellent work!
                 </p>
               </CardContent>
             </Card>
           </motion.div>

           {/* Core Document Library Resource download */}
           <motion.div variants={itemVariants}>
              <div className="rounded-[2.2rem] bg-stone-900 p-5 sm:p-8 text-white space-y-4 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-sage/20 rounded-full blur-3xl group-hover:bg-accent-sage/30 transition-all" />
                
                <h4 className="text-xl font-serif relative z-10 text-stone-50">Quick Tools Library</h4>
                <p className="text-sm text-stone-300 relative z-10 leading-relaxed">
                  Access behavior co-regulation planners, checklists and emotional connection charts.
                </p>
                <Link 
                  to="/progress"
                  className="flex items-center justify-center h-12 w-full rounded-full bg-white text-stone-900 hover:bg-stone-100 relative z-10 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Browse Achievements & Badges
                </Link>
              </div>
           </motion.div>
        </div>
      </div>
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
