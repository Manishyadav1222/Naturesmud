import fs from 'fs';
import path from 'path';

const productsRaw = JSON.parse(fs.readFileSync('products.json', 'utf8'));

function escapeCsv(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const NEPALI_PRODUCT_NAMES = {
  'banana-powder': { dev: 'केरा पाउडर', rom: 'Kera Powder / Kacho Kera ko Dhulo' },
  'moringa-leaf-powder': { dev: 'शीतलचिनी (सजिवन) पातको धुलो', rom: 'Shitalchini / Sajyun Powder' },
  'freeze-dried-avocado-powder': { dev: 'एभोकाडो पाउडर', rom: 'Avocado Powder Nepal' },
  'strawberry-powder': { dev: 'स्ट्रबेरी पाउडर', rom: 'Strawberry Powder Nepal' },
  'dry-figs-anjeer': { dev: 'सुकाएको अन्जीर', rom: 'Sukeko Anjeer / Dry Figs' },
  'makhana-fox-nuts': { dev: 'हिमाली मखाना', rom: 'Phool Makhana / Fox Nuts' },
  'dehydrated-mango': { dev: 'सुकाएको आँप', rom: 'Sukeko Aap / Dried Mango Slices' },
  'dehydrated-pineapple': { dev: 'सुकाएको भुइँकटहर', rom: 'Sukeko Bhuikatahar / Dried Pineapple' },
  'dehydrated-apple': { dev: 'सुकाएको हिमाली स्याउ', rom: 'Sukeko Syau / Dried Apple Slices' },
  'dehydrated-coconut-chips': { dev: 'सुकाएको नरिवल चिप्स', rom: 'Nariwal Chips / Coconut Flakes' },
  'dehydrated-papaya': { dev: 'सुकाएको मेवा', rom: 'Sukeko Mewa / Dried Papaya' },
  'dried-blueberries': { dev: 'ब्लुबेरी (सुकाएको)', rom: 'Dried Blueberries Nepal' },
  'dried-cranberries': { dev: 'क्र्यानबेरी (सुकाएको)', rom: 'Dried Cranberries Nepal' },
  'dates-powder': { dev: 'खजुरको धुलो', rom: 'Khajur ko Dhulo / Dates Powder' },
  'beetroot-powder': { dev: 'चुकन्दरको धुलो', rom: 'Chukandar ko Dhulo / Beetroot Powder' },
  'himalayan-pink-salt': { dev: 'हिमाली गुलाबी नुन (सिधे नुन)', rom: 'Sidhe Noon / Pink Salt' },
  'pure-himalayan-black-salt-bire-noon': { dev: 'हिमाली बिरे नुन', rom: 'Bire Noon / Black Salt' },
  'chia-seeds': { dev: 'चिया सिड्स', rom: 'Chia Seeds Nepal' },
  'pumpkin-seeds': { dev: 'फर्सीको बिया', rom: 'Pharsi ko Biya / Pumpkin Seeds' },
  'premium-cashewnuts': { dev: 'काँचो काजु', rom: 'Kacho Kaju / Raw Cashews' },
  'roasted-cashewnuts': { dev: 'भुटेको काजु', rom: 'Bhuteko Kaju / Roasted Cashews' },
  'roasted-almonds': { dev: 'भुटेको बदाम', rom: 'Bhuteko Badam / Roasted Almonds' },
  'raw-himalayan-almonds': { dev: 'काँचो बदाम', rom: 'Kacho Badam / Raw Almonds' },
  'superfood-trail-mix': { dev: 'मिक्स ड्राइ नट्स', rom: 'Mix Dry Fruits & Seeds Trail Mix' },
  'macadamia-nuts': { dev: 'म्याकाडामिया नट्स', rom: 'Macadamia Nuts Nepal' },
  'virgin-coconut-oil-500ml': { dev: 'एक्स्ट्रा भर्जिन नरिवलको तेल (५०० मिलि)', rom: 'Extra Virgin Nariwal ko Tel 500ml' },
  'virgin-coconut-oil-180ml': { dev: 'भर्जिन नरिवलको तेल (१८० मिलि)', rom: 'Virgin Nariwal ko Tel 180ml' },
  'carrot-powder': { dev: 'गाजरको धुलो', rom: 'Gajar ko Dhulo / Carrot Powder' },
  'sweet-potato-powder': { dev: 'सखरखण्डको धुलो', rom: 'Sakharkhanda ko Dhulo / Sweet Potato Powder' },
  'pure-mountain-himalayan-shilajit-resin': { dev: 'शुद्ध हिमाली शिलाजित', rom: 'Pure Himalayan Shilajit Resin' },
  'flax-seeds': { dev: 'आलसको दाना', rom: 'Alash ko Dana / Flax Seeds' },
  'premium-pistachio-roasted-salted': { dev: 'भुटेको नुनिलो पिस्ता', rom: 'Bhuteko Pista / Roasted Pistachio' },
};

const keywordEntries = [];
let kwCounter = 1;

function addKW(item) {
  const id = `KW-${String(kwCounter++).padStart(3, '0')}`;
  keywordEntries.push({
    keyword_id: id,
    ...item,
  });
}

// 1. ALL 32 SKUs (English Commercial, Devanagari, and Roman-Nepali) = 32 * 3 = 96 queries
productsRaw.forEach((p) => {
  const nep = NEPALI_PRODUCT_NAMES[p.slug] || { dev: p.name, rom: p.slug.replace(/-/g, ' ') };
  const url = `https://naturesmud.shop/products/${p.slug}`;
  const priceStr = `Rs. ${p.price}`;
  const weightStr = p.weight;

  // Query 1: English Commercial / Transactional (Tier 1)
  addKW({
    search_query: `${p.name.toLowerCase()} price in nepal`,
    query_language: 'English',
    tier: 'Tier 1 (High-Intent Transactional)',
    search_intent: 'Transactional',
    target_sku_or_entity: p.slug,
    canonical_target_url: url,
    serp_title_hook: `${p.name} Price in Nepal | ${weightStr} — NaturesMud`,
    serp_meta_description: `Buy pure ${p.name} (${weightStr}) for ${priceStr} in Nepal. 100% natural, 0% added sugar in sanitary glass jar. Express Kathmandu delivery.`,
    cannibalization_prevention_rule: `Only ${url} targets exact SKU price intent; blogs link to it with exact anchor.`,
    competitor_landscape: 'Daraz unverified sellers, Bhatbhateni imported dry items',
    naturesmud_moat_and_differentiator: `100% pure, single ingredient, sanitary glass jar, exact ${weightStr} for ${priceStr}.`,
  });

  // Query 2: Devanagari Search Intent (Tier 1/2)
  addKW({
    search_query: `${nep.dev} मूल्य नेपाल`,
    query_language: 'Nepali (Devanagari)',
    tier: 'Tier 1 (High-Intent Transactional)',
    search_intent: 'Transactional',
    target_sku_or_entity: p.slug,
    canonical_target_url: url,
    serp_title_hook: `${nep.dev} मूल्य नेपाल | NaturesMud Kathmandu`,
    serp_meta_description: `नेपालमा शुद्ध ${nep.dev} (${weightStr}) मूल्य ${priceStr}। १००% शुद्ध, कुनै मिसावट नभएको। काठमाडौं उपत्यका र ७७ जिल्लामै डेलिभरी।`,
    cannibalization_prevention_rule: `Targeted via Devanagari on-page schema and dual-language headings on ${url}.`,
    competitor_landscape: 'Local Asan/Indrachowk grocery shops, untracked social sellers',
    naturesmud_moat_and_differentiator: 'DFTQC compliance, sealed tamper-proof packaging, doorstep delivery.',
  });

  // Query 3: Roman-Nepali Search Intent (Tier 2)
  addKW({
    search_query: `${nep.rom.toLowerCase()} kathmandu online`,
    query_language: 'Romanized Nepali',
    tier: 'Tier 2 (Mid-Tail Product Consideration)',
    search_intent: 'Commercial Investigation',
    target_sku_or_entity: p.slug,
    canonical_target_url: url,
    serp_title_hook: `Buy ${p.name} Online Kathmandu | COD Delivery`,
    serp_meta_description: `Order ${p.name} (${weightStr}) online in Kathmandu at ${priceStr}. Cash on delivery (COD) available across Nepal. Free delivery over Rs. 3,000.`,
    cannibalization_prevention_rule: `Mapped directly to ${url} as the primary conversion landing page.`,
    competitor_landscape: 'Daraz marketplace listings with high return rates',
    naturesmud_moat_and_differentiator: 'Fast 24h Valley dispatch directly from Baneshwor fulfillment hub.',
  });
});

// 2. 6 CATEGORY HUBS (Category Level Commercial Queries) = 6 * 3 = 18 queries
const CATEGORY_MAP = [
  {
    slug: 'powders',
    name: 'Superfood & Baby Weaning Powders',
    en: 'superfood powders in nepal',
    dev: 'सुपरफुड धुलो नेपाल',
    rom: 'baby food powders kathmandu',
  },
  {
    slug: 'dried-fruits',
    name: 'Dehydrated Fruits & Berries',
    en: 'dehydrated fruits in nepal',
    dev: 'सुकाएको फलफूल नेपाल',
    rom: 'dried fruits no sugar nepal',
  },
  {
    slug: 'nuts',
    name: 'Mountain Nuts & Trail Mix',
    en: 'dry fruits and nuts price in nepal',
    dev: 'काजु बदाम मूल्य नेपाल',
    rom: 'kaju badam pista online nepal',
  },
  {
    slug: 'seeds',
    name: 'Healthy Seeds & Makhana',
    en: 'chia seeds pumpkin seeds makhana nepal',
    dev: 'चिया सिड्स फर्सीको बिया मखाना नेपाल',
    rom: 'healthy seeds online delivery nepal',
  },
  {
    slug: 'oils',
    name: 'Cold-Pressed Virgin Oils',
    en: 'extra virgin coconut oil price in nepal',
    dev: 'भर्जिन नरिवलको तेल नेपाल',
    rom: 'cold pressed coconut oil kathmandu',
  },
  {
    slug: 'salts-spices',
    name: 'Himalayan Salts & Shilajit',
    en: 'pure himalayan rock salt and shilajit nepal',
    dev: 'हिमाली बिरे नुन सिधे नुन शिलाजित',
    rom: 'bire noon sendha namak shilajit nepal',
  },
];

CATEGORY_MAP.forEach((c) => {
  const url = `https://naturesmud.shop/category/${c.slug}`;

  addKW({
    search_query: c.en,
    query_language: 'English',
    tier: 'Tier 3 (Category Head)',
    search_intent: 'Commercial Investigation',
    target_sku_or_entity: `category-${c.slug}`,
    canonical_target_url: url,
    serp_title_hook: `${c.name} in Nepal | NaturesMud Shop`,
    serp_meta_description: `Explore 100% natural ${c.name.toLowerCase()} in Nepal. Single-ingredient whole foods with 0% added sugar and 0 preservatives. Doorstep delivery.`,
    cannibalization_prevention_rule: `Category hub aggregates all child SKUs without competing with individual product names.`,
    competitor_landscape: 'Supermarket dry fruit sections (Bhatbhateni, Big Mart)',
    naturesmud_moat_and_differentiator: 'Specialized single-ingredient focus with transparent origin belts.',
  });

  addKW({
    search_query: c.dev,
    query_language: 'Nepali (Devanagari)',
    tier: 'Tier 3 (Category Head)',
    search_intent: 'Commercial Investigation',
    target_sku_or_entity: `category-${c.slug}`,
    canonical_target_url: url,
    serp_title_hook: `${c.dev} | NaturesMud काठमाडौं`,
    serp_meta_description: `काठमाडौंमा शुद्ध ${c.dev} किन्नुहोस्। कुनै रासायनिक मिसावट नभएको, गुणस्तरीय काँचको बट्टामा सुरक्षित। देशभर होम डेलिभरी।`,
    cannibalization_prevention_rule: `Category page renders dual-language headings to capture Devanagari category head queries.`,
    competitor_landscape: 'Traditional spice & herbal stores in Asan, Kathmandu',
    naturesmud_moat_and_differentiator: 'Standardized hygienic food-grade packaging and verified weights.',
  });

  addKW({
    search_query: c.rom,
    query_language: 'Romanized Nepali',
    tier: 'Tier 2 (Mid-Tail Product Consideration)',
    search_intent: 'Transactional',
    target_sku_or_entity: `category-${c.slug}`,
    canonical_target_url: url,
    serp_title_hook: `Buy ${c.name} Online in Nepal | COD`,
    serp_meta_description: `Order ${c.name} online with cash on delivery across Kathmandu, Pokhara, Chitwan, and all 77 districts of Nepal.`,
    cannibalization_prevention_rule: `Mapped directly to ${url}; provides instant filterable SKU cards.`,
    competitor_landscape: 'Daraz search categories with generic unbranded items',
    naturesmud_moat_and_differentiator: 'Consistent single-brand quality assurance with 7-day return guarantee.',
  });
});

// 3. AUDIENCE & INTENT HUBS = 5 * 4 = 20 queries
const AUDIENCE_HUBS = [
  {
    url: 'https://naturesmud.shop/send-gifts-to-nepal',
    entity: 'diaspora-gifting',
    queries: [
      { q: 'send gifts to nepal from australia', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: 'send dry fruits gifts to parents in nepal from usa', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: 'nepal ma gift pathaune online australia bata', l: 'Romanized Nepali', t: 'Tier 2 (Mid-Tail)', i: 'Commercial Investigation' },
      { q: 'विदेशबाट नेपालमा उपहार पठाउने अनलाइन', l: 'Nepali (Devanagari)', t: 'Tier 2 (Mid-Tail)', i: 'Commercial Investigation' },
    ],
    title: 'Send Healthy Gifts to Nepal from Abroad | NaturesMud',
    desc: 'Send premium Himalayan dry fruits, baby care boxes & wellness hampers to family in Nepal from Australia, USA, UK & Gulf. Handwritten notes & doorstep delivery.',
  },
  {
    url: 'https://naturesmud.shop/baby-weaning',
    entity: 'baby-weaning-hub',
    queries: [
      { q: 'baby weaning food chart 6 months nepal', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Informational/Commercial' },
      { q: 'best baby lito powder in kathmandu no sugar', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: '६ महिनाको बच्चाको खाना लिटो जाउलो पाउडर', l: 'Nepali (Devanagari)', t: 'Tier 1 (High-Intent Transactional)', i: 'Informational/Commercial' },
      { q: 'bacha ko lito powder kathmandu price', l: 'Romanized Nepali', t: 'Tier 2 (Mid-Tail)', i: 'Transactional' },
    ],
    title: 'Baby Weaning Foods & Lito Powders in Nepal | NaturesMud',
    desc: 'Pediatrician-guided baby weaning powders (Banana, Sweet Potato, Dates, Carrot, Avocado) for 6+ month lito/jaulo. 0% added sugar in glass jars.',
  },
  {
    url: 'https://naturesmud.shop/gym-fitness',
    entity: 'gym-fitness-hub',
    queries: [
      { q: 'natural gym supplements in nepal no chemicals', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Commercial Investigation' },
      { q: 'beetroot powder shilajit for gym workout nepal', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: 'जिम र फिटनेसको लागि प्राकृतिक खाना नेपाल', l: 'Nepali (Devanagari)', t: 'Tier 2 (Mid-Tail)', i: 'Informational/Commercial' },
      { q: 'pre workout natural foods kathmandu price', l: 'Romanized Nepali', t: 'Tier 2 (Mid-Tail)', i: 'Transactional' },
    ],
    title: 'Whole-Food Gym & Fitness Fuel in Nepal | NaturesMud',
    desc: 'Clean athletic fuel: Pure Himalayan Shilajit, Beetroot nitrate powder, Raw Almonds, Chia & Pumpkin seeds. Whole foods with 0 artificial stimulants.',
  },
  {
    url: 'https://naturesmud.shop/sugar-free',
    entity: 'sugar-free-hub',
    queries: [
      { q: 'sugar free alternatives in nepal for diabetics', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Commercial Investigation' },
      { q: 'dates powder as sugar substitute nepal', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: 'चिनीको सट्टा प्रयोग गरिने प्राकृतिक खजुरको धुलो', l: 'Nepali (Devanagari)', t: 'Tier 1 (High-Intent Transactional)', i: 'Informational/Commercial' },
      { q: 'chini ko bikalpa natural sweetener kathmandu', l: 'Romanized Nepali', t: 'Tier 2 (Mid-Tail)', i: 'Transactional' },
    ],
    title: '0% Added Sugar Natural Sweeteners Nepal | NaturesMud',
    desc: 'Pure whole-food sugar substitutes in Nepal. Dates Powder, Dehydrated Apples & Figs with 0% refined cane sugar for tea, baby food, and diabetic wellness.',
  },
  {
    url: 'https://naturesmud.shop/fasting-snacks',
    entity: 'fasting-snacks-hub',
    queries: [
      { q: 'vrat snacks in nepal ekadashi teej fast', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Informational/Commercial' },
      { q: 'sendha namak makhana for fasting kathmandu', l: 'English', t: 'Tier 1 (High-Intent Transactional)', i: 'Transactional' },
      { q: 'व्रत र उपवासमा खाने शुद्ध सात्विक खाजा र सिधे नुन', l: 'Nepali (Devanagari)', t: 'Tier 1 (High-Intent Transactional)', i: 'Informational/Commercial' },
      { q: 'ekadashi ma khane upahar makhana sendha noon nepal', l: 'Romanized Nepali', t: 'Tier 2 (Mid-Tail)', i: 'Transactional' },
    ],
    title: 'Satvik Vrat Fasting Snacks & Sendha Namak Nepal',
    desc: 'Pure Satvik fasting snacks in Nepal: Himalayan Makhana (Rs. 390), Sendha Namak Pink Salt (Rs. 250), Raw Almonds & Figs for Ekadashi, Navratri & Teej.',
  },
];

AUDIENCE_HUBS.forEach((h) => {
  h.queries.forEach((q) => {
    addKW({
      search_query: q.q,
      query_language: q.l,
      tier: q.t,
      search_intent: q.i,
      target_sku_or_entity: h.entity,
      canonical_target_url: h.url,
      serp_title_hook: h.title,
      serp_meta_description: h.desc,
      cannibalization_prevention_rule: `High-intent audience queries map exclusively to dedicated landing hub ${h.url}.`,
      competitor_landscape: 'Generic multi-brand portals without curated themed hampers or dietary focus',
      naturesmud_moat_and_differentiator: 'Curated whole-food bundles, explicit nutritional advice, and overseas gifting workflow.',
    });
  });
});

// 4. PILLAR BLOG GUIDES (12 Core Guides * 2 = 24 queries)
const PILLAR_BLOGS = [
  {
    slug: 'baby-food-nepal-6-months-chart-weaning-guide',
    en: 'baby food chart 6 months nepal lito jaulo',
    dev: '६ महिनाको बच्चाको खाना तालिका नेपाल',
    title: 'Baby Food Nepal: 6 Months Feeding Chart & Weaning Guide',
    desc: 'Pediatrician-aligned 6-month baby food chart in Nepal. Stage-by-stage lito/jaulo preparation using pure sweet potato, banana & dates powder.',
  },
  {
    slug: 'dates-powder-price-in-nepal-natural-sugar-substitute-guide',
    en: 'dates powder price in nepal benefits and uses',
    dev: 'खजुरको धुलो मूल्य र फाइदा नेपाल',
    title: 'Dates Powder Price in Nepal & Sugar Substitute Guide',
    desc: 'Complete guide to Dates Powder in Nepal (Rs. 400 / 100g). Learn how to replace refined sugar in baby porridge, kheer, and bakery recipes.',
  },
  {
    slug: 'beetroot-powder-in-nepal-benefits-uses-price',
    en: 'beetroot powder in nepal benefits uses and price',
    dev: 'चुकन्दर पाउडर नेपाल फाइदा र प्रयोग',
    title: 'Beetroot Powder in Nepal: Benefits, Uses & Price',
    desc: 'Everything you need to know about pure Beetroot Powder (Rs. 430 / 100g) in Nepal for stamina smoothies, hemoglobin support, and baking.',
  },
  {
    slug: 'moringa-powder-benefits-nepal-how-to-use-daily',
    en: 'moringa powder benefits nepal how to use daily',
    dev: 'शीतलचिनी सजिवन धुलो फाइदा र खाने तरिका नेपाल',
    title: 'Moringa Powder Benefits in Nepal: Daily Uses & Price',
    desc: 'Discover Moringa Leaf Powder (Rs. 690 / 200g) in Nepal. Learn daily dosages for dal, smoothies, and warm water for natural vitality.',
  },
  {
    slug: 'freeze-dried-vs-dehydrated-fruits-nutrition-comparison',
    en: 'freeze dried vs dehydrated fruits nutrition nepal',
    dev: 'फ्रिज ड्राइ र डिहाइड्रेटेड फलफूल भिन्नता नेपाल',
    title: 'Freeze-Dried vs Dehydrated Fruits: Nutrition Guide Nepal',
    desc: 'Compare freeze-dried vs low-temperature dehydrated fruits in Nepal. Learn which method preserves the most Vitamin C, fiber, and flavor.',
  },
  {
    slug: 'dry-fruits-price-in-nepal-2026-wholesale-retail-guide',
    en: 'dry fruits price in nepal 2026 per kg comparison',
    dev: 'काजु बदाम पिस्ता अन्जीर मूल्य नेपाल २०२६',
    title: 'Dry Fruits Price in Nepal 2026: Wholesale & Retail Guide',
    desc: 'Verified 2026 dry fruits price guide in Nepal per 100g and 1kg. Compare genuine market rates for almonds, cashews, pistachios, and figs.',
  },
  {
    slug: 'chia-seeds-price-in-nepal-benefits-weight-loss-guide',
    en: 'chia seeds price in nepal weight loss benefits',
    dev: 'चिया सिड्स मूल्य र तौल घटाउने तरिका नेपाल',
    title: 'Chia Seeds Price in Nepal & Weight Loss Guide',
    desc: 'Comprehensive Chia Seeds guide in Nepal (Rs. 495 / 300g). How to drink chia water for weight management, fiber, and heart-healthy Omega-3.',
  },
  {
    slug: 'cold-pressed-virgin-coconut-oil-and-mustard-oil-guide-nepal',
    en: 'extra virgin coconut oil price in nepal cooking and hair',
    dev: 'नरिवलको तेल मूल्य र प्रयोग नेपाल',
    title: 'Cold-Pressed Virgin Coconut Oil Guide Nepal',
    desc: 'Learn about wood cold-pressed Extra Virgin Coconut Oil in Nepal (180ml @ Rs. 650, 500ml @ Rs. 1,750) for cooking, hair nourishment, and baby massage.',
  },
  {
    slug: 'himalayan-black-salt-bire-noon-and-pink-salt-guide-nepal',
    en: 'himalayan black salt bire noon benefits digestion nepal',
    dev: 'हिमाली बिरे नुन र गुलाबी नुन फाइदा नेपाल',
    title: 'Himalayan Black Salt (Bire Noon) & Pink Salt Guide',
    desc: 'Discover authentic Himalayan Black Salt (Rs. 220 / 200g) and Pink Salt (Rs. 250 / 200g) for Ayurvedic digestion, salad seasoning, and fasting.',
  },
  {
    slug: 'how-to-test-pure-himalayan-shilajit-resin-at-home-nepal',
    en: 'how to test pure shilajit resin at home nepal',
    dev: 'घरमै शुद्ध शिलाजित परीक्षण गर्ने तरिका नेपाल',
    title: 'How to Test Pure Himalayan Shilajit at Home Nepal',
    desc: 'Learn 4 home tests (warm water, flame, pliable texture, alcohol solubility) to verify pure Shilajit resin before buying in Kathmandu.',
  },
  {
    slug: 'best-trekking-snacks-nepal-ebc-annapurna-lightweight-trail-food',
    en: 'best trekking snacks nepal ebc annapurna trail food',
    dev: 'ट्रेकिङको लागि हलुका र पोसिलो खाजा नेपाल',
    title: 'Best Trekking Snacks Nepal: EBC & Annapurna Trail Food',
    desc: 'Lightweight high-calorie trekking snacks for Everest Base Camp and Annapurna circuits: trail mix, dehydrated mango, makhana & nuts in Nepal.',
  },
  {
    slug: 'banana-price-movements-nepal-banana-powder-guide',
    en: 'banana price movements nepal banana powder economics',
    dev: 'केराको मूल्य नेपाल र केरा पाउडरको फाइदा',
    title: 'Banana Price Movements in Nepal & Banana Powder Guide',
    desc: 'Analysis of Kalimati wholesale banana price spikes vs shelf-stable pure Banana Powder (Rs. 650 / 100g) for zero-spoilage household nutrition.',
  },
];

PILLAR_BLOGS.forEach((b) => {
  const url = `https://naturesmud.shop/blog/${b.slug}`;

  addKW({
    search_query: b.en,
    query_language: 'English',
    tier: 'Tier 2 (Mid-Tail Educational/Pillar)',
    search_intent: 'Informational',
    target_sku_or_entity: `blog-${b.slug}`,
    canonical_target_url: url,
    serp_title_hook: b.title,
    serp_meta_description: b.desc,
    cannibalization_prevention_rule: `Educational search intent resolves at ${url}, linking readers to relevant product conversion pages.`,
    competitor_landscape: 'Indian nutrition blogs and unlocalized health articles lacking Nepal NPR data',
    naturesmud_moat_and_differentiator: 'Locally grounded citations (Kalimati, DFTQC, Nepal pediatric customs) with shoppable links.',
  });

  addKW({
    search_query: b.dev,
    query_language: 'Nepali (Devanagari)',
    tier: 'Tier 2 (Mid-Tail Educational/Pillar)',
    search_intent: 'Informational',
    target_sku_or_entity: `blog-${b.slug}`,
    canonical_target_url: url,
    serp_title_hook: `${b.dev} | NaturesMud Guide`,
    serp_meta_description: b.desc,
    cannibalization_prevention_rule: `Devanagari informational queries land on the blog post with bilingual summary section.`,
    competitor_landscape: 'Nepali news articles that lack structured nutritional instructions',
    naturesmud_moat_and_differentiator: 'Scientific backing, pediatrician advisories, and step-by-step preparation.',
  });
});

// 5. KEY RECIPES (6 Key Recipes * 2 = 12 queries)
const RECIPES_MAP = [
  {
    slug: '5-minute-sweet-potato-dates-baby-porridge-100g',
    en: 'how to make sweet potato dates baby porridge nepal',
    dev: 'सखरखण्ड र खजुरको लिटो बनाउने तरिका',
    title: '5-Minute Sweet Potato Dates Baby Porridge Recipe',
  },
  {
    slug: 'chia-seed-pudding-recipe',
    en: 'chia seed pudding recipe with coconut milk nepal',
    dev: 'चिया सिड्स पुडिङ बनाउने विधि',
    title: 'Easy Chia Seed Pudding Recipe Nepal',
  },
  {
    slug: 'high-nitrate-beetroot-smoothie-powder-recipe',
    en: 'beetroot powder pre workout smoothie recipe',
    dev: 'चुकन्दर पाउडर स्मूदी रेसिपी',
    title: 'High-Nitrate Beetroot Pre-Workout Smoothie Recipe',
  },
  {
    slug: 'sugar-free-dates-powder-makhana-kheer-100g',
    en: 'sugar free makhana kheer recipe with dates powder',
    dev: 'मखाना खिर रेसिपी चिनी बिना खजुरको धुलो',
    title: 'Sugar-Free Makhana Kheer Recipe Nepal',
  },
  {
    slug: 'healthy-trail-mix-recipe-for-hiking-nepal',
    en: 'diy healthy trail mix recipe for trekking nepal',
    dev: 'ट्रेकिङको लागि मिक्स नट्स खाजा रेसिपी',
    title: 'DIY Healthy Trail Mix Recipe for Hiking Nepal',
  },
  {
    slug: 'sweet-potato-puree-for-babies-simple-recipe-nepal',
    en: 'sweet potato puree recipe for 6 month baby nepal',
    dev: 'सखरखण्ड प्युरी बच्चाको लागि बनाउने तरिका',
    title: 'Simple Sweet Potato Puree for Babies Nepal',
  },
];

RECIPES_MAP.forEach((r) => {
  const url = `https://naturesmud.shop/recipes/${r.slug}`;

  addKW({
    search_query: r.en,
    query_language: 'English',
    tier: 'Tier 2 (Mid-Tail Recipe/How-To)',
    search_intent: 'Informational/Commercial',
    target_sku_or_entity: `recipe-${r.slug}`,
    canonical_target_url: url,
    serp_title_hook: `${r.title} | NaturesMud`,
    serp_meta_description: `Make delicious ${r.title.toLowerCase()} in Nepal with whole-food ingredients. Includes 1-click add ingredients to cart feature.`,
    cannibalization_prevention_rule: `Recipe searches map to ${url}; provides 1-click cart addition for needed ingredients.`,
    competitor_landscape: 'Generic international food blogs with foreign cup measurements',
    naturesmud_moat_and_differentiator: 'Grounded in Nepali metric gram measurements and instant 1-click ingredient purchasing.',
  });

  addKW({
    search_query: r.dev,
    query_language: 'Nepali (Devanagari)',
    tier: 'Tier 2 (Mid-Tail Recipe/How-To)',
    search_intent: 'Informational',
    target_sku_or_entity: `recipe-${r.slug}`,
    canonical_target_url: url,
    serp_title_hook: `${r.dev} | NaturesMud रेसिपी`,
    serp_meta_description: `नेपाली भान्सामा सजिलै ${r.dev}। प्राकृतिक पोषण, कुनै कृत्रिम रंग वा चिनी बिना। घरमै बनाउने सरल विधि।`,
    cannibalization_prevention_rule: `Devanagari recipe queries map to ${url} containing ingredient steps.`,
    competitor_landscape: 'YouTube cooking videos without direct ingredient sourcing',
    naturesmud_moat_and_differentiator: 'Directly linked to exact glass-jar ingredients in Nepal.',
  });
});

// 6. BRAND, FACTS & LOCATION QUERIES (6 queries)
const BRAND_QUERIES = [
  {
    q: 'naturesmud nepal official website kathmandu',
    l: 'English',
    t: 'Tier 1 (Brand Navigational)',
    i: 'Navigational',
    url: 'https://naturesmud.shop/',
    title: 'NaturesMud Nepal | Himalayan Superfoods & Dried Fruits',
    desc: 'Official website of NaturesMud Nepal. 32 SKUs of dehydrated fruits, baby weaning powders, nuts, seeds, and oils with 0 added sugar.',
  },
  {
    q: 'naturesmud nepal verified 32 sku price and fact sheet',
    l: 'English',
    t: 'Tier 1 (High-Intent Transactional)',
    i: 'Informational/Commercial',
    url: 'https://naturesmud.shop/facts',
    title: 'NaturesMud Nepal — Verified Brand Facts & 32-SKU Price Sheet',
    desc: 'Official factual specification sheet for NaturesMud Nepal. 32 SKUs, exact gram weights, NPR prices, unit costs, single ingredients, and delivery rates.',
  },
  {
    q: 'dry fruits delivery in pokhara chitwan butwal nepal',
    l: 'English',
    t: 'Tier 2 (Location Commercial)',
    i: 'Transactional',
    url: 'https://naturesmud.shop/locations',
    title: 'Dry Fruits & Superfood Delivery Across Nepal | 77 Districts',
    desc: 'Fast doorstep delivery of dry fruits, nuts, and superfood powders to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, and all 77 districts.',
  },
  {
    q: 'नेपालमा शुद्ध ड्राई फ्रुट्स अनलाइन डेलिभरी',
    l: 'Nepali (Devanagari)',
    t: 'Tier 1 (High-Intent Transactional)',
    i: 'Transactional',
    url: 'https://naturesmud.shop/products',
    title: 'नेपालमा शुद्ध ड्राई फ्रुट्स र सुपरफुड | NaturesMud',
    desc: 'नेपालभर अनलाइन अर्डर गर्नुहोस्: बदाम, काजु, पिस्ता, मखाना र फलफूलको धुलो। क्यास अन डेलिभरी उपलब्ध।',
  },
  {
    q: 'naturesmud kathmandu delivery contact number',
    l: 'English',
    t: 'Tier 1 (Brand Navigational)',
    i: 'Navigational',
    url: 'https://naturesmud.shop/contact',
    title: 'Contact NaturesMud Nepal | WhatsApp & Baneshwor Office',
    desc: 'Contact NaturesMud Kathmandu: WhatsApp +977-9713888002, email info@naturesmud.shop, or visit our Baneshwor dispatch center.',
  },
  {
    q: 'naturesmud nepali quality testing and dftqc compliance',
    l: 'English',
    t: 'Tier 2 (Trust & Verification)',
    i: 'Informational',
    url: 'https://naturesmud.shop/quality-and-proof',
    title: 'Quality & Proof Document Center | NaturesMud Nepal',
    desc: 'Authoritative quality ledger, food safety standards, packaging specs, and DFTQC regulatory disclosures for NaturesMud Nepal.',
  },
];

BRAND_QUERIES.forEach((bq) => {
  addKW({
    search_query: bq.q,
    query_language: bq.l,
    tier: bq.t,
    search_intent: bq.i,
    target_sku_or_entity: 'brand-authority',
    canonical_target_url: bq.url,
    serp_title_hook: bq.title,
    serp_meta_description: bq.desc,
    cannibalization_prevention_rule: 'Navigational and brand queries map strictly to homepage, facts sheet, or contact center.',
    competitor_landscape: 'Brand spoofing or misleading social channels',
    naturesmud_moat_and_differentiator: 'Verified first-party domain with SSL and official WhatsApp desk.',
  });
});

// Write to JSON and CSV
fs.writeFileSync('public/keyword_map.json', JSON.stringify(keywordEntries, null, 2), 'utf8');

const headers = Object.keys(keywordEntries[0]);
const csvRows = [headers.join(',')];
for (const entry of keywordEntries) {
  const row = headers.map((h) => escapeCsv(entry[h]));
  csvRows.push(row.join(','));
}

fs.writeFileSync('public/keyword_map.csv', csvRows.join('\n'), 'utf8');
fs.writeFileSync('keyword_map.csv', csvRows.join('\n'), 'utf8');

console.log(`Successfully generated expanded keyword map with ${keywordEntries.length} verified queries across all 3 tiers!`);
