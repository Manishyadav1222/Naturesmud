'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Textarea } from '@/components/admin/Textarea';
import { Select } from '@/components/admin/Select';
import { EmptyState } from '@/components/admin/EmptyState';
import { CircleAlert, ArrowLeft, Save, Image as ImageIcon, Tag, Check } from 'lucide-react';
import MediaUploader from '@/components/admin/MediaUploader';

export default function AdminBlogNewPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'skincare',
    tags: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasPermission(PERMISSIONS.MANAGE_BLOG)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to create blog posts."
      />
    );
  }

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'title' && !form.slug) {
      const newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setForm(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      const res = await api.post('/blog', payload);
      const id = (res as { id?: string; data?: { id?: string } })?.id || (res as { data?: { id?: string } })?.data?.id;
      router.push(id ? `/admin/blog/${id}` : '/admin/blog');
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else setError('Failed to create blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";
  const labelCls = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
            <p className="mt-1 text-sm text-gray-500">Create a new article for your blog.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/blog')}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish Post
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <Input
                    placeholder="Enter post title"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <Input
                    placeholder="auto-generated"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Excerpt</label>
                  <Textarea
                    placeholder="Short summary of the post"
                    value={form.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Content *</label>
                  <textarea
                    className={`${inputCls} min-h-[300px] font-mono text-xs leading-relaxed`}
                    placeholder="Write your post content (supports markdown)..."
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>SEO Title</label>
                  <Input value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>SEO Description</label>
                  <Textarea value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>SEO Keywords</label>
                  <Input placeholder="comma, separated, keywords" value={form.seoKeywords} onChange={(e) => handleChange('seoKeywords', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <MediaUploader
                label="Featured Image"
                value={form.featuredImage}
                onChange={(url) => handleChange('featuredImage', url)}
                defaultAspectRatio="16:9"
                folder="blog"
                hint="Adjust to 16:9 Banner, 9:16 Reel, or 1:1 Square"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Publishing</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Status</label>
                  <Select
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    options={[
                      { value: 'DRAFT', label: 'Draft' },
                      { value: 'PUBLISHED', label: 'Published' },
                      { value: 'ARCHIVED', label: 'Archived' },
                    ]}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <Select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={[
                      { value: 'skincare', label: 'Skincare' },
                      { value: 'wellness', label: 'Wellness' },
                      { value: 'products', label: 'Products' },
                      { value: 'lifestyle', label: 'Lifestyle' },
                    ]}
                  />
                </div>
                <div>
                  <label className={labelCls}>Tags</label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <Input placeholder="natural, diy, skincare" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} />
                  </div>
                </div>
                {form.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-2 rounded-lg bg-lime-50 p-3 text-sm text-lime-700">
                    <Check className="h-4 w-4" />
                    This post will be public immediately.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
