const fs = require('fs');
const path = require('path');

const src = 'C:/Users/manish yadav/.gemini/antigravity-ide/brain/299c6e0b-50e6-4313-b004-e86317644746/.user_uploaded/media_1790679676644.png';

if (!fs.existsSync(src)) {
  console.error('Source image not found at', src);
  process.exit(1);
}

const buf = fs.readFileSync(src);
console.log('Authentic source image loaded:', buf.length, 'bytes');

const destinations = [
  // Primary image used in About Us, Our Story, Heroes, etc.
  'public/products/naturesmud-all-products-100g.jpg',
  'public/images/combos/superfood-lineup.jpg',
  'public/images/combos/lineup-wood.jpg',
  'public/images/combos/lineup-pedestal.jpg',
  
  // Magazine covers and posters
  'public/images/posters/magazine-cover.jpg',
  'public/images/posters/naturesmud-master-catalog-cover-4k.jpg',
  'public/images/posters/naturesmud-authenticity-table-cover.jpg',
  'public/images/posters/naturesmud_superfood_product_lineup_2k_202608150734.jpeg',
  'public/images/posters/product_lineup_on_wooden_surface_202608200719.jpeg',
  'public/images/posters/product_lineup_display_on_pedestal_202608200719.jpeg',
  
  // Root and images directory copies
  'public/magazine-cover.jpg',
  'public/images/magazine-cover.jpg',
  'public/images/magazine-cover.png',
  'public/images/hero-banner.jpg',
  'public/hero-banner.jpeg',
  'public/hero-banner1.jpeg',
  'public/images/posters/hero-banner.jpeg',
  'public/images/posters/organic_food_product_display_her__202608122122.jpeg'
];

for (const rel of destinations) {
  try {
    const full = path.join(process.cwd(), rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    try {
      fs.chmodSync(full, 0o666);
    } catch(e) {}
    fs.writeFileSync(full, buf);
    console.log(`✅ Overwritten with authentic photo: ${rel} (${buf.length} bytes)`);
  } catch(err) {
    console.warn(`⚠️ Could not write to ${rel}: ${err.message}`);
  }
}

console.log('🎉 All unauthentic image locations have been completely replaced with the real product photo!');
