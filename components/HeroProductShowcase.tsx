'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Star, ArrowRight, Eye, ShoppingBag, Zap } from 'lucide-react';
import { products } from '@/lib/data/products';
import { resolveImageUrl } from '@/lib/utils';
import { useUIStore } from '@/lib/store/ui-store';

export default function HeroProductShowcase() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { openQuickView } = useUIStore();

  // Auto-rotate every 5 seconds
  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
  }, [bestSellers.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const current = bestSellers[currentIndex];

  const handleQuickView = (e: React.MouseEvent, productSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.slug === productSlug);
    if (product) {
      openQuickView(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, productSlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.slug === productSlug);
    if (product) {
      openQuickView(product.id);
      // The quick view modal will handle adding to cart
    }
  };

  // Floating particles data
  const particles = [
    { top: '10%', left: '8%', size: 6, color: 'bg-gold/30', delay: '0s', duration: '4s' },
    { top: '25%', left: '85%', size: 4, color: 'bg-primary/20', delay: '0.5s', duration: '3.5s' },
    { top: '70%', left: '5%', size: 5, color: 'bg-secondary/25', delay: '1s', duration: '5s' },
    { top: '80%', left: '80%', size: 3, color: 'bg-gold/25', delay: '1.5s', duration: '4.5s' },
    { top: '45%', left: '92%', size: 4, color: 'bg-primary/15', delay: '2s', duration: '3s' },
    { top: '15%', left: '70%', size: 3, color: 'bg-gold/20', delay: '2.5s', duration: '5.5s' },
  ];

  return (
    <div className="relative h-[490px] sm:h-[550px] w-full max-w-[580px] overflow-hidden sm:overflow-visible">
      {/* Large circular product showcase */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[280px] xs:w-[320px] sm:w-[380px] md:w-[420px] h-[280px] xs:h-[320px] sm:h-[380px] md:h-[420px] max-w-[92vw] max-h-[92vw]">
        {/* Multiple subtle rings */}
        <div className="absolute inset-0 rounded-full border border-primary/15" />
        <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/20" />
        <div className="absolute inset-8 rounded-full border border-gold/30" />
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/5 to-gold/5" />
        
        {/* Soft shadow glow */}
        <div className="absolute inset-0 rounded-full shadow-[0_30px_80px_rgba(58,107,53,0.12)]" />

        {/* Weight badge */}
        <AnimatePresence>
          <motion.div
            key={`badge-${current.slug}`}
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-full px-6 py-2 shadow-[0_8px_24px_rgba(217,164,65,0.35)] text-sm font-bold tracking-wide">
              {current.weight}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main product image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, scale: 0.5, y: 120, x: 0, rotate: direction === 1 ? -12 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -60, x: 0, rotate: direction === 1 ? 8 : -8 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-6 sm:inset-8"
          >
            <Link href={`/products/${current.slug}`} className="block w-full h-full group/heroimg">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-secondary-100 via-cream-100 to-primary-100 shadow-[0_25px_70px_rgba(58,107,53,0.2)] ring-4 ring-white/60 group-hover/heroimg:scale-105 transition-transform duration-300">
                <Image
                  src={resolveImageUrl(current.image)}
                  alt={current.name}
                  fill
                  priority
                  onError={(e: any) => {
                    e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                  }}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Decorative organic leaves */}
        <div className="absolute -top-4 -right-2 w-10 h-10 z-10 rotate-12 pointer-events-none">
          <Leaf className="w-full h-full text-primary/50 drop-shadow-lg" />
        </div>
        <div className="absolute -bottom-4 -left-3 w-7 h-7 z-10 -rotate-12 pointer-events-none">
          <Leaf className="w-full h-full text-gold-500/60 drop-shadow-lg" />
        </div>
      </div>

      {/* Premium product card - overlapping bottom center */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${current.slug}`}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[340px] bg-white rounded-3xl shadow-[0_12px_36px_rgba(43,43,43,0.10)] border border-ink/8 p-4 sm:p-5 hover:shadow-[0_20px_50px_rgba(43,43,43,0.14)] hover:-translate-y-0.5 transition-all duration-300 z-30"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-[10px] font-bold uppercase tracking-widest text-gold-600 mb-1"
          >
            {(typeof current.category === 'object' && current.category !== null ? (current.category as any)?.name : current.category) || 'Superfood'} · Best Seller
          </motion.p>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link href={`/products/${current.slug}`}>
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-heading font-bold text-lg text-ink leading-tight hover:text-primary transition-colors"
                >
                  {current.name}
                </motion.h3>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-1 mt-1.5"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(current.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-[10px] text-ink/60 ml-1 font-semibold">{current.rating}</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/products/${current.slug}`}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white hover:shadow-[0_8px_24px_rgba(58,107,53,0.35)] hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                aria-label={`View ${current.name}`}
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex items-center justify-between mt-3 border-t border-ink/5 pt-3"
          >
            <div>
              <p className="font-heading font-bold text-xl text-primary">Rs. {current.price.toLocaleString()}</p>
              {current.compareAtPrice && (
                <p className="text-[11px] text-ink/40 line-through">Rs. {current.compareAtPrice.toLocaleString()}</p>
              )}
            </div>

            <Link
              href={`/products/${current.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 mt-3"
          >
            <button
              onClick={(e) => handleQuickView(e, current.slug)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-primary border border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105"
              aria-label={`Quick view ${current.name}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={(e) => handleAddToCart(e, current.slug)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105"
              aria-label={`Add ${current.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dot controls */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {bestSellers.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-gradient-to-r from-primary to-gold' : 'w-2 bg-ink/20 hover:bg-ink/40'
            } h-2 rounded-full`}
            aria-label={`Show ${p.name}`}
          />
        ))}
      </div>
    </div>
  );
}