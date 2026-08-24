import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

router.use(authenticate);

// GET /api/admin/customers - List customers
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    const result = await laravelDb.getCustomers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search?.toString(),
      sortBy: sortBy?.toString(),
      sortOrder: sortOrder?.toString(),
    });

    // Map DB rows to frontend expected format
    const customers = result.data.map((c: any) => {
      const fullName = c.name || '';
      const [firstName = '', lastName = ''] = fullName.split(' ');

      // Determine if the user is active - check is_active column or default to true
      let isActive = true;
      if (c.is_active !== undefined && c.is_active !== null) {
        isActive = c.is_active === 1 || c.is_active === true;
      }

      return {
        id: String(c.id),
        name: c.name || `${firstName} ${lastName}`.trim() || 'Customer',
        firstName: firstName || c.name || '',
        lastName: lastName || '',
        email: c.email || '',
        phone: c.phone || null,
        avatar: c.avatar || null,
        isActive,
        _count: { orders: Number(c.order_count || 0) },
        _sum: { orders: { total: Number(c.total_spent || 0) } },
        createdAt: c.created_at || c.createdAt || new Date().toISOString(),
      };
    });

    res.json({
      data: customers,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/customers/:id - Get single customer with details
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const c = await laravelDb.getCustomerById(String(req.params.id));
    if (!c) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const fullName = c.name || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');

    let isActive = true;
    if (c.is_active !== undefined && c.is_active !== null) {
      isActive = c.is_active === 1 || c.is_active === true;
    }

    const formattedCustomer = {
      id: String(c.id),
      firstName: firstName || c.name || '',
      lastName: lastName || '',
      email: c.email || '',
      phone: c.phone || null,
      avatar: c.avatar || null,
      isActive,
      createdAt: c.created_at || c.createdAt || new Date().toISOString(),
      updatedAt: c.updated_at || c.updatedAt || new Date().toISOString(),
      rewardPoints: c.reward_points || 0,
      orders: (c.orders || []).map((o: any) => ({
        id: String(o.id),
        orderNumber: o.order_number,
        status: o.status,
        total: Number(o.total),
        createdAt: o.created_at || o.createdAt,
      })),
      addresses: (c.addresses || []).map((a: any) => ({
        id: String(a.id),
        type: a.type,
        line1: a.line1 || a.address_line_1 || '',
        line2: a.line2 || a.address_line_2 || null,
        city: a.city || '',
        state: a.state || null,
        postalCode: a.postal_code || a.zip_code || null,
        country: a.country || '',
        isDefault: a.is_default === 1 || a.is_default === true,
      })),
      reviews: (c.reviews || []).map((r: any) => ({
        id: String(r.id),
        rating: Number(r.rating),
        comment: r.comment || null,
        status: r.status || 'published',
        createdAt: r.created_at || r.createdAt,
        product: {
          id: String(r.product_id),
          name: r.product_name || 'Unknown Product'
        }
      })),
      wishlist: c.wishlist || [],
    };

    res.json({ data: formattedCustomer });
  } catch (err) {
    next(err);
  }
});

export default router;