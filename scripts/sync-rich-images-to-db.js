const mysql = require('mysql2/promise');

const productImagesMap = {
  'makhana-fox-nuts': [
    '/products/nm-makhana-jar.jpeg',
    '/products/fox-nuts-jar-2k.jpg'
  ],
  'sweet-potato-powder': [
    '/products/nm-sweet-potato-jar.jpeg',
    '/products/sweet-potato-jar-display.jpg',
    '/products/sweet-potato-product-poster.jpg',
    '/products/sweet-potato-creation-process.jpg',
    '/products/sweet-potato-powder-100g.jpg',
    '/products/sweet-potato-powder.jpg'
  ],
  'chia-seeds': [
    '/products/nm-chia-jar.jpeg',
    '/products/nm-chia-ad.jpeg',
    '/products/nm-chia-ad2.jpeg',
    '/products/nm-chia-display.jpeg',
    '/products/nm-chia-studio.jpeg',
    '/images/posters/chia-power.jpg',
    '/products/chia-seeds.jpg'
  ],
  'beetroot-powder': [
    '/products/nm-beetroot-jar.jpeg',
    '/products/nm-beetroot-ad1.jpeg',
    '/products/nm-beetroot-ad2.jpeg',
    '/products/beetroot-glass-jar.jpg',
    '/products/beetroot-poster-2k.jpg',
    '/products/beetroot-vital-blood.jpg',
    '/products/beetroot-powder-100g.jpg'
  ],
  'dehydrated-apple': [
    '/products/nm-apple-pouch.jpeg',
    '/products/nm-apple-design.jpeg',
    '/products/dehydrated-apple-poster.jpg',
    '/products/authentic-dehydrated-apple.jpg',
    '/products/apple.jpg'
  ],
  'dried-blueberries': [
    '/products/nm-blueberry-jar.jpeg',
    '/products/nm-blueberry-purple.jpeg',
    '/products/nm-blueberry-shoot.jpeg',
    '/products/blueberries-brain-power.jpg',
    '/products/blueberries.jpg',
    '/products/blueberries-2.jpg'
  ],
  'dehydrated-mango': [
    '/products/nm-mango-pouch.jpeg',
    '/products/nm-mango-prod.jpeg',
    '/products/dehydrated-mango-poster.jpg',
    '/products/authentic-dehydrated-mango.jpg',
    '/products/mango.jpg'
  ],
  'dehydrated-pineapple': [
    '/products/nm-pineapple-pouch.jpeg',
    '/products/nm-pineapple-design.jpeg',
    '/products/authentic-dehydrated-pineapple.jpg',
    '/products/dehydrated-pineapple.jpg'
  ],
  'dehydrated-papaya': [
    '/products/nm-papaya-flat.jpeg',
    '/products/papaya-2.jpg'
  ],
  'dried-cranberries': [
    '/products/nm-cranberry-jar.jpeg',
    '/products/cranberries-glowing-jar.jpg',
    '/products/cranberries-infographic.jpg',
    '/products/cranberries-prevent-uti.jpg',
    '/products/cranberries-2.jpg'
  ],
  'carrot-powder': [
    '/products/nm-carrot-jar.jpeg',
    '/products/carrot-benefits-poster.jpg',
    '/products/carrot-powder-eye-health.jpg',
    '/products/carrot-powder-marble.jpg',
    '/products/carrot-powder-100g.jpg'
  ],
  'dates-powder': [
    '/products/nm-dates-jar.jpeg',
    '/products/dates-powder-jar-2k.jpg',
    '/products/dates-powder-health-poster.jpg',
    '/products/dates-powder-product-shot.jpg',
    '/products/dates-powder-100g.jpg'
  ],
  'himalayan-pink-salt': [
    '/products/nm-pink-salt-jar.jpeg',
    '/products/client-authentic-label-1.jpg',
    '/products/pink-salt-crystals.jpg',
    '/products/pink-salt-moss.jpg'
  ],
  'pure-mountain-himalayan-shilajit-resin': [
    '/products/nm-shilajit-jar.jpeg',
    '/products/shilajit.jpg'
  ],
  'roasted-cashewnuts': [
    '/products/nm-cashew-jar1.jpeg',
    '/products/nm-cashew-jar2.jpeg',
    '/products/authentic-cashewnuts-roasted.jpg',
    '/products/cashewnuts-roasted.jpg'
  ],
  'premium-cashewnuts': [
    '/products/nm-cashew-jar1.jpeg',
    '/products/nm-cashew-jar2.jpeg',
    '/products/authentic-cashewnuts-roasted.jpg',
    '/products/cashewnuts-roasted.jpg'
  ],
  'roasted-almonds': [
    '/products/nm-almond-jar.jpeg',
    '/products/authentic-almonds.jpg',
    '/products/almonds.jpg',
    '/products/almonds-2.jpg'
  ],
  'raw-himalayan-almonds': [
    '/products/nm-almond-jar.jpeg',
    '/products/authentic-almonds.jpg',
    '/products/almonds.jpg'
  ],
  'pumpkin-seeds': [
    '/images/posters/pure-pumpkin-seeds.jpg',
    '/products/pumpkin-seeds.jpg',
    '/products/pumpkin-seeds-product-shot.jpg',
    '/products/pumpkin-seeds-2.jpg'
  ]
};

async function syncToDatabase() {
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    user: 'kathma13',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  console.log('Connected to MySQL. Updating product images...');

  for (const [slug, images] of Object.entries(productImagesMap)) {
    const jsonStr = JSON.stringify(images);
    const [result] = await conn.execute(
      'UPDATE products SET images = ? WHERE slug = ?',
      [jsonStr, slug]
    );
    console.log(`Updated ${slug}: ${result.affectedRows} row(s) matched. Images count: ${images.length}`);
  }

  await conn.end();
  console.log('✅ Database sync complete!');
}

syncToDatabase().catch(console.error);
