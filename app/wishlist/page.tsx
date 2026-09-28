'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useCartStore } from '@/lib/store/cart-store';
import { products, getProductBySlug, getProductById } from '@/lib/data/products';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items: wishlistSlugs, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    // Fetch live products from API to ensure current pricing and weights
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveProducts(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setLiveProducts(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 bg-white min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3A6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Resolve wishlist items from live products or local catalog
  const wishlistProducts = wishlistSlugs
    .map((slugOrId) => {
      const live = liveProducts.find((p) => p.slug === slugOrId || String(p.id) === String(slugOrId));
      if (live) return live;
      return getProductBySlug(slugOrId) || getProductById(slugOrId);
    })
    .filter((p): p is Product => Boolean(p));

  const handleAddToCart = (product: Product) => {
    addItemToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.slug]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.slug]: false }));
    }, 2000);
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((p) => addItemToCart(p));
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
            <Heart className="w-10 h-10 text-rose-400 stroke-[1.5]" />
          </div>
          <h1 className="font-heading font-black text-3xl text-gray-900 mb-3">Your Wishlist is Empty</h1>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Save your favorite Himalayan superfoods, pure wild honey, and cold-pressed oils here for easy shopping anytime.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3A6B35] text-white rounded-full font-bold text-sm hover:bg-[#2d5429] transition-all shadow-md hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4" /> Explore Himalayan Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white min-h-[75vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#3A6B35] font-semibold">Wishlist</li>
          </ol>
        </nav>

        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-gray-100 mb-8">
          <div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#2B2B2B] flex items-center gap-3">
              <span>My Wishlist</span>
              <span className="text-sm px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Products you’ve saved for healthy living in Nepal.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3A6B35] text-white font-bold text-xs sm:text-sm hover:bg-[#2d5429] transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-gray-600 font-medium text-xs sm:text-sm hover:bg-gray-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => {
            const isAdded = Boolean(addedIds[p.slug]);
            const weightFormatted = p.weight
              ? /^[0-9]+(\.[0-9]+)?$/.test(p.weight.trim())
                ? `${parseFloat(p.weight)} GM`
                : p.weight
              : '100 GM';

            return (
              <div
                key={p.slug}
                className="group relative bg-[#FAF7F2] rounded-3xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeItem(p.slug)}
                  className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-white transition-all shadow-xs"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  {/* Image */}
                  <Link href={`/products/${p.slug}`} className="block relative w-full aspect-square rounded-2xl overflow-hidden bg-white mb-4">
                    <Image
                      src={p.image || (Array.isArray(p.images) ? p.images[0] : '/products/sweet-potato-powder.jpg')}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Category & Weight */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium text-[#3A6B35] uppercase tracking-wider text-[10px]">{p.category || 'Organic'}</span>
                    <span>{weightFormatted}</span>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-heading font-bold text-base text-gray-900 group-hover:text-[#3A6B35] transition-colors line-clamp-1 mb-2">
                      {p.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-heading font-extrabold text-lg text-[#2B2B2B]">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="pt-2 border-t border-gray-200/50">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`w-full py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#3A6B35] text-white hover:bg-[#2d5429] shadow-xs'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdded ? 'Added to Cart! ✓' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Guarantee Footer */}
        <div className="mt-16 bg-[#F8F4EC] rounded-3xl p-6 sm:p-8 border border-gray-200/70 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-7 h-7 text-[#3A6B35]" />
            <h4 className="font-heading font-bold text-sm text-gray-900">Free Fast Delivery</h4>
            <p className="text-xs text-gray-600">On all orders over Rs. 3,000 across Nepal</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#3A6B35]" />
            <h4 className="font-heading font-bold text-sm text-gray-900">100% Authentic Quality</h4>
            <p className="text-xs text-gray-600">0 Chemicals · 0 Artificial Colors · Clean Nutrition</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#3A6B35]" />
            <h4 className="font-heading font-bold text-sm text-gray-900">Himalayan Sourced</h4>
            <p className="text-xs text-gray-600">Directly from high-altitude local cooperatives</p>
          </div>
        </div>

      </div>
    </div>
  );
}
