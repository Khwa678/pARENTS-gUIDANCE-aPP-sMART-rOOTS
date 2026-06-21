import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Award, 
  CheckCircle, 
  Heart, 
  BookOpen, 
  Search, 
  Video, 
  Send,
  Star,
  Check,
  UserCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp, Mentor, Student, ParentAccount, ChatMessage, Appointment } from '../context/AppContext';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function MentorWorkspace() {
  const { 
    currentUser, 
    students, 
    parents, 
    appointments, 
    messages, 
    sendDirectMessage, 
    updateAppointmentStatus,
    studentPortfolio,
    addStudentPoints,
    studentPoints,
    studentHabits,
    sendSessionReminderWhatsApp
  } = useApp();

  // Active sub-tabs inside mentor panel
  const [activeTab, setActiveTab] = useState<'students' | 'appointments' | 'messages'>('students');

  // Selected Student for detailed portfolio review
  const [selectedStudentId, setSelectedStudentId] = useState<string>('S101');
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeStudentParent = parents.find(p => p.studentId === activeStudent.id);

  // New feedback evaluation states
  const [feedbackText, setFeedbackText] = useState('');
  const [badgeType, setBadgeType] = useState('🌟 Spark Resilience Badge');
  const [isEvaluationSuccess, setIsEvaluationSuccess] = useState(false);

  // Scheduled appointment simulation
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [videoCallStatus, setVideoCallStatus] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  // Chat message textbox
  const [typedMessage, setTypedMessage] = useState('');
  // Filter messages specifically for conversation between active mentor ("mentor") and current candidate (Student S101 or Parent Phone)
  const activeChatTarget = activeStudentParent?.phone || '+12345678';
  const chatThread = messages.filter(m => 
    (m.senderId === 'm_vance' && m.recipientId === activeChatTarget) ||
    (m.senderId === activeChatTarget && m.recipientId === 'm_vance')
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    
    // Add msg
    sendDirectMessage({
      senderName: 'Dr. Alicia Vance',
      senderRole: 'mentor',
      senderId: 'm_vance',
      recipientId: activeChatTarget,
      text: typedMessage
    });
    setTypedMessage('');

    // Happy double trigger reply after 1.5 seconds for conversation simulation!
    setTimeout(() => {
      sendDirectMessage({
        senderName: activeStudentParent?.name || 'Jane Doe',
        senderRole: 'parent',
        senderId: activeChatTarget,
        recipientId: 'm_vance',
        text: "Thank you for the guidance! We will practice doing the 4-second balance breathing task tonight."
      });
    }, 1500);
  };

  const handleGradeAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // Simulate grading and awarding bonus experience XP to the student!
    addStudentPoints(45);
    setIsEvaluationSuccess(true);
    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#8bad8b', '#ebcd9e', '#f472b6']
    });

    setTimeout(() => {
      setIsEvaluationSuccess(false);
      setFeedbackText('');
    }, 3000);
  };

  const startVideoCallSimulator = (apt: Appointment) => {
    setActiveVideoCall(apt);
    setVideoCallStatus('calling');
    setTimeout(() => {
      setVideoCallStatus('connected');
    }, 2000);
  };

  const endVideoCallSimulator = () => {
    if (activeVideoCall) {
      updateAppointmentStatus(activeVideoCall.id, 'com-guided');
    }
    setVideoCallStatus('completed');
    setTimeout(() => {
      setVideoCallStatus('idle');
      setActiveVideoCall(null);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 pb-32">
      
      {/* Mentor Hero Information */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r from-accent-sage/10 to-accent-warm/10 rounded-[2.5rem] border border-accent-sage/10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-accent-sage">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250" 
              alt="Dr. Vance" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-[10px] bg-accent-sage/20 text-accent-sage font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono">Verified Mentor Coach</span>
            <h1 className="text-3xl font-serif text-stone-900 mt-1 leading-tight">{currentUser.name}</h1>
            <p className="text-stone-500 text-xs">Specialist • Child Psychology & Sleep Anxiety</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/80 p-3 rounded-2xl text-center shadow-xs border border-stone-105">
            <span className="text-xs text-stone-500 font-bold block uppercase tracking-wide">Students</span>
            <span className="text-lg font-bold font-serif text-stone-900">{students.length} Active</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl text-center shadow-xs border border-stone-105">
            <span className="text-xs text-stone-500 font-bold block uppercase tracking-wide">Sessions</span>
            <span className="text-lg font-bold font-serif text-stone-900">
              {appointments.filter(a => a.status === 'scheduled').length} Pending
            </span>
          </div>
        </div>
      </header>

      {/* Main Switcher */}
      <div className="bg-stone-150 p-1 rounded-2xl grid grid-cols-3 shadow-inner border border-stone-200">
        <button
          onClick={() => setActiveTab('students')}
          className={cn(
            "py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            activeTab === 'students' 
              ? 'bg-white text-stone-900 shadow-md' 
              : 'text-stone-500 hover:text-stone-800'
          )}
        >
          <Users className="w-4 h-4 text-accent-sage" /> Student Care
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={cn(
            "py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            activeTab === 'appointments' 
              ? 'bg-white text-stone-900 shadow-md' 
              : 'text-stone-500 hover:text-stone-800'
          )}
        >
          <Calendar className="w-4 h-4 text-accent-warm" /> Schedule & Calls
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            "py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            activeTab === 'messages' 
              ? 'bg-white text-stone-900 shadow-md' 
              : 'text-stone-500 hover:text-stone-800'
          )}
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" /> Co-regulation Chat
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: STUDENT PORTFOLIO INSIGHTS */}
        {activeTab === 'students' && (
          <motion.div
            key="tab-students"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Left side list of students */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-stone-850 px-1">Assigned Student Profiles</h3>
              <div className="space-y-3">
                {students.map((student) => {
                  const studentParentObj = parents.find(p => p.studentId === student.id);
                  const isCurrent = student.id === selectedStudentId;

                  return (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudentId(student.id);
                      }}
                      className={cn(
                        "w-full text-left p-5 rounded-3xl transition-all border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative overflow-hidden group",
                        isCurrent 
                          ? "bg-stone-900 text-white border-stone-950 shadow-md"
                          : "bg-white text-stone-800 hover:bg-stone-50 border-stone-105"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          isCurrent ? "bg-accent-sage/30 text-accent-sage" : "bg-stone-100 text-stone-600"
                        )}>
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{student.name}</p>
                          <p className={cn("text-[10px] mt-0.5", isCurrent ? "text-stone-400" : "text-stone-500")}>
                            {student.grade} • Connected Parent: {studentParentObj?.name || 'Jane Doe'}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[9px] font-mono px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0",
                        isCurrent ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"
                      )}>
                        ID: {student.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* General coaching guidelines card */}
              <Card className="border-none bg-accent-sage/5 rounded-[2rem] p-6 text-stone-700 space-y-3 mt-4">
                <div className="flex items-center gap-1.5 text-accent-sage">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest font-mono">Pedagogical Guardrails</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Always emphasize effort and consistency over raw outcomes. Encourage parents to practice side-by-side core breathing before bedtime to anchor co-regulation dynamics.
                </p>
              </Card>
            </div>

            {/* Right side Student Portfolio reviews & Feedback assessment */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-stone-900 px-1">
                  Wellness Portfolio & Journal <span className="text-accent-sage font-serif">({activeStudent.name})</span>
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                  XP: {studentPoints}
                </span>
              </div>

              {/* Student responses */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-100 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-accent-sage">Favorite Calming Technique</span>
                  <p className="text-sm font-semibold text-stone-800 italic">
                    "{studentPortfolio.favoriteBreathing || 'Deep tummy warm bubble breath'}"
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-100 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-accent-warm">Physical Tension Release</span>
                  <p className="text-sm font-semibold text-stone-800 italic">
                    "{studentPortfolio.calmDownStrategy || 'Slow stretch, long sigh'}"
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-100 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-indigo-500">Family Communication Commit</span>
                  <p className="text-sm font-semibold text-stone-800 italic">
                    "{studentPortfolio.parentTalkCommitment || 'Dinner table check-ins'}"
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-100 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-emerald-700">Felt Emotions Currently</span>
                  <p className="text-sm font-semibold text-stone-850 font-bold">
                    🌿 {studentPortfolio.feelingToday || 'Satisfied & Calm'}
                  </p>
                </div>

                <div className="sm:col-span-2 bg-white p-6 rounded-[2rem] border border-stone-100 space-y-2">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-amber-600 block">Personal Stress Reflection Journal Entry:</span>
                  <p className="text-sm leading-relaxed text-stone-700 bg-stone-50/50 p-4 rounded-2xl border border-stone-105 font-mono italic">
                    "{studentPortfolio.journalEntry || 'Tonight I did the balloon breathing for 5 minutes with Mommy.'}"
                  </p>
                </div>
              </div>

              {/* Active Evaluation / Feedback builder */}
              <Card className="border-none shadow-md rounded-[2.5rem] bg-stone-900 text-white p-6 md:p-8 space-y-6 overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl" />
                
                <div>
                  <h4 className="text-lg font-serif">Post Coach Evaluation & Reward Point Grant</h4>
                  <p className="text-xs text-stone-400 mt-1">Send a custom motivational badge and award 45 points directly to their student profile.</p>
                </div>

                <form onSubmit={handleGradeAssessment} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-emerald-400">Award Transformation Badge</label>
                      <select 
                        className="w-full h-11 bg-stone-800 border border-stone-700 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                        value={badgeType}
                        onChange={(e) => setBadgeType(e.target.value)}
                      >
                        <option value="🌟 Spark Resilience Badge">🌟 Spark Resilience Badge</option>
                        <option value="🧘 Zen Master Stretch Medal">🧘 Zen Master Stretch Medal</option>
                        <option value="💬 Mindbloom Co-Regulation Star">💬 Mindbloom Co-Regulation Star</option>
                        <option value="👑 Sleep-Anxiety Warrior Trophy">👑 Sleep-Anxiety Warrior Trophy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-emerald-400">XP Points</label>
                      <input 
                        type="text" 
                        disabled 
                        value="+45 points (Auto-Calculated)" 
                        className="w-full h-11 bg-stone-800 border border-stone-700 rounded-xl px-3 text-xs text-stone-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-emerald-400">Coaching Affirmation / Motivational Notes</label>
                    <textarea
                      placeholder="Write an encouragement note that Little John will read from his Student Space (e.g., 'Incredible work on your morning stretch habits! This shows gorgeous focus!...')"
                      className="w-full min-h-[90px] p-4 bg-stone-800 border border-stone-700 rounded-2xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!feedbackText.trim() || isEvaluationSuccess}
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
                  >
                    {isEvaluationSuccess ? (
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Assessment Saved & Points Sent!</span>
                    ) : (
                      <span className="flex items-center gap-1.5">Stamp & Award Badge <Award className="w-4 h-4" /></span>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SCHEDULING & VIDEO CALLS */}
        {activeTab === 'appointments' && (
          <motion.div
            key="tab-appointments"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {/* Appointments table */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-stone-102 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-serif text-stone-900">Your Co-Regulation Check-ins</h3>
                <p className="text-xs text-stone-500 mt-1">Connect directly with parents over video-link or telephone to guide behavior adjustments.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-widest font-mono select-none">
                      <th className="py-3 px-4">Contact Profile</th>
                      <th className="py-3 px-4">Consultation Day</th>
                      <th className="py-3 px-4">Timeslot</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Consult Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-stone-50 whitespace-nowrap text-stone-800 font-medium">
                        <td className="py-4 px-4 font-bold">
                          <div>{apt.patientName}</div>
                          <div className="text-[10px] text-stone-400 font-semibold">{apt.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-mono">{apt.date}</td>
                        <td className="py-4 px-4 font-mono">{apt.time}</td>
                        <td className="py-4 px-4 uppercase tracking-wider font-bold">
                          {apt.type === 'video' ? '📹 Secure Loop Video' : '💬 Parent Chat'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            "px-2 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-extrabold font-mono",
                            apt.status === 'scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          )}>
                            {apt.status === 'scheduled' ? '● PENDING CALL' : '✓ COMPLETED'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {apt.status === 'scheduled' ? (
                            <div className="flex items-center justify-end gap-1.5 ml-auto">
                              <Button
                                onClick={() => {
                                  sendSessionReminderWhatsApp(apt.id);
                                  setReminderSentId(apt.id);
                                  setTimeout(() => setReminderSentId(null), 3500);
                                }}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/50 font-black text-[9px] uppercase tracking-wider py-1.5 px-3 h-auto rounded-full shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <MessageSquare className="w-3 h-3 text-amber-600" />
                                {reminderSentId === apt.id ? '✓ Sent Live' : 'GMail Reminder'}
                              </Button>
                              <Button
                                onClick={() => startVideoCallSimulator(apt)}
                                className="bg-accent-sage hover:bg-accent-sage/90 text-white font-black text-[10px] uppercase tracking-wider py-1.5 px-4 h-auto rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Video className="w-3.5 h-3.5" /> Start Consult
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400 font-bold italic">Session finalized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Immersive Videocall frame */}
            {activeVideoCall && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-900 rounded-[2.5rem] p-6 text-white space-y-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-mono font-bold text-stone-400">Co-regulation Secure Tele-session in Progress</span>
                  </div>
                  <span className="text-xs text-stone-300 font-bold">Target Patient: <strong className="text-white font-mono">{activeVideoCall.patientName}</strong></span>
                </div>

                {videoCallStatus === 'calling' && (
                  <div className="h-[280px] bg-stone-850 rounded-2xl flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent-sage/20 border border-accent-sage flex items-center justify-center text-accent-sage text-2xl animate-bounce">
                      📞
                    </div>
                    <p className="text-xs text-stone-400 uppercase tracking-widest font-mono">Pinging student / parent device loop...</p>
                  </div>
                )}

                {videoCallStatus === 'connected' && (
                  <div className="grid md:grid-cols-2 gap-4 h-[320px]">
                    {/* User Feed (Simulated camera) */}
                    <div className="bg-stone-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" 
                          alt="You" 
                          className="w-full h-full object-cover opacity-75"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9px] bg-stone-950/80 px-2 py-1 rounded-md font-mono self-start uppercase tracking-wider relative z-10 z-10">
                        🎥 Dr. Alicia Vance (You)
                      </span>
                    </div>

                    {/* Student/Parent Feed */}
                    <div className="bg-stone-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0">
                        <img 
                          src="https://images.unsplash.com/photo-1536640717440-8b546e658361?auto=format&fit=crop&q=80&w=400" 
                          alt="Parents" 
                          className="w-full h-full object-cover opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9px] bg-stone-950/80 px-2 py-1 rounded-md font-mono self-start uppercase tracking-wider relative z-10">
                        👥 Connected Feed - {activeVideoCall.patientName}
                      </span>
                      <div className="relative z-10 bg-black/50 p-2.5 rounded-lg text-[10px] text-stone-200">
                        <span className="font-bold text-accent-sage">Current Topic:</span> "{activeVideoCall.notes}"
                      </div>
                    </div>
                  </div>
                )}

                {videoCallStatus === 'completed' && (
                  <div className="h-[280px] bg-stone-950 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-500 transition-transform" />
                    <p className="text-sm font-serif">Session Completed Successfully</p>
                    <p className="text-xs text-stone-500 uppercase tracking-widest font-mono">Generating report summary for user reflections...</p>
                  </div>
                )}

                <div className="flex gap-4 justify-center border-t border-stone-800 pt-4">
                  <Button
                    onClick={endVideoCallSimulator}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-4 rounded-xl"
                  >
                    Disconnect & Complete Call
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CO-REGULATION CHAT THREAD */}
        {activeTab === 'messages' && (
          <motion.div
            key="tab-messages"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Select chat target side menu */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-stone-850 px-1">Active Chat Connections</h3>
              <div className="space-y-2">
                <button className="w-full p-4 rounded-2xl border bg-white border-accent-sage text-left font-bold text-xs flex items-center justify-between">
                  <div>
                    <p className="text-stone-900 font-black">{activeStudentParent?.name || 'Jane Doe'} (Parent)</p>
                    <p className="text-[10px] font-bold text-accent-sage mt-0.5">● Little John's Mom</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-accent-sage animate-ping" />
                </button>
                <div className="opacity-50 pointer-events-none p-4 rounded-2xl border bg-stone-100 text-left font-bold text-xs">
                  <p className="text-stone-700">Robert Smith (Parent)</p>
                  <p className="text-[9px] text-stone-500 font-bold mt-0.5">Emma Smith's Father (Offline)</p>
                </div>
              </div>
            </div>

            {/* Simulated Chat Thread */}
            <div className="md:col-span-2 space-y-4 flex flex-col justify-between bg-white p-6 rounded-[2.5rem] border border-stone-105 h-[500px]">
              
              {/* Message flow area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 select-text font-sans">
                {chatThread.map((msg) => {
                  const isMe = msg.senderRole === 'mentor';
                  return (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex flex-col max-w-[85%] space-y-1.5",
                        isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase font-mono tracking-wider">
                          {isMe ? 'You (Dr. Vance)' : msg.senderName}
                        </span>
                        <span className="text-[9px] text-stone-300 font-mono">{msg.timestamp}</span>
                      </div>
                      <div className={cn(
                        "p-4 text-xs font-semibold leading-relaxed shadow-xs rounded-[1.3rem] relative",
                        isMe 
                          ? 'bg-accent-sage text-white rounded-tr-none' 
                          : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none'
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Typing area */}
              <form onSubmit={handleSendMessage} className="border-t border-stone-100 pt-4 flex gap-3">
                <input 
                  type="text" 
                  placeholder="Type advice or guidance feedback for Jane Doe..." 
                  className="flex-1 h-12 bg-stone-50 border border-stone-200 rounded-xl px-4 focus:outline-none focus:border-accent-sage focus:bg-white text-xs text-stone-800 font-semibold"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={!typedMessage.trim()}
                  className="h-12 w-12 rounded-xl bg-accent-sage text-white hover:bg-accent-sage/90 shrink-0 flex items-center justify-center p-0 shadow-sm"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
