'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface MobileStickyAddToCartProps {
  product: Product;
}

export default function MobileStickyAddToCart({ product }: MobileStickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past initial hero/gallery fold (>400px)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    openDrawer();
  };

  if (!isVisible) return null;

  const officialName = product.official_label_name || product.name;
  const weight = product.weight || '100 GM';

  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D6] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2.5 transition-transform duration-300 transform translate-y-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Name/Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] relative overflow-hidden border border-[#EAE3D6] shrink-0">
            <Image
              src={product.image || '/products/naturesmud-all-products-100g.jpg'}
              alt={officialName}
              fill
              unoptimized
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <div className="font-heading font-bold text-xs sm:text-sm text-[#1A3826] truncate">
              {officialName}
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-extrabold text-[#1A3826]">
                {formatPrice(product.price)}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500 font-medium">{weight}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-full bg-[#1A3826] hover:bg-[#254d35] active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
