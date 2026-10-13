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
  'dried-dates-khajoor': { dev: 'छोकडा / खजुर', rom: 'Khajoor / Chhokada' },
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

const BABY_WEANING_SLUGS = new Set([
  'sweet-potato-powder',
  'dates-powder',
  'banana-powder',
  'carrot-powder',
]);

function buildGbpPack(activeProducts) {
  const gbpProducts = activeProducts.map((p, idx) => {
    const officialName = p.official_label_name || p.name;
    const nep = NEPALI_NAMES_MAP[p.slug] || { dev: officialName, rom: officialName };
    const primaryImage = p.image?.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
    return {
      order: idx + 1,
      productName: `${officialName} (${p.weight})`,
      category: p.category,
      priceNpr: p.price,
      currency: 'NPR',
      description: `${officialName} (${nep.dev} / ${nep.rom}) — ${p.weight} packed in ${
        p.packing || 'Airtight Food-Grade Container'
      }. ${p.shortDescription || p.description} Order online at naturesmud.shop with 24h Kathmandu Valley delivery & All-Nepal COD.`,
      landingPageUrl: `${BASE_URL}/products/${p.slug}?utm_source=google&utm_medium=gbp&utm_campaign=gbp_product_catalog`,
      imageUrl: primaryImage,
    };
  });

  return {
    profileIdentity: {
      businessName: 'NaturesMud Nepal',
      nepaliName: 'नेचर्स मड नेपाल',
      primaryCategory: 'Natural Goods Store',
      additionalCategories: [
        'Health Food Store',
        'Baby Store',
        'Food Products Supplier',
        'Dry Fruit Store',
      ],
      address: {
        streetAddress: 'Baneshwor',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati Province',
        postalCode: '44600',
        addressCountry: 'NP',
      },
      geo: {
        latitude: 27.6915,
        longitude: 85.342,
      },
      phone: '+977-9713888002',
      whatsappUrl: 'https://wa.me/9779713888002',
      email: 'info@naturesmud.shop',
      websiteUrl: `${BASE_URL}/?utm_source=google&utm_medium=gbp&utm_campaign=gbp_profile`,
      locationsPageUrl: `${BASE_URL}/locations?utm_source=google&utm_medium=gbp&utm_campaign=gbp_locations`,
      openingHours: {
        Sunday: '09:00 - 18:00',
        Monday: '09:00 - 18:00',
        Tuesday: '09:00 - 18:00',
        Wednesday: '09:00 - 18:00',
        Thursday: '09:00 - 18:00',
        Friday: '09:00 - 18:00',
        Saturday: 'Closed (Online & WhatsApp orders open 24/7)',
      },
      serviceAreas: [
        'Kathmandu, Nepal',
        'Lalitpur, Nepal',
        'Bhaktapur, Nepal',
        'Pokhara, Nepal',
        'Bharatpur, Chitwan, Nepal',
        'Butwal, Nepal',
        'Biratnagar, Nepal',
        'Dharan, Nepal',
        'Hetauda, Nepal',
        'Birendranagar, Surkhet, Nepal',
        'Nepalgunj, Nepal',
      ],
      businessDescription750Chars:
        'NaturesMud Nepal (Baneshwor, Kathmandu 44600) is a single-ingredient natural foods brand offering 32 whole-food products across Nepal: Fruit & Vegetable Powders (Beetroot, Dates, Moringa, Carrot, Sweet Potato, Banana, Freeze-Dried Avocado & Strawberry), Dehydrated Fruits (Mango, Pineapple, Apple, Dragon Fruit, Sweet Papaya, Coconut Chips, Blueberries, Cranberries, Dry Figs & Dates), Mountain Nuts (Almonds, Cashewnuts, Pistachios, Macadamia & Mix Dry Nuts), Superfood Seeds (Chia, Pumpkin, Flax & Makhana), Cold-Pressed Coconut Oils (500 ML & 180 ML), Rosemary Leaves, Himalayan Salts & Pure Mountain Himalayan Shilajit Resin. 0% added sugar, 0% preservatives. 24-hour Kathmandu Valley delivery & nationwide COD.',
      attributes: [
        'Delivery available (Same/Next-day inside Kathmandu Valley)',
        'Nationwide Courier Delivery across all 77 Districts of Nepal',
        'Cash on Delivery (COD) accepted',
        'FonePay QR, eSewa & Khalti accepted',
        'Nepali women & smallholder farmer sourcing network',
      ],
    },
    qaSeedPairs: [
      {
        question: 'Where is NaturesMud located in Kathmandu and how fast is delivery?',
        answer:
          'Our main quality inspection and dispatch hub is in Baneshwor, Kathmandu 44600, Nepal (+977-9713888002). Orders inside Kathmandu, Lalitpur, and Bhaktapur are delivered within 24 hours (Rs. 100 delivery fee, FREE on orders Rs. 2,000+).',
      },
      {
        question: 'Which NaturesMud powders are suitable for babies starting solid food (lito / porridge)?',
        answer:
          'Our 100% single-ingredient Dates Powder (Khajoor ko Dhulo), Sweet Potato Powder, Carrot Powder, and Banana Powder contain 0% refined sugar, 0% salt, and 0% preservatives, making them ideal for homemade porridge and lito (from 6 months, as advised by your pediatrician).',
      },
      {
        question: 'Can I buy NaturesMud products in retail stores in Kathmandu, Pokhara, or Surkhet?',
        answer:
          'Yes! Selected NaturesMud products are stocked at Kids Kottage (Gongabu, Kupondol, Kapan, Pokhara & Surkhet), Zero to Ten (Chabahil), and Baby Love (Hetauda). For all 32 products and fresh batch dispatch, order at naturesmud.shop.',
      },
      {
        question: 'Do your Dehydrated Mango, Pineapple, and Apple slices have added sugar?',
        answer:
          'No. All NaturesMud dehydrated fruits are made from 100% ripe fruit slices gently dehydrated at low temperatures with 0% added sugar, 0% artificial colors, and 0% preservatives.',
      },
      {
        question: 'Is NaturesMud Extra Virgin Coconut Oil packed in glass or plastic?',
        answer:
          'Both sizes of our cold-pressed coconut oil—Extra Virgin Coconut Oil (500 ML, Rs. 1,750) and Virgin Coconut Oil (180 ML, Rs. 650)—are packed in food-grade wide-mouth glass jars so they never leach plastic and are easy to scoop in winter.',
      },
      {
        question: 'How do I verify my NaturesMud order or leave a product review?',
        answer:
          'Every review on naturesmud.shop requires a real NaturesMud Order Number (e.g., NM-420417) from your delivery invoice or WhatsApp confirmation. We never publish unverified or synthetic ratings.',
      },
      {
        question: 'Do you deliver to Pokhara, Chitwan, Butwal, Biratnagar, and Dharan with Cash on Delivery?',
        answer:
          'Yes, we deliver to all 7 provinces and 77 districts of Nepal within 2–5 business days with Cash on Delivery (COD), FonePay QR, eSewa, and Khalti. Outside Valley courier fee is Rs. 150 (FREE on orders Rs. 2,000+).',
      },
      {
        question: 'What is your return or replacement policy if a jar is damaged in transit?',
        answer:
          'We offer a 7-day hassle-free replacement or refund policy (/returns). Simply message us on WhatsApp at +977-9713888002 with your Order Number and a photo of the package within 7 days of delivery.',
      },
    ],
    weeklyPostTemplates: [
      {
        week: 1,
        type: 'PRODUCT_SPOTLIGHT',
        title: '100% Pure Dates Powder (खजुरको धुलो) — Natural Sweetener for Porridge & Milk',
        body: 'Looking for a 0% refined sugar sweetener for family porridge, smoothies, or baby lito (from 6 months, as advised by your pediatrician)? NaturesMud Dates Powder (100 GM, Rs. 400) is finely milled from 100% whole dehydrated dates in an airtight glass jar. 24h Kathmandu Valley delivery!',
        ctaUrl: `${BASE_URL}/products/dates-powder?utm_source=google&utm_medium=gbp&utm_campaign=weekly_post_w1`,
      },
      {
        week: 2,
        type: 'PRODUCT_SPOTLIGHT',
        title: 'Beetroot Powder (चुकन्दरको धुलो) — 100 GM Glass Jar (Rs. 430)',
        body: 'One teaspoon of NaturesMud Beetroot Powder adds vibrant ruby color and natural beetroot nutrition to your morning smoothie, lemon water, or roti dough—without peeling or staining your hands. 100% pure dehydrated beetroot, 0 fillers.',
        ctaUrl: `${BASE_URL}/products/beetroot-powder?utm_source=google&utm_medium=gbp&utm_campaign=weekly_post_w2`,
      },
      {
        week: 3,
        type: 'PRODUCT_SPOTLIGHT',
        title: 'Cold-Pressed Extra Virgin Coconut Oil in Wide-Mouth Glass Jars (500 ML & 180 ML)',
        body: 'Packed in hygienic glass jars so you can easily spoon out solid coconut oil during Kathmandu winters! Ideal for cooking, hair oiling, oil pulling, and gentle baby massage.',
        ctaUrl: `${BASE_URL}/products/virgin-coconut-oil-500ml?utm_source=google&utm_medium=gbp&utm_campaign=weekly_post_w3`,
      },
      {
        week: 4,
        type: 'CATEGORY_SPOTLIGHT',
        title: 'Zero-Added-Sugar Dehydrated Fruits for School Tiffins & Office Snacking',
        body: 'Swap fried chips and sugary candy for NaturesMud Dehydrated Mango, Pineapple, Himalayan Apple, Dragon Fruit, and Sweet Papaya. 100% real fruit, gently dehydrated in small batches.',
        ctaUrl: `${BASE_URL}/category/dried-fruits?utm_source=google&utm_medium=gbp&utm_campaign=weekly_post_w4`,
      },
    ],
    productsCount: gbpProducts.length,
    products: gbpProducts,
  };
}

function buildVideoScripts32Skus(activeProducts) {
  return activeProducts.map((p, idx) => {
    const officialName = p.official_label_name || p.name;
    const nep = NEPALI_NAMES_MAP[p.slug] || { dev: officialName, rom: officialName };
    const isBabyWeaning = BABY_WEANING_SLUGS.has(p.slug);
    const packing = p.packing || 'Airtight Food-Grade Container';

    let textureTestAction =
      'Scoop 1 spoon close to the camera to show natural texture, then mix/serve in a real Nepali kitchen bowl or glass.';
    if (p.categorySlug === 'powders') {
      textureTestAction = isBabyWeaning
        ? 'Open the glass jar seal, scoop 1 spoon of fine powder close to the lens, and stir smoothly into warm porridge/lito or milk with zero lumps.'
        : 'Open the glass jar seal, scoop 1 spoon of vibrant powder close to the lens, and stir into a clear glass of water/smoothie to show instant natural color dispersion.';
    } else if (p.categorySlug === 'dried-fruits') {
      textureTestAction =
        'Tear open the resealable pouch, pull out a real fruit slice/berry close to the camera to show natural fiber texture, and tear/bite to show chewiness with 0 sugar coating.';
    } else if (p.categorySlug === 'nuts' || p.categorySlug === 'seeds') {
      textureTestAction =
        'Pour a handful of whole kernels/seeds onto a wooden tray in natural daylight, showing uniform size, zero dust, and crisp crunch.';
    } else if (p.slug.includes('coconut-oil')) {
      textureTestAction =
        'Open the wide-mouth glass jar, spoon out crystal-clear (or winter-solid white) cold-pressed coconut oil, and show how smoothly it melts on warm skin.';
    } else if (p.slug === 'pure-mountain-himalayan-shilajit-resin') {
      textureTestAction =
        'Open the 20 GM glass jar, lift a pea-sized drop of dark resin on a spoon to show natural resin pull, and dissolve completely in warm water.';
    }

    const hookNepali = `के तपाईंले १००% शुद्ध ${nep.dev} (${officialName}) यसरी प्रयोग गर्नुभएको छ?`;
    const hookRomanized = `Ke tapai le 100% shuddha ${nep.rom} (${officialName}) yasari prayog garnubhayeko chha?`;
    const hookEnglish = `See what 100% pure single-ingredient ${officialName} (${p.weight}) actually looks like inside the pack.`;

    const babyNoteClause = isBabyWeaning
      ? ' ६ महिना माथिका बाबुनानीको लिटो र जाउलोको लागि पनि उपयुक्त (from 6 months, as advised by your pediatrician)।'
      : '';

    const voiceoverScript = `[0–3s Hook] ${hookNepali} (${hookEnglish})
[3–12s Label & Seal Shot] यो हो NaturesMud को ${officialName} (${p.weight}), जुन ${packing} मा आउँछ। यसमा केवल १००% शुद्ध ${(p.ingredients || [officialName]).join(', ')} मात्र छ — ०% चिनी, ०% प्रिजर्भेटिभ र ०% कृत्रिम रङ।
[12–22s Texture & Kitchen Test] हेर्नुहोस् त यसको प्राकृतिक रङ र बनावट! ${p.usage || 'यसलाई दैनिक भान्सामा सजिलै प्रयोग गर्न सकिन्छ।'}${babyNoteClause}
[22–30s Price & CTA] मूल्य मात्र Rs. ${p.price} (${p.weight})। काठमाडौँ उपत्यकाभित्र २४ घण्टामा होम डेलिभरी र नेपालभरि Cash on Delivery उपलब्ध छ। अर्डर गर्न naturesmud.shop मा जानुहोस् वा बायोको लिङ्क थिच्नुहोस्!`;

    const caption = `${officialName} (${nep.dev} / ${nep.rom}) — ${p.weight} at Rs. ${p.price} 🌿✨
✅ Official Label Name: ${officialName} (${p.weight})
✅ Ingredients: ${(p.ingredients || [officialName]).join(', ')} (0% Added Sugar · 0% Preservatives)
✅ Packaging: ${packing}
${isBabyWeaning ? '👶 Baby Weaning Note: Suitable from 6 months, as advised by your pediatrician.\n' : ''}🚚 24-Hour Delivery inside Kathmandu, Lalitpur & Bhaktapur | 2–5 Days All-Nepal Courier (COD / FonePay / eSewa / Khalti)
🛒 Order Direct: ${BASE_URL}/products/${p.slug}
📞 WhatsApp Order Desk: +977-9713888002 (Baneshwor, Kathmandu)

#NaturesMud #NaturesMudNepal #${officialName.replace(/[^a-zA-Z0-9]/g, '')} #HealthyFoodNepal #Kathmandu #NepalSuperfoods #NaturalFoodNepal`;

    return {
      rank: idx + 1,
      slug: p.slug,
      officialLabelName: officialName,
      nepaliNameDevanagari: nep.dev,
      nepaliNameRoman: nep.rom,
      netWeight: p.weight,
      priceNpr: p.price,
      packingType: packing,
      durationSeconds: 30,
      hook0to3sNepali: hookNepali,
      hook0to3sRomanized: hookRomanized,
      hook0to3sEnglish: hookEnglish,
      visualShotList3to22s: [
        `Shot 1 (0–3s): Front-of-pack close-up showing exact label "${officialName}" (${p.weight}) in natural window light.`,
        `Shot 2 (3–9s): Turn pack to show single-ingredient list (${(p.ingredients || [officialName]).join(', ')}) and break the airtight seal on the ${packing}.`,
        `Shot 3 (9–18s): ${textureTestAction}`,
        `Shot 4 (18–25s): Final plated/prepared serving in a real Nepali kitchen with price overlay "Rs. ${p.price} (${p.weight})".`,
      ],
      voiceoverScript,
      cta22to30s: `Rs. ${p.price} (${p.weight}) · 24h Kathmandu Valley Delivery · All-Nepal COD · Order at ${BASE_URL}/products/${p.slug}`,
      captionAndHashtags: caption,
      canonicalProductUrl: `${BASE_URL}/products/${p.slug}`,
    };
  });
}

function buildOffsiteOutreachPack() {
  return {
    brandNapStandard: {
      name: 'NaturesMud Nepal',
      address: 'Baneshwor, Kathmandu 44600, Nepal',
      phone: '+977-9713888002',
      email: 'info@naturesmud.shop',
      website: 'https://naturesmud.shop',
      hours: 'Sunday – Friday: 9:00 AM – 6:00 PM NPT',
    },
    nepalCitationsAndDirectories: [
      {
        priority: 1,
        platform: 'Google Business Profile (Google Maps)',
        url: 'https://business.google.com',
        category: 'Natural Goods Store / Health Food Store',
        napMatchRequired: 'NaturesMud Nepal | Baneshwor, Kathmandu 44600, Nepal | +977-9713888002',
        actionItem: 'Claim/verify Baneshwor pin, upload 32 GBP product cards from /gbp-optimization-pack.json, post 8 Q&A pairs.',
      },
      {
        priority: 2,
        platform: 'Bing Places for Business',
        url: 'https://www.bingplaces.com',
        category: 'Health Food Store',
        napMatchRequired: 'NaturesMud Nepal | Baneshwor, Kathmandu 44600, Nepal | +977-9713888002',
        actionItem: 'Import directly from verified Google Business Profile so ChatGPT Search & Copilot resolve local entity.',
      },
      {
        priority: 3,
        platform: 'Apple Business Connect (Apple Maps)',
        url: 'https://businessconnect.apple.com',
        category: 'Health Market / Specialty Food',
        napMatchRequired: 'NaturesMud Nepal | Baneshwor, Kathmandu 44600, Nepal | +977-9713888002',
        actionItem: 'Register Baneshwor location pin for iPhone Siri / Apple Maps local queries in Kathmandu.',
      },
      {
        priority: 4,
        platform: 'NepalYP (Nepal Yellow Pages)',
        url: 'https://www.nepalyp.com',
        category: 'Food Manufacturing & Natural Food Store Kathmandu',
        napMatchRequired: 'NaturesMud Nepal | Baneshwor, Kathmandu 44600, Nepal | +977-9713888002',
        actionItem: 'Submit business profile with canonical link to https://naturesmud.shop and /locations.',
      },
      {
        priority: 5,
        platform: 'Khojnu.com & Bhetincha.com Nepal Directories',
        url: 'https://khojnu.com',
        category: 'Organic & Health Food Suppliers in Kathmandu',
        napMatchRequired: 'NaturesMud Nepal | Baneshwor, Kathmandu 44600, Nepal | +977-9713888002',
        actionItem: 'List Baneshwor HQ + 6 category hub descriptions.',
      },
      {
        priority: 6,
        platform: 'Daraz Nepal Official Brand Store',
        url: 'https://www.daraz.com.np',
        category: 'Groceries & Mother/Baby',
        napMatchRequired: 'NaturesMud',
        actionItem: 'Upload the Top 10 SKUs from /daraz-top-10-listings.csv to capture Daraz internal searches.',
      },
    ],
    collaboratorOutreachTemplates: [
      {
        segment: 'Pediatric Nutritionists & Registered Dietitians in Nepal',
        targetContent: 'Single-Ingredient Weaning Powders (Dates Powder, Sweet Potato Powder, Carrot Powder, Banana Powder)',
        complianceRule: 'Strictly factual ingredient review only; always include "from 6 months, as advised by your pediatrician"; zero disease/cure claims.',
        messageTemplate:
          'Namaste [Name] ji, we at NaturesMud Nepal (Baneshwor, Kathmandu) prepare 100% single-ingredient dehydrated fruit and vegetable powders (Dates Powder, Sweet Potato Powder, Carrot Powder, Banana Powder) in glass jars with 0% added sugar, 0% salt, and 0% preservatives. We would love to send you a complimentary tasting & inspection box from our Baneshwor hub so you can examine the ingredient purity and texture firsthand. No scripted claims—just your honest professional feedback.',
      },
      {
        segment: 'Nepali Mom & Baby Weaning Creators (TikTok / Instagram)',
        targetContent: '5-Minute Homemade Lito / Jaulo / Smoothie Bowl Recipes',
        complianceRule: 'Must show real spoon texture & preparation; include "from 6 months, as advised by your pediatrician"; no fabricated health claims.',
        messageTemplate:
          'Namaste [Creator Name] ji! Loved your recent video on homemade baby food in Nepal. We make 100% pure single-ingredient Dates Powder (Khajoor ko Dhulo), Sweet Potato Powder, and Carrot Powder in glass jars right here in Kathmandu (0% refined sugar or preservatives). May we send your family a complimentary NaturesMud Weaning Starter Box to try in your kitchen?',
      },
      {
        segment: 'Kathmandu Fitness, Marathon & Gym Coaches',
        targetContent: 'Beetroot Powder Pre-Workout, Chia Seeds, Pumpkin Seeds & Mix Dry Nuts',
        complianceRule: 'Focus on natural whole-food nutrition, dietary nitrates, and plant protein; no medical claims.',
        messageTemplate:
          'Namaste [Coach Name]! Many runners and lifters in Kathmandu use our 100% pure Beetroot Powder (Rs. 430 / 100 GM glass jar), Chia Seeds, and Pumpkin Seeds as a clean whole-food pre-workout and recovery topping. We would love to send you a complimentary NaturesMud Athlete Pack from our Baneshwor hub to test in your daily shakes.',
      },
    ],
    brandSerpOwnershipChecklist: [
      {
        surface: '1. Official Domain (naturesmud.shop)',
        targetQuery: 'naturesmud / natures mud nepal',
        status: 'LIVE & VERIFIED',
        url: 'https://naturesmud.shop',
      },
      {
        surface: '2. Official Category & Location Sitelinks (/category/*, /locations, /about, /contact)',
        targetQuery: 'naturesmud products / naturesmud kathmandu location',
        status: 'LIVE & VERIFIED',
        url: 'https://naturesmud.shop/locations',
      },
      {
        surface: '3. Official Instagram (@naturesmud.np)',
        targetQuery: 'naturesmud instagram',
        status: 'LINKED IN SCHEMA sameAs',
        url: 'https://www.instagram.com/naturesmud.np',
      },
      {
        surface: '4. Official Facebook Page (facebook.com/naturesmud)',
        targetQuery: 'naturesmud facebook',
        status: 'LINKED IN SCHEMA sameAs',
        url: 'https://www.facebook.com/naturesmud',
      },
      {
        surface: '5. Official TikTok (@naturesmud.np)',
        targetQuery: 'naturesmud tiktok',
        status: 'LINKED IN SCHEMA sameAs',
        url: 'https://www.tiktok.com/@naturesmud.np',
      },
      {
        surface: '6. Official YouTube (@naturesmud)',
        targetQuery: 'naturesmud youtube',
        status: 'LINKED IN SCHEMA sameAs',
        url: 'https://www.youtube.com/@naturesmud',
      },
    ],
  };
}

const activeProducts = parseLocalProducts();
const publicDir = path.join(process.cwd(), 'public');

const gbpPack = buildGbpPack(activeProducts);
const videoScripts = buildVideoScripts32Skus(activeProducts);
const outreachPack = buildOffsiteOutreachPack();

fs.writeFileSync(path.join(publicDir, 'gbp-optimization-pack.json'), JSON.stringify(gbpPack, null, 2), 'utf8');
fs.writeFileSync(
  path.join(publicDir, 'video-scripts-32-skus.json'),
  JSON.stringify({ brand: 'NaturesMud Nepal', count: videoScripts.length, scripts: videoScripts }, null, 2),
  'utf8'
);

const videoCsvHeaders = [
  'Rank',
  'Slug',
  'OfficialLabelName',
  'NepaliNameDevanagari',
  'NepaliNameRoman',
  'NetWeight',
  'PriceNPR',
  'PackingType',
  'DurationSeconds',
  'Hook0to3sNepali',
  'Hook0to3sEnglish',
  'VisualShotList',
  'VoiceoverScript',
  'CTA',
  'CanonicalURL',
];
const videoCsvRows = videoScripts.map((v) =>
  [
    escapeCsv(v.rank),
    escapeCsv(v.slug),
    escapeCsv(v.officialLabelName),
    escapeCsv(v.nepaliNameDevanagari),
    escapeCsv(v.nepaliNameRoman),
    escapeCsv(v.netWeight),
    escapeCsv(v.priceNpr),
    escapeCsv(v.packingType),
    escapeCsv(v.durationSeconds),
    escapeCsv(v.hook0to3sNepali),
    escapeCsv(v.hook0to3sEnglish),
    escapeCsv(v.visualShotList3to22s.join(' | ')),
    escapeCsv(v.voiceoverScript),
    escapeCsv(v.cta22to30s),
    escapeCsv(v.canonicalProductUrl),
  ].join(',')
);
fs.writeFileSync(
  path.join(publicDir, 'video-scripts-32-skus.csv'),
  [videoCsvHeaders.join(','), ...videoCsvRows].join('\n'),
  'utf8'
);

fs.writeFileSync(
  path.join(publicDir, 'offsite-authority-outreach-pack.json'),
  JSON.stringify(outreachPack, null, 2),
  'utf8'
);

console.log(
  `✅ Generated Phase 7 packs: gbp-optimization-pack.json (${gbpPack.productsCount} GBP products), video-scripts-32-skus.json/csv (${videoScripts.length} scripts), and offsite-authority-outreach-pack.json!`
);
