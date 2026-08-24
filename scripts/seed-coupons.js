const mysql = require('mysql2/promise');

async function seedCoupons() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'naturesmud',
    password: 'secret',
    database: 'natures_mud',
  });

  await conn.query(`
    INSERT INTO coupons (code, type, value, min_order_amount, is_active, created_at, updated_at)
    VALUES 
      ('WELCOME10', 'percentage', 10, 500, 1, NOW(), NOW()),
      ('FESTIVAL15', 'percentage', 15, 1000, 1, NOW(), NOW()),
      ('NATUREMUD', 'fixed', 150, 800, 1, NOW(), NOW())
    ON DUPLICATE KEY UPDATE is_active = 1
  `);

  console.log('✅ Coupons seeded: WELCOME10, FESTIVAL15, NATUREMUD');
  await conn.end();
}

seedCoupons().catch(console.error);
