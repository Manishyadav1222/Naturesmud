const fs = require('fs');
const path = require('path');
const PDFDocument = require(path.join(process.cwd(), 'node_modules/pdfkit/js/pdfkit.js'));

// Destination path
const outputDir = 'c:/Users/manish yadav/Downloads/NEW-NATUREMUD/public';
const outputPath = path.join(outputDir, 'Nature_Mud_Product_Catalog.pdf');
const aliasPath = path.join(outputDir, 'catalog.pdf');

// All 25 master products exactly matching user's client spreadsheet
const products = [
  {
    sn: 1,
    name: 'Dehydrated Mango',
    sub: 'Sun-Dried Himalayan Mango Slices',
    qty: '100 GM',
    packing: 'Standup Ziplock Pouch',
    category: 'Dried Fruits',
    mrp: 395,
    benefit: '100% pure tree-ripened mango. High in Vitamins A & C, zero added sugar or sulfur.',
  },
  {
    sn: 2,
    name: 'Dehydrated Pineapple',
    sub: 'Dehydrated Himalayan Pineapple Rings',
    qty: '100 GM',
    packing: 'Standup Ziplock Pouch',
    category: 'Dried Fruits',
    mrp: 495,
    benefit: 'Rich in active Bromelain digestive enzyme & Vitamin C. Anti-inflammatory gut snack.',
  },
  {
    sn: 3,
    name: 'Dehydrated Apple',
    sub: 'Dehydrated Himalayan Apple Rings',
    qty: '100 GM',
    packing: 'Standup Ziplock Pouch',
    category: 'Dried Fruits',
    mrp: 510,
    benefit: 'High-altitude Jumla apples with soluble Pectin fiber & Quercetin for heart health.',
  },
  {
    sn: 4,
    name: 'Dehydrated Coconut Chip',
    sub: 'Dehydrated Crunchy Coconut Chips',
    qty: '100 GM',
    packing: 'Standup Ziplock Pouch',
    category: 'Dried Fruits',
    mrp: 495,
    benefit: 'Toasted coconut flakes packed with healthy MCT fats & dietary fiber. Keto-friendly.',
  },
  {
    sn: 5,
    name: 'Dehydrated Papaya',
    sub: 'Dehydrated Sweet Papaya Slices',
    qty: '100 GM',
    packing: 'Standup Ziplock Pouch',
    category: 'Dried Fruits',
    mrp: 395,
    benefit: 'Solar-dehydrated below 42°C to retain Papain enzymes for smooth digestion.',
  },
  {
    sn: 6,
    name: 'Dried Blueberries',
    sub: 'Wild Dried Himalayan Blueberries',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Dried Fruits',
    mrp: 650,
    benefit: 'Alpine wild berries rich in dark-violet Anthocyanins to fight digital screen eye strain.',
  },
  {
    sn: 7,
    name: 'Dried Cranberry',
    sub: 'Whole Dried Cranberries',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Dried Fruits',
    mrp: 415,
    benefit: 'Packed with Type-A Proanthocyanidins (PACs) for urinary tract and cellular defense.',
  },
  {
    sn: 8,
    name: 'Dates Powder',
    sub: 'Natural Dates Powder Sweetener',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Powders',
    mrp: 400,
    benefit: '1:1 natural replacement for white refined table sugar. Rich in iron & potassium.',
  },
  {
    sn: 9,
    name: 'Beetroot Powder',
    sub: 'Pure Himalayan Beetroot Powder',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Powders',
    mrp: 430,
    benefit: 'Concentrated dietary nitrates convert to Nitric Oxide for athletic stamina & vascular flow.',
  },
  {
    sn: 10,
    name: 'Pink Salt',
    sub: 'Ancient Himalayan Pink Rock Salt',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Salts & Spices',
    mrp: 180,
    benefit: '84+ ionic trace minerals with zero microplastics, anti-caking chemicals, or bleach.',
  },
  {
    sn: 11,
    name: 'Black Salt',
    sub: 'Pure Himalayan Black Salt (Bire Noon)',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Salts & Spices',
    mrp: 150,
    benefit: 'Ayurvedic volcanic rock salt (Kala Namak) to kindle digestive Agni and ease gas & acid.',
  },
  {
    sn: 12,
    name: 'Chia Seeds',
    sub: 'Premium Black Chia Seeds (300g)',
    qty: '300 GM',
    packing: 'Plastic Jar',
    category: 'Seeds',
    mrp: 495,
    benefit: 'Hydrophilic super seeds packed with Plant Omega-3 ALA, calcium, and gut-soothing fiber.',
  },
  {
    sn: 13,
    name: 'Pumpkin Seeds',
    sub: 'Organic Himalayan Pumpkin Seeds (300g)',
    qty: '300 GM',
    packing: 'Plastic Jar',
    category: 'Seeds',
    mrp: 650,
    benefit: 'AAA-grade raw pepitas loaded with bioavailable Zinc & Magnesium for sleep and immunity.',
  },
  {
    sn: 14,
    name: 'Premium Cashewnut',
    sub: 'Premium Whole Cashewnuts (200g)',
    qty: '200 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 750,
    benefit: 'Jumbo W240 grade cashews with buttery crunch. Rich in copper, magnesium & clean protein.',
  },
  {
    sn: 15,
    name: 'Roasted Cashewnut',
    sub: 'Slow-Roasted Cashewnuts (150g)',
    qty: '150 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 750,
    benefit: 'Oil-free dry-roasted whole cashews. Irresistible crisp snap and natural toasty aroma.',
  },
  {
    sn: 16,
    name: 'Dried Figs',
    sub: 'Premium Whole Dried Figs (Anjeer 200g)',
    qty: '200 GM',
    packing: 'Glass Jar',
    category: 'Dried Fruits',
    mrp: 690,
    benefit: 'Sweet chewy sun-ripened Anjeer packed with natural plant calcium, iron, and gut fiber.',
  },
  {
    sn: 17,
    name: 'Roasted Almond',
    sub: 'Premium Roasted Himalayan Almonds (100g)',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 750,
    benefit: 'Slow-roasted mountain almonds sealed in glass jar. High in Vitamin E & healthy fats.',
  },
  {
    sn: 18,
    name: 'Almond',
    sub: 'Raw Himalayan Mountain Almonds (200g)',
    qty: '200 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 750,
    benefit: 'Unpasteurized raw mountain almonds for morning soaking (badam pani) and cognitive memory.',
  },
  {
    sn: 19,
    name: 'Pistachio',
    sub: 'California Premium Pistachios (150g)',
    qty: '150 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 895,
    benefit: 'Naturally opened green kernels rich in Lutein, Zeaxanthin, and Vitamin B6 for eye wellness.',
  },
  {
    sn: 20,
    name: 'Mix dry Nuts',
    sub: 'Himalayan Superfood Mix Dry Nuts (300g)',
    qty: '300 GM',
    packing: 'Plastic Jar',
    category: 'Nuts',
    mrp: 690,
    benefit: 'Synergy of cashews, almonds, pumpkin seeds, chia seeds, cranberries & wild blueberries.',
  },
  {
    sn: 21,
    name: 'Macademia Nuts',
    sub: 'Gourmet Raw Macadamia Nuts (150g)',
    qty: '150 GM',
    packing: 'Glass Jar',
    category: 'Nuts',
    mrp: 850,
    benefit: 'Velvety whole gourmet macadamias high in rare Omega-7 (Palmitoleic acid) for skin & brain.',
  },
  {
    sn: 22,
    name: 'Coconut oil',
    sub: 'Cold-Pressed Extra Virgin Coconut Oil (500ml)',
    qty: '500ml',
    packing: 'Glass Jar',
    category: 'Oils',
    mrp: 1750,
    benefit: 'Unrefined cold-pressed coconut milk oil. 50%+ Lauric Acid for cooking, skin & hair care.',
  },
  {
    sn: 23,
    name: 'Coconut oil',
    sub: 'Cold-Pressed Extra Virgin Coconut Oil (180ml)',
    qty: '180ml',
    packing: 'Glass Jar',
    category: 'Oils',
    mrp: 650,
    benefit: 'Compact vanity & travel glass jar of pure virgin coconut oil for skincare and oil pulling.',
  },
  {
    sn: 24,
    name: 'Carrot Powder',
    sub: 'Organic Carrot Powder (100g)',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Powders',
    mrp: 490,
    benefit: 'Solar-dehydrated fine carrot powder rich in Beta-Carotene for baby meals, soups, and skin.',
  },
  {
    sn: 25,
    name: 'Sweet Potato Powder',
    sub: 'Organic Sweet Potato Powder (100g)',
    qty: '100 GM',
    packing: 'Glass Jar',
    category: 'Powders',
    mrp: 510,
    benefit: '100% pure organic complex carbs with 720% DV Vitamin A. Ideal for baby weaning & workout fuel.',
  },
];

function generatePDF() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 36,
      autoFirstPage: false,
      info: {
        Title: "Nature's Mud — Official Product Catalog & Master Price List 2026",
        Author: "Nature's Mud Nepal",
        Subject: 'Organic Superfoods, Dehydrated Fruits, Nuts & Seeds Catalog',
        Keywords: "Nature's Mud, Catalog, Price List, Organic Food Nepal, Superfoods",
        CreationDate: new Date(),
      },
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Color Palette
    const C_EMERALD = '#1B3D2F';
    const C_GREEN = '#2D5A27';
    const C_GOLD = '#C9982A';
    const C_LIGHT_GOLD = '#F4E8C1';
    const C_BG = '#FBF9F4';
    const C_WHITE = '#FFFFFF';
    const C_DARK = '#222222';
    const C_MUTED = '#555555';
    const C_CARD_BG = '#F4EFE6';
    const C_ACCENT = '#E63946';

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;

    function drawPageTemplate(title, categoryName, pageNum, totalPages) {
      doc.save();

      // Top header band
      doc.rect(margin, 20, contentWidth, 32).fill(C_EMERALD);
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(11).text("NATURE'S MUD", margin + 12, 30);
      doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text(`•  ${title.toUpperCase()}`, margin + 115, 31);
      doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(9).text(categoryName, pageWidth - margin - 150, 31, { align: 'right', width: 140 });

      // Gold bottom line
      doc.rect(margin, 52, contentWidth, 2).fill(C_GOLD);

      // Bottom footer band
      doc.rect(margin, pageHeight - 34, contentWidth, 1).fill('#DDDDDD');
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(8).text(
        'Nature\'s Mud Nepal  |  Samakhushi, Gongabu Chowk, Kathmandu  |  +977 9713888002  |  www.naturesmud.shop',
        margin,
        pageHeight - 26,
        { width: contentWidth - 60 }
      );
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8).text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin - 60,
        pageHeight - 26,
        { align: 'right', width: 60 }
      );

      doc.restore();
    }

    // =========================================================================
    // PAGE 1: COVER PAGE
    // =========================================================================
    doc.addPage();

    doc.rect(0, 0, pageWidth, pageHeight).fill(C_EMERALD);

    doc.lineWidth(1.5).strokeColor(C_GOLD);
    doc.rect(24, 24, pageWidth - 48, pageHeight - 48).stroke();
    doc.lineWidth(0.5).strokeColor(C_GOLD);
    doc.rect(28, 28, pageWidth - 56, pageHeight - 56).stroke();

    doc.rect(pageWidth / 2 - 110, 60, 220, 26).fillAndStroke(C_GREEN, C_GOLD);
    doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(9).text('100% PURE HIMALAYAN NUTRITION', 0, 69, { align: 'center', width: pageWidth });

    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(38).text("NATURE'S MUD", 0, 110, { align: 'center', width: pageWidth });
    doc.fillColor(C_GOLD).font('Helvetica').fontSize(14).text("Pure Food  ·  Real Nature  ·  Chemical-Free Superfoods", 0, 155, { align: 'center', width: pageWidth });

    const coverCardY = 195;
    const coverCardHeight = 425;
    doc.roundedRect(50, coverCardY, pageWidth - 100, coverCardHeight, 12).fill('#132B21');
    doc.lineWidth(1).strokeColor(C_GOLD);
    doc.roundedRect(50, coverCardY, pageWidth - 100, coverCardHeight, 12).stroke();

    doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(22).text('OFFICIAL PRODUCT CATALOG', 0, coverCardY + 24, { align: 'center', width: pageWidth });
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(13).text('& MASTER PRICE SPECIFICATION LIST', 0, coverCardY + 52, { align: 'center', width: pageWidth });

    doc.rect(pageWidth / 2 - 60, coverCardY + 74, 120, 2).fill(C_GOLD);

    const bulletItems = [
      { title: 'Solar-Dehydrated Fruits & Fruit Slices', desc: 'Mango, Pineapple, Apple Rings, Coconut Chips, Papaya & Wild Berries' },
      { title: 'Organic Micro-Ground Superfood Powders', desc: 'Sweet Potato, Dates Natural Sweetener, Beetroot & Carrot Powders' },
      { title: 'Premium Mountain Nuts & Kernels', desc: 'Whole & Roasted Cashews, Raw & Roasted Almonds, Pistachios, Macadamias' },
      { title: 'Nutrient-Dense Seeds & Ancient Himalayan Salts', desc: 'Black Chia Seeds (300g), Raw Pumpkin Seeds (300g), Pink & Black Rock Salt' },
      { title: 'Centrifuged Cold-Pressed Virgin Coconut Oils', desc: 'Extra Virgin Raw Coconut Oil in 500ml & 180ml Glass Jars' },
    ];

    let bY = coverCardY + 88;
    bulletItems.forEach((item) => {
      doc.rect(70, bY, pageWidth - 140, 52).fill('#1B3D2F');
      doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10.5).text(item.title, 82, bY + 10);
      doc.fillColor('#E0E0E0').font('Helvetica').fontSize(8.5).text(item.desc, 82, bY + 28);
      bY += 58;
    });

    doc.roundedRect(pageWidth / 2 - 130, coverCardY + 386, 260, 24, 6).fill(C_GOLD);
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(9.5).text('★ 25 MASTER CERTIFIED PRODUCTS INCLUDED ★', 0, coverCardY + 393, { align: 'center', width: pageWidth });

    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(11).text('Nature\'s Mud Nepal (naturesmud.shop)', 0, pageHeight - 120, { align: 'center', width: pageWidth });
    doc.fillColor('#C4D4CC').font('Helvetica').fontSize(9).text('Headquarters: Samakhushi, Gongabu Chowk, Kathmandu, Nepal', 0, pageHeight - 104, { align: 'center', width: pageWidth });
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(10).text('Phone / WhatsApp: +977 9713888002  |  Email: info@naturesmud.shop', 0, pageHeight - 88, { align: 'center', width: pageWidth });
    doc.fillColor('#A2B8AE').font('Helvetica').fontSize(8).text('Effective: 2026 Edition  •  Retail & Wholesale Reference Guide', 0, pageHeight - 68, { align: 'center', width: pageWidth });

    // =========================================================================
    // HELPER: RENDER PRODUCT GRID PAGE
    // =========================================================================
    function renderProductGridPage(pageTitle, categoryName, pageNum, totalPages, itemsList) {
      doc.addPage();
      drawPageTemplate(pageTitle, categoryName, pageNum, totalPages);

      doc.rect(margin, 60, contentWidth, 22).fill(C_BG);
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(11).text(categoryName.toUpperCase(), margin + 8, 66);

      const startY = 88;
      const cardGap = 8;
      const cols = 2;
      const cardWidth = (contentWidth - cardGap) / cols;
      const numRows = Math.ceil(itemsList.length / cols);
      const availableHeight = pageHeight - 42 - startY;
      const cardHeight = Math.min(168, (availableHeight - (numRows - 1) * cardGap) / numRows);

      itemsList.forEach((prod, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cardX = margin + col * (cardWidth + cardGap);
        const cardY = startY + row * (cardHeight + cardGap);

        // Card Container
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 6).fill(C_WHITE);
        doc.lineWidth(0.8).strokeColor('#E2DACE');
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 6).stroke();

        // Top Accent bar
        doc.roundedRect(cardX, cardY, cardWidth, 20, 6).fill(C_EMERALD);
        doc.rect(cardX, cardY + 12, cardWidth, 8).fill(C_EMERALD);

        // Item Number & Title
        doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text(`#${prod.sn}`, cardX + 8, cardY + 5);
        doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(9).text(prod.name, cardX + 28, cardY + 5, { width: cardWidth - 36 });

        // Subtitle / specification
        doc.fillColor(C_GREEN).font('Helvetica-Bold').fontSize(8.5).text(prod.sub, cardX + 8, cardY + 24, { width: cardWidth - 16 });

        // Qty & Packaging badges
        const badgeY = cardY + 38;
        doc.roundedRect(cardX + 8, badgeY, 62, 14, 3).fill('#EAE6DC');
        doc.fillColor(C_DARK).font('Helvetica-Bold').fontSize(7.5).text(`Qty: ${prod.qty}`, cardX + 11, badgeY + 3.5);

        doc.roundedRect(cardX + 74, badgeY, cardWidth - 82, 14, 3).fill('#EAE6DC');
        doc.fillColor(C_DARK).font('Helvetica').fontSize(7.5).text(`Pack: ${prod.packing}`, cardX + 77, badgeY + 3.5, { width: cardWidth - 86 });

        // Pricing Box
        const priceBoxY = cardY + 56;
        const priceBoxH = 34;
        doc.roundedRect(cardX + 8, priceBoxY, cardWidth - 16, priceBoxH, 4).fill(C_CARD_BG);

        // Official MRP
        doc.fillColor(C_MUTED).font('Helvetica').fontSize(8).text('MRP (Inclusive of Taxes):', cardX + 14, priceBoxY + 5);
        doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(13).text(`Rs. ${prod.mrp}`, cardX + 14, priceBoxY + 16);

        // Benefit / Description text
        const benefitY = priceBoxY + priceBoxH + 6;
        doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(
          `• ${prod.benefit}`,
          cardX + 8,
          benefitY,
          { width: cardWidth - 16, height: cardHeight - (benefitY - cardY) - 4 }
        );
      });
    }

    // PAGE 2: DRIED FRUITS & BERRIES (8 products)
    const driedFruits = products.filter(p => p.category === 'Dried Fruits');
    renderProductGridPage(
      'Solar-Dehydrated Fruits & Berries',
      'Category: 100% Pure Solar-Dehydrated Fruits (8 Items)',
      2,
      6,
      driedFruits
    );

    // PAGE 3: SUPERFOOD POWDERS & COLD-PRESSED OILS (6 products)
    const powdersAndOils = products.filter(p => p.category === 'Powders' || p.category === 'Oils');
    renderProductGridPage(
      'Organic Powders & Cold-Pressed Virgin Oils',
      'Category: Superfood Powders & Virgin Coconut Oils (6 Items)',
      3,
      6,
      powdersAndOils
    );

    // PAGE 4: MOUNTAIN NUTS, SEEDS & HIMALAYAN SALTS (11 products)
    const nutsSeedsSalts = products.filter(p => p.category === 'Nuts' || p.category === 'Seeds' || p.category === 'Salts & Spices');
    renderProductGridPage(
      'Mountain Nuts, Seeds & Himalayan Salts',
      'Category: Nuts, Seeds & Ancient Himalayan Rock Salts (11 Items)',
      4,
      6,
      nutsSeedsSalts
    );

    // =========================================================================
    // PAGE 5: COMPLETE MASTER PRICE & SPECIFICATION REFERENCE TABLE
    // =========================================================================
    doc.addPage();
    drawPageTemplate('Master Price & Specification Table', 'Complete 25 Products Price List', 5, 6);

    doc.rect(margin, 60, contentWidth, 22).fill(C_EMERALD);
    doc.fillColor(C_WHITE).font('Helvetica-Bold').fontSize(10.5).text(
      'MASTER PRODUCT CATALOG & PRICE SPECIFICATION SHEET',
      margin,
      66,
      { align: 'center', width: contentWidth }
    );

    const tableTop = 86;
    const colDefs = [
      { label: 'SN', x: margin, w: 32, align: 'center' },
      { label: 'PRODUCT', x: margin + 32, w: 200, align: 'left' },
      { label: 'QTY', x: margin + 232, w: 75, align: 'center' },
      { label: 'PACKING', x: margin + 307, w: 120, align: 'left' },
      { label: 'MRP', x: margin + 427, w: 96, align: 'right' },
    ];

    doc.rect(margin, tableTop, contentWidth, 16).fill('#EAE5D9');
    colDefs.forEach((col) => {
      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(7.5).text(
        col.label,
        col.x + 2,
        tableTop + 4,
        { width: col.w - 4, align: col.align }
      );
    });

    let rowY = tableTop + 16;
    const rowHeight = 24.2;

    products.forEach((p, idx) => {
      const isEven = idx % 2 === 0;
      doc.rect(margin, rowY, contentWidth, rowHeight).fill(isEven ? C_WHITE : '#F8F6F0');
      doc.lineWidth(0.3).strokeColor('#E0D8CC');
      doc.rect(margin, rowY, contentWidth, rowHeight).stroke();

      doc.fillColor(C_DARK).font('Helvetica-Bold').fontSize(8).text(
        String(p.sn),
        colDefs[0].x,
        rowY + 7,
        { width: colDefs[0].w, align: colDefs[0].align }
      );

      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8).text(
        p.name,
        colDefs[1].x + 4,
        rowY + 4,
        { width: colDefs[1].w - 6 }
      );
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(6.8).text(
        p.category,
        colDefs[1].x + 4,
        rowY + 14,
        { width: colDefs[1].w - 6 }
      );

      doc.fillColor(C_DARK).font('Helvetica').fontSize(8).text(
        p.qty,
        colDefs[2].x,
        rowY + 7,
        { width: colDefs[2].w, align: colDefs[2].align }
      );

      doc.fillColor(C_DARK).font('Helvetica').fontSize(7.5).text(
        p.packing,
        colDefs[3].x + 4,
        rowY + 7,
        { width: colDefs[3].w - 6, align: colDefs[3].align }
      );

      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(9).text(
        `Rs. ${p.mrp}`,
        colDefs[4].x,
        rowY + 7,
        { width: colDefs[4].w - 4, align: colDefs[4].align }
      );

      rowY += rowHeight;
    });

    doc.rect(margin, rowY + 6, contentWidth, 32).fill(C_BG);
    doc.lineWidth(0.5).strokeColor(C_GOLD);
    doc.rect(margin, rowY + 6, contentWidth, 32).stroke();

    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(8).text(
      '• Maximum Retail Price (MRP) is inclusive of all taxes. Official certified Nature\'s Mud Price List.',
      margin + 8,
      rowY + 12
    );
    doc.fillColor(C_MUTED).font('Helvetica').fontSize(7.5).text(
      '• Certified 100% natural, chemical-free Himalayan superfoods, dehydrated fruits, and cold-pressed virgin oils.',
      margin + 8,
      rowY + 24
    );

    // =========================================================================
    // PAGE 6: HOW TO ORDER, STORE LOCATIONS & QUALITY PROMISE
    // =========================================================================
    doc.addPage();
    drawPageTemplate('Ordering & Retail Partner Directory', 'Customer & Wholesale Support', 6, 6);

    const orderBoxY = 60;
    doc.roundedRect(margin, orderBoxY, contentWidth, 125, 8).fill(C_EMERALD);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(13).text('HOW TO PLACE AN ORDER', margin + 16, orderBoxY + 14);

    doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text('1. Order Online 24/7:', margin + 16, orderBoxY + 36);
    doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(9.5).text('www.naturesmud.shop  or  www.naturesmud.com', margin + 130, orderBoxY + 36);

    doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text('2. WhatsApp / Phone:', margin + 16, orderBoxY + 54);
    doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(9.5).text('+977 9713888002  (Instant order confirmation & tracking)', margin + 130, orderBoxY + 54);

    doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text('3. Delivery Coverage:', margin + 16, orderBoxY + 72);
    doc.fillColor('#E0E0E0').font('Helvetica').fontSize(9).text('Same-day / Next-day delivery in Kathmandu Valley; 2-4 days across all 77 districts.', margin + 130, orderBoxY + 72);

    doc.fillColor(C_WHITE).font('Helvetica').fontSize(9).text('4. Payment Options:', margin + 16, orderBoxY + 90);
    doc.fillColor(C_GOLD).font('Helvetica-Bold').fontSize(9).text('FonePay QR, eSewa, Khalti, Direct Bank Transfer & Cash On Delivery (COD)', margin + 130, orderBoxY + 90);

    doc.fillColor(C_WHITE).font('Helvetica-Oblique').fontSize(8).text('Free express shipping across Nepal on all orders over Rs. 10,000.', margin + 16, orderBoxY + 108);

    const outletY = orderBoxY + 135;
    doc.rect(margin, outletY, contentWidth, 20).fill(C_BG);
    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(10.5).text('OFFICIAL RETAIL OUTLETS & SHOWROOMS IN NEPAL', margin + 8, outletY + 5);

    const outlets = [
      { name: 'Headquarters & Showroom', loc: 'Samakhushi, Gongabu Chowk (near Kumari Bank), Kathmandu', phone: '+977 9713888002' },
      { name: 'Kids Kottage — Gongabu', loc: 'Arya Complex, Gongabu Chowk, Kathmandu', phone: '9802323451' },
      { name: 'Kids Kottage — Kupondol', loc: 'Kupondol, Lalitpur & Kapan, Kathmandu', phone: '9802323452' },
      { name: 'Kids Kottage — Pokhara', loc: 'New Road / Chipledhunga, Pokhara', phone: '9802323453' },
      { name: 'Zero to Ten', loc: 'Chabahil, Kathmandu', phone: '9802323454' },
      { name: 'Baby Love', loc: 'Main Road, Hetauda', phone: '9802323455' },
    ];

    let oY = outletY + 28;
    outlets.forEach((o, i) => {
      const isEven = i % 2 === 0;
      doc.roundedRect(margin, oY, contentWidth, 34, 4).fill(isEven ? C_WHITE : '#F5F2EA');
      doc.lineWidth(0.5).strokeColor('#E0D8CC');
      doc.roundedRect(margin, oY, contentWidth, 34, 4).stroke();

      doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(9).text(o.name, margin + 12, oY + 6);
      doc.fillColor(C_MUTED).font('Helvetica').fontSize(8).text(o.loc, margin + 12, oY + 19);
      doc.fillColor(C_GREEN).font('Helvetica-Bold').fontSize(8.5).text(`Ph: ${o.phone}`, pageWidth - margin - 120, oY + 12, { align: 'right', width: 110 });

      oY += 38;
    });

    const wsY = oY + 6;
    doc.roundedRect(margin, wsY, contentWidth, 90, 6).fill('#EFE9DD');
    doc.lineWidth(1).strokeColor(C_GOLD);
    doc.roundedRect(margin, wsY, contentWidth, 90, 6).stroke();

    doc.fillColor(C_EMERALD).font('Helvetica-Bold').fontSize(11).text('WHOLESALE, INSTITUTIONAL & EXPORT INQUIRIES', margin + 14, wsY + 10);
    doc.fillColor(C_DARK).font('Helvetica').fontSize(8.5).text(
      'Nature\'s Mud partners with supermarkets, organic grocers, gymnasiums, pediatrics clinics, ayurvedic wellness centers, and hospitality resorts across Nepal and abroad.',
      margin + 14,
      wsY + 26,
      { width: contentWidth - 28 }
    );
    doc.fillColor(C_DARK).font('Helvetica').fontSize(8.5).text(
      'Custom packaging sizes, bulk sacks (5kg/10kg/25kg), private labeling, and direct B2B invoicing available upon request.',
      margin + 14,
      wsY + 50,
      { width: contentWidth - 28 }
    );
    doc.fillColor(C_GREEN).font('Helvetica-Bold').fontSize(9).text(
      'Direct Wholesale Line: +977 9713888002  |  Email: wholesale@naturesmud.shop',
      margin + 14,
      wsY + 72
    );

    const gY = wsY + 98;
    doc.roundedRect(margin, gY, contentWidth, 38, 6).fill(C_EMERALD);
    doc.fillColor(C_LIGHT_GOLD).font('Helvetica-Bold').fontSize(9.5).text(
      '100% SATISFACTION & NATURAL PURITY GUARANTEE',
      margin,
      gY + 8,
      { align: 'center', width: contentWidth }
    );
    doc.fillColor(C_WHITE).font('Helvetica').fontSize(8).text(
      'Every product is rigorously quality-checked. If you are not 100% satisfied, we offer instant replacement or refund.',
      margin,
      gY + 22,
      { align: 'center', width: contentWidth }
    );

    doc.end();

    stream.on('finish', () => {
      fs.copyFileSync(outputPath, aliasPath);
      console.log('Successfully generated PDF catalog at:');
      console.log('1.', outputPath);
      console.log('2.', aliasPath);
      resolve(outputPath);
    });

    stream.on('error', reject);
  });
}

generatePDF().catch(console.error);
