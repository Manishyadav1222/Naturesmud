const mysql = require('mysql2/promise');

async function seedAllCoupons() {
  console.log('Seeding 5% coupons into kathma13_natures_mud...');
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  const coupons = [
    { code: 'STORE5', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'WELCOME5', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'FESTIVAL5', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'WELCOME10', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'FESTIVAL15', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'GYMPOWER10', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'BABYCARE15', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'WELLNESS20', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'RAKHI10', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'DASHAIN35', type: 'percentage', value: 5, min_order_amount: 500 },
    { code: 'TIHARGIFT', type: 'percentage', value: 5, min_order_amount: 500 },
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

  // Update any existing active coupons in MySQL to 5%
  await conn.query(`UPDATE coupons SET value = 5 WHERE type = 'percentage'`);
  console.log('✅ Updated all existing percentage coupons in MySQL to 5%!');

  await conn.end();
  console.log('🎉 All coupons successfully configured to 5% off!');
}

seedAllCoupons().catch(console.error);
