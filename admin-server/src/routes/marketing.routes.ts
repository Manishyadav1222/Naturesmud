import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// ── Festival & Marketing Offers Store ─────────────────────────────
let festivalOffers: any[] = [
  {
    id: 'offer-gym',
    title: 'Himalayan Gym & Workout Muscle Pack',
    subtitle: 'High-Protein Raw Walnuts, Zinc-Rich Pumpkin Seeds & Chia Omega-3',
    festivalName: '🏋️ Workout & Muscle Recovery Combo',
    badge: '32% OFF · High Plant Protein',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 32,
    originalPrice: 2598,
    offerPrice: 1750,
    couponCode: 'GYMPOWER10',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    tag: 'Athletes #1 Pick',
    themeColor: 'emerald',
    items: [
      { productId: '1', name: 'Raw Himalayan Walnut Halves', weight: '100g', image: '/products/walnuts.jpg', price: 1299 },
      { productId: '21', name: 'Raw Organic Pumpkin Seeds', weight: '100g', image: '/products/pumpkin-seeds.jpg', price: 549 },
      { productId: '4', name: 'Organic Chia Seeds (Black)', weight: '100g', image: '/products/chia-seeds.jpg', price: 750 },
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
    title: 'Daily Morning Diet & Breakfast Cleanse Kit',
    subtitle: 'Metabolism Kickstart with Raw Mustang Honey, Chia Seeds & Pink Salt',
    festivalName: '🌅 Morning Diet & Cleanse Combo',
    badge: '28% OFF · Clean Metabolism',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 28,
    originalPrice: 2250,
    offerPrice: 1599,
    couponCode: 'MORNING10',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    tag: 'Morning Ritual',
    themeColor: 'amber',
    items: [
      { productId: '6', name: 'Raw Wild Mustang Forest Honey', weight: '100g', image: '/products/honey.jpg', price: 850 },
      { productId: '4', name: 'Organic Chia Seeds (Black)', weight: '100g', image: '/products/chia-seeds.jpg', price: 750 },
      { productId: '23', name: 'Pure Himalayan Pink Rock Salt', weight: '100g', image: '/products/pink-salt.jpg', price: 650 },
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
    subtitle: '3-in-1 Himalayan Superfood Mix, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Total Health & Immunity Combo',
    badge: '30% OFF · Complete Wellness',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 30,
    originalPrice: 2169,
    offerPrice: 1499,
    couponCode: 'HEALTH10',
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    tag: 'Family Favorite',
    themeColor: 'gold',
    items: [
      { productId: '20', name: 'Immunity Shield Superfood Mix', weight: '100g', image: '/products/superfood-mix.jpg', price: 999 },
      { productId: '13', name: 'Premium Roasted Almonds', weight: '100g', image: '/products/almonds.jpg', price: 750 },
      { productId: '15', name: 'Organic Beetroot Powder', weight: '100g', image: '/products/beetroot-powder.jpg', price: 420 },
    ],
    highlights: [
      'Full Daily Spectrum of Minerals & Vitamins',
      'Blood Flow, Stamina & Heart Health Support',
      'Handpicked Organic Sourcing from Nepal Smallholders',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-focus',
    title: 'Brain Focus & Clean Energy Snack Box',
    subtitle: 'Sun-Dried Blueberries, Tart Cranberries & Raw Pumpkin Seeds',
    festivalName: '⚡ Student & Work Focus Combo',
    badge: '26% OFF · Brain Food',
    categoryIcon: '⚡',
    categoryLabel: 'Focus & Study',
    discountPercentage: 26,
    originalPrice: 2178,
    offerPrice: 1599,
    couponCode: 'FOCUS10',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
    tag: 'Zero Crash Snacking',
    themeColor: 'crimson',
    items: [
      { productId: '14', name: 'Antioxidant Dried Blueberries', weight: '100g', image: '/products/blueberries.jpg', price: 980 },
      { productId: '19', name: 'Tart Dried Cranberries', weight: '100g', image: '/products/cranberries.jpg', price: 649 },
      { productId: '21', name: 'Raw Organic Pumpkin Seeds', weight: '100g', image: '/products/pumpkin-seeds.jpg', price: 549 },
    ],
    highlights: [
      'High Anthocyanins for Cognitive Speed & Eye Strain',
      'Replaces Processed Sweets & Junk Snacks',
      'Crunchy, Nutritious & Rich in Healthy Lipids',
    ],
    isFestival: false,
    isActive: true,
  },
  {
    id: 'offer-festive',
    title: 'Dashain & Tihar Maha Utsav Deluxe Combo',
    subtitle: 'Himalayan Walnuts, Roasted Almonds & Wild Forest Mustang Honey',
    festivalName: '🇳🇵 Himalayan Festival Dhamaka Offer',
    badge: '35% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Dhamaka',
    discountPercentage: 35,
    originalPrice: 2899,
    offerPrice: 1890,
    couponCode: 'FESTIVE35',
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    tag: 'Limited Festive Stock',
    themeColor: 'gold',
    items: [
      { productId: '1', name: 'Raw Himalayan Walnut Halves', weight: '100g', image: '/products/walnuts.jpg', price: 1299 },
      { productId: '13', name: 'Premium Roasted Almonds', weight: '100g', image: '/products/almonds.jpg', price: 750 },
      { productId: '6', name: 'Raw Wild Mustang Forest Honey', weight: '100g', image: '/products/honey.jpg', price: 850 },
    ],
    highlights: [
      'Free Express Delivery Across Nepal',
      'Special Festive Gift Packaging',
      '100% Natural Himalayan Wholesomeness',
    ],
    isFestival: true,
    isActive: true,
  },
  {
    id: 'offer-tihar-gift',
    title: 'Tihar Special Bhaitika Himalayan Gift Box',
    subtitle: 'Raw Mountain Honey + Organic Walnuts + Roasted Almonds in Festive Gift Box',
    festivalName: '✨ Tihar Bhaitika Gift Box Campaign',
    badge: '30% OFF · Premium Gift Edition',
    categoryIcon: '🎁',
    categoryLabel: 'Tihar Gift Box',
    discountPercentage: 30,
    originalPrice: 2798,
    offerPrice: 1950,
    couponCode: 'TIHARGIFT',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
    tag: 'Bhai Tihar Bestseller',
    themeColor: 'gold',
    items: [
      { productId: '6', name: 'Raw Wild Mustang Forest Honey', weight: '100g', image: '/products/honey.jpg', price: 850 },
      { productId: '1', name: 'Raw Himalayan Walnut Halves', weight: '100g', image: '/products/walnuts.jpg', price: 1299 },
      { productId: '13', name: 'Premium Roasted Almonds', weight: '100g', image: '/products/almonds.jpg', price: 750 },
    ],
    highlights: [
      'Traditional Himalayan Wooden Gift Box Packaging',
      'Handwritten Personalized Blessing & Greeting Card',
      'Free Express Doorstep Delivery Across Nepal',
    ],
    isFestival: true,
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
    description: 'Flat 20% off across all immunity boosting superfoods and raw honey',
    discountPercentage: 20,
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
    description: 'Buy Himalayan Raw Honey + Organic Moringa Powder & save Rs. 350 instantly',
    discountPercentage: 15,
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
