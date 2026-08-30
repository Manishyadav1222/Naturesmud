import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { products } from '../lib/data/products';

async function main() {
  console.log(`🚀 Processing ${products.length} products with 5% discount...`);

  const updatedProducts = products.map((p) => {
    let origPrice = Number(p.compareAtPrice || p.mrp || p.price || 0);
    if (!origPrice || isNaN(origPrice)) origPrice = Number(p.price || 0);

    const discountPrice = Math.round(origPrice * 0.95);

    return {
      ...p,
      price: discountPrice,
      compareAtPrice: origPrice,
      mrp: origPrice,
    };
  });

  const productsFilePath = path.join(__dirname, '..', 'lib', 'data', 'products.ts');
  const code = `import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/utils';

export const products: Product[] = ${JSON.stringify(updatedProducts, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string | number): Product | undefined {
  return products.find((p) => String(p.id) === String(id) || String(p.dbId) === String(id));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellerProducts(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export const categories = [
  {
    name: 'Dried Fruits',
    slug: 'dried-fruits',
    description: '100% pure sun-dried fruits with zero added sugar or sulfur dioxide',
    image: '/products/authentic-dehydrated-mango.jpg',
    count: products.filter((p) => p.categorySlug === 'dried-fruits').length,
  },
  {
    name: 'Organic Powders',
    slug: 'powders',
    description: 'Micro-pulverized 100% organic vegetable & fruit superfood powders',
    image: '/products/sweet-potato-powder-100g.jpg',
    count: products.filter((p) => p.categorySlug === 'powders').length,
  },
  {
    name: 'Mountain Nuts',
    slug: 'nuts',
    description: 'Premium Himalayan almonds, walnuts, and mountain crunch',
    image: '/products/authentic-almonds.jpg',
    count: products.filter((p) => p.categorySlug === 'nuts').length,
  },
  {
    name: 'Seeds & Salts',
    slug: 'seeds',
    description: 'Raw high-altitude superfood seeds and pure Himalayan rock salt',
    image: '/products/pumpkin-seeds.jpg',
    count: products.filter((p) => p.categorySlug === 'seeds').length,
  },
];
`;

  fs.writeFileSync(productsFilePath, code, 'utf8');
  console.log('✅ Successfully updated lib/data/products.ts!');

  // Update MySQL
  console.log('Connecting to remote MySQL...');
  const conn = await mysql.createConnection({
    host: '167.235.9.123',
    port: 3306,
    user: 'kathma13_muduser',
    password: '2*5Qt7iSrB7-Uz',
    database: 'kathma13_natures_mud',
  });

  const [dbProducts]: any = await conn.query('SELECT id, name, price, compare_at_price FROM products');
  console.log(`Updating ${dbProducts.length} MySQL database products...`);

  for (const p of dbProducts) {
    const orig = Number(p.compare_at_price || p.price || 0);
    const disc = Math.round(orig * 0.95);
    await conn.query('UPDATE products SET price = ?, compare_at_price = ? WHERE id = ?', [disc, orig, p.id]);
  }

  console.log('✅ Successfully updated all database products with 5% discount!');
  await conn.end();
}

main().catch(console.error);
