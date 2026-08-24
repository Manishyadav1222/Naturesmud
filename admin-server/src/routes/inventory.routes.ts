import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// All inventory routes require authentication
router.use(authenticate);

// GET /api/admin/inventory - List inventory items with summary & pagination
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : '';
    const status = req.query.status ? String(req.query.status).trim() : '';

    // Build WHERE clauses for product inventory
    const whereClauses: string[] = ['1=1'];
    const params: any[] = [];

    if (search) {
      whereClauses.push('(name LIKE ? OR sku LIKE ? OR slug LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status === 'IN_STOCK') {
      whereClauses.push('stock_quantity > COALESCE(low_stock_threshold, 10)');
    } else if (status === 'LOW_STOCK') {
      whereClauses.push('stock_quantity <= COALESCE(low_stock_threshold, 10) AND stock_quantity > 0');
    } else if (status === 'OUT_OF_STOCK') {
      whereClauses.push('stock_quantity <= 0');
    }

    const whereSql = whereClauses.join(' AND ');

    // 1. Fetch paginated products as inventory items
    const [rows] = await laravelDb.query(
      `SELECT SQL_CALC_FOUND_ROWS 
        id, name, slug, sku, price, compare_at_price, cost_price,
        stock_quantity, low_stock_threshold, is_active, images, updated_at
       FROM products
       WHERE ${whereSql}
       ORDER BY updated_at DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // 2. Total count
    const [countResult] = await laravelDb.query('SELECT FOUND_ROWS() as count');
    const total = Number((countResult as any)[0]?.count || 0);

    // 3. Inventory summary calculation across all products
    const [summaryRows] = await laravelDb.query(`
      SELECT 
        COUNT(*) as totalProducts,
        COALESCE(SUM(stock_quantity), 0) as totalUnits,
        COALESCE(SUM(stock_quantity * price), 0) as totalValue,
        COALESCE(SUM(CASE WHEN stock_quantity <= COALESCE(low_stock_threshold, 10) AND stock_quantity > 0 THEN 1 ELSE 0 END), 0) as lowStock,
        COALESCE(SUM(CASE WHEN stock_quantity <= 0 THEN 1 ELSE 0 END), 0) as outOfStock
      FROM products
    `);

    const summaryData = (summaryRows as any[])[0] || {
      totalProducts: 0,
      totalUnits: 0,
      totalValue: 0,
      lowStock: 0,
      outOfStock: 0,
    };

    // 4. Map to frontend InventoryItem format
    const data = (rows as any[]).map((p) => {
      let image: string | null = null;
      try {
        if (p.images) {
          const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
          if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
          else if (typeof parsed === 'string') image = parsed;
        }
      } catch {
        image = null;
      }

      const quantity = Number(p.stock_quantity || 0);
      const reorderPoint = Number(p.low_stock_threshold || 10);

      return {
        id: String(p.id),
        productId: String(p.id),
        product: {
          id: String(p.id),
          name: p.name,
          sku: p.sku || `SKU-${p.id}`,
          image: image || '/products/cranberries.jpg',
          price: Number(p.price || 0),
        },
        warehouseId: 'w-main',
        warehouse: {
          id: 'w-main',
          name: 'Main Kathmandu Hub',
          location: 'Kathmandu, Nepal',
        },
        quantity,
        reservedQuantity: 0,
        reorderPoint,
        reorderQuantity: 50,
        updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
      };
    });

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      summary: {
        totalProducts: Number(summaryData.totalProducts || 0),
        totalUnits: Number(summaryData.totalUnits || 0),
        totalValue: Number(summaryData.totalValue || 0),
        lowStock: Number(summaryData.lowStock || 0),
        outOfStock: Number(summaryData.outOfStock || 0),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/inventory/:id - Get single item inventory
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await laravelDb.query('SELECT * FROM products WHERE id = ?', [id]);
    const p = (rows as any[])[0];

    if (!p) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    let image: string | null = null;
    try {
      if (p.images) {
        const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
      }
    } catch {}

    const quantity = Number(p.stock_quantity || 0);
    const reorderPoint = Number(p.low_stock_threshold || 10);

    res.json({
      data: {
        id: String(p.id),
        productId: String(p.id),
        product: {
          id: String(p.id),
          name: p.name,
          sku: p.sku || `SKU-${p.id}`,
          image: image || '/products/cranberries.jpg',
          price: Number(p.price || 0),
        },
        warehouseId: 'w-main',
        warehouse: {
          id: 'w-main',
          name: 'Main Kathmandu Hub',
          location: 'Kathmandu, Nepal',
        },
        quantity,
        reservedQuantity: 0,
        reorderPoint,
        reorderQuantity: 50,
        updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/inventory/:id/adjust - Adjust stock quantity
router.post('/:id/adjust', requireMinRole('WAREHOUSE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, type, note } = req.body;

    const [rows] = await laravelDb.query('SELECT stock_quantity FROM products WHERE id = ?', [id]);
    const p = (rows as any[])[0];

    if (!p) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const currentStock = Number(p.stock_quantity || 0);
    const adjQty = Math.max(0, Number(quantity) || 0);
    let newStock = currentStock;

    if (type === 'ADD') {
      newStock = currentStock + adjQty;
    } else if (type === 'REMOVE') {
      newStock = Math.max(0, currentStock - adjQty);
    } else if (type === 'SET') {
      newStock = adjQty;
    }

    await laravelDb.query(
      'UPDATE products SET stock_quantity = ?, updated_at = NOW() WHERE id = ?',
      [newStock, id]
    );

    res.json({
      success: true,
      data: {
        id,
        productId: id,
        quantity: newStock,
        adjustment: {
          previousQuantity: currentStock,
          newQuantity: newStock,
          type,
          note: note || '',
        },
      },
      message: `Inventory successfully updated to ${newStock} units`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
