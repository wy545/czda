import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, MoreHorizontal, Trash2, CheckCircle, Clock, Plus, XCircle, Loader2 } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';
import Layout from '../components/Layout';

const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { items, deleteItem, user, isLoggedIn, loading, refreshItems } = useArchive();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // 页面加载时刷新数据
  useEffect(() => {
    if (isLoggedIn) {
      refreshItems();
    }
  }, [isLoggedIn, refreshItems]);

  const tabs = [
    { id: 'All', label: '全部' },
    { id: 'Academic', label: '学业' },
    { id: 'Practice', label: '实践' },
    { id: 'Reward', label: '奖惩' },
    { id: 'Certificate', label: '证书' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Tab Filter
      let matchesTab = false;
      if (activeTab === 'All') {
        matchesTab = true;
      } else {
        if (activeTab === 'Academic' && (item.category.includes('学术') || item.category.includes('学业'))) matchesTab = true;
        else if (activeTab === 'Practice' && item.category.includes('实践')) matchesTab = true;
        else if (activeTab === 'Reward' && item.category.includes('奖惩')) matchesTab = true;
        else if (activeTab === 'Certificate' && item.category.includes('证书')) matchesTab = true;
      }

      if (!matchesTab) return false;

      // 2. Search Filter
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchOrg = item.organization.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query);

      return matchTitle || matchOrg || matchDesc;
    });
  }, [activeTab, searchQuery, items]);

  const handleDelete = async (id: string) => {
    setMenuOpenId(null);
    if (!window.confirm('确认删除此记录吗？')) return;

    setDeleting(id);
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Click outside to close menu */}
      {menuOpenId && (
        <div className="fixed inset-0 z-30 bg-transparent" onClick={() => setMenuOpenId(null)}></div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                {user.avatar ? (
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 ring-2 ring-slate-50"
                    style={{ backgroundImage: `url("${user.avatar}")` }}
                  ></div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold ring-2 ring-slate-50">
                    {user.name ? user.name.charAt(0) : '?'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">成长档案库</h1>
                <p className="text-[11px] text-text-secondary font-medium">
                  学号: {user.studentId || '未设置'}
                </p>
              </div>
            </div>
          </div>
          <div className="relative mb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-sm w-full placeholder:text-slate-400 text-slate-700"
                placeholder="搜索证书、项目或实践经历..."
              />
              <button className="text-slate-400">
                <Mic size={18} />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex px-4 gap-6 overflow-x-auto no-scrollbar border-t border-slate-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center pb-3 pt-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-primary'
                }`}
            >
              <span className={`text-sm tracking-wide ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm font-bold text-slate-500">
            {searchQuery ? '搜索结果' : '最近上传'}
          </h2>
          <div className="flex gap-3 text-xs font-semibold text-slate-600">
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">筛选</button>
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors">排序</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/archive/${item.id}`)}
                className={`group relative flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${deleting === item.id ? 'opacity-50' : ''}`}
              >
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                  ></div>
                </div>
                <div className="flex flex-col flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{item.title}</h3>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === item.id ? null : item.id);
                        }}
                        disabled={deleting === item.id}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        {deleting === item.id ? <Loader2 size={20} className="animate-spin" /> : <MoreHorizontal size={20} />}
                      </button>
                      {menuOpenId === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={16} />
                            删除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-primary font-bold mt-1">{item.category} • {item.organization}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-[11px] text-text-secondary">{item.date}</p>
                    {item.status === 'approved' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">
                        <CheckCircle size={12} className="fill-current" /> 已审核
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
                        <XCircle size={12} /> 未通过
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold">
                        <Clock size={12} /> 审核中
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Search size={48} className="mb-2 text-slate-200" />
              <p className="text-sm">没有找到相关记录</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/archive/add')}
        className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full shadow-[0_4px_12px_rgba(53,158,255,0.4)] flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={32} />
      </button>
    </Layout>
  );
};

export default Archive;