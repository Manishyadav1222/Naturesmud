import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// All category routes require authentication
router.use(authenticate);

const mapCategory = (c: any) => ({
  id: String(c.id),
  name: c.name,
  slug: c.slug,
  description: c.description || null,
  parentId: c.parent_id ? String(c.parent_id) : null,
  image: c.image || null,
  isActive: Number(c.is_active) === 1,
  sortOrder: Number(c.sort_order || 0),
  _count: { products: Number(c.product_count || 0) },
  createdAt: c.created_at,
  updatedAt: c.updated_at,
});

const mapCategoryTree = (node: any) => ({
  ...mapCategory(node),
  children: (node.children || []).map(mapCategoryTree),
});

// GET /api/admin/categories - Flat list (used by product forms: ?limit=100)
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { search, limit } = req.query;
    const categories = await laravelDb.getCategories({
      search: search?.toString(),
      limit: limit ? Number(limit) : undefined,
    });
    res.json({
      data: categories.map(mapCategory),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/categories/tree - Nested tree (must be before /:id)
router.get('/tree', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const tree = await laravelDb.getCategoryTree();
    res.json({
      data: tree.map(mapCategoryTree),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/categories - Create category
router.post('/', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const category = await laravelDb.createCategory(req.body);
    res.status(201).json({ data: mapCategory(category) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A category with this slug already exists' });
    }
    next(err);
  }
});

// PUT /api/admin/categories/:id - Update category
router.put('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.updateCategory(String(req.params.id), req.body);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ data: mapCategory(result) });
  } catch (err: any) {
    if (err.message?.includes('ER_DUP_ENTRY') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A category with this slug already exists' });
    }
    next(err);
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.deleteCategory(String(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ data: { success: true } });
  } catch (err: any) {
    if (err.message?.includes('Cannot delete category')) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

export default router;
