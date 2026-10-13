const fs = require('fs');

const prodText = fs.readFileSync('lib/data/products.ts', 'utf8');

// Simple parser for products in products.ts
const matches = [];
const regex = /\{\s*"id":\s*"([^"]+)".*?"slug":\s*"([^"]+)".*?"name":\s*"([^"]+)".*?"price":\s*(\d+).*?"weight":\s*"([^"]+)"/gs;
let m;
while ((m = regex.exec(prodText)) !== null) {
  matches.push({
    id: m[1],
    slug: m[2],
    name: m[3],
    price: parseInt(m[4]),
    weight: m[5]
  });
}

console.log('Total parsed products in products.ts:', matches.length);
matches.forEach((p, idx) => {
  console.log(`${idx+1}. [${p.slug}] ${p.name} | Rs. ${p.price} | ${p.weight}`);
});
