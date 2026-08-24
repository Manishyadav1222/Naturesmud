'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { ArrowLeft, Save, CircleAlert } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'READY', label: 'Ready for Shipping' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PARTIAL', label: 'Partial' },
];

export default function AdminOrderEditPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { hasPermission } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: '',
    trackingNumber: '',
  });

  const canManageOrders = hasPermission(PERMISSIONS.MANAGE_ORDERS);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ data: any }>(`/orders/${orderId}`);
      const o = res.data;
      setFormData({
        status: o.status || 'PENDING',
        paymentStatus: o.paymentStatus || 'UNPAID',
        shippingName: o.shippingAddress?.fullName || '',
        shippingEmail: o.customer?.email || '',
        shippingPhone: o.shippingAddress?.phone || '',
        shippingAddress: o.shippingAddress?.addressLine1 || '',
        shippingCity: o.shippingAddress?.city || '',
        shippingCountry: o.shippingAddress?.country || '',
        trackingNumber: o.trackingNumber || '',
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load order');
      }
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageOrders) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await api.put(`/orders/${orderId}`, formData);
      router.push(`/admin/orders/${orderId}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to update order');
      }
      setIsSubmitting(false);
    }
  };

  if (!canManageOrders) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage orders."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error && !formData.status) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Failed to load order"
        description={error}
        action={<Button onClick={fetchOrder}>Retry</Button>}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push(`/admin/orders/${orderId}`)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Order #{orderId}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(`/admin/orders/${orderId}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
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

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Order Status</label>
              <Select name="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Payment Status</label>
              <Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} options={PAYMENT_STATUS_OPTIONS} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Name</label>
              <Input name="shippingName" value={formData.shippingName} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Phone</label>
              <Input name="shippingPhone" value={formData.shippingPhone} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Email</label>
              <Input name="shippingEmail" type="email" value={formData.shippingEmail} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Address</label>
              <Input name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping City</label>
              <Input name="shippingCity" value={formData.shippingCity} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Country</label>
              <Input name="shippingCountry" value={formData.shippingCountry} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tracking Number</label>
            <Input name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} placeholder="e.g. TRK123456789" />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
