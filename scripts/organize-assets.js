const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'assetsphotovodeo');
const publicDir = path.join(__dirname, '..', 'public');

// Ensure destination directories exist
const dirs = [
  path.join(publicDir, 'products'),
  path.join(publicDir, 'images'),
  path.join(publicDir, 'images', 'combos'),
  path.join(publicDir, 'images', 'recipes'),
  path.join(publicDir, 'images', 'blog'),
  path.join(publicDir, 'images', 'posters'),
  path.join(publicDir, 'videos'),
];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const files = fs.readdirSync(srcDir);
console.log(`Found ${files.length} files in assetsphotovodeo`);

// Copy rules: source pattern (or exact name) -> destination relative to public/
const copyRules = [
  // Videos
  { match: (f) => f.toLowerCase().includes('chiya seed ad'), dest: 'videos/chia-seed-ad.mp4' },
  { match: (f) => f.toLowerCase().includes('beetroot-powder-natural-stamina-drink'), dest: 'videos/beetroot-stamina-drink.mp4' },
  { match: (f) => f.toLowerCase().includes('beetroot_powder_motion_graphics'), dest: 'videos/beetroot-motion-ad.mp4' },
  { match: (f) => f.toLowerCase().includes('cranberries_product_reveal_ad'), dest: 'videos/cranberries-product-reveal.mp4' },
  { match: (f) => f.toLowerCase().includes('chia_seeds_jar_outro'), dest: 'videos/chia-seeds-outro.mp4' },
  { match: (f) => f.toLowerCase().includes('sweet_potato_powder_v'), dest: 'videos/sweet-potato-powder-video.mp4' },
  { match: (f) => f.toLowerCase().includes('almonds_for_mental_edge'), dest: 'videos/almonds-mental-edge.mp4' },
  { match: (f) => f.toLowerCase().includes('snaptik_7666876833220103445'), dest: 'videos/snaptik-reel-1.mp4' },
  { match: (f) => f.toLowerCase().includes('snaptik_7671586831145946386'), dest: 'videos/snaptik-reel-2.mp4' },

  // Combos & Lineups
  { match: (f) => f.toLowerCase().includes('baby_food_powder_jars_displayed'), dest: 'images/combos/baby-food-trio.jpg' },
  { match: (f) => f.toLowerCase().includes('baby_superfood_product_lineup'), dest: 'images/combos/baby-superfood-lineup.jpg' },
  { match: (f) => f.toLowerCase().includes('energy_trio_product'), dest: 'images/combos/energy-trio.jpg' },
  { match: (f) => f.toLowerCase().includes('superfood_product_lineup_2k'), dest: 'images/combos/superfood-lineup.jpg' },
  { match: (f) => f.toLowerCase().includes('wellness_pack_adverti'), dest: 'images/combos/wellness-pack.jpg' },
  { match: (f) => f.toLowerCase().includes('immunity_combo_product'), dest: 'images/combos/immunity-combo.jpg' },
  { match: (f) => f.toLowerCase().includes('healthy_snack_and_powder_combo'), dest: 'images/combos/healthy-snack-powder-combo.jpg' },
  { match: (f) => f.toLowerCase().includes('product_advertisement_for_trio_jars'), dest: 'images/combos/trio-jars-banner.jpg' },
  { match: (f) => f.toLowerCase().includes('product_lineup_display_on_pedestal'), dest: 'images/combos/lineup-pedestal.jpg' },
  { match: (f) => f.toLowerCase().includes('product_lineup_on_wooden_surface'), dest: 'images/combos/lineup-wood.jpg' },
  { match: (f) => f.toLowerCase().includes('healthy_food_jars_on_pedestals'), dest: 'images/combos/jars-on-pedestals.jpg' },
  { match: (f) => f.toLowerCase().includes('organic_food_products_displayed'), dest: 'images/combos/organic-products-display.jpg' },
  { match: (f) => f.toLowerCase().includes('superfood_product_advertisement'), dest: 'images/combos/superfood-advertisement.jpg' },
  { match: (f) => f.toLowerCase().includes('poster_highlighting_organic_powders'), dest: 'images/combos/organic-powders-poster.jpg' },

  // Lifestyle & Posters
  { match: (f) => f.toLowerCase().includes('grandmother_gesturing_namaste'), dest: 'images/posters/grandmother-namaste-trust.jpg' },
  { match: (f) => f.toLowerCase().includes('mother_and_baby_product_poster'), dest: 'images/posters/mother-baby-poster.jpg' },
  { match: (f) => f.toLowerCase().includes('mother_cuddles_baby_in_room'), dest: 'images/posters/mother-baby-cuddle.jpg' },
  { match: (f) => f.toLowerCase().includes('farmer_holding_chia_seeds_jar'), dest: 'images/posters/farmer-holding-chia-seeds.jpg' },
  { match: (f) => f.toLowerCase().includes('hero-banner.jpeg'), dest: 'images/hero-banner.jpg' },

  // Product Specific Jars & Infographics
  // Beetroot
  { match: (f) => f.toLowerCase().includes('beetroot_powder_jar_advertisement_2k'), dest: 'products/beetroot-powder-ad.jpg' },
  { match: (f) => f.toLowerCase().includes('beetroot_powder_jar_vital_blood'), dest: 'products/beetroot-vital-blood.jpg' },
  { match: (f) => f.toLowerCase().includes('beetroot_powder_presentation_sli'), dest: 'products/beetroot-presentation-slide.jpg' },
  { match: (f) => f.toLowerCase().includes('beetroot_powder_product_advertis'), dest: 'products/beetroot-product-advertisement.jpg' },
  { match: (f) => f.toLowerCase().includes('beetroot_powder_social_media_post'), dest: 'products/beetroot-social-post.jpg' },
  { match: (f) => f.toLowerCase().includes('naturesmud_beetroot_powder_poster_2k'), dest: 'products/beetroot-poster-2k.jpg' },
  { match: (f) => f.toLowerCase().includes('glass_jar_of_beetroot_powder'), dest: 'products/beetroot-glass-jar.jpg' },
  { match: (f) => f.toLowerCase().includes('beetroot_smoothie_and_porridge_bowl'), dest: 'images/recipes/beetroot-smoothie-bowl.jpg' },

  // Sweet Potato
  { match: (f) => f.toLowerCase().includes('sweet_potato_powder_product_poster'), dest: 'products/sweet-potato-product-poster.jpg' },
  { match: (f) => f.toLowerCase().includes('sweet_potato_powder_creation_pro'), dest: 'products/sweet-potato-creation-process.jpg' },
  { match: (f) => f.toLowerCase().includes('sweet_potato_powder_jar_display'), dest: 'products/sweet-potato-jar-display.jpg' },
  { match: (f) => f.toLowerCase().includes('mixing_sweet_potato_powder'), dest: 'images/recipes/mixing-sweet-potato-powder.jpg' },
  { match: (f) => f.toLowerCase().includes('sweet_potato_powder_stirred_into'), dest: 'images/recipes/sweet-potato-stirred-smoothie.jpg' },

  // Carrot Powder
  { match: (f) => f.toLowerCase().includes('carrot_powder_benefits_poster'), dest: 'products/carrot-benefits-poster.jpg' },
  { match: (f) => f.toLowerCase().includes('carrot_powder_jar_and_eye'), dest: 'products/carrot-powder-eye-health.jpg' },
  { match: (f) => f.toLowerCase().includes('carrot_powder_jar_on_marble'), dest: 'products/carrot-powder-marble.jpg' },
  { match: (f) => f.toLowerCase().includes('baby_carrot_powder_social_post'), dest: 'images/recipes/baby-carrot-powder-social.jpg' },

  // Dates Powder
  { match: (f) => f.toLowerCase().includes('jar_of_dates_powder_2k'), dest: 'products/dates-powder-jar-2k.jpg' },
  { match: (f) => f.toLowerCase().includes('naturesmud_dates_powder_health'), dest: 'products/dates-powder-health-poster.jpg' },
  { match: (f) => f.toLowerCase().includes('naturesmud_dates_powder_product'), dest: 'products/dates-powder-product-shot.jpg' },

  // Himalayan Black & Pink Salts
  { match: (f) => f.toLowerCase().includes('himalayan_black_salt_digestive'), dest: 'products/himalayan-black-salt-digestive.jpg' },
  { match: (f) => f.toLowerCase().includes('naturesmud_himalayan_black_salt'), dest: 'products/black-salt.jpg' },
  { match: (f) => f.toLowerCase().includes('himalayan_pink_salt_health_poster'), dest: 'products/pink-salt-health-poster.jpg' },
  { match: (f) => f.toLowerCase().includes('himalayan_pink_salt_jar_moss'), dest: 'products/pink-salt-moss.jpg' },
  { match: (f) => f.toLowerCase().includes('pink_salt_crystals_with_sage'), dest: 'products/pink-salt-crystals.jpg' },

  // Coconut Oil
  { match: (f) => f.toLowerCase().includes('nature\'s_mud_coconut_oil_product'), dest: 'products/coconut-oil-product.jpg' },
  { match: (f) => f.toLowerCase().includes('nature\'s_mud_coconut_oil_infogra'), dest: 'products/coconut-oil-infographic.jpg' },
  { match: (f) => f.toLowerCase().includes('coconut_oil_dripping_elegantly'), dest: 'products/coconut-oil-dripping.jpg' },
  { match: (f) => f.toLowerCase().includes('white_bowl_coconut_oil_jasmine'), dest: 'images/recipes/coconut-oil-jasmine-bowl.jpg' },

  // Cranberries & Blueberries
  { match: (f) => f.toLowerCase().includes('cranberries_glass_jar_organic_seal'), dest: 'products/cranberries-organic-seal.jpg' },
  { match: (f) => f.toLowerCase().includes('cranberries_infographic_with_hea'), dest: 'products/cranberries-infographic.jpg' },
  { match: (f) => f.toLowerCase().includes('cranberries_prevent_urinary_infe'), dest: 'products/cranberries-prevent-uti.jpg' },
  { match: (f) => f.toLowerCase().includes('dried_cranberry_targeting_urinar'), dest: 'products/cranberries-uti-target.jpg' },
  { match: (f) => f.toLowerCase().includes('glass_jar_cranberries_glowing_text'), dest: 'products/cranberries-glowing-jar.jpg' },
  { match: (f) => f.toLowerCase().includes('dried_blueberries_brain_power_be'), dest: 'products/blueberries-brain-power.jpg' },
  { match: (f) => f.toLowerCase().includes('jars_of_blueberries_and_beetroot'), dest: 'products/blueberries-and-beetroot.jpg' },
  { match: (f) => f.toLowerCase().includes('hand_sprinkling_cranberries_on_y'), dest: 'images/recipes/sprinkling-cranberries-yogurt.jpg' },
  { match: (f) => f.toLowerCase().includes('cranberries_and_yogurt_splash'), dest: 'images/recipes/cranberries-yogurt-splash.jpg' },

  // Pumpkin & Chia Seeds
  { match: (f) => f.toLowerCase().includes('naturesmud_pumpkin_seeds_product'), dest: 'products/pumpkin-seeds-product-shot.jpg' },
  { match: (f) => f.toLowerCase().includes('pumpkin_seeds_and_cranberries_po'), dest: 'products/pumpkin-seeds-and-cranberries.jpg' },
  { match: (f) => f.toLowerCase().includes('pumpkin_seeds_and_papaya_poster'), dest: 'products/pumpkin-seeds-and-papaya.jpg' },
  { match: (f) => f.toLowerCase().includes('pumpkin_seeds_immune_defense_poster'), dest: 'products/pumpkin-seeds-immune-defense.jpg' },

  // Oatmeal / Bowls / Recipes
  { match: (f) => f.toLowerCase().includes('oatmeal_bowl_for_daily_routine'), dest: 'images/recipes/oatmeal-bowl-daily-routine.jpg' },
  { match: (f) => f.toLowerCase().includes('stirring_powder_into_green_smoothie'), dest: 'images/recipes/green-smoothie-powder.jpg' },
];

let copiedCount = 0;
for (const rule of copyRules) {
  const matchedFile = files.find((f) => rule.match(f));
  if (matchedFile) {
    const srcPath = path.join(srcDir, matchedFile);
    const destPath = path.join(publicDir, rule.dest);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: "${matchedFile}" -> "${rule.dest}"`);
    copiedCount++;
  } else {
    console.warn(`No match found for rule: ${rule.dest}`);
  }
}

// Also copy any remaining generic images with clean names if helpful
files.forEach((f) => {
  if (f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')) {
    const sanitized = f.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const destPath = path.join(publicDir, 'images', 'posters', sanitized);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(path.join(srcDir, f), destPath);
    }
  }
});

console.log(`\nSuccessfully processed and organized ${copiedCount} key assets!`);
