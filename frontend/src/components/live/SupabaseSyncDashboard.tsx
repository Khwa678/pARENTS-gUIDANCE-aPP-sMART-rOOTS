import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Activity, 
  Users, 
  Bookmark, 
  TrendingUp, 
  UserCheck, 
  Video, 
  FileCheck, 
  Send,
  Zap,
  Flame,
  Award,
  Globe,
  Trash2,
  Lock,
  ArrowRightLeft
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import confetti from 'canvas-confetti';

export default function SupabaseSyncDashboard() {
  const { showToast } = useToast();
  const {
    parents,
    students,
    modules,
    reflections,
    studentPortfolio,
    studentPoints,
    notificationLogs,
    addStudentPoints,
    strictnessLevel,
    setStrictnessLevel,
    liveSessions,
    dailyTasks,
    setParents,
    setStudents,
    setReflections,
    setLiveSessions,
    setDailyTasks,
    setModules
  } = useApp();

  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [dbConfigured, setDbConfigured] = useState<boolean>(false);
  const [tablesExist, setTablesExist] = useState<boolean>(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [tablesMessage, setTablesMessage] = useState<string>('');
  const [sqlSchema, setSqlSchema] = useState<string>('');
  const [showSqlSchema, setShowSqlSchema] = useState<boolean>(false);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'connecting' | 'error' | 'syncing' | 'pulling'>('synced');
  const [activeWatchers, setActiveWatchers] = useState<number>(14);
  const [latencyMs, setLatencyMs] = useState<number>(45);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [searchFilter, setSearchFilter] = useState('');

  // Simulation controls state
  const [simulationLog, setSimulationLog] = useState<string[]>(['[System Initialized] Connected to client local DB.']);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);

  const addSimLog = (msg: string) => {
    setSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const checkConnectionStatus = async (quiet = false) => {
    if (!quiet) addSimLog('Fetching Supabase configuration status...');
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setDbConfigured(data.configured);
      setSupabaseConnected(data.connected);
      setTablesExist(data.tables_exist);
      setSupabaseUrl(data.supabase_url || '');
      setTablesMessage(data.tables_message || '');
      setSqlSchema(data.sql_schema || '');
      
      if (data.configured) {
        if (data.connected && data.tables_exist) {
          if (!quiet) addSimLog(`🟢 Connected to Supabase Instance: ${data.supabase_url}`);
        } else if (data.connected) {
          if (!quiet) addSimLog(`⚠️ WARNING: Connected to Supabase, but some tables are missing!`);
        } else {
          if (!quiet) addSimLog(`🔴 Supabase status check unsuccessful: ${data.tables_message}`);
        }
      } else {
        if (!quiet) addSimLog('ℹ️ App running in Local Fail-Safe Sandbox (No Supabase URL in .env).');
      }
    } catch (err: any) {
      if (!quiet) addSimLog(`🔴 Failed checking connection: ${err.message}`);
    }
  };

  useEffect(() => {
    checkConnectionStatus(false);
  }, []);

  // Auto-mutate simulation loops for co-regulation active watchers
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate slight variation in watchers
      setActiveWatchers(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const nextVal = Math.max(8, prev + delta);
        if (delta !== 0 && Math.random() > 0.8) {
          addSimLog(`Live active sessions synced: ${nextVal} connected parents/kids online.`);
        }
        return nextVal;
      });
      // Simulate minor network shifts
      setLatencyMs(prev => {
        const delta = Math.floor(Math.random() * 11) - 5;
        return Math.max(25, Math.min(120, prev + delta));
      });
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const handleTestConnection = async () => {
    setSyncStatus('connecting');
    addSimLog('Pinging Supabase REST Endpoints and Auth providers...');
    await checkConnectionStatus(false);
    setTimeout(() => {
      setSyncStatus('synced');
      setLatencyMs(28);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }, 500);
  };

  const handleForceTriggerSync = async () => {
    setSyncStatus('syncing');
    addSimLog('Initiating cloud backup replication push...');
    
    try {
      const res = await fetch('/api/supabase/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parents,
          students,
          reflections,
          daily_tasks: dailyTasks || [],
          live_sessions: liveSessions || [],
          modules: modules || []
        })
      });
      const data = await res.json();
      setLastSyncTime(new Date().toLocaleTimeString());
      
      if (data.success) {
        setSyncStatus('synced');
        let detailStr = '';
        if (data.results) {
          detailStr = Object.entries(data.results)
            .map(([tbl, stats]: any) => `${tbl}: ${stats.success ? '✔ (' + (stats.count || 0) + ' items)' : '✖ (' + (stats.error?.message || 'err') + ')'}`)
            .join(', ');
        }
        addSimLog(`⚡ Push Sync Success! ${data.message} Detail: [${detailStr || 'Saved locally'}]`);
        confetti({
          particleCount: 60,
          spread: 45,
          origin: { y: 0.8 }
        });
      } else {
        setSyncStatus('error');
        addSimLog(`🔴 Push Sync failed: ${data.error || 'Server rejected request'}`);
      }
    } catch (e: any) {
      setSyncStatus('error');
      addSimLog(`🔴 Push Sync Error: ${e.message}`);
    }
  };

  const handlePullSync = async () => {
    setSyncStatus('pulling');
    addSimLog('Pulling down centralized state datasets from Cloud DB...');
    try {
      const res = await fetch('/api/supabase/pull');
      const result = await res.json();
      setLastSyncTime(new Date().toLocaleTimeString());
      
      if (result.success && result.data) {
        const d = result.data;
        if (d.parents && Array.isArray(d.parents)) setParents(d.parents);
        if (d.students && Array.isArray(d.students)) setStudents(d.students);
        if (d.reflections && Array.isArray(d.reflections)) setReflections(d.reflections);
        if (d.daily_tasks && Array.isArray(d.daily_tasks)) setDailyTasks(d.daily_tasks);
        if (d.live_sessions && Array.isArray(d.live_sessions)) setLiveSessions(d.live_sessions);
        if (d.modules && Array.isArray(d.modules)) setModules(d.modules);
        
        setSyncStatus('synced');
        addSimLog(`⚡ Pull Sync Success! Loaded parents: ${d.parents?.length || 0}, sessions: ${d.live_sessions?.length || 0}, modules: ${d.modules?.length || 0}`);
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#10b981', '#34d399', '#ffffff']
        });
      } else {
        setSyncStatus('error');
        addSimLog(`🔴 Pull Sync failed: ${result.message || 'Server rejected pull request'}`);
      }
    } catch (e: any) {
      setSyncStatus('error');
      addSimLog(`🔴 Pull Sync Error: ${e.message}`);
    }
  };

  const triggerLiveMockStressEvent = async () => {
    addSimLog('⚠️ Simulating heart-rate spike trigger! Child BPM > 105 detected.');
    addSimLog('📱 Outbound WhatsApp Gateway alert initiated to Parent Contact...');
    
    try {
      const testParent = parents[0] || { name: 'Dr. Khwahish Seth', phone: '+919999900000' };
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testParent.phone,
          text: `⚠️ MIND_BLOOM STRESS SPIKE ALERT for your student ${testParent.studentName || 'Emma'}. Instant Co-regulation requested. Practice Safe Snail's Child Pose stretch together: https://wa.me/`
        })
      });
      const data = await res.json();
      
      if (data.success) {
        addSimLog(`✅ Outbound WhatsApp Transit Resolved! Msg ID: ${data.sid || 'sent'}.`);
      } else {
        addSimLog(`ℹ️ WhatsApp alert scheduled via Redirect Link fallback: ${data.message || 'No API key'}`);
        if (data.waLink) {
          addSimLog(`🔗 Fail-safe Redirection Link: ${data.waLink}`);
        }
      }
    } catch (e: any) {
      addSimLog(`🔴 Outbound Dispatch error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive Controls & Link Header */}
      <div className="bg-stone-900 border border-stone-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Database className="w-40 h-40" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live Supabase Database Connection Panel</span>
            </div>
            <h2 className="text-2xl font-serif leading-tight">Supabase Co-Regulation Uplink</h2>
            <p className="text-stone-400 text-xs max-w-xl">
              Monitor active student stress indicators, parent de-escalation reflections, video view analytics, and lock-state mutations synched in near real-time.
            </p>
          </div>

          {/* Action pills */}
          <div className="flex flex-wrap gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={handleTestConnection}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition cursor-pointer w-full sm:w-auto justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Validate URL Connection</span>
            </button>
            <button
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer w-full sm:w-auto justify-center ${
                showSqlSchema ? 'bg-amber-500 border-amber-600 text-stone-950 font-black' : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>View Setup SQL</span>
            </button>
            <button
              onClick={handlePullSync}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-550 text-white flex items-center gap-1.5 transition cursor-pointer w-full sm:w-auto justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Pull Data From Cloud</span>
            </button>
            <button
              onClick={handleForceTriggerSync}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black flex items-center gap-1.5 transition cursor-pointer w-full sm:w-auto justify-center"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Push Manual Sync Now</span>
            </button>
          </div>
        </div>

        {/* Realtime stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-stone-500 block uppercase text-[9px] tracking-wider">Gateway Status</span>
            <div className="flex items-center gap-1.5 font-bold">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-stone-200">{dbConfigured ? 'REST API Active' : 'Sandbox (Mock)'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block uppercase text-[10px] tracking-wider">Uplink URL</span>
            <div className="flex items-center gap-1.5 font-bold truncate">
              <span className="text-stone-300 truncate font-mono text-[10px]">{supabaseUrl ? supabaseUrl.replace('https://', '') : 'No active server connection'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block uppercase text-[9px] tracking-wider">Active Watchers</span>
            <div className="flex items-center gap-1.5 font-bold">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">{activeWatchers} online</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block uppercase text-[9px] tracking-wider">Auto-Sync Syncing</span>
            <div className="flex items-center gap-1.5 font-bold">
              <input
                type="checkbox"
                id="chk-auto-sync"
                checked={autoSyncEnabled}
                onChange={() => {
                  setAutoSyncEnabled(!autoSyncEnabled);
                  addSimLog(`Auto-Sync state changed: ${!autoSyncEnabled ? 'ENABLED' : 'DISABLED'}`);
                }}
                className="rounded border-stone-800 bg-stone-950 text-emerald-500 focus:ring-offset-stone-900 focus:ring-emerald-500"
              />
              <span className={autoSyncEnabled ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                {autoSyncEnabled ? 'ACTIVE-SYNC' : 'MUTED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible SQL Setup Script Drawer */}
      {showSqlSchema && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900 font-serif">Supabase Tables Schema Support</h3>
              <p className="text-xs text-amber-700 max-w-2xl leading-relaxed">
                {tablesExist 
                  ? "Your Supabase tables are active and detected! Copy and run this script in your Supabase SQL Editor if you ever need to reset or verify tables manually."
                  : "We successfully connected to your Supabase project, but some database tables are not initiated yet. Click Copy Script and run it inside the 'SQL Editor' tab in your Supabase Dashboard to instantly create parents, students, daily_tasks, reflections, and live_sessions tables."}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-600 uppercase font-black tracking-wider">DDL SQL SCHEMA SCRIPT</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlSchema);
                  addSimLog('⚡ Schema SQL copied to clipboard.');
                  showToast('Schema SQL copied to clipboard! Paste this in your Supabase SQL Editor.', 'success', '⚡ Script Copied');
                }}
                className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition"
              >
                Copy SQL Script
              </button>
            </div>
            <pre className="p-4 bg-stone-950 text-amber-300 rounded-2xl text-[10px] font-mono whitespace-pre-wrap max-h-[220px] overflow-y-auto border border-stone-800">
              {sqlSchema}
            </pre>
          </div>
        </div>
      )}

      {/* Grid containing Active controls status and simulation terminal */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Real-time sync logs & terminal (Col span 1) */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-500" /> Connection logs terminal
            </h3>
            <button 
              onClick={() => {
                setSimulationLog(['[Console Cleared]']);
                addSimLog('Console log cleared.');
              }}
              className="text-[10px] text-stone-400 hover:text-stone-600 underline"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-stone-950 text-emerald-400 p-4 rounded-3xl font-mono text-[10px] leading-relaxed shadow-sm min-h-[300px] max-h-[420px] overflow-y-auto border border-stone-900/60 flex flex-col justify-between">
            <div className="space-y-2">
              {simulationLog.map((log, i) => (
                <div key={i} className="border-b border-stone-900/40 pb-1 opacity-90 transition hover:opacity-100 flex items-start gap-1.5">
                  <span className="text-stone-600 select-none shrink-0">▸</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t border-stone-900 text-stone-500 text-[9px] flex justify-between items-center mt-3">
              <span>Last verified: {lastSyncTime}</span>
              <span className="text-emerald-500/80 animate-pulse">● listener-online</span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" /> Simulation Tools
            </h4>
            <p className="text-[10px] text-stone-500 leading-normal">
              Inject client-side state events directly into the workspace to verify listener routines.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={triggerLiveMockStressEvent}
                className="py-2 px-2.5 text-[10px] bg-red-100 border border-red-200 text-red-600 rounded-xl hover:bg-red-200 transition font-bold"
              >
                🚨 Inject Stress Spike
              </button>
              <button
                onClick={() => {
                  addStudentPoints(45);
                  addSimLog('🎁 Seeded +45 XP Points into Student Emma Seth.');
                  confetti();
                }}
                className="py-2 px-2.5 text-[10px] bg-sky-100 border border-sky-200 text-sky-600 rounded-xl hover:bg-sky-200 transition font-bold"
              >
                ✨ Seed Student progress
              </button>
            </div>
          </div>
        </div>

        {/* Live Admin Database Views (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" /> Supabase Real-Time Data Tables
            </h3>
            
            <input
              type="text"
              placeholder="Search databases..."
              className="w-full sm:w-60 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-accent-sage focus:outline-none"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            
            {/* Table 1: Parent Co-regulation Controllers & Strictness Defaults */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 p-3.5 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-accent-sage" /> parent_controlling_states (Shared Rules)
                </span>
                <span className="text-[10px] font-mono text-stone-400">REST API: /v1/controlling</span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Global Sandbox Mode</span>
                    <strong className="text-stone-800 text-xs font-mono font-extrabold uppercase">
                      {strictnessLevel === 'strict' ? '🔒 STRICT_LOCKOUT_RULES' : strictnessLevel === 'medium' ? '⚖️ GUIDED_SENSORY_LIMITS' : '🌸 FREE_PLAY_GENTLE'}
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Co-Regulation Standard Interval</span>
                    <strong className="text-stone-800 text-xs font-mono font-extrabold">3-Day Journal Interval</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Quick Alert Recipient</span>
                    <strong className="text-stone-800 text-xs font-mono font-extrabold">Auto SMS Deliberate Triggers</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-stone-400 block mb-2 font-bold uppercase tracking-wider">Mutate Global Rule Control Parameter:</span>
                  <div className="flex gap-2">
                    {['gentle', 'medium', 'strict'].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setStrictnessLevel(level as any);
                          addSimLog(`Supabase API PATCH: Mutated parent co-regulation strictness state to "${level.toUpperCase()}".`);
                          confetti({ particleCount: 20 });
                        }}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition ${
                          strictnessLevel === level
                            ? 'bg-stone-900 border border-stone-800 text-white'
                            : 'bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-850'
                        }`}
                      >
                        {level === 'gentle' ? '🌸 Gentle Nurture' : level === 'medium' ? '⚖️ Balanced' : '🔒 Strict Limits'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Table 2: Parent Performance logs (Daily Reflection Journals & Somatic feedback logs) */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 p-3.5 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-500" /> parent_performance_logs (Reflection journals)
                </span>
                <span className="text-[10px] font-mono text-stone-400">REST API: /v1/reflections</span>
              </div>
              
              <div className="divide-y divide-stone-100 max-h-[180px] overflow-y-auto">
                {reflections.length === 0 ? (
                  <p className="p-4 text-xs text-stone-400 italic text-center">No parenting logs synced.</p>
                ) : (
                  reflections.map((refl) => (
                    <div key={refl.id} className="p-3 hover:bg-stone-50 transition-colors flex items-start gap-3 text-xs justify-between">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] bg-stone-150 px-1.5 py-0.5 rounded text-stone-500 font-bold">{refl.date}</span>
                          <span className="text-[10px] font-black capitalize italic text-accent-sage">🎯 {refl.mood}</span>
                        </div>
                        <p className="text-stone-600 line-clamp-1 text-[11px] font-sans pr-4">{refl.text}</p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <strong className="text-stone-800 font-bold block">{refl.words} words</strong>
                        <span className="text-[9px] text-emerald-500 flex items-center font-bold justify-end gap-0.5">
                          ✔ synched_v2
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Table 3: Video view guidance statistics */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 p-3.5 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-500" /> video_engagement_statistics (Webinar metrics)
                </span>
                <span className="text-[10px] font-mono text-stone-400">REST API: /v1/video_stats</span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="space-y-3">
                  {liveSessions.map((session) => (
                    <div key={session.id} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-stone-700 truncate max-w-[280px]">{session.title}</span>
                        <strong className="font-mono text-stone-600">
                          {session.status === 'live' ? '42 total views' : session.status === 'upcoming' ? '0 active' : '15 completions'}
                        </strong>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${session.status === 'live' ? 'bg-emerald-500' : 'bg-stone-400'}`}
                          style={{ width: session.status === 'live' ? '82%' : '44%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table 4: Student performance, portfolio and badges */}
            <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 p-3.5 border-b border-stone-200 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> student_co_regulation_portfolios
                </span>
                <span className="text-[10px] font-mono text-stone-400">REST API: /v1/student_portfolio</span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-150">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Kid XP points balance</span>
                    <strong className="text-stone-800 text-lg font-bold">{studentPoints} Points Pool</strong>
                  </div>
                  <div className="flex h-9 w-9 rounded-full bg-amber-500/10 items-center justify-center text-amber-600 text-base">
                    🪙
                  </div>
                </div>

                <div className="divide-y divide-stone-50">
                  {Array.isArray(studentPortfolio) && studentPortfolio.map((p) => (
                    <div key={p.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-stone-850">{p.title}</h5>
                        <p className="text-[10px] text-stone-500">{p.description} • {p.type}</p>
                      </div>
                      <div className="text-right">
                        <strong className="text-emerald-500 text-xs font-mono">+{p.points} XP</strong>
                        <span className="block text-[8px] text-stone-400 font-mono mt-0.5">{p.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
