import fs from 'fs';

// Load products.ts and product-seo-dossier.ts data
const productsRaw = fs.readFileSync('lib/data/products.ts', 'utf8');
const dossierRaw = fs.readFileSync('lib/data/product-seo-dossier.ts', 'utf8');

// Extract active products from products.ts
const productBlocks = productsRaw.split(/\n  \{\n/).slice(1);
const activeProducts = [];

for (const block of productBlocks) {
  const isActiveMatch = block.match(/"isActive":\s*(true|false)/);
  if (isActiveMatch && isActiveMatch[1] === 'false') continue;

  const slug = (block.match(/"slug":\s*"([^"]+)"/) || [])[1];
  const name = (block.match(/"official_label_name":\s*"([^"]+)"/) || block.match(/"name":\s*"([^"]+)"/) || [])[1];
  const price = Number((block.match(/"price":\s*(\d+)/) || [])[1]);
  const weight = (block.match(/"weight":\s*"([^"]+)"/) || [])[1];
  const categorySlug = (block.match(/"categorySlug":\s*"([^"]+)"/) || [])[1];
  const packing = (block.match(/"packing":\s*"([^"]+)"/) || [])[1] || 'Food-Grade Pack';

  if (slug && name && price && weight) {
    activeProducts.push({ slug, name, price, weight, categorySlug, packing });
  }
}

function calcUnitPrice(price, weight) {
  const m = weight.trim().match(/^(\d+(?:\.\d+)?)\s*(GM|G|ML|KG)$/i);
  if (!m) return `Rs. ${price}`;
  const amount = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit === 'GM' || unit === 'G') {
    if (amount <= 30) {
      const per1g = Math.round((price / amount) * 100) / 100;
      return `Rs. ${per1g} / 1g`;
    }
    const per100g = Math.round((price / amount) * 100 * 100) / 100;
    return `Rs. ${per100g} / 100g`;
  }
  if (unit === 'ML') {
    const per100ml = Math.round((price / amount) * 100 * 100) / 100;
    return `Rs. ${per100ml} / 100ml`;
  }
  return `Rs. ${price}`;
}

// Strategic keyword mapping metadata per SKU
const SKU_STRATEGY = {
  'sweet-potato-powder': {
    wave: 'Wave 1: Baby Weaning Cluster',
    priority: 'P1',
    primaryQuery: 'sweet potato powder price in nepal',
    secondaryQuery: 'buy sweet potato powder for baby in kathmandu',
    romanNepali: 'sakharkhanda powder / bacha ko lito powder',
    nepaliScript: 'सखरखण्ड पाउडर / बच्चाको लिटो',
    useCaseQuery: 'sweet potato powder for 6 month baby lito jaulo nepal',
    questionQueries: 'How to make sweet potato puree for 6 month baby in Nepal? | सखरखण्ड पाउडर बच्चाको लिटोमा कसरी मिसाउने?',
    competitors: 'Daraz generic sellers, imported baby cereal brands (Cerelac), local Instagram lito pages',
    compPrice: 'Rs. 450–750 per 100g–200g (often mixed grains or pouch)',
    weaknessAndEdge: 'Competitors sell multi-grain mixes with sugar/milk powder in plastic pouches; NaturesMud is 100% single-ingredient sweet potato in a 100 GM reusable glass jar at Rs. 510',
  },
  'dates-powder': {
    wave: 'Wave 1: Baby Weaning Cluster',
    priority: 'P1',
    primaryQuery: 'dates powder price in nepal',
    secondaryQuery: 'natural dates sweetener for baby food nepal',
    romanNepali: 'khajur powder / chini ko bikalpa',
    nepaliScript: 'खजुर पाउडर / प्राकृतिक गुलियो',
    useCaseQuery: 'dates powder for baby porridge lito kheer nepal',
    questionQueries: 'Can I give dates powder to a 6 month baby instead of sugar? | बच्चाको खानामा चिनीको सट्टा खजुर पाउडर कसरी प्रयोग गर्ने?',
    competitors: 'Daraz imported Indian brands (Slurrp Farm, Early Foods), Bhatbhateni dry fruit aisle',
    compPrice: 'Rs. 550–950 per 100g–150g (imported brands)',
    weaknessAndEdge: 'Imported Indian brands cost Rs. 650–950 and often clump in cardboard boxes; NaturesMud is freshly milled in Nepal in an airtight 100 GM glass jar at Rs. 400',
  },
  'banana-powder': {
    wave: 'Wave 1: Baby Weaning Cluster',
    priority: 'P1',
    primaryQuery: 'banana powder price in nepal',
    secondaryQuery: 'pure banana powder for babies kathmandu',
    romanNepali: 'kera powder / kacho kera ko powder',
    nepaliScript: 'केरा पाउडर',
    useCaseQuery: 'banana powder for baby weight & weaning porridge nepal',
    questionQueries: 'How to use banana powder for baby lito and smoothies? | केरा पाउडर बच्चाको लिटोमा कसरी पकाउने?',
    competitors: 'Daraz Kerala banana powder listings, local baby stores',
    compPrice: 'Rs. 550–850 per 100g–150g',
    weaknessAndEdge: 'Marketplace listings rarely disclose maltodextrin fillers or batch expiry; NaturesMud provides 100% pure Himalayan banana powder in a 100 GM glass jar at Rs. 590',
  },
  'carrot-powder': {
    wave: 'Wave 1: Baby Weaning Cluster',
    priority: 'P1',
    primaryQuery: 'carrot powder price in nepal',
    secondaryQuery: 'pure carrot powder for baby food & smoothies nepal',
    romanNepali: 'gajar powder',
    nepaliScript: 'गाजर पाउडर',
    useCaseQuery: 'carrot powder for baby jaulo soup & roti dough nepal',
    questionQueries: 'How to add carrot powder to baby jaulo and dal? | गाजर पाउडर बच्चाको जाउलोमा कसरी प्रयोग गर्ने?',
    competitors: 'Daraz cosmetic/herbal sellers, imported vegetable powders',
    compPrice: 'Rs. 450–700 per 100g',
    weaknessAndEdge: 'Many Daraz carrot powders are cosmetic-grade face pack powders; NaturesMud is 100% food-grade culinary Carrot Powder in a 100 GM glass jar at Rs. 490',
  },
  'freeze-dried-avocado-powder': {
    wave: 'Wave 1: Baby Weaning Cluster',
    priority: 'P1',
    primaryQuery: 'avocado powder price in nepal',
    secondaryQuery: 'freeze dried avocado powder kathmandu',
    romanNepali: 'avocado powder nepal',
    nepaliScript: 'एभोकाडो पाउडर (फ्रिज ड्राइ)',
    useCaseQuery: 'avocado powder for baby weaning & instant guacamole nepal',
    questionQueries: 'Where to buy pure avocado powder in Nepal? | एभोकाडो पाउडर कसरी प्रयोग गर्ने?',
    competitors: 'Fresh seasonal avocados in Bhatbhateni, imported keto powders',
    compPrice: 'Rs. 400–600/kg fresh (spoils in 2 days) or Rs. 1,200+ imported',
    weaknessAndEdge: 'Fresh avocados bruise and spoil rapidly; NaturesMud Freeze Dried Avocado Powder (80 GM Glass Jar at Rs. 790) offers shelf-stable healthy fats year-round',
  },
  'beetroot-powder': {
    wave: 'Wave 2: High-Demand Superfood Powders',
    priority: 'P1',
    primaryQuery: 'beetroot powder price in nepal',
    secondaryQuery: 'buy pure beetroot powder online kathmandu',
    romanNepali: 'chukandar powder',
    nepaliScript: 'चुकन्दर पाउडर',
    useCaseQuery: 'beetroot powder for pre workout stamina & smoothies nepal',
    questionQueries: 'What is the price of 100g Beetroot Powder in Nepal? | चुकन्दर पाउडर कसरी खाने?',
    competitors: 'Daraz herbal sellers, cosmetic beetroot powders, Indian imports',
    compPrice: 'Rs. 350–650 per 100g (often pouch or cosmetic grade)',
    weaknessAndEdge: 'Competitors mix cosmetic and food grade in thin plastic bags; NaturesMud is 100% culinary cold-dehydrated Beetroot Powder in a 100 GM glass jar at Rs. 430',
  },
  'moringa-leaf-powder': {
    wave: 'Wave 2: High-Demand Superfood Powders',
    priority: 'P1',
    primaryQuery: 'moringa powder price in nepal',
    secondaryQuery: 'buy organic moringa leaf powder kathmandu',
    romanNepali: 'sajiwan paat ko powder / sahijan powder / shitalchini',
    nepaliScript: 'सजिवन / सहिजन पातको पाउडर (शीतलचिनी / मोरिङ्गा)',
    useCaseQuery: 'moringa leaf powder for daily green nutrition & dal tarkari nepal',
    questionQueries: 'What is Moringa called in Nepali and how to take it daily? | सजिवन (मोरिङ्गा) पातको पाउडर कसरी खाने?',
    competitors: 'Daraz moringa sellers, local Ayurvedic shops, Patanjali',
    compPrice: 'Rs. 400–800 per 100g',
    weaknessAndEdge: 'Many cheap moringa powders grind woody stems turning the powder brownish; NaturesMud uses shade-dried green Sajiwan/Sahijan leaves in a 100 GM glass jar at Rs. 690',
  },
  'strawberry-powder': {
    wave: 'Wave 2: High-Demand Superfood Powders',
    priority: 'P1',
    primaryQuery: 'strawberry powder price in nepal',
    secondaryQuery: 'freeze dried strawberry powder kathmandu',
    romanNepali: 'strawberry powder nepal',
    nepaliScript: 'स्ट्रबेरी पाउडर (फ्रिज ड्राइ)',
    useCaseQuery: 'freeze dried strawberry powder for smoothies cake frosting & milk nepal',
    questionQueries: 'Is NaturesMud Strawberry Powder artificial flavor or real fruit? | फ्रिज ड्राइ स्ट्रबेरी पाउडर केमा प्रयोग गर्ने?',
    competitors: 'Supermarket artificial strawberry milk mixes, bakery flavor powders',
    compPrice: 'Rs. 300–600 (sugar + synthetic pink dye mixes) or Rs. 1,500+ imported freeze-dried',
    weaknessAndEdge: 'Supermarket strawberry powders are 85% sugar and Red-40 dye; NaturesMud is 100% real freeze-dried strawberries (80 GM Glass Jar at Rs. 1,395) with 0 sugar',
  },
  'dehydrated-mango': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried mango price in nepal',
    secondaryQuery: 'dehydrated mango slices no added sugar kathmandu',
    romanNepali: 'sukeko aamp / mango sukuti',
    nepaliScript: 'सुकेको आँप',
    useCaseQuery: 'unsweetened dried mango for kids tiffin & trekking nepal',
    questionQueries: 'Does NaturesMud Dehydrated Mango have added sugar? | सुकेको आँपमा चिनी मिसाइएको छ कि छैन?',
    competitors: 'Imported Thai candied mango in Bhatbhateni & Daraz',
    compPrice: 'Rs. 500–850 per 100g (candied with 30–40% refined sugar & E220 sulfur)',
    weaknessAndEdge: 'Imported Thai dried mango is boiled in sugar syrup and sulfites; NaturesMud Dehydrated Mango (100 GM at Rs. 595) has 0 added sugar and 0 sulfur',
  },
  'dehydrated-pineapple': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried pineapple price in nepal',
    secondaryQuery: 'dehydrated pineapple rings kathmandu',
    romanNepali: 'sukeko bhuikatahar',
    nepaliScript: 'सुकेको भुइँकटहर',
    useCaseQuery: 'dehydrated pineapple rings for snacking & detox water nepal',
    questionQueries: 'Are NaturesMud Dehydrated Pineapple rings sugar-coated? | सुकेको भुइँकटहर कसरी खाने?',
    competitors: 'Supermarket sugar-crusted pineapple cubes',
    compPrice: 'Rs. 450–700 per 100g',
    weaknessAndEdge: 'Supermarket pineapple is candied cores; NaturesMud Dehydrated Pineapple (100 GM at Rs. 495) is whole ripe rings with 0 added sugar',
  },
  'dehydrated-apple': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried apple rings price in nepal',
    secondaryQuery: 'jumla mustang dehydrated apple sukuti nepal',
    romanNepali: 'syau ko sukuti / sukeko syau',
    nepaliScript: 'स्याउको सुकुटी / सुकेको स्याउ',
    useCaseQuery: 'himalayan apple rings for school tiffin & oatmeal nepal',
    questionQueries: 'Where to buy unsulfured Jumla/Mustang dried apple rings in Kathmandu? | स्याउको सुकुटीको मूल्य कति पर्छ?',
    competitors: 'Loose open-air market apple sukuti, Daraz sellers',
    compPrice: 'Rs. 350–600 per 100g',
    weaknessAndEdge: 'Open-market apple sukuti is exposed to road dust and moisture; NaturesMud Dehydrated Apple (100 GM at Rs. 510) is hygienically dehydrated and sealed',
  },
  'dehydrated-coconut-chips': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'coconut chips price in nepal',
    secondaryQuery: 'toasted dehydrated coconut flakes kathmandu',
    romanNepali: 'sukeko nariwal chips',
    nepaliScript: 'सुकेको नरिवल चिप्स',
    useCaseQuery: 'crunchy coconut chips for smoothie bowls granola & keto snack nepal',
    questionQueries: 'Are NaturesMud Dehydrated Coconut Chips fried or baked in sugar? | नरिवल चिप्स केमा मिसाएर खाने?',
    competitors: 'Imported Thai/Malaysian sugared coconut chips',
    compPrice: 'Rs. 450–650 per 100g',
    weaknessAndEdge: 'Imported chips contain cane sugar and palm oil; NaturesMud Dehydrated Coconut Chips (100 GM at Rs. 475) is 100% pure coconut meat',
  },
  'dehydrated-papaya': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried papaya price in nepal',
    secondaryQuery: 'dehydrated papaya slices no sugar kathmandu',
    romanNepali: 'sukeko mewa',
    nepaliScript: 'सुकेको मेवा',
    useCaseQuery: 'natural dehydrated papaya spears after meal snack nepal',
    questionQueries: 'Is NaturesMud Dehydrated Papaya the same as tutti-frutti? | सुकेको मेवामा कृत्रिम रङ हुन्छ कि हुँदैन?',
    competitors: 'Artificially dyed red/green tutti-frutti cubes in bakeries',
    compPrice: 'Rs. 350–550 per 100g',
    weaknessAndEdge: 'Commercial dried papaya is boiled in sugar and synthetic dye; NaturesMud Dehydrated Papaya (90 GM at Rs. 395) is 100% pure ripe papaya',
  },
  'dehydrated-dragon-fruit': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried dragon fruit price in nepal',
    secondaryQuery: 'dehydrated red dragon fruit slices kathmandu',
    romanNepali: 'sukeko dragon fruit',
    nepaliScript: 'सुकेको ड्र्यागन फ्रुट',
    useCaseQuery: 'dehydrated dragon fruit slices for snacking & tea infusion nepal',
    questionQueries: 'Does Dehydrated Dragon Fruit have artificial pink color? | सुकेको ड्र्यागन फ्रुटको मूल्य कति हो?',
    competitors: 'Seasonal fresh dragon fruit, rare imported packs',
    compPrice: 'Rs. 600–900 per 100g',
    weaknessAndEdge: 'Available year-round with 100% natural ruby betalain color and crunchy seeds (100 GM at Rs. 690)',
  },
  'dried-blueberries': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried blueberries price in nepal',
    secondaryQuery: 'buy whole dried blueberries kathmandu',
    romanNepali: 'sukeko blueberry',
    nepaliScript: 'सुकेको ब्लुबेरी',
    useCaseQuery: 'dried blueberries for morning oats chia pudding & kids snack nepal',
    questionQueries: 'What is the price of 100g Dried Blueberries in Nepal? | ब्लुबेरी कसरी खाने?',
    competitors: 'Bhatbhateni imported boxes, Daraz dry fruit sellers',
    compPrice: 'Rs. 650–1,100 per 100g',
    weaknessAndEdge: 'Many supermarket packs are heavily oiled with high-fructose corn syrup; NaturesMud Dried Blueberries (100 GM at Rs. 650) offers clean whole berries',
  },
  'dried-cranberries': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'dried cranberries price in nepal',
    secondaryQuery: 'buy dried cranberries online kathmandu',
    romanNepali: 'sukeko cranberry',
    nepaliScript: 'सुकेको क्र्यानबेरी',
    useCaseQuery: 'dried cranberries for salads trail mix & baking nepal',
    questionQueries: 'What is the price of 100g Dried Cranberries in Nepal? | क्र्यानबेरी कसरी प्रयोग गर्ने?',
    competitors: 'Daraz dry fruit sellers, supermarket imported pouches',
    compPrice: 'Rs. 400–650 per 100g',
    weaknessAndEdge: 'Transparent 100 GM pack at Rs. 415 (Rs. 415/100g) with fast 24–48hr Kathmandu delivery',
  },
  'dry-figs-anjeer': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'anjeer price in nepal',
    secondaryQuery: 'buy dry figs anjeer 200g kathmandu',
    romanNepali: 'anjeer / sukeko anjeer',
    nepaliScript: 'अन्जीर (सुकेको अन्जीर)',
    useCaseQuery: 'soaked anjeer in warm milk & festive dry fruit gifting nepal',
    questionQueries: 'How many Dry Figs (Anjeer) should I soak overnight? | अन्जीर भिजाएर कसरी खाने र मूल्य कति पर्छ?',
    competitors: 'Asan/Indrachowk loose dry fruit shops, Daraz, Thulo',
    compPrice: 'Rs. 800–1,200 per 200g',
    weaknessAndEdge: 'Open bazaar rope-strung figs collect dust and sulfur bleach; NaturesMud Dry Figs / Anjeer (200 GM Glass Jar at Rs. 850 — Rs. 425/100g) is sealed in glass',
  },
  'dried-dates-khajoor': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'khajoor price in nepal',
    secondaryQuery: 'buy dried dates khajoor 200g kathmandu',
    romanNepali: 'khajur / chohara',
    nepaliScript: 'खजुर (छोकडा)',
    useCaseQuery: 'whole dried dates khajoor for pre workout milk & fasting nepal',
    questionQueries: 'What is the difference between Dried Dates (Khajoor) and Dates Powder? | खजुरको मूल्य नेपालमा कति पर्छ?',
    competitors: 'Local grocery loose plastic packets, Daraz sellers',
    compPrice: 'Rs. 400–600 per 200g',
    weaknessAndEdge: 'Loose packets often contain glucose glaze and dust; NaturesMud Dried Dates / Khajoor (200 GM Glass Jar at Rs. 450 — Rs. 225/100g) is clean and unglazed',
  },
  'raw-himalayan-almonds': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'almond price in nepal',
    secondaryQuery: 'buy raw almonds badam 200g kathmandu',
    romanNepali: 'kacho badam / bhijako badam',
    nepaliScript: 'काँचो बदाम',
    useCaseQuery: 'raw almonds for overnight soaking badam milk & Dashain Tihar gifting nepal',
    questionQueries: 'What is the price of 200g Raw Almonds in Nepal? | काँचो बदाम भिजाएर खाने कि भुटेको बदाम?',
    competitors: 'Daraz, Bhatbhateni, Asan wholesale dry fruit shops',
    compPrice: 'Rs. 650–900 per 200g (plastic pouch)',
    weaknessAndEdge: 'Pouch almonds go rancid in monsoon humidity; NaturesMud Raw Almonds (200 GM Glass Jar at Rs. 750 — Rs. 375/100g) stays crisp in airtight glass',
  },
  'roasted-almonds': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'roasted almonds price in nepal',
    secondaryQuery: 'oil free dry roasted almonds kathmandu',
    romanNepali: 'bhuteko badam',
    nepaliScript: 'भुटेको बदाम',
    useCaseQuery: 'dry roasted almonds for office snacking & chiya time nepal',
    questionQueries: 'Are NaturesMud Roasted Almonds fried in oil? | भुटेको बदामको मूल्य कति पर्छ?',
    competitors: 'Supermarket salted/fried snack nuts',
    compPrice: 'Rs. 700–950 per 200g',
    weaknessAndEdge: 'Commercial roasted nuts are deep-fried in palm oil; NaturesMud Roasted Almonds (200 GM Glass Jar at Rs. 750 — Rs. 375/100g) is 100% oil-free dry roasted',
  },
  'premium-cashewnuts': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'cashew nut price in nepal',
    secondaryQuery: 'buy whole kaju 200g online kathmandu',
    romanNepali: 'kaju / kacho kaju',
    nepaliScript: 'काजु',
    useCaseQuery: 'whole W240 cashew nuts for kheer sweets & Bhai Tika masala nepal',
    questionQueries: 'What is the price of 200g Premium Cashew Nuts (Kaju) in Nepal? | काजु २०० ग्रामको कति पर्छ?',
    competitors: 'Daraz, Bhatbhateni, local dry fruit shops',
    compPrice: 'Rs. 700–950 per 200g',
    weaknessAndEdge: 'Whole W240 kernels packed in a reusable 200 GM glass jar at Rs. 750 (Rs. 375/100g) with zero broken fragments',
  },
  'roasted-cashewnuts': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'roasted cashew price in nepal',
    secondaryQuery: 'dry roasted kaju 150g kathmandu',
    romanNepali: 'bhuteko kaju',
    nepaliScript: 'भुटेको काजु',
    useCaseQuery: 'oil free roasted cashew nuts for evening snacking & gifting nepal',
    questionQueries: 'Why is Roasted Cashew Nuts 150 GM while raw is 200 GM? | भुटेको काजु तेलमा तारेको हो कि होइन?',
    competitors: 'Packet fried salted cashews in supermarkets',
    compPrice: 'Rs. 650–850 per 150g',
    weaknessAndEdge: 'Slow dry-roasted with zero palm oil or MSG in a 150 GM glass jar at Rs. 750 (Rs. 500/100g)',
  },
  'premium-pistachio-roasted-salted': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'pistachio price in nepal',
    secondaryQuery: 'buy roasted salted pista 200g kathmandu',
    romanNepali: 'pista / bhuteko pista',
    nepaliScript: 'पिस्ता (भुटेको र नुनिलो)',
    useCaseQuery: 'roasted salted pistachios for festive Bhai Tika gifting & snacking nepal',
    questionQueries: 'What is the price of 200g Pistachio (Pista) in Nepal? | पिस्ता २०० ग्रामको मूल्य कति हो?',
    competitors: 'Daraz, Bhatbhateni, local dry fruit stores',
    compPrice: 'Rs. 1,150–1,500 per 200g',
    weaknessAndEdge: 'Naturally open-shell jumbo pistachios lightly seasoned with Himalayan Pink Salt in a 200 GM glass jar at Rs. 1,250 (Rs. 625/100g)',
  },
  'macadamia-nuts': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'macadamia nuts price in nepal',
    secondaryQuery: 'buy whole macadamia nuts kathmandu',
    romanNepali: 'macadamia nuts nepal',
    nepaliScript: 'म्याकाडामिया नट्स',
    useCaseQuery: 'gourmet macadamia nuts for keto diet & luxury gifting nepal',
    questionQueries: 'Where can I buy Macadamia Nuts in Kathmandu Nepal? | नेपालमा म्याकाडामिया नट्स कहाँ पाइन्छ?',
    competitors: 'Rare imported gourmet stores in Jhamsikhel/Bhatbhateni',
    compPrice: 'Rs. 1,200–1,800 per 200g',
    weaknessAndEdge: 'Hard-to-find creamy whole macadamia kernels protected from rancidity in a 200 GM glass jar at Rs. 1,100 (Rs. 550/100g)',
  },
  'superfood-trail-mix': {
    wave: 'Wave 3: Dehydrated Fruits, Nuts & Festival Gifting',
    priority: 'P2',
    primaryQuery: 'trail mix price in nepal',
    secondaryQuery: 'mixed dry fruits nuts and seeds 200g kathmandu',
    romanNepali: 'mix dry fruits र seeds',
    nepaliScript: 'सुपरफुड ट्रेल मिक्स (ड्राई फ्रुट र सिड्स)',
    useCaseQuery: 'healthy trail mix for Himalayan trekking gym & office desk nepal',
    questionQueries: 'What is inside NaturesMud Superfood Trail Mix? | ट्रेल मिक्समा के के मिसाइएको हुन्छ?',
    competitors: 'Commercial trail mixes loaded with raisins, peanuts, and candy chips',
    compPrice: 'Rs. 650–950 per 200g',
    weaknessAndEdge: 'Zero cheap peanut/raisin filler: combines Almonds, Cashews, Pumpkin Seeds, Chia Seeds, Dried Blueberries & Cranberries in a 200 GM glass jar at Rs. 790 (Rs. 395/100g)',
  },
  'chia-seeds': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'chia seeds price in nepal',
    secondaryQuery: 'buy organic black chia seeds 300g kathmandu',
    romanNepali: 'chia seeds nepal',
    nepaliScript: 'चिया सिड्स',
    useCaseQuery: 'chia seeds for morning lemon water weight management & pudding nepal',
    questionQueries: 'What is the price of 300g Chia Seeds in Nepal? | चिया सिड्स कसरी खाने र मूल्य कति पर्छ?',
    competitors: 'Daraz unbranded pouch sellers, Thulo, TikTok shops',
    compPrice: 'Rs. 180–250 per 100g in thin plastic pouches (Rs. 540–750 for 300g)',
    weaknessAndEdge: 'Daraz pouches often contain dust/grit and absorb moisture; NaturesMud Chia Seeds is Rs. 495 for a full 300 GM Glass Jar (only Rs. 165 / 100g!)',
  },
  'pumpkin-seeds': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'pumpkin seeds price in nepal',
    secondaryQuery: 'buy raw green pumpkin seeds 300g kathmandu',
    romanNepali: 'farsi ko biya',
    nepaliScript: 'फर्सीको बिया',
    useCaseQuery: 'raw green pumpkin seeds for zinc magnesium sleep & hair nutrition nepal',
    questionQueries: 'What is the price of 300g Pumpkin Seeds (Farsi ko Biya) in Nepal? | फर्सीको बिया कसरी खाने?',
    competitors: 'Daraz pouch sellers, Bhatbhateni',
    compPrice: 'Rs. 250–350 per 100g (Rs. 750–1,050 for 300g)',
    weaknessAndEdge: 'NaturesMud Raw Green Pumpkin Seeds is Rs. 650 for a 300 GM Glass Jar (only Rs. 216.67 / 100g — lower per-100g cost than plastic pouches, plus glass jar protection)',
  },
  'flax-seeds': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'flax seeds price in nepal',
    secondaryQuery: 'buy alash seeds 200g online kathmandu',
    romanNepali: 'alash / aalas ko biya',
    nepaliScript: 'आलस (आलसको बिया)',
    useCaseQuery: 'flax seeds for Nepali alash ko chhop & plant omega 3 nepal',
    questionQueries: 'Should I eat Flax Seeds (Alash) raw or roasted and ground? | आलसको छोप कसरी बनाउने र मूल्य कति पर्छ?',
    competitors: 'Local grocery loose alash with stones/chaff, Daraz',
    compPrice: 'Rs. 250–600 per 200g',
    weaknessAndEdge: 'Open-sack alash contains grit and stones; NaturesMud Flax Seeds / Alash (200 GM at Rs. 570 — Rs. 285/100g) is triple-cleaned and ready to roast',
  },
  'makhana-fox-nuts': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'makhana price in nepal',
    secondaryQuery: 'buy fox nuts lotus seeds kathmandu',
    romanNepali: 'makhana / phool makhana',
    nepaliScript: 'मखाना (फूल मखाना)',
    useCaseQuery: 'roasted makhana for evening snack fasting & baby porridge nepal',
    questionQueries: 'How to roast Makhana (Fox Nuts) at home in Nepal? | मखाना कसरी भुटेर खाने?',
    competitors: 'Daraz loose makhana bags, Indian packaged flavored makhana',
    compPrice: 'Rs. 350–500 per 50g–100g',
    weaknessAndEdge: 'Hand-graded large white lotus puffs with zero burnt black shells (50 GM at Rs. 390)',
  },
  'virgin-coconut-oil-500ml': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'extra virgin coconut oil price in nepal',
    secondaryQuery: 'cold pressed virgin coconut oil 500ml kathmandu',
    romanNepali: 'nariwal ko tel',
    nepaliScript: 'नरिवलको तेल (एक्स्ट्रा भर्जिन ५०० ml)',
    useCaseQuery: 'cold pressed coconut oil for cooking baby massage oil pulling & hair nepal',
    questionQueries: 'What is the price of 500ml Extra Virgin Coconut Oil in Nepal? | शुद्ध नरिवलको तेल जाडोमा किन जम्छ?',
    competitors: 'Refined hair coconut oils (Parachute), imported 500ml jars on Daraz',
    compPrice: 'Rs. 1,650–2,400 per 500ml (imported virgin coconut oil)',
    weaknessAndEdge: 'Blue-bottle supermarket oils are refined from dried copra and unsuitable for eating/babies; NaturesMud 500 ML is cold-pressed food-grade at Rs. 1,750 (Rs. 350/100ml)',
  },
  'virgin-coconut-oil-180ml': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'virgin coconut oil 180ml price in nepal',
    secondaryQuery: 'cold pressed coconut oil for baby massage nepal',
    romanNepali: 'bacha malish garne nariwal ko tel',
    nepaliScript: 'नरिवलको तेल (१८० ml — शिशु मालिस र छालाको लागि)',
    useCaseQuery: '180ml extra virgin coconut oil for baby skin massage & oil pulling nepal',
    questionQueries: 'Is NaturesMud 180ml Extra Virgin Coconut Oil safe for newborn baby massage? | बच्चाको मालिसको लागि कुन नरिवलको तेल राम्रो हुन्छ?',
    competitors: 'Mineral-oil baby massage oils, small imported coconut oil bottles',
    compPrice: 'Rs. 600–950 per 150ml–200ml',
    weaknessAndEdge: '100% unrefined cold-pressed food-grade coconut oil with zero mineral oil or synthetic perfume (180 ML at Rs. 650 — Rs. 361.11/100ml)',
  },
  'himalayan-pink-salt': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'himalayan pink salt price in nepal',
    secondaryQuery: 'buy sindhe noon 200g kathmandu',
    romanNepali: 'sindhe noon / pink salt',
    nepaliScript: 'सिधे नुन (हिमालयन पिंक साल्ट)',
    useCaseQuery: 'unrefined himalayan pink salt for daily cooking & morning lemon water nepal',
    questionQueries: 'Does Himalayan Pink Salt (Sindhe Noon) have anti-caking chemicals? | सिधे नुन र साधारण नुनमा के फरक छ?',
    competitors: 'Supermarket pouch pink salt, Daraz',
    compPrice: 'Rs. 180–300 per 200g',
    weaknessAndEdge: 'Packed in an airtight 200 GM jar at Rs. 250 (Rs. 125/100g) with 0 synthetic anti-caking chemicals',
  },
  'pure-himalayan-black-salt-bire-noon': {
    wave: 'Wave 4: Seeds, Oils & Salts (Beat Daraz/Thulo with Proof & Unit Price)',
    priority: 'P2',
    primaryQuery: 'bire noon price in nepal',
    secondaryQuery: 'himalayan black salt 200g kathmandu',
    romanNepali: 'bire noon / kala namak',
    nepaliScript: 'बिरे नुन (काला नमक)',
    useCaseQuery: 'pure bire noon for fruit chaat lemon water & nepali achar nepal',
    questionQueries: 'What is Himalayan Black Salt (Bire Noon) used for in Nepali kitchens? | बिरे नुनको मूल्य कति पर्छ?',
    competitors: 'Open bazaar rock fragments, synthetic salted powders',
    compPrice: 'Rs. 150–280 per 200g',
    weaknessAndEdge: 'Finely ground authentic kiln-fired Bire Noon sealed in a moisture-proof 200 GM jar at Rs. 220 (Rs. 110/100g)',
  },
  'pure-mountain-himalayan-shilajit-resin': {
    wave: 'Wave 5: Shilajit (Hold Aggressive Push Until Batch Lab COA Supplied)',
    priority: 'P3',
    primaryQuery: 'shilajit price in nepal',
    secondaryQuery: 'pure himalayan shilajit resin 20g kathmandu',
    romanNepali: 'shilajit / himali shilajit',
    nepaliScript: 'शिलाजीत (शुद्ध हिमाली शिलाजीत रेजिन)',
    useCaseQuery: 'how to use pure shilajit resin in warm water & read lab COA nepal',
    questionQueries: 'What is the price per gram of Pure Himalayan Shilajit Resin in Nepal? | सक्कली शिलाजीत कसरी चिन्ने?',
    competitors: 'Daraz sellers, Instagram pages, Ayurvedic pharmacies',
    compPrice: 'Rs. 1,500–3,500 per 15g–20g (Rs. 80–175 per 1g)',
    weaknessAndEdge: 'NaturesMud 20 GM UV Glass Jar is Rs. 1,995 (Rs. 99.75 / 1g, ~80 pea-sized servings). Hold aggressive ad/SEO push until batch heavy-metal & fulvic-acid COA PDF is published',
  },
};

const CATEGORY_HUB_ROWS = [
  {
    sku: 'CAT-POWDERS',
    name: 'Category Hub: Superfood & Baby Weaning Powders',
    weight: '80 GM – 100 GM',
    price: '400–1395',
    unitPrice: 'Rs. 400–1,743.75 / 100g',
    primaryQuery: 'superfood powders price in nepal',
    secondaryQuery: 'baby weaning food powders nepal (lito jaulo)',
    romanNepali: 'bacha ko lito powder / superfood powder nepal',
    nepaliScript: 'बच्चाको लिटो र सुपरफुड पाउडर',
    useCaseQuery: 'pure fruit and vegetable powders for babies & smoothies nepal',
    questionQueries: 'Which NaturesMud powders are best for 6 month+ babies in Nepal?',
    url: 'https://naturesmud.shop/products?category=powders',
    priority: 'P1',
    wave: 'Wave 1 & 2: Baby Weaning & Powders',
    competitors: 'Daraz baby food category, imported cereals',
    compPrice: 'Rs. 450–1,500',
    weaknessAndEdge: 'Full side-by-side price per 100g table of all 8 single-ingredient powders in UV glass jars',
  },
  {
    sku: 'CAT-DRIED-FRUITS',
    name: 'Category Hub: Naturally Dehydrated Fruits',
    weight: '90 GM – 200 GM',
    price: '395–850',
    unitPrice: 'Rs. 225–690 / 100g',
    primaryQuery: 'dehydrated fruits price in nepal',
    secondaryQuery: 'unsweetened dried fruits online kathmandu',
    romanNepali: 'sukeko phalphul / dry fruits nepal',
    nepaliScript: 'सुकेको फलफूल (चिनी नमिसाइएको)',
    useCaseQuery: 'zero added sugar dried fruits for kids tiffin & trekking nepal',
    questionQueries: 'Where to buy unsweetened dehydrated fruits without sulfur in Nepal?',
    url: 'https://naturesmud.shop/products?category=dried-fruits',
    priority: 'P2',
    wave: 'Wave 3: Dehydrated Fruits & Gifting',
    competitors: 'Bhatbhateni candied dry fruit aisle, Daraz',
    compPrice: 'Rs. 400–1,100',
    weaknessAndEdge: '0% added sugar syrup and 0% sulfur dioxide across all 10 dehydrated fruits',
  },
  {
    sku: 'CAT-NUTS',
    name: 'Category Hub: Mountain Nuts & Trail Mixes',
    weight: '150 GM – 200 GM',
    price: '750–1250',
    unitPrice: 'Rs. 375–625 / 100g',
    primaryQuery: 'dry fruits and nuts price in nepal',
    secondaryQuery: 'buy almonds cashews pistachios online kathmandu',
    romanNepali: 'badam kaju pista ko mulya nepal',
    nepaliScript: 'बदाम, काजु र पिस्ताको मूल्य नेपाल',
    useCaseQuery: 'glass jar nuts for Dashain Tihar Bhai Tika gifting nepal',
    questionQueries: 'What is the price of Almonds, Cashews, and Pistachios in Nepal?',
    url: 'https://naturesmud.shop/products?category=nuts',
    priority: 'P2',
    wave: 'Wave 3: Dehydrated Fruits & Gifting',
    competitors: 'Asan wholesale bazaar, Daraz, Thulo',
    compPrice: 'Rs. 650–1,500',
    weaknessAndEdge: 'Oil-free dry roasting and airtight reusable glass jars with transparent unit pricing',
  },
  {
    sku: 'CAT-SEEDS',
    name: 'Category Hub: Superfood Seeds & Makhana',
    weight: '50 GM – 300 GM',
    price: '390–650',
    unitPrice: 'Rs. 165–780 / 100g',
    primaryQuery: 'chia pumpkin flax seeds price in nepal',
    secondaryQuery: 'buy superfood seeds online kathmandu',
    romanNepali: 'chia seeds farsi ko biya alash makhana',
    nepaliScript: 'चिया सिड्स, फर्सीको बिया, आलस र मखाना',
    useCaseQuery: 'daily omega 3 zinc magnesium seeds for nepali kitchens',
    questionQueries: 'How much do Chia Seeds, Pumpkin Seeds, and Flax Seeds cost per 100g in Nepal?',
    url: 'https://naturesmud.shop/products?category=seeds',
    priority: 'P2',
    wave: 'Wave 4: Seeds, Oils & Salts',
    competitors: 'Daraz pouch sellers, Thulo',
    compPrice: 'Rs. 200–800',
    weaknessAndEdge: '300 GM glass jars for Chia (Rs. 165/100g) and Pumpkin Seeds (Rs. 216.67/100g) beat plastic pouch unit prices',
  },
  {
    sku: 'CAT-OILS',
    name: 'Category Hub: Cold-Pressed Extra Virgin Coconut Oil',
    weight: '180 ML – 500 ML',
    price: '650–1750',
    unitPrice: 'Rs. 350–361.11 / 100ml',
    primaryQuery: 'virgin coconut oil price in nepal',
    secondaryQuery: 'cold pressed coconut oil 500ml 180ml kathmandu',
    romanNepali: 'shuddha nariwal ko tel',
    nepaliScript: 'कोल्ड-प्रेस एक्स्ट्रा भर्जिन नरिवलको तेल',
    useCaseQuery: 'unrefined coconut oil for baby massage cooking & hair care nepal',
    questionQueries: 'Should I buy 180ml or 500ml Extra Virgin Coconut Oil in Nepal?',
    url: 'https://naturesmud.shop/products?category=oils',
    priority: 'P2',
    wave: 'Wave 4: Seeds, Oils & Salts',
    competitors: 'Daraz imported oils, supermarket refined coconut oils',
    compPrice: 'Rs. 600–2,400',
    weaknessAndEdge: 'Side-by-side 180ml vs 500ml size comparison with per-100ml pricing',
  },
  {
    sku: 'CAT-SALTS-SPICES',
    name: 'Category Hub: Himalayan Salts & Shilajit Resin',
    weight: '20 GM – 200 GM',
    price: '220–1995',
    unitPrice: 'Rs. 110/100g – Rs. 99.75/1g',
    primaryQuery: 'himalayan pink salt and bire noon price in nepal',
    secondaryQuery: 'sindhe noon bire noon shilajit kathmandu',
    romanNepali: 'sindhe noon र bire noon',
    nepaliScript: 'सिधे नुन, बिरे नुन र शिलाजीत',
    useCaseQuery: 'unrefined rock salts for daily nepali cooking & chutneys',
    questionQueries: 'What is the difference between Sindhe Noon and Bire Noon?',
    url: 'https://naturesmud.shop/products?category=salts-spices',
    priority: 'P2',
    wave: 'Wave 4 & 5: Salts & Shilajit',
    competitors: 'Local grocery salt packets, Ayurvedic shops',
    compPrice: 'Rs. 150–3,000',
    weaknessAndEdge: 'Unbleached, zero anti-caking chemical rock salts in sealed jars',
  },
];

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const headers = [
  'SKU_Slug',
  'Official_Label_Name',
  'Weight',
  'Price_NPR',
  'Unit_Price',
  'Primary_Query',
  'Secondary_Query',
  'Roman_Nepali',
  'Nepali_Script',
  'Use_Case_Query',
  'Question_Queries',
  'Target_URL',
  'Priority',
  'Attack_Wave',
  'Search_Volume_Status',
  'Competitor_Landscape_Nepal',
  'Competitor_Price_Range',
  'Competitor_Weakness_Our_Edge',
];

const rows = [headers.join(',')];

// Sort active products by wave order (P1 Wave 1 -> P1 Wave 2 -> P2 Wave 3 -> P2 Wave 4 -> P3 Wave 5)
const sortedProducts = [...activeProducts].sort((a, b) => {
  const wa = SKU_STRATEGY[a.slug]?.wave || 'Wave 9';
  const wb = SKU_STRATEGY[b.slug]?.wave || 'Wave 9';
  return wa.localeCompare(wb);
});

for (const p of sortedProducts) {
  const strat = SKU_STRATEGY[p.slug];
  if (!strat) {
    console.warn('Missing strategy for SKU:', p.slug);
    continue;
  }
  const unitPrice = calcUnitPrice(p.price, p.weight);
  const row = [
    p.slug,
    p.name,
    p.weight,
    `Rs. ${p.price}`,
    unitPrice,
    strat.primaryQuery,
    strat.secondaryQuery,
    strat.romanNepali,
    strat.nepaliScript,
    strat.useCaseQuery,
    strat.questionQueries,
    `https://naturesmud.shop/products/${p.slug}`,
    strat.priority,
    strat.wave,
    'GSC & Google Keyword Planner (Nepal) Export Required — Never Invented',
    strat.competitors,
    strat.compPrice,
    strat.weaknessAndEdge,
  ].map(csvEscape);
  rows.push(row.join(','));
}

for (const c of CATEGORY_HUB_ROWS) {
  const row = [
    c.sku,
    c.name,
    c.weight,
    `Rs. ${c.price}`,
    c.unitPrice,
    c.primaryQuery,
    c.secondaryQuery,
    c.romanNepali,
    c.nepaliScript,
    c.useCaseQuery,
    c.questionQueries,
    c.url,
    c.priority,
    c.wave,
    'GSC & Google Keyword Planner (Nepal) Export Required — Never Invented',
    c.competitors,
    c.compPrice,
    c.weaknessAndEdge,
  ].map(csvEscape);
  rows.push(row.join(','));
}

// Add /catalog Price-Per-100g Master Hub
rows.push(
  [
    'HUB-CATALOG-PRICE-LIST',
    'NaturesMud 2026 Master Price List & Per-100g Calculator',
    '20 GM – 500 ML',
    'Rs. 220 – Rs. 1,995',
    'All 32 SKUs Per-100g / Per-100ml',
    'dry fruits and superfood powder price list in nepal 2026',
    'naturesmud price list nepal pdf',
    'dry fruits ra superfood ko mulya suchi nepal',
    'ड्राई फ्रुट्स र सुपरफुड पाउडर मूल्य सूची नेपाल २०२६',
    'compare price per 100g of chia seeds almonds cashews and baby powders in nepal',
    'Where can I download the official NaturesMud Nepal 2026 price list PDF?',
    'https://naturesmud.shop/catalog',
    'P1',
    'Wave 1–4: Cross-Catalog Price Transparency Hub',
    'GSC & Google Keyword Planner (Nepal) Export Required — Never Invented',
    'Daraz, Thulo, Bhatbhateni, local wholesale price lists',
    'Rs. 220 – Rs. 1,995',
    'Only interactive price-per-100g & downloadable PDF catalog in Nepal natural foods',
  ].map(csvEscape).join(',')
);

// Extract 28 canonical blog guides from lib/data/blogs-database.ts
const blogsRaw = fs.readFileSync('lib/data/blogs-database.ts', 'utf8');
const blogArrayPart = blogsRaw.split('export const masterBlogCatalog: ExtendedBlogPost[] = ')[1]?.split(/;\r?\n\r?\nexport const /)[0] || '[]';
const canonicalBlogs = JSON.parse(blogArrayPart);

for (const b of canonicalBlogs) {
  const isPillar = b.featured ? 'P1' : 'P2';
  const wave = b.category.includes('Baby') || b.category.includes('Infant')
    ? 'Wave 1: Baby Weaning Cluster (Editorial Guide)'
    : b.category.includes('Superfood') || b.category.includes('Athletic')
      ? 'Wave 2: High-Demand Superfood Powders (Editorial Guide)'
      : b.category.includes('Dry Fruits') || b.category.includes('Dehydrated') || b.category.includes('Festive')
        ? 'Wave 3: Dehydrated Fruits, Nuts & Gifting (Editorial Guide)'
        : b.slug.includes('shilajit')
          ? 'Wave 5: Shilajit Verification Guide'
          : 'Wave 4: Seeds, Oils & Salts (Editorial Guide)';
  const primaryQuery = `${b.slug.replace(/-/g, ' ')}`;
  const secondaryQuery = `${b.title.toLowerCase()}`;
  const romanNepali = (b.tags || []).join(' / ');
  const nepaliScript = (b.nepaliSummary || '').replace(/<[^>]+>/g, '').slice(0, 110);
  const useCaseQuery = `guide: ${b.title.toLowerCase()}`;
  const questionQueries = (b.faqs || []).slice(0, 2).map((f) => f.question || f.q).join(' | ');

  rows.push(
    [
      `GUIDE-${b.id}`,
      b.title,
      'Editorial Guide',
      b.featuredProductPrice ? `Rs. ${b.featuredProductPrice}` : 'Guide',
      'Informational / Commercial Comparison Guide',
      primaryQuery,
      secondaryQuery,
      romanNepali,
      nepaliScript,
      useCaseQuery,
      questionQueries,
      `https://naturesmud.shop/blog/${b.slug}`,
      isPillar,
      wave,
      'GSC & Google Keyword Planner (Nepal) Export Required — Never Invented',
      'Generic health blogs, Indian nutrition sites without Nepal NPR pricing',
      'N/A (Editorial Hub)',
      'Includes Bilingual Nepali Summary (lang="ne"), comparison tables, USDA/DFTQC references, and exact NPR links',
    ].map(csvEscape).join(',')
  );
}

// Extract 18 canonical recipes from lib/data/recipes.ts
const recipesRaw = fs.readFileSync('lib/data/recipes.ts', 'utf8');
const recipeArrayPart = recipesRaw.split('export const recipes: ExtendedRecipe[] = ')[1]?.split(/;\r?\n\r?\nexport const RECIPE_REDIRECT_MAP/)[0] || '[]';
const canonicalRecipes = JSON.parse(recipeArrayPart);

for (const r of canonicalRecipes) {
  const wave = r.category === 'Baby Food'
    ? 'Wave 1: Baby Weaning Cluster (Recipe)'
    : r.category === 'Smoothies & Drinks'
      ? 'Wave 2: Superfood Drinks & Smoothies (Recipe)'
      : 'Wave 3 & 4: Clean Nepali Kitchen Recipes';
  const primaryQuery = `${r.slug.replace(/-/g, ' ')}`;
  const secondaryQuery = `how to make ${r.title.toLowerCase()}`;
  const romanNepali = (r.tags || []).join(' / ');
  const nepaliScript = `${r.title} रेसिपी`;
  const primarySlug = (r.productSlugs && r.productSlugs[0]) || 'superfood';
  const useCaseQuery = `${r.prepTime} min ${r.category.toLowerCase()} recipe using ${primarySlug.replace(/-/g, ' ')}`;
  const questionQueries = `How to make ${r.title}? | Calories: ${r.calories}`;

  rows.push(
    [
      `RECIPE-${r.id}`,
      r.title,
      `${r.prepTime}m prep / ${r.cookTime}m cook`,
      `${r.calories}`,
      `${r.servings} servings`,
      primaryQuery,
      secondaryQuery,
      romanNepali,
      nepaliScript,
      useCaseQuery,
      questionQueries,
      `https://naturesmud.shop/recipes/${r.slug}`,
      r.category === 'Baby Food' ? 'P1' : 'P2',
      wave,
      'GSC & Google Keyword Planner (Nepal) Export Required — Never Invented',
      'Generic recipe sites without Nepal product measurements or shoppable cart integration',
      'N/A (Shoppable Recipe)',
      '1-click Add Recipe Ingredients to Cart with exact NaturesMud official label names and NPR prices',
    ].map(csvEscape).join(',')
  );
}

fs.writeFileSync('keyword_map.csv', rows.join('\n'), 'utf8');
fs.writeFileSync('public/keyword_map.csv', rows.join('\n'), 'utf8');
console.log(`Generated keyword_map.csv with ${rows.length - 1} mapped URLs (32 SKUs + 6 Category Hubs + 1 Catalog Price Hub + ${canonicalBlogs.length} Blog Guides + ${canonicalRecipes.length} Recipes).`);

