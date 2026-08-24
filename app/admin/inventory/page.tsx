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
import { Modal } from '@/components/admin/Modal';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { formatNPR, formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import {
  Package,
  Search,
  CircleAlert,
  Boxes,
  AlertTriangle,
  PackageX,
  TrendingUp,
  Minus,
  Plus,
  RefreshCw,
  Warehouse,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    image?: string | null;
    price: number;
  };
  warehouseId: string;
  warehouse?: {
    id: string;
    name: string;
    location?: string | null;
  };
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  updatedAt: string;
}

interface InventoryResponse {
  data: InventoryItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: {
    totalProducts: number;
    totalUnits: number;
    totalValue: number;
    lowStock: number;
    outOfStock: number;
  };
}

interface AdjustmentForm {
  quantity: number;
  type: 'ADD' | 'REMOVE' | 'SET';
  note: string;
}

export default function AdminInventoryPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState({ totalProducts: 0, totalUnits: 0, totalValue: 0, lowStock: 0, outOfStock: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', warehouse: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
  const [adjustForm, setAdjustForm] = useState({ quantity: 1, type: 'ADD' as 'ADD' | 'REMOVE' | 'SET', note: '' });
  const [isAdjusting, setIsAdjusting] = useState(false);

  const canManageInventory = hasPermission(PERMISSIONS.MANAGE_INVENTORY);

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);

      const res = await api.get<InventoryResponse>(`/inventory?${params.toString()}`);
      setItems(res.data);
      setSummary(res.summary);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load inventory');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAdjust = async () => {
    if (!adjustTarget || !canManageInventory) return;
    try {
      setIsAdjusting(true);
      await api.post(`/inventory/${adjustTarget.id}/adjust`, {
        quantity: adjustForm.quantity,
        type: adjustForm.type,
        note: adjustForm.note,
      });
      setAdjustTarget(null);
      fetchInventory();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsAdjusting(false);
    }
  };

  if (!hasPermission(PERMISSIONS.MANAGE_INVENTORY)) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage inventory."
      />
    );
  }

  const getStatusBadge = (item: InventoryItem) => {
    const available = item.quantity - item.reservedQuantity;
    if (available <= 0) {
      return <Badge className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>;
    }
    if (available <= item.reorderPoint) {
      return <Badge className="bg-accent-50 text-accent-700 border-accent-200">Low Stock</Badge>;
    }
    return <Badge className="bg-lime-50 text-lime-700 border-lime-200">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(summary.totalUnits)} units across {formatNumber(summary.totalProducts)} products
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInventory}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={formatNumber(summary.totalProducts)}
          icon={<Package className="h-5 w-5 text-primary-600" />}
        />
        <StatCard
          title="Total Units"
          value={formatNumber(summary.totalUnits)}
          icon={<Boxes className="h-5 w-5 text-lime-600" />}
        />
        <StatCard
          title="Inventory Value"
          value={formatNPR(summary.totalValue)}
          icon={<TrendingUp className="h-5 w-5 text-accent-600" />}
        />
        <StatCard
          title="Low/Out of Stock"
          value={formatNumber(summary.lowStock + summary.outOfStock)}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by product name or SKU..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              options={[
                { value: 'IN_STOCK', label: 'In Stock' },
                { value: 'LOW_STOCK', label: 'Low Stock' },
                { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              ]}
              placeholder="All Stock Levels"
            />
            <Select
              value={filters.warehouse}
              onChange={(e) => setFilters(prev => ({ ...prev, warehouse: e.target.value }))}
              options={[
                { value: 'main', label: 'Main Warehouse' },
                { value: 'secondary', label: 'Secondary Warehouse' },
              ]}
              placeholder="All Warehouses"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <EmptyState
          icon={<CircleAlert className="h-12 w-12 text-red-400" />}
          title="Failed to load inventory"
          description={error}
          action={<Button onClick={fetchInventory}>Retry</Button>}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Boxes className="h-12 w-12 text-gray-300" />}
          title="No inventory items"
          description="Inventory will appear here once products are added."
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reserved</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">On Hand</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder Point</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {items.map((item) => {
                    const available = item.quantity - item.reservedQuantity;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.product?.image ? (
                              <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-xl object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                                <Package className="h-5 w-5 text-primary-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                              <p className="text-xs text-gray-500">{item.product?.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.warehouse?.name || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'text-sm font-semibold',
                            available <= 0 ? 'text-red-600' : available <= item.reorderPoint ? 'text-accent-600' : 'text-gray-900'
                          )}>
                            {formatNumber(available)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(item.reservedQuantity)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatNumber(item.quantity)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(item.reorderPoint)}</td>
                        <td className="px-6 py-4">{getStatusBadge(item)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <Button variant="outline" size="sm" onClick={() => setAdjustTarget(item)}>
                              <Minus className="h-4 w-4" />
                              Adjust
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adjust Modal */}
      <Modal
        open={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        title="Adjust Inventory"
      >
        <div className="space-y-4">
          {adjustTarget && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">{adjustTarget.product?.name}</p>
              <p className="text-xs text-gray-500">
                Current on hand: {formatNumber(adjustTarget.quantity)} · Reserved: {formatNumber(adjustTarget.reservedQuantity)} · Available: {formatNumber(adjustTarget.quantity - adjustTarget.reservedQuantity)}
              </p>
            </div>
          )}

          <Select
            label="Adjustment Type"
            name="type"
            value={adjustForm.type}
            onChange={(e) => setAdjustForm(prev => ({ ...prev, type: e.target.value as typeof adjustForm.type }))}
            options={[
              { value: 'ADD', label: 'Add Stock' },
              { value: 'REMOVE', label: 'Remove Stock' },
              { value: 'SET', label: 'Set Quantity' },
            ]}
          />

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={String(adjustForm.quantity)}
            onChange={(e) => setAdjustForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
            min={1}
          />

          <Input
            label="Note"
            name="note"
            value={adjustForm.note}
            onChange={(e) => setAdjustForm(prev => ({ ...prev, note: e.target.value }))}
            placeholder="e.g. Received shipment from supplier"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setAdjustTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleAdjust} disabled={isAdjusting}>
              {isAdjusting ? 'Adjusting...' : 'Apply Adjustment'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}