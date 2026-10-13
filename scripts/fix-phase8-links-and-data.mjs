import fs from 'fs';

// 1. Clean up lib/data/blogs-database.ts
let blogsTxt = fs.readFileSync('lib/data/blogs-database.ts', 'utf8');

const blogReplacements = [
  ['/products/fox-nuts-makhana', '/products/makhana-fox-nuts'],
  ['"featuredProductSlug": "fox-nuts-makhana"', '"featuredProductSlug": "makhana-fox-nuts"'],
  ['/products/barley-grass-powder', '/products/moringa-leaf-powder'],
  ['"featuredProductSlug": "barley-grass-powder"', '"featuredProductSlug": "moringa-leaf-powder"'],
  ['"featuredProductName": "Barley Grass Powder"', '"featuredProductName": "Moringa Leaf Powder"'],
  ['"featuredProductPrice": 690', '"featuredProductPrice": 690'],
  ['/products/sunflower-seeds', '/products/pumpkin-seeds'],
  ['/products/dried-apricots', '/products/dry-figs-anjeer'],
  ['/products/golden-raisins-kismis', '/products/dates-powder'],
  ['/products/dried-dates-khajoor', '/products/dates-powder'],
  ['/products/dried-dates', '/products/dates-powder'],
  ['/products/pure-natural-yellow-mustard-oil', '/products/virgin-coconut-oil-500ml'],
  ['/products?category=dried-fruits', '/category/dried-fruits'],
  ['/products?category=powders', '/category/powders'],
  ['/products?category=nuts', '/category/nuts'],
  ['/products?category=seeds', '/category/seeds'],
  ['/products?category=oils', '/category/oils'],
  ['/products?category=salts-spices', '/category/salts-spices'],
];

for (const [from, to] of blogReplacements) {
  blogsTxt = blogsTxt.split(from).join(to);
}

// Also add the 8 category-hub legacy blog slugs to BLOG_REDIRECT_MAP if not present
const extraBlogRedirects = `  "dehydrated-fruits-vs-fresh-nutrition-guide-nepal": "/blog/freeze-dried-vs-dehydrated-fruits-nutrition-comparison",
  "best-dry-fruits-in-nepal-price-quality-buying-guide": "/blog/dry-fruits-price-in-nepal-2026-wholesale-retail-guide",
  "6-month-baby-food-chart-nepal": "/blog/baby-food-nepal-6-months-chart-weaning-guide",
  "how-to-make-healthy-lito-at-home-nepal": "/blog/banana-powder-in-nepal-baby-food-smoothies-baking-guide",
  "moringa-powder-benefits-price-nepal": "/blog/moringa-powder-benefits-nepal-how-to-use-daily",
  "chia-seeds-benefits-price-how-to-eat-nepal": "/blog/chia-seeds-price-in-nepal-benefits-weight-loss-guide",
  "virgin-coconut-oil-benefits-baby-massage-cooking-nepal": "/blog/cold-pressed-virgin-coconut-oil-and-mustard-oil-guide-nepal",
  "shilajit-price-in-nepal-purity-test-benefits-guide": "/blog/how-to-test-pure-himalayan-shilajit-resin-at-home-nepal",
`;

if (!blogsTxt.includes('"6-month-baby-food-chart-nepal"')) {
  blogsTxt = blogsTxt.replace(
    'export const BLOG_REDIRECT_MAP: Record<string, string> = {',
    `export const BLOG_REDIRECT_MAP: Record<string, string> = {\n${extraBlogRedirects}`
  );
}

fs.writeFileSync('lib/data/blogs-database.ts', blogsTxt, 'utf8');
console.log('✅ Updated lib/data/blogs-database.ts');

// 2. Clean up lib/data/recipes.ts
let recipesTxt = fs.readFileSync('lib/data/recipes.ts', 'utf8');
const recipeReplacements = [
  ['"fox-nuts-makhana"', '"makhana-fox-nuts"'],
  ['"sunflower-seeds"', '"pumpkin-seeds"'],
  ['"golden-raisins-kismis"', '"dates-powder"'],
  ['"dried-dates-khajoor"', '"dates-powder"'],
  ['"dried-dates"', '"dates-powder"'],
  ['"barley-grass-powder"', '"moringa-leaf-powder"'],
  ['"pure-natural-yellow-mustard-oil"', '"virgin-coconut-oil-500ml"'],
  ['Dried Blueberries (Rs. 650 / 150 GM)', 'Dried Blueberries (Rs. 650 / 100 GM)'],
];
for (const [from, to] of recipeReplacements) {
  recipesTxt = recipesTxt.split(from).join(to);
}

if (!recipesTxt.includes('"6-month-baby-sweet-potato-porridge-nepal"')) {
  recipesTxt = recipesTxt.replace(
    'export const RECIPE_REDIRECT_MAP: Record<string, string> = {',
    `export const RECIPE_REDIRECT_MAP: Record<string, string> = {\n  "6-month-baby-sweet-potato-porridge-nepal": "/recipes/5-minute-sweet-potato-dates-baby-porridge-100g",`
  );
}

fs.writeFileSync('lib/data/recipes.ts', recipesTxt, 'utf8');
console.log('✅ Updated lib/data/recipes.ts');
