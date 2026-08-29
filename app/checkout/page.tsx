'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  QrCode,
  MessageCircle,
  X,
  Sparkles,
  ArrowRight,
  Tag,
  Gift,
  Printer,
  User,
} from 'lucide-react';
import { useCartStore, resolveCartProduct } from '@/lib/store/cart-store';
import { useOrderStore } from '@/lib/store/order-store';
import { formatPrice } from '@/lib/utils';
import { ordersApi, resolveBackendProductId } from '@/lib/orders-api';
import OrderInvoice from '@/components/OrderInvoice';

const VALLEY_CITIES = [
  'kathmandu',
  'lalitpur',
  'bhaktapur',
  'patan',
  'thimi',
  'kirtipur',
  'madhyapur thimi',
  'gongabu',
  'samakhushi',
  'kupondol',
  'chabahil',
  'kapan',
  'baluwatar',
  'baneshwor',
  'maharajgunj',
  'budhanilkantha',
  'jorpati',
  'tokha',
];

function isKathmanduValley(city: string, province: string, explicitValleyChoice?: boolean): boolean {
  if (explicitValleyChoice !== undefined) return explicitValleyChoice;
  const cleanCity = city.trim().toLowerCase();
  if (VALLEY_CITIES.some((v) => cleanCity.includes(v))) return true;
  if (province.toLowerCase() === 'bagmati' && (cleanCity === 'ktm' || cleanCity === '' || cleanCity.includes('valley'))) {
    return true;
  }
  return false;
}

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kathmandu',
    province: 'Bagmati',
    zip: '',
    note: '',
  });

  const [deliveryRegion, setDeliveryRegion] = useState<'inside_valley' | 'outside_valley'>('inside_valley');
  const [paymentMethod, setPaymentMethod] = useState<'fonepay' | 'cod'>('cod');
  
  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Receipt state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  // Copied feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Order submission state
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Auto-fill registered user credentials & delivery details on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('naturesmud_user');
      if (saved) {
        const userObj = JSON.parse(saved);
        if (userObj && (userObj.name || userObj.email)) {
          setCurrentUser(userObj);
          setForm((prev) => ({
            ...prev,
            name: prev.name || userObj.name || '',
            email: prev.email || userObj.email || '',
            phone: prev.phone || userObj.phone || '',
          }));
        }
      }
    } catch {
      // Non-blocking fallback
    }
  }, []);

  const isValley = deliveryRegion === 'inside_valley';

  // Strict numerical calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = resolveCartProduct(item);
      const price = typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0;
      const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 1;
      return acc + (price * qty);
    }, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  // Delivery rules: Inside Valley Rs. 100, Outside Valley Rs. 200 (Free over Rs. 10,000)
  const freeShippingThreshold = 10000;
  const standardShippingFee = isValley ? 100 : 200;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : standardShippingFee;

  const total = Math.max(0, subtotal - discount + shipping);

  // If outside valley is selected, force FonePay QR
  useEffect(() => {
    if (!isValley && paymentMethod === 'cod') {
      setPaymentMethod('fonepay');
    }
  }, [isValley, paymentMethod]);

  // Handle city typing to auto-detect valley
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, city: val }));
    const detectedValley = isKathmanduValley(val, form.province);
    setDeliveryRegion(detectedValley ? 'inside_valley' : 'outside_valley');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const cleanCode = couponCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          type: data.coupon.type,
          value: data.coupon.value,
        });
        setCouponSuccess(data.message || `Coupon "${cleanCode}" applied!`);
      } else {
        setCouponError(data.message || 'Invalid or inactive coupon code.');
      }
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  const handleReceiptChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);
    setIsUploadingReceipt(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('receipt', file);

      const res = await fetch('/api/upload/receipt', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReceiptUrl(data.url);
      } else {
        setError(data.message || 'Failed to upload receipt slip.');
      }
    } catch {
      setError('Network error while uploading payment receipt.');
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Outside Valley Payment
    if (!isValley && paymentMethod === 'cod') {
      setError('Cash on Delivery is available exclusively in Kathmandu Valley. Please pay via FonePay QR in advance.');
      return;
    }

    if (!isValley && paymentMethod === 'fonepay' && !receiptUrl && !paymentReference) {
      setError('Please upload your FonePay payment screenshot / slip receipt to confirm your outside-valley order.');
      return;
    }

    setPlacing(true);
    try {
      const resolvedItems: { product_id: number; quantity: number }[] = [];
      for (const item of items) {
        const cartProduct = resolveCartProduct(item);
        const backendId = (await resolveBackendProductId(cartProduct.slug || item.productId)) || 1;
        resolvedItems.push({ product_id: backendId, quantity: item.quantity });
      }

      if (resolvedItems.length === 0) throw new Error('Your cart is empty.');

      const orderPayload = {
        items: resolvedItems,
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_email: form.email,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_zone: form.province,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code,
        receipt_image: receiptUrl || undefined,
        payment_reference: paymentReference || undefined,
        is_valley: isValley,
        notes: form.note,
      };

      const order = await ordersApi.create(orderPayload);
      setPlacedOrder(order);

      const finalRecordedTotal = Number(order.total) || total;

      const orderItems = items.map((it) => {
        const cartProduct = resolveCartProduct(it);
        return {
          name: cartProduct.name || String(it.productId),
          quantity: it.quantity,
          price: cartProduct.price,
        };
      });

      useOrderStore.getState().addOrder({
        orderNumber: order.order_number,
        total: finalRecordedTotal,
        itemsCount: items.length,
        status: order.status || (receiptUrl ? 'processing' : 'pending'),
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        shippingName: form.name,
        shippingCity: form.city,
        shippingAddress: form.address,
        deliveryRegion,
        paymentMethod,
        paymentReference,
        items: orderItems,
      });

      // Construct rich invoice lines for immediate WhatsApp dispatch
      const invoiceNumber = `INV-${order.order_number.replace('#', '')}`;
      const itemsListText = orderItems
        .map((it, i) => `  ${i + 1}. ${it.name} x${it.quantity} - Rs. ${(it.price * it.quantity).toLocaleString()}`)
        .join('\n');

      const waInvoiceText = [
        `*🧾 Nature's Mud Nepal - Official Order Invoice*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📄 *Invoice No:* #${invoiceNumber}`,
        `📦 *Order No:* #${order.order_number}`,
        `👤 *Customer:* ${form.name}`,
        `📱 *Phone:* ${form.phone}`,
        form.email ? `📧 *Email:* ${form.email}` : null,
        `📍 *Destination:* ${form.city} (${isValley ? 'Inside Kathmandu Valley' : 'Outside Valley Courier'})`,
        form.address ? `🏠 *Address:* ${form.address}` : null,
        ``,
        itemsListText ? `🛒 *Items Ordered:*\n${itemsListText}\n` : null,
        `💳 *Payment Method:* ${paymentMethod === 'fonepay' ? 'FonePay QR Advance' : 'Cash on Delivery (COD)'}`,
        paymentReference ? `🔢 *Reference ID:* ${paymentReference}` : null,
        receiptUrl ? `🧾 *Receipt Slip:* ${receiptUrl}` : null,
        `💰 *Total Amount:* Rs. ${Number(finalRecordedTotal).toLocaleString()}`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Please find my order & invoice above. Kindly confirm dispatch and tracking details. Dhanyabad! 🙏`,
      ]
        .filter(Boolean)
        .join('\n');

      const directWaUrl = `https://wa.me/9779713888002?text=${encodeURIComponent(waInvoiceText)}`;
      setWhatsappLink(directWaUrl);

      // Trigger internal server notification webhook
      try {
        const notifyRes = await fetch('/api/orders/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: order.order_number,
            customerName: form.name,
            customerPhone: form.phone,
            customerEmail: form.email,
            shippingAddress: form.address,
            shippingCity: form.city,
            items: orderItems,
            total: finalRecordedTotal,
            subtotal,
            shippingFee: shipping,
            paymentMethod,
            isValley,
            hasReceipt: Boolean(receiptUrl),
            receiptUrl,
            paymentReference,
          }),
        });
        const notifyData = await notifyRes.json();
        if (notifyData.whatsappLink) {
          setWhatsappLink(notifyData.whatsappLink);
        }
      } catch {
        // Non-blocking
      }

      clearCart();
      setPlaced(true);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // ----------------------------------------------------
  // ORDER SUCCESS SCREEN
  // ----------------------------------------------------
  if (placed && placedOrder) {
    const isOrderReady = Boolean(receiptUrl || paymentMethod === 'fonepay');
    const finalAmount = Number(placedOrder.total) || total;

    const directWaLines = [
      `*🌿 Namaste Nature's Mud Nepal!*`,
      ``,
      `I have just placed an order on your website:`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Order:* #${placedOrder.order_number}`,
      `👤 *Customer:* ${form.name}`,
      `📱 *Phone:* ${form.phone}`,
      form.email ? `📧 *Email:* ${form.email}` : null,
      `📍 *Destination:* ${form.city} (${isValley ? 'Inside Kathmandu Valley' : 'Outside Valley Courier'})`,
      form.address ? `🏠 *Address:* ${form.address}` : null,
      ``,
      `💳 *Payment Method:* ${paymentMethod === 'fonepay' ? 'FonePay QR Advance' : 'Cash on Delivery (COD)'}`,
      paymentReference ? `🔢 *Reference ID:* ${paymentReference}` : null,
      receiptUrl ? `🧾 *Receipt Slip:* ${receiptUrl}` : null,
      `💰 *Total Amount:* Rs. ${Number(finalAmount).toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm my order and share the dispatch tracking details. Dhanyabad! 🙏`,
    ]
      .filter(Boolean)
      .join('\n');

    const effectiveWhatsAppLink =
      whatsappLink || `https://wa.me/9779713888002?text=${encodeURIComponent(directWaLines)}`;

    return (
      <>
        <div className="py-16 bg-[#FAF7F2] min-h-[85vh] flex items-center justify-center">
          <div className="mx-auto max-w-2xl px-4 w-full">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl text-center space-y-6">
              <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                <CheckCircle2 className="w-10 h-10 text-[#2D5A27] relative z-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isOrderReady ? 'Payment Received · Order Ready to Process' : 'Order Placed · Cash on Delivery'}
                </div>

                <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
                  {isOrderReady ? 'Your Order is Confirmed & Ready!' : 'Order Placed Successfully!'}
                </h1>

                <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-md mx-auto">
                  Thank you for choosing Nature&apos;s Mud Nepal. Your order has been registered in our central Kathmandu hub.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-gray-200 text-left space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Order Number</span>
                  <span className="font-mono font-bold text-base text-[#2D5A27]">{placedOrder.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Customer Name</span>
                  <span className="font-bold text-gray-900">{form.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Delivery Destination</span>
                  <span className="font-bold text-gray-900">
                    {form.city} ({isValley ? 'Inside Kathmandu Valley' : 'Outside Valley Courier'})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Payment Method</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {paymentMethod === 'fonepay' ? 'FonePay QR Advance' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-base font-black">
                  <span>Total Amount</span>
                  <span className="text-[#2D5A27]">{formatPrice(finalAmount)}</span>
                </div>
              </div>

              {/* Primary Actions: WhatsApp & Invoice */}
              <div className="space-y-3 pt-2">
                <a
                  href={effectiveWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order to WhatsApp (+977 9713888002)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#2D5A27] text-[#2D5A27] hover:bg-emerald-50 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-5 h-5" />
                  <span>View & Print Official Invoice</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Link
                    href={`/track-order?number=${placedOrder.order_number}`}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-[#2D5A27] hover:bg-[#23471e] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Live Order</span>
                  </Link>

                  <Link
                    href="/products"
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        {showInvoiceModal && (
          <OrderInvoice
            isModal
            onClose={() => setShowInvoiceModal(false)}
            order={{
              orderNumber: placedOrder.order_number || '#NM-ORDER',
              createdAt: placedOrder.created_at || new Date(),
              customerName: form.name,
              customerPhone: form.phone,
              customerEmail: form.email,
              shippingAddress: form.address,
              shippingCity: form.city,
              shippingProvince: form.province,
              deliveryRegion,
              items:
                Array.isArray(placedOrder.items) && placedOrder.items.length > 0
                  ? placedOrder.items
                  : [
                      {
                        name: 'Nature&apos;s Mud Himalayan Superfoods Package',
                        quantity: 1,
                        price: subtotal,
                      },
                    ],
              subtotal,
              shippingFee: shipping,
              discount,
              total: finalAmount,
              paymentMethod,
              paymentStatus: isOrderReady ? 'paid' : 'pending',
              paymentReference,
              receiptUrl: receiptUrl || undefined,
            }}
          />
        )}
      </>
    );
  }

  // ----------------------------------------------------
  // EMPTY CART
  // ----------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Truck className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-heading font-black text-3xl text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 text-sm mb-6">Explore our authentic Himalayan superfoods and powders.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2D5A27] text-white rounded-full font-bold text-sm hover:bg-[#23471e] transition-colors shadow-md"
          >
            Browse Authentic Products
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]';

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen text-[#2B2B2B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#2D5A27]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/cart" className="hover:text-[#2D5A27]">Cart</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#2D5A27] font-bold">Checkout & Payment</li>
          </ol>
        </nav>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mb-8">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Destination / Delivery Region Selector */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2D5A27]" /> 1. Delivery Destination in Nepal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryRegion('inside_valley')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isValley ? 'border-[#2D5A27] bg-[#FAF7F2] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">Inside Kathmandu Valley</span>
                    <input
                      type="radio"
                      name="deliveryRegion"
                      checked={isValley}
                      onChange={() => setDeliveryRegion('inside_valley')}
                      className="accent-[#2D5A27]"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Kathmandu, Lalitpur, Bhaktapur</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      Delivery: Rs. 100 (Free over Rs. 10,000)
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryRegion('outside_valley')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    !isValley ? 'border-[#C9982A] bg-[#FAF7F2] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">Outside Kathmandu Valley</span>
                    <input
                      type="radio"
                      name="deliveryRegion"
                      checked={!isValley}
                      onChange={() => setDeliveryRegion('outside_valley')}
                      className="accent-[#C9982A]"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Pokhara, Chitwan, Butwal, Biratnagar, etc.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Courier: Rs. 200 (Free over Rs. 10,000 · Advance FonePay)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Customer Shipping Information */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2D5A27]" /> 2. Customer & Delivery Address
                </h2>
                {currentUser ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#2D5A27] text-xs font-bold border border-emerald-200">
                    <User className="w-3.5 h-3.5" /> Registered Member ({currentUser.name})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    ⚡ Guest Checkout Enabled
                  </span>
                )}
              </div>

              {currentUser ? (
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-emerald-200/80 text-xs flex items-center justify-between text-emerald-950">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>
                      Welcome back, <strong>{currentUser.name}</strong>! Your registered contact details have been automatically filled below.
                    </span>
                  </div>
                  <Link
                    href="/account"
                    className="font-bold text-[#2D5A27] hover:underline shrink-0 ml-2 hidden sm:inline"
                  >
                    View Account
                  </Link>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs flex items-center justify-between text-amber-950">
                  <span>
                    No account? No problem! Complete your order as a guest below.
                  </span>
                  <Link
                    href="/account"
                    className="font-bold text-amber-900 hover:underline shrink-0 ml-2"
                  >
                    Log in / Register →
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Sushil Shrestha"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="sushil@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Street Address / Landmark *
                  </label>
                  <input
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={inputClass}
                    placeholder="House No, Tole, Chowk, Landmark (e.g. Near Kumari Bank)"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    City / Town *
                  </label>
                  <input
                    id="city"
                    required
                    value={form.city}
                    onChange={handleCityChange}
                    className={inputClass}
                    placeholder="Kathmandu"
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Province
                  </label>
                  <select
                    id="province"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className={inputClass}
                  >
                    {['Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim', 'Koshi', 'Madhesh'].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="note" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Order Note / Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="note"
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Please call before arriving or deliver between 2pm-5pm."
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method & FonePay QR Scanner */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h2 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2D5A27]" /> 3. Select Payment Method
              </h2>

              <div className="space-y-3">
                {/* FonePay QR Option */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'fonepay'
                      ? 'border-[#2D5A27] bg-[#FAF7F2] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="fonepay"
                    checked={paymentMethod === 'fonepay'}
                    onChange={() => setPaymentMethod('fonepay')}
                    className="accent-[#2D5A27] mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">FonePay QR & Mobile Banking</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Instant Scan
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay via any Nepal Banking App, FonePay, eSewa, Khalti, or ConnectIPS.
                    </p>
                  </div>
                  <QrCode className="w-6 h-6 text-[#2D5A27] shrink-0" />
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all ${
                    !isValley
                      ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                      : paymentMethod === 'cod'
                      ? 'border-[#2D5A27] bg-[#FAF7F2] shadow-sm cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    disabled={!isValley}
                    checked={paymentMethod === 'cod'}
                    onChange={() => isValley && setPaymentMethod('cod')}
                    className="accent-[#2D5A27] mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                      {!isValley && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Inside Valley Only
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isValley
                        ? 'Pay in cash when your fresh package arrives at your doorstep.'
                        : 'COD is not available for outside-valley courier shipments.'}
                    </p>
                  </div>
                  <Banknote className="w-6 h-6 text-gray-400 shrink-0" />
                </label>
              </div>

              {/* FonePay QR Scanner Container */}
              {paymentMethod === 'fonepay' && (
                <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#2D5A27]/30 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Official QR Code Image */}
                    <div className="w-56 h-auto bg-white p-3 rounded-2xl border border-gray-300 shadow-md shrink-0 flex flex-col items-center">
                      <div className="relative w-48 h-56">
                        <Image
                          src="/images/krisha-fonepay-qr.png"
                          alt="Krisha Agri Line Pvt Ltd FonePay QR Scanner"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 mt-1">Scan to Pay via any Banking/Wallet App</span>
                    </div>

                    {/* Merchant & Terminal Details */}
                    <div className="flex-1 space-y-3 text-xs w-full">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase text-[#2D5A27] tracking-wider">
                          Official Merchant Account
                        </span>
                        <h4 className="text-base font-black text-gray-900 font-heading">
                          KRISHA AGRI LINE PVT LTD
                        </h4>
                        <p className="text-gray-500">Bank Branch: KALANKI BRANCH</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Terminal Number</p>
                          <p className="font-mono font-bold text-gray-800 text-sm">2222410021365126</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('2222410021365126', 'terminal')}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'terminal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'terminal' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-emerald-700 uppercase font-bold">Exact Payable Amount</p>
                          <p className="font-mono font-bold text-emerald-900 text-base">{formatPrice(total)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(total), 'amount')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'amount' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedField === 'amount' ? 'Copied' : 'Copy Amount'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Payment Slip Upload */}
                  <div className="pt-4 border-t border-gray-200/80 space-y-3">
                    <label className="block text-xs font-black uppercase text-gray-800 tracking-wider">
                      Upload Payment Screenshot / Slip Photo *
                    </label>

                    {receiptPreview ? (
                      <div className="p-3 rounded-2xl bg-white border border-emerald-300 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <Image src={receiptPreview} alt="Receipt slip" fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-emerald-800 truncate">
                              {receiptFile?.name || 'Payment Receipt Uploaded'}
                            </p>
                            <p className="text-[11px] text-emerald-600">
                              {isUploadingReceipt ? 'Uploading receipt...' : '✓ Slip verified & attached to order'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeReceipt}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Remove receipt"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 hover:border-[#2D5A27] bg-white rounded-2xl cursor-pointer transition-colors text-center space-y-2">
                        <Upload className="w-8 h-8 text-[#2D5A27]" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Click to Upload or Drag & Drop Payment Slip
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    <div>
                      <label htmlFor="txn" className="block text-xs font-medium text-gray-600 mb-1">
                        Transaction ID / Reference Number (Optional)
                      </label>
                      <input
                        id="txn"
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g. FONE-9823412 or Bank Ref #"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-[#2D5A27]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Order Summary, Coupon & Action */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-heading font-black text-xl text-gray-900">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-gray-100 pr-1">
                {items.map((item) => {
                  const product = resolveCartProduct(item);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                        <span className="absolute -top-1 -right-1 bg-[#2D5A27] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                        {product.weight && (
                          <p className="text-[11px] text-gray-500">
                            Net Wt: {/^\d+(\.00)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)} GM` : product.weight}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-black text-gray-900 shrink-0">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Box */}
              <div className="pt-3 border-t border-gray-200">
                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#2D5A27]" />
                      <div>
                        <p className="text-xs font-bold text-[#2D5A27]">
                          Coupon {appliedCoupon.code} Applied
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          Saved {formatPrice(discount)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="coupon" className="block text-xs font-bold text-gray-700">
                      Apply Coupon / Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="coupon"
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="WELCOME10 / FESTIVAL15"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCodeInput.trim()}
                        className="px-4 py-2 bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                      >
                        {isValidatingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
                    {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Cost Calculation */}
              <div className="space-y-2 text-xs border-t border-gray-200 pt-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#2D5A27] font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    Delivery ({isValley ? 'Kathmandu Valley' : 'Outside Valley Courier'})
                  </span>
                  <span className="font-bold text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-black">
                        FREE (Over {formatPrice(freeShippingThreshold)})
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-black text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#2D5A27] text-lg font-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={placing || isUploadingReceipt}
                className="w-full py-4 rounded-2xl bg-[#2D5A27] hover:bg-[#23471e] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {placing
                    ? 'Processing Order…'
                    : isUploadingReceipt
                    ? 'Uploading Receipt…'
                    : paymentMethod === 'fonepay'
                    ? `Confirm Payment & Place Order · ${formatPrice(total)}`
                    : `Place Cash on Delivery Order · ${formatPrice(total)}`}
                </span>
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-500 space-y-1">
                <p className="flex items-center justify-center gap-1 font-semibold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Secure Himalayan Nutrition Checkout
                </p>
                <p>Questions? Call/WhatsApp: +977 9802323451</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}