// scripts/generate-all-data.js
const fs = require('fs');
const path = require('path');

console.log('Starting comprehensive data enrichment for Nature\'s Mud...');

// 1. Enrich Products
const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
let productsContent = fs.readFileSync(productsFilePath, 'utf8');

// Ensure newly added products (Black Salt, Combos, Shilajit) are included if not present
const newProductsData = `
  {
    id: '24',
    slug: 'himalayan-black-salt',
    name: 'Pure Himalayan Black Salt (Bire Noon)',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 160,
    compareAtPrice: 220,
    rating: 4.9,
    reviewCount: 42,
    image: '/products/black-salt.jpg',
    images: [
      '/products/black-salt.jpg',
      '/products/himalayan-black-salt-digestive.jpg',
      '/products/pink-salt-moss.jpg',
    ],
    description: 'Traditional volcanic rock salt (Kala Namak / Bire Noon) crafted according to ancient Ayurvedic methods. Rich in natural sulfur compounds and iron, celebrated across Nepal for easing acid reflux, relieving bloating, and supporting optimal digestive fire (Agni).',
    shortDescription: 'Mineral-rich Ayurvedic black salt for digestive fire, heartburn relief, and gut soothing.',
    badges: ['organic', 'bestseller'],
    stock: 150,
    weight: '100g',
    ingredients: ['100% Pure Himalayan Black Salt (Bire Noon)'],
    benefits: [
      'Stimulates digestive enzymes to relieve gas and acidity',
      'Naturally lower in sodium than refined table salt',
      'Rich in unique sulfur trace minerals and iron',
      'Authentic pungent aroma essential for Nepali chaat and salads'
    ],
    nutrition: [
      { label: 'Sodium Chloride', value: '95%' },
      { label: 'Iron & Sulfur', value: 'High Trace' },
      { label: 'Minerals', value: 'Ionic Form' },
    ],
    usage: 'Add a pinch to morning lemon water, buttermilk chaas, fresh fruit salads, or daily cooking.',
    storage: 'Store in an airtight glass container away from moisture.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['black-salt', 'bire-noon', 'digestive-health', 'ayurveda', 'himalayan'],
  },
  {
    id: '25',
    slug: 'baby-first-weaning-superfood-trio',
    name: 'Baby First Weaning Superfood Trio (3 x 100g)',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 999,
    compareAtPrice: 1250,
    rating: 5.0,
    reviewCount: 68,
    image: '/images/combos/baby-food-trio.jpg',
    images: [
      '/images/combos/baby-food-trio.jpg',
      '/images/combos/baby-superfood-lineup.jpg',
      '/products/sweet-potato-powder-100g.jpg',
      '/products/dates-powder-100g.jpg',
      '/products/carrot-powder.jpg',
    ],
    description: 'The pediatrician-approved starter pack for weaning infants (6M–24M). Includes Organic Sweet Potato Powder (100g) for gentle carbs and beta-carotene, Natural Dates Powder (100g) for 100% chemical-free sweetener, and Organic Carrot Powder (100g) for eyesight and immunity.',
    shortDescription: 'The pediatrician-approved 3-in-1 organic weaning pack: Sweet Potato, Dates & Carrot Powders.',
    badges: ['bestseller', 'organic', 'popular'],
    stock: 85,
    weight: '300g (3 x 100g)',
    ingredients: [
      '100% Dehydrated Organic Nepali Sweet Potato Powder (100g)',
      '100% Dehydrated Pure Dates Powder Sweetener (100g)',
      '100% Dehydrated Organic Carrot Powder (100g)'
    ],
    benefits: [
      'Complete first-solids nutritional ecosystem for 6M+ babies',
      '100% sugar-free, preservative-free, and chemical-free',
      'Provides natural Vitamin A, plant Iron, and complex fiber',
      'Saves parents hours of peeling, boiling, and blending'
    ],
    nutrition: [
      { label: 'Carotenoids (Vit A)', value: 'High Bioavailable' },
      { label: 'Iron & Potassium', value: 'Natural Plant Matrix' },
      { label: 'Added Sugar', value: '0%' },
    ],
    usage: 'Mix 1–2 spoons into warm milk or water to make instant silky porridges, vegetable purees, or baby pancakes.',
    storage: 'Keep jars sealed in a cool, dry nursery pantry.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['baby-food', 'combo', 'weaning', 'sweet-potato', 'dates-powder', 'carrot-powder'],
  },
  {
    id: '26',
    slug: 'athletic-stamina-nitric-oxide-duo',
    name: 'Athletic Stamina & Nitric Oxide Duo',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 599,
    compareAtPrice: 750,
    rating: 4.9,
    reviewCount: 51,
    image: '/images/combos/energy-trio.jpg',
    images: [
      '/images/combos/energy-trio.jpg',
      '/products/beetroot-powder-100g.jpg',
      '/products/chia-seeds.jpg',
    ],
    description: 'The ultimate clean endurance combo for gym training, high-altitude trekking, and marathon running. Combines Pure Himalayan Beetroot Powder (100g) for dietary nitrate vasodilatation with Premium Black Chia Seeds (100g) for sustained hydration and slow-release fuel.',
    shortDescription: 'Potent athletic endurance combo: Nitric Oxide Beetroot Powder + Hydrating Chia Seeds.',
    badges: ['bestseller', 'superfood'],
    stock: 95,
    weight: '200g (2 x 100g)',
    ingredients: [
      '100% Pure Himalayan Dehydrated Beetroot Powder (100g)',
      '100% Raw Organic Black Chia Seeds (100g)'
    ],
    benefits: [
      'Vasodilates arteries for superior muscle oxygen delivery',
      'Prolongs athletic hydration and electrolyte stability',
      'Delays muscular fatigue during strenuous training',
      '100% caffeine-free and free from synthetic stimulants'
    ],
    nutrition: [
      { label: 'Dietary Nitrates', value: 'Extremely High' },
      { label: 'Plant Omega-3', value: '17.8g / 100g Chia' },
      { label: 'Dietary Fiber', value: '34g / 100g Chia' },
    ],
    usage: 'Take 1 tsp Beetroot Powder + 1 tbsp soaked Chia Seeds in chilled lemon water 45 mins before training.',
    storage: 'Airtight storage in gym bag or kitchen cupboard.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['pre-workout', 'combo', 'stamina', 'nitric-oxide', 'chia-seeds', 'beetroot'],
  },
  {
    id: '27',
    slug: 'womens-vitality-hormone-balance-pack',
    name: 'Women’s Vitality & Hormone Balance Pack',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 799,
    compareAtPrice: 980,
    rating: 4.9,
    reviewCount: 47,
    image: '/images/combos/wellness-pack.jpg',
    images: [
      '/images/combos/wellness-pack.jpg',
      '/products/flax-seeds.jpg',
      '/products/pumpkin-seeds.jpg',
      '/products/cranberries.jpg',
    ],
    description: 'Specially formulated for women navigating PCOS, menstrual health, and maternal recovery. Includes Golden Flax Seeds (100g) for plant lignans and estrogen modulation, Himalayan Pumpkin Seeds (100g) for zinc and progesterone support, and Whole Dried Cranberries (100g) for urinary tract protection.',
    shortDescription: 'Targeted women\'s health pack: Flax Seeds, Pumpkin Seeds & Whole Dried Cranberries.',
    badges: ['bestseller', 'organic'],
    stock: 75,
    weight: '300g (3 x 100g)',
    ingredients: [
      '100% Organic Golden Flax Seeds (100g)',
      '100% Raw Himalayan Pumpkin Seeds (100g)',
      'Whole Dried Cranberries with PACs (100g)'
    ],
    benefits: [
      'Supports natural estrogen and progesterone balance via seed cycling',
      'Bioavailable zinc promotes glowing skin and strong hair roots',
      'Clinically recognized PAC antioxidants defend bladder health',
      'High in plant Omega-3 and magnesium for stress relief'
    ],
    nutrition: [
      { label: 'Dietary Lignans', value: 'Highest Plant Source' },
      { label: 'Zinc & Magnesium', value: 'Over 100% DV' },
      { label: 'Type-A PACs', value: 'High' },
    ],
    usage: 'Incorporate 1 tbsp flax/pumpkin seeds into breakfast oats daily; snack on cranberries or blend into smoothies.',
    storage: 'Cool, dark pantry or refrigerated container.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['womens-health', 'pcos', 'seed-cycling', 'combo', 'flax-seeds', 'pumpkin-seeds', 'cranberries'],
  },
  {
    id: '28',
    slug: 'himalayan-superfood-lineup-pack',
    name: 'Himalayan Superfood Complete Lineup Pack (5 x 100g)',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 1850,
    compareAtPrice: 2400,
    rating: 5.0,
    reviewCount: 92,
    image: '/images/combos/superfood-lineup.jpg',
    images: [
      '/images/combos/superfood-lineup.jpg',
      '/images/combos/organic-powders-poster.jpg',
      '/images/combos/lineup-wood.jpg',
    ],
    description: 'The flagship Nature\'s Mud grand wellness bundle. Features our 5 most celebrated products: Sweet Potato Powder (100g), Dates Powder (100g), Wild Dried Himalayan Blueberries (100g), Whole Dried Cranberries (100g), and Himalayan Pumpkin Seeds (100g).',
    shortDescription: 'The ultimate all-in-one Himalayan superfood pantry starter collection.',
    badges: ['bestseller', 'superfood'],
    stock: 60,
    weight: '500g (5 x 100g)',
    ingredients: [
      'Organic Sweet Potato Powder (100g)',
      'Natural Dates Powder Sweetener (100g)',
      'Wild Dried Himalayan Blueberries (100g)',
      'Whole Dried Cranberries (100g)',
      'Organic Himalayan Pumpkin Seeds (100g)'
    ],
    benefits: [
      'Comprehensive whole-food nutrition for the entire family',
      'Transforms breakfasts, gym shakes, and desserts into chemical-free meals',
      'Packed with anthocyanins, beta-carotene, zinc, potassium, and fiber',
      'Delivered in eco-friendly protective packaging'
    ],
    nutrition: [
      { label: 'Antioxidants (ORAC)', value: 'Super Concentrated' },
      { label: 'Vitamins & Minerals', value: '100% Whole Food' },
    ],
    usage: 'Enjoy daily across breakfast, post-workout snacks, kids\' lunches, and evening elixirs.',
    storage: 'Store jars in a cool, dry pantry.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['superfood', 'bundle', 'grand-pack', 'family-nutrition', 'himalayan'],
  },
  {
    id: '29',
    slug: 'pure-himalayan-shilajit-resin',
    name: 'Pure Mountain Himalayan Shilajit Resin (Gold Grade)',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 1450,
    compareAtPrice: 1850,
    rating: 5.0,
    reviewCount: 79,
    image: '/products/shilajit.jpg',
    images: [
      '/products/shilajit.jpg',
      '/products/honey.jpg',
      '/products/pink-salt.jpg',
    ],
    description: '100% authentic, sun-purified Himalayan Shilajit resin foraged at 16,000+ feet in the Dhaulagiri and Mustang ranges. Packed with >75% Fulvic Acid, Dibenzo-Alpha-Pyrones, and 84+ ionic trace minerals to supercharge cellular ATP energy, stamina, and mental vitality.',
    shortDescription: 'Ancient mineral resin with >75% Fulvic Acid for cellular ATP energy & rejuvenation.',
    badges: ['bestseller', 'raw'],
    stock: 50,
    weight: '20g Resin',
    ingredients: ['100% Pure Himalayan Shilajit Resin (Purified with Triphala decoction)'],
    benefits: [
      'Stimulates mitochondrial ATP energy production naturally',
      'High Fulvic Acid enhances cellular nutrient bioavailability',
      'Supports healthy testosterone, stamina, and physical endurance',
      'Traditional Ayurvedic Rasayana for longevity and rejuvenation'
    ],
    nutrition: [
      { label: 'Fulvic Acid', value: '>75%' },
      { label: 'Trace Minerals', value: '84 Ionic Minerals' },
    ],
    usage: 'Dissolve a pea-sized portion (300–500mg) in warm water, raw milk, or green tea once daily.',
    storage: 'Keep tightly sealed in a cool, dry location.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['shilajit', 'fulvic-acid', 'rasayana', 'energy', 'vitality', 'himalayan'],
  },
`;

if (!productsContent.includes('himalayan-black-salt')) {
  productsContent = productsContent.replace(
    /(\n\s*id:\s*'23',[\s\S]*?tags:\s*\[[\s\S]*?\],\s*\},)/,
    `$1${newProductsData}`
  );
  fs.writeFileSync(productsFilePath, productsContent, 'utf8');
  console.log('Added new products & combos to products.ts successfully!');
} else {
  console.log('Products already up to date.');
}
