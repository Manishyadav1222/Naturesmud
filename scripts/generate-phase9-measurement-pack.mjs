import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://naturesmud.shop';

function escapeCsv(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function parseLocalProducts() {
  const rawFile = fs.readFileSync(path.join(process.cwd(), 'lib/data/products.ts'), 'utf8');
  const startMarker = 'export const products: Product[] = [';
  const startIdx = rawFile.indexOf(startMarker);
  const endIdx = rawFile.indexOf('export function getProductBySlug');
  const arrayStr = rawFile
    .slice(startIdx + 'export const products: Product[] = '.length, endIdx)
    .trim()
    .replace(/;$/, '');
  return JSON.parse(arrayStr).filter((p) => p.isActive !== false && p.isPublished !== false);
}

const NEPALI_NAMES_MAP = {
  'sweet-potato-powder': { dev: 'सखरखण्डको धुलो', rom: 'Sakarkhanda ko Dhulo' },
  'dates-powder': { dev: 'खजुरको धुलो', rom: 'Khajoor ko Dhulo' },
  'beetroot-powder': { dev: 'चुकन्दरको धुलो', rom: 'Chukandar ko Dhulo' },
  'banana-powder': { dev: 'केराको धुलो', rom: 'Kera ko Dhulo' },
  'carrot-powder': { dev: 'गाजरको धुलो', rom: 'Gajar ko Dhulo' },
  'moringa-leaf-powder': { dev: 'शीतलचिनी (सजिवन) पातको धुलो', rom: 'Shitalchini / Sajyun ko Dhulo' },
  'freeze-dried-avocado-powder': { dev: 'एभोकाडो पाउडर', rom: 'Avocado Powder' },
  'strawberry-powder': { dev: 'स्ट्रबेरी पाउडर', rom: 'Strawberry Powder' },
  'dehydrated-mango': { dev: 'सुकाएको आँप', rom: 'Sukako Aap' },
  'dehydrated-pineapple': { dev: 'सुकाएको भुइँकटहर', rom: 'Sukako Bhuikatahar' },
  'dehydrated-apple': { dev: 'सुकाएको हिमाली स्याउ', rom: 'Sukako Himali Syau' },
  'dehydrated-coconut-chips': { dev: 'सुकाएको नरिवल चिप्स', rom: 'Nariwal Chips' },
  'dehydrated-papaya': { dev: 'सुकाएको गुलियो मेवा', rom: 'Sukako Mewa' },
  'dehydrated-dragon-fruit': { dev: 'सुकाएको ड्र्यागन फ्रुट', rom: 'Dehydrated Dragon Fruit' },
  'dried-blueberries': { dev: 'सुकाएको ब्लुबेरी', rom: 'Dried Blueberries' },
  'dried-cranberries': { dev: 'सुकाएको क्र्यानबेरी', rom: 'Dried Cranberries' },
  'dry-figs-anjeer': { dev: 'सुकाएको अन्जीर', rom: 'Anjeer (Dry Figs)' },
  'raw-himalayan-almonds': { dev: 'काँचो बदाम', rom: 'Kacho Badam' },
  'roasted-almonds': { dev: 'भुटेको बदाम', rom: 'Bhuteko Badam' },
  'premium-cashewnuts': { dev: 'काजु', rom: 'Kaju' },
  'roasted-cashewnuts': { dev: 'भुटेको काजु', rom: 'Bhuteko Kaju' },
  'premium-pistachio-roasted-salted': { dev: 'भुटेको नुनिलो पिस्ता', rom: 'Bhuteko Pista' },
  'macadamia-nuts': { dev: 'म्याकाडामिया नट्स', rom: 'Macadamia Nuts' },
  'superfood-trail-mix': { dev: 'मिक्स ड्राइ नट्स', rom: 'Mix Dry Nuts' },
  'makhana-fox-nuts': { dev: 'हिमाली मखाना', rom: 'Himalayan Makhana' },
  'chia-seeds': { dev: 'चिया सिड्स', rom: 'Chia Seeds' },
  'pumpkin-seeds': { dev: 'फर्सीको बिया', rom: 'Pharsi ko Biya' },
  'flax-seeds': { dev: 'आलसको दाना', rom: 'Alash ko Dana' },
  'virgin-coconut-oil-500ml': { dev: 'एक्स्ट्रा भर्जिन नरिवलको तेल (५०० मिलि)', rom: 'Extra Virgin Nariwal ko Tel 500ml' },
  'virgin-coconut-oil-180ml': { dev: 'भर्जिन नरिवलको तेल (१८० मिलि)', rom: 'Virgin Nariwal ko Tel 180ml' },
  'rosemary-leaves': { dev: 'सुकाएको रोजमेरी पात', rom: 'Sukako Rosemary Paat' },
  'himalayan-pink-salt': { dev: 'हिमाली गुलाबी नुन (सिधे नुन)', rom: 'Sidhe Noon / Pink Salt' },
  'pure-himalayan-black-salt-bire-noon': { dev: 'हिमाली बिरे नुन', rom: 'Bire Noon / Black Salt' },
  'pure-mountain-himalayan-shilajit-resin': { dev: 'शुद्ध हिमाली शिलाजीत रेजिन', rom: 'Himali Shilajit Resin' },
};

const COMPETITOR_BASELINE_BY_CATEGORY = {
  powders: {
    who_is_above_us: 'Daraz generic unbranded pouches & cosmetic herbal pages',
    weakness: 'Missing food-grade glass-jar specification, batch date, per-100g price breakdown, and Nepali jaulo/lito recipe integration',
  },
  'dried-fruits': {
    who_is_above_us: 'Daraz / Thulo sugar-coated Thai dried fruit imports',
    weakness: 'Loaded with refined sugar syrup and sulfur dioxide (E220) vs NaturesMud 0% added sugar solar-dehydrated fruits',
  },
  nuts: {
    who_is_above_us: 'Daraz & local kirana loose plastic pouch sellers',
    weakness: 'High broken-kernel ratio, stale oil smell, or refined-oil roasting vs NaturesMud airtight grade-A nuts',
  },
  seeds: {
    who_is_above_us: 'Daraz / TikTok bulk pouch resellers',
    weakness: 'Unwashed field grit/dust and no per-100g value comparison vs NaturesMud triple-cleaned seeds in reusable jars',
  },
  oils: {
    who_is_above_us: 'Daraz & pharmacy apps selling refined copra or cosmetic oils',
    weakness: 'Refined/bleached oil or mineral oil blends vs 100% cold-pressed edible virgin coconut oil & food-grade rosemary',
  },
  'salts-spices': {
    who_is_above_us: 'Generic spice shops & unverified Shilajit social pages',
    weakness: 'Anti-caking additives or unverified Shilajit claims without batch transparency or heavy-metal safety disclosures',
  },
};

function buildWeeklyRankTracker(activeProducts) {
  // 32 Product Queries (1 per active canonical SKU)
  const productRows = activeProducts.map((p, idx) => {
    const officialName = p.official_label_name || p.name;
    const nep = NEPALI_NAMES_MAP[p.slug] || { dev: officialName, rom: officialName };
    const comp = COMPETITOR_BASELINE_BY_CATEGORY[p.categorySlug] || COMPETITOR_BASELINE_BY_CATEGORY.powders;
    return {
      query_id: `Q-${String(idx + 1).padStart(2, '0')}`,
      bucket: 'product_sku',
      device_country: 'Mobile - Nepal (en-NP / ne-NP)',
      query: `${officialName.toLowerCase()} price in nepal`,
      nepali_roman_variant: `${nep.rom} price in Nepal / ${nep.dev}`,
      sku: p.sku,
      product_name: officialName,
      canonical_price_npr: p.price,
      canonical_weight: p.weight,
      target_url: `${BASE_URL}/products/${p.slug}`,
      who_is_above_us_baseline: comp.who_is_above_us,
      competitor_weakness: comp.weakness,
      week_1_position: '',
      week_1_ranking_url: '',
      week_2_position: '',
      week_3_position: '',
      week_4_position: '',
      notes: 'Track mobile SERP position + Rich Result price/availability snippet in Nepal',
    };
  });

  // 15 Category & Cluster Queries
  const categoryClusterRaw = [
    {
      query: 'dehydrated fruits price in nepal',
      nepali_roman_variant: 'sukako phalphul nepal / सुकाएको फलफूल मूल्य',
      target_url: `${BASE_URL}/category/dried-fruits`,
      who_is_above_us_baseline: 'Daraz Dried Fruits category & Thulo.com',
      competitor_weakness: 'Mixes candied sugar-coated imports with natural dried fruit without 0-sugar filtering',
    },
    {
      query: 'superfood powders in nepal',
      nepali_roman_variant: 'natural fruit vegetable powder kathmandu / सुपरफुड पाउडर नेपाल',
      target_url: `${BASE_URL}/category/powders`,
      who_is_above_us_baseline: 'Daraz supplement pages & Ubuy Nepal',
      competitor_weakness: 'No unified Nepal-stocked range of 8 pure fruit & vegetable powders in glass jars',
    },
    {
      query: 'dry fruits price in nepal per kg 2026',
      nepali_roman_variant: 'kaju badam pista price list nepal / ड्राइ फ्रुट्सको मूल्य सूची',
      target_url: `${BASE_URL}/blog/dry-fruits-price-in-nepal-per-100g-1kg-comparison-guide`,
      who_is_above_us_baseline: 'Outdated 2023/2024 blog posts & Asan market videos',
      competitor_weakness: 'Stale prices without per-100g normalized comparison across almonds, cashews, pistachios, figs, and berries',
    },
    {
      query: 'premium nuts and dry fruits online kathmandu',
      nepali_roman_variant: 'dry fruits home delivery kathmandu / काठमाडौँमा ड्राइ फ्रुट्स डेलिभरी',
      target_url: `${BASE_URL}/category/nuts`,
      who_is_above_us_baseline: 'Daraz & Bhatbhateni online listings',
      competitor_weakness: 'No oil-free pink-salt roasted vs raw comparison or same-day Baneshwor dispatch',
    },
    {
      query: 'chia seeds vs flax seeds in nepal',
      nepali_roman_variant: 'chia seeds ra aalas ma ke farak cha / चिया सिड्स र आलस',
      target_url: `${BASE_URL}/blog/chia-seeds-vs-flax-seeds-nepal-weight-loss-omega-3-guide`,
      who_is_above_us_baseline: 'Generic Indian health portals (1mg, HealthifyMe)',
      competitor_weakness: 'No Nepal NPR pricing, local Nepali recipes (aalas ko chhop), or direct Kathmandu order links',
    },
    {
      query: 'dates powder vs sugar for babies nepal',
      nepali_roman_variant: 'khajoor ko dhulo vs chini bacha ko lagi / खजुरको धुलो र चिनी',
      target_url: `${BASE_URL}/blog/dates-powder-vs-sugar-for-babies-nepal-guide`,
      who_is_above_us_baseline: 'Indian parenting blogs (FirstCry)',
      competitor_weakness: 'Prices in INR and unavailable brands in Nepal vs NaturesMud Rs. 400 Dates Powder (100g)',
    },
    {
      query: 'cold pressed virgin coconut oil nepal',
      nepali_roman_variant: 'shuddha nariwal ko tel kathmandu / शुद्ध नरिवलको तेल',
      target_url: `${BASE_URL}/category/oils`,
      who_is_above_us_baseline: 'Daraz Parachute / imported bottles',
      competitor_weakness: 'Refined copra oil in plastic vs unrefined cold-pressed virgin coconut oil in 180ml & 500ml sizes',
    },
    {
      query: 'superfood seeds price in nepal',
      nepali_roman_variant: 'chia pumpkin flax makhana nepal / स्वस्थ बियाँ र मखाना',
      target_url: `${BASE_URL}/category/seeds`,
      who_is_above_us_baseline: 'Daraz individual seed listings',
      competitor_weakness: 'No side-by-side seed & makhana comparison hub with per-100g unit pricing',
    },
    {
      query: 'himalayan black salt bire noon and pink salt nepal',
      nepali_roman_variant: 'bire noon ra sindhe noon nepal / बिरे नुन र सिधे नुन',
      target_url: `${BASE_URL}/category/salts-spices`,
      who_is_above_us_baseline: 'Generic grocery listings',
      competitor_weakness: 'No mineral origin explanation or authentic Nepali digestive & kitchen usage guide',
    },
    {
      query: 'healthy snacks online delivery kathmandu',
      nepali_roman_variant: 'sugar free snacks kathmandu / स्वस्थ खाजा काठमाडौँ',
      target_url: `${BASE_URL}/products`,
      who_is_above_us_baseline: 'Foodmandu / Daraz Mart processed snack pages',
      competitor_weakness: 'Ultra-processed fried snacks with palm oil vs 100% pure dehydrated fruits, roasted nuts & makhana',
    },
    {
      query: 'healthy food delivery pokhara',
      nepali_roman_variant: 'dry fruits baby food powder pokhara delivery / पोखरा डेलिभरी',
      target_url: `${BASE_URL}/locations/pokhara`,
      who_is_above_us_baseline: 'Local Pokhara Facebook pages',
      competitor_weakness: 'No full 32-SKU website catalog with transparent 24-48h Pokhara dispatch and FonePay QR checkout',
    },
    {
      query: 'healthy snacks delivery lalitpur bhaktapur',
      nepali_roman_variant: 'naturesmud delivery patan bhaktapur / ललितपुर भक्तपुर डेलिभरी',
      target_url: `${BASE_URL}/locations/lalitpur`,
      who_is_above_us_baseline: 'Generic courier pages',
      competitor_weakness: 'No dedicated Valley same/next-day COD & Rs. 100 flat delivery breakdown',
    },
    {
      query: 'how to store dry fruits and powders in monsoon nepal',
      nepali_roman_variant: 'barkha ma dry fruits kasari rakhne / बर्खामा ड्राइ फ्रुट्स जोगाउने तरिका',
      target_url: `${BASE_URL}/blog/how-to-store-dry-fruits-seeds-powders-monsoon-nepal`,
      who_is_above_us_baseline: 'General international kitchen blogs',
      competitor_weakness: 'Not tailored to Nepal monsoon humidity (Asar-Bhadra) or zero-preservative fruit powders',
    },
    {
      query: 'wholesale dry fruits and superfood powders kathmandu',
      nepali_roman_variant: 'bulk superfood supplier cafes gyms kathmandu / होलसेल ड्राइ फ्रुट्स',
      target_url: `${BASE_URL}/wholesale`,
      who_is_above_us_baseline: 'Offline Asan/Kalimati traders without digital catalog',
      competitor_weakness: 'No downloadable B2B catalog PDF, PAN invoice readiness, or cafe/Montessori supply packages',
    },
    {
      query: 'naturesmud nepal',
      nepali_roman_variant: 'natures mud shop kathmandu / नेचर्स मड नेपाल',
      target_url: `${BASE_URL}/`,
      who_is_above_us_baseline: 'NaturesMud Owned Properties (Site, GBP, Instagram, Facebook, Daraz)',
      competitor_weakness: 'Goal: Own 100% of Page 1 brand SERP slots across website, GBP, Instagram, Facebook, YouTube & Daraz',
    },
  ];

  const categoryRows = categoryClusterRaw.map((item, i) => ({
    query_id: `Q-${String(productRows.length + i + 1).padStart(2, '0')}`,
    bucket: 'category_cluster',
    device_country: 'Mobile - Nepal (en-NP / ne-NP)',
    query: item.query,
    nepali_roman_variant: item.nepali_roman_variant,
    sku: 'CLUSTER',
    product_name: 'Category / Pillar Hub',
    canonical_price_npr: '',
    canonical_weight: '',
    target_url: item.target_url,
    who_is_above_us_baseline: item.who_is_above_us_baseline,
    competitor_weakness: item.competitor_weakness,
    week_1_position: '',
    week_1_ranking_url: '',
    week_2_position: '',
    week_3_position: '',
    week_4_position: '',
    notes: 'Category & topical cluster hub tracking',
  }));

  // 13 Baby, Gift & Fitness Queries (32 + 15 + 13 = 60 total queries)
  const babyGiftFitnessRaw = [
    {
      query: '6 month baby food chart nepal jaulo lito',
      nepali_roman_variant: '6 mahina ko bacha ko khana talika / ६ महिनाको बच्चाको खाना तालिका',
      target_url: `${BASE_URL}/blog/baby-food-nepal-6-months-chart-weaning-guide`,
      who_is_above_us_baseline: 'Generic hospital PDFs & Indian parenting sites',
      competitor_weakness: 'Does not integrate ready-to-stir 100% pure Dates, Sweet Potato, Banana & Carrot powders for Nepali jaulo/lito',
    },
    {
      query: 'dates powder for 6 month baby in nepal',
      nepali_roman_variant: 'bacha ko lagi khajoor ko dhulo / बच्चाको लागि खजुरको धुलो',
      target_url: `${BASE_URL}/products/dates-powder`,
      who_is_above_us_baseline: 'Daraz imported baby food listings',
      competitor_weakness: 'High price and long delivery time vs NaturesMud Rs. 400 Dates Powder (100g) in Kathmandu',
    },
    {
      query: 'sweet potato porridge recipe for 6 month baby nepal',
      nepali_roman_variant: 'bacha ko lagi sakarkhanda ko jaulo / सखरखण्डको लिटो जाउलो रेसिपी',
      target_url: `${BASE_URL}/recipes/5-minute-sweet-potato-dates-baby-porridge-100g`,
      who_is_above_us_baseline: 'YouTube home cooking videos without exact measurements',
      competitor_weakness: 'Requires 30-minute boiling/mashing vs 5-minute NaturesMud Sweet Potato + Dates Powder recipe with Recipe schema',
    },
    {
      query: 'raw banana powder for baby weight gain nepal',
      nepali_roman_variant: 'bacha ko taul badhaune kera ko dhulo / केराको धुलो बच्चाको लागि',
      target_url: `${BASE_URL}/blog/banana-powder-in-nepal-baby-food-smoothies-baking-guide`,
      who_is_above_us_baseline: 'Imported Kerala banana powder on Daraz',
      competitor_weakness: 'No Nepali lito/milkshake recipes or verified 0-additive assurance',
    },
    {
      query: 'healthy school tiffin ideas for kids in nepal',
      nepali_roman_variant: 'bacha ko school khaja recipe nepal / स्कुल टिफिन आइडिया',
      target_url: `${BASE_URL}/blog/healthy-tiffin-ideas-for-kids-nepal-no-junk-food`,
      who_is_above_us_baseline: 'Indian mom blogs',
      competitor_weakness: 'Uses ingredients unavailable in Nepal instead of dehydrated mango, apple rings, makhana, and dates energy balls',
    },
    {
      query: 'pregnancy and sutkeri nutrition dry fruits nepal',
      nepali_roman_variant: 'sutkeri masala dry fruits nepal / सुत्केरी पोषण ड्राइ फ्रुट्स',
      target_url: `${BASE_URL}/blog/pregnancy-postpartum-sutkeri-nutrition-foods-nepal`,
      who_is_above_us_baseline: 'Facebook posts & traditional shop listings',
      competitor_weakness: 'Heavily sugared gudpak vs clean almonds, figs (anjeer), makhana, dates powder & cold-pressed coconut oil',
    },
    {
      query: 'beetroot powder for pre workout stamina nepal',
      nepali_roman_variant: 'gym pre workout chukandar powder nepal / जिम स्टामिना चुकन्दर पाउडर',
      target_url: `${BASE_URL}/blog/how-to-use-beetroot-powder-in-nepal-stamina-skin-recipes`,
      who_is_above_us_baseline: 'Synthetic caffeinated pre-workout tubs (Rs. 4,500+)',
      competitor_weakness: 'Artificial stimulants & jitters vs natural dietary nitrate Beetroot Powder at Rs. 430 (100g)',
    },
    {
      query: 'moringa leaf powder daily use benefits nepal',
      nepali_roman_variant: 'sajyun ko dhulo kasari khane / शीतलचिनी पाउडर खाने तरिका',
      target_url: `${BASE_URL}/blog/moringa-powder-benefits-nepal-how-to-use-daily`,
      who_is_above_us_baseline: 'Generic health articles with exaggerated cure claims',
      competitor_weakness: 'Overpromised medical claims vs NaturesMud honest nutritional table & dal/roti/warm-water usage guide',
    },
    {
      query: 'best trekking and gym snacks in nepal',
      nepali_roman_variant: 'trekking trail mix dry fruits nepal / ट्रेकिङ र जिम खाजा',
      target_url: `${BASE_URL}/blog/trekking-and-gym-snacks-nepal-lightweight-energy-foods`,
      who_is_above_us_baseline: 'Thamel gear blog posts mentioning chocolate bars',
      competitor_weakness: 'Melts in backpack and causes sugar crash vs Mix Dry Nuts (Rs. 699/200g) & Dehydrated Mango',
    },
    {
      query: 'healthy dashain tihar dry fruit gift box nepal',
      nepali_roman_variant: 'tihar bhai masala dry fruit gift kathmandu / तिहार भाइमसला गिफ्ट',
      target_url: `${BASE_URL}/blog/healthy-dashain-tihar-bhai-masala-gift-guide-nepal`,
      who_is_above_us_baseline: 'Seasonal sweet shops & Daraz gift hampers',
      competitor_weakness: 'Low-grade stale nuts in flashy cardboard vs glass-jar whole almonds, cashews, pistachios, macadamia & figs',
    },
    {
      query: 'sugar free festival sweets recipe nepal',
      nepali_roman_variant: 'chini bina ko laddu barfi recipe / चिनी बिनाको मिठाई लड्डु',
      target_url: `${BASE_URL}/blog/sugar-free-festive-sweets-nepal-dates-powder-dry-fruit-ladoo`,
      who_is_above_us_baseline: 'Indian YouTube channels',
      competitor_weakness: 'No exact gram-to-NPR breakdown using NaturesMud Dates Powder, Anjeer & Roasted Nuts',
    },
    {
      query: 'how to identify pure shilajit in nepal lab report',
      nepali_roman_variant: 'shuddha shilajit chine tarika nepal / शुद्ध शिलाजीत चिन्ने तरिका',
      target_url: `${BASE_URL}/blog/shilajit-buyers-guide-nepal-how-to-read-lab-report-price`,
      who_is_above_us_baseline: 'Instagram ads using fake flame/water tricks',
      competitor_weakness: 'Relies on theatrical fire tricks instead of educating buyers on heavy-metal (Pb, As, Hg, Cd) COA lab testing',
    },
    {
      query: 'healthy bundle offers dry fruits baby food nepal',
      nepali_roman_variant: 'naturesmud combo offer kathmandu / नेचर्स मड कम्बो अफर',
      target_url: `${BASE_URL}/offers`,
      who_is_above_us_baseline: 'Daraz flash sale pages',
      competitor_weakness: 'Fake inflated strikethrough prices vs transparent NaturesMud dated seasonal offers & coupon codes',
    },
  ];

  const babyGiftFitnessRows = babyGiftFitnessRaw.map((item, i) => ({
    query_id: `Q-${String(productRows.length + categoryRows.length + i + 1).padStart(2, '0')}`,
    bucket: 'baby_gift_fitness',
    device_country: 'Mobile - Nepal (en-NP / ne-NP)',
    query: item.query,
    nepali_roman_variant: item.nepali_roman_variant,
    sku: 'INTENT_CLUSTER',
    product_name: 'Use-Case / Pillar Guide',
    canonical_price_npr: '',
    canonical_weight: '',
    target_url: item.target_url,
    who_is_above_us_baseline: item.who_is_above_us_baseline,
    competitor_weakness: item.competitor_weakness,
    week_1_position: '',
    week_1_ranking_url: '',
    week_2_position: '',
    week_3_position: '',
    week_4_position: '',
    notes: 'High-intent commercial & informational cluster tracking',
  }));

  return [...productRows, ...categoryRows, ...babyGiftFitnessRows];
}

function buildAiCitationTracker() {
  const prompts = [
    {
      prompt_id: 'AI-01',
      intent_type: 'Brand & Entity Grounding',
      prompt: 'What is NaturesMud Nepal, where are they located, and what categories of products do they sell?',
      expected_cited_url: `${BASE_URL}/about`,
      expected_product_names: 'All 6 canonical categories: Powders, Dehydrated Fruits, Nuts, Seeds, Cold-Pressed Oils, Himalayan Salts & Shilajit',
      expected_prices_npr: 'NPR 220 to NPR 1,999 across 32 SKUs',
      expected_weights: '20 GM to 500 ML',
      grounding_source: `${BASE_URL}/llms.txt & ${BASE_URL}/api/entities`,
    },
    {
      prompt_id: 'AI-02',
      intent_type: 'Buying — Baby Weaning',
      prompt: 'Where can I buy 100% pure Dates Powder for a 6-month-old baby in Kathmandu, Nepal, and what is the price for 100g?',
      expected_cited_url: `${BASE_URL}/products/dates-powder`,
      expected_product_names: 'Dates Powder (खजुरको धुलो)',
      expected_prices_npr: 'Rs. 400',
      expected_weights: '100 GM',
      grounding_source: `${BASE_URL}/products/dates-powder (Product JSON-LD & llms.txt)`,
    },
    {
      prompt_id: 'AI-03',
      intent_type: 'Buying — Baby Weaning',
      prompt: 'Which Nepali brand sells pure Sweet Potato Powder and Banana Powder for baby jaulo and lito, and how much do they cost?',
      expected_cited_url: `${BASE_URL}/products/sweet-potato-powder`,
      expected_product_names: 'Sweet Potato Powder, Banana Powder',
      expected_prices_npr: 'Sweet Potato Powder: Rs. 510 | Banana Powder: Rs. 450',
      expected_weights: '100 GM each',
      grounding_source: `${BASE_URL}/category/powders & ${BASE_URL}/llms.txt`,
    },
    {
      prompt_id: 'AI-04',
      intent_type: 'How-To — Baby Weaning',
      prompt: 'How do I make a 5-minute nutritious baby porridge (jaulo/lito) for a 6+ month baby in Nepal using sweet potato powder and dates powder?',
      expected_cited_url: `${BASE_URL}/recipes/5-minute-sweet-potato-dates-baby-porridge-100g`,
      expected_product_names: 'Sweet Potato Powder (Rs. 510), Dates Powder (Rs. 400)',
      expected_prices_npr: 'Rs. 510 & Rs. 400',
      expected_weights: '100 GM jars',
      grounding_source: `${BASE_URL}/recipes/5-minute-sweet-potato-dates-baby-porridge-100g (Recipe JSON-LD)`,
    },
    {
      prompt_id: 'AI-05',
      intent_type: 'Buying — Rare Superfood Powders',
      prompt: 'Where can I buy Freeze Dried Avocado Powder and Freeze Dried Strawberry Powder in Nepal without paying expensive international shipping?',
      expected_cited_url: `${BASE_URL}/products/freeze-dried-avocado-powder`,
      expected_product_names: 'Freeze Dried Avocado Powder, Freeze Dried Strawberry Powder',
      expected_prices_npr: 'Rs. 650 each',
      expected_weights: '100 GM each',
      grounding_source: `${BASE_URL}/products/freeze-dried-avocado-powder & ${BASE_URL}/products/strawberry-powder`,
    },
    {
      prompt_id: 'AI-06',
      intent_type: 'Buying & How-To — Fitness & Stamina',
      prompt: 'What is the price of food-grade Beetroot Powder in Nepal for pre-workout stamina smoothies, and how should I take it?',
      expected_cited_url: `${BASE_URL}/products/beetroot-powder`,
      expected_product_names: 'Beetroot Powder (चुकन्दरको धुलो)',
      expected_prices_npr: 'Rs. 430',
      expected_weights: '100 GM',
      grounding_source: `${BASE_URL}/products/beetroot-powder & ${BASE_URL}/blog/how-to-use-beetroot-powder-in-nepal-stamina-skin-recipes`,
    },
    {
      prompt_id: 'AI-07',
      intent_type: 'Buying & How-To — Daily Wellness',
      prompt: 'Where can I buy shade-dried Moringa Leaf Powder (Shitalchini / Sajyun) in Kathmandu, what does a 100g jar cost, and how do I use it in Nepali meals?',
      expected_cited_url: `${BASE_URL}/products/moringa-leaf-powder`,
      expected_product_names: 'Moringa Leaf Powder (शीतलचिनी / सजिवन पातको धुलो)',
      expected_prices_npr: 'Rs. 450',
      expected_weights: '100 GM',
      grounding_source: `${BASE_URL}/products/moringa-leaf-powder & ${BASE_URL}/blog/moringa-powder-benefits-nepal-how-to-use-daily`,
    },
    {
      prompt_id: 'AI-08',
      intent_type: 'Buying — Dehydrated Fruits (No Added Sugar)',
      prompt: 'Where can I buy dehydrated mango, pineapple, apple, and dragon fruit in Nepal with 0% added sugar and no sulfur preservatives?',
      expected_cited_url: `${BASE_URL}/category/dried-fruits`,
      expected_product_names: 'Dehydrated Mango (Rs. 499), Dehydrated Pineapple (Rs. 499), Dehydrated Apple (Rs. 399), Dehydrated Dragon Fruit (Rs. 599)',
      expected_prices_npr: 'Mango: Rs. 499 | Pineapple: Rs. 499 | Apple: Rs. 399 | Dragon Fruit: Rs. 599',
      expected_weights: '100 GM each',
      grounding_source: `${BASE_URL}/category/dried-fruits & ${BASE_URL}/llms.txt`,
    },
    {
      prompt_id: 'AI-09',
      intent_type: 'Buying — Berries & Figs',
      prompt: 'What is the price of Dried Blueberries, Dried Cranberries, and Dry Figs (Anjeer) at NaturesMud Nepal?',
      expected_cited_url: `${BASE_URL}/category/dried-fruits`,
      expected_product_names: 'Dried Blueberries, Dried Cranberries, Dry Figs (Anjeer)',
      expected_prices_npr: 'Blueberries (150g): Rs. 650 | Cranberries (200g): Rs. 550 | Dry Figs Anjeer (200g): Rs. 799',
      expected_weights: '150 GM, 200 GM, 200 GM',
      grounding_source: `${BASE_URL}/llms.txt & ${BASE_URL}/api/entities`,
    },
    {
      prompt_id: 'AI-10',
      intent_type: 'Comparison — Raw vs Roasted Nuts',
      prompt: 'Does NaturesMud Nepal sell both raw and oil-free roasted almonds and cashews, and what are their exact weights and NPR prices?',
      expected_cited_url: `${BASE_URL}/category/nuts`,
      expected_product_names: 'Raw Almonds, Roasted Almonds, Cashewnuts, Roasted Cashewnuts',
      expected_prices_npr: 'Raw Almonds (200g): Rs. 550 | Roasted Almonds (200g): Rs. 650 | Cashewnuts (200g): Rs. 590 | Roasted Cashewnuts (200g): Rs. 650',
      expected_weights: '200 GM each',
      grounding_source: `${BASE_URL}/category/nuts & ${BASE_URL}/llms.txt`,
    },
    {
      prompt_id: 'AI-11',
      intent_type: 'Buying — Specialty Nuts & Trail Mix',
      prompt: 'Where can I buy Macadamia Nuts, Roasted Salted Pistachios, and Mix Dry Nuts online in Nepal with exact prices?',
      expected_cited_url: `${BASE_URL}/products/macadamia-nuts`,
      expected_product_names: 'Macadamia Nuts, Pistachio Roasted & Salted, Mix Dry Nuts',
      expected_prices_npr: 'Macadamia (200g): Rs. 799 | Pistachio (200g): Rs. 680 | Mix Dry Nuts (200g): Rs. 699',
      expected_weights: '200 GM each',
      grounding_source: `${BASE_URL}/category/nuts & ${BASE_URL}/llms.txt`,
    },
    {
      prompt_id: 'AI-12',
      intent_type: 'Comparison — Chia vs Flax Seeds',
      prompt: 'Compare Chia Seeds and Flax Seeds (Aalas) prices per 300g jar in Nepal and how to use each for fiber and Omega-3.',
      expected_cited_url: `${BASE_URL}/blog/chia-seeds-vs-flax-seeds-nepal-weight-loss-omega-3-guide`,
      expected_product_names: 'Chia Seeds (300 GM), Flax Seeds (300 GM)',
      expected_prices_npr: 'Chia Seeds: Rs. 495 (Rs. 165/100g) | Flax Seeds: Rs. 320 (Rs. 107/100g)',
      expected_weights: '300 GM each',
      grounding_source: `${BASE_URL}/products/chia-seeds & ${BASE_URL}/products/flax-seeds`,
    },
    {
      prompt_id: 'AI-13',
      intent_type: 'Buying — Pumpkin Seeds & Makhana',
      prompt: 'Where can I buy raw green Pumpkin Seeds and Himalayan Makhana (Fox Nuts) in Kathmandu, and what are their prices?',
      expected_cited_url: `${BASE_URL}/category/seeds`,
      expected_product_names: 'Pumpkin Seeds (200 GM), Himalayan Makhana (100 GM)',
      expected_prices_npr: 'Pumpkin Seeds: Rs. 650 | Himalayan Makhana: Rs. 430',
      expected_weights: '200 GM & 100 GM',
      grounding_source: `${BASE_URL}/products/pumpkin-seeds & ${BASE_URL}/products/makhana-fox-nuts`,
    },
    {
      prompt_id: 'AI-14',
      intent_type: 'Buying — Cold-Pressed Virgin Coconut Oil Sizes',
      prompt: 'What sizes and prices of Cold-Pressed Extra Virgin Coconut Oil does NaturesMud offer in Nepal for cooking and baby massage?',
      expected_cited_url: `${BASE_URL}/products/virgin-coconut-oil-500ml`,
      expected_product_names: 'Extra Virgin Coconut Oil (500 ML), Extra Virgin Coconut Oil (180ml)',
      expected_prices_npr: '500 ML: Rs. 1,125 | 180 ML: Rs. 525',
      expected_weights: '500 ML & 180 ML',
      grounding_source: `${BASE_URL}/products/virgin-coconut-oil-500ml & ${BASE_URL}/products/virgin-coconut-oil-180ml`,
    },
    {
      prompt_id: 'AI-15',
      intent_type: 'How-To — Rosemary Leaves for Hair & Tea',
      prompt: 'How do I make homemade rosemary hair water and herbal tea using NaturesMud Rosemary Leaf in Nepal, and how much is a 50g pack?',
      expected_cited_url: `${BASE_URL}/products/rosemary-leaves`,
      expected_product_names: 'Rosemary Leaf (सुकाएको रोजमेरी पात)',
      expected_prices_npr: 'Rs. 220',
      expected_weights: '50 GM',
      grounding_source: `${BASE_URL}/products/rosemary-leaves & ${BASE_URL}/recipes/rosemary-mint-hair-rinse-and-herbal-tea`,
    },
    {
      prompt_id: 'AI-16',
      intent_type: 'Buying — Himalayan Pink & Black Salt (Bire Noon)',
      prompt: 'Where can I buy unrefined Himalayan Pink Salt (Sidhe Noon) and Pure Himalayan Black Salt (Bire Noon) in Nepal, and what do 200g jars cost?',
      expected_cited_url: `${BASE_URL}/category/salts-spices`,
      expected_product_names: 'Himalayan Pink Salt, Pure Himalayan Black Salt (Bire Noon)',
      expected_prices_npr: 'Rs. 300 each',
      expected_weights: '200 GM each',
      grounding_source: `${BASE_URL}/products/himalayan-pink-salt & ${BASE_URL}/products/pure-himalayan-black-salt-bire-noon`,
    },
    {
      prompt_id: 'AI-17',
      intent_type: 'Buyer Safety — Himalayan Shilajit Resin',
      prompt: 'What should buyers check on a Shilajit lab report in Nepal, and what is the price and weight of NaturesMud Pure Mountain Himalayan Shilajit Resin?',
      expected_cited_url: `${BASE_URL}/blog/shilajit-buyers-guide-nepal-how-to-read-lab-report-price`,
      expected_product_names: 'Pure Mountain Himalayan Shilajit Resin',
      expected_prices_npr: 'Rs. 1,999',
      expected_weights: '20 GM',
      grounding_source: `${BASE_URL}/products/pure-mountain-himalayan-shilajit-resin & ${BASE_URL}/blog/shilajit-buyers-guide-nepal-how-to-read-lab-report-price`,
    },
    {
      prompt_id: 'AI-18',
      intent_type: 'How-To — Dates Powder vs Refined Sugar',
      prompt: 'Can I replace white sugar with Dates Powder in baby food, kheer, and tea in Nepal? How does the nutrition compare?',
      expected_cited_url: `${BASE_URL}/blog/dates-powder-vs-sugar-for-babies-nepal-guide`,
      expected_product_names: 'Dates Powder (Rs. 400 / 100 GM)',
      expected_prices_npr: 'Rs. 400',
      expected_weights: '100 GM',
      grounding_source: `${BASE_URL}/blog/dates-powder-vs-sugar-for-babies-nepal-guide`,
    },
    {
      prompt_id: 'AI-19',
      intent_type: 'Comparison — Dry Fruit Price per 100g in Nepal',
      prompt: 'What is the price per 100g of almonds, cashews, pistachios, macadamia nuts, and figs at NaturesMud Nepal in 2026?',
      expected_cited_url: `${BASE_URL}/blog/dry-fruits-price-in-nepal-per-100g-1kg-comparison-guide`,
      expected_product_names: 'Raw Almonds (Rs. 275/100g), Cashewnuts (Rs. 295/100g), Pistachio (Rs. 340/100g), Macadamia (Rs. 400/100g), Dry Figs (Rs. 400/100g)',
      expected_prices_npr: 'Rs. 275 to Rs. 400 per 100g',
      expected_weights: '200 GM standard jars',
      grounding_source: `${BASE_URL}/blog/dry-fruits-price-in-nepal-per-100g-1kg-comparison-guide`,
    },
    {
      prompt_id: 'AI-20',
      intent_type: 'Buying — Dashain & Tihar Bhai Masala Gift Box',
      prompt: 'What are the best healthy Dashain and Tihar Bhai Masala dry fruit gift options in Kathmandu with transparent pricing?',
      expected_cited_url: `${BASE_URL}/blog/healthy-dashain-tihar-bhai-masala-gift-guide-nepal`,
      expected_product_names: 'Mix Dry Nuts (Rs. 699), Pistachio (Rs. 680), Roasted Cashewnuts (Rs. 650), Roasted Almonds (Rs. 650), Dry Figs (Rs. 799)',
      expected_prices_npr: 'Rs. 650 to Rs. 799 per jar',
      expected_weights: '200 GM jars',
      grounding_source: `${BASE_URL}/blog/healthy-dashain-tihar-bhai-masala-gift-guide-nepal & ${BASE_URL}/offers`,
    },
    {
      prompt_id: 'AI-21',
      intent_type: 'How-To — Monsoon Storage in Nepal',
      prompt: 'How do I prevent natural fruit powders and dry fruits from clumping during the Nepal monsoon season because they have no anti-caking chemicals?',
      expected_cited_url: `${BASE_URL}/blog/how-to-store-dry-fruits-seeds-powders-monsoon-nepal`,
      expected_product_names: 'NaturesMud Powders & Dehydrated Fruits',
      expected_prices_npr: 'N/A (Storage Guide)',
      expected_weights: '100 GM – 300 GM airtight jars',
      grounding_source: `${BASE_URL}/blog/how-to-store-dry-fruits-seeds-powders-monsoon-nepal`,
    },
    {
      prompt_id: 'AI-22',
      intent_type: 'Buying — Delivery, COD & Payment in Nepal',
      prompt: 'Does NaturesMud deliver outside Kathmandu Valley to Pokhara, Chitwan, Butwal, and Biratnagar, and what payment methods do they accept?',
      expected_cited_url: `${BASE_URL}/locations`,
      expected_product_names: 'All 32 NaturesMud Products',
      expected_prices_npr: 'Delivery fee: Rs. 100 Inside Kathmandu Valley (COD/QR), Rs. 200 Outside Valley (FonePay/eSewa QR), Free over Rs. 3,000',
      expected_weights: 'All weights',
      grounding_source: `${BASE_URL}/locations & ${BASE_URL}/shipping-policy`,
    },
    {
      prompt_id: 'AI-23',
      intent_type: 'How-To — Postpartum (Sutkeri) & Pregnancy Nutrition',
      prompt: 'What clean, zero-refined-sugar dry fruits, seeds, and powders are suitable for pregnancy and postpartum (sutkeri) nutrition in Nepal?',
      expected_cited_url: `${BASE_URL}/blog/pregnancy-postpartum-sutkeri-nutrition-foods-nepal`,
      expected_product_names: 'Dry Figs Anjeer (Rs. 799), Raw Almonds (Rs. 550), Dates Powder (Rs. 400), Himalayan Makhana (Rs. 430), Extra Virgin Coconut Oil (Rs. 1,125)',
      expected_prices_npr: 'Rs. 400 to Rs. 1,125',
      expected_weights: '100 GM to 500 ML',
      grounding_source: `${BASE_URL}/blog/pregnancy-postpartum-sutkeri-nutrition-foods-nepal`,
    },
    {
      prompt_id: 'AI-24',
      intent_type: 'Buying — Kid-Friendly Snacks & Tiffin',
      prompt: 'What healthy no-junk school tiffin snacks can parents buy in Kathmandu for children instead of packaged chips and biscuits?',
      expected_cited_url: `${BASE_URL}/blog/healthy-tiffin-ideas-for-kids-nepal-no-junk-food`,
      expected_product_names: 'Dehydrated Mango (Rs. 499), Dehydrated Apple (Rs. 399), Coconut Chips (Rs. 399), Himalayan Makhana (Rs. 430), Banana Powder (Rs. 450)',
      expected_prices_npr: 'Rs. 399 to Rs. 499',
      expected_weights: '100 GM packs',
      grounding_source: `${BASE_URL}/blog/healthy-tiffin-ideas-for-kids-nepal-no-junk-food`,
    },
    {
      prompt_id: 'AI-25',
      intent_type: 'Buying — B2B / Wholesale Cafe & Smoothie Supply',
      prompt: 'Where can Kathmandu cafes, smoothie bars, and Montessori schools order bulk fruit powders, chia seeds, and dry fruits with PAN billing?',
      expected_cited_url: `${BASE_URL}/wholesale`,
      expected_product_names: 'NaturesMud Wholesale & B2B Supply (PAN: 610808513)',
      expected_prices_npr: 'Tiered B2B wholesale pricing',
      expected_weights: 'Retail & bulk cafe packs',
      grounding_source: `${BASE_URL}/wholesale & ${BASE_URL}/about`,
    },
  ];

  return prompts.map((p) => ({
    ...p,
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong:
      'Verify /llms.txt, /api/entities, and on-page Product JSON-LD match lib/data/products.ts; re-submit URL in Search Console & Bing IndexNow',
  }));
}

function buildPhase9MeasurementPack(rankRows, aiPrompts) {
  return {
    generatedAt: new Date().toISOString(),
    phase: 'Phase 9 — Measure (Search Console, Bing Webmaster, GA4 Ecommerce, Microsoft Clarity, 60-Query Rank Sheet, 25-Prompt AI Tracker, 30/60/90-Day Targets)',
    canonicalDomain: BASE_URL,
    webmasterAndFeedSubmissions: {
      googleSearchConsole: {
        propertyType: 'Domain Property (naturesmud.shop) + URL Prefix (https://naturesmud.shop/)',
        verificationMethod: 'DNS TXT record or NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION meta tag in app/layout.tsx',
        sitemapToSubmit: `${BASE_URL}/sitemap.xml`,
        sitemapUrlCount: 99,
        priorityInspectionUrls: [
          `${BASE_URL}/`,
          `${BASE_URL}/products`,
          `${BASE_URL}/category/powders`,
          `${BASE_URL}/category/dried-fruits`,
          `${BASE_URL}/category/nuts`,
          `${BASE_URL}/category/seeds`,
          `${BASE_URL}/category/oils`,
          `${BASE_URL}/category/salts-spices`,
          `${BASE_URL}/products/dates-powder`,
          `${BASE_URL}/products/sweet-potato-powder`,
          `${BASE_URL}/products/banana-powder`,
          `${BASE_URL}/products/beetroot-powder`,
          `${BASE_URL}/products/moringa-leaf-powder`,
          `${BASE_URL}/blog/baby-food-nepal-6-months-chart-weaning-guide`,
          `${BASE_URL}/blog/dry-fruits-price-in-nepal-per-100g-1kg-comparison-guide`,
        ],
      },
      bingWebmasterTools: {
        verificationMethod: 'Import from Google Search Console OR NEXT_PUBLIC_BING_VERIFICATION (msvalidate.01) meta tag in app/layout.tsx',
        sitemapToSubmit: `${BASE_URL}/sitemap.xml`,
        aiGroundingImportance: 'Powers ChatGPT Search, Microsoft Copilot, and DuckDuckGo indexation for Nepal queries',
      },
      aiAndShoppingFeeds: {
        llmsTxtUrl: `${BASE_URL}/llms.txt`,
        entitiesJsonLdUrl: `${BASE_URL}/api/entities/products`,
        googleMerchantXmlFeedUrl: `${BASE_URL}/merchant-feed.xml`,
        metaCatalogXmlFeedUrl: `${BASE_URL}/meta-catalog-feed.xml`,
        metaCatalogCsvFeedUrl: `${BASE_URL}/meta-catalog-feed.csv`,
      },
    },
    analyticsAndHeatmapSetup: {
      ga4: {
        envVar: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
        currency: 'NPR',
        implementedEvents: [
          {
            event: 'view_item',
            triggerLocation: 'components/ProductViewTracker.tsx on /products/[slug]',
            parameters: ['currency (NPR)', 'value', 'items[item_id, item_name, item_category, item_variant, price, quantity]'],
          },
          {
            event: 'add_to_cart',
            triggerLocation: 'lib/store/cart-store.ts (addItem)',
            parameters: ['currency (NPR)', 'value', 'items[item_id, item_name, price, quantity]'],
          },
          {
            event: 'remove_from_cart',
            triggerLocation: 'lib/store/cart-store.ts (removeItem)',
            parameters: ['currency (NPR)', 'items[item_id]'],
          },
          {
            event: 'begin_checkout',
            triggerLocation: 'app/checkout/page.tsx (mount with non-empty cart)',
            parameters: ['currency (NPR)', 'value', 'items[item_id, item_name, item_category, price, quantity]'],
          },
          {
            event: 'coupon_apply',
            triggerLocation: 'app/checkout/page.tsx (handleApplyCoupon)',
            parameters: ['currency (NPR)', 'coupon', 'discount_amount', 'value'],
          },
          {
            event: 'purchase',
            triggerLocation: 'app/checkout/page.tsx (handleSubmit success, deduplicated via sessionStorage nm_tracked_purchase_${order_number})',
            parameters: ['currency (NPR)', 'transaction_id', 'value', 'shipping', 'discount', 'coupon', 'payment_type', 'items'],
          },
          {
            event: 'whatsapp_click',
            triggerLocation: 'components/AnalyticsTracker.tsx (global delegated listener on all wa.me / api.whatsapp.com links)',
            parameters: ['currency (NPR)', 'link_url', 'link_text', 'page_path'],
          },
        ],
      },
      microsoftClarity: {
        envVar: 'NEXT_PUBLIC_CLARITY_PROJECT_ID',
        loaderComponent: 'components/AnalyticsTracker.tsx',
        customTagsForwarded: ['view_item', 'add_to_cart', 'begin_checkout', 'coupon_apply', 'purchase', 'whatsapp_click', 'transaction_id'],
        weeklyReviewFocus: [
          'Mobile rage clicks & dead clicks on /products/[slug] and /checkout',
          'Scroll depth on 12 pillar guides (/blog/[slug]) and recipe cards (/recipes/[slug])',
          'Checkout drop-off between Inside Valley COD vs Outside Valley FonePay QR receipt upload',
        ],
      },
    },
    baselineAnd30_60_90DayTargets: {
      methodologyNote:
        'Record a clean 14-day baseline in Google Search Console, Bing Webmaster Tools, GA4, and GBP immediately after sitemap submission. The 30/60/90-day figures below are operational measurement targets benchmarked against the 2-week baseline (not guaranteed ranking promises).',
      kpis: [
        {
          metric: 'Indexed Canonical Pages (Google Search Console)',
          twoWeekBaselineProtocol: 'Record valid indexed URLs out of 99 canonical sitemap URLs after Day 14',
          day30Target: '80 - 90 indexed canonical pages (100% of 32 SKUs + 6 category hubs + top pillars)',
          day60Target: '92 - 99 indexed canonical pages (all 32 SKUs, 28 blogs, 18 recipes, 11 city hubs)',
          day90Target: '99/99 canonical URLs indexed with 0 duplicate/redirect/404 coverage errors',
        },
        {
          metric: 'Search Console Impressions (28-Day Rolling, Nepal)',
          twoWeekBaselineProtocol: 'Multiply 14-day post-indexation impressions by 2x for 28-day baseline (B_imp)',
          day30Target: '1.5x - 2.0x over 2-week baseline pace as all 32 Product & 6 Category schemas enter SERPs',
          day60Target: '3.0x - 4.0x over baseline pace driven by baby weaning, powder, and dry-fruit comparison clusters',
          day90Target: '5.0x - 7.0x over baseline pace across English + Roman Nepali + Devanagari queries',
        },
        {
          metric: 'Search Console Organic Clicks (28-Day Rolling, Nepal)',
          twoWeekBaselineProtocol: 'Record 14-day organic clicks + baseline CTR% (B_clicks)',
          day30Target: '1.5x over baseline pace with >= 3.5% average CTR from NPR price & stock rich snippets',
          day60Target: '2.5x - 3.5x over baseline pace with >= 4.2% average CTR across product & recipe pages',
          day90Target: '4.5x - 6.0x over baseline pace with >= 4.8% average CTR',
        },
        {
          metric: 'Tracked Queries in Top-3 / Top-10 (out of 60 Nepal Mobile Queries)',
          twoWeekBaselineProtocol: 'Log initial positions for all 60 queries in weekly-rank-tracker-60-queries.csv on Day 1 & Day 14',
          day30Target: '5 - 8 queries in Top-3 (brand + rare SKUs: Avocado, Strawberry, Sweet Potato, Dates Powder) | 18+ in Top-10',
          day60Target: '12 - 18 queries in Top-3 (baby weaning cluster + core powders & dehydrated fruits) | 32+ in Top-10',
          day90Target: '22 - 30 queries in Top-3 across product, category & baby/gift/fitness buckets | 45+ in Top-10',
        },
        {
          metric: 'Monthly Organic Website + WhatsApp-Assisted Orders (GA4 purchase + whatsapp_click)',
          twoWeekBaselineProtocol: 'Record 14-day organic checkout purchases + organic product-page WhatsApp order clicks',
          day30Target: '+25% to +40% lift over 2-week baseline run-rate',
          day60Target: '+60% to +90% lift over baseline run-rate (assisted by blog/recipe -> product internal funnels)',
          day90Target: '+120% to +180% lift over baseline run-rate',
        },
        {
          metric: 'Verified Order-Tied Customer Reviews Collected (with Photo & City Tag)',
          twoWeekBaselineProtocol: 'Count verified reviews via /track-order WhatsApp review flow during first 14 days',
          day30Target: '15 - 25 new verified order-tied reviews across top 10 bestseller SKUs',
          day60Target: '40 - 60 cumulative verified reviews covering at least 20 of 32 canonical SKUs',
          day90Target: '80 - 110+ cumulative verified reviews covering all 32 SKUs (unlocking organic AggregateRating on every SKU)',
        },
        {
          metric: 'Google Business Profile (GBP) Monthly Actions (Calls, Website Clicks, Direction/Delivery Inquiries)',
          twoWeekBaselineProtocol: 'Record 14-day GBP Insights interactions after uploading the 32 GBP products from gbp-optimization-pack.json',
          day30Target: '32/32 GBP products live + 4 weekly posts published -> +30% GBP website & WhatsApp/call actions',
          day60Target: '8 weekly posts + 10 seeded Q&As + 20 GBP photo reviews -> +75% GBP actions',
          day90Target: '12 weekly posts + 40+ GBP reviews -> +150% GBP actions & Page-1 Local Pack presence in Kathmandu Valley',
        },
        {
          metric: 'AI Answer Engine Citation & Price/Weight Accuracy (25 Prompts across 4 AI Engines)',
          twoWeekBaselineProtocol: 'Run all 25 prompts in ai-citation-tracker-25-prompts.csv on Day 14 to record initial citation rate',
          day30Target: '100% price/weight accuracy whenever NaturesMud is cited (0 stale Rs. 599/499 powder hallucinations); cited on >= 8/25 prompts',
          day60Target: 'Cited with accurate NPR price & weight on >= 14/25 buying & how-to prompts',
          day90Target: 'Cited with accurate NPR price, weight & canonical URL on >= 19/25 prompts across ChatGPT, Perplexity, Gemini & Google AI Mode',
        },
      ],
    },
    summaryCounts: {
      weeklyRankQueriesTotal: rankRows.length,
      productSkuQueries: rankRows.filter((r) => r.bucket === 'product_sku').length,
      categoryClusterQueries: rankRows.filter((r) => r.bucket === 'category_cluster').length,
      babyGiftFitnessQueries: rankRows.filter((r) => r.bucket === 'baby_gift_fitness').length,
      aiCitationPromptsTotal: aiPrompts.length,
    },
  };
}

function main() {
  const activeProducts = parseLocalProducts();
  const rankRows = buildWeeklyRankTracker(activeProducts);
  const aiPrompts = buildAiCitationTracker();
  const measurementPack = buildPhase9MeasurementPack(rankRows, aiPrompts);

  const publicDir = path.join(process.cwd(), 'public');

  // 1. Write weekly-rank-tracker-60-queries.json & .csv
  fs.writeFileSync(
    path.join(publicDir, 'weekly-rank-tracker-60-queries.json'),
    JSON.stringify(rankRows, null, 2),
    'utf8'
  );

  const rankHeaders = [
    'query_id',
    'bucket',
    'device_country',
    'query',
    'nepali_roman_variant',
    'sku',
    'product_name',
    'canonical_price_npr',
    'canonical_weight',
    'target_url',
    'who_is_above_us_baseline',
    'competitor_weakness',
    'week_1_position',
    'week_1_ranking_url',
    'week_2_position',
    'week_3_position',
    'week_4_position',
    'notes',
  ];
  const rankCsvLines = [
    rankHeaders.join(','),
    ...rankRows.map((row) => rankHeaders.map((h) => escapeCsv(row[h])).join(',')),
  ];
  fs.writeFileSync(
    path.join(publicDir, 'weekly-rank-tracker-60-queries.csv'),
    '\uFEFF' + rankCsvLines.join('\n'),
    'utf8'
  );

  // 2. Write ai-citation-tracker-25-prompts.json & .csv
  fs.writeFileSync(
    path.join(publicDir, 'ai-citation-tracker-25-prompts.json'),
    JSON.stringify(aiPrompts, null, 2),
    'utf8'
  );

  const aiHeaders = [
    'prompt_id',
    'intent_type',
    'prompt',
    'expected_cited_url',
    'expected_product_names',
    'expected_prices_npr',
    'expected_weights',
    'grounding_source',
    'chatgpt_cited',
    'chatgpt_price_weight_accurate',
    'perplexity_cited',
    'perplexity_price_weight_accurate',
    'gemini_cited',
    'gemini_price_weight_accurate',
    'google_ai_mode_cited',
    'google_ai_mode_price_weight_accurate',
    'last_checked_date',
    'remediation_action_if_wrong',
  ];
  const aiCsvLines = [
    aiHeaders.join(','),
    ...aiPrompts.map((row) => aiHeaders.map((h) => escapeCsv(row[h])).join(',')),
  ];
  fs.writeFileSync(
    path.join(publicDir, 'ai-citation-tracker-25-prompts.csv'),
    '\uFEFF' + aiCsvLines.join('\n'),
    'utf8'
  );

  // 3. Write phase9-measurement-pack.json
  fs.writeFileSync(
    path.join(publicDir, 'phase9-measurement-pack.json'),
    JSON.stringify(measurementPack, null, 2),
    'utf8'
  );

  console.log(
    `✅ Generated Phase 9 Measurement Pack: weekly-rank-tracker-60-queries (${rankRows.length} queries: ${measurementPack.summaryCounts.productSkuQueries} product + ${measurementPack.summaryCounts.categoryClusterQueries} category/cluster + ${measurementPack.summaryCounts.babyGiftFitnessQueries} baby/gift/fitness), ai-citation-tracker-25-prompts (${aiPrompts.length} prompts), and phase9-measurement-pack.json!`
  );
}

main();
