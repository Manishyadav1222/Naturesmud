// ============================================================
// Admin Auth Context & Store
// ============================================================

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenStore, logoutRequest } from './api-client';
import type { AdminUser, ApiResponse } from './types';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: AdminUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<AdminUser>>('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
      tokenStore.clearTokens();
    }
  }, []);

  useEffect(() => {
    const hasToken = tokenStore.getAccessToken();
    if (!hasToken) {
      setIsLoading(false);
      return;
    }

    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback((userData: AdminUser) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (err) {
      console.warn('Logout request failed, clearing local session anyway:', err);
    } finally {
      tokenStore.clearTokens();
      setUser(null);
      router.replace('/admin/login');
    }
  }, [router]);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;

      // API returns role as a string, e.g. "SUPER_ADMIN", and permissions as a flat array
      if (typeof user.role === 'string') {
        if (user.role === 'SUPER_ADMIN') return true;
        const perms = (user as unknown as { permissions?: string[] }).permissions;
        return Array.isArray(perms) && perms.includes(permission);
      }

      // Typed shape with role as an object containing nested permissions
      if (user.role.name === 'SUPER_ADMIN') return true;
      return user.role.permissions.some((p) => p.key === permission);
    },
    [user]
  );

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user) return false;

      // API returns role as a string
      if (typeof user.role === 'string') {
        return roles.includes(user.role);
      }

      return roles.includes(user.role.name);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}

// ---------- Permission keys ----------
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'dashboard.view',
  MANAGE_ORDERS: 'orders.manage',
  VIEW_ORDERS: 'orders.view',
  MANAGE_PRODUCTS: 'products.manage',
  VIEW_PRODUCTS: 'products.view',
  MANAGE_CATEGORIES: 'categories.manage',
  MANAGE_INVENTORY: 'inventory.manage',
  MANAGE_SUPPLIERS: 'suppliers.manage',
  MANAGE_CUSTOMERS: 'customers.manage',
  MANAGE_REVIEWS: 'reviews.manage',
  MANAGE_COUPONS: 'coupons.manage',
  MANAGE_CAMPAIGNS: 'campaigns.manage',
  MANAGE_SOCIAL: 'social.manage',
  MANAGE_BLOG: 'blog.manage',
  MANAGE_RECIPES: 'recipes.manage',
  MANAGE_MEDIA: 'media.manage',
  MANAGE_PAGES: 'pages.manage',
  MANAGE_BANNERS: 'banners.manage',
  MANAGE_USERS: 'users.manage',
  MANAGE_ROLES: 'roles.manage',
  MANAGE_SETTINGS: 'settings.manage',
  MANAGE_NOTIFICATIONS: 'notifications.manage',
  VIEW_ANALYTICS: 'analytics.view',
  VIEW_REPORTS: 'reports.view',
  MANAGE_MESSAGES: 'messages.manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];