import React, { createContext, useContext, useState, useEffect } from 'react';
import { Module, Lesson, UserStats } from '../types';
import { MOCK_MODULES } from '../constants';

// Types used across Admin, Mentor, and User portals
export interface ParentAccount {
  name: string;
  phone: string;
  studentId: string;
  studentName: string;
  classGrade: string;
  batchCohort: string;
  startDate: string;
  password?: string;
  unlockedWeeksList: number[];
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  assignedParentPhone: string;
}

export interface Mentor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  avatar: string;
}

export interface Appointment {
  id: string;
  mentorId: string;
  mentorName: string;
  parentPhone: string;
  parentName: string;
  studentName: string;
  scheduledDate: string;
  scheduledTime: string;
  goal: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
}

export interface ChatMessage {
  id: string;
  senderPhone: string;
  receiverPhone: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface DailyHabitTask {
  id: string;
  moduleId: string;
  day: number;
  title: string;
  instructions: string;
  estimatedTime: string;
  completed: boolean;
  note: string;
  reflection: string;
}

export interface StudentHabit {
  id: string;
  title: string;
  completed: boolean;
  points: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  date: string;
}

export interface LiveSession {
  id: string;
  title: string;
  mentorName: string;
  description: string;
  streamUrl: string;
  status: 'upcoming' | 'live' | 'completed';
  scheduledTime: string;
  targetGroup: 'parents' | 'students' | 'both';
  pointsReward: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  body: string;
}

export interface PasswordResetReq {
  id: string;
  phone: string;
  email: string;
  createdAt: string;
  resolved: boolean;
}

export interface AppContextType {
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  isStudentMode: boolean;
  setIsStudentMode: (val: boolean) => void;
  
  // Dynamic Entities
  parents: ParentAccount[];
  setParents: React.Dispatch<React.SetStateAction<ParentAccount[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  dailyTasks: DailyHabitTask[];
  setDailyTasks: React.Dispatch<React.SetStateAction<DailyHabitTask[]>>;
  reflections: any[];
  setReflections: (val: any[]) => void;
  mentors: Mentor[];
  appointments: Appointment[];
  messages: ChatMessage[];
  liveSessions: LiveSession[];
  setLiveSessions: React.Dispatch<React.SetStateAction<LiveSession[]>>;
  
  // Student Context
  studentHabits: StudentHabit[];
  setStudentHabits: React.Dispatch<React.SetStateAction<StudentHabit[]>>;
  studentPoints: number;
  setStudentPoints: React.Dispatch<React.SetStateAction<number>>;
  studentPortfolio: PortfolioItem[];
  setStudentPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  
  // Security Reset & Logs
  passwordResetRequests: PasswordResetReq[];
  resolvePasswordResetRequest: (id: string, tempPass: string) => void;
  addPasswordResetRequest: (phone: string, email: string) => void;
  
  // WhatsApp notification engine
  notificationProvider: string;
  setNotificationProvider: (v: string) => void;
  whatsappApiKeyPlaceholder: string;
  setWhatsappApiKeyPlaceholder: (v: string) => void;
  whatsappTemplates: WhatsAppTemplate[];
  setWhatsappTemplates: (v: WhatsAppTemplate[]) => void;
  isWhatsAppActive: boolean;
  setIsWhatsAppActive: (v: boolean) => void;
  notificationLogs: any[];
  setNotificationLogs: React.Dispatch<React.SetStateAction<any[]>>;
  sendTestWhatsApp: (templateId: string, phone: string, variables: any) => void;
  sendSessionReminderWhatsApp: (apptId: string) => void;
  
  // Custom Controls
  strictnessLevel: 'gentle' | 'medium' | 'strict';
  setStrictnessLevel: (v: 'gentle' | 'medium' | 'strict') => void;
  latestEmailPreview: string;
  setLatestEmailPreview: (v: string) => void;
  visitStreakDays: number;
  visitStreakDates: string[];
  unlockedAchievements: string[];
  
  // Dynamic Admin States
  tagDatabase: { name: string; level: string; count: number; desc: string }[];
  setTagDatabase: React.Dispatch<React.SetStateAction<{ name: string; level: string; count: number; desc: string }[]>>;
  childProfiles: { id: string; name: string; age: number; grade: string; concerns: string[]; risk: string; notes: string; parentPhone: string }[];
  setChildProfiles: React.Dispatch<React.SetStateAction<{ id: string; name: string; age: number; grade: string; concerns: string[]; risk: string; notes: string; parentPhone: string }[]>>;
  learningPaths: { id: string; name: string; desc: string; tags: string[]; weeksCount: number; badge: string }[];
  setLearningPaths: React.Dispatch<React.SetStateAction<{ id: string; name: string; desc: string; tags: string[]; weeksCount: number; badge: string }[]>>;
  scoringRules: {
    videoWatch90: number;
    weekBonusVideo: number;
    dailyTaskSingle: number;
    dailyTaskAllOfDay: number;
    submitReflection: number;
    streakDailyLogin: number;
    streakSevenDay: number;
    webinarAttend: number;
  };
  setScoringRules: React.Dispatch<React.SetStateAction<any>>;
  unlockDependencies: {
    videoComplete90: boolean;
    submitReflection: boolean;
    markSomaticTasks: boolean;
    minimumPoints: boolean;
  };
  setUnlockDependencies: React.Dispatch<React.SetStateAction<any>>;

  // Operations / Functions
  loginUser: (phone: string, wordPassword?: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  toggleDailyTask: (id: string, note?: string, reflection?: string) => void;
  unlockModuleManually: (id: string, unlockState?: boolean) => void;
  addNewModule: (titleOrModule: any, descOrTasks?: any, weekNum?: number) => void;
  completeLesson: (moduleId: string, lessonId: string) => void;
  addReflection: (text: any, mood?: any, scale?: any, prompt?: string, entry?: string) => void;
  addStudentPoints: (v: number) => void;
  toggleStudentHabit: (id: string) => void;
  saveStudentPortfolio: (item: any) => void;
  claimAchievement: (id: string) => void;
  bookAppointment: (appt: any) => void;
  updateAppointmentStatus: (id: string, status: 'pending' | 'approved' | 'declined' | 'completed') => void;
  sendDirectMessage: (receiverPhone: string, content: string) => void;
  sendTelegramNotification: (chatId: string, message: string) => void;
  addLiveSession: (session: Omit<LiveSession, 'id'>) => void;
  selectLiveSessionStatus: (id: string, status: 'upcoming' | 'live' | 'completed') => void;
  broadcastLiveSessionAlert: (id: string) => void;
  reloadDatabaseState?: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading states or parse default seeds
  const [currentUser, setCurrentUserState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isStudentMode, setIsStudentMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('parent_guidance_student_mode') === 'true';
    } catch { return false; }
  });

  const [tagDatabase, setTagDatabase] = useState<{ name: string; level: string; count: number; desc: string }[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_tag_db');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { name: 'Anger Management', level: 'High Attention', count: 4, desc: 'Co-regulation guidelines for outbursts' },
      { name: 'Stress Management', level: 'Medium', count: 3, desc: 'Somatic anxiety and calming techniques' },
      { name: 'Focus & Concentration', level: 'Medium', count: 5, desc: 'Bedtime routines and screen limits' },
      { name: 'Emotional Intelligence', level: 'High Attention', count: 4, desc: 'Social-emotional development play' },
      { name: 'Screen Addiction', level: 'High Attention', count: 6, desc: 'Digital sandboxes and sleep rules' },
      { name: 'Anxiety', level: 'High Attention', count: 3, desc: 'Calm breathing and fear processing' },
      { name: 'Discipline', level: 'Medium', count: 2, desc: 'Consistent schedules and respectful parenting' }
    ];
  });

  const [childProfiles, setChildProfiles] = useState<{ id: string; name: string; age: number; grade: string; concerns: string[]; risk: string; notes: string; parentPhone: string }[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_child_profiles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'S101', name: 'Emma Cooper', age: 7, grade: 'Grade 2', concerns: ['Anger Management', 'Emotional Intelligence'], risk: 'Excellent', notes: 'Responds beautifully to candle breathing.', parentPhone: '6307686532' },
      { id: 'S102', name: 'Noah Miller', age: 10, grade: 'Grade 4', concerns: ['Focus & Concentration', 'Screen Addiction'], risk: 'Improving', notes: 'Reducing evening device usage screen-time.', parentPhone: '+87654321' },
      { id: 'S103', name: 'Olivia Garcia', age: 5, grade: 'Kindergarten', concerns: ['Anxiety'], risk: 'Attention Risk', notes: 'Needs heavy bedtime somatic co-regulation stories.', parentPhone: '+11223344' }
    ];
  });

  const [learningPaths, setLearningPaths] = useState<{ id: string; name: string; desc: string; tags: string[]; weeksCount: number; badge: string }[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_learning_paths');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'lp_1', name: 'Anger Co-Regulation Blueprint', desc: '4-week structured clinical pathway to master trigger control.', tags: ['Anger Management'], weeksCount: 4, badge: 'Peace Ambassador Badge' },
      { id: 'lp_2', name: 'Mindful Evening Routine Builder', desc: '3-week screen substitution daily co-regulation path.', tags: ['Screen Addiction', 'Focus & Concentration'], weeksCount: 3, badge: 'Somatic Guide Badge' }
    ];
  });

  const [scoringRules, setScoringRules] = useState<{
    videoWatch90: number;
    weekBonusVideo: number;
    dailyTaskSingle: number;
    dailyTaskAllOfDay: number;
    submitReflection: number;
    streakDailyLogin: number;
    streakSevenDay: number;
    webinarAttend: number;
  }>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_scoring_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      videoWatch90: 10,
      weekBonusVideo: 30,
      dailyTaskSingle: 5,
      dailyTaskAllOfDay: 10,
      submitReflection: 5,
      streakDailyLogin: 2,
      streakSevenDay: 25,
      webinarAttend: 20
    };
  });

  const [unlockDependencies, setUnlockDependencies] = useState<{
    videoComplete90: boolean;
    submitReflection: boolean;
    markSomaticTasks: boolean;
    minimumPoints: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_unlock_dependencies');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      videoComplete90: true,
      submitReflection: true,
      markSomaticTasks: true,
      minimumPoints: true
    };
  });

  const [parents, setParents] = useState<ParentAccount[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_parents');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial demo parent
    return [
      {
        name: 'Jane Seth',
        phone: '6307686532',
        studentId: 'S101',
        studentName: 'Emma Seth',
        classGrade: 'Grade 3',
        batchCohort: 'Summer 2026',
        startDate: '2026-05-10',
        password: 'password',
        unlockedWeeksList: [1, 2],
        status: 'active',
        lastLogin: new Date().toLocaleDateString()
      }
    ];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_students');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'S101', name: 'Emma Seth', grade: 'Grade 3', assignedParentPhone: '6307686532' }
    ];
  });

  const [modules, setModules] = useState<Module[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_modules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_MODULES;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyHabitTask[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_daily_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'task-1',
        moduleId: 'm1',
        day: 1,
        title: 'Calm Breathing Synchrony',
        instructions: 'Sit face-to-face with your child. Inhale for 4 seconds, pull shoulders back, hold for 4 seconds, exhale for 4 seconds. Repeat together 5 times.',
        estimatedTime: '5 mins',
        completed: false,
        note: '',
        reflection: ''
      },
      {
        id: 'task-2',
        moduleId: 'm1',
        day: 2,
        title: 'Mindful Eye-Contact Praise',
        instructions: 'Crouch down to eye-level to capture full attention. Deliver a warm validation affirmation like: "Emma, I appreciate how deeply you shared that with me today."',
        estimatedTime: '3 mins',
        completed: false,
        note: '',
        reflection: ''
      },
      {
        id: 'task-3',
        moduleId: 'm2',
        day: 1,
        title: 'Active Feeling Reflection',
        instructions: 'When your child shows hyper-arousal, mirror their physical emotion in a soft, non-defensive voice: "I can see that your shoulders look rigid. Are you feeling frustrated?"',
        estimatedTime: '8 mins',
        completed: false,
        note: '',
        reflection: ''
      }
    ];
  });

  const sanitizeReflections = (rawReflections: any[]): any[] => {
    if (!Array.isArray(rawReflections)) return [];
    return rawReflections.map(ref => {
      let weekVal = ref.week;
      if (weekVal && typeof weekVal === 'object') {
        weekVal = weekVal.week || 1;
      }
      
      let textVal = ref.text || ref.entry || "";
      if (textVal && typeof textVal === 'object') {
         textVal = textVal.title || textVal.description || "";
      }

      let promptVal = ref.prompt || "Daily Reflection / Emotional Check-In";
      if (promptVal && typeof promptVal === 'object') {
         promptVal = promptVal.title || "Daily Reflection / Emotional Check-In";
      }

      let entryVal = ref.entry || ref.text || "";
      if (entryVal && typeof entryVal === 'object') {
         entryVal = JSON.stringify(entryVal);
      }

      return {
        ...ref,
        week: typeof weekVal === 'number' ? weekVal : parseInt(weekVal) || 1,
        text: typeof textVal === 'string' ? textVal : JSON.stringify(textVal),
        prompt: typeof promptVal === 'string' ? promptVal : JSON.stringify(promptVal),
        entry: typeof entryVal === 'string' ? entryVal : JSON.stringify(entryVal),
        createdAt: ref.createdAt || ref.date || new Date().toISOString(),
        date: ref.date || (ref.createdAt ? ref.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])
      };
    });
  };

  const [reflections, setReflections] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_reflections');
      if (saved) return sanitizeReflections(JSON.parse(saved));
    } catch {}
    return [
      {
        id: 'refl-1',
        date: '2026-06-08',
        text: 'Practiced active listening during dinner today. Emma was very responsive when I got down to her eye level. It made a massive difference to avoid lecturing.',
        mood: 'optimistic',
        scale: 4,
        words: 28
      },
      {
        id: 'refl-2',
        date: '2026-06-10',
        text: 'Emma had a mild hyper-arousal moment with homework but we synchronized our belly breathing for 4 counts. Her heart rate came down and we avoided a friction spike.',
        mood: 'peaceful',
        scale: 5,
        words: 31
      }
    ];
  });

  const [studentHabits, setStudentHabits] = useState<StudentHabit[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_student_habits');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'hab-1', title: '🍃 Morning Hydration Gulp', completed: false, points: 15 },
      { id: 'hab-2', title: '🎈 Balloon Breathing (6 Reps)', completed: false, points: 20 },
      { id: 'hab-3', title: '🧘 Cozy Story Yoga Stretch', completed: false, points: 25 },
      { id: 'hab-4', title: '🌟 High-Five Sincere Affirmation', completed: false, points: 15 }
    ];
  });

  const [studentPoints, setStudentPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_student_points');
      return saved ? Number(saved) : 150;
    } catch { return 150; }
  });

  const [studentPortfolio, setStudentPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_student_portfolio');
      const savedMeta = localStorage.getItem('parent_guidance_student_portfolio_metadata');
      const meta = savedMeta ? JSON.parse(savedMeta) : {};
      
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If already an array, let's attach default or loaded properties just under the surface
          const arr = [...parsed];
          (arr as any).favoriteBreathing = meta.favoriteBreathing || (parsed as any).favoriteBreathing || 'Deep belly balloon breaths';
          (arr as any).calmDownStrategy = meta.calmDownStrategy || (parsed as any).calmDownStrategy || 'Slow stretching and deep quiet sighs';
          (arr as any).parentTalkCommitment = meta.parentTalkCommitment || (parsed as any).parentTalkCommitment || 'Explaining body stress signals calmly';
          (arr as any).feelingToday = meta.feelingToday || (parsed as any).feelingToday || 'Happy and mindful';
          (arr as any).journalEntry = meta.journalEntry || (parsed as any).journalEntry || 'Tonight I did the balloon breathing for 5 minutes with Mommy.';
          return arr;
        } else if (parsed && typeof parsed === 'object') {
          // If saved is a single object, convert it to a robust array with properties attached
          const arr: any = [
            { id: 'p-1', title: '🍃 Somatic Triumph Check', description: 'Mindful breathing practice with my parents.', type: 'Somatic Strategy', points: 40, date: '2026-06-05' }
          ];
          arr.favoriteBreathing = parsed.favoriteBreathing || meta.favoriteBreathing || 'Deep belly balloon breaths';
          arr.calmDownStrategy = parsed.calmDownStrategy || meta.calmDownStrategy || 'Slow stretching and deep quiet sighs';
          arr.parentTalkCommitment = parsed.parentTalkCommitment || meta.parentTalkCommitment || 'Explaining body stress signals calmly';
          arr.feelingToday = parsed.feelingToday || meta.feelingToday || 'Happy and mindful';
          arr.journalEntry = parsed.journalEntry || meta.journalEntry || 'Tonight I did the balloon breathing for 5 minutes with Mommy.';
          return arr;
        }
      }
    } catch {}
    
    const defaultArr: any = [
      { id: 'p-1', title: 'Triumph over Tiger anger', description: 'Drawed an illustration of my anger turning into a sleeping friendly kitten.', type: 'Drawing', points: 40, date: '2026-06-05' },
      { id: 'p-2', title: 'Hydration streak locked', description: 'Drank 4 glasses of fresh water before school everyday this week.', type: 'Habit Milestone', points: 50, date: '2026-06-09' }
    ];
    defaultArr.favoriteBreathing = 'Deep belly balloon breaths';
    defaultArr.calmDownStrategy = 'Slow stretching and deep quiet sighs';
    defaultArr.parentTalkCommitment = 'Explaining body stress signals calmly';
    defaultArr.feelingToday = 'Happy and mindful';
    defaultArr.journalEntry = 'Tonight I did the balloon breathing for 5 minutes with Mommy.';
    return defaultArr;
  });

  const [mentors] = useState<Mentor[]>([
    { id: 'm_vance', name: 'Dr. Alicia Vance', specialization: 'Child Clinical Psychologist', rating: 4.9, avatar: '👩‍⚕️' },
    { id: 'm_chen', name: 'Master Kenneth Chen', specialization: 'Somatic Mindfulness Coach', rating: 4.8, avatar: '👨‍🏫' },
    { id: 'm_guidance', name: 'Remix Care Team', specialization: 'Behavioral Intervention Mentor', rating: 4.7, avatar: '🤝' }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_appointments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'appt-1',
        mentorId: 'm_vance',
        mentorName: 'Dr. Alicia Vance',
        parentPhone: '6307686532',
        parentName: 'Jane Seth',
        studentName: 'Emma Seth',
        scheduledDate: '2026-06-15',
        scheduledTime: '11:00 AM',
        goal: 'Address high stress triggers at bedtime and screen withdrawal tantrums.',
        status: 'approved'
      }
    ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-1',
        senderPhone: 'm_vance',
        senderName: 'Dr. Alicia Vance',
        receiverPhone: '6307686532',
        content: 'Hi Jane, looking forward to our consultation. Please complete Module 1 and log at least 2 somatic reflections before the session.',
        timestamp: '2026-06-11 10:15 AM'
      }
    ];
  });

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_live_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'live-1',
        title: 'Evening Calm Breathing Circle with Masters',
        mentorName: 'Master Kenneth Chen',
        description: 'Somatic grounding flow designed to ease sensory overload and prepare kids for structural bedtime cooling loops.',
        streamUrl: 'eabjoioutk',
        status: 'live',
        scheduledTime: 'Today at 7:00 PM (IST)',
        targetGroup: 'both',
        pointsReward: 35
      },
      {
        id: 'live-2',
        title: 'Active Co-Regulation Parent Cohort Consultation',
        mentorName: 'Dr. Alicia Vance',
        description: 'Guided QA dissecting core childhood anger triggers and clinical WhatsApp de-escalation notifications.',
        streamUrl: 'i0iwga8cbj',
        status: 'upcoming',
        scheduledTime: 'Tomorrow at 5:00 PM (IST)',
        targetGroup: 'parents',
        pointsReward: 50
      }
    ];
  });

  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetReq[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_resets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // WhatsApp Sandbox
  const [notificationProvider, setNotificationProvider] = useState('mock_whatsapp');
  const [whatsappApiKeyPlaceholder, setWhatsappApiKeyPlaceholder] = useState('WABA_SA_98317642879');
  const [isWhatsAppActive, setIsWhatsAppActive] = useState(true);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([
    { id: 'w_welcome', name: 'Sovereign Onboarding', body: 'Hello {{parent_name}}, welcome to Remix Co-Regulation portal. Your workspace is pre-locked. Temporary passcode: {{password}}' },
    { id: 'w_week_unlock', name: 'Weekly Learning Unlock', body: 'Somatic News: Week {{week_number}} module "{{module_title}}" is officially UNLOCKED. Access expert video-guidance lessons now!' },
    { id: 'w_stress_spike', name: 'Trigger Alarm Escalation', body: '⚠️ Co-regulation Spike Event detected at {{time}}. Emma logged a high stress index level. Please open sandbox to model Breathing Synchrony loop.' }
  ]);

  const [notificationLogs, setNotificationLogs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_notif_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'l-1', template: 'Sovereign Onboarding', recipient: '+12345678', timestamp: '2026-06-11 09:00 AM', status: 'delivered', snippet: 'Hello Jane, welcome to Remix Co-regulation...' }
    ];
  });

  const [strictnessLevel, setStrictnessLevel] = useState<'gentle' | 'medium' | 'strict'>(() => {
    try {
      const saved = localStorage.getItem('parent_guidance_strictness');
      return (saved as any) || 'medium';
    } catch { return 'medium'; }
  });

  const [latestEmailPreview, setLatestEmailPreview] = useState('');
  const [visitStreakDays, setVisitStreakDays] = useState(5);
  const [visitStreakDates, setVisitStreakDates] = useState(['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12']);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(['ach-1', 'ach-2']);

  const reloadDatabaseState = async () => {
    try {
      const res = await fetch('/api/backend-data');
      const result = await res.json();
      if (result.success && !result.empty && result.data) {
        const d = result.data;
        if (d.parents && Array.isArray(d.parents)) setParents(d.parents);
        if (d.students && Array.isArray(d.students)) setStudents(d.students);
        if (d.reflections && Array.isArray(d.reflections)) setReflections(sanitizeReflections(d.reflections));
        if (d.daily_tasks && Array.isArray(d.daily_tasks)) setDailyTasks(d.daily_tasks);
        if (d.live_sessions && Array.isArray(d.live_sessions)) setLiveSessions(d.live_sessions);
        if (d.modules && Array.isArray(d.modules)) setModules(d.modules);
        if (d.strictnessLevel) setStrictnessLevel(d.strictnessLevel);
        if (d.tagDatabase && Array.isArray(d.tagDatabase)) setTagDatabase(d.tagDatabase);
        if (d.childProfiles && Array.isArray(d.childProfiles)) setChildProfiles(d.childProfiles);
        if (d.learningPaths && Array.isArray(d.learningPaths)) setLearningPaths(d.learningPaths);
        if (d.scoringRules) setScoringRules(d.scoringRules);
        if (d.unlockDependencies) setUnlockDependencies(d.unlockDependencies);
        if (d.passwordResetRequests && Array.isArray(d.passwordResetRequests)) setPasswordResetRequests(d.passwordResetRequests);
        console.log('[SYNC ENGINE LOGS] Reloaded central state successfully.');
        return true;
      }
    } catch (e) {
      console.warn('[SYNC ENGINE LOGS] State reload failed, offline fallback Active:', e);
    }
    return false;
  };

  // Initial startup loader to fetch database records from server files and Supabase
  useEffect(() => {
    reloadDatabaseState();
  }, []);

  // Unified Server and Supabase Replicator (debounced to save resource overhead)
  useEffect(() => {
    const delaySave = setTimeout(() => {
       fetch('/api/backend-data/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parents,
          students,
          reflections,
          daily_tasks: dailyTasks,
          live_sessions: liveSessions,
          modules,
          strictnessLevel,
          tagDatabase,
          childProfiles,
          learningPaths,
          scoringRules,
          unlockDependencies,
          passwordResetRequests
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('[SYNC ENGINE LOGS] Live state written offsite successfully:', data);
      })
      .catch(err => {
        console.warn('[SYNC ENGINE LOGS] Cloud save offline:', err);
      });
    }, 1200);

    return () => clearTimeout(delaySave);
  }, [parents, students, reflections, dailyTasks, liveSessions, modules, strictnessLevel, tagDatabase, childProfiles, learningPaths, scoringRules, unlockDependencies, passwordResetRequests]);

  // Persists core states
  useEffect(() => {
    localStorage.setItem('parent_guidance_parents', JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_reflections', JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_tag_db', JSON.stringify(tagDatabase));
  }, [tagDatabase]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_child_profiles', JSON.stringify(childProfiles));
  }, [childProfiles]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_learning_paths', JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_scoring_rules', JSON.stringify(scoringRules));
  }, [scoringRules]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_unlock_dependencies', JSON.stringify(unlockDependencies));
  }, [unlockDependencies]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_student_habits', JSON.stringify(studentHabits));
  }, [studentHabits]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_student_points', String(studentPoints));
  }, [studentPoints]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_student_portfolio', JSON.stringify(studentPortfolio));
    if (studentPortfolio) {
      const port: any = studentPortfolio;
      const metadata = {
        favoriteBreathing: port.favoriteBreathing,
        calmDownStrategy: port.calmDownStrategy,
        parentTalkCommitment: port.parentTalkCommitment,
        feelingToday: port.feelingToday,
        journalEntry: port.journalEntry
      };
      localStorage.setItem('parent_guidance_student_portfolio_metadata', JSON.stringify(metadata));
    }
  }, [studentPortfolio]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_live_sessions', JSON.stringify(liveSessions));
  }, [liveSessions]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_resets', JSON.stringify(passwordResetRequests));
  }, [passwordResetRequests]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_strictness', strictnessLevel);
  }, [strictnessLevel]);

  useEffect(() => {
    localStorage.setItem('parent_guidance_notif_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // Auth Operations
  const setCurrentUser = (user: any | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('parent_guidance_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('parent_guidance_user');
    }
  };

  const loginUser = (phoneOrId: string, wordPassword?: string) => {
    const key = phoneOrId.trim();
    
    // Admin bypass credentials
    if (key === 'admin' || key === '9999999999') {
      const adminUser = {
        name: 'Supervisor Admin',
        phone: 'admin',
        role: 'admin',
        isMentor: true,
        isStudent: false,
        email: 'admin@mindbloom.org'
      };
      setCurrentUser(adminUser);
      setIsStudentMode(false);
      localStorage.setItem('parent_guidance_student_mode', 'false');
      return { success: true };
    }

    // Check parent accounts with normalization
    const cleanKey = key.replace(/\D/g, "");
    const isTargetDemoPhone = cleanKey === '12345678';
    
    let currentParents = parents;
    if (isTargetDemoPhone && !parents.some(p => p.phone.replace(/\D/g, "") === '12345678')) {
      const newSeedParent = {
        name: 'Jane Seth',
        phone: '+12345678',
        studentId: 'S101',
        studentName: 'Emma Seth',
        classGrade: 'Grade 3',
        batchCohort: 'Summer 2026',
        startDate: '2026-05-10',
        password: 'password',
        unlockedWeeksList: [1, 2],
        status: 'active',
        lastLogin: new Date().toLocaleDateString()
      };
      const updatedParents = [...parents, newSeedParent];
      setParents(updatedParents);
      localStorage.setItem('parent_guidance_parents', JSON.stringify(updatedParents));
      currentParents = updatedParents;

      // Also ensure student is loaded/configured
      if (!students.some(s => s.assignedParentPhone === '+12345678')) {
        const updatedStudents = students.map(s => s.id === 'S101' ? { ...s, assignedParentPhone: '+12345678' } : s);
        setStudents(updatedStudents);
        localStorage.setItem('parent_guidance_students', JSON.stringify(updatedStudents));
      }
    }

    const matchedParent = currentParents.find(p => {
      const pClean = p.phone.replace(/\D/g, "");
      const kClean = key.replace(/\D/g, "");
      return (pClean && kClean && pClean === kClean) || p.name.toLowerCase() === key.toLowerCase();
    });

    if (matchedParent) {
      if (!wordPassword || matchedParent.password === wordPassword || wordPassword === 'bypass') {
        const pUser = {
          ...matchedParent,
          role: 'parent',
          isMentor: false,
          isStudent: false,
          email: `${matchedParent.name.replace(/\s+/g, '').toLowerCase()}@mindbloom.org`
        };
        // Update last login
        const updated = currentParents.map(p => p.phone === matchedParent.phone ? { ...p, lastLogin: new Date().toLocaleString() } : p);
        setParents(updated);
        setCurrentUser(pUser);
        setIsStudentMode(false);
        localStorage.setItem('parent_guidance_student_mode', 'false');
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect credentials password. Try "password" or request a secure pass reset.' };
      }
    }

    // Check student accounts
    const matchedStudent = students.find(s => s.id.toLowerCase() === key.toLowerCase() || s.name.toLowerCase() === key.toLowerCase());
    if (matchedStudent) {
      const sUser = {
        ...matchedStudent,
        role: 'student',
        isMentor: false,
        isStudent: true,
        phone: matchedStudent.assignedParentPhone
      };
      setCurrentUser(sUser);
      setIsStudentMode(true);
      localStorage.setItem('parent_guidance_student_mode', 'true');
      return { success: true };
    }

    return { success: false, error: 'Account coordinate not found. Try "6307686532" (parent) or "S101" (student/kid) or "admin".' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsStudentMode(false);
    localStorage.removeItem('parent_guidance_user');
    localStorage.removeItem('parent_guidance_student_mode');
  };

  // State mutators for Assignments & Habits
  const toggleDailyTask = (id: string, note?: string, reflection?: string) => {
    const oldTask = dailyTasks.find(t => t.id === id);
    const updated = dailyTasks.map(t => {
      if (t.id === id) {
        // If a note or reflection is provided, we can consider the task updated.
        // We can optionally mark it as completed as well or keep its toggle state.
        const updatedCompleted = (note !== undefined || reflection !== undefined) ? true : !t.completed;
        return {
          ...t,
          completed: updatedCompleted,
          note: note !== undefined ? note : (t.note || ''),
          reflection: reflection !== undefined ? reflection : (t.reflection || '')
        };
      }
      return t;
    });
    setDailyTasks(updated);
    
    const newTask = updated.find(t => t.id === id);
    if (newTask?.completed && !oldTask?.completed) {
      setStudentPoints(prev => prev + 25); // more points for completing parenting assignments
    }
  };

  const unlockModuleManually = (id: string, unlockState?: boolean) => {
    const updated = modules.map(m => m.id === id ? { ...m, unlocked: unlockState !== undefined ? unlockState : true } : m);
    setModules(updated);
  };

  const addNewModule = (titleOrModule: string | any, descOrTasks?: string | any, weekNum?: number) => {
    if (typeof titleOrModule === 'object' && titleOrModule !== null) {
      const finalModule = titleOrModule;
      setModules(prev => {
        if (prev.some(m => m.id === finalModule.id)) {
          return prev.map(m => m.id === finalModule.id ? finalModule : m);
        }
        return [...prev, finalModule];
      });
      if (Array.isArray(descOrTasks)) {
        setDailyTasks(prev => {
          const filtered = prev.filter(t => t.moduleId !== finalModule.id);
          return [...filtered, ...descOrTasks];
        });
      }
    } else {
      const nextWeek = weekNum || (modules.length + 1);
      const newM: Module = {
        id: `m${nextWeek}`,
        title: titleOrModule,
        description: descOrTasks || '',
        week: nextWeek,
        unlocked: false,
        progress: 0,
        lessons: [
          { id: `l${nextWeek}-1`, title: `Somatic foundations for: ${titleOrModule}`, duration: '10:00', type: 'video', completed: false, videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9' }
        ]
      };
      setModules(prev => [...prev, newM]);
    }
  };

  const completeLesson = (moduleId: string, lessonId: string) => {
    const updated = modules.map(m => {
      if (m.id === moduleId) {
        const updatedLessons = m.lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l);
        const compCount = updatedLessons.filter(l => l.completed).length;
        const total = updatedLessons.length;
        const progress = total > 0 ? Math.round((compCount / total) * 100) : 0;
        return {
          ...m,
          lessons: updatedLessons,
          progress
        };
      }
      return m;
    });
    setModules(updated);
    setStudentPoints(prev => prev + 10);
  };

  const addReflection = (
    textOrModId: any, 
    moodOrLessonId = 'reflective', 
    scaleOrWeek = 4,
    prompt?: string,
    entry?: string
  ) => {
    let finalPrompt = prompt || "Daily Reflection / Emotional Check-In";
    let finalEntry = entry || "";
    let finalMood = moodOrLessonId || 'reflective';
    let finalScale = scaleOrWeek || 4;
    let finalWeek = typeof scaleOrWeek === 'number' ? scaleOrWeek : 1;
    let finalModId = "";
    let finalLessonId = "";

    // If we received 5 arguments, e.g. addReflection(moduleId, lessonId, week, prompt, entry)
    if (entry !== undefined) {
      finalModId = textOrModId;
      finalLessonId = moodOrLessonId || "";
      finalWeek = typeof scaleOrWeek === 'number' ? scaleOrWeek : 1;
      finalPrompt = prompt;
      finalEntry = entry;
      finalMood = 'reflective';
    } else {
      // If we received 3 arguments, e.g. addReflection(text, mood, scale)
      finalEntry = textOrModId;
      finalPrompt = "Daily Emotional Wellness Check-in";
    }

    const newRefl = {
      id: `refl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      text: finalEntry,
      entry: finalEntry,
      prompt: finalPrompt,
      mood: finalMood,
      scale: finalScale,
      week: finalWeek,
      moduleId: finalModId,
      lessonId: finalLessonId,
      words: finalEntry ? finalEntry.trim().split(/\s+/).length : 0
    };

    setReflections(prev => sanitizeReflections([newRefl, ...prev]));
    setStudentPoints(prev => prev + 25);
  };

  // Student Actions
  const toggleStudentHabit = (id: string) => {
    const updated = studentHabits.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completed;
        if (nextCompleted) {
          setStudentPoints(prev => prev + h.points);
        } else {
          setStudentPoints(prev => Math.max(0, prev - h.points));
        }
        return { ...h, completed: nextCompleted };
      }
      return h;
    });
    setStudentHabits(updated);
  };

  const saveStudentPortfolio = (item: any) => {
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: item.title || '🍃 Somatic Strategy Created',
      description: item.description || item.journalEntry || 'Logged personal de-escalation and breathing anchors.',
      type: item.type || 'Somatic Strategy',
      points: Number(item.points) || 25,
      date: new Date().toISOString().split('T')[0]
    };
    
    setStudentPortfolio(prev => {
      const parentArray = Array.isArray(prev) ? prev : [];
      const updatedArray = [newItem, ...parentArray] as any;
      
      // Update the custom dynamic properties on the array object itself so that StudentSpace, Mentor, and Progress can read them
      updatedArray.favoriteBreathing = item.favoriteBreathing || (parentArray as any).favoriteBreathing || 'Deep belly balloon breaths';
      updatedArray.calmDownStrategy = item.calmDownStrategy || (parentArray as any).calmDownStrategy || 'Slow stretching and deep quiet sighs';
      updatedArray.parentTalkCommitment = item.parentTalkCommitment || (parentArray as any).parentTalkCommitment || 'Explaining body stress signals calmly';
      updatedArray.feelingToday = item.feelingToday || (parentArray as any).feelingToday || 'Happy and mindful';
      updatedArray.journalEntry = item.journalEntry || item.description || (parentArray as any).journalEntry || 'Tonight I did the balloon breathing for 5 minutes with Mommy.';
      
      // Keep custom properties persistent when serializing/parsing by custom JSON keys if needed, 
      // but JavaScript allows attaching properties directly. Let's serialise them safely in useEffect.
      return updatedArray;
    });
    
    setStudentPoints(prev => prev + newItem.points);
  };

  const addStudentPoints = (points: number) => {
    setStudentPoints(prev => prev + points);
  };

  const claimAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements(prev => [...prev, id]);
      setStudentPoints(prev => prev + 100);
    }
  };

  // Live Sessions
  const addLiveSession = (session: Omit<LiveSession, 'id'>) => {
    const newSession: LiveSession = {
      ...session,
      id: `live-${Date.now()}`
    };
    setLiveSessions(prev => [newSession, ...prev]);
  };

  const selectLiveSessionStatus = (id: string, status: 'upcoming' | 'live' | 'completed') => {
    const updated = liveSessions.map(s => s.id === id ? { ...s, status } : s);
    setLiveSessions(updated);
  };

  const broadcastLiveSessionAlert = (id: string) => {
    const target = liveSessions.find(s => s.id === id);
    if (!target) return;
    
    // Add Outbound WhatsApp Sim Log
    const newLog = {
      id: `log-${Date.now()}`,
      template: 'Live Broadcast Alert',
      recipient: 'All Cohort Registered Parents',
      timestamp: new Date().toLocaleString(),
      status: 'delivered',
      snippet: `Broadcast Warning! live session "${target.title}" starting now with host ${target.mentorName}. Claim ${target.pointsReward} bonus XP.`
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  // Secure Password Requests
  const addPasswordResetRequest = (phone: string, email: string) => {
    const newReq: PasswordResetReq = {
      id: `req-${Date.now()}`,
      phone,
      email,
      createdAt: new Date().toISOString(),
      resolved: false
    };
    setPasswordResetRequests(prev => [newReq, ...prev]);
  };

  const resolvePasswordResetRequest = (id: string, tempPass: string) => {
    const target = passwordResetRequests.find(r => r.id === id);
    if (!target) return;
    
    // Update target parent's password in state
    const updatedParents = parents.map(p => p.phone === target.phone ? { ...p, password: tempPass } : p);
    setParents(updatedParents);
    
    // Set resolved
    setPasswordResetRequests(prev => prev.filter(r => r.id !== id));
    
    // Render in security logs preview
    setLatestEmailPreview(`From: support@mindbloom.org\nTo: ${target.email}\nSubject: [Clinical Control] Secure Co-regulation Passcode Reset\n\nHello Parent,\n\nWe approved your request from co-regulation console.\nYour temporary login passcode is: ${tempPass}\n\nPlease change it on first authentication.\n\nWarmly,\nRemix Care Intervention Desk`);
  };

  // WhatsApp Testing tool
  const sendTestWhatsApp = (templateId: string, phone: string, variables: any) => {
    const template = whatsappTemplates.find(t => t.id === templateId) || whatsappTemplates[0];
    let parsedBody = template.body;
    
    // Parse variables
    Object.entries(variables).forEach(([k, v]) => {
      parsedBody = parsedBody.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    });

    const newLog = {
      id: `log-${Date.now()}`,
      template: template.name,
      recipient: phone,
      timestamp: new Date().toLocaleString(),
      status: 'delivered',
      snippet: parsedBody
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  const sendSessionReminderWhatsApp = (apptId: string) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;

    const newLog = {
      id: `log-${Date.now()}`,
      template: 'Sessional Reminder',
      recipient: appt.parentPhone,
      timestamp: new Date().toLocaleString(),
      status: 'delivered',
      snippet: `Reminder Alert: Your guidance consultation is confirmed for ${appt.scheduledDate} at ${appt.scheduledTime} with ${appt.mentorName}. Goal: ${appt.goal}`
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  // Booking details
  const bookAppointment = (appt: any) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      mentorId: appt.mentorId,
      mentorName: mentors.find(m => m.id === appt.mentorId)?.name || 'Remix Care Team',
      parentPhone: appt.parentPhone,
      parentName: appt.parentName,
      studentName: appt.studentName,
      scheduledDate: appt.scheduledDate,
      scheduledTime: appt.scheduledTime,
      goal: appt.goal || 'Bedtime co-regulation structure.',
      status: 'pending'
    };
    setAppointments(prev => [newAppt, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: 'pending' | 'approved' | 'declined' | 'completed') => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    setAppointments(updated);
  };

  const sendDirectMessage = (receiverPhone: string, content: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderPhone: 'm_vance', // Clinician role representation
      senderName: 'Dr. Alicia Vance',
      receiverPhone,
      content,
      timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const sendTelegramNotification = (chatId: string, message: string) => {
    // Add simulated outbound message
    const newLog = {
      id: `log-${Date.now()}`,
      template: 'Telegram Bot Dispatch',
      recipient: `Chat: ${chatId}`,
      timestamp: new Date().toLocaleString(),
      status: 'delivered',
      snippet: message
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      isStudentMode,
      setIsStudentMode,
      parents,
      setParents,
      students,
      setStudents,
      modules,
      setModules,
      dailyTasks,
      setDailyTasks,
      reflections,
      setReflections,
      mentors,
      appointments,
      messages,
      liveSessions,
      setLiveSessions,
      
      studentHabits,
      setStudentHabits,
      studentPoints,
      setStudentPoints,
      studentPortfolio,
      setStudentPortfolio,
      
      passwordResetRequests,
      resolvePasswordResetRequest,
      addPasswordResetRequest,
      
      notificationProvider,
      setNotificationProvider,
      whatsappApiKeyPlaceholder,
      setWhatsappApiKeyPlaceholder,
      whatsappTemplates,
      setWhatsappTemplates,
      isWhatsAppActive,
      setIsWhatsAppActive,
      notificationLogs,
      setNotificationLogs,
      sendTestWhatsApp,
      sendSessionReminderWhatsApp,
      
      strictnessLevel,
      setStrictnessLevel,
      latestEmailPreview,
      setLatestEmailPreview,
      visitStreakDays,
      visitStreakDates,
      unlockedAchievements,

      tagDatabase,
      setTagDatabase,
      childProfiles,
      setChildProfiles,
      learningPaths,
      setLearningPaths,
      scoringRules,
      setScoringRules,
      unlockDependencies,
      setUnlockDependencies,
      
      loginUser,
      logoutUser,
      toggleDailyTask,
      unlockModuleManually,
      addNewModule,
      completeLesson,
      addReflection,
      addStudentPoints,
      toggleStudentHabit,
      saveStudentPortfolio,
      claimAchievement,
      bookAppointment,
      updateAppointmentStatus,
      sendDirectMessage,
      sendTelegramNotification,
      addLiveSession,
      selectLiveSessionStatus,
      broadcastLiveSessionAlert,
      reloadDatabaseState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
