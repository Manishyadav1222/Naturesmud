import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Online/Offline
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Modals
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Bottom Sheets
  bottomSheets: Record<string, boolean>;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: (id: string) => void;

  // Toasts/Notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
  }>;
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  // Tutorial steps
  seenTutorials: string[];
  markTutorialSeen: (id: string) => void;
  hasSeenTutorial: (id: string) => boolean;

  // App state
  isAppActive: boolean;
  setIsAppActive: (active: boolean) => void;

  // Feature flags
  features: Record<string, boolean>;
  setFeature: (key: string, enabled: boolean) => void;
}

const UI_STORAGE_KEY = 'naturesmud_ui';

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Online/Offline
      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),

      // Modals
      modals: {},
      openModal: (id) => set((state) => ({ modals: { ...state.modals, [id]: true } })),
      closeModal: (id) => set((state) => ({ modals: { ...state.modals, [id]: false } })),
      closeAllModals: () => set({ modals: {} }),

      // Bottom Sheets
      bottomSheets: {},
      openBottomSheet: (id) => set((state) => ({ bottomSheets: { ...state.bottomSheets, [id]: true } })),
      closeBottomSheet: (id) => set((state) => ({ bottomSheets: { ...state.bottomSheets, [id]: false } })),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto-remove after duration
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration || 4000);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Onboarding
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

      // Tutorials
      seenTutorials: [],
      markTutorialSeen: (id) =>
        set((state) => ({
          seenTutorials: [...new Set([...state.seenTutorials, id])],
        })),
      hasSeenTutorial: (id) => get().seenTutorials.includes(id),

      // App state
      isAppActive: true,
      setIsAppActive: (isAppActive) => set({ isAppActive }),

      // Feature flags
      features: {
        reviews: true,
        reels: true,
        loyalty: true,
        referrals: true,
        subscriptions: true,
        chat: false,
        ar: false,
      },
      setFeature: (key, enabled) =>
        set((state) => ({
          features: { ...state.features, [key]: enabled },
        })),
    }),
    {
      name: UI_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        recentSearches: state.recentSearches,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        seenTutorials: state.seenTutorials,
        features: state.features,
      }),
    }
  )
);

// Helper hook for toasts
export function useToast() {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);
  return { addToast, removeToast };
}

// Toast convenience functions
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