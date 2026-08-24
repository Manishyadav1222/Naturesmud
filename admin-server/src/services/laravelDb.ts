import mysql from 'mysql2/promise';

// ============================================================
// Laravel MySQL Database Connection
// Connects directly to the Laravel backend database
// to read orders, customers, products data
// ============================================================

export const pool = mysql.createPool({
  host: process.env.LARAVEL_DB_HOST || 'localhost',
  port: Number(process.env.LARAVEL_DB_PORT) || 3306,
  user: process.env.LARAVEL_DB_USER || 'naturesmud',
  password: process.env.LARAVEL_DB_PASSWORD || 'secret',
  database: process.env.LARAVEL_DB_DATABASE || 'natures_mud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

export interface DbOrder {
  id: number;
  user_id: number | null;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  subtotal: string;
  discount: string;
  shipping_fee: string;
  tax: string;
  total: string;
  coupon_code: string | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_zone: string | null;
  shipping_country: string;
  billing_address: string | null;
  notes: string | null;
  gift_note: string | null;
  tracking_number: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStatsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  ordersToday: number;
  revenueToday: number;
  customersThisMonth: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
  recentCustomers: any[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: Record<string, number>;
}

class LaravelDbService {
  async query(sql: string, values?: any[]) {
    return pool.query(sql, values);
  }

  // ---------- ORDERS ----------

  async getOrders(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      paymentStatus = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const offset = (page - 1) * limit;
    const allowedSortFields = ['id', 'created_at', 'total', 'status', 'order_number'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const conditions: string[] = [];
    const paramsArr: any[] = [];

    if (search) {
      conditions.push('(order_number LIKE ? OR shipping_name LIKE ? OR shipping_email LIKE ? OR shipping_phone LIKE ?)');
      const like = `%${search}%`;
      paramsArr.push(like, like, like, like);
    }

    if (status) {
      conditions.push('status = ?');
      paramsArr.push(status.toLowerCase());
    }

    if (paymentStatus) {
      conditions.push('payment_status = ?');
      paramsArr.push(paymentStatus.toLowerCase());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      paramsArr
    );
    const total = Number((countRows as any)[0]?.total || 0);

    const [rows] = await pool.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count,
        COALESCE(NULLIF(o.shipping_name, ''), 'Guest') as customer_name
      FROM orders o ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?`,
      [...paramsArr, limit, offset]
    );

    const orderIds = (rows as any[]).map((o) => o.id);
    const itemMap = new Map();

    if (orderIds.length > 0) {
      const [items] = await pool.query(
        `SELECT oi.*, 
          '/images/products/placeholder.jpg' as product_image
        FROM order_items oi 
        WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );
      for (const item of items as any[]) {
        if (!itemMap.has(item.order_id)) itemMap.set(item.order_id, []);
        itemMap.get(item.order_id).push(item);
      }
    }

    const orders = (rows as any[]).map((order) => ({
      ...order,
      items: itemMap.get(order.id) || [],
    }));

    return {
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(id: string) {
    const [rows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM orders o 
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.id = ? OR o.order_number = ?`,
      [id, id]
    );
    const order = (rows as any[])[0];
    if (!order) return null;

    const [items] = await pool.query(
      `SELECT oi.*, 
        '/images/products/placeholder.jpg' as product_image
      FROM order_items oi 
      WHERE oi.order_id = ?`,
      [order.id]
    );

    const [statusHistory] = await pool.query(
      `SELECT h.*, u.name as changed_by_name
      FROM order_status_histories h
      LEFT JOIN users u ON u.id = h.changed_by 
      WHERE order_id = ? 
      ORDER BY created_at ASC`,
      [order.id]
    );

    return {
      ...order,
      items: items as any[],
      status_history: statusHistory as any[],
    };
  }

  async updateOrderStatus(orderId: string, status: string, comment?: string, changedBy?: string) {
    const allowedStatuses = ['pending', 'confirmed', 'packed', 'ready', 'shipped', 'delivered', 'cancelled', 'returned'];
    const normalized = status.toLowerCase();
    if (!allowedStatuses.includes(normalized)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Find order
      const [orderRows] = await conn.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      const order = (orderRows as any[])[0];
      if (!order) throw new Error('Order not found');

      // Update order status
      await conn.query(
        `UPDATE orders SET status = ?, updated_at = NOW() ${
          normalized === 'shipped' ? ', shipped_at = COALESCE(shipped_at, NOW())' : ''
        } ${normalized === 'delivered' ? ', delivered_at = COALESCE(delivered_at, NOW())' : ''} ${
          normalized === 'cancelled' ? ', cancelled_at = COALESCE(cancelled_at, NOW())' : ''
        } WHERE id = ?`,
        [normalized, orderId]
      );

      // Add status history
      await conn.query(
        `INSERT INTO order_status_histories (order_id, status, note, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [orderId, normalized, comment || `Status changed to ${normalized}`]
      );

      await conn.commit();
      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateOrder(orderId: string, data: any) {
    const existing = await this.getOrderById(orderId);
    if (!existing) return null;

    const fields: string[] = [];
    const paramsArr: any[] = [];

    const setField = (field: string, value: any) => {
      fields.push(`${field} = ?`);
      paramsArr.push(value);
    };

    if (data.status !== undefined) setField('status', data.status);
    if (data.paymentStatus !== undefined) setField('payment_status', data.paymentStatus);
    if (data.shippingName !== undefined) setField('shipping_name', data.shippingName);
    if (data.shippingPhone !== undefined) setField('shipping_phone', data.shippingPhone);
    if (data.shippingEmail !== undefined) setField('shipping_email', data.shippingEmail);
    if (data.shippingAddress !== undefined) setField('shipping_address', data.shippingAddress);
    if (data.shippingCity !== undefined) setField('shipping_city', data.shippingCity);
    if (data.shippingCountry !== undefined) setField('shipping_country', data.shippingCountry);
    if (data.trackingNumber !== undefined) setField('tracking_number', data.trackingNumber);

    if (fields.length === 0) return existing;

    fields.push('updated_at = NOW()');

    await pool.query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      [...paramsArr, orderId]
    );

    return this.getOrderById(orderId);
  }

  // ---------- CUSTOMERS ----------

  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const offset = (page - 1) * limit;
    const allowedSortFields = ['id', 'name', 'email', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const conditions: string[] = [];
    const paramsArr: any[] = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const like = `%${search}%`;
      paramsArr.push(like, like, like);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      paramsArr
    );
    const total = Number((countRows as any)[0]?.total || 0);

    const [rows] = await pool.query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count,
        (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) as total_spent,
        (SELECT COUNT(*) FROM wishlists w WHERE w.user_id = u.id) as wishlist_count
      FROM users u ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?`,
      [...paramsArr, limit, offset]
    );

    return {
      data: rows as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerById(id: string) {
    const [userRows] = await pool.query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count,
        (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.user_id = u.id) as total_spent
      FROM users u WHERE u.id = ?`,
      [id]
    );
    const user = (userRows as any[])[0];
    if (!user) return null;

    // Get user's orders
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [id]
    );

    // Get user's addresses
    const [addresses] = await pool.query(
      `SELECT * FROM addresses WHERE user_id = ?`,
      [id]
    );

    // Get user's reviews
    const [reviews] = await pool.query(
      `SELECT r.*, p.name as product_name FROM reviews r 
      LEFT JOIN products p ON p.id = r.product_id 
      WHERE r.user_id = ?`,
      [id]
    );

    // Get user's wishlist
    const [wishlist] = await pool.query(
      `SELECT w.*, p.name as product_name, p.slug as product_slug, p.price 
      FROM wishlists w 
      LEFT JOIN products p ON p.id = w.product_id 
      WHERE w.user_id = ?`,
      [id]
    );

    return {
      ...user,
      orders: orders as any[],
      addresses: addresses as any[],
      reviews: reviews as any[],
      wishlist: wishlist as any[],
    };
  }

  // ---------- DASHBOARD ----------

  async getDashboardStats(): Promise<DashboardStatsData> {
    const [statsRows] = await pool.query(`
      SELECT 
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled') as total_revenue,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM users) as total_customers,
        (SELECT COUNT(*) FROM products WHERE is_active = 1) as total_products,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as orders_today,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled') as revenue_today,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as customers_this_month,
        (SELECT COUNT(*) FROM products WHERE stock_quantity <= low_stock_threshold AND is_active = 1) as low_stock
    `);
    const statsRow = (statsRows as any[])[0] as any;

    // Recent orders
    const [recentOrders] = await pool.query(
      `SELECT id, order_number, status, payment_status, total, shipping_name, created_at 
      FROM orders ORDER BY created_at DESC LIMIT 8`
    );

    // Recent customers
    const [recentCustomers] = await pool.query(
      `SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC LIMIT 6`
    );

    // Top products
    const [topProducts] = await pool.query(`
      SELECT p.id, p.name, NULL as image, SUM(oi.quantity) as sold_count, SUM(oi.line_total) as revenue
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY sold_count DESC
      LIMIT 5
    `);

    // Revenue by day (last 14 days)
    const [revenueByDay] = await pool.query(`
      SELECT DATE(created_at) as date, 
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Orders by status
    const [ordersByStatusArr] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    const ordersByStatus: Record<string, number> = {};
    for (const row of ordersByStatusArr as any[]) {
      ordersByStatus[row.status] = Number(row.count);
    }

    return {
      totalRevenue: Number(statsRow.total_revenue || 0),
      totalOrders: Number(statsRow.total_orders || 0),
      totalCustomers: Number(statsRow.total_customers || 0),
      totalProducts: Number(statsRow.total_products || 0),
      pendingOrders: Number(statsRow.pending_orders || 0),
      ordersToday: Number(statsRow.orders_today || 0),
      revenueToday: Number(statsRow.revenue_today || 0),
      customersThisMonth: Number(statsRow.customers_this_month || 0),
      lowStockProducts: Number(statsRow.low_stock || 0),
      recentOrders: recentOrders as any[],
      recentCustomers: recentCustomers as any[],
      topProducts: topProducts as any[],
      revenueByDay: revenueByDay as any[],
      ordersByStatus,
    };
  }

  async getAnalyticsStats(period: string = '12M') {
    const [statsRows] = await pool.query(`
      SELECT 
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled') as total_revenue,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM users) as total_customers,
        (SELECT COUNT(*) FROM products WHERE is_active = 1) as total_products,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as orders_today,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled') as revenue_today,
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as customers_this_month
    `);
    const stats = (statsRows as any[])[0] || {};
    const totalRev = Number(stats.total_revenue || 0);
    const totalOrd = Number(stats.total_orders || 0);
    const avgOrderVal = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;

    // Top selling products from real orders
    const [topProducts] = await pool.query(`
      SELECT p.id, p.name, p.slug, p.price,
        COALESCE(SUM(oi.quantity), 0) as sales,
        COALESCE(SUM(oi.line_total), 0) as revenue
      FROM products p
      JOIN order_items oi ON oi.product_id = p.id
      JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
      GROUP BY p.id, p.name, p.slug, p.price
      ORDER BY sales DESC, revenue DESC
      LIMIT 10
    `);

    // Sales by Region/City from real orders
    const [salesByRegion] = await pool.query(`
      SELECT 
        COALESCE(shipping_city, 'Kathmandu Valley') as region,
        COUNT(*) as orders,
        COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY shipping_city
      ORDER BY revenue DESC
      LIMIT 6
    `);

    // Category breakdown
    const [categoryBreakdown] = await pool.query(`
      SELECT 
        c.name as category,
        COUNT(DISTINCT p.id) as productCount,
        COALESCE(SUM(oi.quantity), 0) as totalSold,
        COALESCE(SUM(oi.line_total), 0) as revenue
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY c.id, c.name
      ORDER BY revenue DESC, productCount DESC
    `);

    // Orders by status
    const [ordersByStatusRows] = await pool.query(`
      SELECT status, COUNT(*) as count, COALESCE(SUM(total), 0) as total
      FROM orders
      GROUP BY status
    `);
    const orderStatusMap: Record<string, number> = {};
    for (const r of ordersByStatusRows as any[]) {
      orderStatusMap[r.status] = Number(r.count);
    }

    // Time-series generation (Monthly or Daily)
    let timeline: Array<{ label: string; value: number; orders: number }> = [];
    if (period === '30D') {
      const [dailyRows] = await pool.query(`
        SELECT DATE(created_at) as date_val, 
          COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) as revenue,
          COUNT(*) as orders
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date_val ASC
      `);
      const dailyMap = new Map((dailyRows as any[]).map(r => [String(r.date_val), { revenue: Number(r.revenue), orders: Number(r.orders) }]));
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = dailyMap.get(key);
        timeline.push({
          label: dayLabel,
          value: existing?.revenue || 0,
          orders: existing?.orders || 0,
        });
      }
    } else {
      // 12 Months timeline
      const [monthlyRows] = await pool.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as ym, 
          COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) as revenue,
          COUNT(*) as orders
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY ym ASC
      `);
      const monthMap = new Map((monthlyRows as any[]).map(r => [String(r.ym), { revenue: Number(r.revenue), orders: Number(r.orders) }]));
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const ym = `${year}-${month}`;
        const label = `${months[d.getMonth()]}`;
        const existing = monthMap.get(ym);
        timeline.push({
          label,
          value: existing?.revenue || 0,
          orders: existing?.orders || 0,
        });
      }
    }

    return {
      summary: {
        totalRevenue: totalRev,
        totalOrders: totalOrd,
        totalCustomers: Number(stats.total_customers || 0),
        totalProducts: Number(stats.total_products || 0),
        avgOrderValue: avgOrderVal,
        revenueToday: Number(stats.revenue_today || 0),
        ordersToday: Number(stats.orders_today || 0),
        growthRate: 0,
      },
      timeSeries: timeline,
      topProducts: topProducts as any[],
      salesByRegion: salesByRegion as any[],
      categoryBreakdown: categoryBreakdown as any[],
      ordersByStatus: orderStatusMap,
    };
  }

  // ---------- RECIPES ----------

  async getRecipes(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const offset = (page - 1) * limit;
    const allowedSortFields = ['id', 'title', 'created_at', 'is_published'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const conditions: string[] = [];
    const paramsArr: any[] = [];

    if (search) {
      conditions.push('(title LIKE ? OR excerpt LIKE ?)');
      const like = `%${search}%`;
      paramsArr.push(like, like);
    }

    if (status) {
      const isPublished = status.toUpperCase() === 'PUBLISHED';
      conditions.push('is_published = ?');
      paramsArr.push(isPublished ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM recipes ${whereClause}`,
      paramsArr
    );
    const total = Number((countRows as any)[0]?.total || 0);

    const [rows] = await pool.query(
      `SELECT * FROM recipes ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?`,
      [...paramsArr, limit, offset]
    );

    return {
      data: rows as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecipeById(id: string) {
    const [rows] = await pool.query(
      `SELECT * FROM recipes WHERE id = ? OR slug = ?`,
      [id, id]
    );
    return (rows as any[])[0] || null;
  }

  async createRecipe(data: any) {
    const {
      title,
      slug,
      excerpt = null,
      content = '',
      coverImage = null,
      category = null,
      prepTime = 0,
      cookTime = 0,
      servings = 1,
      difficulty = 'easy',
      ingredients = [],
      instructions = [],
      nutrition = {},
      status = 'DRAFT',
      seoTitle = null,
      seoDescription = null,
    } = data;

    const isPublished = status === 'PUBLISHED' || status === 'published' ? 1 : 0;

    const [result] = await pool.query(
      `INSERT INTO recipes (
        title, slug, excerpt, content, featured_image, category,
        prep_time, cook_time, servings, difficulty, ingredients, instructions, nutrition,
        is_published, meta_title, meta_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        prepTime,
        cookTime,
        servings,
        difficulty.toLowerCase(),
        JSON.stringify(ingredients),
        JSON.stringify(instructions),
        JSON.stringify(nutrition),
        isPublished,
        seoTitle,
        seoDescription,
      ]
    );

    const insertId = Number((result as any).insertId);
    return this.getRecipeById(String(insertId));
  }

  async updateRecipe(id: string, data: any) {
    const existing = await this.getRecipeById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const paramsArr: any[] = [];

    const setField = (field: string, value: any) => {
      fields.push(`${field} = ?`);
      paramsArr.push(value);
    };

    if (data.title !== undefined) setField('title', data.title);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.excerpt !== undefined) setField('excerpt', data.excerpt);
    if (data.content !== undefined) setField('content', data.content);
    if (data.coverImage !== undefined) setField('featured_image', data.coverImage);
    if (data.category !== undefined) setField('category', data.category);
    if (data.prepTime !== undefined) setField('prep_time', data.prepTime);
    if (data.cookTime !== undefined) setField('cook_time', data.cookTime);
    if (data.servings !== undefined) setField('servings', data.servings);
    if (data.difficulty !== undefined) setField('difficulty', String(data.difficulty).toLowerCase());
    if (data.ingredients !== undefined) setField('ingredients', JSON.stringify(data.ingredients));
    if (data.instructions !== undefined) setField('instructions', JSON.stringify(data.instructions));
    if (data.nutrition !== undefined) setField('nutrition', JSON.stringify(data.nutrition));
    if (data.status !== undefined) {
      setField('is_published', data.status === 'PUBLISHED' ? 1 : 0);
    }
    if (data.seoTitle !== undefined) setField('meta_title', data.seoTitle);
    if (data.seoDescription !== undefined) setField('meta_description', data.seoDescription);

    // Handle featured toggle
    if (data.isFeatured !== undefined) {
      if (data.isFeatured) setField('is_published', 1);
    }

    // Add updated_at
    fields.push('updated_at = NOW()');

    if (fields.length === 0) return existing;

    await pool.query(
      `UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`,
      [...paramsArr, id]
    );

    return this.getRecipeById(id);
  }

  async deleteRecipe(id: string) {
    const existing = await this.getRecipeById(id);
    if (!existing) return false;

    await pool.query(`DELETE FROM recipes WHERE id = ?`, [id]);
    return true;
  }

  // ---------- PRODUCTS ----------

  async getAllProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    stockStatus?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      stockStatus = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const offset = (page - 1) * limit;

    // Map frontend camelCase sort keys to DB columns
    const sortFieldMap: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      price: 'price',
      name: 'name',
      stock: 'stock_quantity',
      stockQuantity: 'stock_quantity',
      created_at: 'created_at',
      updated_at: 'updated_at',
      stock_quantity: 'stock_quantity',
    };
    const allowedSortFields = ['id', 'created_at', 'updated_at', 'price', 'name', 'stock_quantity'];
    const safeSortBy = sortFieldMap[sortBy] || (allowedSortFields.includes(sortBy) ? sortBy : 'created_at');
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const conditions: string[] = [];
    const paramsArr: any[] = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      const like = `%${search}%`;
      paramsArr.push(like, like, like);
    }

    if (status) {
      const s = status.toUpperCase();
      if (s === 'ACTIVE') {
        conditions.push('p.is_active = 1');
      } else if (s === 'DRAFT' || s === 'ARCHIVED') {
        conditions.push('p.is_active = 0');
      }
    }

    if (stockStatus) {
      const ss = stockStatus.toUpperCase();
      if (ss === 'IN_STOCK') {
        conditions.push('p.stock_quantity > p.low_stock_threshold');
      } else if (ss === 'LOW_STOCK') {
        conditions.push('p.stock_quantity <= p.low_stock_threshold AND p.stock_quantity > 0');
      } else if (ss === 'OUT_OF_STOCK') {
        conditions.push('p.stock_quantity = 0');
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      paramsArr
    );
    const total = Number((countRows as any)[0]?.total || 0);

    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ${whereClause}
       ORDER BY p.${safeSortBy} ${safeSortOrder}
       LIMIT ? OFFSET ?`,
      [...paramsArr, limit, offset]
    );

    return {
      data: rows as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = ? OR p.slug = ?`,
      [id, id]
    );
    return (rows as any[])[0] || null;
  }

  async createProduct(data: any) {
    const {
      name,
      slug,
      sku,
      description = null,
      shortDescription = null,
      price = 0,
      compareAtPrice = null,
      cost = 0,
      stock = 0,
      lowStockThreshold = 5,
      categoryId = null,
      status = 'DRAFT',
      unit = 'PC',
      weight = null,
      isFeatured = false,
      isPublished = false,
      isActive = true,
      images = [],
    } = data;

    const finalSlug = slug || this.slugify(name);
    const finalSku =
      sku ||
      `NM-${String(name || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 24)}-${Date.now().toString().slice(-5)}`;

    const isActiveFlag =
      String(status).toUpperCase() === 'ACTIVE' || isActive === true || isPublished === true ? 1 : 0;

    const [result] = await pool.query(
      `INSERT INTO products (
        category_id, name, slug, sku, description, short_description,
        price, compare_at_price, cost_price, stock_quantity, low_stock_threshold,
        is_active, is_featured, is_best_seller, is_new, weight, unit,
        images,
        rating_avg, rating_count, views_count, sold_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, 0, 0, 0, 0, NOW(), NOW())`,
      [
        categoryId || null,
        name,
        finalSlug,
        finalSku,
        description,
        shortDescription,
        price,
        compareAtPrice,
        cost,
        stock,
        lowStockThreshold,
        isActiveFlag,
        isFeatured ? 1 : 0,
        weight,
        unit,
        JSON.stringify(images),
      ]
    );

    const insertId = Number((result as any).insertId);
    return this.getProductById(String(insertId));
  }

  async updateProduct(id: string, data: any) {
    const existing = await this.getProductById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const paramsArr: any[] = [];

    const setField = (field: string, value: any) => {
      fields.push(`${field} = ?`);
      paramsArr.push(value);
    };

    if (data.name !== undefined) setField('name', data.name);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.sku !== undefined) setField('sku', data.sku);
    if (data.description !== undefined) setField('description', data.description);
    if (data.shortDescription !== undefined) setField('short_description', data.shortDescription);
    if (data.price !== undefined) setField('price', data.price);
    if (data.compareAtPrice !== undefined) setField('compare_at_price', data.compareAtPrice || null);
    if (data.cost !== undefined) setField('cost_price', data.cost);
    if (data.stock !== undefined) setField('stock_quantity', data.stock);
    if (data.lowStockThreshold !== undefined) setField('low_stock_threshold', data.lowStockThreshold);
    if (data.categoryId !== undefined) setField('category_id', data.categoryId || null);
    if (data.unit !== undefined) setField('unit', data.unit);
    if (data.weight !== undefined) setField('weight', data.weight);
    if (data.isFeatured !== undefined) setField('is_featured', data.isFeatured ? 1 : 0);
    if (data.images !== undefined) setField('images', JSON.stringify(data.images));

    // status / isActive / isPublished all map onto the single is_active column
    if (data.status !== undefined) {
      const status = String(data.status).toUpperCase();
      if (status === 'ACTIVE') setField('is_active', 1);
      else if (status === 'DRAFT' || status === 'ARCHIVED') setField('is_active', 0);
    }
    if (data.isActive !== undefined) setField('is_active', data.isActive ? 1 : 0);
    if (data.isPublished !== undefined) setField('is_active', data.isPublished ? 1 : 0);

    if (fields.length === 0) return existing;

    fields.push('updated_at = NOW()');

    await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      [...paramsArr, id]
    );

    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    const existing = await this.getProductById(id);
    if (!existing) return false;

    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
    return true;
  }

  async bulkDeleteProducts(ids: string[]) {
    if (!ids || ids.length === 0) return { deleted: 0 };
    const [result] = await pool.query(
      `DELETE FROM products WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );
    return { deleted: Number((result as any).affectedRows || 0) };
  }

  async duplicateProduct(id: string) {
    const existing = await this.getProductById(id);
    if (!existing) return null;

    return this.createProduct({
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug || 'product'}-copy-${Date.now().toString().slice(-6)}`,
      sku: existing.sku ? `${existing.sku}-COPY` : undefined,
      description: existing.description,
      shortDescription: existing.short_description,
      price: existing.price,
      compareAtPrice: existing.compare_at_price,
      cost: existing.cost_price,
      stock: existing.stock_quantity,
      lowStockThreshold: existing.low_stock_threshold,
      categoryId: existing.category_id ? String(existing.category_id) : null,
      status: 'DRAFT',
      unit: existing.unit,
      weight: existing.weight,
      isFeatured: false,
      isActive: false,
    });
  }

  slugify(value: string): string {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ---------- CATEGORIES ----------

  async getCategories(params: { search?: string; limit?: number } = {}) {
    const { search = '', limit } = params;
    const conditions: string[] = [];
    const paramsArr: any[] = [];

    if (search) {
      conditions.push('(name LIKE ? OR slug LIKE ?)');
      const like = `%${search}%`;
      paramsArr.push(like, like);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = limit ? 'LIMIT ?' : '';

    const [rows] = await pool.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as product_count
       FROM categories c
       ${whereClause}
       ORDER BY c.sort_order ASC, c.name ASC
       ${limitClause}`,
      limit ? [...paramsArr, limit] : paramsArr
    );

    return rows as any[];
  }

  async getCategoryTree() {
    const rows = await this.getCategories();
    const map = new Map<number, any>();
    rows.forEach((c: any) => map.set(Number(c.id), { ...c, children: [] }));
    const tree: any[] = [];
    for (const c of map.values()) {
      if (c.parent_id && map.has(Number(c.parent_id))) {
        map.get(Number(c.parent_id)).children.push(c);
      } else {
        tree.push(c);
      }
    }
    return tree;
  }

  async createCategory(data: any) {
    const {
      name,
      slug,
      description = null,
      parentId = null,
      image = null,
      isActive = true,
      sortOrder = 0,
    } = data;

    const finalSlug = slug || this.slugify(name);

    const [result] = await pool.query(
      `INSERT INTO categories (parent_id, name, slug, description, image, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [parentId || null, name, finalSlug, description, image, isActive ? 1 : 0, sortOrder || 0]
    );

    const insertId = Number((result as any).insertId);
    const all = await this.getCategories();
    return all.find((c: any) => Number(c.id) === insertId) || null;
  }

  async updateCategory(id: string, data: any) {
    const fields: string[] = [];
    const paramsArr: any[] = [];

    const setField = (field: string, value: any) => {
      fields.push(`${field} = ?`);
      paramsArr.push(value);
    };

    if (data.name !== undefined) setField('name', data.name);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.description !== undefined) setField('description', data.description);
    if (data.parentId !== undefined) setField('parent_id', data.parentId || null);
    if (data.image !== undefined) setField('image', data.image);
    if (data.isActive !== undefined) setField('is_active', data.isActive ? 1 : 0);
    if (data.sortOrder !== undefined) setField('sort_order', data.sortOrder);

    if (fields.length === 0) return null;
    fields.push('updated_at = NOW()');

    await pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      [...paramsArr, id]
    );

    const all = await this.getCategories();
    return all.find((c: any) => Number(c.id) === Number(id)) || null;
  }

  async deleteCategory(id: string) {
    const [result] = await pool.query(
      `DELETE FROM categories WHERE id = ? AND NOT EXISTS (SELECT 1 FROM products p WHERE p.category_id = ?)`,
      [id, id]
    );
    const deleted = Number((result as any).affectedRows || 0);
    if (deleted === 0) {
      const [check] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
      if ((check as any[]).length === 0) return false;
      throw new Error('Cannot delete category that still has products');
    }
    return true;
  }

  async testConnection(): Promise<boolean> {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

export const laravelDb = new LaravelDbService();