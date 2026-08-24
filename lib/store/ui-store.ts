import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  searchQuery: string;
  isAccountMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  recentlyViewed: string[];
  quickViewProductId: string | null;
  openSearch: (initialQuery?: string | unknown) => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  openAccountMenu: () => void;
  closeAccountMenu: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  addRecentlyViewed: (productId: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSearchOpen: false,
  searchQuery: '',
  isAccountMenuOpen: false,
  isMobileMenuOpen: false,
  recentlyViewed: [],
  quickViewProductId: null,

  openSearch: (initialQuery?: string | unknown) =>
    set({
      isSearchOpen: true,
      searchQuery: typeof initialQuery === 'string' ? initialQuery : '',
    }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  openAccountMenu: () => set({ isAccountMenuOpen: true }),
  closeAccountMenu: () => set({ isAccountMenuOpen: false }),
  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),

  addRecentlyViewed: (productId) => {
    const { recentlyViewed } = get();
    set({
      recentlyViewed: [productId, ...recentlyViewed.filter((id) => id !== productId)].slice(0, 8),
    });
  },
}));