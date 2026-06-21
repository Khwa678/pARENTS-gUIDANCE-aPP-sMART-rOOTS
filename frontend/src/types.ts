export interface Module {
  id: string;
  title: string;
  description: string;
  week: number;
  unlocked: boolean;
  unlockDate?: string;
  progress: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'reflection';
  completed: boolean;
  videoUrl?: string;
  wistiaId?: string;
  wistia_id?: string;
  content?: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  moduleId: string;
  type: 'practice' | 'checklist' | 'reflection';
}

export interface UserStats {
  streak: number;
  totalModules: number;
  completedModules: number;
  weeklyProgress: number;
  nextUnlockDays: number;
}
