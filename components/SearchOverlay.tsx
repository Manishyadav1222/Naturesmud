'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, TrendingUp, Sparkles, Leaf } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { products } from '@/lib/data/products';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, searchQuery: initialSearchQuery } = useUIStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery(initialSearchQuery || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen, initialSearchQuery]);
  const results = query
    ? products.filter(
        (p) => {
          const catStr = typeof p.category === 'object' && p.category !== null ? ((p.category as any)?.name || '') : (p.category || '');
          return (
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            catStr.toLowerCase().includes(query.toLowerCase()) ||
            (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
          );
        }
      )
    : [];

  const trendingSearches = ['honey', 'almonds', 'chia', 'moringa', 'turmeric'];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-3xl px-4 py-6">
              <div className="flex items-center gap-3 border-b-2 border-primary pb-3">
                <Search className="w-5 h-5 text-primary" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, recipes..."
                  className="flex-1 text-lg outline-none placeholder-gray-400"
                  aria-label="Search products"
                />
                <button
                  onClick={closeSearch}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {query ? (
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="text-center py-10">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No products found for &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try searching for something else
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {results.slice(0, 8).map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 py-3 hover:bg-primary/5 rounded-lg px-2 transition-colors group"
                          >
                            <div className="w-12 h-12 relative shrink-0 rounded-xl overflow-hidden bg-gray-100">
                              <Image
                                src={resolveImageUrl(product.image)}
                                alt={product.name}
                                fill
                                sizes="48px"
                                onError={(e: any) => {
                                  e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                                }}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                {typeof product.category === 'object' && product.category !== null
                                  ? (product.category as any)?.name || ''
                                  : product.category || ''}
                              </p>
                            </div>
                            <span className="font-semibold text-sm text-primary">
                              {formatPrice(product.price)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <p className="font-heading text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Trending Searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm text-gray-600 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-gold/5 border border-primary/10 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Discover Nature's Finest
                      </p>
                      <p className="text-xs text-gray-500">
                        Search for healthy, organic products straight from Nepal
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 text-gold ml-auto hidden sm:block" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}