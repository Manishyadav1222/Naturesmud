'use client';

import React from 'react';
import {
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

export interface InvoiceItem {
  id?: string | number;
  name?: string;
  product_name?: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  weight?: string;
}

export interface InvoiceOrderData {
  orderNumber: string;
  createdAt?: string | Date;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string;
  deliveryRegion?: 'inside_valley' | 'outside_valley' | string;
  items: InvoiceItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  paymentMethod: 'fonepay' | 'cod' | string;
  paymentStatus?: 'pending' | 'paid' | 'verified' | string;
  paymentReference?: string;
  receiptUrl?: string;
}

interface OrderInvoiceProps {
  order: InvoiceOrderData;
  onClose?: () => void;
  isModal?: boolean;
}

export default function OrderInvoice({ order, onClose, isModal = false }: OrderInvoiceProps) {
  const isValley =
    order.deliveryRegion === 'inside_valley' ||
    (order.shippingCity || '').toLowerCase().includes('kathmandu') ||
    (order.shippingCity || '').toLowerCase().includes('lalitpur') ||
    (order.shippingCity || '').toLowerCase().includes('bhaktapur');

  const formattedDate = order.createdAt
    ? formatDateTime(order.createdAt)
    : formatDateTime(new Date());

  const invoiceNumber = `INV-${order.orderNumber.replace('#', '')}`;
  const isPaid =
    order.paymentStatus === 'paid' ||
    order.paymentStatus === 'verified' ||
    Boolean(order.receiptUrl);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getWhatsAppShareUrl = () => {
    const lines = [
      `*🧾 NaturesMud Nepal - Official Order Invoice*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Invoice No:* #${invoiceNumber}`,
      `📦 *Order No:* ${order.orderNumber}`,
      `📅 *Date:* ${formattedDate}`,
      `👤 *Customer:* ${order.customerName}`,
      `📱 *Phone:* ${order.customerPhone}`,
      `📍 *Address:* ${order.shippingAddress}, ${order.shippingCity} (${isValley ? 'Inside Valley' : 'Outside Valley'})`,
      ``,
      `🛒 *Items:*`,
      ...order.items.map((it, idx) => {
        const name = it.name || it.product_name || `Item ${idx + 1}`;
        const price = it.price || it.unit_price || 0;
        return `  ${idx + 1}. ${name} x${it.quantity} = Rs. ${(price * it.quantity).toLocaleString()}`;
      }),
      ``,
      `💳 *Payment:* ${order.paymentMethod === 'fonepay' ? 'FonePay QR Advance' : 'Cash On Delivery'}`,
      order.paymentReference ? `🔢 *Ref ID:* ${order.paymentReference}` : null,
      `💰 *Grand Total:* Rs. ${Number(order.total).toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Thank you for trusting NaturesMud Nepal! 🙏`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/9779713888002?text=${encodeURIComponent(lines)}`;
  };

  const content = (
    <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xl max-w-3xl w-full mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:rounded-none">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100 print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#2D5A27] text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Nature&apos;s Mud Invoice
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="px-4 py-2 bg-[#2D5A27] hover:bg-[#23471e] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {isModal && onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#2D5A27] flex items-center justify-center text-white font-black text-xl shadow-md">
              🌿
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl tracking-tight text-[#2D5A27]">
                Nature&apos;s Mud
              </h1>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                Nepal Himalayan Superfoods & Organics
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1 mt-3">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
              Kathmandu, Nepal
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
              +977 9713888002 (Customer Care / WhatsApp)
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
              info@naturesmud.com · www.naturesmud.com
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-none border-gray-200">
          <div className="inline-block px-3 py-1 rounded-lg bg-[#2D5A27]/10 text-[#2D5A27] font-mono font-bold text-xs mb-2">
            ORDER INVOICE / BILL
          </div>
          <p className="text-xl font-black font-mono text-gray-900">{invoiceNumber}</p>
          <p className="text-xs text-gray-500 mt-1">
            Order Ref: <span className="font-mono font-bold text-gray-800">{order.orderNumber}</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Date: {formattedDate}</p>

          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize"
            style={{
              backgroundColor: isPaid ? '#ECFDF5' : '#FFFBEB',
              borderColor: isPaid ? '#A7F3D0' : '#FDE68A',
              color: isPaid ? '#065F46' : '#92400E',
            }}
          >
            {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
            {isPaid ? 'Payment Confirmed' : 'COD / Advance Pending'}
          </div>
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 text-xs">
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
            CUSTOMER & BILLING DETAILS
          </p>
          <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
          <p className="text-gray-600 mt-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" /> {order.customerPhone}
          </p>
          {order.customerEmail && (
            <p className="text-gray-600 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> {order.customerEmail}
            </p>
          )}
        </div>

        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-100">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">
            SHIPPING & DISPATCH DESTINATION
          </p>
          <p className="font-bold text-sm text-gray-900">{order.shippingAddress}</p>
          <p className="text-gray-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {order.shippingCity}
            {order.shippingProvince ? `, ${order.shippingProvince}` : ''}
          </p>
          <p className="text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            {isValley ? 'Inside Kathmandu Valley (1-2 Days Express)' : 'Outside Valley Courier (2-4 Days Doorstep)'}
          </p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="pb-3 w-8">#</th>
                <th className="pb-3">Product Description</th>
                <th className="pb-3 text-center w-16">Qty</th>
                <th className="pb-3 text-right w-24">Rate (NPR)</th>
                <th className="pb-3 text-right w-28">Amount (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => {
                const name = item.name || item.product_name || `Item ${idx + 1}`;
                const price = typeof item.price === 'number' ? item.price : Number(item.unit_price) || 0;
                const qty = item.quantity || 1;
                const lineTotal = price * qty;

                return (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-gray-900 text-sm">{name}</p>
                      {item.weight && (
                        <p className="text-[11px] text-gray-400">
                          {/^\d+(\.00)?$/.test(String(item.weight).trim()) ? `${parseFloat(String(item.weight))} GM` : item.weight}
                        </p>
                      )}
                      <p className="text-[10px] text-emerald-700 font-medium">100% Organic · Chemical Free</p>
                    </td>
                    <td className="py-3.5 text-center font-bold text-gray-800">{qty}</td>
                    <td className="py-3.5 text-right text-gray-600 font-mono">{formatPrice(price)}</td>
                    <td className="py-3.5 text-right font-bold text-gray-900 font-mono">{formatPrice(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Breakdown & Summary */}
      <div className="pt-4 border-t-2 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="text-xs text-gray-500 space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <p className="font-bold text-gray-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#2D5A27]" /> Payment Breakdown
            </p>
            <p>
              Method:{' '}
              <span className="font-bold text-gray-900 uppercase">
                {order.paymentMethod === 'fonepay' ? 'FonePay Advance QR' : 'Cash On Delivery (COD)'}
              </span>
            </p>
            {order.paymentReference && (
              <p>
                Reference ID: <span className="font-mono font-bold text-gray-900">{order.paymentReference}</span>
              </p>
            )}
            <p className="text-[11px] text-gray-400 pt-1">
              Sourced directly from high-altitude chemical-free farms in Nepal.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatPrice(order.subtotal)}</span>
            </div>

            {Boolean(order.discount && order.discount > 0) && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Festival / Promo Discount:</span>
                <span className="font-mono">- {formatPrice(order.discount || 0)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({isValley ? 'Inside Valley' : 'Outside Valley'}):</span>
              <span className="font-mono font-medium">
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  formatPrice(order.shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900 text-base font-black text-gray-900">
              <span>Grand Total:</span>
              <span className="text-xl text-[#2D5A27] font-mono">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 space-y-1">
        <p className="font-bold text-gray-600">Dhanyabad for supporting local Himalayan farmers! 🌿</p>
        <p>For inquiries, order status, or returns, contact WhatsApp: <strong>+977 9713888002</strong></p>
        <p className="text-[10px] text-gray-400">Nature&apos;s Mud Nepal · Pure Food · Real Nature · 100% Chemical-Free</p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center print:p-0 print:bg-white print:static">
        <div className="relative w-full max-w-3xl my-8 print:my-0">
          {content}
        </div>
      </div>
    );
  }

  return content;
}