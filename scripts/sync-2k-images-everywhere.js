const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'naturemud product imagge');
const rootDir = path.join(__dirname, '..');

if (!fs.existsSync(srcDir)) {
  console.error('Directory not found:', srcDir);
  process.exit(1);
}

const files = fs.readdirSync(srcDir);
console.log(`Found ${files.length} source 2K studio images in "${srcDir}".`);

// Helper to copy file
function copyFile(srcFilename, destRelPath) {
  const src = path.join(srcDir, srcFilename);
  const dest = path.join(rootDir, destRelPath);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  const stat = fs.statSync(dest);
  console.log(`  -> Copied to ${destRelPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

// Find source file matching pattern
function findSrc(pattern) {
  return files.find(f => f.toLowerCase().includes(pattern.toLowerCase()));
}

console.log('\n--- Syncing 2K Studio Images to Web and Mobile ---');

// 1. Mango
const mangoPouch = findSrc('Dehydrated_mango_pouch_photography');
const mangoPoster = findSrc('Naturesmud_dehydrated_mango_prod');
if (mangoPouch) {
  copyFile(mangoPouch, 'public/products/authentic-dehydrated-mango.jpg');
  copyFile(mangoPouch, 'public/products/dehydrated-mango.jpg');
  copyFile(mangoPouch, 'public/products/mango.jpg');
  copyFile(mangoPouch, 'mobile/assets/hero/authentic-dehydrated-mango.jpg');
}
if (mangoPoster) {
  copyFile(mangoPoster, 'public/products/dehydrated-mango-poster.jpg');
  copyFile(mangoPoster, 'public/images/posters/mango-poster-2k.jpg');
  copyFile(mangoPoster, 'public/images/hero/hero-mango.jpg');
}

// 2. Apple
const applePouch = findSrc('Dehydrated_apple_pouch_on_backgr');
const applePoster = findSrc('Dehydrated_apple_product_design');
if (applePouch) {
  copyFile(applePouch, 'public/products/authentic-dehydrated-apple.jpg');
  copyFile(applePouch, 'public/products/dehydrated-apple.jpg');
  copyFile(applePouch, 'public/products/apple.jpg');
  copyFile(applePouch, 'mobile/assets/hero/authentic-dehydrated-apple.jpg');
}
if (applePoster) {
  copyFile(applePoster, 'public/products/dehydrated-apple-poster.jpg');
  copyFile(applePoster, 'public/images/posters/apple-poster-2k.jpg');
  copyFile(applePoster, 'public/images/posters/mountain-apple-crisp.jpg');
}

// 3. Pineapple
const pineapplePouch = findSrc('Dehydrated_pineapple_pouch_on_ba');
const pineapplePoster = findSrc('Product_design_poster_for_pineapple');
if (pineapplePouch) {
  copyFile(pineapplePouch, 'public/products/authentic-dehydrated-pineapple.jpg');
  copyFile(pineapplePouch, 'public/products/dehydrated-pineapple.jpg');
  copyFile(pineapplePouch, 'public/products/dehydrated-pineapple-premium.jpg');
  copyFile(pineapplePouch, 'public/products/pineapple.jpg');
  copyFile(pineapplePouch, 'mobile/assets/hero/authentic-dehydrated-pineapple.jpg');
}
if (pineapplePoster) {
  copyFile(pineapplePoster, 'public/products/pineapple-poster-2k.jpg');
  copyFile(pineapplePoster, 'public/images/posters/pineapple-splendor.jpg');
  copyFile(pineapplePoster, 'public/images/posters/tropical-crunch.jpg');
  copyFile(pineapplePoster, 'public/images/hero/hero-pineapple-fun-in-sun.jpg');
  copyFile(pineapplePoster, 'public/images/hero/hero-pineapple-simply-natural.jpg');
  copyFile(pineapplePoster, 'mobile/assets/hero/hero-pineapple-fun-in-sun.jpg');
  copyFile(pineapplePoster, 'mobile/assets/hero/hero-pineapple-simply-natural.jpg');
}

// 4. Carrot Powder
const carrotJar = findSrc('Carrot_powder_jar_photography');
if (carrotJar) {
  copyFile(carrotJar, 'public/products/carrot-powder-100g.jpg');
  copyFile(carrotJar, 'public/products/carrot-powder.jpg');
  copyFile(carrotJar, 'public/products/carrot-powder-marble.jpg');
  copyFile(carrotJar, 'public/products/carrot-powder-poster.jpg');
  copyFile(carrotJar, 'mobile/assets/hero/carrot-powder-100g.jpg');
}

// 5. Dates Powder
const datesJar = findSrc('Dates_powder_jar_photography');
if (datesJar) {
  copyFile(datesJar, 'public/products/dates-powder-100g.jpg');
  copyFile(datesJar, 'public/products/dates-powder.jpg');
  copyFile(datesJar, 'public/products/dates-powder-jar-2k.jpg');
  copyFile(datesJar, 'public/products/dates-powder-product-shot.jpg');
  copyFile(datesJar, 'mobile/assets/hero/dates-powder-100g.jpg');
}

// 6. Sweet Potato Powder
const sweetPotatoJar = findSrc('Sweet_potato_powder_jar_photograph');
if (sweetPotatoJar) {
  copyFile(sweetPotatoJar, 'public/products/sweet-potato-powder-100g.jpg');
  copyFile(sweetPotatoJar, 'public/products/sweet-potato-powder.jpg');
  copyFile(sweetPotatoJar, 'public/products/sweet-potato-jar-display.jpg');
  copyFile(sweetPotatoJar, 'public/images/posters/sweet-vibes.jpg');
  copyFile(sweetPotatoJar, 'public/images/hero/hero-sweet-potato-pure-nature.jpg');
  copyFile(sweetPotatoJar, 'mobile/assets/hero/hero-sweet-potato-pure-nature.jpg');
  copyFile(sweetPotatoJar, 'mobile/assets/hero/sweet-potato-powder-100g.jpg');
}

// 7. Beetroot Powder
const beetrootJar = findSrc('Beetroot_powder_jar_photographed');
const beetrootPoster = findSrc('Beetroot_powder_product_advertis') || findSrc('Beetroot_powder_product');
if (beetrootJar) {
  copyFile(beetrootJar, 'public/products/beetroot-powder-100g.jpg');
  copyFile(beetrootJar, 'public/products/beetroot-powder.jpg');
  copyFile(beetrootJar, 'public/products/beetroot-glass-jar.jpg');
  copyFile(beetrootJar, 'mobile/assets/hero/beetroot-powder-100g.jpg');
}
if (beetrootPoster) {
  copyFile(beetrootPoster, 'public/products/beetroot-poster-2k.jpg');
  copyFile(beetrootPoster, 'public/images/hero/hero-beetroot-earths-ritual.jpg');
  copyFile(beetrootPoster, 'public/images/posters/beetroot-poster-2k.jpg');
  copyFile(beetrootPoster, 'public/images/posters/earth-ritual-beetroot.jpg');
  copyFile(beetrootPoster, 'mobile/assets/hero/hero-beetroot-earths-ritual.jpg');
}

// 8. Chia Seeds
const chiaJar = findSrc('Chia_seeds_jar_photography') || findSrc('Chia_seeds_jar_studio');
const chiaPoster = findSrc('Chia_seeds_product_advertisement') || findSrc('Naturesmud_chia_seeds_jar_displayed');
if (chiaJar) {
  copyFile(chiaJar, 'public/products/chia-seeds.jpg');
  copyFile(chiaJar, 'mobile/assets/hero/chia-seeds.jpg');
}
if (chiaPoster) {
  copyFile(chiaPoster, 'public/products/chia-power.jpg');
  copyFile(chiaPoster, 'public/images/posters/chia-power.jpg');
  copyFile(chiaPoster, 'public/images/hero/hero-chia-power.jpg');
}

// 9. Blueberries
const blueJar = findSrc('Dried_blueberry_jar_photographed') || findSrc('Dried_blueberry_jar_on_purple');
const bluePhotoshoot = findSrc('Dried_blueberries_jar_photoshoot');
if (blueJar) {
  copyFile(blueJar, 'public/products/dried-blueberries-100g.jpg');
  copyFile(blueJar, 'public/products/dried-blueberries-orchard.jpg');
  copyFile(blueJar, 'public/products/blueberries.jpg');
  copyFile(blueJar, 'public/products/dried-blueberries.jpg');
  copyFile(blueJar, 'mobile/assets/hero/dried-blueberries-100g.jpg');
}
if (bluePhotoshoot) {
  copyFile(bluePhotoshoot, 'public/products/blueberries-brain-power.jpg');
  copyFile(bluePhotoshoot, 'public/products/blueberries-2.jpg');
  copyFile(bluePhotoshoot, 'public/images/posters/blueberries-orchard.jpg');
}

// 10. Cranberries
const cranberryJar = findSrc('Dried_cranberry_jar_on_background');
if (cranberryJar) {
  copyFile(cranberryJar, 'public/products/cranberries.jpg');
  copyFile(cranberryJar, 'public/products/cranberries-2.jpg');
  copyFile(cranberryJar, 'public/products/cranberries-glowing-jar.jpg');
  copyFile(cranberryJar, 'public/images/posters/ruby-cranberries-delight.jpg');
  copyFile(cranberryJar, 'mobile/assets/hero/cranberries.jpg');
}

// 11. Almonds
const almondJar = findSrc('Almond_jar_on_beige_background');
if (almondJar) {
  copyFile(almondJar, 'public/products/authentic-almonds.jpg');
  copyFile(almondJar, 'public/products/almonds-2.jpg');
  copyFile(almondJar, 'public/products/almonds.jpg');
  copyFile(almondJar, 'mobile/assets/hero/authentic-almonds.jpg');
}

// 12. Cashews
const cashewJar = findSrc('Jar_of_roasted_cashews');
if (cashewJar) {
  copyFile(cashewJar, 'public/products/authentic-cashewnuts-roasted.jpg');
  copyFile(cashewJar, 'public/products/cashewnuts-roasted.jpg');
  copyFile(cashewJar, 'public/products/cashews-roasted.jpg');
  copyFile(cashewJar, 'public/products/cashews.jpg');
  copyFile(cashewJar, 'public/images/posters/premium-harvest-cashew.jpg');
  copyFile(cashewJar, 'mobile/assets/hero/authentic-cashewnuts-roasted.jpg');
}

// 13. Himalayan Pink Salt
const pinkSaltJar = findSrc('Himalayan_pink_salt_jar_photography');
if (pinkSaltJar) {
  copyFile(pinkSaltJar, 'public/products/pink-salt.jpg');
  copyFile(pinkSaltJar, 'public/products/pink-salt-jar.jpg');
  copyFile(pinkSaltJar, 'public/products/pink-salt-crystals.jpg');
  copyFile(pinkSaltJar, 'mobile/assets/hero/pink-salt.jpg');
}

// 14. Papaya
const papayaFlatlay = findSrc('Papaya_product_flat_lay_photoshoot');
if (papayaFlatlay) {
  copyFile(papayaFlatlay, 'public/products/papaya.jpg');
  copyFile(papayaFlatlay, 'public/products/papaya-2.jpg');
  copyFile(papayaFlatlay, 'public/products/papaya-splash.jpg');
  copyFile(papayaFlatlay, 'public/images/posters/papaya-pop.jpg');
  copyFile(papayaFlatlay, 'public/images/posters/papaya-splash-delight.jpg');
  copyFile(papayaFlatlay, 'mobile/assets/hero/papaya.jpg');
}

// 15. Shilajit
const shilajitJar = findSrc('Shilajit_resin_jar_photography');
if (shilajitJar) {
  copyFile(shilajitJar, 'public/products/shilajit.jpg');
  copyFile(shilajitJar, 'mobile/assets/hero/shilajit.jpg');
}

// 16. Fox Nuts
const foxNutsJar = findSrc('Fox_nuts_jar_on_background');
if (foxNutsJar) {
  copyFile(foxNutsJar, 'public/products/fox-nuts-jar-2k.jpg');
}

// 17. High-Res Pumpkin Seeds Poster
const pumpkin2k = path.join(rootDir, 'public/images/posters/naturesmud_pumpkin_seeds_product__2k_202607241011.jpeg');
if (fs.existsSync(pumpkin2k)) {
  fs.copyFileSync(pumpkin2k, path.join(rootDir, 'public/images/posters/pure-pumpkin-seeds.jpg'));
  console.log('  -> Copied 2K Pumpkin Seeds poster to pure-pumpkin-seeds.jpg');
}

console.log('\n✅ All 2K clean studio images have been synced across web and mobile assets!');
