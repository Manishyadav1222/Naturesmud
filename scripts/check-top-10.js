const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '..', 'lib', 'data', 'blogs-database.ts'), 'utf8');

const targetSlugs = [
  'are-dried-fruits-healthy-benefits-nutrition-guide',
  'how-to-eat-chia-seeds-daily-guide',
  'dates-powder-vs-white-sugar-natural-sweetener-nepal',
  'pumpkin-seeds-benefits-nutrition-daily-intake-guide',
  'dried-mango-vs-fresh-mango-nutrition-comparison',
  '10-himalayan-superfoods-nepal-health-benefits-guide',
  'sweet-potato-powder-for-babies-nepal-guide',
  'best-healthy-snacks-nepal-clean-eating-kathmandu',
  'how-to-store-nuts-seeds-dried-fruits-nepal-humidity',
  'natural-sweeteners-nepal-dates-powder-honey-comparison'
];

targetSlugs.forEach((slug, idx) => {
  const exists = file.includes(`slug: '${slug}'`) || file.includes(`slug: "${slug}"`);
  console.log(`${idx + 1}. ${slug} -> ${exists ? 'EXISTS' : 'MISSING'}`);
});
