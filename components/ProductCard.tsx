'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Eye, Star, Leaf, BadgeCheck, Zap, Check } from 'lucide-react';
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
  const frontImg = resolveImageUrl(product.image);
  const secondaryImg = Array.isArray(product.images) && product.images.length > 1 && product.images[1] !== product.image
    ? resolveImageUrl(product.images[1])
    : null;

  const [imgSrc, setImgSrc] = useState(() => frontImg);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setImgSrc(frontImg);
  }, [frontImg]);

  // Format category name cleanly
  const categoryName = typeof product.category === 'object' && product.category !== null
    ? (product.category as any)?.name || 'Organic'
    : product.category || 'Superfood';

  // Format packaging & weight
  const displayWeight = product.weight
    ? /^\d+(\.00)?$/.test(product.weight.trim())
      ? `${parseFloat(product.weight)} GM`
      : product.weight
    : '100 GM';

  // Fallback description tailored for luxury apothecary feel
  const displayDesc = product.shortDescription ||
    (product.description && product.description.slice(0, 110) + '...') ||
    '100% pure Himalayan single-ingredient botanical nutrition, lab-tested with zero additives.';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    toast.success(`${product.name} added to cart`, {
      description: `${displayWeight} · ${formatPrice(product.price)}`,
    });
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    useCartStore.getState().closeDrawer();
    router.push('/checkout');
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EBE4D5] hover:border-[#C5A059] shadow-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Media Container */}
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
          {/* Primary Product Photo */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 4}
            onError={() => setImgSrc('/products/naturesmud-all-products-100g.jpg')}
            className={classNames(
              'object-cover transition-all duration-700',
              secondaryImg ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
            )}
          />

          {/* Secondary Photo on Hover */}
          {secondaryImg && (
            <Image
              src={secondaryImg}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-700"
            />
          )}

          {/* Top Left Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount && (
              <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:py-1 rounded-full shadow-sm shadow-red-600/30">
                -{discount}% OFF
              </span>
            )}
            {badges.includes('bestseller') && (
              <span className="bg-[#143020] text-[#E8D5A3] border border-gold/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                ⭐ Bestseller
              </span>
            )}
          </div>

          {/* Top Right Organic / Purity Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 shadow-xs border border-emerald-200">
              <Leaf className="w-2.5 h-2.5 text-emerald-600" />
              100% Pure
            </span>
          </div>

          {/* Quick Floating Actions (Heart & Eye) */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(product.id);
              }}
              className={classNames(
                'p-2 rounded-full bg-white shadow-md hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer',
                inWishlist ? 'text-red-500' : 'text-gray-700'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              title="Add to Wishlist"
            >
              <Heart className="w-3.5 h-3.5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const { openQuickView } = useUIStore.getState();
                openQuickView(product.id);
              }}
              className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-emerald-800 hover:text-white transition-all cursor-pointer"
              aria-label="Quick view"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom subtle gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill & Bestseller check */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/50">
              {categoryName}
            </span>
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-600" />
                Verified
              </span>
            )}
          </div>

          {/* Product Title with Link */}
          <Link href={`/products/${product.slug}`} className="block group/link">
            <h3 className="font-heading font-bold text-[#143020] text-sm sm:text-base line-clamp-1 group-hover/link:text-emerald-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating Capsule: ★ 4.9 (64) */}
          <div className="mt-1 flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px] font-bold">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              ({product.reviewCount || 64} reviews)
            </span>
          </div>

          {/* Descriptive Subtitle / Benefit */}
          <p className="mt-1.5 text-xs text-ink/65 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>

        {/* Price, Weight & Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-ink/8">
          {/* Price & Weight Row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-[#143020] text-base sm:text-lg">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#7A5230] bg-[#FAF5EB] px-2 py-0.5 rounded-md border border-[#E8DEC9]">
              {displayWeight}
            </span>
          </div>

          {/* Action Buttons: ADD & BUY NOW */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`py-2 px-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1 transition-all border cursor-pointer active:scale-95 ${
                justAdded
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#143020] hover:text-emerald-900 border-ink/10'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            {/* Buy Now Button (Instant Direct Checkout) */}
            <button
              onClick={handleBuyNow}
              className="py-2 px-2 rounded-xl bg-gradient-to-r from-[#C9982A] via-[#D9A441] to-[#B88720] hover:brightness-105 text-gray-950 font-heading font-black text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label={`Buy ${product.name} now`}
            >
              <Zap className="w-3.5 h-3.5 fill-current text-gray-950" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}