'use client';

import React, { useState } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Select } from '@/components/admin/Select';
import { EmptyState } from '@/components/admin/EmptyState';
import { formatNumber } from '@/lib/admin/utils';
import { Instagram, Facebook, Youtube, Send, Music2, CircleAlert, Plus, Heart, MessageCircle, Share2, Users, Eye } from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK' | 'WHATSAPP';
  handle: string;
  followers: number;
  engagementRate: number;
  postsCount: number;
  connected: boolean;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  INSTAGRAM: <Instagram className="h-5 w-5" />,
  FACEBOOK: <Facebook className="h-5 w-5" />,
  YOUTUBE: <Youtube className="h-5 w-5" />,
  TIKTOK: <Music2 className="h-5 w-5" />,
  WHATSAPP: <Send className="h-5 w-5" />,
};

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: 'bg-pink-50 text-pink-600',
  FACEBOOK: 'bg-blue-50 text-blue-600',
  YOUTUBE: 'bg-red-50 text-red-600',
  TIKTOK: 'bg-black/5 text-black',
  WHATSAPP: 'bg-green-50 text-green-600',
};

const INITIAL_PLATFORMS: SocialPlatform[] = [
  { id: '1', name: 'INSTAGRAM', handle: '@naturesmud', followers: 12500, engagementRate: 4.2, postsCount: 356, connected: true },
  { id: '2', name: 'FACEBOOK', handle: '@naturesmud.np', followers: 8900, engagementRate: 3.1, postsCount: 240, connected: true },
  { id: '3', name: 'YOUTUBE', handle: "Nature's Mud", followers: 4300, engagementRate: 5.8, postsCount: 68, connected: true },
  { id: '4', name: 'TIKTOK', handle: '@naturesmud', followers: 21000, engagementRate: 6.5, postsCount: 125, connected: false },
  { id: '5', name: 'WHATSAPP', handle: 'Business API', followers: 15000, engagementRate: 8.9, postsCount: 0, connected: true },
];

export default function AdminSocialPage() {
  const { hasPermission } = useAdminAuth();
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(INITIAL_PLATFORMS);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ platform: 'INSTAGRAM', content: '', scheduledFor: '' });
  const [connected, setConnected] = useState<string[]>(INITIAL_PLATFORMS.filter(p => p.connected).map(p => p.id));

  const canManage = hasPermission(PERMISSIONS.MANAGE_SOCIAL);

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage social media."
      />
    );
  }

  const totalFollowers = platforms.reduce((sum, p) => sum + (p.connected ? p.followers : 0), 0);
  const avgEngagement = platforms.filter(p => p.connected).reduce((sum, p) => sum + p.engagementRate, 0) / (connected.length || 1);
  const totalPosts = platforms.reduce((sum, p) => sum + p.postsCount, 0);

  const handleToggle = (id: string) => {
    setConnected(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
          <p className="mt-1 text-sm text-gray-500">Connect accounts, track performance, and schedule posts.</p>
        </div>
        <Button size="sm" onClick={() => setComposeOpen(true)}>
          <Plus className="h-4 w-4" />
          Compose Post
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-primary-50 p-3"><Users className="h-5 w-5 text-primary-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Followers</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(totalFollowers)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-lime-50 p-3"><Heart className="h-5 w-5 text-lime-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Avg. Engagement</p>
              <p className="text-xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-accent-50 p-3"><Eye className="h-5 w-5 text-accent-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(totalPosts)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${PLATFORM_COLORS[platform.name]}`}>
                  {PLATFORM_ICONS[platform.name]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{platform.name.charAt(0) + platform.name.slice(1).toLowerCase()}</p>
                  <p className="text-sm text-gray-500">{platform.handle}</p>
                </div>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={connected.includes(platform.id)}
                onChange={() => handleToggle(platform.id)}
                title={connected.includes(platform.id) ? 'Disconnect' : 'Connect'}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Followers</p>
                <p className="text-sm font-bold text-gray-900">{formatNumber(platform.followers)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Engagement</p>
                <p className="text-sm font-bold text-lime-600">{platform.engagementRate}%</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Posts</p>
                <p className="text-sm font-bold text-gray-900">{formatNumber(platform.postsCount)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Compose Post</h2>
              <button onClick={() => setComposeOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Platform</label>
                <Select
                  value={compose.platform}
                  onChange={(e) => setCompose({ ...compose, platform: e.target.value })}
                  options={platforms.map(p => ({ value: p.name, label: p.name.charAt(0) + p.name.slice(1).toLowerCase() }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Content</label>
                <Textarea
                  rows={5}
                  placeholder="Write your post content..."
                  value={compose.content}
                  onChange={(e) => setCompose({ ...compose, content: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Schedule For</label>
                <Input
                  type="datetime-local"
                  value={compose.scheduledFor}
                  onChange={(e) => setCompose({ ...compose, scheduledFor: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setComposeOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { setComposeOpen(false); setCompose({ platform: 'INSTAGRAM', content: '', scheduledFor: '' }); }}>
                  Schedule Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}