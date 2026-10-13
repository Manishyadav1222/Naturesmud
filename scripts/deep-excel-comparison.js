const fs = require('fs');

// Official Excel Data from Krisha Agriline Pvt. Ltd. (Sitapaila, Kathmandu)
const excelItems = [
  { sNo: 1,  code: 'DF1-MG',  name: 'Dehydra - Mango',           price: 595,  weight: '100 GM', slug: 'dehydrated-mango' },
  { sNo: 2,  code: 'DF2-PNA', name: 'Dehydra - Pineapple',       price: 590,  weight: '100 GM', slug: 'dehydrated-pineapple' },
  { sNo: 3,  code: 'DF3-APP', name: 'Dehydra - Apple',           price: 510,  weight: '100 GM', slug: 'dehydrated-apple' },
  { sNo: 4,  code: 'DF4-CCH', name: 'Dehydra - Coco Chips',      price: 475,  weight: '100 GM', slug: 'dehydrated-coconut-chips' },
  { sNo: 5,  code: 'DF5-PAP', name: 'Dehydra - Papaya',          price: 450,  weight: '80 GM',  slug: 'dehydrated-papaya' },
  { sNo: 6,  code: 'DR1-BLB', name: 'Dried - Blueberries',       price: 650,  weight: '100 GM', slug: 'dried-blueberries' },
  { sNo: 7,  code: 'DR2-CRB', name: 'Dried - Cranberry',         price: 415,  weight: '100 GM', slug: 'dried-cranberries' },
  { sNo: 8,  code: 'PW1-DAT', name: 'Powder - Dates',            price: 400,  weight: '100 GM', slug: 'dates-powder' },
  { sNo: 9,  code: 'PW2-BTT', name: 'Powder - Beetroot',         price: 430,  weight: '100 GM', slug: 'beetroot-powder' },
  { sNo: 10, code: 'PW3-CRT', name: 'Powder - Carrot',           price: 490,  weight: '80 GM',  slug: 'carrot-powder' },
  { sNo: 11, code: 'PW4-SPT', name: 'Powder - Sweet Potato',     price: 510,  weight: '100 GM', slug: 'sweet-potato-powder' },
  { sNo: 12, code: 'PW5-MRG', name: 'Powder - Moringya',         price: 690,  weight: '200 GM', slug: 'moringa-leaf-powder' },
  { sNo: 13, code: 'PW6-STW', name: 'Powder - Strawberry',       price: 1395, weight: '80 GM',  slug: 'strawberry-powder' },
  { sNo: 14, code: 'PW7-AVC', name: 'Powder - Avacado',          price: 790,  weight: '80 GM',  slug: 'freeze-dried-avocado-powder' },
  { sNo: 15, code: 'PW8-BNA', name: 'Powder - Banana',           price: 650,  weight: '100 GM', slug: 'banana-powder' },
  { sNo: 16, code: 'PW9-AML', name: 'Powder - Amla',             price: 495,  weight: '100 GM', slug: 'amla-powder' },
  { sNo: 17, code: 'SL1-PNK', name: 'Pink Salt',                 price: 250,  weight: '200 GM', slug: 'himalayan-pink-salt' },
  { sNo: 18, code: 'SL2-BLK', name: 'Black Salt',                price: 220,  weight: '200 GM', slug: 'pure-himalayan-black-salt-bire-noon' },
  { sNo: 19, code: 'NM1-CHS', name: 'Chia Seeds',                price: 495,  weight: '300 GM', slug: 'chia-seeds' },
  { sNo: 20, code: 'NM2-PMS', name: 'Pumpkin Seeds',             price: 650,  weight: '300 GM', slug: 'pumpkin-seeds' },
  { sNo: 21, code: 'NM3-CSW', name: 'Cashew (Raw)',              price: 750,  weight: '150 GM', slug: 'premium-cashewnuts' },
  { sNo: 22, code: 'NM4-AMD', name: 'Almond (Raw)',              price: 750,  weight: '200 GM', slug: 'raw-himalayan-almonds' },
  { sNo: 23, code: 'NM5-FIG', name: 'Fig',                       price: 690,  weight: '200 GM', slug: 'dry-figs-anjeer' },
  { sNo: 24, code: 'NM6-MCD', name: 'Macademia Nuts',            price: null, weight: '200 GM', slug: 'macadamia-nuts' },
  { sNo: 25, code: 'NM7-WNT', name: 'Walnuts',                   price: 490,  weight: '100 GM', slug: 'walnuts' },
  { sNo: 26, code: 'NM8-MKN', name: 'Makhana',                   price: 390,  weight: '50 GM',  slug: 'makhana-fox-nuts' },
  { sNo: 27, code: 'NM8-RSN', name: 'Raisins',                   price: null, weight: null,     slug: 'raisins' },
  { sNo: 28, code: 'NM9-SNF', name: 'Sun Flower Seeds',          price: null, weight: null,     slug: 'sunflower-seeds' },
  { sNo: 29, code: 'RT1-CSW', name: 'Roasted - Cashew',          price: 750,  weight: '200 GM', slug: 'roasted-cashewnuts' },
  { sNo: 30, code: 'RT2-AMD', name: 'Roasted - Almond',          price: 750,  weight: '200 GM', slug: 'roasted-almonds' },
  { sNo: 31, code: 'RT3-PST', name: 'Roasted - Pista',           price: 895,  weight: '200 GM', slug: 'premium-pistachio-roasted-salted' },
  { sNo: 32, code: 'OL1-CNT', name: 'Oil - Coconut (180 ML)',    price: 650,  weight: '180 ML', slug: 'virgin-coconut-oil-180ml' },
  { sNo: 33, code: 'OL2-CNT', name: 'Oil - Coconut (500 ML)',    price: 1750, weight: '500 ML', slug: 'virgin-coconut-oil-500ml' },
  { sNo: 34, code: 'MX1-NUT', name: 'Mix Dry Nuts',              price: 690,  weight: '200 GM', slug: 'superfood-trail-mix' },
];

const prodText = fs.readFileSync('lib/data/products.ts', 'utf8');
const regex = /\{\s*"id":\s*"([^"]+)".*?"slug":\s*"([^"]+)".*?"name":\s*"([^"]+)".*?"price":\s*(\d+).*?"weight":\s*"([^"]+)"/gs;
const currentProds = {};
let m;
while ((m = regex.exec(prodText)) !== null) {
  currentProds[m[2]] = {
    id: m[1],
    slug: m[2],
    name: m[3],
    price: parseInt(m[4]),
    weight: m[5]
  };
}

console.log('========================================================================');
console.log('📊 DISCREPANCY ANALYSIS: EXCEL INVENTORY SHEET VS CURRENT CODEBASE');
console.log('========================================================================\n');

excelItems.forEach(item => {
  const current = currentProds[item.slug];
  if (!current) {
    console.log(`❌ NOT IN PRODUCTS.TS: [${item.code}] ${item.name} (Price: ${item.price}, Weight: ${item.weight})`);
  } else {
    const priceDiff = item.price !== null && current.price !== item.price;
    const weightDiff = item.weight !== null && current.weight !== item.weight;
    if (priceDiff || weightDiff) {
      console.log(`⚠️ MISMATCH: [${item.code}] ${item.name} (${item.slug})`);
      if (priceDiff) console.log(`   - Price: Current Rs. ${current.price}  -->  EXCEL: Rs. ${item.price}`);
      if (weightDiff) console.log(`   - Weight: Current ${current.weight}  -->  EXCEL: ${item.weight}`);
    } else {
      console.log(`✅ MATCH: [${item.code}] ${item.name} -> Rs. ${current.price} | ${current.weight}`);
    }
  }
});

