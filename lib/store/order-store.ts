import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  orderNumber: string;
  status: 'pending' | 'processing' | 'confirmed' | 'packed' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | string;
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
  updateOrderStatus: (orderNumber: string, status: CustomerOrder['status']) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (orderData) =>
        set((state) => {
          const newOrder: CustomerOrder = {
            ...orderData,
            createdAt: new Date().toISOString(),
          };
          // Filter out duplicate orderNumber if exists, add new to front
          const existing = state.orders.filter((o) => o.orderNumber !== orderData.orderNumber);
          return { orders: [newOrder, ...existing] };
        }),
      updateOrderStatus: (orderNumber, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status } : o
          ),
        })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'naturesmud_customer_orders',
    }
  )
);
