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
import { formatNPR, formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  Users,
  Search,
  CircleAlert,
  UserRound,
  ShoppingBag,
  Wallet,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  isActive: boolean;
  _count?: { orders: number };
  _sum?: { orders: { total?: number | null } };
  createdAt: string;
}

interface CustomerResponse {
  data: Customer[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageCustomers = hasPermission(PERMISSIONS.MANAGE_CUSTOMERS);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit) });
      if (search) params.set('search', search);
      if (status) params.set('status', status);

      const res = await api.get<CustomerResponse>(`/customers?${params.toString()}`);
      setCustomers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load customers');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  if (!hasPermission(PERMISSIONS.MANAGE_CUSTOMERS)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view customers."
      />
    );
  }

  const totalSpent = customers.reduce((sum, c) => sum + (c._sum?.orders?.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(pagination.total)} registered customers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Customers" value={formatNumber(pagination.total)} icon={<Users className="h-5 w-5 text-primary-600" />} />
        <StatCard title="Total Orders" value={formatNumber(customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0))} icon={<ShoppingBag className="h-5 w-5 text-lime-600" />} />
        <StatCard title="Lifetime Value" value={formatNPR(totalSpent)} icon={<Wallet className="h-5 w-5 text-accent-600" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12 text-gray-300" />}
          title="No customers found"
          description="Customers will appear here when they register."
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/customers/${customer.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                              <UserRound className="h-5 w-5 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-xs text-gray-500">ID: {customer.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-1.5 text-gray-600">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {customer.email}
                          </p>
                          {customer.phone && (
                            <p className="flex items-center gap-1.5 text-gray-600">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-primary-50 text-primary-700 border-primary-200">
                          {formatNumber(customer._count?.orders || 0)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatNPR(customer._sum?.orders?.total || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(customer.createdAt)}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          customer.isActive
                            ? 'bg-lime-50 text-lime-700 border-lime-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        )}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} · {formatNumber(pagination.total)} customers
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}