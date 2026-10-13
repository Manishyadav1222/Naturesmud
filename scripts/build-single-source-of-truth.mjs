/**
 * build-single-source-of-truth.mjs
 * Generates products.json and synchronizes lib/data/products.ts
 * Implements Phase 1 Pack-size, Pricing, Provenance & Compliance Standardization
 */
import fs from 'fs';
import path from 'path';

const raw = JSON.parse(fs.readFileSync('scratch/parsed_prods.json', 'utf8'));

// Standardized origin belts per factory & agricultural geography
const ORIGIN_MAP = {
  'banana-powder': { belt: 'Terai Lowlands (Chitwan & Nawalpur)', process: 'Closed Sanitary Dehydration Chamber (<45°C)' },
  'moringa-leaf-powder': { belt: 'Terai Lowlands & River Belts (Product of Nepal 🇳🇵)', process: 'Shade-Dried & Cold-Milled (<40°C)' },
  'freeze-dried-avocado-powder': { belt: 'Mid-Hills & Product of Nepal 🇳🇵', process: 'Vacuum Freeze-Dried (Lyophilization)' },
  'strawberry-powder': { belt: 'Mid-Hills Berry Orchards (Kakani & Nuwakot)', process: 'Vacuum Freeze-Dried (Lyophilization)' },
  'dry-figs-anjeer': { belt: 'Selected Single-Origin Sun-Dried Fruits', process: 'Naturally Sun-Dried & Washed' },
  'makhana-fox-nuts': { belt: 'Terai Wetland Harvesting (Mithila / Madhesh)', process: 'Traditional Roasting & Gentle Popping' },
  'dehydrated-mango': { belt: 'Terai Lowlands (Saptari & Siraha Orchards)', process: 'Low-Temperature Closed Chamber (<45°C)' },
  'dehydrated-pineapple': { belt: 'Eastern Mid-Hills & Terai (Product of Nepal 🇳🇵)', process: 'Low-Temperature Closed Chamber (<45°C)' },
  'dehydrated-apple': { belt: 'Himalayan Mountain Valleys (Mustang & Jumla)', process: 'Solar Chamber Dehydration' },
  'dehydrated-coconut-chips': { belt: 'Single-Origin Natural Dried Coconut', process: 'Slow Dehydration (<45°C)' },
  'dehydrated-papaya': { belt: 'Terai Lowlands (Chitwan & Nawalpur)', process: 'Low-Temperature Closed Chamber (<42°C)' },
  'dried-blueberries': { belt: 'Selected Premium Whole Berries', process: 'Gentle Dehydration' },
  'dried-cranberries': { belt: 'Selected Premium Whole Berries', process: 'Gentle Dehydration' },
  'dates-powder': { belt: 'Single-Origin Pitted Dry Dates', process: 'Dehydrated & Cold-Milled (<40°C)' },
  'beetroot-powder': { belt: 'Mid-Hills & Kathmandu Valley Belt (Product of Nepal 🇳🇵)', process: 'Low-Temperature Dehydration & Fine Cold Milling' },
  'himalayan-pink-salt': { belt: 'Himalayan Mineral Foothills', process: 'Traditional Rock Crushing & Sifting' },
  'pure-himalayan-black-salt-bire-noon': { belt: 'Himalayan Mineral Belt / Ayurvedic Kiln-Prepared', process: 'Traditional Ayurvedic Calcination with Harro/Barro' },
  'chia-seeds': { belt: 'High-Altitude Adapted Crops (Product of Nepal 🇳🇵)', process: 'Cleaned, Winnowed & Triple-Sifted' },
  'pumpkin-seeds': { belt: 'Selected Premium Whole Squash Seeds', process: 'Hulled, Washed & Gently Dried' },
  'premium-cashewnuts': { belt: 'Selected Jumbo Whole Kernels (W320/W240 Grade)', process: 'Raw, Unsalted & Unroasted' },
  'roasted-cashewnuts': { belt: 'Selected Jumbo Whole Kernels', process: 'Gentle Dry-Roasted & Lightly Salted' },
  'roasted-almonds': { belt: 'Selected California/Mountain Kernels', process: 'Gentle Dry-Roasted & Lightly Salted' },
  'raw-himalayan-almonds': { belt: 'Selected Whole Sweet Almond Kernels', process: 'Raw, Unpasteurized & Chemical-Free' },
  'superfood-trail-mix': { belt: 'Nepal Blend: Almonds, Cashews, Seeds & Dried Berries', process: 'Raw & Lightly Roasted Whole Ingredients' },
  'macadamia-nuts': { belt: 'Selected Creamy Whole Nut Kernels', process: 'Raw, Shelled & Natural' },
  'virgin-coconut-oil-500ml': { belt: 'Fresh Mature Coconut Meat', process: 'Cold-Pressed Extra Virgin (First Press)' },
  'virgin-coconut-oil-180ml': { belt: 'Fresh Mature Coconut Meat', process: 'Cold-Pressed Extra Virgin (First Press)' },
  'carrot-powder': { belt: 'Mid-Hills & Valley Farms (Product of Nepal 🇳🇵)', process: 'Low-Temperature Dehydration & Fine Cold Milling' },
  'sweet-potato-powder': { belt: 'Mid-Hills & Terai Organic Roots (Product of Nepal 🇳🇵)', process: 'Peeled, Sliced, Dehydrated (<45°C) & Cold-Milled' },
  'pure-mountain-himalayan-shilajit-resin': { belt: 'High Himalayan Cliffs (Mustang / Dolpo, 16,000+ ft)', process: 'Traditional Surya-Tapi (Sun-Purified in Spring Water)' },
  'flax-seeds': { belt: 'Selected Whole Alash Seeds (Product of Nepal 🇳🇵)', process: 'Cleaned, Winnowed & Triple-Sifted' },
  'premium-pistachio-roasted-salted': { belt: 'Selected Long/Round In-Shell Pistachios', process: 'Gentle Dry-Roasted & Himalayan Salted' },
};

// Hedged benefits & pediatric guidance compliance transformer
function transformProduct(p) {
  const meta = ORIGIN_MAP[p.slug] || { belt: 'Product of Nepal 🇳🇵', process: 'Low-Temperature Processing' };

  // Explicit fixes per Phase 1 audit
  if (p.slug === 'freeze-dried-avocado-powder') {
    p.weight = '80 GM';
    p.price = 790;
    p.compareAtPrice = 790;
    p.mrp = 790;
  } else if (p.slug === 'strawberry-powder') {
    p.weight = '80 GM';
    p.price = 1395;
    p.compareAtPrice = 1395;
    p.mrp = 1395;
  } else if (p.slug === 'moringa-leaf-powder') {
    p.weight = '200 GM';
    p.price = 690;
    p.compareAtPrice = 750;
    p.mrp = 750;
  } else if (p.slug === 'banana-powder') {
    p.weight = '100 GM';
    p.price = 650;
    p.compareAtPrice = 750;
    p.mrp = 750;
  } else if (p.slug === 'premium-cashewnuts') {
    p.name = 'Raw Cashew Nuts';
    p.official_label_name = 'Raw Cashew Nuts';
    p.weight = '150 GM';
    p.price = 750;
    p.compareAtPrice = 750;
    p.mrp = 750;
  } else if (p.slug === 'roasted-cashewnuts') {
    p.name = 'Roasted Cashew Nuts';
    p.official_label_name = 'Roasted Cashew Nuts';
    p.weight = '200 GM';
    p.price = 750;
    p.compareAtPrice = 750;
    p.mrp = 750;
  } else if (p.slug === 'makhana-fox-nuts') {
    p.weight = '50 GM';
    p.price = 390;
    p.compareAtPrice = 500;
  }

  // Canonical SKU
  p.sku = 'NM-' + p.slug.toUpperCase();

  // Replace inaccurate "sugar-free" tag with "0-added-sugar" on natural whole fruits
  if (['dehydrated-mango', 'dehydrated-papaya', 'dates-powder'].includes(p.slug)) {
    p.tags = (p.tags || []).map((t) => (t === 'sugar-free' ? '0-added-sugar' : t));
  }

  // Set provenance & processing
  p.origin_belt = meta.belt;
  p.drying_process = meta.process;

  // Clean description of contradictory or unbacked claims
  p.description = p.description
    .replace(/\bsun-dried bananas\b/gi, 'dehydrated bananas')
    .replace(/100%\s*Himalayan\s*Banana/gi, '100% Nepali Banana')
    .replace(/98%\s*(?:natural\s*)?vitamins/gi, 'essential natural vitamins and heat-sensitive nutrients');

  p.shortDescription = p.shortDescription
    .replace(/Himalayan Banana/gi, 'Nepali Banana')
    .replace(/Himalayan Moringa/gi, 'Nepali Moringa');

  // Hedged health benefits (Rule 3)
  p.benefits = (p.benefits || []).map((b) => {
    return b
      .replace(/boosts immunity/gi, 'supports healthy immune function')
      .replace(/cures|prevents|treats/gi, 'contributes to dietary support for')
      .replace(/locks 98% natural vitamins/gi, 'helps preserve natural vitamins and dietary fiber')
      .replace(/natural energy booster/gi, 'provides a wholesome source of carbohydrates and natural energy')
      .replace(/Natural source of iron \(2\.5mg\/100g\) to combat fatigue and anemia/gi, 'Dietary source of iron (2.5mg/100g) and potassium to support daily vitality')
      .replace(/combat fatigue and anemia/gi, 'support daily vitality');
  });

  // Baby content compliance (Rule 3)
  const isBabyRelevant = ['banana-powder', 'sweet-potato-powder', 'carrot-powder', 'dates-powder'].includes(p.slug);
  if (isBabyRelevant) {
    p.baby_guidance =
      'Suitable for complementary infant feeding from 6 months, as advised by your pediatrician. Start with small single-ingredient portions (1 tsp); watch for food sensitivities; never add honey under 12 months; complementary feeding should never replace breast milk or infant formula advice.';
  } else {
    p.baby_guidance =
      'Whole nuts, seeds, and concentrated superfoods are intended for older children and adults. For children under 3 years, whole nuts present a choking hazard; consult your pediatrician before introducing any new concentrated food.';
  }

  // Proof block with honest TODO_OWNER placeholders (Rule 2)
  p.proof_block = {
    batch_label: 'Batch number, manufacturing date, and best-before date are printed on the container label.',
    dftqc_registration: 'TODO_OWNER: Pending DFTQC registration number upload',
    pan_vat: 'TODO_OWNER: Pending registered business PAN/VAT document upload',
    lab_report: 'TODO_OWNER: Third-party laboratory analysis report pending from owner',
  };

  // Harmonized variant references
  if (p.slug === 'premium-cashewnuts') {
    p.variantGroup = 'cashew-nuts';
    p.variantTitle = 'Cashew Variants';
    p.variants = [
      { slug: 'premium-cashewnuts', label: 'Raw Cashew (150 GM)', weight: '150 GM', price: 750, active: true },
      { slug: 'roasted-cashewnuts', label: 'Roasted & Salted (200 GM)', weight: '200 GM', price: 750, active: false },
    ];
  } else if (p.slug === 'roasted-cashewnuts') {
    p.variantGroup = 'cashew-nuts';
    p.variantTitle = 'Cashew Variants';
    p.variants = [
      { slug: 'premium-cashewnuts', label: 'Raw Cashew (150 GM)', weight: '150 GM', price: 750, active: false },
      { slug: 'roasted-cashewnuts', label: 'Roasted & Salted (200 GM)', weight: '200 GM', price: 750, active: true },
    ];
  } else if (p.slug === 'virgin-coconut-oil-180ml') {
    p.variantGroup = 'coconut-oil';
    p.variantTitle = 'Bottle Size Options';
    p.variants = [
      { slug: 'virgin-coconut-oil-180ml', label: '180 ML Glass Bottle', weight: '180 ML', price: 650, active: true },
      { slug: 'virgin-coconut-oil-500ml', label: '500 ML Glass Bottle', weight: '500 ML', price: 1750, active: false },
    ];
  } else if (p.slug === 'virgin-coconut-oil-500ml') {
    p.variantGroup = 'coconut-oil';
    p.variantTitle = 'Bottle Size Options';
    p.variants = [
      { slug: 'virgin-coconut-oil-180ml', label: '180 ML Glass Bottle', weight: '180 ML', price: 650, active: false },
      { slug: 'virgin-coconut-oil-500ml', label: '500 ML Glass Bottle', weight: '500 ML', price: 1750, active: true },
    ];
  }

  return p;
}

const cleanedProducts = raw.map(transformProduct);

// Write single source of truth files
fs.writeFileSync('products.json', JSON.stringify(cleanedProducts, null, 2));
fs.writeFileSync('public/products.json', JSON.stringify(cleanedProducts, null, 2));
console.log('✅ Created root products.json and public/products.json (32 SKUs)');

// Synchronize lib/data/products.ts
const tsContent = `import { Product } from '@/lib/types';
import { resolveImageUrl, formatProductWeight } from '@/lib/utils';

export const products: Product[] = ${JSON.stringify(cleanedProducts, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  return products.find((p) => p.slug === cleanSlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellerProducts(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function normalizeProduct(payload: any, localFallback: Product | null = null): Product {
  if (!payload) {
    if (localFallback) return localFallback;
    throw new Error('No product payload or local fallback provided');
  }

  // Always use local authoritative values as baseline if available
  const base = localFallback || (payload.slug ? getProductBySlug(payload.slug) : null);

  const price = Number(payload.price ?? base?.price ?? 0);
  const compareAtPrice = Number(payload.compare_at_price ?? payload.compareAtPrice ?? base?.compareAtPrice ?? price);
  const mrp = Number(payload.mrp ?? base?.mrp ?? compareAtPrice);

  let rawImg = payload.image || payload.image_url || base?.image || '/products/naturesmud-all-products-100g.jpg';
  const mainImage = resolveImageUrl(rawImg);

  const images: string[] = Array.isArray(payload.images) && payload.images.length > 0
    ? payload.images.map((img: any) => resolveImageUrl(typeof img === 'string' ? img : img.url || img.image_url))
    : base?.images?.map((img: string) => resolveImageUrl(img)) || [mainImage];

  return {
    id: String(payload.id || base?.id || ''),
    dbId: payload.id ? Number(payload.id) : base?.dbId,
    slug: String(base?.slug || payload.slug || ''),
    sku: String(base?.sku || payload.sku || \`NM-\${(base?.slug || payload.slug || '').toUpperCase()}\`),
    name: String(base?.name || payload.name || ''),
    official_label_name: String(base?.official_label_name || payload.official_label_name || base?.name || payload.name || ''),
    category: base?.category || (typeof payload.category === 'object' ? payload.category?.name : payload.category) || 'Superfoods',
    categorySlug: base?.categorySlug || (typeof payload.category === 'object' ? payload.category?.slug : payload.categorySlug) || 'powders',
    price,
    compareAtPrice,
    mrp,
    rating: Number(payload.rating_avg ?? payload.rating ?? base?.rating ?? 0),
    reviewCount: Number(payload.rating_count ?? payload.reviewCount ?? base?.reviewCount ?? 0),
    image: mainImage,
    images,
    description: String(base?.description || payload.description || ''),
    shortDescription: String(base?.shortDescription || payload.short_description || payload.shortDescription || ''),
    badges: Array.isArray(base?.badges) && base.badges.length > 0 ? base.badges : (Array.isArray(payload.badges) ? payload.badges : []),
    stock: Number(payload.stock ?? base?.stock ?? 50),
    weight: formatProductWeight(payload.weight, payload.unit, base?.weight || '100 GM'),
    packing: String(base?.packing || payload.packing || 'Glass Jar'),
    ingredients: Array.isArray(base?.ingredients) && base.ingredients.length > 0 ? base.ingredients : (Array.isArray(payload.ingredients) ? payload.ingredients : []),
    benefits: Array.isArray(base?.benefits) && base.benefits.length > 0 ? base.benefits : (Array.isArray(payload.benefits) ? payload.benefits : []),
    nutrition: Array.isArray(base?.nutrition) && base.nutrition.length > 0 ? base.nutrition : (Array.isArray(payload.nutrition) ? payload.nutrition : []),
    usage: String(base?.usage || payload.usage || ''),
    storage: String(base?.storage || payload.storage || ''),
    isFeatured: Boolean(payload.is_featured ?? payload.isFeatured ?? base?.isFeatured),
    isBestSeller: Boolean(payload.is_best_seller ?? payload.isBestSeller ?? base?.isBestSeller),
    tags: Array.isArray(base?.tags) && base.tags.length > 0 ? base.tags : (Array.isArray(payload.tags) ? payload.tags : []),
    origin_belt: String(base?.origin_belt || payload.origin_belt || 'Product of Nepal 🇳🇵'),
    drying_process: String(base?.drying_process || payload.drying_process || 'Low-Temperature Processing'),
    baby_guidance: String(base?.baby_guidance || payload.baby_guidance || ''),
    proof_block: base?.proof_block || payload.proof_block || null,
    variants: base?.variants || payload.variants || undefined,
  };
}

export function getProductById(id: string | number): Product | undefined {
  return products.find((p) => String(p.id) === String(id) || String(p.dbId) === String(id));
}

export function mergeLiveProductsWithCatalog(rawList: any[] | null | undefined): Product[] {
  if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
    return products;
  }
  return products.map((local) => {
    const live = rawList.find(
      (r: any) =>
        (r.slug && r.slug === local.slug) ||
        (r.id && String(r.id) === String(local.id)) ||
        (r.id && String(r.id) === String(local.dbId))
    );
    if (!live) return local;
    return normalizeProduct(live, local);
  });
}

export const PRODUCT_SEARCH_SYNONYMS: Record<string, string[]> = {
  'dried-dates-khajoor': ['date', 'dates', 'dry dates', 'khajur', 'khajoor', 'chhuwara', 'खजुर', 'छोकडा'],
  'sweet-potato-powder': ['sweet potato', 'sweet potato powder', 'sakharkhanda', 'shakarkandi', 'सखरखण्ड', 'सखरखण्ड पाउडर', 'baby porridge', 'weaning', 'lito', 'लिटो', 'बच्चाको खाना'],
  'carrot-powder': ['carrot', 'carrots', 'carrot powder', 'gajar', 'gajar powder', 'गाजर', 'गाजर पाउडर', 'lito', 'लिटो', 'बच्चाको खाना'],
  'banana-powder': ['banana', 'bananas', 'banana powder', 'kera', 'kera powder', 'केरा', 'केरा पाउडर', 'baby food', 'weaning', 'lito', 'लिटो', 'बच्चाको खाना'],
  'beetroot-powder': ['beetroot', 'beet', 'beets', 'beetroot powder', 'chukandar', 'चुकन्दर', 'चुकन्दर पाउडर', 'nitric oxide', 'stamina'],
  'moringa-leaf-powder': ['moringa', 'moringa powder', 'sitalchini', 'shitalchini', 'drumstick leaf', 'शीतलचिनी', 'मोरिङ्गा', 'सजिवन'],
  'freeze-dried-avocado-powder': ['avocado', 'avocados', 'avocado powder', 'guacamole', 'एभोकाडो', 'घिउ फल'],
  'strawberry-powder': ['strawberry', 'strawberries', 'strawberry powder', 'स्ट्रबेरी', 'स्ट्रबेरी पाउडर'],
  'raw-himalayan-almonds': ['almond', 'almonds', 'raw almond', 'raw almonds', 'badam', 'kagaji badam', 'बदाम', 'कागजी बदाम'],
  'roasted-almonds': ['almond', 'almonds', 'roasted almond', 'roasted almonds', 'salted almonds', 'badam', 'भुटेको बदाम', 'बदाम'],
  'premium-cashewnuts': ['cashew', 'cashews', 'cashewnut', 'cashewnuts', 'raw cashew', 'kaju', 'काजु'],
  'roasted-cashewnuts': ['cashew', 'cashews', 'roasted cashew', 'roasted cashews', 'salted cashew', 'kaju', 'भुटेको काजु', 'काजु'],
  'premium-pistachios': ['pistachio', 'pistachios', 'pista', 'पिस्ता'],
  'premium-pistachio-roasted-salted': ['pistachio', 'pistachios', 'salted pistachio', 'roasted pistachio', 'pista', 'पिस्ता'],
  'dry-figs-anjeer': ['fig', 'figs', 'dry fig', 'dry figs', 'dried figs', 'anjeer', 'anjir', 'अन्जीर'],
  'makhana-fox-nuts': ['makhana', 'fox nut', 'fox nuts', 'lotus seed', 'lotus seeds', 'phool makhana', 'मखाना', 'फक्स नट्स'],
  'flax-seeds': ['flax', 'flax seed', 'flax seeds', 'flaxseed', 'alash', 'alas', 'alsi', 'आलस', 'आलसको बिया'],
  'chia-seeds': ['chia', 'chia seed', 'chia seeds', 'black chia', 'sabja', 'चिया सिड्स', 'चिया बिया'],
  'pumpkin-seeds': ['pumpkin', 'pumpkin seed', 'pumpkin seeds', 'pepita', 'pepitas', 'farsi', 'फर्सीको बिया'],
  'sunflower-seeds': ['sunflower', 'sunflower seed', 'sunflower seeds', 'सूर्यमुखी बिया'],
  'pure-himalayan-black-salt-bire-noon': ['black salt', 'bire nun', 'bire noon', 'kala namak', 'बिरे नुन', 'काला नमक'],
  'himalayan-pink-salt': ['pink salt', 'rock salt', 'himalayan salt', 'sidhe nun', 'sendha namak', 'सिधे नुन', 'गुलाबी नुन'],
  'pure-mountain-himalayan-shilajit-resin': ['shilajit', 'silajit', 'shilajeet', 'resin', 'fulvic acid', 'शिलाजीत', 'हिमाली शिलाजीत'],
  'virgin-coconut-oil-500ml': ['coconut oil', 'virgin coconut oil', 'cold pressed oil', 'nariwal tel', 'नरिवलको तेल', 'नरिवल तेल'],
  'virgin-coconut-oil-180ml': ['coconut oil', 'virgin coconut oil', 'nariwal tel', 'नरिवलको तेल'],
  'dehydrated-coconut-chips': ['coconut', 'coconut chip', 'coconut chips', 'coconut flakes', 'khopra', 'नरिवल', 'सुकेको नरिवल'],
  'dehydrated-mango': ['mango', 'mangoes', 'dried mango', 'dehydrated mango', 'aap', 'आँप', 'सुकेको आँप'],
  'dehydrated-apple': ['apple', 'apples', 'dried apple', 'dehydrated apple', 'apple rings', 'syau', 'स्याउ', 'स्याउको सुकुटी'],
  'dehydrated-papaya': ['papaya', 'dried papaya', 'dehydrated papaya', 'mewa', 'मेवा'],
  'dehydrated-pineapple': ['pineapple', 'dried pineapple', 'dehydrated pineapple', 'bhuikatahar', 'भुइँकटहर'],
  'dehydrated-kiwi': ['kiwi', 'dried kiwi', 'dehydrated kiwi', 'किवी'],
  'dehydrated-dragon-fruit': ['dragon fruit', 'pitaya', 'dried dragon fruit', 'ड्रागन फ्रुट', 'सिउडी'],
  'dried-blueberries': ['blueberry', 'blueberries', 'dried blueberry', 'dried blueberries', 'ब्लुबेरी'],
  'dried-cranberries': ['cranberry', 'cranberries', 'dried cranberry', 'dried cranberries', 'क्र्यानबेरी'],
  'superfood-trail-mix': ['trail mix', 'mix dry nuts', 'mixed nuts', 'dry fruits mix', 'superfood mix', 'immunity mix', 'मिक्स ड्राई फ्रुट्स'],
};

function normalizeSearchToken(token: string): string {
  const lower = token.toLowerCase().trim();
  if (lower.endsWith('ies') && lower.length > 4) {
    return \`\${lower.slice(0, -3)}y\`;
  }
  if (lower.endsWith('oes') && lower.length > 4) {
    return lower.slice(0, -2);
  }
  if (lower.endsWith('s') && !lower.endsWith('ss') && lower.length > 3) {
    return lower.slice(0, -1);
  }
  return lower;
}

export function searchProductsCatalog(catalog: Product[], rawQuery: string): Product[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const queryTokens = query
    .split(/[\\s,.-]+/)
    .map(normalizeSearchToken)
    .filter(Boolean);

  const scored: { product: Product; score: number }[] = [];

  for (const product of catalog) {
    let score = 0;
    const nameLower = (product.name || '').toLowerCase();
    const slugLower = (product.slug || '').toLowerCase();
    const catLower = (product.category || '').toLowerCase();
    const descLower = \`\${product.shortDescription || ''} \${product.description || ''}\`.toLowerCase();
    const tagsLower = (product.tags || []).map((t) => t.toLowerCase());
    const synonyms = PRODUCT_SEARCH_SYNONYMS[product.slug] || [];

    if (nameLower === query || slugLower === query) {
      score += 100;
    } else if (nameLower.includes(query)) {
      score += 75;
    }

    for (const syn of synonyms) {
      const synLower = syn.toLowerCase();
      if (synLower === query) {
        score += 90;
      } else if (synLower.includes(query) || query.includes(synLower)) {
        score += 60;
      }
    }

    if (queryTokens.length > 0) {
      const searchableCorpus = [
        nameLower,
        slugLower.replace(/-/g, ' '),
        catLower,
        ...tagsLower,
        ...synonyms.map((s) => s.toLowerCase()),
      ].join(' ');
      const corpusTokens = searchableCorpus
        .split(/[\\s,.-]+/)
        .map(normalizeSearchToken)
        .filter(Boolean);

      const matchedTokens = queryTokens.filter((qt) =>
        corpusTokens.some((ct) => ct === qt || ct.includes(qt) || qt.includes(ct))
      );

      if (matchedTokens.length === queryTokens.length) {
        score += 55;
      } else if (matchedTokens.length > 0 && queryTokens.length > 1) {
        score += matchedTokens.length * 15;
      }
    }

    if (score === 0) {
      if (catLower.includes(query) || tagsLower.some((t) => t.includes(query))) {
        score += 35;
      } else if (descLower.includes(query)) {
        score += 15;
      }
    }

    if (score > 0) {
      scored.push({ product, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}
`;

fs.writeFileSync('lib/data/products.ts', tsContent);
console.log('✅ Successfully updated lib/data/products.ts with standardized single source of truth');

