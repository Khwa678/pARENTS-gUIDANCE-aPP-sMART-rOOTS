import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Lock, PlayCircle, Clock, ChevronRight, Star, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const PRESET_TOPICS = [
  {
    id: 'sibling-harmony',
    title: 'Sibling Harmony & Peer Cooperation',
    description: 'Expert guidance on de-escalating child rivalry, facilitating sharing workshops, and social growth.',
    videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
    tasks: [
      { title: 'Conflict Observer Checklist', instructions: 'Watch children fight or vie for attention. Wait 30 seconds before intervening to assess if they can co-regulate.', estimatedTime: '5 mins' },
      { title: 'Peer Perspective Taking', instructions: 'Ask each child to tell tell you what they think their sibling is feeling and why they are upset.', estimatedTime: '8 mins' },
      { title: 'Split Special Minutes', instructions: 'Dedicate 10 minutes of completely uninterrupted one-on-one play with each child individually.', estimatedTime: '20 mins' },
      { title: 'Formulate Co-op Goals', instructions: 'Provide a joint coloring page or high-tower block building task. Guide them to complete it together.', estimatedTime: '15 mins' },
      { title: 'Positive Teamwork Praises', instructions: 'Praise collective behavior: "I am super proud of how gently both of you shared that crayon."', estimatedTime: '2 mins' },
      { title: 'Cooldown Safe-Space Corner', instructions: 'Draft a visual blueprint map of a positive cooldown corner with your children.', estimatedTime: '10 mins' },
      { title: 'Gratitude Council Feedback', instructions: 'At dinner, have everyone say one thing they appreciate about another family member.', estimatedTime: '5 mins' }
    ]
  },
  {
    id: 'digital-limits',
    title: 'Healthy Digital Habits & Limits',
    description: 'Co-creating balanced digital boundaries, eliminating digital tantrum triggers, and screen-time sunsetting.',
    videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
    tasks: [
      { title: 'Pre-agree Screen Duration', instructions: 'Establish clear, firm screen limits with children before devices are booted.', estimatedTime: '3 mins' },
      { title: 'Interactive Co-Viewing Chat', instructions: 'Sit and watch screen media with your child, asking open questions about the content.', estimatedTime: '15 mins' },
      { title: 'Implement Charging Box Site', instructions: 'Designate a central physical box outside bedrooms where all devices rest overnight.', estimatedTime: '5 mins' },
      { title: 'Tech-Free Dining Sanctuary', instructions: 'Maintain complete absence of phones, iPads, and TVs at dinner, substituting with conversations.', estimatedTime: 'Breakfast & Dinner' },
      { title: 'Interactive Tactile Swap', instructions: 'Replace one hour of idle screens with hands-on molding clay, Lego building, or drawing boards.', estimatedTime: '60 mins' },
      { title: 'Online Consequence Dialogue', instructions: 'Explain to child how digital behavior impacts real people, using gentle terms.', estimatedTime: '10 mins' },
      { title: 'Curation Audit Walkthrough', instructions: 'Sit together to review their apps, pruning addictive ones and selecting educational tools.', estimatedTime: '15 mins' }
    ]
  },
  {
    id: 'independence-chores',
    title: 'Nurturing Self-Reliance & Chores',
    description: 'Empowering children with autonomous choices, natural consequences, and collaborative house chore participation.',
    videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
    tasks: [
      { title: 'Visual Household Routine Map', instructions: 'Draw dynamic comic illustrations of toothbrushing, pajamas, and homework checklist tasks.', estimatedTime: '20 mins' },
      { title: 'Embrace Mastery Failure', instructions: 'When kids struggle with shoelaces or jackets, say: "Take your time, let\'s try together."', estimatedTime: '5 mins' },
      { title: 'Autonomous Choice Practice', instructions: 'Offer two structured routes to chores: "Would you like to sweep the rug or carry napkins?"', estimatedTime: '2 mins' },
      { title: 'Praise Grit & Effort', instructions: 'Focus praise on persistence and work, instead of outcome or raw intelligence.', estimatedTime: '1 min' },
      { title: 'Teach Cleaning Cooperation', instructions: 'Assign a simple daily chore that supports the family group directly (e.g., watering plants).', estimatedTime: '10 mins' },
      { title: 'Guide Problem Solving', instructions: 'When problems crop up, ask child for input instead of solving it for them.', estimatedTime: '5 mins' },
      { title: 'Tackle a Habit Challenge', instructions: 'Log complete checklist items completed this week and celebrate them together.', estimatedTime: '10 mins' }
    ]
  }
];

export default function Learn() {
  const { modules, unlockModuleManually, addNewModule, currentUser, parents } = useApp();
  const [showGenerator, setShowGenerator] = React.useState(false);
  const [selectedTopicPreset, setSelectedTopicPreset] = React.useState<string>('sibling-harmony');
  const [customTopicTitle, setCustomTopicTitle] = React.useState<string>('');
  const [customTopicDesc, setCustomTopicDesc] = React.useState<string>('');
  const [selectedVideo, setSelectedVideo] = React.useState<string>('https://khwahishseth.wistia.com/folders/wx9zawl1d9');

  const handleGenerateModule = () => {
    let title = '';
    let description = '';
    let tasksToEmbed: { title: string, instructions: string, estimatedTime: string }[] = [];

    const nextWeekNumber = modules.length + 1;

    if (selectedTopicPreset === 'custom') {
      title = customTopicTitle ? customTopicTitle.trim() : `Custom Focus Point`;
      description = customTopicDesc ? customTopicDesc.trim() : `Customized objective modules addressing family co-regulation and dynamic communication.`;
      
      tasksToEmbed = [
        { title: `${title} - Observer Checklist`, instructions: `Take 10 minutes today to observe and record triggers related to ${title} without directly intervening.`, estimatedTime: '10 mins' },
        { title: `${title} - Validation Practice`, instructions: `Directly repeat and validate child feelings regarding ${title}: "I hear you, it feels super hard."`, estimatedTime: '5 mins' },
        { title: `${title} - Guided Co-Breathing`, instructions: `Practice three shared deep co-regulation breath loops together when a tension spike occurs.`, estimatedTime: '3 mins' },
        { title: `${title} - Controlled Choice Offer`, instructions: `Empower autonomy by offering two positive alternatives related to ${title}: "Would you like route A or route B?"`, estimatedTime: '2 mins' },
        { title: `${title} - Praise Progress Actions`, instructions: `Observe and specifically praise the micro-actions child made toward solving arguments.`, estimatedTime: '3 mins' },
        { title: `${title} - Visual Plan Sketching`, instructions: `Co-create cartoon rule checklist sheets together with your children to set visual limits.`, estimatedTime: '15 mins' },
        { title: `${title} - Week Reflection Journal`, instructions: `Write down and save one private journal observation celebrating what you and your child achieved this week.`, estimatedTime: '10 mins' }
      ];
    } else {
      const preset = PRESET_TOPICS.find(p => p.id === selectedTopicPreset) || PRESET_TOPICS[0];
      title = preset.title;
      description = preset.description;
      tasksToEmbed = preset.tasks;
    }

    const newModule = {
      id: `m${nextWeekNumber}`,
      title,
      description,
      week: nextWeekNumber,
      unlocked: true,
      progress: 0,
      lessons: [
<<<<<<< HEAD
        { id: `l${nextWeekNumber}-1`, title: `Universal Foundations: ${title}`, duration: '12:30', type: 'video' as const, completed: false, videoUrl: selectedVideo.includes('wistia') ? selectedVideo : 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
        { id: `l${nextWeekNumber}-2`, title: `Empathy-Driven Masterclass`, duration: '08:45', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
        { id: `l${nextWeekNumber}-3`, title: `Weekly Connections Review Game`, duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
<<<<<<< HEAD
        { id: `l${nextWeekNumber}-1`, title: `Universal Foundations: ${title}`, duration: '12:30', type: 'video' as const, completed: false, videoUrl: selectedVideo.includes('wistia') ? selectedVideo : 'https://fast.wistia.net/embed/iframe/eabjoioutk' },
        { id: `l${nextWeekNumber}-2`, title: `Empathy-Driven Masterclass`, duration: '08:45', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/i0iwga8cbj' },
        { id: `l${nextWeekNumber}-3`, title: `Weekly Connections Review Game`, duration: '05:00', type: 'video' as const, completed: false, videoUrl: 'https://fast.wistia.net/embed/iframe/eabjoioutk' }
=======
        { id: `l${nextWeekNumber}-1`, title: `Universal Foundations: ${title}`, duration: '12:30', type: 'video' as const, completed: false, videoUrl: selectedVideo },
        { id: `l${nextWeekNumber}-2`, title: `Empathy-Driven Masterclass`, duration: '08:45', type: 'video' as const, completed: false, videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9' },
        { id: `l${nextWeekNumber}-3`, title: `Weekly Connections Review`, duration: '05:00', type: 'reflection' as const, completed: false }
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
      ]
    };

    const newTasks = tasksToEmbed.map((t, idx) => ({
      id: `t${nextWeekNumber}-${idx + 1}`,
      moduleId: `m${nextWeekNumber}`,
      day: idx + 1,
      title: t.title,
      instructions: t.instructions,
      estimatedTime: t.estimatedTime,
      completed: false
    }));

    addNewModule(newModule, newTasks);

    import('canvas-confetti').then((m) => {
      m.default({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#8bad8b', '#d4a373', '#e9c46a']
      });
    });

    setShowGenerator(false);
    setCustomTopicTitle('');
    setCustomTopicDesc('');
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <header className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sage/10 text-accent-sage rounded-full text-xs font-bold uppercase tracking-wider select-none">
          <Star className="w-3 h-3 fill-current" /> Mastery Path
        </div>
        <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">Your Learning Journey</h1>
        <p className="text-stone-500 max-w-lg mx-auto text-sm leading-relaxed">
          A step-by-step path to parent-child transformation. Take your time, grow consistently.
        </p>
      </header>

      {/* Progress Journey Map */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-stone-100 -translate-x-1/2 rounded-full hidden md:block" />

        <div className="space-y-24 relative">
          {modules.map((module, index) => {
            // Find the target lesson to resume
            const activeLesson = module.lessons.find(l => !l.completed) || module.lessons[0];
            const activeLessonId = activeLesson ? activeLesson.id : 'l1';
            const activeParent = currentUser?.role === 'parent' 
              ? (parents?.find(p => p.phone === currentUser.phone) || currentUser)
              : currentUser;
<<<<<<< HEAD
            const isUnlocked = currentUser?.role === 'admin' || currentUser?.isMentor || module.unlocked || (activeParent && (activeParent.unlockedWeeksList || []).includes(module.week));
=======
<<<<<<< HEAD
            const isUnlocked = currentUser?.role === 'admin' || currentUser?.isMentor || module.unlocked || (activeParent && (activeParent.unlockedWeeksList || []).includes(module.week));
=======
            const isUnlocked = currentUser?.role === 'admin' || currentUser?.isMentor || (activeParent && (activeParent.unlockedWeeksList || []).includes(module.week));
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5

            return (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Module Number visual circle */}
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 shadow-xl",
                    isUnlocked 
                      ? module.progress === 100 
                        ? "bg-accent-sage text-white scale-110" 
                        : "bg-white text-accent-sage border-4 border-accent-sage"
                      : "bg-stone-100 text-stone-300"
                  )}>
                    {isUnlocked ? (
                      module.progress === 100 ? (
                        <CheckCircle2 className="w-10 h-10" />
                      ) : (
                        <span className="text-2xl font-bold font-serif">{module.week}</span>
                      )
                    ) : (
                      <Lock className="w-7 h-7" />
                    )}
                  </div>
                  
                  {/* Orbital Progress Ring */}
                  {isUnlocked && module.progress < 100 && (
                     <div className="absolute inset-[-10px] opacity-20">
                        <svg className="w-full h-full rotate-[-90deg]">
                           <circle 
                             cx="50" cy="50" r="44" 
                             fill="none" 
                             stroke="currentColor" 
                             strokeWidth="3.5" 
                             strokeDasharray="276" 
                             strokeDashoffset={276 - (276 * module.progress) / 100}
                             className="text-accent-sage"
                           />
                        </svg>
                     </div>
                  )}

                  {/* Week Label Desktop Only */}
                  <div className={cn(
                    "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap hidden md:block text-xs font-bold uppercase tracking-wider",
                    isUnlocked ? "text-stone-700" : "text-stone-400"
                  )}>
                    Week {module.week}
                  </div>
                </div>

                {/* Module Content Card */}
                <Card className={cn(
                  "flex-1 w-full max-w-sm overflow-hidden border-none shadow-xl rounded-[2.2rem] transition-all hover:scale-[1.02]",
                  !isUnlocked ? "opacity-60 bg-stone-50" : "bg-white"
                )}>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className={cn(
                        "text-xl font-serif leading-tight",
                        isUnlocked ? "text-stone-900" : "text-stone-500"
                      )}>
                        {module.title}
                      </h3>
                      {isUnlocked && module.progress === 100 && (
                         <span className="bg-accent-sage/10 text-accent-sage text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0">Done</span>
                      )}
                    </div>
                    
                    <p className="text-stone-500 text-xs leading-relaxed leading-[1.6]">
                      {module.description}
                    </p>

                    {isUnlocked ? (
                      <div className="space-y-6 pt-2">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                           <span>{module.lessons.length} Lessons loaded</span>
                           <span>{module.progress}% Progress</span>
                         </div>
                         <Progress value={module.progress} className="h-1.5 bg-stone-100 [&>div]:bg-accent-sage" />
                         
                         {activeLesson ? (
                           <Link
                              to={`/learn/${module.id}/${activeLessonId}`}
                              className={cn(
                                buttonVariants(),
                                "w-full rounded-2xl h-12 text-xs font-bold uppercase tracking-wider shadow-md shadow-black/5 flex items-center justify-center",
                                module.progress === 100 
                                  ? "bg-stone-50 text-stone-900 hover:bg-stone-100 border border-stone-200" 
                                  : "bg-stone-950 text-white hover:bg-stone-800"
                              )}
                            >
                              {module.progress === 100 ? "Review Lessons" : "Continue learning"}
                            </Link>
                         ) : (
                           <div className="text-xs text-stone-400 text-center italic py-2">No active lessons configured yet.</div>
                         )}
                      </div>
                    ) : (
                      <div className="pt-4 space-y-4" onClick={e => e.stopPropagation()}>
                         <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <Clock className="w-5 h-5 text-stone-400" />
                            <div>
                              <p className="text-[9px] uppercase font-bold text-stone-400">Automatic Unlock</p>
                              <p className="text-xs font-bold text-stone-600">Locked in sequence</p>
                            </div>
                         </div>

                         {currentUser?.role === 'admin' ? (
                           <Button 
                             onClick={() => {
                               unlockModuleManually(module.id, true);
                               import('canvas-confetti').then((m) => {
                                 m.default({
                                   particleCount: 85,
                                   spread: 75,
                                   origin: { y: 0.7 },
                                   colors: ['#8bad8b', '#d4a373', '#f2e8cf']
                                 });
                               });
                             }} 
                             className="w-full rounded-2xl h-12 bg-accent-sage hover:bg-accent-sage/90 text-stone-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                           >
                             🔓 Admin Bypass: Unlock Week {module.week}
                           </Button>
                         ) : (
                           <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                             <p className="text-xs font-bold text-amber-800 text-center flex items-center justify-center gap-1.5 font-sans">
                               🔒 Awaiting Admin Permission
                             </p>
                             <p className="text-[11px] text-amber-700 text-center mt-1 leading-relaxed">
                               This clinical module is currently locked. Your parenting supervisor will unlock it from the admin console when your cohort is ready.
                             </p>
                           </div>
                         )}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                         {currentUser?.role === 'admin' && (
                           <div className="p-4 bg-accent-warm/5 rounded-2xl border border-accent-warm/10">
                              <p className="text-[11px] text-stone-500 leading-normal">
                                Unlock this week instantly using the option above or via the <Link to="/admin" className="font-extrabold text-accent-warm underline">Admin panel</Link>.
                              </p>
                           </div>
                         )}
<<<<<<< HEAD
=======
=======
                         <div className="p-4 bg-accent-warm/5 rounded-2xl border border-accent-warm/10">
                            <p className="text-[11px] text-stone-500 leading-normal">
                              Unlock this week instantly using the option above or via the <Link to="/admin" className="font-extrabold text-accent-warm underline">Admin panel</Link>.
                            </p>
                         </div>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
          {/* Locked future indicator - Enabled for Admin and passive lock card for Parents */}
          {currentUser?.role === 'admin' ? (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowGenerator(true)}
              className="flex flex-col items-center justify-center gap-4 py-10 px-6 rounded-[2.5rem] border-2 border-dashed border-stone-300 hover:border-accent-sage bg-stone-50/50 hover:bg-stone-50/90 transition-all cursor-pointer select-none max-w-sm mx-auto shadow-sm"
            >
               <div className="w-16 h-16 rounded-full bg-accent-sage/10 text-accent-sage flex items-center justify-center animate-pulse">
                  <Star className="w-7 h-7 fill-current" />
               </div>
               <div className="text-center space-y-1">
                  <h4 className="text-lg font-serif text-stone-850">Explore Coming Soon Weeks</h4>
                  <p className="text-stone-500 text-xs px-4">
                    All previous contents unlocked? Click here to dynamically generate and explore Week {modules.length + 1} customized path with new videos and assignments!
                  </p>
               </div>
               <span className="text-[10px] bg-accent-sage text-stone-900 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest mt-2">
                  🔓 Click to Unlock More (Admin)
                </span>
            </motion.div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center gap-4 py-10 px-6 rounded-[2.5rem] border border-dashed border-stone-200 bg-stone-50/20 select-none max-w-sm mx-auto text-center font-sans"
            >
               <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
               </div>
               <div className="text-center space-y-1">
                  <h4 className="text-base font-serif text-stone-800">Future Weeks Locked</h4>
                  <p className="text-stone-400 text-xs px-4 leading-relaxed font-sans">
                    Week {modules.length + 1} and subsequent clinical content will be unlocked by your parenting supervisor when the cohort is ready.
                  </p>
               </div>
               <span className="text-[10px] bg-stone-100 text-stone-500 font-mono px-3 py-1 rounded-full uppercase tracking-wider font-bold mt-2">
                  🔒 Admin Managed Content
               </span>
            </div>
          )}
<<<<<<< HEAD
=======
=======
          {/* Locked future indicator - Now Interactive Dynamic Pathway Builder */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowGenerator(true)}
            className="flex flex-col items-center justify-center gap-4 py-10 px-6 rounded-[2.5rem] border-2 border-dashed border-stone-300 hover:border-accent-sage bg-stone-50/50 hover:bg-stone-50/90 transition-all cursor-pointer select-none max-w-sm mx-auto shadow-sm"
          >
             <div className="w-16 h-16 rounded-full bg-accent-sage/10 text-accent-sage flex items-center justify-center animate-pulse">
                <Star className="w-7 h-7 fill-current" />
             </div>
             <div className="text-center space-y-1">
                <h4 className="text-lg font-serif text-stone-850">Explore Coming Soon Weeks</h4>
                <p className="text-stone-500 text-xs px-4">
                  All previous contents unlocked? Click here to dynamically generate and explore Week {modules.length + 1} customized path with new videos and assignments!
                </p>
             </div>
             <span className="text-[10px] bg-accent-sage text-stone-900 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest mt-2">
                🔓 Click to Unlock More
              </span>
          </motion.div>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        </div>
      </div>

      {/* Dynamic Module & Weekly Tasks Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] p-6 lg:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative border border-stone-100"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowGenerator(false)}
                className="absolute right-6 top-6 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest text-accent-sage bg-accent-sage/10 px-2.5 py-1 rounded">
                  <Star className="w-3.5 h-3.5 fill-current" /> week {modules.length + 1} Dynamic Pathway
                </span>
                <h3 className="text-2xl font-serif text-stone-900 leading-tight">Unlock Next Learning Horizon</h3>
                <p className="text-xs text-stone-500">Choose from pre-designed professional channels or customize an AI-crafted parenting direction.</p>
              </div>

              {/* Presets Grid */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Select Core Practice Area</label>
                <div className="grid gap-3">
                  {PRESET_TOPICS.map((p) => {
                    const isSelected = selectedTopicPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedTopicPreset(p.id);
                          setCustomTopicTitle('');
                          setCustomTopicDesc('');
                        }}
                        className={cn(
                          "p-4 rounded-2xl text-left border transition-all text-xs flex gap-3 relative cursor-pointer",
                          isSelected 
                            ? "border-stone-900 bg-stone-900 text-white shadow-lg" 
                            : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                        )}
                      >
                        <div className="bg-accent-sage/15 rounded-xl p-2 h-10 w-10 shrink-0 flex items-center justify-center text-accent-sage">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm">{p.title}</h4>
                          <p className={cn("text-[11px]", isSelected ? "text-stone-300" : "text-stone-500")}>{p.description}</p>
                        </div>
                      </button>
                    )
                  })}

                  {/* Custom Topic Selection */}
                  <button
                    onClick={() => setSelectedTopicPreset('custom')}
                    className={cn(
                      "p-4 rounded-2xl text-left border transition-all text-xs flex gap-3 relative cursor-pointer",
                      selectedTopicPreset === 'custom' 
                        ? "border-stone-900 bg-stone-900 text-white shadow-lg" 
                        : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                    )}
                  >
                    <div className="bg-accent-warm/15 rounded-xl p-2 h-10 w-10 shrink-0 flex items-center justify-center text-accent-warm">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm">Create Fully Customized Coaching Week</h4>
                      <p className={cn("text-[11px]", selectedTopicPreset === 'custom' ? "text-stone-300" : "text-stone-500")}>Specify your own parenting issue, triggers, or developmental targets.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom input fields */}
              {selectedTopicPreset === 'custom' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-1"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Custom Pathway Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Navigating Sleep Regressions & Quiet Nights" 
                      className="w-full h-11 px-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
                      value={customTopicTitle}
                      onChange={e => setCustomTopicTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Core Objectives Description</label>
                    <textarea 
                      placeholder="e.g. Gentle sleep coaching templates, creating sleepy sleep associations and preventing bedtime anxiety." 
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 h-20 resize-none"
                      value={customTopicDesc}
                      onChange={e => setCustomTopicDesc(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* Select YouTube Coaching Video */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Select Interactive Coaching Video Session</label>
                <select 
                  className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-850 focus:outline-none"
                  value={selectedVideo}
                  onChange={e => setSelectedVideo(e.target.value)}
                >
                  <option value="https://khwahishseth.wistia.com/folders/wx9zawl1d9">Remix Co-Regulation Wistia Folder (wx9zawl1d9)</option>
                </select>
              </div>

              {/* Action Submit */}
              <div className="pt-2 flex gap-3">
                <Button 
                  onClick={() => setShowGenerator(false)}
                  variant="outline"
                  className="rounded-2xl h-12 w-1/3 border-stone-200 font-bold text-xs uppercase text-stone-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateModule}
                  disabled={selectedTopicPreset === 'custom' && !customTopicTitle.trim()}
                  className="rounded-2xl h-12 flex-1 bg-accent-sage hover:bg-accent-sage/95 text-stone-900 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-accent-sage/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Generate Week {modules.length + 1}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Floating help/encouragement */}
      <div className="fixed bottom-24 lg:bottom-12 right-4 lg:right-12">
         <motion.div 
           initial={{ scale: 0, rotate: -20 }}
           animate={{ scale: 1, rotate: 0 }}
           className="bg-accent-warm p-4 rounded-full shadow-2xl text-white cursor-pointer hover:scale-110 active:scale-95 transition-all"
         >
            <Heart className="w-6 h-6 fill-current" />
         </motion.div>
      </div>
    </div>
  );
}
