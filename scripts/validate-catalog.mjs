import fs from 'fs';

console.log('====================================================');
console.log('NATURESMUD CATALOG AUDIT & INTEGRITY VALIDATOR');
console.log('====================================================');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const publicProducts = JSON.parse(fs.readFileSync('public/products.json', 'utf8'));

let errors = [];
let warnings = [];

// 1. Catalog count assertion
if (products.length !== 32) {
  errors.push(`Expected exactly 32 products, found ${products.length}`);
}
if (publicProducts.length !== products.length) {
  errors.push(`public/products.json (${publicProducts.length}) does not match products.json (${products.length})`);
}

// 2. Canonical SKUs assertion
const skus = new Set();
const slugs = new Set();
const VALID_UNITS = ['GM', 'G', 'KG', 'ML', 'L'];
const FORBIDDEN_PACKAGING_UNITS = ['PC', 'JAR', 'BOTTLE', 'PACK', 'BOX', 'PCS'];

products.forEach((p, index) => {
  const prefix = `[#${index + 1} ${p.slug}]:`;

  // Check unique slug
  if (slugs.has(p.slug)) {
    errors.push(`${prefix} Duplicate slug detected: "${p.slug}"`);
  }
  slugs.add(p.slug);

  // Check SKU
  if (!p.sku || typeof p.sku !== 'string') {
    errors.push(`${prefix} Missing SKU`);
  } else {
    if (skus.has(p.sku)) {
      errors.push(`${prefix} Duplicate SKU detected: "${p.sku}"`);
    }
    skus.add(p.sku);
  }

  // Check Price
  if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) {
    errors.push(`${prefix} Invalid price: ${p.price}`);
  }
  if (typeof p.mrp !== 'number' || isNaN(p.mrp) || p.mrp <= 0) {
    errors.push(`${prefix} Invalid mrp: ${p.mrp}`);
  }
  if (p.price > p.mrp) {
    errors.push(`${prefix} Price (${p.price}) cannot exceed MRP (${p.mrp})`);
  }

  // Check Weight
  if (!p.weight || typeof p.weight !== 'string') {
    errors.push(`${prefix} Missing weight`);
  } else {
    if (p.weight.includes('NaN')) {
      errors.push(`${prefix} Weight contains NaN: "${p.weight}"`);
    }

    const match = p.weight.trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
    if (!match) {
      errors.push(`${prefix} Weight format invalid: "${p.weight}"`);
    } else {
      const num = parseFloat(match[1]);
      const unit = match[2].toUpperCase();

      if (isNaN(num) || num <= 0) {
        errors.push(`${prefix} Weight quantity is not a positive number: "${p.weight}"`);
      }
      if (!VALID_UNITS.includes(unit)) {
        errors.push(`${prefix} Weight unit "${unit}" is not a recognized metric mass/volume unit`);
      }
      if (FORBIDDEN_PACKAGING_UNITS.includes(unit)) {
        errors.push(`${prefix} Weight unit is packaging unit "${unit}" rather than metric mass/volume`);
      }
    }
  }

  // Check Category
  const validCategories = ['dried-fruits', 'powders', 'nuts', 'seeds', 'oils', 'salts-spices'];
  if (!validCategories.includes(p.categorySlug)) {
    errors.push(`${prefix} Invalid categorySlug: "${p.categorySlug}"`);
  }

  // Check Category integrity: e.g. Dehydrated Mango must never be under nuts
  if (p.slug.includes('mango') && p.categorySlug !== 'dried-fruits') {
    errors.push(`${prefix} Mango placed in wrong category: "${p.categorySlug}"`);
  }
  if (p.slug.includes('powder') && p.categorySlug !== 'powders') {
    errors.push(`${prefix} Powder placed in wrong category: "${p.categorySlug}"`);
  }
  if (p.slug.includes('almond') && p.categorySlug !== 'nuts') {
    errors.push(`${prefix} Almond placed in wrong category: "${p.categorySlug}"`);
  }

  // Check Sugar Free claim on natural dried fruits
  const isNaturalFruitOrDate = ['dehydrated-mango', 'dehydrated-papaya', 'dehydrated-pineapple', 'dehydrated-apple-slices', 'dehydrated-kiwi', 'dates-powder', 'dry-figs-anjeer', 'black-raisins', 'dried-apricots'].includes(p.slug);
  if (isNaturalFruitOrDate) {
    if (p.tags && p.tags.includes('sugar-free')) {
      errors.push(`${prefix} Natural fruit/date product cannot be tagged "sugar-free"; must use "0-added-sugar"`);
    }
    if (p.badges && p.badges.includes('sugar-free')) {
      errors.push(`${prefix} Natural fruit/date product cannot have badge "sugar-free"; must use "0-added-sugar"`);
    }
  }

  // Check for unsubstantiated claims in benefits
  if (p.benefits) {
    p.benefits.forEach((b) => {
      if (b.toLowerCase().includes('combat fatigue and anemia') || b.toLowerCase().includes('cure diabetes') || b.toLowerCase().includes('cure cancer')) {
        errors.push(`${prefix} Benefit contains unsubstantiated medical claim: "${b}"`);
      }
    });
  }
});

console.log(`\nAudit Summary:`);
console.log(`- Canonical Products Audited: ${products.length}`);
console.log(`- Unique SKUs Verified:       ${skus.size}`);
console.log(`- Unique Slugs Verified:      ${slugs.size}`);
console.log(`- Errors Encountered:         ${errors.length}`);
console.log(`- Warnings Encountered:       ${warnings.length}`);

if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED WITH ERRORS:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n✅ ALL CATALOG INTEGRITY CHECKS PASSED WITH ZERO DEFECTS!');
  process.exit(0);
}
