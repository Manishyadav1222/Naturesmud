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
  // 1. Prioritize live dynamic product snapshot (from live API / DB)
  let snapPrice = 0;
  if (item.product && typeof item.product.price !== 'undefined') {
    snapPrice = typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price) || '0');
  }

  if (item.product && item.product.name && snapPrice > 0) {
    const rawWeight = item.product.weight;
    let cleanWeight = '100 GM';
    if (rawWeight && !/^\d+(\.00)?$/.test(String(rawWeight).trim())) {
      cleanWeight = String(rawWeight);
    } else if (rawWeight) {
      cleanWeight = `${parseFloat(String(rawWeight))} GM`;
    }

    return {
      id: item.product.id || item.productId,
      slug: item.product.slug || item.productId,
      name: item.product.name,
      price: snapPrice,
      compareAtPrice: item.product.compareAtPrice,
      image: item.product.image || (Array.isArray(item.product.images) ? item.product.images[0] : '/products/sweet-potato-powder.jpg'),
      weight: cleanWeight,
      category: typeof item.product.category === 'object' ? item.product.category?.name : (item.product.category || 'Organic'),
    };
  }

  // 2. Fall back to static catalog if snapshot is missing
  const slug = item.product?.slug || item.productId;
  const found =
    getProductBySlug(slug) ||
    getProductById(item.productId) ||
    (item.product?.id ? getProductById(String(item.product.id)) : undefined);

  if (found) {
    return {
      id: found.id,
      slug: found.slug,
      name: found.name,
      price: typeof found.price === 'number' ? found.price : parseFloat(String(found.price) || '0'),
      compareAtPrice: found.compareAtPrice,
      image: found.image || '/products/sweet-potato-powder.jpg',
      weight: found.weight || '100 GM',
      category: found.category || 'Organic',
    };
  }

  return {
    id: item.productId,
    slug: item.productId,
    name: 'Pure Himalayan Product',
    price: 0,
    image: '/products/sweet-potato-powder.jpg',
    weight: '100 GM',
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
          const rawSlugOrId = String(productOrId.slug || productOrId.id || '');
          const found = getProductBySlug(rawSlugOrId) || getProductById(rawSlugOrId);
          productId = rawSlugOrId || (found ? found.slug : '');

          const rawPrice = typeof productOrId.price === 'number' ? productOrId.price : parseFloat(productOrId.price || '0');
          // Prioritize live price if provided, otherwise fallback to catalog
          const canonicalPrice = !isNaN(rawPrice) && rawPrice > 0 ? rawPrice : (found ? found.price : 0);
          const canonicalWeight = productOrId.weight ? String(productOrId.weight) : (found ? found.weight : '100 GM');

          productSnapshot = {
            id: String(productOrId.id || found?.id || productId),
            slug: productOrId.slug || found?.slug || productId,
            name: productOrId.name || found?.name || 'Organic Product',
            price: canonicalPrice,
            compareAtPrice: productOrId.compareAtPrice ?? found?.compareAtPrice,
            image: productOrId.image || (Array.isArray(productOrId.images) ? productOrId.images[0] : found?.image) || '/products/cranberries.jpg',
            weight: canonicalWeight,
            category: typeof productOrId.category === 'object' ? productOrId.category?.name : (productOrId.category || 'Organic'),
          };
        } else {
          productId = String(productOrId);
          const found = getProductBySlug(productId) || getProductById(productId);
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
          } else if (snapshot) {
            productSnapshot = snapshot;
          } else {
            productSnapshot = {
              id: productId,
              slug: productId,
              name: 'Pure Himalayan Product',
              price: 0,
              image: '/products/sweet-potato-powder.jpg',
              weight: '100 GM',
              category: 'Organic',
            };
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
            (item) =>
              item.productId !== productId &&
              item.product?.slug !== productId &&
              item.product?.id !== productId
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
            item.productId === productId ||
            item.product?.slug === productId ||
            item.product?.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [], isDrawerOpen: false }),
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

export const FREE_SHIPPING_THRESHOLD = 3000;
export const SHIPPING_FEE = 150;