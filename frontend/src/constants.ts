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
<<<<<<< HEAD
      { id: 'l1-1', title: 'The Developing Brain', duration: '12:45', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l1-2', title: 'Temperament vs Behavior', duration: '08:20', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l1-3', title: 'Observation Practice Video', duration: '15:00', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
=======
<<<<<<< HEAD
      { id: 'l1-1', title: 'The Developing Brain', duration: '12:45', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l1-2', title: 'Temperament vs Behavior', duration: '08:20', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l1-3', title: 'Observation Practice Video', duration: '15:00', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
=======
      { id: 'l1-1', title: 'The Developing Brain', duration: '12:45', type: 'video', completed: true },
      { id: 'l1-2', title: 'Temperament vs Behavior', duration: '08:20', type: 'video', completed: true },
      { id: 'l1-3', title: 'Observation Exercise', duration: '15:00', type: 'reflection', completed: true },
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    ],
  },
  {
    id: 'm2',
    title: 'Building Communication',
    description: 'Strategies for effective listening and speaking with your child.',
    week: 2,
    unlocked: true,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    progress: 33,
    lessons: [
      { id: 'l2-1', title: 'Principles of Active Listening', duration: '10:15', type: 'video', completed: true, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l2-2', title: 'The Power of Validation', duration: '09:40', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l2-3', title: 'Expressive Communication Guide', duration: '05:00', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
<<<<<<< HEAD
=======
=======
    progress: 40,
    lessons: [
      { id: 'l2-1', title: 'Active Listening', duration: '10:15', type: 'video', completed: true },
      { id: 'l2-2', title: 'The Power of Validation', duration: '09:40', type: 'video', completed: false },
      { id: 'l2-3', title: 'Communication Styles Quiz', duration: '05:00', type: 'quiz', completed: false },
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
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
<<<<<<< HEAD
      { id: 'l3-1', title: 'Trigger Awareness Foundations', duration: '11:20', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l3-2', title: 'Nervous-System De-escalation', duration: '09:30', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l3-3', title: 'Restoring Safe Space Connections', duration: '08:15', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
=======
<<<<<<< HEAD
      { id: 'l3-1', title: 'Trigger Awareness Foundations', duration: '11:20', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l3-2', title: 'Nervous-System De-escalation', duration: '09:30', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l3-3', title: 'Restoring Safe Space Connections', duration: '08:15', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
=======
      { id: 'l3-1', title: 'Trigger Awareness', duration: '11:20', type: 'video', completed: false },
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    ],
  },
  {
    id: 'm4',
    title: 'Confidence Building',
    description: 'Nurturing self-esteem and resilience.',
    week: 4,
    unlocked: false,
    progress: 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    lessons: [
      { id: 'l4-1', title: 'Self-Esteem Under the Hood', duration: '10:45', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l4-2', title: 'Building Healthy Risk-Taking habit', duration: '11:10', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l4-3', title: 'Mindful Identity Praise Video', duration: '09:50', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
    ],
<<<<<<< HEAD
=======
=======
    lessons: [],
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  },
  {
    id: 'm5',
    title: 'Discipline Without Fear',
    description: 'How to set boundaries with love and consistency.',
    week: 5,
    unlocked: false,
    progress: 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    lessons: [
      { id: 'l5-1', title: 'Introduction to Calm Loving Discipline', duration: '11:30', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l5-2', title: 'Consistency and Safety Framework', duration: '10:10', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l5-3', title: 'Boundaries Training Walkthrough', duration: '12:05', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
    ],
<<<<<<< HEAD
=======
=======
    lessons: [],
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  },
  {
    id: 'm6',
    title: 'Managing Screen Addiction',
    description: 'Practical steps for healthy tech habits.',
    week: 6,
    unlocked: false,
    progress: 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    lessons: [
      { id: 'l6-1', title: 'Screen Time Impact on Children', duration: '12:50', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l6-2', title: 'Designing Healthy Digital Routine', duration: '09:15', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l6-3', title: 'Navigating Device Limits Peaceful', duration: '11:40', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
    ],
<<<<<<< HEAD
=======
=======
    lessons: [],
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  },
  {
    id: 'm7',
    title: 'Emotional Intelligence',
    description: 'Identifying and naming emotions for better self-regulation.',
    week: 7,
    unlocked: false,
    progress: 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    lessons: [
      { id: 'l7-1', title: 'Anatomy of Feeling Validation', duration: '09:55', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l7-2', title: 'Mindful Co-Regulation Breathing', duration: '11:20', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l7-3', title: 'Somatic Emotional Reset Method', duration: '10:40', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
    ],
<<<<<<< HEAD
=======
=======
    lessons: [],
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  },
  {
    id: 'm8',
    title: 'Healthy Routine Building',
    description: 'Creating structures that reduce daily friction.',
    week: 8,
    unlocked: false,
    progress: 0,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    lessons: [
      { id: 'l8-1', title: 'Calm Morning Routine Blueprint', duration: '10:25', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
      { id: 'l8-2', title: 'Restorative Sleep Hygiene habits', duration: '09:50', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
      { id: 'l8-3', title: 'Consistent Transition Routines', duration: '11:15', type: 'video', completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
    ],
<<<<<<< HEAD
=======
=======
    lessons: [],
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  }
];
