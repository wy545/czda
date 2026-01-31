import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, MessageCircle, User } from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useArchive();

  const isActive = (path: string) => location.pathname === path;
  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="mx-auto max-w-md w-full relative min-h-screen flex flex-col bg-background-light pb-20">
      <main className="flex-1 flex flex-col">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 pb-safe mx-auto max-w-md">
        <div className="grid grid-cols-4 h-16">
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center transition-colors group ${isActive('/') ? 'text-primary' : 'text-text-secondary hover:text-slate-900'}`}
          >
            <Home className={`mb-1 w-6 h-6 transition-transform ${isActive('/') ? 'fill-current' : 'group-hover:scale-110'}`} />
            <span className={`text-[10px] ${isActive('/') ? 'font-bold' : 'font-medium'}`}>首页</span>
          </button>

          <button 
            onClick={() => navigate('/archive')}
            className={`flex flex-col items-center justify-center transition-colors group ${isActive('/archive') ? 'text-primary' : 'text-text-secondary hover:text-slate-900'}`}
          >
            <FolderOpen className={`mb-1 w-6 h-6 transition-transform ${isActive('/archive') ? 'fill-current' : 'group-hover:scale-110'}`} />
            <span className={`text-[10px] ${isActive('/archive') ? 'font-bold' : 'font-medium'}`}>档案</span>
          </button>

          <button 
            onClick={() => navigate('/messages')}
            className={`flex flex-col items-center justify-center transition-colors group ${isActive('/messages') ? 'text-primary' : 'text-text-secondary hover:text-slate-900'}`}
          >
            <div className="relative">
              <MessageCircle className={`mb-1 w-6 h-6 transition-transform ${isActive('/messages') ? 'fill-current' : 'group-hover:scale-110'}`} />
              {hasUnread && (
                <span className="absolute top-0 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </div>
            <span className={`text-[10px] ${isActive('/messages') ? 'font-bold' : 'font-medium'}`}>消息</span>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center justify-center transition-colors group ${isActive('/profile') ? 'text-primary' : 'text-text-secondary hover:text-slate-900'}`}
          >
            <User className={`mb-1 w-6 h-6 transition-transform ${isActive('/profile') ? 'fill-current' : 'group-hover:scale-110'}`} />
            <span className={`text-[10px] ${isActive('/profile') ? 'font-bold' : 'font-medium'}`}>个人</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;