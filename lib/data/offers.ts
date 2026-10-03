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
    id: 'offer-new-himalayan-superfoods',
    title: 'Himalayan Superfood Trio: Avocado, Strawberry & Almonds',
    subtitle: '100% Pure Freeze Dried Avocado, Pure Strawberry Powder & Roasted Himalayan Almonds',
    festivalName: '✨ Brand New Product Lineup 2026',
    badge: 'NEW LAUNCH · 10% OFF',
    categoryIcon: '🌿',
    categoryLabel: 'New Superfoods',
    discountPercentage: 10,
    customOfferPrice: 2640,
    couponCode: 'SUPERFOOD10',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Trending New Launch',
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
      'Authentic Product of Nepal 🇳🇵 Freeze-Dried Avocado',
      'Whole Real Strawberry Powder with Zero Added Sugar',
      'Crispy Roasted Mountain Almonds Rich in Vitamin E & Protein',
      'Reusable Airtight Glass Jars & Premium Foil Pouches',
    ],
    isFestival: true,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-festive-himalayan-wellness',
    title: 'Himalayan Festival Celebration & Wellness Box',
    subtitle: 'Sun-Dried Apples, Raw Mountain Almonds & Dates Powder Sweetener',
    festivalName: '🇳🇵 Himalayan Seasonal Celebration Edition',
    badge: '5% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Combo',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Festive Best Choice',
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
      '100% Preservative-Free Sacred Gifting',
      'Naturally Dehydrated Fruits & Mountain Raw Almonds',
      'Reusable Heavy Glass Jars with Free Festive Note',
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
    festivalName: '🏋️ Workout & Muscle Recovery Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Athletes #1 Pick',
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
      'High Plant Protein & Zinc for Muscle Repair',
      'Plant Omega-3 to Reduce Joint Inflammation',
      'Clean Pre/Post-Workout Nutrition (Zero Sugar)',
    ],
    isFestival: false,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-morning',
    title: 'Daily Morning Diet & Cleanse Kit',
    subtitle: 'Metabolism Kickstart with Dates Powder, Chia Seeds & Pink Salt',
    festivalName: '🌅 Morning Diet & Cleanse Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Morning Ritual',
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
      'Warm Water Morning Detox Electrolytes',
      'Gut Microbiome & Smooth Digestion Support',
      'Sustained Natural Energy Without Caffeine Spikes',
    ],
    isFestival: false,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-health',
    title: 'Maha Daily Health & Immunity Shield',
    subtitle: 'Mix Dry Nuts, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Total Health & Immunity Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Family Favorite',
    themeColor: 'gold',
    items: [
      buildOfferItem('superfood-trail-mix', {
        name: 'Mix Dry Nuts (300 GM)',
        weight: '300 GM',
        image: '/products/superfood-mix.jpg',
        price: 690,
      }),
      buildOfferItem('roasted-almonds', {
        name: 'Roasted Almonds (200 GM)',
        weight: '200 GM',
        image: '/products/roasted-almonds-v2.jpg',
        price: 750,
      }),
      buildOfferItem('beetroot-powder', {
        name: 'Beetroot Powder (100 GM)',
        weight: '100 GM',
        image: '/products/beetroot-powder-100g.jpg',
        price: 430,
      }),
    ],
    highlights: [
      'Full Daily Spectrum of Minerals & Vitamins',
      'Blood Flow, Stamina & Heart Health Support',
      'Handpicked Organic Sourcing from Nepal Co-ops',
    ],
    isFestival: false,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-focus',
    title: 'Brain Focus & Clean Energy Snack Box',
    subtitle: 'Dried Blueberries, Dried Cranberries & Pumpkin Seeds',
    festivalName: '⚡ Student & Work Focus Combo',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '⚡',
    categoryLabel: 'Focus & Study',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: 'Zero Crash Snacking',
    themeColor: 'crimson',
    items: [
      buildOfferItem('dried-blueberries', {
        name: 'Dried Blueberries (100 GM)',
        weight: '100 GM',
        image: '/products/dried-blueberries-100g.jpg',
        price: 650,
      }),
      buildOfferItem('dried-cranberries', {
        name: 'Dried Cranberries (100 GM)',
        weight: '100 GM',
        image: '/products/cranberries.jpg',
        price: 560,
      }),
      buildOfferItem('pumpkin-seeds', {
        name: 'Pumpkin Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 650,
      }),
    ],
    highlights: [
      'Anthocyanins for Neural Focus & Memory Recall',
      'Zinc & Magnesium for Neurotransmitter Balance',
      'Healthy Sweet-Tangy Replacement for Junk Candies',
    ],
    isFestival: false,
    isActive: true,
    isEvergreen: true,
  }),
  createBundleOffer({
    id: 'offer-babycare',
    title: 'Pure Infant & Toddler Superfood Starter',
    subtitle: 'Sweet Potato, Carrot & Dates Powders Pure Porridge Mix',
    festivalName: '👶 Baby & Toddler Nutrition Pack',
    badge: '5% OFF · Storewide Special',
    categoryIcon: '👶',
    categoryLabel: 'Baby Care',
    discountPercentage: 5,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    endsAt: '2026-12-31T23:59:59+05:45',
    tag: '100% Pure Whole Food',
    themeColor: 'purple',
    items: [
      buildOfferItem('sweet-potato-powder', {
        name: 'Sweet Potato Powder (100 GM)',
        weight: '100 GM',
        image: '/products/sweet-potato-powder-100g.jpg',
        price: 420,
      }),
      buildOfferItem('carrot-powder', {
        name: 'Carrot Powder (100 GM)',
        weight: '100 GM',
        image: '/products/carrot-powder-100g.jpg',
        price: 440,
      }),
      buildOfferItem('dates-powder', {
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      }),
    ],
    highlights: [
      'Gentle Whole-Food Powders for 6+ Month Weaning (Consult Pediatrician)',
      '100% Plant-Based Sweetness with Zero Cane Sugar',
      'Rich in Beta-Carotene Vitamin A & Dietary Fiber',
    ],
    isFestival: false,
    isActive: true,
    isEvergreen: true,
  }),
];
