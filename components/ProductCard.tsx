'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Leaf, BadgeCheck, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, calculateDiscount, resolveImageUrl } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useUIStore } from '@/lib/store/ui-store';
import { classNames } from '@/lib/utils';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const [imgSrc, setImgSrc] = useState(() => resolveImageUrl(product.image));

  useEffect(() => {
    setImgSrc(resolveImageUrl(product.image));
  }, [product.image]);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          onError={() => setImgSrc('/products/naturesmud-all-products-100g.jpg')}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm shadow-red-500/20">
              -{discount}%
            </span>
          )}
          {badges.includes('bestseller') && (
            <span className="bg-gold text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
              ⭐ Bestseller
            </span>
          )}
        </div>

        {/* Organic badge top-right */}
        {badges.includes('organic') && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-semibold text-primary shadow-xs">
              <Leaf className="w-3 h-3" />
              Organic
            </span>
          </div>
        )}

        {/* Quick actions slide-up on hover */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product.id);
            }}
            className={classNames(
              'p-2.5 rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors',
              inWishlist ? 'text-red-500' : 'text-dark'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { openQuickView } = useUIStore.getState();
              openQuickView(product.id);
            }}
            className="p-2.5 rounded-full bg-white shadow-md text-dark hover:bg-primary hover:text-white transition-all"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent group-hover:from-[#82c884]/10 to-transparent transition-all duration-500" />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-primary font-medium uppercase tracking-wider">
              {typeof product.category === 'object' && product.category !== null
                ? (product.category as any)?.name || 'Organic'
                : product.category || 'Organic'}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="mt-1 font-heading font-semibold text-dark text-sm sm:text-base line-clamp-1 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          {product.isBestSeller && (
            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-gold-600">
              <BadgeCheck className="w-4 h-4 text-gold" />
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={classNames(
                  'w-3.5 h-3.5',
                  i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">({product.reviewCount})</span>
          <span className="text-xs text-ink/50 ml-1">{product.rating}</span>
        </div>

        {/* Short desc */}
        <p className="mt-2 text-xs text-ink/50 line-clamp-2">{product.shortDescription}</p>

        {/* Price & Actions */}
        <div className="mt-3 border-t border-ink/5 pt-3">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-bold text-dark text-lg leading-none">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            {product.weight && (
              <span className="text-[11px] font-mono text-ink/50 bg-cream-100 px-2 py-0.5 rounded-md">
                {/^\d+(\.00)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)} GM` : product.weight}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="py-2 px-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink/80 hover:text-primary font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-ink/5 cursor-pointer active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
                useCartStore.getState().closeDrawer();
                router.push('/checkout');
              }}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#E8B859] to-[#C9982A] text-white hover:brightness-105 font-heading font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
              aria-label={`Buy ${product.name} now`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}