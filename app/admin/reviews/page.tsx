'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/admin/Badge';
import { formatDate } from '@/lib/admin/utils';
import { Star, Search, CircleAlert, Check, X, MessageSquareWarning, ThumbsUp, ThumbsDown, Ban } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  images?: any;
  status: 'PENDING' | 'APPROVED' | 'FLAGGED' | 'REJECTED';
  helpfulCount: number;
  createdAt: string;
}

interface ReviewResponse {
  data: Review[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_BADGES: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'secondary' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  FLAGGED: { label: 'Flagged', variant: 'danger' },
  REJECTED: { label: 'Rejected', variant: 'secondary' },
};

export default function AdminReviewsPage() {
  const { hasPermission } = useAdminAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = hasPermission(PERMISSIONS.MANAGE_REVIEWS);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<ReviewResponse>(`/reviews?${params.toString()}`);
      setReviews(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleModerate = async (review: Review, newStatus: string) => {
    try {
      await api.patch(`/reviews/${review.id}`, { status: newStatus });
      fetchReviews();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to moderate reviews."
      />
    );
  }

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviews.filter((r) => r.status === 'APPROVED').length;
  const flaggedCount = reviews.filter((r) => r.status === 'FLAGGED').length;
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation</h1>
          <p className="mt-1 text-sm text-gray-500">Review, approve, and manage customer feedback.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending" value={String(pendingCount)} icon={<MessageSquareWarning className="h-5 w-5 text-yellow-600" />} />
        <StatCard title="Approved" value={String(approvedCount)} icon={<ThumbsUp className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Flagged" value={String(flaggedCount)} icon={<Ban className="h-5 w-5 text-red-600" />} />
        <StatCard title="Avg Rating" value={String(avgRating)} icon={<Star className="h-5 w-5 text-accent-600" />} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by product or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={Object.entries(STATUS_BADGES).map(([value, { label }]) => ({ value, label }))}
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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<Star className="h-12 w-12 text-gray-300" />}
          title="No reviews found"
          description="Customer reviews will appear here for moderation."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const badge = STATUS_BADGES[review.status];
            return (
              <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{review.customerName}</p>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{review.productName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                      <span className="text-xs text-gray-400">• {formatDate(review.createdAt)}</span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                    )}
                    {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.images.map((img: any, i: number) => (
                          <img key={i} src={img.url || img} alt="Review image" className="h-16 w-16 rounded-md object-cover border border-gray-200" />
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpfulCount} found helpful
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.status !== 'APPROVED' && (
                      <Button size="sm" variant="outline" onClick={() => handleModerate(review, 'APPROVED')}>
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {review.status !== 'REJECTED' && (
                      <Button size="sm" variant="outline" onClick={() => handleModerate(review, 'REJECTED')}>
                        <ThumbsDown className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}