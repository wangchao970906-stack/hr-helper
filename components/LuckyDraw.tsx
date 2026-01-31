
import React, { useState, useEffect, useRef } from 'react';
import { Participant, Winner } from '../types';
import { Gift, Play, RotateCcw, Trophy, History } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activePool, setActivePool] = useState<Participant[]>(participants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [lastWinner, setLastWinner] = useState<Participant | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setActivePool(participants);
    setWinners([]);
    setLastWinner(null);
  }, [participants]);

  const resetPool = () => {
    if (window.confirm('確定要重置所有抽籤紀錄並恢復完整名單嗎？')) {
      setActivePool(participants);
      setWinners([]);
      setLastWinner(null);
    }
  };

  if (!participants || participants.length === 0) {
    return <div className="text-center p-10 text-slate-500">請先新增參與者名單</div>;
  }

  const startDraw = () => {
    if (activePool.length === 0) {
      alert('名單已全數抽完！');
      return;
    }

    setIsSpinning(true);
    setLastWinner(null);

    let speed = 50;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      // Use functional state update to ensure we always have the latest activePool length if it were to change (though it shouldn't during spin)
      setCurrentIndex(prev => {
        if (activePool.length === 0) return 0;
        return (prev + 1) % activePool.length;
      });

      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        intervalRef.current = window.setTimeout(animate, speed);
      } else {
        finalizeWinner();
      }
    };

    animate();
  };

  const finalizeWinner = () => {
    if (activePool.length === 0) {
      setIsSpinning(false);
      return;
    }
    const winningIndex = Math.floor(Math.random() * activePool.length);
    const winner = activePool[winningIndex];

    // Safety check
    if (!winner) {
      setIsSpinning(false);
      return;
    }

    setLastWinner(winner);
    setWinners(prev => [{
      id: winner.id,
      name: winner.name,
      timestamp: Date.now()
    }, ...prev]);

    if (!allowRepeat) {
      setActivePool(prev => prev.filter(p => p.id !== winner.id));
    }

    setIsSpinning(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        {/* 設定與狀態 */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600" />
              抽籤設定
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-sm font-medium text-slate-700">允許重複中獎</span>
                <input
                  type="checkbox"
                  checked={allowRepeat}
                  onChange={(e) => setAllowRepeat(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </label>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">待抽獎人數</p>
                <p className="text-3xl font-bold text-indigo-700">{activePool.length}</p>
              </div>

              <button
                onClick={resetPool}
                className="w-full flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-red-500 transition text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                重置抽籤池
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              中獎紀錄
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {winners.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">尚無中獎紀錄</p>
              ) : (
                winners.map((winner, idx) => (
                  <div key={winner.id + winner.timestamp} className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">
                    <span className="font-medium truncate">{winner.name}</span>
                    <span className="text-[10px] opacity-70">{new Date(winner.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 動畫主舞台 */}
        <div className="md:col-span-2 flex flex-col items-center justify-center min-h-[550px] bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
          </div>

          {lastWinner && !isSpinning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full animate-ping bg-white opacity-5 rounded-full" />
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <div className={`text-6xl mb-6 transition-transform duration-300 ${isSpinning ? 'scale-110' : 'scale-100'}`}>
              {isSpinning ? '🎡' : lastWinner ? '🏆' : '🎁'}
            </div>

            <div className="h-32 flex items-center justify-center w-full">
              {activePool.length > 0 || isSpinning ? (
                <div className="space-y-2">
                  <h2 className={`text-5xl md:text-6xl font-black transition-all ${isSpinning ? 'text-indigo-400 blur-[1px]' : 'text-white'
                    }`}>
                    {isSpinning ? (activePool[currentIndex]?.name || '...') : (lastWinner?.name || '準備就緒')}
                  </h2>
                  {lastWinner && !isSpinning && (
                    <p className="text-emerald-400 font-bold tracking-[0.2em] uppercase animate-bounce mt-4 text-xl">恭喜中獎！</p>
                  )}
                </div>
              ) : (
                <h2 className="text-3xl font-bold text-slate-400">名單已全數抽完</h2>
              )}
            </div>

            <div className="mt-16 flex flex-col gap-4 w-full max-w-xs">
              <button
                disabled={isSpinning || activePool.length === 0}
                onClick={startDraw}
                className={`py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition shadow-lg ${isSpinning || activePool.length === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'
                  }`}
              >
                {isSpinning ? (
                  <>
                    <Play className="w-6 h-6 animate-spin" />
                    抽獎中...
                  </>
                ) : (
                  <>
                    <Trophy className="w-6 h-6" />
                    {lastWinner ? '抽取下一位' : '開始抽獎'}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="absolute top-8 right-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-widest">
              <div className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
              SYSTEM ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
