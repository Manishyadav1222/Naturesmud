import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartProductSnapshot, Product } from '@/lib/types';
import { getProductById, getProductBySlug } from '@/lib/data/products';
import { initialFestivalOffers } from '@/lib/data/offers';
import { trackEcommerceEvent } from '@/lib/analytics';

export interface ResolvedCartProduct {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  weight?: string;
  category?: string;
  stock?: number;
}

function findOfferByIdOrSlug(idOrSlug: string) {
  const key = String(idOrSlug || '').trim();
  if (!key) return undefined;
  return initialFestivalOffers.find((o) => o.id === key);
}

export function resolveCartProduct(item: CartItem): ResolvedCartProduct {
  const rawSlug = String(item.product?.slug || item.productId || '');
  const rawId = String(item.product?.id || item.productId || '');

  // 1. Check if item is an official Combo / Festival Bundle
  const matchedOffer = findOfferByIdOrSlug(rawId) || findOfferByIdOrSlug(rawSlug);
  if (matchedOffer) {
    const isFestival = Boolean(matchedOffer.isFestival);
    return {
      id: matchedOffer.id,
      slug: matchedOffer.id,
      name: matchedOffer.title,
      price: matchedOffer.offerPrice,
      compareAtPrice: matchedOffer.originalPrice,
      image: matchedOffer.items[0]?.image || '/products/superfood-mix.jpg',
      weight: isFestival ? 'Festival Gift Bundle' : '3-Product Combo Box',
      category: isFestival ? 'Festival Combos' : 'Specialized Combos',
      stock: 99,
    };
  }

  // 2. Check canonical product catalog (enforces authoritative price & stock, preventing stale localStorage prices)
  const found =
    getProductBySlug(rawSlug) ||
    getProductById(rawId) ||
    getProductById(item.productId);

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
      stock: typeof found.stock === 'number' ? found.stock : 99,
    };
  }

  // 3. Fallback to dynamic snapshot if custom/admin-only item
  let snapPrice = 0;
  if (item.product && typeof item.product.price !== 'undefined') {
    snapPrice =
      typeof item.product.price === 'number'
        ? item.product.price
        : parseFloat(String(item.product.price) || '0');
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
      image:
        item.product.image ||
        (Array.isArray(item.product.images)
          ? item.product.images[0]
          : '/products/sweet-potato-powder.jpg'),
      weight: cleanWeight,
      category:
        typeof item.product.category === 'object'
          ? item.product.category?.name
          : item.product.category || 'Organic',
      stock: 99,
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
    stock: 0,
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
        const safeQty = Math.max(1, Math.floor(Number(quantity) || 1));
        const { items } = get();
        let productId: string;
        let productSnapshot: CartProductSnapshot | undefined;
        let maxStock = 99;

        if (typeof productOrId === 'object' && productOrId !== null) {
          const rawId = String(productOrId.id || '');
          const rawSlug = String(productOrId.slug || rawId || '');
          const matchedOffer = findOfferByIdOrSlug(rawId) || findOfferByIdOrSlug(rawSlug);
          const found = !matchedOffer
            ? getProductBySlug(rawSlug) || getProductById(rawId)
            : undefined;

          if (found && (found.inStock === false || (typeof found.stock === 'number' && found.stock <= 0))) {
            return;
          }
          if (found && typeof found.stock === 'number' && found.stock > 0) {
            maxStock = Math.min(99, found.stock);
          }

          productId = matchedOffer
            ? matchedOffer.id
            : found
              ? found.slug
              : rawSlug || rawId;

          const rawPrice =
            typeof productOrId.price === 'number'
              ? productOrId.price
              : parseFloat(productOrId.price || '0');
          const canonicalPrice = matchedOffer
            ? matchedOffer.offerPrice
            : found
              ? found.price
              : !isNaN(rawPrice) && rawPrice > 0
                ? rawPrice
                : 0;
          const canonicalWeight = productOrId.weight
            ? String(productOrId.weight)
            : found
              ? found.weight
              : '100 GM';

          productSnapshot = {
            id: String(matchedOffer?.id || found?.id || productOrId.id || productId),
            slug: matchedOffer?.id || found?.slug || productOrId.slug || productId,
            name: matchedOffer?.title || found?.name || productOrId.name || 'Organic Product',
            price: canonicalPrice,
            compareAtPrice:
              matchedOffer?.originalPrice ?? found?.compareAtPrice ?? productOrId.compareAtPrice,
            image:
              productOrId.image ||
              (Array.isArray(productOrId.images) ? productOrId.images[0] : found?.image) ||
              '/products/cranberries.jpg',
            weight: canonicalWeight,
            category:
              typeof productOrId.category === 'object'
                ? productOrId.category?.name
                : productOrId.category || found?.category || 'Organic',
          };
        } else {
          const rawKey = String(productOrId);
          const matchedOffer = findOfferByIdOrSlug(rawKey);
          const found = !matchedOffer
            ? getProductBySlug(rawKey) || getProductById(rawKey)
            : undefined;

          if (found && (found.inStock === false || (typeof found.stock === 'number' && found.stock <= 0))) {
            return;
          }
          if (found && typeof found.stock === 'number' && found.stock > 0) {
            maxStock = Math.min(99, found.stock);
          }

          productId = matchedOffer ? matchedOffer.id : found ? found.slug : rawKey;

          if (matchedOffer) {
            productSnapshot = {
              id: matchedOffer.id,
              slug: matchedOffer.id,
              name: matchedOffer.title,
              price: matchedOffer.offerPrice,
              compareAtPrice: matchedOffer.originalPrice,
              image: matchedOffer.items[0]?.image || '/products/superfood-mix.jpg',
              weight: 'Combo Bundle',
              category: 'Specialized Combos',
            };
          } else if (found) {
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
          (item) =>
            item.productId === productId ||
            (item.product && item.product.slug === productId)
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(updated[existingIndex].quantity + safeQty, maxStock),
            product: productSnapshot || updated[existingIndex].product,
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                productId,
                quantity: Math.min(safeQty, maxStock),
                product: productSnapshot,
              },
            ],
          });
        }
        if (productSnapshot) {
          trackEcommerceEvent('add_to_cart', {
            value: (Number(productSnapshot.price) || 0) * safeQty,
            items: [
              {
                item_id: String(productSnapshot.slug || productId),
                item_name: productSnapshot.name,
                item_category: String(productSnapshot.category || 'Organic'),
                price: Number(productSnapshot.price) || 0,
                quantity: safeQty,
              },
            ],
          });
        }
        set({ isDrawerOpen: true });
      },

      removeItem: (productId) => {
        const target = get().items.find(
          (item) =>
            item.productId === productId ||
            item.product?.slug === productId ||
            item.product?.id === productId
        );
        if (target) {
          const resolved = resolveCartProduct(target);
          trackEcommerceEvent('remove_from_cart', {
            value: resolved.price * target.quantity,
            items: [
              {
                item_id: resolved.slug,
                item_name: resolved.name,
                item_category: resolved.category,
                price: resolved.price,
                quantity: target.quantity,
              },
            ],
          });
        }
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
        const cleanQty = Math.floor(Number(quantity) || 0);
        if (cleanQty <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) => {
            if (
              item.productId === productId ||
              item.product?.slug === productId ||
              item.product?.id === productId
            ) {
              const resolved = resolveCartProduct(item);
              const maxAllowed = Math.min(99, resolved.stock && resolved.stock > 0 ? resolved.stock : 99);
              return { ...item, quantity: Math.min(cleanQty, maxAllowed) };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [], isDrawerOpen: false }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const product = resolveCartProduct(item);
          const itemPrice =
            typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0;
          const qty =
            typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0
              ? item.quantity
              : 1;
          return total + itemPrice * qty;
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