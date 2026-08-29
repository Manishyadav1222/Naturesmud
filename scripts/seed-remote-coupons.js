const mysql = require('mysql2/promise');

async function seedAllCoupons() {
  console.log('Seeding coupons into kathma13_natures_mud...');
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  const coupons = [
    { code: 'WELCOME10', type: 'percentage', value: 10, min_order_amount: 500 },
    { code: 'FESTIVAL15', type: 'percentage', value: 15, min_order_amount: 1000 },
    { code: 'NATUREMUD', type: 'fixed', value: 150, min_order_amount: 800 },
    { code: 'GYMPOWER10', type: 'percentage', value: 10, min_order_amount: 800 },
    { code: 'BABYCARE15', type: 'percentage', value: 15, min_order_amount: 900 },
    { code: 'WELLNESS20', type: 'percentage', value: 20, min_order_amount: 1200 },
  ];

  for (const c of coupons) {
    await conn.query(`
      INSERT INTO coupons (code, type, value, min_order_amount, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        type = VALUES(type),
        value = VALUES(value),
        min_order_amount = VALUES(min_order_amount),
        is_active = 1
    `, [c.code, c.type, c.value, c.min_order_amount]);
    console.log(`   Seeded ${c.code} (${c.type === 'percentage' ? c.value + '%' : 'Rs. ' + c.value} off) ✅`);
  }

  await conn.end();
  console.log('All coupons seeded successfully!');
}

seedAllCoupons().catch(console.error);
