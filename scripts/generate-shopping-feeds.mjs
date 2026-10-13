import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://naturesmud.shop';
const FREE_SHIPPING_THRESHOLD = 2000;

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCsv(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalizeUnitMeasure(weightStr) {
  const raw = String(weightStr || '100 GM').trim().toUpperCase();
  const match = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*(GM|G|KG|ML|L)/i);
  if (!match) {
    return { measure: '100g', baseMeasure: '100g' };
  }
  const num = parseFloat(match[1]);
  const unitRaw = match[2].toUpperCase();
  if (unitRaw === 'ML') {
    return { measure: `${num}ml`, baseMeasure: '100ml' };
  }
  if (unitRaw === 'L') {
    return { measure: `${num * 1000}ml`, baseMeasure: '100ml' };
  }
  if (unitRaw === 'KG') {
    return { measure: `${num * 1000}g`, baseMeasure: '100g' };
  }
  return { measure: `${num}g`, baseMeasure: '100g' };
}

function parseLocalProducts() {
  const rawFile = fs.readFileSync(path.join(process.cwd(), 'lib/data/products.ts'), 'utf8');
  const startMarker = 'export const products: Product[] = [';
  const startIdx = rawFile.indexOf(startMarker);
  const endIdx = rawFile.indexOf('export function getProductBySlug');
  const arrayStr = rawFile
    .slice(startIdx + 'export const products: Product[] = '.length, endIdx)
    .trim()
    .replace(/;$/, '');
  return JSON.parse(arrayStr).filter((p) => p.isActive !== false && p.isPublished !== false);
}

const TOP_10_CONFIG = [
  {
    rank: 1,
    slug: 'beetroot-powder',
    sellerSku: 'NM-BEETROOT-POWDER-100G',
    nepaliName: 'चुकन्दरको धुलो',
    nepaliRomanized: 'Chukandar ko Dhulo',
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
    nepaliName: 'खजुरको धुलो',
    nepaliRomanized: 'Khajoor ko Dhulo',
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
    nepaliName: 'शीतलचिनी (सजिवन) को पातको धुलो',
    nepaliRomanized: 'Shitalchini / Sajyun ko Dhulo',
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
    nepaliName: 'गाजरको धुलो',
    nepaliRomanized: 'Gajar ko Dhulo',
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
    nepaliName: 'सखरखण्डको धुलो',
    nepaliRomanized: 'Sakarkhanda ko Dhulo',
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
    nepaliName: 'एक्स्ट्रा भर्जिन नरिवलको तेल (५०० मिलि)',
    nepaliRomanized: 'Nariwal ko Tel (500 ML)',
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
    nepaliName: 'शुद्ध हिमाली शिलाजीत रेजिन',
    nepaliRomanized: 'Himali Shilajit Resin',
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
    nepaliName: 'चिया सिड्स',
    nepaliRomanized: 'Chia Seeds / Chia Dana',
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
    nepaliName: 'फर्सीको बिया (पम्पकिन सिड्स)',
    nepaliRomanized: 'Pharsi ko Biya',
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
    nepaliName: 'सुकाएको आँप (डिहाइड्रेटेड म्याङ्गो)',
    nepaliRomanized: 'Sukako Aap',
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

function buildXmlFeed(activeProducts, isMetaXml = false) {
  const xmlItems = activeProducts
    .map((p) => {
      const officialName = p.official_label_name || p.name;
      const primaryImage = p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
      const additionalImagesXml = (p.images || [])
        .slice(1, 5)
        .map((img) => {
          const fullUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
          return `      <g:additional_image_link>${escapeXml(fullUrl)}</g:additional_image_link>`;
        })
        .join('\n');
      const { measure, baseMeasure } = normalizeUnitMeasure(p.weight || '100 GM');
      const insideValleyShipping = p.price >= FREE_SHIPPING_THRESHOLD ? '0.00 NPR' : '100.00 NPR';
      const outsideValleyShipping = p.price >= FREE_SHIPPING_THRESHOLD ? '0.00 NPR' : '150.00 NPR';
      const displayTitle = isMetaXml ? `${officialName} (${p.weight})` : officialName;

      return `    <item>
      <g:id>${escapeXml(`NM-${p.slug.toUpperCase()}`)}</g:id>
      <title>${escapeXml(displayTitle)}</title>
      <description>${escapeXml(p.description || p.shortDescription)}</description>
      <link>${escapeXml(`${BASE_URL}/products/${p.slug}`)}</link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
${additionalImagesXml ? additionalImagesXml + '\n' : ''}      <g:condition>new</g:condition>
      <g:availability>${p.stock > 0 ? (isMetaXml ? 'in stock' : 'in_stock') : isMetaXml ? 'out of stock' : 'out_of_stock'}</g:availability>
      <g:price>${p.price} NPR</g:price>
      <g:brand>NaturesMud</g:brand>
      <g:mpn>${escapeXml(`NM-${p.id || p.slug.toUpperCase()}`)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:unit_pricing_measure>${escapeXml(measure)}</g:unit_pricing_measure>
      <g:unit_pricing_base_measure>${escapeXml(baseMeasure)}</g:unit_pricing_base_measure>
      <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Food Items</g:google_product_category>
      <g:fb_product_category>food &amp; beverages &gt; food</g:fb_product_category>
      <g:product_type>${escapeXml(`Food, Beverages & Tobacco > Food Items > ${p.category}`)}</g:product_type>
      <g:custom_label_0>${escapeXml(p.categorySlug || 'superfoods')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(p.weight || '100 GM')}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(p.packing || 'Airtight Food-Grade Container')}</g:custom_label_2>
      <g:shipping_weight>${escapeXml(measure)}</g:shipping_weight>
      <g:return_policy_label>7_day_return</g:return_policy_label>
      <g:shipping>
        <g:country>NP</g:country>
        <g:region>Bagmati</g:region>
        <g:service>Kathmandu Valley Express Delivery (24 Hours)</g:service>
        <g:price>${insideValleyShipping}</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>NP</g:country>
        <g:service>All-Nepal Courier Delivery (2-5 Days)</g:service>
        <g:price>${outsideValleyShipping}</g:price>
      </g:shipping>
    </item>`;
    })
    .join('\n');

  const feedTitle = isMetaXml
    ? 'NaturesMud Nepal — Official Meta (Facebook & Instagram) Product Catalog Feed'
    : 'NaturesMud Nepal — Official Google Merchant & Product Feed';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(BASE_URL)}</link>
    <description>Official first-party product feed for NaturesMud Nepal — 32 canonical single-ingredient dehydrated fruits, superfood powders, nuts, seeds, cold-pressed oils, and Himalayan salts.</description>
${xmlItems}
  </channel>
</rss>`;
}

function buildMetaCsv(activeProducts) {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
    'custom_label_0',
    'custom_label_1',
    'custom_label_2',
  ];

  const rows = activeProducts.map((p) => {
    const officialName = p.official_label_name || p.name;
    const primaryImage = p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
    const additionalImages = (p.images || [])
      .slice(1)
      .map((img) => (img.startsWith('http') ? img : `${BASE_URL}${img}`))
      .join(',');

    return [
      escapeCsv(`NM-${p.slug.toUpperCase()}`),
      escapeCsv(`${officialName} (${p.weight})`),
      escapeCsv(p.description || p.shortDescription),
      escapeCsv(p.stock > 0 ? 'in stock' : 'out of stock'),
      escapeCsv('new'),
      escapeCsv(`${p.price}.00 NPR`),
      escapeCsv(`${BASE_URL}/products/${p.slug}`),
      escapeCsv(primaryImage),
      escapeCsv(additionalImages),
      escapeCsv('NaturesMud'),
      escapeCsv('Food, Beverages & Tobacco > Food Items'),
      escapeCsv('food & beverages > food'),
      escapeCsv(p.categorySlug || 'superfoods'),
      escapeCsv(p.weight || '100 GM'),
      escapeCsv(p.packing || 'Airtight Food-Grade Container'),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function buildDarazTop10(activeProducts) {
  const listings = TOP_10_CONFIG.map((cfg) => {
    const p = activeProducts.find((item) => item.slug === cfg.slug);
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
  <p><strong>Nepali Name:</strong> ${cfg.nepaliName} (${cfg.nepaliRomanized})</p>
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

  const headers = [
    'Rank',
    'SellerSKU',
    'OfficialLabelName',
    'DarazProductTitle',
    'DarazCategoryPath',
    'PriceNPR',
    'CompareAtPriceNPR',
    'NetWeight',
    'PackingType',
    'ShippingPackageWeightKg',
    'PackageDimensionsCm',
    'ShelfLife',
    'PrimaryImageURL',
    'GalleryImageURLs',
    'BulletHighlights',
    'SearchKeywords',
    'CanonicalWebsiteURL',
    'HTMLDescription',
  ];

  const rows = listings.map((item) =>
    [
      escapeCsv(item.rank),
      escapeCsv(item.sellerSku),
      escapeCsv(item.officialLabelName),
      escapeCsv(item.darazTitle),
      escapeCsv(item.darazCategoryPath),
      escapeCsv(item.priceNpr),
      escapeCsv(item.compareAtPriceNpr),
      escapeCsv(item.netWeight),
      escapeCsv(item.packingType),
      escapeCsv(item.shippingPackageWeightKg),
      escapeCsv(item.packageDimensionsCm),
      escapeCsv(item.shelfLife),
      escapeCsv(item.primaryImageUrl),
      escapeCsv(item.galleryImageUrls.join(' | ')),
      escapeCsv(item.shortHighlights.join(' • ')),
      escapeCsv(item.searchKeywords.join(', ')),
      escapeCsv(item.canonicalProductUrl),
      escapeCsv(item.htmlDescription),
    ].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const json = JSON.stringify(
    {
      brand: 'NaturesMud',
      marketplace: 'Daraz Nepal (daraz.com.np)',
      strategy:
        'Top 10 high-velocity SKUs listed on Daraz Nepal to capture marketplace brand/category searches while preserving full 32-SKU catalog exclusivity and bundles on naturesmud.shop.',
      count: listings.length,
      listings,
    },
    null,
    2
  );

  return { csv, json };
}

function buildLlmsTxt(activeProducts) {
  const categoryHubs = [
    { slug: 'powders', title: 'Whole-Food & Baby Weaning Powders', url: `${BASE_URL}/category/powders` },
    { slug: 'dried-fruits', title: 'Dehydrated Fruits & Berries', url: `${BASE_URL}/category/dried-fruits` },
    { slug: 'nuts', title: 'Mountain Nuts & Mix Dry Nuts', url: `${BASE_URL}/category/nuts` },
    { slug: 'seeds', title: 'Superfood Seeds & Makhana', url: `${BASE_URL}/category/seeds` },
    { slug: 'oils', title: 'Cold-Pressed Oils & Rosemary', url: `${BASE_URL}/category/oils` },
    { slug: 'salts-spices', title: 'Himalayan Salts & Shilajit Resin', url: `${BASE_URL}/category/salts-spices` },
  ];

  const categorySections = categoryHubs
    .map((hub, idx) => {
      const catProducts = activeProducts.filter((p) => p.categorySlug === hub.slug);
      const lines = catProducts
        .map((p) => {
          const officialName = p.official_label_name || p.name;
          return `- **${officialName}** (\`${p.weight}\`, Rs. ${Number(p.price).toLocaleString()}): \`${BASE_URL}/products/${p.slug}\` — ${p.shortDescription || p.description}`;
        })
        .join('\n');
      return `### ${idx + 1}. ${hub.title} (\`${hub.url}\`)\n${lines}`;
    })
    .join('\n\n');

  return `# NaturesMud Nepal (${BASE_URL}/)

> NaturesMud is a Nepal-focused natural foods, dehydrated fruits, single-ingredient whole-food powders, mountain nuts, seeds, cold-pressed oils, and Himalayan salts ecommerce brand headquartered in Baneshwor, Kathmandu 44600, Nepal.

## Brand & Operational Facts
- **Official Website**: ${BASE_URL}/
- **First-Party Product Entity Graph (JSON-LD)**: ${BASE_URL}/api/entities/products
- **Google Merchant Product Feed (XML / JSON)**: ${BASE_URL}/merchant-feed.xml | ${BASE_URL}/api/merchant-feed?format=json
- **Meta (Facebook & Instagram Shop) Catalog Feed (XML / CSV)**: ${BASE_URL}/meta-catalog-feed.xml | ${BASE_URL}/meta-catalog-feed.csv
- **Daraz Nepal Brand Store Top 10 SKUs Feed (CSV / JSON)**: ${BASE_URL}/daraz-top-10-listings.csv | ${BASE_URL}/daraz-top-10-listings.json
- **Primary Market**: Nepal (Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda, Nepalgunj, Surkhet, and all 77 districts)
- **Headquarters**: Baneshwor, Kathmandu 44600, Nepal
- **Customer Support / WhatsApp Order Desk**: +977-9713888002 | info@naturesmud.shop
- **Direct Sourcing Regions**: Farming communities across Nepal's Terai, Midland Hills, and High Himalayas
- **Processing Standard**: Low-temperature dehydration and gentle cold-milling; 0% refined sugar, 0% artificial preservatives, 0% synthetic dyes
- **Packaging**: Food-grade airtight glass jars, food-grade PET jars, and resealable stand-up pouches
- **Quality & Claims Transparency Ledger**: ${BASE_URL}/about#quality-ledger
- **Shipping Policy**:
  - **Free Delivery Across Nepal**: Orders of Rs. 2,000 or above
  - **Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur)**: Rs. 100 express delivery (within 24 hours)
  - **Outside Valley (All 7 Provinces / 77 Districts)**: Rs. 150 courier delivery (2–5 business days)
- **Return Policy**: 7-day replacement/refund policy for damaged, leaked, or wrong items (${BASE_URL}/returns)
- **Payment Methods**: Cash on Delivery (COD), Fonepay QR, eSewa, Khalti, ConnectIPS / Mobile Banking

## Canonical Product Catalog (${activeProducts.length} Active First-Party Products — Exact Official Label Names & Prices in NPR)

${categorySections}

## Key Hub URLs
- **All Products**: ${BASE_URL}/products
- **6 Canonical Category Hubs**:
  - ${BASE_URL}/category/powders
  - ${BASE_URL}/category/dried-fruits
  - ${BASE_URL}/category/nuts
  - ${BASE_URL}/category/seeds
  - ${BASE_URL}/category/oils
  - ${BASE_URL}/category/salts-spices
- **Superfood Combos & Offers**: ${BASE_URL}/offers
- **Master Digital Catalog & PDF**: ${BASE_URL}/catalog
- **Nutrition & Baby Weaning Journal**: ${BASE_URL}/blog
- **Healthy Himalayan Recipes**: ${BASE_URL}/recipes
- **Nepal Delivery Locations**: ${BASE_URL}/locations
- **About NaturesMud & Transparency Ledger**: ${BASE_URL}/about
- **Contact & Business Identity**: ${BASE_URL}/contact
- **FAQ**: ${BASE_URL}/faq
`;
}

const activeProducts = parseLocalProducts();
const publicDir = path.join(process.cwd(), 'public');

const gmcXml = buildXmlFeed(activeProducts, false);
const metaXml = buildXmlFeed(activeProducts, true);
const metaCsv = buildMetaCsv(activeProducts);
const { csv: darazCsv, json: darazJson } = buildDarazTop10(activeProducts);
const llmsTxt = buildLlmsTxt(activeProducts);

fs.writeFileSync(path.join(publicDir, 'merchant-feed.xml'), gmcXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'meta-catalog-feed.xml'), metaXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'meta-catalog-feed.csv'), metaCsv, 'utf8');
fs.writeFileSync(path.join(publicDir, 'daraz-top-10-listings.csv'), darazCsv, 'utf8');
fs.writeFileSync(path.join(publicDir, 'daraz-top-10-listings.json'), darazJson, 'utf8');
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf8');

console.log(
  `✅ Generated shopping & marketplace feeds + llms.txt for ${activeProducts.length} canonical products + 10 Daraz SKUs in public/!`
);
