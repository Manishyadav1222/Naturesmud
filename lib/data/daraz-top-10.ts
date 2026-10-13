import { products } from '@/lib/data/products';
import { PRODUCT_SEO_DOSSIERS } from '@/lib/data/product-seo-dossier';

export interface DarazSkuListing {
  rank: number;
  slug: string;
  sellerSku: string;
  officialLabelName: string;
  darazTitle: string;
  darazCategoryPath: string;
  priceNpr: number;
  compareAtPriceNpr: number;
  netWeight: string;
  packingType: string;
  shippingPackageWeightKg: number;
  packageDimensionsCm: string;
  shelfLife: string;
  storageInstructions: string;
  primaryImageUrl: string;
  galleryImageUrls: string[];
  shortHighlights: string[];
  searchKeywords: string[];
  htmlDescription: string;
  canonicalProductUrl: string;
}

const BASE_URL = 'https://naturesmud.shop';

const TOP_10_CONFIG: Array<{
  rank: number;
  slug: string;
  sellerSku: string;
  darazTitle: string;
  darazCategoryPath: string;
  shippingPackageWeightKg: number;
  packageDimensionsCm: string;
  shelfLife: string;
  searchKeywords: string[];
}> = [
  {
    rank: 1,
    slug: 'beetroot-powder',
    sellerSku: 'NM-BEETROOT-POWDER-100G',
    darazTitle:
      'NaturesMud Beetroot Powder (100 GM) - Chukandar ko Dhulo (चुकन्दरको धुलो) - 100% Pure Single-Ingredient Dehydrated Beetroot in Glass Jar',
    darazCategoryPath: 'Groceries > Breakfast, Choco & Snacks > Superfoods & Nutritional Powders',
    shippingPackageWeightKg: 0.28,
    packageDimensionsCm: '8 x 8 x 11 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'beetroot powder nepal',
      'chukandar ko dhulo',
      'चुकन्दरको धुलो',
      'pure beetroot powder kathmandu',
      'naturesmud beetroot powder',
      'pre workout smoothie powder nepal',
      'natural food coloring nepal',
    ],
  },
  {
    rank: 2,
    slug: 'dates-powder',
    sellerSku: 'NM-DATES-POWDER-100G',
    darazTitle:
      'NaturesMud Dates Powder (100 GM) - Khajoor ko Dhulo (खजुरको धुलो) - Natural Dry Date Sweetener for Porridge, Lito & Milk (0% Refined Sugar)',
    darazCategoryPath: 'Mother & Baby > Feeding > Baby & Toddler Food > Cereal & Porridge',
    shippingPackageWeightKg: 0.28,
    packageDimensionsCm: '8 x 8 x 11 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'dates powder nepal',
      'khajoor ko dhulo',
      'खजुरको धुलो',
      'baby food sweetener nepal',
      'natural sugar substitute nepal',
      'dry dates powder kathmandu',
      'naturesmud dates powder',
    ],
  },
  {
    rank: 3,
    slug: 'moringa-leaf-powder',
    sellerSku: 'NM-MORINGA-POWDER-100G',
    darazTitle:
      'NaturesMud Moringa Leaf Powder (100 GM) - Shitalchini / Sajyun ko Dhulo (शीतलचिनी पाउडर) - 100% Shade-Dried Green Superfood Leaf Powder',
    darazCategoryPath: 'Groceries > Breakfast, Choco & Snacks > Superfoods & Nutritional Powders',
    shippingPackageWeightKg: 0.26,
    packageDimensionsCm: '8 x 8 x 11 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'moringa powder nepal',
      'shitalchini powder',
      'sajyun ko dhulo',
      'शीतलचिनी पाउडर',
      'drumstick leaf powder nepal',
      'green superfood nepal',
      'naturesmud moringa',
    ],
  },
  {
    rank: 4,
    slug: 'carrot-powder',
    sellerSku: 'NM-CARROT-POWDER-100G',
    darazTitle:
      'NaturesMud Carrot Powder (100 GM) - Gajar ko Dhulo (गाजरको धुलो) - 100% Pure Dehydrated Carrot Powder for Porridge, Soups & Smoothies',
    darazCategoryPath: 'Mother & Baby > Feeding > Baby & Toddler Food > Cereal & Porridge',
    shippingPackageWeightKg: 0.28,
    packageDimensionsCm: '8 x 8 x 11 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'carrot powder nepal',
      'gajar ko dhulo',
      'गाजरको धुलो',
      'baby porridge vegetable powder nepal',
      'dehydrated carrot powder kathmandu',
      'naturesmud carrot powder',
    ],
  },
  {
    rank: 5,
    slug: 'sweet-potato-powder',
    sellerSku: 'NM-SWEET-POTATO-POWDER-100G',
    darazTitle:
      'NaturesMud Sweet Potato Powder (100 GM) - Sakarkhanda ko Dhulo (सखरखण्डको धुलो) - 100% Pure Sweet Potato Flour for Porridge, Lito & Pancakes',
    darazCategoryPath: 'Mother & Baby > Feeding > Baby & Toddler Food > Cereal & Porridge',
    shippingPackageWeightKg: 0.28,
    packageDimensionsCm: '8 x 8 x 11 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'sweet potato powder nepal',
      'sakarkhanda ko dhulo',
      'सखरखण्डको धुलो',
      'baby weaning porridge nepal',
      'sweet potato flour kathmandu',
      'naturesmud sweet potato powder',
    ],
  },
  {
    rank: 6,
    slug: 'virgin-coconut-oil-500ml',
    sellerSku: 'NM-VIRGIN-COCONUT-OIL-500ML',
    darazTitle:
      'NaturesMud Extra Virgin Coconut Oil (500 ML) - Cold-Pressed Nariwal ko Tel (भर्जिन नरिवलको तेल) in Wide-Mouth Glass Jar for Cooking, Hair & Baby Massage',
    darazCategoryPath: 'Groceries > Baking & Cooking > Cooking Oil > Coconut Oil',
    shippingPackageWeightKg: 0.85,
    packageDimensionsCm: '10 x 10 x 16 cm',
    shelfLife: '18 Months',
    searchKeywords: [
      'virgin coconut oil nepal',
      'extra virgin coconut oil price in nepal',
      'nariwal ko tel',
      'भर्जिन नरिवलको तेल',
      'cold pressed coconut oil glass jar nepal',
      'baby massage coconut oil nepal',
      'naturesmud coconut oil',
    ],
  },
  {
    rank: 7,
    slug: 'pure-mountain-himalayan-shilajit-resin',
    sellerSku: 'NM-SHILAJIT-RESIN-20G',
    darazTitle:
      'NaturesMud Pure Mountain Himalayan Shilajit Resin (20 GM) - 100% Pure High-Altitude Nepali Shilajit Resin (हिमाली शिलाजीत) in Glass Jar',
    darazCategoryPath: 'Health & Beauty > Food Supplements > Well Being > Herbal Supplements',
    shippingPackageWeightKg: 0.16,
    packageDimensionsCm: '6 x 6 x 8 cm',
    shelfLife: '24 Months',
    searchKeywords: [
      'shilajit price in nepal',
      'himalayan shilajit resin nepal',
      'original shilajit kathmandu',
      'हिमाली शिलाजीत',
      'pure nepali shilajit resin',
      'naturesmud shilajit',
    ],
  },
  {
    rank: 8,
    slug: 'chia-seeds',
    sellerSku: 'NM-CHIA-SEEDS-200G',
    darazTitle:
      'NaturesMud Chia Seeds (200 GM) - Raw Himalayan Chia Dana (चिया सिड्स) - High-Fiber Omega-3 Superfood Seeds for Puddings, Water & Smoothies',
    darazCategoryPath: 'Groceries > Breakfast, Choco & Snacks > Nuts & Seeds',
    shippingPackageWeightKg: 0.23,
    packageDimensionsCm: '14 x 6 x 20 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'chia seeds price in nepal',
      'chia dana nepal',
      'चिया सिड्स',
      'raw chia seeds kathmandu',
      'superfood seeds nepal',
      'naturesmud chia seeds',
    ],
  },
  {
    rank: 9,
    slug: 'pumpkin-seeds',
    sellerSku: 'NM-PUMPKIN-SEEDS-200G',
    darazTitle:
      'NaturesMud Pumpkin Seeds (200 GM) - Raw Green Pepitas / Pharsi ko Biya (फर्सीको बिया) - Plant Protein, Zinc & Magnesium Snack Seeds',
    darazCategoryPath: 'Groceries > Breakfast, Choco & Snacks > Nuts & Seeds',
    shippingPackageWeightKg: 0.23,
    packageDimensionsCm: '14 x 6 x 20 cm',
    shelfLife: '12 Months',
    searchKeywords: [
      'pumpkin seeds price in nepal',
      'pharsi ko biya',
      'फर्सीको बिया',
      'raw green pumpkin seeds kathmandu',
      'pepitas nepal',
      'naturesmud pumpkin seeds',
    ],
  },
  {
    rank: 10,
    slug: 'dehydrated-mango',
    sellerSku: 'NM-DEHYDRATED-MANGO-80G',
    darazTitle:
      'NaturesMud Dehydrated Mango (80 GM) - Sukako Aap (सुकाएको आँप) - 100% Real Ripened Mango Slices with 0% Added Sugar & No Preservatives',
    darazCategoryPath: 'Groceries > Breakfast, Choco & Snacks > Dried Fruits & Raisins',
    shippingPackageWeightKg: 0.12,
    packageDimensionsCm: '14 x 5 x 20 cm',
    shelfLife: '9 Months',
    searchKeywords: [
      'dried mango nepal',
      'dehydrated mango slices kathmandu',
      'sukako aap',
      'सुकाएको आँप',
      'no sugar dried fruit nepal',
      'healthy kids snack nepal',
      'naturesmud dehydrated mango',
    ],
  },
];

export function getDarazTop10Listings(): DarazSkuListing[] {
  return TOP_10_CONFIG.map((cfg) => {
    const p = products.find((item) => item.slug === cfg.slug);
    if (!p) {
      throw new Error(`Missing product in catalog for Daraz Top 10 slug: ${cfg.slug}`);
    }
    const dossier = PRODUCT_SEO_DOSSIERS[cfg.slug];
    const officialLabelName = p.official_label_name || p.name;
    const primaryImageUrl = p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
    const galleryImageUrls = (p.images || [p.image]).map((img) =>
      img.startsWith('http') ? img : `${BASE_URL}${img}`
    );

    const isBabyWeaningRelevant = ['dates-powder', 'carrot-powder', 'sweet-potato-powder'].includes(cfg.slug);

    const shortHighlights = [
      `Official Label Name: ${officialLabelName} (${p.weight}) — 100% Pure Single-Ingredient by NaturesMud Nepal`,
      `Ingredients: ${(p.ingredients || [officialLabelName]).join(', ')} (0% Added Sugar, 0% Artificial Colors, 0% Preservatives)`,
      `Net Weight & Packaging: ${p.weight} packed in ${p.packing || 'Airtight Food-Grade Container'} at our Baneshwor, Kathmandu hub`,
      ...(p.benefits || []).slice(0, 2),
      isBabyWeaningRelevant
        ? 'Suitable for family smoothies, porridge, lito, and baby weaning recipes (from 6 months, as advised by your pediatrician)'
        : `Versatile Daily Use: ${p.usage || 'Ready to use in daily Nepali meals, smoothies, or healthy snacking'}`,
    ].slice(0, 6);

    const nutritionRowsHtml = (p.nutrition || [])
      .map((n) => `<li><strong>${n.label}:</strong> ${n.value}</li>`)
      .join('\n');

    const htmlDescription = `<div style="font-family: Arial, sans-serif; color: #2B2B2B; line-height: 1.6;">
  <h2>${officialLabelName} (${p.weight}) — NaturesMud Nepal</h2>
  <p><strong>Nepali Name:</strong> ${dossier?.nepaliNameDevanagari || officialLabelName} (${dossier?.nepaliNameRoman || officialLabelName})</p>
  <p>${p.description}</p>
  <h3>Key Highlights</h3>
  <ul>
    ${shortHighlights.map((h) => `<li>${h}</li>`).join('\n    ')}
  </ul>
  <h3>Ingredients &amp; Packaging</h3>
  <ul>
    <li><strong>Ingredients:</strong> ${(p.ingredients || [officialLabelName]).join(', ')}</li>
    <li><strong>Net Weight:</strong> ${p.weight}</li>
    <li><strong>Packaging Type:</strong> ${p.packing || 'Airtight Food-Grade Container'}</li>
    <li><strong>Shelf Life:</strong> ${cfg.shelfLife}</li>
    <li><strong>Storage:</strong> ${p.storage || 'Store in a cool, dry place away from direct sunlight.'}</li>
  </ul>
  ${
    nutritionRowsHtml
      ? `<h3>Typical Nutritional Values</h3>\n  <ul>\n    ${nutritionRowsHtml}\n  </ul>`
      : ''
  }
  <h3>How to Use</h3>
  <p>${p.usage}</p>
  ${
    isBabyWeaningRelevant
      ? `<p><em>Pediatric Note: Suitable for baby porridge/lito from 6 months, as advised by your pediatrician. Introduce one single-ingredient food at a time.</em></p>`
      : ''
  }
  <hr />
  <p><strong>Authentic NaturesMud Nepal Brand Store:</strong> Packed and dispatched from Baneshwor, Kathmandu 44600, Nepal. Explore our complete 32-product range of dehydrated fruits, single-ingredient powders, nuts, seeds, cold-pressed oils, and Himalayan salts at <strong>naturesmud.shop</strong>.</p>
</div>`;

    return {
      rank: cfg.rank,
      slug: cfg.slug,
      sellerSku: cfg.sellerSku,
      officialLabelName,
      darazTitle: cfg.darazTitle,
      darazCategoryPath: cfg.darazCategoryPath,
      priceNpr: p.price,
      compareAtPriceNpr: p.compareAtPrice || p.mrp || p.price,
      netWeight: p.weight,
      packingType: p.packing || 'Airtight Food-Grade Container',
      shippingPackageWeightKg: cfg.shippingPackageWeightKg,
      packageDimensionsCm: cfg.packageDimensionsCm,
      shelfLife: cfg.shelfLife,
      storageInstructions: p.storage || 'Store in a cool, dry place away from direct sunlight.',
      primaryImageUrl,
      galleryImageUrls,
      shortHighlights,
      searchKeywords: cfg.searchKeywords,
      htmlDescription,
      canonicalProductUrl: `${BASE_URL}/products/${p.slug}`,
    };
  });
}
