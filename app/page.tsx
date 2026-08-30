'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { products as staticProducts, normalizeProduct } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { blogPosts as staticBlogPosts } from '@/lib/data/content';
import { ProductCard } from '@/components/ProductCard';
import { NewsletterForm } from '@/components/NewsletterForm';
import ReelsSection from '@/components/ReelsSection';
import { useUIStore } from '@/lib/store/ui-store';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import {
  Leaf,
  ShieldCheck,
  Truck,
  Recycle,
  Star,
  ArrowRight,
  TrendingUp,
  Heart,
  Sprout,
  PackageCheck,
  BadgeCheck,
  Sparkles,
  Droplets,
  MapPin,
  Zap,
  Award,
  Users,
  ChevronDown,
  Gem,
  Search,
  Flag,
  Baby,
  Instagram,
} from 'lucide-react';

import HeroProductShowcase from '@/components/HeroProductShowcase';
import HeroOfferSection from '@/components/HeroOfferSection';
import BabyMotherCombosSection from '@/components/BabyMotherCombosSection';
import CampaignCombosShowcaseSection from '@/components/CampaignCombosShowcaseSection';
import OurPromisesSection from '@/components/OurPromisesSection';
import RealCustomerReviewsSection from '@/components/RealCustomerReviewsSection';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
  const { openSearch } = useUIStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(staticProducts.filter((p) => p.isFeatured).slice(0, 4));
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(staticProducts.slice(0, 3));
  const [latestPosts, setLatestPosts] = useState<any[]>(staticBlogPosts.slice(0, 3));

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, blogsRes, featuredBlogsRes] = await Promise.all([
          api.get('/products', { params: { per_page: 50 } }),
          api.get('/blogs'),
          api.get('/blogs', { params: { featured: true, per_page: 4 } })
        ]);
        if (productsRes.data && productsRes.data.data) {
          const apiProducts = productsRes.data.data.map((p: any) => normalizeProduct(p));
          setFeaturedProducts(apiProducts.filter((p: any) => p.isFeatured).slice(0, 8));
          setTrendingProducts(apiProducts.slice(0, 4));
        }
        if (blogsRes.data && blogsRes.data.data) {
          setLatestPosts(blogsRes.data.data.slice(0, 3));
        }
        // Featured blogs would be handled by the featuredBlogsRes if needed
      } catch (error) {
        console.warn('Failed to fetch dynamic data for homepage, falling back to static data.');
      }
    }
    fetchData();
  }, []);

  const stats = [
    { icon: Users, label: 'Happy Customers', value: '25,000+' },
    { icon: Sprout, label: 'Partner Farms', value: '180+' },
    { icon: PackageCheck, label: 'Products Delivered', value: '150+' },
    { icon: Star, label: 'Average Rating', value: '4.9/5' },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping Over Rs. 10,000', desc: 'On all orders across Nepal', color: 'bg-primary-100 text-primary' },
    { icon: ShieldCheck, title: '0 Additives · 0 Preservatives', desc: '100% Pure Himalayan Wholesomeness', color: 'bg-emerald-100 text-emerald-600' },
    { icon: Recycle, title: 'Earth-Friendly Packaging', desc: 'Recyclable glass & biodegradable', color: 'bg-lime-100 text-lime-600' },
    { icon: Sparkles, title: 'Farm Fresh Daily', desc: 'Direct sourcing, no middlemen', color: 'bg-gold/20 text-gold-700' },
  ];

  const categoriesWithImages = categories.slice(0, 4);

  // Confetti colors for the truck hit celebration - deterministic to prevent hydration mismatch
  const confettiColors = ['#3a6b35', '#7aa95c', '#d9a441', '#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c'];
  
  // Confetti positions - use deterministic values (based on index) instead of Math.random()
  // This ensures identical rendering on both server and client, preventing hydration errors
  const confettiParticles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    // Deterministic pseudo-random offsets based on index
    const distOffset = ((i * 37) % 50); // 0-49
    const rotOffset = ((i * 53) % 360) - 180; // -180 to 179
    const distance = 50 + distOffset;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20,
      rot: rotOffset,
      color: confettiColors[i % confettiColors.length],
      delay: (i % 4) * 0.05,
    };
  });

  return (
    <main className="w-full max-w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fafaf5] via-cream-50 to-[#f3f5ee] w-full max-w-full">
        {/* Ambient background - soft warm beige gradient with organic textures */}
        <div className="absolute inset-0 bg-hero-pattern opacity-60" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(58,107,53,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(217,164,65,0.10)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[radial-gradient(circle,rgba(122,169,92,0.10)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Subtle decorative leaves */}
        <div className="absolute top-24 left-[8%] w-12 h-12 text-primary/15 pointer-events-none rotate-12">
          <Leaf className="w-full h-full" />
        </div>
        <div className="absolute bottom-32 right-[12%] w-16 h-16 text-gold/15 pointer-events-none -rotate-12">
          <Leaf className="w-full h-full" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5 lg:space-y-6">
              {/* Ultra-Clean Premium Trust Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary/12 via-gold/15 to-primary/10 border border-primary/20 px-4 py-1.5 shadow-[0_2px_12px_rgba(58,107,53,0.06)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span className="text-xs font-bold tracking-wide text-primary flex items-center gap-1.5 font-heading">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  0 Additives · 0 Preservatives · 180+ Partner Farms
                </span>
              </motion.div>

              {/* Hero Heading with Luxury Editorial Typography & Exact Brand Match */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black leading-[1.04] tracking-tight font-heading">
                  <span className="text-primary-800 block">
                    NaturesMud
                  </span>
                  <span className="text-gold-600 block drop-shadow-xs">
                    Rooted in Nepal.
                  </span>
                </h1>

                {/* Refined Narrative Description */}
                <p className="text-sm sm:text-base text-ink/75 font-normal leading-relaxed max-w-lg pt-1">
                  Welcome to <strong>NaturesMud Nepal (naturesmud.com)</strong>. From pristine Himalayan foothills above 3,000m to your doorstep — discover authentic wild honey, potent shilajit, seeds, and nutrient-dense 100g superfood powders crafted with 0 additives and 0 preservatives.
                </p>
              </motion.div>

              {/* High-Conversion CTAs and Verified Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/products"
                    className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-primary-600 to-emerald-700 px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_8px_25px_rgba(58,107,53,0.32)] hover:shadow-[0_12px_32px_rgba(58,107,53,0.42)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <span>Shop All Products</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/our-story"
                    className="group inline-flex items-center gap-2 rounded-full bg-white border border-ink/12 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-ink hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-[0_6px_20px_rgba(43,43,43,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <Leaf className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    <span>Our Story</span>
                  </Link>
                </div>

                {/* Social Proof Avatar Cluster + Micro-Trust Row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1">
                  {/* Avatar Cluster */}
                  <div className="flex items-center gap-2 pr-3 border-r border-ink/10">
                    <div className="flex -space-x-2">
                      {['👩‍🍼', '🧔', '👩‍⚕️', '🏃‍♂️'].map((emoji, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-cream-100 to-white border-2 border-white flex items-center justify-center text-xs shadow-xs"
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] leading-tight">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="font-bold text-ink ml-1 font-mono">4.9/5</span>
                      </div>
                      <span className="text-ink/60 font-medium">25,000+ Happy Nepalis</span>
                    </div>
                  </div>

                  {/* Micro-Trust Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-ink/70">
                    <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-ink/5 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      100% Himalayan
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-ink/5 shadow-2xs">
                      <Truck className="w-3.5 h-3.5 text-primary" />
                      Free Shipping &gt; Rs. 10,000
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-ink/5 shadow-2xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-gold-600" />
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Modern Glassmorphic Statistics Counters */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-lg"
              >
                {[
                  { value: '25,000+', label: 'Happy Customers', highlight: true },
                  { value: '100%', label: '0 Additives', highlight: false },
                  { value: '150+', label: 'Farm Partners', highlight: false },
                  { value: '4.9★', label: 'Customer Rating', highlight: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white border border-ink/8 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center shadow-xs"
                  >
                    <div className={`text-base sm:text-lg font-heading font-black ${stat.highlight ? 'text-primary' : 'text-ink'}`}>
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-[10px] text-ink/60 font-semibold mt-0.5 truncate">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content Column — Product Animation */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center lg:items-end justify-center pt-2 lg:pt-0">
              {/* Production Showcase Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center lg:justify-end"
              >
                <ErrorBoundary name="Product Showcase">
                  <HeroProductShowcase />
                </ErrorBoundary>
              </motion.div>
            </div>
          </div>

          {/* Side-by-Side Dual Offer & Combos Section */}
          <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-ink/8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Left Side Offer: Baby & Mother Care Combos */}
              <div className="w-full flex justify-center lg:justify-start">
                <ErrorBoundary name="Baby & Mother Combos">
                  <BabyMotherCombosSection />
                </ErrorBoundary>
              </div>

              {/* Right Side Offer: Festival & Lifestyle Combos */}
              <div className="w-full flex justify-center lg:justify-end">
                <ErrorBoundary name="Festival Offers">
                  <HeroOfferSection />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-down hidden md:flex"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* Features Strip — Truck hits Free Shipping card */}
      <ScrollReveal direction="up" distance={25}>
        <section className="bg-white border-y border-ink/5 overflow-hidden w-full max-w-full">
          <div className="container-nm py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`flex items-center gap-4 group relative ${
                    i === 0 ? 'truck-animation-card' : ''
                  } ${
                    i === 0 ? 'truck-impact-shake' : ''
                  }`}
                >
                  {/* Truck drive-in animation for the first feature card */}
                  {i === 0 && (
                    <>
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 truck-hit-card z-10">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary-100 text-primary">
                          <Truck className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Confetti celebration burst */}
                      <div className="confetti-container">
                        {confettiParticles.map((p, idx) => (
                          <span
                            key={idx}
                            className="confetti-particle"
                            style={{
                              backgroundColor: p.color,
                              animationDelay: `${p.delay}s`,
                              '--confetti-x': `${p.x}px`,
                              '--confetti-y': `${p.y}px`,
                              '--confetti-rot': `${p.rot}deg`,
                            } as CSSProperties}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-ink">{feature.title}</div>
                    <div className="text-xs text-ink/50 mt-0.5">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trending Marquee */}
      <div className="bg-primary overflow-hidden py-3 w-full max-w-full">
        <div className="marquee-container">
          <div className="marquee-content gap-8">
            {[...trendingProducts, ...trendingProducts].map((p, i) => (
              <span key={i} className="flex items-center gap-2 text-white/90 text-sm font-medium whitespace-nowrap">
                <TrendingUp className="w-4 h-4 text-gold-300" />
                {p.name}
                <span className="text-gold-300">Rs. {p.price}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <ScrollReveal direction="up" distance={35}>
        <section className="section-padding bg-cream-50 overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12 lg:mb-16">
              <div className="space-y-3 sm:space-y-4">
                <span className="section-number block tracking-widest text-primary-600 text-xs font-bold uppercase mb-2 sm:mb-3">01 — Explore</span>
                <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-ink mt-2 mb-3">
                  Shop by Category
                </h2>
                <p className="section-subtitle text-ink/70 text-base sm:text-lg max-w-2xl mt-3 sm:mt-4 leading-relaxed">
                  Discover our collections, from everyday essentials to premium superfoods.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categoriesWithImages.map((category, i) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="category-jump-card group relative overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:shadow-card aspect-[3/4]"
                  style={{ '--jump-delay': i * 0.25 } as CSSProperties}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="font-heading text-lg font-semibold text-white">{category.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm mt-1 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span>Shop now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 02 — Instagram-style Reels Section (Watch NatureMud In Action) */}
      <ScrollReveal direction="up" distance={30}>
        <ErrorBoundary name="Reels Section">
          <ReelsSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* 03 — Featured Products */}
      <ScrollReveal direction="up" distance={35}>
        <section className="section-padding bg-white overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <span className="section-number">03 — Bestsellers</span>
                <h2 className="section-title mt-3">Featured Products</h2>
                <p className="section-subtitle">
                  Handpicked superfoods and healthy essentials our customers love.
                </p>
              </div>
              <Link href="/products" className="btn-outline shrink-0">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Link href="/products" className="btn-outline">
                See More Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 04 — Special Mega Campaigns & Combos Showcase (Gym, Morning, Total Health, Focus, Festive & Tihar) */}
      <ScrollReveal direction="up" distance={35}>
        <ErrorBoundary name="Campaign Combos">
          <CampaignCombosShowcaseSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* 05 — Redesigned Interactive Our Promises Showcase */}
      <ErrorBoundary name="Promises Section">
        <OurPromisesSection />
      </ErrorBoundary>

      {/* Product Highlight Banner */}
      <ScrollReveal direction="up" distance={30}>
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 py-16 sm:py-20 w-full max-w-full">
          <div className="absolute inset-0 bg-hero-pattern opacity-40" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" />

          <div className="relative container-nm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 sm:w-52 sm:h-52 relative rounded-[2rem] overflow-hidden shadow-xl shrink-0">
                  <Image
                    src="/products/superfood-mix.jpg"
                    alt="Immunity Shield Superfood Mix"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-white space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                    <Sparkles className="w-4 h-4" />
                    Only clean, only pure
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Immunity Shield Superfood Mix</h3>
                  <p className="text-white/80 text-sm">Moringa, Ashwagandha, Amla & more — your daily immunity ritual.</p>
                  <Link href="/products/immunity-shield-superfood-mix" className="btn-gold mt-4 inline-flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex items-end justify-end gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center animate-float-slow">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gold/30 flex items-center justify-center animate-float-slower">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-float-slow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 06 — Modern Real Customer Reviews & Wall of Love */}
      <ScrollReveal direction="up" distance={30}>
        <ErrorBoundary name="Customer Reviews">
          <RealCustomerReviewsSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* 07 — Instagram Live Photo Gallery Section */}
      <ScrollReveal direction="up" distance={30}>
        <section className="section-padding bg-white overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="section-number">07 — Instagram Photo Gallery</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                    <Instagram className="w-3 h-3 text-rose-500" />
                    Live Photos
                  </span>
                </div>
                <h2 className="section-title mt-1">From Our Instagram</h2>
                <p className="section-subtitle">
                  Farm harvests, recipe creations, and mountain lifestyle directly from @naturesmud_official.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/gallery" className="btn-primary text-xs shrink-0 inline-flex items-center gap-2">
                  <span>View All Photos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="https://www.instagram.com/naturesmud_official/"
                  className="btn-outline shrink-0 inline-flex items-center gap-1.5"
                  target="_blank"
                >
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <span>@naturesmud_official</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { src: '/products/dates-powder.jpg', label: 'Dates Powder Fuel', likes: 342, tag: 'Dates Powder' },
                { src: '/products/coconut-oil.jpg', label: 'Virgin Cold-Pressed', likes: 512, tag: 'Coconut Oil' },
                { src: '/products/authentic-dehydrated-mango.jpg', label: 'Tarai Sun-Ripened Mango', likes: 678, tag: 'Mango' },
                { src: '/products/almonds-2.jpg', label: 'Roasted Himalayan Almonds', likes: 819, tag: 'Almonds' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href="/gallery"
                  className="group relative overflow-hidden rounded-3xl aspect-square shadow-soft hover:shadow-card transition-all duration-500 bg-dark"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <span className="p-2 rounded-full bg-black/60 text-white">
                        <Instagram className="w-3.5 h-3.5 text-rose-400" />
                      </span>
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold font-heading line-clamp-1">
                        {item.label}
                      </span>
                      <div className="flex items-center justify-between text-[11px] text-white/80 mt-1">
                        <span className="flex items-center gap-1 text-rose-300 font-bold">
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Posts */}
      <ScrollReveal direction="up" distance={30}>
        <section className="section-padding bg-cream-50 overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <span className="section-number">08 — Blog</span>
                <h2 className="section-title mt-3">From Our Journal</h2>
                <p className="section-subtitle">Tips, guides, and stories from the farm.</p>
              </div>
              <Link href="/blog" className="btn-outline shrink-0">View All Posts</Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-4 relative bg-cream-100">
                    <Image
                      src={post.image || '/products/naturesmud-all-products-100g.jpg'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink/50 uppercase tracking-wider mb-2">
                    <span className="text-primary-600">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-ink leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-ink/50 text-sm line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Newsletter */}
      <ScrollReveal direction="scale" distance={20}>
        <section className="relative overflow-hidden bg-primary-600 py-16 sm:py-20 w-full max-w-full">
          <div className="absolute inset-0 bg-hero-pattern opacity-30" />
          <div className="relative container-nm text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white text-sm mb-6">
              <Gem className="w-4 h-4 text-gold-300" />
              Join our inner circle
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get 5% Off Your First Order
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Subscribe and get exclusive offers, health tips, and recipes delivered straight.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SEO Authority & Regional Knowledge Section for Nepal Search Dominance */}
      <section className="py-16 bg-[#F8F5EE] border-t border-ink/10 text-ink">
        <div className="container-nm">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-white px-4 py-1.5 rounded-full shadow-2xs">
                About NaturesMud Nepal (naturesmud.com)
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ink">
                Nepal&apos;s Trusted Superfoods & Himalayan Nutrition Brand
              </h2>
              <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
                Welcome to <strong>NaturesMud</strong> (also known online as <strong>naturesmud.com</strong> or <strong>naturesmud.shop</strong>), Nepal&apos;s premier Himalayan nutrition brand. We produce 100% natural, chemical-free dehydrated fruit and vegetable powders, wild-harvested honey, high-altitude shilajit, and raw mountain nuts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-ink/80 leading-relaxed">
              <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  100% Natural Dehydrated Powders in 100g Glass Jars
                </h3>
                <p>
                  Our bestselling product line includes pure <Link href="/products/sweet-potato-powder" className="text-primary font-semibold hover:underline">Sweet Potato Powder</Link> (सखरखण्डको धुलो), <Link href="/products/dates-powder" className="text-primary font-semibold hover:underline">Dates Powder Natural Sweetener</Link> (खजुरको धुलो), <Link href="/products/beetroot-powder" className="text-primary font-semibold hover:underline">Beetroot Powder</Link> (चुकन्दरको धुलो), and <Link href="/products/carrot-powder" className="text-primary font-semibold hover:underline">Carrot Powder</Link>. Each jar is gently dehydrated below 42°C to preserve natural vitamins, live enzymes, and minerals with <strong>0 additives and 0 preservatives</strong>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  Direct Fair-Trade Partnership with 180+ Nepali Farms
                </h3>
                <p>
                  NaturesMud sources directly from smallholder farmers across Nepal&apos;s 3 ecological belts: the fertile Terai plains (Chitwan, Nawalpur), midland hills (Kavre, Sindhupalchok, Palpa), and high Himalayan peaks (Mustang, Jumla). By eliminating middlemen, our farmers receive +35% above-market compensation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
                  <Baby className="w-4 h-4 text-rose-500" />
                  Safe Baby Weaning & Pediatric Nutrition
                </h3>
                <p>
                  Trusted by thousands of Nepali mothers and pediatricians, our unrefined single-ingredient powders are ideal for infant porridge (लुटो), smoothies, and children&apos;s milk. 100% lab-verified with zero chemical additives or artificial colors.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-base text-ink flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Express Delivery Across All 7 Provinces of Nepal
                </h3>
                <p>
                  We deliver right to your doorstep across Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur) within 24 hours, and nationwide courier delivery to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Itahari, Hetauda, Nepalgunj, and beyond. Free shipping on orders over Rs. 10,000.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-ink/70">
                <span className="font-bold text-ink">Popular Searches:</span>
                <Link href="/products?category=powders" className="hover:text-primary underline">Sweet Potato Powder Nepal</Link>
                <span>•</span>
                <Link href="/products/dates-powder" className="hover:text-primary underline">Dates Powder Sweetener</Link>
                <span>•</span>
                <Link href="/products/beetroot-powder" className="hover:text-primary underline">Beetroot Powder Kathmandu</Link>
                <span>•</span>
                <Link href="/products/dehydrated-mango" className="hover:text-primary underline">Sun-Dried Mango Slices</Link>
                <span>•</span>
                <Link href="/products/chia-seeds" className="hover:text-primary underline">Chia Seeds Nepal</Link>
                <span>•</span>
                <Link href="/catalog" className="hover:text-primary underline font-bold text-primary">View Product Catalog</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section — 100% Natural hanging like pendulum */}
      <ScrollReveal direction="up" distance={20}>
        <section className="bg-white py-10 overflow-hidden w-full max-w-full">
          <div className="container-nm flex flex-wrap items-center justify-center gap-8">
            {['0 Additives · 0 Preservatives', 'From Local Farms', '100% Natural', 'Pure Himalayan', 'Fair Trade'].map((trust) => (
              <span
                key={trust}
                className={`flex items-center gap-2 text-ink/50 font-heading text-sm ${
                  trust === '100% Natural' ? 'pendulum-hang text-primary font-semibold' : ''
                }`}
                style={trust === '100% Natural' ? { marginTop: '26px' } : undefined}
              >
                <BadgeCheck className={`w-4 h-4 ${trust === '100% Natural' ? 'text-gold-600' : 'text-primary'}`} />
                {trust === '100% Natural' && (
                  <span className="animated-leaf">
                    <Leaf className="w-4 h-4 text-primary" />
                  </span>
                )}
                {trust}
              </span>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}