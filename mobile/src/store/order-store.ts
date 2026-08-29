import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cart-store';

export type OrderStatus = 'pending' | 'verified' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'esewa' | 'khalti' | 'fonepay' | 'card' | 'cod';

export interface OrderAddress {
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: OrderAddress;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderState {
  orders: PlacedOrder[];
  activeOrder: PlacedOrder | null;
  addOrder: (order: Omit<PlacedOrder, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'estimatedDelivery'>) => PlacedOrder;
  getOrderById: (orderId: string) => PlacedOrder | undefined;
  getOrderByNumber: (orderNumber: string) => PlacedOrder | undefined;
  setActiveOrder: (order: PlacedOrder | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ORDERS_STORAGE_KEY = 'naturesmud_orders';

const SAMPLE_ORDERS: PlacedOrder[] = [
  {
    id: 'ord_101',
    orderNumber: 'NM-98241',
    status: 'out_for_delivery',
    items: [
      {
        id: '1',
        slug: 'pure-himalayan-shilajit-resin-50g',
        name: 'Pure Himalayan Shilajit Resin (50g)',
        price: 2450,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        weight: '50g',
        category: 'Ayurvedic',
        quantity: 1,
      },
      {
        id: '2',
        slug: 'wild-cliff-honey-500g',
        name: 'Wild Himalayan Cliff Honey (500g)',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
        weight: '500g',
        category: 'Honey',
        quantity: 2,
      },
    ],
    subtotal: 6150,
    shipping: 0,
    discount: 615,
    total: 5535,
    paymentMethod: 'esewa',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+977 9841234567',
      address_line_1: 'Thamel Marg, Ward No. 26',
      city: 'Kathmandu',
      state: 'Bagmati',
      postal_code: '44600',
      country: 'Nepal',
    },
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    trackingNumber: 'NM-TRK-78921',
  },
  {
    id: 'ord_100',
    orderNumber: 'NM-84310',
    status: 'delivered',
    items: [
      {
        id: '3',
        slug: 'organic-a2-desi-cow-ghee-1l',
        name: 'Organic A2 Himalayan Cow Ghee (1L)',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
        weight: '1L',
        category: 'Dairy',
        quantity: 1,
      },
    ],
    subtotal: 2200,
    shipping: 150,
    discount: 0,
    total: 2350,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'Aarav Sharma',
      phone: '+977 9841234567',
      address_line_1: 'Lakeside-6, Baidam',
      city: 'Pokhara',
      state: 'Gandaki',
      postal_code: '33700',
      country: 'Nepal',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    trackingNumber: 'NM-TRK-55102',
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: SAMPLE_ORDERS,
      activeOrder: SAMPLE_ORDERS[0],

      addOrder: (orderData) => {
        const orderNumber = `NM-${Math.floor(10000 + Math.random() * 90000)}`;
        const id = `ord_${Date.now()}`;
        const newOrder: PlacedOrder = {
          ...orderData,
          id,
          orderNumber,
          status: 'pending',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          trackingNumber: `NM-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder,
        }));

        return newOrder;
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrderByNumber: (orderNumber: string) => {
        return get().orders.find(
          (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase().trim()
        );
      },

      setActiveOrder: (order) => {
        set({ activeOrder: order });
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
          activeOrder:
            state.activeOrder?.id === orderId
              ? { ...state.activeOrder, status }
              : state.activeOrder,
        }));
      },
    }),
    {
      name: ORDERS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);
