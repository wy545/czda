import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Trash2, Server, Award, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useArchive, Notification } from '../context/ArchiveContext';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsAsRead, isLoggedIn, loading, refreshNotifications } = useArchive();
  const [activeTab, setActiveTab] = useState('全部');

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // 刷新通知
  useEffect(() => {
    if (isLoggedIn) {
      refreshNotifications();
    }
  }, [isLoggedIn, refreshNotifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === '全部') return notifications;
    if (activeTab === '学业') return notifications.filter(n => ['certificate', 'status', 'milestone'].includes(n.type));
    if (activeTab === '系统') return notifications.filter(n => n.type === 'system');
    if (activeTab === '提醒') return notifications.filter(n => n.type === 'alert');
    return notifications;
  }, [notifications, activeTab]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate': return <Award size={20} />;
      case 'status': return <FileText size={20} />;
      case 'milestone': return <Trophy size={20} />;
      case 'alert': return <Trash2 size={20} />;
      case 'system': return <Server size={20} />;
      default: return <Award size={20} />;
    }
  };

  const getColorClass = (type: Notification['type']) => {
    switch (type) {
      case 'certificate': return 'bg-green-100 text-green-600';
      case 'status': return 'bg-blue-100 text-blue-600';
      case 'milestone': return 'bg-purple-100 text-purple-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'system': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('标记失败:', error);
    }
  };

  const renderGroup = (groupName: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col">
        <h3 className="px-4 pb-2 pt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {groupName === 'today' ? '今天' : groupName === 'yesterday' ? '昨天' : '更早'}
        </h3>
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => navigate(`/messages/${item.id}`)}
            className="relative group cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4 px-4 py-4 items-start">
              {!item.read && (
                <div className="absolute left-2 top-6 w-1.5 h-1.5 rounded-full bg-primary"></div>
              )}
              <div className={`flex items-center justify-center rounded-full shrink-0 h-10 w-10 ${getColorClass(item.type)}`}>
                {getIcon(item.type)}
              </div>
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-base font-semibold leading-tight text-slate-900 truncate">{item.title}</p>
                  <span className="text-xs font-medium text-gray-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            {index < items.length - 1 && (
              <div className="absolute bottom-0 left-[4.5rem] right-0 h-px bg-gray-100"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const todayItems = filteredNotifications.filter(i => i.group === 'today');
  const yesterdayItems = filteredNotifications.filter(i => i.group === 'yesterday');
  const olderItems = filteredNotifications.filter(i => i.group === 'older');

  const tabs = ['全部', '学业', '系统', '提醒'];

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
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold leading-tight tracking-tight">消息中心</h2>
        <button
          onClick={handleMarkAllRead}
          className="text-primary text-sm font-semibold hover:text-blue-600 transition-colors"
        >
          全部已读
        </button>
      </header>

      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar items-center">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex h-8 shrink-0 items-center justify-center px-4 rounded-full transition-all active:scale-95 border ${activeTab === tab
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <span className="text-sm font-medium">{tab}</span>
          </button>
        ))}
      </div>

      <div className="pb-4">
        {renderGroup('today', todayItems)}
        <div className="mt-4">
          {renderGroup('yesterday', yesterdayItems)}
        </div>
        <div className="mt-4">
          {renderGroup('older', olderItems)}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">暂无消息</div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;