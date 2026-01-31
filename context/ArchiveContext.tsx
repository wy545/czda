import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  authApi,
  userApi,
  archiveApi,
  notificationApi,
  isAuthenticated,
  getToken,
  removeToken,
  type UserProfile as ApiUserProfile,
  type ArchiveItem as ApiArchiveItem,
  type Notification as ApiNotification,
} from '../lib/api';

// 前端使用的类型
export interface ArchiveItem {
  id: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  imageUrl: string;
  description?: string;
}

export interface Notification {
  id: string;
  type: 'certificate' | 'status' | 'milestone' | 'system' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'older';
}

export interface UserProfile {
  name: string;
  studentId: string;
  avatar: string;
  grade: string;
  major: string;
  university: string;
}

interface ArchiveContextType {
  // 状态
  items: ArchiveItem[];
  pinnedIds: string[];
  notifications: Notification[];
  user: UserProfile;
  isLoggedIn: boolean;
  loading: boolean;

  // 档案操作
  addItem: (item: Omit<ArchiveItem, 'id' | 'status'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<ArchiveItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  updatePinnedIds: (ids: string[]) => void;
  refreshItems: () => Promise<void>;

  // 通知操作
  markAllNotificationsAsRead: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // 用户操作
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const defaultUser: UserProfile = {
  name: '',
  studentId: '',
  avatar: '',
  grade: '',
  major: '',
  university: '',
};

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

// 转换 API 档案数据为前端格式
function convertArchive(item: ApiArchiveItem): ArchiveItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    organization: item.organization,
    date: item.date,
    status: item.status,
    imageUrl: item.image_url || '',
    description: item.description,
  };
}

// 计算通知时间分组
function getTimeGroup(createdAt?: string): 'today' | 'yesterday' | 'older' {
  if (!createdAt) return 'older';

  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return 'older';
}

// 格式化时间显示
function formatTime(createdAt?: string): string {
  if (!createdAt) return '';

  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays === 1) return '昨天';
  return `${diffDays}天前`;
}

// 转换 API 通知数据为前端格式
function convertNotification(item: ApiNotification): Notification {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    read: item.read,
    time: formatTime(item.created_at),
    group: getTimeGroup(item.created_at),
  };
}

// 转换 API 用户数据为前端格式
function convertUser(profile: ApiUserProfile): UserProfile {
  return {
    name: profile.name || '',
    studentId: profile.student_id || '',
    avatar: profile.avatar || '',
    grade: profile.grade || '',
    major: profile.major || '',
    university: profile.university || '',
  };
}

export const ArchiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 刷新档案列表
  const refreshItems = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await archiveApi.getAll();
      setItems(data.map(convertArchive));
    } catch (error) {
      console.error('获取档案失败:', error);
    }
  }, []);

  // 刷新通知列表
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await notificationApi.getAll();
      setNotifications(data.map(convertNotification));
    } catch (error) {
      console.error('获取通知失败:', error);
    }
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const profile = await userApi.getProfile();
      setUser(convertUser(profile));
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }, []);

  // 初始化检查登录状态
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (isAuthenticated()) {
        try {
          await Promise.all([refreshUser(), refreshItems(), refreshNotifications()]);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('初始化失败:', error);
          removeToken();
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshUser, refreshItems, refreshNotifications]);

  // 登录
  const login = async (phone: string, password: string) => {
    await authApi.login(phone, password);
    setIsLoggedIn(true);
    await Promise.all([refreshUser(), refreshItems(), refreshNotifications()]);
  };

  // 注册
  const register = async (phone: string, password: string, name?: string) => {
    await authApi.register(phone, password, name);
  };

  // 登出
  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setItems([]);
    setNotifications([]);
    setUser(defaultUser);
    setPinnedIds([]);
  };

  // 添加档案
  const addItem = async (item: Omit<ArchiveItem, 'id' | 'status'>) => {
    const created = await archiveApi.create({
      title: item.title,
      category: item.category,
      organization: item.organization,
      date: item.date,
      image_url: item.imageUrl,
      description: item.description,
    });

    setItems(prev => [convertArchive(created), ...prev]);

    // 刷新通知（创建档案会生成通知）
    setTimeout(() => refreshNotifications(), 500);
  };

  // 更新档案
  const updateItem = async (id: string, updates: Partial<ArchiveItem>) => {
    const apiUpdates: Record<string, string | undefined> = {};
    if (updates.title !== undefined) apiUpdates.title = updates.title;
    if (updates.category !== undefined) apiUpdates.category = updates.category;
    if (updates.organization !== undefined) apiUpdates.organization = updates.organization;
    if (updates.date !== undefined) apiUpdates.date = updates.date;
    if (updates.status !== undefined) apiUpdates.status = updates.status;
    if (updates.imageUrl !== undefined) apiUpdates.image_url = updates.imageUrl;
    if (updates.description !== undefined) apiUpdates.description = updates.description;

    const updated = await archiveApi.update(id, apiUpdates);
    setItems(prev => prev.map(item => item.id === id ? convertArchive(updated) : item));
  };

  // 删除档案
  const deleteItem = async (id: string) => {
    await archiveApi.delete(id);
    setItems(prev => prev.filter(item => item.id !== id));
    setPinnedIds(prev => prev.filter(pid => pid !== id));

    // 刷新通知
    setTimeout(() => refreshNotifications(), 500);
  };

  // 更新置顶 ID
  const updatePinnedIds = (ids: string[]) => {
    setPinnedIds(ids);
  };

  // 标记所有通知已读
  const markAllNotificationsAsRead = async () => {
    await notificationApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 标记单个通知已读
  const markNotificationAsRead = async (id: string) => {
    await notificationApi.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // 更新用户信息
  const updateUser = async (updates: Partial<UserProfile>) => {
    const apiUpdates: Record<string, string | undefined> = {};
    if (updates.name !== undefined) apiUpdates.name = updates.name;
    if (updates.studentId !== undefined) apiUpdates.student_id = updates.studentId;
    if (updates.avatar !== undefined) apiUpdates.avatar = updates.avatar;
    if (updates.grade !== undefined) apiUpdates.grade = updates.grade;
    if (updates.major !== undefined) apiUpdates.major = updates.major;
    if (updates.university !== undefined) apiUpdates.university = updates.university;

    const updated = await userApi.updateProfile(apiUpdates);
    setUser(convertUser(updated));
  };

  // 注销账号
  const deleteAccount = async () => {
    await authApi.deleteAccount();
    logout();
  };

  return (
    <ArchiveContext.Provider value={{
      items,
      pinnedIds,
      notifications,
      user,
      isLoggedIn,
      loading,
      addItem,
      updateItem,
      deleteItem,
      updatePinnedIds,
      refreshItems,
      markAllNotificationsAsRead,
      markNotificationAsRead,
      refreshNotifications,
      updateUser,
      deleteAccount,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};