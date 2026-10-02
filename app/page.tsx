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

import FeaturesStrip from '@/components/FeaturesStrip';
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

const PRIORITY_FEATURED_SLUGS = [
  'raw-himalayan-almonds',
  'roasted-almonds',
  'freeze-dried-avocado-powder',
  'strawberry-powder',
  'dehydrated-mango',
  'roasted-cashewnuts',
  'virgin-coconut-oil-180ml',
  'dates-powder',
  'moringa-leaf-powder',
  'makhana-fox-nuts',
];

export default function HomePage() {
  const { openSearch } = useUIStore();
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => {
    return [...staticProducts.filter((p) => p.isFeatured)]
      .sort((a, b) => {
        const aIdx = PRIORITY_FEATURED_SLUGS.indexOf(a.slug);
        const bIdx = PRIORITY_FEATURED_SLUGS.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return 0;
      })
      .slice(0, 8);
  });
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(() => {
    return [...staticProducts]
      .sort((a, b) => {
        const aIdx = PRIORITY_FEATURED_SLUGS.indexOf(a.slug);
        const bIdx = PRIORITY_FEATURED_SLUGS.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return 0;
      })
      .slice(0, 6);
  });
  const [latestPosts, setLatestPosts] = useState<any[]>(staticBlogPosts.slice(0, 3));

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, blogsRes, featuredBlogsRes] = await Promise.all([
          api.get('/products', { params: { per_page: 100, _t: Date.now() } }),
          api.get('/blogs', { params: { per_page: 50, _t: Date.now() } }),
          api.get('/blogs', { params: { featured: true, per_page: 4, _t: Date.now() } })
        ]);
        if (productsRes.data && productsRes.data.data) {
          const apiProducts = productsRes.data.data
            .map((p: any) => normalizeProduct(p))
            .filter((p: any) => p.isActive !== false);
          setDynamicProducts(apiProducts);

          const sortedFeatured = apiProducts
            .filter((p: any) => p.isFeatured)
            .sort((a: Product, b: Product) => {
              const aIdx = PRIORITY_FEATURED_SLUGS.indexOf(a.slug);
              const bIdx = PRIORITY_FEATURED_SLUGS.indexOf(b.slug);
              if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
              if (aIdx !== -1) return -1;
              if (bIdx !== -1) return 1;
              return 0;
            });
          setFeaturedProducts(sortedFeatured.slice(0, 8));

          const sortedTrending = [...apiProducts].sort((a: Product, b: Product) => {
            const aIdx = PRIORITY_FEATURED_SLUGS.indexOf(a.slug);
            const bIdx = PRIORITY_FEATURED_SLUGS.indexOf(b.slug);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return 0;
          });
          setTrendingProducts(sortedTrending.slice(0, 6));
        }
        if (blogsRes.data && Array.isArray(blogsRes.data.data)) {
          const apiBlogs = blogsRes.data.data.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || p.short_description || '',
            category: p.category || 'Nutrition',
            image: p.featured_image || p.image || '/products/sweet-potato-powder-100g.jpg',
            date: p.published_at
              ? new Date(p.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent',
            rawDate: p.published_at || p.created_at || '',
            readTime: Number(p.read_time || 7),
            author: p.author?.name || p.author || "NaturesMud Council",
          }));
          const merged = new Map<string, any>();
          for (const s of staticBlogPosts) {
            if (s.slug) merged.set(s.slug, s);
          }
          for (const a of apiBlogs) {
            if (a.slug) {
              const local = merged.get(a.slug);
              merged.set(a.slug, {
                ...local,
                ...a,
                title: a.title || local?.title,
                excerpt: a.excerpt || local?.excerpt,
                image: a.image || local?.image,
                category: a.category || local?.category,
                author: a.author || local?.author,
              });
            }
          }
          const allPosts = Array.from(merged.values());
          allPosts.sort((a, b) => new Date(b.date || b.rawDate || 0).getTime() - new Date(a.date || a.rawDate || 0).getTime());
          setLatestPosts(allPosts.slice(0, 3));
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

  const categoriesWithImages = categories.slice(0, 4);

  return (
    <main className="w-full max-w-full">
      {/* 🏔️ Unified Responsive Hero Section (Mobile, Tablet & Laptop with 3-Second Interactive Product Poster Cards, Dynamic Color Shifts & Kinetic Statements) */}
      <MobileHeroSection dynamicProducts={dynamicProducts} />

      {/* 🌿 Shop by Category (Interactive 6-Category Bento Grid across Mobile, Tablet & Laptop) */}
      <MobileCategorySection />

      {/* 🎁 Side-by-Side Dual Offer & Combos Section (Baby Superfoods + Himalayan Festival Box) */}
      <section className="mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-8 items-stretch">
          {/* Left Side Offer: Dashain & Tihar Festival Gift Combos */}
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
      <FeaturesStrip />

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
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">@naturesmud_official</span>
                  <span className="sm:hidden">Follow</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { src: '/products/nm-pistachio-jar.jpg', label: 'Premium Pistachio Roasted & Salted', likes: 487, tag: 'Pistachio' },
                { src: '/products/nm-cashew-new-jar.jpg', label: 'Naturesmud Premium Cashew', likes: 612, tag: 'Cashew' },
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

      {/* Latest Posts — From Our Journal */}
      <ScrollReveal direction="up" distance={30}>
        <section className="section-padding bg-cream-50 overflow-hidden w-full max-w-full">
          <div className="container-nm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5230] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A3826]" />
                  <span>Journal &amp; Stories</span>
                </div>
                <h2 className="section-title mt-1">From Our Journal</h2>
                <p className="section-subtitle hidden sm:block">Evidence-based nutrition guides, recipes, and stories from the Himalayas.</p>
              </div>
              <Link href="/blog" className="btn-outline shrink-0 text-sm">View All Posts</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
              {latestPosts.slice(0, 3).map((post, idx) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-400 border border-ink/5 hover:-translate-y-1"
                >
                  {/* Thumbnail with category badge & read time overlay */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-cream-100 shrink-0">
                    <Image
                      src={post.image || '/products/naturesmud-all-products-100g.jpg'}
                      alt={post.title}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-primary-700 shadow-sm">
                        {post.category}
                      </span>
                    </div>
                    {/* Read time pill */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-sm text-white">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                        {post.readTime} min
                      </span>
                    </div>
                    {/* Read now CTA on hover */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-primary-700 text-xs font-bold shadow-md">
                        Read Article →
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    <p className="text-[11px] text-ink/40 uppercase tracking-wider font-semibold mb-2">{post.date}</p>
                    <h3 className="font-heading font-bold text-base sm:text-[17px] text-ink leading-snug group-hover:text-primary-700 transition-colors line-clamp-3 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-ink/55 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-ink/8">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary-700 text-[10px] font-black">N</span>
                      </div>
                      <span className="text-xs text-ink/50 font-medium truncate">{post.author || 'NaturesMud Council'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom CTA strip */}
            <div className="mt-8 sm:mt-10 text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors group">
                Explore all articles &amp; recipes
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
              </Link>
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

      {/* 🏔️ About NaturesMud Nepal (naturesmud.com) — Animated Brand Authority & Regional Knowledge */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#F8F5EE] via-[#F4EFE6] to-[#FAF7F2] border-t border-ink/10 text-ink relative overflow-hidden">
        {/* Soft background ambient glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-float-slower" />

        <div className="container-nm relative z-10">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
            {/* Header Badge & Title */}
            <ScrollReveal direction="up" distance={25} className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#3A6B35]/25 shadow-2xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#3A6B35] font-sans">
                  About NaturesMud Nepal (naturesmud.com)
                </span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight leading-snug">
                Nepal&apos;s Trusted Superfoods &{' '}
                <span className="bg-gradient-to-r from-primary via-emerald-700 to-teal-800 bg-clip-text text-transparent">
                  Himalayan Nutrition Brand
                </span>
              </h2>

              <p className="text-sm sm:text-base text-ink/75 leading-relaxed font-sans max-w-2xl mx-auto">
                Welcome to <strong>NaturesMud</strong> (also known online as <strong>naturesmud.com</strong> or <strong>naturesmud.shop</strong>), Nepal&apos;s premier Himalayan nutrition pioneer dedicated to 100% single-origin authenticity.
              </p>
            </ScrollReveal>

            {/* 4 Interactive 3D Bento Glass Cards with Framer Motion hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Card 1 */}
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-ink/8 hover:border-amber-400/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100/80 border border-amber-300/50 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                    100% Natural Dehydrated Powders in 100g Glass Jars
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 leading-relaxed font-sans">
                    Our bestselling product line includes pure{' '}
                    <Link href="/products/sweet-potato-powder" className="text-primary font-bold hover:underline">Sweet Potato Powder</Link>,{' '}
                    <Link href="/products/dates-powder" className="text-primary font-bold hover:underline">Dates Powder</Link>,{' '}
                    <Link href="/products/beetroot-powder" className="text-primary font-bold hover:underline">Beetroot Powder</Link>, and{' '}
                    <Link href="/products/carrot-powder" className="text-primary font-bold hover:underline">Carrot Powder</Link>. Each jar is gently dehydrated below 42°C with <strong className="text-emerald-800">0 additives and 0 preservatives</strong>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink/6">
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    &lt; 42°C Cold Dry
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    UV Amber Glass
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    0 Preservatives
                  </span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-ink/8 hover:border-emerald-400/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 border border-emerald-300/50 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <Sprout className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                    Direct Fair-Trade Partnership with 180+ Nepali Farms
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 leading-relaxed font-sans">
                    NaturesMud sources directly from smallholder farmers across Nepal&apos;s 3 ecological belts (Terai, Midland Hills & High Himalayas). By eliminating middlemen, our farm partners receive <strong className="text-emerald-800">+35% above-market fair-trade wages</strong>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink/6">
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    180+ Farm Co-ops
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    0 Middlemen
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    +35% Fair Income
                  </span>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-ink/8 hover:border-rose-400/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100/80 border border-rose-300/50 flex items-center justify-center text-rose-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <Baby className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                    Safe Baby Weaning & Pediatric Nutrition
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 leading-relaxed font-sans">
                    Trusted by thousands of Nepali mothers and recommended by pediatricians for baby food weaning (6+ months). 100% lab-verified with zero chemical additives, zero added salt, and zero artificial coloring.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink/6">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[10px] font-bold text-rose-800 border border-rose-200">
                    Pediatrician Approved
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    Lab Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Zero Artificial Dyes
                  </span>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-ink/8 hover:border-teal-400/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100/80 border border-teal-300/50 flex items-center justify-center text-teal-700 shadow-2xs group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5 text-teal-700" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                    Express Delivery Across All 7 Provinces of Nepal
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 leading-relaxed font-sans">
                    Kathmandu Valley delivery within 24 hours. Doorstep courier to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Nepalgunj, and beyond. Free express shipping on orders over Rs. 3,000.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink/6">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-800 border border-amber-200">
                    ⚡ 24h Valley Delivery
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-50 text-[10px] font-bold text-ink/70 border border-ink/5">
                    All 77 Districts
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Free &gt; Rs. 3,000
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Popular Searches Animated Floating Pill Cloud */}
            <div className="text-center pt-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-ink/75 p-3 rounded-2xl bg-white/70 border border-ink/5 shadow-2xs backdrop-blur-xs">
                <span className="font-extrabold text-ink flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  Popular Searches:
                </span>
                <Link href="/products?category=powders" className="hover:text-primary hover:underline transition-colors">Sweet Potato Powder Nepal</Link>
                <span className="text-ink/30">•</span>
                <Link href="/products/dates-powder" className="hover:text-primary hover:underline transition-colors">Dates Powder</Link>
                <span className="text-ink/30">•</span>
                <Link href="/products/beetroot-powder" className="hover:text-primary hover:underline transition-colors">Beetroot Powder</Link>
                <span className="text-ink/30">•</span>
                <Link href="/products/banana-powder" className="hover:text-primary hover:underline transition-colors">Banana Powder</Link>
                <span className="text-ink/30">•</span>
                <Link href="/catalog" className="hover:text-primary hover:underline font-extrabold text-primary flex items-center gap-1">
                  <span>View Master Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 Continuous Animated Trust Marquee Strip:
          "0 Additives · 0 Preservatives / From Local Farms / 100% Natural / Pure Himalayan / Fair Trade / Free Delivery / 0 Additives / Quality Assured" */}
      <section className="bg-white py-6 sm:py-8 border-y border-ink/6 overflow-hidden w-full relative">
        {/* Soft edge gradient fades for infinite glide aesthetic */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div className="flex overflow-hidden select-none">
          {/* Continuous looping track with Framer Motion */}
          <motion.div
            className="flex items-center gap-4 sm:gap-6 shrink-0"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 24,
            }}
          >
            {[
              { label: '0 Additives · 0 Preservatives', icon: Sparkles, iconColor: 'text-emerald-600', highlight: true },
              { label: 'From Local Farms', icon: Sprout, iconColor: 'text-primary' },
              { label: '100% Natural', icon: Leaf, iconColor: 'text-emerald-600', isPendulum: true },
              { label: 'Pure Himalayan', icon: Flag, iconColor: 'text-amber-600' },
              { label: 'Fair Trade', icon: Heart, iconColor: 'text-rose-500' },
              { label: 'Free Delivery', icon: Truck, iconColor: 'text-teal-600' },
              { label: '0 Additives', icon: ShieldCheck, iconColor: 'text-primary' },
              { label: 'Quality Assured', icon: Award, iconColor: 'text-gold-600', isGold: true },
              // Duplicate once for infinite seamless loop
              { label: '0 Additives · 0 Preservatives', icon: Sparkles, iconColor: 'text-emerald-600', highlight: true },
              { label: 'From Local Farms', icon: Sprout, iconColor: 'text-primary' },
              { label: '100% Natural', icon: Leaf, iconColor: 'text-emerald-600', isPendulum: true },
              { label: 'Pure Himalayan', icon: Flag, iconColor: 'text-amber-600' },
              { label: 'Fair Trade', icon: Heart, iconColor: 'text-rose-500' },
              { label: 'Free Delivery', icon: Truck, iconColor: 'text-teal-600' },
              { label: '0 Additives', icon: ShieldCheck, iconColor: 'text-primary' },
              { label: 'Quality Assured', icon: Award, iconColor: 'text-gold-600', isGold: true },
            ].map((badge, bIdx) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={bIdx}
                  className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border shadow-2xs text-xs sm:text-sm font-heading whitespace-nowrap transition-transform duration-300 hover:scale-105 ${
                    badge.highlight
                      ? 'bg-emerald-50/90 border-emerald-300/80 text-emerald-900 font-bold'
                      : badge.isGold
                      ? 'bg-amber-50/90 border-amber-300/80 text-amber-950 font-bold'
                      : 'bg-cream-50/80 border-ink/8 text-ink/80 font-semibold hover:bg-white'
                  }`}
                >
                  <BadgeIcon className={`w-4 h-4 shrink-0 ${badge.iconColor} ${badge.highlight ? 'animate-pulse' : ''}`} />
                  {badge.isPendulum && (
                    <span className="animated-leaf">
                      <Leaf className="w-3.5 h-3.5 text-primary" />
                    </span>
                  )}
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}