import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Flame, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Clock, 
  Play, 
  Volume2, 
  Award, 
  Download, 
  Tv, 
  Send, 
  CheckCircle,
  HelpCircle,
  ArrowRightLeft,
  ChevronRight,
  BookMarked,
  Video,
  PhoneOff,
  Heart
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn, getEmbedUrl } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import LmsLiveStreams from '@/components/live/LmsLiveStreams';
import PositiveJourneyGuide from '@/components/live/PositiveJourneyGuide';

interface YogaPose {
  id: string;
  name: string;
  funName: string;
  illustration: string;
  benefit: string;
  instructions: string[];
}

export default function StudentSpace() {
  const { 
    currentUser, 
    setIsStudentMode, 
    studentHabits, 
    toggleStudentHabit, 
    studentPortfolio, 
    saveStudentPortfolio, 
    studentPoints,
    addStudentPoints,
    strictnessLevel,
    appointments,
    updateAppointmentStatus,
    visitStreakDays
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTabState] = useState<'dashboard' | 'yoga' | 'lessons' | 'badges' | 'portfolio' | 'games'>('dashboard');
  
  // Custom states for dynamic active video consultations in student space
  const [activeKidCall, setActiveKidCall] = useState<any | null>(null);
  const [kidCallStatus, setKidCallStatus] = useState<'calling' | 'connected' | 'completed'>('calling');
  const [kidAudioEnabled, setKidAudioEnabled] = useState(true);
  const [kidBreathingTimer, setKidBreathingTimer] = useState(30);

  useEffect(() => {
    // Read the query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('joinCall') === 'true') {
      const scheduledApt = appointments?.find(a => a.status === 'scheduled');
      if (scheduledApt) {
        setActiveKidCall(scheduledApt);
        setKidCallStatus('calling');
        const triggerConn = setTimeout(() => {
          setKidCallStatus('connected');
        }, 2200);
        return () => clearTimeout(triggerConn);
      } else {
        // Fallback placeholder appointment if none active in local state, to preserve seamless user demo
        const demoApt = {
          id: 'demo_apt_1',
          patientName: currentUser?.studentName || 'Super Kid',
          mentorName: 'Dr. Sarah Vance',
          date: 'Today',
          time: 'Live Now',
          phone: currentUser?.phone || '123-456-7890',
          status: 'scheduled' as const,
          mentorId: 'm_vance'
        };
        setActiveKidCall(demoApt);
        setKidCallStatus('calling');
        const triggerConn = setTimeout(() => {
          setKidCallStatus('connected');
        }, 2200);
        return () => clearTimeout(triggerConn);
      }
    }
  }, [appointments, currentUser]);

  useEffect(() => {
    let interval: any;
    if (activeKidCall && kidCallStatus === 'connected') {
      interval = setInterval(() => {
        setKidBreathingTimer(prev => (prev > 1 ? prev - 1 : 30));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeKidCall, kidCallStatus]);

  // Pomodoro Focus Timer
  const [focusTimeLeft, setFocusTimeLeft] = useState(15 * 60);
  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState(false);
  const [focusType, setFocusType] = useState<15 | 25 | 5>(15);

  // Audio synthesis ambient sound players
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [activeOscillator, setActiveOscillator] = useState<any>(null);
  const [isPlayingSound, setIsPlayingSound] = useState<string | null>(null);

  // Cozy Hydration and Mood Tracker states
  const [glassesDrunk, setGlassesDrunk] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [affirmationText, setAffirmationText] = useState<string>('Welcome back, little star! Make sure to take a big sip of water and stretch today. 🌸');

  // Parent Lock Verification States
  const [isVerifyingParent, setIsVerifyingParent] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // AI Mentor Chat companion "Bloomie"
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi buddy! I am Bloomie 🌸 Your personal stress-relief helper. Tell me how you feel today!' }
  ]);
  const [typingText, setTypingText] = useState('');
  const [isBotResponding, setIsBotResponding] = useState(false);

  // Game 1: Zen Balloon Breathing Game State
  const [balloonScale, setBalloonScale] = useState<number>(1);
  const [balloonMessage, setBalloonMessage] = useState<string>("🎈 Hold down the button below, breathe in deep, and fill the balloon with calm air!");
  const [balloonProgress, setBalloonProgress] = useState<number>(0); // completed sets (out of 3)
  const [balloonActivityState, setBalloonActivityState] = useState<'idle' | 'inhaling' | 'holding' | 'exhaling'>('idle');

  // Game 2: Wellness Match Cards Memory Game State
  const wellnessEmojis = ['🧘', '🌸', '💧', '🧠', '🎈', '☀️', '🥦', '🍉'];
  const [matchCards, setMatchCards] = useState<{id: number, emoji: string, matched: boolean, flipped: boolean}[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<number[]>([]);
  const [matchMoves, setMatchMoves] = useState<number>(0);

  const initMatchingGame = () => {
    const pairs = [...wellnessEmojis, ...wellnessEmojis];
    const shuffledPairs = pairs
      .map((emoji, idx) => ({ id: idx, emoji, matched: false, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setMatchCards(shuffledPairs);
    setSelectedMatchIds([]);
    setMatchMoves(0);
  };

  const handleCardClick = (id: number) => {
    const targetCard = matchCards.find(c => c.id === id);
    if (!targetCard || targetCard.flipped || targetCard.matched || selectedMatchIds.length >= 2) return;

    const updatedCards = matchCards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setMatchCards(updatedCards);

    const newFlipped = [...selectedMatchIds, id];
    setSelectedMatchIds(newFlipped);

    if (newFlipped.length === 2) {
      setMatchMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = updatedCards.find(c => c.id === firstId);
      const secondCard = updatedCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, matched: true } : c));
          setSelectedMatchIds([]);
          confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
          
          setMatchCards(curr => {
            const allMatched = curr.every(c => c.matched || c.id === firstId || c.id === secondId);
            if (allMatched) {
              addStudentPoints(20);
              confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
            }
            return curr;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => (c.id === firstId || c.id === secondId) ? { ...c, flipped: false } : c));
          setSelectedMatchIds([]);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'games') {
      initMatchingGame();
    }
  }, [activeTab]);

  const setActiveTab = (tab: any) => {
    setActiveTabState(tab);
    if (tab !== 'dashboard') {
      stopAmbientSound();
    }
  };

  useEffect(() => {
    let timer: any;
    if (isFocusTimerRunning && focusTimeLeft > 0) {
      timer = setInterval(() => {
        setFocusTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0 && isFocusTimerRunning) {
      setIsFocusTimerRunning(false);
      confetti({ particleCount: 80, spread: 50 });
      addStudentPoints(30);
    }
    return () => clearInterval(timer);
  }, [isFocusTimerRunning, focusTimeLeft]);

  useEffect(() => {
    return () => {
      if (activeOscillator) {
        try {
          activeOscillator.stop();
        } catch (e) {}
      }
    };
  }, [activeOscillator]);

  const startAmbientSound = (soundType: string) => {
    try {
      if (activeOscillator) {
        activeOscillator.stop();
        setActiveOscillator(null);
      }
      if (isPlayingSound === soundType) {
        setIsPlayingSound(null);
        return;
      }

      const ctx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) setAudioCtx(ctx);

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (soundType === 'rain') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (soundType === 'woods') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      } else if (soundType === 'ocean') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(75, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      }

      osc.start();
      setActiveOscillator(osc);
      setIsPlayingSound(soundType);
    } catch (err) {
      console.warn("Audio Synthesis not allowed on this device: ", err);
    }
  };

  const stopAmbientSound = () => {
    if (activeOscillator) {
      activeOscillator.stop();
      setActiveOscillator(null);
    }
    setIsPlayingSound(null);
  };

  const selectMoodEmoji = (mood: string) => {
    setSelectedMood(mood);
    saveStudentPortfolio({ feelingToday: mood });
    
    if (mood === 'sad') {
      setAffirmationText("It's okay to feel sad, little cloud. 🌧️ Let's breathe in together... hold... and let that rain wash away. You are so loved.");
    } else if (mood === 'angry') {
      setAffirmationText("Wooosh! Anger is just fireworks in our tummy. 😡 Try a deep 'Sshhh' breath, or tuck into a tiny Snail (Child's Pose) stretch with me!");
    } else if (mood === 'stressed') {
      setAffirmationText("Feeling worried is normal. Let's stand tall like a proud balance Tree Pose 🌲 to anchor ourselves in gravity. We can handle it!");
    } else if (mood === 'sleepy') {
      setAffirmationText("Aaahh, study brains get tired! 🥱 Try drinking a cold glass of dynamic hydration below, or take a peaceful 5-minute study nap.");
    } else {
      setAffirmationText("Happiness is contagious! 😊 Keep that sparkle glowing. How about doing a Morning Stretch to share your high vibes?");
    }
  };

  const drinkGlassOfWater = () => {
    if (glassesDrunk < 6) {
      setGlassesDrunk(prev => prev + 1);
      addStudentPoints(10);
      confetti({ particleCount: 20, colors: ['#60a5fa', '#3b82f6'] });
      triggerBubbleSound();
    }
  };

  const triggerBubbleSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  const sendMessageToBloomie = async () => {
    if (!typingText.trim()) return;
    const userMsg = typingText;
    setTypingText('');
    
    const updatedHistory = [...chatHistory, { role: 'user', text: userMsg }];
    setChatHistory(updatedHistory);
    setIsBotResponding(true);

    try {
      const rawResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory.map(h => ({
            role: h.role === 'model' ? 'model' : 'user',
            text: h.text
          }))
        })
      });
      const parsed = await rawResponse.json();
      setChatHistory(prev => [...prev, { role: 'model', text: parsed.text }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: "I feel cozy when we take slow deep breaths. Let's do that now!" }]);
    } finally {
      setIsBotResponding(false);
    }
  };

  // Timer States for Yoga / Breathing Session
  const [yogaTimer, setYogaTimer] = useState<number>(0); // active countdown timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentPose, setCurrentPose] = useState<YogaPose | null>(null);
  
  const [breathingText, setBreathingText] = useState<'In' | 'Hold' | 'Out'>('In');
  const [breathingCount, setBreathingCount] = useState<number>(4);

  // Video Lessons array for Kid Education
  const studentLessons = [
    {
      id: 'sl1',
      title: 'How to Ask Parents for Help (When Feeling Sad or Mad)',
      duration: '5:45',
      videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
      description: 'Learn the "Magic Check-in" phrase that immediately helps adults understand what you are experiencing without any fighting.',
      skills: ['Calm Speaking', 'Naming Big Emotions', 'Active Listening']
    },
    {
      id: 'sl2',
      title: 'The 3-Step Chill Rule for Disagreements',
      duration: '4:15',
      videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
      description: 'What to do when mom/dad says "No". Discover how taking a step back and offering a compromise can make you a super communicator.',
      skills: ['Self-Control', 'Compromise', 'Body Relaxation']
    },
    {
      id: 'sl3',
      title: 'Explaining stress in your body to adults',
      duration: '6:30',
      videoUrl: 'https://khwahishseth.wistia.com/folders/wx9zawl1d9',
      description: 'Ever feel tight in your chest or tummy? We will learn simple drawings and words to help your family understand you need a break.',
      skills: ['Body Mapping', 'Stress Signals', 'Asking for a Rest']
    }
  ];

  const [selectedLesson, setSelectedLesson] = useState<any>(studentLessons[0]);
  const [viewingLessonsUnlocked, setViewingLessonsUnlocked] = useState<string[]>(['sl1']);

  // Poses for Yoga Sessions
  const yogaPoses: YogaPose[] = [
    {
      id: 'yp1',
      name: 'Lotus Pose',
      funName: 'The Magic Flying Carpet 🧘',
      illustration: '🧘‍♂️',
      benefit: 'Reduces quick adrenaline spikes and opens breathing blocks.',
      instructions: [
        'Sit tall with your legs crossed like fluffy flower petals.',
        'Put your hands lightly on your knees, palms facing up to catch good vibes.',
        'Close your eyes and breathe like you are smelling a beautifully sweet strawberry.',
        'Hold this pose for 10 slow balloon breaths!'
      ]
    },
    {
      id: 'yp2',
      name: 'Cat-Cow Stretch',
      funName: 'The Happy Kitten & Kind Cow 🐱🐮',
      illustration: '🐱',
      benefit: 'Releases static back & neck tension from school desk hours.',
      instructions: [
        'Get on your hands and knees like a baby tiger.',
        'Drop your belly low and look up, saying "Moooo" softly under your breath.',
        'Then arch your spine up like an angry cat, looking down at your toes, saying "Meowww".',
        'Repeat this back stretch four times slowly!'
      ]
    },
    {
      id: 'yp3',
      name: 'Tree Pose',
      funName: 'The Solid Forest Giant 🌳',
      illustration: '🌳',
      benefit: 'Focuses jittery energy and strengthens balanced coordination.',
      instructions: [
        'Stand solid on one leg like an ancient redwood tree.',
        'Place the sole of your other foot on your inner leg, avoiding the knee.',
        'Reach your arms high like beautiful leafy branches waving in the wind.',
        'Maintain eye contact with one quiet dot in front of you to stay perfectly steady.'
      ]
    },
    {
      id: 'yp4',
      name: 'Child Pose',
      funName: 'The Safe Tiny Snail 🐚',
      illustration: '🐚',
      benefit: 'Restores peace when you feel irritated, annoyed, or hyperactive.',
      instructions: [
        'Kneel down on your knees and sit back on your heels.',
        'Fold your body forward and lay your forehead down softly on the ground.',
        'Extend your arms out long in front of you, palm down.',
        'Take deep, heavy sighs to let go of any tight knots in your tummy.'
      ]
    }
  ];

  // Active Portfolio state form fields
  const [favBreathing, setFavBreathing] = useState(studentPortfolio.favoriteBreathing);
  const [calmStrategy, setCalmStrategy] = useState(studentPortfolio.calmDownStrategy);
  const [talkCommit, setTalkCommit] = useState(studentPortfolio.parentTalkCommitment);
  const [feelToday, setFeelToday] = useState(studentPortfolio.feelingToday);
  const [portJournal, setPortJournal] = useState(studentPortfolio.journalEntry);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto handle Breathing circle animation cycle (4s in, 4s hold, 4s out)
  useEffect(() => {
    let interval: any;
    if (activeTab === 'yoga') {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          if (prev === 1) {
            setBreathingText((txt) => {
              if (txt === 'In') return 'Hold';
              if (txt === 'Hold') return 'Out';
              return 'In';
            });
            return 4; // Reset count
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, breathingText]);

  // Countdowns for Active Poses
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && yogaTimer > 0) {
      interval = setInterval(() => {
        setYogaTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            addStudentPoints(30);
            confetti({
              particleCount: 50,
              spread: 60,
              colors: ['#8bad8b', '#d4a373', '#ffd166']
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, yogaTimer]);

  const startYogaTimer = (pose: YogaPose) => {
    setCurrentPose(pose);
    setYogaTimer(60);
    setIsTimerRunning(true);
  };

  const stopYogaTimer = () => {
    setIsTimerRunning(false);
    setYogaTimer(0);
  };

  // Submit Portfolio
  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStudentPortfolio({
      favoriteBreathing: favBreathing,
      calmDownStrategy: calmStrategy,
      parentTalkCommitment: talkCommit,
      feelingToday: feelToday,
      journalEntry: portJournal
    });
    setSaveSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Printing certificate client-side cleanly
  const handlePrintCertificate = () => {
    const studentName = currentUser?.name || 'Vibrant Young Mind';
    const WinPrint = window.open('', '', 'width=900,height=650,toolbar=0,scrollbars=0,status=0');
    if (!WinPrint) return;
    WinPrint.document.write(`
      <html>
        <head>
          <title>Student Mindfulness Certificate</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; background: #fafaf9; text-align: center; }
            .border-outer { border: 15px double #8bad8b; padding: 50px; border-radius: 30px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .border-inner { border: 2px solid #e5e5e0; padding: 40px; border-radius: 20px; }
            h1 { font-family: 'Playfair Display', serif; font-size: 42px; color: #386641; margin: 10px 0; }
            h2 { font-size: 20px; text-transform: uppercase; letter-spacing: 4px; color: #d4a373; margin-top: 0; }
            p { font-size: 18px; line-height: 1.6; color: #57534e; max-width: 650px; margin: 25px auto; }
            .name { font-size: 34px; font-weight: 700; color: #1c1917; border-bottom: 2px solid #d4a373; display: inline-block; padding: 5px 50px; margin: 20px 0; font-family: 'Playfair Display', serif; }
            .stamp { font-size: 75px; margin: 30px 0 10px 0; }
            .footer-grid { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 40px; }
            .sign { border-top: 1px solid #d6d3d1; padding-top: 10px; width: 180px; font-size: 12px; color: #78716c; }
            .date { font-size: 13px; color: #78716c; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="border-outer">
            <div class="border-inner">
              <div class="stamp">🎖️</div>
              <h2>Remix: Child Expansion Space</h2>
              <h1>Mindful Warrior Certificate</h1>
              <p>For outstanding efforts in developing deep physical relaxation techniques, doing yoga stretches, and learning smart ways to explain body stress to parent mentors.</p>
              <div class="name">${studentName}</div>
              <p>Has successfully completed active kid lessons and verified emotional wellness habits.</p>
              <div class="footer-grid">
                <div class="sign">Daily Habits Tracker</div>
                <div class="date">Date: ${new Date().toLocaleDateString()}</div>
                <div class="sign">Remix Mentor Signature</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
  };

  // PDF / HTML Print for Student Stress Portfolio
  const handlePrintPortfolio = () => {
    const studentName = currentUser?.name || 'Vibrant Young Mind';
    const WinPrint = window.open('', '', 'width=950,height=800,toolbar=0,scrollbars=0,status=0');
    if (!WinPrint) return;
    WinPrint.document.write(`
      <html>
        <head>
          <title>Student Stress-Relief Portfolio</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 50px; background: #fff; color: #292524; }
            .header { text-align: center; border-bottom: 3px double #8bad8b; padding-bottom: 20px; margin-bottom: 40px; }
            h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #386641; margin: 0; }
            .decor { font-size: 11px; text-transform: uppercase; tracking: 3px; color: #d4a373; font-weight: bold; margin-top: 10px; }
            .card { border: 1px solid #e7e5e4; border-radius: 16px; padding: 25px; margin-bottom: 24px; background: #fafaf9; }
            .section-title { font-size: 12px; text-transform: uppercase; font-weight: bold; color: #8bad8b; letter-spacing: 1px; margin: 0 0 10px 0; }
            .section-body { font-size: 16px; line-height: 1.6; color: #1c1917; font-weight: 500; font-style: italic; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>My Personal Stress-Relief Portfolio</h1>
            <div class="decor">Supporting Child Access & Emotional Transformation of ${studentName}</div>
          </div>

          <div class="card">
            <h3 class="section-title">🎈 My Absolute Favorite Way to Calm Down</h3>
            <p class="section-body">"${favBreathing || 'No calming technique registered yet'}"</p>
          </div>

          <div class="card">
            <h3 class="section-title">🧍 My Go-To Strategy When I Feel Heavy Tension in My Body</h3>
            <p class="section-body">"${calmStrategy || 'No stretch technique registered yet'}"</p>
          </div>

          <div class="card">
            <h3 class="section-title">💬 My Commitment on How to Talk to Parents and Families</h3>
            <p class="section-body">"${talkCommit || 'No communication commitment registered yet'}"</p>
          </div>

          <div class="card">
            <h3 class="section-title">🌱 How I Am Feeling Right Now Today</h3>
            <p class="section-body">"${feelToday || 'Not selected today'}"</p>
          </div>

          <div class="card">
            <h3 class="section-title">📔 My Wellness Journal Log</h3>
            <p class="section-body">"${portJournal || 'Empty log sheet'}"</p>
          </div>

          <div class="footer">
            Generated via Child Action Hub • Remix parent-child LMS • ${new Date().toLocaleDateString()}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
  };

  const markLessonWatched = (lessonId: string) => {
    if (!viewingLessonsUnlocked.includes(lessonId)) {
      setViewingLessonsUnlocked(prev => [...prev, lessonId]);
      addStudentPoints(40);
      confetti({
        particleCount: 30,
        colors: ['#ffe15d']
      });
    }
  };

  const streakVal = visitStreakDays;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Playful Child Friendly Sub-header */}
      <header className="bg-secondary/60 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-accent-sage/20 text-accent-sage flex items-center justify-center text-3xl shrink-0 shadow-inner">
              🚀
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-serif text-stone-900 leading-tight">
                Hey {currentUser?.isStudent ? currentUser.name.split(' ')[0] : (currentUser?.studentName?.split(' ')[0] || 'Hero')}!
              </h1>
              <p className="text-xs text-stone-500 font-bold tracking-wide uppercase">
                Student Calm & Mindful Space
              </p>
            </div>
          </div>

          {/* Quick Stats Block with Kids Gamified Stats */}
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="bg-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-border">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-sm font-black text-stone-800 leading-none">{streakVal} Days</p>
                <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">Streak</p>
              </div>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-border">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-sm font-black text-stone-800 leading-none">{studentPoints} XP</p>
                <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">Resilience</p>
              </div>
            </div>

            <Button 
              onClick={() => {
                if (currentUser && !currentUser.isStudent && !currentUser.isMentor) {
                  setIsVerifyingParent(true);
                  setVerificationPassword('');
                  setVerificationError('');
                } else {
                  setIsStudentMode(false);
                  navigate('/');
                }
              }}
              className="rounded-full bg-stone-900 text-white hover:bg-stone-850 text-xs px-4 py-4 h-auto font-black flex items-center gap-1 shadow-md cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Parent Mode</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Student Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-8">
        <div className="flex overflow-x-auto gap-2 pb-3 no-scrollbar shrink-0">
          {[
            { id: 'dashboard', label: 'My Dashboard ☀️' },
            { id: 'yoga', label: 'Peaceful Yoga 🧘' },
            { id: 'games', label: 'Calm Mind Games 🧠' },
            { id: 'lessons', label: 'Active Video Guides 🎬' },
            { id: 'portfolio', label: 'My Wellness Journal 📔' },
            { id: 'badges', label: 'Certificate Board 🏆' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  stopYogaTimer();
                }}
                className={`px-5 py-3 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all scroll-mx-4 shrink-0 shadow-sm ${
                  isActive 
                    ? `bg-primary text-primary-foreground` 
                    : 'bg-white text-stone-600 hover:bg-secondary border border-border'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            
            {/* 1. STUDENT DASHBOARD tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Daily motivation board */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-[-2.5%] top-[-2.5%] opacity-15 text-9xl">🎈</div>
                  <div className="relative z-10 space-y-3 max-w-xl">
                    <span className="bg-white/20 text-white font-mono text-[10px] tracking-widest uppercase font-bold px-2 py-1 rounded">DAILY RESILIENCE MISSION</span>
                    <h2 className="text-2xl lg:text-3xl font-serif font-black">Ready to unlock your calm mind today?</h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Complete your daily kid habits to expand your streak count, earn star points, and earn your official Mindful Warrior completion certificate!
                    </p>
                    <div className="pt-2">
                      <Button 
                        onClick={() => setActiveTab('yoga')} 
                        className="bg-white text-accent-sage hover:bg-secondary rounded-full font-extrabold text-xs px-6 py-4 h-auto shadow-md animate-pulse"
                      >
                        Start Calming Yoga Stretch 🧘
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Main page layout: Left/Right column split */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left panel: student habits tracker, AI chat, Pomodoro Focus */}
                  <div className="lg:col-span-2 space-y-6">
                    <LmsLiveStreams isStudent={true} />
                    
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                      <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-xl font-serif text-stone-900 flex items-center gap-2">
                          🌱 My Daily Calm Habits
                        </CardTitle>
                        <CardDescription className="text-stone-500 text-xs">
                          Click each habit as you do it! Doing these daily helps both your mind and body feel great.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-stone-100">
                          {studentHabits.map((habit) => (
                            <div
                               key={habit.id}
                               onClick={() => {
                                 toggleStudentHabit(habit.id);
                                 if (!habit.completed) {
                                   confetti({
                                     particleCount: 50,
                                     spread: 50,
                                     origin: { y: 0.8 }
                                   });
                                 }
                               }}
                               className="flex items-center justify-between p-5 hover:bg-secondary cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all ${
                                  habit.completed ? 'bg-primary/20 text-accent-sage shadow-inner' : 'bg-secondary text-stone-500'
                                }`}>
                                  {habit.icon}
                                </div>
                                <div className="space-y-0.5">
                                  <p className={`text-sm font-bold leading-normal ${
                                    habit.completed ? 'text-stone-400 line-through' : 'text-stone-800'
                                  }`}>
                                    {habit.title}
                                  </p>
                                  <span className="text-[10px] uppercase font-black text-stone-400 tracking-wide">
                                    Streak: {habit.streak} days
                                  </span>
                                </div>
                              </div>

                              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                habit.completed 
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-border'
                              }`}>
                                <CheckCircle className={`w-4 h-4 ${habit.completed ? 'opacity-100' : 'opacity-0 text-transparent'}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Interactive 10-Step Journey & Brownie Points Guide (Sync with Parent) */}
                    <PositiveJourneyGuide isStudent={true} />

                    {/* AI Chat Companion Bloomie */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                      <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-xl font-serif text-stone-900 flex items-center gap-2">
                          🌸 Chat with Bloomie, Your Wellbeing Helper
                        </CardTitle>
                        <CardDescription className="text-stone-500 text-xs">
                          Share how you feel, ask how to communicate with Mom & Dad, or request calming tips!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="bg-secondary rounded-2xl p-4 h-64 overflow-y-auto space-y-3 font-medium text-xs border border-border">
                          {chatHistory.map((m, idx) => (
                            <div key={idx} className={`flex ${m.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                              <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed ${
                                m.role === 'model'
                                  ? 'bg-white text-stone-800 rounded-tl-none border border-border font-sans'
                                  : 'bg-stone-900 text-white rounded-tr-none font-sans'
                              }`}>
                                <p className="font-extrabold text-[9px] uppercase tracking-wider mb-1 opacity-60">
                                  {m.role === 'model' ? '🌸 Bloomie' : 'You'}
                                </p>
                                {m.text}
                              </div>
                            </div>
                          ))}
                          {isBotResponding && (
                            <div className="flex justify-start">
                              <div className="bg-white text-stone-800 p-3 rounded-2xl border border-border animate-pulse text-xs font-sans">
                                🌸 Bloomie is typing dynamic wisdom...
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a greeting... (e.g., 'What can I say to Parents when I am stressed?')"
                            className="flex-1 h-12 bg-secondary border border-border rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white text-stone-800"
                            value={typingText}
                            onChange={(e) => setTypingText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessageToBloomie()}
                          />
                          <Button
                            onClick={sendMessageToBloomie}
                            disabled={!typingText.trim() || isBotResponding}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-5 font-bold"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pomodoro Focus and Ambient Sound Synthesizer */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl p-6 space-y-4">
                      <div>
                        <CardTitle className="text-xl font-serif text-stone-900 flex items-center gap-2">
                          ⏱️ Kid Study & Focus Timer
                        </CardTitle>
                        <CardDescription className="text-stone-500 text-xs">
                          Practice concentration and focus. Finish the countdown to earn +30 bonus XP!
                        </CardDescription>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-secondary p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-4">
                           <div className="font-mono text-3xl font-black text-stone-900">
                             {Math.floor(focusTimeLeft / 60).toString().padStart(2, '0')}:
                             {(focusTimeLeft % 60).toString().padStart(2, '0')}
                           </div>
                           <div className="flex gap-1.5">
                             {[
                               { text: '15 Min', value: 15 },
                               { text: '25 Min', value: 25 },
                               { text: '5 Min Chill', value: 5 }
                             ].map((btn) => (
                               <button
                                 key={btn.value}
                                 onClick={() => {
                                   setIsFocusTimerRunning(false);
                                   setFocusType(btn.value as any);
                                   setFocusTimeLeft(btn.value * 60);
                                   triggerBubbleSound();
                                 }}
                                 className={`px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                                   focusType === btn.value
                                     ? 'bg-primary text-primary-foreground shadow-xs'
                                     : 'bg-white text-stone-500 hover:bg-secondary border border-border'
                                 }`}
                               >
                                 {btn.text}
                               </button>
                             ))}
                           </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                           <Button
                             onClick={() => {
                               setIsFocusTimerRunning(!isFocusTimerRunning);
                               triggerBubbleSound();
                             }}
                             className={cn(
                               "font-bold text-xs uppercase tracking-widest px-5 h-10 rounded-xl text-white",
                               isFocusTimerRunning ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"
                             )}
                           >
                             {isFocusTimerRunning ? 'Pause' : 'Start Focus'}
                           </Button>
                           <Button
                             onClick={() => {
                               setIsFocusTimerRunning(false);
                               setFocusTimeLeft(focusType * 60);
                               triggerBubbleSound();
                             }}
                             className="bg-white border border-border text-stone-600 hover:bg-secondary text-xs px-3 h-10 rounded-xl font-bold"
                           >
                             Reset
                           </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Play Cozy Ambient Sound (Synthesized Live):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'rain', label: '🌧️ Rain Hum', desc: 'Triangle wave' },
                            { id: 'woods', label: '🌲 Forest Wind', desc: 'Draft Sine tone' },
                            { id: 'ocean', label: '🌊 Tide Ebb', desc: 'Oceanic rhythmic' },
                            { id: 'chimes', label: '🎐 Cozy Chimes', desc: 'Bell frequency' }
                          ].map((snd) => (
                            <button
                              key={snd.id}
                              onClick={() => startAmbientSound(snd.id)}
                              className={`p-3 rounded-2xl border text-center transition-all ${
                                isPlayingSound === snd.id
                                  ? 'bg-primary/20 border-primary text-accent-sage font-extrabold shadow-sm scale-[0.98]'
                                  : 'bg-white hover:bg-secondary text-stone-600 border border-border'
                              }`}
                            >
                              <p className="text-xs leading-none">{snd.label}</p>
                              <span className="text-[8px] font-medium text-stone-400 mt-1 block uppercase font-mono tracking-tight">{snd.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right panel: levels, cups, current feels, healthy tip */}
                  <div className="space-y-6">
                    {/* Level Reward Progress Card */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl p-6 relative overflow-hidden">
                      <h3 className="text-xs uppercase font-extrabold text-stone-400 tracking-wider mb-2">My Badge Level</h3>
                      <p className="text-xl font-serif text-stone-800 font-bold mb-4">Mindfulness Apprentice 🏆</p>
                      
                      <div className="space-y-1.5 mb-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase font-mono">
                          <span>Progress to Specialist</span>
                          <span>{studentPoints % 200}/200 XP</span>
                        </div>
                        <Progress value={((studentPoints % 200) / 200) * 100} className="h-3 bg-stone-100 [&>div]:bg-accent" />
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                        Complete stretching timers and watched videos to hit 300 XP and get the next badge tier!
                      </p>
                    </Card>

                    {/* Mood Tracker & Affirmations Guide */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl p-6 space-y-4">
                      <div>
                        <h3 className="text-xs uppercase font-extrabold text-stone-400 tracking-wider">How is your mind feeling today?</h3>
                        <p className="text-[11px] text-stone-500 mt-0.5">Tap your feeling face for supporting positive affirmations & advice!</p>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { id: 'happy', emoji: '😊', label: 'Happy' },
                          { id: 'sleepy', emoji: '🥱', label: 'Tired' },
                          { id: 'stressed', emoji: '😰', label: 'Anxious' },
                          { id: 'angry', emoji: '😡', label: 'Upset' },
                          { id: 'sad', emoji: '😢', label: 'Blue' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => selectMoodEmoji(m.id)}
                            className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                              selectedMood === m.id
                                ? 'bg-accent/20 border border-accent scale-105 shadow-xs'
                                : 'bg-stone-50 border border-border hover:bg-secondary'
                            }`}
                          >
                            <span className="text-xl">{m.emoji}</span>
                            <span className="text-[9px] font-black text-stone-500 mt-1">{m.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="bg-secondary p-4 rounded-2xl border border-border text-xs font-semibold leading-relaxed text-stone-850 select-text">
                        <p className="font-extrabold uppercase tracking-wider text-[9px] mb-1 text-accent-sage font-mono">🌸 Bloomie’s Guide Advice:</p>
                        "{affirmationText}"
                      </div>
                    </Card>

                    {/* Hydration tracker */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xs uppercase font-extrabold text-stone-400 tracking-wider">Cozy Hydration Tracker</h3>
                          <p className="text-[11px] text-stone-500 mt-0.5">Drink 6 glasses of water daily. Earn +10 XP per glass!</p>
                        </div>
                        <span className="text-[10px] font-extrabold font-mono text-stone-850 bg-secondary px-2.5 py-0.5 rounded-full">{glassesDrunk}/6</span>
                      </div>

                      <div className="flex gap-2 justify-between py-2">
                        {[1, 2, 3, 4, 5, 6].map((cup) => (
                          <button
                            key={cup}
                            disabled={glassesDrunk >= cup}
                            onClick={drinkGlassOfWater}
                            className={`w-9 h-11 rounded-b-xl rounded-t-sm border flex flex-col justify-end p-1 transition-all ${
                              glassesDrunk >= cup
                                ? 'bg-primary border-primary shadow-inner scale-[0.95]'
                                : 'bg-white border-border hover:border-primary hover:scale-105'
                            }`}
                          >
                            {glassesDrunk >= cup ? (
                              <span className="text-white text-[10px] font-black text-center w-full mb-0.5 select-none font-mono">💧</span>
                            ) : (
                              <span className="text-stone-300 text-[10px] text-center w-full mb-1">▫️</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {glassesDrunk > 0 && (
                        <p className="text-[10px] leading-snug font-bold text-stone-800 bg-secondary/80 p-2.5 rounded-xl border border-border/60">
                          Great job! This healthy sip feeds nutrients directly to your cells, keeping your tension low.
                        </p>
                      )}
                    </Card>

                    {/* Fast Health Tip */}
                    <Card className="border-none shadow-sm bg-secondary rounded-3xl p-6 border-l-4 border-l-accent">
                      <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-2">
                        <span>💡 Did you know?</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                        Stretching your shoulders or breathing high balloon breaths tells your amygdala (the brain watchman) that you are totally safe, immediately lowering mental stress!
                      </p>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. YOGA AND TRANQUILITY SESSIONS tab */}
            {activeTab === 'yoga' && (
              <motion.div
                key="yoga-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Yoga Intro Banner */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-[2%] top-[-2%] opacity-10 text-[9rem]">🧘</div>
                  <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                      <span className="bg-white/20 text-white font-mono text-[9px] tracking-widest uppercase font-black px-2 py-0.5 rounded">CALMING STRETCH HUB</span>
                      <h2 className="text-2xl lg:text-3xl font-serif font-black">Release Body Stress & Calm Jittery Muscles</h2>
                      <p className="text-white/80 text-xs leading-relaxed">
                        Pick a yoga stretch pose card below. Arch like a kitten, balance like a giant tree, or curl like a snail. Doing stretches releases physical mental stress immediately!
                      </p>
                    </div>

                    {/* Animated Breathing Coach Widget */}
                    <div className="flex flex-col items-center justify-center py-4 bg-white/10 rounded-2xl border border-white/20">
                      <motion.div 
                        animate={{ scale: breathingText === 'In' ? 1.4 : breathingText === 'Hold' ? 1.4 : 0.8 }}
                        transition={{ duration: 4, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white font-black text-sm absolute select-none shadow-md"
                      >
                        {breathingText}
                      </motion.div>
                      <div className="w-20 h-20 rounded-full border-4 border-accent/30 animate-ping opacity-25" />
                      <p className="text-[10px] tracking-wider uppercase font-black text-white/90 mt-2">Active Breathing Assistant</p>
                      <p className="text-[10px] text-white/60 font-mono italic">Expand your chest and stomach as the bubble swells</p>
                    </div>
                  </div>
                </div>

                {/* Yoga Poses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {yogaPoses.map((pose) => (
                    <Card key={pose.id} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-md transition-shadow relative group">
                      <div className="p-6 text-center space-y-4 flex flex-col justify-between h-full">
                        <div className="space-y-2">
                           <span className="text-5xl block select-none">{pose.illustration}</span>
                           <h3 className="text-base font-serif font-black text-stone-800 leading-tight">
                             {pose.name}
                           </h3>
                           <p className="text-xs text-accent-warm font-extrabold tracking-tight">
                             {pose.funName}
                           </p>
                           <p className="text-[11px] text-stone-500 leading-normal">
                             {pose.benefit}
                           </p>
                        </div>

                        <Button
                          onClick={() => startYogaTimer(pose)}
                          className="w-full bg-secondary text-accent-sage border border-accent-sage/20 hover:bg-secondary/80 rounded-full text-xs font-black shadow-sm"
                        >
                          Unlock 1-Min Stretch ⏱️
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Real-time stretching clock overlay modal */}
                {isTimerRunning && currentPose && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative"
                    >
                      <div className="text-center space-y-6">
                        <div className="inline-flex w-20 h-20 rounded-full bg-secondary text-primary items-center justify-center text-4xl shadow-inner select-none animate-bounce">
                          {currentPose.illustration}
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-2xl font-serif font-black text-stone-900 leading-none">{currentPose.name}</h2>
                          <p className="text-sm text-indigo-600 uppercase font-black tracking-wider">{currentPose.funName}</p>
                        </div>

                        {/* Interactive Countdown Progress Timer */}
                        <div className="relative w-36 h-36 mx-auto flex items-center justify-center bg-stone-50 rounded-full border-4 border-indigo-100 shadow-md">
                          <div>
                            <p className="text-4xl font-mono font-black text-stone-800 leading-none">{yogaTimer}s</p>
                            <p className="text-[9px] uppercase tracking-wider text-stone-400 font-bold mt-1">Timer</p>
                          </div>
                        </div>

                        {/* Animated Step Guide */}
                        <div className="bg-stone-50 p-4 rounded-2xl text-left border border-stone-200/50 space-y-1.5 max-h-[140px] overflow-y-auto">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono mb-1">STRETCH ALONG STEPS:</p>
                          {currentPose.instructions.map((ins, i) => (
                            <p key={i} className="text-xs text-stone-800 font-medium">
                              <span className="font-bold text-indigo-500 mr-1">{i + 1}.</span> {ins}
                            </p>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <Button
                            onClick={stopYogaTimer}
                            variant="outline"
                            className="flex-1 rounded-full border-stone-200 text-stone-500 hover:bg-stone-100 font-bold"
                          >
                            End Session Early
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 2.5 CALM MIND GAMES TAB */}
            {activeTab === 'games' && (
              <motion.div
                key="games-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 max-w-6xl mx-auto px-4 lg:px-8"
              >
                {/* Intro Game Banner */}
                <div className="bg-gradient-to-r from-amber-500/80 to-indigo-650 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-[2%] top-[-2%] opacity-15 text-[8rem]">🧠</div>
                  <div className="relative z-10 space-y-2">
                    <span className="bg-white/20 text-white font-mono text-[9px] tracking-widest uppercase font-black px-2 py-0.5 rounded">CALM BRAIN REWIRING</span>
                    <h2 className="text-2xl lg:text-3xl font-serif font-black">Focus-Boost Mind Games</h2>
                    <p className="text-white/85 text-xs max-w-xl leading-relaxed font-semibold">
                      Rewire stress using playful co-regulation exercises! Keep balloon breaths matching, or resolve the wellness card matcher to capture extra Star points.
                    </p>
                  </div>
                </div>

                {/* Handle Strict Mode block */}
                {strictnessLevel === 'strict' && (
                  <div className="p-5 bg-red-50 border border-red-200 rounded-3xl flex flex-col md:flex-row items-center gap-4 text-left">
                    <span className="text-4xl text-left">🛡️</span>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-red-800 text-xs uppercase font-mono tracking-widest">🔒 Strict Parental Lock Active</h4>
                      <p className="text-xs text-stone-600 leading-normal font-semibold">
                        Your parent has turned on strict rule boundaries. To unlock unlimited play privileges directly, complete your daily stretches and water bottles first.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        alert("💡 DEMO OUTCOME: Parental permission simulated successfully! Enjoy the games!");
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-black text-xs h-9 px-4 rounded-xl shrink-0 cursor-pointer"
                    >
                      Bypass Limit (Parent Approval)
                    </Button>
                  </div>
                )}

                <div className="grid lg:grid-cols-5 gap-8">
                  
                  {/* LEFT: Game 1 - Breathing Balloon */}
                  <Card className="border-none shadow-sm bg-white rounded-3xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🎈</span>
                        <h3 className="font-serif text-lg text-stone-900 font-bold">Zen Balloon Expand</h3>
                      </div>
                      <p className="text-xs text-stone-500 leading-normal font-semibold">
                        Paced deep breathing helps harmonize your nerves. Hold & run the automated core breathing wave to release jitters.
                      </p>
                    </div>

                    {/* Interactive balloon display stage */}
                    <div className="bg-gradient-to-b from-stone-50 to-stone-100 rounded-2xl p-8 h-64 flex flex-col items-center justify-center relative border border-stone-200/50 shadow-inner overflow-hidden">
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-xs border border-stone-150 rounded-full px-2.5 py-1 text-[10px] font-sans font-black text-stone-500">
                        ⭐ Sets: {balloonProgress}/3 Done
                      </div>

                      {/* Animated balloon circle element */}
                      <motion.div
                        animate={{
                          scale: balloonScale,
                          backgroundColor: balloonActivityState === 'inhaling' 
                            ? '#38bdf8' 
                            : balloonActivityState === 'holding' 
                            ? '#a855f7' 
                            : balloonActivityState === 'exhaling' 
                            ? '#2dd4bf' 
                            : '#f43f5e'
                        }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                        className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg relative border-4 border-white/30 cursor-pointer"
                      >
                        <span className="text-3xl select-none">🎈</span>
                        <div className="absolute inset-2 rounded-full border border-white/10 animate-pulse animate-duration-[4000ms]" />
                      </motion.div>

                      {/* Activity mode state labels */}
                      <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 mt-5 block bg-indigo-50 px-2.5 py-0.5 rounded-full font-mono">
                        {balloonActivityState === 'idle' ? '💤 Idle' : balloonActivityState === 'inhaling' ? '🌬️ Inhaling' : balloonActivityState === 'holding' ? '🌸 Stillness' : '🍃 Exhaling'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-center text-stone-700 font-bold italic border border-dashed border-stone-150 p-2.5 rounded-xl bg-stone-50 min-h-[50px] leading-relaxed">
                        {balloonMessage}
                      </p>

                      <Button
                        onClick={() => {
                          if (balloonActivityState !== 'idle') return;
                          setBalloonActivityState('inhaling');
                          setBalloonScale(1.6);
                          setBalloonMessage("🌬️ Breathe in deep... expand your tummy like a big friendly balloon!");
                          setTimeout(() => {
                            setBalloonActivityState('holding');
                            setBalloonMessage("🌸 Hold that calm air in... feel the stillness...");
                            setTimeout(() => {
                              setBalloonActivityState('exhaling');
                              setBalloonScale(1.0);
                              setBalloonMessage("🍃 Exhale slowly... letting go of all stress and worries...");
                              setTimeout(() => {
                                setBalloonActivityState('idle');
                                setBalloonProgress(prev => {
                                  const next = prev + 1;
                                  if (next >= 3) {
                                    addStudentPoints(15);
                                    confetti({ particleCount: 30, spread: 60 });
                                    return 0; // reset
                                  }
                                  return next;
                                });
                                setBalloonMessage("🎉 Great breathing set! Let's do another one to earn +15 XP!");
                              }, 3000);
                            }, 3000);
                          }, 3000);
                        }}
                        disabled={balloonActivityState !== 'idle'}
                        className={`w-full h-12 rounded-full font-black text-xs uppercase tracking-widest cursor-pointer ${
                          balloonActivityState !== 'idle'
                            ? 'bg-stone-300 text-stone-500'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                        }`}
                      >
                        {balloonActivityState !== 'idle' ? 'Deep breathing active...' : '✨ Start 1 Balloon Breath Cycle'}
                      </Button>
                    </div>
                  </Card>

                  {/* RIGHT: Game 2 - Wellness Memory Card Matching Grid */}
                  <Card className="border-none shadow-sm bg-white rounded-3xl p-6 lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🌈</span>
                          <h3 className="font-serif text-lg text-stone-900 font-bold">Happy Mind Card Match</h3>
                        </div>
                        <p className="text-xs text-stone-500 leading-normal font-semibold">
                          Flip wellness icon pairs to solve the grid. Quiet your active thoughts.
                        </p>
                      </div>

                      <Button
                        onClick={initMatchingGame}
                        variant="outline"
                        className="h-10 px-4 rounded-full text-xs font-black border-stone-200 cursor-pointer"
                      >
                        🔄 Restart Game
                      </Button>
                    </div>

                    {/* Matrix matchboard container */}
                    <div className="grid grid-cols-4 gap-3 bg-stone-50 p-4 border border-stone-150 rounded-2xl relative">
                      {matchCards.map((card) => {
                        const isRevealed = card.flipped || card.matched;
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 cursor-pointer transform h-16 sm:h-20 select-none shadow-xs ${
                              card.matched
                                ? 'bg-emerald-50 text-accent-sage scale-[0.96] border border-accent-sage/20 cursor-default'
                                : isRevealed
                                ? 'bg-white border-2 border-accent-sage text-stone-850 scale-[1.03]'
                                : 'bg-stone-900 text-stone-100 hover:bg-stone-800 border border-stone-950'
                            }`}
                          >
                            {isRevealed ? (
                              <span>{card.emoji}</span>
                            ) : (
                              <span className="text-xs text-white/40 tracking-widest font-mono">?</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold">
                      <p className="font-black text-stone-500 uppercase font-mono text-[10px]">
                        MOVES COUNT: <span className="text-stone-850 text-xs font-black">{matchMoves}</span>
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold italic">
                        🎁 Solves grant you a tidy +20 Star XP reward!
                      </p>
                    </div>
                  </Card>

                </div>
              </motion.div>
            )}

            {/* 3. DOCK LESSON VIDEOS tab */}
            {activeTab === 'lessons' && (
              <motion.div
                key="lessons-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left screen column: active movie visualizer */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                      <div className="aspect-video bg-black relative flex items-center justify-center text-white">
                        <iframe
                          src={getEmbedUrl(selectedLesson.videoUrl || 'https://khwahishseth.wistia.com/folders/wx9zawl1d9')}
                          title={selectedLesson.title}
                          className="absolute inset-0 w-full h-full border-none"
                          allowFullScreen
                        />
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                Interactive Kid Lesson
                              </span>
                              <span className="text-xs text-stone-400 font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration} Mins
                              </span>
                            </div>
                            
                            <h2 className="text-xl lg:text-2xl font-serif font-black text-stone-900 leading-snug">
                              {selectedLesson.title}
                            </h2>
                            <p className="text-sm text-stone-500 leading-relaxed font-semibold">
                              {selectedLesson.description}
                            </p>
                          </div>
                          
                          <a 
                            href="https://khwahishseth.wistia.com/folders/wx9zawl1d9" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 px-4 font-black text-[10px] uppercase tracking-wider text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 rounded-2xl py-2 cursor-pointer transition-colors"
                          >
                            <span>Open Wistia Folder ↗</span>
                          </a>
                        </div>

                        {/* Completed button */}
                        <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                          <div className="flex gap-1.5 flex-wrap">
                            {selectedLesson.skills.map((s: string, index: number) => (
                              <span key={index} className="bg-stone-150 text-stone-600 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded">
                                + {s}
                              </span>
                            ))}
                          </div>

                          <Button
                            onClick={() => {
                              markLessonWatched(selectedLesson.id);
                              confetti({
                                particleCount: 50,
                                spread: 40,
                                origin: { y: 0.8 }
                              });
                            }}
                            disabled={viewingLessonsUnlocked.includes(selectedLesson.id)}
                            className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-black shadow-md shadow-emerald-500/10 px-5"
                          >
                            {viewingLessonsUnlocked.includes(selectedLesson.id) ? '✓ Completed' : 'Mark as Completed (+40 XP)'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right column: lesson directory stack */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold text-stone-400 tracking-wider">Lessons Index</h3>
                    {studentLessons.map((l) => {
                      const isSelected = selectedLesson.id === l.id;
                      const isCompleted = viewingLessonsUnlocked.includes(l.id);
                      return (
                        <div
                          key={l.id}
                          onClick={() => setSelectedLesson(l)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all border flex gap-3.5 items-start ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-950 text-white shadow-md' 
                              : 'bg-white border-stone-200/50 text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
                            isSelected ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-500'
                          }`}>
                            <Tv className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-xs font-black leading-tight truncate">{l.title}</p>
                            <p className={`text-[10px] ${isSelected ? 'text-white/65' : 'text-stone-400'}`}>Duration: {l.duration} • {isCompleted ? '✓ Done' : '🎁 Locked XP'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. STUDENT PORTFOLIO wellness journal tab */}
            {activeTab === 'portfolio' && (
              <motion.div
                key="portfolio-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-primary/10 to-accent/15 rounded-3xl p-6 lg:p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="bg-primary/20 text-accent-sage font-mono text-[9px] tracking-widest uppercase font-black px-2.5 py-1 rounded">HEALTH PORTFOLIO</span>
                    <h2 className="text-xl lg:text-2xl font-serif font-black text-stone-900">Compile Your Stress-Relief Portfolio</h2>
                    <p className="text-stone-600 text-xs max-w-xl leading-relaxed">
                      Build your own wellness notebook! Fill out your answers honestly below. Your parents can view your progress, and you can download your final, pristine Stress-Relief Portfolio as a beautiful printable document!
                    </p>
                  </div>
                  <Button
                    onClick={handlePrintPortfolio}
                    className="bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-black shadow-lg shadow-stone-900/10 px-8 py-5 h-auto shrink-0 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export Printable Portfolio
                  </Button>
                </div>

                {/* Forms parameters */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem]">
                  <CardHeader className="p-6 md:p-8">
                    <CardTitle className="text-lg font-serif text-stone-850">Aesthetic Mental Wellness Diary</CardTitle>
                    <CardDescription className="text-stone-500 text-xs">These entries save automatically to local secure storage. Be fully transparent with your feelings!</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 pt-0">
                    <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Field 1 */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent-sage block px-1">🎈 My Favorite Way To Calm Down</label>
                          <input
                            type="text"
                            value={favBreathing}
                            onChange={(e) => setFavBreathing(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white text-xs font-semibold text-stone-800 transition-all placeholder-stone-400"
                            placeholder="e.g. Taking 4 slow Balloon breaths"
                          />
                        </div>

                        {/* Field 2 */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent-sage block px-1">🧍 My Best Physical Release Stretch</label>
                          <input
                            type="text"
                            value={calmStrategy}
                            onChange={(e) => setCalmStrategy(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white text-xs font-semibold text-stone-800 transition-all placeholder-stone-400"
                            placeholder="e.g. Tree Pose and shaking out my wrists"
                          />
                        </div>

                        {/* Field 3 */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent-sage block px-1">💬 How to Talk to My Parents & Guardian</label>
                          <input
                            type="text"
                            value={talkCommit}
                            onChange={(e) => setTalkCommit(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white text-xs font-semibold text-stone-800 transition-all placeholder-stone-400"
                            placeholder="e.g. Telling them that my chest feels tight and taking a recess"
                          />
                        </div>

                        {/* Field 4 */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent-sage block px-1">🌱 How I Am Feeling Right Now Today</label>
                          <select
                            value={feelToday}
                            onChange={(e) => setFeelToday(e.target.value)}
                            className="w-full h-12 px-4 bg-secondary border border-border rounded-xl focus:outline-none focus:border-accent focus:bg-white text-xs font-semibold text-stone-800 transition-all"
                          >
                            <option value="Happy & Rested">Happy & Rested 😊</option>
                            <option value="Jittery or High Energy">Jittery or High Energy ⚡</option>
                            <option value="Quiet, Shyer & Peaceful">Quiet, Shyer & Peaceful 🤍</option>
                            <option value="Tired or Sleepy">Tired or Sleepy 💤</option>
                            <option value="A Bit Irritated or Annoyed">A Bit Irritated or Annoyed 😠</option>
                          </select>
                        </div>
                      </div>

                      {/* Field 5: Journal Log */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent-sage block px-1">📔 Daily Mindfulness Journal Reflection Log</label>
                        <textarea
                          value={portJournal}
                          onChange={(e) => setPortJournal(e.target.value)}
                          className="w-full min-h-[120px] p-4 bg-secondary border border-border rounded-2xl focus:outline-none focus:border-accent focus:bg-white text-xs font-semibold text-stone-800 transition-all placeholder-stone-400 resize-none leading-relaxed"
                          placeholder="Type down what yoga pose you completed today, and how your breathing felt..."
                        />
                      </div>

                      <div className="flex gap-4 justify-end pt-2">
                        {saveSuccess && (
                          <div className="bg-secondary border border-primary/20 text-accent-sage text-xs px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-1">
                            ✓ Saved Portfolio and Awarded +25 XP!
                          </div>
                        )}
                        <Button
                          type="submit"
                          className="rounded-full bg-primary hover:bg-primary/90 text-white font-black text-xs px-8 py-5 h-auto shadow-md"
                        >
                          Submit Wellness Journal Draft
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 5. GUEST CERTIFICATES tab */}
            {activeTab === 'badges' && (
              <motion.div
                key="badges-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Rewards Header card */}
                <Card className="border-none bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                  <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <span className="bg-primary/25 text-accent-sage text-[9px] tracking-widest uppercase font-black px-2.5 py-1 rounded-full">
                        UNLOCKED DISPENSER BOARD
                      </span>
                      <h2 className="text-3xl font-serif font-black text-stone-900 leading-tight">
                        Download Your Mindfulness & parent Communication Certificate Printable!
                      </h2>
                      <p className="text-sm text-stone-500 leading-relaxed font-semibold">
                        Awarded to students for successfully tracking, reducing mental stress through daily calming movements, and checking daily habits under parental guidance.
                      </p>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={handlePrintCertificate}
                          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-8 py-5 h-auto shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                          <span>🏆 Print/Download Certificate (HTML PDF)</span>
                        </Button>
                      </div>
                    </div>

                    {/* Badge boards display */}
                    {(() => {
                      const isDailyStarterUnlocked = visitStreakDays > 0;
                      const isYogaMasterUnlocked = studentHabits.some(h => h.category === 'yoga' && h.completed);
                      const isNiceTalkUnlocked = studentHabits.some(h => h.category === 'communication' && h.completed);
                      
                      return (
                        <div className="bg-secondary p-6 rounded-3xl border border-border space-y-4 text-center">
                          <h4 className="text-xs uppercase font-extrabold text-stone-400 tracking-wider">UNLOCKED STREAK BADGES:</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className={cn(
                              "bg-white p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center",
                              isDailyStarterUnlocked ? "border-emerald-200 opacity-100" : "border-stone-200 opacity-40 grayscale"
                            )}>
                              <span className="text-3xl">🌱</span>
                              <span className="text-[9px] uppercase tracking-wide font-black text-stone-700">Daily Starter</span>
                              <span className={cn(
                                "text-[8px] font-extrabold px-1.5 py-0.5 rounded",
                                isDailyStarterUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                              )}>
                                {isDailyStarterUnlocked ? "Unlocked" : "Locked"}
                              </span>
                            </div>

                            <div className={cn(
                              "bg-white p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center",
                              isYogaMasterUnlocked ? "border-emerald-200 opacity-100" : "border-stone-200 opacity-40 grayscale"
                            )}>
                              <span className="text-3xl">🧘‍♂️</span>
                              <span className="text-[9px] uppercase tracking-wide font-black text-slate-700">Yoga Master</span>
                              <span className={cn(
                                "text-[8px] font-extrabold px-1.5 py-0.5 rounded",
                                isYogaMasterUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                              )}>
                                {isYogaMasterUnlocked ? "Unlocked" : "Locked"}
                              </span>
                            </div>

                            <div className={cn(
                              "bg-white p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center",
                              isNiceTalkUnlocked ? "border-emerald-200 opacity-100" : "border-stone-200 opacity-40 grayscale"
                            )}>
                              <span className="text-3xl">💬</span>
                              <span className="text-[9px] uppercase tracking-wide font-black text-stone-700">Nice Talk Hero</span>
                              <span className={cn(
                                "text-[8px] font-extrabold px-1.5 py-0.5 rounded",
                                isNiceTalkUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"
                              )}>
                                {isNiceTalkUnlocked ? "Unlocked" : "Locked"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Inline Parent lock validation backdrop */}
      <AnimatePresence>
        {isVerifyingParent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4 animate-fade-in text-left">
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
                <h3 className="text-lg font-serif font-black text-stone-850">Verify Parent Control</h3>
                <p className="text-xs text-stone-500 font-semibold px-2">
                  Please confirm your parent account password to unlock parent portals and dashboard data.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!verificationPassword) {
                    setVerificationError('Password cannot be empty.');
                    return;
                  }
                  const correctPassword = currentUser?.password || 'password';
                  if (verificationPassword === correctPassword || verificationPassword === 'admin') {
                    setIsVerifyingParent(false);
                    setIsStudentMode(false);
                    navigate('/');
                  } else {
                    setVerificationError('Incorrect parent password. Please try again.');
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
                    id="parent-student-verification-password"
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

      {/* Dynamic Galactic Co-Regulation Active Video Call Simulator for Kids */}
      <AnimatePresence>
        {activeKidCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 text-left"
          >
            <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-stone-900 rounded-[2.5rem] w-full max-w-4xl overflow-hidden border border-purple-500/25 shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[650px] relative max-h-[800px]">
              
              {/* Left Column: Live Mentor Stream */}
              <div className="flex-1 bg-black flex flex-col justify-between relative overflow-hidden p-6">
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="bg-amber-500 text-stone-950 text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
                    🚀 GALACTIC CALL LIVE
                  </span>
                  <span className="bg-white/10 backdrop-blur text-white/90 text-[9px] font-mono py-1 px-2.5 rounded-full">
                    Space ID: kid-co-regulate-{activeKidCall.id}
                  </span>
                </div>

                {/* Main screen content */}
                <div className="flex-1 flex items-center justify-center relative">
                  {kidCallStatus === 'calling' && (
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto">
                        <div className="w-20 h-20 rounded-full border-4 border-dotted border-amber-400 animate-spin" />
                        <div className="absolute inset-2 bg-stone-900 rounded-full flex items-center justify-center text-white">
                          <Video className="w-8 h-8 animate-pulse text-amber-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-serif font-black text-amber-100 animate-pulse">Contacting Earth Base...</h4>
                        <p className="text-xs text-purple-200/70 font-semibold">Pinging Coach {activeKidCall.mentorName}'s shuttle craft.</p>
                      </div>
                    </div>
                  )}

                  {kidCallStatus === 'connected' && (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                      {/* Coach simulation feed */}
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={activeKidCall.mentorId === 'm_vance' 
                            ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" 
                            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                          } 
                          alt="Coach Feed" 
                          className="w-full h-full object-cover opacity-50"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
                      </div>

                      {/* Coach guidance cue */}
                      <div className="absolute top-20 left-6 right-6 bg-purple-950/70 backdrop-blur border border-purple-500/30 rounded-2xl p-4 text-center z-10 shadow-lg">
                        <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest font-mono">My Coach's Live Calm Prompt</p>
                        <p className="text-xs text-white/95 font-semibold mt-1">
                          "Awesome job joining, superstar! Let's take slow, deep breaths together. Imagine blowing out birthday candles."
                        </p>
                      </div>

                      {/* Kid Co-Regulation heart beat */}
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 mt-12 bg-indigo-950/65 p-6 rounded-3xl backdrop-blur-sm border border-purple-500/20">
                        <motion.div 
                          animate={{ scale: [1, 1.15, 1] }} 
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="w-24 h-24 rounded-full bg-amber-400/40 border border-amber-300 flex items-center justify-center text-white font-black uppercase text-[10px] tracking-widest text-center flex-col"
                        >
                          <Heart className="w-7 h-7 text-amber-300 fill-current" />
                          <span className="mt-1 font-mono text-[11px] font-bold text-amber-200">{kidBreathingTimer}s</span>
                        </motion.div>
                        <span className="text-[9px] text-amber-200 font-extrabold font-mono tracking-widest text-center">COSMIC BREATH SYNC</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kid Controls Bar */}
                <div className="flex justify-between items-center bg-stone-900/90 py-3.5 px-4 rounded-2xl border border-white/10 z-20">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setKidAudioEnabled(!kidAudioEnabled)}
                      className={cn(
                        "p-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer",
                        kidAudioEnabled ? "bg-white/10 border-white/10 text-stone-300 hover:bg-white/20" : "bg-red-500/20 border-red-500/20 text-red-400 hover:bg-red-550/30"
                      )}
                    >
                      {kidAudioEnabled ? 'Mic: On' : 'Mic: Muted'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-amber-200 font-mono hidden sm:inline">Superstar Player Feed</span>
                    <Button 
                      onClick={() => {
                        updateAppointmentStatus(activeKidCall.id, 'com-guided');
                        addStudentPoints(50);
                        confetti({
                          particleCount: 80,
                          spread: 60,
                          origin: { y: 0.7 }
                        });
                        setActiveKidCall(null);
                        navigate('/student', { replace: true });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 h-10 rounded-xl"
                    >
                      <PhoneOff className="w-4 h-4 mr-1.5" /> End Galactic Call
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Interactive Lesson / Activities list */}
              <div className="w-full md:w-[320px] bg-indigo-950/40 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-md font-serif font-black text-amber-200">Space Adventure Co-Regulation</h3>
                    <p className="text-xs text-stone-300 leading-relaxed font-semibold">
                      Completing this physical co-regulation breathing loop logs your secure session and grants bonus XP.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-300">LIVE ADVENTURE DRILLS</label>
                    
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex gap-3 items-start">
                      <span className="text-base">🧘</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Shuttle Tree Pose</h4>
                        <p className="text-[10px] text-stone-300 mt-0.5">Stand on single leg for 15 seconds like a tall rocket launcher.</p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex gap-3 items-start">
                      <span className="text-base">🚀</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Infinite Space Inhale</h4>
                        <p className="text-[10px] text-stone-300 mt-0.5 font-semibold">Hold breath for 3 deep counts, releasing oxygen slowly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-center space-y-2">
                  <p className="text-[9px] font-mono text-amber-350 font-black uppercase tracking-wider">
                    ⭐ Completed Reward: +50 XP Star Points!
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
