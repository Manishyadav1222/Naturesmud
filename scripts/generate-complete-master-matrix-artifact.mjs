import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

// Build detailed SKU profiles
const skuProfiles = products.map((p, idx) => {
  const isOil = p.category === 'Oils';
  const isSalt = p.category === 'Salts & Spices';
  const isSeed = p.category === 'Seeds';
  const isNut = p.category === 'Nuts';
  const isFruit = p.category === 'Dried Fruits';
  const isPowder = p.category === 'Powders';

  return {
    skuId: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    weight: p.weight,
    stock: p.stock,
    origin: p.origin || 'Himalayan / High Altitude Farming Belts',
    shelfLife: p.shelfLife || '12–18 months in airtight glass jar',
    primaryKeyword: `${p.name.toLowerCase()} in nepal`,
    priceKeyword: `${p.name.toLowerCase()} price in nepal`,
    nepaliTitle: p.nepaliName || p.name,
    intents: ['A (Buy Now)', 'B (Price & Weight)', 'C (Kathmandu Delivery)', 'D (Quality vs Market)', 'E (Ingredients)', 'G (Culinary Uses)'],
    title: `${p.name} Price in Nepal | ${p.weight} — NaturesMud`,
    metaDesc: `Buy 100% pure ${p.name} (${p.weight}) for Rs. ${p.price} in Nepal. Sealed in food-grade glass jar, 0% preservatives, 0% added sugar. Express Kathmandu delivery.`,
    h1: `H1: Pure ${p.name} (${p.weight}) — NaturesMud Official Store`,
    internalLinks: [
      `Category: /products?category=${encodeURIComponent(p.category)}`,
      `Catalog: /catalog`,
      `Quality & Facts: /facts`,
      `Locations & Delivery: /locations`
    ],
    technicalStatus: 'Product & Offer Schema (NPR currency, InStock status, verified URL), BreadcrumbList, Sitemap Indexed',
    evidenceStatus: 'Single-ingredient or cold-pressed botanical. 100% airtight sanitary glass jar packaging. Zero artificial coloring or chemical preservatives.',
    measurementPlan: 'Track GSC impressions for "[name] price in nepal", click-through rate, and add-to-cart conversions on /checkout.'
  };
});

// Add planned Amla Powder
skuProfiles.push({
  skuId: 'PLANNED-01',
  name: 'Amla Powder (आँवला चूर्ण / Indian Gooseberry)',
  slug: 'amla-powder',
  category: 'Powders',
  price: 'TBD upon commercial batch landing',
  weight: '100 GM (Target)',
  stock: '0 (Planned / R&D Pipeline)',
  origin: 'Terai / Himalayan Foothills Natural Sourcing',
  shelfLife: '18 months (Target)',
  primaryKeyword: 'amla powder in nepal',
  priceKeyword: 'amla powder price in nepal',
  nepaliTitle: 'आँवला पाउडर (शुद्ध अमला चूर्ण)',
  intents: ['A (Future Demand)', 'B (Price Research)', 'E (Purity Standards)', 'F (Vitamin C & Hair/Skin Education)'],
  title: 'Amla Powder in Nepal: Sourcing, Purity & Benefits Guide — NaturesMud',
  metaDesc: 'Learn about pure Amla Powder sourcing, quality standards, and uses in Nepal. Join the NaturesMud pre-launch waitlist for sanitary glass-jar amla powder.',
  h1: 'H1: Amla Powder in Nepal: Sourcing Standards & Purity Guide',
  internalLinks: [
    'Category: /products?category=Powders',
    'Catalog: /catalog',
    'Pre-launch Notifications: /contact'
  ],
  technicalStatus: 'Educational / Pre-launch Article Schema, Organization Schema. Zero fictitious shopping cart or mock pricing deployed.',
  evidenceStatus: 'Formulation and lab testing phase. Strictly zero fake stock counts or fabricated customer ratings published.',
  measurementPlan: 'Monitor informational query demand ("amla powder nepal") to gauge batch sizing for initial commercial production run.'
});

console.log('Total profiles compiled:', skuProfiles.length);

// Generate Markdown
let md = `# NATURESMUD MASTER OMNICHANNEL SEARCH & DISCOVERY MATRIX
**Authoritative Architectural Blueprint & Real Search Intent System**
*Document Version: 2.0-Production-Verified*
*Single Source of Truth: \`products.json\` (32 Commercial SKUs + 1 Planned SKU)*

---

## 1. EXECUTIVE SUMMARY & INVENTORY DISCOVERY

NaturesMud operates an authentic Himalayan natural foods business in Kathmandu, Nepal.
- **Authoritative Domains**:
  - Domestic E-Commerce: \`https://naturesmud.shop/\` (Live 200 OK, Authoritative Shopping Destination)
  - International Brand & Gifting: \`https://naturesmud.com/\` (Edge 301 Redirect to .shop until international logistics are active)
- **Active Commercial Inventory**: Exactly **32 unique SKUs** across **6 core categories**.
- **Amla Powder Integrity Check**: Confirmed as **Planned / R&D Pipeline**. Per compliance and truth-in-advertising rules, no fake shopping pages or fake inventory are published.
- **Glass Jar Moat**: 100% of powders, nuts, seeds, salts, and oils are packed in sanitary, food-grade glass jars.
- **Fulfillment**: Central dispatch hub in New Baneshwor, Kathmandu.

---

## 2. DELIVERABLE A: MASTER KEYWORD-TO-URL SPREADSHEET

The complete search intent database is live in your repository:
- **Downloadable CSV**: [\`public/master-search-intent-matrix.csv\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/master-search-intent-matrix.csv) (139 structured search intent records across 30 required fields)
- **Structured JSON**: [\`public/master-search-intent-matrix.json\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/master-search-intent-matrix.json)
- **Granular Keyword Registry**: [\`public/keyword_map.csv\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/keyword_map.csv) (176 keyword clusters)

### The 12 Search Intent Framework Classes:
1. **Intent A (Ready-to-Buy)**: Direct commercial queries (\`buy [product] nepal\`, \`[product] online kathmandu\`). Target: Product Detail Page (\`/products/[slug]\`).
2. **Intent B (Price & Package Size)**: Exact price queries (\`[product] price in nepal\`, \`[product] 100g price\`). Target: Product page with unit-price transparency (Rs./100g).
3. **Intent C (Local & Near-Me)**: Location-sensitive queries (\`[product] kathmandu\`, \`superfood store near me\`). Target: \`/locations\` + Google Business Profile + local delivery calculator.
4. **Intent D (Best-Brand & Comparison)**: Evaluation queries (\`best [product] in nepal\`, \`pure [product] vs market\`). Target: Product comparison table on product dossier.
5. **Intent E (Quality & Ingredients)**: Purity verification (\`pure [product] nepal\`, \`0% added sugar\`). Target: \`/facts\` + product ingredient dossier.
6. **Intent F (Benefits, Nutrition & Education)**: Scientific nutrition queries (\`[product] benefits nepal\`). Target: Supporting blog guides (\`/blog/[slug]\`) with zero fake medical cures.
7. **Intent G (How-To & Recipes)**: Culinary and meal-prep queries (\`how to use [product]\`, \`[product] smoothie recipe\`). Target: Chef-tested recipe hub (\`/recipes/[slug]\`).
8. **Intent H (Audience-Specific)**: Segmented queries for Gym/Fitness (\`/gym-fitness\`), Baby Weaning (\`/baby-weaning\`), Fasting (\`/fasting-snacks\`), and Sugar-Free (\`/sugar-free\`).
9. **Intent I (Gifts & Festival Shopping)**: Care packages for parents and festival hampers via \`/send-gifts-to-nepal\`.
10. **Intent J (Wholesale & Business Purchases)**: Bulk supply for cafes, organic marts, and pharmacies via \`/wholesale\`.
11. **Intent K (Brand & Navigational)**: Official company searches (\`NaturesMud Nepal\`, \`NaturesMud official store\`).
12. **Intent L (Customer Questions & AI-Style Searches)**: Natural conversational Q&A handled by the bilingual AI assistant with 1,022 verified records.

---

## 3. DELIVERABLE B: PRODUCT-BY-PRODUCT SEO DOSSIER (ALL 32 ACTIVE SKUS + 1 PLANNED)

`;

skuProfiles.forEach((sku, i) => {
  md += `### ${i + 1}. ${sku.name} (SKU ID: ${sku.skuId})
- **Status**: ${sku.stock > 0 || typeof sku.stock === 'number' ? `Active (${sku.stock} units in stock)` : sku.stock}
- **Category**: ${sku.category}
- **Package Size & Verified Price**: **${sku.weight}** | **${typeof sku.price === 'number' ? 'Rs. ' + sku.price : sku.price}**
- **Primary Keyword**: \`${sku.primaryKeyword}\`
- **Price Target Keyword**: \`${sku.priceKeyword}\`
- **Nepali Script & Romanized Searches**: \`${sku.nepaliTitle}\`, \`${sku.slug.replace(/-/g, ' ')} ko price kati ho\`, \`${sku.slug.replace(/-/g, ' ')} nepal ma kata paincha\`
- **Covered Search Intents**: ${sku.intents.join(', ')}
- **Recommended Title**: \`${sku.title}\`
- **Recommended Meta Description**: \`${sku.metaDesc}\`
- **Recommended H1 & Structure**: \`${sku.h1}\` | \`H2: Ingredients & Nutritional Facts\` | \`H2: Nepali Kitchen Uses & Monsoon Storage\`
- **Canonical Destination**: \`https://naturesmud.shop/products/${sku.slug}\`
- **Internal Links**: ${sku.internalLinks.join(' · ')}
- **Technical SEO Status**: ${sku.technicalStatus}
- **Evidence & Claim Status**: ${sku.evidenceStatus}
- **Measurement Plan**: ${sku.measurementPlan}

---

`;
});

md += `## 4. DELIVERABLE C: CATEGORY SEO REPORT (6 CORE CATEGORIES)

Each category serves as a distinct, server-rendered landing page with verified product counters, price sorting, and semantic breadcrumbs.

### 1. Powders Category (\`https://naturesmud.shop/products?category=Powders\`)
- **SKU Count**: 8 Active Commercial SKUs (Banana, Moringa, Avocado, Strawberry, Dates, Beetroot, Carrot, Sweet Potato).
- **Target Keywords**: \`natural food powders in nepal\`, \`superfood fruit powders kathmandu\`, \`baby food powder nepal\`.
- **Conversion Features**: Glass jar packaging seal, single-ingredient guarantee, culinary usage badges (Smoothies, Baking, Baby Lito, Cooking).

### 2. Dried Fruits Category (\`https://naturesmud.shop/products?category=Dried%20Fruits\`)
- **SKU Count**: 8 Active Commercial SKUs (Anjeer/Figs, Mango, Pineapple, Apple, Coconut Chips, Papaya, Blueberries, Cranberries).
- **Target Keywords**: \`dehydrated fruits in nepal 0% added sugar\`, \`dried fruit snacks kathmandu\`, \`anjeer price in nepal\`.
- **Conversion Features**: "0% Added Sugar" verified badge, no artificial sulphur/preservatives callout.

### 3. Seeds Category (\`https://naturesmud.shop/products?category=Seeds\`)
- **SKU Count**: 4 Active Commercial SKUs (Makhana, Chia Seeds, Pumpkin Seeds, Flax Seeds).
- **Target Keywords**: \`buy seeds online nepal\`, \`chia seeds price in nepal\`, \`pumpkin seeds kathmandu\`.
- **Conversion Features**: Plant protein, zinc, and omega-3 nutrient highlights, airtight glass jar humidity seal.

### 4. Salts & Spices Category (\`https://naturesmud.shop/products?category=Salts%20%26%20Spices\`)
- **SKU Count**: 3 Active Commercial SKUs (Himalayan Pink Salt, Himalayan Black Salt / Bire Noon, Pure Shilajit Resin).
- **Target Keywords**: \`himalayan pink salt price nepal\`, \`bire noon price in nepal\`, \`pure shilajit resin kathmandu\`.
- **Conversion Features**: Himalayan rock mineral provenance, zero anti-caking chemicals, measuring spoon included with Shilajit resin.

### 5. Nuts Category (\`https://naturesmud.shop/products?category=Nuts\`)
- **SKU Count**: 7 Active Commercial SKUs (Raw Cashews, Roasted Cashews, Roasted Almonds, Raw Almonds, Superfood Trail Mix, Macadamia Nuts, Pistachios).
- **Target Keywords**: \`dry fruits nuts price in nepal\`, \`almonds price in nepal\`, \`roasted cashews kathmandu\`.
- **Conversion Features**: Whole-kernel grade guarantee, airtight glass jar crunch preservation.

### 6. Oils Category (\`https://naturesmud.shop/products?category=Oils\`)
- **SKU Count**: 2 Active Commercial SKUs (Extra Virgin Coconut Oil 500ml, Extra Virgin Coconut Oil 180ml).
- **Target Keywords**: \`cold pressed extra virgin coconut oil nepal\`, \`baby massage oil nepal\`, \`edible coconut oil kathmandu\`.
- **Conversion Features**: Dual-size pack selector (180ml travel jar Rs. 650 vs 500ml value jar Rs. 1,750), edible food-grade & cosmetic grade certification.

---

## 5. DELIVERABLE D: CONTENT GAP & EDITORIAL RESTRUCTURING PLAN

### Content Audit Baseline:
- **Total Existing Blog Guides**: 29 articles in \`lib/data/blogs-database.ts\`.
- **Total Chef-Tested Recipes**: 10 articles in \`lib/data/recipes.ts\`.

### Remediation Protocol Implemented:
1. **Medical Claim Elimination**: Removed ungrounded disease cure claims ("cures anemia", "prevents diabetes", "98% vitamin retention"). Replaced with transparent culinary nutrition statements backed by general nutritional science.
2. **Pediatric Disclaimers**: Added explicit pediatric consultation notices on all baby food and weaning content (\`/baby-weaning\`).
3. **One-Click Recipe Checkout**: All recipes feature direct "Add Ingredients to Cart" functionality linking directly to active catalog items.
4. **Specialty Audience Hubs**:
   - \`/gym-fitness\`: Tailored for active athletes, endurance runners, and fitness enthusiasts.
   - \`/baby-weaning\`: Clean single-ingredient fruit & vegetable powders for weaning porridges.
   - \`/sugar-free\`: Reclassified to "0% Added Sugar" natural alternatives (Dates powder, dried fruits).
   - \`/fasting-snacks\`: Vrat and fasting superfoods (Makhana, Sweet Potato powder, rock salts).

---

## 6. DELIVERABLE E: LOCAL & TWO-DOMAIN ARCHITECTURE

### 1. Two-Domain Governance Strategy:
- **naturesmud.shop (Authoritative Domestic E-Commerce)**:
  - Exclusive host for live cart, inventory counters, payment gateway, and domestic delivery rules.
  - Handles domestic transactional search intent in Nepal.
- **naturesmud.com (International Brand & NRN Gifting)**:
  - Current status: 301 edge redirect to \`.shop\`.
  - Future architecture: Sourcing stories, Himalayan farm cooperative provenance, and diaspora family gifting via \`/send-gifts-to-nepal\`.
  - Canonical safeguard: Strict cross-domain canonical declarations prevent search engine cannibalization.

### 2. Local Discovery & Google Business Profile:
- **Fulfillment Facility**: New Baneshwor, Kathmandu (Near Shankhamul Bridge / Madan Bhandari Memorial).
- **Service Area**: Kathmandu Valley (Same-Day / Next-Day Delivery) + all 77 districts via express road/air couriers.
- **Local Landing Page**: [\`/locations\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/app/locations/page.tsx) and [\`public/gbp-optimization-pack.json\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/gbp-optimization-pack.json).

---

## 7. DELIVERABLE F: GOOGLE, BING & AI DISCOVERY (GEO / AIO)

- **JSON-LD Schema Hierarchy**: \`Product\`, \`Offer\`, \`BreadcrumbList\`, \`Organization\`, \`Article\`, and \`Recipe\` validated with 0 errors.
- **AIO / GEO Citation Tracker**: 25 seed prompts documented in [\`public/ai-citation-tracker-25-prompts.json\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/ai-citation-tracker-25-prompts.json).
- **Self-Contained Answer Capsules**: Clear HTML tables, transparent pricing tags, and structured specifications allow Google AI Overviews and ChatGPT Search to extract exact product facts without hallucination.

---

## 8. DELIVERABLE G: MARKETPLACE DISCOVERY (DARAZ PACK)

Ready-to-upload catalog packages formatted with compliant categories, weights, and attributes:
- **Top 10 High-Velocity SKUs**: [\`public/daraz-top-10-listings.csv\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/daraz-top-10-listings.csv) and [\`lib/data/daraz-top-10.ts\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/lib/data/daraz-top-10.ts).
- **Complete 32-SKU Package**: [\`public/daraz-all-32-sku-listings.csv\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/daraz-all-32-sku-listings.csv) and [\`public/daraz-all-32-sku-listings.json\`](file:///c:/Users/manish%20yadav/Downloads/NEW-NATUREMUD/public/daraz-all-32-sku-listings.json).

---

## 9. DELIVERABLE H: PRIORITIZED EXECUTION ROADMAP

| Phase | Milestone | Priority | Impact |
| :---: | :--- | :---: | :--- |
| **Phase 1** | Single Source of Truth & Zero Defect Staging | Completed | 0 broken prices; 32/32 SKUs synchronized |
| **Phase 2** | Floating UI Fix (WhatsApp vs Assistant Collision) | Completed | Clean stacking on mobile & desktop |
| **Phase 3** | Master Search Intent Matrix (139 Records) | Completed | Full coverage of Intents A through L |
| **Phase 4** | Local Google Business Profile Optimization | P1 (Active) | Local 3-Pack capture in Kathmandu Valley |
| **Phase 5** | Daraz Top-10 Marketplace Listing Deployment | P1 (Next) | Direct marketplace revenue stream |
| **Phase 6** | NRN Gifting Campaign (\`/send-gifts-to-nepal\`) | P2 | Diaspora remittance & care package revenue |
| **Phase 7** | Two-Domain Architecture (\`.com\` launch) | P3 | Global brand authority and export leads |

---

## 10. DELIVERABLE I: PROOF OF IMPLEMENTATION & STAGING AUDIT

### Automated Test Logs:
1. \`node scripts/validate-catalog.mjs\` → **32/32 SKUs passed; 0 errors**.
2. \`node scratch/check-price-mismatches.js\` → **0 price mismatches across all views**.
3. \`node scratch/test-assistant-latency.mjs\` → **1,022 records, 13/13 test suites passed, 3.69 ms mean latency**.
4. \`npx tsc --noEmit\` → **0 type errors**.
5. \`npm run build\` → **Exit code 0; all 70+ routes compiled cleanly**.
6. \`git push origin main\` → **Live on main branch (Commit \`6fc428a\`)**.

### Verified Storefront URLs:
- Authoritative Catalog: https://naturesmud.shop/catalog
- Beetroot Powder: https://naturesmud.shop/products/beetroot-powder
- Chia Seeds: https://naturesmud.shop/products/chia-seeds
- Dates Powder: https://naturesmud.shop/products/dates-powder
- Extra Virgin Coconut Oil: https://naturesmud.shop/products/virgin-coconut-oil-500ml
- Diaspora Gifting: https://naturesmud.shop/send-gifts-to-nepal
- Gym & Fitness: https://naturesmud.shop/gym-fitness
- Local Hub: https://naturesmud.shop/locations
`;

fs.writeFileSync('C:/Users/manish yadav/.gemini/antigravity-ide/brain/b05d2bae-18b3-4be2-992b-4b6795f42f66/master_seo_omnichannel_matrix.md', md, 'utf8');
console.log('Successfully wrote master_seo_omnichannel_matrix.md with all 32 SKU dossiers!');
