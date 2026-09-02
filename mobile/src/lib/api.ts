import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { products, categories, getFeaturedProducts, getBestSellers, getNewArrivals } from './data/products';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://naturesmud.shop/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Direct axios passthrough
  async get(url: string, config?: any) {
    try {
      return await this.client.get(url, config);
    } catch {
      return this.mockGetFallback(url, config);
    }
  }

  async post(url: string, data?: any, config?: any) {
    try {
      return await this.client.post(url, data, config);
    } catch {
      return this.mockPostFallback(url, data);
    }
  }

  private mockGetFallback(url: string, config?: any): any {
    if (url.includes('/products/featured') || url.includes('/products/bestsellers')) {
      return { data: { data: getFeaturedProducts(8) } };
    }
    if (url.includes('/products')) {
      return { data: { data: products, total: products.length } };
    }
    if (url.includes('/categories')) {
      return { data: { data: categories } };
    }
    return { data: { data: [] } };
  }

  private mockPostFallback(url: string, data?: any): any {
    if (url.includes('/auth/login')) {
      return {
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: 'usr_mock_1',
            name: data?.email?.split('@')[0] || 'Nature Lover',
            email: data?.email || 'user@naturesmud.com',
            phone: '+977 9841234567',
            role: 'customer',
            isVerified: true,
            loyaltyPoints: 100,
            referralCode: 'MUD2026',
          },
        },
      };
    }
    return { data: { success: true, message: 'Operation processed' } };
  }

  // Structured endpoints
  products = {
    list: async (params?: any) => {
      try {
        const res = await this.client.get('/products', { params });
        return res.data;
      } catch {
        return { data: products, total: products.length };
      }
    },
    featured: async (limit = 8) => {
      try {
        const res = await this.client.get('/products/featured', { params: { limit } });
        return res.data;
      } catch {
        return { data: getFeaturedProducts(limit) };
      }
    },
    bestsellers: async (limit = 10) => {
      try {
        const res = await this.client.get('/products/bestsellers', { params: { limit } });
        return res.data;
      } catch {
        return { data: getBestSellers(limit) };
      }
    },
    bySlug: async (slug: string) => {
      try {
        const res = await this.client.get(`/products/${slug}`);
        return res.data;
      } catch {
        const found = products.find((p) => p.slug === slug) || products[0];
        return { data: found };
      }
    },
  };

  categories = {
    list: async () => {
      try {
        const res = await this.client.get('/categories');
        return res.data;
      } catch {
        return { data: categories };
      }
    },
  };
}

export const api = new ApiClient();

export const authApi = {
  login: async (email: string, password: string) => {
    return {
      token: 'jwt_mock_' + Date.now(),
      user: {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '+977 9841000000',
        role: 'customer',
        isVerified: true,
        loyaltyPoints: 150,
        referralCode: 'NATURES50',
        createdAt: new Date().toISOString(),
      },
    };
  },
  register: async (name: string, email: string, phone: string, password: string) => {
    return {
      token: 'jwt_mock_' + Date.now(),
      user: {
        id: 'usr_' + Date.now(),
        name,
        email,
        phone,
        role: 'customer',
        isVerified: true,
        loyaltyPoints: 200,
        referralCode: 'WELCOME2026',
        createdAt: new Date().toISOString(),
      },
    };
  },
  logout: async () => {
    return { success: true };
  },
};

export const newsletterApi = {
  subscribe: async (email: string) => {
    return { success: true, message: 'Subscribed successfully' };
  },
};

export const tokenStorage = {
  getToken: async () => useAuthStore.getState().token,
  setToken: async (token: string) => {},
  removeToken: async () => {},
};