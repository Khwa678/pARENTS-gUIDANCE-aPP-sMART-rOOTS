import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Tv, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Clock, 
  Award, 
  Play, 
  MessageCircle,
  Send,
  Zap
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';

export default function LmsLiveStreams() {
  const { 
    liveSessions, 
    selectLiveSessionStatus, 
    addStudentPoints, 
    notificationLogs,
    setNotificationLogs 
  } = useApp();

  const [activeSessionId, setActiveSessionId] = useState<string>('live-1');
  const [userComment, setUserComment] = useState('');
  const [messagesList, setMessagesList] = useState<any[]>([
    { id: 1, user: 'Papa Michael', text: 'Daily sensory loops have really calmed down Emma at bed time.', time: '7:02 PM' },
    { id: 2, user: 'Mentor Kenneth', text: 'Welcome cohort! We are practicing deep chest resets together.', time: '7:05 PM' }
  ]);
  const [pointsClaimed, setPointsClaimed] = useState<string[]>([]);

  // Find active or first live session
  const activeSession = liveSessions.find(s => s.id === activeSessionId) || liveSessions[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    
    setMessagesList(prev => [...prev, {
      id: Date.now(),
      user: 'You (Parent)',
      text: userComment.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setUserComment('');
    addStudentPoints(5); // Reward points for active somatic participation
  };

  const handleClaimPoints = (sessionId: string, points: number) => {
    if (pointsClaimed.includes(sessionId)) return;
    setPointsClaimed(prev => [...prev, sessionId]);
    addStudentPoints(points);
    
    // Spark heavy confetti!
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold flex items-center flex-wrap gap-2">
            <Video className="w-5 h-5 text-rose-500 shrink-0" /> 
            <span>Focus Live Broadcasts</span>
            <span className="inline-block animate-pulse text-base sm:text-lg">📡</span>
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xl">Direct expert-led somatic webinars guiding children, parents and mental health advocates.</p>
        </div>
        
        {/* Toggle between sessions if there are multiple */}
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 max-w-full -mx-4 px-4 md:mx-0 md:px-0">
          {liveSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`py-2 px-3 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                activeSessionId === session.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-500 border border-stone-200/60 hover:text-stone-800'
              }`}
            >
              {session.status === 'live' ? '🔴 Live now' : '📅 Scheduled'} : {session.title.substring(0, 20)}...
            </button>
          ))}
        </div>
      </div>

      {activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main video area (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Wistia/Vimeo Video Simulation card */}
            <div className="aspect-video w-full bg-stone-950 rounded-2xl overflow-hidden relative shadow-md group border border-stone-850">
              
              {/* Check if video is live / embed */}
              {activeSession.streamUrl ? (
                <iframe
                  src={`https://fast.wistia.net/embed/iframe/${activeSession.streamUrl}?videoFoam=true`}
                  title={activeSession.title}
                  allow="autoplay; fullscreen"
                  frameBorder="0"
                  className="w-full h-full absolute inset-0 block"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-6 text-center space-y-4 bg-stone-900">
                  <Tv className="w-12 h-12 text-stone-600 animate-pulse" />
                  <div>
                    <h4 className="font-serif text-base text-stone-200">Video Guidance Offline</h4>
                    <p className="text-xs text-stone-500 max-w-xs mt-1">This class is scheduled to stream live soon by clinical mentors.</p>
                  </div>
                </div>
              )}

              {/* Status floating badge */}
              {activeSession.status === 'live' && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>Interactive Broadcast</span>
                </div>
              )}
            </div>

            {/* Session info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded uppercase font-mono">
                    Host: {activeSession.mentorName}
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-500 font-bold px-2 py-0.5 rounded uppercase font-mono">
                    Target: {activeSession.targetGroup}
                  </span>
                </div>
                <h4 className="font-serif text-lg leading-tight text-stone-850">{activeSession.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">{activeSession.description}</p>
              </div>

              {/* Points Claim Button */}
              <div className="w-full sm:w-auto shrink-0 bg-stone-50 border border-stone-150 p-3 rounded-2xl text-center space-y-2 sm:min-w-[130px]">
                <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Attendance reward</span>
                <strong className="text-amber-500 text-base font-bold font-mono">+{activeSession.pointsReward} XP</strong>
                <button
                  disabled={pointsClaimed.includes(activeSession.id)}
                  onClick={() => handleClaimPoints(activeSession.id, activeSession.pointsReward)}
                  className={`w-full py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center block transition-all cursor-pointer ${
                    pointsClaimed.includes(activeSession.id)
                      ? 'bg-stone-200 text-stone-400'
                      : 'bg-amber-500 hover:bg-amber-600 text-stone-900 shadow-sm font-black'
                  }`}
                >
                  {pointsClaimed.includes(activeSession.id) ? 'Claimed ✔' : 'Claim Reward'}
                </button>
              </div>
            </div>

          </div>

          {/* Somatic Question Hub chat (Col span 1) */}
          <div className="lg:col-span-1 bg-stone-50 rounded-2xl p-4 flex flex-col justify-between h-[360px] border border-stone-200/50">
            <div className="space-y-2 border-b border-stone-150 pb-2.5 shrink-0 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-800">Q&A Mind Share</h4>
                <p className="text-[10px] text-stone-400">Collaborative de-escalation tips.</p>
              </div>
              <span className="text-[9px] bg-emerald-100/60 text-emerald-600 font-bold font-sans px-2 py-0.5 rounded-full uppercase">
                24 Active
              </span>
            </div>

            {/* Chat feed list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-[11px]">
              {messagesList.map((msg) => (
                <div key={msg.id} className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-tiny">
                  <div className="flex justify-between items-center text-stone-400 text-[9px] mb-1 font-mono">
                    <strong className="text-stone-700 font-bold">{msg.user}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Question post Form */}
            <form onSubmit={handlePostComment} className="flex gap-1.5 shrink-0">
              <input
                type="text"
                placeholder="Ask Dr. Alicia Vance..."
                className="flex-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-accent-sage"
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>
      ) : (
        <p className="p-6 text-stone-400 text-center text-xs italic">No active streams or scheduled coaching classes listed.</p>
      )}

    </div>
  );
}
