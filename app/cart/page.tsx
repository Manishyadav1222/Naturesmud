'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useState } from 'react';
import { useCartStore, FREE_SHIPPING_THRESHOLD, resolveCartProduct } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 100;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="font-heading font-bold text-3xl mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Discover our premium organic products and add something healthy to your cart.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-[#3A6B35] text-white rounded-full font-semibold hover:bg-[#2d5429] transition-colors">
            <ShoppingBag className="w-5 h-5" /> Start Shopping
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

        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = resolveCartProduct(item);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex gap-4 sm:gap-6 p-4 bg-[#F8F4EC] rounded-2xl">
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
                        <p className="text-sm text-gray-500 mt-0.5">{product.weight}</p>
                        <p className="text-sm text-[#3A6B35] font-medium mt-1">{formatPrice(product.price)}</p>
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
                      <span className="font-bold text-lg">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F8F4EC] rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading font-bold text-xl mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label htmlFor="coupon" className="text-sm font-medium mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="e.g. NATURE10"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7AA95C]"
                  />
                  <button
                    onClick={() => setCouponApplied(true)}
                    className="px-4 py-2.5 bg-[#3A6B35] text-white rounded-full text-sm font-semibold hover:bg-[#2d5429] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="flex items-center gap-1 text-xs text-green-600 mt-2">
                    <Tag className="w-3.5 h-3.5" /> 10% discount applied!
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-[#3A6B35] text-white text-center rounded-full font-semibold hover:bg-[#2d5429] transition-colors mt-6"
              >
                Proceed to Checkout
              </Link>
              <Link href="/products" className="block w-full py-3 text-center text-sm text-[#3A6B35] font-medium hover:underline mt-2">
                Continue Shopping
              </Link>

              <div className="mt-6 space-y-2 text-xs text-gray-500 border-t border-gray-200 pt-4">
                <p className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#3A6B35]" /> Free delivery over Rs. 10,000</p>
                <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#3A6B35]" /> Secure payment with eSewa, Khalti & more</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}