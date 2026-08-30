'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { formatNPR, formatDate, formatDateTime, timeAgo, cn } from '@/lib/admin/utils';
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CircleAlert,
  User,
  FileText,
  CreditCard,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productSku?: string | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  receiptImage?: string | null;
  paymentReference?: string | null;
  isValley?: boolean;
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  grandTotal: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country: string;
  } | null;
  items: OrderItem[];
  statusHistory: {
    id: string;
    status: string;
    comment?: string | null;
    createdAt: string;
    changedBy?: { name: string } | null;
  }[];
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PACKED: 'bg-purple-50 text-purple-700 border-purple-200',
  READY: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
  PROCESSING: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-lime-50 text-lime-700 border-lime-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-orange-50 text-orange-700 border-orange-200',
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
  UNPAID: 'bg-rose-50 text-rose-700 border-rose-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REFUNDED: 'bg-blue-50 text-blue-700 border-blue-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'READY', label: 'Ready for Dispatch' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <CircleAlert className="h-5 w-5 text-amber-500" />,
  CONFIRMED: <CheckCircle2 className="h-5 w-5 text-blue-500" />,
  PACKED: <Package className="h-5 w-5 text-purple-500" />,
  READY: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  PROCESSING: <Package className="h-5 w-5 text-emerald-600" />,
  SHIPPED: <Truck className="h-5 w-5 text-indigo-500" />,
  DELIVERED: <CheckCircle2 className="h-5 w-5 text-lime-500" />,
  CANCELLED: <XCircle className="h-5 w-5 text-red-500" />,
  RETURNED: <RotateCcw className="h-5 w-5 text-orange-500" />,
};

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'READY', 'SHIPPED', 'DELIVERED'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const orderId = params?.id as string;
  const canManageOrders = hasPermission(PERMISSIONS.MANAGE_ORDERS);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ data: OrderDetail }>(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load order');
      }
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusChange = async (status: string) => {
    if (!order || !canManageOrders) return;
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order.id}/status`, { status });
      setOrder((prev) => (prev ? { ...prev, status } : prev));
      fetchOrder();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!order) return;
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order.id}/payment`, {
        paymentStatus: 'PAID',
        status: 'READY',
      });
      setOrder((prev) => (prev ? { ...prev, paymentStatus: 'PAID', status: 'READY' } : prev));
      fetchOrder();
    } catch (err: any) {
      setError(err.message || 'Failed to approve payment');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order.id}/status`, { status: 'CANCELLED' });
      setOrder((prev) => (prev ? { ...prev, status: 'CANCELLED' } : prev));
      setShowCancelDialog(false);
      fetchOrder();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!order) return;
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order.id}/status`, { status: 'RETURNED' });
      setOrder((prev) => (prev ? { ...prev, status: 'RETURNED' } : prev));
      setShowReturnDialog(false);
      fetchOrder();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <EmptyState
        title="Order Not Found"
        description={error || 'The requested order could not be located.'}
        action={{ label: 'Back to Orders', onClick: () => router.push('/admin/orders') }}
      />
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const isReturned = order.status === 'RETURNED';
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
                Order {order.orderNumber}
              </h1>
              <Badge className={STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}>
                {order.status}
              </Badge>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.isValley
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {order.isValley ? 'Inside Valley' : 'Outside Valley Courier'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order.customer?.phone && (
            <a
              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Namaste ${order.customer.name}! This is NaturesMud regarding your order ${order.orderNumber}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </a>
          )}

          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1.5" /> Print
          </Button>

          {!isCancelled && !isReturned && canManageOrders && (
            <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)} className="text-rose-600 hover:bg-rose-50">
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Status & Payment Action Banner */}
      <Card className="border-l-4 border-l-[#2D5A27] bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D5A27]/10 shrink-0">
                {STATUS_ICONS[order.status] || <Package className="h-6 w-6 text-[#2D5A27]" />}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-lg font-black text-gray-900">{order.status}</span>
                  {canManageOrders && !isCancelled && !isReturned && (
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      options={STATUS_OPTIONS}
                      className="w-44 text-xs font-bold"
                      disabled={isUpdating}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Payment Status & Fast Approval Action */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className={PAYMENT_STYLES[order.paymentStatus] || 'bg-gray-100 text-gray-700'}>
                    {order.paymentStatus}
                  </Badge>
                  <span className="text-xs font-bold text-gray-700 uppercase">{order.paymentMethod}</span>
                </div>
              </div>

              {order.paymentStatus !== 'PAID' && order.receiptImage && canManageOrders && (
                <Button
                  size="sm"
                  onClick={handleApprovePayment}
                  disabled={isUpdating}
                  className="bg-[#2D5A27] hover:bg-[#23471e] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Payment & Mark Ready</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Order Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left 8 Cols: Items & Slip Inspection */}
        <div className="lg:col-span-8 space-y-6">
          {/* FonePay Receipt Slip Verification Box */}
          {order.receiptImage && (
            <Card className="border border-emerald-300 bg-emerald-50/40 overflow-hidden shadow-sm">
              <CardHeader className="bg-emerald-100/50 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#2D5A27]" />
                    Customer Payment Receipt Slip
                  </CardTitle>
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    FonePay / Mobile Banking Slip Attached
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Thumbnail */}
                  <div
                    onClick={() => setShowReceiptModal(true)}
                    className="relative w-40 h-52 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-md cursor-pointer group bg-black shrink-0"
                  >
                    <Image
                      src={order.receiptImage}
                      alt="Customer payment slip"
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      <Eye className="w-5 h-5 mr-1" /> Enlarge
                    </div>
                  </div>

                  {/* Details & Info */}
                  <div className="flex-1 space-y-3 text-xs text-gray-700">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Payment Details</p>
                      <p className="text-gray-500">Uploaded by customer at checkout.</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                      <p className="text-gray-500 font-medium">Merchant Account:</p>
                      <p className="font-bold text-gray-900">KRISHA AGRI LINE PVT LTD (KALANKI BRANCH)</p>
                      <p className="text-gray-500">Terminal: <span className="font-mono font-bold">2222410021365126</span></p>
                    </div>

                    {order.paymentReference && (
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                        <p className="text-gray-500 font-medium">Customer Transaction Ref / ID:</p>
                        <p className="font-mono font-bold text-[#2D5A27] text-sm">{order.paymentReference}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setShowReceiptModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#2D5A27] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Full Slip
                      </button>
                      <a
                        href={order.receiptImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 hover:bg-gray-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-900 font-heading">
                Ordered Products ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Product</th>
                      <th className="px-6 py-3 text-left">Unit Price</th>
                      <th className="px-6 py-3 text-left">Qty</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-xs">
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                              <Image
                                src={item.productImage || '/products/sweet-potato-powder.jpg'}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{item.productName}</p>
                              <p className="text-gray-400 text-[11px]">SKU: {item.productSku || 'NM-001'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">{formatNPR(item.unitPrice)}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-black text-gray-900">{formatNPR(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="p-6 bg-[#FAF7F2] border-t border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatNPR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge ({order.isValley ? 'Kathmandu Valley' : 'Outside Valley Courier'})</span>
                  <span className="font-bold text-gray-900">{formatNPR(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-{formatNPR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-[#2D5A27]">{formatNPR(order.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Customer, Shipping & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-900 font-heading">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{order.customer?.name || order.shippingAddress?.fullName || 'Customer'}</p>
                  <p className="text-gray-500">{order.customer?.email || 'No email provided'}</p>
                </div>
              </div>

              {(order.customer?.phone || order.shippingAddress?.phone) && (
                <div className="flex items-center gap-2 text-gray-700 font-medium pt-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customer?.phone || order.shippingAddress?.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-900 font-heading">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  <p className="font-semibold text-[#2D5A27]">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state || 'Nepal'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {order.isValley ? 'Inside Valley Delivery' : 'Outside Valley Courier Dispatch'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-900 font-heading">Status History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {order.statusHistory?.map((h) => (
                <div key={h.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className={STATUS_STYLES[h.status] || 'bg-gray-100 text-gray-700 text-[10px]'}>
                      {h.status}
                    </Badge>
                    <span className="text-[10px] text-gray-400">{timeAgo(h.createdAt)}</span>
                  </div>
                  {h.comment && <p className="text-gray-600 leading-snug">{h.comment}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Resolution Receipt Modal */}
      {showReceiptModal && order.receiptImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl relative">
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <QrCode className="w-4 h-4 text-[#EBC164]" />
                <span>Payment Slip · {order.orderNumber}</span>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-100 max-h-[75vh] overflow-y-auto flex items-center justify-center">
              <img
                src={order.receiptImage}
                alt="Full receipt slip"
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-mono">
                Ref: {order.paymentReference || 'None entered'}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  handleApprovePayment();
                  setShowReceiptModal(false);
                }}
                disabled={order.paymentStatus === 'PAID'}
                className="bg-[#2D5A27] text-white font-bold text-xs"
              >
                {order.paymentStatus === 'PAID' ? 'Already Verified (PAID)' : 'Approve & Mark Paid'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order"
        description="Are you sure you want to cancel this order?"
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="danger"
      />
    </div>
  );
}