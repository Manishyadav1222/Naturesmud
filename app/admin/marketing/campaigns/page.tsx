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
import { Megaphone, Search, Plus, CircleAlert, Pencil, Trash2, Calendar, Target, Users, BarChart3 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL' | 'WEBSITE';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  startsAt: string;
  endsAt?: string | null;
  budget?: number | null;
  spent?: number | null;
  reach?: number | null;
  clicks?: number | null;
  conversions?: number | null;
  description?: string | null;
}

interface CampaignResponse {
  data: Campaign[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_BADGES: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  ACTIVE: { label: 'Active', variant: 'success' },
  PAUSED: { label: 'Paused', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'info' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

const CHANNEL_BADGES: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary' }> = {
  EMAIL: { label: 'Email', variant: 'info' },
  SMS: { label: 'SMS', variant: 'warning' },
  PUSH: { label: 'Push', variant: 'secondary' },
  SOCIAL: { label: 'Social', variant: 'success' },
  WEBSITE: { label: 'Website', variant: 'danger' },
};

export default function AdminCampaignsPage() {
  const { hasPermission } = useAdminAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  const canManage = hasPermission(PERMISSIONS.MANAGE_CAMPAIGNS);

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<CampaignResponse>(`/marketing/campaigns?${params.toString()}`);
      setCampaigns(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else setError('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDelete = async (campaign: Campaign) => {
    if (!confirm(`Delete campaign "${campaign.name}"?`)) return;
    try {
      await api.delete(`/marketing/campaigns/${campaign.id}`);
      fetchCampaigns();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  };

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage campaigns."
      />
    );
  }

  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalReach = campaigns.reduce((sum, c) => sum + (c.reach || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage your marketing campaigns.</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Campaigns" value={formatNumber(activeCount)} icon={<Megaphone className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Total Reach" value={formatNumber(totalReach)} icon={<Users className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Total Clicks" value={formatNumber(totalClicks)} icon={<BarChart3 className="h-5 w-5 text-accent-600" />} />
        <StatCard title="Conversions" value={formatNumber(totalConversions)} icon={<Target className="h-5 w-5 text-gray-600" />} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search campaigns..."
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
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-12 w-12 text-gray-300" />}
          title="No campaigns found"
          description="Create your first campaign to start driving engagement."
          action={<Button onClick={() => setIsCreateOpen(true)}>Create Campaign</Button>}
        />
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-50 p-2">
                  <Megaphone className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{campaign.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge variant={CHANNEL_BADGES[campaign.channel]?.variant || 'secondary'}>
                      {CHANNEL_BADGES[campaign.channel]?.label || campaign.channel}
                    </Badge>
                    <Badge variant={STATUS_BADGES[campaign.status]?.variant || 'secondary'}>
                      {STATUS_BADGES[campaign.status]?.label || campaign.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Reach</p>
                  <p className="text-gray-900">{campaign.reach ? formatNumber(campaign.reach) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="text-gray-900">{campaign.clicks ? formatNumber(campaign.clicks) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-gray-900">{campaign.budget ? `Rs. ${formatNumber(campaign.budget)}` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Starts</p>
                  <p className="text-gray-900">{formatDate(campaign.startsAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(campaign)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(campaign)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CampaignModal
        open={isCreateOpen || !!editing}
        onClose={() => { setIsCreateOpen(false); setEditing(null); }}
        campaign={editing}
        onSuccess={() => { setIsCreateOpen(false); setEditing(null); fetchCampaigns(); }}
      />
    </div>
  );
}

function CampaignModal({ open, onClose, campaign, onSuccess }: {
  open: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: campaign?.name || '',
    channel: campaign?.channel || 'EMAIL',
    startsAt: campaign?.startsAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    endsAt: campaign?.endsAt?.split('T')[0] || '',
    budget: campaign?.budget?.toString() || '',
    description: campaign?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        name: campaign?.name || '',
        channel: campaign?.channel || 'EMAIL',
        startsAt: campaign?.startsAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        endsAt: campaign?.endsAt?.split('T')[0] || '',
        budget: campaign?.budget?.toString() || '',
        description: campaign?.description || '',
      });
      setError(null);
    }
  }, [open, campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      };

      if (campaign) {
        await api.patch(`/marketing/campaigns/${campaign.id}`, payload);
      } else {
        await api.post('/marketing/campaigns', payload);
      }
      onSuccess();
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={campaign ? 'Edit Campaign' : 'Create Campaign'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Campaign Name</label>
            <Input required placeholder="Summer Sale 2025" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Channel</label>
            <Select
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value as 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL' | 'WEBSITE' })}
              options={[
                { value: 'EMAIL', label: 'Email' },
                { value: 'SMS', label: 'SMS' },
                { value: 'PUSH', label: 'Push Notification' },
                { value: 'SOCIAL', label: 'Social Media' },
                { value: 'WEBSITE', label: 'Website' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Budget (Rs.)</label>
            <Input type="number" min="0" placeholder="Optional" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
            <Input required type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
            <Input type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <Textarea rows={3} placeholder="Campaign description and goals" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? 'Saving...' : campaign ? 'Save Changes' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}