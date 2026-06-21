import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  Volume2, 
  VolumeX, 
  Award, 
  Flame, 
  Activity, 
  Compass, 
  Trophy, 
  Zap, 
  Target, 
  Heart, 
  Shield, 
  Star,
  Layers,
  ChevronRight,
  MousePointerClick,
  Bell,
  FileText
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

// Comprehensive dictionary pairing buttons and sections with their respective co-regulation purpose
const EXPLAINER_DICTIONARY: Record<string, {
  title: string;
  badge: string;
  explanation: string;
  utility: string;
  pointsEffort: string;
  icon: any;
  tone: string;
}> = {
  // Navigation & Modes
  'dashboard': {
    title: 'Co-Regulation Control Hub',
    badge: 'Core Dashboard Guidance',
    explanation: 'Launches the main parent workspace aggregating active de-escalation streaks, daily focus metrics, and direct live streams.',
    utility: 'Keeps critical co-regulation goals top-of-mind at the start of your day to prevent defensive friction.',
    pointsEffort: 'Streak Base Sync • Daily',
    icon: Compass,
    tone: 'emerald'
  },
  'learn': {
    title: 'MindBloom Learning Suite',
    badge: 'Weekly Modules Instruction',
    explanation: 'Accesses weekly focus modules on childhood neuroscience, deliberate processing pauses, and positive parenting protocols.',
    utility: 'Re-wires negative parent reactivity loops through structural, evidence-backed educational lessons.',
    pointsEffort: '+10 XP per lesson finished',
    icon: Trophy,
    tone: 'amber'
  },
  'assignments': {
    title: 'Direct Action Commitments',
    badge: 'Behavioral Daily Assignments',
    explanation: 'A visual schedule of daily parent-child physical calming routines like stretches, hydration, and positive touch triggers.',
    utility: 'Converts abstract theories into actionable physical moments of connection during hyper-arousal spikes.',
    pointsEffort: '+5 XP per task ticked',
    icon: Target,
    tone: 'purple'
  },
  'progress': {
    title: 'Transformation Path Ledger',
    badge: 'Milestone Progress View',
    explanation: 'Visualizes historical streak dates, saved co-regulation charts, and custom LMS learning milestones.',
    utility: 'Provides positive biofeedback validating consistent growth to help sustain secondary motivation.',
    pointsEffort: 'Bonus Overdrive Active',
    icon: Flame,
    tone: 'rose'
  },
  'analytics': {
    title: 'Connectedness Growth Dial',
    badge: 'Interactive Growth Analytics',
    explanation: 'Aggregates detailed emotional sentiment indexes, parent logs, and child physiological stress metrics in real-time.',
    utility: 'Pinpoints recurring behavior patterns to adapt parenting strictness values strategically.',
    pointsEffort: 'Data-driven Analytics Sync',
    icon: Activity,
    tone: 'sky'
  },
  'profile': {
    title: 'Sovereign Parent Register',
    badge: 'Co-Regulation Profile Config',
    explanation: 'Configures parenting limits, strictness sliders, matching email recipients, and clear cache utility toggles.',
    utility: 'Adapts UI pacing to fit your family structural requirements or reset sandbox states instantly.',
    pointsEffort: 'Local State Persistence',
    icon: Shield,
    tone: 'emerald'
  },
  'admin panel': {
    title: 'System Overseer Controller',
    badge: 'Sandbox Administration',
    explanation: 'Admin panel to manually unlock learning weeks, broadcast live sessions, send mock email alerts, and view API settings.',
    utility: 'Enables rapid engineering testing, bypasses weekly lockout gates, and manages SMS provider templates.',
    pointsEffort: 'QA Sandbox Override',
    icon: Layers,
    tone: 'orange'
  },
  'toggle admin mode': {
    title: 'Sandbox Override Switch',
    badge: 'QA Superuser Shortcut',
    explanation: 'Hot link toggling administrative controls to fast-track module testing and simulate real-time triggers.',
    utility: 'Allows instant view of later levels or testing notifications without completing previous steps.',
    pointsEffort: 'Instant System Lock Bypass',
    icon: Sparkles,
    tone: 'orange'
  },
  'parent mode': {
    title: 'Adult Guidance Portal',
    badge: 'Parent Workspace Toggle',
    explanation: 'Returns coordinates to the parent dashboard tracking clinical parenting homework and de-escalation results.',
    utility: 'Requires PIN/Password confirmation to block kids from editing parent logs.',
    pointsEffort: 'Authentication Guard Active',
    icon: Shield,
    tone: 'emerald'
  },
  'student space': {
    title: 'Kid Galaxy Co-Regulation Sandbox',
    badge: 'Kids Space Launcher',
    explanation: 'Switches the interface to the interactive child sandbox featuring animated balloon breathing exercises and story yoga.',
    utility: 'Provides a safe, game-like environment that guides children through bodily calming routines.',
    pointsEffort: '+150 XP Potential Bonus',
    icon: Star,
    tone: 'amber'
  },
  'kids space': {
    title: 'Kid Galaxy Co-Regulation Sandbox',
    badge: 'Kids Space Launcher',
    explanation: 'Switches the interface to the interactive child sandbox featuring animated balloon breathing exercises and story yoga.',
    utility: 'Provides a safe, game-like environment that guides children through bodily calming routines.',
    pointsEffort: '+150 XP Potential Bonus',
    icon: Star,
    tone: 'amber'
  },

  // Reflection Page Actions
  'save reflection': {
    title: 'Reflection Journal Commit',
    badge: 'First Reflection',
    explanation: 'Saves your daily co-regulation entry, logging emotional intensity level and sentiment parameters directly.',
    utility: 'Fosters mindfulness and tracks positive progress metrics within your persistent streak calendar.',
    pointsEffort: '+5 XP Points • Earn Badge Progress',
    icon: Award,
    tone: 'rose'
  },
  'save entry': {
    title: 'Reflection Journal Commit',
    badge: 'First Reflection',
    explanation: 'Saves your daily co-regulation entry, logging emotional intensity level and sentiment parameters directly.',
    utility: 'Fosters mindfulness and tracks positive progress metrics within your persistent streak calendar.',
    pointsEffort: '+5 XP Points • Earn Badge Progress',
    icon: Award,
    tone: 'rose'
  },
  'add new reflection': {
    title: 'Deep Self-Study Prompt',
    badge: 'Reflection Journal Trigger',
    explanation: 'Opens the journal form to record de-escalation outcomes and analyze childhood emotional spikes.',
    utility: 'Transforms impulsive parenting behavior into deliberate, mindful, co-regulating experiences.',
    pointsEffort: '+5 Base XP + Multiplier Bonus',
    icon: Award,
    tone: 'purple'
  },

  // Student Actions
  'belly balloon breaths': {
    title: 'Breathe Deeply with Kid Galaxy',
    badge: 'Deep Breathing Routine',
    explanation: 'Active breathing exercise showcasing an animated lung expansion rhythm to model co-regulation.',
    utility: 'Slows down heart-rate acceleration and calms high stress triggers instantly.',
    pointsEffort: '+15 XP Gained • Leveling Momentum',
    icon: Activity,
    tone: 'sky'
  },
  'cozy chimes': {
    title: 'Solfeggio Sound Healing Frequency',
    badge: 'Auditory Calm Switch',
    explanation: 'Plays Solfeggio soundscapes configured to bring neurological activity back to baseline.',
    utility: 'Provides soothing background acoustic vibes that lower nervous system tension.',
    pointsEffort: '+5 XP Ambient Listen',
    icon: Volume2,
    tone: 'indigo'
  },
  'change sound': {
    title: 'Solfeggio Sound Healing Frequency',
    badge: 'Auditory Calm Switch',
    explanation: 'Plays Solfeggio soundscapes configured to bring neurological activity back to baseline.',
    utility: 'Provides soothing background acoustic vibes that lower nervous system tension.',
    pointsEffort: '+5 XP Ambient Listen',
    icon: Volume2,
    tone: 'indigo'
  },
  'claim badges': {
    title: 'Claim Mastery Medal',
    badge: 'Milestone Badges Claim',
    explanation: 'Locks in your completed achievements, serialized inside your local profile image representation.',
    utility: 'Rewards and reinforces positive parenting consistency with shiny digital awards.',
    pointsEffort: '+25 XP Reward Points Gained',
    icon: Trophy,
    tone: 'amber'
  },
  'claim achievement': {
    title: 'Claim Mastery Medal',
    badge: 'Milestone Badges Claim',
    explanation: 'Locks in your completed achievements, serialized inside your local profile image representation.',
    utility: 'Rewards and reinforces positive parenting consistency with shiny digital awards.',
    pointsEffort: '+25 XP Reward Points Gained',
    icon: Trophy,
    tone: 'amber'
  },
  'claim badge': {
    title: 'Claim Mastery Medal',
    badge: 'Milestone Badges Claim',
    explanation: 'Locks in your completed achievements, serialized inside your local profile image representation.',
    utility: 'Rewards and reinforces positive parenting consistency with shiny digital awards.',
    pointsEffort: '+25 XP Reward Points Gained',
    icon: Trophy,
    tone: 'amber'
  },

  // Contact / Coaching Info
  'book appointment': {
    title: 'Live De-escalation Session booking',
    badge: 'Professional Coaching Sync',
    explanation: 'Schedules a direct virtual consultation with leading mentors or licensed behavioral clinicians.',
    utility: 'Supplements self-guided instruction with personalized, human guidance to resolve complex scenarios.',
    pointsEffort: '+20 Attendance Bonus',
    icon: Target,
    tone: 'indigo'
  },
  'send message': {
    title: 'Secure Coach Correspondence',
    badge: 'Private Message Dispatch',
    explanation: 'Sends a private direct message to parent coaches, logging inquiries for clinical reviews.',
    utility: 'Gives parents a confidential channel to ask specific co-regulation questions and get help.',
    pointsEffort: 'Response window < 24 hrs',
    icon: Compass,
    tone: 'emerald'
  },

  // Notifications & Simulators
  'send test whatsapp': {
    title: 'Simulated WhatsApp Gateway Dispatch',
    badge: 'SMS Alert Triggers',
    explanation: 'Triggers the outbound SMS gateway, dispatching co-regulation templates directly to registered numbers.',
    utility: 'Verifies connectivity and models real WhatsApp reminders sent to parents during stress spikes.',
    pointsEffort: 'External Server Sandbox',
    icon: Zap,
    tone: 'orange'
  },
  'force unlock all lessons': {
    title: 'Instant LMS Access Bypass',
    badge: 'LMS Locked Override',
    explanation: 'Bypasses progressive gating metrics, immediately unlocking later week modules.',
    utility: 'Unlocks late levels and webinars instantly to let clinicians test everything in a single session.',
    pointsEffort: 'Debug System Overpass',
    icon: Sparkles,
    tone: 'orange'
  },
  'stress spike': {
    title: 'Simulate Heart Rate Peak Event',
    badge: 'Stress Event Simulation',
    explanation: 'Triggers a simulated childhood body stress warning (representing 110bpm), launching de-escalation alerts.',
    utility: 'Tests real notification pathways and prepares parents for real-world stress spikes.',
    pointsEffort: 'Immediate Alarm Dispatch',
    icon: Activity,
    tone: 'rose'
  },
  'habits tracker': {
    title: 'Physical Commitment Sync',
    badge: 'Co-regulation Daily Habits',
    explanation: 'Synchronizes daily physical tasks between child and parent devices.',
    utility: 'Keeps everyone consistent on structural routines to reduce behavioral blowouts before they begin.',
    pointsEffort: '+5 XP per Habit • Daily Reset',
    icon: Star,
    tone: 'purple'
  },
  'clear cache': {
    title: 'Database Sandbox Reset',
    badge: 'State Diagnostics Clean',
    explanation: 'Clears student and parent localStorage states, reverting all progress variables back to defaults.',
    utility: 'Allows starting the entire 10-step positive journey course fresh from Step 1.',
    pointsEffort: 'Irreversible Diagnostics',
    icon: Shield,
    tone: 'rose'
  },
};

export default function InteractiveExplainerPop() {
  const { currentUser, notificationLogs = [] } = useApp();

  const [activePopup, setActivePopup] = useState<{
    title: string;
    badge: string;
    explanation: string;
    utility: string;
    pointsEffort: string;
    icon: any;
    tone: string;
  } | null>(null);

  const [guideMode, setGuideMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('explainer_guide_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('explainer_sound_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  // State variables for dynamic Speech Synthesis and multilingual narration
  const [langCode, setLangCode] = useState<string>(() => {
    return localStorage.getItem('explainer_narration_lang') || 'en-US';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMode, setSpeakingMode] = useState<'page' | 'assignments' | 'notifications' | null>(null);
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [activeUtterance, setActiveUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Stop current speaking track safely
  const stopNarration = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMode(null);
    setSubtitleText('');
  };

  // Local helper for translating extracted website text or explainer to Hindi, Spanish or French
  const localizeTextForSpeech = (englishText: string, lang: string): string => {
    const rawLower = englishText.toLowerCase().trim();

    // Multilingual clinical vocabulary translations for realistic local guidance
    const DICT: Record<string, Record<string, string>> = {
      'hi-IN': {
        'explainer guide mode active! 💡': 'मार्गदर्शन गाइड मोड सक्रिय है! 💡',
        'interactive help enabled': 'इंटरैक्टिव सहायता सक्षम की गई',
        'hover or click any button on the page to instantly view its detailed clinical co-regulation utility.': 'अपनी स्क्रीन के किसी भी बटन पर माउस लाएं या क्लिक करें ताकि उसका विस्तृत महत्व देखा जा सके।',
        'ideal for onboarding families and mentors, showing what data is affected by clicking different features.': 'अभिभावकों और गाइडों के लिए आदर्श, जो दिखाता है कि कौन सा बटन दबाने से क्या सुधार होता है।',
        'explorer tool enabled': 'खोज टूल सक्षम',
        'co-regulation control hub': 'सह-नियमन नियंत्रण केंद्र - यह आपका मुख्य अभिभावक कार्यक्षेत्र है।',
        'mindbloom learning suite': 'माइंडब्लूम बाल विकास पाठ्य',
        'direct action commitments': 'दैनिक संवेदी गतिविधियां - जैसे स्ट्रेचिंग, पानी पीना और सकारात्मक स्पर्श।',
        'transformation path ledger': 'प्रगति और पदक रिकॉर्ड',
        'connectedness growth dial': 'भावनात्मक विकास ग्राफ - यहाँ आप हृदय गति और बच्चों के तनाव की लाइव जानकारी देख सकते हैं।',
        'sovereign parent register': 'अभिभावक विशेषता प्रोफाइल',
        'system overseer controller': 'सुपर-एडमिन पैनल सैंडबॉक्स',
        'sandbox override switch': 'सिस्टम बायपास सुविधा',
        'adult guidance portal': 'अभिभावक कंट्रोल रूम',
        'kid galaxy co-regulation sandbox': 'बच्चों का विशेष शांत क्षेत्र',
        'active view: assignments': 'सक्रिय पृष्ठ: आपके दैनिक अभ्यास और को-रेग्यूलेशन असाइनमेंट।',
        'active view: learn': 'सक्रिय पृष्ठ: आपके सीखने योग्य मॉड्यूल्स और पाठ।',
        'active view: progress': 'सक्रिय पृष्ठ: प्रगति मीटर और ऐतिहासिक पदक।',
        'active view: milestones': 'सक्रिय पृष्ठ: विकासात्मक चरण और मील के पत्थर।',
        'active view: profile': 'सक्रिय पृष्ठ: अभिभावक व्यक्तिगत सेटिंग्स।',
        'active view: dashboard': 'सक्रिय पृष्ठ: मुख्य नियंत्रण डैशबोर्ड।',
        'welcome to co-regulation': 'माइंडब्लूम अभिभावक मार्गदर्शन में स्वागत है। बच्चों की भावनात्मक संतुलन एवं मांसपेशियों की शांति के लिए गतिविधियों का नियमित अभ्यास करें।'
      },
      'es-ES': {
        'explainer guide mode active! 💡': '¡Modo de guía explicativo activo! 💡',
        'interactive help enabled': 'Asistencia interactiva habilitada',
        'hover or click any button on the page to instantly view its detailed clinical co-regulation utility.': 'Pase el cursor o haga clic en cualquier botón de la página para investigar su utilidad de autorregulación somática.',
        'ideal for onboarding families and mentors, showing what data is affected by clicking different features.': 'Ideal para capacitar a familias, mostrando cómo se asimila cada acción en tiempo real.',
        'explorer tool enabled': 'Explorador del sistema activado',
        'co-regulation control hub': 'Centro principal de autorregulación guiada',
        'mindbloom learning suite': 'Suite de aprendizaje clínico MindBloom',
        'direct action commitments': 'Compromisos de actividades diarias',
        'transformation path ledger': 'Registro de transformación en directo',
        'connectedness growth dial': 'Gráfico de desarrollo emocional',
        'sovereign parent register': 'Registro personalizado del tutor',
        'system overseer controller': 'Controlador supremo de simulación',
        'sandbox override switch': 'Anulación y pruebas rápidas',
        'adult guidance portal': 'Portal de orientación parental',
        'kid galaxy co-regulation sandbox': 'Plataforma para el sosiego infantil',
        'active view: assignments': 'Vista activa: Sus tareas diarias y rutinas somáticas.',
        'active view: learn': 'Vista activa: Lecciones sobre la neurociencia del comportamiento infantil.',
        'active view: progress': 'Vista activa: Metas y medallas completas.',
        'active view: milestones': 'Vista activa: Hitos de desarrollo cerebral.',
        'active view: profile': 'Vista activa: Configuración y preferencias personales.',
        'active view: dashboard': 'Vista de inicio: Panel general de control de bienestar.',
        'welcome to co-regulation': 'Bienvenido a la guía de autorregulación de MindBloom. Registre y complete los desafíos de conexión física para equilibrar el sistema nervioso de su hijo.'
      }
    };

    if (DICT[lang]) {
      // Direct lookup matching text
      for (const [englishKey, translatedVal] of Object.entries(DICT[lang])) {
        if (rawLower.includes(englishKey) || englishKey.includes(rawLower)) {
          return translatedVal;
        }
      }
    }

    // Dynamic localized replacements for any mixed text
    let textOut = englishText;
    if (lang === 'hi-IN') {
      textOut = textOut
        .replace(/Current real-time parent notifications/gi, "अभिभावक लाइव सूचनाएं")
        .replace(/You have (\d+) active updates/gi, "आपके पास $1 सक्रिय सूचनाएं और चेतावनियां हैं")
        .replace(/Here are the latest logs/gi, "नवीनतम सूचनाएं यहाँ हैं")
        .replace(/No unread family alerts or real-time co-regulation trigger notifications/gi, "कोई अपठित अलर्ट या तनाव चेतावनी नहीं है।")
        .replace(/Daily parent child somatic assignments list/gi, "दैनिक अभ्यास कार्य सूची")
        .replace(/Task details:/gi, "कार्य विवरण:")
        .replace(/Task checklist:/gi, "नया अभ्यास कार्य:")
        .replace(/Instructions:/gi, "निर्देश:")
        .replace(/We searched the current view but did not find/gi, "हमें स्क्रीन पर कोई कार्य नहीं मिला।")
        .replace(/Active view: Assignments/gi, "सक्रिय पृष्ठ: अभ्यास कार्य")
        .replace(/Active view: Learn/gi, "सक्रिय पृष्ठ: अभ्यास सीखें")
        .replace(/Active view: Progress/gi, "सक्रिय पृष्ठ: प्रगति मीटर")
        .replace(/Active view: Milestones/gi, "सक्रिय पृष्ठ: विकासात्मक चरण")
        .replace(/Active view: Profile/gi, "सक्रिय पृष्ठ: पेरेंट प्रोफाइल")
        .replace(/Active view: Dashboard/gi, "सक्रिय पृष्ठ: होम डैशबोर्ड")
        .replace(/co-regulation/gi, "सह-नियमन (Co-regulation)")
        .replace(/parent-child/gi, "अभिभावक-बच्चा")
        .replace(/somatic/gi, "शारीरिक")
        .replace(/nervous system/gi, "तंत्रिका तंत्र")
        .replace(/connection/gi, "आपसी जुड़ाव")
        .replace(/breathing/gi, "गहरी सांस")
        .replace(/mindfulness/gi, "सजकता (mindfulness)")
        .replace(/stretch/gi, "स्ट्रेच")
        .replace(/completed/gi, "पूरा हुआ")
        .replace(/healthy/gi, "स्वस्थ")
        .replace(/anxiety/gi, "घबराहट")
        .replace(/anger/gi, "गुस्सा")
        .replace(/screaming/gi, "चिल्लाना")
        .replace(/calm down/gi, "शांत होना")
        .replace(/deep sigh/gi, "गहरी सांस")
        .replace(/positive touch/gi, "स्पर्श")
        .replace(/morning/gi, "सुबह का")
        .replace(/evening/gi, "शाम का")
        .replace(/bedtime/gi, "सोते समय")
        .replace(/hydration/gi, "पानी पीना")
        .replace(/routine/gi, "दिनचर्या")
        .replace(/welcome to/gi, "में आपका स्वागत है");

      return `नमस्ते! माइंडब्लूम वॉइस असिस्टेंट यहाँ है: ${textOut}`;
    }

    if (lang === 'es-ES') {
      textOut = textOut
        .replace(/co-regulation/gi, "co-regulación guiada")
        .replace(/somatic/gi, "somática de tranquilidad")
        .replace(/nervous system/gi, "sistema nervioso central")
        .replace(/developmental milestones/gi, "hitos de maduración conductual")
        .replace(/parent/gi, "padre tutor")
        .replace(/child/gi, "hijo querido")
        .replace(/developmental/gi, "vulnerabilidad de desarrollo")
        .replace(/weekly lessons/gi, "lecciones de capacitación");

      return `Hola. Escuche el contenido: ${textOut}`;
    }

    if (lang === 'fr-FR') {
      textOut = textOut
        .replace(/co-regulation/gi, "co-régulation somatique")
        .replace(/somatic/gi, "somatique")
        .replace(/parent/gi, "parent")
        .replace(/child/gi, "enfant")
        .replace(/assignments/gi, "devoirs de connexion");

      return `Bonjour, assistant de lecture: ${textOut}`;
    }

    return englishText;
  };

  // Helper page content parser which scrapes assignment titles, checkboxes, descriptions or popups dynamically
  const scanAndScrapePageContent = (mode: 'page' | 'assignments' | 'notifications' = 'page'): string => {
    if (activePopup && mode === 'page') {
      return `${activePopup.title}. ${activePopup.badge}. ${activePopup.explanation}. Utility usecase: ${activePopup.utility}`;
    }

    if (mode === 'notifications') {
      if (!notificationLogs || notificationLogs.length === 0) {
        return "You have absolutely no unread family alerts or real-time co-regulation trigger notifications at this time. Stay calm and connected!";
      }
      
      const recentNotifs = notificationLogs.slice(0, 4);
      const elements = recentNotifs.map((log: any, i: number) => {
        const title = log.template || "Behavior Alert Entry";
        const snippet = log.snippet || log.message || "A secure co-regulation checkpoint was reached.";
        const time = log.timestamp || "Just now";
        return `Alert ${i + 1}: ${title}. Message details: ${snippet}. Date: ${time}.`;
      });
      return `Current real-time parent notifications. You have ${notificationLogs.length} active updates. Here are the latest logs: ${elements.join(" ")}`;
    }

    if (mode === 'assignments') {
      const visibleTexts: string[] = [];
      
      // Select headers that are likely assignment titles on Assignments/Learn/Milestones pages
      // E.g. h4.text-stone-850, or headers inside cards
      const tasks = document.querySelectorAll('h4, .chore-title, .assignment-title');
      let count = 0;
      
      tasks.forEach((taskEl) => {
        const title = taskEl.textContent?.trim();
        if (title && title.length > 5 && title.length < 130 && count < 6) {
          if (!title.includes('Settings') && !title.includes('UTC') && !title.includes('Sign out') && !title.includes('Provider')) {
            // Traverse up to find descriptive info
            let description = '';
            const parent = taskEl.parentElement;
            if (parent) {
              const pSibling = parent.querySelector('p');
              if (pSibling && pSibling.textContent) {
                description = pSibling.textContent.trim();
              }
            }
            if (description && description.length > 8 && description.length < 250) {
              visibleTexts.push(`Task checklist: "${title}". Instructions: "${description}".`);
            } else {
              visibleTexts.push(`Task checklist: "${title}".`);
            }
            count++;
          }
        }
      });

      if (visibleTexts.length === 0) {
        // Fallback: search list items
        const listItems = document.querySelectorAll('main ul li, main ol li, .task-item');
        listItems.forEach((li, i) => {
          if (li.textContent && li.textContent.length > 10 && li.textContent.length < 150 && i < 5) {
            visibleTexts.push(li.textContent.trim());
          }
        });
      }

      if (visibleTexts.length === 0) {
        return "We searched the current view but did not find any active items. Navigate to the Assignments room or Learning modules tab to hear fully detailed exercises!";
      }

      return `Daily parent child somatic assignments list: ${visibleTexts.join(". ")}`;
    }

    // Default 'page' mode
    const visibleTexts: string[] = [];
    const windowPath = window.location.pathname.toLowerCase();

    if (windowPath.includes('assignments')) {
      visibleTexts.push("Active view: Assignments. Here is your co-regulation homework schedule.");
    } else if (windowPath.includes('learn')) {
      visibleTexts.push("Active view: Learn. Browse neuroscientific video modules and deliberate breathing scripts.");
    } else if (windowPath.includes('progress')) {
      visibleTexts.push("Active view: Progress. Evaluate consistent streak history and unlock badges.");
    } else if (windowPath.includes('milestones')) {
      visibleTexts.push("Active view: Milestones. Track age-appropriate child sensory, motor, and visceral pathways.");
    } else if (windowPath.includes('profile')) {
      visibleTexts.push("Active view: Profile. Adjust secure PIN values and custom stress sliders.");
    } else {
      visibleTexts.push("Active view: Dashboard. Core de-escalation workspace for parents.");
    }

    const cardHeaders = document.querySelectorAll('main h1, main h2, main h3');
    let limitCount = 0;
    
    cardHeaders.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text.length > 5 && text.length < 150 && limitCount < 5) {
        if (!text.includes('Settings') && !text.includes('UTC') && !text.includes('Sign out') && !text.includes('Demo mode')) {
          visibleTexts.push(text);
          limitCount++;
        }
      }
    });

    if (visibleTexts.length <= 1) {
      visibleTexts.push("welcome to co-regulation. Practice child affirming breathing and folding postures everyday.");
    }

    return visibleTexts.join(". ");
  };

  // Speaks actual text translated into english/hindi/spanish
  const triggerSpeakWebText = (mode: 'page' | 'assignments' | 'notifications' = 'page') => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on this device/browser.");
      return;
    }

    // If currently speaking this exact mode, toggle off/stop
    if (isSpeaking && speakingMode === mode) {
      stopNarration();
      return;
    }

    // Otherwise, cancel any speech synth, play click, and speak the new mode
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    playSlickSound('click');
    const rawEnglishText = scanAndScrapePageContent(mode);
    const localizedString = localizeTextForSpeech(rawEnglishText, langCode);

    setSubtitleText(localizedString);
    setSpeakingMode(mode);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(localizedString);
    utterance.lang = langCode;
    utterance.rate = langCode === 'hi-IN' ? 0.90 : 0.95; // highly clear, empathetic tone
    utterance.pitch = 1.05; // clear friendly pitch

    // Dynamically retrieve vocal cord matched with locale
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMode(null);
      setSubtitleText('');
    };

    utterance.onerror = (e) => {
      console.warn("Speech Synthesis tracking error, fallback cleanly:", e);
      setIsSpeaking(false);
      setSpeakingMode(null);
      setSubtitleText('');
    };

    setActiveUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Watch for language change to update persistent local storage
  const handleSelectLanguage = (code: string) => {
    setLangCode(code);
    localStorage.setItem('explainer_narration_lang', code);
    stopNarration();
    playSlickSound('click');
  };

  // Clean-up speech synthesis on unmount to avoid background voices speaking forever
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synced audio click creator using Web Audio API (very clean, no file loading needed!)
  const playSlickSound = (type: 'hover' | 'click' | 'close') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.setValueAtTime(220, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch (e) {
      // AudioContext blocked by browser policies until interaction is okay
    }
  };

  const showExplainer = (text: string) => {
    const key = text.trim().toLowerCase();
    
    // Find matching dict key via exact or partial substring match
    let foundKey = Object.keys(EXPLAINER_DICTIONARY).find(k => 
      key === k || key.includes(k) || k.includes(key)
    );

    // If nothing found but we have long text, fallback gracefully
    if (!foundKey && key.length > 2) {
      if (key.includes('reflection') || key.includes('journal')) {
        foundKey = 'save reflection';
      } else if (key.includes('student') || key.includes('space') || key.includes('kids')) {
        foundKey = 'student space';
      } else if (key.includes('whatsapp') || key.includes('sms')) {
        foundKey = 'send test whatsapp';
      } else if (key.includes('lesson') || key.includes('complete')) {
        foundKey = 'learn';
      } else if (key.includes('appointment') || key.includes('mentor')) {
        foundKey = 'book appointment';
      } else {
        // Fallback for general buttons
        setActivePopup({
          title: `Action: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
          badge: 'Interactive Interface Controller',
          explanation: 'Launches a specific co-regulation action to update points state or manage local session attributes.',
          utility: 'Enforces parenting structure and maintains user momentum across the 10-step positive transformation pathway.',
          pointsEffort: 'Co-Regulation Flow Integration',
          icon: HelpCircle,
          tone: 'emerald'
        });
        playSlickSound('click');
        resetTimer();
        return;
      }
    }

    if (foundKey) {
      setActivePopup(EXPLAINER_DICTIONARY[foundKey]);
      playSlickSound('click');
      resetTimer();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActivePopup(null);
    }, 8000); // Keep popup visible for 8 seconds to allow reading fully
  };

  // Listen globally to all clicks and hovers to inject this super-responsive experience
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Get closest button or interactive element
      const buttonEl = target.closest('button, [role="button"], a.btn, input[type="submit"]') as HTMLElement;
      
      if (buttonEl) {
        // Extract descriptive text
        const textContent = buttonEl.getAttribute('aria-label') || 
                            buttonEl.getAttribute('title') || 
                            buttonEl.textContent || 
                            '';
        if (textContent.trim()) {
          showExplainer(textContent);
        }
      }
    };

    const handleGlobalMouseOver = (e: MouseEvent) => {
      if (!guideMode) return; // Only trigger popups on hover if "Explainer Mode" is checked on!
      
      const target = e.target as HTMLElement;
      const buttonEl = target.closest('button, [role="button"], a.btn') as HTMLElement;
      
      if (buttonEl) {
        const textContent = buttonEl.getAttribute('aria-label') || 
                            buttonEl.getAttribute('title') || 
                            buttonEl.textContent || 
                            '';
        
        if (textContent.trim()) {
          const key = textContent.trim().toLowerCase();
          const matches = Object.keys(EXPLAINER_DICTIONARY).some(k => 
            key === k || key.includes(k) || k.includes(key)
          );
          if (matches) {
            showExplainer(textContent);
            playSlickSound('hover');
          }
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mouseover', handleGlobalMouseOver);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mouseover', handleGlobalMouseOver);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [guideMode, soundEnabled]);

  const toggleGuideMode = () => {
    const nextVal = !guideMode;
    setGuideMode(nextVal);
    localStorage.setItem('explainer_guide_mode', String(nextVal));
    playSlickSound('click');
    if (nextVal) {
      setActivePopup({
        title: 'Explainer Guide Mode Active! 💡',
        badge: 'Interactive Help Enabled',
        explanation: 'Hover or click ANY button on the page to instantly view its detailed clinical co-regulation utility.',
        utility: 'Ideal for onboarding families and mentors, showing what data is affected by clicking different features.',
        pointsEffort: 'Explorer Tool Enabled',
        icon: Sparkles,
        tone: 'amber'
      });
      resetTimer();
    }
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('explainer_sound_enabled', String(nextVal));
    if (nextVal) {
      // short delay to let audio settings save
      setTimeout(() => playSlickSound('click'), 50);
    }
  };

  // Determine dynamic accent classes based on tone of active item
  const getToneClasses = (tone: string) => {
    switch (tone) {
      case 'amber':
        return {
          border: 'border-amber-400/40 ring-amber-400/10 shadow-amber-950/20',
          badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
          textAccent: 'text-amber-400',
          glowBg: 'from-amber-500/10 to-transparent'
        };
      case 'purple':
        return {
          border: 'border-purple-400/40 ring-purple-400/10 shadow-purple-950/20',
          badgeBg: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
          textAccent: 'text-purple-400',
          glowBg: 'from-purple-500/10 to-transparent'
        };
      case 'rose':
        return {
          border: 'border-rose-400/40 ring-rose-400/10 shadow-rose-950/20',
          badgeBg: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
          textAccent: 'text-rose-400',
          glowBg: 'from-rose-500/10 to-transparent'
        };
      case 'sky':
        return {
          border: 'border-sky-400/40 ring-sky-400/10 shadow-sky-950/20',
          badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
          textAccent: 'text-sky-400',
          glowBg: 'from-sky-500/10 to-transparent'
        };
      case 'orange':
        return {
          border: 'border-orange-400/40 ring-orange-400/10 shadow-orange-950/20',
          badgeBg: 'bg-orange-400/10 text-orange-300 border-orange-400/30',
          textAccent: 'text-orange-400',
          glowBg: 'from-orange-500/10 to-transparent'
        };
      case 'indigo':
        return {
          border: 'border-indigo-400/40 ring-indigo-400/10 shadow-indigo-950/20',
          badgeBg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30',
          textAccent: 'text-indigo-400',
          glowBg: 'from-indigo-500/10 to-transparent'
        };
      case 'emerald':
      default:
        return {
          border: 'border-emerald-400/40 ring-emerald-400/10 shadow-emerald-950/20',
          badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
          textAccent: 'text-emerald-400',
          glowBg: 'from-emerald-500/10 to-transparent'
        };
    }
  };

  const activeTone = activePopup ? getToneClasses(activePopup.tone) : null;
  const ActiveIcon = activePopup?.icon || HelpCircle;

  return (
    <>
      {/* 1. Global Floating Interactive Control Deck & AI Speech Companion */}
      <div id="interactive-floating-deck" className="fixed bottom-24 right-4 z-[90] flex flex-col items-end gap-3.5 max-w-sm">
        
        {/* Dynamic Multilingual Subtitle Display (visible while speaking) */}
        <AnimatePresence>
          {isSpeaking && subtitleText && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-950/95 border border-stone-800 text-stone-200 px-4 py-3 rounded-2xl shadow-xl max-w-xs text-[10.5px] leading-relaxed font-sans mr-2 text-right relative"
            >
              <div className="absolute -bottom-2 right-6 w-3 h-3 bg-stone-950 border-r border-b border-stone-800 rotate-45" />
              <div className="flex items-center gap-1 text-emerald-400 font-mono text-[8px] uppercase tracking-widest font-black mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                🔊 Dr. Vance AI Narrator
              </div>
              <p className="italic">"{subtitleText.substring(0, 150)}{subtitleText.length > 150 ? '...' : ''}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating control dock bar */}
        <div className="flex flex-wrap bg-stone-900/90 text-white rounded-[24px] p-2 sm:p-2.5 shadow-2xl border border-stone-800 backdrop-blur-md items-center gap-2">
          
          {/* Main guide lightbulb toggle button */}
          <button
            onClick={toggleGuideMode}
            id="btn-toggle-guide-mode"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              guideMode 
                ? 'bg-amber-500 text-stone-950 shadow-lg scale-105' 
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
            title={guideMode ? "Disable Explainer Highlight Guides" : "Enable Interactive Button Explainer Guides"}
          >
            <Sparkles className="w-4.5 h-4.5" />
          </button>
          
          {/* Master AI Mute/Pause or Quick Speak Trigger */}
          <button
            onClick={() => {
              if (isSpeaking) {
                stopNarration();
              } else {
                triggerSpeakWebText('page');
              }
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105'
            }`}
            title={isSpeaking ? "Stop Speaking" : "Start General page reading voice"}
          >
            {isSpeaking ? (
              <span className="w-2.5 h-2.5 bg-white rounded-sm" />
            ) : (
              <Volume2 className="w-4.5 h-4.5" />
            )}
          </button>

          {/* Granular Speak Selector Choices */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
            {/* Speak Option 1: Page Overview */}
            <button
              onClick={() => triggerSpeakWebText('page')}
              className={`h-8 px-2.5 rounded-full flex items-center gap-1 transition-all text-[9.5px] uppercase font-mono tracking-wider cursor-pointer ${
                isSpeaking && speakingMode === 'page'
                  ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/30 border border-indigo-400'
                  : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              title="Speak overall page template and headers"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>📄 Page</span>
            </button>

            {/* Speak Option 2: Scribing Somatic Assignments & detailed chores instructions */}
            <button
              onClick={() => triggerSpeakWebText('assignments')}
              className={`h-8 px-2.5 rounded-full flex items-center gap-1 transition-all text-[9.5px] uppercase font-mono tracking-wider cursor-pointer ${
                isSpeaking && speakingMode === 'assignments'
                  ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/30 border border-emerald-400 animate-pulse'
                  : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              title="Read active co-presence assignments & detailed card checkboxes"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>📋 Assignments</span>
            </button>

            {/* Speak Option 3: Recent Cellular/WhatsApp Notifications */}
            <button
              onClick={() => triggerSpeakWebText('notifications')}
              className={`h-8 px-2.5 rounded-full flex items-center gap-1 transition-all text-[9.5px] uppercase font-mono tracking-wider cursor-pointer relative ${
                isSpeaking && speakingMode === 'notifications'
                  ? 'bg-orange-600 text-white font-black shadow-lg shadow-orange-500/30 border border-orange-400'
                  : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              title="Hear the most recent real-time parenting check-ins and live alerts"
            >
              <Bell className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>🔔 Alerts</span>
              {notificationLogs.length > 0 && (
                <span className="bg-orange-500 text-stone-950 font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans absolute -top-1 -right-1">
                  {notificationLogs.length}
                </span>
              )}
            </button>
          </div>

          {/* Squeezed Equalizer Wave Animation (Only when speaking) */}
          {isSpeaking && (
            <div className="flex items-end gap-0.5 h-5 px-1 bg-black/30 rounded py-1 shrink-0">
              <span className="w-0.5 bg-indigo-400 animate-[pulse_0.7s_infinite] h-2.5" />
              <span className="w-0.5 bg-indigo-300 animate-[pulse_0.4s_infinite] h-4" />
              <span className="w-0.5 bg-indigo-400 animate-[pulse_0.9s_infinite] h-1.5" />
              <span className="w-0.5 bg-indigo-500 animate-[pulse_0.5s_infinite] h-3.5" />
            </div>
          )}

          {/* Beautiful flag / language selection buttons directly accessible */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2 pr-1.5">
            <button
              onClick={() => handleSelectLanguage('en-US')}
              className={`text-xs px-2 py-1 rounded transition-all cursor-pointer font-bold ${
                langCode === 'en-US' 
                  ? 'bg-white/10 text-indigo-300 border border-indigo-500/40' 
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Speak in English"
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => handleSelectLanguage('hi-IN')}
              className={`text-xs px-2 py-1 rounded transition-all cursor-pointer font-bold ${
                langCode === 'hi-IN' 
                  ? 'bg-white/10 text-orange-400 border border-orange-500/40' 
                  : 'text-stone-400 hover:text-white'
              }`}
              title="हिन्दी में सुनें (Hindi)"
            >
              🇮🇳 HI
            </button>
            <button
              onClick={() => handleSelectLanguage('es-ES')}
              className={`text-xs px-2 py-1 rounded transition-all cursor-pointer font-bold ${
                langCode === 'es-ES' 
                  ? 'bg-white/10 text-emerald-400 border border-emerald-500/40' 
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Escuchar en Español"
            >
              🇪🇸 ES
            </button>
          </div>

          {/* Quick label showing status */}
          <span 
            onClick={() => triggerSpeakWebText('page')}
            className="text-[9px] font-mono font-bold tracking-wider px-2 cursor-pointer uppercase text-[#a7f3d0] hover:text-white select-none hidden lg:inline-block"
          >
            {isSpeaking ? 'Mute AI' : '🔊 AI Voice Helper'}
          </span>
        </div>
      </div>

      {/* 2. Style-Matching Dynamic Banner Popup overlay exactly match user provided premium reference */}
      <AnimatePresence>
        {activePopup && activeTone && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className={`fixed bottom-6 right-6 z-[100] w-full max-w-sm bg-gradient-to-b from-stone-950 to-stone-900 text-white rounded-3xl p-5 shadow-2xl border ${activeTone.border} ring-4 backdrop-blur-lg flex gap-4 overflow-hidden`}
          >
            {/* Ambient Background Gradient Glow corresponding to tone */}
            <div className={`absolute -inset-10 bg-gradient-radial ${activeTone.glowBg} filter blur-xl opacity-30 pointer-events-none`} />

            {/* Icon Wrapper styled beautifully */}
            <div className="shrink-0 relative z-10">
              <div className={`w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${activeTone.textAccent} shadow-inner`}>
                <ActiveIcon className="w-5.5 h-5.5 animate-pulse" />
              </div>
            </div>

            {/* Column Text Area */}
            <div className="flex-1 space-y-2 min-w-0 relative z-10">
              {/* Badge level banner */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${activeTone.badgeBg}`}>
                  {activePopup.badge}
                </span>
                
                {/* Close Button clickable */}
                <button 
                  onClick={() => {
                    playSlickSound('close');
                    setActivePopup(null);
                  }}
                  className="text-stone-400 hover:text-white transition p-0.5 rounded-md hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Description of what it is */}
              <h3 className="font-serif text-base font-black leading-tight tracking-tight text-stone-100 italic flex items-center gap-1">
                <span>{activePopup.title}</span>
              </h3>
              
              <div className="space-y-1.5">
                <p className="text-[11px] text-stone-350 leading-relaxed font-sans font-medium">
                  {activePopup.explanation}
                </p>
                <p className={`text-[10px] ${activeTone.textAccent} font-semibold font-serif italic border-l-2 border-current pl-2.5 leading-relaxed`}>
                  💡 <strong>Use Case:</strong> {activePopup.utility}
                </p>
              </div>

              {/* Progress counter indicators / point awards */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-stone-400 font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <MousePointerClick className="w-3 h-3 text-stone-400" /> Interaction Tally
                </span>
                <strong className="text-white bg-white/10 px-2 py-0.5 rounded font-sans uppercase font-bold text-[9px] tracking-wider">
                  {activePopup.pointsEffort}
                </strong>
              </div>
            </div>
            
            {/* Custom bottom sliding indicator representing remaining life of active popup */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 8, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500/0 via-amber-500 to-emerald-500/0 opacity-60`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
