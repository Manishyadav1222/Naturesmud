import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'lib/data/products.ts');
const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');

const startMarker = 'export const products: Product[] = ';
const startIdx = raw.indexOf(startMarker);
const endIdx = raw.indexOf('export function getProductBySlug');

const prefix = raw.slice(0, startIdx + startMarker.length);
const suffix = raw.slice(endIdx);
const jsonStr = raw.slice(startIdx + startMarker.length, endIdx).trim().replace(/;$/, '');

const products = JSON.parse(jsonStr);

const LIFESTYLE_BY_SLUG = {
  'freeze-dried-avocado-powder': [
    '/images/lifestyle/avocado-powder-holding-jar.jpg',
  ],
  'strawberry-powder': [
    '/images/lifestyle/strawberry-powder-holding-jar.jpg',
  ],
  'dates-powder': [
    '/images/lifestyle/dates-powder-holding-jar-1.jpg',
    '/images/lifestyle/dates-powder-holding-jar-2.jpg',
    '/images/lifestyle/dates-powder-healthy-sweetness.jpg',
    '/images/lifestyle/dates-powder-goodbye-sugar.jpg',
    '/images/lifestyle/dates-powder-store-shelf.jpg',
    '/images/lifestyle/dates-powder-social-ad.jpg',
    '/images/lifestyle/dates-powder-purple-bicycle.jpg',
    '/images/lifestyle/naturesmud-refreshing-trio-jars.jpg',
  ],
  'beetroot-powder': [
    '/images/lifestyle/beetroot-powder-ad.jpg',
    '/images/lifestyle/beetroot-powder-pink-bicycle.jpg',
    '/images/lifestyle/naturesmud-refreshing-trio-jars.jpg',
  ],
  'dried-blueberries': [
    '/images/lifestyle/dried-blueberries-holding-jar-1.jpg',
    '/images/lifestyle/dried-blueberries-holding-jar-2.jpg',
    '/images/lifestyle/naturesmud-refreshing-trio-jars.jpg',
  ],
  'dried-cranberries': [
    '/images/lifestyle/dried-cranberries-holding-jar-1.jpg',
    '/images/lifestyle/dried-cranberries-holding-jar-2.jpg',
  ],
  'premium-cashewnuts': [
    '/images/lifestyle/cashews-holding-jar-1.jpg',
    '/images/lifestyle/cashews-holding-jar-2.jpg',
    '/images/lifestyle/cashews-floating-ad.jpg',
    '/images/lifestyle/cashews-holding-jar-3.jpg',
  ],
  'roasted-cashewnuts': [
    '/images/lifestyle/cashews-holding-jar-4.jpg',
    '/images/lifestyle/cashews-holding-jar-5.jpg',
    '/images/lifestyle/cashews-floating-ad.jpg',
    '/images/lifestyle/cashews-holding-jar-1.jpg',
    '/images/lifestyle/cashews-holding-jar-2.jpg',
  ],
  'premium-pistachio-roasted-salted': [
    '/images/lifestyle/pistachios-holding-jar-1.jpg',
    '/images/lifestyle/pistachios-holding-jar-2.jpg',
  ],
  'pumpkin-seeds': [
    '/images/lifestyle/pumpkin-seeds-holding-jar-1.jpg',
    '/images/lifestyle/pumpkin-seeds-holding-jar-2.jpg',
    '/images/lifestyle/pumpkin-seeds-power-poster.jpg',
    '/images/lifestyle/pumpkin-seeds-holding-jar-3.jpg',
  ],
  'raw-himalayan-almonds': [
    '/images/lifestyle/raw-almonds-holding-jar.jpg',
  ],
  'roasted-almonds': [
    '/images/lifestyle/raw-almonds-holding-jar.jpg',
  ],
};

let updatedCount = 0;
for (const p of products) {
  const extras = LIFESTYLE_BY_SLUG[p.slug];
  if (!extras) continue;
  const existing = Array.isArray(p.images) ? p.images : [p.image].filter(Boolean);
  const merged = [...existing];
  for (const img of extras) {
    if (!merged.includes(img)) {
      merged.push(img);
    }
  }
  p.images = merged;
  updatedCount++;
  console.log(`Updated ${p.slug}: ${merged.length} selectable images`);
}

const nextContent = `${prefix}${JSON.stringify(products, null, 2)};\n\n${suffix}`;
fs.writeFileSync(PRODUCTS_FILE, nextContent, 'utf8');
console.log(`✅ Attached lifestyle selectable images to ${updatedCount} products in lib/data/products.ts!`);
