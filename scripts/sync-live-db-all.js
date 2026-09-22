const mysql = require('mysql2/promise');

async function syncRemoteDb() {
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  console.log('--- SYNCING LIVE MYSQL DATABASE ---');

  // 1. Update roasted-almonds weight to 200g
  await conn.query(`
    UPDATE products 
    SET weight = 200.00,
        short_description = 'Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 200g Glass Jar.'
    WHERE slug = 'roasted-almonds'
  `);
  console.log('✅ Updated roasted-almonds: 200g');

  // 2. Ensure raw-himalayan-almonds is 200g
  await conn.query(`
    UPDATE products 
    SET weight = 200.00,
        short_description = 'Raw unpasteurized mountain almonds for morning soaking and brain memory fuel in a 200g Glass Jar.'
    WHERE slug = 'raw-himalayan-almonds'
  `);
  console.log('✅ Updated raw-himalayan-almonds: 200g');

  // 3. Check / Insert makhana-fox-nuts
  const [existingMakhana] = await conn.query("SELECT id FROM products WHERE slug = 'makhana-fox-nuts'");
  if (existingMakhana.length === 0) {
    const imagesJson = JSON.stringify(['/products/makhana-jar.jpeg', '/products/makhana.jpeg']);
    const benefitsJson = JSON.stringify([
      'Rich in calcium for bone health',
      'Low in calories and high in protein',
      'Great source of antioxidants'
    ]);
    const ingredientsJson = JSON.stringify(['100% Pure Fox Nuts (Makhana)']);

    await conn.query(`
      INSERT INTO products (
        category_id, name, slug, sku, description, short_description,
        price, compare_at_price, cost_price, stock_quantity,
        is_active, is_featured, is_best_seller, is_new,
        weight, unit, images, ingredients, benefits,
        rating_avg, rating_count, created_at, updated_at
      ) VALUES (
        2, 'Makhana (Fox Nuts)', 'makhana-fox-nuts', 'NM-MAKHANA-60G',
        'Premium Himalayan Fox Nuts (Makhana). A healthy, crunchy, and lightweight snack loaded with antioxidants, calcium, and protein. Enjoy guilt-free snacking with these beautifully puffed lotus seeds.',
        'Crunchy and lightweight Himalayan Fox Nuts (Makhana) for healthy snacking in a 60g Glass Jar.',
        250.00, 250.00, 150.00, 100,
        1, 1, 0, 1,
        60.00, 'g', ?, ?, ?,
        4.8, 12, NOW(), NOW()
      )
    `, [imagesJson, ingredientsJson, benefitsJson]);
    console.log('✅ Inserted new product: Makhana (Fox Nuts) (60 GM)');
  } else {
    await conn.query(`
      UPDATE products
      SET weight = 60.00, unit = 'g', price = 250.00, compare_at_price = 250.00,
          short_description = 'Crunchy and lightweight Himalayan Fox Nuts (Makhana) for healthy snacking in a 60g Glass Jar.'
      WHERE slug = 'makhana-fox-nuts'
    `);
    console.log('✅ Updated existing makhana-fox-nuts to 60g');
  }

  // 4. Update primary product images in DB to use the new photos
  const imageUpdates = [
    { slug: 'beetroot-powder', img: '/products/beetroot-jar.jpeg' },
    { slug: 'carrot-powder', img: '/products/carrot-jar.jpeg' },
    { slug: 'dates-powder', img: '/products/dates-jar.jpeg' },
    { slug: 'sweet-potato-powder', img: '/products/sweet-potato-jar.jpeg' },
    { slug: 'dehydrated-mango', img: '/products/mango-pouch.jpeg' },
    { slug: 'dehydrated-pineapple', img: '/products/pineapple-pouch.jpeg' },
    { slug: 'dehydrated-apple', img: '/products/apple-pouch.jpeg' },
    { slug: 'dehydrated-papaya', img: '/products/papaya-flat.jpeg' },
    { slug: 'dried-blueberries', img: '/products/blueberry-jar.jpeg' },
    { slug: 'dried-cranberries', img: '/products/cranberry-jar.jpeg' },
    { slug: 'chia-seeds', img: '/products/chia-jar.jpeg' },
    { slug: 'himalayan-pink-salt', img: '/products/pink-salt-jar.jpeg' },
    { slug: 'roasted-cashewnuts', img: '/products/cashew-jar.jpeg' },
    { slug: 'premium-cashewnuts', img: '/products/cashew-jar.jpeg' },
    { slug: 'roasted-almonds', img: '/products/almond-jar.jpeg' },
    { slug: 'raw-himalayan-almonds', img: '/products/almond-jar.jpeg' },
    { slug: 'pure-mountain-himalayan-shilajit-resin', img: '/products/shilajit-jar.jpeg' }
  ];

  for (const item of imageUpdates) {
    const [prod] = await conn.query('SELECT images FROM products WHERE slug = ?', [item.slug]);
    if (prod.length > 0) {
      let imgs = [];
      try {
        imgs = typeof prod[0].images === 'string' ? JSON.parse(prod[0].images) : (prod[0].images || []);
      } catch (e) {
        imgs = [];
      }
      // Put item.img first if not already first
      imgs = [item.img, ...imgs.filter(x => x !== item.img)];
      await conn.query('UPDATE products SET images = ? WHERE slug = ?', [JSON.stringify(imgs), item.slug]);
      console.log(`  -> Set primary image for ${item.slug}: ${item.img}`);
    }
  }

  // 5. Verify the key products
  const [rows] = await conn.query(`
    SELECT slug, name, weight, unit, price, images 
    FROM products 
    WHERE slug IN ('makhana-fox-nuts', 'roasted-almonds', 'raw-himalayan-almonds', 'pure-mountain-himalayan-shilajit-resin')
  `);
  console.log('\n--- VERIFIED PRODUCTS IN REMOTE DB ---');
  console.table(rows.map(r => ({
    slug: r.slug,
    name: r.name,
    weight: `${r.weight} ${r.unit}`,
    price: r.price,
    primary_image: (typeof r.images === 'string' ? JSON.parse(r.images) : r.images)[0]
  })));

  await conn.end();
}

syncRemoteDb().catch(console.error);
