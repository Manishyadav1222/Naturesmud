export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  mrp?: number;
  image: string;
  images: string[];
  weight: string;
  category: string;
  categorySlug: string;
  badges: string[];
  ingredients: string[];
  benefits: string[];
  nutrition: NutritionItem[];
  usage: string;
  storage: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionItem {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon?: string;
  productCount: number;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

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
  product?: Product;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: 'home' | 'work' | 'other';
  is_default: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  productWeight: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  total: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod =
  | 'cod'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'bank_transfer';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'vendor';
  isVerified: boolean;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotionalOffers: boolean;
  language: 'en' | 'ne' | 'hi';
  currency: 'NPR' | 'USD' | 'INR';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isHelpful?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'system' | 'review' | 'referral';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName: string;
  status: 'pending' | 'completed' | 'expired';
  rewardPoints: number;
  completedAt?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  couponCode?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  readTime: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  postalCodes?: string[];
  shippingMethods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  freeShippingThreshold?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}