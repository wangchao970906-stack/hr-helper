
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Trash2, Upload, FileText, PlusCircle, CheckCircle, Users, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  participants: Participant[];
  onUpdate: (newList: Participant[]) => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 偵測重複項目
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [participants]);

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    
    const names = inputText
      .split(/\n|,/)
      .map(n => n.trim())
      .filter(n => n !== '');
      
    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newParticipants]);
    setInputText('');
    showSuccess(`已新增 ${newParticipants.length} 位參與者`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
      
      const names = lines.map(line => line.split(',')[0].trim())
        .filter(n => n && !['姓名', 'name', 'Name'].includes(n.toLowerCase()));
      
      const newParticipants: Participant[] = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));

      onUpdate([...participants, ...newParticipants]);
      showSuccess(`已從 CSV 匯入 ${newParticipants.length} 位姓名`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const generateMockData = () => {
    const mockNames = [
      '陳大明', '林小華', '張三', '李四', '王五', '趙六', '錢七', '孫八', '周九', '吳十',
      '鄭美美', '王阿強', '李大壯', '林曉鈴', '郭小芬', '陳小志', '蔡中平', '徐如芳', '張大衛', '劉依婷'
    ];
    // 故意增加一個重複項來示範功能
    const fullMock = [...mockNames, '陳大明'];
    const newParticipants: Participant[] = fullMock.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
    showSuccess('已產生 20 位模擬參與者名單（包含 1 組重複姓名）');
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
    showSuccess(`已移除重複姓名，現有名單 ${uniqueList.length} 位`);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 輸入區塊 */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              新增參與者
            </h3>
            
            <textarea
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm mb-4"
              placeholder="請貼上姓名（每行一位，或用逗號隔開）..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleManualAdd}
                className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 transition font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                新增至名單
              </button>
              <button
                onClick={generateMockData}
                className="bg-amber-50 text-amber-700 border border-amber-200 py-3 rounded-xl hover:bg-amber-100 flex items-center justify-center gap-2 transition font-medium"
              >
                <Sparkles className="w-5 h-5" />
                產生模擬名單
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-600 mb-3 text-center">或上傳 CSV 檔案</p>
              <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                <span className="text-sm text-slate-500 group-hover:text-indigo-600">選擇 CSV 檔案（首欄為姓名）</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* 預覽清單 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              參與者預覽 ({participants.length})
            </h3>
            <div className="flex gap-3">
              {duplicateNames.size > 0 && (
                <button 
                  onClick={removeDuplicates}
                  className="bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-orange-200 transition"
                >
                  <AlertCircle className="w-3 h-3" />
                  移除重複項目
                </button>
              )}
              {participants.length > 0 && (
                <button 
                  onClick={() => onUpdate([])}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  全部清空
                </button>
              )}
            </div>
          </div>

          {duplicateNames.size > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-xs flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4" />
              偵測到名單中有重複姓名，已為您在下方標註。
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[400px]">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>目前名單為空</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg group transition ${
                    isDuplicate ? 'bg-orange-100 border border-orange-200' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-300 w-6">{idx + 1}.</span>
                      <span className={`font-medium ${isDuplicate ? 'text-orange-800' : 'text-slate-700'}`}>
                        {p.name}
                        {isDuplicate && <span className="ml-2 text-[10px] bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded-full">重複</span>}
                      </span>
                    </div>
                    <button 
                      onClick={() => onUpdate(participants.filter(item => item.id !== p.id))}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 提示訊息 */}
      {successMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ParticipantManager;
