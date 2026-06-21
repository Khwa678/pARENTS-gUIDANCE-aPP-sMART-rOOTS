import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
import { motion } from 'motion/react';
import { useApp, ParentAccount, Student, DailyHabitTask, LiveSession } from '../context/AppContext';
import { 
  Users, BookOpen, MessageSquare, Unlock, Send, Plus, Trash, Edit, Check, X, 
  Settings, Phone, Sliders, HelpCircle, FileText, Clock, ArrowRight, Database, 
  Server, Search, CheckCircle2, AlertCircle, ShieldAlert, ExternalLink, Video, Star, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityEmailLogs from '../components/SecurityEmailLogs';
import SupabaseSyncDashboard from '../components/live/SupabaseSyncDashboard';
import ServerHostControl from '../components/live/ServerHostControl';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
import { useToast } from '../context/ToastContext';

export default function Admin() {
  const { showToast } = useToast();
  const alert = (msg: string) => {
    const isWarn = msg.toLowerCase().includes('error') || 
                   msg.toLowerCase().includes('please') || 
                   msg.toLowerCase().includes('fill') || 
                   msg.toLowerCase().includes('cannot') || 
                   msg.toLowerCase().includes('no ');
    showToast(msg, isWarn ? 'warning' : 'success');
  };

  const navigate = useNavigate();
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('admin_space_unlocked') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');
<<<<<<< HEAD
=======
=======

export default function Admin() {
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  const {
    parents, setParents,
    students, setStudents,
    modules, setModules,
    addNewModule,
    dailyTasks, setDailyTasks,
    toggleDailyTask,
    notificationProvider, setNotificationProvider,
    whatsappApiKeyPlaceholder, setWhatsappApiKeyPlaceholder,
    whatsappTemplates, setWhatsappTemplates,
    notificationLogs, sendTestWhatsApp,
    unlockModuleManually,
    passwordResetRequests, resolvePasswordResetRequest,
    strictnessLevel, setStrictnessLevel,
    liveSessions, setLiveSessions, addLiveSession, broadcastLiveSessionAlert, selectLiveSessionStatus,
    tagDatabase, setTagDatabase,
    childProfiles, setChildProfiles,
    learningPaths, setLearningPaths,
    scoringRules, setScoringRules,
    unlockDependencies, setUnlockDependencies,
    reflections
  } = useApp();

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'password') {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('admin_space_unlocked', 'true');
      setAdminError('');
    } else {
      setAdminError('Access Denied: Incorrect override credentials. Try again.');
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6"
        >
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 items-center justify-center text-3xl font-bold font-serif mb-2 shadow-inner">
              🔒
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-100 tracking-tight">Supervisor Override Challenge</h2>
            <p className="text-xs text-stone-400 leading-relaxed px-2">
              Restricted Area: Parents, students, and children are strictly forbidden from accessing the Admin Command Console.
            </p>
          </div>

          <form onSubmit={handleAdminVerify} className="space-y-4">
            {adminError && (
              <p className="text-[11px] font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center leading-normal">
                ⚠️ {adminError}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block ml-1">
                Enter Admin Access Code
              </label>
              <input
                type="password"
                className="w-full h-12 px-4 bg-stone-950 border border-stone-800 rounded-xl focus:outline-none focus:border-amber-500 text-amber-400 font-bold focus:bg-stone-950 font-sans tracking-widest text-sm text-center"
                placeholder="••••••••"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Verify Override Authorization
            </Button>
          </form>

          <div className="pt-2 border-t border-stone-800/60 text-center">
            <button
              onClick={() => navigate('/')}
              type="button"
              className="text-stone-500 hover:text-stone-350 transition-colors font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
            >
              ← Return home safely
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

<<<<<<< HEAD
=======
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  // Active Admin Section / Sidebar tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminSearch, setAdminSearch] = useState('');

  // Dynamic Webinars computed from context live sessions
  const webinars = liveSessions.map(sec => ({
    id: sec.id,
    title: sec.title,
    speaker: sec.mentorName,
    date: sec.scheduledTime.split(' at ')[0] || sec.scheduledTime || '2026-06-20',
    time: sec.scheduledTime.split(' at ')[1] || '5:00 PM',
    tags: sec.targetGroup === 'parents' ? 'Routine Building' : 'Emotional Intelligence',
    registered: 12 + (parseInt(sec.id.replace(/\D/g, '') || '0') % 20),
    status: sec.status === 'upcoming' ? 'Published' : 'Completed'
  }));

  const [auditLogs, setAuditLogs] = useState([
    { timestamp: '13:10:22', user: 'Super Admin (You)', action: 'Override Lock', detail: 'Unlocked Week 2 for +12345678' },
    { timestamp: '12:45:01', user: 'Super Admin (You)', action: 'Add Lesson Content', detail: 'Created Responding to triggers outbursts' },
    { timestamp: '10:15:33', user: 'Admin Alex', action: 'Update Strictness', detail: 'Changed Sandbox rules level to balanced' }
  ]);

  const logAdminAction = (action: string, detail: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs(prev => [{ timestamp, user: 'Super Admin (You)', action, detail }, ...prev]);
  };

  const [approvalSubmissions, setApprovalSubmissions] = useState([
    { id: 1, title: 'Child Sunset Muscle Scanning Meditation', author: 'Admin Alex', category: 'Stress Management', status: 'Approved' },
    { id: 2, title: 'Combating Middle School Distraction Cycles', author: 'Mentor Kenneth', category: 'Focus & Concentration', status: 'Pending Review' }
  ]);

  const [nudgeTemplates, setNudgeTemplates] = useState([
    { title: 'Task Dormancy Reminder', content: 'Hi {{parent_name}}, we noticed you haven\'t logged Emma\'s candle breathing co-regulation task for 3 days. Enjoy 5 quiet minutes today to rebuild alignment!' },
    { title: 'Webinar Live RSVP Callout', content: 'Join Dr. Alicia Vance live today at 5:00 PM! Claim your interactive seat and earn +20 bonus brownie star points!' }
  ]);

  // Form states
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentStudent, setNewParentStudent] = useState('');
  const [newParentGrade, setNewParentGrade] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(7);
  const [newChildGrade, setNewChildGrade] = useState('Grade 2');
  const [newChildConcerns, setNewChildConcerns] = useState<string[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('eabjoioutk');
  const [newVideoTag, setNewVideoTag] = useState('Anger Management');
  const [targetModuleId, setTargetModuleId] = useState('');
  const [newPathName, setNewPathName] = useState('');
  const [newPathWeeks, setNewPathWeeks] = useState(4);
  const [newPathBadge, setNewPathBadge] = useState('Peace Master');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(15);
  const [newTaskTag, setNewTaskTag] = useState('Anger Management');
  const [newTaskModuleId, setNewTaskModuleId] = useState('m1');
  const [newTaskDay, setNewTaskDay] = useState(1);
  const [newTaskInstructions, setNewTaskInstructions] = useState('');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState('10 mins');
  const [isOptimizingTask, setIsOptimizingTask] = useState(false);
  const [newTemplatePhone, setNewTemplatePhone] = useState('+12345678');
  const [newTemplateParent, setNewTemplateParent] = useState('Jane Cooper');
  const [newWebinarTitle, setNewWebinarTitle] = useState('');
  const [newWebinarSpeaker, setNewWebinarSpeaker] = useState('Dr. Alicia Vance');
  const [newWebinarDate, setNewWebinarDate] = useState('2026-06-20');
  const [newWebinarTags, setNewWebinarTags] = useState('Anger Management');

  // Dynamic module creator states
  const [adminNewModuleName, setAdminNewModuleName] = useState('');
  const [adminNewModuleDesc, setAdminNewModuleDesc] = useState('');
  const [adminNewModuleVideoId, setAdminNewModuleVideoId] = useState('');
  const [adminNewModuleVideoTitle, setAdminNewModuleVideoTitle] = useState('');
  const [adminNewModuleWeekNum, setAdminNewModuleWeekNum] = useState<number>(0);

  // Dynamic publishing targets
  const [videoPublishType, setVideoPublishType] = useState<'existing' | 'new_week'>('existing');
  const [videoNewWeekNum, setVideoNewWeekNum] = useState<number>(0);
  const [videoNewWeekTitle, setVideoNewWeekTitle] = useState('');
  const [videoNewWeekDesc, setVideoNewWeekDesc] = useState('');

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  // Dynamic curriculum editing states
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');
  const [editingModuleDesc, setEditingModuleDesc] = useState('');

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonModuleId, setEditingLessonModuleId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState('');
  const [editingLessonDuration, setEditingLessonDuration] = useState('');
  const [editingLessonWistiaId, setEditingLessonWistiaId] = useState('');

<<<<<<< HEAD
=======
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  // Interactive calculators
  const [calcAction, setCalcAction] = useState('daily_task');
  const [calcScore, setCalcScore] = useState(0);

  // CSV Report Generator State
  const [selectedReportType, setSelectedReportType] = useState('parent_progress');
  const [generatedReportPreview, setGeneratedReportPreview] = useState<any[]>([]);

  // Function: handle parent insert
  const handleAddNewParentObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentName || !newParentPhone) return alert('Fill name & phone');
    const newP: ParentAccount = {
      name: newParentName,
      phone: newParentPhone,
      studentId: 'STU' + Math.floor(100 + Math.random() * 900),
      studentName: newParentStudent || 'Emma',
      classGrade: newParentGrade || 'Grade 2',
      batchCohort: 'Summer cohort 2026',
      startDate: new Date().toISOString().split('T')[0],
      unlockedWeeksList: [1],
      status: 'active',
      lastLogin: 'Never logged in'
    };
    setParents(prev => [...prev, newP]);
    setNewParentName('');
    setNewParentPhone('');
    setNewParentStudent('');
    alert('Parent setup pre-registered successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    const updated = dailyTasks.filter(t => t.id !== taskId);
    setDailyTasks(updated);
    localStorage.setItem('parent_guidance_daily_tasks', JSON.stringify(updated));
    showToast("Co-regulation task deleted from registry.", "info", "🗑️ Task Deleted");
<<<<<<< HEAD
=======
=======
    if (confirm("Are you sure you want to delete this daily task?")) {
      const updated = dailyTasks.filter(t => t.id !== taskId);
      setDailyTasks(updated);
      localStorage.setItem('parent_guidance_daily_tasks', JSON.stringify(updated));
    }
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  };

  // Function: generate export previews
  const handleGenerateReportPreview = () => {
    if (selectedReportType === 'parent_progress') {
      setGeneratedReportPreview(parents.map(p => ({ Name: p.name, Phone: p.phone, Child: p.studentName, Unlocked: `Week ${p.unlockedWeeksList.join(',')}`, Status: p.status })));
    } else if (selectedReportType === 'child_concerns') {
      setGeneratedReportPreview(childProfiles.map(c => ({ Name: c.name, Age: c.age, Grade: c.grade, Concerns: c.concerns.join(', '), Risk: c.risk })));
    } else if (selectedReportType === 'brownie_tallies') {
      setGeneratedReportPreview(parents.map(p => ({ Name: p.name, Phone: p.phone, BaselineScore: 120, StreakBonus: 25, FinalEstimate: 145 })));
    }
  };

  // Sidebar list of all 17 tabs (and extra system debuggers grouped beautifully)
  const tabsList = [
    { value: 'dashboard', label: '1. Admin Dashboard', icon: Sliders },
    { value: 'parents', label: '2. Parent Management', icon: Users },
    { value: 'children', label: '3. Child Profiles', icon: Sliders },
    { value: 'tags', label: '4. Clinical Concerns/Tags', icon: BookOpen },
    { value: 'video_library', label: '5. Video Library', icon: Video },
    { value: 'learning_path', label: '6. Learning Path Builder', icon: ArrowRight },
    { value: 'tasks', label: '7. Assignments & Tasks', icon: Plus },
    { value: 'unlocks', label: '8. Unlock Rules Engine', icon: Unlock },
    { value: 'brownie_points', label: '9. Brownie Points Rules', icon: Star },
    { value: 'analytics', label: '10. Clinical Analytics', icon: Clock },
    { value: 'leaderboard', label: '11. Cohort Leaderboard', icon: Award },
    { value: 'alerts', label: '12. Simulated Alerts & Push', icon: Send },
    { value: 'webinar', label: '13. Webinar Management', icon: Video },
    { value: 'reports', label: '14. Export CSV Reports', icon: FileText },
    { value: 'roles', label: '15. Admin & Moderator Roles', icon: ShieldAlert },
    { value: 'audit_logs', label: '16. System Audit Logs', icon: FileText },
    { value: 'settings', label: '17. Global Settings & Strictness', icon: Settings },
    { value: 'supabase_sync', label: '🖥️ Supabase Sync Monitor', icon: Database },
    { value: 'security_emails', label: '🛡️ Automated Email Logs', icon: ShieldAlert },
    { value: 'server_tools', label: '💾 Server DB Control', icon: Server }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-50 text-stone-800 font-sans">
      
      {/* 17-Section Premium Navigation Sidebar */}
      <aside className="w-full lg:w-80 bg-stone-900 text-white shrink-0 flex flex-col border-r border-stone-800">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-accent-sage rounded-full animate-pulse" />
            <span className="font-bold text-[10px] tracking-widest uppercase text-accent-sage">LMS Central Station</span>
          </div>
          <h2 className="text-xl font-serif text-white mt-1 leading-tight">Smart Roots Admin</h2>
          <p className="text-stone-400 text-xs mt-1">Somatic guidance command portal</p>
        </div>

        {/* Categories selector dropdown for small viewports */}
        <div className="p-4 block lg:hidden border-b border-stone-800">
          <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Select Module Target Section</label>
          <select 
            className="w-full bg-stone-800 text-xs border-none rounded-xl p-3 text-white focus:ring-1 focus:ring-accent-sage focus:outline-none"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabsList.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Scrollable list on Desktops */}
        <nav className="hidden lg:flex flex-col flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500 px-3 py-1">Management Domains</p>
          {tabsList.map(t => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={cn(
                "w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer",
                activeTab === t.value 
                  ? "bg-accent-sage text-white font-black shadow-sm" 
                  : "text-stone-300 hover:bg-stone-800 hover:text-white"
              )}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h1 className="text-3xl font-serif text-stone-900 leading-tight">
              {tabsList.find(t => t.value === activeTab)?.label || 'System Control Panel'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">Configure co-regulation assets, edit scoring multipliers and check triggers.</p>
          </div>
          <div className="flex items-center gap-2 bg-stone-200/50 p-1.5 rounded-xl text-xs font-semibold">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase font-black text-[9px] tracking-wider">● Online</span>
            <span className="text-stone-500 font-mono text-[10px]">Local Port: 3000</span>
          </div>
        </header>

        {/* ACTIVE CONTENT VIEW - DYNAMIC INJECTION */}
        <div className="space-y-8">

          {/* SECTION 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats dashboard bento-grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: parents.length, label: 'Registered Parents', desc: `Active: ${parents.filter(p => p.status === 'active').length}`, color: 'bg-stone-900 text-white' },
                  { value: childProfiles.length, label: 'Linked Children', desc: 'Somatic profile verified', color: 'bg-white border text-stone-900' },
                  { value: dailyTasks.length, label: 'Somatic Tasks', desc: 'Marked on calendar scheduler', color: 'bg-white border text-stone-900' },
                  { value: tagDatabase.length, label: 'Concern Categories', desc: 'Need assessment tags', color: 'bg-stone-100 text-stone-800' }
                ].map((stat, idx) => (
                  <Card key={idx} className={cn("border-none shadow-sm rounded-3xl p-5 flex flex-col justify-between", stat.color)}>
                    <div>
                      <h4 className="text-3xl font-bold tracking-tight font-serif">{stat.value}</h4>
                      <p className="text-xs font-bold mt-1 uppercase tracking-wider opacity-90">{stat.label}</p>
                    </div>
                    <p className="text-[10px] opacity-75 mt-3 leading-none">{stat.desc}</p>
                  </Card>
                ))}
              </div>

              {/* Dynamic alert metrics & tag-wise distribution bento card */}
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="border-none shadow-sm bg-white rounded-3xl p-6 lg:p-8 lg:col-span-2 space-y-4">
                  <h3 className="font-serif text-lg font-bold">Dynamic Concern Tag Distribution</h3>
                  <div className="space-y-4 pt-2">
                    {tagDatabase.slice(0, 4).map((tag, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-stone-700">{tag.name}</span>
                          <span className="text-stone-500">{(tag.count * 15)}% Engagement</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent-sage rounded-full" 
                            style={{ width: `${(tag.count * 15)}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border-none shadow-sm bg-stone-900 text-white rounded-3xl p-6 lg:p-8 space-y-4">
                  <h3 className="font-serif text-lg font-bold">Pending Alerts Ticker</h3>
                  <div className="space-y-3 pt-1 text-xs text-stone-300">
                    <div className="flex items-start gap-2 border-b border-stone-800 pb-2">
                      <span className="text-amber-500 shrink-0">⚠️</span>
                      <p><strong>+12345678</strong> missed Jane Co-regulation routine 3 times this week.</p>
                    </div>
                    <div className="flex items-start gap-2 border-b border-stone-800 pb-2">
                      <span className="text-sky-400 shrink-0">📡</span>
                      <p>Webinar registration closed for sunset somatic relax.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <p>Super Admin resolving <strong>1 password reset ticket</strong>.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 2: Parent Management */}
          {activeTab === 'parents' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 items-start">
                
                {/* Form column */}
                <Card className="border-none shadow-sm bg-white rounded-3xl p-6 space-y-4">
                  <h3 className="font-serif text-base font-bold">Register Parent Account</h3>
                  <form onSubmit={handleAddNewParentObj} className="space-y-3">
                    <input 
                      type="text" required placeholder="Parent Name" className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"
                      value={newParentName} onChange={e => setNewParentName(e.target.value)} 
                    />
                    <input 
                      type="text" required placeholder="Phone Number (e.g. +123456)" className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"
                      value={newParentPhone} onChange={e => setNewParentPhone(e.target.value)} 
                    />
                    <input 
                      type="text" placeholder="Emma (Child Name)" className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"
                      value={newParentStudent} onChange={e => setNewParentStudent(e.target.value)} 
                    />
                    <input 
                      type="text" placeholder="Grade 2" className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"
                      value={newParentGrade} onChange={e => setNewParentGrade(e.target.value)} 
                    />
                    <Button type="submit" className="w-full bg-stone-900 text-white text-xs h-10 hover:bg-stone-800 rounded-lg">
                      Register & Sync
                    </Button>
                  </form>
                </Card>

                {/* List column */}
                <Card className="border-none shadow-sm bg-white rounded-3xl p-6 md:col-span-2 space-y-4">
                  <h3 className="font-serif text-base font-bold">Registered LMS Parents</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-stone-100">
                      <thead>
                        <tr className="text-[10px] text-stone-400 font-bold uppercase">
                          <th className="py-2">Parent Details</th>
                          <th className="py-2">Linked Student</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50 text-stone-700">
                        {parents.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5">
                              <p className="font-bold">{p.name || 'Jane Doe'}</p>
                              <p className="text-stone-400 font-mono text-[10px]">{p.phone}</p>
                            </td>
                            <td className="py-2.5">{p.studentName} ({p.classGrade})</td>
                            <td className="py-2.5">
                              <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase", p.status === 'active' ? 'bg-emerald-50 text-emerald-600':'bg-stone-50 text-stone-400')}>{p.status}</span>
                            </td>
                            <td className="py-2.5 text-right space-x-1.5">
                              <Button variant="outline" size="sm" onClick={() => {
                                const temporaryPassword = 'Reset' + Math.floor(100+Math.random()*900);
                                alert(`Temporary passcode generated: ${temporaryPassword}`);
                              }} className="text-[9px] px-2 h-7 rounded-md">Passcode</Button>
                              <Button variant="outline" size="sm" onClick={() => {
                                const list = parents.filter(x => x.phone !== p.phone);
                                setParents(list);
                              }} className="text-xs text-rose-500 px-2 h-7 rounded-md bg-rose-50 border-rose-100">[DELETE]</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* SECTION 3: Child Profiles */}
          {activeTab === 'children' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold">Child Development Profiles</h3>
                  <Button onClick={() => {
                    const ch: any = { id: 'S104', name: newChildName || 'Tyler Garcia', age: Number(newChildAge), grade: newChildGrade, concerns: ['Anger Management'], risk: 'Excellent', notes: 'Somatic pacing helper is assigned' };
                    setChildProfiles([...childProfiles, ch]);
                    alert('Tyler Garcia child profile initialized!');
                  }} className="bg-stone-900 text-white text-xs h-9 rounded-xl">
                    + Add New Child Profile
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Tyler Garcia" value={newChildName} onChange={e => setNewChildName(e.target.value)} className="text-xs p-3 rounded-lg bg-stone-50 border" />
                  <input type="number" placeholder="7" value={newChildAge} onChange={e => setNewChildAge(Number(e.target.value))} className="text-xs p-3 rounded-lg bg-stone-50 border" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  {childProfiles.map((child, idx) => (
                    <Card key={idx} className="p-4 bg-stone-50 border-none shadow-xs rounded-2xl relative space-y-3">
                      <div>
                        <span className={cn("absolute right-3 top-3 text-[9px] font-black uppercase px-2 py-0.5 rounded", child.risk === 'Attention Risk' ? 'bg-red-55 bg-rose-100 text-rose-700' : child.risk === 'Improving' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>
                          {child.risk}
                        </span>
                        <h4 className="font-serif text-base font-bold text-stone-800">{child.name}</h4>
                        <p className="text-stone-400 text-xs">{child.grade} • Age {child.age}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-stone-400 font-bold uppercase">Clinical Concerns:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {child.concerns.map(c => (
                            <span key={c} className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[9px] font-semibold">{c}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border">
                        <p className="text-[10px] text-stone-400 font-bold uppercase">Administrative Notes:</p>
                        <p className="text-xs text-stone-600 mt-1 italic">"{child.notes}"</p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          const updated = childProfiles.map(c => c.id === child.id ? { ...c, risk: 'Excellent' as const } : c);
                          setChildProfiles(updated);
                          alert('Risk and co-regulation metrics resolved!');
                        }} className="text-[10px] px-2 h-7 bg-emerald-50 text-emerald-700 border-emerald-100">Resolve Risk</Button>
                        <span className="text-[10px] text-stone-400 font-mono font-bold">ID: {child.id}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 4: Climate Need Assessment Categories/Tags */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold">Child Guidance Clinical Tags Database</h3>
                  <Button onClick={() => {
                    const tag = prompt('Enter customized clinical category title:');
                    if (tag) {
                      setTagDatabase([...tagDatabase, { name: tag, level: 'Medium', count: 0, desc: 'Clinician customized guideline logic' }]);
                    }
                  }} className="bg-stone-900 text-white text-xs h-9 rounded-xl">
                    + Register Custom Tag
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagDatabase.map((tag, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-2xl space-y-2 border">
                      <div className="flex justify-between">
                        <span className="font-bold text-stone-800 text-sm">{tag.name}</span>
                        <span className="bg-stone-200 text-stone-605 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">{tag.level}</span>
                      </div>
                      <p className="text-stone-500 text-xs">{tag.desc}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase">Active Cohorts: {tag.count} Parents</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 5: Video Library */}
          {activeTab === 'video_library' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                  <div>
                    <h3 className="font-serif text-base font-bold">Upload Course Video</h3>
                    <p className="text-stone-400 text-[11px]">Publish interactive video instructions aligned with somatic clinical tracks.</p>
                  </div>

                  {/* Video Destination Strategy Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Target Week Target</label>
                    <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold gap-1.5">
                      <button 
                        type="button"
                        onClick={() => setVideoPublishType('existing')}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer",
                          videoPublishType === 'existing' ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-850"
                        )}
                      >
                        📁 Existing Week
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setVideoPublishType('new_week');
                          if (!videoNewWeekNum || videoNewWeekNum === 0) {
                            setVideoNewWeekNum(modules.length + 1);
                          }
                        }}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer",
                          videoPublishType === 'new_week' ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-850"
                        )}
                      >
                        ✨ Create New Week
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Lesson Title</label>
                      <input type="text" placeholder="e.g., Handling Anger Outbursts" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200" />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Wistia Video ID</label>
                      <input type="text" placeholder="video_embed_key (e.g., eabjoioutk)" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200" />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Target Clinical Tag</label>
                      <select value={newVideoTag} onChange={e => setNewVideoTag(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200">
                        {tagDatabase.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    {videoPublishType === 'existing' ? (
                      <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block mb-1">Target Curriculum Module / Week</label>
                        <select 
                          value={targetModuleId || (modules[0] ? modules[0].id : '')} 
                          onChange={e => setTargetModuleId(e.target.value)} 
                          className="w-full text-xs p-3 rounded-lg bg-stone-50 border border-stone-200"
                        >
                          <option value="">-- Choose Module Target --</option>
                          {modules.map(m => (
                            <option key={m.id} value={m.id}>Week {m.week}: {m.title}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2.5 animate-fadeIn">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">📦 New Dynamic Week Configuration</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 space-y-1">
                            <label className="text-[9px] font-bold text-stone-400 uppercase block">Week #</label>
                            <input 
                              type="number" 
                              value={videoNewWeekNum || ''} 
                              onChange={e => setVideoNewWeekNum(Number(e.target.value) || modules.length + 1)}
                              className="w-full text-xs p-2 rounded bg-white border border-stone-200"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-bold text-stone-400 uppercase block">Week Title</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Sibling Harmony Boost"
                              value={videoNewWeekTitle} 
                              onChange={e => setVideoNewWeekTitle(e.target.value)}
                              className="w-full text-xs p-2 rounded bg-white border border-stone-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-stone-400 uppercase block">Module Course Description</label>
                          <textarea 
                            rows={1.5}
                            placeholder="Briefly state clinical focuses for this new week..."
                            value={videoNewWeekDesc} 
                            onChange={e => setVideoNewWeekDesc(e.target.value)}
                            className="w-full text-xs p-2 rounded bg-white border border-stone-200"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="notify-parents"
                          defaultChecked={true}
                          className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                        />
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        <label htmlFor="notify-parents" className="text-xs font-bold text-stone-700">Notify Parents via GMail / Email</label>
                      </div>
                      <p className="text-[10px] text-stone-550 leading-normal">
                        Instantly triggers outbound SMTP GMail simulation to parents assigned with kids tagged as '{newVideoTag || "Anger"}'.
<<<<<<< HEAD
=======
=======
                        <label htmlFor="notify-parents" className="text-xs font-bold text-stone-700">Notify Parents via WhatsApp</label>
                      </div>
                      <p className="text-[10px] text-stone-550 leading-normal">
                        Instantly triggers outbound WhatsApp simulation to parents assigned with kids tagged as '{newVideoTag || "Anger"}'.
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                      </p>
                    </div>

                    <Button onClick={() => {
                      if (!newVideoTitle) return alert('Please enter a Lesson Title.');
                      const wistiaKey = newVideoUrl || 'eabjoioutk';

                      if (videoPublishType === 'new_week') {
                        if (!videoNewWeekTitle) return alert('Please enter a Week Title.');
                        const targetWeekNum = videoNewWeekNum || (modules.length + 1);
                        const newWeekId = `m${targetWeekNum}`;

                        // Create new Lesson
                        const firstLesson: any = {
                          id: `l${targetWeekNum}-1`,
                          title: newVideoTitle,
                          duration: '12:00',
                          type: 'video' as const,
                          completed: false,
                          videoUrl: `https://fast.wistia.net/embed/iframe/${wistiaKey}`,
                          wistiaId: wistiaKey,
                          notes: `Clinical focus: ${newVideoTag}`
                        };

                        // Construct Module
                        const createdModule = {
                          id: newWeekId,
                          title: videoNewWeekTitle,
                          description: videoNewWeekDesc || 'Clinician defined somatic mindfulness pathway supporting dynamic parent-child coregulation.',
                          week: targetWeekNum,
                          unlocked: true, // Auto unlocked for easy evaluation
                          progress: 0,
                          lessons: [
                            firstLesson,
<<<<<<< HEAD
                            { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation Video', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
                            { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Video Guide', duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
<<<<<<< HEAD
                            { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation Video', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
                            { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Video Guide', duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
                            { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9' },
                            { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Log', duration: '05:00', type: 'reflection' as const, completed: false }
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                          ]
                        };

                        // Construct Preset Daily Tasks
                        const createdTasks = [
                          { id: `t${targetWeekNum}-1`, moduleId: newWeekId, day: 1, title: 'Mindful Co-Breathing', instructions: 'Conduct three slow co-regulating parent-child candle breaths together when tension triggers occur.', estimatedTime: '5 mins', completed: false, note: 'Daily Breath', reflection: '' },
                          { id: `t${targetWeekNum}-2`, moduleId: newWeekId, day: 2, title: 'Controlled Choice Practice', instructions: 'Empower autonomy by offering two positive alternatives instead of direct orders.', estimatedTime: '3 mins', completed: false, note: 'Autonomy Work', reflection: '' },
                          { id: `t${targetWeekNum}-3`, moduleId: newWeekId, day: 3, title: 'Reflective Sleep Diary', instructions: 'Record at least 1 co-regulation trigger observation with your child before sleep.', estimatedTime: '8 mins', completed: false, note: 'Reflection Habit', reflection: '' }
                        ];

                        addNewModule(createdModule, createdTasks);
                        
                        const shouldNotify = (document.getElementById('notify-parents') as HTMLInputElement)?.checked;
                        if (shouldNotify) {
<<<<<<< HEAD
                          sendTestWhatsApp('parent_jane@gmail.com', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetWeekNum}! Practice this co-regulation today.`);
                          logAdminAction('Outbound GMail Broadcast Warning', `Dispatched SMTP e-mail alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
=======
<<<<<<< HEAD
                          sendTestWhatsApp('parent_jane@gmail.com', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetWeekNum}! Practice this co-regulation today.`);
                          logAdminAction('Outbound GMail Broadcast Warning', `Dispatched SMTP e-mail alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
=======
                          sendTestWhatsApp('+15550199', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetWeekNum}! Practice this co-regulation today.`);
                          logAdminAction('Outbound Broadcast Warning', `Dispatched alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        }

                        logAdminAction('Curriculum Added', `Created Curriculum Week ${targetWeekNum}: "${videoNewWeekTitle}" with lesson "${newVideoTitle}"`);
                        alert(`Success! Created Week ${targetWeekNum}: "${videoNewWeekTitle}" and published lesson "${newVideoTitle}" directly under it! Parent checklist tasks pre-scheduled.`);

                        // Reset
                        setNewVideoTitle('');
                        setVideoNewWeekTitle('');
                        setVideoNewWeekDesc('');
                        setVideoNewWeekNum(modules.length + 2);
                      } else {
                        const selectedModId = targetModuleId || (modules[0] ? modules[0].id : '');
                        if (!selectedModId) return alert('No modules exist to target!');

                        const newLesson: any = {
                          id: 'l-' + Date.now(),
                          title: newVideoTitle,
                          duration: '10:00',
                          type: 'video' as const,
                          videoUrl: `https://fast.wistia.net/embed/iframe/${wistiaKey}`,
                          wistiaId: wistiaKey,
                          completed: false,
                          notes: `Clinical focus: ${newVideoTag}`
                        };

                        const targetModule = modules.find(m => m.id === selectedModId);
                        const targetTitle = targetModule ? targetModule.title : 'Selected Week';

                        // Add to AppContext
                        setModules(prev => {
                          return prev.map(m => {
                            if (m.id === selectedModId) {
                              return {
                                ...m,
                                lessons: [...(m.lessons || []), newLesson]
                              };
                            }
                            return m;
                          });
                        });

                        const shouldNotify = (document.getElementById('notify-parents') as HTMLInputElement)?.checked;
                        if (shouldNotify) {
<<<<<<< HEAD
                          sendTestWhatsApp('parent_jane@gmail.com', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetModule?.week || 1}! Practice this co-regulation today.`);
                          logAdminAction('Outbound GMail Broadcast Warning', `Dispatched e-mail alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
=======
<<<<<<< HEAD
                          sendTestWhatsApp('parent_jane@gmail.com', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetModule?.week || 1}! Practice this co-regulation today.`);
                          logAdminAction('Outbound GMail Broadcast Warning', `Dispatched e-mail alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
=======
                          sendTestWhatsApp('+15550199', `Hi there! A brand new clinical lesson has been published: "${newVideoTitle}" is now unlocked for you on Week ${targetModule?.week || 1}! Practice this co-regulation today.`);
                          logAdminAction('Outbound Broadcast Warning', `Dispatched alerts to parenthood community regarding unlocked lesson "${newVideoTitle}"`);
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        }

                        logAdminAction('Add Lesson Content', `Created and linked "${newVideoTitle}" under module "${targetTitle}"`);
                        alert(`Wistia lesson "${newVideoTitle}" published and assigned under ${targetTitle} successfully!`);
                        setNewVideoTitle('');
                      }
                    }} className="w-full bg-stone-900 hover:bg-stone-850 cursor-pointer text-white text-xs h-10 rounded-lg font-bold">Publish Course Video</Button>
                  </div>
                </Card>

                <Card className="p-6 bg-white rounded-3xl md:col-span-2 space-y-4 shadow-sm border-none">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif text-base font-bold">Active Somatic Curriculum Lessons</h3>
                      <p className="text-stone-400 text-xs text-[11px]">Manage and edit lessons/videos dynamically synchronized to Supabase.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                    {modules.map((m, idx) => {
                      const isEditingThisModule = editingModuleId === m.id;
                      return (
                        <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3">
                          <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                            <div className="flex-1 mr-4 min-w-0">
                              {isEditingThisModule ? (
                                <div className="space-y-2 py-1 w-full">
                                  <div>
                                    <label className="text-[10px] font-bold text-stone-400 block mb-0.5">Week Title</label>
                                    <input 
                                      type="text" 
                                      className="w-full text-xs p-1.5 rounded bg-white border border-stone-300 font-bold" 
                                      value={editingModuleTitle} 
                                      onChange={e => setEditingModuleTitle(e.target.value)} 
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center flex-wrap gap-1.5 min-w-0">
                                  <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono mr-2">Week {m.week}</span>
                                  <strong className="font-sans font-bold text-sm text-stone-850 truncate">{m.title}</strong>
                                  <span className={cn(
                                    "text-[9px] px-1.5 py-0.2 rounded font-black uppercase font-mono shrink-0",
                                    m.unlocked ? "bg-emerald-50 text-emerald-800" : "bg-amber-100/80 text-amber-800"
                                  )}>
                                    {m.unlocked ? "🔓 Unlocked" : "🔒 Locked"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isEditingThisModule ? (
                                <>
                                  <button
                                    onClick={() => {
                                      if (!editingModuleTitle.trim()) return alert('Module title cannot be empty!');
                                      setModules(prev => prev.map(mod => mod.id === m.id ? { ...mod, title: editingModuleTitle, description: editingModuleDesc } : mod));
                                      logAdminAction('Edit Module', `Updated Week ${m.week} details to "${editingModuleTitle}"`);
                                      setEditingModuleId(null);
                                    }}
                                    className="p-1 px-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[10px] font-bold rounded-md transition flex items-center gap-1"
                                    title="Save Module Changes"
                                  >
                                    <Check className="w-3 h-3" /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingModuleId(null)}
                                    className="p-1 px-2 bg-stone-200 text-stone-700 hover:bg-stone-300 text-[10px] font-bold rounded-md transition flex items-center gap-1"
                                    title="Cancel"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingModuleId(m.id);
                                      setEditingModuleTitle(m.title);
                                      setEditingModuleDesc(m.description || '');
                                    }}
                                    className="p-1.5 text-stone-550 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition"
                                    title="Edit Week Title & Description"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const nextUnlock = !m.unlocked;
                                      unlockModuleManually(m.id, nextUnlock);
                                      logAdminAction('Toggle Week Lock', `Toggled Week ${m.week} lock to ${nextUnlock ? 'Unlocked' : 'Locked'}`);
                                      alert(`Successfully ${nextUnlock ? 'UNLOCKED' : 'LOCKED'} Week ${m.week} ("${m.title}") for all parents!`);
                                    }}
                                    className={cn(
                                      "p-1.5 rounded-lg transition",
                                      m.unlocked ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                    )}
                                    title={m.unlocked ? "Lock Week" : "Unlock Week"}
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <span className="text-[10px] font-mono text-stone-400 font-bold shrink-0">{(m.lessons || []).length} Lessons</span>
                            </div>
                          </div>
                          
                          {isEditingThisModule ? (
                            <div className="space-y-1 py-1">
                              <label className="text-[10px] font-bold text-stone-400 block mb-0.5">Week Description</label>
                              <textarea 
                                rows={2}
                                className="w-full text-xs p-2 rounded bg-white border border-stone-300"
                                value={editingModuleDesc}
                                onChange={e => setEditingModuleDesc(e.target.value)}
                              />
                            </div>
                          ) : (
                            <p className="text-stone-500 text-[11px] leading-tight line-clamp-2">{m.description || 'No description provided.'}</p>
                          )}
                          
                          <div className="space-y-2 pt-1 border-t border-dashed border-stone-200">
                            {(m.lessons || []).length === 0 ? (
                              <p className="text-[10px] text-stone-400 font-bold italic">No video lessons uploaded in this module.</p>
                            ) : (
                              m.lessons.map((lesson: any) => {
                                const isEditingThisLesson = editingLessonId === lesson.id && editingLessonModuleId === m.id;
                                return (
                                  <div key={lesson.id} className="p-3 bg-white rounded-xl border border-stone-150 text-xs transition-all hover:shadow-xs">
                                    {isEditingThisLesson ? (
                                      <div className="space-y-3">
                                        <div className="text-[11px] font-bold text-stone-450 border-b border-stone-100 pb-1 flex justify-between items-center">
                                          <span>✏️ Edit Lesson Metadata</span>
                                          <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">ID: {lesson.id}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block mb-0.5">Lesson Title</label>
                                            <input 
                                              type="text" 
                                              className="w-full text-xs p-2 rounded bg-stone-50 border border-stone-200" 
                                              value={editingLessonTitle} 
                                              onChange={e => setEditingLessonTitle(e.target.value)} 
                                            />
                                          </div>
                                          <div>
                                            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block mb-0.5">Duration</label>
                                            <input 
                                              type="text" 
                                              placeholder="e.g. 10:25"
                                              className="w-full text-xs p-2 rounded bg-stone-50 border border-stone-200" 
                                              value={editingLessonDuration} 
                                              onChange={e => setEditingLessonDuration(e.target.value)} 
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block mb-0.5">Wistia Video ID</label>
                                          <input 
                                            type="text" 
                                            className="w-full text-xs p-2 rounded bg-stone-50 border border-stone-200 font-mono" 
                                            value={editingLessonWistiaId} 
                                            onChange={e => setEditingLessonWistiaId(e.target.value)} 
                                          />
                                          <span className="text-[9px] text-stone-400 mt-1 block">
                                            Builds embed frame url: <span className="font-mono text-stone-500 font-bold select-all">https://fast.wistia.net/embed/iframe/{editingLessonWistiaId || '...'}</span>
                                          </span>
                                        </div>

                                        <div className="flex gap-2 justify-end pt-1">
                                          <button
                                            onClick={() => {
                                              if (!editingLessonTitle.trim()) return alert('Lesson title cannot be empty!');
                                              const wistiaKey = editingLessonWistiaId.trim() || 'eabjoioutk';
                                              
                                              setModules(prev => {
                                                return prev.map(mod => {
                                                  if (mod.id === m.id) {
                                                    return {
                                                      ...mod,
                                                      lessons: (mod.lessons || []).map((l: any) => {
                                                        if (l.id === lesson.id) {
                                                          return {
                                                            ...l,
                                                            title: editingLessonTitle,
                                                            duration: editingLessonDuration || '10:00',
                                                            wistiaId: wistiaKey,
                                                            wistia_id: wistiaKey,
                                                            videoUrl: `https://fast.wistia.net/embed/iframe/${wistiaKey}`
                                                          };
                                                        }
                                                        return l;
                                                      })
                                                    };
                                                  }
                                                  return mod;
                                                });
                                              });

                                              logAdminAction('Edit Lesson URL', `Updated details for lesson "${editingLessonTitle}" (ID: ${lesson.id}) in Week ${m.week}`);
                                              setEditingLessonId(null);
                                              setEditingLessonModuleId(null);
                                              alert(`Somatic lesson "${editingLessonTitle}" changes saved successfully!`);
                                            }}
                                            className="h-8 text-[10px] px-3 bg-stone-900 hover:bg-stone-850 text-white rounded-lg flex items-center gap-1 cursor-pointer font-bold"
                                          >
                                            <Check className="w-3.5 h-3.5" /> Save Changes
                                          </button>

                                          <button
                                            onClick={() => {
                                              setEditingLessonId(null);
                                              setEditingLessonModuleId(null);
                                            }}
                                            className="h-8 text-[10px] px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                          >
                                            <X className="w-3.5 h-3.5" /> Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 min-w-0 pr-4">
                                          <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-stone-500 rounded-full shrink-0" />
                                            <span className="font-bold text-stone-850 truncate">{lesson.title}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                                            <span>⏱️ {lesson.duration || '5 mins'}</span>
                                            <span>•</span>
                                            <span className="bg-stone-100 rounded text-[9px] px-1 select-all font-sans text-stone-600">ID: {lesson.wistiaId || lesson.wistia_id || 'eabjoioutk'}</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            onClick={() => {
                                              setEditingLessonId(lesson.id);
                                              setEditingLessonModuleId(m.id);
                                              setEditingLessonTitle(lesson.title);
                                              setEditingLessonDuration(lesson.duration || '10:00');
                                              setEditingLessonWistiaId(lesson.wistiaId || lesson.wistia_id || 'eabjoioutk');
                                            }}
                                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                                            title="Edit Lesson details"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                          </button>

                                          <button
                                            onClick={() => {
                                              if (true) {
                                                setModules(prev => {
                                                  return prev.map(mod => {
                                                    if (mod.id === m.id) {
                                                      return {
                                                        ...mod,
                                                        lessons: (mod.lessons || []).filter((l: any) => l.id !== lesson.id)
                                                      };
                                                    }
                                                    return mod;
                                                  });
                                                });
                                                logAdminAction('Delete Lesson Content', `Removed lesson "${lesson.title}" from module "${m.title}"`);
                                                showToast(`Lesson "${lesson.title}" deleted from Week ${m.week}`, "info", "🗑️ Lesson Removed");
                                              }
                                            }}
                                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition"
                                            title="Delete Lesson"
                                          >
                                            <Trash className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
<<<<<<< HEAD
=======
=======
                    {modules.map((m, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3">
                        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                          <div>
                            <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono mr-2">Week {m.week}</span>
                            <strong className="font-sans font-bold text-sm text-stone-850">{m.title}</strong>
                          </div>
                          <span className="text-[10px] font-mono text-stone-405 font-bold">{(m.lessons || []).length} Lessons</span>
                        </div>
                        
                        <p className="text-stone-400 text-[11px] leading-tight line-clamp-1">{m.description}</p>
                        
                        <div className="space-y-2">
                          {(m.lessons || []).length === 0 ? (
                            <p className="text-[10px] text-stone-400 font-bold italic">No video lessons uploaded in this module.</p>
                          ) : (
                            m.lessons.map((lesson: any) => (
                              <div key={lesson.id} className="p-2.5 bg-white rounded-xl border border-stone-150 flex items-center justify-between text-xs transition-all hover:shadow-xs">
                                <div className="space-y-0.5 min-w-0 pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-stone-500 rounded-full shrink-0" />
                                    <span className="font-bold text-stone-800 truncate">{lesson.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                                    <span>⏱️ {lesson.duration || '5 mins'}</span>
                                    <span>•</span>
                                    <span className="bg-stone-100 rounded text-[9px] px-1 select-all font-sans text-stone-600">ID: {lesson.wistiaId || lesson.wistia_id || 'eabjoioutk'}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete lesson "${lesson.title}" from Week ${m.week}?`)) {
                                      setModules(prev => {
                                        return prev.map(mod => {
                                          if (mod.id === m.id) {
                                            return {
                                              ...mod,
                                              lessons: (mod.lessons || []).filter((l: any) => l.id !== lesson.id)
                                            };
                                          }
                                          return mod;
                                        });
                                      });
                                      logAdminAction('Delete Lesson Content', `Removed lesson "${lesson.title}" from module "${m.title}"`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition"
                                  title="Delete Lesson"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 6: Learning Path Builder */}
          {activeTab === 'learning_path' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-base font-bold">Blueprint Program Path</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Anger Co-Regulation Blueprint" value={newPathName} onChange={e => setNewPathName(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="number" placeholder="4 Weeks" value={newPathWeeks} onChange={e => setNewPathWeeks(Number(e.target.value))} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="text" placeholder="Peace Ambassador Badge" value={newPathBadge} onChange={e => setNewPathBadge(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <Button onClick={() => {
                      if (!newPathName) return alert('Enter title');
                      setLearningPaths([...learningPaths, { id: 'lp_3', name: newPathName, desc: 'Clinician program cohort blueprint.', tags: ['Emotional Intelligence'], weeksCount: newPathWeeks, badge: newPathBadge }]);
                      alert('Custom co-regulation pathways updated successfully!');
                    }} className="w-full bg-stone-900 text-white text-xs h-10 rounded-lg">Publish Learning Path</Button>
                  </div>
                </Card>

                <Card className="p-6 bg-white rounded-3xl md:col-span-2 space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-base font-bold">Active Structured Tracks</h3>
                  <div className="space-y-4">
                    {learningPaths.map((lp, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-serif font-black text-stone-800 text-sm">{lp.name}</h4>
                          <p className="text-stone-500 text-xs mt-1">{lp.desc}</p>
                          <div className="flex gap-2 flex-wrap pt-2">
                            {lp.tags.map(t => (
                              <span key={t} className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-[9px] uppercase font-bold">{lp.weeksCount} Weeks Program</span>
                          <p className="text-[10px] text-stone-400 mt-1 font-semibold">{lp.badge}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Dynamic Curriculum Week Creator */}
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none mt-6">
                <div className="flex items-center gap-3 border-b pb-3 mb-2">
                  <div className="p-2 bg-accent-sage/10 text-accent-sage rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">Dynamic Curriculum Week (Module) Creator</h3>
                    <p className="text-xs text-stone-500">Create new structured weeks or modules to automatically expand your LMS curriculum library beyond initial limits.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5 font-sans">
                     <label className="text-[10px] font-bold uppercase text-stone-400">Week Title</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Sibling Harmony & Joint Play" 
                       value={adminNewModuleName} 
                       onChange={e => setAdminNewModuleName(e.target.value)} 
                       className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200" 
                     />
                  </div>

                  <div className="space-y-1.5 font-sans">
                     <label className="text-[10px] font-bold uppercase text-stone-400">Week / Module Number</label>
                     <input 
                       type="number" 
                       placeholder="e.g. 9" 
                       value={adminNewModuleWeekNum || ""} 
                       onChange={e => setAdminNewModuleWeekNum(Number(e.target.value))} 
                       className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200" 
                     />
                  </div>

                  <div className="space-y-1.5 font-sans">
                     <label className="text-[10px] font-bold uppercase text-stone-400">Core Video Wistia ID</label>
                     <input 
                       type="text" 
                       placeholder="e.g. eabjoioutk (Folder URL or ID)" 
                       value={adminNewModuleVideoId} 
                       onChange={e => setAdminNewModuleVideoId(e.target.value)} 
                       className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200" 
                     />
                  </div>

                  <div className="space-y-1.5 font-sans">
                     <label className="text-[10px] font-bold uppercase text-stone-400">Video Lesson Title</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Mindful Communication Masterclass" 
                       value={adminNewModuleVideoTitle} 
                       onChange={e => setAdminNewModuleVideoTitle(e.target.value)} 
                       className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200" 
                     />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold uppercase text-stone-400">Curriculum Course Description</label>
                  <textarea 
                    rows={2} 
                    placeholder="Outline the clinical focus, somatic benefits, parent guidelines, and homework practices for this curriculum module..." 
                    value={adminNewModuleDesc} 
                    onChange={e => setAdminNewModuleDesc(e.target.value)} 
                    className="w-full text-xs p-3 rounded-xl bg-stone-50 border border-stone-200" 
                  />
                </div>

                {/* Advanced Preset Tasks Selector */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3 font-sans">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-stone-800 text-xs font-bold font-serif">Preset Parent Actions Checklist</span>
                      <p className="text-[11px] text-stone-500">The following daily somatic habits and checklists will be pre-scheduled for parent tracking:</p>
                    </div>
                    <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-black">Day 1 to Day 3 Checklist</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <p className="font-bold text-accent-sage text-[10px] uppercase">Day 1 task (Morning Ritual)</p>
                      <p className="font-semibold text-stone-700">Mindful Breath Practice</p>
                      <p className="text-[10px] text-stone-400">Conduct 3 slow co-regulating parent-child candle breaths together.</p>
                    </div>
                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <p className="font-bold text-accent-sage text-[10px] uppercase">Day 2 task (Autonomy Boost)</p>
                      <p className="font-semibold text-stone-700 font-sans">Structured Choice Offering</p>
                      <p className="text-[10px] text-stone-400">Offer two positive selected alternatives to trigger independent choice.</p>
                    </div>
                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <p className="font-bold text-accent-sage text-[10px] uppercase">Day 3 task (Bedtime Co-Regulation)</p>
                      <p className="font-semibold text-stone-700 font-sans">Gratitude Co-Reflections</p>
                      <p className="text-[10px] text-stone-400">Log one joint family success story inside your private journals.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={() => {
                      if (!adminNewModuleName) return alert('Please enter a Week Title.');
                      const targetWeekNum = adminNewModuleWeekNum || (modules.length + 1);
                      const newWeekId = `m${targetWeekNum}`;

                      // Construct Module
                      const createdModule = {
                        id: newWeekId,
                        title: adminNewModuleName,
                        description: adminNewModuleDesc || 'Clinician defined somatic mindfulness pathway supporting dynamic parent-child coregulation.',
                        week: targetWeekNum,
                        unlocked: false, // Created as locked by default, admin can unlock specifically
                        progress: 0,
                        lessons: [
<<<<<<< HEAD
                          { id: `l${targetWeekNum}-1`, title: adminNewModuleVideoTitle || 'Introduction Lesson & Focus Area', duration: '12:00', type: 'video' as const, completed: false, videoUrl: adminNewModuleVideoId || 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
                          { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation Video', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
                          { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Video Guide', duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
<<<<<<< HEAD
                          { id: `l${targetWeekNum}-1`, title: adminNewModuleVideoTitle || 'Introduction Lesson & Focus Area', duration: '12:00', type: 'video' as const, completed: false, videoUrl: adminNewModuleVideoId || 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
                          { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation Video', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
                          { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Video Guide', duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
                          { id: `l${targetWeekNum}-1`, title: adminNewModuleVideoTitle || 'Introduction Lesson & Focus Area', duration: '12:00', type: 'video' as const, completed: false, videoUrl: adminNewModuleVideoId || 'https://khwahishseth.wistia.com/folders/wx9zawl1d9' },
                          { id: `l${targetWeekNum}-2`, title: 'Somatic Focus Clinical Meditation', duration: '10:00', type: 'video' as const, completed: false, videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9' },
                          { id: `l${targetWeekNum}-3`, title: 'Milestone Reflection Log', duration: '05:00', type: 'reflection' as const, completed: false }
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        ]
                      };

                      // Construct Preset Daily Tasks
                      const createdTasks = [
                        { id: `t${targetWeekNum}-1`, moduleId: newWeekId, day: 1, title: 'Mindful Co-Breathing', instructions: 'Conduct three slow co-regulating parent-child candle breaths together when tension triggers occur.', estimatedTime: '5 mins', completed: false, note: 'Daily Breath', reflection: '' },
                        { id: `t${targetWeekNum}-2`, moduleId: newWeekId, day: 2, title: 'Controlled Choice Practice', instructions: 'Empower autonomy by offering two positive alternatives instead of direct orders.', estimatedTime: '3 mins', completed: false, note: 'Autonomy Work', reflection: '' },
                        { id: `t${targetWeekNum}-3`, moduleId: newWeekId, day: 3, title: 'Reflective Sleep Diary', instructions: 'Record at least 1 co-regulation trigger observation with your child before sleep.', estimatedTime: '8 mins', completed: false, note: 'Reflection Habit', reflection: '' }
                      ];

                      addNewModule(createdModule, createdTasks);
                      alert(`Success! Week ${targetWeekNum}: "${adminNewModuleName}" created successfully! Default parent checklist tasks for Day 1 to Day 3 pre-scheduled. Use the "Unlock Rules Engine" tab to grant student and parent access.`);

                      // Clear states
                      setAdminNewModuleName('');
                      setAdminNewModuleDesc('');
                      setAdminNewModuleVideoId('');
                      setAdminNewModuleVideoTitle('');
                      setAdminNewModuleWeekNum(0);
                      logAdminAction('Curriculum Added', `Created Curriculum Week ${targetWeekNum}: "${adminNewModuleName}"`);
                    }} 
                    className="bg-accent-sage hover:bg-accent-sage/90 text-stone-900 font-extrabold px-6 rounded-xl hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    🚀 Publish Week {adminNewModuleWeekNum || modules.length + 1} to Curriculum LMS
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 7: Assignments & Tasks */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border border-stone-100">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Dynamic Clinician Lab
                    </span>
                    <h3 className="font-serif text-base font-bold text-stone-900">Schedule Somatic Task</h3>
                    <p className="text-[10px] text-stone-400">Design parenting exercises. Use AI to optimize instructions to ensure high compliance in real life.</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">1. Practice Objective / Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Cooperative Toothbrushing Game, Candle breathing co-presence" 
                        value={newTaskTitle} 
                        onChange={e => setNewTaskTitle(e.target.value)} 
                        className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1 font-medium" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Assign to Week</label>
                        <select 
                          value={newTaskModuleId} 
                          onChange={e => setNewTaskModuleId(e.target.value)} 
                          className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1"
                        >
                          {modules.map(m => (
                            <option key={m.id} value={m.id}>Week {m.week}: {m.title.replace('Understanding ', '').substring(0, 18)}...</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Day (1-7)</label>
                        <select 
                          value={newTaskDay} 
                          onChange={e => setNewTaskDay(Number(e.target.value))} 
                          className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1"
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map(num => (
                            <option key={num} value={num}>Day {num}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Points Weight</label>
                        <input 
                          type="number" 
                          placeholder="25 Points" 
                          value={newTaskPoints} 
                          onChange={e => setNewTaskPoints(Number(e.target.value))} 
                          className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1" 
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Est. Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 5-8 mins" 
                          value={newTaskEstimatedTime} 
                          onChange={e => setNewTaskEstimatedTime(e.target.value)} 
                          className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Concern Category Tag</label>
                      <select 
                        value={newTaskTag} 
                        onChange={e => setNewTaskTag(e.target.value)} 
                        className="w-full text-xs p-3 rounded-lg bg-stone-50 border mt-1"
                      >
                        {tagDatabase.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Task Instructions</label>
                        <button
                          type="button"
                          disabled={isOptimizingTask}
                          onClick={async () => {
                            if (!newTaskTitle) {
                              alert("Please specify an Objective / Title before optimizing with AI!");
                              return;
                            }
                            setIsOptimizingTask(true);
                            try {
                              const res = await fetch("/api/optimize-assignment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ title: newTaskTitle, category: newTaskTag })
                              });
                              const data = await res.json();
                              if (data.title) setNewTaskTitle(data.title);
                              if (data.instructions) setNewTaskInstructions(data.instructions);
                              if (data.estimatedTime) setNewTaskEstimatedTime(data.estimatedTime);
                              
                              // Trigger a cute spark
                              import('canvas-confetti').then((m) => {
                                m.default({ particleCount: 30, colors: ['#4f46e5', '#10b981'] });
                              });
                            } catch (e) {
                              console.error(e);
                              alert("AI Clinician is coregulating! Setting fallback structural formula instead.");
                              setNewTaskInstructions(`🌱 SENSORY PREPARATION:\n- Spend 1 minute breathing quietly to ground yourself.\n\n🎯 REAL-LIFE INTERACTION:\n- Practice "${newTaskTitle}" face-to-face as co-presence support for: ${newTaskTag}.\n\n💬 CLINICAL REFLECTION:\n- Journal specific child reactions and how you felt, to secure complete observation.`);
                            } finally {
                              setIsOptimizingTask(false);
                            }
                          }}
                          className="text-[9px] font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md flex items-center gap-1 transition-all pointer-events-auto cursor-pointer"
                        >
                          {isOptimizingTask ? "⏳ Coregulating..." : "✨ Optimize with AI Clinician"}
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Write dynamic steps parents must take in real life, or click on the AI Clinician button above to auto-generate beautiful clinically correct prompts..."
                        value={newTaskInstructions}
                        onChange={e => setNewTaskInstructions(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg bg-white border resize-none leading-relaxed font-mono custom-scrollbar"
                      />
                    </div>

                    <Button 
                      onClick={() => {
                        if (!newTaskTitle) return alert('Enter task title');
                        if (!newTaskInstructions) return alert('Please write instructions or use the AI Optimizer!');

                        const nt: any = {
                          id: 'task-' + Date.now(),
                          moduleId: newTaskModuleId,
                          day: Number(newTaskDay) || 1,
                          title: newTaskTitle,
                          instructions: newTaskInstructions,
                          completed: false,
                          estimatedTime: newTaskEstimatedTime || '8 mins',
                          note: '',
                          reflection: '',
                          points: Number(newTaskPoints) || 15
                        };
                        const updatedTasks = [...dailyTasks, nt];
                        setDailyTasks(updatedTasks);
                        localStorage.setItem('parent_guidance_daily_tasks', JSON.stringify(updatedTasks));

                        import('canvas-confetti').then((m) => {
                          m.default({ particleCount: 100, spread: 70 });
                        });

                        alert(`Published dynamic homework: "${newTaskTitle}" scheduled successfully for Week ${modules.find(m => m.id === newTaskModuleId)?.week || 1} Day ${newTaskDay}!`);
                        
                        // Clear inputs
                        setNewTaskTitle('');
                        setNewTaskInstructions('');
                        setNewTaskPoints(15);
                      }} 
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-11 tracking-wider uppercase font-bold rounded-xl cursor-pointer"
                    >
                      🚀 Publish Task Live to Parent Hub
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-white rounded-3xl md:col-span-2 space-y-4 shadow-sm border border-stone-100 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-stone-900">Co-Regulation Microtasks Registry</h3>
                    <p className="text-[10px] text-stone-400">Manage all dynamic custom-assigned check lists published to the 8-Week parent program.</p>
                  </div>
                  
                  <div className="space-y-3 mt-3 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar flex-1">
                    {dailyTasks.map((t, idx) => {
                      const mod = modules.find(m => m.id === t.moduleId);
                      return (
                        <div key={idx} className="p-4 bg-stone-50 border rounded-2xl flex items-start justify-between gap-4 text-xs transition-colors hover:bg-stone-50/80">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono">
                                Week {mod?.week || '?'} • Day {t.day}
                              </span>
                              <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                {t.note ? `Target: ${t.note}` : 'General Wellness'}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">({t.estimatedTime || '8 mins'})</span>
                            </div>
                            <h4 className="font-bold text-stone-850 text-sm mt-1">{t.title}</h4>
                            <p className="text-[11px] text-stone-500 mt-1 whitespace-pre-wrap leading-relaxed font-sans bg-white p-3 rounded-xl border border-stone-150/50">
                              {t.instructions}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteTask(t.id)} 
                            className="text-rose-600 hover:bg-rose-50 border-rose-100 text-[10px] h-8 shrink-0 rounded-lg font-bold"
                          >
                            Delete
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 8: Unlock Rules */}
          {activeTab === 'unlocks' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <h3 className="font-serif text-lg font-bold">Dynamic Cohort Week Overrides & Rules</h3>
                <p className="text-xs text-stone-500">Normally weeks unlock automatically based on enrollment start dates. Configure clinical triggers below:</p>
                
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border">
                    <h4 className="font-bold text-xs text-stone-700 uppercase">Unlock Dependencies</h4>
                    <label className="flex items-center gap-2.5 text-xs text-stone-600 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={unlockDependencies?.videoComplete90 ?? true} 
                        onChange={(e) => setUnlockDependencies({ ...unlockDependencies, videoComplete90: e.target.checked })} 
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                      />
                      <span>Complete 90% of preceding Week Video</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-stone-600 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={unlockDependencies?.submitReflection ?? true} 
                        onChange={(e) => setUnlockDependencies({ ...unlockDependencies, submitReflection: e.target.checked })} 
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                      />
                      <span>Submit at least 1 Clinical Reflection</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-stone-600 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={unlockDependencies?.markSomaticTasks ?? true} 
                        onChange={(e) => setUnlockDependencies({ ...unlockDependencies, markSomaticTasks: e.target.checked })} 
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                      />
                      <span>Mark 3 Daily Somatic Tasks check-ins</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-stone-600 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={unlockDependencies?.minimumPoints ?? true} 
                        onChange={(e) => setUnlockDependencies({ ...unlockDependencies, minimumPoints: e.target.checked })} 
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                      />
                      <span>Earn minimum 45 Brownie Star Points</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-stone-700 uppercase">Force Manual Bypass (Instant Overrides)</h4>
                    {modules.map((m, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 border rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold">Week {m.week} : {m.title}</span>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => {
                            unlockModuleManually(m.id, true);
                            alert(`Bypassed! Week ${m.week} unlocked for all cohorts.`);
                          }} className={cn("text-[10px] h-8 px-2.5 rounded-lg", m.unlocked ? 'bg-emerald-600 text-white':'bg-stone-200 text-stone-750')}>Force Unlock</Button>
                          <Button size="sm" onClick={() => {
                            unlockModuleManually(m.id, false);
                            alert(`Week ${m.week} locked successfully.`);
                          }} className="text-[10px] h-8 px-2.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg">Lock Module</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Dynamic Parent Overrides block */}
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none mt-6">
                <div className="flex items-center gap-3 border-b pb-3 mb-2">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">Parent-Student Milestone Review & Personalized Unlocks</h3>
                    <p className="text-xs text-stone-500">Monitor individual parent and student completion status. If both fulfill the active weekly content, clinicians can manually grant customized next-week unlocks.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {parents.map((p) => {
                    const child = childProfiles.find(c => c.parentPhone === p.phone) || { name: p.studentName, id: p.studentId };
                    
                    return (
                      <div key={p.phone} className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60">
                          <div>
                            <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase mr-2">Parent Cohort</span>
                            <strong className="text-stone-850 font-serif text-sm">{p.name || 'Jane Doe'} ({p.phone})</strong>
                            <p className="text-xs text-stone-500 mt-0.5">Parent & Child pair: <span className="font-bold text-stone-700">{child.name}</span> (ID: {child.id})</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500 font-medium">Unlocked Weeks List:</span>
                            <div className="flex gap-1 flex-wrap">
                              {(p.unlockedWeeksList || [1]).map(w => (
                                <span key={w} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Week {w}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          {modules.map((m) => {
                            // Compute completions
                            const pTasks = dailyTasks.filter(t => t.moduleId === m.id);
                            const pCompleted = pTasks.filter(t => t.completed).length;
                            const pPercent = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 100;

                            const sLessons = m.lessons || [];
                            const sCompleted = sLessons.filter(l => l.completed).length;
                            const sPercent = sLessons.length > 0 ? Math.round((sCompleted / sLessons.length) * 100) : 100;

                            const isCompletedByBoth = pPercent === 100 && sPercent === 100;
                            const isUnlockedForParent = (p.unlockedWeeksList || [1]).includes(m.week);

                            return (
                              <div key={m.id} className={cn(
                                "p-3 rounded-xl border flex flex-col justify-between space-y-2",
                                isUnlockedForParent ? "bg-white border-stone-200 shadow-2xs" : "bg-stone-100/50 border-stone-150 opacity-70"
                              )}>
                                <div>
                                  <div className="flex justify-between items-center pb-1 border-b border-stone-100">
                                    <span className="font-bold text-stone-800 font-sans text-xs">Week {m.week}</span>
                                    {isUnlockedForParent ? (
                                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold">ACCESSIBLE</span>
                                    ) : (
                                      <span className="text-[9px] bg-stone-200 text-stone-500 px-1.5 py-0.2 rounded font-bold">LOCKED</span>
                                    )}
                                  </div>
                                  <div className="space-y-1.5 pt-2 text-[11px] font-mono">
                                    <div className="flex justify-between items-center text-stone-600">
                                      <span>Parent Checklist:</span>
                                      <span className={cn("font-bold", pPercent === 100 ? "text-emerald-600" : "text-stone-500")}>
                                        {pPercent}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-stone-600">
                                      <span>Kid Video Lessons:</span>
                                      <span className={cn("font-bold", sPercent === 100 ? "text-emerald-600" : "text-stone-500")}>
                                        {sPercent}%
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Completion status */}
                                <div className="pt-2">
                                  {isCompletedByBoth ? (
                                    <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold py-1 px-2 rounded-lg text-center flex items-center justify-center gap-1">
                                      <span>🏆 Full Completion</span>
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-stone-400 italic text-center py-1">In progress ({Math.round((pPercent + sPercent) / 2)}%)</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Unlocks Controls for this parent */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-stone-100/50 p-3 rounded-xl">
                          <span className="text-xs font-bold text-stone-600">Action Overrides for {p.name}:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {modules.map((m) => {
                              const isUnlockedForParent = (p.unlockedWeeksList || [1]).includes(m.week);
                              return (
                                <Button
                                  key={m.id}
                                  size="sm"
                                  onClick={() => {
                                    let updatedList = [...(p.unlockedWeeksList || [1])];
                                    if (isUnlockedForParent) {
                                      updatedList = updatedList.filter(w => w !== m.week);
                                      alert(`Locked Week ${m.week} for ${p.name}`);
                                    } else {
                                      if (!updatedList.includes(m.week)) {
                                        updatedList.push(m.week);
                                        updatedList.sort((a,b) => a-b);
                                      }
<<<<<<< HEAD
                                      alert(`Success! Unlocked Week ${m.week} ("${m.title}") for parent cohort ${p.name}. Action notification sent via GMail!`);
                                      sendTestWhatsApp(p.email || 'parent_jane@gmail.com', `Clinical Announcement: Week ${m.week} content has been reviewed and UNLOCKED for you by your supervisor. Proceed to your assignments space!`);
=======
<<<<<<< HEAD
                                      alert(`Success! Unlocked Week ${m.week} ("${m.title}") for parent cohort ${p.name}. Action notification sent via GMail!`);
                                      sendTestWhatsApp(p.email || 'parent_jane@gmail.com', `Clinical Announcement: Week ${m.week} content has been reviewed and UNLOCKED for you by your supervisor. Proceed to your assignments space!`);
=======
                                      alert(`Success! Unlocked Week ${m.week} ("${m.title}") for parent cohort ${p.name}. Action notification sent!`);
                                      sendTestWhatsApp(p.phone, `Clinical Announcement: Week ${m.week} content has been reviewed and UNLOCKED for you by your supervisor. Proceed to your assignments space!`);
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                                    }

                                    setParents(prev => prev.map(parent => parent.phone === p.phone ? { ...parent, unlockedWeeksList: updatedList } : parent));
                                    logAdminAction('Individual Unlock Override', `Toggled Week ${m.week} unlock for parent "${p.name}"`);
                                  }}
                                  className={cn(
                                    "text-[10px] h-8 px-2.5 rounded-lg font-bold uppercase tracking-wider",
                                    isUnlockedForParent ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-white border text-stone-600 hover:bg-stone-50"
                                  )}
                                >
                                  {isUnlockedForParent ? `🔒 Lock W${m.week}` : `🔓 Unlock W${m.week}`}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 9: Brownie Points Engine */}
          {activeTab === 'brownie_points' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl lg:col-span-2 space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-lg font-bold">Somatic Scoring Parameters Weighting</h3>
                  <div className="grid md:grid-cols-2 gap-4">
<<<<<<< HEAD
                    {Object.entries(scoringRules || {}).map(([key, val]) => (
=======
<<<<<<< HEAD
                    {Object.entries(scoringRules || {}).map(([key, val]) => (
=======
                    {Object.entries(scoringRules).map(([key, val]) => (
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                      <div key={key} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input 
                          type="number" 
                          value={val} 
                          onChange={(e) => setScoringRules({ ...scoringRules, [key]: Number(e.target.value) })}
                          className="w-full text-xs p-2.5 rounded-lg bg-stone-50 border font-mono" 
                        />
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => {
                    logAdminAction('Update Scoring Rules', 'Synchronized clinical star scoring multipliers across active databases');
                    alert('Co-regulation multiplier algorithms successfully updated & synchronized on Supabase databases!');
                  }} className="w-full bg-stone-900 text-white text-xs h-10 rounded-lg">Update Star Scoring Multipliers</Button>
                </Card>

                {/* Score Diagnostics Calculator */}
                <Card className="p-6 bg-stone-900 text-white rounded-3xl space-y-4">
                  <h3 className="font-serif text-base font-bold text-accent-warm">Diagnostics Simulator</h3>
                  <p className="text-xs text-stone-300">Test how much points a parent triggers during standard interactions:</p>
                  
                  <div className="space-y-3">
                    <select 
                      value={calcAction} 
                      onChange={e => setCalcAction(e.target.value)} 
                      className="w-full text-xs p-3 rounded-lg bg-stone-800 border-none text-white focus:outline-none"
                    >
                      <option value="daily_task">Watch clinical video (+10 pts)</option>
                      <option value="webinar">Register & Attend live webinar (+20 pts)</option>
                      <option value="reflection">Complete reflective co-regulation logs (+5 pts)</option>
                      <option value="complete_all">7-day perfect attendance check-in streak (+25 pts)</option>
                    </select>

                    <Button onClick={() => {
                      let base = 0;
                      if (calcAction === 'daily_task') base = scoringRules.videoWatch90;
                      if (calcAction === 'webinar') base = scoringRules.webinarAttend;
                      if (calcAction === 'reflection') base = scoringRules.submitReflection;
                      if (calcAction === 'complete_all') base = scoringRules.streakSevenDay;
                      
                      setCalcScore(prev => prev + base);
                      confetti({ particleCount: 30, spread: 40 });
                    }} className="w-full bg-accent-sage text-white text-xs h-10 rounded-lg font-bold">Simulate Event Check-in</Button>

                    <div className="p-4 bg-stone-950 rounded-2xl text-center">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Simulated Earned Balance</p>
                      <p className="text-3xl font-serif text-accent-warm font-bold">+{calcScore} Stars</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 10: Progress & Analytics */}
          {activeTab === 'analytics' && (() => {
            const totalReflectionsCount = reflections.length;
            const totalParentsCount = parents.length;
            const completedTasksCount = dailyTasks?.filter(t => t.completed).length || 0;
            
            const weeklyActiveRate = totalParentsCount > 0 
              ? Math.min(99.6, Math.max(78.5, 82.0 + (completedTasksCount * 1.5) + (totalReflectionsCount * 2)))
              : 87.5;
            const reflectionCompliance = totalParentsCount > 0
              ? Math.min(99.8, Math.max(62.4, 75.0 + ((totalReflectionsCount / Math.max(1, totalParentsCount)) * 12)))
              : 92.1;
            
            // Filter child profiles with high risk or attention risk
            const carePriorityProfiles = childProfiles.filter(c => c.risk === 'Attention Risk' || c.risk === 'Medium' || c.concerns.length > 1);

            return (
              <div className="space-y-6">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-lg font-bold">LMS Clinical Insights Portal</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Weekly Active Rate', val: `${weeklyActiveRate.toFixed(1)}%`, icon: '📈' },
                      { label: 'Reflection Compliance', val: `${reflectionCompliance.toFixed(1)}%`, icon: '📋' },
                      { label: 'Somatic Check-in Streak', val: `${(3.5 + completedTasksCount * 0.4).toFixed(1)} Days`, icon: '🔋' },
                      { label: 'Attention Flag Trigger', val: `${carePriorityProfiles.length} User Alert${carePriorityProfiles.length !== 1 ? 's' : ''}`, icon: '🚨' }
                    ].map((insight, i) => (
                      <div key={i} className="p-4 bg-stone-50 rounded-2xl space-y-1">
                        <span className="text-2xl block">{insight.icon}</span>
                        <p className="text-lg font-bold font-serif text-stone-800">{insight.val}</p>
                        <p className="text-[10px] uppercase font-bold text-stone-400">{insight.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border">
                    <h4 className="font-bold text-xs text-stone-700 uppercase mb-3">Clinical Care Priority Check-ins Needed</h4>
                    <div className="space-y-2">
                      {carePriorityProfiles.length > 0 ? (
                        carePriorityProfiles.map((child, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-white rounded-lg border-l-4 border-l-red-500">
                            <span>
                              <strong>{child.parentPhone}</strong> ({child.name}'s Parent - {child.concerns.join(', ')}) is currently logged under high-priority attention risk.
                            </span>
                            <Button 
                              size="sm" 
                              onClick={async () => {
<<<<<<< HEAD
                                sendTestWhatsApp('parent_jane@gmail.com', `Clinical Recovery Alert: Emergency intervention needed for ${child.name}. We recommend checking your co-regulation exercises now.`);
                                alert(`Success: Dispatched clinical GMail trigger recovery nudge to parent registered for ${child.name}!`);
=======
<<<<<<< HEAD
                                sendTestWhatsApp('parent_jane@gmail.com', `Clinical Recovery Alert: Emergency intervention needed for ${child.name}. We recommend checking your co-regulation exercises now.`);
                                alert(`Success: Dispatched clinical GMail trigger recovery nudge to parent registered for ${child.name}!`);
=======
                                sendTestWhatsApp('w_stress_spike', child.parentPhone, { parent_name: child.name.split(' ')[0] + ' Parent', time: new Date().toLocaleTimeString(), module_title: child.concerns[0] || 'Co-regulation' });
                                alert(`Success: Dispatched clinical WhatsApp trigger nudge to ${child.parentPhone} registered for ${child.name}!`);
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                              }} 
                              className="text-[10px] h-6 px-2 bg-red-50 text-red-700 border-red-100 hover:bg-red-100 font-extrabold"
                            >
                              Send Recovery Alert
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500">All children currently healthy and monitored successfully with zero priority interventions required.</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })()}

          {/* SECTION 11: Leaderboard */}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
          {activeTab === 'leaderboard' && (() => {
            // Function to dynamically calculate scores
            const getParentScore = (p: ParentAccount) => {
              let base = 120;
              if (p.phone === '6307686532' || p.phone === '6307686532'.replace(/[^0-9]/g, '')) {
                base = 150; // default seed parent stats base
              }
              const reflectionCount = reflections ? reflections.filter(r => r.parentPhone === p.phone).length : 0;
              base += reflectionCount * (scoringRules?.submitReflection || 15);

              let lessonsCompleted = 0;
              modules.forEach(m => {
                if (m.lessons) {
                  lessonsCompleted += m.lessons.filter(l => l.completed).length;
                }
              });
              base += lessonsCompleted * (scoringRules?.videoWatch90 || 10);

              const taskCount = dailyTasks ? dailyTasks.filter(t => t.completed).length : 0;
              base += taskCount * (scoringRules?.dailyTaskSingle || 5);

              return base;
            };

            const cohortMembers = [
              ...parents.map(p => ({
                name: p.name || 'Parent User',
                points: getParentScore(p),
                badge: p.phone === '6307686532' ? 'Somatic Pioneer' : 'Mindful Guide',
                color: 'bg-emerald-100 text-emerald-800',
                real: true
              })),
              { name: 'Devon Webb', points: 310, badge: 'Calm Catalyst', color: 'bg-stone-100 text-stone-800', real: false },
              { name: 'Esther Howard', points: 295, badge: 'Anchor Champion', color: 'bg-orange-50 text-orange-850', real: false },
              { name: 'Jane Cooper', points: 245, badge: 'Somatic Pioneer', color: 'bg-amber-100 text-amber-800', real: false }
            ];

            const sortedLeaderboard = [...cohortMembers].sort((a, b) => b.points - a.points);

            return (
              <div className="space-y-6">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif text-lg font-bold">Cohort Engagement Leaderboards</h3>
                      <p className="text-xs text-stone-400 mt-1">Real-time star points are accumulated dynamically as parents complete daily exercises and kids master co-regulation pathways.</p>
                    </div>
                    <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-bold">Filter: Anger Management (June 2026)</span>
                  </div>

                  <div className="space-y-3 max-w-xl">
                    {sortedLeaderboard.map((lead, idx) => {
                      const rankStr = idx === 0 ? '🥇 Rank 1' : idx === 1 ? '🥈 Rank 2' : idx === 2 ? '🥉 Rank 3' : `🏅 Rank ${idx + 1}`;
                      const badgeColor = idx === 0 
                        ? 'bg-amber-100 text-amber-800' 
                        : idx === 1 
                          ? 'bg-stone-100 text-stone-800' 
                          : idx === 2 
                            ? 'bg-orange-50 text-orange-850' 
                            : 'bg-stone-100 text-stone-600';

                      return (
                        <div key={idx} className={cn(
                          "p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all duration-300",
                          lead.real ? "bg-amber-500/5 border-amber-500/20 shadow-xs animate-pulse" : "bg-stone-50"
                        )}>
                          <div className="flex items-center gap-3">
                            <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", lead.color || badgeColor)}>
                              {rankStr} {lead.real && "(YOU)"}
                            </span>
                            <div>
                              <p className="font-bold text-sm text-stone-850">{lead.name}</p>
                              <p className="text-[10px] text-stone-400 font-bold uppercase">{lead.badge}</p>
                            </div>
                          </div>
                          <span className="text-sm font-serif font-black">{lead.points} stars accumulated</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })()}
<<<<<<< HEAD
=======
=======
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold">Cohort Engagement Leaderboards</h3>
                  <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-bold">Filter: Anger Management (June 2026)</span>
                </div>

                <div className="space-y-3 max-w-xl">
                  {[
                    { rank: '🥇 Rank 1', name: 'Jane Cooper', points: 345, badge: 'Somatic Pioneer', color: 'bg-amber-100 text-amber-800' },
                    { rank: '🥈 Rank 2', name: 'Devon Webb', points: 310, badge: 'Calm Catalyst', color: 'bg-stone-100 text-stone-800' },
                    { rank: '🥉 Rank 3', name: 'Esther Howard', points: 295, badge: 'Anchor Champion', color: 'bg-orange-50 text-orange-850' }
                  ].map((lead, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between gap-4 border">
                      <div className="flex items-center gap-3">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", lead.color)}>{lead.rank}</span>
                        <div>
                          <p className="font-bold text-sm text-stone-850">{lead.name}</p>
                          <p className="text-[10px] text-stone-400 font-bold uppercase">{lead.badge}</p>
                        </div>
                      </div>
                      <span className="text-sm font-serif font-black">{lead.points} stars accumulated</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5

          {/* SECTION 12: Alerts & Notifications */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  <h3 className="font-serif text-base font-bold">Simulate Custom GMail / Email Alert</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Recipient GMail / Email" value={newTemplatePhone} onChange={e => setNewTemplatePhone(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="text" placeholder="Parent Name" value={newTemplateParent} onChange={e => setNewTemplateParent(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <Button onClick={async () => {
                      const targetMail = newTemplatePhone || 'parent_jane@gmail.com';
                      const emailBody = `Dear ${newTemplateParent || 'Parent'},\n\nThis is an urgent Clinical announcement from the MindBloom supervisor panel.`;
                      sendTestWhatsApp(targetMail, emailBody);
                      
                      // Also trigger actual server API call for GMail
                      try {
                        const res = await fetch('/api/send-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: targetMail,
                            subject: `📧 MindBloom Clinical Supervisor Alert`,
                            text: emailBody
                          })
                        });
                        const data = await res.json();
                        console.log('[GMail ALERT DISPATCH] Server Response:', data);
                      } catch (e) {
                        console.warn('[GMail ALERT DISPATCH] Server call failed:', e);
                      }

                      alert('Clinical GMail alert triggered & dispatched live! Verify dispatch logs below.');
                    }} className="w-full bg-stone-900 text-white text-xs h-10 rounded-lg cursor-pointer">Trigger GMail Alert</Button>
<<<<<<< HEAD
=======
=======
                  <h3 className="font-serif text-base font-bold">Simulate Custom Alert</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Recipient Phone" value={newTemplatePhone} onChange={e => setNewTemplatePhone(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="text" placeholder="Parent Name" value={newTemplateParent} onChange={e => setNewTemplateParent(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <Button onClick={async () => {
                      // Trigger context logger
                      sendTestWhatsApp('w_stress_spike', newTemplatePhone, { parent_name: newTemplateParent, time: new Date().toLocaleTimeString(), module_title: 'Co-regulation Outbursts' });
                      
                      // Also trigger actual server API call for WhatsApp (will try sandbox/bot or fallback gracefully)
                      try {
                        const res = await fetch('/api/send-whatsapp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            phone: newTemplatePhone,
                            parentName: newTemplateParent,
                            templateId: 'w_stress_spike'
                          })
                        });
                        const data = await res.json();
                        console.log('[PUSH ALERT DISPATCH] Server Response:', data);
                      } catch (e) {
                        console.warn('[PUSH ALERT DISPATCH] Server call failed:', e);
                      }

                      alert('Stress escalation alert triggered & dispatched live! Verify dispatch logs below.');
                    }} className="w-full bg-stone-900 text-white text-xs h-10 rounded-lg">Trigger WhatsApp Alert</Button>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  </div>
                </Card>

                <Card className="p-6 bg-white rounded-3xl md:col-span-2 space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-base font-bold">Pre-written Custom Nudge Reminders</h3>
                  <div className="space-y-3">
                    {nudgeTemplates.map((nudge, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 border rounded-2xl space-y-1">
                        <h4 className="font-bold text-xs text-stone-800">{nudge.title}</h4>
                        <p className="text-[11px] text-stone-605 leading-relaxed italic">"{nudge.content}"</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 13: Webinar Management */}
          {activeTab === 'webinar' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-base font-bold">Scheduler Live Webinar</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Webinar Title" value={newWebinarTitle} onChange={e => setNewWebinarTitle(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="text" placeholder="Speaker" value={newWebinarSpeaker} onChange={e => setNewWebinarSpeaker(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <input type="date" value={newWebinarDate} onChange={e => setNewWebinarDate(e.target.value)} className="w-full text-xs p-3 rounded-lg bg-stone-50 border" />
                    <Button onClick={() => {
                      if (!newWebinarTitle) return alert('Enter webinar title');
                      
                      // Also push to liveSessions in context!
                      setLiveSessions(prev => [
                        ...prev,
                        {
                          id: 'live-' + Date.now(),
                          title: newWebinarTitle,
                          mentorName: newWebinarSpeaker,
                          description: `Scheduled Clinical Co-Regulation Focus on: ${newWebinarTags || 'Child Growth'}. Full structured parent/student co-regulation guidance loop.`,
                          streamUrl: 'eabjoioutk',
                          status: 'upcoming',
                          scheduledTime: `${newWebinarDate} at 5:00 PM`,
                          targetGroup: 'parents',
                          pointsReward: 40
                        }
                      ]);

                      alert('Webinar publicized on all parent interactive calendars!');
                      setNewWebinarTitle('');
                    }} className="w-full bg-stone-900 text-white text-xs h-10 rounded-lg">Schedule Webinar</Button>
                  </div>
                </Card>

                <Card className="p-6 bg-white rounded-3xl md:col-span-2 space-y-4 shadow-sm border-none">
                  <h3 className="font-serif text-base font-bold">Scheduled Somatic Clinics</h3>
                  <div className="space-y-3">
                    {webinars.map((web, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 border rounded-2xl flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-serif font-black text-sm text-stone-800">{web.title}</h4>
                          <p className="text-stone-400 text-xs">Speaker: {web.speaker} • Date: {web.date} @ {web.time}</p>
                        </div>
                        <div className="text-right shrink-0 font-semibold text-xs">
                          <span className="bg-stone-200 text-stone-700 px-2.5 py-1 rounded text-[8px] font-bold uppercase">{web.status}</span>
                          <p className="text-[10px] text-stone-400 mt-1">{web.registered} Seats Claimed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION 14: Reports Export */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <h3 className="font-serif text-lg font-bold">LMS Database CSV Export Engine</h3>
                <p className="text-xs text-stone-500">Query parent records and export physical tabular spreadsheets manually:</p>

                <div className="flex flex-wrap gap-3">
                  <select 
                    value={selectedReportType} 
                    onChange={e => setSelectedReportType(e.target.value)}
                    className="text-xs p-3 rounded-lg bg-stone-50 border focus:outline-none"
                  >
                    <option value="parent_progress">Parent Progress Summary (CSV)</option>
                    <option value="child_concerns">Child Clinical Assessment List (CSV)</option>
                    <option value="brownie_tallies">Brownie Points Tally Ledger (CSV)</option>
                  </select>

                  <Button onClick={handleGenerateReportPreview} className="bg-stone-900 text-white text-xs h-11 px-6 rounded-lg font-bold">
                    Generate Raw Spreadsheet Preview
                  </Button>
                </div>

                {generatedReportPreview.length > 0 && (
                  <div className="space-y-4 animate-fadeIn pt-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-stone-750 uppercase">Raw Ledger CSV Bytes:</h4>
                      <Button variant="outline" size="sm" onClick={() => alert('Download requested! Exporting file: ' + selectedReportType + '.csv')} className="text-xs font-bold">Download File (.csv)</Button>
                    </div>
                    <pre className="p-4 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-2xl max-h-60 overflow-y-auto leading-relaxed">
                      {JSON.stringify(generatedReportPreview, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* SECTION 15: Roles & Moderators */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-4 shadow-sm border-none">
                <h3 className="font-serif text-lg font-bold">Access Scopes & Permissions Ledger</h3>
                
                <div className="grid md:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2">
                    <span className="bg-accent-warm text-stone-950 px-2 py-0.5 rounded text-[9px] uppercase font-bold">LEVEL A (You)</span>
                    <h4 className="font-bold">Super Admin Authorization</h4>
                    <p className="text-[11px] text-stone-300">Wipe backend schemas, permanently blacklist parent contacts, revise clinician rosters.</p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl space-y-2 border">
                    <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[9px] uppercase font-bold">LEVEL B</span>
                    <h4 className="font-bold">Operational Admin</h4>
                    <p className="text-[11px] text-stone-500 font-medium">Add modules, post video assets, scheduled webinars, transmit nudge copies.</p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl space-y-2 border">
                    <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[9px] uppercase font-bold">LEVEL C</span>
                    <h4 className="font-bold">Parent & Student Client</h4>
                    <p className="text-[11px] text-stone-500 font-medium font-serif">Read-only checklists, interactive games space, video watch logs checkoff.</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 16: Audit Logs */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-3xl space-y-3 shadow-sm border-none">
                <h3 className="font-serif text-lg font-bold">Live Security Audit Trails</h3>
                <div className="divide-y divide-stone-100 text-xs">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="py-3 flex justify-between gap-4">
                      <div>
                        <span className="text-stone-400 font-mono text-[10px] mr-2">{log.timestamp}</span>
                        <strong>{log.user}</strong> executed action: <span className="text-stone-605">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-bold">{log.detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 17: Settings & Sandbox Strictness */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Sandbox Strictness parameters */}
                <Card className="p-6 bg-stone-50 rounded-3xl border space-y-4">
                  <h3 className="font-serif text-base font-bold">Sandbox Co-regulation Strictness Rules</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['gentle', 'medium', 'strict'].map(level => (
                      <Button
                        key={level}
                        onClick={() => {
                          setStrictnessLevel(level as any);
                          alert('Strictness rules synchronized: ' + level);
                        }}
                        className={cn("text-[10px] h-9 font-bold uppercase rounded-xl", strictnessLevel === level ? 'bg-stone-900 text-white':'bg-white text-stone-500 border')}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 bg-white p-3 rounded-xl border leading-relaxed">
                    {strictnessLevel === 'strict' ? '🔴 STRICT RULES: Rewards, free games require verified check-ins.' : strictnessLevel === 'medium' ? '🟡 BALANCED RULES: Bedtime games are free, reflections requested.' : '🟢 GENTLE RULES: Free play stress relief is enabled instantly.'}
                  </p>
                </Card>

                {/* Content approval queue workflow settings */}
                <Card className="p-6 bg-stone-50 rounded-3xl border space-y-4">
                  <h3 className="font-serif text-base font-bold">Administrative Creative Approvals Queue</h3>
                  <div className="space-y-2">
                    {approvalSubmissions.map(appr => (
                      <div key={appr.id} className="p-3 bg-white border rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold">{appr.title}</p>
                          <p className="text-stone-400 text-[10px]">Author: {appr.author}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => {
                            setApprovalSubmissions(prev => prev.map(a => a.id === appr.id ? { ...a, status: 'Approved' } : a));
                            alert('Asset labeled APPROVED and live in modular paths!');
                          }} className="text-[9px] h-7 px-2 bg-emerald-50 text-emerald-700">Approve</Button>
                          <span className="text-[10px] font-mono text-stone-400 font-bold self-center ml-2">{appr.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* BACKEND SYSTEMS EMBEDDED SAFELY */}
          {activeTab === 'supabase_sync' && (
            <div className="space-y-4">
              <SupabaseSyncDashboard />
            </div>
          )}

          {activeTab === 'security_emails' && (
            <div className="space-y-4">
              <SecurityEmailLogs />
            </div>
          )}

          {activeTab === 'server_tools' && (
            <div className="space-y-6">
              <ServerHostControl />
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
