// scripts/generate-all-blogs.js
const fs = require('fs');
const path = require('path');

const contentFilePath = path.join(__dirname, '..', 'lib', 'data', 'content.ts');
const originalContent = fs.readFileSync(contentFilePath, 'utf8');

// Find where blogPosts array ends
const blogPostsStartIndex = originalContent.indexOf('export const blogPosts: BlogPost[] = [');
const faqsStartIndex = originalContent.indexOf('export const faqs: FAQItem[] = [');

if (blogPostsStartIndex === -1 || faqsStartIndex === -1) {
  console.error('Could not locate markers in content.ts');
  process.exit(1);
}

// Slice original 25 blog posts
const originalBlogsBlock = originalContent.slice(blogPostsStartIndex, faqsStartIndex);
const lastClosingBracket = originalBlogsBlock.lastIndexOf('},');
const baseBlogsCode = originalBlogsBlock.slice(0, lastClosingBracket + 2);

const otherContentCode = originalContent.slice(faqsStartIndex);

const list1 = require('./generate-blogs-list.js');
const list2 = require('./blogs-batch-2.js');

const additionalBlogs = [
  {
    id: 'b-apple-pectin-gut-microbiome',
    slug: 'mountain-apple-rings-soluble-pectin-akkermansia-weight-management',
    title: 'The Soluble Pectin Miracle: How Dehydrated Himalayan Apple Rings Nourish Akkermansia Bacteria for Metabolic Health',
    excerpt: 'Gastrointestinal research on apple pectin fiber: increasing mucosal gut integrity, lowering LDL cholesterol, and balancing blood sugar.',
    image: '/products/dehydrated-apple.jpg',
    category: 'Gut Health & Nutrition',
    author: "Nature's Mud Microbiome Lab",
    date: '2026-08-16',
    readTime: 7,
    content: [
      "An apple a day keeps the doctor away—an old adage with profound modern biochemical backing. When Himalayan apples are gently dehydrated with their skin intact, their natural **soluble pectin** fiber concentrates threefold.",
      "### 1. Feeding Akkermansia Muciniphila",
      "Apple pectin is the preferred prebiotic food for *Akkermansia muciniphila*, the keystone gut bacterium responsible for maintaining the thickness of the intestinal mucosal barrier, preventing leaky gut syndrome, and reducing systemic metabolic endotoxemia.",
      "### 2. Cholesterol & Bile Acid Binding",
      "In the small intestine, viscous apple pectin traps dietary cholesterol and bile acids, carrying them out through bowel excretion and prompting the liver to pull excess LDL cholesterol from the bloodstream.",
      "### How to Enjoy",
      "Snack on 3–4 chewy slices of Nature's Mud Dehydrated Apple Rings or chop into warm morning cinnamon oatmeal."
    ],
    tags: ['apple rings', 'pectin', 'gut health', 'akkermansia', 'cholesterol', 'prebiotics'],
    featured: false
  },
  {
    id: 'b-anti-inflammatory-golden-milk-guide',
    slug: 'master-guide-ayurvedic-haldi-doodh-cold-pressed-virgin-coconut-oil',
    title: 'The Master Guide to Ayurvedic Golden Milk (Haldi Doodh): The Bioavailability Secret of Virgin Coconut Oil & Black Pepper',
    excerpt: 'Why traditional turmeric milk requires healthy lipid carriers and piperine to increase curcumin absorption by 2000% for joint and sleep wellness.',
    image: '/images/recipes/coconut-oil-jasmine-bowl.jpg',
    category: 'Ayurveda & Rasayana',
    author: "Ayurvedic Clinical Pharmacology, Nature's Mud",
    date: '2026-08-15',
    readTime: 7,
    content: [
      "Turmeric (*Curcuma longa*) is celebrated worldwide for its potent anti-inflammatory compound, **Curcumin**. However, raw curcumin has extremely poor oral bioavailability—less than 1% is absorbed when consumed in plain water because it is hydrophobic (fat-soluble) and rapidly metabolized by liver glucuronidation.",
      "### The Triad of Bioavailability",
      "- **1. Lipid Carrier (Nature's Mud Cold-Pressed Virgin Coconut Oil):** Medium-chain fatty acids encapsulate curcumin molecules into liposomal micelles, bypassing first-pass liver degradation and facilitating direct lymphatic absorption.",
      "- **2. Piperine Catalyst (Black Pepper):** A pinch of freshly cracked black pepper inhibits hepatic glucuronidation, boosting serum curcumin bioavailability by **2,000%**.",
      "- **3. Natural Dates Powder Sweetener:** Sweetens the warming tonic without inflammatory white sugar.",
      "### Golden Bedtime Elixir Recipe",
      "Heat 1 cup of whole or oat milk. Whisk in 1/2 tsp turmeric powder, 1 pinch black pepper, 1 tsp Nature's Mud Virgin Coconut Oil, and 1 tsp Nature's Mud Dates Powder. Drink warm 30 minutes before sleep."
    ],
    tags: ['golden milk', 'haldi doodh', 'coconut oil', 'turmeric', 'curcumin', 'ayurveda', 'anti inflammatory'],
    featured: true
  },
  {
    id: 'b-beetroot-skin-glow-detox',
    slug: 'the-betalain-glow-how-beetroot-powder-cleanses-hepatic-bile-for-acne-free-skin',
    title: 'The Betalain Glow: How Himalayan Beetroot Powder Cleanses Hepatic Bile for Clear, Radiant Skin',
    excerpt: 'Dermatological and hepatic insights on betacyanin antioxidants: neutralizing phase 1 liver free radicals and clearing hormonal cystic breakouts.',
    image: '/products/beetroot-poster-2k.jpg',
    category: 'Sports Nutrition & Glow',
    author: 'Dermal Physiology Group, Nature\'s Mud',
    date: '2026-08-14',
    readTime: 6,
    content: [
      "Chronic facial acne, dull complexion, and dark under-eye circles are often outward manifestations of sluggish liver detoxification and poor peripheral microcirculation. When the liver is burdened by processed foods, toxic bile recirculates, forcing the skin to act as an excretory organ.",
      "### The Cleansing Power of Betalain Pigments",
      "**Nature's Mud Pure Himalayan Beetroot Powder** is rich in **betalains (betacyanin and betanin)**, powerful nitrogenous water-soluble pigments:",
      "- **Phase 2 Liver Enzyme Activation:** Betalains upregulate glutathione S-transferase (GST) enzymes in hepatocytes, accelerating the neutralization of fat-soluble toxins into water-soluble metabolites for safe bile excretion.",
      "- **Peripheral Capillary Oxygenation:** Dietary nitrates enhance micro-capillary blood flow to the epidermis, delivering oxygen and nutrients for a natural rosy flush.",
      "### Daily Skin Glow Shot",
      "Whisk 1 tsp Beetroot Powder into 100ml pomegranate juice or water with 1 tbsp fresh lime juice. Drink daily before breakfast."
    ],
    tags: ['beetroot powder', 'skin glow', 'acne relief', 'liver detox', 'betalains', 'antioxidants'],
    featured: false
  },
  {
    id: 'b-iron-rich-postpartum-smoothie-guide',
    slug: 'rapid-ferritin-recovery-anemic-mothers-beetroot-dates-pomegranate',
    title: 'Rapid Ferritin & Hemoglobin Recovery for Postpartum Mothers: The Iron Synergy Elixir',
    excerpt: 'How combining non-heme iron in dates powder with dietary nitrates in beetroot powder and Vitamin C accelerates red blood cell volume after birth.',
    image: '/products/beetroot-vital-blood.jpg',
    category: "Women's Health & Hormones",
    author: "Nature's Mud Maternal Health Desk",
    date: '2026-08-13',
    readTime: 7,
    content: [
      "Postpartum fatigue, dizziness, and low milk production are frequently linked to depleted maternal ferritin (iron storage) following childbirth blood loss.",
      "### The Triple Absorption Synergy",
      "- **Nature's Mud Dates Powder:** Concentrated plant-based non-heme iron and potassium.",
      "- **Nature's Mud Pure Beetroot Powder:** Dietary nitrates and folate (Vitamin B9) essential for erythropoiesis (new red blood cell formation).",
      "- **Fresh Vitamin C (Lime or Pomegranate Juice):** Converts ferric iron (Fe3+) into absorbable ferrous iron (Fe2+) in the acidic duodenum.",
      "### Daily Ferritin Recovery Elixir",
      "Whisk 1 tsp Beetroot Powder and 1 tsp Dates Powder into 1 cup of fresh pomegranate or orange juice. Drink midday between meals for maximum absorption."
    ],
    tags: ['iron boost', 'postpartum recovery', 'beetroot powder', 'dates powder', 'ferritin', 'womens health'],
    featured: false
  },
  {
    id: 'b-pumpkin-seed-butter-nut-free-school-lunches',
    slug: 'nut-free-school-lunchbox-guide-homemade-himalayan-pumpkin-seed-butter',
    title: 'The Nut-Free School Lunchbox Revolution: Why Creamy Himalayan Pumpkin Seed Butter Is the Allergy-Safe Hero',
    excerpt: 'How to make a velvety 3-ingredient spread packed with bioavailable zinc, protein, and magnesium that is 100% safe for peanut-free classrooms.',
    image: '/products/pumpkin-seeds.jpg',
    category: 'Pediatric Nutrition',
    author: "Nature's Mud Family Kitchen",
    date: '2026-08-12',
    readTime: 6,
    content: [
      "With peanut and tree nut allergies on the rise, many modern schools and daycares enforce strict 'nut-free' lunchbox policies. Parents often struggle to find protein-rich, satisfying sandwich spreads to replace peanut butter.",
      "### The Superfood Solution: Himalayan Pepita Butter",
      "Made by pureeing lightly toasted **Nature's Mud Organic Himalayan Pumpkin Seeds** with a drizzle of cold-pressed virgin coconut oil and pink salt, pumpkin seed butter is:",
      "- **100% Allergy-Safe & School Compliant:** Free from peanuts, tree nuts, dairy, soy, and gluten.",
      "- **Higher in Magnesium & Zinc than Peanut Butter:** Packed with 9g of complete plant protein per 2-tablespoon serving.",
      "- **Nut-Free Sandwiches & Dip:** Spread over whole grain bread with sliced bananas, or serve with crisp Himalayan apple slices."
    ],
    tags: ['pumpkin seed butter', 'nut free lunchbox', 'kids lunch', 'pumpkin seeds', 'zinc spread', 'school snacks'],
    featured: false
  },
  {
    id: 'b-chia-seed-pudding-weight-management',
    slug: 'satiety-hormones-how-chia-soluble-gel-triggers-peptide-yy-glp1-naturally',
    title: 'The Satiety Secret: How Chia Seed Soluble Mucilage Naturally Activates GLP-1 and PYY Fullness Hormones',
    excerpt: 'The endocrinology of natural weight management: how hydrophilic chia gel slows gastric emptying, curtails appetite, and flattens insulin spikes.',
    image: '/products/chia-seeds.jpg',
    category: 'Clinical Nutrition',
    author: 'Metabolic Endocrinology Group, Nature\'s Mud',
    date: '2026-08-11',
    readTime: 8,
    content: [
      "In the age of pharmaceutical weight-loss GLP-1 agonist injections, nutritional scientists emphasize that the human gut has its own innate mechanism for releasing satiety hormones: **viscous soluble dietary fiber**.",
      "### The Gastric Distension & Hormonal Cascade",
      "- **Delayed Gastric Emptying:** When Nature's Mud Black Chia Seeds expand 12x in liquid, they create an aqueous gel that lines the stomach wall, stimulating gastric mechanoreceptors.",
      "- **Release of GLP-1 & Peptide YY (PYY):** As chia's soluble fiber reaches the distal ileum and colon, L-cells secrete Glucagon-Like Peptide-1 (GLP-1) and Peptide YY, signaling the brain's hypothalamus that you are fully satisfied.",
      "- **3 to 4 Hours of Steady Satiety:** Eliminates mindless snacking and stabilizes blood glucose throughout busy mornings."
    ],
    tags: ['chia seeds', 'weight management', 'glp1', 'satiety', 'appetite control', 'fiber'],
    featured: false
  },
  {
    id: 'b-walnut-brain-plasticity-dementia-prevention',
    slug: 'clinical-trials-daily-walnut-intake-preventing-age-related-cognitive-decline',
    title: 'Preserving the Aging Brain: Clinical Evidence on Daily Walnut Consumption and Neurodegenerative Resilience',
    excerpt: 'A review of the Walnuts and Healthy Aging (WAHA) clinical trials: preserving white matter integrity, improving processing speed, and reducing neuro-plaque.',
    image: '/products/walnuts.jpg',
    category: 'Brain Health & Cognition',
    author: 'Geriatric Neuroscience Desk, Nature\'s Mud',
    date: '2026-08-10',
    readTime: 8,
    content: [
      "As life expectancy increases, maintaining cognitive independence and preventing Alzheimer's disease and vascular dementia is paramount. Landmark multi-center clinical trials (such as the WAHA study) demonstrate that long-term walnut consumption directly preserves brain function in aging adults.",
      "### The Protective Biochemical Matrix of Himalayan Walnuts",
      "- **Plant Omega-3 (ALA):** Replaces rigid saturated fats in neuronal synapses, preserving the speed of neurotransmission.",
      "- **Urolithin A Metabolites:** Ellagitannins in raw walnut skins are transformed by gut bacteria into Urolithin A, which triggers **mitophagy**—the clearing of dysfunctional, damaged mitochondria inside aging brain cells.",
      "- **Cognitive Recommendation:** 30 to 45 grams (a generous handful) of Nature's Mud Raw Himalayan Walnuts daily."
    ],
    tags: ['walnuts', 'dementia prevention', 'brain health', 'neuroplasticity', 'aging gracefully', 'omega 3'],
    featured: false
  },
  {
    id: 'b-ancient-salt-caves-himalayas',
    slug: 'the-geological-wonder-250-million-years-of-mineral-crystallization-in-himalayan-rock-salt',
    title: 'The 250-Million-Year Geological Marvel: Inside the Ancient Seabed of Himalayan Pink Rock Salt',
    excerpt: 'The fascinating geological history of primal Jurassic oceans, volcanic magma pressure, and why ancient unpolluted rock salt has zero microplastics.',
    image: '/products/pink-salt-crystals.jpg',
    category: 'Provenance & Sustainability',
    author: 'Geology & Mineral Sourcing Desk, Nature\'s Mud',
    date: '2026-08-09',
    readTime: 7,
    content: [
      "Long before industrial pollution, plastic waste, and chemical effluents contaminated modern oceans, a pristine primal ocean covered the area that is now the Himalayan mountain range over 250 million years ago during the Mesozoic era.",
      "### The Formation of Primal Salt Crystals",
      "As tectonic plates collided to push up the Himalayas, the primal sea evaporated under intense volcanic heat and immense geological tectonic pressure, crystallizing into deep subterranean mineral beds protected by volcanic lava layers.",
      "### Zero Microplastics Guarantee",
      "Recent marine studies reveal that over 90% of modern sea salts contain microscopic plastic particles. In contrast, **Nature's Mud Ancient Himalayan Pink Rock Salt** is mined from unpolluted deep primal strata, free from modern airborne microplastics, heavy industrial runoff, or chemical bleaching agents."
    ],
    tags: ['pink salt', 'himalayan salt', 'geology', 'microplastic free', 'pure salt', 'provenance'],
    featured: false
  },
  {
    id: 'b-wildcrafting-mustang-cliff-honey-tribes',
    slug: 'the-brave-honey-hunters-of-nepal-sustainable-harvest-of-wild-mountain-cliff-nectar',
    title: 'The Brave Honey Hunters of Nepal: Sustainable Wildcrafting of High-Altitude Cliff Nectar in Mustang',
    excerpt: 'An inside look at the perilous ancestral tradition of Himalayan cliff honey hunting: honoring the sacred wild bees, eco-conservation, and pure unheated honey.',
    image: '/products/raw-honey.jpg',
    category: 'Provenance & Sustainability',
    author: 'Cultural Documentation & Sourcing Team, Nature\'s Mud',
    date: '2026-08-08',
    readTime: 8,
    content: [
      "In the sheer rock faces of the Annapurna and Mustang Himalayas, indigenous Gurung and Magar honey hunters maintain a centuries-old ancestral tradition. Suspended on hand-woven hemp rope ladders hundreds of feet above roaring glacial river gorges, hunters carefully harvest wild honey combs built by *Apis laboriosa*—the world's largest honey bee.",
      "### Ethical & Sustainable Harvest Practices",
      "- **Preserving the Brood:** Hunters harvest only a portion of the honey comb, leaving the inner brood and queen intact so colonies thrive year after year.",
      "- **Raw Mountain Potency:** The honey is collected in wooden buckets and coarsely filtered without pasteurization, preserving raw propolis, pollen grains, and living digestive enzymes.",
      "Every spoonful of Nature's Mud Mustang Raw Wild Honey connects you to the pristine beauty and courage of the Himalayas."
    ],
    tags: ['mustang honey', 'honey hunters', 'nepal traditions', 'wildcrafting', 'raw honey', 'sustainability'],
    featured: true
  },
  {
    id: 'b-baby-superfood-smoothies-toddlers',
    slug: 'toddler-superfood-smoothie-blueprint-sneaking-vegetables-seeds-without-tears',
    title: 'The Toddler Superfood Smoothie Blueprint: How to Sneak Vegetables, Seeds & Healthy Fats Without Tears',
    excerpt: 'A pediatrician-approved guide for parents of picky eaters: creating delicious, naturally sweet superfood smoothies loaded with hidden carrot, beetroot, and chia.',
    image: '/images/recipes/sweet-potato-stirred-smoothie.jpg',
    category: 'Pediatric Nutrition',
    author: "Nature's Mud Pediatric Nutrition Desk",
    date: '2026-08-07',
    readTime: 6,
    content: [
      "Getting toddlers to eat bitter leafy greens, crunchy seeds, or fibrous root vegetables can feel like a daily battle. Smoothies are a fun, stress-free vehicle for delivering dense micronutrients.",
      "### The Stealth Superfood Formula",
      "- **The Sweet Base:** 1 ripe banana or 1/2 cup mango slices.",
      "- **The Hidden Vegetable Power:** 1 tsp Nature's Mud Organic Carrot Powder (Vitamin A) or 1/2 tsp Beetroot Powder (creates an exciting pink 'unicorn smoothie').",
      "- **The Healthy Brain Fats:** 1 tsp pre-soaked chia seeds or 1 tsp crushed walnut powder.",
      "- **The 100% Sugar-Free Sweetener:** 1 tsp Nature's Mud Dates Powder.",
      "Blend with whole milk or oat milk and watch your toddler drink 100% of their daily vitamins with a smile!"
    ],
    tags: ['toddler smoothies', 'picky eaters', 'kids nutrition', 'carrot powder', 'beetroot powder', 'baby food'],
    featured: false
  }
];

const allNewBlogs = [...list1, ...list2, ...additionalBlogs];

let allUniqueBlogs = [];
const seenSlugs = new Set();

allNewBlogs.forEach((b) => {
  if (!seenSlugs.has(b.slug) && !seenSlugs.has(b.id)) {
    seenSlugs.add(b.slug);
    seenSlugs.add(b.id);
    allUniqueBlogs.push(b);
  }
});

let code = baseBlogsCode + '\n';

allUniqueBlogs.forEach((blog) => {
  code += `  {
    id: ${JSON.stringify(blog.id)},
    slug: ${JSON.stringify(blog.slug)},
    title: ${JSON.stringify(blog.title)},
    excerpt: ${JSON.stringify(blog.excerpt)},
    image: ${JSON.stringify(blog.image)},
    category: ${JSON.stringify(blog.category)},
    author: ${JSON.stringify(blog.author)},
    date: ${JSON.stringify(blog.date)},
    readTime: ${blog.readTime},
    content: ${JSON.stringify(blog.content, null, 6).replace(/\n\s*\]/, '\n    ]')},
    tags: ${JSON.stringify(blog.tags)},
    featured: ${Boolean(blog.featured)},
  },\n`;
});

code += '];\n\n' + otherContentCode;

fs.writeFileSync(contentFilePath, code, 'utf8');
console.log(`Rebuilt content.ts successfully with ${allUniqueBlogs.length} newly added authentic blogs! Total blogs in content.ts is now ${25 + allUniqueBlogs.length}.`);
