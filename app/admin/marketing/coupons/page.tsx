'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Modal } from '@/components/admin/Modal';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/admin/Badge';
import { Textarea } from '@/components/admin/Textarea';
import { formatNumber, formatDate } from '@/lib/admin/utils';
import { TicketPercent, Search, Plus, CircleAlert, Copy, Pencil, Check, Trash2, Calendar } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit: number;
  usageCount: number;
  startsAt: string;
  expiresAt?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SCHEDULED';
  description?: string | null;
}

interface CouponResponse {
  data: Coupon[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_BADGES: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'danger' },
  EXPIRED: { label: 'Expired', variant: 'danger' },
  SCHEDULED: { label: 'Scheduled', variant: 'warning' },
};

export default function AdminCouponsPage() {
  const { hasPermission } = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const canManage = hasPermission(PERMISSIONS.MANAGE_COUPONS);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<CouponResponse>(`/marketing/coupons?${params.toString()}`);
      setCoupons(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else setError('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await api.patch(`/marketing/coupons/${coupon.id}`, {
        status: coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      fetchCoupons();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon "${coupon.code}"?`)) return;
    try {
      await api.delete(`/marketing/coupons/${coupon.id}`);
      fetchCoupons();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage coupons."
      />
    );
  }

  const activeCount = coupons.filter((c) => c.status === 'ACTIVE').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const scheduledCount = coupons.filter((c) => c.status === 'SCHEDULED').length;

  const getDiscountLabel = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'PERCENTAGE': return `${coupon.value}% OFF`;
      case 'FIXED': return `Rs. ${formatNumber(coupon.value)} OFF`;
      case 'FREE_SHIPPING': return 'Free Shipping';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons & Deals</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage promotional discount codes.</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Coupons" value={formatNumber(activeCount)} icon={<TicketPercent className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Total Usage" value={formatNumber(totalUsage)} icon={<Copy className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Scheduled" value={formatNumber(scheduledCount)} icon={<Calendar className="h-5 w-5 text-accent-600" />} />
        <StatCard title="Total Coupons" value={formatNumber(pagination.total)} icon={<TicketPercent className="h-5 w-5 text-gray-600" />} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by code..."
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
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={<TicketPercent className="h-12 w-12 text-gray-300" />}
          title="No coupons found"
          description="Create your first promotional coupon to drive sales."
          action={<Button onClick={() => setIsCreateOpen(true)}>Create Coupon</Button>}
        />
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const badge = STATUS_BADGES[coupon.status];
            const isExpiring = coupon.expiresAt && new Date(coupon.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 && coupon.status === 'ACTIVE';
            return (
              <div key={coupon.id} className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-lime-50 p-2">
                    <TicketPercent className="h-5 w-5 text-lime-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-gray-900">{coupon.code}</span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copied === coupon.code ? <Check className="h-4 w-4 text-lime-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-primary-600">{getDiscountLabel(coupon)}</span>
                      {isExpiring && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <CircleAlert className="h-3 w-3" />
                          Expiring soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid gap-4 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="text-gray-900">{formatNumber(coupon.usageCount)} / {formatNumber(coupon.usageLimit)} used</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Min Order</p>
                    <p className="text-gray-900">{coupon.minOrderAmount ? `Rs. ${formatNumber(coupon.minOrderAmount)}` : 'No minimum'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid</p>
                    <p className="text-gray-900">{coupon.expiresAt ? formatDate(coupon.expiresAt) : 'No expiry'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <button
                    onClick={() => setEditing(coupon)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CouponModal
        open={isCreateOpen || !!editing}
        onClose={() => { setIsCreateOpen(false); setEditing(null); }}
        coupon={editing}
        onSuccess={() => { setIsCreateOpen(false); setEditing(null); fetchCoupons(); }}
      />
    </div>
  );
}

function CouponModal({ open, onClose, coupon, onSuccess }: {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<{
    code: string;
    type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
    value: string;
    minOrderAmount: string;
    maxDiscountAmount: string;
    usageLimit: string;
    startsAt: string;
    expiresAt: string;
    description: string;
  }>({
    code: coupon?.code || '',
    type: coupon?.type || 'PERCENTAGE',
    value: coupon?.value?.toString() || '',
    minOrderAmount: coupon?.minOrderAmount?.toString() || '',
    maxDiscountAmount: coupon?.maxDiscountAmount?.toString() || '',
    usageLimit: coupon?.usageLimit?.toString() || '100',
    startsAt: coupon?.startsAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    expiresAt: coupon?.expiresAt?.split('T')[0] || '',
    description: coupon?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        code: coupon?.code || '',
        type: coupon?.type || 'PERCENTAGE',
        value: coupon?.value?.toString() || '',
        minOrderAmount: coupon?.minOrderAmount?.toString() || '',
        maxDiscountAmount: coupon?.maxDiscountAmount?.toString() || '',
        usageLimit: coupon?.usageLimit?.toString() || '100',
        startsAt: coupon?.startsAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        expiresAt: coupon?.expiresAt?.split('T')[0] || '',
        description: coupon?.description || '',
      });
      setError(null);
    }
  }, [open, coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        usageLimit: Number(form.usageLimit),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      };

      if (coupon) {
        await api.patch(`/marketing/coupons/${coupon.id}`, payload);
      } else {
        await api.post('/marketing/coupons', payload);
      }
      onSuccess();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={coupon ? 'Edit Coupon' : 'Create Coupon'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Coupon Code</label>
            <Input
              required
              placeholder="WELCOME10"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING' })}
              options={[
                { value: 'PERCENTAGE', label: 'Percentage Off' },
                { value: 'FIXED', label: 'Fixed Amount Off' },
                { value: 'FREE_SHIPPING', label: 'Free Shipping' },
              ]}
            />
          </div>
          {form.type !== 'FREE_SHIPPING' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {form.type === 'PERCENTAGE' ? 'Discount %' : 'Discount Amount (Rs.)'}
              </label>
              <Input
                required
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Usage Limit</label>
            <Input
              required
              type="number"
              min="1"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Min Order Amount</label>
            <Input
              type="number"
              min="0"
              placeholder="Optional"
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max Discount</label>
            <Input
              type="number"
              min="0"
              placeholder="Optional"
              value={form.maxDiscountAmount}
              onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
            <Input
              required
              type="date"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
            <Input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              rows={2}
              placeholder="Optional description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? 'Saving...' : coupon ? 'Save Changes' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}