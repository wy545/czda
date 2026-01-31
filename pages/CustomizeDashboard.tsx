import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Search, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

const CustomizeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items, pinnedIds, updatePinnedIds, isLoggedIn, loading: contextLoading } = useArchive();
  const [selectedIds, setSelectedIds] = useState<string[]>(pinnedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!contextLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, contextLoading, navigate]);

  // 当 pinnedIds 变化时更新 selectedIds
  useEffect(() => {
    setSelectedIds(pinnedIds);
  }, [pinnedIds]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaving(true);
    try {
      updatePinnedIds(selectedIds);
      navigate('/');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.includes(searchQuery)
  );

  if (contextLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 -ml-2 p-2 rounded-full hover:bg-slate-50">
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">返回</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">选择展示内容</h1>
        <div className="w-12"></div>
      </header>

      <div className="p-4 bg-white border-b border-slate-50">
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-sm w-full placeholder:text-slate-400"
              placeholder="搜索档案..."
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 px-1">
          已选择 {selectedIds.length} 个项目展示在首页
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-slate-300'
                }`}>
                {isSelected && <Check size={12} className="text-white" />}
              </div>

              <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url("${item.imageUrl}")` }}
                ></div>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 truncate">{item.category} • {item.date}</p>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            没有找到匹配的档案
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 max-w-md mx-auto">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? '保存中...' : '确认并同步到首页'}
        </button>
      </div>
    </div>
  );
};

export default CustomizeDashboard;