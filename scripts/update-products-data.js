const fs = require('fs');
const path = require('path');

// 1. Read existing products
const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
let fileContent = fs.readFileSync(productsFilePath, 'utf8').replace(/\r\n/g, '\n');

const marker = 'export const products: Product[] = ';
const startIdx = fileContent.indexOf(marker) + marker.length;
const endIdx = fileContent.indexOf('export function');
const jsonText = fileContent.substring(startIdx, endIdx).trim().replace(/;$/, '');
let products = JSON.parse(jsonText);

console.log('Original product count:', products.length);

// 2. Filter out dried-figs
products = products.filter(p => p.slug !== 'dried-figs' && p.id !== '160');
console.log('Product count after removing dried-figs:', products.length);

// 3. Define the exact, authentic product mappings
const productFixes = {
  'chia-seeds': {
    name: 'Organic Chia Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 495,
    compareAtPrice: 495,
    mrp: 495,
    image: '/products/chia-seeds.jpg',
    images: [
      '/products/chia-seeds.jpg',
      '/images/posters/chia-power.jpg'
    ],
    weight: '300 GM',
    packing: 'Plastic Jar',
    shortDescription: 'Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein in a 300g Plastic Jar.'
  },
  'raw-himalayan-almonds': {
    name: 'Raw Himalayan Almonds',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 750,
    compareAtPrice: 750,
    mrp: 750,
    image: '/products/authentic-almonds.jpg',
    images: [
      '/products/authentic-almonds.jpg',
      '/products/almonds.jpg',
      '/products/almonds-2.jpg'
    ],
    weight: '200 GM',
    packing: 'Glass Jar',
    shortDescription: 'Raw unpasteurized mountain almonds for morning soaking and brain memory fuel in a 200g Glass Jar.'
  },
  'roasted-almonds': {
    name: 'Roasted Himalayan Almonds',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 750,
    compareAtPrice: 750,
    mrp: 750,
    image: '/products/almonds-2.jpg',
    images: [
      '/products/almonds-2.jpg',
      '/products/authentic-almonds.jpg',
      '/products/almonds.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 100g Glass Jar.'
  },
  'roasted-cashewnuts': {
    name: 'Roasted Himalayan Cashew Nuts',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 750,
    compareAtPrice: 750,
    mrp: 750,
    image: '/products/authentic-cashewnuts-roasted.jpg',
    images: [
      '/products/authentic-cashewnuts-roasted.jpg',
      '/products/cashewnuts-roasted.jpg',
      '/products/cashews-roasted.jpg'
    ],
    weight: '150 GM',
    packing: 'Glass Jar',
    shortDescription: 'Dry-roasted crunchy cashews packed with minerals and natural savory flavor in a 150g Glass Jar.'
  },
  'premium-cashewnuts': {
    name: 'Premium Cashew Nuts',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 750,
    compareAtPrice: 750,
    mrp: 750,
    image: '/products/authentic-cashewnuts-roasted.jpg',
    images: [
      '/products/authentic-cashewnuts-roasted.jpg',
      '/products/cashewnuts-roasted.jpg'
    ],
    weight: '200 GM',
    packing: 'Glass Jar',
    shortDescription: 'Jumbo whole grade cashewnuts with a rich buttery crunch and heart-healthy fats in a 200g Glass Jar.'
  },
  'himalayan-pink-salt': {
    name: 'Himalayan Pink Salt',
    category: 'Salts & Spices',
    categorySlug: 'salts-spices',
    price: 180,
    compareAtPrice: 180,
    mrp: 180,
    image: '/products/pink-salt.jpg',
    images: [
      '/products/pink-salt.jpg',
      '/products/client-authentic-label-1.jpg',
      '/products/pink-salt-crystals.jpg',
      '/products/pink-salt-moss.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a Glass Jar.'
  },
  'pure-himalayan-black-salt-bire-noon': {
    name: 'Himalayan Black Salt (Bire Noon)',
    category: 'Salts & Spices',
    categorySlug: 'salts-spices',
    price: 195,
    compareAtPrice: 195,
    mrp: 195,
    image: '/products/himalayan-black-salt-digestive.jpg',
    images: [
      '/products/himalayan-black-salt-digestive.jpg',
      '/products/client-authentic-label-2.jpg',
      '/products/black-salt.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Volcanic sulfur-rich Himalayan black salt for Ayurvedic digestion and gut wellness in a 100g Glass Jar.'
  },
  'dried-cranberries': {
    name: 'Dried Cranberries',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 415,
    compareAtPrice: 415,
    mrp: 415,
    image: '/products/cranberries.jpg',
    images: [
      '/products/cranberries.jpg',
      '/products/cranberries-2.jpg',
      '/products/cranberries-glowing-jar.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Antioxidant-dense whole dried cranberries for urinary tract and cellular wellness in a Glass Jar.'
  },
  'dried-blueberries': {
    name: 'Dried Blueberries',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 650,
    compareAtPrice: 650,
    mrp: 650,
    image: '/products/dried-blueberries-100g.jpg',
    images: [
      '/products/dried-blueberries-100g.jpg',
      '/products/blueberries.jpg',
      '/products/blueberries-2.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Wild alpine anthocyanin berries for brain focus, memory & screen-fatigue eye defense in a Glass Jar.'
  },
  'pumpkin-seeds': {
    name: 'Raw Pumpkin Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 520,
    compareAtPrice: 520,
    mrp: 520,
    image: '/products/pumpkin-seeds.jpg',
    images: [
      '/products/pumpkin-seeds.jpg',
      '/products/pumpkin-seeds-2.jpg',
      '/products/pumpkin-seeds-product-shot.jpg'
    ],
    weight: '300 GM',
    packing: 'Plastic Jar',
    shortDescription: 'Zinc, magnesium, and tryptophan rich raw pumpkin seeds for prostate wellness, deep sleep, and hair vitality in a 300g Plastic Jar.'
  },
  'dates-powder': {
    name: 'Dates Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 350,
    compareAtPrice: 350,
    mrp: 350,
    image: '/products/dates-powder-100g.jpg',
    images: [
      '/products/dates-powder-100g.jpg',
      '/products/dates-powder.jpg',
      '/products/dates-powder-product-shot.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: '100% unrefined natural sweetener made from whole dehydrated dates — 0% white sugar in a Glass Jar.'
  },
  'beetroot-powder': {
    name: 'Beetroot Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 430,
    compareAtPrice: 430,
    mrp: 430,
    image: '/products/beetroot-powder-100g.jpg',
    images: [
      '/products/beetroot-powder-100g.jpg',
      '/products/beetroot-glass-jar.jpg',
      '/products/beetroot-powder.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Natural dietary nitrate booster for glowing skin, blood stamina & cardiac health in a Glass Jar.'
  },
  'carrot-powder': {
    name: 'Carrot Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 440,
    compareAtPrice: 440,
    mrp: 440,
    image: '/products/carrot-powder-marble.jpg',
    images: [
      '/products/carrot-powder-marble.jpg',
      '/products/carrot-powder.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: 'Fine organic carrot powder rich in beta-carotene for infant feeding and healthy soups in a 100g Glass Jar.'
  },
  'sweet-potato-powder': {
    name: 'Sweet Potato Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 420,
    compareAtPrice: 420,
    mrp: 420,
    image: '/products/sweet-potato-powder-100g.jpg',
    images: [
      '/products/sweet-potato-powder-100g.jpg',
      '/products/sweet-potato-powder.jpg',
      '/products/sweet-potato-jar-display.jpg'
    ],
    weight: '100 GM',
    packing: 'Glass Jar',
    shortDescription: '100% natural dehydrated sweet potato powder for baby food, smoothies & healthy baking in a 100g Glass Jar.'
  },
  'dehydrated-mango': {
    name: 'Dehydrated Mango',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 395,
    compareAtPrice: 395,
    mrp: 395,
    image: '/products/authentic-dehydrated-mango.jpg',
    images: [
      '/products/authentic-dehydrated-mango.jpg',
      '/products/dehydrated-mango.jpg',
      '/products/mango.jpg'
    ],
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    shortDescription: 'Pure naturally dried sweet mango slices with 0 additives and 0 preservatives in a Standup Ziplock Pouch.'
  },
  'dehydrated-pineapple': {
    name: 'Dehydrated Pineapple',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 495,
    compareAtPrice: 495,
    mrp: 495,
    image: '/products/authentic-dehydrated-pineapple.jpg',
    images: [
      '/products/authentic-dehydrated-pineapple.jpg',
      '/products/dehydrated-pineapple.jpg',
      '/products/pineapple.jpg'
    ],
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    shortDescription: 'Tangy-sweet dehydrated pineapple rings rich in natural bromelain enzyme in a Standup Ziplock Pouch.'
  },
  'dehydrated-apple': {
    name: 'Dehydrated Apple',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 510,
    compareAtPrice: 510,
    mrp: 510,
    image: '/products/authentic-dehydrated-apple.jpg',
    images: [
      '/products/authentic-dehydrated-apple.jpg',
      '/products/dehydrated-apple.jpg',
      '/products/apple.jpg'
    ],
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    shortDescription: 'Pectin-rich crispy dehydrated apple rings with zero added sugar in a Standup Ziplock Pouch.'
  },
  'dehydrated-coconut-chips': {
    name: 'Dehydrated Coconut Chips',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 495,
    compareAtPrice: 495,
    mrp: 495,
    image: '/products/dehydrated-coconut-chips.jpg',
    images: [
      '/products/dehydrated-coconut-chips.jpg'
    ],
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    shortDescription: 'Crunchy dehydrated coconut flakes rich in clean MCT healthy fats in a Standup Ziplock Pouch.'
  },
  'dehydrated-papaya': {
    name: 'Dehydrated Papaya',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 395,
    compareAtPrice: 395,
    mrp: 395,
    image: '/products/papaya.jpg',
    images: [
      '/products/papaya.jpg',
      '/products/papaya-2.jpg'
    ],
    weight: '100 GM',
    packing: 'Standup Ziplock Pouch',
    shortDescription: 'Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking in a Standup Ziplock Pouch.'
  },
  'premium-pistachios': {
    name: 'Premium Roasted Pistachios',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 820,
    compareAtPrice: 820,
    mrp: 820,
    image: '/products/pistachios.jpg',
    images: [
      '/products/pistachios.jpg'
    ],
    weight: '200 GM',
    packing: 'Glass Jar',
    shortDescription: 'Lightly roasted mountain pistachios rich in lutein, zeaxanthin, and plant protein in a 200g Glass Jar.'
  },
  'macadamia-nuts': {
    name: 'Macadamia Nuts',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 1100,
    compareAtPrice: 1100,
    mrp: 1100,
    image: '/products/macadamia.jpg',
    images: [
      '/products/macadamia.jpg'
    ],
    weight: '200 GM',
    packing: 'Glass Jar',
    shortDescription: 'Silky buttery macadamia nuts packed with monounsaturated palmitoleic acid in a 200g Glass Jar.'
  },
  'superfood-trail-mix': {
    name: 'Superfood Trail Mix (Nuts & Seeds)',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 790,
    compareAtPrice: 790,
    mrp: 790,
    image: '/products/superfood-mix.jpg',
    images: [
      '/products/superfood-mix.jpg',
      '/products/superfood-mix-2.jpg'
    ],
    weight: '200 GM',
    packing: 'Glass Jar',
    shortDescription: 'Energy-dense blend of whole almonds, cashews, pumpkin seeds, berries, and chia in a 200g Glass Jar.'
  },
  'virgin-coconut-oil-500ml': {
    name: 'Cold-Pressed Extra Virgin Coconut Oil (500ml)',
    category: 'Oils',
    categorySlug: 'oils',
    price: 850,
    compareAtPrice: 850,
    mrp: 850,
    image: '/products/coconut-oil.jpg',
    images: [
      '/products/coconut-oil.jpg',
      '/products/coconut-oil-product.jpg'
    ],
    weight: '500 ML',
    packing: 'Glass Bottle',
    shortDescription: 'Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 500ml Glass Bottle.'
  },
  'virgin-coconut-oil-180ml': {
    name: 'Cold-Pressed Extra Virgin Coconut Oil (180ml)',
    category: 'Oils',
    categorySlug: 'oils',
    price: 420,
    compareAtPrice: 420,
    mrp: 420,
    image: '/products/coconut-oil-product.jpg',
    images: [
      '/products/coconut-oil-product.jpg',
      '/products/coconut-oil.jpg'
    ],
    weight: '180 ML',
    packing: 'Glass Bottle',
    shortDescription: 'Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 180ml Glass Bottle.'
  }
};

// Apply fixes to all products
products = products.map(p => {
  if (productFixes[p.slug]) {
    const fix = productFixes[p.slug];
    return {
      ...p,
      ...fix
    };
  }
  return p;
});

// Re-write products.ts
const updatedJson = JSON.stringify(products, null, 2);
const newFileContent = fileContent.substring(0, startIdx) + updatedJson + ';\n\n' + fileContent.substring(endIdx);
fs.writeFileSync(productsFilePath, newFileContent, 'utf8');

console.log('Successfully updated lib/data/products.ts! Products count:', products.length);
