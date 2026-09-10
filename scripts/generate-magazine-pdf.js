const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const primaryPdfPath = path.join(publicDir, 'Nature_Mud_Product_Catalog.pdf');
const aliasPdfPath = path.join(publicDir, 'catalog.pdf');
const magazinePdfPath = path.join(publicDir, 'Nature_Mud_Magazine_Catalog.pdf');

// Cache sharp-optimized buffers in memory for high-speed generation
const imageCache = new Map();
async function getOptimizedImage(relPath, maxDim = 400) {
  if (!relPath) return null;
  const fullPath = path.isAbsolute(relPath) ? relPath : path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  const key = `${fullPath}_${maxDim}`;
  if (imageCache.has(key)) return imageCache.get(key);

  try {
    const buffer = await sharp(fullPath)
      .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    imageCache.set(key, buffer);
    return buffer;
  } catch (err) {
    console.warn(`Sharp resize failed for ${relPath}:`, err.message);
    try {
      const buf = fs.readFileSync(fullPath);
      imageCache.set(key, buf);
      return buf;
    } catch {
      return null;
    }
  }
}

// 24 Master Products with exact pricing, weights and benefits
const products = [
  // --- COLLECTION I: DRIED FRUITS ---
  {
    category: 'Dried Fruits',
    name: 'Dehydrated Mango Slices',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 595,
    mrp: 595,
    image: 'public/products/authentic-dehydrated-mango.jpg',
    origin: 'Mid-Hill Orchards, Nepal',
    benefit: 'High Beta-Carotene & Vitamin C',
    ingredients: '100% Tree-Ripened Himalayan Mango',
    ritual: 'Energizing mountain snack or diced into morning yogurt.'
  },
  {
    category: 'Dried Fruits',
    name: 'Dehydrated Pineapple Rings',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 495,
    mrp: 495,
    image: 'public/products/authentic-dehydrated-pineapple.jpg',
    origin: 'Sub-Himalayan Foothills, Nepal',
    benefit: 'Active Proteolytic Bromelain Enzyme',
    ingredients: '100% Pure Sun-Dehydrated Pineapple',
    ritual: 'Post-meal digestive snack or green smoothie booster.'
  },
  {
    category: 'Dried Fruits',
    name: 'Dehydrated Apple Slices',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 510,
    mrp: 510,
    image: 'public/products/dehydrated-apple.jpg',
    origin: 'Jumla Mountain Orchards (2,400m)',
    benefit: 'Pectin Prebiotic Fiber & Quercetin',
    ingredients: '100% Organic Jumla Mountain Apples',
    ritual: 'Healthy crisp bite for kids, tea pairing, or oatmeal.'
  },
  {
    category: 'Dried Fruits',
    name: 'Dehydrated Coconut Chips',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 495,
    mrp: 495,
    image: 'public/products/coconut-chips-100g.jpg',
    origin: 'Tropical River Valleys, Nepal',
    benefit: 'MCT Medium-Chain Triglyceride Energy',
    ingredients: '100% Pure Coconut Meat (Zero Sugar)',
    ritual: 'Keto snack, trail mixes, or crunchy smoothie bowl topping.'
  },
  {
    category: 'Dried Fruits',
    name: 'Dehydrated Papaya Slices',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 395,
    mrp: 395,
    image: 'public/products/papaya.jpg',
    origin: 'Organic Tarai Groves, Nepal',
    benefit: 'Papain Digestive Enzyme & Vitamin A',
    ingredients: '100% Pure Dehydrated Mountain Papaya',
    ritual: 'Digestive soothing snack between meals or hiking fuel.'
  },
  {
    category: 'Dried Fruits',
    name: 'Wild Dried Blueberries',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 650,
    mrp: 650,
    image: 'public/products/dried-blueberries-100g.jpg',
    origin: 'Sub-Alpine Mountain Slopes',
    benefit: 'Dense Anthocyanins for Neural Memory',
    ingredients: '100% Wild Himalayan Blueberries',
    ritual: 'Daily focus snack, brain food, or smoothie booster.'
  },

  // --- COLLECTION II: VITALITY POWDERS & ELIXIRS ---
  {
    category: 'Powders & Elixirs',
    name: 'Pure Dates Powder',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 400,
    mrp: 400,
    image: 'public/products/dates-powder-100g.jpg',
    origin: 'Sun-Cured Whole Fruit Pulp',
    benefit: 'Zero Sugar 1:1 Natural Fruit Sweetener',
    ingredients: '100% Micro-Milled Dehydrated Dates',
    ritual: 'Ideal baby food sweetener, herbal tea, milk, and porridge.'
  },
  {
    category: 'Powders & Elixirs',
    name: 'Pure Beetroot Powder',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 430,
    mrp: 430,
    image: 'public/products/beetroot-powder-100g.jpg',
    origin: 'Organic Valley Farms, Nepal',
    benefit: 'Concentrated Dietary Nitrates for Stamina',
    ingredients: '100% Stone-Ground Organic Beetroot',
    ritual: 'Stir 1 tsp into warm water 30 mins pre-workout or in lattes.'
  },
  {
    category: 'Powders & Elixirs',
    name: 'Organic Carrot Powder',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 490,
    mrp: 490,
    image: 'public/products/carrot-powder-100g.jpg',
    origin: 'Organic Terraced Farms, Nepal',
    benefit: '850% DV Beta-Carotene for Vision',
    ingredients: '100% Dehydrated Farm Carrots',
    ritual: 'Mix into baby weaning bowls, vegetable soups, or rotis.'
  },
  {
    category: 'Powders & Elixirs',
    name: 'Organic Sweet Potato Powder',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 510,
    mrp: 510,
    image: 'public/products/sweet-potato-powder-100g.jpg',
    origin: 'Highland Terraces, Nepal',
    benefit: 'Resistant Starch & Gut Microbiome Fuel',
    ingredients: '100% Pure Orange Sweet Potatoes',
    ritual: 'Easily digestible infant food or athletic complex carb fuel.'
  },
  {
    category: 'Powders & Elixirs',
    name: 'Himalayan Shilajit Resin',
    weight: '20 GM / 50 GM',
    pack: 'UV-Shield Glass Jar + Spoon',
    price: 1450,
    mrp: 1650,
    image: 'public/products/shilajit.jpg',
    origin: 'High Himalaya (18,000+ ft), Nepal',
    benefit: '75%+ Fulvic Acid & 84+ Trace Minerals',
    ingredients: '100% Purified Gold-Grade Shilajit',
    ritual: 'Dissolve rice-grain size in warm water or milk at dawn.'
  },
  {
    category: 'Powders & Elixirs',
    name: 'Extra Virgin Coconut Oil',
    weight: '180 ML / 500 ML',
    pack: 'Food-Grade Glass Bottle',
    price: 420,
    mrp: 420,
    image: 'public/products/coconut-oil.jpg',
    origin: 'Cold-Pressed Micro-Expeller',
    benefit: 'Lauric Acid & Bioactive Ketone Energy',
    ingredients: '100% Cold-Pressed Raw Coconut Milk',
    ritual: '1 spoonful morning detox, bulletproof coffee, skin & hair.'
  },

  // --- COLLECTION III: NUTS & SEEDS ---
  {
    category: 'Nuts & Seeds',
    name: 'Raw Pumpkin Seeds (Pepitas)',
    weight: '300 GM',
    pack: 'Airtight Seal Jar',
    price: 650,
    mrp: 700,
    image: 'public/products/pumpkin-seeds.jpg',
    origin: 'AAA-Grade Himalayan Harvest',
    benefit: 'Zinc & Magnesium for Sleep & Immunity',
    ingredients: '100% Raw Unroasted Pumpkin Pepitas',
    ritual: 'Handful daily for deep restorative sleep & hormonal health.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Organic Black Chia Seeds',
    weight: '300 GM',
    pack: 'Airtight Seal Jar',
    price: 495,
    mrp: 495,
    image: 'public/products/chia-seeds.jpg',
    origin: 'Organic Mountain Slopes',
    benefit: 'Plant Omega-3 & Hydrophilic Hydration',
    ingredients: '100% Certified Black Chia Seeds',
    ritual: 'Soak 1 tbsp in water, lemon drink, or oats for endurance.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Premium Jumbo Cashews (W240)',
    weight: '200 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 750,
    mrp: 750,
    image: 'public/products/cashewnuts.jpg',
    origin: 'Single-Origin Hand-Graded',
    benefit: 'Monounsaturated Fats, Copper & Protein',
    ingredients: '100% Raw Whole W240 Cashews',
    ritual: 'Luxury snack, homemade cashew cream, or energy bowls.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Artisanal Roasted Cashews',
    weight: '150 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-cashewnuts-roasted.jpg',
    origin: 'Small-Batch Himalayan Roastery',
    benefit: 'Crunchy Protein Snack (0 Oil, 0 Salt)',
    ingredients: '100% Dry-Roasted Whole Cashews',
    ritual: 'Clean afternoon protein snack with green mountain tea.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Raw Mountain Almonds',
    weight: '200 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-almonds.jpg',
    origin: 'Jumla Foothills (Cold Climate)',
    benefit: 'Vitamin E Antioxidants & Memory Support',
    ingredients: '100% Raw Unpasteurized Almonds',
    ritual: 'Soak 5-7 nuts overnight; peel and eat at sunrise for memory.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Slow-Roasted Mountain Almonds',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-almonds.jpg',
    origin: 'Himalayan Roastery, Nepal',
    benefit: 'Crisp Heart-Healthy Natural Energy',
    ingredients: '100% Slow Dry-Roasted Almonds',
    ritual: 'Healthy midday desk fuel or chopped over desserts.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Premium Roasted Pistachios',
    weight: '200 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 820,
    mrp: 820,
    image: 'public/products/pistachios.jpg',
    origin: 'Naturally Sun-Opened In-Shell',
    benefit: 'Lutein, Zeaxanthin & Heart Polyphenols',
    ingredients: '100% Naturally Split Pistachios',
    ritual: 'Antioxidant-dense evening snack or salad garnish.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Superfood Trail Mix',
    weight: '200 GM',
    pack: 'Standup Ziplock Pouch',
    price: 790,
    mrp: 790,
    image: 'public/products/superfood-mix.jpg',
    origin: 'Curated Himalayan Nut & Berry Blend',
    benefit: 'Balanced Macro Energy & Trace Minerals',
    ingredients: 'Almonds, Cashews, Berries, Pumpkin & Chia Seeds',
    ritual: 'Trekking trail fuel, gym bag essential, or breakfast topper.'
  },
  {
    category: 'Nuts & Seeds',
    name: 'Premium Macadamia Nuts',
    weight: '200 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 1100,
    mrp: 1100,
    image: 'public/products/macadamia.jpg',
    origin: 'Gourmet Single-Estate Harvest',
    benefit: 'Palmitoleic Acid for Cellular Youth',
    ingredients: '100% Raw Gourmet Macadamia Halves',
    ritual: 'Buttery low-carb luxury snack or paired with dark cacao.'
  },

  // --- COLLECTION IV: MINERAL SALTS & BERRIES ---
  {
    category: 'Salts & Berries',
    name: 'Dried Whole Cranberries',
    weight: '100 GM',
    pack: 'Standup Ziplock Pouch',
    price: 415,
    mrp: 415,
    image: 'public/products/cranberries.jpg',
    origin: 'Sub-Alpine Mountain Harvest',
    benefit: 'Proanthocyanidins (PACs) for Urinary Defense',
    ingredients: '100% Whole Sun-Dried Cranberries',
    ritual: 'Daily urinary defense snack or stirred into warm porridge.'
  },
  {
    category: 'Salts & Berries',
    name: 'Himalayan Pink Rock Salt',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 250,
    mrp: 250,
    image: 'public/products/pink-salt.jpg',
    origin: 'Ancient Himalayan Mineral Beds',
    benefit: '84+ Natural Electrolytes (0 Microplastics)',
    ingredients: '100% Unrefined Himalayan Pink Rock Salt',
    ritual: 'Daily clean cooking, mineral water detox, or electrolyte drink.'
  },
  {
    category: 'Salts & Berries',
    name: 'Himalayan Black Salt (Bire Noon)',
    weight: '100 GM',
    pack: 'Aroma-Lock Glass Jar',
    price: 220,
    mrp: 220,
    image: 'public/products/himalayan-black-salt-digestive.jpg',
    origin: 'Traditional Ayurvedic Kiln Formations',
    benefit: 'Active Sulfur Compounds for Digestive Agni',
    ingredients: '100% Authentic Himalayan Kala Namak',
    ritual: 'Sprinkle on fruits, salads, chaats, or warm lemon water.'
  }
];

async function generateMasterCatalogPDF() {
  console.log('📖 Generating Exact 8-Page Master Magazine Catalog...');

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 28;
  const contentWidth = pageWidth - margin * 2; // 539.28

  // Global document with ZERO automatic margins to completely eliminate blank pages
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: false,
    bufferPages: true,
    info: {
      Title: "Nature's Mud — Official 2026 Master Product Catalog & Price List",
      Author: "Nature's Mud Nepal Pvt. Ltd.",
      Subject: 'High-Altitude Himalayan Superfoods, Dehydrated Fruits, Seeds & Shilajit',
      Keywords: "Nature's Mud, Himalayan Superfoods, Product Catalog, Organic Nepal, Wholesale",
      CreationDate: new Date(),
    }
  });

  const stream = fs.createWriteStream(primaryPdfPath);
  doc.pipe(stream);

  // Color Palette
  const C_DARK = '#0B1C14';
  const C_FOREST = '#132B20';
  const C_EMERALD = '#1B3D2F';
  const C_PINE = '#2D5A27';
  const C_GOLD = '#C9982A';
  const C_BRIGHT_GOLD = '#E1B33E';
  const C_CHAMPAGNE = '#F5ECD0';
  const C_CREAM = '#FAF7F2';
  const C_WHITE = '#FFFFFF';
  const C_INK = '#1E2421';
  const C_MUTED = '#5A6760';
  const C_BORDER = '#E2DDD4';
  const C_CARD_BG = '#FFFFFF';
  const C_INNER_BOX = '#F4EFE6';

  // Helper: Draw standardized editorial header and footer
  function drawEditorialChrome(sectionTitle, pageNum) {
    doc.save();

    // Top Running Bar
    doc.rect(margin, 16, contentWidth, 24).fill(C_FOREST);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text("NATURE'S MUD NEPAL", margin + 12, 23.5);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text("•   THE HIMALAYAN EDIT 2026", margin + 115, 24);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(sectionTitle.toUpperCase(), pageWidth - margin - 220, 24, { align: 'right', width: 210 });

    // Gold Hairline Divider
    doc.rect(margin, 40, contentWidth, 1.5).fill(C_GOLD);

    // Bottom Running Footer Bar
    doc.rect(margin, pageHeight - 30, contentWidth, 0.8).fill('#D5CDC0');
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(
      'Nature\'s Mud Nepal  |  Samakhushi, Kathmandu  |  Order WhatsApp: +977 9819844486  |  www.naturesmud.shop',
      margin,
      pageHeight - 22,
      { width: contentWidth - 85 }
    );
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8).text(
      `PAGE ${pageNum} OF 8`,
      pageWidth - margin - 80,
      pageHeight - 22,
      { align: 'right', width: 80 }
    );

    doc.restore();
  }

  // =========================================================================
  // PAGE 1: MAJESTIC LUXURY COVER
  // =========================================================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_DARK);

  // Double Gold Border
  doc.lineWidth(1.8).strokeColor(C_GOLD).rect(18, 18, pageWidth - 36, pageHeight - 36).stroke();
  doc.lineWidth(0.6).strokeColor(C_GOLD).rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();

  // Gold Corner Squares
  const cornerSize = 12;
  [[22, 22], [pageWidth - 22 - cornerSize, 22], [22, pageHeight - 22 - cornerSize], [pageWidth - 22 - cornerSize, pageHeight - 22 - cornerSize]].forEach(([cx, cy]) => {
    doc.rect(cx, cy, cornerSize, cornerSize).fill(C_GOLD);
  });

  // Top Kicker Badge
  doc.roundedRect(pageWidth / 2 - 140, 42, 280, 22, 11).fillAndStroke(C_FOREST, C_GOLD);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(
    '★ OFFICIAL 2026 MASTER COMPENDIUM & PRICE LIST ★',
    0,
    49,
    { align: 'center', width: pageWidth }
  );

  // Main Brand Name
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(36).text(
    "NATURE'S MUD",
    0,
    74,
    { align: 'center', width: pageWidth }
  );

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(12).text(
    'T H E   H I M A L A Y A N   E D I T',
    0,
    116,
    { align: 'center', width: pageWidth }
  );

  doc.fillColor('#A9BEB4').font('Helvetica').fontSize(9).text(
    '100% Pure High-Altitude Botanicals  ·  Solar-Dehydrated Fruits  ·  Mountain Terroir',
    0,
    134,
    { align: 'center', width: pageWidth }
  );

  // Visual Showcase Box
  const coverVisualY = 158;
  const coverVisualW = contentWidth;
  const coverVisualH = 340;
  const coverVisualX = margin;

  doc.roundedRect(coverVisualX, coverVisualY, coverVisualW, coverVisualH, 8).fill('#0E2319');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(coverVisualX, coverVisualY, coverVisualW, coverVisualH, 8).stroke();

  const coverImgPath = 'public/images/posters/healthy_food_jars_on_pedestals_202608122122.jpeg';
  const coverBuf = await getOptimizedImage(coverImgPath, 700);
  if (coverBuf) {
    doc.save();
    doc.roundedRect(coverVisualX + 6, coverVisualY + 6, coverVisualW - 12, coverVisualH - 12, 6).clip();
    doc.image(coverBuf, coverVisualX + 6, coverVisualY + 6, {
      width: coverVisualW - 12,
      height: coverVisualH - 12,
      fit: [coverVisualW - 12, coverVisualH - 12],
      align: 'center',
      valign: 'center'
    });
    // Dark bottom overlay for text readability
    doc.rect(coverVisualX + 6, coverVisualY + coverVisualH - 85, coverVisualW - 12, 79).fillOpacity(0.88).fill(C_DARK);
    doc.restore();
  }

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(13.5).text(
    '24 MASTER ORGANIC SUPERFOODS & MOUNTAIN ELIXIRS',
    coverVisualX + 12,
    coverVisualY + coverVisualH - 68,
    { width: coverVisualW - 24, align: 'center' }
  );
  doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(
    'Comprehensive price list, laboratory-tested single origins, full transparency & dietary usage guide',
    coverVisualX + 12,
    coverVisualY + coverVisualH - 48,
    { width: coverVisualW - 24, align: 'center' }
  );

  // 4 Quality Pillars Grid
  const pGridY = 516;
  const pBoxW = (contentWidth - 14) / 2;
  const pBoxH = 55;

  const coverPillars = [
    { title: 'I. Solar Dehydration < 42°C', desc: 'Preserves living enzymes, delicate vitamins & natural mountain fruit aromas.' },
    { title: 'II. 180+ Mountain Family Farms', desc: 'Direct single-origin sourcing from pristine valleys in Jumla, Mustang & Dang.' },
    { title: 'III. Zero Synthetic Additives', desc: '100% whole foods with 0 preservatives, 0 chemical sulfites & 0 artificial dyes.' },
    { title: 'IV. Food-Grade UV Protection', desc: 'Hermetically sealed standup pouches & heavyweight glass preserving bioactivity.' }
  ];

  coverPillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const px = margin + col * (pBoxW + 14);
    const py = pGridY + row * (pBoxH + 10);

    doc.roundedRect(px, py, pBoxW, pBoxH, 5).fill('#13291F');
    doc.lineWidth(0.6).strokeColor(C_GOLD).roundedRect(px, py, pBoxW, pBoxH, 5).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(p.title, px + 10, py + 8);
    doc.fillColor('#D0DFD8').font('Helvetica').fontSize(7.5).text(p.desc, px + 10, py + 22, { width: pBoxW - 20, lineGap: 2 });
  });

  // Ribbon Banner
  const ribbonY = 658;
  doc.roundedRect(margin + 40, ribbonY, contentWidth - 80, 26, 6).fill(C_GOLD);
  doc.fillColor(C_DARK).font('Helvetica-Bold').fontSize(9.5).text(
    '★ NEPAL BUREAU OF STANDARDS & FOOD HYGIENE CERTIFIED ★',
    margin + 40,
    ribbonY + 8,
    { align: 'center', width: contentWidth - 80 }
  );

  // Cover Footer
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(10).text(
    "Nature's Mud Nepal Pvt. Ltd.  •  Kathmandu, Nepal",
    0,
    712,
    { align: 'center', width: pageWidth }
  );
  doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8.5).text(
    'Direct Delivery & WhatsApp Support: +977 9819844486  |  +977 9713888002  |  info@naturesmud.shop',
    0,
    728,
    { align: 'center', width: pageWidth }
  );
  doc.fillColor('#94AFA2').font('Helvetica').fontSize(8).text(
    'Official Online Store: https://naturesmud.shop  •  Volume 2026 Master Edition',
    0,
    744,
    { align: 'center', width: pageWidth }
  );

  // =========================================================================
  // PAGE 2: BRAND HERITAGE, QUALITY PILLARS & COMPLETE TABLE OF CONTENTS
  // =========================================================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_CREAM);
  drawEditorialChrome('Brand Heritage & Product Index', 2);

  // Section Header Box
  doc.rect(margin, 48, contentWidth, 34).fill(C_INNER_BOX);
  doc.lineWidth(0.8).strokeColor(C_BORDER).rect(margin, 48, contentWidth, 34).stroke();
  doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(13.5).text('THE HIMALAYAN PURITY MANIFESTO', margin + 12, 58);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('TRACEABLE MOUNTAIN NUTRITION', pageWidth - margin - 200, 60, { align: 'right', width: 190 });

  // Two Main Columns
  const c2ColW = (contentWidth - 16) / 2;
  const c2LeftX = margin;
  const c2RightX = margin + c2ColW + 16;
  const c2BodyY = 92;

  // Left Column: The Nature's Mud Story & Principles
  doc.roundedRect(c2LeftX, c2BodyY, c2ColW, 490, 6).fill(C_WHITE);
  doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(c2LeftX, c2BodyY, c2ColW, 490, 6).stroke();

  doc.rect(c2LeftX, c2BodyY, c2ColW, 25).fill(C_FOREST);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(9).text('OUR PHILOSOPHY & ETHICS', c2LeftX + 10, c2BodyY + 7);

  const storyBody =
    "Founded in Kathmandu, Nature's Mud was built with a singular mission: to bring pristine, unprocessed Himalayan superfoods directly from high-altitude smallholder farmers into urban homes with absolute purity.\n\n" +
    "Most commercial dried fruits and packaged superfoods are treated with sulfur dioxide for bleaching, drenched in liquid glucose syrup, or fried in cheap industrial oils. At Nature's Mud, we operate on 100% pure whole food principles.\n\n" +
    "• Single-Origin Terroir: Sourced across Jumla (2,400m), Mustang (2,800m), Dang, and the pristine river basins of Nepal.\n" +
    "• Low-Heat Solar Airflow (<42°C): Retains natural enzymes (bromelain, papain), raw vitamin complexes, and active antioxidants.\n" +
    "• Zero Additives Guarantee: No sugar, no salt glazes, no sulfur, no starch carriers, and zero chemical preservatives.\n" +
    "• Clean Glass & Barrier Packaging: Preserves medicinal and nutritional potency without microplastic contamination.";

  doc.fillColor(C_MUTED).font('Helvetica').fontSize(8.2).text(storyBody, c2LeftX + 12, c2BodyY + 34, {
    width: c2ColW - 24,
    lineGap: 3.5
  });

  // Purity Stamp Box inside Left Column
  doc.roundedRect(c2LeftX + 10, c2BodyY + 380, c2ColW - 20, 95, 5).fill('#EDF4F0');
  doc.lineWidth(0.6).strokeColor(C_PINE).roundedRect(c2LeftX + 10, c2BodyY + 380, c2ColW - 20, 95, 5).stroke();
  doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(8.5).text('🌿 OUR 5 PURITY COMMITMENTS', c2LeftX + 18, c2BodyY + 390);
  doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(
    '1. 100% Plant Ingredients — Zero animal derivatives\n' +
    '2. 0 Chemical Preservatives — Natural freshness preservation\n' +
    '3. 0 Added Refined Sugar — Natural unadulterated fruit sugars only\n' +
    '4. Direct Mountain Farm Trade — Fair compensation for Nepali growers\n' +
    '5. Rigorous Laboratory Testing — Heavy metals & moisture compliance',
    c2LeftX + 18,
    c2BodyY + 406,
    { lineGap: 3 }
  );

  // Right Column: Table of Contents & Category Overview
  doc.roundedRect(c2RightX, c2BodyY, c2ColW, 490, 6).fill(C_WHITE);
  doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(c2RightX, c2BodyY, c2ColW, 490, 6).stroke();

  doc.rect(c2RightX, c2BodyY, c2ColW, 25).fill(C_EMERALD);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(9).text('CATALOG TABLE OF CONTENTS', c2RightX + 10, c2BodyY + 7);

  const tocEntries = [
    {
      num: '01',
      title: 'Himalayan Sun-Dehydrated Fruits',
      page: 'Page 3',
      desc: 'Mango, Pineapple, Jumla Apple, Coconut Chips, Papaya, Blueberries'
    },
    {
      num: '02',
      title: 'Vitality Powders & Mountain Elixirs',
      page: 'Page 4',
      desc: 'Dates Sweetener, Beetroot, Carrot, Sweet Potato, Shilajit, Coconut Oil'
    },
    {
      num: '03',
      title: 'Mountain Nuts, Seeds & Mineral Salts',
      page: 'Page 5',
      desc: 'Pumpkin Seeds, Chia, Cashews, Almonds, Pistachios, Trail Mix, Rock Salts'
    },
    {
      num: '04',
      title: 'Master Price List & Nutrition Matrix',
      page: 'Page 6',
      desc: 'Complete 24-product master table with SKU, net weight, MRP & pricing'
    },
    {
      num: '05',
      title: 'B2B Wholesale, Bulk & Storage Guide',
      page: 'Page 7',
      desc: 'Commercial dealer tiers, corporate gift hampers & product storage rules'
    },
    {
      num: '06',
      title: 'How to Order, Delivery & Contacts',
      page: 'Page 8',
      desc: 'Online webstore, WhatsApp ordering, Fonepay QR, delivery terms & hotline'
    }
  ];

  let tY = c2BodyY + 34;
  tocEntries.forEach((t) => {
    doc.roundedRect(c2RightX + 10, tY, c2ColW - 20, 66, 4).fill(C_INNER_BOX);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(t.num, c2RightX + 16, tY + 8);
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(9).text(t.title, c2RightX + 38, tY + 8);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(t.page, c2RightX + c2ColW - 75, tY + 8, { align: 'right', width: 45 });
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(t.desc, c2RightX + 38, tY + 24, { width: c2ColW - 54, lineGap: 2 });
    tY += 74;
  });

  // Bottom Wellness Routine Banner
  const rBannerY = 594;
  doc.roundedRect(margin, rBannerY, contentWidth, 205, 6).fill(C_FOREST);
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(margin, rBannerY, contentWidth, 205, 6).stroke();

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(11).text(
    'THE DAILY NATURE\'S MUD WELLNESS RITUAL',
    margin + 16,
    rBannerY + 12,
    { align: 'center', width: contentWidth - 32 }
  );
  doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text(
    'A balanced daily cycle of bioavailable mountain superfoods for energy, cellular resilience, and restorative sleep',
    margin + 16,
    rBannerY + 26,
    { align: 'center', width: contentWidth - 32 }
  );

  const steps = [
    {
      time: '☀️ DAWN / MORNING',
      action: 'Wake Up & Cellular Oxygenation',
      items: '• Himalayan Shilajit Resin (rice-grain size in warm spring water)\n• 1 tsp Beetroot Powder + 1 tbsp Chia Seeds in lemon water\n• Soaked Himalayan Mountain Almonds (peeled)'
    },
    {
      time: '⚡ MIDDAY / AFTERNOON',
      action: 'Sustained Brain & Muscle Energy',
      items: '• Handful of Wild Blueberries & Dehydrated Pineapple\n• Superfood Trail Mix (Almonds, Cashews & Seeds)\n• Virgin Coconut Oil in warm tea or coffee'
    },
    {
      time: '🌙 EVENING / NIGHT',
      action: 'Digestion & Restorative Sleep',
      items: '• 30g Raw Pumpkin Seeds (high Zinc & Magnesium for deep sleep)\n• Dates Powder as natural nightcap sweetener in warm milk\n• Pinch of Himalayan Black Salt for digestive comfort'
    }
  ];

  const sBoxW = (contentWidth - 28) / 3;
  steps.forEach((s, idx) => {
    const sx = margin + 10 + idx * (sBoxW + 4);
    const sy = rBannerY + 46;

    doc.roundedRect(sx, sy, sBoxW, 145, 5).fill('#0E2319');
    doc.lineWidth(0.5).strokeColor(C_GOLD).roundedRect(sx, sy, sBoxW, 145, 5).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(s.time, sx + 8, sy + 8);
    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(7.5).text(s.action, sx + 8, sy + 22, { width: sBoxW - 16 });
    doc.fillColor('#D3E1DA').font('Helvetica').fontSize(7.2).text(s.items, sx + 8, sy + 38, { width: sBoxW - 16, lineGap: 3.5 });
  });

  // =========================================================================
  // HELPER: RENDER 6 PRODUCT EDITORIAL GRID (PAGES 3, 4, 5)
  // =========================================================================
  async function renderProductGridPage(pageTitle, pageNum, itemsList, collectionSubtitle) {
    doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
    doc.rect(0, 0, pageWidth, pageHeight).fill(C_CREAM);
    drawEditorialChrome(pageTitle, pageNum);

    // Category Header Banner
    doc.rect(margin, 46, contentWidth, 32).fill(C_FOREST);
    doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(12).text(pageTitle.toUpperCase(), margin + 12, 54);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text(collectionSubtitle, pageWidth - margin - 260, 56, { align: 'right', width: 250 });

    const gridY = 86;
    const colCount = 2;
    const cardW = (contentWidth - 12) / 2; // 263.64 pt
    const cardH = itemsList.length > 6 ? 168 : 228; // Adaptive height: 228 for 6 items, 168 for 8 items

    for (let idx = 0; idx < itemsList.length; idx++) {
      const p = itemsList[idx];
      const col = idx % colCount;
      const row = Math.floor(idx / colCount);
      const cx = margin + col * (cardW + 12);
      const cy = gridY + row * (cardH + 8);

      doc.save();

      // Card Container
      doc.roundedRect(cx, cy, cardW, cardH, 6).fill(C_CARD_BG);
      doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(cx, cy, cardW, cardH, 6).stroke();

      // Card Top Tag Bar
      doc.roundedRect(cx, cy, cardW, 20, 6).fill(C_INNER_BOX);
      doc.rect(cx, cy + 12, cardW, 8).fill(C_INNER_BOX);
      doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(7.5).text(p.category.toUpperCase(), cx + 8, cy + 6);
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(p.pack, cx + cardW - 130, cy + 6, { align: 'right', width: 122 });

      // Left Column: Thumbnail Photo + Weight + Price
      const thumbW = cardH > 200 ? 82 : 70;
      const thumbH = cardH > 200 ? 82 : 70;
      const thumbX = cx + 8;
      const thumbY = cy + 26;

      doc.roundedRect(thumbX, thumbY, thumbW, thumbH, 4).fill(C_INNER_BOX);
      doc.lineWidth(0.5).strokeColor(C_BORDER).roundedRect(thumbX, thumbY, thumbW, thumbH, 4).stroke();

      const imgBuf = await getOptimizedImage(p.image, 300);
      if (imgBuf) {
        doc.save();
        doc.roundedRect(thumbX + 2, thumbY + 2, thumbW - 4, thumbH - 4, 3).clip();
        doc.image(imgBuf, thumbX + 2, thumbY + 2, {
          width: thumbW - 4,
          height: thumbH - 4,
          fit: [thumbW - 4, thumbH - 4],
          align: 'center',
          valign: 'center'
        });
        doc.restore();
      }

      // Net Weight Tag
      const netY = thumbY + thumbH + 5;
      doc.roundedRect(thumbX, netY, thumbW, 16, 3).fill('#EAE6DC');
      doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(7.2).text(p.weight, thumbX, netY + 4.5, { align: 'center', width: thumbW });

      // Price Tag Box
      const priceY = netY + 20;
      const priceH = cardH > 200 ? 44 : 36;
      doc.roundedRect(thumbX, priceY, thumbW, priceH, 4).fill(C_EMERALD);
      doc.lineWidth(0.6).strokeColor(C_GOLD).roundedRect(thumbX, priceY, thumbW, priceH, 4).stroke();

      doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(6.5).text('OUR PRICE', thumbX + 4, priceY + 4);
      doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(cardH > 200 ? 12 : 10.5).text(`Rs. ${p.price}`, thumbX + 4, priceY + 14);
      if (p.mrp && p.mrp > p.price) {
        doc.fillColor('#A8C1B4').font('Helvetica').fontSize(6.8).text(`MRP Rs. ${p.mrp}`, thumbX + 4, priceY + (cardH > 200 ? 30 : 25));
      } else {
        doc.fillColor('#A8C1B4').font('Helvetica').fontSize(6.5).text('Tax Included', thumbX + 4, priceY + (cardH > 200 ? 30 : 25));
      }

      // Right Column: Product Name, Origin, Benefit & Usage
      const rX = thumbX + thumbW + 10;
      const rW = cardW - (thumbW + 24);
      let ry = cy + 25;

      // Product Title
      doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(cardH > 200 ? 10.5 : 9.5).text(p.name, rX, ry, { width: rW });
      ry += cardH > 200 ? 22 : 18;

      // Single-Origin Line
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.5).text(`📍 Origin: ${p.origin}`, rX, ry, { width: rW });
      ry += 13;

      // Key Benefit Box
      const bBoxH = cardH > 200 ? 38 : 30;
      doc.roundedRect(rX, ry, rW, bBoxH, 3).fill('#F0F6F2');
      doc.lineWidth(0.5).strokeColor('#CCDED3').roundedRect(rX, ry, rW, bBoxH, 3).stroke();
      doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(7).text('⭐ KEY HEALTH BENEFIT', rX + 6, ry + 4);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7).text(p.benefit, rX + 6, ry + 14, { width: rW - 12, lineGap: 1.5 });
      ry += bBoxH + 6;

      // Ingredients Line
      doc.fillColor(C_MUTED).font('Helvetica-Bold').fontSize(7).text('100% INGREDIENTS:', rX, ry);
      doc.fillColor(C_INK).font('Helvetica').fontSize(6.8).text(p.ingredients, rX + 75, ry, { width: rW - 75 });
      ry += cardH > 200 ? 18 : 14;

      // Ritual / Usage Box
      const uBoxH = cardH > 200 ? 44 : 32;
      doc.roundedRect(rX, ry, rW, uBoxH, 3).fill(C_INNER_BOX);
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(7).text('🍽️ HOW TO CONSUME:', rX + 6, ry + 4);
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.8).text(p.ritual, rX + 6, ry + 14, { width: rW - 12, lineGap: 1.5 });

      doc.restore();
    }
  }

  // =========================================================================
  // PAGE 3: COLLECTION I — HIMALAYAN SUN-DEHYDRATED FRUITS (6 ITEMS)
  // =========================================================================
  const driedFruits = products.slice(0, 6);
  await renderProductGridPage(
    'Collection I: Sun-Dehydrated Fruits & Berries',
    3,
    driedFruits,
    'Sub-42°C Solar Airflow · Zero Added Sugar · Zero Chemical Sulfites'
  );

  // =========================================================================
  // PAGE 4: COLLECTION II — VITALITY POWDERS & HIMALAYAN ELIXIRS (6 ITEMS)
  // =========================================================================
  const powdersAndElixirs = products.slice(6, 12);
  await renderProductGridPage(
    'Collection II: Vitality Powders & Mountain Elixirs',
    4,
    powdersAndElixirs,
    'Stone-Ground Botanicals · 75%+ Fulvic Shilajit · Zero Carriers'
  );

  // =========================================================================
  // PAGE 5: COLLECTION III — MOUNTAIN NUTS, SEEDS & MINERAL SALTS (8 ITEMS)
  // =========================================================================
  const nutsAndSeeds = products.slice(12, 20); // 8 products (Pumpkin, Chia, Cashews, Almonds, Pistachios, Trail Mix, Macadamia)
  await renderProductGridPage(
    'Collection III: Raw Mountain Nuts & Superfood Seeds',
    5,
    nutsAndSeeds,
    'Zinc-Rich Pepitas · Cold-Mountain Almonds · Jumbo W240 Cashews'
  );

  // =========================================================================
  // PAGE 6: COMPLETE MASTER SPECIFICATION & PRICE MATRIX (ALL 24 PRODUCTS)
  // =========================================================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_CREAM);
  drawEditorialChrome('Master Product Price Matrix & Specs', 6);

  // Section Header Box
  doc.rect(margin, 46, contentWidth, 32).fill(C_FOREST);
  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(12).text('COMPLETE 2026 MASTER PRODUCT & PRICE LIST', margin + 12, 54);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text('24 Active Superfoods · Official Retail & Wholesale Baseline', pageWidth - margin - 250, 56, { align: 'right', width: 240 });

  // Master Table Container
  const tableY = 84;
  const tableW = contentWidth;
  const tableH = 550;

  doc.roundedRect(margin, tableY, tableW, tableH, 5).fill(C_WHITE);
  doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(margin, tableY, tableW, tableH, 5).stroke();

  // Table Column Definitions
  const colX = {
    sn: margin + 6,
    name: margin + 30,
    cat: margin + 175,
    weight: margin + 250,
    pack: margin + 305,
    price: margin + 380,
    benefit: margin + 440
  };

  // Table Header Row
  doc.rect(margin, tableY, tableW, 22).fill(C_EMERALD);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.5);
  doc.text('#', colX.sn, tableY + 7);
  doc.text('PRODUCT NAME', colX.name, tableY + 7);
  doc.text('CATEGORY', colX.cat, tableY + 7);
  doc.text('WEIGHT', colX.weight, tableY + 7);
  doc.text('PACKING', colX.pack, tableY + 7);
  doc.text('PRICE (NPR)', colX.price, tableY + 7);
  doc.text('CORE NUTRITIONAL BENEFIT', colX.benefit, tableY + 7);

  // Render 24 Product Rows
  const rowH = 21.8;
  products.forEach((p, idx) => {
    const ry = tableY + 22 + idx * rowH;

    // Alternating Row Background
    if (idx % 2 === 1) {
      doc.rect(margin, ry, tableW, rowH).fill('#FBF9F5');
    }

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.2).text(String(idx + 1).padStart(2, '0'), colX.sn, ry + 6);
    doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(7.2).text(p.name, colX.name, ry + 6, { width: 140 });
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.8).text(p.category, colX.cat, ry + 6);
    doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(7).text(p.weight, colX.weight, ry + 6);
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.5).text(p.pack, colX.pack, ry + 6, { width: 70 });
    doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(7.5).text(`Rs. ${p.price}`, colX.price, ry + 6);
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.5).text(p.benefit, colX.benefit, ry + 6, { width: 95 });

    // Hairline row divider
    if (idx < products.length - 1) {
      doc.rect(margin, ry + rowH, tableW, 0.4).fill('#EFEAE1');
    }
  });

  // Bottom Clinical Nutritional Matrix Box
  const nGuideY = 642;
  doc.roundedRect(margin, nGuideY, contentWidth, 155, 6).fill(C_FOREST);
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(margin, nGuideY, contentWidth, 155, 6).stroke();

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(10).text(
    'TARGETED NUTRITIONAL GOALS & PRODUCT PAIRINGS',
    margin + 16,
    nGuideY + 10,
    { align: 'center', width: contentWidth - 32 }
  );

  const nCards = [
    {
      goal: '🛡️ IMMUNITY & COLD-DEFENSE',
      products: 'Dehydrated Mango · Pineapple · Cranberries · Carrot Powder',
      benefit: 'Packed with bioactive Vitamin C, Pro-Vitamin A beta-carotenes & anthocyanin antioxidants.'
    },
    {
      goal: '⚡ GYM RECOVERY & STAMINA',
      products: 'Beetroot Powder · Shilajit Resin · Pumpkin Seeds · Almonds',
      benefit: 'Natural nitric oxide blood flow, high plant zinc, magnesium, and endurance electrolytes.'
    },
    {
      goal: '🧠 BRAIN COGNITION & MEMORY',
      products: 'Wild Dried Blueberries · Raw Almonds · Black Chia · Cashews',
      benefit: 'Rich in polyphenols, Omega-3 fatty acids, natural Vitamin E & neurotransmitter minerals.'
    },
    {
      goal: '👶 KIDS & FAMILY WEANING',
      products: 'Dates Powder · Sweet Potato Powder · Carrot Powder',
      benefit: '100% whole-food infant nutrition with zero sugar, zero starch fillers & gentle fiber.'
    }
  ];

  const ncW = (contentWidth - 28) / 2;
  const ncH = 50;
  nCards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const ncx = margin + 10 + col * (ncW + 8);
    const ncy = nGuideY + 34 + row * (ncH + 8);

    doc.roundedRect(ncx, ncy, ncW, ncH, 4).fill('#0E2319');
    doc.lineWidth(0.5).strokeColor(C_GOLD).roundedRect(ncx, ncy, ncW, ncH, 4).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.8).text(c.goal, ncx + 8, ncy + 6);
    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(7).text(c.products, ncx + 8, ncy + 17, { width: ncW - 16 });
    doc.fillColor('#C8D8D0').font('Helvetica').fontSize(6.5).text(c.benefit, ncx + 8, ncy + 28, { width: ncW - 16, lineGap: 1.5 });
  });

  // =========================================================================
  // PAGE 7: B2B WHOLESALE, BULK SUPPLY, CORPORATE GIFTING & STORAGE RULES
  // =========================================================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_CREAM);
  drawEditorialChrome('B2B Wholesale & Storage Specifications', 7);

  // Section Header Box
  doc.rect(margin, 46, contentWidth, 32).fill(C_FOREST);
  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(12).text('COMMERCIAL WHOLESALE, B2B & CORPORATE GIFTING', margin + 12, 54);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text('Volume Discounts · Custom Wooden Hampers · Bulk Food-Service', pageWidth - margin - 270, 56, { align: 'right', width: 260 });

  // 3 Large Structured Editorial Sections
  const b2bCardW = contentWidth;
  const b2bY1 = 86;
  const b2bH1 = 185;

  // Block 1: Commercial B2B Wholesale & Mart Supply
  doc.roundedRect(margin, b2bY1, b2bCardW, b2bH1, 6).fill(C_WHITE);
  doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(margin, b2bY1, b2bCardW, b2bH1, 6).stroke();

  doc.rect(margin, b2bY1, b2bCardW, 25).fill(C_FOREST);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text('💼 B2B WHOLESALE & RETAIL RESELLER TIERS', margin + 12, b2bY1 + 7);

  const b2bContent =
    "Nature's Mud supplies certified organic supermarkets, luxury boutique hotels, wellness resorts, cafes, and healthcare pharmacies across Nepal with tiered commercial discounts:\n\n" +
    "• Tier 1 (Starter Retail Reseller): Minimum order Rs. 25,000 — 15% wholesale discount with free store merchandising stands.\n" +
    "• Tier 2 (Commercial Supermarts & Chains): Minimum order Rs. 75,000 — 22% margin tier, customized shelf POS, and priority batch delivery.\n" +
    "• Tier 3 (Master Regional Distributors): Volume distributor agreements with dedicated regional exclusivity and factory pricing.\n" +
    "• Bulk Food-Service Packaging: Available in 1kg, 5kg, and 10kg multi-barrier nitrogen-flushed food-grade bags for high-end bakeries, culinary chefs, and smoothie bars.\n" +
    "• Direct B2B WhatsApp Desk: Immediate commercial quotes and sample box dispatch at +977 9819844486.";

  doc.fillColor(C_MUTED).font('Helvetica').fontSize(8.2).text(b2bContent, margin + 14, b2bY1 + 34, {
    width: b2bCardW - 28,
    lineGap: 3.5
  });

  // Block 2: Corporate Wellness Gifting & Custom Hampers
  const b2bY2 = b2bY1 + b2bH1 + 14;
  const b2bH2 = 185;

  doc.roundedRect(margin, b2bY2, b2bCardW, b2bH2, 6).fill(C_WHITE);
  doc.lineWidth(0.8).strokeColor(C_BORDER).roundedRect(margin, b2bY2, b2bCardW, b2bH2, 6).stroke();

  doc.rect(margin, b2bY2, b2bCardW, 25).fill(C_EMERALD);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text('🎁 LUXURY CORPORATE GIFTING & FESTIVAL HAMPERS', margin + 12, b2bY2 + 7);

  const giftContent =
    "Elevate your corporate gifting, Dashain, Tihar, and executive events with our bespoke, handcrafted Himalayan wellness hampers:\n\n" +
    "• Custom Engraved Wooden Hampers: Premium pine-wood keepsake boxes laser-engraved with your company's corporate identity & logo.\n" +
    "• Tailored Product Configurations: Mix and match dry-roasted cashews, wild blueberries, raw shilajit, organic dates sweetener, and mountain almonds.\n" +
    "• Personal Executive Note Cards: High-gsm gold-foiled greeting cards with personalized executive messages.\n" +
    "• Pan-Nepal & International Delivery: Direct doorstep dispatch to VIP clients, board members, and staff nationwide.\n" +
    "• Custom Corporate Invoicing: Fully VAT-compliant corporate billing and formal quotations provided within 2 business hours.";

  doc.fillColor(C_MUTED).font('Helvetica').fontSize(8.2).text(giftContent, margin + 14, b2bY2 + 34, {
    width: b2bCardW - 28,
    lineGap: 3.5
  });

  // Block 3: Storage, Handling & Purity Maintenance Guidelines
  const b2bY3 = b2bY2 + b2bH2 + 14;
  const b2bH3 = 230;

  doc.roundedRect(margin, b2bY3, b2bCardW, b2bH3, 6).fill(C_FOREST);
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(margin, b2bY3, b2bCardW, b2bH3, 6).stroke();

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(10).text(
    '📦 OFFICIAL PRODUCT STORAGE, HANDLING & SHELF-LIFE SPECIFICATIONS',
    margin + 16,
    b2bY3 + 12,
    { align: 'center', width: b2bCardW - 32 }
  );

  const storagePointers = [
    {
      title: '🌡️ Temperature & Sunlight Control',
      body: 'Keep all dehydrated fruits, nuts, and glass jars in a cool, dry pantry away from direct sunlight and stovetop heat. Ideal storage temperature: 15°C to 24°C.'
    },
    {
      title: '🔒 Air-Tight Seal Preservation',
      body: 'Always push out excess air and pinch the ziplock tightly shut immediately after opening. For glass jars, screw the gold metal lid firmly to maintain the internal aroma-lock seal.'
    },
    {
      title: '🕒 Certified Shelf Life (12 Months)',
      body: 'Every Nature\'s Mud product maintains peak bioactive potency for 12 months from packing. Once opened, consume within 60 days for maximum crispness and enzyme integrity.'
    },
    {
      title: '🌿 100% Natural Behavior Notice',
      body: 'Because our powders contain ZERO anti-caking silica or chemical dispersants, slight natural clumping in date or sweet potato powder is completely normal. Simply shake or stir with a dry spoon.'
    }
  ];

  const spBoxW = (b2bCardW - 32) / 2;
  const spBoxH = 78;
  storagePointers.forEach((sp, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const spx = margin + 12 + col * (spBoxW + 8);
    const spy = b2bY3 + 34 + row * (spBoxH + 8);

    doc.roundedRect(spx, spy, spBoxW, spBoxH, 4).fill('#0E2319');
    doc.lineWidth(0.5).strokeColor(C_GOLD).roundedRect(spx, spy, spBoxW, spBoxH, 4).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8).text(sp.title, spx + 8, spy + 6);
    doc.fillColor('#D3E2DB').font('Helvetica').fontSize(7.2).text(sp.body, spx + 8, spy + 20, { width: spBoxW - 16, lineGap: 2 });
  });

  // =========================================================================
  // PAGE 8: LUXURY BACK COVER — HOW TO ORDER, NATIONWIDE DELIVERY & CONTACTS
  // =========================================================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_DARK);

  // Double Gold Border
  doc.lineWidth(1.8).strokeColor(C_GOLD).rect(18, 18, pageWidth - 36, pageHeight - 36).stroke();
  doc.lineWidth(0.6).strokeColor(C_GOLD).rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();

  // Corner Gold Squares
  [[22, 22], [pageWidth - 22 - cornerSize, 22], [22, pageHeight - 22 - cornerSize], [pageWidth - 22 - cornerSize, pageHeight - 22 - cornerSize]].forEach(([cx, cy]) => {
    doc.rect(cx, cy, cornerSize, cornerSize).fill(C_GOLD);
  });

  // Top Header Badge
  doc.roundedRect(pageWidth / 2 - 150, 42, 300, 22, 11).fillAndStroke(C_FOREST, C_GOLD);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(
    'NATIONWIDE FULFILLMENT & HOW TO ORDER',
    0,
    49,
    { align: 'center', width: pageWidth }
  );

  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(26).text(
    "NATURE'S MUD NEPAL",
    0,
    74,
    { align: 'center', width: pageWidth }
  );
  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica').fontSize(10.5).text(
    'Official Master Catalog & Price Guide 2026 • Kathmandu, Nepal',
    0,
    104,
    { align: 'center', width: pageWidth }
  );

  // 3 Clear Operational Information Blocks
  const b8CardW = contentWidth;
  const b8Y1 = 126;
  const b8H1 = 135;

  // Block 1: How to Order Step-by-Step
  doc.roundedRect(margin, b8Y1, b8CardW, b8H1, 6).fill('#13291F');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(margin, b8Y1, b8CardW, b8H1, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10.5).text('🛒 3 EASY WAYS TO PLACE YOUR ORDER', margin + 14, b8Y1 + 10);

  const orderWays = [
    {
      step: '1. Official Webstore',
      desc: 'Visit https://naturesmud.shop — browse complete products, add to cart, and enjoy seamless instant digital checkout.'
    },
    {
      step: '2. WhatsApp Direct Order',
      desc: 'Send your product list or invoice request to +977 9819844486 / +977 9713888002. Our concierge team confirms immediately.'
    },
    {
      step: '3. Instant Fonepay / QR Scan',
      desc: 'Scan our official Fonepay QR code using any Nepali bank app, eSewa, or Khalti for instant pre-paid order dispatch.'
    }
  ];

  orderWays.forEach((w, idx) => {
    const wy = b8Y1 + 30 + idx * 32;
    doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(8.5).text(w.step, margin + 14, wy);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(7.5).text(w.desc, margin + 14, wy + 12, { width: b8CardW - 28 });
  });

  // Block 2: Nationwide Delivery Network & Payment Terms
  const b8Y2 = b8Y1 + b8H1 + 12;
  const b8H2 = 145;

  doc.roundedRect(margin, b8Y2, b8CardW, b8H2, 6).fill('#13291F');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(margin, b8Y2, b8CardW, b8H2, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10.5).text('🚚 NATIONWIDE FAST DISPATCH & PAYMENT METHODS', margin + 14, b8Y2 + 10);

  const deliveryPoints = [
    '• Kathmandu Valley Express: Same-day or guaranteed next-day delivery straight to your home or office.',
    '• All 77 Districts Nationwide: Fast 2 to 4 business days insured courier dispatch across all provinces in Nepal.',
    '• FREE SHIPPING THRESHOLD: Complimentary delivery across all orders exceeding Rs. 3,000.',
    '• Flexible Payment Choices: Cash on Delivery (COD) available inside Kathmandu & major hub cities. Digital Pre-payment via Fonepay QR, eSewa, Khalti, ConnectIPS, and Mobile Banking.',
    '• Transit Guarantee: Heavy-duty shock-insulated protective packaging ensuring glass jars arrive 100% intact.'
  ];

  let dpy = b8Y2 + 30;
  deliveryPoints.forEach((dp) => {
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(7.8).text(dp, margin + 14, dpy, { width: b8CardW - 28 });
    dpy += 21;
  });

  // Block 3: Flagship Store, Contacts & QR Scan
  const b8Y3 = b8Y2 + b8H2 + 12;
  const b8H3 = 238;

  doc.roundedRect(margin, b8Y3, b8CardW, b8H3, 6).fill('#0E2218');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(margin, b8Y3, b8CardW, b8H3, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text('CONNECT WITH NATURE\'S MUD NEPAL', margin + 16, b8Y3 + 12);

  const contactRows = [
    { label: 'Flagship Store & Headquarters:', val: 'Samakhushi, Gongabu Chowk, Kathmandu, Nepal' },
    { label: 'Customer Care & WhatsApp Desk:', val: '+977 9819844486  /  +977 9713888002' },
    { label: 'Official Support Email:', val: 'info@naturesmud.shop  /  naturesmudnepal@gmail.com' },
    { label: 'Official Online Webstore:', val: 'https://naturesmud.shop' },
    { label: 'Instagram & Facebook:', val: '@naturesmud_official  •  facebook.com/naturesmud' }
  ];

  let cry = b8Y3 + 36;
  contactRows.forEach((cr) => {
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8.2).text(cr.label, margin + 16, cry);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(cr.val, margin + 16, cry + 11);
    cry += 28;
  });

  // Embed Fonepay QR Code
  const qrFile = path.join(rootDir, 'public/images/krisha-fonepay-qr.png');
  if (fs.existsSync(qrFile)) {
    try {
      const qrBuf = await getOptimizedImage(qrFile, 300);
      if (qrBuf) {
        const qrSize = 115;
        const qrx = margin + b8CardW - qrSize - 18;
        const qry = b8Y3 + 42;

        doc.roundedRect(qrx - 6, qry - 6, qrSize + 12, qrSize + 12, 6).fill(C_WHITE);
        doc.image(qrBuf, qrx, qry, { width: qrSize, height: qrSize });
        doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.5).text('Scan to Pay via Fonepay', qrx - 10, qry + qrSize + 9, { align: 'center', width: qrSize + 20 });
        doc.fillColor(C_WHITE).font('Helvetica').fontSize(6.5).text('All Nepali Banks Supported', qrx - 10, qry + qrSize + 19, { align: 'center', width: qrSize + 20 });
      }
    } catch (e) {}
  }

  // Bottom Copyright
  doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text(
    '© 2026 Nature\'s Mud Nepal Pvt. Ltd. All rights reserved. The Himalayan Edit Master Edition.',
    0,
    pageHeight - 52,
    { align: 'center', width: pageWidth }
  );
  doc.fillColor('#8A9E93').font('Helvetica').fontSize(7).text(
    'Certified clean hygiene packaging. 100% single-origin Himalayan superfoods with 0 preservatives and 0 added sugar.',
    0,
    pageHeight - 40,
    { align: 'center', width: pageWidth }
  );

  // Finish PDF
  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  // Duplicate to alias paths
  fs.copyFileSync(primaryPdfPath, aliasPdfPath);
  fs.copyFileSync(primaryPdfPath, magazinePdfPath);

  const stats = fs.statSync(primaryPdfPath);
  console.log(`✅ Master 8-Page Magazine PDF generated successfully! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
}

generateMasterCatalogPDF().catch((err) => {
  console.error('❌ Generation error:', err);
  process.exit(1);
});
