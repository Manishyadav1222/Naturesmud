import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb, pool } from '../services/laravelDb';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// GET /api/admin/orders - List orders with filters
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page, limit, search, status, paymentStatus, sortBy, sortOrder } = req.query;
    const result = await laravelDb.getOrders({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search?.toString(),
      status: status?.toString(),
      paymentStatus: paymentStatus?.toString(),
      sortBy: sortBy?.toString(),
      sortOrder: sortOrder?.toString(),
    });

    // Map to frontend expected format
    res.json({
      data: result.data.map((order: any) => ({
        id: String(order.id),
        orderNumber: order.order_number || `#${String(order.id).padStart(6, '0')}`,
        status: (order.status || 'PENDING').toUpperCase(),
        paymentStatus: (order.payment_status || 'UNPAID').toUpperCase(),
        paymentMethod: order.payment_method,
        receiptImage: order.receipt_image || null,
        paymentReference: order.payment_reference || null,
        isValley: typeof order.is_valley !== 'undefined' ? Boolean(order.is_valley) : true,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shipping_fee || 0),
        discount: Number(order.discount || 0),
        total: Number(order.total),
        grandTotal: Number(order.total),
        createdAt: order.created_at,
        updatedAt: order.created_at,
        customer: {
          id: order.user_id ? String(order.user_id) : null,
          name: order.shipping_name || 'Guest',
          email: order.shipping_email || '',
        },
        items: Array.isArray(order.items) ? order.items : [],
      })),
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders/stats - Order statistics
router.get('/stats', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const stats = await laravelDb.getDashboardStats();
    res.json({
      data: {
        byStatus: stats.ordersByStatus,
        total: stats.totalOrders,
        pending: stats.pendingOrders,
        today: stats.ordersToday,
        revenue: stats.totalRevenue,
        revenueToday: stats.revenueToday,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders/:id - Get single order
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const order = await laravelDb.getOrderById(String(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      data: {
        id: String(order.id),
        orderNumber: order.order_number || '#' + String(order.id).padStart(6, '0'),
        status: (order.status || 'PENDING').toUpperCase(),
        paymentStatus: (order.payment_status || 'UNPAID').toUpperCase(),
        paymentMethod: order.payment_method,
        receiptImage: order.receipt_image || null,
        paymentReference: order.payment_reference || null,
        isValley: typeof order.is_valley !== 'undefined' ? Boolean(order.is_valley) : true,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shipping_fee || 0),
        discount: Number(order.discount || 0),
        tax: Number(order.tax || 0),
        grandTotal: Number(order.total),
        note: order.notes || null,
        createdAt: order.created_at,
        updatedAt: order.updated_at || order.created_at,
        customer: {
          id: order.user_id ? String(order.user_id) : null,
          name: order.user_name || order.shipping_name || 'Guest',
          email: order.user_email || order.shipping_email || '',
          phone: order.user_phone || order.shipping_phone || '',
        },
        shippingAddress: {
          fullName: order.shipping_name || 'Guest',
          phone: order.shipping_phone,
          addressLine1: order.shipping_address || '',
          addressLine2: '',
          city: order.shipping_city || '',
          state: order.shipping_zone || '',
          postalCode: '',
          country: order.shipping_country || 'Nepal',
        },
        items: (order.items || []).map((item: any) => ({
          id: String(item.id),
          productId: item.product_id ? String(item.product_id) : null,
          productSku: item.product_sku || null,
          productName: item.product_name,
          productImage: item.product_image || '/products/sweet-potato-powder.jpg',
          quantity: Number(item.quantity),
          unitPrice: Number(item.unit_price || 0),
          totalPrice: Number(item.line_total || 0),
        })),
        statusHistory: (order.status_history || []).map((h: any) => ({
          id: String(h.id),
          status: (h.status || '').toUpperCase(),
          comment: h.note || null,
          createdAt: h.created_at,
          changedBy: h.changed_by_name ? { name: h.changed_by_name } : null,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/orders/:id/payment - Approve/Verify payment
router.patch('/:id/payment', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { paymentStatus, status } = req.body;
    const orderId = req.params.id;

    await pool.query(
      `UPDATE orders SET payment_status = ?, status = COALESCE(?, status), paid_at = NOW(), updated_at = NOW() WHERE id = ?`,
      [paymentStatus || 'paid', status || 'processing', orderId]
    );

    await pool.query(
      `INSERT INTO order_status_histories (order_id, status, note, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [orderId, status || 'processing', `Payment approved by Admin (${paymentStatus || 'paid'}). Order is ready to dispatch.`]
    );

    res.json({ success: true, message: 'Payment status updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/orders/:id/status - Update order status
router.patch('/:id/status', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const result = await laravelDb.updateOrderStatus(
      String(req.params.id),
      status,
      comment,
      req.user?.name
    );
    res.json({ data: result });
  } catch (err: any) {
    if (err.message?.includes('Invalid status')) {
      return res.status(400).json({ message: err.message });
    }
    if (err.message?.includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
});

// PUT /api/admin/orders/:id - Edit order
router.put('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.updateOrder(String(req.params.id), req.body);
    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ data: result });
  } catch (err: any) {
    if (err.message?.includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
});

export default router;
