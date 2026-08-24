const mysql = require('mysql2/promise');

async function checkPrices() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'natures_mud',
  });

  const [rows] = await conn.query('SELECT id, name, slug, price, compare_at_price FROM products ORDER BY id ASC');
  console.log('--- DATABASE PRODUCTS & PRICES ---');
  for (const r of rows) {
    console.log(`ID: ${r.id} | Slug: ${r.slug.padEnd(28)} | Price: Rs. ${r.price} | Compare: ${r.compare_at_price}`);
  }
  await conn.end();
}

checkPrices().catch(console.error);
