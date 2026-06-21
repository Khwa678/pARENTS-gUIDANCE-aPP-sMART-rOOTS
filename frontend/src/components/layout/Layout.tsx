import React from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, CheckSquare, BarChart2, User, Bell, Menu, Settings, TrendingUp, Sparkles, Check, CheckCircle2, Trash2, Flame, Trophy, Users, Wifi, BellOff, MessageSquare, Volume2, VolumeX, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useApp } from '@/context/AppContext';
import Login from '@/pages/Login';
<<<<<<< HEAD
=======
import PeriodicReflectionModal from '@/components/live/PeriodicReflectionModal';
import InteractiveExplainerPop from '@/components/live/InteractiveExplainerPop';
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logoutUser, isStudentMode, setIsStudentMode, notificationLogs } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const [isVerifyingParent, setIsVerifyingParent] = React.useState(false);
  const [verificationPassword, setVerificationPassword] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);
<<<<<<< HEAD
  const [verificationTitle, setVerificationTitle] = React.useState('Verify Parent Control');
  const [verificationDesc, setVerificationDesc] = React.useState('Please confirm your registered parent account password to switch back to parent dashboards.');
  const [verificationTargetPassword, setVerificationTargetPassword] = React.useState('password');
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31

  // Notifications Interactive States
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'alerts' | 'simulator'>('alerts');
  const [localReadIds, setLocalReadIds] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // TTS (Text to Speech) State for automated background audio
  const [isSpokenMuted, setIsSpokenMuted] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_ai_spoken_muted');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const speakText = React.useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      // Force loading voices in some browsers
      window.speechSynthesis.getVoices();
      window.speechSynthesis.cancel();
      
      const cleanedText = text
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
        .replace(/https?:\/\/\S+/gi, 'link')
        .trim();

      if (!cleanedText) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en-') && v.name.includes('Natural')) ||
                       voices.find(v => v.lang.startsWith('en-'));
      if (engVoice) {
        utterance.voice = engVoice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech engine error:', error);
    }
  }, []);

  const toggleSpokenMute = () => {
    const newVal = !isSpokenMuted;
    setIsSpokenMuted(newVal);
    localStorage.setItem('parent_guidance_ai_spoken_muted', JSON.stringify(newVal));
    if (newVal) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    } else {
      speakText("AI Voice notifications activated.");
    }
  };

  const spokenAlertIdsRef = React.useRef<Set<string>>(new Set());
  const isFirstAlertLoadRef = React.useRef(true);

  const [customNotifications, setCustomNotifications] = React.useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_custom_notifs');
      if (saved) return JSON.parse(saved);
    } catch {}
    
    // Initial high-quality seed notifications
    return [
      {
        id: 'seed-1',
        title: '🌱 Custom Calm Exercise Synchronized',
        payload: 'Little John has finished the calming exercise: "Cozy Chimes" inside Student Calm Space. Streak updated to 5 days!',
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        type: 'success',
        category: 'student',
      },
      {
        id: 'seed-2',
        title: '📅 Weekly Reparenting Circle',
        payload: 'Class starting in 15 minutes: "De-escalation solutions for parenting high-tension moments" led by Group Mentor Amanda.',
        timestamp: new Date(Date.now() - 25 * 60 * 1050).toISOString(),
        type: 'live',
        category: 'live',
      },
      {
        id: 'seed-3',
        title: '🏆 Achievement Level Acquired',
        payload: 'Great job! You earned the "Reflective Sage" badge for maintaining consistent journaling.',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        type: 'award',
        category: 'milestone',
      }
    ];
  });

  // Map AppContext background notification logs
  const mappedLogs = React.useMemo(() => {
    if (!notificationLogs) return [];
    return notificationLogs.map((log: any) => {
      const rawTitle = log.templateName || log.template || 'System SMS Dispatch Link';
      const rawPayload = log.payload || log.snippet || log.body || '';

      let title = rawTitle;
      let payload = rawPayload;
      let channel = 'SMS/WhatsApp Relay';
      let iconSymbol = '💬';
      let channelColorClass = 'bg-[#25D366]/10 text-[#25D366]';

      // Advanced semantic matching to describe each notification in a good way
      const titleLower = rawTitle.toLowerCase();
      if (titleLower.includes('onboarding') || titleLower.includes('welcome') || titleLower.includes('sovereign')) {
        title = '🌱 Portal Access & Onboarding Key';
        channel = 'Onboarding Gate';
        iconSymbol = '🌱';
        channelColorClass = 'bg-emerald-100 text-emerald-800';
      } else if (titleLower.includes('week') || titleLower.includes('unlock') || titleLower.includes('module')) {
        title = '🔓 Weekly Core Framework Unlocked';
        channel = 'Content Gateway';
        iconSymbol = '🔓';
        channelColorClass = 'bg-indigo-100 text-indigo-800';
      } else if (titleLower.includes('stress') || titleLower.includes('spike') || titleLower.includes('escalation')) {
        title = '🚨 Co-Regulation Stress Threshold Trigger';
        channel = 'Real-Time Telemetry';
        iconSymbol = '🚨';
        channelColorClass = 'bg-red-100 text-red-800';
      } else if (titleLower.includes('broadcast') || titleLower.includes('live session') || titleLower.includes('webinar')) {
        title = '🎙️ Live Group Consultation Broadcast';
        channel = 'Live Broadcaster';
        iconSymbol = '🎙️';
        channelColorClass = 'bg-amber-100 text-amber-800';
      } else if (titleLower.includes('reminder') || titleLower.includes('session') || titleLower.includes('appointment')) {
        title = '📅 Consultation Session Prompt';
        channel = 'Smart Scheduler';
        iconSymbol = '📅';
        channelColorClass = 'bg-blue-100 text-blue-800';
      } else if (titleLower.includes('telegram')) {
        title = '🤖 Telegram Community Sync Alert';
        channel = 'Telegram Bot API';
        iconSymbol = '🤖';
        channelColorClass = 'bg-sky-100 text-sky-800';
      } else if (titleLower.includes('clinician') || titleLower.includes('helpdesk') || titleLower.includes('support')) {
        title = '✉️ Expert Clinician Advisory Response';
        channel = 'Expert Helpdesk';
        iconSymbol = '✉️';
        channelColorClass = 'bg-[#009473]/10 text-[#009473]';
      } else if (titleLower.includes('security') || titleLower.includes('verification') || titleLower.includes('handshake')) {
        title = '🔑 Gateway Authentication Pin';
        channel = 'Auth Handshake';
        iconSymbol = '🔑';
        channelColorClass = 'bg-stone-200 text-stone-800';
      } else if (titleLower.includes('privacy') || titleLower.includes('audit') || titleLower.includes('compliance')) {
        title = '🛡️ HIPAA Audit Security Handshake';
        channel = 'HIPAA Security';
        iconSymbol = '🛡️';
        channelColorClass = 'bg-violet-100 text-violet-800';
      } else if (titleLower.includes('terminated') || titleLower.includes('video room') || titleLower.includes('finalized')) {
        title = '📹 Co-Regulation Video Completed';
        channel = 'Video Room Webhook';
        iconSymbol = '📹';
        channelColorClass = 'bg-teal-100 text-teal-800';
      }

      // Beautify recipient info 
      const recipientLabel = log.recipient 
        ? (log.recipient.startsWith('+') ? `To: +${log.recipient.replace(/\D/g, "")}` : `To: ${log.recipient}`)
        : '';

      return {
        id: log.id,
        title,
        payload,
        recipient: recipientLabel,
        channel,
        iconSymbol,
        channelColorClass,
        timestamp: log.timestamp,
        type: log.status === 'failed' ? 'error' : 'whatsapp',
        category: 'system',
        actionUrl: log.waLink || undefined
      };
    });
  }, [notificationLogs]);

  // Combine they all
  const allNotifications = React.useMemo(() => {
    return [...customNotifications, ...mappedLogs].sort((a: any, b: any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [customNotifications, mappedLogs]);

  // Auto-speak new incoming notifications if unmuted
  React.useEffect(() => {
    if (!allNotifications || allNotifications.length === 0) return;

    if (isFirstAlertLoadRef.current) {
      // Mark all existing during initial hydration as "seen" to avoid sudden speech
      allNotifications.forEach((n: any) => spokenAlertIdsRef.current.add(n.id));
      isFirstAlertLoadRef.current = false;
      return;
    }

    // Identify newly added notification items that we haven't seen in this session
    const freshAlerts = allNotifications.filter((n: any) => !spokenAlertIdsRef.current.has(n.id));
    
    if (freshAlerts.length > 0) {
      // Record them as seen
      freshAlerts.forEach((n: any) => spokenAlertIdsRef.current.add(n.id));

      // Speak the most recent one if auto-audio play is unmuted
      const newest = freshAlerts[0];
      if (!isSpokenMuted) {
        const announcement = `New alert. ${newest.title}. ${newest.payload}`;
        speakText(announcement);
      }
    }
  }, [allNotifications, isSpokenMuted, speakText]);

  // Count unread
  const unreadCount = React.useMemo(() => {
    return allNotifications.filter((n: any) => !localReadIds.includes(n.id)).length;
  }, [allNotifications, localReadIds]);

  const handleMarkAllRead = () => {
    const allIds = allNotifications.map((n: any) => n.id);
    setLocalReadIds(allIds);
    localStorage.setItem('parent_guidance_read_notifs', JSON.stringify(allIds));
  };

  const handleMarkItemRead = (id: string) => {
    if (!localReadIds.includes(id)) {
      const updated = [...localReadIds, id];
      setLocalReadIds(updated);
      localStorage.setItem('parent_guidance_read_notifs', JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    setCustomNotifications([]);
    localStorage.setItem('parent_guidance_custom_notifs', JSON.stringify([]));
    // Also mark mapped logs as read so badge goes down
    const allIds = allNotifications.map((n: any) => n.id);
    setLocalReadIds(allIds);
    localStorage.setItem('parent_guidance_read_notifs', JSON.stringify(allIds));
  };

  const handleSimulateAlert = (title: string, payload: string, type: 'success' | 'live' | 'award' | 'info' | 'error') => {
    const newAlert = {
      id: `sim-${Date.now()}`,
      title,
      payload,
      timestamp: new Date().toISOString(),
      type,
      category: type === 'success' || type === 'error' ? 'student' : (type === 'live' ? 'live' : 'system')
    };
    
    setCustomNotifications(prev => {
      const updated = [newAlert, ...prev];
      localStorage.setItem('parent_guidance_custom_notifs', JSON.stringify(updated));
      return updated;
    });

    // Automatically highlight alerts tab
    setActiveTab('alerts');
  };

<<<<<<< HEAD
  const promptVerification = (title: string, desc: string, targetPassword: string, onSuccess: () => void) => {
    setVerificationTitle(title);
    setVerificationDesc(desc);
    setVerificationTargetPassword(targetPassword);
    setIsVerifyingParent(true);
    setVerificationPassword('');
    setVerificationError('');
    setPendingAction(() => onSuccess);
=======
  const promptParentAuthentication = (onSuccess: () => void) => {
    if (currentUser && !currentUser.isStudent && !currentUser.isMentor) {
      setIsVerifyingParent(true);
      setVerificationPassword('');
      setVerificationError('');
      setPendingAction(() => onSuccess);
    } else {
      onSuccess();
    }
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
  };

  const handleToggleStudentMode = () => {
    if (isStudentMode) {
<<<<<<< HEAD
      promptVerification(
        'Verify Parent Control', 
        'Please confirm your registered parent account password to switch back to parent dashboards.', 
        currentUser?.password || 'password', 
        () => {
          setIsStudentMode(false);
          navigate('/');
        }
      );
    } else {
      promptVerification(
        'Verify Student Control', 
        'Please confirm child credentials with password "password" to enter Kids Space.', 
        'password', 
        () => {
          setIsStudentMode(true);
          navigate('/');
        }
      );
=======
      promptParentAuthentication(() => {
        setIsStudentMode(false);
        navigate('/');
      });
    } else {
      setIsStudentMode(true);
      navigate('/');
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
    }
  };

  // If not logged in, show the login gate!
  if (!currentUser) {
    return <Login />;
  }

  // Dynamic navigation items
  let NAV_ITEMS = [];
  if (currentUser?.isMentor) {
    NAV_ITEMS = [
      { icon: Home, label: 'Mentor Hub', path: '/' },
      { icon: User, label: 'My Profile', path: '/profile' },
    ];
  } else if (isStudentMode || currentUser?.isStudent) {
    NAV_ITEMS = [
      { icon: Home, label: 'Student Space', path: '/' },
    ];
  } else {
    NAV_ITEMS = [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: BookOpen, label: 'Learn', path: '/learn' },
      { icon: CheckSquare, label: 'Assignments', path: '/assignments' },
<<<<<<< HEAD
=======
      { icon: Award, label: 'Milestones', path: '/milestones' },
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
      { icon: BarChart2, label: 'Progress', path: '/progress' },
      { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
      { icon: User, label: 'Profile', path: '/profile' },
    ];
  }

  // If the logged in user is admin, append Admin Panel to nav
  if (!isStudentMode && currentUser?.isAdmin) {
    NAV_ITEMS.push({ icon: Settings, label: 'Admin Panel', path: '/admin' });
  }

  // Calculate user initials
  const initials = currentUser.name
    ? currentUser.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : 'P';

  const userCohort = currentUser.isAdmin 
    ? 'System Superuser' 
    : currentUser.batchCohort || 'Week 2 Enthusiast';

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-white sticky top-0 h-screen">
        <div className="p-6 border-b border-border/40">
          <h1 className="text-2xl font-serif text-accent-sage tracking-tight">Parent Guidance</h1>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Nurturing Transformation</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-accent-sage/10 text-accent-sage font-medium" 
                  : "text-stone-500 hover:bg-secondary hover:text-stone-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-accent-sage" : "text-stone-400 group-hover:text-stone-600")} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-border/40 space-y-3">
          {/* Student Mode Switch Button */}
          {(!currentUser?.isMentor && !currentUser?.isStudent) && (
            <button 
              onClick={handleToggleStudentMode}
              className={cn(
                "flex items-center justify-center gap-2 h-10 w-full rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm border",
                isStudentMode 
                  ? "bg-stone-900 text-white border-stone-950 hover:bg-stone-850" 
                  : "bg-secondary text-accent-sage border-accent-sage/20 hover:bg-secondary/85"
              )}
            >
              {isStudentMode ? "🔑 Parent Mode" : "🚀 Student Space"}
            </button>
          )}

          {/* Quick toggle link to view Admin simulation mode */}
          {!currentUser.isAdmin && !isStudentMode && (
            <Link 
              to="/admin" 
              className="flex items-center justify-center gap-2 h-10 w-full rounded-xl bg-accent-warm/10 text-accent-warm hover:bg-accent-warm/20 font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <Settings className="w-3.5 h-3.5" /> Toggle Admin Mode
            </Link>
          )}

          <div className="flex items-center gap-3 p-2 bg-secondary/40 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-accent-warm/20 flex items-center justify-center text-accent-warm font-bold text-xs shrink-0 select-none">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-stone-500 truncate">{userCohort}</p>
            </div>
            <button 
              onClick={logoutUser}
              className="text-[10px] text-stone-400 hover:text-red-500 font-bold uppercase transition-colors shrink-0 pl-1"
              title="Logout"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-screen pb-20 lg:pb-0 min-w-0">
        {/* Top Header (Desktop & Mobile) */}
        <header className="sticky top-0 z-30 w-full border-b border-stone-100 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4 lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger render={
                  <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                } />
                <SheetContent side="left" className="w-[85%] max-w-[320px] p-0 bg-white shadow-2xl">
                  <div className="flex flex-col h-full bg-white text-stone-900 border-r border-stone-200">
                    <div className="p-6 border-b border-stone-100 bg-white">
                      <h1 className="text-2xl font-serif text-accent-sage tracking-tight">Parent Guidance</h1>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">Nurturing Transformation</p>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2 bg-white overflow-y-auto">
                      {NAV_ITEMS.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            isActive 
                              ? "bg-accent-sage/10 text-accent-sage font-medium" 
                              : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 text-stone-400" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </NavLink>
                      ))}
                    </nav>

                    <div className="p-6 mt-auto border-t border-stone-100 bg-stone-50 space-y-3">
                      {(!currentUser?.isMentor && !currentUser?.isStudent) && (
                        <button 
                          onClick={() => {
                            handleToggleStudentMode();
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-center gap-2 h-10 w-full rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm border",
                            isStudentMode 
                              ? "bg-stone-900 text-white border-stone-950 hover:bg-stone-850" 
                              : "bg-white text-accent-sage border-accent-sage/20 hover:bg-stone-50"
                          )}
                        >
                          {isStudentMode ? "🔑 Parent Mode" : "🚀 Student Space"}
                        </button>
                      )}
                      
                      <div className="flex items-center gap-3 p-2 bg-white border border-stone-150 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-accent-warm/20 flex items-center justify-center text-accent-warm font-bold text-xs shrink-0 select-none">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{userCohort}</p>
                        </div>
                        <button 
                          onClick={() => {
                            logoutUser();
                            setIsMobileMenuOpen(false);
                          }} 
                          className="text-[10px] font-bold text-stone-400 hover:text-red-500 uppercase transition-colors shrink-0"
                        >
                          Exit
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-serif text-accent-sage lg:hidden">Parent Guidance</h1>
            </div>

            <div className="hidden lg:block">
              <h2 className="text-lg font-medium text-stone-600">
                {NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Learning'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Elegant Mode Toggle in Header */}
              {(!currentUser?.isMentor && !currentUser?.isStudent) && (
                <div className="bg-stone-100 p-1 rounded-full flex items-center border border-stone-200/60 shadow-inner">
                  <button
                    onClick={() => {
                      if (isStudentMode) {
<<<<<<< HEAD
                        promptVerification(
                          'Verify Parent Control', 
                          'Please confirm your registered parent account password to switch back to parent dashboards.', 
                          currentUser?.password || 'password', 
                          () => {
                            setIsStudentMode(false);
                            navigate('/');
                          }
                        );
=======
                        promptParentAuthentication(() => {
                          setIsStudentMode(false);
                          navigate('/');
                        });
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
                      }
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-250 flex items-center gap-1.5 cursor-pointer",
                      !isStudentMode 
                        ? "bg-stone-900 text-white shadow-sm" 
                        : "text-stone-500 hover:text-stone-850"
                    )}
                  >
                    🌱 Parent Mode
                  </button>
                  <button
                    onClick={() => {
                      if (!isStudentMode) {
<<<<<<< HEAD
                        promptVerification(
                          'Verify Student Control', 
                          'Please confirm child credentials with password "password" to enter Kids Space.', 
                          'password', 
                          () => {
                            setIsStudentMode(true);
                            navigate('/');
                          }
                        );
=======
                        setIsStudentMode(true);
                        navigate('/');
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
                      }
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-250 flex items-center gap-1.5 cursor-pointer",
                      isStudentMode 
                        ? "bg-emerald-600 text-white shadow-sm" 
                        : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    🚀 Kids Space
                  </button>
                </div>
              )}

              {/* Dynamic Notification Bell with custom popover */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={cn(
                    "text-stone-400 hover:text-stone-900 relative rounded-full transition-all duration-200",
                    isNotificationsOpen ? "bg-stone-100 text-stone-900 scale-105" : ""
                  )}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 1] }}
                      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                      className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-red-500 rounded-full border border-white leading-none shadow-sm"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      {/* Invisible backdrop helper to close popover when clicking anywhere else */}
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsNotificationsOpen(false)} 
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-12 z-50 mt-2 w-80 sm:w-[440px] bg-white rounded-[2rem] border border-stone-150 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[550px]"
                      >
                        {/* Header of the Dropdown */}
                        <div className="bg-stone-50 border-b border-stone-100 p-5 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-[#009473] bg-[#009473]/10 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Real-Time Feed
                            </span>
                            <h3 className="text-sm font-serif font-black text-stone-900 flex items-center gap-1.5">
                              MindBloom Alerts {unreadCount > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                            </h3>
                          </div>
                          
                          <div className="flex gap-2">
                            {unreadCount > 0 && (
                              <button 
                                onClick={handleMarkAllRead}
                                className="text-[10px] text-accent-sage hover:text-accent-sage/80 font-bold transition-all underline underline-offset-2 flex items-center gap-1 bg-transparent p-0 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Mark Read
                              </button>
                            )}
                            <button 
                              onClick={handleClearAll}
                              className="text-[10px] text-stone-400 hover:text-red-500 font-bold transition-all flex items-center gap-1 bg-transparent p-0 cursor-pointer"
                              title="Delete all custom alerts"
                            >
                              <Trash2 className="w-3 h-3" /> Clear
                            </button>
                          </div>
                        </div>

                        {/* Modal Navigation Tabs */}
                        <div className="flex border-b border-stone-100 p-2 bg-stone-50/50">
                          <button
                            onClick={() => setActiveTab('alerts')}
                            className={cn(
                              "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                              activeTab === 'alerts' 
                                ? "bg-white text-stone-900 shadow-xs" 
                                : "text-stone-400 hover:text-stone-600"
                            )}
                          >
                            🔔 Active Alerts ({allNotifications.length})
                          </button>
                          <button
                            onClick={() => setActiveTab('simulator')}
                            className={cn(
                              "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                              activeTab === 'simulator' 
                                ? "bg-white text-stone-900 shadow-xs text-amber-600 border border-amber-100" 
                                : "text-stone-400 hover:text-stone-600"
                            )}
                          >
                            🧪 Simulator Panel
                          </button>
                        </div>

                        {/* Audio Speak Controls Strip */}
                        <div className="bg-stone-50/80 border-b border-stone-100 px-5 py-3 flex items-center justify-between text-xs text-stone-600 gap-3">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="shrink-0 text-stone-500 font-serif font-semibold">AI Speech Guide:</span>
                            <span className={cn(
                              "text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase font-mono truncate",
                              isSpokenMuted ? "bg-stone-100 text-stone-500" : "bg-emerald-100 text-emerald-800 animate-pulse"
                            )}>
                              {isSpokenMuted ? 'Muted 🔇' : 'Explains On 🔊'}
                            </span>
                          </div>
                          
                          <button
                            onClick={toggleSpokenMute}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none shrink-0",
                              isSpokenMuted 
                                ? "bg-stone-100 border border-stone-250 hover:bg-stone-200 text-stone-700" 
                                : "bg-[#009473]/10 text-[#009473] hover:bg-[#009473]/20"
                            )}
                          >
                            {isSpokenMuted ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 animate-pulse" /> Speak Alerts
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" /> Mute AI Speech
                              </>
                            )}
                          </button>
                        </div>

                        {/* Tab Content 1: Alerts Screen */}
                        {activeTab === 'alerts' && (
                          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] custom-scrollbar">
                            {allNotifications.length === 0 ? (
                              <div className="p-8 text-center space-y-2">
                                <span className="text-3xl block">📭</span>
                                <h4 className="text-xs font-bold text-stone-850">Your inbox is clear!</h4>
                                <p className="text-[10px] text-stone-500 leading-normal max-w-[250px] mx-auto">
                                  There are no alerts. Complete parenting goals or open the Simulator tab to insert customized events!
                                </p>
                              </div>
                            ) : (
                              allNotifications.map((notif: any) => {
                                const isRead = localReadIds.includes(notif.id);
                                return (
                                  <div 
                                    key={notif.id}
                                    onClick={() => handleMarkItemRead(notif.id)}
                                    className={cn(
                                      "p-3.5 rounded-2xl border transition-all relative group flex gap-3.5 cursor-pointer text-left",
                                      isRead 
                                        ? "bg-white border-stone-100 opacity-75 hover:opacity-100" 
                                        : "bg-emerald-500/5 border-emerald-100/60 ring-1 ring-emerald-500/10"
                                    )}
                                  >
                                    {/* Unread circle pip indicator */}
                                    {!isRead && (
                                      <span className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full" />
                                    )}

                                    {/* Icon category */}
                                    <div className="shrink-0">
                                      {notif.iconSymbol ? (
                                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm", notif.channelColorClass || "bg-stone-100 text-stone-700")}>
                                          {notif.iconSymbol}
                                        </div>
                                      ) : (
                                        <>
                                          {notif.type === 'success' && (
                                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                                              🌱
                                            </div>
                                          )}
                                          {notif.type === 'live' && (
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
                                              🎙️
                                            </div>
                                          )}
                                          {notif.type === 'award' && (
                                            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-sm">
                                              🏆
                                            </div>
                                          )}
                                          {notif.type === 'info' && (
                                            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-sm">
                                              ℹ️
                                            </div>
                                          )}
                                          {notif.type === 'error' && (
                                            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm">
                                              🚨
                                            </div>
                                          )}
                                          {notif.type === 'whatsapp' && (
                                            <div className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] text-sm">
                                              💬
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>

                                    {/* Main Text details */}
                                    <div className="space-y-1.5 pr-4 min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <h4 className="text-xs font-bold text-stone-850 truncate">{notif.title}</h4>
                                        <span className={cn(
                                          "text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase font-mono",
                                          notif.channelColorClass || "bg-stone-100 text-stone-600"
                                        )}>
                                          {notif.channel || "App Notification"}
                                        </span>
                                      </div>
                                      
                                      <p className="text-[10px] text-stone-600 leading-relaxed font-sans line-clamp-3">
                                        {notif.payload}
                                      </p>

                                      {notif.recipient && (
                                        <div className="text-[9px] font-mono text-stone-400 flex items-center gap-1">
                                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                                          {notif.recipient}
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center justify-between pt-1.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-mono text-stone-400">
                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              speakText(`Alert details: ${notif.title}. ${notif.payload}`);
                                            }}
                                            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 transition flex items-center justify-center cursor-pointer"
                                            title="Read this alert aloud"
                                          >
                                            <Volume2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                        
                                        {/* Dynamic CTA button within the notification box */}
                                        {notif.actionUrl ? (
                                          <a 
                                            href={notif.actionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[9px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase px-2 py-1 rounded-lg tracking-wider"
                                          >
                                            📲 WhatsApp SMS
                                          </a>
                                        ) : notif.category === 'student' ? (
                                          <Link 
                                            to="/progress" 
                                            onClick={() => setIsNotificationsOpen(false)}
                                            className="text-[9px] text-[#009473] hover:underline font-bold"
                                          >
                                            View Progress →
                                          </Link>
                                        ) : notif.category === 'live' ? (
                                          <Link 
                                            to="/learn" 
                                            onClick={() => setIsNotificationsOpen(false)}
                                            className="text-[9px] text-indigo-600 hover:underline font-bold"
                                          >
                                            Enter Live Room →
                                          </Link>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                        {/* Tab Content 2: Dynamic Alert Simulator Panel */}
                        {activeTab === 'simulator' && (
                          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[380px] custom-scrollbar">
                            <div className="space-y-1 bg-amber-500/5 border border-amber-200/50 p-4 rounded-2xl">
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                                QA Sandbox Mode
                              </span>
                              <h4 className="text-xs font-bold text-stone-900">Push Simulated Client Alerts</h4>
                              <p className="text-[10px] text-stone-500 leading-normal">
                                Testing reactive flows can be slow. Use this panel to instantly inject and simulate realistic parenting events. Check how the badge and notification list reacts in dry-run mode.
                              </p>
                            </div>

                            <div className="space-y-2.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-1">
                                {isStudentMode ? '💡 STUDENT COMPLIANCE ALERTS' : '💡 PARENT EVENT TEMPLATES'}
                              </label>

                              {isStudentMode ? (
                                // Student Mode Templates
                                <div className="grid gap-2">
                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '🏆 Daily Quest Overachieved!',
                                      'Awesome breathing! Gained +150 Experience points for logging deep breaths today.',
                                      'award'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">🏆</span>
                                    <div>
                                      <p className="font-extrabold">Quest Finished (+150 XP)</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Push a Level-Up notification to kids space</p>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '🎐 Cozy Chimes Theme Unlocked',
                                      'You can now select the Cozy Chimes soundtrack inside your calm space settings tray.',
                                      'success'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">🎐</span>
                                    <div>
                                      <p className="font-extrabold">Sound Theme Gained</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Sound profile status updated</p>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '💬 Message from Mom/Dad',
                                      'Mom sent you a special heart balloon: "Super proud of you for checking your habits today!"',
                                      'info'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">💬</span>
                                    <div>
                                      <p className="font-extrabold">Positive Family Affirmation</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Co-regulation message pop</p>
                                    </div>
                                  </Button>
                                </div>
                              ) : (
                                // Parent Mode Templates
                                <div className="grid gap-2">
                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '⚠️ Heart Stress Spike Detected',
                                      'Little John reported body stress levels peaking (Heart Rate: 110bpm). "Belly Balloon Breaths" session initiated.',
                                      'error'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full animate-pulse"
                                  >
                                    <span className="text-lg">🚨</span>
                                    <div>
                                      <p className="font-extrabold text-red-600">Stress Spike Detected</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Immediate emotional feedback warning</p>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '🎯 Daily Habit Sync Success',
                                      'Little John crossed off the target habit "Fists Release stretch". Calming indicators are stable.',
                                      'success'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">🌱</span>
                                    <div>
                                      <p className="font-extrabold text-emerald-700">Habit Checklist Sync</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Sync complete with child device</p>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '📝 Cognitive Reframing Reflection',
                                      'Your Week 2 Cognitive Reframing journal checklist is ready. Log your family de-escalation check-ins to secure badge points.',
                                      'info'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">ℹ️</span>
                                    <div>
                                      <p className="font-extrabold text-stone-800">Weekly Reflection Ready</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Prompt checklist unlocked to earn badges</p>
                                    </div>
                                  </Button>

                                  <Button
                                    onClick={() => handleSimulateAlert(
                                      '🎙️ Live Group Coaching Starting',
                                      'Coaching circle has opened: "Building emotional regulation strategies without defensive friction." Join stream with Mentor Amanda.',
                                      'live'
                                    )}
                                    variant="outline"
                                    className="justify-start text-[11px] font-bold border-stone-200 hover:bg-stone-50 h-auto p-3 text-left rounded-xl gap-2 w-full"
                                  >
                                    <span className="text-lg">🎙️</span>
                                    <div>
                                      <p className="font-extrabold text-indigo-700">Webinar Live Session</p>
                                      <p className="text-[9px] text-stone-400 font-normal">Live room direct URL link is ready</p>
                                    </div>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer message log */}
                        <div className="bg-stone-50 border-t border-stone-100 p-3.5 text-center">
                          <span className="text-[9.5px] font-semibold text-stone-400 flex items-center justify-center gap-1">
                            <Wifi className="w-2.5 h-2.5 text-emerald-400 shrink-0" /> Stable Sync Status • Client Connection Enforced
                          </span>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Mobile Bottom Navigation Floating Premium Dock */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-stone-200/60 p-2 flex justify-around items-center rounded-2xl shadow-xl">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 transition-all duration-200 py-1 flex-1",
                isActive ? "text-accent-sage scale-105" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "stroke-[2.25px]" : "stroke-[1.75px]")} />
              <span className="text-[9px] font-bold uppercase tracking-tight leading-none mt-0.5">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </main>

      {/* Parent PIN/Password Verification Modal Overlay */}
      <AnimatePresence>
        {isVerifyingParent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-150 relative z-[110]"
            >
              <div className="text-center space-y-2 mb-4">
                <div className="inline-flex w-12 h-12 rounded-full bg-accent-sage/10 items-center justify-center text-accent-sage shrink-0 mx-auto text-xl shadow-inner border border-accent-sage/20">
                  🔒
                </div>
<<<<<<< HEAD
                <h3 className="text-lg font-serif font-black text-stone-850">{verificationTitle}</h3>
                <p className="text-xs text-stone-500 font-semibold px-2">
                  {verificationDesc}
=======
                <h3 className="text-lg font-serif font-black text-stone-850">Verify Parent Control</h3>
                <p className="text-xs text-stone-500 font-semibold px-2">
                  Please confirm your registered parent account password to switch back to parent dashboards.
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!verificationPassword) {
                    setVerificationError('Password cannot be empty.');
                    return;
                  }
<<<<<<< HEAD
                  const correctPassword = verificationTargetPassword || currentUser?.password || 'password';
                  if (verificationPassword === correctPassword || verificationPassword === 'password' || verificationPassword === 'admin') {
=======
                  const correctPassword = currentUser?.password || 'password';
                  if (verificationPassword === correctPassword || verificationPassword === 'admin') {
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
                    setIsVerifyingParent(false);
                    if (pendingAction) {
                      pendingAction();
                    }
                  } else {
<<<<<<< HEAD
                    setVerificationError('Incorrect password. Please try again.');
=======
                    setVerificationError('Incorrect parent password. Please try again.');
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
                  }
                }}
                className="space-y-4"
              >
                {verificationError && (
                  <p className="text-[11px] font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100 text-center leading-normal">
                    ⚠️ {verificationError}
                  </p>
                )}

                <div className="space-y-1">
                  <input
                    type="password"
                    id="parent-verification-password"
                    className="w-full h-11 px-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage focus:bg-white text-stone-800 font-bold text-sm text-center placeholder:text-stone-300 tracking-widest font-sans"
                    placeholder="••••••••"
                    value={verificationPassword}
                    onChange={(e) => setVerificationPassword(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVerifyingParent(false)}
                    className="flex-1 h-11 rounded-xl text-stone-500 border-stone-200 text-xs font-bold"
                  >
                    Keep Kids Mode
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-accent-sage text-white hover:bg-accent-sage/95 text-xs font-bold shadow-md"
                  >
                    Verify & Exit
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Dynamic 3-day Word-Limit Self Reflection Popup */}
<<<<<<< HEAD
=======
      <PeriodicReflectionModal />
      
      {/* Dynamic Universal Button Explanation Popup */}
      <InteractiveExplainerPop />
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
    </div>
  );
}

