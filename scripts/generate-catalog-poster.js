const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const outJpg1 = path.join(rootDir, 'public', 'official-product-catalog.jpg');
const outJpg2 = path.join(rootDir, 'public', 'images', 'official-product-catalog.jpg');

async function createPoster() {
  console.log('🌟 Generating Master Flyer Poster with all 29 active products...');
  const W = 1600;
  const H = 3450;

  // Read and convert small thumbs to base64 data URLs for embedding into SVG
  async function getBase64Img(relPath, maxW = 280) {
    const full = path.join(rootDir, relPath);
    if (!fs.existsSync(full)) return '';
    try {
      const buf = await sharp(full)
        .resize({ width: maxW, height: maxW, fit: 'inside' })
        .jpeg({ quality: 85 })
        .toBuffer();
      return `data:image/jpeg;base64,${buf.toString('base64')}`;
    } catch {
      return '';
    }
  }

  // Thumbnails
  const imgMango = await getBase64Img('public/products/authentic-dehydrated-mango.jpg', 220);
  const imgPineapple = await getBase64Img('public/products/dehydrated-pineapple.jpg', 220);
  const imgApple = await getBase64Img('public/products/dehydrated-apple.jpg', 220);
  const imgBlueberries = await getBase64Img('public/products/dried-blueberries-100g.jpg', 220);

  const imgAvocado = await getBase64Img('public/products/freeze-dried-avocado-powder.jpg', 220);
  const imgStrawberry = await getBase64Img('public/products/strawberry-powder.jpg', 220);
  const imgMoringa = await getBase64Img('public/products/moringa-leaf-powder.jpg', 220);
  const imgDates = await getBase64Img('public/products/dates-powder-100g.jpg', 220);

  const imgAlmonds = await getBase64Img('public/products/almonds.jpg', 220);
  const imgCashews = await getBase64Img('public/products/cashewnuts.jpg', 220);
  const imgPistachios = await getBase64Img('public/products/pistachios.jpg', 220);
  const imgPumpkin = await getBase64Img('public/products/pumpkin-seeds.jpg', 220);

  const imgShilajit = await getBase64Img('public/products/shilajit.jpg', 220);
  const imgChia = await getBase64Img('public/products/chia-seeds.jpg', 220);
  const imgPinkSalt = await getBase64Img('public/products/pink-salt.jpg', 220);
  const imgCoconutOil = await getBase64Img('public/products/coconut-oil.jpg', 220);

  // SVG Markup with vintage botanical luxury Himalayan styling
  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBF8F1" />
      <stop offset="50%" stop-color="#F7F3E8" />
      <stop offset="100%" stop-color="#F2ECE0" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0E2317" />
      <stop offset="50%" stop-color="#163825" />
      <stop offset="100%" stop-color="#0E2317" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#9C7728" />
    </linearGradient>
    <linearGradient id="tableHeadGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#143020" />
      <stop offset="100%" stop-color="#234F36" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#143020" flood-opacity="0.14" />
    </filter>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.07" />
    </filter>
  </defs>

  <style>
    .title { font-family: 'Georgia', 'Playfair Display', serif; font-weight: bold; }
    .sans { font-family: 'Helvetica Neue', 'Arial', sans-serif; }
    .mono { font-family: 'Courier New', monospace; font-weight: bold; }
  </style>

  <!-- Background -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#bgGrad)" />

  <!-- Outer Double Border with Gold Filigree -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#C5A059" stroke-width="3" rx="16" />
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="#143020" stroke-width="1.2" rx="12" stroke-dasharray="8,4" />

  <!-- Corner Gold Squares -->
  <rect x="28" y="28" width="16" height="16" fill="#C5A059" />
  <rect x="${W - 44}" y="28" width="16" height="16" fill="#C5A059" />
  <rect x="28" y="${H - 44}" width="16" height="16" fill="#C5A059" />
  <rect x="${W - 44}" y="${H - 44}" width="16" height="16" fill="#C5A059" />

  <!-- ==================== TOP BANNER ==================== -->
  <g transform="translate(60, 55)">
    <!-- Header Box -->
    <rect x="0" y="0" width="${W - 120}" height="205" rx="14" fill="url(#headerGrad)" filter="url(#shadow)" />
    <rect x="2" y="2" width="${W - 124}" height="201" rx="12" fill="none" stroke="#C5A059" stroke-width="1.5" />

    <!-- Top Badge -->
    <rect x="${(W - 120)/2 - 210}" y="16" width="420" height="26" rx="13" fill="#C5A059" />
    <text x="${(W - 120)/2}" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#0E2317" letter-spacing="2">
      OFFICIAL MASTER PRODUCT CATALOG &amp; MRP PRICE LIST · 2026/2027
    </text>

    <!-- Main Title -->
    <text x="${(W - 120)/2}" y="94" text-anchor="middle" class="title" font-size="52" fill="#FFFFFF" letter-spacing="4">
      NATURE'S MUD
    </text>
    <text x="${(W - 120)/2}" y="132" text-anchor="middle" class="title" font-size="17" fill="#F4E8C1" letter-spacing="2">
      HIMALAYAN ARTISANAL APOTHECARY &amp; LIVING WHOLE FOODS
    </text>

    <!-- Subtitle Trust Line -->
    <text x="${(W - 120)/2}" y="158" text-anchor="middle" class="sans" font-size="12" fill="#FFFFFF" opacity="0.9" letter-spacing="1">
      SOLAR DEHYDRATED &lt;42°C  •  100% SINGLE-INGREDIENT BOTANICALS  •  ZERO CANE SUGAR  •  LAB TESTED FOR PURITY
    </text>

    <!-- Lower Header Badges -->
    <g transform="translate(20, 172)">
      <rect x="0" y="0" width="${W - 160}" height="24" rx="4" fill="rgba(255,255,255,0.08)" />
      <text x="${(W - 160)/2}" y="16" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#C5A059">
        ALL 29 ACTIVE PRODUCTS · SYNCHRONIZED WITH CENTRAL INVENTORY &amp; LIVE STORE (NATURESMUD.SHOP)
      </text>
    </g>
  </g>

  <!-- ==================== LEFT COLUMN ==================== -->

  <!-- SECTION 1: SOLAR-DEHYDRATED HIMALAYAN FRUITS (7 Products) -->
  <g transform="translate(60, 280)">
    <rect x="0" y="0" width="710" height="730" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      1. SOLAR-DEHYDRATED FRUITS &amp; ALPINE BERRIES
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      &lt;42°C RAW LIVING ENZYMES
    </text>

    <!-- Visual Showcase: 4 Fruit Thumbs -->
    <g transform="translate(20, 62)">
      <rect x="0" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgMango}" x="10" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="77" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Mango Slices</text>

      <rect x="170" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPineapple}" x="180" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="247" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Pineapple Rings</text>

      <rect x="340" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgApple}" x="350" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="417" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Jumla Apple</text>

      <rect x="510" y="0" width="160" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgBlueberries}" x="522" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="590" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#1E3A8A">Blueberries</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 210)">
      <rect x="0" y="0" width="670" height="30" rx="4" fill="#143020" />
      <text x="15" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="45" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">PRODUCT NAME &amp; NUTRITIONAL BENEFIT</text>
      <text x="375" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="460" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="20" text-anchor="end" class="sans" font-size="10.5" font-weight="bold" fill="#F4E8C1">MRP (NPR)</text>
    </g>

    <!-- 7 Product Rows -->
    <!-- Row 1: Mango -->
    <g transform="translate(20, 248)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">1</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Dehydrated Himalayan Mango</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Tree-ripened, 100% fruit, high Vitamins A &amp; C, 0% added sugar</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 595</text>
    </g>

    <!-- Row 2: Pineapple -->
    <g transform="translate(20, 314)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">2</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Dehydrated Himalayan Pineapple</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Tangy-sweet rings with active digestive bromelain enzyme</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 495</text>
    </g>

    <!-- Row 3: Apple -->
    <g transform="translate(20, 380)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">3</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Dehydrated Himalayan Apple</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">High-altitude Jumla apples with skin intact for quercetin fiber</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 510</text>
    </g>

    <!-- Row 4: Coconut Chips -->
    <g transform="translate(20, 446)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">4</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Dehydrated Coconut Chips</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Crisp toasted coconut flakes rich in healthy keto MCT fats</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 475</text>
    </g>

    <!-- Row 5: Papaya -->
    <g transform="translate(20, 512)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">5</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Dehydrated Papaya Slices</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Solar-dehydrated below 42°C to retain papain digestive enzymes</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">90 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 395</text>
    </g>

    <!-- Row 6: Blueberries -->
    <g transform="translate(20, 578)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">6</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Wild Dried Blueberries</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Alpine wild berries with high anthocyanins for screen eye defense</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Sealed Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 650</text>
    </g>

    <!-- Row 7: Cranberries -->
    <g transform="translate(20, 644)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" rx="4" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">7</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Whole Dried Cranberries</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">High Type-A PACs to support urinary tract and cellular defense</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Sealed Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 415</text>
    </g>
  </g>

  <!-- SECTION 2: HIMALAYAN SUPERFOOD POWDERS (8 Products) -->
  <g transform="translate(60, 1035)">
    <rect x="0" y="0" width="710" height="850" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      2. HIMALAYAN SUPERFOOD POWDERS &amp; NATURAL SWEETENERS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      MICRO-MILLED • 100% SINGLE-INGREDIENT
    </text>

    <!-- Visual Showcase: 4 Powder Thumbs -->
    <g transform="translate(20, 62)">
      <rect x="0" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgAvocado}" x="10" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="77" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#1E3A8A">Avocado Powder</text>

      <rect x="170" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgStrawberry}" x="180" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="247" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#BE123C">Strawberry</text>

      <rect x="340" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgMoringa}" x="350" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="417" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#15803D">Moringa Leaf</text>

      <rect x="510" y="0" width="160" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgDates}" x="522" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="590" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Dates Powder</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 210)">
      <rect x="0" y="0" width="670" height="30" rx="4" fill="#143020" />
      <text x="15" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="45" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">SUPERFOOD BOTANICAL &amp; FUNCTION</text>
      <text x="375" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="460" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="20" text-anchor="end" class="sans" font-size="10.5" font-weight="bold" fill="#F4E8C1">MRP (NPR)</text>
    </g>

    <!-- 8 Powder Rows -->
    <!-- 8: Avocado -->
    <g transform="translate(20, 248)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">8</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Freeze-Dried Avocado Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">100% Hass avocado, potassium, monounsaturated omega fats</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 790</text>
    </g>

    <!-- 9: Strawberry -->
    <g transform="translate(20, 308)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">9</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Pure Natural Strawberry Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">100% real strawberries, ellagic acid, rich in vitamin C</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 620</text>
    </g>

    <!-- 10: Banana -->
    <g transform="translate(20, 368)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">10</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Pure Green Banana Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">High resistant starch prebiotic fiber for gut microbiome</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 590</text>
    </g>

    <!-- 11: Moringa -->
    <g transform="translate(20, 428)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">11</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Organic Moringa Leaf Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">90+ essential nutrients, plant protein, chlorophyll vitality</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 690</text>
    </g>

    <!-- 12: Dates -->
    <g transform="translate(20, 488)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">12</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Natural Dates Powder Sweetener</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">1:1 natural replacement for refined white sugar, rich in iron</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 400</text>
    </g>

    <!-- 13: Beetroot -->
    <g transform="translate(20, 548)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">13</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Himalayan Beetroot Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">Dietary nitrate booster for athletic endurance and skin glow</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 430</text>
    </g>

    <!-- 14: Sweet Potato -->
    <g transform="translate(20, 608)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">14</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Organic Sweet Potato Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">Gentle complex carbohydrate for baby weaning and athletic stamina</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 510</text>
    </g>

    <!-- 15: Carrot -->
    <g transform="translate(20, 668)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" rx="4" />
      <circle cx="20" cy="27" r="11" fill="#FAF5E8" />
      <text x="20" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">15</text>
      <text x="45" y="22" class="title" font-size="13.5" font-weight="bold" fill="#143020">Organic Carrot Powder</text>
      <text x="45" y="39" class="sans" font-size="9.5" fill="#666">Beta-Carotene (Pro-Vitamin A) for ocular health and smooth skin</text>
      <text x="375" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="460" y="31" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 490</text>
    </g>

    <!-- Section Sub-Banner -->
    <g transform="translate(20, 736)">
      <rect x="0" y="0" width="670" height="96" rx="8" fill="#F4EFE2" stroke="#C5A059" stroke-width="1" />
      <text x="20" y="26" class="title" font-size="13" font-weight="bold" fill="#143020">
        Holistic Weaning &amp; Family Nutrition Standard:
      </text>
      <text x="20" y="46" class="sans" font-size="10" fill="#444">
        Our micro-milled powders mix instantly without clumps into warm baby porridges (6m+), smoothies,
      </text>
      <text x="20" y="62" class="sans" font-size="10" fill="#444">
        curd, or doughs. Chemical-free, laboratory screened for heavy metals, and certified food-safe.
      </text>
      <text x="20" y="82" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">
        • Holistic Wellness Approved • Zero Added Cane Sugar • 100% Single-Ingredient Purity
      </text>
    </g>
  </g>

  <!-- ==================== RIGHT COLUMN ==================== -->

  <!-- SECTION 3: MOUNTAIN WHOLE NUTS & ROASTED KERNELS (7 Products) -->
  <g transform="translate(830, 280)">
    <rect x="0" y="0" width="710" height="730" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      3. MOUNTAIN WHOLE NUTS, SEEDS &amp; KERNELS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      ARTISAN DRY ROASTED • ZERO PALM OIL
    </text>

    <!-- Visual Showcase: 4 Nut Thumbs -->
    <g transform="translate(20, 62)">
      <rect x="0" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgAlmonds}" x="10" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="77" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Almonds</text>

      <rect x="170" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgCashews}" x="180" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="247" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Jumbo Cashews</text>

      <rect x="340" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPistachios}" x="350" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="417" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#15803D">Pistachios</text>

      <rect x="510" y="0" width="160" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPumpkin}" x="522" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="590" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#143020">Pumpkin Seeds</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 210)">
      <rect x="0" y="0" width="670" height="30" rx="4" fill="#143020" />
      <text x="15" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="45" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">NUT / KERNEL &amp; ROAST GRADE</text>
      <text x="375" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="460" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="20" text-anchor="end" class="sans" font-size="10.5" font-weight="bold" fill="#F4E8C1">MRP (NPR)</text>
    </g>

    <!-- 7 Nut Rows -->
    <!-- 16: Raw Almonds -->
    <g transform="translate(20, 248)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">16</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Raw Himalayan Almonds</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Unroasted whole mountain almonds rich in natural Vitamin E</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 750</text>
    </g>

    <!-- 17: Roasted Almonds -->
    <g transform="translate(20, 314)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">17</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Roasted Himalayan Almonds</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Artisan slow-roasted with a light dusting of Himalayan pink salt</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 750</text>
    </g>

    <!-- 18: Jumbo Cashews -->
    <g transform="translate(20, 380)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">18</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Premium Jumbo Cashew Nuts</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Raw, sweet creamy whole kernels, rich in copper and plant protein</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 750</text>
    </g>

    <!-- 19: Roasted Cashews -->
    <g transform="translate(20, 446)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">19</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Roasted Himalayan Cashew Nuts</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Crisp golden roasted kernels with trace minerals, oil-free</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">150 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 750</text>
    </g>

    <!-- 20: Pistachios -->
    <g transform="translate(20, 512)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">20</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Premium Roasted Pistachios</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">In-shell lightly salted pistachios rich in lutein and eye antioxidants</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 820</text>
    </g>

    <!-- 21: Pumpkin Seeds -->
    <g transform="translate(20, 578)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">21</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Raw Himalayan Pumpkin Seeds</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Grade-A raw pepitas loaded with restorative zinc, magnesium, tryptophan</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">300 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 650</text>
    </g>

    <!-- 22: Figs (Anjeer) -->
    <g transform="translate(20, 644)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" rx="4" />
      <circle cx="20" cy="30" r="11" fill="#FAF5E8" />
      <text x="20" y="34" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">22</text>
      <text x="45" y="25" class="title" font-size="14" font-weight="bold" fill="#143020">Premium Turkish Figs (Anjeer)</text>
      <text x="45" y="44" class="sans" font-size="10" fill="#666">Sun-cured whole tender figs rich in bioavailable calcium &amp; gut fiber</text>
      <text x="375" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#143020">Rs. 850</text>
    </g>
  </g>

  <!-- SECTION 4: SACRED MINERALS, BOTANICAL ELIXIRS & OILS (7 Products) -->
  <g transform="translate(830, 1035)">
    <rect x="0" y="0" width="710" height="850" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      4. SACRED MINERALS, BOTANICAL ELIXIRS &amp; COLD-PRESSED OILS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      75%+ FULVIC ACID • 84+ MINERALS
    </text>

    <!-- Visual Showcase: 4 Elixir Thumbs -->
    <g transform="translate(20, 62)">
      <rect x="0" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgShilajit}" x="10" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="77" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#C5A059">Shilajit Resin</text>

      <rect x="170" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgChia}" x="180" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="247" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#143020">Chia Seeds</text>

      <rect x="340" y="0" width="155" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPinkSalt}" x="350" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="417" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#BE123C">Pink Rock Salt</text>

      <rect x="510" y="0" width="160" height="135" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgCoconutOil}" x="522" y="8" width="135" height="105" preserveAspectRatio="xMidYMid meet" />
      <text x="590" y="126" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#8E4B00">Virgin Coconut</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 210)">
      <rect x="0" y="0" width="670" height="30" rx="4" fill="#143020" />
      <text x="15" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="45" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">BOTANICAL ELIXIR &amp; ESSENTIAL</text>
      <text x="375" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="460" y="20" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="20" text-anchor="end" class="sans" font-size="10.5" font-weight="bold" fill="#F4E8C1">MRP (NPR)</text>
    </g>

    <!-- 7 Elixir Rows -->
    <!-- 23: Shilajit -->
    <g transform="translate(20, 248)">
      <rect x="0" y="0" width="670" height="58" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">23</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Pure Mountain Shilajit Resin</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Gold Grade Himalayan resin, 75%+ fulvic acid, 84+ ionic trace minerals</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">20 GM</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Amber Jar+Spoon</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 1,995</text>
    </g>

    <!-- 24: Chia Seeds -->
    <g transform="translate(20, 312)">
      <rect x="0" y="0" width="670" height="58" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">24</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Organic Raw Chia Seeds</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Soluble mucilage fiber &amp; plant omega-3 ALA for sustained hydration</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">300 GM</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 495</text>
    </g>

    <!-- 25: Pink Salt -->
    <g transform="translate(20, 376)">
      <rect x="0" y="0" width="670" height="58" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">25</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Himalayan Pink Rock Salt</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Unrefined ancient rock salt crystals with 84 raw electrolyte minerals</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 250</text>
    </g>

    <!-- 26: Black Salt -->
    <g transform="translate(20, 440)">
      <rect x="0" y="0" width="670" height="58" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">26</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Himalayan Black Salt (Bire Noon)</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Ayurvedic volcanic rock salt stimulating digestive agni &amp; easing bloating</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 220</text>
    </g>

    <!-- 27: Coconut Oil 200ml -->
    <g transform="translate(20, 504)">
      <rect x="0" y="0" width="670" height="58" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">27</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Cold-Pressed Virgin Coconut Oil</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Fresh raw unrefined extra virgin oil with lauric acid &amp; clean MCTs</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 ML</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Bottle</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 650</text>
    </g>

    <!-- 28: Coconut Oil 500ml -->
    <g transform="translate(20, 568)">
      <rect x="0" y="0" width="670" height="58" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">28</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Cold-Pressed Virgin Coconut Oil (500ml)</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Pure family kitchen size unrefined extra virgin oil, zero heat process</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">500 ML</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Bottle</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 1,750</text>
    </g>

    <!-- 29: Makhana -->
    <g transform="translate(20, 632)">
      <rect x="0" y="0" width="670" height="58" fill="#FFFFFF" stroke="#F0EBE0" rx="4" />
      <circle cx="20" cy="29" r="11" fill="#FAF5E8" />
      <text x="20" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">29</text>
      <text x="45" y="23" class="title" font-size="13.5" font-weight="bold" fill="#143020">Roasted Himalayan Makhana (Fox Nuts)</text>
      <text x="45" y="42" class="sans" font-size="9.5" fill="#666">Light, mineral-dense popped lotus seeds, plant protein &amp; calcium</text>
      <text x="375" y="32" class="sans" font-size="11.5" font-weight="bold" fill="#333">50 GM</text>
      <text x="460" y="32" class="sans" font-size="10.5" fill="#555">Glass Jar</text>
      <text x="655" y="34" text-anchor="end" class="title" font-size="15.5" font-weight="bold" fill="#143020">Rs. 390</text>
    </g>

    <!-- Section Sub-Banner -->
    <g transform="translate(20, 700)">
      <rect x="0" y="0" width="670" height="132" rx="8" fill="#F4EFE2" stroke="#C5A059" stroke-width="1" />
      <text x="20" y="26" class="title" font-size="13" font-weight="bold" fill="#143020">
        Sacred Himalayan Minerals &amp; Clean Oils Integrity:
      </text>
      <text x="20" y="46" class="sans" font-size="10" fill="#444">
        Our Shilajit is purified via traditional Ayurvedic triphala water filtration, guaranteeing 75%+ fulvic
      </text>
      <text x="20" y="62" class="sans" font-size="10" fill="#444">
        acid content free of heavy metals. Our virgin coconut oil is expeller-pressed cold without chemical solvents.
      </text>
      <text x="20" y="82" class="sans" font-size="10" font-weight="bold" fill="#C5A059">
        • Gold Grade Shilajit • 84+ Trace Minerals • 100% Raw Virgin Cold-Pressed Oils
      </text>
      <text x="20" y="106" class="sans" font-size="9" fill="#666">
        *Disclaimer: Natural functional food and mineral supplements. Not intended to diagnose, treat, or cure medical diseases.
      </text>
    </g>
  </g>

  <!-- ==================== BOTTOM FULL-WIDTH SECTIONS ==================== -->

  <!-- ORDERING CHANNELS & RETAIL EXPERIENCE STORES -->
  <g transform="translate(60, 1920)">
    <rect x="0" y="0" width="${W - 120}" height="280" rx="14" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L${W - 132},0 Q${W - 120},0 ${W - 120},12 L${W - 120},50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1.5">
      HOW TO ORDER ACROSS NEPAL &amp; AUTHORIZED RETAIL NETWORK
    </text>
    <text x="${W - 144}" y="32" text-anchor="end" class="sans" font-size="10.5" font-weight="bold" fill="#F4E8C1" letter-spacing="1">
      EXPRESS DELIVERY TO ALL 77 DISTRICTS
    </text>

    <!-- 3 Ordering Channel Cards -->
    <!-- Card 1: Official Website -->
    <g transform="translate(24, 68)">
      <rect x="0" y="0" width="455" height="188" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <text x="20" y="30" class="title" font-size="16" font-weight="bold" fill="#143020">Official Online Store</text>
      <text x="20" y="52" class="sans" font-size="15" font-weight="bold" fill="#C5A059">https://naturesmud.shop</text>
      <text x="20" y="76" class="sans" font-size="10.5" fill="#444">• Complete collection of all 29 active products</text>
      <text x="20" y="96" class="sans" font-size="10.5" fill="#444">• Instant checkout via eSewa, Khalti, Card &amp; COD</text>
      <text x="20" y="116" class="sans" font-size="10.5" fill="#444">• Live batch lab certificates &amp; nutritional specs</text>
      <text x="20" y="136" class="sans" font-size="10.5" fill="#444">• Automated SMS dispatch notification</text>
      <rect x="20" y="148" width="160" height="26" rx="4" fill="#143020" />
      <text x="100" y="165" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#FFFFFF">ORDER ONLINE</text>
    </g>

    <!-- Card 2: Phone & WhatsApp -->
    <g transform="translate(513, 68)">
      <rect x="0" y="0" width="455" height="188" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <text x="20" y="30" class="title" font-size="16" font-weight="bold" fill="#143020">Direct Phone &amp; WhatsApp</text>
      <text x="20" y="52" class="sans" font-size="18" font-weight="bold" fill="#143020">+977 9713888002</text>
      <text x="20" y="76" class="sans" font-size="10.5" fill="#444">• Instant order booking with our nutrition desk</text>
      <text x="20" y="96" class="sans" font-size="10.5" fill="#444">• Custom combo selection &amp; baby weaning advice</text>
      <text x="20" y="116" class="sans" font-size="10.5" fill="#444">• Fast voice and text support (8:00 AM – 9:00 PM)</text>
      <text x="20" y="136" class="sans" font-size="10.5" fill="#444">• Same-day dispatch inside Kathmandu Valley</text>
      <rect x="20" y="148" width="160" height="26" rx="4" fill="#C5A059" />
      <text x="100" y="165" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#0E2317">CHAT ON WHATSAPP</text>
    </g>

    <!-- Card 3: Retail Partners -->
    <g transform="translate(1002, 68)">
      <rect x="0" y="0" width="454" height="188" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <text x="20" y="30" class="title" font-size="16" font-weight="bold" fill="#143020">Authorized Store Locations</text>
      <text x="20" y="52" class="sans" font-size="11" font-weight="bold" fill="#143020">• Samakhushi, Gongabu Chowk (Flagship)</text>
      <text x="20" y="72" class="sans" font-size="11" fill="#444">• Kids Kottage: Gongabu, Kupondol &amp; Pokhara</text>
      <text x="20" y="92" class="sans" font-size="11" fill="#444">• Zero to Ten Baby Store: Chabahil Chowk</text>
      <text x="20" y="112" class="sans" font-size="11" fill="#444">• Baby Love Store: Main Road, Hetauda</text>
      <text x="20" y="132" class="sans" font-size="10.5" font-weight="bold" fill="#C5A059">Nationwide Express Delivery (24-48 hrs)</text>
      <text x="20" y="152" class="sans" font-size="10" fill="#666">Protective bubble wrap &amp; sealed carton guarantee</text>
    </g>
  </g>

  <!-- WHOLESALE, B2B & CORPORATE GIFTING HAMPERS -->
  <g transform="translate(60, 2235)">
    <rect x="0" y="0" width="${W - 120}" height="195" rx="14" fill="#0E2317" filter="url(#shadow)" />
    <rect x="2" y="2" width="${W - 124}" height="191" rx="12" fill="none" stroke="#C5A059" stroke-width="1.5" />

    <text x="36" y="38" class="title" font-size="22" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      WHOLESALE, B2B, SUPERMARKETS &amp; CORPORATE GIFTING
    </text>
    <text x="36" y="62" class="sans" font-size="12" fill="#F4E8C1" letter-spacing="0.5">
      SUPPLYING PREMIUM SUPERMARKETS, WELLNESS RESORTS, HOLISTIC HEALTH CENTERS &amp; CORPORATE CLIENTS
    </text>

    <text x="36" y="95" class="sans" font-size="11" fill="#FFFFFF" opacity="0.95">
      • Custom corporate gifting hampers for Dashain, Tihar, New Year, and AGMs in luxury pine wood and velvet packaging.
    </text>
    <text x="36" y="118" class="sans" font-size="11" fill="#FFFFFF" opacity="0.95">
      • Bulk institutional commercial packaging (5 KG, 10 KG, 25 KG) for organic grocers, bakeries, juice bars, and cafes.
    </text>
    <text x="36" y="141" class="sans" font-size="11" fill="#FFFFFF" opacity="0.95">
      • Direct B2B Wholesale Contact: Phone: +977 9713888002  |  Email: wholesale@naturesmud.shop  |  info@naturesmud.shop
    </text>

    <!-- Bottom Ribbon -->
    <rect x="36" y="158" width="${W - 192}" height="24" rx="4" fill="rgba(197, 160, 89, 0.2)" />
    <text x="${(W - 120)/2}" y="174" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#C5A059">
      100% SATISFACTION GUARANTEED · IMMEDIATE REPLACEMENT OR FULL REFUND IF NOT SATISFIED
    </text>
  </g>

  <!-- STATUTORY COMPLIANCE & ALTERNATIVE WELLNESS NOTICE -->
  <g transform="translate(60, 2465)">
    <rect x="0" y="0" width="${W - 120}" height="140" rx="10" fill="#F4EFE2" stroke="#C5A059" stroke-width="1.2" />
    <text x="24" y="26" class="title" font-size="13" font-weight="bold" fill="#143020">
      HOLISTIC WELLNESS STANDARDS &amp; STATUTORY COMPLIANCE NOTICE:
    </text>
    <text x="24" y="48" class="sans" font-size="9.5" fill="#444">
      Nature's Mud products are whole-food nutritional staples and traditional botanical supplements. They are not manufactured or intended
    </text>
    <text x="24" y="64" class="sans" font-size="9.5" fill="#444">
      to diagnose, treat, prevent, or cure any medical illness or disease. Nutritional and botanical insights in this catalog reflect classical
    </text>
    <text x="24" y="80" class="sans" font-size="9.5" fill="#444">
      Himalayan Ayurvedic ethnobotany and modern whole-food dietary sciences. Always consult a licensed healthcare practitioner or holistic
    </text>
    <text x="24" y="96" class="sans" font-size="9.5" fill="#444">
      nutritionist regarding individual medical or clinical dietary considerations.
    </text>
    <text x="24" y="120" class="sans" font-size="9.5" font-weight="bold" fill="#143020">
      Food Safety Screened • Heavy Metal Tested • No Added Sugar • No Chemical Bleaching • No Artificial Preservatives
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(60, 2635)">
    <line x1="0" y1="0" x2="${W - 120}" y2="0" stroke="#C5A059" stroke-width="1.5" />
    <text x="${(W - 120)/2}" y="30" text-anchor="middle" class="title" font-size="20" font-weight="bold" fill="#143020" letter-spacing="2">
      NATURE'S MUD · HIMALAYAN PURITY UNCOMPROMISED
    </text>
    <text x="${(W - 120)/2}" y="52" text-anchor="middle" class="sans" font-size="11" fill="#666" letter-spacing="1">
      HEADQUARTERS &amp; SHOWROOM: SAMAKHUSHI, GONGABU CHOWK, KATHMANDU, NEPAL
    </text>
    <text x="${(W - 120)/2}" y="72" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#143020">
      ORDER ONLINE: WWW.NATURESMUD.SHOP  |  DIRECT ASSISTANCE: +977 9713888002
    </text>
  </g>
</svg>
`;

  // Render SVG to Buffer with Sharp and save to JPG files
  const svgBuf = Buffer.from(svg.trim());
  const jpgBuf = await sharp(svgBuf)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();

  fs.writeFileSync(outJpg1, jpgBuf);
  console.log('✅ Generated Master Poster 1 at:', outJpg1, `(${(jpgBuf.length / 1024).toFixed(1)} KB)`);

  fs.writeFileSync(outJpg2, jpgBuf);
  console.log('✅ Generated Master Poster 2 at:', outJpg2, `(${(jpgBuf.length / 1024).toFixed(1)} KB)`);
}

createPoster().catch((err) => {
  console.error('❌ Poster generation failed:', err);
  process.exit(1);
});
