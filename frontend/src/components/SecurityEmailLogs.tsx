import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ExternalLink,
  ChevronRight,
  User,
  Trash,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  previewUrl?: string;
  timestamp: string;
  status: string;
}

export default function SecurityEmailLogs() {
  const {
    passwordResetRequests,
    resolvePasswordResetRequest,
    reloadDatabaseState
  } = useApp() as any;

  const [tempPass, setTempPass] = useState('mindbloom2026!');
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchEmailLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/email-logs');
      if (res.ok) {
        const data = await res.json();
        const logs = data.logs || [];
        setEmailLogs(logs);
        if (logs.length > 0 && !selectedLog) {
          setSelectedLog(logs[0]);
        }
      }
    } catch (e) {
      console.error("Failed fetching email logs from node server:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to delete all outbound SMTP delivery logs?")) return;
    try {
      const res = await fetch('/api/email-logs/clear', { method: 'POST' });
      if (res.ok) {
        setEmailLogs([]);
        setSelectedLog(null);
        confetti({ particleCount: 20, spread: 20, origin: { y: 0.8 } });
      }
    } catch (e) {
      console.error("Failed clearing server email logs:", e);
    }
  };

  useEffect(() => {
    fetchEmailLogs();
  }, [passwordResetRequests]);

  const handleResolve = async (requestId: string) => {
    resolvePasswordResetRequest(requestId, tempPass);
    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.8 }
    });
    
    // Short sleep wait for server write, then pull fresh logs
    setTimeout(async () => {
      await fetchEmailLogs();
      if (reloadDatabaseState) {
        await reloadDatabaseState();
      }
    }, 1500);
  };

  const filteredLogs = emailLogs.filter(log => 
    log.recipient.toLowerCase().includes(searchText.toLowerCase()) || 
    log.subject.toLowerCase().includes(searchText.toLowerCase()) ||
    log.body.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-serif text-stone-900 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-red-600" /> Security & Email Gate Desk 🔒
          </h3>
          <p className="text-stone-500 text-xs">Verify parent identity, issue secure recovery pins, and inspect automated clinical email notifications.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchEmailLogs}
            disabled={loadingLogs}
            className="border border-stone-200 hover:bg-stone-50 text-stone-700 bg-white font-medium text-xs px-3.5 py-2.5 rounded-full flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3 h-3 ${loadingLogs ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
          <button 
            onClick={handleClearLogs}
            className="border border-red-200 hover:bg-red-50 text-red-700 bg-white font-medium text-xs px-3.5 py-2.5 rounded-full flex items-center gap-1.5 transition"
          >
            <Trash className="w-3 h-3" />
            Clear logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE REST REQUESTS IN STATE & LIVE EMAIL LIST (width: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Incoming Requests Panel */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Incoming Passcode Resets ({passwordResetRequests.length})
            </h4>
            
            <div className="space-y-3">
              {passwordResetRequests.length === 0 ? (
                <div className="bg-stone-50 p-6 rounded-2xl text-center text-xs text-stone-400 border border-stone-150">
                  <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <span>No parent passcode reset requests in queue. Ready to synchronize.</span>
                </div>
              ) : (
                passwordResetRequests.map((req: any) => (
                  <div key={req.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-150 space-y-3">
                    <div className="flex justify-between items-start text-xs">
                      <div className="space-y-0.5">
                        <strong className="text-stone-800 font-bold block flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-stone-400" /> +{req.phone}
                        </strong>
                        <span className="text-[10px] text-stone-500">{req.email}</span>
                      </div>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded uppercase">
                        Pending Approval
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-250/50 flex items-center gap-2">
                      <input
                        type="text"
                        className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 flex-1 focus:outline-none focus:border-stone-500"
                        value={tempPass}
                        onChange={e => setTempPass(e.target.value)}
                        placeholder="Set Temp Password"
                      />
                      <button
                        onClick={() => handleResolve(req.id)}
                        className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] px-3.5 py-2.5 rounded-xl transition cursor-pointer shrink-0 uppercase tracking-wider"
                      >
                        Authorize Reset
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Persistent SMTP Logs History Directory */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">SMTP Transaction History</h4>
              <span className="text-[10px] bg-stone-100 font-mono text-stone-600 px-2 py-0.5 rounded-full">{filteredLogs.length} delivered</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-400" />
              <input 
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search recipient or subject..."
                className="w-full text-xs pl-8 pr-4 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="text-center italic text-xs text-stone-400 py-6">
                  No match found. Complete a reset to populate.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                      selectedLog?.id === log.id 
                        ? 'bg-stone-950 text-white border-stone-950' 
                        : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`font-mono truncate max-w-[150px] font-semibold ${selectedLog?.id === log.id ? 'text-emerald-400' : 'text-stone-500'}`}>
                          {log.recipient}
                        </span>
                        <span className={`font-mono ${selectedLog?.id === log.id ? 'text-stone-400' : 'text-stone-400'}`}>{log.timestamp.split(',')[0]}</span>
                      </div>
                      <p className="text-xs font-bold truncate">{log.subject}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL SERVER SMTP PREVIEW LOG DETAIL (width: 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <Mail className="w-4 h-4 text-stone-400" /> Real Active Outbound SMTP Server Preview
          </h4>

          {selectedLog ? (
            <div className="bg-stone-950 text-stone-300 p-5 rounded-3xl font-mono text-[11px] shadow-lg border border-stone-900 leading-relaxed space-y-4 relative">
              <div className="text-emerald-400 font-semibold border-b border-stone-850 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ⚡ Outbound Mail Server Relay Logs
                </span>
                <span className="text-[9px] uppercase bg-emerald-900/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/10">
                  {selectedLog.status}
                </span>
              </div>

              <div className="space-y-1 text-stone-400">
                <div><span className="text-stone-500">Date Logged:</span> {selectedLog.timestamp}</div>
                <div><span className="text-stone-500">To Relay:</span> <span className="text-stone-100 font-bold">{selectedLog.recipient}</span></div>
                <div><span className="text-stone-500">Subject:</span> <span className="text-white font-bold">{selectedLog.subject}</span></div>
              </div>

              <div className="border-t border-stone-850 pt-3 text-stone-200">
                <span className="text-stone-500 uppercase text-[9px] tracking-wider block mb-2 font-bold">Mail Content Block</span>
                <pre className="break-all whitespace-pre-wrap leading-relaxed text-xs p-4 bg-stone-900 rounded-2xl border border-stone-850">
                  {selectedLog.body}
                </pre>
              </div>

              {selectedLog.previewUrl && (
                <div className="pt-2 flex justify-end">
                  <a 
                    href={selectedLog.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-[10px] px-4 py-2 rounded-full inline-flex items-center gap-1.5 uppercase transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Ethereal Sandbox Mailbox Page
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 p-12 rounded-3xl text-center text-xs text-stone-400 border border-stone-150 flex flex-col items-center justify-center min-h-[300px]">
              <Mail className="w-10 h-10 text-stone-300 mb-2" />
              <span className="font-serif text-sm font-semibold text-stone-600">SMTP Server preview logs in sleep mode</span>
              <p className="text-stone-400 text-[11px] mt-1 max-w-xs">No email relay history located. Hit "Authorize Reset" or send automated guidance emails to dynamically trigger transaction entries on the server.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
