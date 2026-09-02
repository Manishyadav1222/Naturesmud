import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// ── Festival & Marketing Offers Store ─────────────────────────────
let festivalOffers: any[] = [
  {
    id: 'offer-festive-himalayan-wellness',
    title: 'Himalayan Festival Celebration & Wellness Box',
    subtitle: 'Sun-Dried Apples, Raw Mountain Almonds & Dates Powder Sweetener',
    festivalName: '🇳🇵 Himalayan Seasonal Celebration Edition',
    badge: '5% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Combo',
    discountPercentage: 5,
    originalPrice: 1388,
    offerPrice: 1318,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Festive Best Choice',
    themeColor: 'gold',
    items: [
      { productId: '3', name: 'Premium Dehydrated Apple (100 GM)', weight: '100 GM', image: '/products/dehydrated-apple.jpg', price: 408 },
      { productId: '18', name: 'Raw Almond (200 GM)', weight: '200 GM', image: '/products/almonds.jpg', price: 600 },
      { productId: '8', name: 'Dates Powder (100 GM)', weight: '100 GM', image: '/products/dates-powder-100g.jpg', price: 380 },
    ],
    highlights: [
      '100% Preservative-Free Sacred Gifting',
      'Naturally Dehydrated Fruits & Mountain Raw Almonds',
      'Reusable Heavy Glass Jars with Free Festive Note',
      'Same-Day Delivery Inside Kathmandu Valley',
    ],
    isFestival: true,
    isActive: true,
  },
  {
    id: 'offer-gym',
    title: 'Himalayan Gym & Workout Muscle Pack',
    subtitle: 'Premium Cashews, Zinc-Rich Pumpkin Seeds & Chia Omega-3',
    festivalName: '🏋️ Workout & Muscle Recovery Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 5,
    originalPrice: 1516,
    offerPrice: 1440,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Athletes #1 Pick',
    themeColor: 'emerald',
    items: [
      { productId: '14', name: 'Premium Cashewnut (250 GM)', weight: '250 GM', image: '/products/cashewnuts.jpg', price: 600 },
      { productId: '13', name: 'Pumpkin Seeds (300 GM)', weight: '300 GM', image: '/products/pumpkin-seeds.jpg', price: 520 },
      { productId: '12', name: 'Chia Seeds (300 GM)', weight: '300 GM', image: '/products/chia-seeds.jpg', price: 396 },
    ],
    highlights: [
      'High Plant Protein & Zinc for Muscle Repair',
      'Plant Omega-3 to Reduce Joint Inflammation',
      'Clean Pre/Post-Workout Nutrition (Zero Sugar)',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-morning',
    title: 'Daily Morning Diet & Cleanse Kit',
    subtitle: 'Metabolism Kickstart with Dates Powder, Chia Seeds & Pink Salt',
    festivalName: '🌅 Morning Diet & Cleanse Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 5,
    originalPrice: 960,
    offerPrice: 912,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Morning Ritual',
    themeColor: 'amber',
    items: [
      { productId: '8', name: 'Dates Powder (100 GM)', weight: '100 GM', image: '/products/dates-powder-100g.jpg', price: 380 },
      { productId: '12', name: 'Chia Seeds (300 GM)', weight: '300 GM', image: '/products/chia-seeds.jpg', price: 396 },
      { productId: '10', name: 'Himalayan Pink Salt (100 GM)', weight: '100 GM', image: '/products/pink-salt.jpg', price: 184 },
    ],
    highlights: [
      'Warm Water Morning Detox Electrolytes',
      'Gut Microbiome & Smooth Digestion Support',
      'Sustained Natural Energy Without Caffeine Spikes',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-health',
    title: 'Maha Daily Health & Immunity Shield',
    subtitle: 'Mix Dry Nuts, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Total Health & Immunity Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 5,
    originalPrice: 1486,
    offerPrice: 1412,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Family Favorite',
    themeColor: 'gold',
    items: [
      { productId: '20', name: 'Mix Dry Nuts (300 GM)', weight: '300 GM', image: '/products/superfood-mix.jpg', price: 552 },
      { productId: '17', name: 'Roasted Almond (100 GM)', weight: '100 GM', image: '/products/almonds-2.jpg', price: 600 },
      { productId: '9', name: 'Beetroot Powder (100 GM)', weight: '100 GM', image: '/products/beetroot-powder-100g.jpg', price: 334 },
    ],
    highlights: [
      'Full Daily Spectrum of Minerals & Vitamins',
      'Blood Flow, Stamina & Heart Health Support',
      'Handpicked Organic Sourcing from Nepal Co-ops',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-focus',
    title: 'Brain Focus & Clean Energy Snack Box',
    subtitle: 'Dried Blueberries, Dried Cranberries & Pumpkin Seeds',
    festivalName: '⚡ Student & Work Focus Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '⚡',
    categoryLabel: 'Focus & Study',
    discountPercentage: 5,
    originalPrice: 1502,
    offerPrice: 1427,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Zero Crash Snacking',
    themeColor: 'crimson',
    items: [
      { productId: '6', name: 'Dried Blueberries (100 GM)', weight: '100 GM', image: '/products/dried-blueberries-100g.jpg', price: 650 },
      { productId: '7', name: 'Dried Cranberry (100 GM)', weight: '100 GM', image: '/products/cranberries.jpg', price: 332 },
      { productId: '13', name: 'Pumpkin Seeds (300 GM)', weight: '300 GM', image: '/products/pumpkin-seeds.jpg', price: 520 },
    ],
    highlights: [
      'Anthocyanins for Neural Focus & Memory Recall',
      'Zinc & Magnesium for Neurotransmitter Balance',
      'Healthy Sweet-Tangy Replacement for Junk Candies',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-babycare',
    title: 'Pure Infant & Toddler Superfood Starter',
    subtitle: 'Sweet Potato, Carrot & Dates Powders Pure Porridge Mix',
    festivalName: '👶 Baby & Toddler Nutrition Pack',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '👶',
    categoryLabel: 'Baby Care',
    discountPercentage: 5,
    originalPrice: 1380,
    offerPrice: 1311,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Pediatric Approved',
    themeColor: 'purple',
    items: [
      { productId: '25', name: 'Sweet Potato Powder (100 GM)', weight: '100 GM', image: '/products/sweet-potato-powder-100g.jpg', price: 510 },
      { productId: '24', name: 'Carrot Powder (100 GM)', weight: '100 GM', image: '/products/carrot-powder.jpg', price: 490 },
      { productId: '8', name: 'Dates Powder (100 GM)', weight: '100 GM', image: '/products/dates-powder-100g.jpg', price: 380 },
    ],
    highlights: [
      'Precooked Gentle Porridge for 6+ Month Infants',
      '100% Plant-Based Sweetness with Zero Cane Sugar',
      'Rich in Beta-Carotene Vitamin A & Dietary Fiber',
    ],
    isFestival: false,
    isActive: true,
  },
];

// Publicly readable for storefront & homepage showcases
router.get('/offers', (req, res) => {
  res.json({ data: festivalOffers });
});

// Admin-protected routes
router.use(authenticate);

// ── Coupons ──────────────────────────────────────────────────
router.get('/coupons', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const [rows] = await laravelDb.query(
      `SELECT SQL_CALC_FOUND_ROWS * FROM coupons ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [countResult] = await laravelDb.query('SELECT FOUND_ROWS() as count');
    const total = Number((countResult as any)[0]?.count || 0);

    const data = (rows as any[]).map((c) => ({
      id: String(c.id),
      code: c.code,
      type: (c.type || c.discount_type) === 'percentage' ? 'PERCENTAGE' : 'FIXED',
      discount: Number(c.value || c.discount_value || 0),
      discountValue: Number(c.value || c.discount_value || 0),
      minOrderAmount: Number(c.min_order_amount || 0),
      maxDiscountAmount: c.max_discount ? Number(c.max_discount) : (c.max_discount_amount ? Number(c.max_discount_amount) : null),
      usageLimit: c.usage_limit ? Number(c.usage_limit) : null,
      usageCount: Number(c.used_count || 0),
      status: Number(c.is_active) === 1 ? 'ACTIVE' : 'INACTIVE',
      isActive: Number(c.is_active) === 1,
      startDate: c.starts_at ? new Date(c.starts_at).toISOString() : (c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString()),
      endDate: c.expires_at ? new Date(c.expires_at).toISOString() : (c.end_date ? new Date(c.end_date).toISOString() : null),
      createdAt: c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    }));

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/coupons', requireMinRole('MARKETING'), async (req, res, next) => {
  try {
    const {
      code,
      type,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      isActive,
      startDate,
      endDate,
    } = req.body;

    const [result] = await laravelDb.query(
      `INSERT INTO coupons 
      (code, type, value, min_order_amount, max_discount, usage_limit, is_active, starts_at, expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        String(code).toUpperCase(),
        type === 'PERCENTAGE' ? 'percentage' : 'fixed',
        discountValue,
        minOrderAmount || 0,
        maxDiscountAmount || null,
        usageLimit || null,
        isActive ? 1 : 0,
        startDate ? new Date(startDate) : new Date(),
        endDate ? new Date(endDate) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { id: String((result as any).insertId), ...req.body },
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/coupons/:id', requireMinRole('MARKETING'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isActive } = req.body;
    let newActive: number | null = null;
    if (typeof isActive !== 'undefined') {
      newActive = isActive ? 1 : 0;
    } else if (status) {
      newActive = status === 'ACTIVE' ? 1 : 0;
    }
    if (newActive !== null) {
      await laravelDb.query(
        `UPDATE coupons SET is_active = ?, updated_at = NOW() WHERE id = ?`,
        [newActive, id]
      );
    }
    res.json({ success: true, message: 'Coupon status updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.put('/coupons/:id', requireMinRole('MARKETING'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      code,
      type,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      isActive,
      startDate,
      endDate,
    } = req.body;

    await laravelDb.query(
      `UPDATE coupons SET 
        code = COALESCE(?, code),
        type = COALESCE(?, type),
        value = COALESCE(?, value),
        min_order_amount = ?,
        max_discount = ?,
        usage_limit = ?,
        is_active = COALESCE(?, is_active),
        starts_at = ?,
        expires_at = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        code ? String(code).toUpperCase() : null,
        type ? (type === 'PERCENTAGE' ? 'percentage' : 'fixed') : null,
        discountValue ?? null,
        minOrderAmount || 0,
        maxDiscountAmount || null,
        usageLimit || null,
        typeof isActive !== 'undefined' ? (isActive ? 1 : 0) : null,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
        id,
      ]
    );

    res.json({ success: true, message: 'Coupon updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.patch('/coupons/:id/toggle', requireMinRole('MARKETING'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await laravelDb.query(
      `UPDATE coupons SET is_active = NOT is_active, updated_at = NOW() WHERE id = ?`,
      [id]
    );
    res.json({ success: true, message: 'Coupon status updated' });
  } catch (err) {
    next(err);
  }
});

router.delete('/coupons/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await laravelDb.query(`DELETE FROM coupons WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ── Campaigns ────────────────────────────────────────────────
let campaigns = [
  {
    id: 'camp-1',
    name: 'Monsoon Immunity Fest 2026',
    type: 'DISCOUNT',
    description: 'Flat 5% off across all immunity boosting superfoods and raw honey',
    discountPercentage: 5,
    bannerUrl: '/products/superfood-mix.jpg',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-08-31T23:59:59Z',
    status: 'ACTIVE',
    impressions: 4890,
    clicks: 672,
    conversions: 148,
    revenueGenerated: 182400,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'camp-2',
    name: 'Immunity Shield Super Combo Bundle',
    type: 'COMBO_DEAL',
    description: 'Buy Himalayan Raw Honey + Organic Moringa Powder & save 5% instantly',
    discountPercentage: 5,
    bannerUrl: '/products/honey.jpg',
    startDate: '2026-08-10T00:00:00Z',
    endDate: '2026-09-15T23:59:59Z',
    status: 'ACTIVE',
    impressions: 3120,
    clicks: 480,
    conversions: 94,
    revenueGenerated: 112800,
    createdAt: new Date().toISOString(),
  },
];

router.get('/campaigns', requireMinRole('VIEWER'), (req, res) => {
  res.json({
    data: campaigns,
    pagination: {
      page: 1,
      limit: 20,
      total: campaigns.length,
      totalPages: 1,
    },
  });
});

router.post('/campaigns', requireMinRole('MARKETING'), (req, res) => {
  const newCamp = {
    id: `camp-${Date.now()}`,
    ...req.body,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenueGenerated: 0,
    status: req.body.status || 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  campaigns.push(newCamp);
  res.status(201).json({ success: true, data: newCamp });
});

router.patch('/campaigns/:id', requireMinRole('MARKETING'), (req, res) => {
  const { id } = req.params;
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Campaign not found' });
  campaigns[index] = { ...campaigns[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: campaigns[index] });
});

router.delete('/campaigns/:id', requireMinRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  campaigns = campaigns.filter((c) => c.id !== id);
  res.json({ success: true, message: 'Campaign deleted successfully' });
});

// ── Admin Festival Offer Operations ──────────────────────────
router.post('/offers', requireMinRole('MARKETING'), (req, res) => {
  const newOffer = {
    id: req.body.id || `offer-${Date.now()}`,
    title: req.body.title || 'New Festival Offer',
    subtitle: req.body.subtitle || '',
    festivalName: req.body.festivalName || 'Special Offer',
    badge: req.body.badge || `${req.body.discountPercentage || 20}% OFF`,
    discountPercentage: Number(req.body.discountPercentage) || 20,
    originalPrice: Number(req.body.originalPrice) || 0,
    offerPrice: Number(req.body.offerPrice) || 0,
    couponCode: req.body.couponCode || 'FESTIVE',
    endsAt: req.body.endsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tag: req.body.tag || 'Special Combo',
    themeColor: req.body.themeColor || 'gold',
    items: Array.isArray(req.body.items) ? req.body.items : [],
    highlights: Array.isArray(req.body.highlights) ? req.body.highlights : [],
    isFestival: req.body.isFestival !== false,
    isActive: req.body.isActive !== false,
    createdAt: new Date().toISOString(),
  };

  const existingIdx = festivalOffers.findIndex((o) => o.id === newOffer.id);
  if (existingIdx >= 0) {
    festivalOffers[existingIdx] = { ...festivalOffers[existingIdx], ...newOffer };
    return res.json({ success: true, data: festivalOffers[existingIdx] });
  }

  festivalOffers.unshift(newOffer);
  res.status(201).json({ success: true, data: newOffer });
});

router.put('/offers/:id', requireMinRole('MARKETING'), (req, res) => {
  const { id } = req.params;
  const index = festivalOffers.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }
  festivalOffers[index] = { ...festivalOffers[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: festivalOffers[index] });
});

router.patch('/offers/:id', requireMinRole('MARKETING'), (req, res) => {
  const { id } = req.params;
  const index = festivalOffers.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }
  festivalOffers[index] = { ...festivalOffers[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: festivalOffers[index] });
});

router.delete('/offers/:id', requireMinRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  festivalOffers = festivalOffers.filter((o) => o.id !== id);
  res.json({ success: true, message: 'Offer deleted successfully' });
});

export default router;
