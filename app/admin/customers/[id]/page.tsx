'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { formatNPR, formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  CircleAlert,
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Wallet,
  Star,
  ChevronLeft,
  Package,
  CalendarDays,
} from 'lucide-react';

interface CustomerDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
  addresses?: Address[];
  reviews?: Review[];
  rewardPoints?: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  _count?: { items: number };
}

interface Address {
  id: string;
  type: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  status: string;
  product?: { id: string; name: string; image?: string | null };
  createdAt: string;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageCustomers = hasPermission(PERMISSIONS.MANAGE_CUSTOMERS);

  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ data: CustomerDetail }>(`/customers/${customerId}`);
      setCustomer(res.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load customer');
      }
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (!hasPermission(PERMISSIONS.MANAGE_CUSTOMERS)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view customers."
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-lime-50 text-lime-700 border-lime-200';
      case 'SHIPPED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING': return 'bg-accent-50 text-accent-700 border-accent-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48"><Skeleton className="h-8 w-48" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Failed to load customer"
        description={error || 'Customer not found'}
        action={<Button onClick={fetchCustomer}>Retry</Button>}
      />
    );
  }

  const totalOrders = customer.orders?.length || 0;
  const totalSpent = customer.orders?.reduce((sum, o) => sum + o.total, 0) || 0;
  const avgRating = customer.reviews?.length
    ? customer.reviews.reduce((sum, r) => sum + r.rating, 0) / customer.reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" onClick={() => router.push('/admin/customers')}>
        <ChevronLeft className="h-4 w-4" />
        Back to Customers
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {customer.avatar ? (
            <img src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
              <UserRound className="h-8 w-8 text-primary-600" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              Customer since {new Date(customer.createdAt).toLocaleDateString()} · ID: {customer.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <Badge className={cn(
          customer.isActive
            ? 'bg-lime-50 text-lime-700 border-lime-200'
            : 'bg-gray-50 text-gray-500 border-gray-200'
        )}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={formatNumber(totalOrders)}
          icon={<ShoppingBag className="h-5 w-5 text-primary-600" />}
        />
        <StatCard
          title="Total Spent"
          value={formatNPR(totalSpent)}
          icon={<Wallet className="h-5 w-5 text-lime-600" />}
        />
        <StatCard
          title="Avg Rating"
          value={avgRating ? avgRating.toFixed(1) : '—'}
          icon={<Star className="h-5 w-5 text-accent-600" />}
        />
        <StatCard
          title="Reward Points"
          value={formatNumber(customer.rewardPoints || 0)}
          icon={<Star className="h-5 w-5 text-primary-600" />}
        />
      </div>

      {/* Contact & Addresses */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <CircleAlert className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Last updated {timeAgo(customer.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h2>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">{address.type}</span>
                        {address.isDefault && (
                          <Badge className="bg-primary-50 text-primary-700 border-primary-200">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ''}, {address.city}
                        {address.state ? `, ${address.state}` : ''} {address.postalCode || ''}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No addresses on file.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            <Badge className="bg-primary-50 text-primary-700 border-primary-200">
              {formatNumber(totalOrders)} orders
            </Badge>
          </div>
          {customer.orders && customer.orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customer.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(order._count?.items || 0)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatNPR(order.total)}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<Package className="h-10 w-10 text-gray-300" />}
                title="No orders yet"
                description="This customer hasn't placed any orders."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}