const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const primaryPdfPath = path.join(publicDir, 'Nature_Mud_Product_Catalog.pdf');
const aliasPdfPath = path.join(publicDir, 'catalog.pdf');
const magazinePdfPath = path.join(publicDir, 'Nature_Mud_Magazine_Catalog.pdf');

// Cache optimized image buffers in memory so build is super fast
const imageCache = new Map();
async function getOptimizedImage(relPath, maxDim = 600) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  const key = `${fullPath}_${maxDim}`;
  if (imageCache.has(key)) return imageCache.get(key);

  try {
    const buffer = await sharp(fullPath)
      .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
    imageCache.set(key, buffer);
    return buffer;
  } catch (err) {
    console.warn(`Sharp resize failed for ${relPath}, falling back to original:`, err.message);
    const buf = fs.readFileSync(fullPath);
    imageCache.set(key, buf);
    return buf;
  }
}

// 26 Master Products (incorporating accurate prices and zero sugar references)
const products = [
  // COLLECTION I: DRIED FRUITS
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Dehydrated Mango Slices',
    botanical: 'Mangifera indica • Single-Origin Mid-Hills',
    pack: 'Standup Ziplock Pouch',
    weight: '100 GM',
    price: 595,
    mrp: 595,
    image: 'public/products/authentic-dehydrated-mango.jpg',
    origin: 'Mid-Hill Orchards, Nepal',
    ingredients: '100% Pure Tree-Ripened Himalayan Mango. Absolutely 0 preservatives, 0 chemical additives, 0 synthetic colorings.',
    bioactives: ['Natural Pro-Vitamin A (Beta-Carotene)', 'High Bioactive Vitamin C Complex', 'Active Plant Amylase Digestive Enzymes'],
    ritual: 'Enjoy 2-3 slices directly as a rich chewy mountain snack, dice into morning muesli, or infuse in cold spring water.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Dehydrated Pineapple Rings',
    botanical: 'Ananas comosus • Sub-Himalayan Foothills',
    pack: 'Standup Ziplock Pouch',
    weight: '100 GM',
    price: 495,
    mrp: 495,
    image: 'public/products/authentic-dehydrated-pineapple.jpg',
    origin: 'Sub-Himalayan Foothills, Nepal',
    ingredients: '100% Fresh Sun-Dehydrated Pineapple Rings. Hand-selected and dehydrated below 42°C to preserve natural enzymes.',
    bioactives: ['Active Proteolytic Bromelain Enzyme', 'Natural Dietary Plant Enzymes', 'Bioavailable Vitamin C & Manganese'],
    ritual: 'Ideal post-meal digestive snack, blend into green powerhouse smoothies, or steep in warm mountain herbal tea.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Dehydrated Jumla Apple Rings',
    botanical: 'Malus domestica • High-Altitude Jumla',
    pack: 'Standup Ziplock Pouch',
    weight: '100 GM',
    price: 510,
    mrp: 510,
    image: 'public/products/authentic-dehydrated-apple.jpg',
    origin: 'Jumla Valley (2,400m Altitude), Karnali',
    ingredients: '100% Organic High-Altitude Jumla Apples. Grown in pristine snow-melt soil with pure mountain water.',
    bioactives: ['Soluble Apple Pectin Fiber', 'Cardiovascular Quercetin Flavonoids', 'Natural Potassium & Polyphenols'],
    ritual: 'Wholesome crisp snack for school and trails, gently warm with cinnamon over porridge, or pair with nut butters.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Dehydrated Coconut Chips',
    botanical: 'Cocos nucifera • Coastal Sun-Dried',
    pack: 'Standup Ziplock Pouch',
    weight: '100 GM',
    price: 495,
    mrp: 495,
    image: 'public/products/dehydrated-coconut-chips.jpg',
    origin: 'Artisanal Sub-Tropical Groves',
    ingredients: '100% Raw Fresh Coconut Flesh. Gently warm-air toasted for a clean crunch with zero oils or additives.',
    bioactives: ['Medium-Chain Triglycerides (MCT Fats)', 'Beneficial Lauric Acid Lipids', 'Gut-Nourishing Dietary Fiber'],
    ritual: 'Savor as a keto-friendly crunch, toss over fruit bowls, or garnish wholesome curries and artisanal desserts.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Dehydrated Sweet Papaya Slices',
    botanical: 'Carica papaya • Terai Organic Belt',
    pack: 'Standup Ziplock Pouch',
    weight: '100 GM',
    price: 395,
    mrp: 395,
    image: 'public/products/papaya.jpg',
    origin: 'Terai Organic Belt, Nepal',
    ingredients: '100% Natural Tree-Ripened Himalayan Papaya. Low-temperature dried to retain active natural papain enzymes.',
    bioactives: ['Digestive Papain Enzyme Complex', 'Lycopene & Natural Carotenoids', 'Vitamins A, C, and Bio-Folate'],
    ritual: 'Gentle morning stomach tonic, pack for mountain treks, or chop finely into homemade trail mix.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Wild Dried Himalayan Blueberries',
    botanical: 'Vaccinium corymbosum • Alpine Woodlands',
    pack: 'UV-Filter Glass Jar',
    weight: '100 GM',
    price: 650,
    mrp: 650,
    image: 'public/products/dried-blueberries-100g.jpg',
    origin: 'Pristine Alpine Woodlands, Nepal',
    ingredients: '100% Whole Wild Dried Blueberries. Hand-harvested, slowly dehydrated, and packed in airtight glass.',
    bioactives: ['Deep Dark-Violet Anthocyanins', 'Gallic Acid Brain Antioxidants', 'Vitamin K1 & Manganese Micronutrients'],
    ritual: 'Consume 1-2 spoonfuls daily for visual clarity and cognitive focus, or mix into curd and chia pudding.'
  },
  {
    category: 'Himalayan Sun-Dehydrated Fruits',
    categoryCode: 'COLLECTION I',
    name: 'Whole Dried Cranberries',
    botanical: 'Vaccinium macrocarpon • Cold-Climate Harvest',
    pack: 'UV-Filter Glass Jar',
    weight: '100 GM',
    price: 415,
    mrp: 415,
    image: 'public/products/cranberries.jpg',
    origin: 'Organic Cold-Climate Mountain Harvest',
    ingredients: '100% Whole Sun-Dried Ruby Cranberries. Carefully sorted for plump texture and deep crimson hue.',
    bioactives: ['Type-A Proanthocyanidins (PACs)', 'Urinary Defense Bioflavonoids', 'Vitamin C and Natural Polyphenols'],
    ritual: 'Support daily urinary tract wellness, toss through fresh crisp salads, or bake into wholesome seed loaves.'
  },

  // COLLECTION II: BOTANICAL POWDERS
  {
    category: 'Pure Stone-Ground Botanical Powders',
    categoryCode: 'COLLECTION II',
    name: 'Natural Dates Powder',
    botanical: 'Phoenix dactylifera • Micro-Ground Whole Fruit',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 400,
    mrp: 400,
    image: 'public/products/dates-powder-100g.jpg',
    origin: 'Selected Premium Sun-Cured Dates',
    ingredients: '100% Whole Dehydrated Arabian Dates, micro-milled with zero carriers, starch, or anti-caking chemicals.',
    bioactives: ['Low-Glycemic Whole-Fruit Fiber', 'Bioavailable Plant Iron & Potassium', 'Magnesium, B-Complex Vitamins'],
    ritual: 'Use as a natural 1:1 whole-fruit sweetener in baby porridge, kheer, herbal tea, milk, and baking.'
  },
  {
    category: 'Pure Stone-Ground Botanical Powders',
    categoryCode: 'COLLECTION II',
    name: 'Pure Himalayan Beetroot Powder',
    botanical: 'Beta vulgaris • Solar-Dehydrated Root',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 430,
    mrp: 430,
    image: 'public/products/beetroot-powder-100g.jpg',
    origin: 'Mid-Hill Organic Valleys, Nepal',
    ingredients: '100% Pure Solar-Dehydrated Organic Red Beetroot. Gently stone-ground into an ultra-fine velvet powder.',
    bioactives: ['Concentrated Dietary Nitrates (Nitric Oxide)', 'Betalain Cellular Antioxidants', 'Bioavailable Iron & Folate'],
    ritual: 'Stir 1 teaspoon into warm water 30 mins before athletic exercise for stamina, or blend into vibrant pink lattes.'
  },
  {
    category: 'Pure Stone-Ground Botanical Powders',
    categoryCode: 'COLLECTION II',
    name: 'Organic Himalayan Carrot Powder',
    botanical: 'Daucus carota • Valley Solar-Dehydrated',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 490,
    mrp: 490,
    image: 'public/products/carrot-powder-100g.jpg',
    origin: 'Organic Valley Farms, Dang, Nepal',
    ingredients: '100% Tender Solar-Dehydrated Farm Carrots. Pure, concentrated, and free from any carriers or preservatives.',
    bioactives: ['Pro-Vitamin A (Beta-Carotene)', 'Lutein for Visual Health', 'Biotin & Soluble Plant Fiber'],
    ritual: 'Mix into infant weaning bowls, golden vegetable soups, knead into nutritious rotis, or stir into glowing juices.'
  },
  {
    category: 'Pure Stone-Ground Botanical Powders',
    categoryCode: 'COLLECTION II',
    name: 'Organic Sweet Potato Powder',
    botanical: 'Ipomoea batatas • Highland Terraces',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 510,
    mrp: 510,
    image: 'public/products/sweet-potato-powder-100g.jpg',
    origin: 'Highland Terraced Farms, Nepal',
    ingredients: '100% Pure Solar-Dehydrated Orange Sweet Potatoes. Fine stone-ground whole complex food.',
    bioactives: ['720% Daily Value Natural Vitamin A', 'Gut-Nourishing Resistant Starch', 'Potassium, Vitamin B6, Manganese'],
    ritual: 'Superb easily digestible weaning food for infants, wholesome complex fuel for athletes, or pancake flour enhancer.'
  },

  // COLLECTION III: MOUNTAIN NUTS & SEEDS
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Raw Himalayan Mountain Almonds',
    botanical: 'Prunus dulcis • Cold-Mountain Harvest',
    pack: 'Heavyweight Glass Jar',
    weight: '200 GM',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-almonds.jpg',
    origin: 'Jumla & Mountain Foothills, Nepal',
    ingredients: '100% Raw Unpasteurized Mountain Almonds. Naturally sun-dried in mountain shells and hand-cracked.',
    bioactives: ['Natural Vitamin E (Alpha-Tocopherol)', 'Plant Monounsaturated Fatty Acids', 'Bioavailable Calcium & Magnesium'],
    ritual: 'Soak 5-7 almonds overnight in fresh water; peel and consume at dawn for optimal brain memory and vitality.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Slow-Roasted Himalayan Almonds',
    botanical: 'Prunus dulcis • Artisanal Dry Roast',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-almonds.jpg',
    origin: 'Himalayan Roastery, Nepal',
    ingredients: '100% Mountain Almonds, slow dry-roasted without oil, salt, or chemicals in small micro-batches.',
    bioactives: ['Natural Vitamin E Antioxidants', 'Riboflavin (Vitamin B2)', 'Healthy Heart-Friendly Fats'],
    ritual: 'Crisp wholesome bite for midday office energy slumps, pair with mountain green tea, or chop over warm desserts.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Premium Cashew Nuts (W240)',
    botanical: 'Anacardium occidentale • Whole Jumbo',
    pack: 'Heavyweight Glass Jar',
    weight: '200 GM',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-cashewnuts-roasted.jpg',
    origin: 'Hand-Selected Premium Orchards',
    ingredients: '100% Jumbo Grade W240 Whole Cashews. Pristine ivory color, rich natural sweetness, zero chemical bleaching.',
    bioactives: ['Oleic Monounsaturated Fats', 'Copper for Collagen Synthesis', 'Plant Protein & Zinc Micronutrients'],
    ritual: 'Blend into velvety homemade cashew milk, snack raw, or toast lightly for luxury culinary garnish.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Roasted Himalayan Cashew Nuts',
    botanical: 'Anacardium occidentale • Small-Batch Roast',
    pack: 'Heavyweight Glass Jar',
    weight: '150 GM',
    price: 750,
    mrp: 750,
    image: 'public/products/authentic-cashewnuts-roasted.jpg',
    origin: 'Artisanal Himalayan Dry Roastery',
    ingredients: '100% Whole Jumbo Cashews, carefully dry-roasted without oil or artificial coatings.',
    bioactives: ['Magnesium for Muscle Relaxation', 'L-Arginine Amino Acid', 'Phosphorus & Healthy Lipids'],
    ritual: 'Gourmet accompaniment for guests, wholesome executive snack, or crushed into savory curries and biryanis.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Premium Roasted Pistachios',
    botanical: 'Pistacia vera • Naturally Opened',
    pack: 'Heavyweight Glass Jar',
    weight: '200 GM',
    price: 820,
    mrp: 820,
    image: 'public/products/pistachios.jpg',
    origin: 'Premium Sunlight Harvest Orchards',
    ingredients: '100% Whole Naturally-Opened Green Pistachios in Shell. Dry-roasted to crisp perfection.',
    bioactives: ['Lutein & Zeaxanthin Carotenoids', 'Vitamin B6 for Energy Metabolism', 'Complete Plant Protein & Fiber'],
    ritual: 'Mindful cracking and snacking, crumble over artisanal kulfi and saffron kheer, or sprinkle on fresh grain salads.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Himalayan Superfood Trail Mix',
    botanical: 'Botanical Multi-Seed & Nut Synergy',
    pack: 'Heavyweight Glass Jar',
    weight: '200 GM',
    price: 790,
    mrp: 790,
    image: 'public/products/superfood-mix.jpg',
    origin: 'Curated Himalayan Master Blend',
    ingredients: 'Whole Jumbo Cashews, Mountain Almonds, Raw Pumpkin Seeds, Black Chia Seeds, Cranberries & Wild Blueberries.',
    bioactives: ['Balanced Omega-3 and Omega-6 Fats', 'Diverse Botanical Polyphenols', 'Clean Sustained Energy Density'],
    ritual: 'Ultimate high-altitude trekking fuel, midday desk energizer, or pre-workout endurance booster.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Gourmet Raw Macadamia Nuts',
    botanical: 'Macadamia integrifolia • Highland Harvest',
    pack: 'Heavyweight Glass Jar',
    weight: '200 GM',
    price: 1100,
    mrp: 1100,
    image: 'public/products/macadamia.jpg',
    origin: 'Highland Sustainable Estates',
    ingredients: '100% Whole Raw Macadamia Kernels. Hand-cracked and sealed to protect their delicate natural oils.',
    bioactives: ['Rare Omega-7 (Palmitoleic Acid)', 'Highest Monounsaturated Fat Density', 'Thiamine (Vitamin B1) & Manganese'],
    ritual: 'Luxury culinary treat, blend into dairy-free creams, or savor 4-5 nuts daily for skin radiance and brain health.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'Organic Black Chia Seeds',
    botanical: 'Salvia hispanica • Hydrophilic Seeds',
    pack: 'Food-Grade Airtight Jar',
    weight: '300 GM',
    price: 495,
    mrp: 495,
    image: 'public/products/chia-seeds.jpg',
    origin: 'Certified High-Altitude Organic Farms',
    ingredients: '100% Pure Raw Black Chia Seeds. Double-cleaned, 99.9% purity grade, 100% chemical-free.',
    bioactives: ['Plant Omega-3 ALA (Alpha-Linolenic Acid)', 'Soluble Gel-Forming Mucilage Fiber', 'Complete Plant Protein & Calcium'],
    ritual: 'Soak 1 tablespoon in 250ml water, milk, or curd for 15 minutes to create rich hydrating puddings and beverages.'
  },
  {
    category: 'Mountain Nuts & Hydrophilic Seeds',
    categoryCode: 'COLLECTION III',
    name: 'AAA Himalayan Pumpkin Seeds',
    botanical: 'Cucurbita pepo • Raw Green Pepitas',
    pack: 'Food-Grade Airtight Jar',
    weight: '300 GM',
    price: 650,
    mrp: 700,
    image: 'public/products/pumpkin-seeds.jpg',
    origin: 'Organic Terai & Valley Harvests, Nepal',
    ingredients: '100% AAA-Grade Raw Shelled Green Pumpkin Seeds (Pepitas). Cleaned, unroasted, and unadulterated.',
    bioactives: ['Highly Bioavailable Plant Zinc', 'Cardiovascular Magnesium', 'Tryptophan (Serotonin Precursor) & Phytosterols'],
    ritual: 'Enjoy a handful raw at dusk for restful sleep support, toast lightly over a skillet, or sprinkle onto warm soups.'
  },

  // COLLECTION IV: VIRGIN OILS & ANCIENT SALTS
  {
    category: 'Virgin Oils & Ancient Mineral Salts',
    categoryCode: 'COLLECTION IV',
    name: 'Cold-Pressed Virgin Coconut Oil (500ml)',
    botanical: 'Cocos nucifera • Wet-Milled Extra Virgin',
    pack: 'Heavyweight Glass Jar',
    weight: '500 ML',
    price: 850,
    mrp: 850,
    image: 'public/products/coconut-oil.jpg',
    origin: 'Single-Origin Coastal Estates',
    ingredients: '100% Pure Cold-Pressed Virgin Coconut Oil. Centrifuged raw from fresh coconut milk without heat, bleach, or solvents.',
    bioactives: ['52%+ Active Lauric Acid', 'Medium-Chain Triglycerides (MCTs)', 'Natural Vitamin E Antioxidants'],
    ritual: 'Ideal for wholesome cooking, Ayurvedic morning oil pulling (kavala), baby body nourishment, and deep hair conditioning.'
  },
  {
    category: 'Virgin Oils & Ancient Mineral Salts',
    categoryCode: 'COLLECTION IV',
    name: 'Cold-Pressed Virgin Coconut Oil (180ml)',
    botanical: 'Cocos nucifera • Wet-Milled Vanity Jar',
    pack: 'Heavyweight Glass Jar',
    weight: '180 ML',
    price: 420,
    mrp: 420,
    image: 'public/products/coconut-oil-product.jpg',
    origin: 'Single-Origin Coastal Estates',
    ingredients: '100% Pure Extra Virgin Raw Coconut Oil. Cold-centrifuged from fresh organic coconut meat.',
    bioactives: ['Lauric Acid Monolaurin Precursor', 'Caprylic & Capric Acids', 'Natural Plant Squalene'],
    ritual: 'Compact vanity & travel jar for facial oil cleansing, soothing dry cuticles, natural makeup removal, and lip balm.'
  },
  {
    category: 'Virgin Oils & Ancient Mineral Salts',
    categoryCode: 'COLLECTION IV',
    name: 'Ancient Himalayan Pink Rock Salt',
    botanical: 'Unrefined Halite • Ancient Crystal Salt',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 250,
    mrp: 250,
    image: 'public/products/pink-salt.jpg',
    origin: 'Ancient Himalayan Khewra Formations',
    ingredients: '100% Pure Unrefined Himalayan Pink Rock Salt. Hand-mined, ground, and free from any anti-caking additives.',
    bioactives: ['84+ Ionic Trace Minerals', 'Bioavailable Iron, Calcium & Magnesium', 'Zero Microplastics or Chemical Bleaches'],
    ritual: 'Replace commercial refined salt in everyday cooking, mix a pinch into warm morning water for hydration, or use in bath salts.'
  },
  {
    category: 'Virgin Oils & Ancient Mineral Salts',
    categoryCode: 'COLLECTION IV',
    name: 'Himalayan Black Salt (Bire Noon)',
    botanical: 'Ayurvedic Kala Namak • Volcanic Halite',
    pack: 'Heavyweight Glass Jar',
    weight: '100 GM',
    price: 220,
    mrp: 220,
    image: 'public/products/himalayan-black-salt-digestive.jpg',
    origin: 'Himalayan Foothills, Nepal',
    ingredients: '100% Traditional Himalayan Black Salt. Kiln-fired with natural herbs according to centuries-old Ayurvedic methodology.',
    bioactives: ['Active Sulfur Minerals & Iron', 'Digestive Agni Stimulating Minerals', 'Low-Sodium Electrolyte Profile'],
    ritual: 'Indispensable seasoning for fruits, salads, raita, chaats, and as an Ayurvedic remedy for relieving bloating and sluggish digestion.'
  },

  // COLLECTION V: HIGH-ALTITUDE ELIXIRS
  {
    category: 'High-Altitude Himalayan Elixirs',
    categoryCode: 'COLLECTION V',
    name: 'Himalayan Shilajit Resin (Gold Grade)',
    botanical: 'Asphaltum punjabianum • 18,000 ft High Himalaya',
    pack: 'UV-Protected Glass Jar with Dosage Spoon',
    weight: '20 GM / 50 GM',
    price: 1450,
    mrp: 1650,
    image: 'public/products/shilajit.jpg',
    origin: 'High Himalayan Mountain Crags, Nepal (18,000+ ft)',
    ingredients: '100% Purified Gold-Grade Himalayan Shilajit Resin. Sun-purified in spring water according to traditional Shodhana standards.',
    bioactives: ['75%+ Certified Active Fulvic Acid', '84+ Bioavailable Ionic Trace Minerals', 'Humic Acid Complex & Dibenzo-Alpha-Pyrones'],
    ritual: 'Dissolve a rice-to-pea sized portion (300-500mg) in warm water, raw milk, or mountain green tea each morning on an empty stomach.'
  },
  {
    category: 'High-Altitude Himalayan Elixirs',
    categoryCode: 'COLLECTION V',
    name: 'Mustang Wild Cliff Raw Honey',
    botanical: 'Apis laboriosa • Wild Mountain Flora',
    pack: 'Sealed Hexagonal Glass Jar',
    weight: '250 GM / 500 GM',
    price: 950,
    mrp: 1100,
    image: 'public/products/raw-honey.jpg',
    origin: 'Mustang Valley (2,800m Altitude), Nepal',
    ingredients: '100% Raw Unpasteurized Cliff Honey. Ethically gathered from wild giant cliff bees living on sheer vertical rock faces.',
    bioactives: ['Living Bio-Enzymes (Diastase, Invertase)', 'Wild Alpine Flora Pollen & Propolis', 'Antimicrobial Bioflavonoids'],
    ritual: 'Take 1 teaspoon raw directly off the spoon at room temperature. Drizzle over warm oats or walnuts. Never boil or heat above 40°C.'
  }
];

async function createMagazinePDF() {
  console.log('📖 Generating Nature\'s Mud Master Magazine Catalog (2026 Edition)...');

  const doc = new PDFDocument({
    size: 'A4',
    margin: 36,
    autoFirstPage: false,
    info: {
      Title: "Nature's Mud — The Himalayan Edit: 2026 Master Superfood & Dehydrated Collection",
      Author: "Nature's Mud Nepal Pvt. Ltd.",
      Subject: 'Official Master Magazine & Price Specification Catalog',
      Keywords: "Nature's Mud, Himalayan Superfoods, Organic Catalog, Dehydrated Fruits, Nuts, Seeds, Shilajit, Nepal",
      CreationDate: new Date(),
    }
  });

  const stream = fs.createWriteStream(primaryPdfPath);
  doc.pipe(stream);

  // Color tokens
  const C_DARK_COVER = '#0B1C14';
  const C_EMERALD = '#142E23';
  const C_FOREST = '#1B3D2F';
  const C_PINE = '#2D5A27';
  const C_GOLD = '#C9982A';
  const C_BRIGHT_GOLD = '#D4AF37';
  const C_CHAMPAGNE = '#F4E8C1';
  const C_CREAM = '#FAF7F2';
  const C_WHITE = '#FFFFFF';
  const C_INK = '#1F2421';
  const C_MUTED = '#5A655F';
  const C_LIGHT_MUTED = '#8D9B94';
  const C_CARD_BG = '#FFFFFF';
  const C_CARD_BORDER = '#E7E0D3';
  const C_INNER_BG = '#F7F4EC';

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Helper: Header & Footer template for editorial pages
  function drawPageChrome(categoryTitle, pageNum, totalPages) {
    doc.save();

    // Top running banner
    doc.rect(margin, 18, contentWidth, 24).fill(C_EMERALD);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text("NATURE'S MUD", margin + 12, 26);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(`•   THE HIMALAYAN EDIT 2026`, margin + 95, 26.5);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(categoryTitle.toUpperCase(), pageWidth - margin - 220, 26.5, { align: 'right', width: 210 });

    // Gold hairline divider
    doc.rect(margin, 42, contentWidth, 1.5).fill(C_GOLD);

    // Bottom footer bar
    doc.rect(margin, pageHeight - 32, contentWidth, 0.8).fill('#D8D0C2');
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(
      'Nature\'s Mud Nepal  |  Samakhushi, Gongabu Chowk, Kathmandu  |  WhatsApp: +977 9819844486  |  www.naturesmud.shop',
      margin,
      pageHeight - 24,
      { width: contentWidth - 80 }
    );
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8).text(
      `PAGE ${pageNum} OF ${totalPages}`,
      pageWidth - margin - 75,
      pageHeight - 24,
      { align: 'right', width: 75 }
    );

    doc.restore();
  }

  const TOTAL_PAGES = 16;

  // =========================================================================
  // PAGE 1: LUXURY MAGAZINE COVER
  // =========================================================================
  doc.addPage();

  // Background
  doc.rect(0, 0, pageWidth, pageHeight).fill(C_DARK_COVER);

  // Double Gold Editorial Border
  doc.lineWidth(1.8).strokeColor(C_GOLD);
  doc.rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();
  doc.lineWidth(0.6).strokeColor(C_GOLD);
  doc.rect(26, 26, pageWidth - 52, pageHeight - 52).stroke();

  // Corner Ornaments
  const cornerSize = 14;
  [[26, 26], [pageWidth - 26 - cornerSize, 26], [26, pageHeight - 26 - cornerSize], [pageWidth - 26 - cornerSize, pageHeight - 26 - cornerSize]].forEach(([cx, cy]) => {
    doc.rect(cx, cy, cornerSize, cornerSize).fill(C_GOLD);
  });

  // Top Category Kicker
  doc.roundedRect(pageWidth / 2 - 130, 48, 260, 22, 11).fillAndStroke(C_FOREST, C_GOLD);
  doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(
    'OFFICIAL 2026 MASTER EDITORIAL COLLECTION',
    0,
    55,
    { align: 'center', width: pageWidth }
  );

  // Master Magazine Title
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(38).text(
    "NATURE'S MUD",
    0,
    82,
    { align: 'center', width: pageWidth }
  );

  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(12).text(
    'T H E   H I M A L A Y A N   E D I T',
    0,
    126,
    { align: 'center', width: pageWidth }
  );

  doc.fillColor('#B7C7BF').font('Helvetica').fontSize(9).text(
    'Pure Living Superfoods  ·  Solar-Dehydrated Botanicals  ·  Mountain Terroir',
    0,
    144,
    { align: 'center', width: pageWidth }
  );

  // Hero Visual Showcase Frame
  const coverCardY = 168;
  const coverCardW = pageWidth - 90;
  const coverCardH = 340;
  const coverCardX = 45;

  doc.roundedRect(coverCardX, coverCardY, coverCardW, coverCardH, 10).fill('#0E2218');
  doc.lineWidth(1).strokeColor(C_GOLD);
  doc.roundedRect(coverCardX, coverCardY, coverCardW, coverCardH, 10).stroke();

  // Embed Cover Image if available
  const coverImageCandidates = [
    'public/images/posters/healthy_food_jars_on_pedestals_202608122122.jpeg',
    'public/images/official-product-catalog.jpg',
    'public/products/authentic-dehydrated-mango.jpg'
  ];
  let loadedCoverImage = null;
  for (const cPath of coverImageCandidates) {
    if (fs.existsSync(path.join(rootDir, cPath))) {
      loadedCoverImage = cPath;
      break;
    }
  }

  if (loadedCoverImage) {
    try {
      const coverBuf = await getOptimizedImage(loadedCoverImage, 800);
      if (coverBuf) {
        doc.save();
        doc.roundedRect(coverCardX + 8, coverCardY + 8, coverCardW - 16, coverCardH - 16, 8).clip();
        doc.image(coverBuf, coverCardX + 8, coverCardY + 8, {
          width: coverCardW - 16,
          height: coverCardH - 16,
          fit: [coverCardW - 16, coverCardH - 16],
          align: 'center',
          valign: 'center'
        });
        doc.restore();

        // Dark gradient overlay for typography readability
        doc.save();
        doc.rect(coverCardX + 8, coverCardY + coverCardH - 90, coverCardW - 16, 82).fillOpacity(0.85).fill(C_DARK_COVER);
        doc.restore();
      }
    } catch (err) {
      console.warn('Cover image render fallback:', err.message);
    }
  }

  // Cover Overlay Text Badge
  doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(14).text(
    'HIMALAYAN MASTER CATALOGUE & PRICE LIST',
    coverCardX + 16,
    coverCardY + coverCardH - 74,
    { width: coverCardW - 32, align: 'center' }
  );
  doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(
    'Comprehensive specifications, lab-certified single origins, complete ingredient transparency & culinary guides',
    coverCardX + 16,
    coverCardY + coverCardH - 54,
    { width: coverCardW - 32, align: 'center' }
  );

    // Feature highlights 4-pillar grid
    const highlightsY = 525;
    const hBoxW = (contentWidth - 18) / 2;
    const hBoxH = 50;

    const pillars = [
      {
        title: 'I. Solar Dehydration < 42°C',
        desc: 'Gentle solar airflow preserving live enzymes, natural vitamins & aromatic fruit oils.'
      },
      {
        title: 'II. 100% Single-Origin Pure',
        desc: 'Directly sourced from 180+ smallholder mountain family farms in Jumla, Mustang & Dang.'
      },
      {
        title: 'III. Zero Synthetic Additives',
        desc: 'Pure whole foods with 0 preservatives, 0 sulfur, 0 coloring agents & 0 fillers.'
      },
      {
        title: 'IV. Pharmaceutical-Grade Glass',
        desc: 'Aroma-lock standup barrier pouches & UV-shielding glass jars preserving full freshness.'
      }
    ];

    pillars.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = margin + col * (hBoxW + 18);
      const py = highlightsY + row * (hBoxH + 12);

      doc.roundedRect(px, py, hBoxW, hBoxH, 6).fill('#13291F');
      doc.lineWidth(0.6).strokeColor(C_GOLD);
      doc.roundedRect(px, py, hBoxW, hBoxH, 6).stroke();

      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(p.title, px + 10, py + 8);
      doc.fillColor('#D6E2DC').font('Helvetica').fontSize(7.5).text(p.desc, px + 10, py + 22, { width: hBoxW - 20 });
    });

    // Gold ribbon seal
    doc.roundedRect(pageWidth / 2 - 140, 658, 280, 26, 6).fill(C_GOLD);
    doc.fillColor(C_DARK_COVER).font('Helvetica-Bold').fontSize(9.5).text(
      '★ 26 MASTER CERTIFIED BOTANICALS & ELIXIRS ★',
      0,
      666,
      { align: 'center', width: pageWidth }
    );

    // Cover Footer Brand Credits
    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(10).text(
      'Nature\'s Mud Nepal Pvt. Ltd.  •  Kathmandu, Nepal',
      0,
      710,
      { align: 'center', width: pageWidth }
    );
    doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8.5).text(
      'Direct Orders & Wholesale: +977 9819844486  |  +977 9713888002  |  info@naturesmud.shop',
      0,
      726,
      { align: 'center', width: pageWidth }
    );
    doc.fillColor('#A3B8AD').font('Helvetica').fontSize(8).text(
      'Explore Online: www.naturesmud.shop  •  Official Print Edition 2026',
      0,
      742,
      { align: 'center', width: pageWidth }
    );

    // =========================================================================
    // PAGE 2: TABLE OF CONTENTS & HIMALAYAN SOURCING PHILOSOPHY
    // =========================================================================
    doc.addPage();
    drawPageChrome('Editorial Manifesto & Table of Contents', 2, TOTAL_PAGES);

    // Page Title
    doc.rect(margin, 52, contentWidth, 34).fill(C_INNER_BG);
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(14).text('THE HIMALAYAN SOURCING MANIFESTO', margin + 12, 62);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('VOLUME 2026  •  ESSENTIAL WHOLE FOODS', pageWidth - margin - 180, 64, { align: 'right', width: 170 });

    // Left Column: Sourcing Manifesto
    const colW = (contentWidth - 20) / 2;
    const leftX = margin;
    const rightX = margin + colW + 20;
    const bodyY = 96;

    doc.roundedRect(leftX, bodyY, colW, 460, 6).fill(C_WHITE);
    doc.lineWidth(0.8).strokeColor(C_CARD_BORDER);
    doc.roundedRect(leftX, bodyY, colW, 460, 6).stroke();

    doc.rect(leftX, bodyY, colW, 24).fill(C_FOREST);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(9).text('OUR COMMITMENT TO PURITY', leftX + 10, bodyY + 7);

    const storyTextY = bodyY + 34;
    doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(10.5).text('Rooted in High-Altitude Himalayan Glaciers & Organic Terraces', leftX + 12, storyTextY, { width: colW - 24 });

    const manifestoBody = 
      "Founded in Kathmandu, Nature's Mud was created to reconnect modern households with the untamed nutritional power of the Himalayas.\n\n" +
      "We partner directly with over 180 smallholder farming families across remote valleys—from the alpine orchards of Jumla (2,400m) and the sheer granite cliffs of Mustang (2,800m), to the fertile organic alluvial plains of Dang and Chitwan.\n\n" +
      "Every botanical in this catalog is single-origin, traceable to its harvesting cooperative, and dehydrated at low temperatures (strictly below 42°C). This gentle solar airflow preserves delicate phytochemicals, live bromelain and papain enzymes, and heat-sensitive antioxidants that are ordinarily destroyed in commercial high-heat kilns.\n\n" +
      "We reject all artificial food additives, preservatives, synthetic colors, and industrial processing. What you receive is pure, living mountain nourishment—straight from pristine soil into your kitchen.";

    doc.fillColor(C_MUTED).font('Helvetica').fontSize(8.2).text(manifestoBody, leftX + 12, storyTextY + 32, {
      width: colW - 24,
      lineGap: 3
    });

    // Purity Seal Box
    doc.roundedRect(leftX + 12, bodyY + 375, colW - 24, 70, 4).fill(C_INNER_BG);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text('✓ THE 4 PURITY PILLARS', leftX + 20, bodyY + 384);
    doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(
      '1. 100% Traceable Single-Origin Harvest\n' +
      '2. Sub-42°C Cold Solar Enzyme Retention\n' +
      '3. Zero Chemical Preservatives or Synthetic Sulfur\n' +
      '4. Food-Grade UV-Resistant Glass & Multi-Barrier Packaging',
      leftX + 20,
      bodyY + 398,
      { lineGap: 2.5 }
    );

    // Right Column: Table of Contents
    doc.roundedRect(rightX, bodyY, colW, 460, 6).fill(C_WHITE);
    doc.lineWidth(0.8).strokeColor(C_CARD_BORDER);
    doc.roundedRect(rightX, bodyY, colW, 460, 6).stroke();

    doc.rect(rightX, bodyY, colW, 24).fill(C_EMERALD);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(9).text('TABLE OF CONTENTS', rightX + 10, bodyY + 7);

    const tocList = [
      {
        num: '01',
        title: 'Himalayan Dehydrated Fruits',
        pages: 'Pages 3 – 6',
        items: 'Mango, Pineapple, Apple Rings, Coconut Chips, Papaya, Blueberries, Cranberries'
      },
      {
        num: '02',
        title: 'Pure Botanical Powders',
        pages: 'Pages 7 – 8',
        items: 'Dates Natural Sweetener, Beetroot, Organic Carrot & Sweet Potato Powders'
      },
      {
        num: '03',
        title: 'Mountain Nuts & Seeds',
        pages: 'Pages 9 – 13',
        items: 'Mountain Almonds, Cashews, Pistachios, Trail Mix, Macadamias, Chia & AAA Pumpkin Seeds'
      },
      {
        num: '04',
        title: 'Virgin Oils & Ancient Salts',
        pages: 'Pages 13 – 14',
        items: 'Cold-Pressed Virgin Coconut Oils, Ancient Pink Rock Salt, Ayurvedic Black Salt'
      },
      {
        num: '05',
        title: 'Himalayan Sacred Elixirs',
        pages: 'Page 15',
        items: 'Gold-Grade Himalayan Shilajit Resin (75%+ Fulvic) & Mustang Wild Cliff Honey'
      },
      {
        num: '06',
        title: 'Wholesale & Ordering Guide',
        pages: 'Page 16',
        items: 'Retail specs, B2B wholesale tiers, nationwide delivery & contact channels'
      }
    ];

    let tocY = bodyY + 34;
    tocList.forEach((t) => {
      doc.roundedRect(rightX + 10, tocY, colW - 20, 62, 4).fill(C_INNER_BG);
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(t.num, rightX + 16, tocY + 8);
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(9).text(t.title, rightX + 38, tocY + 8);
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8).text(t.pages, rightX + colW - 75, tocY + 8, { align: 'right', width: 45 });
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(t.items, rightX + 38, tocY + 24, { width: colW - 54 });
      tocY += 68;
    });

    // Bottom Editorial Accent Quote
    const quoteY = 570;
    doc.roundedRect(margin, quoteY, contentWidth, 230, 8).fill(C_FOREST);
    doc.lineWidth(1).strokeColor(C_GOLD);
    doc.roundedRect(margin, quoteY, contentWidth, 230, 8).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(
      '“FOOD IS MEDICINE WHEN GROWN IN SOIL TOUCHED BY HIMALAYAN GLACIERS.”',
      margin + 16,
      quoteY + 16,
      { align: 'center', width: contentWidth - 32 }
    );

    // Embed small scenery/poster graphic if available
    const landscapePath = path.join(rootDir, 'public/images/himalayan-landscape.jpg');
    if (fs.existsSync(landscapePath)) {
      try {
        doc.save();
        doc.roundedRect(margin + 16, quoteY + 40, contentWidth - 32, 140, 6).clip();
        doc.image(landscapePath, margin + 16, quoteY + 40, {
          width: contentWidth - 32,
          height: 140,
          fit: [contentWidth - 32, 140],
          align: 'center',
          valign: 'center'
        });
        doc.restore();
      } catch (e) {}
    }

    doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8.5).text(
      'From 2,800m cliffs of Mustang to the pristine organic valleys of Jumla, Nepal.',
      margin + 16,
      quoteY + 195,
      { align: 'center', width: contentWidth - 32 }
    );

    // =========================================================================
    // HELPER: RENDER 2-PRODUCT LUXURY MAGAZINE SPREAD
    // =========================================================================
    async function renderTwoProductSpread(prodA, prodB, pageNum, totalPages) {
      doc.addPage();
      const currentCategory = prodA.category;
      drawPageChrome(currentCategory, pageNum, totalPages);

      // Render Product A (Top Card)
      await renderMagazineProductCard(prodA, margin, 52, contentWidth, 360);

      // Render Product B (Bottom Card if present)
      if (prodB) {
        await renderMagazineProductCard(prodB, margin, 424, contentWidth, 375);
      }
    }

    async function renderMagazineProductCard(prod, cardX, cardY, cardW, cardH) {
      doc.save();

      // Card Container Background & Border
      doc.roundedRect(cardX, cardY, cardW, cardH, 8).fill(C_WHITE);
      doc.lineWidth(0.8).strokeColor(C_CARD_BORDER);
      doc.roundedRect(cardX, cardY, cardW, cardH, 8).stroke();

      // Top Category & Classification Bar
      doc.roundedRect(cardX, cardY, cardW, 26, 8).fill(C_FOREST);
      doc.rect(cardX, cardY + 16, cardW, 10).fill(C_FOREST);

      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8).text(prod.categoryCode, cardX + 12, cardY + 8);
      doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(`•   ${prod.botanical}`, cardX + 90, cardY + 8);
      doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8).text(prod.origin, cardX + cardW - 170, cardY + 8, { align: 'right', width: 160 });

      // Layout split: Left Photo (width 165pt) | Right Details (width cardW - 185pt)
      const photoBoxW = 150;
      const photoBoxH = 150;
      const photoBoxX = cardX + 14;
      const photoBoxY = cardY + 36;

      // Photo Frame Box
      doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 6).fill(C_INNER_BG);
      doc.lineWidth(0.6).strokeColor(C_CARD_BORDER);
      doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 6).stroke();

      // Embed Image using sharp-optimized buffer
      try {
        const imgBuffer = await getOptimizedImage(prod.image, 600);
        if (imgBuffer) {
          doc.save();
          doc.roundedRect(photoBoxX + 4, photoBoxY + 4, photoBoxW - 8, photoBoxH - 8, 4).clip();
          doc.image(imgBuffer, photoBoxX + 4, photoBoxY + 4, {
            width: photoBoxW - 8,
            height: photoBoxH - 8,
            fit: [photoBoxW - 8, photoBoxH - 8],
            align: 'center',
            valign: 'center'
          });
          doc.restore();
        }
      } catch (imgErr) {
        console.warn('Image embed error for', prod.name, imgErr.message);
      }

      // Specifications Pills below photo
      const specY = photoBoxY + photoBoxH + 8;
      doc.roundedRect(photoBoxX, specY, photoBoxW, 20, 4).fill(C_INNER_BG);
      doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(8).text(`NET WT: ${prod.weight}`, photoBoxX + 6, specY + 6);
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(prod.pack, photoBoxX + 72, specY + 6, { width: 72, align: 'right' });

      // Official Price Ribbon Box
      const priceBoxY = specY + 26;
      doc.roundedRect(photoBoxX, priceBoxY, photoBoxW, 46, 5).fill(C_FOREST);
      doc.lineWidth(0.8).strokeColor(C_GOLD);
      doc.roundedRect(photoBoxX, priceBoxY, photoBoxW, 46, 5).stroke();

      doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(7.5).text('OFFICIAL RETAIL PRICE', photoBoxX + 8, priceBoxY + 6);
      doc.fillColor(C_BRIGHT_GOLD).font('Helvetica-Bold').fontSize(16).text(`Rs. ${prod.price}`, photoBoxX + 8, priceBoxY + 18);
      if (prod.mrp && prod.mrp > prod.price) {
        doc.fillColor('#A3B8AD').font('Helvetica').fontSize(8).text(`MRP Rs. ${prod.mrp}`, photoBoxX + 85, priceBoxY + 22);
      } else {
        doc.fillColor('#A3B8AD').font('Helvetica').fontSize(7.5).text('Tax Inclusive', photoBoxX + 85, priceBoxY + 22);
      }

      // Purity Guarantee Badge below price
      const sealY = priceBoxY + 52;
      if (cardH > 350) {
        doc.roundedRect(photoBoxX, sealY, photoBoxW, 36, 4).fill('#E8F1EC');
        doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(7.5).text('✓ 100% PURE BOTANICAL', photoBoxX + 8, sealY + 6);
        doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.8).text('0 Preservatives • 0 Additives • Single Origin', photoBoxX + 8, sealY + 18, { width: photoBoxW - 16 });
      }

      // =======================================================================
      // RIGHT COLUMN: PRODUCT CONTENT & EDITORIAL DETAILS
      // =======================================================================
      const rightX = photoBoxX + photoBoxW + 16;
      const rightW = cardW - (photoBoxW + 36);
      let contentY = cardY + 34;

      // Product Title
      doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(14).text(prod.name, rightX, contentY);
      contentY += 18;

      // Origin & Terroir Line
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(`Origin: ${prod.origin}`, rightX, contentY);
      contentY += 14;

      // Section 1: 100% Ingredients Breakdown
      doc.roundedRect(rightX, contentY, rightW, 58, 4).fill(C_INNER_BG);
      doc.lineWidth(0.5).strokeColor('#DDD6C8');
      doc.roundedRect(rightX, contentY, rightW, 58, 4).stroke();

      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(8).text('🌿 100% INGREDIENTS TRANSPARENCY', rightX + 8, contentY + 6);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(prod.ingredients, rightX + 8, contentY + 18, {
        width: rightW - 16,
        lineGap: 2
      });
      contentY += 64;

      // Section 2: Active Nutrients & Phytochemical Profile
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8.5).text('🔬 ACTIVE BIOACTIVE NUTRIENT PROFILE', rightX, contentY);
      contentY += 12;

      prod.bioactives.forEach((bio) => {
        doc.rect(rightX, contentY + 2, 4, 4).fill(C_GOLD);
        doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(bio, rightX + 10, contentY, { width: rightW - 12 });
        contentY += 12;
      });
      contentY += 2;

      // Section 3: Culinary Ritual & Savoring Guide
      doc.roundedRect(rightX, contentY, rightW, 56, 4).fill('#F2F6F4');
      doc.lineWidth(0.5).strokeColor('#CBE0D5');
      doc.roundedRect(rightX, contentY, rightW, 56, 4).stroke();

      doc.fillColor(C_PINE).font('Helvetica-Bold').fontSize(8).text('🍽️ HOW TO ENJOY & CULINARY RITUAL', rightX + 8, contentY + 6);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(prod.ritual, rightX + 8, contentY + 18, {
        width: rightW - 16,
        lineGap: 2
      });

      doc.restore();
    }

    // =========================================================================
    // RENDER PRODUCT PAGES (PAGES 3 TO 14)
    // Products 0..23 (24 items = 12 pages)
    // =========================================================================
    let currentPageNum = 3;
    for (let i = 0; i < 24; i += 2) {
      await renderTwoProductSpread(products[i], products[i + 1], currentPageNum, TOTAL_PAGES);
      currentPageNum++;
    }

    // =========================================================================
    // PAGE 15: THE CROWN JEWELS — SHILAJIT & MUSTANG HONEY SPECIAL SPREAD
    // =========================================================================
    await renderTwoProductSpread(products[24], products[25], 15, TOTAL_PAGES);

    // =========================================================================
    // PAGE 16: BACK COVER — WHOLESALE, PACKAGING & ORDERING GUIDE
    // =========================================================================
    doc.addPage();
    doc.rect(0, 0, pageWidth, pageHeight).fill(C_DARK_COVER);

    // Double Gold Frame
    doc.lineWidth(1.8).strokeColor(C_GOLD);
    doc.rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();
    doc.lineWidth(0.6).strokeColor(C_GOLD);
    doc.rect(26, 26, pageWidth - 52, pageHeight - 52).stroke();

    // Corner Ornaments
    [[26, 26], [pageWidth - 26 - cornerSize, 26], [26, pageHeight - 26 - cornerSize], [pageWidth - 26 - cornerSize, pageHeight - 26 - cornerSize]].forEach(([cx, cy]) => {
      doc.rect(cx, cy, cornerSize, cornerSize).fill(C_GOLD);
    });

    // Header Badge
    doc.roundedRect(pageWidth / 2 - 140, 50, 280, 24, 12).fillAndStroke(C_FOREST, C_GOLD);
    doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8.5).text(
      'ORDERING, WHOLESALE & CORPORATE GIFTING GUIDE',
      0,
      58,
      { align: 'center', width: pageWidth }
    );

    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(26).text(
      "NATURE'S MUD NEPAL",
      0,
      86,
      { align: 'center', width: pageWidth }
    );
    doc.fillColor(C_BRIGHT_GOLD).font('Helvetica').fontSize(11).text(
      'Official Master Catalogue Edition 2026 • Kathmandu, Nepal',
      0,
      118,
      { align: 'center', width: pageWidth }
    );

    // 3 Editorial Information Blocks
    const infoCardY = 145;
    const iBoxW = contentWidth - 20;

    // Block 1: Retail & Direct Delivery Network
    doc.roundedRect(margin + 10, infoCardY, iBoxW, 108, 6).fill('#13291F');
    doc.lineWidth(0.8).strokeColor(C_GOLD);
    doc.roundedRect(margin + 10, infoCardY, iBoxW, 108, 6).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text('🚚 NATIONWIDE FAST DISPATCH & FULFILLMENT', margin + 22, infoCardY + 12);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(
      '• Kathmandu Valley: Same-day or guaranteed next-day express delivery directly to your doorstep.\n' +
      '• Nationwide Nepal: Swift 2 to 4 business days insured delivery across all 7 provinces via partner couriers.\n' +
      '• Packaging: Temperature-stable insulated bubble-wrapped glass jars & sealed pouches designed for safe transit.\n' +
      '• Free Shipping: Complimentary delivery on qualifying retail & subscription orders.',
      margin + 22,
      infoCardY + 32,
      { lineGap: 3.5 }
    );

    // Block 2: B2B Wholesale, Hotels, Cafes & Corporate Gifting
    const b2bY = infoCardY + 122;
    doc.roundedRect(margin + 10, b2bY, iBoxW, 115, 6).fill('#13291F');
    doc.lineWidth(0.8).strokeColor(C_GOLD);
    doc.roundedRect(margin + 10, b2bY, iBoxW, 115, 6).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text('💼 B2B WHOLESALE, DEALERS & CORPORATE GIFTING', margin + 22, b2bY + 12);
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(
      '• Commercial Tiers: Attractive volume discounts available for organic marts, wellness resorts, cafes, and health stores.\n' +
      '• Custom Corporate Hampers: Luxury wooden gift boxes with customized company ribboning & engraved message cards.\n' +
      '• Bulk Food-Service Packs: Available in 1kg, 5kg, and 10kg food-grade vacuum packs for culinary professionals.\n' +
      '• Direct Dealer Inquiries: Contact our dedicated wholesale manager via WhatsApp at +977 9819844486.',
      margin + 22,
      b2bY + 32,
      { lineGap: 3.5 }
    );

    // Block 3: Direct Contacts & QR Box
    const contactCardY = b2bY + 130;
    doc.roundedRect(margin + 10, contactCardY, iBoxW, 235, 6).fill('#0E2218');
    doc.lineWidth(1).strokeColor(C_GOLD);
    doc.roundedRect(margin + 10, contactCardY, iBoxW, 235, 6).stroke();

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(12).text('CONNECT WITH NATURE\'S MUD', margin + 22, contactCardY + 14);

    // Contact Details Left Side
    const leftDetailX = margin + 22;
    const detailY = contactCardY + 38;

    const contactDetails = [
      { label: 'Headquarters & Flagship Store:', val: 'Samakhushi, Gongabu Chowk, Kathmandu, Nepal' },
      { label: 'Official Phone & WhatsApp Support:', val: '+977 9819844486  /  +977 9713888002' },
      { label: 'Customer Care Email:', val: 'info@naturesmud.shop  /  naturesmudnepal@gmail.com' },
      { label: 'Official Webstore:', val: 'https://naturesmud.shop' },
      { label: 'Social Channels:', val: 'Instagram: @naturesmud_official  •  Facebook: /naturesmud' }
    ];

    let cY = detailY;
    contactDetails.forEach((cd) => {
      doc.fillColor(C_CHAMPAGNE).font('Helvetica-Bold').fontSize(8.5).text(cd.label, leftDetailX, cY);
      doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text(cd.val, leftDetailX, cY + 12);
      cY += 28;
    });

    // Embed QR code on right side if exists
    const qrPath = path.join(rootDir, 'public/images/krisha-fonepay-qr.png');
    if (fs.existsSync(qrPath)) {
      try {
        const qrW = 105;
        const qrH = 105;
        const qrX = margin + iBoxW - qrW - 20;
        const qrY = contactCardY + 45;

        doc.roundedRect(qrX - 6, qrY - 6, qrW + 12, qrH + 12, 6).fill(C_WHITE);
        doc.image(qrPath, qrX, qrY, { width: qrW, height: qrH, fit: [qrW, qrH] });
        doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7.5).text('Instant Fonepay / QR Order', qrX - 10, qrY + qrH + 8, { align: 'center', width: qrW + 20 });
      } catch (qrErr) {}
    }

    // Bottom copyright note
    doc.fillColor(C_CHAMPAGNE).font('Helvetica').fontSize(8).text(
      '© 2026 Nature\'s Mud Nepal Pvt. Ltd. All rights reserved. The Himalayan Edit Master Edition.',
      0,
      pageHeight - 65,
      { align: 'center', width: pageWidth }
    );
    doc.fillColor('#8A9E93').font('Helvetica').fontSize(7).text(
      'All products are manufactured under certified clean hygiene standards. Store in cool, dry conditions away from direct sunlight.',
      0,
      pageHeight - 52,
      { align: 'center', width: pageWidth }
    );

    // Finalize PDF Document
    doc.end();

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // Copy to alias paths
    fs.copyFileSync(primaryPdfPath, aliasPdfPath);
    fs.copyFileSync(primaryPdfPath, magazinePdfPath);

    const stats = fs.statSync(primaryPdfPath);
    console.log(`✅ Master Magazine PDF created successfully! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
    console.log(`  -> Output: ${primaryPdfPath}`);
    console.log(`  -> Alias: ${aliasPdfPath}`);
    console.log(`  -> Magazine: ${magazinePdfPath}`);
}

createMagazinePDF().catch((err) => {
  console.error('❌ Failed to generate magazine PDF:', err);
  process.exit(1);
});
