'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  PackageSearch,
  Search,
  Truck,
  Printer,
  MessageCircle,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ordersApi, type Order } from '@/lib/orders-api';
import { formatPrice } from '@/lib/utils';
import OrderInvoice from '@/components/OrderInvoice';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('number') || searchParams.get('order') || '';
  const [orderId, setOrderId] = useState(initialNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(Boolean(initialNumber));
  const [showInvoice, setShowInvoice] = useState(false);

  const fetchOrder = useCallback(async (num: string) => {
    const cleanNum = num.trim();
    if (!cleanNum) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const data = await ordersApi.getByNumber(cleanNum);
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found. Please verify your order number.');
      }
    } catch {
      // Check demo/sessionStorage fallback
      try {
        const stored = sessionStorage.getItem(`order_${cleanNum}`);
        if (stored) {
          setOrder(JSON.parse(stored));
        } else {
          setError('Order not found. Please verify your order number or contact WhatsApp support.');
        }
      } catch {
        setError('Order not found. Please check the order number and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialNumber) {
      setOrderId(initialNumber);
      fetchOrder(initialNumber);
    }
  }, [initialNumber, fetchOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const getStatusStepIndex = (status?: string) => {
    const norm = (status || 'pending').toLowerCase();
    if (norm === 'delivered') return 4;
    if (norm === 'out_for_delivery' || norm === 'delivering') return 3;
    if (norm === 'shipped') return 2;
    if (norm === 'processing' || norm === 'packed' || norm === 'confirmed' || norm === 'ready') return 1;
    return 0; // pending / order placed
  };

  const currentStep = getStatusStepIndex(order?.status);

  const steps = [
    { title: 'Order Placed', desc: 'Order received & registered in Kathmandu hub' },
    { title: 'Processing & Packed', desc: 'Organic superfoods sanitized & sealed' },
    { title: 'Shipped', desc: 'Dispatched with courier partner' },
    { title: 'Out for Delivery', desc: 'Rider is on the way to your destination' },
    { title: 'Delivered', desc: 'Delivered safely to your hands' },
  ];

  const waInquiryLink = `https://wa.me/9779819844486?text=${encodeURIComponent(
    `Hello NaturesMud! I'd like to check the delivery update for my order #${orderId || ''}.`
  )}`;

  return (
    <>
      <section className="bg-[#FAF7F2] border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#2D5A27]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#2D5A27] font-semibold">Track Order</li>
            </ol>
          </nav>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900">
            Track Your Order
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl text-sm sm:text-base">
            Enter your order reference code (e.g. <strong>NM-420417</strong>) to see live delivery tracking and view your official invoice.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[60vh]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <PackageSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. NM-420417"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2D5A27] text-white rounded-2xl font-bold text-sm hover:bg-[#23471e] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </form>

            {loading && (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#2D5A27]" />
                <p className="text-sm">Fetching real-time order status...</p>
              </div>
            )}

            {!loading && error && searched && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold">{error}</p>
                  <a
                    href={waInquiryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-800 underline font-semibold mt-1 inline-block"
                  >
                    Ask for help on WhatsApp (+977 9713888002) →
                  </a>
                </div>
              </div>
            )}

            {!loading && order && (
              <div className="mt-8 space-y-6">
                {/* Order summary header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-5 border border-gray-200 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Order Number</p>
                    <p className="font-mono font-bold text-base text-[#2D5A27]">{order.order_number}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Recipient: <strong>{order.shipping_name}</strong> ({order.shipping_phone})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm font-black text-gray-900 mt-1">{formatPrice(Number(order.total) || 0)}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-0">
                  <h3 className="font-heading font-black text-sm text-gray-900 uppercase tracking-wider mb-5">
                    Delivery Progress
                  </h3>

                  {steps.map((step, i) => {
                    const isDone = i <= currentStep;
                    const isCurrent = i === currentStep;

                    return (
                      <div key={step.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-[#2D5A27] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`w-0.5 h-10 ${
                                i < currentStep ? 'bg-[#2D5A27]' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-6">
                          <p
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-[#2D5A27]'
                                : isDone
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons: Invoice & WhatsApp */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoice(true)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#2D5A27] hover:bg-[#23471e] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View & Print Official Invoice</span>
                  </button>

                  <a
                    href={waInquiryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp (+977 9713888002)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Invoice Modal */}
      {showInvoice && order && (
        <OrderInvoice
          isModal
          onClose={() => setShowInvoice(false)}
          order={{
            orderNumber: order.order_number,
            createdAt: order.created_at,
            customerName: order.shipping_name,
            customerPhone: order.shipping_phone,
            customerEmail: order.shipping_email || undefined,
            shippingAddress: order.shipping_address,
            shippingCity: order.shipping_city,
            shippingProvince: order.shipping_zone || undefined,
            items: order.items.map((it) => ({
              id: it.id,
              name: it.product_name,
              quantity: it.quantity,
              price: Number(it.unit_price) || 0,
            })),
            subtotal: Number(order.subtotal) || 0,
            shippingFee: Number(order.shipping_fee) || 0,
            discount: Number(order.discount) || 0,
            total: Number(order.total) || 0,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            paymentReference: order.payment_reference || undefined,
            receiptUrl: order.receipt_image || undefined,
          }}
        />
      )}
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}