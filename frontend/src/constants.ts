import { Module, UserStats } from './types';

export const MOCK_USER_STATS: UserStats = {
  streak: 5,
  totalModules: 8,
  completedModules: 2,
  weeklyProgress: 65,
  nextUnlockDays: 2,
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Understanding Your Child',
    description: 'Learn the fundamentals of child psychology and temperament.',
    week: 1,
    unlocked: true,
    progress: 100,
    lessons: [
      { id: 'l1-1', title: 'The Developing Brain', duration: '12:45', type: 'video', completed: true },
      { id: 'l1-2', title: 'Temperament vs Behavior', duration: '08:20', type: 'video', completed: true },
      { id: 'l1-3', title: 'Observation Exercise', duration: '15:00', type: 'reflection', completed: true },
    ],
  },
  {
    id: 'm2',
    title: 'Building Communication',
    description: 'Strategies for effective listening and speaking with your child.',
    week: 2,
    unlocked: true,
    progress: 40,
    lessons: [
      { id: 'l2-1', title: 'Active Listening', duration: '10:15', type: 'video', completed: true },
      { id: 'l2-2', title: 'The Power of Validation', duration: '09:40', type: 'video', completed: false },
      { id: 'l2-3', title: 'Communication Styles Quiz', duration: '05:00', type: 'quiz', completed: false },
    ],
  },
  {
    id: 'm3',
    title: 'Anger Management',
    description: 'Tools for staying calm when things get heated.',
    week: 3,
    unlocked: false,
    unlockDate: '2026-05-19',
    progress: 0,
    lessons: [
      { id: 'l3-1', title: 'Trigger Awareness', duration: '11:20', type: 'video', completed: false },
    ],
  },
  {
    id: 'm4',
    title: 'Confidence Building',
    description: 'Nurturing self-esteem and resilience.',
    week: 4,
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 'm5',
    title: 'Discipline Without Fear',
    description: 'How to set boundaries with love and consistency.',
    week: 5,
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 'm6',
    title: 'Managing Screen Addiction',
    description: 'Practical steps for healthy tech habits.',
    week: 6,
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 'm7',
    title: 'Emotional Intelligence',
    description: 'Identifying and naming emotions for better self-regulation.',
    week: 7,
    unlocked: false,
    progress: 0,
    lessons: [],
  },
  {
    id: 'm8',
    title: 'Healthy Routine Building',
    description: 'Creating structures that reduce daily friction.',
    week: 8,
    unlocked: false,
    progress: 0,
    lessons: [],
  }
];
