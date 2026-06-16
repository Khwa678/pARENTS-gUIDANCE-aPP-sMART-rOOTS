import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useApp } from '../../context/AppContext';
import { 
  Server, 
  RefreshCw, 
  Database, 
  Trash2, 
  Download, 
  Radio, 
  Activity, 
  HardDrive,
  Users,
  Layers,
  FileCode,
  CheckCircle,
  HelpCircle,
  Code
} from 'lucide-react';

interface ServerStatus {
  uptime: string;
  platform: string;
  arch: string;
  nodeVersion: string;
  memoryUsage: string;
  backupFileSize: string;
  backupLastModified: string;
  counts: {
    parents: number;
    students: number;
    reflections: number;
    dailyTasks: number;
    liveSessions: number;
    modules: number;
    passwordResetRequests: number;
  };
  supabase: {
    configured: boolean;
    url: string;
    connected: boolean;
  };
}

export default function ServerHostControl() {
  const { reloadDatabaseState } = useApp() as any; 
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [showJsonDump, setShowJsonDump] = useState(false);
  const [rawJsonData, setRawJsonData] = useState<any>(null);

  const logMessage = (msg: string) => {
    setActionLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backend-data/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        logMessage("Server host metrics and file database status synchronization success.");
      } else {
        logMessage("Failed to fetch running container system metrics.");
      }
    } catch (e: any) {
      logMessage(`Container connection error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawBackupPayload = async () => {
    try {
      const res = await fetch('/api/backend-data');
      if (res.ok) {
        const payload = await res.json();
        setRawJsonData(payload.data || payload);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    fetchRawBackupPayload();
  }, []);

  const handleHardFormat = async () => {
    if (!confirm('🛑 WARNING: Are you sure you want to format the server database sandbox?\nThis deletes all local JSON records and purges Supabase connected rows.')) {
      return;
    }
    setResetting(true);
    logMessage("Triggering deep file system database format command...");
    try {
      const res = await fetch('/api/backend-data/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        logMessage("SUCCESS: Database fully truncated. Container storage formatted blank.");
        // Reload parent application context
        if (reloadDatabaseState) {
          await reloadDatabaseState();
        } else {
          window.location.reload();
        }
        await fetchStatus();
        await fetchRawBackupPayload();
      } else {
        logMessage(`FORMAT FAILED: ${data?.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      logMessage(`Format crash error: ${e.message}`);
    } finally {
      setResetting(false);
    }
  };

  const handleReSeed = async () => {
    setSeeding(true);
    logMessage("Initiating dynamic recovery seed procedure...");
    try {
      const res = await fetch('/api/backend-data/reseed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        logMessage("SUCCESS: Standard clinical records, modules, daily tasks and parent profiles restored successfully.");
        if (reloadDatabaseState) {
          await reloadDatabaseState();
        } else {
          window.location.reload();
        }
        await fetchStatus();
        await fetchRawBackupPayload();
      } else {
        logMessage(`SEED RESTORE FAILED: ${data?.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      logMessage(`Seed crash error: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 border border-stone-800 p-6 rounded-3xl text-white">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            Express Server DB Controls
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Dynamic diagnostics and physical storage controls for the backend Node.js container database.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            disabled={loading}
            onClick={fetchStatus} 
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-4 py-2 rounded-full flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Diagnostics
          </Button>
        </div>
      </div>

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STATS BENTO 1: HARDWARE & OS DIAGNOSTICS */}
          <Card className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Runtime Host Metrics
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Node Environment</span>
                <span className="font-mono text-stone-900 font-semibold bg-stone-100 px-2 py-0.5 rounded">
                  {status.nodeVersion} ({status.platform})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Container Architecture</span>
                <span className="font-mono text-stone-900 font-semibold">{status.arch} architecture</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Server Uptime</span>
                <span className="font-mono text-stone-900 font-semibold">{status.uptime}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Node JS Heap Memory</span>
                <span className="font-mono text-stone-900 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {status.memoryUsage}
                </span>
              </div>
            </div>
          </Card>

          {/* STATS BENTO 2: FILESYSTEM STORAGE */}
          <Card className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-600" />
              Local File Database (JSON)
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Physical Registry</span>
                <span className="font-mono text-stone-900 font-semibold">data_db_backup.json</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Database Disk Size</span>
                <span className="font-mono text-stone-900 font-semibold">{status.backupFileSize}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Last Disk Write</span>
                <span className="font-mono text-stone-900 font-semibold text-stone-600">
                  {status.backupLastModified}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Storage Location</span>
                <span className="font-mono text-xs text-stone-400 truncate max-w-[150px]">
                  /backend/data_db_backup.json
                </span>
              </div>
            </div>
          </Card>

          {/* STATS BENTO 3: SUPABASE CONFIG MONITOR */}
          <Card className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-4 h-4 text-violet-600" />
              Supabase State Sync
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Configured State</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                  status.supabase.configured 
                    ? 'bg-violet-100 text-violet-800' 
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {status.supabase.configured ? 'Active' : 'Unconfigured'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Cloud Connection State</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                  status.supabase.connected 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.supabase.connected ? 'ONLINE connected' : 'LOCAL FALLBACK'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-100">
                <span className="text-stone-500">Sub-Replicator Link</span>
                <span className="font-mono text-[10px] text-stone-400 truncate max-w-[150px]">
                  {status.supabase.url || 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500">Data Redundancy</span>
                <span className="font-semibold text-stone-800 text-[10px]">
                  {status.supabase.connected ? 'High Cloud + Disk Cache' : 'Local Only'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DETAILED RECORD DURATION COUNTS */}
      {status && (
        <Card className="p-6 bg-stone-50 border border-stone-200/60 rounded-3xl space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-stone-600" />
            Active Collection Row Diagnostic Counts
          </h3>
          <p className="text-xs text-stone-500">
            Real dynamic counts fetched from the central database, proving instant backend connection.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 pt-2">
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Parents</span>
              <span className="text-2xl font-bold text-stone-900">{status.counts.parents}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Students</span>
              <span className="text-2xl font-bold text-stone-800">{status.counts.students}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Modules</span>
              <span className="text-2xl font-bold text-stone-800">{status.counts.modules}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Daily Tasks</span>
              <span className="text-2xl font-bold text-stone-800">{status.counts.dailyTasks}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Webinars</span>
              <span className="text-2xl font-bold text-stone-800">{status.counts.liveSessions}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Reflections</span>
              <span className="text-2xl font-bold text-stone-800">{status.counts.reflections}</span>
            </div>
            <div className="bg-white border border-stone-200 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block tracking-wider">Resets</span>
              <span className={`text-2xl font-bold lg:block ${status.counts.passwordResetRequests > 0 ? 'text-amber-600' : 'text-stone-400'}`}>
                {status.counts.passwordResetRequests}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* CORE CONTROL ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border border-stone-200 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            ⚙️ Hardware and Seed Control Actions
          </h3>
          <p className="text-xs text-stone-500">
            Automate format commands, populate default clinical structures, and manipulate container backup registries live.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <a 
              href="/api/backend-data/download" 
              download 
              className="bg-stone-900 text-white font-bold text-xs px-5 py-3 rounded-full hover:bg-stone-800 inline-flex items-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Backup JSON
            </a>

            <Button 
              disabled={seeding || loading}
              onClick={handleReSeed}
              className="bg-emerald-900/10 border border-emerald-950/20 text-emerald-950 hover:bg-emerald-900/20 text-xs px-5 py-3 rounded-full font-bold flex items-center gap-2 transition"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              {seeding ? "Re-seeding active..." : "Restore Clinical Seeds"}
            </Button>

            <Button 
              disabled={resetting || loading}
              onClick={handleHardFormat} 
              className="border border-red-500/55 bg-red-900/10 text-red-950 hover:bg-red-900/25 font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {resetting ? "Hard format running..." : "Hard Format Server DB"}
            </Button>
          </div>
        </Card>

        {/* TERMINAL ACTIVITY LOGS */}
        <Card className="p-6 bg-stone-950 text-stone-200 rounded-3xl space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-stone-850 pb-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Server Controller Console Logs
            </span>
            <Button 
              onClick={() => setActionLog([])}
              className="text-[10px] hover:text-white hover:bg-stone-900 px-2 py-1 rounded bg-stone-900/50 text-stone-400 border border-stone-800/10"
            >
              Clear Terminal
            </Button>
          </div>

          <div className="h-28 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-stone-950">
            {actionLog.length === 0 ? (
              <p className="text-stone-500 italic text-[11px] pt-4 text-center">No control commands issued yet in this session.</p>
            ) : (
              actionLog.map((log, i) => (
                <div key={i} className="text-[11px] leading-relaxed border-l-2 border-emerald-500/30 pl-2">
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* LIVE RAW JSON BACKUP VIEW PANEL */}
      <Card className="p-6 border border-stone-200 rounded-3xl space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
              <Code className="w-4 h-4 text-violet-600" />
              Raw Database Backup Payload Inspector
            </h3>
            <p className="text-xs text-stone-500">Inspect the dynamic container database state layout directly in the viewport.</p>
          </div>
          <Button 
            onClick={() => setShowJsonDump(!showJsonDump)} 
            className="text-xs border border-stone-300 hover:bg-stone-50 text-stone-800 bg-white"
          >
            {showJsonDump ? "Hide JSON Inspector" : "Show JSON Inspector"}
          </Button>
        </div>

        {showJsonDump && (
          <div className="p-4 bg-stone-900/5 text-stone-800 rounded-2xl border border-stone-200 max-h-80 overflow-auto font-mono text-xs">
            {rawJsonData ? (
              <pre>{JSON.stringify(rawJsonData, null, 2)}</pre>
            ) : (
              <span className="text-stone-400 italic">No database payload cache synchronized. Try clicking "Refresh Diagnostics".</span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
