// ============================================================
// Admin utilities: formatters, helpers, constants
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  SocialPostStatus,
} from './types';

// cn utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------- Currency formatting (NPR) ----------
const nprFormatter = new Intl.NumberFormat('en-NP', {
  style: 'currency',
  currency: 'NPR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNPR = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return 'Rs. 0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Rs. 0';
  return nprFormatter.format(num);
};

// ---------- Date formatting (Nepal Time: Asia/Kathmandu, UTC+05:45) ----------
export const parseNepalDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  const str = String(date).trim();
  if (!str) return null;
  
  // Format: "YYYY-MM-DD HH:mm:ss" from MySQL
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(str)) {
    if (str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str)) {
      const parsed = new Date(str);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    // Saved in Nepal time (+05:45)
    const parsed = new Date(`${str.replace(' ', 'T')}+05:45`);
    return isNaN(parsed.getTime()) ? new Date(str) : parsed;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (date: string | Date | null | undefined): string => {
  const d = parseNepalDate(date);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  const d = parseNepalDate(date);
  if (!d) return 'N/A';
  return d.toLocaleString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const timeAgo = (date: string | Date | null | undefined): string => {
  const d = parseNepalDate(date);
  if (!d) return 'N/A';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

// ---------- Number formatting ----------
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  return n.toLocaleString('en-US');
};

export const formatCompactNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

// ---------- Status helpers ----------
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PACKED': return 'bg-violet-100 text-violet-800 border-violet-200';
    case 'READY': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'SHIPPED': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    case 'RETURNED': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
    case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getProductStatusColor = (status: ProductStatus): string => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
    case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'INACTIVE': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'ARCHIVED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getReviewStatusColor = (status: ReviewStatus): string => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getSocialPostStatusColor = (status: SocialPostStatus): string => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-800 border-green-200';
    case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// ---------- Slug generation ----------
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ---------- Initials avatar ----------
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// ---------- Order status flow ----------
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['READY', 'CANCELLED'],
  READY: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  READY: 'Ready to Ship',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ARCHIVED: 'Archived',
};

// ---------- Role helpers ----------
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MARKETING: 'Marketing',
  WAREHOUSE: 'Warehouse',
  SUPPORT: 'Support',
  CONTENT_MANAGER: 'Content Manager',
  VIEWER: 'Viewer',
  CUSTOMER: 'Customer',
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200';
    case 'MANAGER': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'MARKETING': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'WAREHOUSE': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'SUPPORT': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'CONTENT_MANAGER': return 'bg-violet-100 text-violet-800 border-violet-200';
    case 'VIEWER': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// ---------- Media type labels ----------
export const MEDIA_TYPE_LABELS: Record<string, string> = {
  IMAGE: 'Image',
  VIDEO: 'Video',
  PDF: 'PDF',
  DOCUMENT: 'Document',
};

// ---------- Platform labels ----------
export const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  LINKEDIN: 'LinkedIn',
  YOUTUBE: 'YouTube',
};

// ---------- API base URL ----------
const isServer = typeof window === 'undefined';

export function getAdminApiBase(): string {
  if (isServer) {
    return process.env.INTERNAL_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:4001/api/admin';
  }

  // In browser:
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
    if (envUrl && !envUrl.includes('admin-server')) {
      return envUrl;
    }

    const origin = window.location.origin;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // If running on custom/Nginx domain or standard ports
    if (port === '80' || port === '443' || port === '') {
      return `${origin}/api/admin`;
    }

    // If accessed via localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:4001/api/admin`;
    }

    return `${origin}/api/admin`;
  }

  return process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:4001/api/admin';
}

export const ADMIN_API_BASE = getAdminApiBase();