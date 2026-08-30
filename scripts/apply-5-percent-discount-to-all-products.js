const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function apply5PercentDiscount() {
  console.log('🚀 Applying 5% discount across all products in lib/data/products.ts & MySQL...');

  // 1. Update lib/data/products.ts
  const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
  const fileContent = fs.readFileSync(productsFilePath, 'utf8');

  // Extract products array using TS require or JSON parser
  const match = fileContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Could not find products array in products.ts');
  }

  const rawProducts = JSON.parse(match[1]);
  console.log(`Found ${rawProducts.length} products in lib/data/products.ts.`);

  const updatedProducts = rawProducts.map(p => {
    // Determine canonical original price (MRP)
    let origPrice = Number(p.compareAtPrice || p.mrp || p.price || 0);
    if (!origPrice || isNaN(origPrice)) origPrice = Number(p.price || 0);

    // Calculate 5% discounted selling price
    const discountPrice = Math.round(origPrice * 0.95);

    return {
      ...p,
      price: discountPrice,
      compareAtPrice: origPrice,
      mrp: origPrice
    };
  });

  const updatedFileContent = `import { Product } from '@/lib/types';\nimport { resolveImageUrl } from '@/lib/utils';\n\nexport const products: Product[] = ${JSON.stringify(updatedProducts, null, 2)};\n\nexport function getProductBySlug(slug: string): Product | undefined {\n  return products.find((p) => p.slug === slug);\n}\n\nexport function getProductById(id: string | number): Product | undefined {\n  return products.find((p) => String(p.id) === String(id) || String(p.dbId) === String(id));\n}\n\nexport function getFeaturedProducts(): Product[] {\n  return products.filter((p) => p.isFeatured);\n}\n\nexport function getBestSellerProducts(): Product[] {\n  return products.filter((p) => p.isBestSeller);\n}\n\nexport function getProductsByCategory(categorySlug: string): Product[] {\n  return products.filter((p) => p.categorySlug === categorySlug);\n}\n\nexport const categories = [\n  {\n    name: 'Dried Fruits',\n    slug: 'dried-fruits',\n    description: '100% pure sun-dried fruits with zero added sugar or sulfur dioxide',\n    image: '/products/authentic-dehydrated-mango.jpg',\n    count: products.filter((p) => p.categorySlug === 'dried-fruits').length,\n  },\n  {\n    name: 'Organic Powders',\n    slug: 'powders',\n    description: 'Micro-pulverized 100% organic vegetable & fruit superfood powders',\n    image: '/products/sweet-potato-powder-100g.jpg',\n    count: products.filter((p) => p.categorySlug === 'powders').length,\n  },\n  {\n    name: 'Mountain Nuts',\n    slug: 'nuts',\n    description: 'Premium Himalayan almonds, walnuts, and mountain crunch',\n    image: '/products/authentic-almonds.jpg',\n    count: products.filter((p) => p.categorySlug === 'nuts').length,\n  },\n  {\n    name: 'Seeds & Salts',\n    slug: 'seeds',\n    description: 'Raw high-altitude superfood seeds and pure Himalayan rock salt',\n    image: '/products/pumpkin-seeds.jpg',\n    count: products.filter((p) => p.categorySlug === 'seeds').length,\n  },\n];\n`;

  fs.writeFileSync(productsFilePath, updatedFileContent, 'utf8');
  console.log('✅ Updated lib/data/products.ts with 5% discount across all products!');

  // 2. Update remote MySQL Database
  console.log('Connecting to remote MySQL database kathma13_natures_mud...');
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud'
  });

  const [dbProducts] = await conn.query('SELECT id, name, price, compare_at_price FROM products');
  console.log(`Updating ${dbProducts.length} products in remote database...`);

  for (const p of dbProducts) {
    const orig = Number(p.compare_at_price || p.price || 0);
    const disc = Math.round(orig * 0.95);
    await conn.query('UPDATE products SET price = ?, compare_at_price = ? WHERE id = ?', [disc, orig, p.id]);
  }

  console.log('✅ Successfully updated all database products with 5% discount!');
  await conn.end();
}

apply5PercentDiscount().catch(console.error);
