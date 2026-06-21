import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Settings, 
  CheckCircle, 
  ArrowRight, 
  StickyNote, 
  BookOpen, 
  Heart,
  MessageSquare,
  ChevronDown,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { cn, getEmbedUrl } from '@/lib/utils';
import confetti from 'canvas-confetti';

const LESSON_DESCRIPTIONS: Record<string, string> = {
  'l1-1': 'Deep dive into the neurological construction of the young brain. Learn how the prefrontal cortex develops under stress, why children enter fight-or-flight mode during tantrums, and how primary caregivers serve as external nervous systems to co-regulate emotion and build cognitive resilience.',
  'l1-2': 'Identify the deep differences between your child\'s hardwired genetic temperament and temporary behavior choices. Learn to audit high-energy, sensitive, or cautious baselines so you can customize validation and set boundaries without inducing defensive power struggles.',
  'l1-3': 'A deep-dive overview of child psychology milestones. Learn the natural markers of stress indicators, self-talk habits, and cognitive integration to better assist your children.',
  'l2-1': 'A tactical masterclass on connection before direction. Discover how to practice active listening without jumping to correct or resolve issues. Implement reflecting feedback loops that prove to your child they have been deeply heard and understood.',
  'l2-2': 'Explore the science of chemical de-escalation through verbal safety. By validating the emotional truth of your child\'s experience ("I see you are disappointed"), you discharge the arousal of the amygdala and allow their cognitive brain to come back online naturally.',
  'l2-3': 'Mastering emotional tone and vocal volume. Discover how quiet whispered responses work as a cooling blanket on an over-aroused child during heated transitions or communication blocks.',
  'l3-1': 'Co-regulation is a visceral physical process. This lesson covers breathing tempo syncing, lowering your physical stature to avoid intimidation, using soft vocal frequencies, and micro-postures that transmit safety to an agitated child.',
  'l3-2': 'Step-by-step guidance on breaking the systemic anger loop. Learn how parental reactions can accidentally fuel child meltdowns, and discover exit strategies to de-escalate emotional storms when both parent and child are triggered.',
  'l3-3': 'Somatic nervous system cool downs. Set biological boundaries and co-regulate high nervous activation, leading both you and your child safely back to baseline after heavy bursts.',
  'l4-1': 'Shift your reward paradigms from clean achievement to internal identity. Learn the subtle difference between praise of outcome versus praise of intention and focus, allowing children to develop stable, robust worth independent of performance metrics.',
  'l4-2': 'Rebuilding visual reward trackers. Focus on small steps, co-regulation support tokens, and shared bonding experiences that avoid bribery and empower sustainable positive loops.',
  'l4-3': 'Awakening intrinsic motivation. How to support physical autonomy so that children feel proud of completing daily routines and responsibilities without demanding constant external validation.',
  'l5-1': 'Establish boundaries that are safe, firm, clear, and empty of anger. Learn how to say "No" while staying completely connected, avoiding negotiation trap-doors, and allowing natural consequences to do the teaching for you.',
  'l5-2': 'How logical and natural consequences become the organic source of learning. Stop repeating empty, non-enforceable threats and let behavioral rules hold gentle, loving accountability.',
  'l5-3': 'Preventing and responding to boundary exhaustion. Learn how to maintain high, loving, and clear guidelines when your internal resources are low, keeping stress completely out of your parent voice.',
  'l6-1': 'A clinical blueprint to transition children away from high-dopamine screen environments. Replace intense screen loops with connecting play activities that naturally stimulate nervous system safety and co-regulating laughter.',
  'l6-2': 'Constructing a gentle, tech-free environment. Use visual transitions, advance timeframes, and emotional validation to assist children with transitions away from intense virtual games.',
  'l6-3': 'Setting co-regulating guidelines around personal tablet and screen usage. Discover how collaborative time limits build natural executive function, and reduce emotional screen withdrawals.',
  'm7-1': 'Equip your children with a robust emotional vocabulary. Help them label intense bodily sensations (pressure in chest, hot hands) with clean emotional terms so they can voice their needs rather than acting them out physically.',
  'm7-2': 'Interpreting cellular and bodily changes. Give your children actionable co-regulation hacks when they observe bodily heat, heavy breathing, or jaw strain, stopping storms before they hit.',
  'm7-3': 'Providing active somatic releases. Discover play-based ways to discharge biological stress (running together, heavy work play, push games) to transition anxious or frustrated energy safely.',
  'm8-1': 'Reconstruct your morning workflow to be empty of yelling and power struggles. Design collaborative visual routines, provide autonomous choice frames, and establish positive morning thresholds for a peaceful environment.',
  'm8-2': 'Scientific wind-down habits to de-excite the nervous system. Craft custom sensory environments, sleep-ready co-regulating activities, and warm validation connections for deeper rest.',
  'm8-3': 'Sustaining positive physical progress. Learn how to observe progress milestones and document calm successes as a team, building a lifelong co-regulation portfolio.'
};

const LESSON_FALLBACK_VIDEOS: Record<string, string> = {
  'l1-1': 'eabjoioutk',
  'l1-2': 'i0iwga8cbj',
  'l1-3': 'eabjoioutk',
  'l2-1': 'eabjoioutk',
  'l2-2': 'i0iwga8cbj',
  'l2-3': 'eabjoioutk',
  'l3-1': 'eabjoioutk',
  'l3-2': 'i0iwga8cbj',
  'l3-3': 'eabjoioutk',
  'l4-1': 'eabjoioutk',
  'l4-2': 'i0iwga8cbj',
  'l4-3': 'eabjoioutk',
  'l5-1': 'i0iwga8cbj',
  'l5-2': 'eabjoioutk',
  'l5-3': 'i0iwga8cbj',
  'l6-1': 'eabjoioutk',
  'l6-2': 'i0iwga8cbj',
  'l6-3': 'eabjoioutk',
  'm7-1': 'i0iwga8cbj',
  'm7-2': 'eabjoioutk',
  'm7-3': 'i0iwga8cbj',
  'm8-1': 'eabjoioutk',
  'm8-2': 'i0iwga8cbj',
  'm8-3': 'eabjoioutk'
};

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { modules, completeLesson, addReflection, reflections, currentUser } = useApp();
=======
<<<<<<< HEAD
  const { modules, completeLesson, addReflection, reflections, currentUser } = useApp();
=======
  const { modules, completeLesson, addReflection, reflections } = useApp();
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  const { showReinforcement } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<'guide' | 'observation' | null>(null);

  // Parse target module + lesson state
  const module = modules.find(m => m.id === moduleId) || modules[0];
  const lesson = module?.lessons.find(l => l.id === lessonId) || module?.lessons[0];

  if (!module || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh] text-stone-500">
        <p className="text-xl font-serif">Lesson parameters not found.</p>
        <Link to="/learn" className="text-accent-sage font-bold mt-4 underline text-sm">Return to Course Path</Link>
      </div>
    );
  }

  // Parse total duration from "12:45" format
  const parseDuration = (dur: string | undefined): number => {
    if (!dur) return 600; // default 10 minutes
    const parts = dur.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return parseInt(dur, 10) * 60 || 600;
  };

  const totalDuration = useMemo(() => parseDuration(lesson.duration), [lesson.duration]);
  const parsedEmbedUrl = useMemo(() => {
    const rawVal = lesson.videoUrl || lesson.wistiaId || lesson.wistia_id;
    if (!rawVal) return 'https://fast.wistia.net/embed/iframe/eabjoioutk';
    
    let targetUrl = rawVal;
    
    // If it's a plain ID rather than a link, convert to iframe link
    if (!targetUrl.includes('/') && !targetUrl.includes('http')) {
      return `https://fast.wistia.net/embed/iframe/${targetUrl}`;
    }
    
    // Fallback specifically for private Wistia folders if embedded inside clean iframes
    if (targetUrl.includes('/folders/')) {
      let vidId = LESSON_FALLBACK_VIDEOS[lesson.id];
      if (!vidId) {
        if (lesson.id.endsWith('-2')) {
          vidId = 'i0iwga8cbj';
        } else {
          vidId = 'eabjoioutk';
        }
      }
      targetUrl = `https://fast.wistia.net/embed/iframe/${vidId}`;
    }
    
    const base = getEmbedUrl(targetUrl);
    const isYouTube = base.includes('youtube.com') || base.includes('youtu.be') || base.includes('youtube-nocookie.com');
    
    if (isYouTube) {
      try {
        const urlObj = new URL(base);
        urlObj.searchParams.set('autoplay', '0');
        urlObj.searchParams.set('rel', '0');
        urlObj.searchParams.set('controls', '1');
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        urlObj.searchParams.set('enablejsapi', '1');
        return urlObj.toString();
      } catch (e) {
        return `${base}?autoplay=0&rel=0&controls=1&enablejsapi=1`;
<<<<<<< HEAD
=======
=======
        return urlObj.toString();
      } catch (e) {
        return `${base}?autoplay=0&rel=0&controls=1`;
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
      }
    } else {
      try {
        const urlObj = new URL(base);
        urlObj.searchParams.set('autoplay', '0');
        urlObj.searchParams.set('autoPlay', 'false');
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        urlObj.searchParams.set('plugin[postMessage][version]', '1');
        return urlObj.toString();
      } catch (e) {
        return `${base}?autoplay=0&autoPlay=false&plugin[postMessage][version]=1`;
<<<<<<< HEAD
=======
=======
        return urlObj.toString();
      } catch (e) {
        return `${base}?autoplay=0&autoPlay=false`;
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
      }
    }
  }, [lesson.videoUrl, lesson.id]);

  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  const [iframePlayingConfirmed, setIframePlayingConfirmed] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Cleanly reset playback, tracking, and confirmation states when switching lessons
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIframePlayingConfirmed(false);
  }, [lesson.id]);

  // Hook to set a safety timeout when Play & Track is activated
  useEffect(() => {
    let timeout: any = null;
    if (isPlaying && !iframePlayingConfirmed) {
      // If we don't get a postMessage play confirmation within 2.5s, auto-confirm as safety fallback
      timeout = setTimeout(() => {
        setIframePlayingConfirmed(true);
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, iframePlayingConfirmed]);

  // Interval timer for visual simulation when playing - ONLY ticks once video starting is confirmed!
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && iframePlayingConfirmed) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          return next > totalDuration ? totalDuration : next;
<<<<<<< HEAD
=======
=======

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Interval timer for visual simulation when playing
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  }, [isPlaying, iframePlayingConfirmed, totalDuration, playbackSpeed]);

  // Handle auto-completion when currentTime reaches totalDuration
  useEffect(() => {
    if (isPlaying && currentTime >= totalDuration) {
      setIsPlaying(false);
      if (!lesson.completed) {
        handleComplete();
      }
    }
  }, [currentTime, totalDuration, isPlaying, lesson.completed]);

  // Dynamic Wistia & YouTube postMessage Event Listener
  useEffect(() => {
    const handleWistiaMessage = (event: MessageEvent) => {
      try {
        let msgData = event.data;
        let data: any = null;

        if (typeof msgData === 'string') {
          try {
            data = JSON.parse(msgData);
          } catch (e) {
            // Not a JSON string; fallback scanner below will handle it
          }
        } else if (typeof msgData === 'object' && msgData !== null) {
          data = msgData;
        }

        if (data) {
          // Normalize the event type name (Wistia sends 'play', 'pause', 'timeChange', 'end', etc.; YouTube sends 'onStateChange', 'infoDelivery')
          const eventType = (data.event || data.method || data.action || data.state || '').toLowerCase();

          // 1. YouTube specialized state and progress parser
          let ytState: number | undefined;
          if (data.event === 'onStateChange') {
            ytState = typeof data.info === 'number' ? data.info : data.info?.playerState;
          } else if (data.event === 'infoDelivery' && data.info && typeof data.info.playerState === 'number') {
            ytState = data.info.playerState;
          }

          if (ytState !== undefined) {
            if (ytState === 1) { // Playing
              setIsPlaying(true);
              setIframePlayingConfirmed(true);
            } else if (ytState === 2) { // Paused
              setIsPlaying(false);
            } else if (ytState === 0) { // Ended
              setIsPlaying(false);
              setIframePlayingConfirmed(false);
              setCurrentTime(totalDuration);
              if (!lesson.completed) {
                handleComplete();
              }
            }
          }

          // YouTube playhead update
          if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
            const ytTime = Math.round(data.info.currentTime);
            setCurrentTime(Math.min(totalDuration, ytTime));
            setIframePlayingConfirmed(true);
          }

          // 2. Wistia & generic message tracking
          if (eventType === 'play' || eventType === 'playing' || eventType === 'wistia:play' || eventType === 'videoplay') {
            setIsPlaying(true);
            setIframePlayingConfirmed(true);
          } else if (eventType === 'pause' || eventType === 'paused' || eventType === 'wistia:pause' || eventType === 'videopause') {
            setIsPlaying(false);
          } else if (
            eventType === 'ended' || 
            eventType === 'completed' || 
            eventType === 'end' || 
            eventType === 'wistia:end' || 
            eventType === 'videoend' || 
            eventType === 'playbackcompleted'
          ) {
            setIsPlaying(false);
            setIframePlayingConfirmed(false);
            setCurrentTime(totalDuration);
            if (!lesson.completed) {
              handleComplete();
            }
          } else if (
            eventType === 'timechange' || 
            eventType === 'timeupdate' || 
            eventType === 'time_change' || 
            eventType === 'time'
          ) {
            // Extract the playhead position (Wistia can provide this inside value, time, currentTime, or nested params/args arrays)
            let timeVal: number | undefined;
            if (typeof data.value === 'number') {
              timeVal = data.value;
            } else if (typeof data.time === 'number') {
              timeVal = data.time;
            } else if (typeof data.currentTime === 'number') {
              timeVal = data.currentTime;
            } else if (Array.isArray(data.params) && typeof data.params[0] === 'number') {
              timeVal = data.params[0];
            } else if (Array.isArray(data.args) && typeof data.args[0] === 'number') {
              timeVal = data.args[0];
            }

            if (timeVal !== undefined && timeVal > 0) {
              const roundedSecs = Math.round(timeVal);
              setCurrentTime(Math.min(totalDuration, roundedSecs));
              setIframePlayingConfirmed(true);
              // Automatically complete if the duration tells us they reached the very end (>= 99%)
              if (roundedSecs >= totalDuration - 1 && !lesson.completed) {
                setIsPlaying(false);
                setIframePlayingConfirmed(false);
                handleComplete();
              }
            }
          }
        }

        // Substring scanning fallback in case serialization/properties differ cross-origin
        if (typeof msgData === 'string' && !data) {
          const str = msgData.toLowerCase();
          if (str.includes('"event":"play"') || str.includes('wistia:play') || str.includes('"playing"')) {
            setIsPlaying(true);
            setIframePlayingConfirmed(true);
          } else if (str.includes('"event":"pause"') || str.includes('wistia:pause') || str.includes('"paused"')) {
            setIsPlaying(false);
          } else if (
            str.includes('"event":"ended"') || 
            str.includes('wistia:ended') || 
            str.includes('ended') || 
            str.includes('completed') ||
            str.includes('"event":"end"')
          ) {
            setIsPlaying(false);
            setIframePlayingConfirmed(false);
            setCurrentTime(totalDuration);
            if (!lesson.completed) {
              handleComplete();
            }
          } else if (str.includes('timechange') || str.includes('timeupdate') || str.includes('"event":"timechange"')) {
            const valueMatch = msgData.match(/"value"\s*:\s*([0-9.]+)/i) || msgData.match(/"time"\s*:\s*([0-9.]+)/i);
            if (valueMatch && valueMatch[1]) {
              const parsedS = Math.round(parseFloat(valueMatch[1]));
              if (!isNaN(parsedS) && parsedS > 0) {
                setCurrentTime(Math.min(totalDuration, parsedS));
                setIframePlayingConfirmed(true);
                if (parsedS >= totalDuration - 1 && !lesson.completed) {
                  setIsPlaying(false);
                  setIframePlayingConfirmed(false);
                  handleComplete();
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('[WISTIA TRACKER] Failed parsing postMessage event:', e);
      }
    };

    window.addEventListener('message', handleWistiaMessage);
    return () => window.removeEventListener('message', handleWistiaMessage);
  }, [lesson, totalDuration]);
<<<<<<< HEAD
=======
=======
  }, [isPlaying, totalDuration, playbackSpeed]);
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5

  // Helper function to postMessage controls to YouTube & Wistia embeds
  const controlVideo = (command: string, ...args: any[]) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const url = lesson.videoUrl || '';
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isWistia = url.includes('wistia.com') || url.includes('wistia.net');

    try {
      if (isYouTube) {
        let ytCommand = '';
        let ytArgs: any = args;
        if (command === 'play') {
          ytCommand = 'playVideo';
          ytArgs = '';
        } else if (command === 'pause') {
          ytCommand = 'pauseVideo';
          ytArgs = '';
        } else if (command === 'seek') {
          ytCommand = 'seekTo';
          ytArgs = [args[0], true];
        } else if (command === 'volume') {
          ytCommand = 'setVolume';
          ytArgs = [args[0] * 100]; // YouTube format 0-100
        } else if (command === 'speed') {
          ytCommand = 'setPlaybackRate';
          ytArgs = [args[0]];
        } else if (command === 'mute') {
          ytCommand = 'mute';
          ytArgs = '';
        } else if (command === 'unmute') {
          ytCommand = 'unMute';
          ytArgs = '';
        }
        
        if (ytCommand) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: ytCommand, args: ytArgs }),
            '*'
          );
        }
      } else if (isWistia) {
        let wistiaCommand = '';
        let wistiaArgs = args;
        if (command === 'play') {
          wistiaCommand = 'play';
          wistiaArgs = [];
        } else if (command === 'pause') {
          wistiaCommand = 'pause';
          wistiaArgs = [];
        } else if (command === 'seek') {
          wistiaCommand = 'time';
          wistiaArgs = [args[0]];
        } else if (command === 'volume') {
          wistiaCommand = 'volume';
          wistiaArgs = [args[0]]; // Wistia format 0-1
        } else if (command === 'speed') {
          wistiaCommand = 'playbackRate';
          wistiaArgs = [args[0]];
        } else if (command === 'mute') {
          wistiaCommand = 'mute';
          wistiaArgs = [];
        } else if (command === 'unmute') {
          wistiaCommand = 'unmute';
          wistiaArgs = [];
        }
        
        if (wistiaCommand) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ wistiaAPICommand: wistiaCommand, arguments: wistiaArgs }),
            '*'
          );
        }
      }
    } catch (error) {
      console.error('Failed to postMessage to iframe player:', error);
    }
  };

  // Synchronize playing states dynamically
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        controlVideo('play');
        controlVideo('volume', isMuted ? 0 : volume);
        controlVideo('speed', playbackSpeed);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
<<<<<<< HEAD
    if (!nextPlay) {
      setIframePlayingConfirmed(false);
    }
=======
<<<<<<< HEAD
    if (!nextPlay) {
      setIframePlayingConfirmed(false);
    }
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
    controlVideo(nextPlay ? 'play' : 'pause');
  };

  const handleRewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    controlVideo('seek', newTime);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    controlVideo(nextMuted ? 'mute' : 'unmute');
  };

  const handleVolumeSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    controlVideo('volume', val);
  };

  const handleSpeedSelect = (rate: number) => {
    setPlaybackSpeed(rate);
    controlVideo('speed', rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    completeLesson(module.id, lesson.id);
    showReinforcement(lesson.title, true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8bad8b', '#d4a373', '#f2e8cf']
    });
    setTimeout(() => {
        setShowReflection(true);
    }, 800);
  };

<<<<<<< HEAD
  // No immediate auto-completion triggers. Completion occurs upon reaching the end of the video.

=======
<<<<<<< HEAD
  // No immediate auto-completion triggers. Completion occurs upon reaching the end of the video.

=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection) return;

    addReflection(
      module.id,
      lesson.id,
      module.week,
      "How did you observe your child's natural temperament today? What surprised you?",
      reflection
    );

    setReflectionSaved(true);
    confetti({
      particleCount: 60,
      spread: 40,
      colors: ['#a7c957', '#386641']
    });

    setTimeout(() => {
      setReflectionSaved(false);
      setShowReflection(false);
      setReflection('');

      // Auto-open next section (Lesson or next Module first lesson)
      if (nextLesson) {
        navigate(`/learn/${module.id}/${nextLesson.id}`);
      } else {
        // Find next module
        const currentModuleIdx = modules.findIndex(m => m.id === module.id);
        const nextModule = modules[currentModuleIdx + 1];
        if (nextModule) {
          // Note: our completeLesson function will have auto-unlocked this next week's module as well!
          const nextModuleFirstLesson = nextModule.lessons[0];
          if (nextModuleFirstLesson) {
            navigate(`/learn/${nextModule.id}/${nextModuleFirstLesson.id}`);
          } else {
            navigate('/learn');
          }
        } else {
          // If no more modules, celebrate completion and go back to learn or progress
          navigate('/learn');
        }
      }
    }, 2000);
  };

  const currentLessonIdx = module.lessons.indexOf(lesson);
  const nextLesson = module.lessons[currentLessonIdx + 1];

  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row select-none">
      {/* Immersive Client-side Video Space */}
      <div className="flex-1 bg-stone-900 lg:h-screen flex flex-col relative overflow-hidden">
        {/* Top Header Over Video */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between pointer-events-none">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 pointer-events-auto rounded-full bg-black/30 backdrop-blur-md"
            onClick={() => navigate('/learn')}
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> All Modules
          </Button>
          <div className="text-white/60 text-xs font-mono tracking-widest hidden md:block bg-black/30 backdrop-blur-md px-4 py-2 rounded-full uppercase">
            Lesson {currentLessonIdx + 1} of {module.lessons.length}
          </div>
        </div>

        {/* Fully Functional Responsive Video Player */}
        <div className="flex-1 relative bg-black flex flex-col justify-center overflow-hidden min-h-[350px] md:min-h-[500px]">
          {lesson.videoUrl && lesson.videoUrl.includes('/folders/') && (
            <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-stone-900 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between gap-4 z-10 w-full animate-fade-in shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <p className="text-[11px] text-stone-200 font-bold">
                  📁 Connected to Wistia Vault: <span className="text-amber-400 font-black font-mono">wx9zawl1d9</span>. Co-Regulation Demonstration loaded below.
                </p>
              </div>
              <a 
                href="https://khwahishseth.wistia.com/folders/wx9zawl1d9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
              >
                <span>Launch Vault Drive ↗</span>
              </a>
            </div>
          )}
          
          <div className="flex-1 relative w-full h-full bg-black flex items-center justify-center">
            {lesson.type === 'video' && lesson.videoUrl ? (
              <iframe 
                ref={iframeRef}
                src={parsedEmbedUrl} 
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="p-8 text-center text-white space-y-4">
                <span className="text-accent-sage/70 font-bold uppercase tracking-[0.3em] text-[10px]">Non-Video Lesson</span>
                <h2 className="text-3xl font-serif max-w-xl mx-auto text-white/90">{lesson.title}</h2>
                <p className="text-stone-400 text-xs max-w-sm mx-auto">This lesson is formatted as an offline activity.</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Control Info Ribbon */}
        <div className="bg-stone-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="bg-accent-sage/15 text-accent-sage text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
              Full Instruction Lecture
            </span>
            <span className="text-xs text-stone-400 font-mono tracking-wider">
              Duration: {lesson.duration} Mins
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {lesson.videoUrl && (
              <a 
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-sage hover:bg-accent-sage/90 text-stone-900 font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Wistia Folder
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Side Lesson Info Panel & Reflections submissions */}
      <div className="lg:w-[400px] bg-white border-l border-stone-200 overflow-y-auto lg:h-screen p-8 lg:p-10 space-y-10 custom-scrollbar shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent-sage font-bold uppercase tracking-[0.2em] text-[10px]">
            <span className="w-2 h-2 rounded-full bg-accent-sage animate-pulse" /> Active Lesson
          </div>
          <h1 className="text-2xl font-serif text-stone-900 leading-tight">{lesson.title}</h1>
          <p className="text-stone-500 text-xs leading-[1.6] leading-relaxed font-semibold">
            {LESSON_DESCRIPTIONS[lesson.id] || lesson.content || `Let us explore the core concepts of "${lesson.title}". This lesson covers critical co-regulation pathways, active behavioral observation, and connection exercises that help de-escalate parental power-struggles.`}
          </p>
        </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        {/* Automatic Completion Feedback Box */}
        {lesson.completed ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-accent-sage/10 rounded-2xl border border-accent-sage/20 space-y-3 font-sans"
          >
             <div className="flex items-center gap-2 text-accent-sage">
                <CheckCircle2 className="w-5 h-5 fill-current animate-bounce" />
                <span className="font-bold text-sm">Lesson Completed!</span>
             </div>
             <p className="text-xs text-stone-600 leading-normal">Awesome work! We registered your progress. This lesson has been ticked off and +20 points credited to your clinical dashboard.</p>
<<<<<<< HEAD
=======
=======
        {/* Primary completes button */}
        {!lesson.completed ? (
           <Button 
             className="w-full h-14 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 font-bold text-sm uppercase tracking-wider"
             onClick={handleComplete}
           >
             Mark Complete <CheckCircle className="ml-2 w-4 h-4" />
           </Button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-accent-sage/10 rounded-2xl border border-accent-sage/20 space-y-3"
          >
             <div className="flex items-center gap-2 text-accent-sage">
                <CheckCircle2 className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm">Lesson Completed!</span>
             </div>
             <p className="text-xs text-stone-600 leading-normal">Awesome choice! This lesson is checked and +20 points credited.</p>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
             <Button 
               variant="outline" 
               className="w-full rounded-xl border-accent-sage text-accent-sage hover:bg-accent-sage/5 text-xs font-bold"
               onClick={() => setShowReflection(true)}
             >
                Self-Reflect Reflection Prompt <ArrowRight className="ml-2 w-3.5 h-3.5" />
             </Button>
          </motion.div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
         ) : (
          <div className="p-6 bg-stone-900/[0.04] rounded-2xl border border-stone-200/80 space-y-4 font-sans select-none">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="relative flex h-2.5 w-2.5">
                     <span className={cn(
                       "absolute inline-flex h-full w-full rounded-full opacity-75",
                       (isPlaying && iframePlayingConfirmed) ? "animate-ping bg-accent-sage" : isPlaying ? "animate-pulse bg-amber-400" : "bg-stone-300"
                     )}></span>
                     <span className={cn(
                       "relative inline-flex rounded-full h-2.5 w-2.5",
                       (isPlaying && iframePlayingConfirmed) ? "bg-accent-sage" : isPlaying ? "bg-amber-500" : "bg-stone-400"
                     )}></span>
                   </span>
                   <span className="font-bold text-[10px] uppercase tracking-wider text-stone-600">
                     {isPlaying 
                       ? (iframePlayingConfirmed ? "Playback active" : "Syncing video...") 
                       : "Awaiting video watch"}
                   </span>
                </div>
                <span className="font-mono text-[10px] font-black text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                   {Math.round(progressPercent)}% Played
                </span>
             </div>

             <div className="space-y-2">
               {/* Clickable/scrubbable Timeline Progress Bar */}
               <div className="relative group pt-1">
                 <input 
                   type="range"
                   min="0"
                   max={totalDuration}
                   value={currentTime}
                   onChange={(e) => {
                     const nextTime = Number(e.target.value);
                     setCurrentTime(nextTime);
                     controlVideo('seek', nextTime);
                   }}
                   className="w-full h-2 rounded-full appearance-none cursor-pointer accent-accent-sage hover:bg-stone-200 transition-colors bg-stone-200"
                   style={{
                     background: `linear-gradient(to right, #8bad8b 0%, #8bad8b ${progressPercent}%, #f5f5f4 ${progressPercent}%, #f5f5f4 100%)`
                   }}
                 />
               </div>
               
               <div className="flex justify-between text-[9px] font-bold text-stone-405 font-mono">
                 <span>{formatTime(currentTime)}</span>
                 <span>{formatTime(totalDuration)}</span>
               </div>
             </div>

             {/* Interactive Play/Simulation Controls Toolbar */}
             <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleTogglePlay}
                  className={cn(
                    "flex-1 h-9 rounded-xl text-xs font-extrabold gap-1 transition-all text-stone-700",
                    isPlaying ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-accent-sage/10 border-accent-sage/20 hover:bg-accent-sage/20"
                  )}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" /> Pause Track
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Play & Track
                    </>
                  )}
                </Button>

                {/* 10x Fast Forward Simulator */}
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const speeds = [1, 2, 5, 15, 50];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    const nextSpeed = speeds[nextIdx];
                    setPlaybackSpeed(nextSpeed);
                    controlVideo('speed', nextSpeed);
                  }}
                  className="h-9 px-2.5 rounded-xl border border-stone-200 text-stone-600 bg-stone-50 text-[10px] font-black"
                >
                  ⚡ {playbackSpeed}x Speed
                </Button>
             </div>

             <p className="text-[11px] text-stone-500 leading-normal">
               {isPlaying 
                 ? (iframePlayingConfirmed 
                     ? `Linked with video player. System automatically tracks progress. Simulation running at ${playbackSpeed}x speed.`
                     : "Waiting for video player to start playback to synchronize..."
                   )
                 : "Click 'Play & Track' below or play inside the player to dynamically synchronize watch progress."
               }
             </p>

             {/* Secure Video Watch Progress tracker badge instead of a parents skip button */}
             <div className="pt-3 border-t border-dashed border-stone-200">
               <div className="text-[10px] text-center text-stone-500 font-semibold italic flex items-center justify-center gap-1.5 bg-stone-100/50 py-2.5 px-3 rounded-xl border border-stone-200/50">
                 🔒 Progress tracking active • Watch full video to automatically claim +20 XP
               </div>
             </div>
          </div>
<<<<<<< HEAD
=======
=======
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
        )}

        {/* Guided Reflections submission Form */}
        <AnimatePresence>
          {showReflection && (
            <motion.form
              onSubmit={handleSaveReflection}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-6 border-t border-stone-100"
            >
               <div className="flex items-center gap-2 font-serif text-base text-accent-warm">
                  <MessageSquare className="w-4.5 h-4.5" />
                  Your Guided Reflection
               </div>
               <div className="space-y-3">
                  <p className="text-xs text-stone-600 font-medium italic leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    How did you observe your child's natural temperament today? What surprised you?
                  </p>
                  
                  <Textarea 
                    placeholder="Capture your thoughts safely in your offline private journal..." 
                    className="min-h-[110px] rounded-2xl bg-stone-50 border-stone-100 focus:bg-white text-xs transition-all resize-none leading-relaxed"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                  
                  {reflectionSaved ? (
                    <div className="p-3 bg-accent-sage/10 text-accent-sage rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 animate-bounce" /> Reflection Saved! +15 Points
                    </div>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={!reflection}
                      className="w-full rounded-2xl bg-accent-warm hover:bg-accent-warm/95 font-bold text-xs uppercase tracking-wider h-11"
                    >
                      Save to Private Journal
                    </Button>
                  )}
               </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Extra resources download placeholders */}
        <div className="grid grid-cols-2 gap-3">
           <div 
             onClick={() => setActiveModal('guide')}
             className="p-4 rounded-3xl bg-stone-50 border border-stone-100 hover:border-accent-sage/30 hover:bg-accent-sage/5 cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 group"
           >
              <BookOpen className="w-5 h-5 text-stone-400 group-hover:text-accent-sage" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-stone-600">Lesson Guide PDF</span>
           </div>
           <div 
             onClick={() => setActiveModal('observation')}
             className="p-4 rounded-3xl bg-stone-50 border border-stone-100 hover:border-accent-warm/30 hover:bg-accent-warm/5 cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 group"
           >
              <StickyNote className="w-5 h-5 text-stone-400 group-hover:text-accent-warm" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-stone-600">Observation Form</span>
           </div>
        </div>

        {/* Next lesson dynamic prompt link */}
        {nextLesson && (
          <div className="space-y-3 pt-6 border-t border-stone-100">
             <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Up Next In Module</h3>
             <Link 
               to={`/learn/${moduleId}/${nextLesson.id}`}
               className="flex gap-4 p-4 rounded-3xl border border-stone-100 hover:bg-stone-50 transition-all group"
               onClick={() => {
                 setIsPlaying(false);
                 setReflection('');
                 setShowReflection(false);
               }}
             >
                <div className="w-14 h-10 bg-stone-100 rounded-xl overflow-hidden relative group-hover:bg-accent-sage/10 shrink-0">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-accent-sage opacity-60 group-hover:opacity-100 transition-opacity" />
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-stone-800 truncate leading-snug">{nextLesson.title}</p>
                   <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {nextLesson.duration}
                   </p>
                </div>
             </Link>
          </div>
        )}
      </div>

      {/* Interactive Helper Modals */}
      <AnimatePresence>
        {activeModal === 'guide' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto border border-stone-100"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent-sage bg-accent-sage/10 px-2.5 py-1 rounded">
                  Study & Practice Cheatsheet
                </span>
                <h3 className="text-xl font-serif text-stone-900 pr-8">{lesson.title} Guide</h3>
                <p className="text-[11px] text-stone-500">Module: {module.title} • Week {module.week}</p>
              </div>

              <div className="space-y-4 text-xs text-stone-700 leading-relaxed border-t border-b border-stone-100 py-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-stone-850 uppercase tracking-wider text-[10px]">💡 Core Insight</h4>
                  <p className="bg-stone-50 p-3 rounded-xl border border-stone-100 font-medium text-stone-700 italic">
                    "Co-regulation is the foundation of all parenting. Children don't listen to what we say nearly as much as they experience our nervous system. High stress produces protective resistance in kids, while calmness triggers safety."
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-stone-850 uppercase tracking-wider text-[10px]">🌱 Direct Practice Exercises</h4>
                  <ul className="space-y-2 pl-4 list-disc text-stone-600">
                    <li><strong className="text-stone-800">The 3-Second Pause:</strong> When triggered, pause, drop your shoulders, and take deep belly breaths before responding.</li>
                    <li><strong className="text-stone-800">Validation First:</strong> Affirm their emotional state before executing corrective rules. Saying "I see you're angry" disarms the defense loop.</li>
                    <li><strong className="text-stone-800">Altitude Adjustment:</strong> Physically drop your eye level down to match theirs when explaining instructions.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-stone-850 uppercase tracking-wider text-[10px]">✅ Self-Reflection Checklist</h4>
                  <div className="space-y-1.5 font-medium text-stone-600">
                    <p>✓ Did I establish clean physical connection (eye contact, soft posture)?</p>
                    <p>✓ Did I validate the emotion before criticizing the behavior?</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="outline"
                  className="rounded-2xl h-11 flex-1 text-xs text-stone-500 border-stone-200 font-bold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const WinPrint = window.open('', '', 'width=900,height=800');
                    if (WinPrint) {
                      WinPrint.document.write(`
                        <html>
                          <head>
                            <title>Lesson Guide - ${lesson.title}</title>
                            <style>
                              body { font-family: 'Inter', sans-serif; padding: 40px; color: #292524; line-height: 1.6; }
                              .header { border-bottom: 2px solid #8bad8b; padding-bottom: 15px; margin-bottom: 30px; }
                              h1 { font-family: 'Playfair Display', serif; color: #386641; margin: 0 0 5px 0; font-size: 26px; }
                              h2 { font-size: 14px; text-transform: uppercase; color: #d4a373; margin: 0; }
                              .section { margin-bottom: 25px; background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; }
                              .section-title { font-weight: bold; font-size: 12px; uppercase; color: #386641; letter-spacing: 1px; margin-bottom: 10px; }
                              .text { font-size: 13px; font-style: italic; color: #44403c; }
                              ul { margin: 0; padding-left: 20px; font-size: 13px; }
                              li { margin-bottom: 8px; }
                              .footer { text-align: center; font-size: 11px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 15px; margin-top: 40px; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1>Study & Practice Guide</h1>
                              <h2>Lesson: ${lesson.title}</h2>
                            </div>
                            <div class="section">
                              <div class="section-title">💡 CORE INSIGHT</div>
                              <p class="text">"Co-regulation is the foundation of all parenting. Children don't listen to what we say nearly as much as they experience our nervous system. High stress produces protective resistance in kids, while calmness triggers safety."</p>
                            </div>
                            <div class="section">
                              <div class="section-title">🌱 DIRECT PRACTICE EXERCISES</div>
                              <ul>
                                <li><strong>The 3-Second Pause:</strong> When triggered, pause, drop your shoulders, and take deep belly breaths before responding.</li>
                                <li><strong>Validation First:</strong> Affirm their emotional state before executing corrective rules. Saying "I see you're angry" disarms the defense loop.</li>
                                <li><strong>Altitude Adjustment:</strong> Physically drop your eye level down to match theirs when explaining instructions.</li>
                              </ul>
                            </div>
                            <div class="section">
                              <div class="section-title">✅ SELF-REFLECTION CHECKLIST</div>
                              <p class="text">✓ Did I establish clean physical connection (eye contact, soft posture)?<br>✓ Did I validate the emotion before criticizing the behavior?</p>
                            </div>
                            <div class="footer">Parent Guidance Wellness Suite • Certified Practice Resources</div>
                            <script>window.onload = function() { window.print(); window.close(); }</script>
                          </body>
                        </html>
                      `);
                      WinPrint.document.close();
                    }
                  }}
                  className="rounded-2xl h-11 flex-1 bg-accent-sage hover:bg-accent-sage/90 text-stone-900 text-xs font-extrabold uppercase tracking-wide cursor-pointer"
                >
                  Print / Save PDF 🖨️
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {activeModal === 'observation' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-lg w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto border border-stone-100"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent-warm bg-accent-warm/10 px-2.5 py-1 rounded">
                  Active Clinical Observation
                </span>
                <h3 className="text-xl font-serif text-stone-900 pr-8">Daily Observation Journal</h3>
                <p className="text-[11px] text-stone-500">Track child triggers, co-regulation levels, and behavioral trends.</p>
              </div>

              <div className="space-y-4 border-t border-b border-stone-100 py-4 text-xs">
                {/* Interactive form elements */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">1. What triggered the friction/episode?</label>
                  <input
                    type="text"
                    id="obs-trigger"
                    placeholder="e.g. Bedtime screen transition, homework resistance"
                    defaultValue="Bedtime screen transition challenge"
                    className="w-full h-10 px-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">2. Emotional Spike Intensity (1-10)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id="obs-intensity"
                      min="1"
                      max="10"
                      defaultValue="6"
                      className="flex-1 accent-accent-warm"
                    />
                    <span className="font-mono font-bold text-accent-warm">Scale 6/10</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">3. Your Co-regulation Response</label>
                  <textarea
                    id="obs-response"
                    placeholder="e.g. Sat next to them on floor, did deep sighs, validated anger before saying screentime was done"
                    defaultValue="Took a deep breath, sat on floor, said 'I know screens are fun, you are upset'."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-stone-400 h-16 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400 block">4. Outcome Rating</label>
                  <select
                    id="obs-outcome"
                    defaultValue="improved"
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs"
                  >
                    <option value="resolved">Co-regulated Successfully (No screaming / happy recovery)</option>
                    <option value="improved">Partially Successful (Screamed but recovered fast)</option>
                    <option value="struggled">Fell into power struggle (Escalation loop)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="outline"
                  className="rounded-2xl h-11 flex-1 text-xs text-stone-500 border-stone-200 font-bold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const trigVal = (document.getElementById('obs-trigger') as HTMLInputElement)?.value || '';
                    const intVal = (document.getElementById('obs-intensity') as HTMLInputElement)?.value || '6';
                    const respVal = (document.getElementById('obs-response') as HTMLTextAreaElement)?.value || '';
                    const outcomeVal = (document.getElementById('obs-outcome') as HTMLSelectElement)?.value || 'improved';
                    
                    const WinPrint = window.open('', '', 'width=900,height=800');
                    if (WinPrint) {
                      WinPrint.document.write(`
                        <html>
                          <head>
                            <title>Daily Active Observation Intake</title>
                            <style>
                              body { font-family: 'Inter', sans-serif; padding: 40px; color: #292524; line-height: 1.6; }
                              .header { border-bottom: 2px solid #d4a373; padding-bottom: 15px; margin-bottom: 30px; }
                              h1 { font-family: 'Playfair Display', serif; color: #a0522d; margin: 0 0 5px 0; font-size: 26px; }
                              h2 { font-size: 14px; text-transform: uppercase; color: #386641; margin: 0; }
                              .field { margin-bottom: 25px; background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; }
                              .field-lbl { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; }
                              .field-val { font-size: 14px; font-weight: 500; color: #1c1917; }
                              .footer { text-align: center; font-size: 11px; color: #a8a29e; border-top: 1px solid #e7e5e4; padding-top: 15px; margin-top: 40px; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1>Active Observation Intake Journal</h1>
                              <h2>Lesson: ${lesson.title}</h2>
                            </div>
                            <div class="field">
                              <div class="field-lbl">1. Friction Event / Triggering Incident</div>
                              <div class="field-val">${trigVal}</div>
                            </div>
                            <div class="field">
                              <div class="field-lbl">2. Child Emotional Spike Intensity</div>
                              <div class="field-val">Level ${intVal} of 10</div>
                            </div>
                            <div class="field">
                              <div class="field-lbl">3. Response Co-regulation Strategy Logged</div>
                              <div class="field-val">${respVal}</div>
                            </div>
                            <div class="field">
                              <div class="field-lbl">4. Interaction Outcome</div>
                              <div class="field-val">${outcomeVal === 'resolved' ? 'Co-regulated Successfully' : outcomeVal === 'improved' ? 'Partially Successful' : 'Power Struggle Escalation'}</div>
                            </div>
                            <div class="footer">Parent Guidance Wellness Suite • Certified Practice Resources</div>
                            <script>window.onload = function() { window.print(); window.close(); }</script>
                          </body>
                        </html>
                      `);
                      WinPrint.document.close();
                    }
                  }}
                  className="rounded-2xl h-11 flex-1 bg-accent-warm hover:bg-accent-warm/90 text-white text-xs font-extrabold uppercase tracking-wide cursor-pointer"
                >
                  Print / Save Form 🖨
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
