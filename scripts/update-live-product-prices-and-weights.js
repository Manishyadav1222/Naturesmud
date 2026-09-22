const mysql = require('mysql2/promise');

async function updateRemoteProducts() {
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  console.log('--- UPDATING REMOTE MYSQL DATABASE ---');

  // 1. Coconut Oil 500ml
  await conn.query(`
    UPDATE products 
    SET price = 1750.00, compare_at_price = 1750.00, weight = 500.00, unit = 'ML',
        name = 'Cold-Pressed Extra Virgin Coconut Oil (500ml)'
    WHERE slug = 'virgin-coconut-oil-500ml'
  `);
  console.log('✅ Updated virgin-coconut-oil-500ml: Rs. 1750 (500ml)');

  // 2. Coconut Oil 200ml (was 180ml)
  await conn.query(`
    UPDATE products 
    SET price = 650.00, compare_at_price = 650.00, weight = 200.00, unit = 'ML',
        name = 'Cold-Pressed Extra Virgin Coconut Oil (200ml)',
        short_description = 'Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 200ml Glass Bottle.'
    WHERE slug = 'virgin-coconut-oil-180ml'
  `);
  console.log('✅ Updated virgin-coconut-oil-180ml: Rs. 650 (200ml)');

  // 3. Dehydrated Papaya
  await conn.query(`
    UPDATE products 
    SET weight = 80.00,
        short_description = 'Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking in an 80g Standup Ziplock Pouch.'
    WHERE slug = 'dehydrated-papaya'
  `);
  console.log('✅ Updated dehydrated-papaya: 80 GM');

  // 4. Himalayan Pink Salt
  await conn.query(`
    UPDATE products 
    SET weight = 200.00,
        short_description = 'Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a 200g Glass Jar.'
    WHERE slug = 'himalayan-pink-salt'
  `);
  console.log('✅ Updated himalayan-pink-salt: 200 GM');

  // 5. Himalayan Black Salt
  await conn.query(`
    UPDATE products 
    SET weight = 200.00,
        short_description = 'Volcanic sulfur-rich Himalayan black salt for Ayurvedic digestion and gut wellness in a 200g Glass Jar.'
    WHERE slug = 'pure-himalayan-black-salt-bire-noon'
  `);
  console.log('✅ Updated pure-himalayan-black-salt-bire-noon: 200 GM');

  // Verify
  const [rows] = await conn.query(`
    SELECT id, slug, name, price, compare_at_price, weight, unit 
    FROM products 
    WHERE slug IN ('virgin-coconut-oil-500ml', 'virgin-coconut-oil-180ml', 'dehydrated-papaya', 'himalayan-pink-salt', 'pure-himalayan-black-salt-bire-noon')
  `);
  console.log('\n--- VERIFICATION FROM REMOTE DATABASE ---');
  console.table(rows);

  await conn.end();
}

updateRemoteProducts().catch(console.error);
