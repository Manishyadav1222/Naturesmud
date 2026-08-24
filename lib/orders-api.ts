import { api } from './api';
import { products, getProductById } from '@/lib/data/products';

export interface OrderItemType {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface OrderStatusHistoryType {
  id: number;
  status: string;
  payment_status: string | null;
  note: string | null;
  changed_by: number | null;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: string;
  discount: string;
  shipping_fee: string;
  tax: string;
  total: string;
  coupon_code: string | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_zone: string | null;
  receipt_image?: string | null;
  payment_reference?: string | null;
  is_valley?: boolean;
  notes: string | null;
  created_at: string;
  items: OrderItemType[];
  status_histories?: OrderStatusHistoryType[];
}

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[];
  shipping_name: string;
  shipping_phone: string;
  shipping_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zone?: string;
  payment_method: string;
  receipt_image?: string;
  payment_reference?: string;
  is_valley?: boolean;
  coupon_code?: string;
  gift_note?: string;
  notes?: string;
}

interface BackendProduct { id: number; name: string; slug: string; }

function normalizeSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Local products are frontend-only and may not exist in the backend catalog.
// Use a high offset so local fallback IDs never collide with real backend IDs.
const LOCAL_ID_OFFSET = 10000;

function localProductId(p: { id: string }): number {
  const idx = products.findIndex((x) => x.id === p.id);
  return LOCAL_ID_OFFSET + Math.max(0, idx);
}

function findLocalProductById(id: number) {
  const idx = id - LOCAL_ID_OFFSET;
  return idx >= 0 && idx < products.length ? products[idx] : undefined;
}

const PRODUCT_MAP_CACHE_TTL_MS = 60_000; // 1 minute
const PRODUCTS_PER_PAGE = 100;

let productCache: { bySlug: Map<string, number>; byName: Map<string, number> } | null = null;
let productCacheCreatedAt = 0;
let backendCatalogReachable = false;

/**
 * Drop the cached backend product map so the next lookup refetches it.
 * Call this after the DB catalog changes (e.g. a seeder adds products).
 */
export function invalidateBackendProductCache(): void {
  productCache = null;
  productCacheCreatedAt = 0;
  backendCatalogReachable = false;
}

export async function getBackendProductMap(forceRefresh = false) {
  const now = Date.now();

  // Serve the cached map while it is fresh (TTL-bounded) so we don't hammer
  // the API on every checkout line, but never cache forever: once the DB is
  // re-seeded/changed, the next refresh picks up the new catalog instead of
  // resolving against stale IDs.
  if (!forceRefresh && productCache && now - productCacheCreatedAt < PRODUCT_MAP_CACHE_TTL_MS) {
    return productCache;
  }

  const bySlug = new Map<string, number>();
  const byName = new Map<string, number>();

  // Start with the local catalog as a baseline so every frontend product
  // always resolves to a numeric ID, even if the backend API is unreachable.
  for (const p of products) {
    const id = localProductId(p);
    bySlug.set(normalizeSlug(p.slug || p.name), id);
    byName.set(normalizeSlug(p.name), id);
  }

  // Layer the real backend catalog on top so any product that exists in the
  // database takes precedence and uses its actual database ID. Direct matches
  // will override local fallback IDs; the local fallback remains only as a
  // safe net when the backend is offline or a product is missing. Walk every
  // page so products beyond the first page are not silently left out.
  let reachable = false;
  try {
    let page = 1;
    let lastPage = 1;
    do {
      const { data: body } = await api.get<{ data: BackendProduct[]; last_page?: number }>(
        `/products?per_page=${PRODUCTS_PER_PAGE}&page=${page}`
      );
      for (const p of body.data ?? []) {
        bySlug.set(normalizeSlug(p.slug), p.id);
        byName.set(normalizeSlug(p.name), p.id);
      }
      lastPage = body.last_page ?? 1;
      page += 1;
    } while (page <= lastPage && page <= 20); // safety cap against runaway pagination
    reachable = true;
  } catch {
    // Backend unreachable — keep the local catalog fallback map.
  }

  productCache = { bySlug, byName };
  productCacheCreatedAt = Date.now();
  backendCatalogReachable = reachable;
  return productCache;
}

function tokenize(s: string): Set<string> {
  return new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
}

function similarity(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

export async function resolveBackendProductId(idOrSlug: string | number): Promise<number | null> {
  const raw = String(idOrSlug).trim();

  // If already a positive database integer ID:
  if (/^\d+$/.test(raw)) {
    const num = parseInt(raw, 10);
    if (num > 0 && num < LOCAL_ID_OFFSET) {
      return num;
    }
  }

  // If formatted like p1, p2, p19:
  if (/^p\d+$/i.test(raw)) {
    const local = getProductById(raw);
    if (local?.slug) {
      return resolveBackendProductId(local.slug);
    }
  }

  const { bySlug, byName } = await getBackendProductMap();
  const norm = normalizeSlug(raw);

  // 1) Exact slug or name match (fast path).
  const direct = bySlug.get(norm) ?? byName.get(norm);
  if (direct !== undefined) {
    if (backendCatalogReachable && direct >= LOCAL_ID_OFFSET) return null;
    return direct;
  }

  // 2) Token-overlap fuzzy match. Handles names that differ by extra
  //    words such as "Premium Roasted Almonds" vs "Roasted Almonds".
  let bestId: number | null = null;
  let bestScore = 0;
  for (const [slug, id] of bySlug) {
    const score = similarity(norm, slug);
    if (score > bestScore) { bestScore = score; bestId = id; }
  }
  for (const [name, id] of byName) {
    const score = similarity(norm, name);
    if (score > bestScore) { bestScore = score; bestId = id; }
  }

  if (bestScore < 0.5 || bestId === null) return null;
  if (backendCatalogReachable && bestId >= LOCAL_ID_OFFSET) return null;
  return bestId;
}

export const ordersApi = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    try {
      const res = await api.post('/orders', payload);
      return res.data.order;
    } catch (error: any) {
      // Backend unreachable → create a local demo order so checkout still works.
      if (!error.response) {
        const subtotal = payload.items.reduce((sum, item) => {
          const product = findLocalProductById(item.product_id);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0);
        const shippingFee = subtotal >= 10000 ? 0 : 80;
        const total = subtotal + shippingFee;
        const now = new Date().toISOString();
        const order: Order = {
          id: Math.floor(Math.random() * 100000) + 1,
          order_number: `NM-${Date.now().toString().slice(-6)}`,
          status: 'pending',
          payment_status: 'unpaid',
          payment_method: payload.payment_method,
          subtotal: subtotal.toString(),
          discount: '0',
          shipping_fee: shippingFee.toString(),
          tax: '0',
          total: total.toString(),
          coupon_code: payload.coupon_code ?? null,
          shipping_name: payload.shipping_name,
          shipping_phone: payload.shipping_phone,
          shipping_email: payload.shipping_email ?? null,
          shipping_address: payload.shipping_address,
          shipping_city: payload.shipping_city,
          shipping_zone: payload.shipping_zone ?? null,
          notes: payload.notes ?? null,
          created_at: now,
          items: payload.items.map((item, idx) => {
            const product = findLocalProductById(item.product_id);
            return {
              id: idx + 1,
              product_id: item.product_id,
              product_name: product?.name ?? `Product #${item.product_id}`,
              product_sku: `SKU-${item.product_id.toString().padStart(4, '0')}`,
              quantity: item.quantity,
              unit_price: (product?.price ?? 0).toString(),
              line_total: ((product?.price ?? 0) * item.quantity).toString(),
            } as OrderItemType;
          }),
          status_histories: [
            {
              id: 1,
              status: 'pending',
              payment_status: 'unpaid',
              note: 'Order placed (demo mode – backend offline)',
              changed_by: null,
              created_at: now,
            },
          ],
        };
        try {
          sessionStorage.setItem(`order_${order.order_number}`, JSON.stringify(order));
        } catch {}
        return order;
      }
      throw error;
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const { data } = await api.get('/orders');
      return data.data;
    } catch (error: any) {
      if (!error.response) {
        const demoOrders: Order[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('order_')) {
            try {
              const stored = sessionStorage.getItem(key);
              if (stored) demoOrders.push(JSON.parse(stored) as Order);
            } catch {}
          }
        }
        return demoOrders;
      }
      throw error;
    }
  },

  async getByNumber(orderNumber: string): Promise<Order> {
    const { data } = await api.get(`/orders/lookup/${orderNumber}`);
    return data;
  },

  async cancel(orderNumber: string): Promise<void> {
    await api.post(`/orders/${orderNumber}/cancel`);
  },
};