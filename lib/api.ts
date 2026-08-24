import axios from 'axios';
import type { Reel } from '@/lib/types';

const isServer = typeof window === 'undefined';
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

if (isServer && process.env.INTERNAL_API_URL) {
  API_URL = process.env.INTERNAL_API_URL;
} else if (!isServer) {
  const host = window.location.hostname;
  if (host === '127.0.0.1' && API_URL.includes('localhost')) {
    API_URL = API_URL.replace('localhost', '127.0.0.1');
  } else if (host === 'localhost' && API_URL.includes('127.0.0.1')) {
    API_URL = API_URL.replace('127.0.0.1', 'localhost');
  }
}

const cleanBaseUrl = API_URL.replace(/\/v1\/?$/, '').replace(/\/+$/, '');

export const api = axios.create({
  baseURL: `${cleanBaseUrl}/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Clean up endpoint paths to prevent double /v1/v1/ and attach token
api.interceptors.request.use((config) => {
  if (config.url) {
    config.url = config.url.replace(/^\/?v1\//, '/');
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('naturesmud_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('naturesmud_token');
      localStorage.removeItem('naturesmud_user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    }
    return Promise.reject(error);
  }
);

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  avatar?: string | null;
  role?: string;
  isVerified?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const reelsApi = {
  async getReels(): Promise<Reel[]> {
    const { data } = await api.get<{ data: Reel[] }>('/reels');
    return data.data;
  },
};

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/login', { email, password });
    return data;
  },

  async register(name: string, email: string, phone: string, password: string, password_confirmation: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/register', {
      name,
      email,
      phone,
      password,
      password_confirmation,
    });
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/me');
    return data;
  },
};

// Token management utilities (for SPA mode)
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('naturesmud_token');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('naturesmud_token', token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('naturesmud_token');
    localStorage.removeItem('naturesmud_user');
  },

  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('naturesmud_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('naturesmud_user', JSON.stringify(user));
  },

  clear: (): void => {
    tokenStorage.removeToken();
  },
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = (): boolean => {
  return !!tokenStorage.getToken();
};
