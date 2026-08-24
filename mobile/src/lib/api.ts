import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.naturesmud.com/v1';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedRequests: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request
            return new Promise((resolve, reject) => {
              this.failedRequests.push({ resolve, reject });
            }).then(() => this.client(originalRequest));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              // Update auth store
              useAuthStore.getState().updateUser({} as any); // Trigger re-render
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Process queued requests
              this.failedRequests.forEach(({ resolve }) => resolve(this.client(originalRequest)));
              this.failedRequests = [];

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            this.failedRequests.forEach(({ reject }) => reject(refreshError));
            this.failedRequests = [];
            await useAuthStore.getState().clearAuth();
            useUIStore.getState().addToast({
              type: 'error',
              title: 'Session Expired',
              message: 'Please log in again.',
            });
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle network errors
        if (!error.response) {
          useUIStore.getState().setIsOnline(false);
          useUIStore.getState().addToast({
            type: 'error',
            title: 'Connection Error',
            message: 'Please check your internet connection.',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getStoredRefreshToken();
      if (!refreshToken) return null;

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data.data;

      // Store new tokens
      await this.storeTokens(access_token, newRefreshToken);

      return access_token;
    } catch {
      return null;
    }
  }

  private async getStoredRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem('refresh_token');
    }
    const { SecureStore } = await import('expo-secure-store');
    return SecureStore.getItemAsync('refresh_token');
  }

  private async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      return;
    }
    const { SecureStore } = await import('expo-secure-store');
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
  }

  // Public API methods
  async get<T>(url: string, config?: any) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.post('/auth/login', { email, password }),
    register: (data: { name: string; email: string; phone: string; password: string }) =>
      this.post('/auth/register', data),
    logout: () => this.post('/auth/logout'),
    forgotPassword: (email: string) => this.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) => this.post('/auth/reset-password', { token, password }),
    verifyEmail: (token: string) => this.post('/auth/verify-email', { token }),
    resendVerification: (email: string) => this.post('/auth/resend-verification', { email }),
    getUser: () => this.get('/auth/me'),
    updateProfile: (data: any) => this.patch('/auth/profile', data),
    changePassword: (current: string, newPassword: string) => this.post('/auth/change-password', { current, newPassword }),
    deleteAccount: () => this.delete('/auth/account'),
  };

  // Products endpoints
  products = {
    list: (params?: { category?: string; search?: string; page?: number; limit?: number; sort?: string; minPrice?: number; maxPrice?: number; featured?: boolean; bestseller?: boolean }) =>
      this.get('/products', { params }),
    get: (slug: string) => this.get(`/products/${slug}`),
    featured: (limit = 8) => this.get('/products/featured', { params: { limit } }),
    bestsellers: (limit = 10) => this.get('/products/bestsellers', { params: { limit } }),
    related: (productId: string, limit = 4) => this.get(`/products/${productId}/related`, { params: { limit } }),
    reviews: (productId: string, params?: { page?: number; limit?: number }) => this.get(`/products/${productId}/reviews`, { params }),
    addReview: (productId: string, data: { rating: number; title: string; content: string; images?: string[] }) => this.post(`/products/${productId}/reviews`, data),
  };

  // Categories endpoints
  categories = {
    list: (params?: { parent?: string; limit?: number }) => this.get('/categories', { params }),
    get: (slug: string) => this.get(`/categories/${slug}`),
    tree: () => this.get('/categories/tree'),
  };

  // Cart endpoints
  cart = {
    get: () => this.get('/cart'),
    add: (data: { productId: string; quantity: number }) => this.post('/cart', data),
    update: (itemId: string, quantity: number) => this.patch(`/cart/${itemId}`, { quantity }),
    remove: (itemId: string) => this.delete(`/cart/${itemId}`),
    clear: () => this.delete('/cart'),
    applyCoupon: (code: string) => this.post('/cart/coupon', { code }),
    removeCoupon: () => this.delete('/cart/coupon'),
    sync: (items: any[]) => this.post('/cart/sync', { items }),
  };

  // Orders endpoints
  orders = {
    list: (params?: { page?: number; limit?: number; status?: string }) => this.get('/orders', { params }),
    get: (id: string) => this.get(`/orders/${id}`),
    create: (data: { items: any[]; shippingAddress: any; paymentMethod: string; paymentData?: any; couponCode?: string }) => this.post('/orders', data),
    cancel: (id: string, reason?: string) => this.post(`/orders/${id}/cancel`, { reason }),
    track: (id: string) => this.get(`/orders/${id}/track`),
    return: (id: string, data: { items: string[]; reason: string }) => this.post(`/orders/${id}/return`, data),
    reorder: (id: string) => this.post(`/orders/${id}/reorder`),
  };

  // Addresses endpoints
  addresses = {
    list: () => this.get('/addresses'),
    get: (id: string) => this.get(`/addresses/${id}`),
    create: (data: any) => this.post('/addresses', data),
    update: (id: string, data: any) => this.patch(`/addresses/${id}`, data),
    delete: (id: string) => this.delete(`/addresses/${id}`),
    setDefault: (id: string) => this.post(`/addresses/${id}/default`),
  };

  // User/Profile endpoints
  user = {
    getProfile: () => this.get('/user/profile'),
    updateProfile: (data: any) => this.patch('/user/profile', data),
    uploadAvatar: (file: any) => this.post('/user/avatar', file, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getLoyalty: () => this.get('/user/loyalty'),
    getReferrals: () => this.get('/user/referrals'),
    getWishlist: () => this.get('/user/wishlist'),
    addToWishlist: (productId: string) => this.post('/user/wishlist', { productId }),
    removeFromWishlist: (productId: string) => this.delete(`/user/wishlist/${productId}`),
    getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => this.get('/user/notifications', { params }),
    markNotificationRead: (id: string) => this.patch(`/user/notifications/${id}/read`),
    updatePreferences: (data: any) => this.patch('/user/preferences', data),
  };

  // Newsletter
  newsletter = {
    subscribe: (email: string) => this.post('/newsletter/subscribe', { email }),
    unsubscribe: (email: string) => this.post('/newsletter/unsubscribe', { email }),
    preferences: (data: any) => this.patch('/newsletter/preferences', data),
  };

  // Search
  search = {
    products: (query: string, params?: { page?: number; limit?: number; filters?: any }) => this.get('/search/products', { params: { q: query, ...params } }),
    suggestions: (query: string) => this.get('/search/suggestions', { params: { q: query } }),
    trending: () => this.get('/search/trending'),
  };

  // Content/CMS
  content = {
    getPage: (slug: string) => this.get(`/content/pages/${slug}`),
    getBlogPosts: (params?: { page?: number; limit?: number; category?: string }) => this.get('/content/blog', { params }),
    getBlogPost: (slug: string) => this.get(`/content/blog/${slug}`),
    getFaqs: (category?: string) => this.get('/content/faqs', { params: { category } }),
  };

  // Campaigns/Promotions
  campaigns = {
    list: (params?: { active?: boolean }) => this.get('/campaigns', { params }),
    get: (slug: string) => this.get(`/campaigns/${slug}`),
  };

  // File upload
  upload = {
    image: (file: any, folder = 'general') => this.post('/upload/image', { file, folder }, { headers: { 'Content-Type': 'multipart/form-data' } }),
  };
}

export const api = new ApiClient();

// Named exports for specific APIs
export const authApi = api.auth;
export const productsApi = api.products;
export const categoriesApi = api.categories;
export const cartApi = api.cart;
export const ordersApi = api.orders;
export const addressesApi = api.addresses;
export const userApi = api.user;
export const newsletterApi = api.newsletter;
export const searchApi = api.search;
export const contentApi = api.content;
export const campaignsApi = api.campaigns;
export const uploadApi = api.upload;