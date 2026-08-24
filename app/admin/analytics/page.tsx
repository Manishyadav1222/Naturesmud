'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Select } from '@/components/admin/Select';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { Skeleton } from '@/components/admin/Skeleton';
import { formatNumber } from '@/lib/admin/utils';
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
  CircleAlert,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  Sparkles,
  Package,
  Layers,
  MapPin,
  CheckCircle2,
  Inbox,
} from 'lucide-react';

interface AnalyticsPayload {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    avgOrderValue: number;
    revenueToday: number;
    ordersToday: number;
    growthRate: number;
  };
  timeSeries: Array<{ label: string; value: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; slug: string; price: number; sales: number; revenue: number }>;
  salesByRegion: Array<{ region: string; orders: number; revenue: number }>;
  categoryBreakdown: Array<{ category: string; productCount: number; totalSold: number | string; revenue: number | string }>;
  ordersByStatus: Record<string, number>;
}

const PIE_COLORS = ['#2D5A27', '#C9982A', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export default function AdminAnalyticsPage() {
  const { hasPermission } = useAdminAuth();
  const [period, setPeriod] = useState<string>('12M');
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canView = hasPermission(PERMISSIONS.VIEW_ANALYTICS);

  const fetchAnalytics = useCallback(async (selectedPeriod: string, showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await api.get<{ success: boolean; data: AnalyticsPayload }>(`/analytics?period=${selectedPeriod}`);
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load live analytics data.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (canView) {
      fetchAnalytics(period);
    }
  }, [period, canView, fetchAnalytics]);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Revenue (NPR)', data.summary.totalRevenue.toString()],
      ['Total Orders', data.summary.totalOrders.toString()],
      ['Total Customers', data.summary.totalCustomers.toString()],
      ['Average Order Value (NPR)', data.summary.avgOrderValue.toString()],
      ['Active Products in Catalog', data.summary.totalProducts.toString()],
      ['Revenue Today (NPR)', data.summary.revenueToday.toString()],
      ['Orders Today', data.summary.ordersToday.toString()],
      [],
      ['Category Breakdown', 'Products', 'Sold Count', 'Revenue (NPR)'],
      ...data.categoryBreakdown.map((c) => [c.category, c.productCount.toString(), c.totalSold.toString(), c.revenue.toString()]),
      [],
      ['Timeline Period', 'Revenue (NPR)', 'Orders Count'],
      ...data.timeSeries.map((t) => [t.label, t.value.toString(), t.orders.toString()]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `natures_mud_analytics_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!canView) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You do not have permission to view analytics and reports."
      />
    );
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 23,
    avgOrderValue: 0,
    revenueToday: 0,
    ordersToday: 0,
    growthRate: 0,
  };

  const timeSeries = data?.timeSeries || [];
  const topProducts = data?.topProducts || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const salesByRegion = data?.salesByRegion || [];
  const hasOrders = summary.totalOrders > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Live Analytics & Performance</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB Ready
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Real-time business performance, revenue streams, and customer metrics starting fresh from zero.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: '30D', label: 'Last 30 days' },
              { value: '90D', label: 'Last 90 days' },
              { value: '12M', label: 'Last 12 months' },
            ]}
          />

          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchAnalytics(period, true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button size="sm" variant="outline" onClick={handleExportCSV} className="flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <CircleAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fresh Launch Banner (When starting from 0) */}
      {!hasOrders && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2D5A27]/10 via-[#C9982A]/10 to-transparent border border-[#2D5A27]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#EBC164]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Launch Clean State Active — Zero Past Orders & Zero Dummy Metrics
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                All mock test records and fake counts have been cleared. As soon as your first storefront customers checkout, this page will graph their real purchases instantly.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700">
              Catalog: {summary.totalProducts} Active Products
            </span>
          </div>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${formatNumber(summary.totalRevenue)}`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          subtitle={summary.revenueToday > 0 ? `+Rs. ${formatNumber(summary.revenueToday)} today` : 'Rs. 0 today'}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(summary.totalOrders)}
          icon={<ShoppingBag className="h-5 w-5 text-primary-600" />}
          subtitle={summary.ordersToday > 0 ? `+${summary.ordersToday} today` : '0 orders today'}
        />
        <StatCard
          title="Avg. Order Value (AOV)"
          value={`Rs. ${formatNumber(summary.avgOrderValue)}`}
          icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
          subtitle="Revenue per order"
        />
        <StatCard
          title="Active Products"
          value={`${summary.totalProducts} Items`}
          icon={<Package className="h-5 w-5 text-blue-600" />}
          subtitle="Ready for purchase"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Sales Trend */}
        <Card className="rounded-2xl shadow-xs border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2D5A27]" /> Revenue Trend (NPR)
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  {period === '30D' ? 'Daily revenue breakdown for last 30 days' : 'Monthly revenue for the last 12 months'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                {period}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2D5A27" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Rs.${val}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Period: ${label}`}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderRadius: '8px',
                      color: '#FFF',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2D5A27"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Product Distribution & Sales */}
        <Card className="rounded-2xl shadow-xs border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C9982A]" /> Catalog Category Share
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Product distribution across active categories</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-between">
              <div className="h-full w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="productCount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} products`, name]}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        borderRadius: '8px',
                        color: '#FFF',
                        border: 'none',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full sm:w-1/2 space-y-1.5 pl-2 overflow-y-auto max-h-56">
                {categoryBreakdown.map((c, i) => (
                  <div key={c.category} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="font-semibold text-gray-800 truncate">{c.category}</span>
                    </div>
                    <span className="text-gray-500 font-mono shrink-0">{c.productCount} items</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Grid: Top Products & Sales by Region */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card className="rounded-2xl shadow-xs border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Best Performing Products
            </CardTitle>
            <p className="text-xs text-gray-500">Ranked by units sold and revenue contribution</p>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-gray-400">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">Rs. {formatNumber(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800">No Sales Data Yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Products are published and ready for launch. Top performers will appear here as soon as orders start rolling in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Region */}
        <Card className="rounded-2xl shadow-xs border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Sales by Province / City
            </CardTitle>
            <p className="text-xs text-gray-500">Geographic customer demand across Nepal</p>
          </CardHeader>
          <CardContent>
            {salesByRegion.length > 0 ? (
              <div className="space-y-3">
                {salesByRegion.map((region) => (
                  <div key={region.region} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>{region.region}</span>
                      <span>Rs. {formatNumber(region.revenue)} ({region.orders} orders)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(100, Math.max(10, (region.revenue / (summary.totalRevenue || 1)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800">Ready for All 7 Provinces</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Delivery zones configured for Kathmandu Valley, Pokhara, Chitwan, Butwal, Biratnagar, Dharan, and across Nepal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}