import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  HelpCircle, 
  ChevronRight,
  ExternalLink,
  Award,
  Edit2,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  Lock,
  XCircle,
  Clock,
  Calendar,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '../context/AppContext';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function Profile() {
  const { 
    currentUser, 
    updateParentProfile, 
    logoutUser,
    notificationLogs,
    strictnessLevel,
    setStrictnessLevel,
    notificationProvider,
    setNotificationProvider,
    isWhatsAppActive,
    setIsWhatsAppActive,
    latestEmailPreview,
    setLatestEmailPreview,
    sendTelegramNotification
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  
  // Real or mock data holders based on logged in user
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [sentWhatsAppBody, setSentWhatsAppBody] = useState<string | null>(null);

  // New interactive preferences & support panel states
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isRealtimeLogs, setIsRealtimeLogs] = useState(true);
  const [isHipaa, setIsHipaa] = useState(true);
  const [activePlan, setActivePlan] = useState('Premium Admin');
  const [supportText, setSupportText] = useState('');
  const [supportDialogue, setSupportDialogue] = useState<Array<{ sender: 'parent' | 'clinician', message: string, time: string }>>([
    { sender: 'clinician', message: 'Hello! I am Dr. Vance. Feel free to ask about bedtime sleep rhythms, strictness levels, or emotional co-regulation guidance.', time: 'Just now' }
  ]);
  const [isSupportResponding, setIsSupportResponding] = useState(false);
  const [previewingCertificate, setPreviewingCertificate] = useState<'coreg' | 'empathy' | null>(null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Synchronize with currentUser on load or context change
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setPassword(currentUser.password || '');
      setTelegramChatId(currentUser.telegramChatId || '');
    }
  }, [currentUser]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateParentProfile({ photoUrl: reader.result });
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.3 }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    
    // Simulate tiny network update behavior
    setTimeout(() => {
      // Call Context update which triggers simulated WhatsApp notification (wt-5) and persists parent details
      updateParentProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
        telegramChatId: telegramChatId.trim()
      });

      setLoading(false);
      setIsEditing(false);
      setShowSuccessToast(true);

      // Trigger Telegram notification of profile update if chatId is supplied
      if (telegramChatId.trim()) {
        sendTelegramNotification(telegramChatId.trim(), `<b>🔐 Parent Profile Update Secured:</b>\n\nDear Parent <b>${name.trim()}</b>,\n\nYour MindBloom safety profile was successfully updated!\n\n👤 Name: <b>${name.trim()}</b>\n📞 Phone: <b>${phone.trim()}</b>\n📧 Email: <b>${email.trim() || 'N/A'}</b>\n\nStay secure and breathe deep!`);
      }

      // Extract the sent WhatsApp notification summary block to display directly to the parent as verification
      const timeStr = new Date().toLocaleString();
      const summaryMsg = `Security Alert: Hello *${name.trim()}*! 🔐\nYour Parent Guidance profile has been successfully updated.\n\nUpdated account details:\n👤 Name: *${name.trim()}*\n📞 Phone: *${phone.trim()}*\n📧 Email: *${email.trim() || 'N/A'}*\n\nIf you did not authorize this change, please contact Remix support immediately.`;
      setSentWhatsAppBody(summaryMsg);

      // Fade out Success Toast after 15 seconds or on dismiss
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 15000);
    }, 850);
  };

  // Handler for sending simulated support messages and receiving clinician feedback
  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportText.trim()) return;

    const userMsg = supportText.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSupportDialogue(prev => [...prev, { sender: 'parent', message: userMsg, time: nowTime }]);
    setSupportText('');
    setIsSupportResponding(true);

    // Dynamic responses depending on keywords
    setTimeout(() => {
      let reply = "I have received your request. Let's touch base during our upcoming live co-regulation video scheduled in your Dashboard workspace, or I will update your daily check-in sequence.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('sleep') || lower.includes('bedtime') || lower.includes('night')) {
        reply = "Bedtime co-regulation is essential! Try limiting blue-screens 60 minutes prior, and utilize the 'Forest Tree Pose' stretching guide in your child's Kid Space.";
      } else if (lower.includes('angry') || lower.includes('anger') || lower.includes('tantrum') || lower.includes('fight')) {
        reply = "When tantrums spike, focus entirely on your physical presence first. Limit spoken commands, lower your vocal register, and match their altitude physically to signal safety.";
      } else if (lower.includes('strict') || lower.includes('lock') || lower.includes('block')) {
        reply = "I suggest adjusting your 'Parent Space Strictness' to Moderate first. A gentle core-validation boundary paired with small screen limits produces better long-term compliance.";
      }

      setSupportDialogue(prev => [...prev, { sender: 'clinician', message: reply, time: nowTime }]);
      setIsSupportResponding(false);

      // Trigger standard notification log
      const supportLog = {
        id: 'support_log_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        templateName: 'Clinician Helpdesk Synchronization',
        recipient: email || 'khwahishseth@gmail.com',
        payload: `[Priority Inquiry] User: "${userMsg}"\nResponse: "${reply}"`,
        status: 'sent' as const
      };
      // Save directly to localStorage to sync
      const updatedLogs = [supportLog, ...notificationLogs];
      localStorage.setItem('parent_guidance_notif_logs', JSON.stringify(updatedLogs));

    }, 1300);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-10 pb-32" id="profile-workspace">
      
      {/* Dynamic Success Alert showing customized live notification status */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-stone-900 text-stone-100 border border-stone-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 pointer-events-none">💬</div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">WhatsApp Alert Dispatched</span>
                </div>
                <h3 className="text-lg font-serif text-white font-bold">Profile Successfully Updated</h3>
                <p className="text-xs text-stone-400 max-w-lg leading-relaxed">
                  A verification confirmation alert was successfully configured and simulated for delivery to **{phone}**! A copy of this log is available in the security notification logs.
                </p>
                {sentWhatsAppBody && (
                  <div className="bg-stone-950 rounded-xl p-4 mt-3 border border-stone-800 text-[11px] font-mono leading-relaxed text-stone-300 whitespace-pre-wrap max-w-xl">
                    <div className="text-[9px] uppercase tracking-widest text-stone-500 font-bold mb-2 pb-1 border-b border-stone-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>Simulated WhatsApp Push Body</span>
                    </div>
                    {sentWhatsAppBody}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => setShowSuccessToast(false)}
                variant="outline" 
                className="rounded-full shrink-0 border-stone-700 hover:bg-stone-800 text-stone-300 font-bold text-xs"
              >
                Acknowledge Alert
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col items-center text-center space-y-6 pt-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group cursor-pointer"
          onClick={() => document.getElementById('profile-photo-upload')?.click()}
          title="Click to change profile photo"
        >
          <input 
            type="file" 
            id="profile-photo-upload" 
            accept="image/*" 
            className="hidden" 
            onChange={handlePhotoUpload} 
          />
          <Avatar className="w-32 h-32 border-4 border-stone-100 shadow-xl relative z-10 bg-white overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-stone-300">
            <AvatarImage 
              src={currentUser?.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || 'Jane')}`} 
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-accent-sage text-white text-3xl font-serif">
              {name ? name.substring(0, 2).toUpperCase() : 'JD'}
            </AvatarFallback>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white z-20">
              <Camera className="w-6 h-6 animate-bounce" />
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold mt-1">Upload Photo</span>
            </div>
          </Avatar>
          
          <div className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-600 transition-all text-white p-2.5 rounded-full shadow-lg z-25 border-2 border-white cursor-pointer"
               onClick={(e) => {
                 e.stopPropagation();
                 document.getElementById('profile-photo-upload')?.click();
               }}>
            <Camera className="w-4 h-4" />
          </div>
        </motion.div>

        <div className="space-y-1.5">
           <h1 className="text-3xl font-serif text-stone-900 leading-tight tracking-tight">
             {name || 'Jane Doe'}
           </h1>
           <p className="text-stone-500 font-medium italic text-xs max-w-sm">
             Verified Parent Account ID: <strong className="font-mono text-stone-600 font-bold">{phone || 'None'}</strong>
           </p>
        </div>

        {!isEditing && (
          <div className="flex gap-4">
             <Button 
               onClick={() => setIsEditing(true)}
               variant="outline" 
               className="rounded-full border-stone-200 hover:bg-stone-50 text-stone-600 px-8 font-bold flex items-center gap-2 cursor-pointer"
             >
               <Edit2 className="w-3.5 h-3.5" />
               <span>Edit Profile Credentials</span>
             </Button>
          </div>
        )}
      </header>

      {/* Main Profile Area: Settings Lists or Active Editor Form */}
      <Card className="border border-stone-200/60 shadow-md rounded-[2.5rem] bg-white overflow-hidden transition-all duration-300 p-1">
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="static-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-serif text-stone-800 font-bold">Account Specifications</h2>
                  <p className="text-xs text-stone-400">General workspace variables and registered parent settings.</p>
                </div>
                <span className="text-[10px] uppercase font-mono bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-bold">
                  Demo Session active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Parent Full Name</p>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">{name || 'Not configured'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">WhatsApp Phone No</p>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">{phone || 'Not configured'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Primary Email Address</p>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">{email || 'Not configured'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Workspace Password</p>
                    <p className="text-xs font-bold text-stone-700 mt-0.5 font-mono">••••••••</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">Telegram Chat ID</p>
                    <p className="text-xs font-bold text-stone-700 mt-0.5 font-mono">{currentUser?.telegramChatId || 'Not configured'}</p>
                  </div>
                </div>
              </div>

              {!currentUser?.isAdmin && (
                <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl mt-2 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center font-bold shrink-0">
                    🛡️
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-serif font-bold text-stone-800">Assigned Student Space Information</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed leading-normal">
                      Your parent portal is linked to **{currentUser?.studentName || 'Your Child'}** (Student ID: **{currentUser?.studentId || 'N/A'}**), currently placed under classroom batch **{currentUser?.batchCohort || 'Active Cohort'}**.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="editing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleUpdate}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-serif text-stone-800 font-bold">Edit Parent Credentials</h2>
                  <p className="text-xs text-stone-400">Modifying your parameters automatically triggers a security audit confirmation over WhatsApp.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (currentUser) {
                      setName(currentUser.name);
                      setPhone(currentUser.phone);
                      setEmail(currentUser.email || '');
                      setPassword(currentUser.password || '');
                    }
                  }}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer font-mono"
                >
                  Cancel Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5/5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">Parent Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-450" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5/5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">WhatsApp Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-450" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +91XXXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5/5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">Primary Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-450" />
                    <input 
                      type="email" 
                      placeholder="e.g. you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5/5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">Local Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-450" />
                    <input 
                      type="password" 
                      required
                      placeholder="🔒 Set login key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5/5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">Telegram Chat ID (Optional)</label>
                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-450" />
                    <input 
                      type="text" 
                      placeholder="e.g. 512345678"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 font-medium font-mono"
                    />
                  </div>
                  <span className="text-[9px] text-stone-400 block px-1 mt-1">
                    Search <strong>@Studentparentbot</strong> on Telegram, click Start, and enter Chat ID. Find yours via <strong>@userinfobot</strong>.
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100/40 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 text-sm font-bold">✓</div>
                <div className="text-[11px] text-stone-605">
                  <strong>WhatsApp Integration active:</strong> Once saved, we instantly call template <strong>wt-5 (Profile Update Confirmation)</strong> to send a customized status warning to: <strong className="font-mono">{phone || '[Not entered]'}</strong>.
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (currentUser) {
                      setName(currentUser.name);
                      setPhone(currentUser.phone);
                      setEmail(currentUser.email || '');
                      setPassword(currentUser.password || '');
                    }
                  }}
                  className="h-11 px-6 text-stone-500 hover:text-stone-800 bg-stone-100 border border-stone-150 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-7 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save and Send WhatsApp Confirmation</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>

      {/* Sub-sections layout */}
      <div className="grid gap-8">
        
        {/* PREFERENCES SECTION */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 px-2 tracking-widest">Preferences</h3>
          <Card className="border border-stone-150 shadow-sm overflow-hidden rounded-[2rem] bg-white p-1">
            <div className="divide-y divide-stone-50">
<<<<<<< HEAD
              {/* GMail / Email notifications row */}
=======
<<<<<<< HEAD
              {/* GMail / Email notifications row */}
=======
              
              {/* WhatsApp notifications row */}
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'whatsapp' ? null : 'whatsapp')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-amber-500 transition-colors">
                     <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block font-serif">GMail / Email Notifications</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gateway: {notificationProvider || 'Google SMTP'}</span>
<<<<<<< HEAD
=======
=======
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-emerald-500 transition-colors">
                     <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">WhatsApp Notifications</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gateway: {notificationProvider || 'Twilio'}</span>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono px-3 py-1 rounded-full font-bold transition-colors",
                    isWhatsAppActive 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                      : "bg-stone-100 text-stone-500 border border-stone-150"
                  )}>
<<<<<<< HEAD
                    {isWhatsAppActive ? "🟢 SMTP Active" : "⚪ Paused OFF"}
=======
<<<<<<< HEAD
                    {isWhatsAppActive ? "🟢 SMTP Active" : "⚪ Paused OFF"}
=======
                    {isWhatsAppActive ? "🟢 Active ON" : "⚪ Paused OFF"}
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'whatsapp' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'whatsapp' && (
                    <motion.div
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Configured Email SMTP Router Infrastructure</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">Choose which secure cellular cloud email provider handles parent-child guidance milestone notifications sent to your inbox.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {['Google SMTP Client', 'OAuth Gmail Relay', 'SendGrid Standard', 'Amazon SES Premium'].map((provider) => {
                          const isSelected = (notificationProvider || 'Google SMTP Client') === provider;
<<<<<<< HEAD
=======
=======
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Configured SMS Carrier Infrastructure Gateway</h4>
                        <p className="text-[11px] text-stone-500 leading-relaxed">Choose which secure cellular cloud provider handles template SMS notifications sent to {phone || 'your phone link'}.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {['Twilio', 'WhatsApp Cloud API', 'Gupshup Secure', 'Infobip Direct'].map((provider) => {
                          const isSelected = (notificationProvider || 'Twilio') === provider;
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                          return (
                            <button
                              key={provider}
                              type="button"
                              onClick={() => {
                                setNotificationProvider(provider);
                                localStorage.setItem('parent_guidance_notif_provider', provider);
                                confetti({
                                  particleCount: 30,
                                  spread: 25,
                                  colors: ['#8bad8b', '#ebcd9e']
                                });
                              }}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-2xl border text-left transition-all text-xs font-extrabold cursor-pointer",
                                isSelected 
                                  ? "bg-white border-stone-400 text-stone-900 shadow-sm font-black" 
                                  : "bg-transparent border-stone-200 text-stone-500 hover:bg-white/40"
                              )}
                            >
                              <span>{provider}</span>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-stone-800" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* QUICK TOGGLE SWITCH */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                            <span className={cn("w-2 h-2 rounded-full", isWhatsAppActive ? "bg-emerald-500 animate-ping" : "bg-stone-300")} />
<<<<<<< HEAD
                            <span>GMail Notification Relay Service</span>
=======
<<<<<<< HEAD
                            <span>GMail Notification Relay Service</span>
=======
                            <span>WhatsApp Notification Relay Service</span>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                          </h5>
                          <p className="text-[10px] text-stone-550 leading-relaxed">
                            When active, updates on kid streaks and completed calendar tasks are delivered in real-time to your inbox at <strong className="font-mono text-stone-700 font-extrabold">{currentUser?.email || email || 'your email'}</strong> and mirrored to **khwahishseth@gmail.com**!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsWhatsAppActive(!isWhatsAppActive);
                            confetti({ particleCount: 30, spread: 25 });
                          }}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2",
                            isWhatsAppActive ? "bg-emerald-600" : "bg-stone-250"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                              isWhatsAppActive ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-4">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        <p className="text-[10px] text-stone-400 italic">Handshake records are logged inside the system instantly upon SMTP dispatch.</p>
                        <Button
                          type="button"
                          onClick={() => {
                            setPingStatus("connecting");

                            const emailTo = currentUser?.email || email || 'khwahishseth@gmail.com';
                            const handshakeText = `Dear ${currentUser?.name || name || 'Parent Guest'},\n\nThis is a real-time system handshake from MindBloom Parent Guidance.\n\nYour GMail / Email Notification has been successfully turned ON! You are now set up to receive instant family connection updates.\n\nGateway Router: ${notificationProvider || 'Google SMTP Client'}\nRecipient: ${emailTo}\nStatus: Active 🟢\nTimestamp: ${new Date().toLocaleString()}\n\nBreathe slow and stay tuned!`;
<<<<<<< HEAD
=======
=======
                        <p className="text-[10px] text-stone-400 italic">Connected devices are security-logged immediately upon transmission handshake.</p>
                        <Button
                          type="button"
                          onClick={() => {
                            if (!phone) {
                              alert("Please update your WhatsApp Phone Number inside credentials first.");
                              return;
                            }
                            setPingStatus("connecting");

                            const emailTo = currentUser?.email || email || 'khwahishseth@gmail.com';
                            const handshakeText = `Dear ${currentUser?.name || name || 'Parent Guest'},\n\nThis is a real-time system handshake from MindBloom Parent Guidance.\n\nYour WhatsApp Notification has been successfully turned ON! You are now set up to receive instant family connection updates.\n\nGateway Gateway: ${notificationProvider || 'Twilio'}\nPhone Target: ${phone}\nStatus: Active 🟢\nTimestamp: ${new Date().toLocaleString()}\n\nBreathe slow and stay tuned!`;
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5

                            // 1. Fire real test email to email inbox
                            fetch("/api/send-email", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                to: emailTo,
<<<<<<< HEAD
                                subject: `📧 GMAIL INSTANT NOTIFICATION Handshake Ping`,
=======
<<<<<<< HEAD
                                subject: `📧 GMAIL INSTANT NOTIFICATION Handshake Ping`,
=======
                                subject: `📲 WHATSAPP INSTANT NOTIFICATION Handshake Ping`,
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                                text: handshakeText
                              })
                            })
                            .then(r => r.json())
                            .then(data => {
                              console.log("Real-time SMTP notification dispatched successfully!", data);
                              if (data.previewUrl) {
                                setLatestEmailPreview(data.previewUrl);
                              }
                            })
                            .catch(err => console.error("SMTP error:", err));

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                            setTimeout(() => {
                              // Trigger log
                              const testLog = {
                                id: 'test_em_log_' + Date.now(),
                                timestamp: new Date().toLocaleString(),
                                templateName: 'GMail Security Handshake Ping',
                                recipient: emailTo,
                                payload: handshakeText,
                                status: 'sent' as const
<<<<<<< HEAD
=======
=======
                            // 2. Dispatch real WhatsApp message backend call (Calls Twilio or CallMeBot)
                            fetch("/api/send-whatsapp", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                to: phone,
                                text: handshakeText,
                                provider: notificationProvider,
                                apiKey: localStorage.getItem('parent_guidance_notif_key') || ''
                              })
                            })
                            .then(r => r.json())
                            .then(data => console.log("WhatsApp dispatch processed:", data))
                            .catch(err => console.error("WhatsApp dispatch error:", err));

                            // 3. Dispatch real Telegram message backend call if configured
                            const activeChatId = currentUser?.telegramChatId || telegramChatId;
                            if (activeChatId && activeChatId.trim()) {
                              fetch("/api/send-telegram", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  chatId: activeChatId.trim(),
                                  text: `<b>🤖 MindBloom Safety Handshake:</b>\n\nDear Parent <b>${currentUser?.name || name || 'Parent Guest'}</b>,\n\nYour Telegram Notification is successfully active! 🟢\n\nGateway Server Status: Online\nTimestamp: ${new Date().toLocaleString()}\n\nBreathe slow and stay tuned!`
                                })
                              })
                              .then(r => r.json())
                              .then(data => console.log("Telegram dispatch processed:", data))
                              .catch(err => console.error("Telegram dispatch error:", err));
                            }

                            setTimeout(() => {
                              // Trigger SMS log
                              const alertMsg = `🔄 [TEST SYSTEM HANDSHAKE] Connection with the ${notificationProvider || 'Twilio'} cellular gateway has passed security compliance validations. Active number: ${phone}.`;
                              const testLog = {
                                id: 'test_wt_log_' + Date.now(),
                                timestamp: new Date().toLocaleString(),
                                templateName: 'Security Channel Verification Ping',
                                recipient: phone,
                                payload: handshakeText,
                                status: 'sent' as const,
                                waLink: `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(handshakeText)}`
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                              };
                              // Add to notification logs list
                              const updatedLogs = [testLog, ...notificationLogs];
                              localStorage.setItem('parent_guidance_notif_logs', JSON.stringify(updatedLogs));

                              setPingStatus("sent");
                              confetti({
                                particleCount: 70,
                                spread: 40,
                                colors: ['#ebcd9e', '#f472b6']
                              });
                              setTimeout(() => setPingStatus(null), 8000); // Keep longer so they can click the direct link
                            }, 1000);
                          }}
                          disabled={pingStatus === 'connecting'}
                          className="rounded-full bg-stone-900 hover:bg-stone-850 h-9 font-bold text-white text-[10px] uppercase tracking-wider px-4 shrink-0 transition-transform hover:scale-[1.02]"
                        >
<<<<<<< HEAD
                          {pingStatus === 'connecting' ? 'Pinging...' : pingStatus === 'sent' ? '✓ Email Sent' : '📧 Send Live Test Email'}
=======
<<<<<<< HEAD
                          {pingStatus === 'connecting' ? 'Pinging...' : pingStatus === 'sent' ? '✓ Email Sent' : '📧 Send Live Test Email'}
=======
                          {pingStatus === 'connecting' ? 'Pinging...' : pingStatus === 'sent' ? '✓ Dispatched Live' : '📲 Send Live Test Ping'}
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                        </Button>
                      </div>

                      {pingStatus === 'sent' && (
                        <div className="space-y-2 mt-2">
                          <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-mono">
<<<<<<< HEAD
                            ✓ Handshake email dispatched successfully! A copy of this alert has been sent to {currentUser?.email || email || 'khwahishseth@gmail.com'}!
                          </p>
=======
<<<<<<< HEAD
                            ✓ Handshake email dispatched successfully! A copy of this alert has been sent to {currentUser?.email || email || 'khwahishseth@gmail.com'}!
                          </p>
=======
                            ✓ Handshake signal sent! A copy of this alert has also been dispatched to your email inbox!
                          </p>
                          <a
                            href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Dear ${currentUser?.name || name || 'Parent Guest'},\n\n This is a real-time system handshake from MindBloom Parent Guidance.\n\nYour WhatsApp Notification has been successfully turned ON! 🟢`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer text-center font-sans"
                          >
                            📲 Open Real WhatsApp Instantly to +{phone.replace(/\D/g, "")}
                          </a>
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                          {latestEmailPreview && (
                            <a
                              href={latestEmailPreview}
                              target="_blank"
                              rel="noopener noreferrer"
<<<<<<< HEAD
                              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer text-center font-mono"
                            >
                              📧 Read Dispatched GMail Preview (Ethereal / Mailtrap Sandbox)
=======
<<<<<<< HEAD
                              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer text-center font-mono"
                            >
                              📧 Read Dispatched GMail Preview (Ethereal / Mailtrap Sandbox)
=======
                              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer text-center font-mono"
                            >
                              📧 Read Dispatched Email (Sandbox)
>>>>>>> 8f3d1595f83be8a19abaeebff5b3d460ca842f31
>>>>>>> 545db1ab596b815415ee19120be509248701a9b5
                            </a>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Privacy & Security Audits */}
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'privacy' ? null : 'privacy')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-amber-500 transition-colors">
                     <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">Privacy & Security Audits</span>
                    <span className="text-[10px] text-stone-400">HIPAA Compliant | AES keys locked</span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-bold">
                    Double CC Guarded
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'privacy' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'privacy' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Parent Dashboard Safety Measures</h4>
                        <p className="text-[11px] text-stone-500">Enable secondary authentication filters and logs auditing for extreme compliance bounds.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-100">
                          <div>
                            <p className="text-xs font-bold text-stone-800">Simulate Two-Factor SMS Code on Login</p>
                            <p className="text-[10px] text-stone-450 mt-0.5">Always request temporary pin authorization if signing in with a mobile cohort ticket.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer outline-none shrink-0",
                              is2FAEnabled ? "bg-stone-900" : "bg-stone-200"
                            )}
                          >
                            <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", is2FAEnabled ? "translate-x-6" : "translate-x-0")} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-100">
                          <div>
                            <p className="text-xs font-bold text-stone-800">Real-time Email Dispatch of Login Failures</p>
                            <p className="text-[10px] text-stone-450 mt-0.5">Dispatches audit notes to {email || 'khwahishseth@gmail.com'} immediately during malicious login events.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsRealtimeLogs(!isRealtimeLogs)}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer outline-none shrink-0",
                              isRealtimeLogs ? "bg-stone-900" : "bg-stone-200"
                            )}
                          >
                            <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", isRealtimeLogs ? "translate-x-6" : "translate-x-0")} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-100">
                          <div>
                            <p className="text-xs font-bold text-stone-800">Enforce Hardened Clinician HIPAA Encryption</p>
                            <p className="text-[10px] text-stone-450 mt-0.5">Sandboxes chat transmissions and co-regulation objectives into high-security encrypted arrays.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsHipaa(!isHipaa)}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer outline-none shrink-0",
                              isHipaa ? "bg-stone-900" : "bg-stone-200"
                            )}
                          >
                            <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", isHipaa ? "translate-x-6" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                        <Button
                          type="button"
                          onClick={() => {
                            confetti({
                              particleCount: 50,
                              spread: 30,
                              colors: ['#8bad8b', '#f472b6']
                            });
                            // Generate simulated audit log entry for privacy modification
                            const auditLog = {
                              id: 'privacy_audit_log_' + Date.now(),
                              timestamp: new Date().toLocaleString(),
                              templateName: 'Privacy Compliancy Audit Handshake',
                              recipient: email || 'khwahishseth@gmail.com',
                              payload: `Security Guard Modified\n- 2FA Policy: ${is2FAEnabled ? 'ACTIVE' : 'INACTIVE'}\n- Email Dispatches: ${isRealtimeLogs ? 'ACTIVE' : 'INACTIVE'}\n- HIPAA Cipher level: ${isHipaa ? 'SECURE_SSL' : 'BASIC_LOCAL'}\n- User Action: Generated manual compliancy review key.`,
                              status: 'sent' as const
                            };
                            const updatedLogs = [auditLog, ...notificationLogs];
                            localStorage.setItem('parent_guidance_notif_logs', JSON.stringify(updatedLogs));

                            alert("HIPAA Compliancy Audit Certificate successfully regenerated for your parent cohort batch!");
                          }}
                          className="rounded-xl border border-stone-200 hover:bg-white text-[10px] uppercase font-bold tracking-wider text-stone-700 bg-white"
                        >
                          🛡️ Generate Audit Compliance Ticket
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Parent Space Strictness */}
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'strictness' ? null : 'strictness')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-red-400 transition-colors">
                     <Settings className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">Parent Space Strictness</span>
                    <span className="text-[10px] text-stone-400 font-mono">Current strictness option: <strong className="font-mono text-stone-605 capitalize">{strictnessLevel || 'moderate'}</strong></span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-amber-950 px-3 py-1 rounded-full font-bold capitalize">
                    {strictnessLevel || 'moderate'} Mode
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'strictness' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'strictness' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Determine Kid Space Access Controls</h4>
                        <p className="text-[11px] text-stone-550">Enforce limits of co-regulation tasks, stretching timers, and dashboard unlocks for your child's workspace.</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {(['gentle', 'moderate', 'strict'] as const).map((lvl) => {
                          const isSelected = (strictnessLevel || 'moderate') === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => {
                                setStrictnessLevel(lvl);
                                confetti({
                                  particleCount: 50,
                                  spread: 40,
                                  colors: ['#8bad8b', '#ebcd9e', '#f472b6']
                                });
                              }}
                              className={cn(
                                "flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all cursor-pointer h-24",
                                isSelected 
                                  ? "bg-white border-stone-900 text-stone-900 shadow-md scale-[1.02]" 
                                  : "bg-transparent border-stone-200 text-stone-550 hover:bg-white/40"
                              )}
                            >
                              <span className="text-[10px] uppercase font-mono font-black tracking-widest">{lvl}</span>
                              <span className="text-[20px] mb-2 block">
                                {lvl === 'gentle' ? '🌱' : lvl === 'moderate' ? '⚖️' : '🔒'}
                              </span>
                              <span className="text-[9px] text-stone-400">
                                {lvl === 'gentle' ? 'Softer Locks' : lvl === 'moderate' ? 'Standard' : 'Hard Limits'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-850 space-y-1">
                        <span className="text-[9px] uppercase font-mono font-black text-amber-400">Dynamic Strictness Outcome Description</span>
                        <p className="text-[11px] text-stone-300 leading-relaxed">
                          {strictnessLevel === 'gentle' ? (
                            "Allows the student workspace to customize task sequencing. Badges and rewards are unlocked with forgiving limits."
                          ) : strictnessLevel === 'strict' ? (
                            "Hard parent authorization bounds. The student must fully solve stretching sequences and reflections to redeem weekly XP points. Screen time alerts are highly strict."
                          ) : (
                            "Standard balanced parenting. Weekly co-regulation objectives are structured under a moderate, supportive compliance calendar."
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </Card>
        </div>

        {/* ACTIVE SUBSCRIPTION SECTION */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 px-2 tracking-widest">Active Subscription</h3>
          <Card className="border border-stone-150 shadow-sm overflow-hidden rounded-[2rem] bg-white p-1">
            <div className="divide-y divide-stone-50">
              
              {/* Plan & Tier */}
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'plan' ? null : 'plan')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-stone-900 transition-colors">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">Plan & Tier Selection</span>
                    <span className="text-[10px] text-stone-400 font-mono">Current tier: <strong className="font-mono text-stone-605">{activePlan}</strong></span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-3 py-1 rounded-full font-bold">
                    {activePlan}
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'plan' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'plan' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">Available Platform Tiers</h4>
                        <p className="text-[11px] text-stone-550">Every parent pilot license is Sponsored and Waived. Choose a higher tier to simulate administrative counseling tools.</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        {[
                          { name: 'Basic Parent', price: 'Free', features: 'Basic lessons only' },
                          { name: 'Premium Admin', price: '$49/mo (Waived)', features: 'All courses + SMS alerts' },
                          { name: 'Enterprise Scholar', price: '$129/mo (Clinician Line)', features: '1-on-1 clinician video lines' }
                        ].map((plan) => {
                          const isSelected = activePlan === plan.name;
                          return (
                            <button
                              key={plan.name}
                              type="button"
                              onClick={() => {
                                setActivePlan(plan.name);
                                confetti({
                                  particleCount: 60,
                                  spread: 35,
                                  colors: ['#8bad8b', '#ebcd9e', '#f472b6']
                                });
                              }}
                              className={cn(
                                "flex flex-col text-left p-4 rounded-2xl border transition-all cursor-pointer bg-white h-auto space-y-2",
                                isSelected 
                                  ? "border-stone-850 bg-stone-50/20 shadow-md ring-1 ring-stone-900 scale-[1.01]" 
                                  : "border-stone-200 text-stone-500 hover:bg-white/40"
                              )}
                            >
                              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-stone-400">{plan.name}</span>
                              <span className="text-xs font-extrabold text-stone-850 block">{plan.price}</span>
                              <span className="text-[9px] text-stone-500 leading-snug">{plan.features}</span>
                              {isSelected && (
                                <span className="text-[9px] bg-stone-900 text-white self-start px-2 py-0.5 rounded-full font-bold mt-1">
                                  ✓ Active Tier
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Certificates Earned */}
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'certificates' ? null : 'certificates')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-yellow-500 transition-colors">
                     <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">Certificates & Achievements</span>
                    <span className="text-[10px] text-stone-400 font-mono">2 clinical co-regulation mastery pathways sealed</span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-bold">
                    2 Completed
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'certificates' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'certificates' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-750 uppercase tracking-wide font-serif">Earned Training Badges</h4>
                        <p className="text-[11px] text-stone-550">These official completion credentials certify your active workspace participation in clinically-backed pediatric co-regulation.</p>
                      </div>

                      <div className="grid gap-3">
                        {[
                          { id: 'coreg', title: 'Co-Regulation Principles & Mindful Presence', date: 'May 15, 2026', code: 'PGC-09941' },
                          { id: 'empathy', title: 'Tactful Boundary Setting & Anger De-escalation', date: 'May 24, 2026', code: 'PGC-10852' }
                        ].map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 gap-4">
                            <div className="flex-1">
                              <span className="text-[8px] font-mono uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold font-semibold">Verified Clinical Stamp</span>
                              <h5 className="text-xs font-bold text-stone-800 mt-1 leading-snug">{cert.title}</h5>
                              <p className="text-[10px] text-stone-450 mt-0.5">Earned {cert.date} | ID: {cert.code}</p>
                            </div>
                            <Button
                              type="button"
                              onClick={() => {
                                setPreviewingCertificate(cert.id as any);
                                confetti({
                                  particleCount: 80,
                                  spread: 50,
                                  colors: ['#ebcd9e', '#8bad8b']
                                });
                              }}
                              className="rounded-xl h-8 text-[10px] uppercase font-bold tracking-wider shrink-0 bg-stone-900 hover:bg-stone-850 text-white"
                            >
                              View PDF Certificate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </Card>
        </div>

        {/* CUSTOMER SERVICES & SUPPORT SECTION */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-450 px-2 tracking-widest">Customer Services & Support</h3>
          <Card className="border border-stone-150 shadow-sm overflow-hidden rounded-[2rem] bg-white p-1">
            <div className="divide-y divide-stone-50">
              
              {/* Administration Center / Support */}
              <div className="transition-all">
                <div 
                  onClick={() => setExpandedSection(expandedSection === 'support' ? null : 'support')}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-550 group-hover:text-indigo-600 transition-colors">
                     <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-stone-800 text-xs block">Clinician Support Lounge</span>
                    <span className="text-[10px] text-stone-400">Secure live support messaging loop directly with Dr. Vance</span>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-100 text-indigo-805 px-3 py-1 rounded-full font-bold">
                    24/7 Priority
                  </span>
                  <ChevronRight className={cn("w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform", expandedSection === 'support' && "rotate-90 text-stone-500")} />
                </div>

                <AnimatePresence>
                  {expandedSection === 'support' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-stone-50/50 border-t border-stone-50 px-6 py-5 space-y-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide font-serif">Secure Parent Guidance Hotline</h4>
                        <p className="text-[11px] text-stone-550">Ask questions here about clinical strategies, device locking rules, or dashboard features. Dr. Vance responds securely.</p>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="bg-white border border-stone-100 rounded-2xl p-4 max-h-[220px] overflow-y-auto space-y-3 font-medium text-xs">
                        {supportDialogue.map((chat, cidx) => (
                          <div 
                            key={cidx} 
                            className={cn(
                              "flex flex-col max-w-[85%] p-3 rounded-2xl text-xs space-y-1_5",
                              chat.sender === 'parent' 
                                ? "bg-stone-150 text-stone-850 ml-auto border border-stone-200" 
                                : "bg-emerald-50/40 text-stone-800 mr-auto border border-emerald-100/50"
                            )}
                          >
                            <span className="font-bold text-[9px] uppercase tracking-wide text-stone-450 block">
                              {chat.sender === 'parent' ? 'You (Parent)' : 'Dr. Vance (Certified Educator)'}
                            </span>
                            <p className="leading-relaxed">{chat.message}</p>
                            <span className="text-[8px] text-stone-400 self-end font-mono mt-0.5">{chat.time}</span>
                          </div>
                        ))}

                        {isSupportResponding && (
                          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 mr-auto text-stone-555 flex items-center gap-1.5 animate-pulse max-w-[85%] text-[11px]">
                            <Clock className="w-3.5 h-3.5 animate-spin text-stone-400" />
                            <span>Dr. Vance is reviewing bedtime behaviors...</span>
                          </div>
                        )}
                      </div>

                      {/* Support Form */}
                      <form onSubmit={handleSendSupportMessage} className="flex gap-2">
                        <input 
                          type="text"
                          value={supportText}
                          onChange={(e) => setSupportText(e.target.value)}
                          placeholder="Type 'bedtime sleep anger', limits strictness, or custom question..."
                          className="flex-1 h-10 px-3 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-550 text-stone-750 font-medium"
                        />
                        <Button
                          type="submit"
                          disabled={!supportText.trim() || isSupportResponding}
                          className="rounded-xl h-10 shrink-0 bg-stone-900 hover:bg-stone-850 text-white font-extrabold px-4 text-xs font-mono"
                        >
                          Send Inquiry
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </Card>
        </div>

      </div>

      <div className="pt-4">
         <Button 
           onClick={logoutUser}
           variant="ghost" 
           className="w-full h-16 rounded-[2rem] text-rose-500 hover:text-rose-600 hover:bg-rose-50 flex gap-3 font-bold group cursor-pointer border border-rose-100/20"
         >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            <span>Sign Out of Active Workspace</span>
         </Button>
      </div>
      
      <footer className="text-center text-[9px] text-stone-350 uppercase tracking-widest pb-10">
         Parent Guidance Hub Premium Security Certified v1.4.3
      </footer>

      {/* GLOWING DYNAMIC CLINICAL CERTIFICATE POPUP LIGHTBOX */}
      <AnimatePresence>
        {previewingCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-stone-800"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-stone-50 border-4 border-double border-stone-305 rounded-[2.5rem] w-full max-w-2xl overflow-hidden p-6 md:p-10 text-center relative shadow-2xl space-y-6"
            >
              <div className="absolute inset-2 border border-stone-200 pointer-events-none rounded-[2rem]" />
              
              <button 
                type="button"
                onClick={() => setPreviewingCertificate(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-all font-mono font-black text-xs z-30 cursor-pointer border border-stone-200"
              >
                ✕
              </button>

              <div className="space-y-4">
                <span className="text-4xl block animate-bounce" role="img" aria-label="Graduate">🎓</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400 block font-black">Official Clinician Seal of Accomplishment</span>
                
                <h3 className="text-2xl md:text-3xl font-serif text-stone-900 font-extrabold max-w-md mx-auto leading-tight">
                  Certificate of Co-Regulation Competency
                </h3>
                <p className="text-xs text-stone-500 italic">This master credential verifies active academic compliance on the Parent Guidance platform.</p>
              </div>

              <div className="bg-white border border-stone-200/60 p-6 rounded-2xl max-w-lg mx-auto space-y-3">
                <p className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-black">ISSUED OFFICIALLY TO: </p>
                <p className="text-xl font-serif text-stone-800 font-bold">{name || 'Jane Doe'}</p>
                
                <div className="w-12 h-px bg-stone-200 mx-auto my-3" />

                <p className="text-xs text-stone-600 font-semibold leading-relaxed max-w-sm mx-auto">
                  For completing core units on <strong className="font-bold">
                    {previewingCertificate === 'coreg' ? 'Principles of Emotional Mirroring & Self-Correction' : 'Child Tantrums & Restructuring Defiance'}
                  </strong> under sponsored continuous counselor supervision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto pt-4 relative">
                <div className="text-left space-y-0.5">
                  <p className="text-[9px] font-mono text-stone-400 uppercase">Supervisor Practitioner Signature</p>
                  <p className="text-sm font-serif font-bold text-accent-sage italic">Dr. Vance, Psy.D</p>
                  <p className="text-[8px] text-stone-450">Remix Pediatric Wellness Group</p>
                </div>
                
                <div className="bg-amber-100 text-amber-900 border border-amber-200 p-2.5 rounded-full font-mono text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5">
                  🛡️ STAMP ACTIVE
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Button 
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="rounded-full bg-stone-900 hover:bg-stone-850 text-white font-black text-xs uppercase px-7 py-3"
                >
                  🖨️ Print Certificate Copy
                </Button>
                <Button 
                  type="button"
                  onClick={() => setPreviewingCertificate(null)}
                  variant="outline"
                  className="rounded-full border-stone-300 hover:bg-stone-150 text-stone-750 text-xs font-bold"
                >
                  Close Seal View
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
