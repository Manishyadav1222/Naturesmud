// scripts/rebuild-products-clean.js
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
const originalFile = fs.readFileSync(productsFilePath, 'utf8');

// Find where product id 22 ends (tags: ['moringa', ...])
const id22TagIndex = originalFile.indexOf("tags: ['moringa', 'powder', 'miracle-tree', 'immunity', 'green-superfood'],");
const endOf22 = originalFile.indexOf('},', id22TagIndex);
const baseProductsCode = originalFile.slice(0, endOf22 + 2);

const product23 = {
  id: '23',
  slug: 'barley-grass-powder',
  name: 'Organic Barley Grass Powder',
  category: 'Powders',
  categorySlug: 'powders',
  price: 380,
  compareAtPrice: 450,
  rating: 4.7,
  reviewCount: 28,
  image: '/products/sweet-potato-powder.jpg',
  images: [
    '/products/sweet-potato-powder.jpg',
    '/products/beetroot-powder.jpg',
  ],
  description: 'Tender young organic barley grass shoots harvested at nutritional peak, cold-dehydrated and micro-ground. Rich in chlorophyll and live enzymes for cellular detoxification and alkaline pH balance.',
  shortDescription: 'Chlorophyll-rich green powder for morning alkaline detox and cellular vitality.',
  badges: ['organic'],
  stock: 70,
  weight: '100g',
  ingredients: ['100% Pure Organic Young Barley Grass'],
  benefits: [
    'Rich in natural Chlorophyll to cleanse blood and tissues',
    'Helps maintain an alkaline bodily pH balance',
    'Natural digestive enzymes support nutrient absorption'
  ],
  nutrition: [
    { label: 'Calories', value: '240 kcal / 100g' },
    { label: 'Chlorophyll', value: '580mg / 100g' },
    { label: 'Dietary Fiber', value: '38g' },
    { label: 'Protein', value: '24g' }
  ],
  usage: 'Whisk 1 teaspoon into cold water, fresh lime juice, or green smoothies.',
  storage: 'Store in an airtight container protected from direct light.',
  isFeatured: false,
  isBestSeller: false,
  tags: ['barley-grass', 'powder', 'chlorophyll', 'alkaline', 'green-superfood'],
};

const newProducts = [
  product23,
  {
    id: '24',
    slug: 'pure-himalayan-black-salt-bire-noon',
    name: 'Pure Himalayan Black Salt (Bire Noon) (200g)',
    category: 'Salts & Spices',
    categorySlug: 'salts-spices',
    price: 150,
    compareAtPrice: 190,
    rating: 4.9,
    reviewCount: 38,
    image: '/products/himalayan-black-salt-digestive.jpg',
    images: [
      '/products/himalayan-black-salt-digestive.jpg',
      '/products/black-salt.jpg',
    ],
    description: "Authentic, mineral-dense Himalayan Black Salt (Bire Noon), mined from ancient salt ranges. Revered in Ayurvedic medicine for stimulating digestive agni, relieving gas, bloating, and heartburn while adding a distinct savory umami aroma to salads, chaats, and raitas.",
    shortDescription: "Authentic volcanic trace-mineral rock salt with distinctive digestive benefits.",
    badges: ['ayurvedic', 'organic'],
    stock: 120,
    weight: '200g',
    ingredients: ['100% Pure Himalayan Black Salt (Kala Namak / Bire Noon) with natural iron sulfides and trace minerals'],
    benefits: [
      'Stimulates digestive fire (Agni) and eases gastric discomfort',
      'Naturally lower sodium profile than industrial table salt',
      'Packed with active sulfur compounds and iron minerals',
      'Essential for authentic chaats, pickles, raitas, and Ayurvedic chaas'
    ],
    nutrition: [
      { label: 'Sodium Chloride', value: '88-92%' },
      { label: 'Iron & Sulfur Minerals', value: 'High Trace' },
      { label: 'Additives / Anti-caking Agents', value: '0%' },
    ],
    usage: 'Pinch into morning warm water, fresh fruit salads, buttermilk chaas, or homemade snacks.',
    storage: 'Store in an airtight glass jar in a dry pantry away from moisture.',
    isFeatured: true,
    isBestSeller: false,
    tags: ['black-salt', 'bire-noon', 'kala-namak', 'digestion', 'ayurveda', 'mineral-salt'],
  },
  {
    id: '25',
    slug: 'baby-first-weaning-superfood-trio',
    name: 'Baby First Weaning Superfood Trio Pack (3 x 100g)',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 999,
    compareAtPrice: 1250,
    rating: 5.0,
    reviewCount: 64,
    image: '/images/combos/baby-weaning-combo.jpg',
    images: [
      '/images/combos/baby-weaning-combo.jpg',
      '/products/sweet-potato-powder.jpg',
      '/products/dates-powder-100g.jpg',
      '/products/carrot-benefits-poster.jpg',
    ],
    description: "The complete pediatric nutrition bundle for babies starting solid foods (6M+). Contains 100% Organic Sweet Potato Powder (100g) for gut motility, Natural Dates Powder (100g) as an unrefined iron-rich sweetener, and Organic Carrot Powder (100g) for Pro-Vitamin A eye and immune support. Zero chemicals, zero preservatives, zero refined sugar.",
    shortDescription: "Organic Sweet Potato, Dates & Carrot Powders for healthy infant growth and brain development.",
    badges: ['bestseller', 'baby-safe', 'organic'],
    stock: 85,
    weight: '300g (3 x 100g)',
    ingredients: [
      '100% Organic Solar-Dehydrated Sweet Potato Powder (100g)',
      '100% Unrefined Dried Dates Powder (100g)',
      '100% Organic Dehydrated Mountain Carrot Powder (100g)'
    ],
    benefits: [
      'Easy 2-minute wholesome infant cereal and porridge preparation',
      'Provides natural non-heme iron, potassium, and Pro-Vitamin A beta carotene',
      '100% sugar-free healthy weaning for babies aged 6 months and beyond',
      'Supports healthy digestion and soft, regular bowel movements'
    ],
    nutrition: [
      { label: 'Pro-Vitamin A (Beta Carotene)', value: 'High' },
      { label: 'Iron & Potassium', value: '100% Natural Plant Source' },
      { label: 'Refined Sugar', value: '0g' },
      { label: 'Preservatives', value: '0%' }
    ],
    usage: 'Mix 1-2 tsp with warm boiled water, breast milk, ragi porridge, or khichdi.',
    storage: 'Keep jars tightly sealed in a cool, dry place. Reseal immediately after spooning.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['baby-food', 'weaning', 'sweet-potato', 'dates-powder', 'carrot-powder', 'combo', 'infant-nutrition'],
  },
  {
    id: '26',
    slug: 'athletic-stamina-nitric-oxide-duo',
    name: 'Athletic Stamina & Nitric Oxide Duo Pack',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 849,
    compareAtPrice: 1050,
    rating: 4.9,
    reviewCount: 51,
    image: '/images/combos/sports-nutrition-combo.jpg',
    images: [
      '/images/combos/sports-nutrition-combo.jpg',
      '/products/beetroot-poster-2k.jpg',
      '/products/chia-seeds.jpg',
    ],
    description: "Engineered for runners, gym athletes, trekkers, and fitness enthusiasts. Combines Pure Himalayan Beetroot Powder (100g) for dietary nitrates and vasodilation pump with Premium Black Chia Seeds (100g) for prolonged cellular hydration and complete plant Omega-3 fatty acids.",
    shortDescription: "Pre-workout beetroot nitric oxide pump + endurance hydration chia seeds.",
    badges: ['sports-performance', 'bestseller'],
    stock: 90,
    weight: '200g (2 x 100g)',
    ingredients: [
      '100% Pure Himalayan Beetroot Powder (100g)',
      '100% Premium Raw Black Chia Seeds (100g)'
    ],
    benefits: [
      'Increases blood flow and oxygen delivery to working muscles via nitric oxide',
      'Hydrophilic chia seeds retain 12x their weight in water for cellular hydration',
      'Natural stamina booster without artificial caffeine or pre-workout jitters',
      'Accelerates post-training muscle recovery and reduces oxidative soreness'
    ],
    nutrition: [
      { label: 'Dietary Nitrates', value: 'Concentrated Natural Source' },
      { label: 'Plant Omega-3 (ALA)', value: '5000mg per 28g Chia' },
      { label: 'Electrolytes & Potassium', value: 'Rich' },
    ],
    usage: 'Take 1 tsp Beetroot Powder + 1 tbsp Chia Seeds in 300ml cold water or juice 45 mins before workout.',
    storage: 'Store in a dry gym bag or pantry away from direct heat.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['fitness', 'pre-workout', 'beetroot', 'chia-seeds', 'endurance', 'combo', 'nitric-oxide'],
  },
  {
    id: '27',
    slug: 'womens-vitality-hormone-balance-pack',
    name: "Women's Vitality & Hormone Balance Pack (3 x 100g)",
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
    description: "Specially formulated for women navigating PCOS, menstrual health, and maternal recovery. Includes Golden Flax Seeds (100g) for plant lignans and estrogen modulation, Himalayan Pumpkin Seeds (100g) for zinc and progesterone support, and Whole Dried Cranberries (100g) for urinary tract protection.",
    shortDescription: "Targeted women's health pack: Flax Seeds, Pumpkin Seeds & Whole Dried Cranberries.",
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
    description: "The flagship Nature's Mud grand wellness bundle. Features our 5 most celebrated products: Sweet Potato Powder (100g), Dates Powder (100g), Wild Dried Himalayan Blueberries (100g), Whole Dried Cranberries (100g), and Himalayan Pumpkin Seeds (100g).",
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
      'Comprehensive whole-family daily superfood nutrition',
      'Saves over 20% compared to purchasing individual jars',
      'Ideal gift for mindful parents, athletes, and wellness seekers',
      '100% natural, unrefined, and sustainably harvested'
    ],
    nutrition: [
      { label: 'Antioxidants', value: 'Extreme High' },
      { label: 'Clean Micronutrients', value: 'Full Spectrum' },
      { label: 'Preservatives / Chemicals', value: '0%' },
    ],
    usage: 'Use across morning smoothies, breakfast bowls, baking, and healthy snacking.',
    storage: 'Store jars in a cool, dry place away from moisture.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['combo', 'grand-pack', 'superfoods', 'family-pack', 'blueberries', 'cranberries', 'sweet-potato'],
  },
  {
    id: '29',
    slug: 'pure-mountain-himalayan-shilajit-resin',
    name: 'Pure Mountain Himalayan Shilajit Resin (Gold Grade 20g)',
    category: 'Ayurvedic Herb',
    categorySlug: 'ayurveda',
    price: 1650,
    compareAtPrice: 2100,
    rating: 5.0,
    reviewCount: 114,
    image: '/products/shilajit.jpg',
    images: [
      '/products/shilajit.jpg',
    ],
    description: "Gold-grade 100% pure Himalayan Shilajit resin, sustainably harvested from pristine Himalayan altitudes above 16,000 feet. Purified using traditional Ayurvedic triphala water decoction. Naturally concentrated with >75% fulvic acid and 84+ ionic trace minerals to support cellular mitochondrial energy, stamina, cognitive clarity, and vitality.",
    shortDescription: 'Authentic gold-grade Himalayan Shilajit resin with >75% fulvic acid for peak vitality.',
    badges: ['ayurvedic', 'superfood', 'bestseller'],
    stock: 50,
    weight: '20g Glass Jar',
    ingredients: ['100% Pure Purified Himalayan Shilajit Resin (Gold Grade, >75% Fulvic Acid)'],
    benefits: [
      'Boosts cellular ATP energy and mitochondrial oxygenation',
      'Supports healthy testosterone levels and reproductive stamina in men and women',
      'Enhances cognitive memory, focus, and neuroprotective resilience',
      'Contains 84+ bioavailable ionic trace minerals for deep cellular nourishment'
    ],
    nutrition: [
      { label: 'Fulvic Acid', value: '>75%' },
      { label: 'Ionic Trace Minerals', value: '84+' },
      { label: 'Heavy Metal Tested', value: 'Safety Certified' }
    ],
    usage: 'Dissolve a pea-sized portion (300-500mg) in warm water, milk, or green tea once daily in the morning.',
    storage: 'Store in a cool dry place. Keep jar tightly closed to avoid drying out.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['shilajit', 'ayurveda', 'fulvic-acid', 'vitality', 'energy', 'rasayana', 'himalayan'],
  }
];

let code = baseProductsCode + '\n';

newProducts.forEach((p) => {
  code += `  {
    id: ${JSON.stringify(p.id)},
    slug: ${JSON.stringify(p.slug)},
    name: ${JSON.stringify(p.name)},
    category: ${JSON.stringify(p.category)},
    categorySlug: ${JSON.stringify(p.categorySlug)},
    price: ${p.price},
    compareAtPrice: ${p.compareAtPrice},
    rating: ${p.rating},
    reviewCount: ${p.reviewCount},
    image: ${JSON.stringify(p.image)},
    images: ${JSON.stringify(p.images, null, 6).replace(/\n\s*\]/, '\n    ]')},
    description: ${JSON.stringify(p.description)},
    shortDescription: ${JSON.stringify(p.shortDescription)},
    badges: ${JSON.stringify(p.badges)},
    stock: ${p.stock},
    weight: ${JSON.stringify(p.weight)},
    ingredients: ${JSON.stringify(p.ingredients, null, 6).replace(/\n\s*\]/, '\n    ]')},
    benefits: ${JSON.stringify(p.benefits, null, 6).replace(/\n\s*\]/, '\n    ]')},
    nutrition: ${JSON.stringify(p.nutrition, null, 6).replace(/\n\s*\]/, '\n    ]')},
    usage: ${JSON.stringify(p.usage)},
    storage: ${JSON.stringify(p.storage)},
    isFeatured: ${Boolean(p.isFeatured)},
    isBestSeller: ${Boolean(p.isBestSeller)},
    tags: ${JSON.stringify(p.tags)},
  },\n`;
});

code += '];\n';

fs.writeFileSync(productsFilePath, code, 'utf8');
console.log('Rebuilt products.ts cleanly with all 29 products!');
