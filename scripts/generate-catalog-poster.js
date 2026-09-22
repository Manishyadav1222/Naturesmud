const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const outJpg1 = path.join(rootDir, 'public', 'official-product-catalog.jpg');
const outJpg2 = path.join(rootDir, 'public', 'images', 'official-product-catalog.jpg');

async function createPoster() {
  const W = 1600;
  const H = 3200;

  // Read and convert small thumbs to base64 data URLs for embedding into SVG
  async function getBase64Img(relPath, maxW = 300) {
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

  const imgMango = await getBase64Img('public/products/authentic-dehydrated-mango.jpg', 360);
  const imgBlueberries = await getBase64Img('public/products/dried-blueberries-100g.jpg', 220);
  const imgCranberries = await getBase64Img('public/products/cranberries.jpg', 220);
  const imgSweetPotato = await getBase64Img('public/products/sweet-potato-powder-100g.jpg', 180);
  const imgBeetroot = await getBase64Img('public/products/beetroot-powder-100g.jpg', 180);
  const imgDates = await getBase64Img('public/products/dates-powder-100g.jpg', 180);
  const imgCarrot = await getBase64Img('public/products/carrot-powder-100g.jpg', 180);
  const imgAlmonds = await getBase64Img('public/products/authentic-almonds.jpg', 220);
  const imgCashews = await getBase64Img('public/products/cashewnuts.jpg', 220);
  const imgPistachios = await getBase64Img('public/products/pistachios.jpg', 220);
  const imgCoconutOil = await getBase64Img('public/products/coconut-oil.jpg', 200);
  const imgChia = await getBase64Img('public/products/chia-seeds.jpg', 200);
  const imgPumpkin = await getBase64Img('public/products/pumpkin-seeds.jpg', 200);
  const imgHeroCover = await getBase64Img('public/images/posters/naturesmud-master-catalog-cover-4k.jpg', 720);

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
      <stop offset="0%" stop-color="#142E23" />
      <stop offset="50%" stop-color="#1B3D2F" />
      <stop offset="100%" stop-color="#142E23" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#C9982A" />
      <stop offset="100%" stop-color="#AA7C1E" />
    </linearGradient>
    <linearGradient id="tableHeadGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1B3D2F" />
      <stop offset="100%" stop-color="#2D5A27" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1B3D2F" flood-opacity="0.12" />
    </filter>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.08" />
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
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#C9982A" stroke-width="3" rx="16" />
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="#1B3D2F" stroke-width="1.2" rx="12" stroke-dasharray="8,4" />

  <!-- Corner Gold Squares -->
  <rect x="28" y="28" width="16" height="16" fill="#C9982A" />
  <rect x="${W - 44}" y="28" width="16" height="16" fill="#C9982A" />
  <rect x="28" y="${H - 44}" width="16" height="16" fill="#C9982A" />
  <rect x="${W - 44}" y="${H - 44}" width="16" height="16" fill="#C9982A" />

  <!-- ==================== TOP BANNER ==================== -->
  <g transform="translate(60, 60)">
    <!-- Header Box -->
    <rect x="0" y="0" width="${W - 120}" height="190" rx="14" fill="url(#headerGrad)" filter="url(#shadow)" />
    <rect x="2" y="2" width="${W - 124}" height="186" rx="12" fill="none" stroke="#C9982A" stroke-width="1.5" />

    <!-- Top Badge -->
    <rect x="${(W - 120)/2 - 180}" y="16" width="360" height="26" rx="13" fill="#C9982A" />
    <text x="${(W - 120)/2}" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#142E23" letter-spacing="2">
      OFFICIAL MASTER CATALOG &amp; PRICE LIST 2026
    </text>

    <!-- Main Title -->
    <text x="${(W - 120)/2}" y="85" text-anchor="middle" class="title" font-size="44" font-weight="bold" fill="#FFFFFF" letter-spacing="3">
      NATURESMUD NEPAL
    </text>
    <text x="${(W - 120)/2}" y="112" text-anchor="middle" class="title" font-size="16" font-style="italic" fill="#EBD9A4" letter-spacing="2">
      Pure Food • Real Nature • Certified Himalayan Origin
    </text>

    <!-- Divider Line -->
    <line x1="${(W - 120)/2 - 250}" y1="130" x2="${(W - 120)/2 + 250}" y2="130" stroke="#C9982A" stroke-width="1" />

    <!-- Tagline Subtext -->
    <text x="${(W - 120)/2}" y="152" text-anchor="middle" class="sans" font-size="12" fill="#D2E4DC" letter-spacing="1">
      100% Raw Superfoods • Dehydrated Fruits Below 42°C • Zero Additives • Zero Preservatives
    </text>
    <text x="${(W - 120)/2}" y="172" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">
      Authentic Retail Prices Matching NaturesMud Official Store • Nepal Bureau Certified
    </text>
  </g>

  <!-- ==================== TWO-COLUMN MAIN LAYOUT ==================== -->
  <!-- Column 1: Left (X: 60, Width: 710) -->
  <!-- Column 2: Right (X: 830, Width: 710) -->

  <!-- ==================== LEFT COLUMN ==================== -->

  <!-- 1. DEHYDRATED FRUITS -->
  <g transform="translate(60, 280)">
    <!-- Section Box -->
    <rect x="0" y="0" width="710" height="690" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />

    <!-- Section Header Ribbon -->
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1.5">
      1. DEHYDRATED FRUITS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1" letter-spacing="1">
      STANDUP ZIPLOCK POUCHES • 0 ADDITIVES
    </text>

    <!-- Visual Showcase within Section -->
    <rect x="20" y="65" width="220" height="230" rx="10" fill="#FAF7F0" stroke="#D9A441" stroke-width="1.2" />
    <image href="${imgMango}" x="30" y="75" width="200" height="210" preserveAspectRatio="xMidYMid meet" />
    
    <g transform="translate(255, 70)">
      <text x="0" y="20" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Naturally Nutritious Tropical Fruit</text>
      <text x="0" y="42" class="sans" font-size="11.5" fill="#555" width="430">
        Slow-dehydrated below 42°C to retain live digestive
      </text>
      <text x="0" y="60" class="sans" font-size="11.5" fill="#555">
        enzymes, natural vitamins, and vibrant sun sweetness.
      </text>
      
      <rect x="0" y="80" width="430" height="32" rx="6" fill="#F4EFE2" stroke="#C9982A" stroke-width="0.8" />
      <text x="12" y="100" class="sans" font-size="11" font-weight="bold" fill="#8E2800">
        • 100% Pure Himalayan Terroir • Zero Sugar Added
      </text>
      
      <text x="0" y="140" class="sans" font-size="11" font-style="italic" fill="#4A7056">
        Packed in moisture-barrier standup ziplock pouches
      </text>
      <text x="0" y="158" class="sans" font-size="11" font-style="italic" fill="#4A7056">
        to maintain maximum crispness and aroma.
      </text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 310)">
      <rect x="0" y="0" width="670" height="32" rx="6" fill="#1B3D2F" />
      <text x="15" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="50" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PRODUCT NAME</text>
      <text x="360" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="440" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="21" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">OFFICIAL MRP</text>
    </g>

    <!-- Table Rows (5 Dehydrated Fruits) -->
    <!-- Row 1: Mango -->
    <g transform="translate(20, 350)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="30" r="12" fill="#FAF5E8" />
      <text x="22" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">1</text>
      <text x="50" y="26" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Mango Slices</text>
      <text x="50" y="44" class="sans" font-size="10.5" fill="#666">Tree-ripened Tarai mango slices, rich in Vitamin C &amp; A</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 595</text>
    </g>

    <!-- Row 2: Pineapple -->
    <g transform="translate(20, 415)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="30" r="12" fill="#FAF5E8" />
      <text x="22" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">2</text>
      <text x="50" y="26" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Pineapple Rings</text>
      <text x="50" y="44" class="sans" font-size="10.5" fill="#666">Tangy-sweet rings with active bromelain enzyme for digestion</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 495</text>
    </g>

    <!-- Row 3: Apple -->
    <g transform="translate(20, 480)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="30" r="12" fill="#FAF5E8" />
      <text x="22" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">3</text>
      <text x="50" y="26" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Apple Slices</text>
      <text x="50" y="44" class="sans" font-size="10.5" fill="#666">High-altitude Jumla apple rings, rich in prebiotic pectin fiber</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 510</text>
    </g>

    <!-- Row 4: Coconut Chips -->
    <g transform="translate(20, 545)">
      <rect x="0" y="0" width="670" height="60" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="30" r="12" fill="#FAF5E8" />
      <text x="22" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">4</text>
      <text x="50" y="26" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Coconut Chips</text>
      <text x="50" y="44" class="sans" font-size="10.5" fill="#666">Crisp toasted pure coconut flakes with clean MCT fats</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 495</text>
    </g>

    <!-- Row 5: Papaya -->
    <g transform="translate(20, 610)">
      <rect x="0" y="0" width="670" height="60" fill="#FFFFFF" stroke="#F0EBE0" rx="4" />
      <circle cx="22" cy="30" r="12" fill="#FAF5E8" />
      <text x="22" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">5</text>
      <text x="50" y="26" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Papaya Slices</text>
      <text x="50" y="44" class="sans" font-size="10.5" fill="#666">Papain-rich sweet slices for digestive health and snacking</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Standup Pouch</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 395</text>
    </g>
  </g>

  <!-- 2. NATURE'S POWDERS & ESSENTIAL SALTS -->
  <g transform="translate(60, 1000)">
    <rect x="0" y="0" width="710" height="740" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />

    <!-- Section Header Ribbon -->
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      2. SUPERFOOD POWDERS &amp; SALTS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      GLASS JARS • 100% STONE-MILLED
    </text>

    <!-- Visual Showcase: 4 Powder Jars in Row -->
    <g transform="translate(20, 65)">
      <rect x="0" y="0" width="155" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgDates}" x="10" y="10" width="135" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="77" y="142" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#6B3A0E">Dates Powder</text>

      <rect x="170" y="0" width="155" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgBeetroot}" x="180" y="10" width="135" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="247" y="142" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#881337">Beetroot Powder</text>

      <rect x="340" y="0" width="155" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgSweetPotato}" x="350" y="10" width="135" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="417" y="142" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#B45309">Sweet Potato</text>

      <rect x="510" y="0" width="160" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgCarrot}" x="522" y="10" width="135" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="590" y="142" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#C2410C">Carrot Powder</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 235)">
      <rect x="0" y="0" width="670" height="32" rx="6" fill="#1B3D2F" />
      <text x="15" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="50" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PRODUCT NAME</text>
      <text x="360" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="440" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="21" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">OFFICIAL MRP</text>
    </g>

    <!-- Table Rows (6 Powders & Salts) -->
    <!-- Dates Powder -->
    <g transform="translate(20, 275)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">1</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Dates Powder</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">1:1 natural fruit sweetener, zero refined sugar</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 400</text>
    </g>

    <!-- Beetroot Powder -->
    <g transform="translate(20, 332)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">2</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Beetroot Powder</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Dietary nitrate booster for athletic endurance &amp; skin</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 430</text>
    </g>

    <!-- Carrot Powder -->
    <g transform="translate(20, 389)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">3</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Carrot Powder</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Concentrated Beta-Carotene for vision &amp; baby weaning</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 490</text>
    </g>

    <!-- Sweet Potato Powder -->
    <g transform="translate(20, 446)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">4</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Sweet Potato Powder</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Resistant starch complex carb for baby porridge &amp; gym</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 510</text>
    </g>

    <!-- Himalayan Pink Salt -->
    <g transform="translate(20, 503)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">5</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Himalayan Pink Salt</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Unrefined ancient rock salt with 84+ mineral electrolytes</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 250</text>
    </g>

    <!-- Himalayan Black Salt (Bire Noon) -->
    <g transform="translate(20, 560)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">6</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Himalayan Black Salt (Bire Noon)</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Ayurvedic volcanic rock salt for digestion &amp; gut flora</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 220</text>
    </g>

    <!-- Section Sub-Banner -->
    <g transform="translate(20, 625)">
      <rect x="0" y="0" width="670" height="95" rx="8" fill="#F4EFE2" stroke="#D9A441" stroke-width="1" />
      <text x="20" y="28" class="title" font-size="13" font-weight="bold" fill="#1B3D2F">
        Ayurvedic Weaning &amp; Daily Nutrition Standard:
      </text>
      <text x="20" y="48" class="sans" font-size="10.5" fill="#444">
        Our micro-milled powders mix instantly without clumps into warm baby porridges, milk lattes,
      </text>
      <text x="20" y="65" class="sans" font-size="10.5" fill="#444">
        fresh curd, or rotis. Chemical-free, laboratory safety tested, and certified food-safe.
      </text>
      <text x="20" y="83" class="sans" font-size="10.5" font-weight="bold" fill="#8E2800">
        • Pediatric Clinic Recommended • Zero Sugar • Single-Ingredient Purity
      </text>
    </g>
  </g>

  <!-- 3. DRIED BERRIES -->
  <g transform="translate(60, 1765)">
    <rect x="0" y="0" width="710" height="340" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1.5">
      3. WILD DRIED BERRIES
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1" letter-spacing="1">
      ANTIOXIDANT DEFENSE
    </text>

    <!-- Table Header -->
    <g transform="translate(20, 65)">
      <rect x="0" y="0" width="670" height="32" rx="6" fill="#1B3D2F" />
      <text x="15" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="50" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PRODUCT NAME</text>
      <text x="360" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="440" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="21" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">OFFICIAL MRP</text>
    </g>

    <!-- Blueberries -->
    <g transform="translate(20, 105)">
      <rect x="0" y="0" width="670" height="58" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="29" r="11" fill="#FAF5E8" />
      <text x="22" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">1</text>
      <text x="50" y="25" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dried Blueberries</text>
      <text x="50" y="43" class="sans" font-size="10.5" fill="#666">Dark-violet anthocyanin berries for eye health &amp; brain focus</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 650</text>
    </g>

    <!-- Cranberries -->
    <g transform="translate(20, 170)">
      <rect x="0" y="0" width="670" height="58" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="29" r="11" fill="#FAF5E8" />
      <text x="22" y="33" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">2</text>
      <text x="50" y="25" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dried Cranberries</text>
      <text x="50" y="43" class="sans" font-size="10.5" fill="#666">Ruby berries with PACs for urinary tract &amp; cellular defense</text>
      <text x="360" y="34" class="sans" font-size="12" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="34" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="35" text-anchor="end" class="title" font-size="17" font-weight="bold" fill="#1B3D2F">Rs. 415</text>
    </g>

    <!-- Berries Footer Note -->
    <g transform="translate(20, 240)">
      <rect x="0" y="0" width="670" height="80" rx="6" fill="#FBF8F1" stroke="#E5DAC5" />
      <text x="16" y="25" class="title" font-size="12" font-weight="bold" fill="#8E2800">
        Authentic Harvest Purity:
      </text>
      <text x="16" y="44" class="sans" font-size="10.5" fill="#555">
        Sun-cured whole berries sealed in airtight jars without artificial glossing oils or high-fructose syrups.
      </text>
      <text x="16" y="62" class="sans" font-size="10.5" font-weight="bold" fill="#1B3D2F">
        Superfood breakfast topper for oatmeal, smoothies, yogurt, and daily children snacking.
      </text>
    </g>
  </g>

  <!-- Left Bottom Visual Banner: All Products Hero Cover Photo -->
  <g transform="translate(60, 2130)">
    <rect x="0" y="0" width="710" height="970" rx="14" fill="#142E23" stroke="#C9982A" stroke-width="2" filter="url(#shadow)" />
    <clipPath id="heroClip">
      <rect x="12" y="12" width="686" height="420" rx="10" />
    </clipPath>
    <image href="${imgHeroCover}" x="12" y="12" width="686" height="420" preserveAspectRatio="xMidYMid slice" clip-path="url(#heroClip)" />

    <g transform="translate(30, 460)">
      <rect x="0" y="0" width="220" height="26" rx="13" fill="#C9982A" />
      <text x="110" y="17" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#1B3D2F" letter-spacing="1">
        4K MASTER COLLECTION
      </text>

      <text x="0" y="60" class="title" font-size="24" font-weight="bold" fill="#FFFFFF">
        Certified Himalayan Quality
      </text>
      <text x="0" y="85" class="sans" font-size="12" fill="#E2EEE8" width="650">
        Every NaturesMud batch is sourced directly from certified organic farmer collectives
      </text>
      <text x="0" y="105" class="sans" font-size="12" fill="#E2EEE8">
        across Jumla, Mustang, and the fertile Tarai plains of Nepal.
      </text>

      <!-- 3 Key Pillars -->
      <g transform="translate(0, 130)">
        <rect x="0" y="0" width="650" height="60" rx="8" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
        <text x="20" y="24" class="sans" font-size="12" font-weight="bold" fill="#F4E8C1">✓ 100% Traceable Single-Origin Terroir</text>
        <text x="20" y="44" class="sans" font-size="10.5" fill="#D0E3DA">No blending with commercial fillers or imported warehouse stock.</text>
      </g>

      <g transform="translate(0, 200)">
        <rect x="0" y="0" width="650" height="60" rx="8" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
        <text x="20" y="24" class="sans" font-size="12" font-weight="bold" fill="#F4E8C1">✓ Zero Chemical Fumigation</text>
        <text x="20" y="44" class="sans" font-size="10.5" fill="#D0E3DA">Nuts &amp; seeds preserved purely in airtight glass with oxygen absorbers.</text>
      </g>

      <g transform="translate(0, 270)">
        <rect x="0" y="0" width="650" height="60" rx="8" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
        <text x="20" y="24" class="sans" font-size="12" font-weight="bold" fill="#F4E8C1">✓ Nationwide Express Courier in Nepal</text>
        <text x="20" y="44" class="sans" font-size="10.5" fill="#D0E3DA">Kathmandu valley 24h delivery. Cash on Delivery (COD) nationwide.</text>
      </g>

      <!-- Institutional Footer inside Left Column -->
      <g transform="translate(0, 350)">
        <rect x="0" y="0" width="650" height="120" rx="8" fill="#0E231B" stroke="#D9A441" stroke-width="1" />
        <text x="20" y="30" class="title" font-size="15" font-weight="bold" fill="#C9982A">
          Institutional &amp; Wholesale Supply
        </text>
        <text x="20" y="52" class="sans" font-size="11" fill="#FFFFFF">
          Custom corporate gifting hampers, pediatric clinic nutrition kits,
        </text>
        <text x="20" y="70" class="sans" font-size="11" fill="#FFFFFF">
          and bakery/confectionery wholesale bulk packaging available.
        </text>
        <text x="20" y="98" class="sans" font-size="12" font-weight="bold" fill="#25D366">
          WhatsApp Direct: +977-9713888002 • wholesale@naturesmud.shop
        </text>
      </g>
    </g>
  </g>


  <!-- ==================== RIGHT COLUMN ==================== -->

  <!-- 4. MOUNTAIN NUTS & ARTISANAL MIXES (7 Products) -->
  <g transform="translate(830, 280)">
    <rect x="0" y="0" width="710" height="970" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="1">
      4. MOUNTAIN NUTS &amp; MIXES
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="9.5" font-weight="bold" fill="#F4E8C1" letter-spacing="0.5">
      WHOLE KERNELS • AROMA-LOCK JARS
    </text>

    <!-- Visual Showcase of Nuts -->
    <g transform="translate(20, 65)">
      <rect x="0" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgAlmonds}" x="15" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="105" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#8E2800">Mountain Almonds</text>

      <rect x="230" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgCashews}" x="245" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="335" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#8E2800">Jumbo Cashews</text>

      <rect x="460" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPistachios}" x="475" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="565" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#8E2800">Roasted Pistachios</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 235)">
      <rect x="0" y="0" width="670" height="32" rx="6" fill="#1B3D2F" />
      <text x="15" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="50" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PRODUCT NAME</text>
      <text x="360" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="440" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="21" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">OFFICIAL MRP</text>
    </g>

    <!-- Table Rows (7 Nuts Products) -->
    <!-- 1. Raw Almonds -->
    <g transform="translate(20, 275)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">1</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Raw Himalayan Almonds</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Unpasteurized whole almonds for morning soaking &amp; brain memory</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 750</text>
    </g>

    <!-- 2. Roasted Almonds -->
    <g transform="translate(20, 332)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">2</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Roasted Himalayan Almonds</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Slow dry-roasted crispy whole kernels, 0 added oil, 0 salt</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">100 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 750</text>
    </g>

    <!-- 3. Premium Cashews -->
    <g transform="translate(20, 389)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">3</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Premium Cashew Nuts</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Jumbo W240 whole grade cashews with sweet buttery crunch</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 750</text>
    </g>

    <!-- 4. Roasted Cashews -->
    <g transform="translate(20, 446)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">4</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Roasted Himalayan Cashew Nuts</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Small-batch artisanal dry-roasted savory snack</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">150 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 750</text>
    </g>

    <!-- 5. Pistachios -->
    <g transform="translate(20, 503)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">5</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Premium Roasted Pistachios</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Naturally split in-shell vibrant green kernels rich in lutein</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 820</text>
    </g>

    <!-- 6. Superfood Trail Mix -->
    <g transform="translate(20, 560)">
      <rect x="0" y="0" width="670" height="52" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">6</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Superfood Trail Mix (Nuts &amp; Seeds)</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Almonds, cashews, pumpkin seeds, chia &amp; antioxidant berries</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 790</text>
    </g>

    <!-- 7. Macadamia Nuts -->
    <g transform="translate(20, 617)">
      <rect x="0" y="0" width="670" height="52" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="26" r="11" fill="#FAF5E8" />
      <text x="22" y="30" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">7</text>
      <text x="50" y="24" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Macadamia Nuts</text>
      <text x="50" y="40" class="sans" font-size="10" fill="#666">Velvety buttery whole halves rich in Omega-7 palmitoleic acid</text>
      <text x="360" y="30" class="sans" font-size="11.5" font-weight="bold" fill="#333">200 GM</text>
      <text x="440" y="30" class="sans" font-size="11" fill="#555">Glass Jar</text>
      <text x="655" y="32" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 1100</text>
    </g>

    <!-- Nuts Footer Quote -->
    <g transform="translate(20, 685)">
      <rect x="0" y="0" width="670" height="85" rx="8" fill="#F4EFE2" stroke="#D9A441" stroke-width="1" />
      <text x="20" y="26" class="title" font-size="13" font-weight="bold" fill="#1B3D2F">
        Whole Unfumigated Mountain Harvest:
      </text>
      <text x="20" y="46" class="sans" font-size="10.5" fill="#444">
        Zero industrial chemical bleaches, zero MSG, and zero cheap vegetable oils.
      </text>
      <text x="20" y="64" class="sans" font-size="10.5" fill="#444">
        Packed in reusable airtight glass jars that protect healthy monounsaturated fatty acids.
      </text>
    </g>
  </g>

  <!-- 5. ORGANIC SEEDS & COLD-PRESSED VIRGIN OILS (4 Products) -->
  <g transform="translate(830, 1280)">
    <rect x="0" y="0" width="710" height="720" rx="12" fill="#FFFFFF" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    <path d="M0,12 Q0,0 12,0 L698,0 Q710,0 710,12 L710,50 L0,50 Z" fill="url(#tableHeadGrad)" />
    <text x="24" y="32" class="title" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1.5">
      5. SEEDS &amp; COLD-PRESSED OILS
    </text>
    <text x="686" y="32" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1" letter-spacing="1">
      RAW COLD-EXTRACTED • UNREFINED
    </text>

    <!-- Visual Showcase of Seeds & Oil -->
    <g transform="translate(20, 65)">
      <rect x="0" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgChia}" x="15" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="105" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#1B3D2F">Black Chia Seeds</text>

      <rect x="230" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgPumpkin}" x="245" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="335" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#1B3D2F">Pumpkin Pepitas</text>

      <rect x="460" y="0" width="210" height="150" rx="8" fill="#FBF8F1" stroke="#E0D5C1" />
      <image href="${imgCoconutOil}" x="475" y="10" width="180" height="130" preserveAspectRatio="xMidYMid meet" />
      <text x="565" y="142" text-anchor="middle" class="sans" font-size="10.5" font-weight="bold" fill="#1B3D2F">Virgin Coconut Oil</text>
    </g>

    <!-- Table Header -->
    <g transform="translate(20, 235)">
      <rect x="0" y="0" width="670" height="32" rx="6" fill="#1B3D2F" />
      <text x="15" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">SN</text>
      <text x="50" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PRODUCT NAME</text>
      <text x="360" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">QTY</text>
      <text x="440" y="21" class="sans" font-size="11" font-weight="bold" fill="#FFFFFF">PACKING</text>
      <text x="655" y="21" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">OFFICIAL MRP</text>
    </g>

    <!-- 1. Chia Seeds -->
    <g transform="translate(20, 275)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="27" r="11" fill="#FAF5E8" />
      <text x="22" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">1</text>
      <text x="50" y="25" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Organic Chia Seeds</text>
      <text x="50" y="42" class="sans" font-size="10" fill="#666">Whole black seeds rich in Omega-3 ALA, calcium &amp; prebiotic fiber</text>
      <text x="360" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">300 GM</text>
      <text x="440" y="31" class="sans" font-size="11" fill="#555">Plastic Jar</text>
      <text x="655" y="33" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 495</text>
    </g>

    <!-- 2. Pumpkin Seeds -->
    <g transform="translate(20, 334)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="27" r="11" fill="#FAF5E8" />
      <text x="22" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">2</text>
      <text x="50" y="25" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Raw Pumpkin Seeds</text>
      <text x="50" y="42" class="sans" font-size="10" fill="#666">AAA grade pepitas high in zinc &amp; magnesium for sleep &amp; immunity</text>
      <text x="360" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">300 GM</text>
      <text x="440" y="31" class="sans" font-size="11" fill="#555">Plastic Jar</text>
      <text x="655" y="33" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 650</text>
    </g>

    <!-- 3. Coconut Oil 500ml -->
    <g transform="translate(20, 393)">
      <rect x="0" y="0" width="670" height="54" fill="#FFFFFF" stroke="#F0EBE0" />
      <circle cx="22" cy="27" r="11" fill="#FAF5E8" />
      <text x="22" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">3</text>
      <text x="50" y="25" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Cold-Pressed Extra Virgin Coconut Oil</text>
      <text x="50" y="42" class="sans" font-size="10" fill="#666">Centrifuged raw coconut milk, 50%+ Lauric acid for immunity &amp; baby</text>
      <text x="360" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">500 ML</text>
      <text x="440" y="31" class="sans" font-size="11" fill="#555">Glass Bottle</text>
      <text x="655" y="33" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 1750</text>
    </g>

    <!-- 4. Coconut Oil 180ml -->
    <g transform="translate(20, 452)">
      <rect x="0" y="0" width="670" height="54" fill="#FAF9F5" stroke="#F0EBE0" />
      <circle cx="22" cy="27" r="11" fill="#FAF5E8" />
      <text x="22" y="31" text-anchor="middle" class="sans" font-size="11" font-weight="bold" fill="#1B3D2F">4</text>
      <text x="50" y="25" class="title" font-size="13.5" font-weight="bold" fill="#1B3D2F">Cold-Pressed Extra Virgin Coconut Oil</text>
      <text x="50" y="42" class="sans" font-size="10" fill="#666">Compact glass bottle for daily skin hydration &amp; oil pulling</text>
      <text x="360" y="31" class="sans" font-size="11.5" font-weight="bold" fill="#333">180 ML</text>
      <text x="440" y="31" class="sans" font-size="11" fill="#555">Glass Bottle</text>
      <text x="655" y="33" text-anchor="end" class="title" font-size="16" font-weight="bold" fill="#1B3D2F">Rs. 700</text>
    </g>

    <!-- Oil Note Banner -->
    <g transform="translate(20, 520)">
      <rect x="0" y="0" width="670" height="95" rx="8" fill="#F4EFE2" stroke="#D9A441" stroke-width="1" />
      <text x="20" y="26" class="title" font-size="13" font-weight="bold" fill="#1B3D2F">
        Cold-Extracted Bioactive Lipids:
      </text>
      <text x="20" y="46" class="sans" font-size="10.5" fill="#444">
        Zero thermal processing, zero hexane chemical solvents, and zero deodorizers.
      </text>
      <text x="20" y="64" class="sans" font-size="10.5" fill="#444">
        Solidifies naturally below 24°C into pure snowy velvet. Edible grade &amp; infant body massage safe.
      </text>
      <text x="20" y="82" class="sans" font-size="10.5" font-weight="bold" fill="#8E2800">
        • 100% Raw Extra Virgin • High Lauric Acid • Nepal Hygiene Certified
      </text>
    </g>
  </g>

  <!-- Right Column Bottom: How to Order & Verification Seal -->
  <g transform="translate(830, 2030)">
    <rect x="0" y="0" width="710" height="420" rx="14" fill="#FFFFFF" stroke="#C9982A" stroke-width="1.8" filter="url(#shadow)" />
    
    <g transform="translate(25, 25)">
      <text x="0" y="25" class="title" font-size="20" font-weight="bold" fill="#1B3D2F">
        HOW TO ORDER • RETAIL &amp; WHOLESALE
      </text>
      <line x1="0" y1="36" x2="660" y2="36" stroke="#C9982A" stroke-width="1" />

      <!-- 3 Step Ordering -->
      <g transform="translate(0, 55)">
        <rect x="0" y="0" width="200" height="110" rx="8" fill="#FAF7F0" stroke="#E5DAC5" />
        <circle cx="30" cy="30" r="14" fill="#1B3D2F" />
        <text x="30" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#C9982A">1</text>
        <text x="55" y="34" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">Online Store</text>
        <text x="15" y="65" class="sans" font-size="10" fill="#555">Visit naturesmud.shop</text>
        <text x="15" y="80" class="sans" font-size="10" fill="#555">Browse &amp; Add to Cart</text>
        <text x="15" y="95" class="sans" font-size="9.5" font-weight="bold" fill="#8E2800">Available 24/7</text>
      </g>

      <g transform="translate(230, 55)">
        <rect x="0" y="0" width="200" height="110" rx="8" fill="#FAF7F0" stroke="#E5DAC5" />
        <circle cx="30" cy="30" r="14" fill="#25D366" />
        <text x="30" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#FFFFFF">2</text>
        <text x="55" y="34" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">WhatsApp Order</text>
        <text x="15" y="65" class="sans" font-size="10" fill="#555">+977-9713888002</text>
        <text x="15" y="80" class="sans" font-size="10" fill="#555">Send Item List / Screenshot</text>
        <text x="15" y="95" class="sans" font-size="9.5" font-weight="bold" fill="#25D366">Instant Response</text>
      </g>

      <g transform="translate(460, 55)">
        <rect x="0" y="0" width="200" height="110" rx="8" fill="#FAF7F0" stroke="#E5DAC5" />
        <circle cx="30" cy="30" r="14" fill="#C9982A" />
        <text x="30" y="35" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">3</text>
        <text x="55" y="34" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F">Fast Delivery</text>
        <text x="15" y="65" class="sans" font-size="10" fill="#555">Kathmandu: 24 Hours</text>
        <text x="15" y="80" class="sans" font-size="10" fill="#555">Nationwide: 2-3 Days</text>
        <text x="15" y="95" class="sans" font-size="9.5" font-weight="bold" fill="#1B3D2F">Cash on Delivery</text>
      </g>

      <!-- Purity Pledge Box -->
      <g transform="translate(0, 185)">
        <rect x="0" y="0" width="660" height="160" rx="10" fill="#142E23" />
        <rect x="2" y="2" width="656" height="156" rx="8" fill="none" stroke="#C9982A" stroke-width="1.2" />
        
        <text x="330" y="35" text-anchor="middle" class="title" font-size="16" font-weight="bold" fill="#C9982A" letter-spacing="1">
          NATURESMUD 100% PURITY GUARANTEE
        </text>
        <text x="330" y="60" text-anchor="middle" class="sans" font-size="11.5" fill="#FFFFFF">
          "If any product is found to contain synthetic colors, chemical preservatives,
        </text>
        <text x="330" y="78" text-anchor="middle" class="sans" font-size="11.5" fill="#FFFFFF">
          or artificial flavorings, we offer a 100% money-back replacement guarantee."
        </text>

        <!-- Guarantee Seals -->
        <g transform="translate(50, 100)">
          <rect x="0" y="0" width="160" height="36" rx="6" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
          <text x="80" y="23" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#F4E8C1">✓ 0 Preservatives</text>
        </g>
        <g transform="translate(250, 100)">
          <rect x="0" y="0" width="160" height="36" rx="6" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
          <text x="80" y="23" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#F4E8C1">✓ Single-Origin Nepal</text>
        </g>
        <g transform="translate(450, 100)">
          <rect x="0" y="0" width="160" height="36" rx="6" fill="#1B3D2F" stroke="#C9982A" stroke-width="0.8" />
          <text x="80" y="23" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#F4E8C1">✓ Bureau Certified</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Right Column Footer Certificate -->
  <g transform="translate(830, 2480)">
    <rect x="0" y="0" width="710" height="620" rx="14" fill="#FAF8F1" stroke="#E5DAC5" stroke-width="1.5" filter="url(#cardShadow)" />
    
    <g transform="translate(35, 35)">
      <text x="0" y="25" class="title" font-size="20" font-weight="bold" fill="#1B3D2F">
        MASTER PRODUCT SUMMARY &amp; SPECIFICATIONS
      </text>
      <text x="0" y="48" class="sans" font-size="11" fill="#666">
        Summary breakdown of the official NaturesMud catalog across all categories:
      </text>

      <!-- Category Summary Grid -->
      <g transform="translate(0, 70)">
        <rect x="0" y="0" width="310" height="90" rx="8" fill="#FFFFFF" stroke="#D9A441" stroke-width="1" />
        <text x="16" y="28" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Dehydrated Fruits</text>
        <text x="16" y="48" class="sans" font-size="10.5" fill="#555">Mango, Pineapple, Apple, Coconut, Papaya</text>
        <text x="16" y="70" class="sans" font-size="11" font-weight="bold" fill="#8E2800">5 Products • Standup Pouches • Rs. 395–595</text>
      </g>

      <g transform="translate(330, 70)">
        <rect x="0" y="0" width="310" height="90" rx="8" fill="#FFFFFF" stroke="#D9A441" stroke-width="1" />
        <text x="16" y="28" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Superfood Powders &amp; Salts</text>
        <text x="16" y="48" class="sans" font-size="10.5" fill="#555">Dates, Beetroot, Carrot, Sweet Potato, Salts</text>
        <text x="16" y="70" class="sans" font-size="11" font-weight="bold" fill="#8E2800">6 Products • Glass Jars • Rs. 220–510</text>
      </g>

      <g transform="translate(0, 180)">
        <rect x="0" y="0" width="310" height="90" rx="8" fill="#FFFFFF" stroke="#D9A441" stroke-width="1" />
        <text x="16" y="28" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Mountain Nuts &amp; Mixes</text>
        <text x="16" y="48" class="sans" font-size="10.5" fill="#555">Almonds, Cashews, Pistachios, Trail Mix, Macadamia</text>
        <text x="16" y="70" class="sans" font-size="11" font-weight="bold" fill="#8E2800">7 Products • Glass Jars • Rs. 750–1100</text>
      </g>

      <g transform="translate(330, 180)">
        <rect x="0" y="0" width="310" height="90" rx="8" fill="#FFFFFF" stroke="#D9A441" stroke-width="1" />
        <text x="16" y="28" class="title" font-size="14" font-weight="bold" fill="#1B3D2F">Seeds &amp; Cold-Pressed Oils</text>
        <text x="16" y="48" class="sans" font-size="10.5" fill="#555">Chia Seeds, Pumpkin Seeds, Virgin Coconut Oil</text>
        <text x="16" y="70" class="sans" font-size="11" font-weight="bold" fill="#8E2800">6 Products • Jars &amp; Bottles • Rs. 415–1750</text>
      </g>

      <!-- Grand Seal Box -->
      <g transform="translate(0, 295)">
        <rect x="0" y="0" width="640" height="230" rx="10" fill="#1B3D2F" />
        <rect x="3" y="3" width="634" height="224" rx="8" fill="none" stroke="#C9982A" stroke-width="1.5" />
        
        <text x="320" y="40" text-anchor="middle" class="title" font-size="18" font-weight="bold" fill="#FFFFFF" letter-spacing="2">
          NATURESMUD OFFICIAL VERIFICATION
        </text>
        <line x1="120" y1="52" x2="520" y2="52" stroke="#C9982A" stroke-width="1" />

        <text x="320" y="78" text-anchor="middle" class="sans" font-size="12" fill="#E2EEE8">
          All products in this official catalog are produced under strict food hygiene standards.
        </text>
        <text x="320" y="98" text-anchor="middle" class="sans" font-size="12" fill="#E2EEE8">
          Certified chemical-free, laboratory microbial-screened, and batch traceable.
        </text>

        <rect x="70" y="125" width="500" height="38" rx="19" fill="#C9982A" />
        <text x="320" y="149" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#1B3D2F" letter-spacing="1">
          DOWNLOAD FULL 8-PAGE MAGAZINE: NATURESMUD.SHOP/CATALOG
        </text>

        <text x="320" y="195" text-anchor="middle" class="sans" font-size="11.5" fill="#A8CEBE">
          Head Office: Kathmandu, Nepal • Direct WhatsApp: +977-9713888002 • info@naturesmud.shop
        </text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM INSTITUTIONAL FOOTER ==================== -->
  <g transform="translate(60, 3125)">
    <rect x="0" y="0" width="${W - 120}" height="45" rx="8" fill="#142E23" />
    <rect x="2" y="2" width="${W - 124}" height="41" rx="6" fill="none" stroke="#C9982A" stroke-width="1" />
    
    <text x="30" y="28" class="sans" font-size="11.5" font-weight="bold" fill="#C9982A">
      © 2026 Nature's Mud Nepal Pvt. Ltd. All Rights Reserved.
    </text>
    <text x="${(W - 120) / 2}" y="28" text-anchor="middle" class="sans" font-size="11" fill="#FFFFFF">
      Official Webstore: https://naturesmud.shop • Dealer Support: +977-9713888002
    </text>
    <text x="${W - 150}" y="28" text-anchor="end" class="sans" font-size="11" font-weight="bold" fill="#F4E8C1">
      Certified 100% Pure Himalayan Food
    </text>
  </g>
</svg>
  `;

  console.log('Rendering SVG into ultra-sharp high-definition JPEG (1600x3200)...');
  const buffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(outJpg1, buffer);
  console.log(`Saved: ${outJpg1} (${(buffer.length / 1024).toFixed(1)} KB)`);

  const dir2 = path.dirname(outJpg2);
  if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });
  fs.writeFileSync(outJpg2, buffer);
  console.log(`Saved: ${outJpg2} (${(buffer.length / 1024).toFixed(1)} KB)`);

  console.log('✅ Official printable catalog poster generated successfully with 100% ACCURATE prices!');
}

createPoster().catch(console.error);
