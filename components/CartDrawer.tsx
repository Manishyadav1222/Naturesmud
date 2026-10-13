'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles, Gift, Truck } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD, resolveCartProduct } from '@/lib/store/cart-store';
import { DASHAIN_OFFER_CONFIG } from '@/lib/data/dashain-offer';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const freePinkSaltThreshold = DASHAIN_OFFER_CONFIG.freePinkSaltThreshold; // 5000
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const remainingForFreePinkSalt = Math.max(0, freePinkSaltThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freePinkSaltThreshold) * 100);
  const unlockedFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const unlockedFreePinkSalt = subtotal >= freePinkSaltThreshold;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#5a0b0b] via-[#7f1d1d] to-[#1a3826] text-white">
              <div>
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-300" /> Your Dashain Cart
                </h2>
                <p className="text-[11px] text-amber-200 font-semibold">
                  🎉 Free Delivery &gt; Rs. 3,000 · Free Pink Salt &gt; Rs. 5,000+
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-white/15 rounded-full transition-colors text-white"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Tier Dashain Milestone Progress (Free Delivery > 3,000 & Free Pink Salt > 5,000) */}
            {items.length > 0 && (
              <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50 via-red-50/60 to-amber-50 border-b border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-[#5a0b0b]">
                  {!unlockedFreeShipping ? (
                    <p className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Add <strong className="text-red-700">{formatPrice(remainingForFreeShipping)}</strong> more for <strong>FREE Delivery</strong> (&amp; {formatPrice(remainingForFreePinkSalt)} for Free Pink Salt)!
                      </span>
                    </p>
                  ) : !unlockedFreePinkSalt ? (
                    <p className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        ✅ <strong>FREE Delivery Unlocked!</strong> Add <strong className="text-red-700">{formatPrice(remainingForFreePinkSalt)}</strong> more for a <strong>FREE Himalayan Pink Salt (200g)</strong>!
                      </span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 text-emerald-800">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        🎉 <strong>All Dashain Rewards Unlocked:</strong> FREE Delivery + FREE Himalayan Pink Salt!
                      </span>
                    </p>
                  )}
                </div>
                <div className="relative h-2 bg-amber-200/70 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8b1515] via-amber-500 to-emerald-600 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                  <span className={unlockedFreeShipping ? 'text-emerald-700 font-black' : ''}>
                    {unlockedFreeShipping ? '✓ ' : ''}Rs. 3,000 Free Delivery
                  </span>
                  <span className={unlockedFreePinkSalt ? 'text-rose-700 font-black' : ''}>
                    {unlockedFreePinkSalt ? '✓ ' : ''}Rs. 5,000 Free Pink Salt
                  </span>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="font-heading font-semibold text-dark mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mb-6">Enjoy Free Delivery over Rs. 3,000 &amp; Free Pink Salt over Rs. 5,000!</p>
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    Shop Dashain Offer
                  </Link>
                </div>
              ) : (
                <>
                  {items.map((item) => {
                    const product = resolveCartProduct(item);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex gap-4 py-3 border-b border-gray-50">
                        <Link href={`/products/${product.slug}`} onClick={closeDrawer} className="shrink-0 relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={resolveImageUrl(product.image)}
                            alt={product.name}
                            fill
                            sizes="80px"
                            onError={(e: any) => {
                              e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                            }}
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeDrawer}
                              className="font-medium text-sm text-dark hover:text-primary line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {product.weight && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Net Wt: {/^\d+(\.00)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)} GM` : product.weight}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1.5 hover:text-primary"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1.5 hover:text-primary"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="font-semibold text-sm text-dark">
                              {formatPrice(product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Automatic Free Himalayan Pink Salt Gift Item when Subtotal >= Rs. 5,000 */}
                  {unlockedFreePinkSalt && (
                    <div className="flex gap-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300/80 shadow-xs">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-rose-200 shrink-0">
                        <Image
                          src={DASHAIN_OFFER_CONFIG.freeGiftProduct.image}
                          alt={DASHAIN_OFFER_CONFIG.freeGiftProduct.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider mb-0.5">
                          🎁 Free Dashain Gift Unlocked!
                        </span>
                        <p className="font-heading font-bold text-xs text-gray-900">
                          {DASHAIN_OFFER_CONFIG.freeGiftProduct.name} ({DASHAIN_OFFER_CONFIG.freeGiftProduct.weight})
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-emerald-700">FREE (Rs. 0)</span>
                          <span className="text-[11px] text-gray-400 line-through">
                            Rs. {DASHAIN_OFFER_CONFIG.freeGiftProduct.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-2.5 bg-[#FAF8F5]">
                <div className="flex justify-between text-base font-black text-gray-900">
                  <span>Subtotal</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {unlockedFreeShipping
                    ? '✓ FREE Delivery Unlocked!'
                    : 'Free delivery on orders over Rs. 3,000'}
                  {unlockedFreePinkSalt ? ' + ✓ FREE Pink Salt Gift Included!' : ''}
                </p>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full py-3.5 bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#1a3826] text-white text-center rounded-full font-bold hover:brightness-110 transition-all shadow-md"
                >
                  Proceed to Dashain Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block w-full py-2 text-center text-primary font-medium text-sm hover:underline"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}