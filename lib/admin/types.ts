// ============================================================
// Admin Types & Interfaces
// ============================================================

export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'MARKETING'
  | 'WAREHOUSE'
  | 'SUPPORT'
  | 'CONTENT_MANAGER'
  | 'VIEWER'
  | 'CUSTOMER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'READY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'ESEWA' | 'KHALTI' | 'STRIPE' | 'PAYPAL' | 'COD' | 'BANK_TRANSFER';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type DiscountType = 'PERCENTAGE' | 'FIXED';
export type CampaignType = 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
export type SocialPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'LINKEDIN' | 'YOUTUBE';
export type SocialPostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
export type NotificationType =
  | 'NEW_ORDER'
  | 'ORDER_CANCELLED'
  | 'NEW_REVIEW'
  | 'LOW_STOCK'
  | 'NEW_CUSTOMER'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ============================================================
// AUTH
// ============================================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: {
    id: string;
    name: RoleName;
    description?: string | null;
    permissions: Permission[];
  };
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  key: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
  requires2FA?: boolean;
  requiresOtp?: boolean;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardStats {
  revenue: { total: number; today: number; thisMonth: number; growth: number };
  orders: { total: number; today: number; pending: number; growth: number };
  customers: { total: number; newThisMonth: number; growth: number };
  products: { total: number; active: number; lowStock: number };
  recentOrders: Order[];
  topProducts: TopProduct[];
  salesByDay: SalesPoint[];
  categoryBreakdown: CategoryBreakdown[];
  notifications: NotificationItem[];
}

export interface TopProduct {
  id: string;
  name: string;
  image?: string | null;
  soldCount: number;
  revenue: number;
}

export interface SalesPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
}

// ============================================================
// ORDERS
// ============================================================

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingEmail?: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingZone?: string | null;
  shippingCountry: string;
  notes?: string | null;
  trackingNumber?: string | null;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
  paidAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId?: string | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
  } | null;
}

export interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  comment?: string | null;
  changedBy?: string | null;
  createdAt: string;
}

// ============================================================
// PRODUCTS & CATALOG
// ============================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  brandId?: string | null;
  brand?: { id: string; name: string; slug: string } | null;
  shortDescription?: string | null;
  description?: string | null;
  benefits?: unknown;
  ingredients?: unknown;
  nutrition?: unknown;
  usage?: string | null;
  storage?: string | null;
  weight?: number | null;
  unit: string;
  price: number;
  discountPrice?: number | null;
  costPrice?: number | null;
  taxRate: number;
  stock: number;
  minStock: number;
  images: ProductImage[];
  videoUrl?: string | null;
  tags?: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  ratingAvg: number;
  ratingCount: number;
  viewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: { id: string; name: string; slug: string } | null;
  children?: Category[];
  products?: Product[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product: Product;
  warehouseId?: string | null;
  warehouse?: Warehouse | null;
  supplierId?: string | null;
  supplier?: Supplier | null;
  quantity: number;
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// CUSTOMERS
// ============================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  orders: Order[];
  addresses?: Address[];
  reviews?: Review[];
  rewardPoints?: RewardPoint[];
  _count?: {
    orders: number;
    reviews: number;
    wishlist: number;
  };
}

export interface Address {
  id: string;
  label?: string | null;
  name: string;
  phone: string;
  address: string;
  city: string;
  zone?: string | null;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId?: string | null;
  customer?: { id: string; name: string; email: string } | null;
  productId: string;
  product?: { id: string; name: string; slug: string; images: ProductImage[] } | null;
  rating: number;
  title?: string | null;
  content: string;
  status: ReviewStatus;
  isFeatured: boolean;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardPoint {
  id: string;
  points: number;
  reason?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

// ============================================================
// MARKETING
// ============================================================

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  perUserLimit: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  subject?: string | null;
  content: string;
  audience?: string | null;
  scheduledAt?: string | null;
  sentAt?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  accessToken?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  accountId?: string | null;
  account?: { id: string; platform: SocialPlatform; username: string } | null;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: unknown;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  status: SocialPostStatus;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
}

// ============================================================
// CONTENT
// ============================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  category?: string | null;
  tags?: unknown;
  authorId?: string | null;
  author?: { id: string; name: string; email: string } | null;
  status: string;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeEntry {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  ingredients?: unknown;
  steps?: unknown;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  nutrition?: unknown;
  image?: string | null;
  videoUrl?: string | null;
  productsUsed?: string | null;
  status: string;
  publishedAt?: string | null;
  author?: { id: string; name: string } | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  publicId?: string | null;
  filename: string;
  mimeType?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  folder?: string | null;
  tags?: unknown;
  alt?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  heroImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  position?: string | null;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// NOTIFICATIONS & SETTINGS
// ============================================================

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface Setting {
  id: string;
  key: string;
  value?: unknown;
  group?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  userId?: string | null;
  user?: { id: string; name: string; email: string } | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  meta?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface UserResource {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  roleId?: string | null;
  role?: { id: string; name: RoleName } | null;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: RoleName;
  description?: string | null;
  permissions: Permission[];
  _count?: { users: number };
}