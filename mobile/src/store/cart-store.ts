import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  weight: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getShippingCost: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercent?: number };
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscountPercent: number;
}

const CART_STORAGE_KEY = 'naturesmud_cart';
export const FREE_SHIPPING_THRESHOLD = 3000;
export const STANDARD_SHIPPING_FEE = 150;

const VALID_COUPONS: Record<string, number> = {
  STORE5: 5,
  WELCOME5: 5,
  FESTIVAL5: 5,
  ORGANIC5: 5,
  WELCOME10: 5,
  NATURES15: 5,
  HIMALAYA20: 5,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscountPercent: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
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
        set({ items: [], couponCode: null, couponDiscountPercent: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const percent = get().couponDiscountPercent;
        if (percent <= 0) return 0;
        return Math.round((subtotal * percent) / 100);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal + shipping - discount);
      },

      isInCart: (productId) => {
        return get().items.some((i) => i.id === productId);
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        return item?.quantity || 0;
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (VALID_COUPONS[cleanCode]) {
          const discountPercent = VALID_COUPONS[cleanCode];
          set({ couponCode: cleanCode, couponDiscountPercent: discountPercent });
          return {
            success: true,
            message: `Coupon '${cleanCode}' applied! You saved ${discountPercent}%.`,
            discountPercent,
          };
        }
        return {
          success: false,
          message: 'Invalid promo code. Try WELCOME10 or HIMALAYA20.',
        };
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscountPercent: 0 });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscountPercent: state.couponDiscountPercent,
      }),
    }
  )
);