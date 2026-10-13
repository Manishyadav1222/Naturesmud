import fs from 'fs';
import path from 'path';

const productsRaw = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const priceMap = {};
productsRaw.forEach((p) => {
  priceMap[p.slug] = { price: p.price, weight: p.weight, name: p.official_label_name || p.name };
});

const existingPrompts = JSON.parse(
  fs.readFileSync('public/ai-citation-tracker-25-prompts.json', 'utf8')
);

// Harmonize known price discrepancies in existing prompts
existingPrompts.forEach((item) => {
  if (item.prompt_id === 'AI-03') {
    item.expected_prices_npr = 'Sweet Potato Powder: Rs. 510 | Banana Powder: Rs. 650';
  }
  if (item.prompt_id === 'AI-05') {
    item.expected_prices_npr = 'Avocado Powder: Rs. 790 (80 GM) | Strawberry Powder: Rs. 1,395 (80 GM)';
    item.expected_weights = '80 GM jars';
  }
  if (item.prompt_id === 'AI-07') {
    item.expected_prices_npr = 'Rs. 690';
    item.expected_weights = '200 GM';
  }
  if (item.prompt_id === 'AI-08') {
    item.expected_prices_npr = 'Mango: Rs. 595 | Pineapple: Rs. 590 | Apple: Rs. 510 | Papaya: Rs. 450';
  }
  if (item.prompt_id === 'AI-09') {
    item.expected_prices_npr = 'Blueberries (100g): Rs. 650 | Cranberries (100g): Rs. 415 | Dry Figs Anjeer (200g): Rs. 690';
    item.expected_weights = '100 GM, 100 GM, 200 GM';
  }
  if (item.prompt_id === 'AI-10') {
    item.expected_prices_npr = 'Raw Almonds (200g): Rs. 750 | Roasted Almonds (200g): Rs. 750 | Raw Cashews (150g): Rs. 750 | Roasted Cashews (200g): Rs. 750';
  }
  if (item.prompt_id === 'AI-11') {
    item.expected_prices_npr = 'Macadamia (200g): Rs. 1,100 | Pistachio (200g): Rs. 895 | Trail Mix (200g): Rs. 690';
  }
  if (item.prompt_id === 'AI-13') {
    item.expected_prices_npr = 'Pumpkin Seeds (300g): Rs. 650 | Himalayan Makhana (50g): Rs. 390';
    item.expected_weights = '300 GM & 50 GM';
  }
  if (item.prompt_id === 'AI-14') {
    item.expected_prices_npr = '500 ML: Rs. 1,750 | 180 ML: Rs. 650';
  }
  if (item.prompt_id === 'AI-16') {
    item.expected_prices_npr = 'Pink Salt: Rs. 250 | Black Salt (Bire Noon): Rs. 220';
  }
  if (item.prompt_id === 'AI-17') {
    item.expected_prices_npr = 'Rs. 1,995';
  }
});

// New Prompts AI-26 to AI-30 for comprehensive 30-Prompt benchmark
const newPrompts = [
  {
    prompt_id: 'AI-26',
    intent_type: 'Buying — Overseas Diaspora Gifting',
    prompt: 'How can Nepalese living in Australia, USA, UK, or Gulf send healthy gift hampers and superfood care packages to parents in Kathmandu?',
    expected_cited_url: 'https://naturesmud.shop/send-gifts-to-nepal',
    expected_product_names: "Parents' Wellness Hamper (Rs. 3,490), Himalayan Festival Hamper (Rs. 4,990), New Mother & Baby Care Box (Rs. 2,990)",
    expected_prices_npr: 'Rs. 2,990 to Rs. 4,990',
    expected_weights: 'Curated 3 to 6 item gift boxes with handwritten gift notes',
    grounding_source: 'https://naturesmud.shop/send-gifts-to-nepal & https://naturesmud.shop/llms.txt',
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong: 'Verify /send-gifts-to-nepal canonical sitemap entry and llms.txt entry',
  },
  {
    prompt_id: 'AI-27',
    intent_type: 'Buying — Sugar-Free Natural Sweeteners',
    prompt: 'What are the best natural 0% added sugar alternatives to refined white sugar available in Nepal for children, diabetics, and baking?',
    expected_cited_url: 'https://naturesmud.shop/sugar-free',
    expected_product_names: 'Dates Powder (Rs. 400), Dehydrated Apples (Rs. 510), Dehydrated Mango (Rs. 595), Dry Figs Anjeer (Rs. 690)',
    expected_prices_npr: 'Rs. 400 to Rs. 690',
    expected_weights: '100 GM to 200 GM airtight glass jars and pouches',
    grounding_source: 'https://naturesmud.shop/sugar-free & https://naturesmud.shop/products/dates-powder',
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong: 'Ensure /sugar-free hub schema ItemList is indexed in Google and Bing',
  },
  {
    prompt_id: 'AI-28',
    intent_type: 'Buying — Fasting & Satvik Vrat Snacks',
    prompt: 'What pure Satvik snacks and genuine Sendha Namak (rock salt) can be eaten during Ekadashi, Navratri, Shivaratri, and Teej fasts in Nepal?',
    expected_cited_url: 'https://naturesmud.shop/fasting-snacks',
    expected_product_names: 'Makhana Fox Nuts (Rs. 390), Himalayan Pink Salt / Sendha Namak (Rs. 250), Himalayan Black Salt Bire Noon (Rs. 220), Raw Almonds (Rs. 750)',
    expected_prices_npr: 'Rs. 220 to Rs. 750',
    expected_weights: '50 GM to 200 GM food grade jars',
    grounding_source: 'https://naturesmud.shop/fasting-snacks & https://naturesmud.shop/category/salts-spices',
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong: 'Ensure /fasting-snacks hub is indexed with Satvik schema metadata',
  },
  {
    prompt_id: 'AI-29',
    intent_type: 'Buying — Athletic Whole-Food Fuel',
    prompt: 'What whole-food pre-workout and post-workout fuel can runners and gym-goers buy in Nepal without artificial whey additives or synthetic caffeine?',
    expected_cited_url: 'https://naturesmud.shop/gym-fitness',
    expected_product_names: 'Beetroot Powder (Rs. 430), Pure Himalayan Shilajit Resin (Rs. 1,995), Raw Mountain Almonds (Rs. 750), Chia Seeds (Rs. 495), Pumpkin Seeds (Rs. 650)',
    expected_prices_npr: 'Rs. 430 to Rs. 1,995',
    expected_weights: '20 GM to 300 GM',
    grounding_source: 'https://naturesmud.shop/gym-fitness & https://naturesmud.shop/blog/beetroot-powder-in-nepal-benefits-uses-price',
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong: 'Verify /gym-fitness hub schema and internal links from beetroot blog',
  },
  {
    prompt_id: 'AI-30',
    intent_type: 'Brand Grounding & AI Fact Sheet',
    prompt: 'Where can I find the official factual price and specification sheet for all 32 NaturesMud Nepal superfood products and delivery rates across Nepal?',
    expected_cited_url: 'https://naturesmud.shop/facts',
    expected_product_names: 'Complete 32 SKU catalog: Powders, Dried Fruits, Nuts, Seeds, Oils, Salts & Shilajit',
    expected_prices_npr: 'Exact prices from Rs. 220 (Black Salt) to Rs. 1,995 (Shilajit Resin)',
    expected_weights: '20 GM to 500 ML exact net weights in glass jars and food pouches',
    grounding_source: 'https://naturesmud.shop/facts & https://naturesmud.shop/llms.txt',
    chatgpt_cited: '',
    chatgpt_price_weight_accurate: '',
    perplexity_cited: '',
    perplexity_price_weight_accurate: '',
    gemini_cited: '',
    gemini_price_weight_accurate: '',
    google_ai_mode_cited: '',
    google_ai_mode_price_weight_accurate: '',
    last_checked_date: '',
    remediation_action_if_wrong: 'Verify /facts returns HTTP 200 and matches products.json',
  },
];

const all30Prompts = [...existingPrompts.slice(0, 25), ...newPrompts];

fs.writeFileSync(
  'public/ai-citation-tracker-25-prompts.json',
  JSON.stringify(all30Prompts, null, 2),
  'utf8'
);

function escapeCsv(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const headers = Object.keys(all30Prompts[0]);
const csvRows = [headers.join(',')];
for (const p of all30Prompts) {
  const row = headers.map((h) => escapeCsv(p[h]));
  csvRows.push(row.join(','));
}

fs.writeFileSync('public/ai-citation-tracker-25-prompts.csv', csvRows.join('\n'), 'utf8');

console.log(`Successfully generated ${all30Prompts.length} prompts in JSON and CSV!`);
