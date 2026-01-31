
import React, { useState } from 'react';
import { Participant, Team } from '../types';
import { Users, Shuffle, LayoutGrid, Download, Hash, FileSpreadsheet } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const TeamGrouping: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [groupingType, setGroupingType] = useState<'SIZE' | 'COUNT'>('SIZE');
  const [groupCount, setGroupCount] = useState<number>(Math.ceil(participants.length / 2));

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const performGrouping = () => {
    const shuffled = shuffleArray(participants);
    const newTeams: Team[] = [];
    
    let targetGroupCount = groupCount;
    if (groupingType === 'SIZE') {
      targetGroupCount = Math.ceil(participants.length / groupSize);
    }

    if (targetGroupCount <= 0) targetGroupCount = 1;

    for (let i = 0; i < targetGroupCount; i++) {
      newTeams.push({
        id: `team-${i}`,
        name: `第 ${i + 1} 組`,
        members: []
      });
    }

    shuffled.forEach((p, idx) => {
      newTeams[idx % targetGroupCount].members.push(p);
    });

    setTeams(newTeams);
  };

  const downloadCSV = () => {
    if (teams.length === 0) return;

    let csvContent = "\ufeff組別,成員姓名\n"; // \ufeff is for Excel UTF-8 BOM
    teams.forEach(team => {
      team.members.forEach(member => {
        csvContent += `${team.name},${member.name}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              自動分組設定
            </h3>
            
            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-fit">
              <button 
                onClick={() => setGroupingType('SIZE')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${groupingType === 'SIZE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                按每組人數分組
              </button>
              <button 
                onClick={() => setGroupingType('COUNT')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${groupingType === 'COUNT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                按總組數分組
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {groupingType === 'SIZE' ? (
                <div className="w-full max-w-[200px]">
                  <label className="block text-sm text-slate-500 mb-1">每組預計人數</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      min="1" 
                      max={participants.length}
                      value={groupSize} 
                      onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[200px]">
                  <label className="block text-sm text-slate-500 mb-1">預計總組數</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      min="1" 
                      max={participants.length}
                      value={groupCount} 
                      onChange={(e) => setGroupCount(parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
              
              <div className="text-sm text-slate-400 mt-6">
                參與人數：{participants.length} 位
              </div>
            </div>
          </div>

          <button
            onClick={performGrouping}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition shadow-lg shadow-indigo-100"
          >
            <Shuffle className="w-5 h-5" />
            執行隨機分組
          </button>
        </div>
      </div>

      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              分組結果展示 ({teams.length} 組)
            </h4>
            <div className="flex gap-3">
               <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition shadow-sm"
               >
                 <FileSpreadsheet className="w-4 h-4" />
                 下載分組 CSV
               </button>
               <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium transition"
               >
                 <Download className="w-4 h-4" />
                 列印結果
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {teams.map((team, idx) => (
              <div 
                key={team.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition group animate-in zoom-in-95"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                  <h5 className="font-bold text-slate-800 text-lg">{team.name}</h5>
                  <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full font-bold">
                    {team.members.length} 位成員
                  </span>
                </div>
                <div className="space-y-2">
                  {team.members.map((m, mIdx) => (
                    <div key={m.id} className="flex items-center gap-3 text-slate-600 text-sm py-1.5 px-2 hover:bg-slate-50 rounded-lg transition">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 group-hover:bg-indigo-500" />
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamGrouping;
