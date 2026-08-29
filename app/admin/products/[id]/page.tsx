'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { formatNPR, formatNumber, formatDate, timeAgo, cn } from '@/lib/admin/utils';
import { resolveImageUrl } from '@/lib/utils';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CircleAlert,
  Package,
  Copy,
  CheckCircle2,
  XCircle,
  Star,
  Boxes,
  Tag,
  Layers,
  Scale,
  Ruler,
  Barcode,
  Truck,
} from 'lucide-react';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  unit: string;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
  images: Array<{ id: string; url: string; isPrimary: boolean; alt?: string | null }>;
  category?: { id: string; name: string } | null;
  brand?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-lime-50 text-lime-700 border-lime-200',
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  ARCHIVED: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { hasPermission } = useAdminAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManageProducts = hasPermission(PERMISSIONS.MANAGE_PRODUCTS);
  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ data: ProductDetail }>(`/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to load product');
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleDelete = async () => {
    if (!product || !canManageProducts) return;
    try {
      setIsDeleting(true);
      await api.delete(`/products/${product.id}`);
      router.push('/admin/products');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!product || !canManageProducts) return;
    try {
      const newStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
      const res = await api.put<{ data: ProductDetail }>(`/products/${product.id}`, { status: newStatus });
      setProduct(res.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const handleToggleFeatured = async () => {
    if (!product || !canManageProducts) return;
    try {
      const res = await api.put<{ data: ProductDetail }>(`/products/${product.id}`, { isFeatured: !product.isFeatured });
      setProduct(res.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const handleDuplicate = async () => {
    if (!product || !canManageProducts) return;
    try {
      const res = await api.post<{ data: { id: string } }>(`/products/${product.id}/duplicate`);
      router.push(`/admin/products/${res.data.id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const primaryImage =
    product?.images?.find(img => typeof img === 'object' && img?.isPrimary) ||
    product?.images?.[0] ||
    (product as any)?.image_url ||
    (product as any)?.image;
  const rawPrimaryUrl = typeof primaryImage === 'string' ? primaryImage : primaryImage?.url;
  const primaryImageUrl = resolveImageUrl(rawPrimaryUrl, '/products/sweet-potato-powder-100g.jpg');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 p-6">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Failed to load product"
        description={error || 'Product not found'}
        action={<Button onClick={fetchProduct}>Retry</Button>}
      />
    );
  }

  const isLowStock = product.stock <= product.lowStockThreshold;
  const profitMargin = product.price > 0 && product.cost > 0
    ? ((product.price - product.cost) / product.price) * 100
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <Badge className={STATUS_STYLES[product.status] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                {product.status}
              </Badge>
              {product.isFeatured && (
                <Badge className="bg-accent-50 text-accent-700 border-accent-200">
                  <Star className="h-3 w-3" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {product.sku || 'No SKU'} · Updated {timeAgo(product.updatedAt)}
            </p>
          </div>
        </div>
        {canManageProducts && (
          <div className="flex items-center gap-2">
            <Link href={`/admin/products/${product.id}/edit`}>
              <Button size="sm">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleStatus}>
              {product.status === 'ACTIVE' ? (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-lime-500" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleToggleFeatured}>
              <Star className={cn('h-4 w-4', product.isFeatured ? 'text-accent-500 fill-accent-500' : 'text-gray-400')} />
              {product.isFeatured ? 'Unfeature' : 'Feature'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Images */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {primaryImageUrl ? (
                <img
                  src={primaryImageUrl}
                  alt={product.name}
                  className="w-full aspect-square rounded-2xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/products/sweet-potato-powder-100g.jpg';
                  }}
                />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-primary-50">
                  <Package className="h-16 w-16 text-primary-200" />
                </div>
              )}
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images.map((img: any, idx: number) => {
                    const rawThumb = typeof img === 'string' ? img : img.url;
                    const thumbUrl = resolveImageUrl(rawThumb, '/products/sweet-potato-powder-100g.jpg');
                    const imgId = typeof img === 'string' ? `img-${idx}` : img.id;
                    const isPrimary = typeof img === 'object' ? img.isPrimary : idx === 0;
                    return (
                      <img
                        key={imgId}
                        src={thumbUrl}
                        alt={product.name}
                        className={cn(
                          'h-16 w-full rounded-lg object-cover cursor-pointer border-2 transition-colors',
                          isPrimary ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                        )}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/products/sweet-potato-powder-100g.jpg';
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', product.isPublished ? 'text-lime-600' : 'text-gray-400')}>
                    {product.isPublished ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Yes
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        No
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', product.isActive ? 'text-lime-600' : 'text-gray-400')}>
                    {product.isActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Yes
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        No
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', product.isFeatured ? 'text-accent-600' : 'text-gray-400')}>
                    {product.isFeatured ? (
                      <>
                        <Star className="h-4 w-4" />
                        Yes
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        No
                      </>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing & Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-primary-50/50 p-4">
                  <p className="text-xs font-medium text-gray-500">Price</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatNPR(product.price)}</p>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <p className="mt-1 text-sm text-gray-400 line-through">{formatNPR(product.compareAtPrice)}</p>
                  )}
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">Cost</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatNPR(product.cost)}</p>
                  {profitMargin !== null && (
                    <p className="mt-1 text-sm text-lime-600">{profitMargin.toFixed(1)}% margin</p>
                  )}
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">Stock</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(product.stock)}</p>
                    <Badge className={cn(
                      product.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                      isLowStock ? 'bg-accent-50 text-accent-700 border-accent-200' :
                      'bg-lime-50 text-lime-700 border-lime-200'
                    )}>
                      {product.stock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Low stock threshold: {product.lowStockThreshold}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-50 p-2.5">
                    <Layers className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">{product.category?.name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-50 p-2.5">
                    <Tag className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Brand</p>
                    <p className="text-sm font-medium text-gray-900">{product.brand?.name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-50 p-2.5">
                    <Boxes className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unit</p>
                    <p className="text-sm font-medium text-gray-900">{product.unit || 'PC'}</p>
                  </div>
                </div>
                {product.barcode && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary-50 p-2.5">
                      <Barcode className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Barcode</p>
                      <p className="text-sm font-medium text-gray-900">{product.barcode}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {product.shortDescription && (
                    <p className="font-medium text-gray-900">{product.shortDescription}</p>
                  )}
                  <p className="mt-3 whitespace-pre-wrap">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Dimensions */}
          {(product.weight || product.length || product.width || product.height) && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <Scale className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-sm font-medium text-gray-900">{product.weight} kg</p>
                      </div>
                    </div>
                  )}
                  {product.length && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Length</p>
                        <p className="text-sm font-medium text-gray-900">{product.length} cm</p>
                      </div>
                    </div>
                  )}
                  {product.width && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Width</p>
                        <p className="text-sm font-medium text-gray-900">{product.width} cm</p>
                      </div>
                    </div>
                  )}
                  {product.height && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Height</p>
                        <p className="text-sm font-medium text-gray-900">{product.height} cm</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">Slug</span>
                  <span className="font-mono text-gray-900">{product.slug}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-mono text-gray-900">{product.sku || '—'}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        cancelLabel="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}