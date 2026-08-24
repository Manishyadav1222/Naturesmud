'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { formatNPR, formatNumber, timeAgo } from '@/lib/admin/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Wallet,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  CircleAlert,
  Boxes,
  Activity,
} from 'lucide-react';

interface DashboardPayload {
  revenue: { total: number; today: number; thisMonth: number; growth: number };
  orders: { total: number; today: number; pending: number; growth: number };
  customers: { total: number; newThisMonth: number; growth: number };
  products: { total: number; active: number; lowStock: number };
  recentOrders: any[];
  topProducts: { id: string; name: string; image?: string | null; soldCount: number; revenue: number }[];
  salesByDay: { date: string; revenue: number; orders: number }[];
  categoryBreakdown: { category: string; count: number; revenue: number }[];
  notifications: { id: string; type: string; message: string; createdAt: string; read: boolean }[];
}


const ORDER_COLORS: Record<string, string> = {
  PENDING: 'bg-accent-50 text-accent-700 border-accent-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PACKED: 'bg-purple-50 text-purple-700 border-purple-200',
  READY: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-lime-50 text-lime-700 border-lime-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-orange-50 text-orange-700 border-orange-200',
};

const PIE_COLORS = ['#365314', '#84cc16', '#ca8a04', '#3b82f6', '#8b5cf6', '#06b6d4'];

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsLiveSyncing(true);
      }
      const res = await api.get<{ data: DashboardPayload }>('/dashboard/stats');
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      if (!silent) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to load dashboard data');
        }
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsLiveSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  // Real-time silent background auto-polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Loading your business overview...</p>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <Card className="p-6 xl:col-span-2">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Failed to load dashboard"
        description={error}
        action={
          <Button onClick={() => fetchStats(false)}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!data) return null;

  const { revenue, orders, customers, products, recentOrders, topProducts, salesByDay, categoryBreakdown } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Feed Active</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name || 'Admin'}! Real-time business overview & recent orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4" />
              View Orders
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button size="sm">
              <ArrowUpRight className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {/* Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatNPR(revenue.total)}</p>
                <div className="mt-2 flex items-center gap-2">
                  {revenue.growth >= 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-600">
                      <TrendingUp className="h-3 w-3" />
                      {revenue.growth}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      {revenue.growth}%
                    </span>
                  )}
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-50">
                <Wallet className="h-6 w-6 text-lime-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
              <span className="text-gray-500">Today</span>
              <span className="font-semibold text-gray-900">{formatNPR(revenue.today)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(orders.total)}</p>
                <div className="mt-2 flex items-center gap-2">
                  {orders.growth >= 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-600">
                      <TrendingUp className="h-3 w-3" />
                      {orders.growth}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      {orders.growth}%
                    </span>
                  )}
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50">
                <ShoppingCart className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
              <span className="text-gray-500">Pending</span>
              <span className="font-semibold text-accent-600">{formatNumber(orders.pending)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(customers.total)}</p>
                <div className="mt-2 flex items-center gap-2">
                  {customers.growth >= 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-600">
                      <TrendingUp className="h-3 w-3" />
                      {customers.growth}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      {customers.growth}%
                    </span>
                  )}
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
              <span className="text-gray-500">New this month</span>
              <span className="font-semibold text-primary-600">{formatNumber(customers.newThisMonth)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatNumber(products.total)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    <Package className="h-3 w-3" />
                    {products.active} active
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {products.lowStock > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <span className="text-gray-500">Low stock</span>
                <span className="font-semibold text-red-600 flex items-center gap-1">
                  <CircleAlert className="h-3.5 w-3.5" />
                  {formatNumber(products.lowStock)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Analytics</CardTitle>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-lime-500" /> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-600" /> Orders
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#365314" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#365314" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(value) => `रु${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#365314"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#84cc16"
                    strokeWidth={2}
                    fill="transparent"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Link href="/admin/products" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <EmptyState
                  icon={<Package className="h-8 w-8 text-gray-300" />}
                  title="No products yet"
                  description="Add products to see top performers here."
                />
              ) : (
                topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                      ) : (
                        <Boxes className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(product.soldCount)} sold · {formatNPR(product.revenue)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart className="h-8 w-8 text-gray-300" />}
                title="No orders yet"
                description="When customers place orders, they'll show up here."
              />
            ) : (
              <div className="space-y-4">
                {recentOrders.slice(0, 6).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                        <ShoppingCart className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer?.name || 'Guest'} 
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.id} · {timeAgo(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{formatNPR(order.grandTotal)}</span>
                      <Badge className={ORDER_COLORS[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                        {order.status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer row: Low stock + Recent reviews */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Low stock alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <Link href="/admin/inventory" className="text-sm text-primary-600 hover:text-primary-700">
                Manage Inventory
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {products.lowStock === 0 ? (
              <EmptyState
                icon={<Package className="h-8 w-8 text-lime-300" />}
                title="All products stocked"
                description="No low stock items right now."
              />
            ) : (
              <div className="space-y-3">
                {/* This would come from API in real implementation */}
                <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <CircleAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {products.lowStock} product(s) below threshold
                      </p>
                      <p className="text-xs text-red-600">Review inventory levels</p>
                    </div>
                  </div>
                  <Link href="/admin/inventory?filter=low-stock">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-100"
                    >
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.notifications.length === 0 ? (
                <EmptyState
                  icon={<Activity className="h-8 w-8 text-gray-300" />}
                  title="No activity yet"
                  description="Actions in the admin will appear here."
                />
              ) : (
                data.notifications.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                      <Activity className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2">{activity.message}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{timeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}