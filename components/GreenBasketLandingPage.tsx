'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  ShoppingBag,
  Search,
  User,
  Heart,
  Truck,
  ShieldCheck,
  Lock,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Mail,
  Sprout,
  Award,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  PhoneCall,
  Check,
  Tag,
} from 'lucide-react';
import { products as staticProducts, normalizeProduct } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useUIStore } from '@/lib/store/ui-store';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function GreenBasketLandingPage() {
  const { openSearch, openAccountMenu } = useUIStore();
  const { addItem, getItemCount } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [addedProductIds, setAddedProductIds] = useState<{ [id: string]: boolean }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalCartCount = isClient ? getItemCount() : 0;

  // Categories aligned with visual reference
  const categoryCards = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      itemsCount: '120+ items',
      image: '/images/greenbasket/cat-vegetables.jpg',
      fallback: '/products/beetroot-powder-100g.jpg',
      filterKey: 'Vegetables',
    },
    {
      id: 'fruits',
      name: 'Fruits',
      itemsCount: '80+ items',
      image: '/images/greenbasket/cat-fruits.jpg',
      fallback: '/products/authentic-dehydrated-mango.jpg',
      filterKey: 'Dried Fruits',
    },
    {
      id: 'herbs-greens',
      name: 'Herbs & Greens',
      itemsCount: '60+ items',
      image: '/images/greenbasket/cat-herbs.jpg',
      fallback: '/products/sweet-potato-powder-100g.jpg',
      filterKey: 'Powders',
    },
    {
      id: 'dairy-eggs',
      name: 'Dairy & Ghee',
      itemsCount: '40+ items',
      image: '/products/coconut-oil.jpg',
      fallback: '/products/coconut-oil.jpg',
      filterKey: 'Oils',
    },
    {
      id: 'nuts-seeds',
      name: 'Nuts & Seeds',
      itemsCount: '50+ items',
      image: '/products/authentic-cashewnuts-roasted.jpg',
      fallback: '/products/authentic-almonds.jpg',
      filterKey: 'Nuts',
    },
  ];

  // Curated products directly from naturesmud.shop with exact prices and details
  const allCuratedProducts = staticProducts.map((p) => normalizeProduct(p));

  const filteredProducts =
    activeCategoryTab === 'All'
      ? allCuratedProducts
      : allCuratedProducts.filter(
          (p) =>
            p.category.toLowerCase().includes(activeCategoryTab.toLowerCase()) ||
            p.categorySlug?.toLowerCase().includes(activeCategoryTab.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(activeCategoryTab.toLowerCase()))
        );

  const displayProducts = (filteredProducts.length > 0 ? filteredProducts : allCuratedProducts).slice(0, 10);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);
    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`${product.name} added to basket!`, {
      icon: '🌿',
      style: {
        background: '#0d2818',
        color: '#ffffff',
        border: '1px solid #22c55e',
      },
    });

    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(productId);
    const inWish = isInWishlist(productId);
    if (!inWish) {
      toast.success('Added to Wishlist', { icon: '❤️' });
    } else {
      toast('Removed from Wishlist', { icon: '🤍' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setEmailSubscribed(true);
    toast.success('Thank you for subscribing! 🌿 Enjoy 10% off your first order.');
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-[#091b10] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 🟢 TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0b2415] border-b border-emerald-900/50 text-emerald-300 text-xs py-2 px-4 sm:px-8 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0">
            <Truck className="w-3.5 h-3.5 text-lime-400" />
            <span>
              <strong className="text-white">FREE DELIVERY</strong> on orders over Rs. 3,000 across Nepal
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eat Fresh, Live Healthy · 100% Himalayan Pure</span>
          </div>
          <div className="flex items-center justify-center gap-2 mx-auto sm:mx-0 text-emerald-200">
            <Headphones className="w-3.5 h-3.5 text-lime-400" />
            <a
              href="https://wa.me/9779819844486"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-300 transition-colors flex items-center gap-1"
            >
              Support 24/7: <span className="text-white font-bold">+977 9819844486</span>
            </a>
          </div>
        </div>
      </div>

      {/* 🟢 MAIN NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0c2817]/95 backdrop-blur-md border-b border-emerald-900/60 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-[#091b10]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                GreenBasket
                <span className="w-2 h-2 rounded-full bg-lime-400 inline-block animate-pulse" />
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300/80 -mt-1">
                Fresh from Nature · Nature's Mud
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-emerald-100/90">
            <Link href="/" className="text-lime-400 border-b-2 border-lime-400 pb-1">
              Home
            </Link>
            <Link href="/catalog" className="hover:text-lime-300 transition-colors">
              Shop
            </Link>
            <a href="#categories-section" className="hover:text-lime-300 transition-colors">
              Categories
            </a>
            <a href="#deals-banner" className="hover:text-lime-300 transition-colors flex items-center gap-1">
              <span>Deals</span>
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold uppercase animate-bounce">
                Hot
              </span>
            </a>
            <Link href="/about" className="hover:text-lime-300 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-lime-300 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => openSearch()}
              aria-label="Search products"
              className="w-10 h-10 rounded-full bg-emerald-950/80 hover:bg-emerald-800/80 border border-emerald-800 text-emerald-200 flex items-center justify-center transition-all hover:scale-105"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Profile */}
            <Link
              href="/account"
              aria-label="User account"
              className="w-10 h-10 rounded-full bg-emerald-950/80 hover:bg-emerald-800/80 border border-emerald-800 text-emerald-200 flex items-center justify-center transition-all hover:scale-105"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Badge */}
            <Link
              href="/cart"
              aria-label="View Cart"
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-bold text-sm shadow-md shadow-emerald-950/50 hover:brightness-110 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Basket</span>
              <span className="w-5 h-5 rounded-full bg-slate-950 text-lime-400 text-xs font-black flex items-center justify-center ml-0.5">
                {totalCartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 🟢 HERO SECTION: FRESH FOOD. HEALTHY LIFE. HAPPY YOU. */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#0c2817] via-[#091f12] to-[#081a0f]">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Organic Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-lime-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <Leaf className="w-4 h-4 text-lime-400" />
                  <span>100% Organic & Single-Origin</span>
                </div>

                {/* Big Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                  Fresh Food. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-green-400">
                    Healthy Life.
                  </span>{' '}
                  <br />
                  Happy You.
                </h1>

                {/* Subtitle */}
                <p className="text-emerald-100/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  100% organic fruits, vegetables, sun-dehydrated Himalayan snacks & superfoods delivered fresh to your
                  door.
                </p>

                {/* CTA Button */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
                  <a
                    href="#top-picks"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-lime-500/20 hover:shadow-lime-500/40 hover:scale-105 transition-all"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>

                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 font-bold text-base transition-all"
                  >
                    <span>Explore Catalog</span>
                  </Link>
                </div>

                {/* 3 Trust Badges */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-4 border-t border-emerald-900/60">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs sm:text-sm">
                      <Leaf className="w-4 h-4" />
                      <span>100% Organic</span>
                    </div>
                    <span className="text-[11px] text-emerald-300/70 mt-0.5">Pure & Natural</span>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs sm:text-sm">
                      <Truck className="w-4 h-4" />
                      <span>Fast Delivery</span>
                    </div>
                    <span className="text-[11px] text-emerald-300/70 mt-0.5">On Time, Every Time</span>
                  </div>

                  <div className="flex flex-col items-center lg:items-start">
                    <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs sm:text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Secure Payment</span>
                    </div>
                    <span className="text-[11px] text-emerald-300/70 mt-0.5">Safe & Protected</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Visual: Heart-shaped Produce Basket with Floating Badge */}
            <div className="lg:col-span-6 flex justify-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-md lg:max-w-lg aspect-square"
              >
                {/* Heart Basket Image with glowing aura */}
                <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950 border-2 border-emerald-700/40 group">
                  <Image
                    src="/images/greenbasket/hero-heart-basket.jpg"
                    alt="Heart-shaped organic vegetable basket"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091b10]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating "EAT FRESH STAY HEALTHY" Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-0 bg-gradient-to-br from-[#0c2f1a] to-[#07190d] border-2 border-lime-400/80 rounded-full w-28 h-28 sm:w-32 sm:h-32 p-2 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/80 z-20"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400 mb-1 animate-spin" />
                  <span className="text-[11px] font-black tracking-wider uppercase text-lime-300 leading-tight">
                    EAT FRESH
                  </span>
                  <span className="text-[12px] font-black tracking-wider uppercase text-white leading-tight">
                    STAY HEALTHY
                  </span>
                  <div className="flex items-center gap-0.5 mt-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 "FROM OUR FARM TO YOUR TABLE" CARD SECTION */}
      <section className="py-12 sm:py-16 bg-[#08170e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0e2d1a] to-[#07190e] border border-emerald-800/60 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            {/* Ambient Leaf Watermark */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Farmer Portrait */}
              <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-600/50 shadow-xl shadow-black/40">
                  <Image
                    src="/images/greenbasket/farmer-crate.jpg"
                    alt="Organic Farmer holding produce crate"
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Story Description */}
              <div className="md:col-span-5 lg:col-span-6 text-center md:text-left">
                <span className="text-lime-400 text-xs font-black uppercase tracking-widest block mb-2">
                  WELCOME TO GREENBASKET
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
                  From Our Farm <br className="hidden sm:inline" />
                  To Your Table
                </h2>
                <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-6">
                  We bring you the freshest, handpicked produce from trusted Himalayan farms. Quality you can trust,
                  every single time.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-emerald-800/60 pt-6 md:pt-0 md:pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-lime-400 shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">25+</div>
                    <div className="text-xs text-emerald-300/70">Local Farms</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-lime-400 shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">500+</div>
                    <div className="text-xs text-emerald-300/70">Fresh Products</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-lime-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">10K+</div>
                    <div className="text-xs text-emerald-300/70">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 "SHOP BY CATEGORY" SECTION */}
      <section id="categories-section" className="py-14 sm:py-20 bg-[#091c11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-lime-400" />
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Shop by Category</h2>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categoryCards.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryTab(cat.filterKey);
                  const el = document.getElementById('top-picks');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group text-left p-4 rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1.5 shadow-lg ${
                  activeCategoryTab === cat.filterKey ? 'ring-4 ring-lime-400' : 'hover:shadow-lime-500/10'
                }`}
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 relative mb-3">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="text-slate-900 font-extrabold text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </div>
                <div className="text-slate-500 text-xs font-medium">{cat.itemsCount}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 🟢 LIMITED TIME OFFER PROMO BANNER: UP TO 30% OFF */}
      <section id="deals-banner" className="py-8 bg-[#08170e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c2f19] via-[#092213] to-[#081a0e] border border-emerald-700/60 p-6 sm:p-10 lg:p-12 shadow-2xl">
            {/* Background Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-35 md:opacity-90 pointer-events-none">
              <Image
                src="/images/greenbasket/vegetables-promo-banner.jpg"
                alt="Fresh vegetable promotional basket"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-right"
              />
            </div>

            <div className="relative z-10 max-w-lg">
              <div className="inline-block px-3 py-1 rounded-full bg-lime-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-4">
                LIMITED TIME OFFER
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                UP TO 30% OFF <br />
                <span className="text-lime-300">On Fresh Produce</span>
              </h2>
              <p className="text-emerald-100/90 text-sm sm:text-base mb-6">
                Pure mountain goodness packed with nutrients and harvested fresh. Grab our seasonal harvest combos
                today.
              </p>
              <a
                href="#top-picks"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-lime-400/20 hover:scale-105 transition-all"
              >
                <span>Grab the Deal</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Gold Seal Badge */}
            <div className="hidden lg:flex absolute bottom-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-1 items-center justify-center text-center shadow-xl z-20">
              <div className="w-full h-full rounded-full border border-dashed border-slate-950/40 flex flex-col items-center justify-center text-slate-950">
                <span className="text-[10px] font-black uppercase leading-tight">Best Quality</span>
                <span className="text-[10px] font-black uppercase leading-tight">Best Price</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 "WHY CHOOSE US?" SECTION */}
      <section className="py-14 sm:py-18 bg-[#091c11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="w-6 h-6 text-lime-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-3xl bg-[#0d2a19] border border-emerald-800/70 hover:border-lime-400/60 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 border border-emerald-700/60 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-base mb-1">Farm Fresh</h3>
              <p className="text-emerald-200/70 text-xs">Handpicked with care daily</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0d2a19] border border-emerald-800/70 hover:border-lime-400/60 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 border border-emerald-700/60 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-base mb-1">Chemical Free</h3>
              <p className="text-emerald-200/70 text-xs">Safe for you & your family</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0d2a19] border border-emerald-800/70 hover:border-lime-400/60 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 border border-emerald-700/60 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-base mb-1">Sustainably Grown</h3>
              <p className="text-emerald-200/70 text-xs">Good for nature & soils</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0d2a19] border border-emerald-800/70 hover:border-lime-400/60 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 border border-emerald-700/60 text-lime-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-white font-extrabold text-base mb-1">Premium Quality</h3>
              <p className="text-emerald-200/70 text-xs">Best Himalayan purity assured</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 "TOP PICKS FOR YOU" SECTION: LIVE PRODUCTS & ADD TO CART */}
      <section id="top-picks" className="py-14 sm:py-20 bg-[#08170e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-lime-400" />
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Top Picks For You</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Dried Fruits', 'Powders', 'Nuts', 'Oils'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategoryTab === tab
                      ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                      : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60'
                  }`}
                >
                  {tab === 'All' ? 'All Items' : tab}
                </button>
              ))}

              <Link
                href="/catalog"
                className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 ml-2"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Product Cards Grid matching the white-card style of the reference */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {displayProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const isAdded = addedProductIds[product.id];

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl border border-slate-100 relative"
                >
                  {/* Top Wishlist Heart */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      {product.weight || '100 GM'}
                    </span>
                    <button
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                      aria-label="Wishlist"
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        inWishlist
                          ? 'bg-red-50 text-red-500'
                          : 'bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 relative mb-3">
                      <Image
                        src={product.image || '/products/sweet-potato-powder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-slate-900 font-extrabold text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price Row */}
                  <div className="mt-2 mb-3">
                    <div className="text-slate-900 font-black text-base">Rs. {product.price}</div>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <div className="text-slate-400 text-xs line-through">Rs. {product.compareAtPrice}</div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full py-2.5 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-lime-500 hover:bg-lime-400 text-slate-950 hover:shadow-lime-500/30'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-6 h-2 rounded-full bg-lime-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-800" />
            <span className="w-2 h-2 rounded-full bg-emerald-800" />
          </div>
        </div>
      </section>

      {/* 🟢 NEWSLETTER SUBSCRIPTION BANNER */}
      <section className="py-12 bg-[#091c11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0d2a19] to-[#07190e] border border-emerald-700/60 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            {/* Left Header */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/20 border border-lime-400/40 text-lime-400 flex items-center justify-center shrink-0 hidden sm:flex">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Stay Healthy, Stay Updated!
                </h3>
                <p className="text-emerald-200/70 text-xs sm:text-sm mt-1">
                  Subscribe to get best offers, health tips & fresh updates in your inbox.
                </p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex-1 max-w-md">
              <div className="flex items-center rounded-full bg-white p-1.5 shadow-lg">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-xs sm:text-sm shrink-0 transition-all"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 🟢 RICH FOREST GREEN FOOTER */}
      <footer className="bg-[#06140b] text-emerald-200/80 border-t border-emerald-950 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center text-slate-950">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">GreenBasket</div>
                  <div className="text-[10px] uppercase font-bold text-lime-400">Fresh from Nature</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-300/70 leading-relaxed max-w-sm mb-6">
                Your trusted source for fresh, organic and healthy food. We care for you and the planet. Direct from
                the pristine Himalayan valleys of Nepal.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-lime-400 hover:border-lime-400 flex items-center justify-center transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-lime-400 hover:border-lime-400 flex items-center justify-center transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-lime-400 hover:border-lime-400 flex items-center justify-center transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-lime-400 hover:border-lime-400 flex items-center justify-center transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/catalog" className="hover:text-lime-300 transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <a href="#categories-section" className="hover:text-lime-300 transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#deals-banner" className="hover:text-lime-300 transition-colors">
                    Deals
                  </a>
                </li>
                <li>
                  <Link href="/about" className="hover:text-lime-300 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-lime-300 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">Customer Service</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/account" className="hover:text-lime-300 transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-lime-300 transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-lime-300 transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-lime-300 transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-lime-300 transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">Information</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy-policy" className="hover:text-lime-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-lime-300 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-lime-300 transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-lime-300 transition-colors">
                    Blog & Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/become-distributor" className="hover:text-lime-300 transition-colors">
                    Careers & Wholesale
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Payment & Security Seals */}
          <div className="pt-8 border-t border-emerald-950 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xs text-emerald-400/60 text-center md:text-left">
              © {new Date().getFullYear()} GreenBasket · Nature's Mud. All Rights Reserved.
            </div>

            {/* Payment Seals */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60 mr-1">
                Payment Methods:
              </span>
              <div className="px-2.5 py-1 rounded bg-white text-slate-900 font-black text-[11px] tracking-tight">
                VISA
              </div>
              <div className="px-2.5 py-1 rounded bg-white text-slate-900 font-black text-[11px] tracking-tight">
                Mastercard
              </div>
              <div className="px-2.5 py-1 rounded bg-white text-blue-700 font-black text-[11px] tracking-tight">
                PayPal
              </div>
              <div className="px-2.5 py-1 rounded bg-green-600 text-white font-black text-[11px] tracking-tight">
                eSewa
              </div>
              <div className="px-2.5 py-1 rounded bg-purple-600 text-white font-black text-[11px] tracking-tight">
                Khalti
              </div>
              <div className="px-2.5 py-1 rounded bg-emerald-900 border border-emerald-700 text-lime-400 font-bold text-[10px] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>SSL SECURE</span>
              </div>
              <div className="px-2.5 py-1 rounded bg-emerald-900 border border-emerald-700 text-lime-400 font-bold text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>McAfee SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
