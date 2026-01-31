import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Award, FileText, Trophy, Trash2, Server, Loader2 } from 'lucide-react';
import { useArchive, Notification } from '../context/ArchiveContext';

const MessageDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, isLoggedIn, loading } = useArchive();

  const notification = notifications.find(n => n.id === id);

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  useEffect(() => {
    if (id && notification && !notification.read) {
      markNotificationAsRead(id);
    }
  }, [id, notification, markNotificationAsRead]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-500 mb-4">消息未找到</p>
        <button onClick={() => navigate('/messages')} className="text-primary font-bold">返回消息列表</button>
      </div>
    );
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate': return <Award size={24} />;
      case 'status': return <FileText size={24} />;
      case 'milestone': return <Trophy size={24} />;
      case 'alert': return <Trash2 size={24} />;
      case 'system': return <Server size={24} />;
      default: return <Award size={24} />;
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

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 -ml-2 p-2 rounded-full hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={24} />
          <span className="text-sm font-medium">返回</span>
        </button>
        <h1 className="text-base font-bold text-slate-900">消息详情</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`flex items-center justify-center rounded-2xl shrink-0 w-14 h-14 ${getColorClass(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 pt-1">
            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{notification.title}</h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Clock size={14} />
              <span>{notification.time}</span>
              {notification.group === 'today' && <span>(今天)</span>}
              {notification.group === 'yesterday' && <span>(昨天)</span>}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-6"></div>

        <div className="text-slate-600 leading-relaxed text-base space-y-4">
          <p>{notification.description}</p>

          {/* Example of extra content based on type, just for visualization */}
          {notification.type === 'status' && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4">
              <p className="text-sm font-bold text-slate-700 mb-2">当前进度</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="h-1 bg-blue-500 w-12 rounded-full"></div>
                <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                <div className="h-1 bg-slate-200 w-12 rounded-full"></div>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">预计3个工作日内完成审核</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessageDetail;