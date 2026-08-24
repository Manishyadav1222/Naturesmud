'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import type { InstagramGalleryPost } from '@/lib/instagram-gallery';

const CATEGORIES = [
  { id: 'all', label: 'All Photos', icon: Sparkles },
  { id: 'products', label: 'Pure Products', icon: ShoppingBag },
  { id: 'recipes', label: 'Kitchen & Recipes', icon: Sparkles },
  { id: 'farm', label: 'Farm & Harvest', icon: Sparkles },
  { id: 'community', label: 'Community', icon: Heart },
  { id: 'lifestyle', label: 'Himalayan Lifestyle', icon: Sparkles },
];

export default function GalleryPage() {
  const [posts, setPosts] = useState<InstagramGalleryPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramGalleryPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/gallery');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Sync latest Instagram photos trigger
  const handleSyncInstagram = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);
      const res = await fetch('/api/gallery/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncStatusMsg(`✨ ${json.message || 'Synced successfully!'}`);
        await fetchPhotos();
      } else {
        setSyncStatusMsg(`⚠️ ${json.message || 'Sync failed'}`);
      }
    } catch (err) {
      setSyncStatusMsg('⚠️ Unable to connect to Instagram sync server');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const selectedIndex = useMemo(() => {
    if (!selectedPost) return -1;
    return filteredPosts.findIndex((p) => p.id === selectedPost.id);
  }, [selectedPost, filteredPosts]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedPost(filteredPosts[selectedIndex - 1]);
    } else {
      setSelectedPost(filteredPosts[filteredPosts.length - 1]);
    }
  }, [selectedIndex, filteredPosts]);

  const handleNext = useCallback(() => {
    if (selectedIndex < filteredPosts.length - 1) {
      setSelectedPost(filteredPosts[selectedIndex + 1]);
    } else {
      setSelectedPost(filteredPosts[0]);
    }
  }, [selectedIndex, filteredPosts]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPost) return;
      if (e.key === 'Escape') setSelectedPost(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost, handlePrev, handleNext]);

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pt-24 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-nm relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Live Sync Beacon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-ink/10 shadow-xs text-xs font-bold mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <Instagram className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-ink">Live Instagram Photo Feed</span>
            <span className="text-ink/40">·</span>
            <span className="text-primary-700 font-mono">@naturesmud_official</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-ink tracking-tight">
            Nature's Mud Photo Gallery
          </h1>
          <p className="text-ink/70 text-base sm:text-lg mt-4 leading-relaxed">
            Every photo post from our Instagram directly synced here. Explore authentic farm harvests, kitchen rituals, and clean Himalayan superfoods.
          </p>

          {/* Sync Trigger and Status */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSyncInstagram}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-cream-100 text-ink text-xs font-bold border border-ink/15 shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Instagram Posts...' : 'Sync Latest Instagram Photos'}</span>
            </button>

            <Link
              href="https://www.instagram.com/naturesmud_official/"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Follow On Instagram</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </Link>
          </div>

          {syncStatusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 border border-primary-200 text-primary-800 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-primary-600" />
              <span>{syncStatusMsg}</span>
            </motion.div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-primary/20 shadow-md scale-105'
                    : 'bg-white text-ink/70 hover:text-ink hover:bg-cream-50 border-ink/10 shadow-xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Photo Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-ink/5 animate-pulse aspect-square" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 p-8 max-w-lg mx-auto">
            <Instagram className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-ink">No Photos Found</h3>
            <p className="text-ink/60 text-sm mt-1">There are no photos under this category yet.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 btn-primary text-xs"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post, idx) => {
              const isLiked = likedPosts[post.id];
              const totalLikes = post.like_count + (isLiked ? 1 : 0);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedPost(post)}
                  className="group relative rounded-3xl overflow-hidden aspect-square cursor-pointer shadow-soft hover:shadow-card transition-all duration-500 bg-dark"
                >
                  {/* Photo */}
                  <Image
                    src={post.media_url}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold border border-white/15">
                      <Instagram className="w-3 h-3 text-rose-400" />
                      <span>Instagram Photo</span>
                    </span>

                    <button
                      onClick={(e) => toggleLike(post.id, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 ${
                        isLiked ? 'bg-rose-500 text-white' : 'bg-black/50 text-white hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Content on Hover */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>

                    {/* Stats & Tagged Product */}
                    <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-white/90">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" />
                          <span>{totalLikes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-sky-400" />
                          <span>{post.comments_count}</span>
                        </span>
                      </div>

                      {post.tagged_product_name && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                          <ShoppingBag className="w-3 h-3 text-gold" />
                          <span className="truncate max-w-[90px]">{post.tagged_product_name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* High-Resolution Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev / Next Chevrons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hidden sm:flex cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hidden sm:flex cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Photo Showcase (7 cols) */}
              <div className="md:col-span-7 relative bg-dark min-h-[350px] md:min-h-[500px]">
                <Image
                  src={selectedPost.media_url}
                  alt={selectedPost.caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Right Instagram Context (5 cols) */}
              <div className="md:col-span-5 p-6 flex flex-col justify-between overflow-y-auto max-h-[500px]">
                <div>
                  {/* Account Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-rose-500" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-ink leading-tight">
                          naturesmud_official
                        </h4>
                        <p className="text-[11px] text-ink/50">Kathmandu, Nepal</p>
                      </div>
                    </div>

                    <span className="text-xs text-ink/40 font-mono">
                      {new Date(selectedPost.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Caption & Hashtags */}
                  <div className="py-4 space-y-3">
                    <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line font-body">
                      {selectedPost.caption}
                    </p>
                  </div>

                  {/* Tagged Product Highlight Card */}
                  {selectedPost.tagged_product_slug && (
                    <div className="mt-2 p-3.5 rounded-2xl bg-cream-50 border border-ink/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">
                            Featured Product
                          </p>
                          <p className="text-xs font-bold text-ink">
                            {selectedPost.tagged_product_name || 'Himalayan Superfood'}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/products/${selectedPost.tagged_product_slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <span>Shop</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-4 border-t border-ink/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-ink/70">
                    <span className="font-bold text-ink">
                      ❤️ {selectedPost.like_count + (likedPosts[selectedPost.id] ? 1 : 0)} Likes
                    </span>
                    <span>💬 {selectedPost.comments_count} Comments</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={selectedPost.permalink}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 text-white text-xs font-bold transition-all hover:opacity-95 shadow-sm"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>View on Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
