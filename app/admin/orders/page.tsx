'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { formatNPR, formatNumber, formatDate, formatDateTime, timeAgo, cn } from '@/lib/admin/utils';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Download,
  CircleAlert,
  Eye,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  RefreshCw,
  Radio,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string } | null;
  items: { id: string; quantity: number }[];
}

interface OrdersResponse {
  data: Order[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: any;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-accent-50 text-accent-700 border-accent-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PACKED: 'bg-purple-50 text-purple-700 border-purple-200',
  READY: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-lime-50 text-lime-700 border-lime-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-orange-50 text-orange-700 border-orange-200',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-lime-50 text-lime-700 border-lime-200',
  UNPAID: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-blue-50 text-blue-700 border-blue-200',
  PARTIALLY_REFUNDED: 'bg-accent-50 text-accent-700 border-accent-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
};

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const PAYMENT_STATUSES = ['PAID', 'UNPAID', 'REFUNDED', 'PARTIALLY_REFUNDED', 'FAILED'];

const FILTER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'READY', label: 'Ready' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

const FILTER_PAYMENT_OPTIONS = [
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded' },
  { value: 'FAILED', label: 'Failed' },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const lastKnownFirstOrderIdRef = React.useRef<string | null>(null);
  const isInitialLoadRef = React.useRef<boolean>(true);

  const canViewOrders = hasPermission(PERMISSIONS.VIEW_ORDERS);
  const canManageOrders = hasPermission(PERMISSIONS.MANAGE_ORDERS);

  const playNewOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Ignore audio error
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!canViewOrders) return;
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsLiveSyncing(true);
      }
      setError(null);
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);

      const res = await api.get<OrdersResponse>(`/orders?${params.toString()}`);
      
      // Detect if a brand-new order arrived
      if (res.data && res.data.length > 0) {
        const topOrder = res.data[0];
        if (!isInitialLoadRef.current && lastKnownFirstOrderIdRef.current && topOrder.id !== lastKnownFirstOrderIdRef.current) {
          playNewOrderChime();
          toast.success(
            `🔔 New Order Received: #${topOrder.orderNumber} (${topOrder.customer?.name || 'Customer'}) - ${formatNPR(topOrder.grandTotal)}`,
            { duration: 6000 }
          );
        }
        lastKnownFirstOrderIdRef.current = topOrder.id;
      }
      isInitialLoadRef.current = false;

      setOrders(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (!silent) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to load orders');
        }
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsLiveSyncing(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filters.status, filters.paymentStatus, filters.sortBy, filters.sortOrder, canViewOrders]);

  // Initial load & whenever filters/pages change
  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // Real-time silent background poller (every 4 seconds)
  useEffect(() => {
    if (!canViewOrders) return;
    const interval = setInterval(() => {
      // Only silent poll if user isn't searching or filtering deeply
      if (!debouncedSearch) {
        fetchOrders(true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchOrders, canViewOrders, debouncedSearch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    if (!canManageOrders) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  const handleQuickSendWhatsApp = (order: Order) => {
    const custName = order.customer?.name || 'Valued Customer';
    const custEmail = order.customer?.email || '';
    const invoiceNum = `INV-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;

    const lines = [
      `*🌿 NATURESMUD NEPAL — ORDER DISPATCH*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Order:* #${order.orderNumber}`,
      `📄 *Invoice:* #${invoiceNum}`,
      `👤 *Customer:* ${custName}`,
      custEmail ? `📧 *Email:* ${custEmail}` : null,
      ``,
      `💰 *Grand Total:* *Rs. ${Number(order.grandTotal).toLocaleString()}*`,
      `💳 *Payment Method:* ${order.paymentMethod || 'COD'} (${order.paymentStatus || 'PENDING'})`,
      `📊 *Order Status:* ${order.status}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📥 *Official PDF Tax Invoice:* https://naturesmud.shop/api/orders/${order.orderNumber.replace('#', '')}/invoice`,
      `🔒 *Admin Order Link:* https://naturesmud.shop/admin/orders/${order.id}`,
    ].filter(Boolean).join('\n');

    const directUrl = `https://wa.me/9779819844486?text=${encodeURIComponent(lines)}`;
    window.open(directUrl, '_blank');

    // Trigger server logging silently
    const cleanNum = order.orderNumber.replace('#', '').trim();
    fetch(`/api/orders/${cleanNum}/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        forceResend: true,
        recipientOverride: '9779819844486',
        orderData: {
          orderNumber: order.orderNumber,
          customerName: custName,
          customerEmail: custEmail,
          total: order.grandTotal,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        },
      }),
    }).catch(() => {});

    toast.success(`Opening WhatsApp for Order #${order.orderNumber}`);
  };

  if (!canViewOrders) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view orders."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Sync Active</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(pagination.total)} total orders · Updates in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(false)}
            disabled={isLoading || isLiveSyncing}
            className="cursor-pointer"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1.5", (isLoading || isLiveSyncing) && "animate-spin")} />
            Refresh
          </Button>
          <Link href="/admin/orders/export">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </Link>
          {canManageOrders && (
            <Link href="/admin/orders/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by order ID, customer name, or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              options={FILTER_STATUS_OPTIONS}
              placeholder="All Order Statuses"
            />
            <Select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value, page: 1 }))}
              options={FILTER_PAYMENT_OPTIONS}
              placeholder="All Payment Statuses"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {orders.length} of {pagination.total} orders
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ search: '', status: '', paymentStatus: '', sortBy: 'createdAt', sortOrder: 'desc' })}
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <EmptyState
          icon={<CircleAlert className="h-12 w-12 text-red-400" />}
          title="Failed to load orders"
          description={error}
          action={<Button onClick={() => fetchOrders()}>Retry</Button>}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-12 w-12 text-gray-300" />}
          title="No orders found"
          description="Try adjusting your filters or create a new order."
          action={canManageOrders ? (
            <Link href="/admin/orders/new">
              <Button>Create Order</Button>
            </Link>
          ) : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                            <ShoppingCart className="h-4 w-4 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {order.orderNumber || order.id.slice(0, 8)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`}>
                          <p className="text-sm font-medium text-gray-900">
                            {order.customer?.name || 'Guest'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customer?.email || 'No email'}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(order.createdAt)}
                        <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatNPR(order.grandTotal)}
                        <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canManageOrders ? (
                          <Select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs w-32 py-1"
                            options={FILTER_STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
                          />
                        ) : (
                          <Badge className={STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                            {order.status}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={PAYMENT_STATUS_STYLES[order.paymentStatus] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {order.paymentStatus}
                        </Badge>
                        <p className="mt-1 text-xs text-gray-400">{order.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-[#25D366] hover:text-white hover:bg-[#25D366] border-emerald-300 shadow-2xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                            title="Send / Open in WhatsApp (+977 9819844486)"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickSendWhatsApp(order);
                            }}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}