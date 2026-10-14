import { getProductBySlug } from '@/lib/data/products';

export type CampaignLifecycleState = 'SCHEDULED' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'ARCHIVED';

export interface OfferItem {
  productId: string;
  name: string;
  weight: string;
  image: string;
  price: number;
}

export interface FestivalOffer {
  id: string;
  title: string;
  subtitle: string;
  festivalName: string;
  badge: string;
  categoryIcon?: string;
  categoryLabel?: string;
  discountPercentage: number;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  startDate?: string;
  endDate?: string;
  endsAt: string;
  items: OfferItem[];
  tag: string;
  highlights: string[];
  isFestival: boolean;
  isActive?: boolean;
  isEvergreen?: boolean;
  lifecycleState?: CampaignLifecycleState;
  themeColor?: 'gold' | 'emerald' | 'amber' | 'crimson' | 'purple' | 'red';
}

/**
 * Resolves an OfferItem directly from the canonical product catalog (`lib/data/products.ts`)
 * so bundle item prices, weights, and slugs never drift from the product catalog.
 */
export function buildOfferItem(
  slug: string,
  fallback: { name: string; weight: string; image: string; price: number }
): OfferItem {
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      productId: slug,
      ...fallback,
      name: fallback.name.replace(/\s*\(\d+\s*GM\)/i, ''),
    };
  }
  const weight = product.weight || fallback.weight;
  return {
    productId: product.slug,
    name: product.official_label_name || product.name,
    weight,
    image: product.images?.[0] || fallback.image,
    price: Number(product.price),
  };
}

function createBundleOffer(config: Omit<FestivalOffer, 'originalPrice' | 'offerPrice'> & { customOfferPrice?: number }): FestivalOffer {
  const originalPrice = config.items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const computedOfferPrice =
    config.customOfferPrice ?? Math.round(originalPrice * (1 - config.discountPercentage / 100));
  return {
    ...config,
    originalPrice,
    offerPrice: computedOfferPrice,
  };
}

/**
 * Evaluates the lifecycle state of a promotional or seasonal campaign.
 */
export function getCampaignLifecycleState(
  offer: FestivalOffer,
  now: Date = new Date()
): CampaignLifecycleState {
  if (offer.isActive === false) return 'ARCHIVED';
  if (offer.isEvergreen) return 'ACTIVE';

  const nowMs = now.getTime();
  if (offer.startDate) {
    const startMs = new Date(`${offer.startDate}T00:00:00+05:45`).getTime();
    if (!Number.isNaN(startMs) && nowMs < startMs) {
      return 'SCHEDULED';
    }
  }

  const endReference = offer.endDate
    ? new Date(`${offer.endDate}T23:59:59+05:45`).getTime()
    : offer.endsAt
      ? new Date(offer.endsAt).getTime()
      : NaN;

  if (!Number.isNaN(endReference)) {
    if (nowMs > endReference) {
      return 'EXPIRED';
    }
    const hoursRemaining = (endReference - nowMs) / (1000 * 60 * 60);
    if (hoursRemaining <= 72) {
      return 'EXPIRING';
    }
  }

  return 'ACTIVE';
}

/**
 * Filters a list of offers so that only ACTIVE or EXPIRING campaigns (or evergreen bundles)
 * are shown on public storefront surfaces.
 */
export function getActiveCampaignOffers(
  offers: FestivalOffer[],
  now: Date = new Date()
): FestivalOffer[] {
  return offers
    .map((offer) => ({
      ...offer,
      lifecycleState: getCampaignLifecycleState(offer, now),
    }))
    .filter((offer) => offer.lifecycleState === 'ACTIVE' || offer.lifecycleState === 'EXPIRING');
}

export const initialFestivalOffers: FestivalOffer[] = [
  createBundleOffer({
    id: 'offer-tihar-bhai-masala-royal',
    title: 'Tihar Bhai Masala Royal Dry Fruit & Nut Hamper',
    subtitle: 'Roasted Almonds, Premium Cashews, Crispy Pistachios & Fox Nuts (Makhana) for Sacred Bhai Tika Gifting',
    festivalName: '🪔 Tihar Bhai Tika Celebration Edition',
    badge: 'TIHAR · 10% OFF',
    categoryIcon: '🪔',
    categoryLabel: 'Tihar Bhai Masala',
    discountPercentage: 10,
    couponCode: 'TIHAR10',
    startDate: '2026-10-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'gold',
    items: [
      buildOfferItem('roasted-almonds', {
        name: 'Roasted Himalayan Almonds (200 GM)',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      }),
      buildOfferItem('roasted-cashewnuts', {
        name: 'Roasted Cashew Nuts (200 GM)',
        weight: '200 GM',
        image: '/products/nm-roasted-cashew-new.jpg',
        price: 750,
      }),
      buildOfferItem('premium-pistachio-roasted-salted', {
        name: 'Roasted Salted Pistachios (200 GM)',
        weight: '200 GM',
        image: '/products/nm-pistachio-jar.jpg',
        price: 1250,
      }),
      buildOfferItem('makhana-fox-nuts', {
        name: 'Himalayan Makhana Fox Nuts (50 GM)',
        weight: '50 GM',
        image: '/products/makhana-fox-nuts.jpg',
        price: 390,
      }),
    ],
    highlights: [
      '10% OFF with Code TIHAR10 + Free Delivery Over Rs. 3,000',
      'Airtight Food-Grade Jars Perfect for Sister-to-Brother Bhai Tika Gift Hamper',
      'Zero Adulteration, Grade-W240 Cashews & Crisp Mountain Almonds',
      'Complimentary Himalayan Pink Salt Jar (200g) on Total Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-chhath-puja-satvik',
    title: 'Chhath Puja Shuddha & Satvik Offering Pack',
    subtitle: 'Pure Dates Sweetener for Thekua, Sacred Makhana, Virgin Coconut Oil & Himalayan Pink Salt for Holy Arghya',
    festivalName: '🌅 Chhath Mahaparva Sacred Edition',
    badge: 'CHHATH · 10% OFF',
    categoryIcon: '🌅',
    categoryLabel: 'Chhath Puja Special',
    discountPercentage: 10,
    couponCode: 'CHHATH10',
    startDate: '2026-10-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Till Chhath Puja',
    themeColor: 'amber',
    items: [
      buildOfferItem('dates-powder', {
        name: 'Dates Powder Natural Sweetener (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      }),
      buildOfferItem('makhana-fox-nuts', {
        name: 'Sacred Makhana Fox Nuts (50 GM)',
        weight: '50 GM',
        image: '/products/makhana-fox-nuts.jpg',
        price: 390,
      }),
      buildOfferItem('virgin-coconut-oil-180ml', {
        name: 'Extra Virgin Coconut Oil (180 ML)',
        weight: '180 ML',
        image: '/products/coconut-oil.jpg',
        price: 650,
      }),
      buildOfferItem('himalayan-pink-salt', {
        name: 'Himalayan Pink Salt (200 GM)',
        weight: '200 GM',
        image: '/products/pink-salt.jpg',
        price: 250,
      }),
    ],
    highlights: [
      '100% Satvik, Single-Ingredient Whole Foods for Chhathi Maiya & Surya Dev Arghya',
      'Natural Whole Date Sweetener for Traditional Sugar-Free Thekua Prasad',
      'Sacred Himalayan Makhana & Cold-Pressed Virgin Coconut Oil',
      '10% OFF with Code CHHATH10 + Free Delivery Across Nepal Over Rs. 3,000',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-new-himalayan-superfoods',
    title: 'Festive Superfood Trio: Avocado, Strawberry & Almonds',
    subtitle: '100% Pure Freeze Dried Avocado, Pure Strawberry Powder & Roasted Himalayan Almonds',
    festivalName: '🎉 Dashain, Tihar & Chhath Grand Celebration Edition',
    badge: 'FESTIVAL · 10% OFF',
    categoryIcon: '🌿',
    categoryLabel: 'Festival Special',
    discountPercentage: 10,
    customOfferPrice: 2640,
    couponCode: 'TIHAR10',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Till Chhath End',
    themeColor: 'emerald',
    items: [
      buildOfferItem('freeze-dried-avocado-powder', {
        name: 'Freeze Dried Avocado Powder (80 GM)',
        weight: '80 GM',
        image: '/products/avocado-powder-v2.jpg',
        price: 790,
      }),
      buildOfferItem('strawberry-powder', {
        name: 'Pure Strawberry Powder (80 GM)',
        weight: '80 GM',
        image: '/products/strawberry-powder-v2.jpg',
        price: 1395,
      }),
      buildOfferItem('roasted-almonds', {
        name: 'Roasted Himalayan Almonds (200 GM)',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Counts Toward Free Delivery (>Rs. 3,000)',
      'Authentic Product of Nepal 🇳🇵 Freeze-Dried Avocado & Strawberry',
      'Crispy Roasted Mountain Almonds Rich in Vitamin E & Protein',
      'Free Pink Salt (200g) Unlocked on Total Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-festive-himalayan-wellness',
    title: 'Dashain Blessings & Family Wellness Box',
    subtitle: 'Sun-Dried Apples, Raw Mountain Almonds & Dates Powder Sweetener',
    festivalName: '🇳🇵 Dashain Festival Celebration Edition',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Combo',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'gold',
    items: [
      buildOfferItem('dehydrated-apple', {
        name: 'Dehydrated Apple (100 GM)',
        weight: '100 GM',
        image: '/products/dehydrated-apple.jpg',
        price: 510,
      }),
      buildOfferItem('raw-himalayan-almonds', {
        name: 'Raw Himalayan Almonds (200 GM)',
        weight: '200 GM',
        image: '/products/nm-almond-jar-v2.jpg',
        price: 750,
      }),
      buildOfferItem('dates-powder', {
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      }),
    ],
    highlights: [
      '10% OFF Dashain Discount + Free Delivery Over Rs. 3,000',
      'Free Himalayan Pink Salt (200g) on Orders Over Rs. 5,000+',
      'Reusable Heavy Glass Jars with Free Dashain Note',
      'Same-Day Delivery Inside Kathmandu Valley',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-gym',
    title: 'Himalayan Gym & Workout Muscle Pack',
    subtitle: 'Premium Cashews, Zinc-Rich Pumpkin Seeds & Chia Omega-3',
    festivalName: '🏋️ Dashain Workout & Muscle Recovery Combo',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'emerald',
    items: [
      buildOfferItem('premium-cashewnuts', {
        name: 'Premium Cashew Nuts (200 GM)',
        weight: '200 GM',
        image: '/products/nm-cashew-new-jar.jpg',
        price: 750,
      }),
      buildOfferItem('pumpkin-seeds', {
        name: 'Pumpkin Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      }),
      buildOfferItem('chia-seeds', {
        name: 'Organic Chia Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Free Delivery Over Rs. 3,000',
      'High Plant Protein & Zinc for Active Lifestyles',
      'Free Pink Salt (200g) on Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-morning',
    title: 'Daily Morning Diet & Hydration Kit',
    subtitle: 'Morning Routine with Dates Powder, Chia Seeds & Pink Salt',
    festivalName: '🌅 Dashain Morning Diet & Hydration Combo',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'amber',
    items: [
      buildOfferItem('dates-powder', {
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      }),
      buildOfferItem('chia-seeds', {
        name: 'Organic Chia Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      }),
      buildOfferItem('himalayan-pink-salt', {
        name: 'Himalayan Pink Salt (200 GM)',
        weight: '200 GM',
        image: '/products/pink-salt.jpg',
        price: 250,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Free Delivery Over Rs. 3,000',
      'Warm Water Morning Mineral Electrolytes & Chia Fiber',
      'Free Pink Salt (200g) on Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-health',
    title: 'Maha Dashain Health & Immunity Shield',
    subtitle: 'Mix Dry Nuts, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Dashain Health & Immunity Combo',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'gold',
    items: [
      buildOfferItem('superfood-trail-mix', {
        name: 'Superfood Trail Mix (Nuts & Seeds)',
        weight: '200 GM',
        image: '/products/superfood-mix.jpg',
        price: 790,
      }),
      buildOfferItem('roasted-almonds', {
        name: 'Roasted Almonds',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      }),
      buildOfferItem('beetroot-powder', {
        name: 'Beetroot Powder',
        weight: '100 GM',
        image: '/products/beetroot-powder-100g.jpg',
        price: 430,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Free Delivery Over Rs. 3,000',
      'Full Daily Spectrum of Minerals & Vitamins',
      'Free Pink Salt (200g) on Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-focus',
    title: 'Brain Focus & Clean Energy Snack Box',
    subtitle: 'Dried Blueberries, Dried Cranberries & Pumpkin Seeds',
    festivalName: '⚡ Dashain Focus & Study Combo',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '⚡',
    categoryLabel: 'Focus & Study',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'crimson',
    items: [
      buildOfferItem('dried-blueberries', {
        name: 'Dried Blueberries',
        weight: '100 GM',
        image: '/products/dried-blueberries-100g.jpg',
        price: 650,
      }),
      buildOfferItem('dried-cranberries', {
        name: 'Dried Cranberries',
        weight: '100 GM',
        image: '/products/cranberries.jpg',
        price: 415,
      }),
      buildOfferItem('pumpkin-seeds', {
        name: 'Pumpkin Seeds',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Free Delivery Over Rs. 3,000',
      'Anthocyanin-Rich Whole Berries for Daily Snacking',
      'Free Pink Salt (200g) on Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-babycare',
    title: 'Pure Infant & Toddler Superfood Starter',
    subtitle: 'Sweet Potato, Carrot & Dates Powders Pure Porridge Mix',
    festivalName: '👶 Dashain Baby & Toddler Nutrition Pack',
    badge: '10% OFF · Dashain Special',
    categoryIcon: '👶',
    categoryLabel: 'Baby Care',
    discountPercentage: 10,
    couponCode: 'DASHAIN10 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-11-25',
    endsAt: '2026-11-25T23:59:59+05:45',
    tag: 'Valid Through Tihar & Chhath',
    themeColor: 'purple',
    items: [
      buildOfferItem('sweet-potato-powder', {
        name: 'Sweet Potato Powder',
        weight: '100 GM',
        image: '/products/sweet-potato-powder-100g.jpg',
        price: 510,
      }),
      buildOfferItem('carrot-powder', {
        name: 'Carrot Powder',
        weight: '100 GM',
        image: '/products/carrot-powder-100g.jpg',
        price: 490,
      }),
      buildOfferItem('dates-powder', {
        name: 'Dates Powder',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      }),
    ],
    highlights: [
      '10% OFF Dashain Special + Free Delivery Over Rs. 3,000',
      'Gentle Whole-Food Powders from 6 months, Zero Cane Sugar',
      'Free Pink Salt (200g) on Orders Over Rs. 5,000+',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
];
