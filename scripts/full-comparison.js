const fs = require('fs');

// 1. Get canonical products from lib/data/products.ts
const content = fs.readFileSync('lib/data/products.ts', 'utf8');
const lines = content.split('\n');
const canonical = [];
let current = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^\s*{\s*$/)) {
    if (current && current.slug) canonical.push(current);
    current = {};
  }
  if (!current) continue;
  const mId = line.match(/"id":\s*"([^"]+)"/);
  if (mId) current.id = mId[1];
  const mSlug = line.match(/"slug":\s*"([^"]+)"/);
  if (mSlug) current.slug = mSlug[1];
  const mName = line.match(/"name":\s*"([^"]+)"/);
  if (mName) current.name = mName[1];
  const mPrice = line.match(/"price":\s*([0-9.]+)/);
  if (mPrice) current.price = Number(mPrice[1]);
  const mWeight = line.match(/"weight":\s*"([^"]+)"/);
  if (mWeight) current.weight = mWeight[1];
  const mPacking = line.match(/"packing":\s*"([^"]+)"/);
  if (mPacking) current.packing = mPacking[1];
  const mBadges = line.match(/"badges":/);
  if (mBadges) current.badges = [];
  const mBadgeItem = line.match(/"(bestseller|featured|new)"/);
  if (mBadgeItem && current.badges) current.badges.push(mBadgeItem[1]);
}
if (current && current.slug) canonical.push(current);

// 2. Parse masterProducts from scripts/generate-pdf-catalog.js
const pdfContent = fs.readFileSync('scripts/generate-pdf-catalog.js', 'utf8');
const matchPdf = pdfContent.match(/const masterProducts = \[([\s\S]*?)\];/);
const pdfProducts = eval('[' + matchPdf[1] + ']');

console.log(`Comparing ${pdfProducts.length} PDF products with canonical products...`);

const report = [];
pdfProducts.forEach(p => {
  let can = canonical.find(c => c.slug === p.id);
  if (!can) {
    if (p.id === 'premium-pistachios') can = canonical.find(c => c.slug === 'premium-pistachio-roasted-salted');
    if (p.id === 'dates-powder') can = canonical.find(c => c.slug === 'dates-powder');
  }

  const pPrice = p.mrp;
  const pWeight = p.qty;
  const canPrice = can ? can.price : 'NOT_FOUND';
  const canWeight = can ? can.weight : 'NOT_FOUND';

  const priceDiff = can && pPrice !== canPrice;
  const weightDiff = can && pWeight !== canWeight;

  report.push({
    sn: p.sn,
    id: p.id,
    name: p.name,
    pdfPrice: pPrice,
    canPrice: canPrice,
    priceDiff: priceDiff ? '❌ MISMATCH' : '✅ MATCH',
    pdfWeight: pWeight,
    canWeight: canWeight,
    weightDiff: weightDiff ? '❌ MISMATCH' : '✅ MATCH'
  });
});

console.table(report);
