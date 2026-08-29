import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (data: Partial<User>) => void;
  loginWithDemo: (type: 'customer' | 'wholesale') => void;
  getStoredToken: () => Promise<string | null>;
}

const AUTH_STORAGE_KEY = 'naturesmud_auth';

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    }
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(name, value);
      } catch {}
      return;
    }
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {}
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(name);
      } catch {}
      return;
    }
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {}
  },
};

const DEMO_USERS: Record<'customer' | 'wholesale', User> = {
  customer: {
    id: 'usr_demo_01',
    name: 'Aarav Sharma',
    email: 'aarav@naturesmud.com',
    phone: '+977 9841234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'customer',
    isVerified: true,
    loyaltyPoints: 340,
    referralCode: 'AARAV2026',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  wholesale: {
    id: 'usr_demo_02',
    name: 'Himalayan Organic Mart',
    email: 'partner@himalayanmart.np',
    phone: '+977 9801987654',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'wholesale',
    isVerified: true,
    loyaltyPoints: 1250,
    referralCode: 'HIMALAYA100',
    createdAt: '2024-11-20T10:30:00.000Z',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        secureStorage.setItem('access_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: async () => {
        await secureStorage.removeItem('access_token');
        await secureStorage.removeItem('refresh_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      loginWithDemo: (type) => {
        const demoUser = DEMO_USERS[type];
        const demoToken = `demo_jwt_token_${type}_${Date.now()}`;
        get().setAuth(demoUser, demoToken);
      },

      getStoredToken: async () => {
        return secureStorage.getItem('access_token');
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);