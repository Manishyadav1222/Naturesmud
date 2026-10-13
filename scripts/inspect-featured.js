const fs = require('fs');
const content = fs.readFileSync('lib/data/products.ts', 'utf8');

const lines = content.split('\n');
const products = [];
let current = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^\s*{\s*$/)) {
    if (current && current.slug) products.push(current);
    current = {};
  }
  if (!current) continue;

  const mId = line.match(/"id":\s*"([^"]+)"/);
  if (mId) current.id = mId[1];

  const mSlug = line.match(/"slug":\s*"([^"]+)"/);
  if (mSlug) current.slug = mSlug[1];

  const mName = line.match(/"name":\s*"([^"]+)"/);
  if (mName) current.name = mName[1];

  const mCat = line.match(/"category":\s*"([^"]+)"/);
  if (mCat) current.category = mCat[1];

  const mPrice = line.match(/"price":\s*([0-9.]+)/);
  if (mPrice) current.price = Number(mPrice[1]);

  const mWeight = line.match(/"weight":\s*"([^"]+)"/);
  if (mWeight) current.weight = mWeight[1];

  const mPacking = line.match(/"packing":\s*"([^"]+)"/);
  if (mPacking) current.packing = mPacking[1];

  const mFeatured = line.match(/"isFeatured":\s*(true|false)/);
  if (mFeatured) current.isFeatured = mFeatured[1] === 'true';

  const mBestSeller = line.match(/"isBestSeller":\s*(true|false)/);
  if (mBestSeller) current.isBestSeller = mBestSeller[1] === 'true';

  const mBadges = line.match(/"badges":/);
  if (mBadges) current.badges = [];
  const mBadgeItem = line.match(/"(bestseller|featured|new|popular)"/);
  if (mBadgeItem && current.badges) current.badges.push(mBadgeItem[1]);
}
if (current && current.slug) products.push(current);

console.log('=== ALL FEATURED OR BESTSELLER PRODUCTS ===');
console.table(products.filter(p => p.isFeatured || p.isBestSeller || (p.badges && p.badges.includes('featured'))).map(p => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  weight: p.weight,
  isFeatured: p.isFeatured,
  isBestSeller: p.isBestSeller,
  badges: p.badges ? p.badges.join(', ') : ''
})));
