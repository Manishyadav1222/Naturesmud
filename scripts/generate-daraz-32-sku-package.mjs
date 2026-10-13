import fs from 'fs';
import path from 'path';

const productsRaw = JSON.parse(fs.readFileSync('products.json', 'utf8'));

function escapeCsv(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const DARAZ_CATEGORIES = {
  powders: 'Groceries > Breakfast, Choco & Snacks > Superfoods & Nutritional Powders',
  'baby-powders': 'Mother & Baby > Feeding > Baby & Toddler Food > Cereal & Porridge',
  'dried-fruits': 'Groceries > Canned, Dry & Packaged Foods > Dried Fruits & Raisins',
  nuts: 'Groceries > Canned, Dry & Packaged Foods > Nuts & Seeds',
  seeds: 'Groceries > Canned, Dry & Packaged Foods > Nuts & Seeds',
  oils: 'Groceries > Cooking Ingredients > Cooking Oils > Coconut Oil',
  'salts-spices': 'Groceries > Cooking Ingredients > Salt & Spices > Rock Salt',
};

const NEPALI_DARAZ_NAMES = {
  'banana-powder': { dev: 'केराको धुलो', rom: 'Kera Powder' },
  'moringa-leaf-powder': { dev: 'शीतलचिनी (सजिवन) पातको धुलो', rom: 'Moringa Leaf Powder' },
  'freeze-dried-avocado-powder': { dev: 'एभोकाडो पाउडर', rom: 'Avocado Powder' },
  'strawberry-powder': { dev: 'स्ट्रबेरी पाउडर', rom: 'Freeze Dried Strawberry Powder' },
  'dry-figs-anjeer': { dev: 'सुकाएको अन्जीर', rom: 'Dry Figs (Anjeer)' },
  'makhana-fox-nuts': { dev: 'हिमाली मखाना', rom: 'Makhana (Fox Nuts)' },
  'dehydrated-mango': { dev: 'सुकाएको आँप', rom: 'Dehydrated Mango Slices' },
  'dehydrated-pineapple': { dev: 'सुकाएको भुइँकटहर', rom: 'Dehydrated Pineapple Rings' },
  'dehydrated-apple': { dev: 'सुकाएको हिमाली स्याउ', rom: 'Dehydrated Apple Rings' },
  'dehydrated-coconut-chips': { dev: 'सुकाएको नरिवल चिप्स', rom: 'Dehydrated Coconut Flakes' },
  'dehydrated-papaya': { dev: 'सुकाएको मेवा', rom: 'Dehydrated Sweet Papaya' },
  'dried-blueberries': { dev: 'सुकाएको ब्लुबेरी', rom: 'Dried Blueberries' },
  'dried-cranberries': { dev: 'सुकाएको क्र्यानबेरी', rom: 'Dried Cranberries' },
  'dates-powder': { dev: 'खजुरको धुलो', rom: 'Dates Powder (Khajoor ko Dhulo)' },
  'beetroot-powder': { dev: 'चुकन्दरको धुलो', rom: 'Beetroot Powder (Chukandar ko Dhulo)' },
  'himalayan-pink-salt': { dev: 'हिमाली गुलाबी नुन (सिधे नुन)', rom: 'Himalayan Pink Salt (Sidhe Noon)' },
  'pure-himalayan-black-salt-bire-noon': { dev: 'हिमाली बिरे नुन', rom: 'Himalayan Black Salt (Bire Noon)' },
  'chia-seeds': { dev: 'चिया सिड्स', rom: 'Organic Chia Seeds' },
  'pumpkin-seeds': { dev: 'फर्सीको बिया', rom: 'Raw Green Pumpkin Seeds' },
  'premium-cashewnuts': { dev: 'काँचो काजु', rom: 'Raw Whole Cashew Nuts' },
  'roasted-cashewnuts': { dev: 'भुटेको काजु', rom: 'Roasted & Salted Cashew Nuts' },
  'roasted-almonds': { dev: 'भुटेको बदाम', rom: 'Slow Roasted Almonds' },
  'raw-himalayan-almonds': { dev: 'काँचो बदाम', rom: 'Raw Mountain Almonds' },
  'superfood-trail-mix': { dev: 'मिक्स ड्राइ नट्स', rom: 'Superfood Trail Mix Nuts & Seeds' },
  'macadamia-nuts': { dev: 'म्याकाडामिया नट्स', rom: 'Macadamia Whole Nuts' },
  'virgin-coconut-oil-500ml': { dev: 'एक्स्ट्रा भर्जिन नरिवलको तेल ५०० मिलि', rom: 'Cold Pressed Virgin Coconut Oil 500ml' },
  'virgin-coconut-oil-180ml': { dev: 'भर्जिन नरिवलको तेल १८० मिलि', rom: 'Cold Pressed Virgin Coconut Oil 180ml' },
  'carrot-powder': { dev: 'गाजरको धुलो', rom: 'Pure Carrot Powder' },
  'sweet-potato-powder': { dev: 'सखरखण्डको धुलो', rom: 'Sweet Potato Powder (Sakharkhanda)' },
  'pure-mountain-himalayan-shilajit-resin': { dev: 'शुद्ध हिमाली शिलाजित', rom: 'Pure Himalayan Shilajit Resin' },
  'flax-seeds': { dev: 'आलसको दाना', rom: 'Raw Brown Flax Seeds (Alash)' },
  'premium-pistachio-roasted-salted': { dev: 'भुटेको नुनिलो पिस्ता', rom: 'Roasted Salted California Pistachios' },
};

const darazListings = productsRaw.map((p, index) => {
  const nep = NEPALI_DARAZ_NAMES[p.slug] || { dev: p.name, rom: p.name };
  const officialName = p.official_label_name || p.name;
  const sellerSku = `NM-${p.slug.toUpperCase().replace(/-/g, '_')}`;

  // Categorization
  let categoryPath = DARAZ_CATEGORIES[p.categorySlug] || DARAZ_CATEGORIES.powders;
  if (['dates-powder', 'sweet-potato-powder', 'banana-powder', 'carrot-powder'].includes(p.slug)) {
    categoryPath = DARAZ_CATEGORIES['baby-powders'];
  }

  // Daraz SEO Compliant Title (Brand + Product + Weight + Nepali + Key Benefit)
  const darazTitle = `NaturesMud ${officialName} (${p.weight}) - ${nep.rom} (${nep.dev}) - 100% Pure, 0% Added Sugar, ${p.packing || 'Glass Jar'}`;

  // Packaging dimensions and shipping weight
  let shippingWeightKg = 0.28;
  let dims = '8 x 8 x 11 cm';
  if (p.weight.includes('200 GM') || p.weight.includes('300 GM')) {
    shippingWeightKg = 0.45;
    dims = '9 x 9 x 13 cm';
  } else if (p.weight.includes('500 ML')) {
    shippingWeightKg = 0.85;
    dims = '10 x 10 x 24 cm';
  } else if (p.weight.includes('20 GM')) {
    shippingWeightKg = 0.12;
    dims = '6 x 6 x 6 cm';
  }

  // Daraz Fee & Margin Calculations
  const retailPrice = p.price;
  const compareAtPrice = p.compareAtPrice || Math.round(retailPrice * 1.15);
  const commissionRate = 0.09; // 9% Daraz commission for FMCG Groceries
  const paymentFeeRate = 0.015; // 1.5% payment gateway fee
  const vatOnCommissionRate = 0.13; // 13% VAT on commission

  const darazCommissionNpr = Math.round(retailPrice * commissionRate);
  const vatOnCommissionNpr = Math.round(darazCommissionNpr * vatOnCommissionRate);
  const paymentFeeNpr = Math.round(retailPrice * paymentFeeRate);
  const packagingCostNpr = 30; // Bubble wrap, corrugated box, tape, barcode sticker

  const totalDeductionsNpr = darazCommissionNpr + vatOnCommissionNpr + paymentFeeNpr + packagingCostNpr;
  const netEstimatedPayoutNpr = retailPrice - totalDeductionsNpr;
  const estimatedNetMarginPercent = Math.round((netEstimatedPayoutNpr / retailPrice) * 100);

  // 7-Image Professional Shot List Specification
  const imageShotList = [
    {
      slot: 1,
      type: 'Hero Main Image',
      requirement: 'Pure white background (#FFFFFF), 1000x1000px, product at 85% frame, front label fully legible, zero watermark',
      url: p.image || `https://naturesmud.shop/products/${p.slug}.jpg`,
    },
    {
      slot: 2,
      type: 'Raw Ingredient & Purity',
      requirement: 'High-contrast closeup of raw farm crop (e.g. whole fruit, sun-dried kernels) alongside the jar',
      url: p.images?.[1] || p.image || `https://naturesmud.shop/products/${p.slug}.jpg`,
    },
    {
      slot: 3,
      type: 'Nutritional & Purity Badges',
      requirement: 'Clean infographic: 0% Added Sugar, 0% Preservatives, Single Ingredient, Gentle Dehydration below 45°C',
      url: p.images?.[2] || p.image || `https://naturesmud.shop/products/${p.slug}.jpg`,
    },
    {
      slot: 4,
      type: 'Packaging & Seal Integrity',
      requirement: 'Close-up of food-grade glass jar / resealable pouch, tamper-evident inner seal, net weight marker',
      url: p.images?.[3] || p.image || `https://naturesmud.shop/products/${p.slug}.jpg`,
    },
    {
      slot: 5,
      type: 'Kitchen How-To & Serving Suggestion',
      requirement: 'Action shot: spoonful of powder dissolving in warm milk / baby porridge / smoothie bowl / salad',
      url: p.images?.[4] || p.image || `https://naturesmud.shop/products/${p.slug}.jpg`,
    },
    {
      slot: 6,
      type: 'Origin Belt & Nepal Harvest Map',
      requirement: 'Infographic showing geographic origin belt (e.g. Chitwan, Mustang, Kavre, Terai) — 100% Product of Nepal',
      url: `https://naturesmud.shop/images/official-product-catalog.jpg`,
    },
    {
      slot: 7,
      type: 'Trust, Compliance & WhatsApp Support',
      requirement: 'DFTQC compliance pledge, 7-day hassle-free replacement, direct Kathmandu customer care desk',
      url: `https://naturesmud.shop/images/official-product-catalog.jpg`,
    },
  ];

  // Video Specification
  const videoSpec = {
    resolution: '1080x1920 (9:16 Vertical) or 1080x1080 (1:1 Square)',
    durationSec: '20 to 35 seconds',
    format: 'MP4 (H.264), < 30 MB',
    storyboard:
      '0-3s: Jar unboxing on clean wood surface. 4-10s: Peeling tamper-evident seal, spoon scoop showing fine lump-free texture. 11-20s: Stirring into glass of warm milk / baby jaulo. 21-30s: Happy family reaction shot & NaturesMud logo with "0% Added Sugar".',
  };

  // Review Insert Card Copy
  const customerReviewCardCopy = {
    frontHeadline: 'Thank you for choosing 100% Pure Himalayan Whole Foods! 🇳🇵',
    frontBody:
      'We pack each jar with love and rigorous hygiene at our Kathmandu center. You are eating 100% real food with zero chemicals, zero added cane sugar, and zero preservatives.',
    darazCallToAction:
      'Loved our product? Help other Nepali families find honest nutrition by leaving a 5-Star Review with a photo on your Daraz App!',
    damageOrSupportFallback:
      'Notice any transit damage, jar crack, or seal leakage? Please do not worry. WhatsApp us directly at +977-9713888002 with your order ID, and we will dispatch a free replacement immediately.',
  };

  const shortHighlights = [
    `100% Pure ${officialName} (${p.weight}) in airtight food-grade ${p.packing || 'Glass Jar'}`,
    '0% Added Cane Sugar · 0% Chemical Preservatives · 0% Maltodextrin Fillers',
    `Dehydrated below 45°C to preserve natural vitamins, minerals & digestive enzymes`,
    `Origin: ${p.origin_belt || 'Product of Nepal 🇳🇵'}`,
    'Tamper-evident inner foil seal preserves aroma and prevents monsoon humidity caking',
    'Fast delivery across Kathmandu Valley (24-48h) and all 77 districts of Nepal',
  ];

  return {
    sku_index: index + 1,
    slug: p.slug,
    seller_sku: sellerSku,
    official_label_name: officialName,
    nepali_name_devanagari: nep.dev,
    nepali_name_roman: nep.rom,
    daraz_title: darazTitle,
    daraz_category_path: categoryPath,
    brand_name: 'NaturesMud',
    retail_price_npr: retailPrice,
    compare_at_price_npr: compareAtPrice,
    net_weight: p.weight,
    packing_type: p.packing || 'Food-Grade Glass Jar',
    shelf_life: '12 Months',
    origin_belt: p.origin_belt || 'Product of Nepal 🇳🇵',
    shipping_package_weight_kg: shippingWeightKg,
    package_dimensions_cm: dims,
    financial_breakdown: {
      retail_price_npr: retailPrice,
      daraz_commission_9pct_npr: darazCommissionNpr,
      vat_on_commission_13pct_npr: vatOnCommissionNpr,
      payment_gateway_fee_1_5pct_npr: paymentFeeNpr,
      box_and_bubble_packaging_npr: packagingCostNpr,
      total_deductions_npr: totalDeductionsNpr,
      net_estimated_payout_npr: netEstimatedPayoutNpr,
      estimated_net_margin_percent: `${estimatedNetMarginPercent}%`,
    },
    short_bullet_highlights: shortHighlights,
    search_keywords: [
      p.name.toLowerCase(),
      `${p.name.toLowerCase()} nepal`,
      `${p.name.toLowerCase()} daraz`,
      nep.rom.toLowerCase(),
      nep.dev,
      `naturesmud ${p.slug.replace(/-/g, ' ')}`,
      'healthy food kathmandu online',
      'pure baby food nepal',
    ],
    image_shot_list: imageShotList,
    video_specification: videoSpec,
    customer_review_insert_card: customerReviewCardCopy,
    canonical_storefront_url: `https://naturesmud.shop/products/${p.slug}`,
  };
});

fs.writeFileSync(
  'public/daraz-all-32-sku-listings.json',
  JSON.stringify(darazListings, null, 2),
  'utf8'
);

const csvHeaders = [
  'sku_index',
  'slug',
  'seller_sku',
  'official_label_name',
  'nepali_name_devanagari',
  'daraz_title',
  'daraz_category_path',
  'retail_price_npr',
  'compare_at_price_npr',
  'net_weight',
  'packing_type',
  'shipping_package_weight_kg',
  'package_dimensions_cm',
  'daraz_commission_npr',
  'net_estimated_payout_npr',
  'estimated_net_margin_percent',
  'primary_image_url',
  'canonical_storefront_url',
];

const csvRows = [csvHeaders.join(',')];
for (const item of darazListings) {
  const row = [
    item.sku_index,
    item.slug,
    item.seller_sku,
    item.official_label_name,
    item.nepali_name_devanagari,
    item.daraz_title,
    item.daraz_category_path,
    item.retail_price_npr,
    item.compare_at_price_npr,
    item.net_weight,
    item.packing_type,
    item.shipping_package_weight_kg,
    item.package_dimensions_cm,
    item.financial_breakdown.daraz_commission_9pct_npr,
    item.financial_breakdown.net_estimated_payout_npr,
    item.financial_breakdown.estimated_net_margin_percent,
    item.image_shot_list[0].url,
    item.canonical_storefront_url,
  ].map(escapeCsv);
  csvRows.push(row.join(','));
}

fs.writeFileSync('public/daraz-all-32-sku-listings.csv', csvRows.join('\n'), 'utf8');

console.log(`Successfully generated Daraz 32-SKU Listing Package in JSON and CSV!`);
