import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderLifecycleStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'ready'
  | 'dispatched'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export const ORDER_STATUS_TRANSITIONS: Record<string, OrderLifecycleStatus[]> = {
  pending: ['confirmed', 'paid', 'processing', 'cancelled'],
  confirmed: ['paid', 'processing', 'packed', 'cancelled'],
  paid: ['processing', 'packed', 'dispatched', 'shipped', 'cancelled', 'refunded'],
  processing: ['packed', 'ready', 'dispatched', 'shipped', 'cancelled'],
  packed: ['ready', 'dispatched', 'shipped', 'out_for_delivery', 'cancelled'],
  ready: ['dispatched', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
  dispatched: ['shipped', 'out_for_delivery', 'delivered'],
  shipped: ['out_for_delivery', 'delivered'],
  out_for_delivery: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['returned', 'delivered'],
  returned: ['refunded'],
  cancelled: ['refunded'],
  refunded: [],
};

export function canTransitionOrderStatus(currentStatus: string, nextStatus: string): boolean {
  const from = String(currentStatus || 'pending').trim().toLowerCase();
  const to = String(nextStatus || '').trim().toLowerCase() as OrderLifecycleStatus;
  if (from === to) return true;
  const allowed = ORDER_STATUS_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

export interface CustomerOrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  weight?: string;
}

export interface CustomerOrder {
  orderNumber: string;
  status: OrderLifecycleStatus | string;
  total: number;
  itemsCount: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingName?: string;
  shippingCity?: string;
  shippingAddress?: string;
  deliveryRegion?: 'inside_valley' | 'outside_valley' | string;
  paymentMethod?: 'fonepay' | 'cod' | string;
  paymentReference?: string;
  items?: CustomerOrderItem[];
}

interface OrderState {
  orders: CustomerOrder[];
  addOrder: (order: Omit<CustomerOrder, 'createdAt'>) => void;
  updateOrderStatus: (orderNumber: string, status: CustomerOrder['status']) => boolean;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (orderData) =>
        set((state) => {
          const newOrder: CustomerOrder = {
            ...orderData,
            createdAt: new Date().toISOString(),
          };
          const existing = state.orders.filter((o) => o.orderNumber !== orderData.orderNumber);
          return { orders: [newOrder, ...existing] };
        }),
      updateOrderStatus: (orderNumber, status) => {
        const target = get().orders.find((o) => o.orderNumber === orderNumber);
        if (!target) return false;
        if (!canTransitionOrderStatus(target.status, status)) {
          return false;
        }
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status } : o
          ),
        }));
        return true;
      },
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'naturesmud_customer_orders',
    }
  )
);
