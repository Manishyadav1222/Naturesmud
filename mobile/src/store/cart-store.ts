import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  weight: string;
  category: string;
  quantity: number;
  product?: any;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  syncWithServer: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ discount: number } | null>;
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscount: number;
}

const CART_STORAGE_KEY = 'naturesmud_cart';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        return item?.quantity || 0;
      },

      syncWithServer: async () => {
        // TODO: Implement server sync when user logs in
        // This would merge local cart with server cart
      },

      applyCoupon: async (code) => {
        // TODO: Call API to validate coupon
        // For now, mock implementation
        if (code === 'WELCOME10') {
          set({ couponCode: 'WELCOME10', couponDiscount: get().getSubtotal() * 0.1 });
          return { discount: get().getSubtotal() * 0.1 };
        }
        if (code === 'HIMALAYA20') {
          set({ couponCode: 'HIMALAYA20', couponDiscount: get().getSubtotal() * 0.2 });
          return { discount: get().getSubtotal() * 0.2 };
        }
        return null;
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);