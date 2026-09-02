'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { products as staticProducts, normalizeProduct } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { masterBlogCatalog as staticBlogPosts } from '@/lib/data/blogs-database';
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

import HeroOfferSection from '@/components/HeroOfferSection';
import BabyMotherCombosSection from '@/components/BabyMotherCombosSection';
import CampaignCombosShowcaseSection from '@/components/CampaignCombosShowcaseSection';
import OurPromisesSection from '@/components/OurPromisesSection';
import RealCustomerReviewsSection from '@/components/RealCustomerReviewsSection';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileCategorySection from '@/components/MobileCategorySection';
import MobileHeroSection from '@/components/MobileHeroSection';
import ProductRecommendationQuiz from '@/components/ProductRecommendationQuiz';

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
      {/* 🏔️ Unified Responsive Hero Section (Mobile, Tablet & Laptop with 3-Second Interactive Product Poster Cards, Dynamic Color Shifts & Kinetic Statements) */}
      <MobileHeroSection />

      {/* 🌿 Shop by Category (Interactive 6-Category Bento Grid across Mobile, Tablet & Laptop) */}
      <MobileCategorySection />

      {/* 🎁 Side-by-Side Dual Offer & Combos Section (Baby Superfoods + Himalayan Festival Box) */}
      <section className="mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-8 items-stretch">
          {/* Left Side Offer: Baby & Mother Care Combos */}
          <div className="w-full flex justify-center md:justify-start">
            <ErrorBoundary name="Baby & Mother Combos">
              <BabyMotherCombosSection />
            </ErrorBoundary>
          </div>

          {/* Right Side Offer: Festival & Lifestyle Combos */}
          <div className="w-full flex justify-center md:justify-end">
            <ErrorBoundary name="Festival Offers">
              <HeroOfferSection />
            </ErrorBoundary>
          </div>
        </div>
      </section>

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

      {/* Features Strip — Truck hits Free Shipping card */}
      <ScrollReveal direction="up" distance={25}>
        <section className="bg-white border-y border-ink/5 overflow-hidden w-full max-w-full">
          <div className="container-nm py-5 lg:py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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

      {/* Instagram-style Reels Section (Watch NatureMud In Action) */}
      <ScrollReveal direction="up" distance={30}>
        <ErrorBoundary name="Reels Section">
          <ReelsSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* 🎯 Interactive Superfood Recommendation Quiz — Desktop only */}
      <div className="hidden lg:block">
        <ScrollReveal direction="up" distance={30}>
          <section className="py-10 bg-[#FAF7F2] border-y border-ink/5">
            <div className="container-nm">
              <ErrorBoundary name="Product Recommendation Quiz">
                <ProductRecommendationQuiz />
              </ErrorBoundary>
            </div>
          </section>
        </ScrollReveal>
      </div>

      {/* Featured Products */}
      <ScrollReveal direction="up" distance={30}>
        <section className="py-8 sm:py-12 lg:py-16 bg-white overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex items-end justify-between gap-4 mb-5 sm:mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
                  <span>Handpicked Harvests</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-ink tracking-tight">
                  Featured Products
                </h2>
                <p className="text-xs sm:text-sm text-ink/70 max-w-xl mt-1 leading-relaxed hidden sm:block">
                  Handpicked superfoods and healthy essentials our customers love.
                </p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline shrink-0 py-1 pl-2">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-6 sm:mt-10 flex justify-center">
              <Link href="/products" className="btn-outline">
                See More Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Special Mega Campaigns & Combos Showcase */}
      <ScrollReveal direction="up" distance={30}>
        <ErrorBoundary name="Campaign Combos">
          <CampaignCombosShowcaseSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* Our Promises Showcase — visible on all breakpoints */}
      <ErrorBoundary name="Promises Section">
        <OurPromisesSection />
      </ErrorBoundary>

      {/* Immunity Product Highlight Banner */}
      <ScrollReveal direction="up" distance={30}>
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 py-10 sm:py-16 lg:py-20 w-full max-w-full">
          <div className="absolute inset-0 bg-hero-pattern opacity-40" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" />

          <div className="relative container-nm">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 relative rounded-[2rem] overflow-hidden shadow-xl shrink-0">
                  <Image
                    src="/products/superfood-mix.jpg"
                    alt="Immunity Shield Superfood Mix"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-white space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1.5 text-sm">
                    <Sparkles className="w-4 h-4" />
                    Only clean, only pure
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Immunity Shield Superfood Mix</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Moringa, Ashwagandha, Amla & more — your daily immunity ritual.</p>
                  <Link href="/products/immunity-shield-superfood-mix" className="btn-gold mt-2 sm:mt-4 inline-flex items-center gap-2 text-sm">
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

      {/* Customer Reviews & Wall of Love */}
      <ScrollReveal direction="up" distance={30}>
        <ErrorBoundary name="Customer Reviews">
          <RealCustomerReviewsSection />
        </ErrorBoundary>
      </ScrollReveal>

      {/* 07 — Instagram Live Photo Gallery Section */}
      <ScrollReveal direction="up" distance={30}>
        <section className="section-padding bg-white overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230]">
                    <Instagram className="w-3.5 h-3.5 text-rose-500" />
                    <span>Instagram Photo Gallery</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                    Live Photos
                  </span>
                </div>
                <h2 className="section-title mt-1">From Our Instagram</h2>
                <p className="section-subtitle hidden sm:block">
                  Farm harvests, recipe creations, and mountain lifestyle directly from @naturesmud_official.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/gallery" className="btn-primary text-xs shrink-0 inline-flex items-center gap-2">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="https://www.instagram.com/naturesmud_official/"
                  className="btn-outline shrink-0 inline-flex items-center gap-1.5 text-xs"
                  target="_blank"
                >
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">@naturesmud_official</span>
                  <span className="sm:hidden">Follow</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { src: '/products/dates-powder.jpg', label: 'Dates Powder Fuel', likes: 342, tag: 'Dates Powder' },
                { src: '/products/coconut-oil.jpg', label: 'Virgin Cold-Pressed', likes: 512, tag: 'Coconut Oil' },
                { src: '/products/authentic-dehydrated-mango.jpg', label: 'Tarai Sun-Ripened Mango', likes: 678, tag: 'Mango' },
                { src: '/products/almonds-2.jpg', label: 'Roasted Himalayan Almonds', likes: 819, tag: 'Almonds' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href="/gallery"
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square shadow-soft hover:shadow-card transition-all duration-500 bg-dark"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4">
                    <div className="flex justify-end">
                      <span className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white">
                        <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                      </span>
                    </div>
                    <div>
                      <span className="text-white text-[10px] sm:text-xs font-bold font-heading line-clamp-1">
                        {item.label}
                      </span>
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-white/80 mt-1">
                        <span className="flex items-center gap-1 text-rose-300 font-bold">
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="text-[9px] sm:text-[10px] bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
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
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
                  <span>Journal & Stories</span>
                </div>
                <h2 className="section-title mt-1">From Our Journal</h2>
                <p className="section-subtitle hidden sm:block">Tips, guides, and stories from the farm.</p>
              </div>
              <Link href="/blog" className="btn-outline shrink-0 text-sm">View All Posts</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-3 sm:mb-4 relative bg-cream-100">
                    <Image
                      src={post.image || '/products/naturesmud-all-products-100g.jpg'}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-ink leading-snug group-hover:text-primary transition-colors">
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
        <section className="relative overflow-hidden bg-primary-600 py-12 sm:py-16 lg:py-20 w-full max-w-full">
          <div className="absolute inset-0 bg-hero-pattern opacity-30" />
          <div className="relative container-nm text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white text-sm mb-5 sm:mb-6">
              <Gem className="w-4 h-4 text-gold-300" />
              Join our inner circle
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Get 5% Off Your First Order
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
              Subscribe and get exclusive offers, health tips, and recipes delivered straight.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SEO Authority & Regional Knowledge Section for Nepal Search Dominance */}
      <section className="py-10 sm:py-14 lg:py-16 bg-[#F8F5EE] border-t border-ink/10 text-ink">
        <div className="container-nm">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#3A6B35] bg-white px-4 py-1.5 rounded-full shadow-2xs">
                About NaturesMud Nepal (naturesmud.com)
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-4xl text-ink">
                Nepal&apos;s Trusted Superfoods & Himalayan Nutrition Brand
              </h2>
              <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
                Welcome to <strong>NaturesMud</strong> (also known online as <strong>naturesmud.com</strong> or <strong>naturesmud.shop</strong>), Nepal&apos;s premier Himalayan nutrition brand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-ink/80 leading-relaxed">
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  100% Natural Dehydrated Powders in 100g Glass Jars
                </h3>
                <p className="text-xs sm:text-sm">
                  Our bestselling product line includes pure <Link href="/products/sweet-potato-powder" className="text-primary font-semibold hover:underline">Sweet Potato Powder</Link>, <Link href="/products/dates-powder" className="text-primary font-semibold hover:underline">Dates Powder</Link>, <Link href="/products/beetroot-powder" className="text-primary font-semibold hover:underline">Beetroot Powder</Link>, and <Link href="/products/carrot-powder" className="text-primary font-semibold hover:underline">Carrot Powder</Link>. Each jar is gently dehydrated below 42°C with <strong>0 additives and 0 preservatives</strong>.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  Direct Fair-Trade Partnership with 180+ Nepali Farms
                </h3>
                <p className="text-xs sm:text-sm">
                  NaturesMud sources directly from smallholder farmers across Nepal&apos;s 3 ecological belts. By eliminating middlemen, our farmers receive +35% above-market compensation.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                  <Baby className="w-4 h-4 text-rose-500" />
                  Safe Baby Weaning & Pediatric Nutrition
                </h3>
                <p className="text-xs sm:text-sm">
                  Trusted by thousands of Nepali mothers and pediatricians. 100% lab-verified with zero chemical additives or artificial colors.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-ink/5 shadow-2xs space-y-3">
                <h3 className="font-heading font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Express Delivery Across All 7 Provinces of Nepal
                </h3>
                <p className="text-xs sm:text-sm">
                  Kathmandu Valley delivery within 24 hours. Nationwide courier to Pokhara, Chitwan, Butwal, Biratnagar, and beyond. Free shipping on orders over Rs. 10,000.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-ink/70">
                <span className="font-bold text-ink">Popular Searches:</span>
                <Link href="/products?category=powders" className="hover:text-primary underline">Sweet Potato Powder Nepal</Link>
                <span>•</span>
                <Link href="/products/dates-powder" className="hover:text-primary underline">Dates Powder</Link>
                <span>•</span>
                <Link href="/products/beetroot-powder" className="hover:text-primary underline">Beetroot Powder</Link>
                <span>•</span>
                <Link href="/catalog" className="hover:text-primary underline font-bold text-primary">View Catalog</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section — 100% Natural hanging like pendulum */}
      <ScrollReveal direction="up" distance={20}>
        <section className="bg-white py-8 sm:py-10 overflow-hidden w-full max-w-full">
          <div className="container-nm flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['0 Additives · 0 Preservatives', 'From Local Farms', '100% Natural', 'Pure Himalayan', 'Fair Trade'].map((trust) => (
              <span
                key={trust}
                className={`flex items-center gap-2 text-ink/50 font-heading text-xs sm:text-sm ${
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