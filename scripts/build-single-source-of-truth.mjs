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
      .replace(/natural energy booster/gi, 'provides a wholesome source of carbohydrates and natural energy');
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
import { resolveImageUrl } from '@/lib/utils';

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
    : base?.images?.map(resolveImageUrl) || [mainImage];

  return {
    id: String(payload.id || base?.id || ''),
    dbId: payload.id ? Number(payload.id) : base?.dbId,
    slug: String(payload.slug || base?.slug || ''),
    name: String(payload.name || base?.name || ''),
    official_label_name: String(payload.official_label_name || base?.official_label_name || payload.name || base?.name || ''),
    category: typeof payload.category === 'object' ? payload.category?.name || 'Superfoods' : String(payload.category || base?.category || 'Superfoods'),
    categorySlug: String(payload.category?.slug || payload.categorySlug || base?.categorySlug || 'powders'),
    price,
    compareAtPrice,
    mrp,
    rating: Number(payload.rating_avg ?? payload.rating ?? base?.rating ?? 0),
    reviewCount: Number(payload.rating_count ?? payload.reviewCount ?? base?.reviewCount ?? 0),
    image: mainImage,
    images,
    description: String(payload.description || base?.description || ''),
    shortDescription: String(payload.short_description || payload.shortDescription || base?.shortDescription || ''),
    badges: Array.isArray(payload.badges) ? payload.badges : base?.badges || [],
    stock: Number(payload.stock ?? base?.stock ?? 50),
    weight: String(payload.weight ? \`\${Math.round(Number(payload.weight))} \${(payload.unit || 'GM').toUpperCase()}\` : base?.weight || '100 GM'),
    packing: String(payload.packing || base?.packing || 'Glass Jar'),
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients : base?.ingredients || [],
    benefits: Array.isArray(payload.benefits) ? payload.benefits : base?.benefits || [],
    nutrition: Array.isArray(payload.nutrition) ? payload.nutrition : base?.nutrition || [],
    usage: String(payload.usage || base?.usage || ''),
    storage: String(payload.storage || base?.storage || ''),
    isFeatured: Boolean(payload.is_featured ?? payload.isFeatured ?? base?.isFeatured),
    isBestSeller: Boolean(payload.is_best_seller ?? payload.isBestSeller ?? base?.isBestSeller),
    tags: Array.isArray(payload.tags) ? payload.tags : base?.tags || [],
    origin_belt: String(payload.origin_belt || base?.origin_belt || 'Product of Nepal 🇳🇵'),
    drying_process: String(payload.drying_process || base?.drying_process || 'Low-Temperature Processing'),
    baby_guidance: String(payload.baby_guidance || base?.baby_guidance || ''),
    proof_block: payload.proof_block || base?.proof_block || null,
    variants: payload.variants || base?.variants || undefined,
  };
}
`;

fs.writeFileSync('lib/data/products.ts', tsContent);
console.log('✅ Successfully updated lib/data/products.ts with standardized single source of truth');
