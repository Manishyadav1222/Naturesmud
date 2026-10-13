const fs = require('fs');

console.log('--- EXCEL INVENTORY SHEET RECONCILIATION ---');

// Official Excel Data from Krisha Agriline Pvt. Ltd. (Sitapaila, Kathmandu)
const excelItems = [
  { sNo: 1,  code: 'DF1-MG',  name: 'Dehydra - Mango',           price: 595,  weight: '100 GM' },
  { sNo: 2,  code: 'DF2-PNA', name: 'Dehydra - Pineapple',       price: 590,  weight: '100 GM' },
  { sNo: 3,  code: 'DF3-APP', name: 'Dehydra - Apple',           price: 510,  weight: '100 GM' },
  { sNo: 4,  code: 'DF4-CCH', name: 'Dehydra - Coco Chips',      price: 475,  weight: '100 GM' },
  { sNo: 5,  code: 'DF5-PAP', name: 'Dehydra - Papaya',          price: 450,  weight: '80 GM' },
  { sNo: 6,  code: 'DR1-BLB', name: 'Dried - Blueberries',       price: 650,  weight: '100 GM' },
  { sNo: 7,  code: 'DR2-CRB', name: 'Dried - Cranberry',         price: 415,  weight: '100 GM' },
  { sNo: 8,  code: 'PW1-DAT', name: 'Powder - Dates',            price: 400,  weight: '100 GM' },
  { sNo: 9,  code: 'PW2-BTT', name: 'Powder - Beetroot',         price: 430,  weight: '100 GM' },
  { sNo: 10, code: 'PW3-CRT', name: 'Powder - Carrot',           price: 490,  weight: '80 GM' },
  { sNo: 11, code: 'PW4-SPT', name: 'Powder - Sweet Potato',     price: 510,  weight: '100 GM' },
  { sNo: 12, code: 'PW5-MRG', name: 'Powder - Moringya',         price: 690,  weight: '200 GM' }, // Notice: 200 GM!
  { sNo: 13, code: 'PW6-STW', name: 'Powder - Strawberry',       price: 1395, weight: '80 GM' },
  { sNo: 14, code: 'PW7-AVC', name: 'Powder - Avacado',          price: 790,  weight: '80 GM' },
  { sNo: 15, code: 'PW8-BNA', name: 'Powder - Banana',           price: 650,  weight: '100 GM' },
  { sNo: 16, code: 'PW9-AML', name: 'Powder - Amla',             price: 495,  weight: '100 GM' },
  { sNo: 17, code: 'SL1-PNK', name: 'Pink Salt',                 price: 250,  weight: '200 GM' },
  { sNo: 18, code: 'SL2-BLK', name: 'Black Salt',                price: 220,  weight: '200 GM' },
  { sNo: 19, code: 'NM1-CHS', name: 'Chia Seeds',                price: 495,  weight: '300 GM' },
  { sNo: 20, code: 'NM2-PMS', name: 'Pumpkin Seeds',             price: 650,  weight: '300 GM' },
  { sNo: 21, code: 'NM3-CSW', name: 'Cashew (Raw Jumbo)',        price: 750,  weight: '150 GM' }, // Notice: 150 GM!
  { sNo: 22, code: 'NM4-AMD', name: 'Almond (Raw)',              price: 750,  weight: '200 GM' },
  { sNo: 23, code: 'NM5-FIG', name: 'Fig',                       price: 690,  weight: '200 GM' }, // Notice: Rs 690!
  { sNo: 24, code: 'NM6-MCD', name: 'Macademia Nuts',            price: null, weight: '200 GM' },
  { sNo: 25, code: 'NM7-WNT', name: 'Walnuts',                   price: 490,  weight: '100 GM' },
  { sNo: 26, code: 'NM8-MKN', name: 'Makhana',                   price: 390,  weight: '50 GM' },
  { sNo: 27, code: 'NM8-RSN', name: 'Raisins',                   price: null, weight: null },
  { sNo: 28, code: 'NM9-SNF', name: 'Sun Flower Seeds',          price: null, weight: null },
  { sNo: 29, code: 'RT1-CSW', name: 'Roasted - Cashew',          price: 750,  weight: '200 GM' }, // Notice: Roasted Cashew is 200 GM!
  { sNo: 30, code: 'RT2-AMD', name: 'Roasted - Almond',          price: 750,  weight: '200 GM' },
  { sNo: 31, code: 'RT3-PST', name: 'Roasted - Pista',           price: 895,  weight: '200 GM' }, // Notice: Rs 895!!
  { sNo: 32, code: 'OL1-CNT', name: 'Oil - Coconut (180 ML)',    price: 650,  weight: '180 ML' },
  { sNo: 33, code: 'OL2-CNT', name: 'Oil - Coconut (500 ML)',    price: 1750, weight: '500 ML' },
  { sNo: 34, code: 'MX1-NUT', name: 'Mix Dry Nuts',              price: 690,  weight: '200 GM' },
];

console.log('Total items in Excel sheet:', excelItems.length);
console.log(JSON.stringify(excelItems, null, 2));
