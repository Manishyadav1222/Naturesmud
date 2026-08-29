import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { products as allProducts } from '@/lib/data/products';
import type { Product } from '@/types';

interface WishlistState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => boolean; // returns isFavorite after toggle
  isFavorite: (productId: string) => boolean;
  getFavorites: () => Product[];
  clearFavorites: () => void;
}

const WISHLIST_STORAGE_KEY = 'naturesmud_wishlist';

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favoriteIds: ['1', '3', '5'], // Default curated favorites

      toggleFavorite: (productId: string) => {
        const current = get().favoriteIds;
        const exists = current.includes(productId);
        if (exists) {
          set({ favoriteIds: current.filter((id) => id !== productId) });
          return false;
        } else {
          set({ favoriteIds: [...current, productId] });
          return true;
        }
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      getFavorites: () => {
        const ids = get().favoriteIds;
        return allProducts.filter((p) => ids.includes(p.id));
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    }
  )
);
