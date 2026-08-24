'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { formatNumber, formatDate, timeAgo } from '@/lib/admin/utils';
import {
  ArrowLeft, CircleAlert, Pencil, Globe, Eye, Calendar, User, Tag, Clock, Star as StarIcon
} from 'lucide-react';

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author?: { id: string; name: string; email: string } | null;
  status: string;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = hasPermission(PERMISSIONS.MANAGE_BLOG);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<BlogPostDetail>(`/blog/${params.id}`);
        setPost(res);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.message);
        else setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const handleToggleFeatured = async () => {
    if (!post || !canManage) return;
    try {
      await api.put(`/blog/${post.id}`, { isFeatured: !post.isFeatured });
      setPost({ ...post, isFeatured: !post.isFeatured });
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  const handleChangeStatus = async (status: string) => {
    if (!post || !canManage) return;
    try {
      await api.put(`/blog/${post.id}`, { status });
      setPost({ ...post, status });
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <EmptyState
        icon={<Globe className="h-12 w-12 text-red-400" />}
        title="Post not found"
        description={error || 'This blog post could not be found.'}
        action={<Button size="sm" onClick={() => router.push('/admin/blog')}>Back to Blog</Button>}
      />
    );
  }

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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/blog')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              {getStatusBadge(post.status)}
            </div>
            <p className="mt-1 text-sm text-gray-500">/blog/{post.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleToggleFeatured} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <StarIcon className={`h-4 w-4 ${post.isFeatured ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}`} />
            {post.isFeatured ? 'Featured' : 'Mark Featured'}
          </button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/blog/${post.id}/edit`)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <Globe className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Eye className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Views</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(post.viewCount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50">
              <Calendar className="h-5 w-5 text-lime-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-lg font-bold text-gray-900">{post.publishedAt ? formatDate(post.publishedAt) : '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
              <Tag className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-lg font-bold text-gray-900">{post.category || 'Uncategorized'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Author</p>
              <p className="text-lg font-bold text-gray-900">{post.author?.name || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {post.featuredImage && (
            <Card className="overflow-hidden">
              <img src={post.featuredImage} alt={post.title} className="aspect-video w-full object-cover" />
            </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              {post.excerpt && (
                <p className="mb-6 border-l-4 border-lime-500 pl-4 text-base italic text-gray-600">
                  {post.excerpt}
                </p>
              )}
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{post.content}</p>
              </div>
            </CardContent>
          </Card>

          {post.tags && post.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">Workflow</h3>
              <div className="space-y-2">
                {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleChangeStatus(status)}
                    disabled={!canManage}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      post.status === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                    {post.status === status && <StarIcon className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">SEO</h3>
              {post.seoTitle && (
                <p className="mb-2 text-sm font-medium text-gray-800">{post.seoTitle}</p>
              )}
              {post.seoDescription && (
                <p className="mb-2 text-sm text-gray-500">{post.seoDescription}</p>
              )}
              {post.seoKeywords && (
                <p className="text-xs text-gray-400">{post.seoKeywords}</p>
              )}
              {!post.seoTitle && !post.seoDescription && (
                <p className="text-sm text-gray-400">No SEO data set.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-gray-800">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium text-gray-800">{timeAgo(post.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}