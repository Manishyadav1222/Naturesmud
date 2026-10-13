'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, Tag, ShieldCheck, Truck, Gift, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, FREE_SHIPPING_THRESHOLD, resolveCartProduct } from '@/lib/store/cart-store';
import { DASHAIN_OFFER_CONFIG } from '@/lib/data/dashain-offer';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const freePinkSaltThreshold = DASHAIN_OFFER_CONFIG.freePinkSaltThreshold; // 5000
  const unlockedFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const unlockedFreePinkSalt = subtotal >= freePinkSaltThreshold;
  const shipping = unlockedFreeShipping || subtotal === 0 ? 0 : 100;
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  if (!mounted) {
    return (
      <div className="py-24 bg-white min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3A6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="font-heading font-bold text-3xl mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Enjoy Free Delivery over Rs. 3,000 &amp; Free Himalayan Pink Salt over Rs. 5,000+ (Valid till Dashain End)!</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-[#3A6B35] text-white rounded-full font-semibold hover:bg-[#2d5429] transition-colors">
            <ShoppingBag className="w-5 h-5" /> Shop Dashain Offer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#3A6B35] font-medium">Cart</li>
          </ol>
        </nav>

        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B] mb-4">Shopping Cart</h1>

        {/* 🎉 Glowing Dashain Offer Banner on Cart Page */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#5a0b0b] via-[#8b1515] to-[#1a3826] p-4 sm:p-5 text-white border-2 border-amber-400/60 shadow-lg dashain-glow-box">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-[#4a0808] text-[10px] font-black uppercase tracking-wider mb-1">
                🎉 Dashain Blessings &amp; Health Offer Active · Valid Till Dashain End
              </span>
              <p className="font-heading text-sm sm:text-lg font-black text-amber-200 dashain-glow-text">
                {unlockedFreeShipping ? '✓ FREE Delivery Unlocked!' : `🚚 Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for FREE Delivery`} · {unlockedFreePinkSalt ? '✓ FREE Pink Salt (200g) Unlocked!' : `🎁 Add ${formatPrice(freePinkSaltThreshold - subtotal)} for FREE Pink Salt (200g)!`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = resolveCartProduct(item);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex gap-4 sm:gap-6 p-4 bg-[#F8F4EC] rounded-2xl border border-amber-200/60">
                  <Link href={`/products/${product.slug}`} className="shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={product.image || '/products/naturesmud-all-products-100g.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link href={`/products/${product.slug}`} className="font-heading font-semibold hover:text-[#3A6B35] transition-colors line-clamp-1">
                          {product.name}
                        </Link>
                        {product.weight && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Net Wt: {/^\d+(\.00)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)} GM` : product.weight}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-[#3A6B35] font-bold">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0" aria-label={`Remove ${product.name}`}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:text-[#3A6B35]" aria-label="Decrease quantity">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:text-[#3A6B35]" aria-label="Increase quantity">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-lg text-[#2B2B2B]">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Complimentary Free Himalayan Pink Salt Gift Row when subtotal >= Rs. 5,000 */}
            {unlockedFreePinkSalt && (
              <div className="flex gap-4 sm:gap-6 p-4 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 rounded-2xl border-2 border-rose-300 shadow-sm">
                <div className="shrink-0 relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-rose-200">
                  <Image
                    src={DASHAIN_OFFER_CONFIG.freeGiftProduct.image}
                    alt={DASHAIN_OFFER_CONFIG.freeGiftProduct.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                    <Gift className="w-3 h-3" /> Dashain Bonus Gift (Orders Over Rs. 5,000+)
                  </span>
                  <h3 className="font-heading font-bold text-gray-900">
                    {DASHAIN_OFFER_CONFIG.freeGiftProduct.name} ({DASHAIN_OFFER_CONFIG.freeGiftProduct.weight})
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    100% Pure Himalayan Pink Salt Jar included FREE with your Dashain order!
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-black text-emerald-700 text-sm">FREE (Rs. 0)</span>
                    <span className="text-xs text-gray-400 line-through">Rs. {DASHAIN_OFFER_CONFIG.freeGiftProduct.originalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F8F4EC] rounded-2xl p-6 sticky top-24 border border-amber-200/80">
              <h2 className="font-heading font-bold text-xl mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label htmlFor="coupon" className="text-sm font-medium mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]"
                  />
                  <button
                    onClick={() => {
                      if (coupon.trim()) setCouponApplied(true);
                    }}
                    className="px-4 py-2.5 bg-[#3A6B35] text-white rounded-full text-sm font-semibold hover:bg-[#2d5429] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="flex items-center gap-1 text-xs text-green-700 font-bold mt-2">
                    <Tag className="w-3.5 h-3.5" /> Coupon Applied!
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {couponApplied && discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Promo Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-emerald-700">{shipping === 0 ? 'FREE (Over Rs. 3,000)' : formatPrice(shipping)}</span>
                </div>
                {unlockedFreePinkSalt && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>🎁 Free Pink Salt (200g)</span>
                    <span>FREE</span>
                  </div>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-[#3A6B35] text-lg font-black">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-[#3A6B35] text-white text-center rounded-full font-bold hover:bg-[#2d5429] transition-all mt-6 shadow-md"
              >
                Proceed to Checkout
              </Link>
              <Link href="/products" className="block w-full py-3 text-center text-sm text-[#3A6B35] font-medium hover:underline mt-2">
                Continue Shopping
              </Link>

              <div className="mt-6 space-y-2 text-xs text-gray-600 border-t border-gray-200 pt-4">
                <p className="flex items-center gap-2 font-semibold text-emerald-800"><Truck className="w-4 h-4 text-[#3A6B35]" /> Free delivery over {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
                <p className="flex items-center gap-2 font-semibold text-rose-800"><Gift className="w-4 h-4 text-rose-600" /> Free Delivery + Free Pink Salt over Rs. 5,000+</p>
                <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#3A6B35]" /> Secure payment with COD, FonePay, eSewa &amp; Khalti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}