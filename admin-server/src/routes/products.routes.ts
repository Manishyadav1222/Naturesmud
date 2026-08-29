import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// All product routes require authentication
router.use(authenticate);

const mapProduct = (p: any) => {
  let rawImages: any[] = [];
  if (p.images) {
    if (typeof p.images === 'string') {
      try {
        const parsed = JSON.parse(p.images);
        rawImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        rawImages = [p.images];
      }
    } else if (Array.isArray(p.images)) {
      rawImages = p.images;
    } else if (typeof p.images === 'object') {
      rawImages = [p.images];
    }
  }

  const normalizedImages: any[] = rawImages
    .map((img: any, idx: number) => {
      if (typeof img === 'string') {
        const trimmed = img.trim();
        return trimmed
          ? {
              id: `img-${idx + 1}`,
              url: trimmed,
              isPrimary: idx === 0,
            }
          : null;
      }
      if (img && typeof img === 'object') {
        const url = img.url || img.secure_url || img.path || img.preview || '';
        return url
          ? {
              id: String(img.id || `img-${idx + 1}`),
              url: String(url).trim(),
              isPrimary: Boolean(img.isPrimary ?? (idx === 0)),
              publicId: img.publicId,
              width: img.width,
              height: img.height,
            }
          : null;
      }
      return null;
    })
    .filter(Boolean);

  const primaryImageObj = normalizedImages.find((img: any) => img.isPrimary) || normalizedImages[0];
  const primaryUrl = primaryImageObj?.url || null;

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    barcode: p.barcode || null,
    description: p.description || null,
    shortDescription: p.short_description || null,
    price: Number(p.price),
    compareAtPrice: p.compare_at_price != null ? Number(p.compare_at_price) : null,
    cost: Number(p.cost_price || 0),
    stock: Number(p.stock_quantity || 0),
    lowStockThreshold: Number(p.low_stock_threshold || 0),
    status: Number(p.is_active) === 1 ? 'ACTIVE' : 'ARCHIVED',
    unit: p.unit || 'PC',
    weight: p.weight != null ? Number(p.weight) : null,
    length: p.length != null ? Number(p.length) : null,
    width: p.width != null ? Number(p.width) : null,
    height: p.height != null ? Number(p.height) : null,
    isFeatured: Number(p.is_featured) === 1,
    isPublished: Number(p.is_active) === 1,
    isActive: Number(p.is_active) === 1,
    image: primaryUrl,
    images: normalizedImages,
    categoryId: p.category_id ? String(p.category_id) : null,
    brandId: p.brand_id ? String(p.brand_id) : null,
    category: p.category_name && p.category_id ? { id: String(p.category_id), name: p.category_name } : null,
    brand: null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
};

// GET /api/admin/products - List products with filters
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page, limit, search, status, stockStatus, sortBy, sortOrder } = req.query;
    const result = await laravelDb.getAllProducts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search?.toString(),
      status: status?.toString(),
      stockStatus: stockStatus?.toString(),
      sortBy: sortBy?.toString(),
      sortOrder: sortOrder?.toString(),
    });

    res.json({
      data: result.data.map(mapProduct),
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/products/bulk-delete - Delete multiple products (must be before /:id)
router.post('/bulk-delete', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    const result = await laravelDb.bulkDeleteProducts(ids.map(String));
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/products/:id - Get single product
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const product = await laravelDb.getProductById(String(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ data: mapProduct(product) });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/products - Create product
router.post('/', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const product = await laravelDb.createProduct(req.body);
    res.status(201).json({ data: mapProduct(product) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A product with this slug or SKU already exists' });
    }
    next(err);
  }
});

// POST /api/admin/products/:id/duplicate - Duplicate product
router.post('/:id/duplicate', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const product = await laravelDb.duplicateProduct(String(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(201).json({ data: mapProduct(product) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A product with this slug or SKU already exists' });
    }
    next(err);
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.updateProduct(String(req.params.id), req.body);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ data: mapProduct(result) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A product with this slug or SKU already exists' });
    }
    next(err);
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.deleteProduct(String(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
