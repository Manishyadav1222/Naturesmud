import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartProductSnapshot, Product } from '@/lib/types';
import { getProductById, getProductBySlug } from '@/lib/data/products';

export interface ResolvedCartProduct {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  weight?: string;
  category?: string;
}

export function resolveCartProduct(item: CartItem): ResolvedCartProduct {
  let snapPrice = 0;
  if (item.product && typeof item.product.price !== 'undefined') {
    snapPrice = typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price) || '0');
  }

  if (item.product && item.product.name && snapPrice > 0) {
    return {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: snapPrice,
      compareAtPrice: item.product.compareAtPrice,
      image: item.product.image || '/products/sweet-potato-powder.jpg',
      weight: item.product.weight || '100g',
      category: item.product.category || 'Organic',
    };
  }

  const found = getProductById(item.productId) || getProductBySlug(item.productId);
  if (found) {
    const catalogPrice = typeof found.price === 'number' ? found.price : parseFloat(String(found.price) || '0');
    return {
      id: found.id,
      slug: found.slug,
      name: found.name,
      price: catalogPrice,
      compareAtPrice: found.compareAtPrice,
      image: found.image || (Array.isArray(found.images) ? found.images[0] : '/products/sweet-potato-powder.jpg'),
      weight: found.weight || '100g',
      category: found.category || 'Organic',
    };
  }

  return {
    id: item.productId,
    slug: item.productId,
    name: 'Pure Himalayan Product',
    price: 0,
    image: '/products/sweet-potato-powder.jpg',
    weight: '100g',
    category: 'Organic',
  };
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (productOrId: string | Product | any, quantity?: number, snapshot?: CartProductSnapshot) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (productOrId, quantity = 1, snapshot) => {
        const { items } = get();
        let productId: string;
        let productSnapshot: CartProductSnapshot | undefined;

        if (typeof productOrId === 'object' && productOrId !== null) {
          productId = String(productOrId.slug || productOrId.id);
          const rawPrice = typeof productOrId.price === 'number' ? productOrId.price : parseFloat(productOrId.price || '0');
          const rawCompare = productOrId.compareAtPrice ? (typeof productOrId.compareAtPrice === 'number' ? productOrId.compareAtPrice : parseFloat(productOrId.compareAtPrice)) : undefined;
          
          productSnapshot = {
            id: String(productOrId.id || productOrId.slug),
            slug: productOrId.slug || String(productOrId.id),
            name: productOrId.name || 'Organic Product',
            price: isNaN(rawPrice) ? 0 : rawPrice,
            compareAtPrice: rawCompare,
            image: productOrId.image || (Array.isArray(productOrId.images) ? productOrId.images[0] : '/products/cranberries.jpg'),
            weight: productOrId.weight || '',
            category: typeof productOrId.category === 'object' ? productOrId.category?.name : (productOrId.category || 'Organic'),
          };
        } else {
          productId = String(productOrId);
          if (snapshot) {
            productSnapshot = snapshot;
          } else {
            const found = getProductById(productId) || getProductBySlug(productId);
            if (found) {
              productSnapshot = {
                id: found.id,
                slug: found.slug,
                name: found.name,
                price: found.price,
                compareAtPrice: found.compareAtPrice,
                image: found.image,
                weight: found.weight,
                category: found.category,
              };
            }
          }
        }

        const existingIndex = items.findIndex(
          (item) => item.productId === productId || (item.product && item.product.slug === productId)
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(updated[existingIndex].quantity + quantity, 99),
            product: productSnapshot || updated[existingIndex].product,
          };
          set({ items: updated });
        } else {
          set({
            items: [...items, { productId, quantity, product: productSnapshot }],
          });
        }
        set({ isDrawerOpen: true });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(
            (item) => item.productId !== productId && item.product?.slug !== productId
          ),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId || item.product?.slug === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const product = resolveCartProduct(item);
          const itemPrice = typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0;
          const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 1;
          return total + (itemPrice * qty);
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    { name: 'nm-cart' }
  )
);

export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 150;