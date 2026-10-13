const fs = require('fs');
const content = fs.readFileSync('lib/data/products.ts', 'utf8');

const lines = content.split('\n');
let curSlug = '';
let curName = '';
let curPrice = 0;
let curWeight = '';
const featured = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const mSlug = line.match(/"slug":\s*"([^"]+)"/);
  if (mSlug) curSlug = mSlug[1];
  const mName = line.match(/"name":\s*"([^"]+)"/);
  if (mName) curName = mName[1];
  const mPrice = line.match(/"price":\s*([0-9.]+)/);
  if (mPrice) curPrice = Number(mPrice[1]);
  const mWeight = line.match(/"weight":\s*"([^"]+)"/);
  if (mWeight) curWeight = mWeight[1];

  if (line.includes('"isFeatured": true') || line.includes('isFeatured: true')) {
    featured.push({ slug: curSlug, name: curName, price: curPrice, weight: curWeight });
  }
}

console.log('=== isFeatured: true products in products.ts ===');
console.table(featured);
