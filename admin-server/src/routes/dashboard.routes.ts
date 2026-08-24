import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

router.use(authenticate);

// GET /api/admin/dashboard/stats
router.get('/stats', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const stats = await laravelDb.getDashboardStats();

    // Map to frontend expected format
    res.json({
      data: {
        revenue: {
          total: stats.totalRevenue,
          today: stats.revenueToday,
          thisMonth: stats.revenueToday,
          growth: 0,
        },
        orders: {
          total: stats.totalOrders,
          today: stats.ordersToday,
          pending: stats.pendingOrders,
          growth: 0,
        },
        customers: {
          total: stats.totalCustomers,
          newThisMonth: stats.customersThisMonth,
          growth: 0,
        },
        products: {
          total: stats.totalProducts,
          active: stats.totalProducts,
          lowStock: stats.lowStockProducts,
        },
        recentOrders: stats.recentOrders.map((order: any) => ({
          id: order.id,
          customer: { name: order.shipping_name || 'Guest' },
          createdAt: order.created_at,
          grandTotal: Number(order.total),
          status: (order.status || 'PENDING').toUpperCase(),
        })),
        topProducts: stats.topProducts.map((product: any) => ({
          id: String(product.id),
          name: product.name,
          image: product.image,
          soldCount: Number(product.sold_count || 0),
          revenue: Number(product.revenue || 0),
        })),
        salesByDay: stats.revenueByDay.map((day: any) => ({
          date: day.date,
          revenue: Number(day.revenue || 0),
          orders: Number(day.orders || 0),
        })),
        categoryBreakdown: [],
        notifications: [],
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;