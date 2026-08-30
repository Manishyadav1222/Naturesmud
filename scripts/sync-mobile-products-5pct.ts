import fs from 'fs';
import path from 'path';
import { products } from '../mobile/src/lib/data/products';
import { categories } from '../mobile/src/lib/data/products';

function updateMobileProducts() {
  const filePath = path.join(__dirname, '..', 'mobile', 'src', 'lib', 'data', 'products.ts');
  
  const updatedProducts = products.map(p => {
    let orig = Number(p.compareAtPrice || p.price || 0);
    let disc = Math.round(orig * 0.95);
    return {
      ...p,
      compareAtPrice: orig,
      price: disc
    };
  });

  const content = `import type { Product, Category } from '@/types';

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const products: Product[] = ${JSON.stringify(updatedProducts, null, 2)};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated mobile products.ts with 5% discount!');
}

updateMobileProducts();
