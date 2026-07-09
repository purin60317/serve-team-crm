import React, { useState, useEffect } from 'react';
import { 
  CloudLightning, 
  RefreshCw, 
  CheckCircle2, 
  Wifi, 
  Clock, 
  ListFilter,
  FileSpreadsheet,
  HelpCircle,
  Database
} from 'lucide-react';
import { SyncLogEntry } from '../types';

interface SyncSimulationPanelProps {
  pendingChangesCount: number;
  syncLogs: SyncLogEntry[];
  onTriggerSync: (onComplete: () => void) => void;
  lastSyncTime: string;
}

export default function SyncSimulationPanel({ 
  pendingChangesCount, 
  syncLogs, 
  onTriggerSync,
  lastSyncTime 
}: SyncSimulationPanelProps) {
  
  const [syncState, setSyncState] = useState<'idle' | 'connecting' | 'comparing' | 'uploading' | 'saving' | 'done'>('idle');
  const [latency, setLatency] = useState<number>(32);
  const [activeStep, setActiveStep] = useState<string>('');

  // Randomize ping latency slightly to feel organic
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 15 ? 15 : next > 60 ? 60 : next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const runSync = () => {
    if (syncState !== 'idle') return;

    setSyncState('connecting');
    setActiveStep('與總部 Empower API 建立連線...');
    
    setTimeout(() => {
      setSyncState('comparing');
      setActiveStep('對比資料庫雜湊值 (CRC32)...');
      
      setTimeout(() => {
        setSyncState('uploading');
        setActiveStep(`封裝並加密上傳變更數據包...`);
        
        setTimeout(() => {
          setSyncState('saving');
          setActiveStep('總部正在重新計算 Builder Ratios 與趨勢分佈...');
          
          setTimeout(() => {
            // Commit mutations and notify parent
            onTriggerSync(() => {
              setSyncState('done');
              setActiveStep('同步完成！總部大螢幕儀表板已即時更新。');
              
              setTimeout(() => {
                setSyncState('idle');
                setActiveStep('');
              }, 3000);
            });
          }, 1000);
        }, 1200);
      }, 1000);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-5" id="sync-panel">
      {/* Module Title */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <CloudLightning className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Central Empower 總部串接引擎
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Status: Secure WebSocket Active</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
          <Wifi className="h-3.5 w-3.5" />
          <span>{latency}ms Latency</span>
        </div>
      </div>

      {/* Main console and sync stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl space-y-1">
          <span className="block text-[10px] text-zinc-400 font-semibold uppercase">待同步變動</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${pendingChangesCount > 0 ? 'text-amber-600' : 'text-zinc-500'}`}>
              {pendingChangesCount}
            </span>
            <span className="text-[10px] text-zinc-400">項異動</span>
          </div>
          <p className="text-[9px] text-zinc-400">
            {pendingChangesCount > 0 ? '⚠️ 本地有未儲存的志工異動' : '✅ 本地與總部 100% 同步'}
          </p>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl space-y-1">
          <span className="block text-[10px] text-zinc-400 font-semibold uppercase">上一次同步</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-400" />
            <span className="text-xs font-semibold font-mono text-zinc-700 dark:text-zinc-300">
              {lastSyncTime.split(' ')[1] || '22:10:45'}
            </span>
          </div>
          <span className="block text-[9px] text-zinc-400">
            {lastSyncTime.split(' ')[0] || '2026-07-08'}
          </span>
        </div>
      </div>

      {/* Action Progress Overlay */}
      {syncState !== 'idle' ? (
        <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              {syncState === 'done' ? '同步成功！' : '正在與總部串接資料...'}
            </span>
            <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400">
              {syncState === 'connecting' && '15%'}
              {syncState === 'comparing' && '40%'}
              {syncState === 'uploading' && '65%'}
              {syncState === 'saving' && '90%'}
              {syncState === 'done' && '100%'}
            </span>
          </div>

          <div className="w-full bg-indigo-100 dark:bg-indigo-950 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: 
                  syncState === 'connecting' ? '15%' :
                  syncState === 'comparing' ? '40%' :
                  syncState === 'uploading' ? '65%' :
                  syncState === 'saving' ? '90%' : '100%'
              }}
            />
          </div>

          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            {activeStep}
          </p>
        </div>
      ) : (
        <button
          onClick={runSync}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-300 active:scale-98"
        >
          <RefreshCw className="h-4 w-4" />
          立即同步各分部進度至總部
        </button>
      )}

      {/* Sync Log details list */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
          最新雲端串接日誌 (Sync Log)
        </span>
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-800/60 max-h-[220px] overflow-y-auto pr-1">
          {syncLogs.length > 0 ? (
            syncLogs.map((log) => (
              <div key={log.id} className="p-3 bg-zinc-50/30 dark:bg-zinc-950/20 text-[10px] space-y-1 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    [{log.campus}] {log.operator}
                  </span>
                  <span className="text-zinc-400 text-[9px] font-mono">
                    {log.timestamp.split(' ')[1]}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-normal">
                  {log.details}
                </p>
                <div className="flex items-center gap-1 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>中央資料庫已驗證串接</span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-zinc-400 text-xs">尚無任何同步操作日誌。</p>
          )}
        </div>
      </div>
    </div>
  );
}
