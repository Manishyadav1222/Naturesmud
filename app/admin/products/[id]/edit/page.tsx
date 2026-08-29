'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { api, ApiClientError } from '@/lib/admin/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Select } from '@/components/admin/Select';
import { Textarea } from '@/components/admin/Textarea';
import { Skeleton } from '@/components/admin/Skeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { cn } from '@/lib/admin/utils';
import {
  ArrowLeft,
  CircleAlert,
  Upload,
  X,
  CheckCircle2,
  Crop,
  Smartphone,
  Tv,
  Square,
} from 'lucide-react';
import ImageCropModal, { AspectRatioType, ASPECT_RATIOS } from '@/components/admin/ImageCropModal';

interface CategoryOption {
  id: string;
  name: string;
  parentId?: string | null;
}

interface BrandOption {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url?: string;
  file?: File;
  isPrimary: boolean;
  preview?: string;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const UNIT_OPTIONS = [
  { value: 'PC', label: 'Piece' },
  { value: 'BOX', label: 'Box' },
  { value: 'KG', label: 'Kilogram' },
  { value: 'G', label: 'Gram' },
  { value: 'L', label: 'Liter' },
  { value: 'ML', label: 'Milliliter' },
];

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const { hasPermission } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    cost: '',
    stock: '0',
    lowStockThreshold: '5',
    categoryId: '',
    brandId: '',
    status: 'DRAFT',
    unit: 'PC',
    weight: '',
    length: '',
    width: '',
    height: '',
    isFeatured: false,
    isPublished: false,
    isActive: true,
    barcode: '',
  });

  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>('1:1');
  const [cropIndex, setCropIndex] = useState<number | null>(null);

  const handleCropComplete = (blob: Blob, croppedUrl: string) => {
    if (cropIndex === null) return;
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === cropIndex
          ? {
              ...img,
              file: new File([blob], `product-${selectedRatio.replace(':', '-')}-${Date.now()}.jpg`, { type: 'image/jpeg' }),
              preview: croppedUrl,
              url: croppedUrl,
            }
          : img
      )
    );
  };

  const canManageProducts = hasPermission(PERMISSIONS.MANAGE_PRODUCTS);
  const productId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [productRes, catRes, brandRes] = await Promise.all([
        api.get<{ data: any }>(`/products/${productId}`),
        api.get<{ data: CategoryOption[] }>('/categories?limit=100'),
        api.get<{ data: BrandOption[] }>('/brands'),
      ]);

      const p = productRes.data;
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
      setFormData({
        name: p.name || '',
        slug: p.slug || '',
        sku: p.sku || '',
        description: p.description || '',
        shortDescription: p.shortDescription || '',
        price: p.price != null ? String(p.price) : '',
        compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
        cost: p.cost != null ? String(p.cost) : '',
        stock: p.stock != null ? String(p.stock) : '0',
        lowStockThreshold: p.lowStockThreshold != null ? String(p.lowStockThreshold) : '5',
        categoryId: p.categoryId || '',
        brandId: p.brandId || '',
        status: p.status || 'DRAFT',
        unit: p.unit || 'PC',
        weight: p.weight != null ? String(p.weight) : '',
        length: p.length != null ? String(p.length) : '',
        width: p.width != null ? String(p.width) : '',
        height: p.height != null ? String(p.height) : '',
        isFeatured: p.isFeatured || false,
        isPublished: p.isPublished || false,
        isActive: p.isActive !== false,
        barcode: p.barcode || '',
      });

      let rawImgs: any[] = [];
      if (p.images) {
        if (Array.isArray(p.images)) {
          rawImgs = p.images;
        } else if (typeof p.images === 'string') {
          try {
            const parsed = JSON.parse(p.images);
            rawImgs = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            rawImgs = [p.images];
          }
        } else if (typeof p.images === 'object') {
          rawImgs = [p.images];
        }
      } else if (p.image) {
        rawImgs = [p.image];
      }

      const normalizedImgs: ProductImage[] = [];
      for (let idx = 0; idx < rawImgs.length; idx++) {
        const img = rawImgs[idx];
        const url = typeof img === 'string' ? img : (img?.url || img?.preview || img?.secure_url || img?.path || '');
        if (url) {
          normalizedImgs.push({
            id: String(img?.id || `img-${idx + 1}-${Date.now()}`),
            url: url,
            isPrimary: typeof img === 'object' && img?.isPrimary !== undefined ? Boolean(img.isPrimary) : idx === 0,
            preview: url,
          });
        }
      }

      if (normalizedImgs.length > 0 && !normalizedImgs.some((img) => img.isPrimary)) {
        normalizedImgs[0].isPrimary = true;
      }

      setImages(normalizedImgs);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ProductImage[] = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      file,
      isPrimary: images.length === 0 && index === 0,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const makePrimary = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageProducts) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const uploadedImages = [];
      for (const img of images) {
        if (img.file) {
          const formData = new FormData();
          formData.append('file', img.file);
          formData.append('folder', 'products');
          formData.append('isPrimary', String(img.isPrimary));
          const res = await api.upload<{ url: string; publicId: string; width: number; height: number }>('/upload/image', formData);
          uploadedImages.push({
            url: res.url,
            publicId: res.publicId,
            width: res.width,
            height: res.height,
            isPrimary: img.isPrimary,
          });
        } else if (img.url || img.preview) {
          uploadedImages.push({
            id: img.id,
            url: img.url || img.preview,
            isPrimary: img.isPrimary,
          });
        }
      }

      if (uploadedImages.length > 0 && !uploadedImages.some((img) => img.isPrimary)) {
        uploadedImages[0].isPrimary = true;
      }

      const productData = {
        name: formData.name,
        slug: formData.slug || undefined,
        sku: formData.sku,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price) || 0,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        cost: parseFloat(formData.cost) || 0,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        categoryId: formData.categoryId || null,
        brandId: formData.brandId || null,
        status: formData.status,
        unit: formData.unit,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: {
          length: formData.length ? parseFloat(formData.length) : null,
          width: formData.width ? parseFloat(formData.width) : null,
          height: formData.height ? parseFloat(formData.height) : null,
        },
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
        isActive: formData.isActive,
        barcode: formData.barcode || null,
        images: uploadedImages,
      };

      await api.put(`/products/${productId}`, productData);
      router.push(`/admin/products/${productId}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to update product');
      }
      setIsSubmitting(false);
    }
  };

  if (!canManageProducts) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage products."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full md:col-span-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/${productId}`)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-1 text-sm text-gray-500">{formData.name || 'Loading...'}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Product Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Pure Himalayan Clay Mask"
                  required
                />
              </div>
              <div>
                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated from name"
                />
              </div>
              <div>
                <Input
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. NM-CLAY-001"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Short Description"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Brief product summary for cards and listings"
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Full Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detailed product description, benefits, usage..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <Input
                label="Price (NPR) *"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
              <Input
                label="Compare At Price"
                name="compareAtPrice"
                type="number"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                hint="Original price for showing discounts"
              />
              <Input
                label="Cost (NPR)"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="0.00"
                hint="Internal cost, not shown to customers"
              />
              <Input
                label="Stock Quantity"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
              />
              <Input
                label="Low Stock Threshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                placeholder="5"
              />
              <Input
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                placeholder="Scanned barcode / EAN"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <Select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Select a category"
              />
              <Select
                label="Brand"
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                options={brands.map(b => ({ value: b.id, label: b.name }))}
                placeholder="Select a brand"
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={STATUS_OPTIONS}
              />
              <Select
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                options={UNIT_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <Input
                label="Length (cm)"
                name="length"
                type="number"
                step="0.01"
                value={formData.length}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <Input
                label="Width (cm)"
                name="width"
                type="number"
                step="0.01"
                value={formData.width}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <Input
                label="Height (cm)"
                name="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-700">Aspect Ratio:</span>
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRatio(r.id)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedRatio === r.id
                            ? 'bg-[#2D5A27] text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span>{r.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-gray-400">
                  {selectedRatio === '9:16'
                    ? '9:16 Portrait (Reels/Stories)'
                    : selectedRatio === '16:9'
                    ? '16:9 Landscape (Hero Banners)'
                    : selectedRatio === '1:1'
                    ? '1:1 Square (Product Grid)'
                    : '4:3 Standard Photo'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.preview || img.url}
                      alt="Product"
                      className={`w-full rounded-xl object-cover border border-gray-200 ${
                        selectedRatio === '9:16'
                          ? 'aspect-[9/16] h-48'
                          : selectedRatio === '16:9'
                          ? 'aspect-video h-28'
                          : 'aspect-square h-32'
                      }`}
                    />
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCropIndex(idx);
                        }}
                        className="rounded-lg bg-white/95 p-2 text-gray-800 hover:bg-white cursor-pointer shadow-xs"
                        title="Adjust / Crop (9:16, 16:9, 1:1)"
                      >
                        <Crop className="h-4 w-4 text-[#2D5A27]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => makePrimary(img.id)}
                        className="rounded-lg bg-white/95 p-2 text-primary-600 hover:bg-white cursor-pointer shadow-xs"
                        title="Set as primary"
                      >
                        <CheckCircle2 className={cn('h-4 w-4', img.isPrimary ? 'text-lime-600' : 'text-gray-400')} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="rounded-lg bg-white/95 p-2 text-red-600 hover:bg-white cursor-pointer shadow-xs"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 rounded-full bg-lime-500 px-2 py-0.5 text-xs font-semibold text-white shadow-xs">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
                <label className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-[#2D5A27] hover:bg-[#2D5A27]/5 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <span className="mt-2 block text-xs font-bold text-gray-600">Upload Images</span>
                    <span className="text-[10px] text-gray-400 block">PNG, JPG, WEBP, AVIF</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif,.svg,.avif,.webp"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                First image is used as product thumbnail. Click <Crop className="h-3 w-3 inline text-[#2D5A27]" /> on any image to adjust zoom, orientation, or crop to 9:16, 16:9, or 1:1.
              </p>
            </div>
          </CardContent>
        </Card>

        {cropIndex !== null && images[cropIndex] && (
          <ImageCropModal
            isOpen={cropIndex !== null}
            imageSrc={images[cropIndex].preview || images[cropIndex].url || ''}
            defaultAspectRatio={selectedRatio}
            onClose={() => setCropIndex(null)}
            onCropComplete={handleCropComplete}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Feature this product</p>
                  <p className="text-xs text-gray-500">Show this product on the homepage</p>
                </div>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Publish immediately</p>
                  <p className="text-xs text-gray-500">Make this product visible to customers</p>
                </div>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">Allow this product to be purchased</p>
                </div>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/admin/products/${productId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CheckCircle2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}