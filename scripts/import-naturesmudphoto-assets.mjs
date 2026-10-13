import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:/Users/manish yadav/Desktop/NEW-NATUREMUD/Naturesmudphoto';
const DEST_VIDEOS_DIR = path.join(process.cwd(), 'public/videos');
const DEST_IMAGES_DIR = path.join(process.cwd(), 'public/images/lifestyle');

if (!fs.existsSync(DEST_VIDEOS_DIR)) fs.mkdirSync(DEST_VIDEOS_DIR, { recursive: true });
if (!fs.existsSync(DEST_IMAGES_DIR)) fs.mkdirSync(DEST_IMAGES_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR);

// Map substring patterns in source filenames to clean destination filenames
const VIDEO_MAPPINGS = [
  { match: 'Boy_making_avocado_powder_jar', dest: 'avocado-powder-reel.mp4' },
  { match: 'Creating_NaturesMud_strawberry', dest: 'strawberry-powder-reel.mp4' },
  { match: 'Toddler_making_strawberry_powder', dest: 'strawberry-powder-craft.mp4' },
  { match: 'NaturesMud_dried_cranberries_pro', dest: 'dried-cranberries-pro.mp4' },
  { match: 'Woman_adds_cranberries_to_yogurt', dest: 'cranberries-yogurt-reel.mp4' },
  { match: 'Toddler_harvesting_blueberries', dest: 'blueberries-harvest-reel.mp4' },
  { match: 'Woman_eating_blueberries_in_kitchen', dest: 'blueberries-kitchen-reel.mp4' },
  { match: 'Toddler_farming_makhana', dest: 'makhana-fox-nuts-reel.mp4' },
  { match: 'Roasted_cashews_promotional_video', dest: 'roasted-cashews-reel.mp4' },
  { match: 'Creating_promotional_video_for_c', dest: 'cashews-crunch-reel.mp4' },
  { match: 'Generating_beetroot_powder_promo', dest: 'beetroot-powder-promo.mp4' },
  { match: 'Generating_promotional_video_fro', dest: 'banana-sweet-potato-cranberry-reel.mp4' },
  { match: 'Producing_promotional_video_sequ', dest: 'moringa-pumpkin-banana-reel.mp4' },
  { match: 'I did NOT expect this flavor combo', dest: 'mango-papaya-banana-smoothie.mp4' },
  { match: '0723(29).mp4', dest: 'dehydrated-apple-reel.mp4' },
];

const IMAGE_MAPPINGS = [
  { match: 'Beetroot_powder_advertisement_2K_20260916075107', dest: 'beetroot-powder-ad.jpg' },
  { match: 'Riding_pink_bicycle_with_beetroot_2K_20260916073431', dest: 'beetroot-powder-pink-bicycle.jpg' },
  { match: 'Cashew_advertisement_with_floati', dest: 'cashews-floating-ad.jpg' },
  { match: 'Dates_powder_on_store_shelf_2K_20260916073111', dest: 'dates-powder-store-shelf.jpg' },
  { match: 'Dates_powder_social_media_advert', dest: 'dates-powder-social-ad.jpg' },
  { match: 'Hands_holding_product_jars_2K_20260916075125', dest: 'naturesmud-refreshing-trio-jars.jpg' },
  { match: 'Jar_of_powder_rescuing_milk_2K_20260916073632', dest: 'dates-powder-goodbye-sugar.jpg' },
  { match: 'Person_holding_avocado_powder_jar_2K_20261004112604', dest: 'avocado-powder-holding-jar.jpg' },
  { match: 'Person_holding_dates_powder_jar_2K_20261001172624', dest: 'dates-powder-holding-jar-1.jpg' },
  { match: 'Person_holding_dates_powder_jar_2K_20261001173052', dest: 'dates-powder-holding-jar-2.jpg' },
  { match: 'Person_holding_dried_blueberries', dest: 'dried-blueberries-holding-jar-1.jpg' },
  { match: 'Person_holding_jar_of_blueberries_2K_20261001173027', dest: 'dried-blueberries-holding-jar-2.jpg' },
  { match: '20261001172551', dest: 'dried-cranberries-holding-jar-1.jpg' },
  { match: '20261001173012', dest: 'dried-cranberries-holding-jar-2.jpg' },
  { match: 'Person_holding_jar_of_cashews_2K_20261001172613', dest: 'cashews-holding-jar-1.jpg' },
  { match: 'Person_holding_jar_of_cashews_2K_20261001172632', dest: 'cashews-holding-jar-2.jpg' },
  { match: 'Person_holding_jar_of_cashews_2K_20261001173022', dest: 'cashews-holding-jar-3.jpg' },
  { match: 'Person_holding_jar_of_cashews_2K_20261001173034', dest: 'cashews-holding-jar-4.jpg' },
  { match: 'Person_holding_jar_of_cashews_2K_20261004112627', dest: 'cashews-holding-jar-5.jpg' },
  { match: 'Person_holding_jar_of_pistachios_2K_20261001172607', dest: 'pistachios-holding-jar-1.jpg' },
  { match: 'Person_holding_jar_of_pistachios_2K_20261001173040', dest: 'pistachios-holding-jar-2.jpg' },
  { match: 'Person_holding_jar_of_powder_2K_20261004112529', dest: 'dates-powder-healthy-sweetness.jpg' },
  { match: 'Person_holding_jar_of_seeds_2K_20261001173017', dest: 'pumpkin-seeds-power-poster.jpg' },
  { match: 'Person_holding_jar_of_seeds_2K_20261001173037', dest: 'pumpkin-seeds-holding-jar-3.jpg' },
  { match: 'Person_holding_pumpkin_seeds_jar_2K_20261001172618', dest: 'pumpkin-seeds-holding-jar-1.jpg' },
  { match: 'Person_holding_pumpkin_seeds_jar_2K_20261004112531', dest: 'pumpkin-seeds-holding-jar-2.jpg' },
  { match: 'Person_holding_raw_almonds_jar_2K_20261001173057', dest: 'raw-almonds-holding-jar.jpg' },
  { match: 'Person_holding_strawberry_powder', dest: 'strawberry-powder-holding-jar.jpg' },
  { match: 'Purple_bicycle_carrying_dates_po', dest: 'dates-powder-purple-bicycle.jpg' },
];

let copiedVideos = 0;
for (const vm of VIDEO_MAPPINGS) {
  const found = files.find((f) => f.includes(vm.match));
  if (!found) {
    console.error(`Missing video match: ${vm.match}`);
    continue;
  }
  const srcPath = path.join(SRC_DIR, found);
  const destPath = path.join(DEST_VIDEOS_DIR, vm.dest);
  fs.copyFileSync(srcPath, destPath);
  copiedVideos++;
  console.log(`Copied video: ${found} -> /videos/${vm.dest}`);
}

let copiedImages = 0;
for (const im of IMAGE_MAPPINGS) {
  const found = files.find((f) => f.includes(im.match));
  if (!found) {
    console.error(`Missing image match: ${im.match}`);
    continue;
  }
  const srcPath = path.join(SRC_DIR, found);
  const destPath = path.join(DEST_IMAGES_DIR, im.dest);
  fs.copyFileSync(srcPath, destPath);
  copiedImages++;
  console.log(`Copied image: ${found} -> /images/lifestyle/${im.dest}`);
}

console.log(`✅ Imported ${copiedVideos} videos and ${copiedImages} images into public/!`);
