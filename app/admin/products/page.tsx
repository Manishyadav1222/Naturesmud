'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { formatNPR, formatNumber, timeAgo, cn } from '@/lib/admin/utils';
import { resolveImageUrl } from '@/lib/utils';
import {
  Package,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  RefreshCw,
  Trash2,
  Copy,
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  BadgePercent,
  Boxes,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  cost: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isPublished: boolean;
  image?: string | null;
  category?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const PRODUCT_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-lime-50 text-lime-700 border-lime-200',
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  ARCHIVED: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    stockStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canViewProducts = hasPermission(PERMISSIONS.VIEW_PRODUCTS);
  const canManageProducts = hasPermission(PERMISSIONS.MANAGE_PRODUCTS);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchProducts = useCallback(async () => {
    if (!canViewProducts) return;
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.status) params.set('status', filters.status);
      if (filters.stockStatus) params.set('stockStatus', filters.stockStatus);

      const res = await api.get<ProductsResponse>(`/products?${params.toString()}`);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load products');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filters.status, filters.stockStatus, filters.sortBy, filters.sortOrder, canViewProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget || !canManageProducts) return;
    try {
      setIsDeleting(true);
      await api.delete(`/products/${deleteTarget.id}`);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!canManageProducts || selectedIds.length === 0) return;
    try {
      setIsDeleting(true);
      await api.post('/products/bulk-delete', { ids: selectedIds });
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    if (!canManageProducts) return;
    try {
      const newStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
      await api.put(`/products/${product.id}`, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    if (!canManageProducts) return;
    try {
      await api.put(`/products/${product.id}`, { isFeatured: !product.isFeatured });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p));
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const handleDuplicate = async (product: Product) => {
    if (!canManageProducts) return;
    try {
      await api.post(`/products/${product.id}/duplicate`);
      fetchProducts();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  if (!canViewProducts) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to view products."
      />
    );
  }

  const isLowStock = (product: Product) => product.stock <= product.lowStockThreshold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatNumber(pagination.total)} products total
          </p>
        </div>
        {canManageProducts && (
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by name, SKU, or description..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              options={STATUS_OPTIONS}
              placeholder="All Statuses"
            />
            <Select
              value={filters.stockStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value, page: 1 }))}
              options={[
                { value: 'IN_STOCK', label: 'In Stock' },
                { value: 'LOW_STOCK', label: 'Low Stock' },
                { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              ]}
              placeholder="All Stock Levels"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">
                  {selectedIds.length} selected
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleBulkDelete}
                  disabled={isDeleting || !canManageProducts}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Showing {products.length} of {pagination.total} products
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ search: '', status: '', category: '', stockStatus: '', sortBy: 'createdAt', sortOrder: 'desc' })}
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
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
          title="Failed to load products"
          description={error}
          action={<Button onClick={fetchProducts}>Retry</Button>}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12 text-gray-300" />}
          title="No products found"
          description="Try adjusting your filters or create a new product."
          action={canManageProducts ? (
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          ) : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className={cn('hover:bg-gray-50 transition-colors', selectedIds.includes(product.id) && 'bg-primary-50/50')}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={resolveImageUrl(product.image, '/products/sweet-potato-powder-100g.jpg')}
                              alt={product.name}
                              className="h-12 w-12 rounded-xl object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/products/sweet-potato-powder-100g.jpg';
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                              <Package className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.sku || product.slug}
                              {product.isFeatured && (
                                <span className="ml-2 inline-flex items-center gap-0.5 text-accent-600">
                                  <BadgePercent className="h-3 w-3" />
                                  Featured
                                </span>
                              )}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{formatNPR(product.price)}</p>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">{formatNPR(product.compareAtPrice)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            product.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                            isLowStock(product) ? 'bg-accent-50 text-accent-700 border-accent-200' :
                            'bg-lime-50 text-lime-700 border-lime-200'
                          )}>
                            {product.stock === 0 ? 'Out of Stock' : isLowStock(product) ? 'Low Stock' : formatNumber(product.stock)}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={PRODUCT_STATUS_STYLES[product.status] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {timeAgo(product.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="sm" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {canManageProducts && (
                            <>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Button variant="ghost" size="sm" title="Edit">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" title="Duplicate" onClick={() => handleDuplicate(product)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title={product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} onClick={() => handleToggleStatus(product)}>
                                {product.status === 'ACTIVE' ? (
                                  <XCircle className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-lime-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Delete"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setDeleteTarget(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages || 1}
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
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}