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
  themeColor?: 'gold' | 'emerald' | 'amber' | 'crimson' | 'purple' | 'red';
}

export const initialFestivalOffers: FestivalOffer[] = [
  {
    id: 'offer-festive-himalayan-wellness',
    title: 'Himalayan Festival Celebration & Wellness Box',
    subtitle: 'Sun-Dried Apples, Raw Mountain Almonds & Dates Powder Sweetener',
    festivalName: '🇳🇵 Himalayan Seasonal Celebration Edition',
    badge: '5% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Combo',
    discountPercentage: 5,
    originalPrice: 1408,
    offerPrice: 1338,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Festive Best Choice',
    themeColor: 'gold',
    items: [
      {
        productId: '3',
        name: 'Premium Dehydrated Apple (100 GM)',
        weight: '100 GM',
        image: '/products/dehydrated-apple.jpg',
        price: 408,
      },
      {
        productId: '18',
        name: 'Raw Almond (200 GM)',
        weight: '200 GM',
        image: '/products/almonds.jpg',
        price: 600,
      },
      {
        productId: '8',
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      },
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
    originalPrice: 1615,
    offerPrice: 1534,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Athletes #1 Pick',
    themeColor: 'emerald',
    items: [
      {
        productId: '14',
        name: 'Premium Cashewnut (250 GM)',
        weight: '250 GM',
        image: '/products/cashewnuts.jpg',
        price: 600,
      },
      {
        productId: '13',
        name: 'Pumpkin Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 520,
      },
      {
        productId: '12',
        name: 'Chia Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      },
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
    originalPrice: 1075,
    offerPrice: 1021,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Morning Ritual',
    themeColor: 'amber',
    items: [
      {
        productId: '8',
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      },
      {
        productId: '12',
        name: 'Chia Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/chia-seeds.jpg',
        price: 495,
      },
      {
        productId: '10',
        name: 'Himalayan Pink Salt (100 GM)',
        weight: '100 GM',
        image: '/products/pink-salt.jpg',
        price: 180,
      },
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
      {
        productId: '20',
        name: 'Mix Dry Nuts (300 GM)',
        weight: '300 GM',
        image: '/products/superfood-mix.jpg',
        price: 552,
      },
      {
        productId: '17',
        name: 'Roasted Almond (100 GM)',
        weight: '100 GM',
        image: '/products/almonds-2.jpg',
        price: 600,
      },
      {
        productId: '9',
        name: 'Beetroot Powder (100 GM)',
        weight: '100 GM',
        image: '/products/beetroot-powder-100g.jpg',
        price: 334,
      },
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
      {
        productId: '6',
        name: 'Dried Blueberries (100 GM)',
        weight: '100 GM',
        image: '/products/dried-blueberries-100g.jpg',
        price: 650,
      },
      {
        productId: '7',
        name: 'Dried Cranberry (100 GM)',
        weight: '100 GM',
        image: '/products/cranberries.jpg',
        price: 332,
      },
      {
        productId: '13',
        name: 'Pumpkin Seeds (300 GM)',
        weight: '300 GM',
        image: '/products/pumpkin-seeds.jpg',
        price: 520,
      },
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
    originalPrice: 1400,
    offerPrice: 1330,
    couponCode: 'STORE5 (Auto-Applied)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    endsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    tag: 'Pediatric Approved',
    themeColor: 'purple',
    items: [
      {
        productId: '25',
        name: 'Sweet Potato Powder (100 GM)',
        weight: '100 GM',
        image: '/products/sweet-potato-powder-100g.jpg',
        price: 510,
      },
      {
        productId: '24',
        name: 'Carrot Powder (100 GM)',
        weight: '100 GM',
        image: '/products/carrot-powder.jpg',
        price: 490,
      },
      {
        productId: '8',
        name: 'Dates Powder (100 GM)',
        weight: '100 GM',
        image: '/products/dates-powder-100g.jpg',
        price: 400,
      },
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
