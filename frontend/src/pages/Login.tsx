import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Heart, Sparkles, Phone, Lock, Eye, EyeOff, AlertCircle, Smile, ArrowRight, BookOpen, Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import confetti from 'canvas-confetti';

export default function Login() {
  const { loginUser, addPasswordResetRequest } = useApp();
  
  // Toggle between 'parent' and 'child' login pathways
  const [loginType, setLoginType] = useState<'parent' | 'child' | 'forgot'>('parent');
  
  // Parent Login forms
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password recovery forms
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSentMessage, setForgotSentMessage] = useState('');

  // Child Login forms
  const [studentId, setStudentId] = useState('');
  const [childLoading, setChildLoading] = useState(false);

  // First-time login change password state
  const [showChangePasswordPrompt, setShowChangePasswordPrompt] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');

  // Handle Parent Login submission
  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please fill in both phone number and password.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = loginUser(phone, password);
      setLoading(false);
      if (res.success) {
        if (password === 'password' && phone !== 'admin') {
          setShowChangePasswordPrompt(true);
        } else {
          // Trigger pleasant login success confetti
          confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
      } else {
        setError(res.error || 'Invalid parent credentials.');
      }
    }, 850);
  };

  // Handle Child / Student Login submission
  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      setError('Please enter your Student ID code.');
      return;
    }
    setError('');
    setChildLoading(true);

    setTimeout(() => {
      const res = loginUser(studentId, '');
      setChildLoading(false);
      if (res.success) {
        // Exploding victory confetti for the kid
        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899']
        });
      } else {
        setError('Opps! We could not find that Student ID. Double check with your teacher or parents.');
      }
    }, 700);
  };

  // Direct fast-click login from Quick Tester blocks
  const handleQuickChildLogin = (quickId: string) => {
    setStudentId(quickId);
    setError('');
    setChildLoading(true);

    setTimeout(() => {
      const res = loginUser(quickId, '');
      setChildLoading(false);
      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 90,
          colors: ['#34d399', '#60a5fa', '#fbbf24', '#f472b6']
        });
      }
    }, 400);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setChangeError('New password cannot be empty.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('Passwords do not match.');
      return;
    }
    
    const savedParents = localStorage.getItem('parent_guidance_parents');
    if (savedParents) {
      const parentList = JSON.parse(savedParents);
      const updated = parentList.map((p: any) => p.phone === phone ? { ...p, password: newPassword } : p);
      localStorage.setItem('parent_guidance_parents', JSON.stringify(updated));
    }
    
    setShowChangePasswordPrompt(false);
    window.location.reload();
  };

  const handleSkipPasswordChange = () => {
    setShowChangePasswordPrompt(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Soft floating background abstract shapes (Parent & Child dynamic colors) */}
      <AnimatePresence>
        {loginType === 'parent' ? (
          <motion.div 
            key="p-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-sage/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-warm/15 rounded-full blur-3xl" />
          </motion.div>
        ) : (
          <motion.div 
            key="c-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-emerald-400/5 rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md relative z-10">
        
        {/* Branding header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex w-16 h-16 rounded-full bg-white items-center justify-center shadow-md border border-stone-100 mx-auto">
            {loginType === 'parent' ? (
              <span className="text-3xl">🌱</span>
            ) : (
              <span className="text-3xl">🚀</span>
            )}
          </div>
          <h1 className="text-3xl font-serif text-stone-900 leading-tight">Remix Guidance</h1>
          <p className="text-stone-500 max-w-xs mx-auto text-xs font-semibold uppercase tracking-wider">
            Connected Parent & Child Learning Hub
          </p>
        </div>

        {/* Dynamic segmented switcher tabs */}
        <div className="bg-stone-200/60 p-1.5 rounded-2xl mb-5 grid grid-cols-2 shadow-inner border border-stone-150 relative">
          <button
            id="parent-tab-trigger"
            onClick={() => { setLoginType('parent'); setError(''); setForgotSentMessage(''); }}
            className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              (loginType === 'parent' || loginType === 'forgot') 
                ? 'bg-white text-stone-900 shadow-md font-extrabold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            👨‍👩‍👦 Parent Portal
          </button>
          
          <button
            id="child-tab-trigger"
            onClick={() => { setLoginType('child'); setError(''); setForgotSentMessage(''); }}
            className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              loginType === 'child' 
                ? 'bg-gradient-to-r from-emerald-500 to-indigo-650 text-white shadow-md font-black' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            🚀 Child Workspace
          </button>
        </div>

        {/* Main interactive Card */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-300">
          <CardContent className="p-8 lg:p-10">
            <AnimatePresence mode="wait">
              
              {/* CHANGE SECURE PASSWORD (PARENTS FIRST-TIME) */}
              {showChangePasswordPrompt ? (
                <motion.div
                  key="change-password"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-full bg-accent-warm/10 items-center justify-center text-accent-warm shrink-0 mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif text-stone-800">First-Time Security</h3>
                    <p className="text-stone-500 text-xs">Would you like to customize your password now for added security?</p>
                  </div>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    {changeError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs">
                        {changeError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block px-1">New Password</label>
                      <input
                        id="new-password-input"
                        type="password"
                        className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage focus:bg-white transition-all text-sm text-stone-800 placeholder-stone-300 font-semibold"
                        placeholder="New secure password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block px-1">Confirm Password</label>
                      <input
                        id="confirm-password-input"
                        type="password"
                        className="w-full h-12 px-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-accent-sage focus:bg-white transition-all text-sm text-stone-800 placeholder-stone-300 font-semibold"
                        placeholder="Retype password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        id="skip-password-change-btn"
                        type="button"
                        variant="outline"
                        onClick={handleSkipPasswordChange}
                        className="flex-1 h-12 rounded-xl text-stone-500 border-stone-200 hover:bg-stone-50 text-xs font-bold"
                      >
                        Skip for now
                      </Button>
                      <Button
                        id="submit-password-change-btn"
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-accent-sage text-white hover:bg-accent-sage/95 text-xs font-bold"
                      >
                        Change and Lock
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : loginType === 'forgot' ? (
                <motion.div
                  key="forgot-password-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif text-stone-800 tracking-tight">Recover Password</h2>
                    <p className="text-xs text-stone-400 mt-1 font-semibold">Request a new secure password from our Super Administration group.</p>
                  </div>

                  {forgotSentMessage ? (
                    <div className="space-y-5">
                      <div className="p-4 bg-amber-50 text-amber-900 rounded-2xl flex flex-col gap-2 text-xs border border-amber-200/50 leading-relaxed shadow-sm">
                        <span className="font-bold text-sm flex items-center gap-1.5 text-amber-800">🎉 Request Received!</span>
                        <p className="font-semibold text-stone-700">{forgotSentMessage}</p>
                        <p className="text-stone-500 text-[10px] mt-2 border-t border-stone-200/60 pt-2 font-mono">
                          💡 Log into the <b>Super Admin Panel</b> (admin/admin) to instantly approve and generate a new secure password.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          setLoginType('parent');
                          setForgotSentMessage('');
                          setForgotPhone('');
                          setForgotEmail('');
                        }}
                        className="w-full h-14 rounded-2xl bg-stone-900 text-white hover:bg-stone-850 font-bold text-sm"
                      >
                        Return to Parent Login
                      </Button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!forgotPhone || !forgotEmail) {
                          setError('Please fulfill both the Phone Number and Email fields.');
                          return;
                        }
                        addPasswordResetRequest(forgotPhone, forgotEmail);
                        setForgotSentMessage(`Our support ticket has been registered for verification. Once approved by the administrator, the new temporary password will be dispatched to ${forgotEmail}.`);
                        setError('');
                      }} 
                      className="space-y-5"
                    >
                      {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-xs border border-red-105">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block px-1">Registered Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            id="forgot-phone-input"
                            className="w-full h-14 pl-12 pr-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-accent-sage focus:bg-white text-stone-800 font-bold text-sm"
                            placeholder="e.g. +12345678"
                            value={forgotPhone}
                            onChange={(e) => setForgotPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block px-1">Registered Account Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                            <Heart className="w-5 h-5" />
                          </div>
                          <input
                            type="email"
                            id="forgot-email-input"
                            className="w-full h-14 pl-12 pr-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-accent-sage focus:bg-white text-stone-800 font-bold text-sm"
                            placeholder="e.g. parent@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setLoginType('parent');
                            setError('');
                          }}
                          className="flex-1 h-14 rounded-2xl border-stone-200 text-stone-600 font-extrabold text-xs"
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          className="flex-1 h-14 rounded-2xl bg-accent-sage text-white hover:bg-accent-sage/90 font-black text-xs"
                        >
                          Send Reset Request
                        </Button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : loginType === 'parent' ? (
                
                /* PART A: PARENT LOGIN PORTAL */
                <motion.div
                  key="parent-login"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-serif text-stone-800 tracking-tight">Parent Login</h2>
                    <p className="text-xs text-stone-400 mt-1">Access weekly coaching, reflections, and co-regulation tools.</p>
                  </div>

                  <form onSubmit={handleParentSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-xs border border-red-100 font-medium leading-relaxed">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block px-1">Phone Number / ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input
                          id="parent-phone-input"
                          type="text"
                          className="w-full h-14 pl-12 pr-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-accent-sage focus:bg-white transition-all text-stone-800 font-bold text-sm placeholder-stone-300"
                          placeholder="e.g. +12345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 font-mono">Password</label>
                        <button
                          type="button"
                          onClick={() => { setLoginType('forgot'); setError(''); }}
                          className="text-[11px] font-bold text-accent-sage hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          id="parent-password-input"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full h-14 pl-12 pr-12 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-accent-sage focus:bg-white transition-all text-stone-800 font-bold text-sm placeholder-stone-400"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      id="parent-login-submit"
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Verify Parent Token</span>
                      )}
                    </Button>
                  </form>

                  <div className="pt-4 border-t border-stone-100 text-center space-y-2">
                    <p className="text-[10px] text-stone-400 font-extrabold tracking-widest uppercase">
                      PRE-STORED PARENT DEVELOPMENT PROFILES:
                    </p>
                    <div className="bg-stone-50 p-3 rounded-2xl text-[10px] text-stone-500 font-semibold flex flex-col gap-1.5 text-left max-w-xs mx-auto border border-stone-150">
                      <div>📞 Parent Phone: <span className="font-bold text-stone-800">+12345678</span> / <span className="text-stone-400">password</span></div>
                      <div>🛡️ Admin Portal: <span className="font-bold text-stone-800">admin</span> / <span className="text-stone-400">admin</span></div>
                      <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
                        <span>👩‍🏫 Mentor Sandbox:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhone('mentor');
                            setPassword('mentor');
                            setError('');
                            setLoading(true);
                            setTimeout(() => {
                              const res = loginUser('mentor', 'mentor');
                              setLoading(false);
                              if (res.success) {
                                confetti({ particleCount: 80, spread: 45 });
                              } else {
                                setError('Invalid credentials.');
                              }
                            }, 450);
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-md shadow-xs transition-all tracking-wide uppercase font-mono text-[8px]"
                        >
                          Quick Login Dr. Vance
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                
                /* PART B: STUDENT / CHILD SPACE LOGIN GATEWAY */
                <motion.div
                  key="child-login"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-serif text-stone-800 font-black">Young Warrior Gateway</h2>
                      <span className="text-xl animate-bounce">👋</span>
                    </div>
                    <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                      Enter your personalized, cozy mind escape. Track stretches, watch animations, and collect milestone certificates!
                    </p>
                  </div>

                  <form onSubmit={handleChildSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-2 text-xs border border-rose-105 font-bold leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#059669] block px-1">
                        🔑 YOUR RESILIENCE CODE / STUDENT ID
                      </label>
                      <input
                        id="student-id-field"
                        type="text"
                        className="w-full h-14 px-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-400 focus:bg-white text-stone-850 font-black text-center text-lg tracking-widest transition-all placeholder:text-stone-300 placeholder:font-normal placeholder:tracking-normal"
                        placeholder="e.g. S101"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                      />
                    </div>

                    <Button
                      id="student-login-submit"
                      type="submit"
                      disabled={childLoading}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700 font-black text-sm shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      {childLoading ? (
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">Enter Resiliency Hub <ArrowRight className="w-4 h-4" /></span>
                      )}
                    </Button>
                  </form>

                  {/* HIGH FIDELITY CLICK-TO-ENTER PROFILES */}
                  <div className="pt-4 border-t border-stone-100 space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase flex items-center justify-center gap-1">
                        🚀 STREAKS & RESILIENCE PROFILES (CLICK TO LOAD)
                      </span>
                      <p className="text-[9px] text-stone-400 font-medium">Click on any account to bypass typing for demo testing!</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {/* JOHN S101 */}
                      <button
                        id="quick-john-login-btn"
                        type="button"
                        onClick={() => handleQuickChildLogin('S101')}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:border-emerald-305 transition-all text-left space-y-1 hover:shadow-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl select-none group-hover:scale-110 transition-transform">🧘‍♂️</span>
                          <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">ID: S101</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-stone-800">Little John</p>
                          <p className="text-[9.5px] text-stone-400 font-bold">Grade 3 Resilient Pose</p>
                        </div>
                      </button>

                      {/* EMMA S102 */}
                      <button
                        id="quick-emma-login-btn"
                        type="button"
                        onClick={() => handleQuickChildLogin('S102')}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:border-indigo-305 transition-all text-left space-y-1 hover:shadow-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl select-none group-hover:scale-110 transition-transform">🎨</span>
                          <span className="text-[9px] font-mono font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ID: S102</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-stone-800">Emma Smith</p>
                          <p className="text-[9.5px] text-stone-400 font-bold">Grade 1 Cozy Flow</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
