
import React, { useState, useCallback } from 'react';
import { Participant, AppMode } from './types';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import TeamGrouping from './components/TeamGrouping';
import { Users, Gift, Settings2, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.MANAGE);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 導覽列 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HR 專業行政工具箱</h1>
          </div>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode(AppMode.MANAGE)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === AppMode.MANAGE 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>名單管理</span>
            </button>
            <button
              onClick={() => setMode(AppMode.LUCKY_DRAW)}
              disabled={participants.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                mode === AppMode.LUCKY_DRAW 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>獎品抽籤</span>
            </button>
            <button
              onClick={() => setMode(AppMode.GROUPING)}
              disabled={participants.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                mode === AppMode.GROUPING 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>自動分組</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {mode === AppMode.MANAGE && (
          <ParticipantManager 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
          />
        )}
        
        {mode === AppMode.LUCKY_DRAW && participants.length > 0 && (
          <LuckyDraw participants={participants} />
        )}

        {mode === AppMode.GROUPING && participants.length > 0 && (
          <TeamGrouping participants={participants} />
        )}

        {participants.length === 0 && mode !== AppMode.MANAGE && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Users className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">尚未匯入名單</h2>
            <p className="text-slate-500 mt-2">請先前往「名單管理」上傳 CSV 或貼上姓名。</p>
            <button
              onClick={() => setMode(AppMode.MANAGE)}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              立即新增名單
            </button>
          </div>
        )}
      </main>

      {/* 頁尾 */}
      <footer className="border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} HR Pro Toolkit • 現代化人事行政管理系統
      </footer>
    </div>
  );
};

export default App;
