import axios from 'axios';
import type { Reel } from '@/lib/types';

export function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('naturesmud.shop') || host.includes('naturesmud.com')) {
      return 'https://api.naturesmud.shop/api';
    }
    if (host === '127.0.0.1' || host === 'localhost') {
      return 'http://localhost:8000/api';
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return `${window.location.origin}/api`;
  }
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
}

const API_URL = getBaseApiUrl();
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
  config.baseURL = `${getBaseApiUrl().replace(/\/v1\/?$/, '').replace(/\/+$/, '')}/v1`;
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

// Handle 401 responses safely without disrupting guest shoppers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('naturesmud_token');
      localStorage.removeItem('naturesmud_user');

      // Only redirect if user was explicitly on an authenticated page (e.g. /account, /dashboard)
      const currentPath = window.location.pathname;
      const isProtectedPath = currentPath.startsWith('/account') || currentPath.startsWith('/dashboard');
      if (isProtectedPath && !currentPath.includes('/login')) {
        window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
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
