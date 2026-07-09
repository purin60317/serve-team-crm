import React, { useState, useMemo, useEffect } from 'react';
import { 
  getInitialVolunteers, 
  getInitialSyncLogs 
} from './data/initialData';
import { 
  MemberRecord, 
  SummaryStats, 
  SyncLogEntry 
} from './types';
import { generateCSV } from './utils/csvParser';

// Components
import StatsGrid from './components/StatsGrid';
import AnalyticsPanel from './components/AnalyticsPanel';
import MembersTable from './components/MembersTable';
import ImportExportModal from './components/ImportExportModal';

// Icons
import { 
  Users, 
  Layers, 
  RefreshCw, 
  FileSpreadsheet, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  User,
  Shield,
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers2
} from 'lucide-react';

export default function App() {
  // 1. Core State with LocalStorage bindings
  const [volunteers, setVolunteers] = useState<MemberRecord[]>(() => {
    const local = localStorage.getItem('empower_volunteers');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse cached volunteers', e);
      }
    }
    return getInitialVolunteers();
  });

  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(() => {
    const local = localStorage.getItem('empower_sync_logs');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse cached sync logs', e);
      }
    }
    return getInitialSyncLogs();
  });

  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('empower_last_sync') || '2026-07-08 22:10:45';
  });

  const [pendingChanges, setPendingChanges] = useState<number>(() => {
    const cached = localStorage.getItem('empower_pending_changes');
    return cached ? parseInt(cached, 10) : 0;
  });

  // UI Filters
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  
  // Modals & Notifications
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-persist variables whenever state changes
  useEffect(() => {
    localStorage.setItem('empower_volunteers', JSON.stringify(volunteers));
    localStorage.setItem('empower_pending_changes', pendingChanges.toString());
  }, [volunteers, pendingChanges]);

  useEffect(() => {
    localStorage.setItem('empower_sync_logs', JSON.stringify(syncLogs));
  }, [syncLogs]);

  useEffect(() => {
    localStorage.setItem('empower_last_sync', lastSyncTime);
  }, [lastSyncTime]);

  // Toast Notification helper
  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // 2. Derive dynamic teams based on selected Campus
  const availableTeams = useMemo(() => {
    const teamSet = new Set<string>();
    volunteers.forEach(v => {
      if (selectedCampus === 'all' || v.campus === selectedCampus) {
        teamSet.add(v.team);
      }
    });
    return Array.from(teamSet).sort();
  }, [volunteers, selectedCampus]);

  // Adjust active team if it gets filtered out
  useEffect(() => {
    if (selectedTeam !== 'all' && !availableTeams.includes(selectedTeam)) {
      setSelectedTeam('all');
    }
  }, [availableTeams, selectedTeam]);

  // 3. Dynamic aggregations for current filtered scope
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => {
      const matchCampus = selectedCampus === 'all' || v.campus === selectedCampus;
      const matchTeam = selectedTeam === 'all' || v.team === selectedTeam;
      return matchCampus && matchTeam;
    });
  }, [volunteers, selectedCampus, selectedTeam]);

  const summaryStats = useMemo<SummaryStats>(() => {
    const total = filteredVolunteers.length;
    if (total === 0) {
      return {
        totalVolunteers: 0,
        phoneVerifiedCount: 0,
        phoneVerifiedRate: 0,
        hasGroupCount: 0,
        hasGroupRate: 0,
        hasTeamCount: 0,
        hasTeamRate: 0,
        b1Count: 0,
        b2Count: 0,
        b3Count: 0,
        totalBuildersCount: 0,
        builderRatio: 0
      };
    }

    const verified = filteredVolunteers.filter(v => v.phoneVerified).length;
    const group = filteredVolunteers.filter(v => v.hasGroup).length;
    const team = filteredVolunteers.filter(v => v.hasTeam).length;

    const b1 = filteredVolunteers.filter(v => v.b1).length;
    const b2 = filteredVolunteers.filter(v => v.b2).length;
    const b3 = filteredVolunteers.filter(v => v.b3).length;
    const totalBuilders = b1 + b2 + b3;

    return {
      totalVolunteers: total,
      phoneVerifiedCount: verified,
      phoneVerifiedRate: (verified / total) * 100,
      hasGroupCount: group,
      hasGroupRate: (group / total) * 100,
      hasTeamCount: team,
      hasTeamRate: (team / total) * 100,
      b1Count: b1,
      b2Count: b2,
      b3Count: b3,
      totalBuildersCount: totalBuilders,
      builderRatio: (totalBuilders / total) * 100
    };
  }, [filteredVolunteers]);

  // 4. Mutative database actions
  const handleUpdateRecord = (updatedRecord: MemberRecord) => {
    setVolunteers(prev => prev.map(v => v.id === updatedRecord.id ? { ...updatedRecord, updatedAt: '2026-07-08' } : v));
    setPendingChanges(p => p + 1);
    
    // Append to live logs list
    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: '2026-07-08 22:20:00',
      campus: updatedRecord.campus,
      operator: 'Mavis Lo',
      action: '志工資料修改',
      status: 'pending',
      details: `修改志工 ID ${updatedRecord.id} (團隊: ${updatedRecord.team})，變更 Builder 等級與手機驗證`
    };
    setSyncLogs(prev => [newLog, ...prev.slice(0, 19)]);
    triggerNotification('志工資料已修改！待點擊「同步總部進度」寫入雲端伺服器。', 'info');
  };

  const handleDeleteRecord = (id: string) => {
    const record = volunteers.find(v => v.id === id);
    if (!record) return;

    setVolunteers(prev => prev.filter(v => v.id !== id));
    setPendingChanges(p => p + 1);

    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: '2026-07-08 22:20:00',
      campus: record.campus,
      operator: 'Mavis Lo',
      action: '志工資料刪除',
      status: 'pending',
      details: `自團隊 ${record.team} 中移除 1 名服事人員`
    };
    setSyncLogs(prev => [newLog, ...prev.slice(0, 19)]);
    triggerNotification('志工資料已移除，待同步寫入中央伺服器。', 'info');
  };

  const handleAddRecord = (newMember: Omit<MemberRecord, 'id'>) => {
    const id = `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullRecord: MemberRecord = {
      ...newMember,
      id,
      updatedAt: '2026-07-08'
    };

    setVolunteers(prev => [fullRecord, ...prev]);
    setPendingChanges(p => p + 1);

    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: '2026-07-08 22:20:00',
      campus: newMember.campus,
      operator: 'Mavis Lo',
      action: '志工手動登記',
      status: 'pending',
      details: `手動登記新服事志工至 ${newMember.team} 團隊 (${newMember.subTeam || '無子團隊'})`
    };
    setSyncLogs(prev => [newLog, ...prev.slice(0, 19)]);
    triggerNotification('志工登記成功！已新增至名冊。', 'success');
  };

  // 5. Excel Import & Reset Handlers
  const handleImportData = (records: MemberRecord[], mode: 'append' | 'overwrite') => {
    if (mode === 'overwrite') {
      setVolunteers(records);
      setPendingChanges(records.length);
      triggerNotification(`成功覆蓋！已匯入 ${records.length} 筆全新的服事資料。`, 'success');
    } else {
      setVolunteers(prev => [...records, ...prev]);
      setPendingChanges(p => p + records.length);
      triggerNotification(`追加成功！已向現有資料庫併入 ${records.length} 筆人員資料。`, 'success');
    }

    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: '2026-07-08 22:20:00',
      campus: '分部匯入',
      operator: 'Mavis Lo',
      action: 'Excel/CSV 匯入對接',
      status: 'pending',
      details: `匯入新報表共計 ${records.length} 筆人員資料 (${mode === 'overwrite' ? '覆蓋原庫' : '累計追加'})`
    };
    setSyncLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleResetToDefault = () => {
    if (confirm('確定要清除所有本地異動，將資料重置回 `report1783573886142` 的初始 796 筆 Excel 數據？')) {
      setVolunteers(getInitialVolunteers());
      setPendingChanges(0);
      setSyncLogs(getInitialSyncLogs());
      setLastSyncTime('2026-07-08 22:10:45');
      triggerNotification('資料庫已恢復為 report1783573886142 的出廠初始狀態！', 'info');
    }
  };

  const handleExportData = () => {
    const csvContent = generateCSV(volunteers);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Central_Empower_Ministry_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('已生成服事 CSV 報表檔案，並自動下載！', 'success');
  };

  // HQ Sync simulation trigger
  const handleTriggerSync = (onComplete: () => void) => {
    // Generate simulated log for this sync operation
    const syncedCount = pendingChanges;
    setPendingChanges(0);
    
    // Update timestamp
    const nowStr = '2026-07-08 22:20:15';
    setLastSyncTime(nowStr);

    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      campus: '總部同步',
      operator: 'Mavis Lo',
      action: '與總部數據庫串接',
      status: 'success',
      details: `成功將本地累計的 ${syncedCount} 筆異動封包寫入中央 Empower 伺服器，全台分部進度同步完成。`
    };
    setSyncLogs(prev => [newLog, ...prev.slice(0, 19)]);
    
    onComplete();
    triggerNotification('同步成功！各分部負責人進度已成功串接至中央總部數據庫！', 'success');
  };

  const syncPercentage = pendingChanges === 0 ? 100 : Math.max(70, 100 - pendingChanges * 3);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] font-sans text-slate-800" id="app-root">
      
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-lg border animate-slideIn flex items-center gap-3 max-w-sm ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
              : notification.type === 'info'
              ? 'bg-indigo-50 text-indigo-800 border-indigo-100'
              : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}
          id="toast-notification"
        >
          <div className="p-1 bg-white/80 rounded-full shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Header - Mockup Perfect Match */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1E293B] text-white shrink-0 shadow-md select-none" id="global-header">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-base">E</div>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight">CENTRAL - EMPOWER</h1>
            <p className="text-[10px] text-slate-300 tracking-wider font-semibold mt-0.5 uppercase">LEADERSHIP COMMAND CENTER</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-300 italic">Report ID: 1783573886142</span>
          </div>
          
          <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
            <button 
              onClick={() => setIsImportOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel 導入
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-400 flex items-center justify-center font-bold text-xs text-white">
              ML
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Split Layout */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* Sidebar Navigation - Mockup Perfect Match */}
        <aside className="w-full lg:w-56 bg-white border-r border-slate-200 p-4 flex flex-col gap-4 shrink-0 shadow-xs">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => handleScrollTo('filter-bar-card')}
              className="w-full bg-indigo-50 text-indigo-700 px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold hover:bg-indigo-100/70 transition-all text-left"
            >
              <SlidersHorizontal className="w-4 h-4" />
              數據總覽
            </button>
            <button
              onClick={() => handleScrollTo('detailed-table-section')}
              className="w-full text-slate-500 hover:bg-slate-50 px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-medium transition-colors text-left"
            >
              <Users className="w-4 h-4" />
              分部服事團隊
            </button>
            <button
              onClick={() => handleScrollTo('analytics-and-sync-row')}
              className="w-full text-slate-500 hover:bg-slate-50 px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-medium transition-colors text-left"
            >
              <Layers2 className="w-4 h-4" />
              趨勢分析報告
            </button>
          </nav>
          
          {/* Sidebar Sync Status Box */}
          <div className="mt-auto p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Sync Status</p>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">
                {pendingChanges === 0 ? 'HQ 已同步' : 'HQ 同步中'}
              </span>
              <span className="text-emerald-500 font-bold">{syncPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${syncPercentage}%` }}
              ></div>
            </div>
            {pendingChanges > 0 && (
              <p className="text-[9px] text-amber-600 font-medium mt-1.5 font-mono">
                * 偵測到 {pendingChanges} 筆本地異動待同步
              </p>
            )}
          </div>
        </aside>

        {/* Main Scrollable Content Area */}
        <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto" id="main-scrollable">
          
          {/* Global Filters Section */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0" id="filter-bar-card">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6">
              
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5 mb-1">分部選擇</label>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: 'all', label: '全部' },
                    { id: '台北分部', label: '台北' },
                    { id: '台中分部', label: '台中' },
                    { id: '線上分部', label: '線上' }
                  ].map((campus) => (
                    <button
                      key={campus.id}
                      onClick={() => {
                        setSelectedCampus(campus.id);
                        setSelectedTeam('all');
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        selectedCampus === campus.id
                          ? 'bg-white text-slate-800 shadow-xs border-none'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {campus.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden md:block h-8 w-px bg-slate-200"></div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5 mb-1">服事團隊</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer min-w-44 py-1.5 outline-hidden"
                >
                  <option value="all">★ 所有事工團隊 (All Teams)</option>
                  {availableTeams.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleResetToDefault}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                復原初始
              </button>
            </div>
          </div>

          {/* Dynamic Aggregated Statistics Widgets */}
          <div id="stats-grid-section">
            <StatsGrid stats={summaryStats} />
          </div>

          {/* Dynamic Charts Row */}
          <div className="w-full" id="analytics-and-sync-row">
            <AnalyticsPanel 
              volunteers={volunteers}
              activeCampus={selectedCampus}
              activeTeam={selectedTeam}
            />
          </div>

          {/* Big data tables with full detailed CRUD */}
          <div className="w-full" id="detailed-table-section">
            <MembersTable 
              volunteers={volunteers}
              activeCampus={selectedCampus}
              activeTeam={selectedTeam}
            />
          </div>

        </main>
      </div>

      {/* Bottom Status Bar Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-2 select-none">
        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            資料庫連線正常 (Sync System Active)
          </span>
          <span className="text-slate-400">|</span>
          <span>最後總部同步時間: <span className="font-mono font-semibold">{lastSyncTime}</span></span>
        </div>
        <div className="text-[10px] text-slate-400 font-semibold italic tracking-wide">
          Empowering people to build the kingdom together.
        </div>
      </footer>

      {/* CSV/Excel Import Export Dialogue Modal */}
      <ImportExportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportData}
        onExport={handleExportData}
        onResetToDefault={handleResetToDefault}
      />

    </div>
  );
}

