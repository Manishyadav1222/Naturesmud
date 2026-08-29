'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { getProductById } from '@/lib/data/products';
import { formatPrice, classNames, resolveImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BuyNowButton } from '@/components/BuyNowButton';

import { toast } from 'sonner';

export default function QuickViewModal() {
  const router = useRouter();
  const { quickViewProductId, closeQuickView } = useUIStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const product = quickViewProductId ? getProductById(quickViewProductId) : null;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const rawImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [product?.image || '/products/sweet-potato-powder-100g.jpg'];

  const imagesList = rawImages.map((img) => resolveImageUrl(img));

  const currentDisplayImg = imagesList[selectedImgIndex] || imagesList[0] || resolveImageUrl(product?.image);

  return (
    <Transition.Root show={!!product} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeQuickView}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                {product && (
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={closeQuickView}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="sm:col-span-5 lg:col-span-6 flex flex-col gap-3">
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 relative shadow-sm border border-stone-200/60">
                          <Image
                            src={currentDisplayImg || '/products/naturesmud-all-products-100g.jpg'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            onError={(e: any) => {
                              e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                            }}
                            className="object-cover object-center transition-all duration-300"
                          />
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            {product.badges?.includes('bestseller') && (
                              <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                ⭐ Bestseller
                              </span>
                            )}
                            {product.badges?.includes('organic') && (
                              <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-primary shadow-sm">
                                🌱 Organic
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Thumbnails Row */}
                        {imagesList.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {imagesList.map((imgSrc: string, idx: number) => (
                              <button
                                key={`${imgSrc}-${idx}`}
                                type="button"
                                onClick={() => setSelectedImgIndex(idx)}
                                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                                  selectedImgIndex === idx
                                    ? 'border-[#3A6B35] ring-2 ring-[#3A6B35]/20 scale-105'
                                    : 'border-stone-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <Image
                                  src={imgSrc || '/products/naturesmud-all-products-100g.jpg'}
                                  alt={`${product.name} ${idx + 1}`}
                                  fill
                                  sizes="56px"
                                  onError={(e: any) => {
                                    e.currentTarget.src = '/products/naturesmud-all-products-100g.jpg';
                                  }}
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="sm:col-span-7 lg:col-span-6 flex flex-col h-full justify-center">
                        <h2 className="text-2xl font-heading font-bold text-gray-900 sm:pr-12">
                          {product.name}
                        </h2>

                        {/* Rating */}
                        <div className="mt-2 flex items-center gap-2">
                           <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={classNames(
                                  'w-4 h-4',
                                  i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-gray-200'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
                        </div>

                        <section aria-labelledby="information-heading" className="mt-4">
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>
                          <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                             {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <p className="text-lg text-gray-400 line-through decoration-gray-300">
                                  {formatPrice(product.compareAtPrice)}
                                </p>
                              )}
                          </div>
                          <p className="mt-4 text-base text-gray-600 line-clamp-3">
                            {product.description}
                          </p>
                        </section>

                        <section aria-labelledby="options-heading" className="mt-8 pt-6 border-t border-gray-100">
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>

                           <div className="flex flex-col gap-3">
                             <div className="flex flex-wrap sm:flex-nowrap gap-3">
                              <button
                                onClick={() => {
                                  addItem(product);
                                  toast.success(`${product.name} added to cart`);
                                  closeQuickView();
                                  useCartStore.getState().openDrawer();
                                }}
                                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md shadow-primary/20 cursor-pointer text-sm"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </button>

                              <BuyNowButton product={product} size="md" variant="gold" label="⚡ Buy Now" className="flex-1 min-w-[140px]" />

                              <button
                                onClick={() => toggleItem(product.id)}
                                className={classNames(
                                  'p-3 rounded-full bg-cream-50 hover:bg-cream-100 transition-colors border cursor-pointer',
                                  inWishlist ? 'border-red-200 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                                )}
                                aria-label="Add to wishlist"
                              >
                                <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
                              </button>
                             </div>

                             <button
                               onClick={() => {
                                 closeQuickView();
                                 router.push(`/products/${product.slug}`);
                               }}
                               className="text-xs font-semibold text-primary hover:text-primary-dark text-center py-1.5"
                             >
                               View Full Details &rarr;
                             </button>
                           </div>
                        </section>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
