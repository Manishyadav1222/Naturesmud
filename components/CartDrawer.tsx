'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD, resolveCartProduct } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

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
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Your Cart
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-cream/50 border-b border-gray-100">
                <p className="text-xs text-dark/70 mb-2">
                  {remainingForFreeShipping > 0 ? (
                    <>
                      Add <span className="font-semibold text-primary">{formatPrice(remainingForFreeShipping)}</span> more for FREE shipping!
                    </>
                  ) : (
                    <span className="font-semibold text-primary">🎉 You've unlocked FREE shipping!</span>
                  )}
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="font-heading font-semibold text-dark mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mb-6">Discover our premium organic products</p>
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const product = resolveCartProduct(item);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex gap-4 py-3 border-b border-gray-50">
                      <Link href={`/products/${product.slug}`} onClick={closeDrawer} className="shrink-0 relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={product.image || '/products/naturesmud-all-products-100g.jpg'}
                          alt={product.name}
                          fill
                          sizes="80px"
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
                        <p className="text-xs text-gray-500 mt-0.5">{product.weight}</p>
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
                          <span className="font-semibold text-sm">
                            {formatPrice(product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full py-3.5 bg-primary text-white text-center rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block w-full py-3 text-center text-primary font-medium text-sm hover:underline"
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