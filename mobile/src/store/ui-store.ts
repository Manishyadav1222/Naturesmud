import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  isRead?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'system' | 'health';
  isRead: boolean;
  actionUrl?: string;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const UI_STORAGE_KEY = 'naturesmud_ui';

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Order Out For Delivery 🚚',
    message: 'Your order NM-98241 with Pure Himalayan Shilajit is out for delivery with our rider in Kathmandu.',
    time: '20m ago',
    type: 'order',
    isRead: false,
    actionUrl: '/track-order',
  },
  {
    id: 'notif_2',
    title: '🌿 5% Off Weekend Harvest Deal',
    message: 'Use code STORE5 on checkout to get 5% off pure Himalayan Superfoods!',
    time: '2h ago',
    type: 'promo',
    isRead: false,
    actionUrl: '/products',
  },
  {
    id: 'notif_3',
    title: 'Health Tip: Morning Shilajit Ritual ☀️',
    message: 'Dissolve a pea-sized portion of Nature’s Mud Shilajit resin in lukewarm water or milk every morning.',
    time: '1d ago',
    type: 'health',
    isRead: true,
    actionUrl: '/health-benefits',
  },
];

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),

      toasts: [],
      addToast: (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const newToast: ToastItem = { ...toast, id, isRead: false };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration || 3500);
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      notifications: SAMPLE_NOTIFICATIONS,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      recentSearches: ['Shilajit Resin', 'Raw Cliff Honey', 'A2 Desi Cow Ghee', 'Herbal Tea', 'Chyawanprash'],
      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 10),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: UI_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        recentSearches: state.recentSearches,
        notifications: state.notifications,
      }),
    }
  )
);

export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
};