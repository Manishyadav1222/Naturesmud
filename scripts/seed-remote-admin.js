const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const roles = [
  { name: 'SUPER_ADMIN', description: 'Full access to all features' },
  { name: 'ADMIN', description: 'Administrative access with most permissions' },
  { name: 'MANAGER', description: 'Manage day-to-day operations' },
  { name: 'MARKETING', description: 'Manage marketing campaigns and content' },
  { name: 'WAREHOUSE', description: 'Manage inventory and fulfillment' },
  { name: 'SUPPORT', description: 'Handle customer support and messages' },
  { name: 'CONTENT_MANAGER', description: 'Manage blog and content' },
  { name: 'VIEWER', description: 'Read-only access' },
];

const allPermissionKeys = [
  'dashboard.view',
  'orders.view', 'orders.create', 'orders.edit', 'orders.delete', 'orders.update_status', 'orders.invoice', 'orders.refund',
  'customers.view', 'customers.edit', 'customers.delete', 'customers.reward_points',
  'products.view', 'products.create', 'products.edit', 'products.delete',
  'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
  'inventory.view', 'inventory.edit', 'inventory.adjust',
  'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
  'coupons.view', 'coupons.create', 'coupons.edit', 'coupons.delete',
  'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.delete',
  'analytics.view', 'analytics.export',
  'settings.view', 'settings.edit',
  'users.view', 'users.create', 'users.edit', 'users.delete',
  'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
  'media.view', 'media.upload', 'media.delete',
  'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
  'recipes.view', 'recipes.create', 'recipes.edit', 'recipes.delete',
  'reviews.view', 'reviews.edit', 'reviews.delete', 'reviews.approve',
  'messages.view', 'messages.reply', 'messages.delete',
  'notifications.view', 'notifications.manage',
  'flash_sales.view', 'flash_sales.create', 'flash_sales.edit', 'flash_sales.delete',
  'combo_offers.view', 'combo_offers.create', 'combo_offers.edit', 'combo_offers.delete',
  'rewards.view', 'rewards.adjust',
  'gift_cards.view', 'gift_cards.create', 'gift_cards.edit',
  'social.view', 'social.manage',
  'gallery.view', 'gallery.upload', 'gallery.delete',
  'backup.view', 'backup.create', 'backup.restore'
];

async function main() {
  console.log('Connecting to remote kathma13_natures_mud_admin via MySQL...');
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_natures_mud_admin',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud_admin'
  });

  console.log('1. Seeding Roles...');
  const roleMap = {};
  for (const r of roles) {
    const id = 'role_' + r.name.toLowerCase();
    await conn.query(`
      INSERT INTO \`Role\` (id, name, description, createdAt, updatedAt)
      VALUES (?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE description = VALUES(description), updatedAt = NOW()
    `, [id, r.name, r.description]);
    roleMap[r.name] = id;
  }
  console.log('   ✅ 8 Roles seeded.');

  console.log('2. Seeding Permissions...');
  for (const key of allPermissionKeys) {
    const [module, action] = key.split('.');
    const id = 'perm_' + key.replace('.', '_');
    await conn.query(`
      INSERT INTO \`Permission\` (id, \`key\`, name, createdAt)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `, [id, key, `${action.toUpperCase()} ${module.toUpperCase()}`]);
  }
  console.log(`   ✅ ${allPermissionKeys.length} Permissions seeded.`);

  console.log('3. Seeding Super Admin user...');
  const hashedPassword = await bcrypt.hash('NatureMud@Admin2026!', 12);
  const userId = 'admin_super_user_01';
  await conn.query(`
    INSERT INTO \`User\` (id, email, password, name, phone, isActive, roleId, createdAt, updatedAt)
    VALUES (?, 'admin@naturesmud.shop', ?, 'Super Admin', '9779713888002', 1, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE password = VALUES(password), roleId = VALUES(roleId), updatedAt = NOW()
  `, [userId, hashedPassword, roleMap['SUPER_ADMIN']]);

  console.log('\n============================================================');
  console.log('🎉 Super Admin Seeded Successfully!');
  console.log('   Email:    admin@naturesmud.shop');
  console.log('   Password: NatureMud@Admin2026!');
  console.log('   Role:     SUPER_ADMIN');
  console.log('============================================================\n');

  await conn.end();
}

main().catch(console.error);
