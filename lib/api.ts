/**
 * API 服务层 - 封装与后端的通信
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Token 管理
const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

export const setUserId = (userId: string): void => {
  localStorage.setItem(USER_ID_KEY, userId);
};

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: '请求失败' }));
    throw new Error(error.detail || '请求失败');
  }
  
  return response.json();
}

// ============ 认证 API ============

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export const authApi = {
  /**
   * 用户注册
   */
  register: async (phone: string, password: string, name?: string): Promise<RegisterResponse> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password, name }),
    });
  },
  
  /**
   * 用户登录
   */
  login: async (phone: string, password: string): Promise<LoginResponse> => {
    const result = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    
    // 保存 token 和用户 ID
    setToken(result.access_token);
    setUserId(result.user_id);
    
    return result;
  },
  
  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },
  
  /**
   * 获取当前用户
   */
  getCurrentUser: async () => {
    return request('/auth/me');
  },
  
  /**
   * 注销账号
   */
  deleteAccount: async (): Promise<void> => {
    await request('/auth/account', { method: 'DELETE' });
    removeToken();
  },
};

// ============ 用户 API ============

export interface UserProfile {
  id: string;
  name: string;
  student_id: string;
  avatar: string;
  grade: string;
  major: string;
  university: string;
  phone?: string;
}

export interface UserProfileUpdate {
  name?: string;
  student_id?: string;
  avatar?: string;
  grade?: string;
  major?: string;
  university?: string;
}

export const userApi = {
  /**
   * 获取用户资料
   */
  getProfile: async (): Promise<UserProfile> => {
    return request('/users/profile');
  },
  
  /**
   * 更新用户资料
   */
  updateProfile: async (updates: UserProfileUpdate): Promise<UserProfile> => {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ============ 档案 API ============

export interface ArchiveItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  image_url: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArchiveCreate {
  title: string;
  category: string;
  organization?: string;
  date?: string;
  image_url?: string;
  description?: string;
}

export interface ArchiveUpdate {
  title?: string;
  category?: string;
  organization?: string;
  date?: string;
  status?: 'approved' | 'pending' | 'rejected';
  image_url?: string;
  description?: string;
}

export const archiveApi = {
  /**
   * 获取档案列表
   */
  getAll: async (category?: string): Promise<ArchiveItem[]> => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/archives${params}`);
  },
  
  /**
   * 获取档案详情
   */
  getById: async (id: string): Promise<ArchiveItem> => {
    return request(`/archives/${id}`);
  },
  
  /**
   * 创建档案
   */
  create: async (data: ArchiveCreate): Promise<ArchiveItem> => {
    return request('/archives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * 更新档案
   */
  update: async (id: string, updates: ArchiveUpdate): Promise<ArchiveItem> => {
    return request(`/archives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  /**
   * 删除档案
   */
  delete: async (id: string): Promise<void> => {
    await request(`/archives/${id}`, { method: 'DELETE' });
  },
};

// ============ 通知 API ============

export interface Notification {
  id: string;
  user_id: string;
  type: 'certificate' | 'status' | 'milestone' | 'system' | 'alert';
  title: string;
  description: string;
  read: boolean;
  created_at?: string;
}

export const notificationApi = {
  /**
   * 获取通知列表
   */
  getAll: async (): Promise<Notification[]> => {
    return request('/notifications');
  },
  
  /**
   * 标记通知已读
   */
  markRead: async (id: string): Promise<void> => {
    await request(`/notifications/${id}/read`, { method: 'PUT' });
  },
  
  /**
   * 标记所有通知已读
   */
  markAllRead: async (): Promise<void> => {
    await request('/notifications/read-all', { method: 'PUT' });
  },
};

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
