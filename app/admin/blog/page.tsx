'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  FileText,
  Plus,
  Search,
  CircleAlert,
  Eye,
  Pencil,
  Trash2,
  Globe,
  Clock,
  Star,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  isFeatured: boolean;
  author?: { firstName: string; lastName: string } | null;
  publishedAt?: string | null;
  createdAt: string;
}

interface BlogResponse {
  data: BlogPost[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function AdminBlogPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageBlog = hasPermission(PERMISSIONS.MANAGE_BLOG);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<BlogResponse>(`/blog?${params.toString()}`);
      setPosts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load blog posts');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleToggleFeatured = async (post: BlogPost) => {
    if (!canManageBlog) return;
    try {
      await api.put(`/blog/${post.id}`, { isFeatured: !post.isFeatured });
      fetchPosts();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!canManageBlog) return;
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      await api.delete(`/blog/${post.id}`);
      fetchPosts();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (!hasPermission(PERMISSIONS.MANAGE_BLOG)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage blog posts."
      />
    );
  }

  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;
  const draftCount = posts.filter(p => p.status === 'DRAFT').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-lime-50 text-lime-700 border-lime-200">Published</Badge>;
      case 'DRAFT':
        return <Badge className="bg-accent-50 text-accent-700 border-accent-200">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-gray-50 text-gray-500 border-gray-200">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(pagination.total)} posts total
          </p>
        </div>
        <Button size="sm" onClick={() => router.push('/admin/blog/new')}>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Published" value={formatNumber(publishedCount)} icon={<Globe className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Drafts" value={formatNumber(draftCount)} icon={<FileText className="h-5 w-5 text-accent-600" />} />
        <StatCard title="Total Views" value={formatNumber(totalViews)} icon={<Eye className="h-5 w-5 text-primary-600" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              placeholder="All Statuses"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-gray-300" />}
          title="No blog posts found"
          description="Create your first blog post to start publishing content."
          action={<Button onClick={() => router.push('/admin/blog/new')}>New Post</Button>}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="h-12 w-16 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-gray-500">
                              /blog/{post.slug} · {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.category || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(post.views)}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleFeatured(post)}>
                          <Star className={cn(
                            'h-5 w-5',
                            post.isFeatured ? 'text-accent-500 fill-accent-500' : 'text-gray-300 hover:text-gray-400'
                          )} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(post.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/blog/${post.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/blog/${post.id}/edit`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(post)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}