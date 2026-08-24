const mysql = require('mysql2/promise');
const fs = require('fs');

async function syncProducts() {
  const code = fs.readFileSync('lib/data/products.ts', 'utf8');
  const cleanJs = code
    .replace(/import .*/g, '')
    .replace(/export const getProductBySlug.*/gs, '')
    .replace('export const products: Product[] =', 'return');

  const parsedProducts = new Function(cleanJs)();
  console.log(`Found ${parsedProducts.length} authentic products in lib/data/products.ts`);

  const c = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'naturesmud',
    password: 'secret',
    database: 'natures_mud',
  });

  await c.query('SET FOREIGN_KEY_CHECKS = 0');
  await c.query('TRUNCATE TABLE products');

  const [cats] = await c.query('SELECT id, slug FROM categories');
  const catMap = {};
  for (const cat of cats) {
    catMap[cat.slug] = cat.id;
  }

  for (const p of parsedProducts) {
    const categoryId = catMap[p.categorySlug] || 1;
    const numericWeight = parseFloat(p.weight) || 250;
    const unitStr = p.weight && p.weight.includes('ml') ? 'ml' : 'g';
    const skuCode = `NM-${String(p.id).padStart(3, '0')}-${p.slug.replace(/-/g, '').slice(0, 6).toUpperCase()}`;

    await c.query(
      `INSERT INTO products (
        id, category_id, name, slug, sku, description, short_description,
        price, compare_at_price, cost_price, stock_quantity, low_stock_threshold,
        is_active, is_featured, is_best_seller, is_new, weight, unit, images,
        ingredients, nutrition_facts, benefits, usage_instructions, storage_instructions,
        meta_title, meta_description, rating_avg, rating_count, views_count, sold_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        parseInt(p.id, 10),
        categoryId,
        p.name,
        p.slug,
        skuCode,
        p.description,
        p.shortDescription || p.description.slice(0, 120),
        p.price,
        p.compareAtPrice || null,
        Math.round(p.price * 0.6),
        p.stock || 100,
        10,
        1,
        p.isFeatured ? 1 : 0,
        p.isBestSeller ? 1 : 0,
        1,
        numericWeight,
        unitStr,
        JSON.stringify(p.images || [p.image]),
        JSON.stringify(p.ingredients || []),
        JSON.stringify(p.nutrition || []),
        JSON.stringify(p.benefits || []),
        p.usage || 'Add to your daily routine.',
        p.storage || 'Store in a cool, dry place.',
        `${p.name} | Nature's Mud Nepal`,
        p.shortDescription || p.description.slice(0, 150),
        p.rating || 5.0,
        p.reviewCount || 0,
        0,
        0,
      ]
    );
  }

  await c.query('SET FOREIGN_KEY_CHECKS = 1');
  const [count] = await c.query('SELECT COUNT(*) as c FROM products');
  console.log(`✅ Successfully synced ${count[0].c} products to MySQL database!`);
  await c.end();
}

syncProducts().catch(console.error);
