'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Modal } from '@/components/admin/Modal';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import {
  Instagram,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Trash2,
  Calendar,
  Link2,
} from 'lucide-react';
import type { InstagramGalleryPost, InstagramSettings } from '@/lib/instagram-gallery';

export default function AdminGalleryPage() {
  const { hasPermission } = useAdminAuth();
  const [posts, setPosts] = useState<InstagramGalleryPost[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [handleInput, setHandleInput] = useState('naturesmud_official');
  const [tokenInput, setTokenInput] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [autoSyncInput, setAutoSyncInput] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Selected item / Edit modal
  const [selectedPost, setSelectedPost] = useState<InstagramGalleryPost | null>(null);
  const [taggedSlugInput, setTaggedSlugInput] = useState('');
  const [taggedNameInput, setTaggedNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<string>('products');
  const [isSavingPost, setIsSavingPost] = useState(false);

  const fetchGalleryData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resPosts, resSettings] = await Promise.all([
        fetch('/api/gallery?limit=100').then((r) => r.json()),
        fetch('/api/gallery/settings').then((r) => r.json()),
      ]);

      if (resPosts.success && Array.isArray(resPosts.data)) {
        setPosts(resPosts.data);
      }
      if (resSettings.success && resSettings.data) {
        setSettings(resSettings.data);
        setHandleInput(resSettings.data.instagram_handle || 'naturesmud_official');
        setUserIdInput(resSettings.data.user_id || '');
        setAutoSyncInput(resSettings.data.auto_sync ?? true);
      }
    } catch (err) {
      console.error('Failed to load admin gallery data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Sync Instagram Photos Now
  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      setSyncStatusMsg(null);
      const res = await fetch('/api/gallery/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncStatusMsg(`✨ ${json.message}`);
        await fetchGalleryData();
      } else {
        setSyncStatusMsg(`⚠️ ${json.message || 'Sync failed'}`);
      }
    } catch (err) {
      setSyncStatusMsg('⚠️ Unable to connect to Instagram sync API');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      setSaveSuccessMsg(null);
      const res = await fetch('/api/gallery/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram_handle: handleInput,
          access_token: tokenInput ? tokenInput : undefined,
          user_id: userIdInput,
          auto_sync: autoSyncInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccessMsg('Instagram integration settings saved successfully!');
        setSettings(json.data);
        setTimeout(() => {
          setIsSettingsOpen(false);
          setSaveSuccessMsg(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Toggle Post Visibility (Show/Hide on Storefront)
  const handleToggleVisibility = async (post: InstagramGalleryPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVisibility = !post.is_visible;
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, is_visible: newVisibility } : p))
      );

      await fetch('/api/gallery/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, is_visible: newVisibility }),
      });
    } catch (err) {
      console.error('Error updating visibility:', err);
      fetchGalleryData();
    }
  };

  // Open Edit Product Tag Modal
  const openEditModal = (post: InstagramGalleryPost) => {
    setSelectedPost(post);
    setTaggedSlugInput(post.tagged_product_slug || '');
    setTaggedNameInput(post.tagged_product_name || '');
    setCategoryInput(post.category || 'products');
  };

  // Save Tagged Product & Category
  const handleSavePostDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    try {
      setIsSavingPost(true);
      const res = await fetch('/api/gallery/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: selectedPost.id,
          tagged_product_slug: taggedSlugInput,
          tagged_product_name: taggedNameInput,
          category: categoryInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === selectedPost.id ? { ...p, ...json.data } : p))
        );
        setSelectedPost(null);
      }
    } catch (err) {
      console.error('Error saving post details:', err);
    } finally {
      setIsSavingPost(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (search && !p.caption.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const visibleCount = posts.filter((p) => p.is_visible).length;
  const totalLikes = posts.reduce((sum, p) => sum + (p.like_count || 0), 0);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              Content & Social Hub
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              <Instagram className="w-3 h-3" />
              Photo Ingestion Active
            </span>
          </div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">
            Instagram Photo Gallery
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automatically sync and display every photo post from your Instagram directly on your storefront gallery.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 text-xs font-bold"
          >
            <Settings className="w-4 h-4" />
            <span>API Settings</span>
          </Button>

          <Button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Instagram Now'}</span>
          </Button>
        </div>
      </div>

      {syncStatusMsg && (
        <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 text-primary-800 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary-600" />
            <span>{syncStatusMsg}</span>
          </div>
          <Link href="/gallery" target="_blank" className="underline hover:text-primary-900">
            View Live Store Gallery →
          </Link>
        </div>
      )}

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Synced Photos"
          value={posts.length}
          icon={<Instagram className="w-5 h-5 text-rose-500" />}
          description="Direct from @naturesmud_official"
        />
        <StatCard
          title="Live in Gallery"
          value={visibleCount}
          icon={<Eye className="w-5 h-5 text-lime-600" />}
          description={`${posts.length - visibleCount} hidden`}
        />
        <StatCard
          title="Instagram Engagement"
          value={`${totalLikes.toLocaleString()} Likes`}
          icon={<Heart className="w-5 h-5 text-rose-500" />}
          description="Across all photo posts"
        />
        <StatCard
          title="Sync Status"
          value="Real-time"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          description={
            settings?.last_synced_at
              ? `Synced ${new Date(settings.last_synced_at).toLocaleTimeString()}`
              : 'Auto-sync active'
          }
        />
      </div>

      {/* Integration Card & Webhook Info */}
      <Card className="bg-gradient-to-r from-cream-50 to-white border-lime-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-rose-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Connected Instagram Feed: @{settings?.instagram_handle || 'naturesmud_official'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Live Syncing
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Only photo and carousel album posts are pulled into your gallery. Reels & videos are automatically routed to the Video Reels showcase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/gallery"
                target="_blank"
                className="btn-outline text-xs font-bold py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>View Public Gallery</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'products', label: 'Products' },
            { id: 'recipes', label: 'Recipes' },
            { id: 'farm', label: 'Farm' },
            { id: 'community', label: 'Community' },
            { id: 'lifestyle', label: 'Lifestyle' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search photo captions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-square" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={<Instagram className="w-12 h-12 text-gray-300" />}
          title="No Instagram photos found"
          description="Click 'Sync Instagram Now' to pull the latest photos from your account."
          action={
            <Button onClick={handleSyncNow} disabled={isSyncing}>
              Sync Instagram Photos
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className={`overflow-hidden transition-all hover:shadow-lg ${
                !post.is_visible ? 'opacity-60 bg-gray-50' : 'bg-white'
              }`}
            >
              {/* Photo Showcase */}
              <div className="relative aspect-square bg-gray-900 group">
                <Image
                  src={post.media_url}
                  alt={post.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <button
                    onClick={(e) => handleToggleVisibility(post, e)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold backdrop-blur-md shadow-xs transition-all ${
                      post.is_visible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                    title={post.is_visible ? 'Visible on storefront' : 'Hidden from storefront'}
                  >
                    {post.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{post.is_visible ? 'Live' : 'Hidden'}</span>
                  </button>

                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold font-mono">
                    {post.category}
                  </span>
                </div>

                {/* Hover overlay with action */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(post)}
                    className="text-xs"
                  >
                    Tag Product
                  </Button>
                  <Link
                    href={post.permalink}
                    target="_blank"
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card Details */}
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed font-body">
                  {post.caption}
                </p>

                {/* Tagged Product Chip */}
                {post.tagged_product_name ? (
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-lime-50 text-lime-900 border border-lime-200">
                    <span className="flex items-center gap-1 font-bold truncate">
                      <ShoppingBag className="w-3.5 h-3.5 text-lime-700 shrink-0" />
                      <span className="truncate">{post.tagged_product_name}</span>
                    </span>
                    <button
                      onClick={() => openEditModal(post)}
                      className="text-[10px] underline text-lime-700 hover:text-lime-900 shrink-0 ml-1"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openEditModal(post)}
                    className="w-full text-left text-[11px] text-gray-400 hover:text-primary-600 flex items-center gap-1 p-1.5 rounded-lg border border-dashed border-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tag a store product...</span>
                  </button>
                )}

                {/* Footer Likes & Timestamp */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1 text-rose-500 font-bold">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{post.like_count}</span>
                  </span>
                  <span>
                    {new Date(post.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Instagram Graph API & Webhook Configuration"
      >
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Instagram Account Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">@</span>
              <Input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value.replace('@', ''))}
                className="pl-8 text-xs"
                placeholder="naturesmud_official"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Instagram Long-Lived Access Token
            </label>
            <Input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="text-xs font-mono"
              placeholder={settings?.masked_token || 'Paste IGQVJ... token from Meta Developer'}
            />
            <p className="text-[11px] text-gray-500 mt-1">
              From Meta for Developers (Instagram Graph API). Leave blank to keep existing active token.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Instagram User / Business ID (Optional)
            </label>
            <Input
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="text-xs"
              placeholder="e.g. 17841400000000000"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <p className="text-xs font-bold text-gray-800">⚡ Real-time Meta Webhook Endpoint</p>
            <p className="text-[11px] text-gray-600">
              Add this callback URL in your Meta App Dashboard under Instagram Webhooks:
            </p>
            <code className="block p-2 rounded-lg bg-gray-900 text-lime-400 text-[11px] font-mono break-all select-all">
              https://yourdomain.com/api/instagram/webhook
            </code>
            <p className="text-[11px] text-gray-500 font-mono">
              Verify Token:{' '}
              <strong className="text-gray-900 font-bold">
                {settings?.webhook_verify_token || 'naturemud_insta_webhook_secure_2025'}
              </strong>
            </p>
          </div>

          {saveSuccessMsg && (
            <p className="text-xs font-bold text-emerald-600">{saveSuccessMsg}</p>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingSettings} className="text-xs font-bold">
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Post Details / Tag Product Modal */}
      <Modal
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        title="Tag Store Product to Instagram Photo"
      >
        {selectedPost && (
          <form onSubmit={handleSavePostDetails} className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 bg-gray-900">
                <Image
                  src={selectedPost.media_url}
                  alt={selectedPost.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-body">
                {selectedPost.caption}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Featured Product Name
              </label>
              <Input
                value={taggedNameInput}
                onChange={(e) => setTaggedNameInput(e.target.value)}
                placeholder="e.g. Dates Powder Sweetener"
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Product URL Slug
              </label>
              <Input
                value={taggedSlugInput}
                onChange={(e) => setTaggedSlugInput(e.target.value)}
                placeholder="e.g. dates-powder"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Links directly to /products/{taggedSlugInput || 'product-slug'} on the storefront.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <Select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                options={[
                  { value: 'products', label: 'Pure Products' },
                  { value: 'recipes', label: 'Kitchen & Recipes' },
                  { value: 'farm', label: 'Farm & Harvest' },
                  { value: 'community', label: 'Community' },
                  { value: 'lifestyle', label: 'Himalayan Lifestyle' },
                ]}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedPost(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingPost} className="text-xs font-bold">
                {isSavingPost ? 'Saving...' : 'Save Tagged Product'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}