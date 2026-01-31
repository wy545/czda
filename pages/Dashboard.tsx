import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MoreHorizontal, Loader2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RADAR_DATA } from '../constants';
import { useArchive } from '../context/ArchiveContext';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items, pinnedIds, notifications, user, isLoggedIn, loading, refreshItems } = useArchive();

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // 刷新数据
  useEffect(() => {
    if (isLoggedIn) {
      refreshItems();
    }
  }, [isLoggedIn, refreshItems]);

  // Determine which items to display: Pinned items or default to top 3 recent
  const displayItems = pinnedIds.length > 0
    ? items.filter(item => pinnedIds.includes(item.id))
    : items.slice(0, 3);

  const hasUnread = notifications.some(n => !n.read);

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
      <header className="sticky top-0 z-20 bg-background-light/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatar ? (
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                  style={{ backgroundImage: `url("${user.avatar}")` }}
                ></div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                  {user.name ? user.name.charAt(0) : '?'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{user.name || '未设置姓名'}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/messages')}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors relative"
          >
            <Bell size={24} />
            {hasUnread && (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </header>

      <section className="px-4 mt-4 mb-2">
        <div className="flex flex-col rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold">成长分析</h2>
              <p className="text-slate-500 text-sm">五维综合能力评估</p>
            </div>
            <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
              <MoreHorizontal size={24} />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="综合评分"
                  dataKey="A"
                  stroke="#359EFF"
                  strokeWidth={3}
                  fill="#359EFF"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">
            {pinnedIds.length > 0 ? '精选展示' : '最近亮点'}
          </h3>
          <button
            onClick={() => navigate('/archive')}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            查看全部
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {displayItems.length > 0 ? (
            displayItems.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/archive/${item.id}`)}
                className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                  ></div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-base font-semibold truncate text-slate-900">{item.title}</p>
                  <p className="text-slate-500 text-sm truncate">{item.category} • {item.organization}</p>
                </div>
                <p className="text-xs font-medium text-slate-400 whitespace-nowrap">{item.date}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">暂无记录</div>
          )}
        </div>
      </section>

      <div className="px-4 mt-2 mb-8">
        <button
          onClick={() => navigate('/dashboard/customize')}
          className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 font-medium text-sm hover:bg-white/50 transition-colors flex items-center justify-center gap-2"
        >
          <span>自定义仪表盘</span>
        </button>
      </div>
    </Layout>
  );
};

export default Dashboard;