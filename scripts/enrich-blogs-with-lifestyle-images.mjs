import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'lib', 'data', 'blogs-database.ts');
const src = fs.readFileSync(filePath, 'utf8');

const startMarker = 'export const masterBlogCatalog: ExtendedBlogPost[] = ';
const endMarker = ';\n\nexport const allBlogPosts';
const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate masterBlogCatalog boundaries');
  process.exit(1);
}

const prefix = src.slice(0, startIdx + startMarker.length);
const jsonStr = src.slice(startIdx + startMarker.length, endIdx);
const suffix = src.slice(endIdx);

const catalog = JSON.parse(jsonStr);

const inlineAdditionsBySlug = {
  'baby-food-nepal-6-months-chart-weaning-guide': {
    imageLine: '![NaturesMud Dates Powder — Healthy Sweetness for Baby Porridge & Weaning](/images/lifestyle/dates-powder-healthy-sweetness.jpg)',
  },
  'dates-powder-price-in-nepal-natural-sugar-substitute-guide': {
    imageLine: '![Say Goodbye to Refined Sugar with NaturesMud 100% Pure Dates Powder](/images/lifestyle/dates-powder-goodbye-sugar.jpg)',
  },
  'beetroot-powder-in-nepal-benefits-uses-price': {
    imageLine: '![NaturesMud Pure Dehydrated Beetroot Powder 100 GM Jar](/images/lifestyle/beetroot-powder-ad.jpg)',
  },
  'chia-seeds-price-in-nepal-benefits-weight-loss-guide': {
    imageLine: '![NaturesMud Raw Green Pumpkin Seeds & Super Seeds Power](/images/lifestyle/pumpkin-seeds-power-poster.jpg)',
  },
  'dry-fruits-price-in-nepal-2026-wholesale-retail-guide': {
    imageLine: '![NaturesMud Premium Whole Cashews, Almonds & Pistachios in Nepal](/images/lifestyle/cashews-floating-ad.jpg)',
  },
  'freeze-dried-vs-dehydrated-fruits-nutrition-comparison': {
    imageLine: '![NaturesMud Freeze-Dried Avocado Powder & Freeze-Dried Strawberry Powder 100 GM Jars](/images/lifestyle/avocado-powder-holding-jar.jpg)',
  },
  'best-trekking-snacks-nepal-ebc-annapurna-lightweight-trail-food': {
    imageLine: '![NaturesMud Whole Dried Blueberries & Cranberries for Trekking in Nepal](/images/lifestyle/dried-blueberries-holding-jar-1.jpg)',
  },
  'how-to-store-dry-fruits-nuts-and-powders-in-monsoon-nepal': {
    imageLine: '![NaturesMud Airtight Glass Jars — Refreshing Superfood Trio](/images/lifestyle/naturesmud-refreshing-trio-jars.jpg)',
  },
};

let updatedCount = 0;
for (const post of catalog) {
  const addition = inlineAdditionsBySlug[post.slug];
  if (addition && Array.isArray(post.content)) {
    if (!post.content.includes(addition.imageLine)) {
      const insertAt = Math.min(6, post.content.length - 1);
      post.content.splice(insertAt, 0, addition.imageLine);
      updatedCount++;
    }
  }
}

const updatedFile = prefix + JSON.stringify(catalog, null, 2) + suffix;
fs.writeFileSync(filePath, updatedFile, 'utf8');
console.log(`Updated ${updatedCount} blog posts with inline lifestyle images.`);
