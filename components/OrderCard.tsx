import { useState } from 'react';
import Link from 'next/link';
import { Package, Clock, Truck, CheckCircle2, Copy, ChevronRight, FileText } from 'lucide-react';
import type { Order, OrderStatusHistoryType } from '@/lib/orders-api';

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-600' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-50 text-blue-600' },
  packed: { label: 'Packed', className: 'bg-indigo-50 text-indigo-600' },
  ready: { label: 'Ready', className: 'bg-cyan-50 text-cyan-600' },
  shipped: { label: 'Shipped', className: 'bg-purple-50 text-purple-600' },
  delivered: { label: 'Delivered', className: 'bg-green-50 text-green-600' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600' },
};

// Full sequential order status flow (aligned with backend)
const STATUS_FLOW = ['pending', 'confirmed', 'packed', 'ready', 'shipped', 'delivered'];

const PAYMENT_BADGES: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-green-50 text-green-600' },
  unpaid: { label: 'Unpaid', className: 'bg-amber-50 text-amber-600' },
  refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-600' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-600' },
};

function StatusBadge({ status }: { status: string }) {
  const b = STATUS_BADGES[status] || STATUS_BADGES.pending;
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.className}`}>{b.label}</span>;
}

function PaymentBadge({ status }: { status: string }) {
  const b = PAYMENT_BADGES[status] || PAYMENT_BADGES.unpaid;
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.className}`}>{b.label}</span>;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso || '';
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function OrderCard({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);
  const copyNumber = () => {
    navigator.clipboard?.writeText(order.order_number).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      {/* Header row */}
      <div className="p-4 bg-[#F8F4EC] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Package className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-sm">#{order.order_number}</span>
          <button onClick={copyNumber} className="p-1 rounded hover:bg-white transition-colors" title="Copy order number">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.payment_status} />
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            <span className="w-8 h-8 rounded-lg bg-[#F8F4EC] flex items-center justify-center text-xs font-semibold text-primary">
              ×{item.quantity}
            </span>
            <span className="font-medium flex-1">{item.product_name}</span>
            <span className="text-gray-600 font-semibold">Rs. {Number(item.line_total).toLocaleString()}</span>
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-0.5">
            <p className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {formatDate(order.created_at)} at {formatTime(order.created_at)}
            </p>
            <p className="flex items-center gap-1.5">
              <Truck className="w-3 h-3" />
              {order.shipping_city}, {order.shipping_zone || ''} · {order.shipping_phone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-heading font-bold text-lg text-primary">Rs. {Number(order.total).toLocaleString()}</p>
          </div>
        </div>

        {/* Compact status tracker */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Progress</p>
            <span className={`text-xs font-semibold capitalize ${order.status === 'cancelled' ? 'text-red-500' : 'text-primary'}`}>
              {order.status || 'pending'}
            </span>
          </div>
          {order.status === 'cancelled' ? (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              This order was cancelled
            </div>
          ) : (
            <div className="flex items-center">
              {STATUS_FLOW.map((step, idx) => {
                const currentIndex = STATUS_FLOW.indexOf(order.status);
                const isDone = idx <= currentIndex;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex flex-col items-center gap-1`}>
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          isDone ? 'bg-lime-500' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${idx < currentIndex ? 'bg-lime-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* View invoice link */}
        <div className="pt-3 mt-1">
          <Link
            href={`/account/orders/${order.order_number}`}
            className="inline-flex items-center gap-1.5 w-full justify-center px-4 py-2.5 rounded-lg bg-[#F8F4EC] hover:bg-[#F0E9DD] text-sm font-semibold text-primary transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Invoice & Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
