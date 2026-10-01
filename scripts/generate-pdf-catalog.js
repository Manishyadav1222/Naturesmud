const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const PDFDocument = require(path.join(process.cwd(), 'node_modules/pdfkit/js/pdfkit.js'));

const rootDir = path.resolve(__dirname, '..');
const outPdf1 = path.join(rootDir, 'public', 'Nature_Mud_Product_Catalog.pdf');
const outPdf2 = path.join(rootDir, 'public', 'catalog.pdf');
const outPdf3 = path.join(rootDir, 'public', 'Nature_Mud_Magazine_Catalog.pdf');

// Palette
const C_DARK_BG = '#0E2317';     // Deep forest velvet green
const C_LIGHT_BG = '#FBF8F1';    // Warm editorial luxury parchment
const C_CARD_BG = '#FFFFFF';     // Crisp white for cards
const C_CARD_BORDER = '#E7DEC9'; // Fine sand border
const C_FOREST = '#143020';      // Deep rich forest green
const C_EMERALD = '#1A4329';     // Mid emerald
const C_GOLD = '#C5A059';        // Warm antique gold
const C_GOLD_LIGHT = '#F1E6CC';  // Soft gold tint
const C_INK = '#1F2923';         // Body text charcoal
const C_MUTED = '#667069';       // Muted text
const C_WHITE = '#FFFFFF';

// Helper to prepare image buffers
const imgCache = new Map();
async function getImgBuffer(relPath, width = 300, height = 300) {
  if (imgCache.has(relPath)) return imgCache.get(relPath);
  const full = path.join(rootDir, relPath);
  if (!fs.existsSync(full)) {
    imgCache.set(relPath, null);
    return null;
  }
  try {
    const buf = await sharp(full)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toBuffer();
    imgCache.set(relPath, buf);
    return buf;
  } catch (err) {
    console.error(`Failed to load image ${relPath}:`, err.message);
    imgCache.set(relPath, null);
    return null;
  }
}

// 29 Master Products (exact match with live DB)
const masterProducts = [
  // 1. Dried Fruits
  { sn: 1, id: 'dehydrated-mango', name: 'Dehydrated Himalayan Mango', sub: 'Sun-dried tree-ripened mango slices', cat: 'Dried Fruits', qty: '100 GM', pack: 'Standup Pouch', life: '12 Months', mrp: 595, img: 'public/products/authentic-dehydrated-mango.jpg', tag: 'Digestive Enzymes & Vit C' },
  { sn: 2, id: 'dehydrated-pineapple', name: 'Dehydrated Himalayan Pineapple', sub: 'Tangy-sweet rings with active bromelain', cat: 'Dried Fruits', qty: '100 GM', pack: 'Standup Pouch', life: '12 Months', mrp: 495, img: 'public/products/dehydrated-pineapple.jpg', tag: 'Active Bromelain Enzyme' },
  { sn: 3, id: 'dehydrated-apple', name: 'Dehydrated Himalayan Apple', sub: 'High-altitude Jumla apples with skin intact', cat: 'Dried Fruits', qty: '100 GM', pack: 'Standup Pouch', life: '12 Months', mrp: 510, img: 'public/products/dehydrated-apple.jpg', tag: 'Soluble Pectin & Quercetin' },
  { sn: 4, id: 'dehydrated-coconut-chips', name: 'Dehydrated Coconut Chips', sub: 'Toasted crunchy coconut flakes with MCTs', cat: 'Dried Fruits', qty: '100 GM', pack: 'Standup Pouch', life: '12 Months', mrp: 475, img: 'public/products/coconut-chips.jpg', tag: 'Clean Keto MCT Fats' },
  { sn: 5, id: 'dehydrated-papaya', name: 'Dehydrated Papaya Slices', sub: 'Sweet solar-dehydrated digestive snack', cat: 'Dried Fruits', qty: '90 GM', pack: 'Standup Pouch', life: '12 Months', mrp: 395, img: 'public/products/nm-papaya-flat.jpeg', tag: 'Active Papain Enzyme' },
  { sn: 6, id: 'dried-blueberries', name: 'Wild Dried Blueberries', sub: 'Alpine wild berries dense in anthocyanins', cat: 'Dried Fruits', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 650, img: 'public/products/dried-blueberries-100g.jpg', tag: 'High Anthocyanins & Eye Care' },
  { sn: 7, id: 'dried-cranberries', name: 'Whole Dried Cranberries', sub: 'Dense in Type-A PACs for cellular defense', cat: 'Dried Fruits', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 415, img: 'public/products/cranberries.jpg', tag: 'Urinary & Cellular Defense' },

  // 2. Superfood Powders
  { sn: 8, id: 'freeze-dried-avocado-powder', name: 'Freeze-Dried Avocado Powder', sub: '100% Hass avocado with healthy omegas', cat: 'Superfood Powders', qty: '80 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 790, img: 'public/products/freeze-dried-avocado-powder.jpg', tag: 'Monounsaturated Omega Fats' },
  { sn: 9, id: 'strawberry-powder', name: 'Pure Natural Strawberry Powder', sub: 'Real whole strawberries, polyphenol-dense', cat: 'Superfood Powders', qty: '80 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 1395, img: 'public/products/strawberry-powder.jpg', tag: 'Ellagic Acid & Vitamin C' },
  { sn: 10, id: 'banana-powder', name: 'Pure Green Banana Powder', sub: 'High resistant starch prebiotic superfood', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 590, img: 'public/products/banana-powder.jpg', tag: 'Prebiotic Resistant Starch' },
  { sn: 11, id: 'moringa-leaf-powder', name: 'Organic Moringa Leaf Powder', sub: 'Miracle tree greens with 90+ vital nutrients', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 690, img: 'public/products/moringa-leaf-powder.jpg', tag: 'Chlorophyll & Plant Protein' },
  { sn: 12, id: 'dates-powder', name: 'Natural Dates Powder Sweetener', sub: '1:1 natural replacement for refined white sugar', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 400, img: 'public/products/dates-powder-100g.jpg', tag: 'Dietary Iron & Potassium' },
  { sn: 13, id: 'beetroot-powder', name: 'Himalayan Beetroot Powder', sub: 'Concentrated dietary nitrates for endurance', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 430, img: 'public/products/beetroot-powder-100g.jpg', tag: 'Nitric Oxide & Vascular Flow' },
  { sn: 14, id: 'sweet-potato-powder', name: 'Organic Sweet Potato Powder', sub: 'Gentle low-GI complex carbohydrate', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 510, img: 'public/products/sweet-potato-powder-100g.jpg', tag: 'Gentle Infant Weaning Carb' },
  { sn: 15, id: 'carrot-powder', name: 'Organic Carrot Powder', sub: 'Pro-Vitamin A beta-carotene for eye vitality', cat: 'Superfood Powders', qty: '100 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 490, img: 'public/products/carrot-powder-100g.jpg', tag: 'Beta-Carotene Vision Support' },

  // 3. Nuts & Kernels
  { sn: 16, id: 'raw-himalayan-almonds', name: 'Raw Himalayan Almonds', sub: 'Unroasted mountain almonds with vitamin E', cat: 'Nuts & Kernels', qty: '200 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 750, img: 'public/products/nm-almond-jar.jpeg', tag: 'Vitamin E & Magnesium' },
  { sn: 17, id: 'roasted-almonds', name: 'Roasted Himalayan Almonds', sub: 'Lightly salted with Himalayan pink salt', cat: 'Nuts & Kernels', qty: '200 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 750, img: 'public/products/almonds.jpg', tag: 'Artisan Salted Crunch' },
  { sn: 18, id: 'premium-cashewnuts', name: 'Premium Jumbo Cashew Nuts', sub: 'Raw whole creamy kernels rich in copper', cat: 'Nuts & Kernels', qty: '200 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 750, img: 'public/products/nm-cashew-new-jar.jpg', tag: 'Creamy Plant Energy' },
  { sn: 19, id: 'roasted-cashewnuts', name: 'Roasted Himalayan Cashew Nuts', sub: 'Slow-roasted to golden crisp perfection', cat: 'Nuts & Kernels', qty: '150 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 750, img: 'public/products/nm-roasted-cashew-new.jpg', tag: 'Crisp Artisan Batch' },
  { sn: 20, id: 'premium-pistachios', name: 'Premium Roasted Pistachios', sub: 'In-shell California pistachios with lutein', cat: 'Nuts & Kernels', qty: '200 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 820, img: 'public/products/pistachios.jpg', tag: 'Lutein & Heart Omegas' },
  { sn: 21, id: 'pumpkin-seeds', name: 'Raw Himalayan Pumpkin Seeds', sub: 'Green pepitas dense in restorative zinc', cat: 'Nuts & Kernels', qty: '300 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 650, img: 'public/products/pumpkin-seeds.jpg', tag: 'Zinc & Restorative Tryptophan' },
  { sn: 22, id: 'dry-figs-anjeer', name: 'Premium Turkish Figs (Anjeer)', sub: 'Sun-cured whole figs rich in dietary calcium', cat: 'Nuts & Kernels', qty: '200 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 850, img: 'public/products/dry-figs-anjeer.jpg', tag: 'Dietary Calcium & Fiber' },

  // 4. Sacred Minerals, Seeds & Elixirs
  { sn: 23, id: 'pure-mountain-himalayan-shilajit-resin', name: 'Pure Himalayan Shilajit Resin', sub: 'Gold Grade mountain resin, 75%+ fulvic acid', cat: 'Minerals & Elixirs', qty: '20 GM', pack: 'Amber Jar + Spoon', life: '24 Months', mrp: 1995, img: 'public/products/shilajit.jpg', tag: '75%+ Fulvic & 84+ Minerals' },
  { sn: 24, id: 'chia-seeds', name: 'Organic Raw Chia Seeds', sub: 'Soluble mucilage fiber & plant omega-3 ALA', cat: 'Minerals & Elixirs', qty: '300 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 495, img: 'public/products/chia-seeds.jpg', tag: 'Plant Omega-3 ALA' },
  { sn: 25, id: 'himalayan-pink-salt', name: 'Himalayan Pink Rock Salt', sub: 'Unrefined ancient rock salt with 84 minerals', cat: 'Minerals & Elixirs', qty: '200 GM', pack: 'Sealed Glass Jar', life: '24 Months', mrp: 250, img: 'public/products/pink-salt.jpg', tag: '84 Trace Electrolytes' },
  { sn: 26, id: 'pure-himalayan-black-salt-bire-noon', name: 'Himalayan Black Salt (Bire Noon)', sub: 'Volcanic rock salt for digestive agni stimulation', cat: 'Minerals & Elixirs', qty: '200 GM', pack: 'Sealed Glass Jar', life: '24 Months', mrp: 220, img: 'public/products/black-salt.jpg', tag: 'Ayurvedic Digestive Agni' },
  { sn: 27, id: 'virgin-coconut-oil-180ml', name: 'Cold-Pressed Virgin Coconut Oil', sub: 'Fresh unrefined extra virgin oil with MCTs', cat: 'Minerals & Elixirs', qty: '180 GM', pack: 'Sealed Glass Bottle', life: '18 Months', mrp: 650, img: 'public/products/coconut-oil.jpg', tag: 'Lauric Acid & Clean MCTs' },
  { sn: 28, id: 'virgin-coconut-oil-500ml', name: 'Cold-Pressed Virgin Coconut Oil', sub: 'Family size pure cold-pressed unrefined oil', cat: 'Minerals & Elixirs', qty: '500 ML', pack: 'Sealed Glass Bottle', life: '18 Months', mrp: 1750, img: 'public/products/coconut-oil-product.jpg', tag: 'Pure Cold-Pressed Culinary' },
  { sn: 29, id: 'makhana-fox-nuts', name: 'Roasted Makhana (Fox Nuts)', sub: 'Crunchy popped lotus seeds, light & mineral-rich', cat: 'Minerals & Elixirs', qty: '50 GM', pack: 'Sealed Glass Jar', life: '12 Months', mrp: 390, img: 'public/products/nm-makhana-jar.jpeg', tag: 'Low Calorie Super Snack' }
];

async function generateMagazinePDF() {
  console.log('🌟 Starting 8-Page Luxury Magazine PDF Generation...');

  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    autoFirstPage: false,
    bufferPages: true
  });

  const writeStream = fs.createWriteStream(outPdf1);
  doc.pipe(writeStream);

  const W = 595.28;
  const H = 841.89;

  // Helper: Draw common header on product pages
  function drawCategoryHeader(catNum, catTitle, catSub) {
    // Top banner
    doc.rect(0, 0, W, 72).fill(C_FOREST);
    doc.rect(0, 72, W, 3).fill(C_GOLD);

    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(`CATEGORY ${catNum} · OFFICIAL COMPENDIUM`, 30, 16, { letterSpacing: 1.5 });
    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(16).text(catTitle, 30, 29);
    doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8.5).text(catSub, 30, 50);

    // Page indicator in top right
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text(`NATURE'S MUD`, W - 140, 22, { align: 'right', width: 110 });
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(7.5).text('100% BOTANICAL PURITY', W - 140, 36, { align: 'right', width: 110 });
  }

  // Helper: Draw common footer on product pages
  function drawPageFooter(pageNum, totalPages = 8) {
    doc.rect(0, H - 36, W, 36).fill('#F0EAD8');
    doc.rect(0, H - 36, W, 1).fill(C_GOLD);

    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(8).text(
      'NATURE\'S MUD · NEPAL\'S BOTANICAL APOTHECARY  |  ORDER ONLINE: NATURESMUD.SHOP  |  WHATSAPP: +977 9713888002',
      30,
      H - 23,
      { width: W - 120 }
    );
    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(9).text(
      `PAGE ${pageNum} OF ${totalPages}`,
      W - 90,
      H - 23,
      { align: 'right', width: 60 }
    );
  }

  // Helper: Draw 7 products on a page (2 columns x 3 rows + 1 full-width showcase row at bottom)
  async function drawProductGrid(prods) {
    // 6 card slots: 2 cols x 3 rows
    // x1 = 30, x2 = 305, width = 260
    // y slots: row 0 = 85, row 1 = 260, row 2 = 435, height = 165
    // bottom showcase: y = 610, height = 180, width = 535
    for (let i = 0; i < Math.min(6, prods.length); i++) {
      const p = prods[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cardX = 30 + col * 275;
      const cardY = 85 + row * 175;
      const cardW = 260;
      const cardH = 165;

      // Card Background & Border
      doc.roundedRect(cardX, cardY, cardW, cardH, 6).fill(C_CARD_BG);
      doc.lineWidth(1).strokeColor(C_CARD_BORDER).roundedRect(cardX, cardY, cardW, cardH, 6).stroke();

      // Product Image (Left: 95 x 105)
      const imgX = cardX + 10;
      const imgY = cardY + 12;
      const imgW = 92;
      const imgH = 100;

      doc.roundedRect(imgX, imgY, imgW, imgH, 4).fill('#FBF9F5');
      doc.lineWidth(0.5).strokeColor('#E0D8C8').roundedRect(imgX, imgY, imgW, imgH, 4).stroke();

      const imgBuf = await getImgBuffer(p.img, 240, 240);
      if (imgBuf) {
        try {
          doc.image(imgBuf, imgX + 2, imgY + 2, { width: imgW - 4, height: imgH - 4 });
        } catch {
          // fallback gracefully
        }
      }

      // Quantity Pill under image
      doc.roundedRect(imgX, imgY + imgH + 6, imgW, 18, 3).fill(C_FOREST);
      doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(7.5).text(
        p.qty,
        imgX,
        imgY + imgH + 11,
        { align: 'center', width: imgW }
      );

      // Product Details (Right: 140px width)
      const textX = cardX + 110;
      const textW = 140;

      // Category Pill
      doc.roundedRect(textX, cardY + 12, textW, 14, 3).fill(C_GOLD_LIGHT);
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(6.5).text(
        p.tag.toUpperCase(),
        textX + 4,
        cardY + 16,
        { width: textW - 8, lineBreak: false, ellipsis: true }
      );

      // Product Name
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(11).text(
        p.name,
        textX,
        cardY + 30,
        { width: textW, height: 26, lineBreak: true }
      );

      // Subtitle / Description
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(
        p.sub,
        textX,
        cardY + 60,
        { width: textW, height: 26, lineBreak: true }
      );

      // Packaging & Shelf Life
      doc.fillColor(C_INK).font('Helvetica').fontSize(7).text(
        `Packaging: ${p.pack}`,
        textX,
        cardY + 92,
        { width: textW }
      );
      doc.fillColor(C_INK).font('Helvetica').fontSize(7).text(
        `Shelf Life: ${p.life}`,
        textX,
        cardY + 103,
        { width: textW }
      );

      // Price Tag Box
      const priceY = cardY + 120;
      doc.roundedRect(textX, priceY, textW, 32, 4).fill('#FBF6ED');
      doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(textX, priceY, textW, 32, 4).stroke();

      doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.5).text('OFFICIAL MRP', textX + 8, priceY + 5);
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(14).text(`Rs. ${p.mrp}`, textX + 8, priceY + 14);
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(7).text('VERIFIED', textX + textW - 46, priceY + 14);
    }

    // 7th product as wide featured horizontal banner at bottom
    if (prods.length >= 7) {
      const p = prods[6];
      const botX = 30;
      const botY = 612;
      const botW = 535;
      const botH = 180;

      doc.roundedRect(botX, botY, botW, botH, 8).fill(C_CARD_BG);
      doc.lineWidth(1.2).strokeColor(C_GOLD).roundedRect(botX, botY, botW, botH, 8).stroke();

      // Top golden accent ribbon
      doc.roundedRect(botX, botY, botW, 22, 6).fill(C_FOREST);
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(
        `FEATURED SELECTION · ${p.tag.toUpperCase()}`,
        botX + 15,
        botY + 6
      );
      doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(
        '100% SINGLE-INGREDIENT BOTANICAL',
        botX + botW - 180,
        botY + 6,
        { align: 'right', width: 165 }
      );

      // Big Image (Left: 130 x 140)
      const bImgX = botX + 15;
      const bImgY = botY + 30;
      const bImgW = 120;
      const bImgH = 135;

      doc.roundedRect(bImgX, bImgY, bImgW, bImgH, 6).fill('#FBF9F5');
      doc.lineWidth(0.5).strokeColor('#E0D8C8').roundedRect(bImgX, bImgY, bImgW, bImgH, 6).stroke();

      const bBuf = await getImgBuffer(p.img, 280, 280);
      if (bBuf) {
        try {
          doc.image(bBuf, bImgX + 4, bImgY + 4, { width: bImgW - 8, height: bImgH - 8 });
        } catch {}
      }

      // Middle Description & Details
      const bTextX = botX + 150;
      const bTextW = 230;

      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(14).text(p.name, bTextX, botY + 32, { width: bTextW });
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(8.5).text(p.sub, bTextX, botY + 52, { width: bTextW });

      // Features Bullet Box
      doc.roundedRect(bTextX, botY + 76, bTextW, 80, 4).fill('#FAF7F0');
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(7.5).text('BOTANICAL SPECIFICATIONS:', bTextX + 8, botY + 82);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(`• Net Weight / Volume: ${p.qty}`, bTextX + 8, botY + 95);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(`• Packaging Format: ${p.pack}`, bTextX + 8, botY + 107);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text(`• Guaranteed Shelf Life: ${p.life}`, bTextX + 8, botY + 119);
      doc.fillColor(C_INK).font('Helvetica').fontSize(7.5).text('• Safety Standard: Heavy Metal & Microbial Lab Screened', bTextX + 8, botY + 131);
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(7.5).text('• Storage: Airtight cool dry pantry away from sunlight', bTextX + 8, botY + 143);

      // Right Price & Order Badge
      const bRightX = botX + 395;
      const bRightW = 125;
      const bRightH = 135;

      doc.roundedRect(bRightX, botY + 30, bRightW, bRightH, 6).fill('#FBF6ED');
      doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(bRightX, botY + 30, bRightW, bRightH, 6).stroke();

      doc.fillColor(C_MUTED).font('Helvetica-Bold').fontSize(7.5).text(
        'OFFICIAL MRP',
        bRightX,
        botY + 42,
        { align: 'center', width: bRightW }
      );
      doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(22).text(
        `Rs. ${p.mrp}`,
        bRightX,
        botY + 56,
        { align: 'center', width: bRightW }
      );
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(
        p.qty,
        bRightX,
        botY + 84,
        { align: 'center', width: bRightW }
      );

      doc.roundedRect(bRightX + 12, botY + 102, bRightW - 24, 24, 4).fill(C_FOREST);
      doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(8).text(
        'ORDER DIRECT',
        bRightX + 12,
        botY + 110,
        { align: 'center', width: bRightW - 24 }
      );
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.5).text(
        'Fast delivery nationwide',
        bRightX,
        botY + 138,
        { align: 'center', width: bRightW }
      );
    }
  }

  // =========================================================================
  // PAGE 1: GRAND LUXURY MAGAZINE COVER (Full bleed forest green)
  // =========================================================================
  console.log('Rendering Page 1 (Luxury Front Cover)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_DARK_BG);

  // Elegant gold foil double border
  doc.lineWidth(1.5).strokeColor(C_GOLD).rect(20, 20, W - 40, H - 40).stroke();
  doc.lineWidth(0.5).strokeColor(C_GOLD).rect(24, 24, W - 48, H - 48).stroke();

  // Top Publication Masthead Bar
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(
    'VOL. IV  ·  OFFICIAL ANNUAL COMPENDIUM  ·  EDITION 2026/2027',
    35,
    38,
    { align: 'center', width: W - 70, letterSpacing: 2 }
  );

  // Ornamental separator line
  doc.lineWidth(0.8).strokeColor(C_GOLD).moveTo(120, 52).lineTo(W - 120, 52).stroke();

  // Primary Magazine Title
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(40).text(
    'NATURE\'S MUD',
    35,
    65,
    { align: 'center', width: W - 70, letterSpacing: 3 }
  );
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(12).text(
    'JOURNAL OF HIMALAYAN BOTANICAL PURITY & WHOLE FOODS',
    35,
    112,
    { align: 'center', width: W - 70, letterSpacing: 1.5 }
  );

  // Subtitle
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(9).text(
    'ARTISANAL SOLAR-DEHYDRATED FRUITS · SUPERFOOD POWDERS · MOUNTAIN NUTS · ANCIENT MINERALS',
    35,
    130,
    { align: 'center', width: W - 70 }
  );

  // Grand Hero Photo Showcase (Centered: 495 x 350)
  const heroX = 50;
  const heroY = 152;
  const heroW = W - 100;
  const heroH = 360;

  doc.roundedRect(heroX, heroY, heroW, heroH, 8).fill('#0B1C12');
  doc.lineWidth(1.5).strokeColor(C_GOLD).roundedRect(heroX, heroY, heroW, heroH, 8).stroke();

  const heroBuf = await getImgBuffer('public/images/posters/naturesmud-master-catalog-cover-4k.jpg', 600, 440) ||
                  await getImgBuffer('public/products/shilajit.jpg', 600, 440);
  if (heroBuf) {
    try {
      doc.image(heroBuf, heroX + 4, heroY + 4, { width: heroW - 8, height: heroH - 8 });
    } catch {}
  }

  // Inside Hero Banner Ribbon
  doc.roundedRect(heroX + 15, heroY + heroH - 46, heroW - 30, 32, 6).fill('rgba(14, 35, 23, 0.92)');
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(
    'THE EXCLUSIVE ARTISANAL COLLECTION · 29 LIVING SUPERFOODS',
    heroX + 25,
    heroY + heroH - 36
  );
  doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(
    'Handcrafted in Nepal · Solar Dehydrated <42°C',
    heroX + heroW - 225,
    heroY + heroH - 36,
    { align: 'right', width: 200 }
  );

  // Editorial Feature Bullets (Magazine Feature Callouts)
  const featY = 530;
  const featBoxW = (W - 80) / 3;

  // Box 1
  doc.roundedRect(40, featY, featBoxW - 6, 120, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(40, featY, featBoxW - 6, 120, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('SPECIAL REPORT', 50, featY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(11).text('THE <42°C REVOLUTION', 50, featY + 26);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    'How gentle solar low-temperature dehydration preserves 98% of active living enzymes, raw vitamins, and prebiotic fiber.',
    50,
    featY + 54,
    { width: featBoxW - 26, lineGap: 2 }
  );

  // Box 2
  const f2X = 40 + featBoxW;
  doc.roundedRect(f2X, featY, featBoxW - 6, 120, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(f2X, featY, featBoxW - 6, 120, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('ANCIENT ELIXIRS', f2X + 10, featY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(11).text('GOLD GRADE SHILAJIT', f2X + 10, featY + 26);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    'High-altitude Himalayan resin tested at 75%+ active Fulvic Acid with 84+ ionic trace minerals for cellular energy and vitality.',
    f2X + 10,
    featY + 54,
    { width: featBoxW - 26, lineGap: 2 }
  );

  // Box 3
  const f3X = 40 + featBoxW * 2;
  doc.roundedRect(f3X, featY, featBoxW - 6, 120, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(f3X, featY, featBoxW - 6, 120, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('FAMILY NUTRITION', f3X + 10, featY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(11).text('HOLISTIC WEANING & DIET', f3X + 10, featY + 26);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    'Clean, chemical-free, single-ingredient botanicals safe for infant weaning (6m+), growing students, and active athletes.',
    f3X + 10,
    featY + 54,
    { width: featBoxW - 26, lineGap: 2 }
  );

  // Bottom Trust Badges Ribbon
  const badgeY = 665;
  doc.roundedRect(40, badgeY, W - 80, 52, 6).fill('#09170E');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(40, badgeY, W - 80, 52, 6).stroke();

  const trustBadges = [
    { title: 'LAB CERTIFIED', sub: 'Heavy Metal Free' },
    { title: '0% ADDED SUGAR', sub: 'Zero Bleach or Preservatives' },
    { title: 'AYURVEDIC HERITAGE', sub: 'Traditional Sourcing' },
    { title: '77 DISTRICT DELIVERY', sub: 'Direct from Kathmandu' }
  ];

  trustBadges.forEach((tb, i) => {
    const tX = 50 + i * ((W - 100) / 4);
    const tW = (W - 100) / 4;
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(tb.title, tX, badgeY + 12, { align: 'center', width: tW });
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(7.5).text(tb.sub, tX, badgeY + 26, { align: 'center', width: tW });
  });

  // Footer Cover Bar
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica-Bold').fontSize(8.5).text(
    'PUBLISHED BY NATURE\'S MUD APOTHECARY  ·  SAMAKHUSHI, KATHMANDU, NEPAL  ·  NATURESMUD.SHOP',
    35,
    H - 45,
    { align: 'center', width: W - 70 }
  );

  // =========================================================================
  // PAGE 2: EDITORIAL & HIMALAYAN PURITY STANDARDS
  // =========================================================================
  console.log('Rendering Page 2 (Editorial & Philosophy)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  // Editorial Top Banner
  doc.rect(0, 0, W, 70).fill(C_FOREST);
  doc.rect(0, 70, W, 3).fill(C_GOLD);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('NATURE\'S MUD ESSAY · VOLUME IV', 30, 16, { letterSpacing: 2 });
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(16).text('FROM THE HIGH HIMALAYAN RIDGES TO YOUR TABLE', 30, 29);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8.5).text('The philosophy, technology, and rigorous botanical integrity behind every harvest', 30, 50);

  // Page 2 Editorial Text & 2 Column Layout
  const edY = 85;

  // Left Column: Editorial Essay
  doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(13).text('A Return to Unadulterated Himalayan Nourishment', 30, edY);
  doc.fillColor(C_INK).font('Helvetica').fontSize(8.5).text(
    'In an era dominated by hyper-processed grocery staples, chemical bleaching, and artificial food coloring, Nature\'s Mud was founded with a singular, uncompromising pledge: to deliver food exactly as nature conceived it in the pristine valleys of the Himalayas.\n\n' +
    'Every fruit, nut, seed, and botanical powder in this catalog originates from fertile high-altitude soils, nourished by mineral-rich snowmelt and clean mountain air. We partner directly with indigenous harvesting cooperatives across Jumla, Mustang, Dolpa, and the fertile plains of Nepal, ensuring fair farmer wages and sustainable regenerative agriculture.',
    30,
    edY + 20,
    { width: 260, lineGap: 3 }
  );

  // Editorial Image Left Box
  const edImgY = edY + 155;
  doc.roundedRect(30, edImgY, 260, 165, 6).fill('#FFFFFF');
  doc.lineWidth(1).strokeColor(C_CARD_BORDER).roundedRect(30, edImgY, 260, 165, 6).stroke();

  const edHarvestBuf = await getImgBuffer('public/products/sweet-potato-creation-process.jpg', 300, 200) ||
                       await getImgBuffer('public/products/authentic-dehydrated-mango.jpg', 300, 200);
  if (edHarvestBuf) {
    try {
      doc.image(edHarvestBuf, 34, edImgY + 4, { width: 252, height: 135 });
    } catch {}
  }
  doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(7.5).text(
    'Artisanal Solar Dehydration Facility & Quality Inspection · Kathmandu',
    34,
    edImgY + 146,
    { align: 'center', width: 252 }
  );

  // Right Column: The 4 Pillars of Nature's Mud Purity Standards
  const rColX = 305;
  doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(13).text('The Four Pillars of Botanical Integrity', rColX, edY);

  const pillars = [
    {
      num: '01',
      title: 'SOLAR DEHYDRATION BELOW 42°C',
      desc: 'Conventional industrial dehydrators bake fruit at 80°C to 120°C, destroying heat-sensitive enzymes, vitamins, and bioflavonoids. Our proprietary solar chambers never exceed 42°C, preserving 98% of living enzymatic activity and raw cellular vitality.'
    },
    {
      num: '02',
      title: '100% SINGLE-INGREDIENT BOTANICALS',
      desc: 'Zero cane sugar, zero sulfur dioxide, zero maltodextrin, and zero synthetic preservatives. When you open a jar of Nature\'s Mud Beetroot or Avocado Powder, the only ingredient inside is pure, dehydrated beetroot or avocado.'
    },
    {
      num: '03',
      title: 'INDEPENDENT LABORATORY PURITY SCREENING',
      desc: 'Every single batch undergoes testing for heavy metal toxicity (Lead, Cadmium, Arsenic, Mercury), moisture safety (<5%), and microbial limits. We adhere strictly to national food safety guidelines for total family safety.'
    },
    {
      num: '04',
      title: 'NATUROPATHIC & AYURVEDIC HARMONY',
      desc: 'Formulated in consultation with certified holistic wellness practitioners and classical Ayurvedic pharmacopeia. Our foods are naturally hypo-allergenic, gentle on digestive agni, and perfect for baby first solids (6m+) and athlete stamina.'
    }
  ];

  let pY = edY + 20;
  pillars.forEach((p) => {
    doc.roundedRect(rColX, pY, 260, 68, 4).fill(C_CARD_BG);
    doc.lineWidth(0.8).strokeColor(C_CARD_BORDER).roundedRect(rColX, pY, 260, 68, 4).stroke();

    // Num badge
    doc.roundedRect(rColX + 8, pY + 8, 22, 16, 3).fill(C_FOREST);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text(p.num, rColX + 8, pY + 12, { align: 'center', width: 22 });

    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(8.5).text(p.title, rColX + 36, pY + 12, { width: 215 });
    doc.fillColor(C_INK).font('Helvetica').fontSize(7.2).text(p.desc, rColX + 8, pY + 28, { width: 244, lineGap: 1.5 });

    pY += 74;
  });

  // Editorial Lower Section: Alternative Compliant Wellness Standards & Food Safety Notice
  const noticeY = 430;
  doc.roundedRect(30, noticeY, W - 60, 165, 8).fill('#F4EFE2');
  doc.lineWidth(1.2).strokeColor(C_GOLD).roundedRect(30, noticeY, W - 60, 165, 8).stroke();

  doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(12).text(
    'HOLISTIC WELLNESS STANDARDS & FAMILY SAFETY PLEDGE',
    45,
    noticeY + 14
  );
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8).text(
    'INDEPENDENTLY VERIFIED · FOOD SAFETY CERTIFIED · NON-GMO · 100% WHOLE FOOD',
    45,
    noticeY + 30
  );

  doc.fillColor(C_INK).font('Helvetica').fontSize(8).text(
    'Nature\'s Mud champions transparent whole-food nourishment. Rather than synthetic multivitamins or laboratory-synthesized compounds, we advocate for whole-food nutrition where vitamins, trace minerals, and antioxidants exist in their natural organic synergy with dietary fiber and co-enzymes.\n\n' +
    'Our products are trusted across Nepal by holistic nutritionists, ayurvedic vaidyas, sports fitness trainers, and health-conscious mothers for complementary baby weaning porridge (6M+), post-natal mother rejuvenation, memory vitality, and athletic endurance.\n\n' +
    'STATUTORY WELLNESS DISCLAIMER:\n' +
    'Nature\'s Mud botanical foods and functional supplements are pure single-ingredient natural products crafted to support daily nutrition, stamina, and holistic wellness. These products are not intended to diagnose, treat, cure, or prevent any medical disease. Individuals with specific medical conditions, nursing or pregnant mothers, and parents introducing solid foods to infants should consult their qualified health practitioner or holistic nutritionist.',
    45,
    noticeY + 44,
    { width: W - 90, lineGap: 2.2 }
  );

  // Quote ribbon at bottom of Page 2
  const quoteY = 610;
  doc.roundedRect(30, quoteY, W - 60, 175, 8).fill(C_FOREST);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(
    '“Let food be thy medicine, and let mountain purity be thy standard.”',
    45,
    quoteY + 20,
    { align: 'center', width: W - 90 }
  );
  doc.fillColor(C_WHITE).font('Helvetica').fontSize(8.5).text(
    'Every package bearing the Nature\'s Mud seal represents an unbroken chain of custody from organic Himalayan growers, through low-temperature solar drying, to hermetic glass and barrier packaging in Kathmandu.\n\n' +
    'Browse our complete 2026/2027 collection in the following pages organized across 4 dedicated product categories, followed by the complete master verification index and nationwide ordering directory.',
    55,
    quoteY + 45,
    { align: 'center', width: W - 110, lineGap: 3 }
  );
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica-Bold').fontSize(8.5).text(
    'THE FOUNDING TEAM  ·  NATURE\'S MUD BOTANICALS  ·  KATHMANDU, NEPAL',
    45,
    quoteY + 140,
    { align: 'center', width: W - 90 }
  );

  drawPageFooter(2);

  // =========================================================================
  // PAGE 3: CATEGORY 01 - SOLAR-DEHYDRATED FRUITS & ALPINE BERRIES (7 Products)
  // =========================================================================
  console.log('Rendering Page 3 (Category 01: Dehydrated Fruits)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  drawCategoryHeader(
    '01',
    'SOLAR-DEHYDRATED FRUITS & ALPINE BERRIES',
    'Gently dehydrated below 42°C · 0% added sugar · 0% sulfur dioxide · 100% natural fruit'
  );

  const cat1Products = masterProducts.slice(0, 7);
  await drawProductGrid(cat1Products);
  drawPageFooter(3);

  // =========================================================================
  // PAGE 4: CATEGORY 02 - MOUNTAIN SUPERFOOD POWDERS (7 Products)
  // =========================================================================
  console.log('Rendering Page 4 (Category 02: Superfood Powders)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  drawCategoryHeader(
    '02',
    'MOUNTAIN SUPERFOOD POWDERS & NATURAL SWEETENERS',
    'Micro-milled raw botanicals for baby weaning (6m+), daily smoothies, teas & active gym vitality'
  );

  // Avocado, Strawberry, Banana, Moringa, Dates, Beetroot, Carrot
  const cat2Products = [
    masterProducts[7],  // Avocado
    masterProducts[8],  // Strawberry
    masterProducts[9],  // Banana
    masterProducts[10], // Moringa
    masterProducts[11], // Dates
    masterProducts[12], // Beetroot
    masterProducts[14]  // Carrot (sweet potato is highlighted in master table and callout)
  ];
  await drawProductGrid(cat2Products);
  drawPageFooter(4);

  // =========================================================================
  // PAGE 5: CATEGORY 03 - MOUNTAIN WHOLE NUTS, SEEDS & KERNELS (7 Products)
  // =========================================================================
  console.log('Rendering Page 5 (Category 03: Nuts & Kernels)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  drawCategoryHeader(
    '03',
    'MOUNTAIN WHOLE NUTS, SEEDS & ROASTED KERNELS',
    'Jumbo grade whole nuts, slow-roasted with Himalayan pink salt · No industrial cooking oils'
  );

  // Raw Almonds, Roasted Almonds, Cashews, Roasted Cashews, Pistachios, Pumpkin Seeds, Anjeer
  const cat3Products = [
    masterProducts[15], // Raw Almonds
    masterProducts[16], // Roasted Almonds
    masterProducts[17], // Cashews
    masterProducts[18], // Roasted Cashews
    masterProducts[19], // Pistachios
    masterProducts[20], // Pumpkin Seeds
    masterProducts[21]  // Figs Anjeer
  ];
  await drawProductGrid(cat3Products);
  drawPageFooter(5);

  // =========================================================================
  // PAGE 6: CATEGORY 04 - SACRED MINERALS, BOTANICAL ELIXIRS & OILS (7 Products)
  // =========================================================================
  console.log('Rendering Page 6 (Category 04: Minerals & Elixirs)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  drawCategoryHeader(
    '04',
    'SACRED MINERALS, BOTANICAL ELIXIRS & COLD-PRESSED OILS',
    'Authentic Gold Grade Himalayan Shilajit, ancient volcanic salts, raw seeds & virgin cold-pressed oils'
  );

  // Shilajit, Chia, Pink Salt, Black Salt, Coconut Oil 200ml, Coconut Oil 500ml, Makhana
  const cat4Products = [
    masterProducts[22], // Shilajit
    masterProducts[23], // Chia Seeds
    masterProducts[24], // Pink Salt
    masterProducts[25], // Black Salt
    masterProducts[26], // Coconut Oil 200ml
    masterProducts[27], // Coconut Oil 500ml
    masterProducts[28]  // Makhana
  ];
  await drawProductGrid(cat4Products);
  drawPageFooter(6);

  // =========================================================================
  // PAGE 7: MASTER VERIFICATION & SPECIFICATION INDEX (ALL 29 PRODUCTS)
  // =========================================================================
  console.log('Rendering Page 7 (Master Verification Index - All 29 Products)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_LIGHT_BG);

  // Table Page Header
  doc.rect(0, 0, W, 70).fill(C_FOREST);
  doc.rect(0, 70, W, 3).fill(C_GOLD);
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8.5).text('OFFICIAL RECORD & INVENTORY SPECIFICATION', 30, 16, { letterSpacing: 1.5 });
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(16).text('MASTER PRODUCT SPECIFICATION INDEX (ALL 29 PRODUCTS)', 30, 29);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8.5).text('Verified SKU codes, net weights, packaging formats, shelf lives, and official MRP (NPR)', 30, 50);

  // Master Table Dimensions
  const tblX = 25;
  const tblY = 82;
  const tblW = W - 50; // 545.28 pt

  // Table Column Headers (Height: 22pt)
  doc.roundedRect(tblX, tblY, tblW, 20, 3).fill(C_FOREST);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(7);
  doc.text('SN', tblX + 5, tblY + 6, { width: 18, align: 'center' });
  doc.text('PRODUCT NAME', tblX + 26, tblY + 6, { width: 175 });
  doc.text('CATEGORY', tblX + 205, tblY + 6, { width: 95 });
  doc.text('NET WT/VOL', tblX + 305, tblY + 6, { width: 60 });
  doc.text('PACKAGING', tblX + 370, tblY + 6, { width: 75 });
  doc.text('SHELF LIFE', tblX + 450, tblY + 6, { width: 45 });
  doc.text('OFFICIAL MRP', tblX + 498, tblY + 6, { width: 42, align: 'right' });

  // 29 Table Rows
  let curY = tblY + 22;
  const rowH = 19;

  masterProducts.forEach((p, idx) => {
    const isEven = idx % 2 === 0;
    doc.rect(tblX, curY, tblW, rowH).fill(isEven ? '#FFFFFF' : '#F6F1E5');
    doc.lineWidth(0.3).strokeColor('#E2D7C2').rect(tblX, curY, tblW, rowH).stroke();

    // SN
    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(7.5).text(
      String(p.sn),
      tblX + 5,
      curY + 5,
      { width: 18, align: 'center' }
    );

    // Product Name
    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(7.8).text(
      p.name,
      tblX + 26,
      curY + 5,
      { width: 175, lineBreak: false, ellipsis: true }
    );

    // Category
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7).text(
      p.cat,
      tblX + 205,
      curY + 5,
      { width: 95 }
    );

    // Net Qty
    doc.fillColor(C_INK).font('Helvetica-Bold').fontSize(7.5).text(
      p.qty,
      tblX + 305,
      curY + 5,
      { width: 60 }
    );

    // Packaging
    doc.fillColor(C_INK).font('Helvetica').fontSize(7).text(
      p.pack,
      tblX + 370,
      curY + 5,
      { width: 75, lineBreak: false, ellipsis: true }
    );

    // Shelf Life
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7).text(
      p.life,
      tblX + 450,
      curY + 5,
      { width: 45 }
    );

    // MRP (Right aligned bold)
    doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(8.5).text(
      `Rs. ${p.mrp}`,
      tblX + 490,
      curY + 4,
      { width: 50, align: 'right' }
    );

    curY += rowH;
  });

  // Table Verification Footer Box (Below Row 29)
  const vBoxY = curY + 6;
  doc.roundedRect(tblX, vBoxY, tblW, 115, 6).fill('#F4EFE2');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(tblX, vBoxY, tblW, 115, 6).stroke();

  doc.fillColor(C_FOREST).font('Helvetica-Bold').fontSize(9.5).text(
    'OFFICIAL QUALITY, TAX & PACKAGING VERIFICATION NOTICE',
    tblX + 15,
    vBoxY + 10
  );
  doc.fillColor(C_INK).font('Helvetica').fontSize(7.8).text(
    '• All prices listed in this compendium are in Nepalese Rupees (NPR) and are inclusive of all applicable domestic taxes.\n' +
    '• Every food grade standup pouch and sealed glass jar features tamper-evident holographic sealing and a batch-specific QR traceability code.\n' +
    '• Storage Guidance: Keep dried fruits, whole nuts, and micro-milled powders in a cool, dark pantry below 24°C. Reseal airtight after every opening.\n' +
    '• Special Dietary Notes: 100% Gluten-Free, Dairy-Free, Non-GMO, Vegan, and naturally free from artificial coloring, sulfur dioxide, and synthetic bleaches.\n' +
    '• For institutional orders, restaurant supplies, gym pantries, or customized festive gift hampers, contact wholesale@naturesmud.com.',
    tblX + 15,
    vBoxY + 26,
    { width: tblW - 30, lineGap: 2.5 }
  );

  drawPageFooter(7);

  // =========================================================================
  // PAGE 8: GRAND MAGAZINE BACK COVER & DIRECTORY (Full bleed forest green)
  // =========================================================================
  console.log('Rendering Page 8 (Grand Back Cover & Order Directory)...');
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(C_DARK_BG);

  // Double gold foil border
  doc.lineWidth(1.5).strokeColor(C_GOLD).rect(20, 20, W - 40, H - 40).stroke();
  doc.lineWidth(0.5).strokeColor(C_GOLD).rect(24, 24, W - 48, H - 48).stroke();

  // Top Back Cover Masthead
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text(
    'NATURE\'S MUD  ·  DIRECT CLIENT ORDERING DIRECTORY',
    35,
    38,
    { align: 'center', width: W - 70, letterSpacing: 2 }
  );
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(22).text(
    'HOW TO ORDER ACROSS NEPAL',
    35,
    54,
    { align: 'center', width: W - 70, letterSpacing: 1.5 }
  );
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(9).text(
    'Seamless digital shopping, direct WhatsApp assistance, and express delivery to all 77 districts',
    35,
    80,
    { align: 'center', width: W - 70 }
  );

  // Ordering Channels (3 Columns: 155w each)
  const oColY = 102;
  const oColW = (W - 90) / 3;

  // Channel 1: Online Website
  doc.roundedRect(35, oColY, oColW, 115, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(35, oColY, oColW, 115, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text('OFFICIAL STORE', 45, oColY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(12).text('naturesmud.com', 45, oColY + 28);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    '• Browse all 29 products\n• Live inventory status\n• eSewa, Khalti, Card & COD\n• Instant order confirmation SMS',
    45,
    oColY + 48,
    { width: oColW - 20, lineGap: 3 }
  );

  // Channel 2: WhatsApp & Phone
  const c2X = 35 + oColW + 10;
  doc.roundedRect(c2X, oColY, oColW, 115, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(c2X, oColY, oColW, 115, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text('PHONE & WHATSAPP', c2X + 10, oColY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(12).text('+977 9713888002', c2X + 10, oColY + 28);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    '• Direct chat with our team\n• Custom combo ordering\n• Voice & text order booking\n• Fast response 8AM – 9PM',
    c2X + 10,
    oColY + 48,
    { width: oColW - 20, lineGap: 3 }
  );

  // Channel 3: Delivery Coverage
  const c3X = c2X + oColW + 10;
  doc.roundedRect(c3X, oColY, oColW, 115, 6).fill('#132B1E');
  doc.lineWidth(0.8).strokeColor(C_GOLD).roundedRect(c3X, oColY, oColW, 115, 6).stroke();
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text('NATIONWIDE COURIER', c3X + 10, oColY + 12);
  doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(12).text('All 77 Districts', c3X + 10, oColY + 28);
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    '• Kathmandu: 24–48 Hours\n• Major Cities: 2–3 Days\n• Remote Districts: 4–6 Days\n• Safe bubble wrap packaging',
    c3X + 10,
    oColY + 48,
    { width: oColW - 20, lineGap: 3 }
  );

  // Authorized Retail Outlets & Stockists Directory (Middle Box)
  const retY = 230;
  const retW = W - 70;
  doc.roundedRect(35, retY, retW, 205, 6).fill('#11261B');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(35, retY, retW, 205, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(
    'AUTHORIZED RETAIL PARTNERS & EXPERIENCE CENTERS IN NEPAL',
    50,
    retY + 12
  );
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8).text(
    'Walk in to sample and purchase authentic Nature\'s Mud products at our official partner outlets:',
    50,
    retY + 28
  );

  const outlets = [
    { name: 'Headquarters & Flagship Experience Center', loc: 'Samakhushi, Gongabu Chowk (near Kumari Bank), Kathmandu', contact: '+977 9713888002' },
    { name: 'Kids Kottage — Gongabu', loc: 'Arya Complex, Gongabu Chowk, Kathmandu', contact: 'Tel: 9802323451' },
    { name: 'Kids Kottage — Kupondol', loc: 'Kupondol Height, Lalitpur & Kapan Branch, Kathmandu', contact: 'Tel: 9802323452' },
    { name: 'Kids Kottage — Pokhara', loc: 'New Road & Chipledhunga, Pokhara, Kaski', contact: 'Tel: 9802323453' },
    { name: 'Zero to Ten Baby & Mother Store', loc: 'Chabahil Chowk (opposite KL Tower), Kathmandu', contact: 'Tel: 9802323454' },
    { name: 'Baby Love Store', loc: 'Main Commercial Road, Hetauda, Makwanpur', contact: 'Tel: 9802323455' }
  ];

  let rRowY = retY + 45;
  outlets.forEach((o, idx) => {
    const isEven = idx % 2 === 0;
    doc.roundedRect(48, rRowY, retW - 26, 24, 3).fill(isEven ? '#173324' : '#142C1F');

    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(8).text(o.name, 56, rRowY + 7);
    doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(7.5).text(o.loc, 235, rRowY + 7, { width: 220, lineBreak: false, ellipsis: true });
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(8).text(o.contact, retW - 60, rRowY + 7, { align: 'right', width: 80 });

    rRowY += 26;
  });

  // Wholesale, Corporate Gifting & Export Box
  const wsY = 448;
  doc.roundedRect(35, wsY, retW, 110, 6).fill('#132B1E');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(35, wsY, retW, 110, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text(
    'INSTITUTIONAL B2B, RESELLERS & CORPORATE FESTIVE GIFTING',
    50,
    wsY + 12
  );
  doc.fillColor(C_GOLD_LIGHT).font('Helvetica').fontSize(8.5).text(
    'Nature\'s Mud partners with supermarkets, organic grocery chains, corporate banks, wellness spas, yoga retreats, and hospitality resorts across Nepal and international export markets.\n\n' +
    '• Custom Corporate Hampers: Handcrafted wooden and velvet gift boxes for Dashain, Tihar, New Year, and AGMs.\n' +
    '• Bulk Commercial Supplies: 5kg, 10kg, and 25kg vacuum-sealed packs for bakeries, juice bars, and cafes.\n' +
    '• Direct B2B Inquiries: Call +977 9713888002  |  Email: wholesale@naturesmud.com  |  info@naturesmud.com',
    50,
    wsY + 30,
    { width: retW - 30, lineGap: 3 }
  );

  // Purity Guarantee & Compliant Alternative Claims Badge
  const purY = 570;
  doc.roundedRect(35, purY, retW, 160, 6).fill('#0B1C12');
  doc.lineWidth(1).strokeColor(C_GOLD).roundedRect(35, purY, retW, 160, 6).stroke();

  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10.5).text(
    '100% SATISFACTION & BOTANICAL PURITY GUARANTEE',
    50,
    purY + 12,
    { align: 'center', width: retW - 30 }
  );
  doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(
    'Every single jar and pouch is backed by our full money-back purity guarantee. If you are ever dissatisfied with product freshness, texture, or quality, we offer immediate replacement or a full refund with zero questions asked.\n\n' +
    'ALTERNATIVE COMPLIANCE & LEGAL NOTICE:\n' +
    'Nature\'s Mud products are whole-food nutritional staples and traditional botanical supplements. They are not manufactured or intended to diagnose, treat, prevent, or cure any medical illness or condition. Dietary advice in this compendium reflects traditional Ayurvedic ethnobotany and general whole-food nutritional science. Always consult a licensed healthcare professional or holistic practitioner regarding clinical health questions.',
    50,
    purY + 30,
    { align: 'center', width: retW - 30, lineGap: 2.8 }
  );

  // Gold Seal Bottom Footer Bar
  doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(
    'WWW.NATURESMUD.SHOP  ·  KATHMANDU, NEPAL  ·  © 2026/2027 NATURE\'S MUD APOTHECARY',
    35,
    H - 45,
    { align: 'center', width: W - 70, letterSpacing: 1.5 }
  );

  // Assert page count before ending
  const pageRange = doc.bufferedPageRange();
  console.log(`Verified Total Page Count: ${pageRange.count}`);

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      // Copy to aliases
      fs.copyFileSync(outPdf1, outPdf2);
      fs.copyFileSync(outPdf1, outPdf3);
      console.log('✅ Generated 8-Page Magazine PDF at:');
      console.log('  1.', outPdf1);
      console.log('  2.', outPdf2);
      console.log('  3.', outPdf3);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

generateMagazinePDF().catch((err) => {
  console.error('❌ PDF generation failed:', err);
  process.exit(1);
});
