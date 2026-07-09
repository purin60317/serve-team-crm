import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  Info,
  Database,
  RefreshCw,
  Download
} from 'lucide-react';
import { parseCSV, generateCSV } from '../utils/csvParser';
import { MemberRecord } from '../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: MemberRecord[], mode: 'append' | 'overwrite') => void;
  onExport: () => void;
  onResetToDefault: () => void;
}

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  onExport,
  onResetToDefault 
}: ImportExportModalProps) {
  
  const [dragActive, setDragActive] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedPreview, setParsedPreview] = useState<MemberRecord[] | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('overwrite');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 2. Read File content
  const handleFile = (file: File) => {
    setFileName(file.name);
    setErrorMessage('');
    
    // Validate file type (CSV or TXT)
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setErrorMessage('❌ 僅支援匯入 .csv 或是含有逗號分隔的 .txt 純文字檔！');
      setParsedPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvInput(text);
      processPreview(text);
    };
    reader.onerror = () => {
      setErrorMessage('讀取檔案時出錯，請稍後再試。');
    };
    reader.readAsText(file);
  };

  const processPreview = (text: string) => {
    try {
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setErrorMessage('⚠️ 無法解析任何有效的夥伴資料。請檢查表頭格式或逗號分隔是否正確。');
        setParsedPreview(null);
        return;
      }
      setParsedPreview(parsed);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('解析 CSV 時發生錯誤。請確認格式相符。');
      setParsedPreview(null);
    }
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvInput(text);
    if (text.trim()) {
      processPreview(text);
    } else {
      setParsedPreview(null);
      setErrorMessage('');
    }
  };

  // 3. Confirm trigger
  const handleConfirmImport = () => {
    if (parsedPreview && parsedPreview.length > 0) {
      onImport(parsedPreview, importMode);
      onClose();
      // Reset state
      setCsvInput('');
      setFileName('');
      setParsedPreview(null);
    }
  };

  // 4. Distribution summary of parsed preview
  const previewSummary = parsedPreview ? parsedPreview.reduce((acc: Record<string, number>, r) => {
    acc[r.campus] = (acc[r.campus] || 0) + 1;
    return acc;
  }, {}) : {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="import-modal-overlay">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]" id="import-modal">
        {/* Title */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Excel / CSV 數據無縫對接系統
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                匯入來自 report1783573886142 或是其他分部的服事管理報表
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* File drag-and-drop container */}
          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10' 
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-zinc-700 dark:text-zinc-300 font-medium">
              將 .csv 檔案拖曳至此處，或{' '}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                瀏覽本機檔案
              </button>
            </p>
            <p className="text-[10px] text-zinc-400 mt-1">
              支援 UTF-8 編碼與逗號、雙引號包覆的標準 CSV 檔案
            </p>
            {fileName && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="h-3.5 w-3.5" />
                <span>已讀取：{fileName}</span>
              </div>
            )}
          </div>

          {/* Paste Raw CSV textbox */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                手動貼上 CSV 數據 (備用方案，支援複製 Excel 儲存格)
              </span>
              <span className="text-[10px] text-zinc-400">欄位需包含「手機驗證」、「已有小組」、「Campus」等欄</span>
            </div>
            <textarea
              className="w-full h-24 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[10px] focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              placeholder={`"會眾資料: 手機驗證通過","會眾資料: 已有小組","會眾資料: 已有服事團隊","服事團隊資料: 團隊人數計算","會眾資料: 會眾身份[服事] B1 人數","會眾資料: 會眾身份[服事] B2 人數","會眾資料: 會眾身份[服事] B3 人數","團隊所屬Campus","團隊(英文)","子團隊(英文)"\n"1","1","1","16","0","0","1","台中分部","Baptism",""`}
              value={csvInput}
              onChange={handlePasteChange}
            />
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-start gap-2 animate-fadeIn border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal">{errorMessage}</p>
            </div>
          )}

          {/* Verification Previews */}
          {parsedPreview && parsedPreview.length > 0 && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-800/80 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-bold">
                <Database className="h-4.5 w-4.5 text-indigo-500" />
                <span>上傳報表解析預覽與資料結構驗證</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] text-zinc-400">總解析行數</span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 font-mono">{parsedPreview.length} 人</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] text-zinc-400">手機驗證通過</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {parsedPreview.filter(p => p.phoneVerified).length} 人
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] text-zinc-400">已有小組栽培</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {parsedPreview.filter(p => p.hasGroup).length} 人
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] text-zinc-400">Builder 層級 (B1-B3)</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {parsedPreview.filter(p => p.b1 || p.b2 || p.b3).length} 人
                  </span>
                </div>
              </div>

              {/* Campus distribution details */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800">
                <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">分部夥伴名額分佈</span>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(previewSummary).map(([campus, count]) => (
                    <div key={campus} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{campus}：</span>
                      <span className="font-mono text-zinc-500 dark:text-zinc-400">{count} 筆</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflict resolution / Import strategy selection */}
              <div className="pt-2">
                <span className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">選擇匯入與對接策略</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setImportMode('overwrite')}
                    className={`p-3 text-left border rounded-xl flex flex-col justify-between transition-all ${
                      importMode === 'overwrite'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/10'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/30'
                    }`}
                  >
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">覆蓋現有數據 (Overwrite)</span>
                    <span className="text-[10px] text-zinc-400 mt-1">完全清除目前網頁的所有資料，以本張報表取而代之（共 {parsedPreview.length} 人）</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('append')}
                    className={`p-3 text-left border rounded-xl flex flex-col justify-between transition-all ${
                      importMode === 'append'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/10'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/30'
                    }`}
                  >
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">追加併入數據 (Append)</span>
                    <span className="text-[10px] text-zinc-400 mt-1">保留現有的夥伴資料，將本張報表的 {parsedPreview.length} 筆人員累計併入資料庫中</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick instructions & template download help */}
          <div className="p-4 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-400 font-bold">
              <Info className="h-4 w-4" />
              <span>如何取得正確格式的報表？</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              <li>您也可以<a href="https://thehope.lightning.force.com/lightning/r/Report/00OQ800000LhcNhMAJ/view?queryScope=userFolders" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">點擊此處下載此格式的報告</a>。</li>
              <li>您可以點擊下方<b>「下載目前資料 CSV」</b>，直接取得符合系統解析格式的 Excel 範本。</li>
              <li>若是從後台下載，請確認欄位名稱包含：<code>手機驗證通過</code>、<code>已有小組</code>、<code>已有服事團隊</code>、<code>團隊所屬Campus</code>。</li>
              <li>本網頁會<b>自動兼容</b>多種中英文報表欄位寫法，實現免人工調整、一鍵導入！</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetToDefault}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold rounded-xl flex items-center gap-1.5 transition-all text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            重置回初始 Excel 數據
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExport}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-semibold rounded-xl flex items-center gap-1.5 transition-all text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              下載目前 CSV
            </button>
            <button
              type="button"
              disabled={!parsedPreview || parsedPreview.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs shadow-xs"
            >
              <Check className="h-4 w-4" />
              確認對接匯入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
