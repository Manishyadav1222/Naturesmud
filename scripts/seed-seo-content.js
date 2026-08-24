const mysql = require('mysql2/promise');

const blogPosts = [
  {
    title: 'Complete First Foods & Baby Feeding Guide in Nepal: Organic Solids, Porridges & Nut Powders',
    slug: 'baby-feeding-guide-first-organic-solids-nepal',
    excerpt: 'Step-by-step nutritional advice for introducing chemical-free first solids, sprouted ragi porridges, and micro-ground dry fruit powders to babies aged 6 to 24 months in Nepal.',
    featured_image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80',
    category: 'Baby Care',
    author: 'Nature\'s Mud Child Nutrition Specialists',
    tags: JSON.stringify(['baby feeding', 'baby food nepal', 'first solids', 'ragi porridge', 'baby nutrition']),
    content: `Transitioning your baby from exclusive breastfeeding to wholesome solid foods is one of the most exciting milestones in early parenthood. In Nepal, pediatricians and traditional caregivers agree that chemical-free, nutrient-dense whole foods form the cornerstone of lifelong immunity, cognitive vitality, and digestive wellness.

### When to Introduce First Solids (The 6-Month Milestone)
According to the World Health Organization (WHO) and infant health guidelines, babies should be introduced to complementary solids around 6 months of age, once they can sit upright with support and show genuine curiosity in family meals.

### Why Choose Organic, Sprouted Whole Grains for Baby Porridge?
Conventional packaged baby cereals often contain hidden preservatives, refined sugars, and synthetic flavorings. **Nature's Mud Sprouted Ragi & Oats Baby Porridge** utilizes traditional germination techniques that break down anti-nutrients (like phytic acid), unlocking maximum bioavailability of Calcium, Iron, and Dietary Fiber.

### How to Safely Introduce Micro-Ground Dry Fruits to Infants
1. **Start with Single Nuts:** Begin around 7–8 months with a quarter teaspoon of micro-ground sweet almond powder blended smoothly into warm breastmilk, formula, or vegetable puree.
2. **Watch the 3-Day Rule:** Introduce one new ingredient for three consecutive days to monitor gentle digestion.
3. **Avoid Whole Nuts Before Age 4:** Whole nuts present a choking hazard. Always use micro-milled powders or smooth purees.

### Sample First Month Feeding Schedule:
- **Morning:** Warm Sprouted Ragi & Banana Mash with a pinch of Ceylon cinnamon.
- **Midday:** Steamed Apple & Soaked Chia Seed Puree.
- **Evening:** Organic Green Moong & Rice Khichdi with a drop of pure cold-pressed oil.`,
    is_published: 1,
    published_at: new Date('2025-02-10T08:00:00Z'),
  },
  {
    title: 'Essential Pregnancy Nutrition & Mothercare: Trimester-by-Trimester Organic Superfoods Guide',
    slug: 'mothercare-pregnancy-nutrition-superfoods-nepal',
    excerpt: 'A complete nutritional roadmap for expectant mothers in Nepal: natural iron sources, dietary folate, omega-3 fatty acids, and Himalayan superfoods for a glowing pregnancy.',
    featured_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    category: 'Mothercare',
    author: 'Nature\'s Mud Holistic Health Team',
    tags: JSON.stringify(['pregnancy diet', 'mothercare', 'pregnancy superfoods', 'iron rich foods', 'maternal health']),
    content: `During pregnancy, maternal nutrition directly fuels fetal organogenesis, brain development, and maternal recovery. Eating a clean, chemical-free diet rich in Himalayan organic superfoods protects against gestational anemia, morning fatigue, and nutrient depletion.

### First Trimester: Natural Folate, Zinc & Nausea Relief
During the first 12 weeks, neural tube formation requires abundant dietary folate and zinc. Snack on raw Himalayan walnuts and pumpkin seeds, and sip warm ginger tea sweetened with a touch of pure raw honey to gently calm morning sickness.

### Second Trimester: Calcium, Iron & Bone Density
As your baby’s skeletal framework rapidly develops, iron and calcium demands surge. **Nature's Mud Organic Dried Figs (Anjeer)** and **Medjool Dates** provide easily absorbable non-heme iron and natural dietary fiber to prevent pregnancy-related constipation.

### Third Trimester: Healthy Fats & Cellular Energy
In the final stretch, the baby’s brain undergoes explosive growth. High-grade DHA precursors found in **Raw Himalayan Walnuts** and **Black Chia Seeds** optimize cognitive and visual development.

### Safe Superfoods for Expectant Mothers:
- **Pure Kashmiri-Origin Himalayan Saffron (Kesar):** A tiny pinch in warm milk during the 2nd and 3rd trimesters aids digestion and mood balance.
- **Organic Moringa Leaf Powder:** Packed with plant calcium, iron, and potassium.
- **Roasted Makhana (Foxnuts):** Low-glycemic, calcium-rich snacking that stabilizes blood sugar.`,
    is_published: 1,
    published_at: new Date('2025-02-01T08:00:00Z'),
  },
  {
    title: 'Postpartum Healing & Lactation Foods: Traditional Nepali Wisdom Meets Modern Science',
    slug: 'postpartum-recovery-lactation-foods-nepali-mothers',
    excerpt: 'How traditional Nepali postnatal recovery staples like Gond, Fenugreek, Moringa, and Pure Mustang Honey accelerate physical healing and boost breastmilk production.',
    featured_image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    category: 'Mothercare',
    author: 'Nature\'s Mud Postnatal Care Team',
    tags: JSON.stringify(['postpartum recovery', 'lactation food', 'breastfeeding superfoods', 'nepali mother care', 'gond ladoo']),
    content: `The "Fourth Trimester"—the first 40 days following childbirth—is a sacred window for tissue restoration, pelvic bone strengthening, and establishing a robust breastmilk supply for your newborn.

### The Science of Nepali Postpartum Superfoods
Nepali grandmothers have championed nutritious postpartum remedies for generations. Modern nutritional science confirms why these superfoods work so effectively:
1. **Edible Gond (Dink / Acacia Gum):** Loaded with natural collagen-building compounds that restore spinal strength and joint mobility after labor.
2. **Organic Moringa Powder:** A clinically proven galactagogue that increases prolactin levels, naturally enhancing breastmilk quantity and quality.
3. **Roasted Sesame & Flaxseed Mix:** Rich in plant estrogens and healthy lignans that support hormone balance.

### How to Prepare Traditional Postpartum Ladoos:
Roast Nature's Mud Himalayan walnuts, almonds, gond, and foxnuts in pure country ghee. Coarsely grind with date powder and a dash of nutmeg. Roll into golf-ball-sized laddoos for an effortless, daily postpartum healing treat.`,
    is_published: 1,
    published_at: new Date('2025-01-25T08:00:00Z'),
  },
  {
    title: 'The Ultimate Guide to Pure Himalayan Honey: Ancient Healing, Immunity & Purity Secrets',
    slug: 'pure-himalayan-honey-benefits-nepal',
    excerpt: 'Discover why raw, unpasteurized honey harvested above 3,000 meters in Mustang and Manang is nature’s most potent antioxidant and digestive elixir.',
    featured_image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
    category: 'Superfoods',
    author: 'Nature\'s Mud Harvest Team',
    tags: JSON.stringify(['himalayan honey', 'raw honey nepal', 'mustang honey', 'immunity', 'organic superfoods']),
    content: `Commercial supermarket honey is frequently ultra-filtered, adulterated with industrial sugar syrups, and heated past 65°C—a process that permanently destroys active enzymes, pollen grains, and medicinal flavonoids.

### What Makes Nature’s Mud Mustang Honey Exceptional?
Harvested from wild high-altitude flora in the trans-Himalayan valleys of Nepal, our **Raw Mustang Honey** is completely unheated and chemical-free.

### Verified Health Benefits:
- **Potent Antibacterial Activity:** Contains natural glucose oxidase which produces micro-doses of hydrogen peroxide for soothing sore throats.
- **Prebiotic Gut Support:** Nourishes friendly bifidobacteria in your digestive tract.
- **Low Glycemic Index:** Slower blood sugar release compared to refined table sugar.
*(Note: As a standard pediatric safety guideline, honey should not be fed to infants under 12 months of age).*`,
    is_published: 1,
    published_at: new Date('2025-01-15T08:00:00Z'),
  },
  {
    title: 'Why Organic Moringa Powder is Nepal’s Ultimate Morning Superfood for All Ages',
    slug: 'organic-moringa-powder-morning-superfood',
    excerpt: 'Learn how single-origin shade-dried moringa leaf powder delivers sustained morning vitality, blood purification, and immune defense without caffeine crashes.',
    featured_image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    category: 'Nutrition',
    author: 'Nature\'s Mud Wellness Experts',
    tags: JSON.stringify(['moringa powder', 'miracle tree', 'organic superfood nepal', 'energy boost', 'antioxidants']),
    content: `Known locally as *Sajiwan* or *Shobhanjan*, Moringa oleifera has been revered in Himalayan Ayurvedic texts for over 4,000 years as the "Tree of Life."

### Micronutrient Comparison per 100g:
- **7x more Vitamin C** than fresh oranges
- **10x more Vitamin A** than carrots
- **17x more Calcium** than cow milk
- **15x more Potassium** than bananas
- **25x more Iron** than spinach

### How to Consume Moringa Daily:
Stir half a teaspoon into warm water with lemon and raw honey, or blend into green morning smoothies for an instant, non-jittery energy elevation.`,
    is_published: 1,
    published_at: new Date('2025-01-08T08:00:00Z'),
  },
  {
    title: 'Cardiovascular Vitality: Why Raw Himalayan Almonds & Black Chia Seeds Beat Processed Snacks',
    slug: 'heart-health-raw-almonds-chia-seeds',
    excerpt: 'Protect your heart naturally. How daily consumption of raw unpeeled almonds and cold-grown black chia seeds reduces LDL cholesterol and supports clear arterial health.',
    featured_image: 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=800&q=80',
    category: 'Heart Health',
    author: 'Nature\'s Mud Nutrition Specialists',
    tags: JSON.stringify(['raw almonds', 'chia seeds', 'heart health', 'cholesterol control', 'healthy fats']),
    content: `Cardiovascular wellness is built meal by meal. Substituting fried snacks with raw organic nuts and seeds directly reduces vascular inflammation and balances lipid profiles.

### Raw Himalayan Almonds vs Roasted Commercial Nuts
Commercial roasted nuts are frequently fried in high-omega-6 palm oils and coated in synthetic salt. Nature's Mud raw almonds are sun-dried, preserving all natural Vitamin E, magnesium, and plant sterols.

### Black Chia Seeds: Plant-Based Omega-3 Champions
Chia seeds absorb up to 12 times their weight in water, forming a soothing soluble fiber gel that slows carbohydrate breakdown and gently sweeps excess cholesterol out of the digestive system.`,
    is_published: 1,
    published_at: new Date('2024-12-28T08:00:00Z'),
  },
  {
    title: 'Brain-Boosting Dry Fruits & Seeds for Kids: Natural Nutrition for Growing Minds in Nepal',
    slug: 'dry-fruits-for-kids-brain-growth-immunity',
    excerpt: 'From exam focus to physical stamina: the best combinations of walnuts, cashews, raisins, and pumpkin seeds to fuel your child’s growth without refined junk food.',
    featured_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    category: 'Kids Health',
    author: 'Nature\'s Mud Pediatric Nutrition Team',
    tags: JSON.stringify(['kids nutrition', 'brain food', 'walnuts for kids', 'healthy snacks nepal', 'child health']),
    content: `Parents across Nepal often struggle with fussy eating habits and the temptation of packaged chips and biscuits. Replacing artificial snacks with naturally sweet, crunchy dry fruits provides steady brain fuel.

### Top 4 Brain-Boosting Superfoods for Children:
1. **Raw Himalayan Walnuts:** The classic "brain food"—packed with ALA omega-3s, melatonin, and polyphenols.
2. **Golden Afghani Raisins (Kishmish):** Natural source of boron for bone density and iron for energetic playtime.
3. **Roasted Pumpkin Seeds:** Abundant in zinc and magnesium for restful sleep and strong immunity.
4. **Sweet Whole Cashews:** Creamy, delicious plant protein that keeps school-going children satiated.`,
    is_published: 1,
    published_at: new Date('2024-12-20T08:00:00Z'),
  },
  {
    title: 'Dried Figs (Anjeer) & Medjool Dates: Nature’s Most Potent Remedy for Anemia & Digestion',
    slug: 'benefits-of-dried-figs-anjeer-dates-iron',
    excerpt: 'Struggling with low hemoglobin or sluggish digestion? Discover how pairing organic dried figs with soft Medjool dates naturally rebuilds red blood cells.',
    featured_image: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800&q=80',
    category: 'Superfoods',
    author: 'Nature\'s Mud Herbalist Team',
    tags: JSON.stringify(['dried figs', 'anjeer benefits', 'medjool dates', 'iron deficiency', 'hemoglobin nepal']),
    content: `Iron-deficiency anemia is common among women and children. Instead of relying solely on synthetic iron pills that often cause gastric distress, natural whole-food iron sources provide gentle, sustained nourishment.

### Why Soak Dried Figs (Anjeer) Overnight?
Soaking 2–3 dried figs in water overnight softens their rich soluble fiber matrix and makes minerals like iron, potassium, and magnesium instantly bioavailable on an empty stomach.

### Medjool Dates: Instant Stamina & Mineral Density
Known as the "King of Dates," Medjool dates are exceptionally rich in copper, manganese, and Vitamin B6, making them ideal pre-workout fuel or healthy lunchbox treats.`,
    is_published: 1,
    published_at: new Date('2024-12-15T08:00:00Z'),
  },
  {
    title: 'Cold-Pressed Virgin Oils in Nepal: From Baby Massage to Heart-Healthy Cooking',
    slug: 'cold-pressed-virgin-coconut-mustard-oil-benefits',
    excerpt: 'Why unrefined, wooden-kolhu cold-pressed mustard, coconut, and sesame oils are vastly superior to chemically bleached refined cooking oils.',
    featured_image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
    category: 'Lifestyle',
    author: 'Nature\'s Mud Ayurvedic Care Team',
    tags: JSON.stringify(['cold pressed oil', 'baby massage oil', 'mustard oil nepal', 'virgin coconut oil', 'ayurvedic oil']),
    content: `In traditional Nepali culture, cold-pressed oils are not just cooking ingredients—they are therapeutic elixirs used for infant massage (*tel lagaune*), skin barrier nourishment, and digestive health.

### Traditional Cold-Pressed Mustard Oil for Baby Massage:
Extracted at low temperatures without chemical solvents, pure cold-pressed mustard oil improves blood circulation, strengthens growing limbs, and provides natural warmth during chilly Himalayan winters.

### Virgin Coconut Oil for Sensitive Skin & Cradle Cap:
High in lauric acid (a compound naturally found in mother’s breastmilk), virgin coconut oil soothes diaper rash, eases cradle cap, and hydrates delicate baby skin.`,
    is_published: 1,
    published_at: new Date('2024-12-10T08:00:00Z'),
  },
  {
    title: 'Pure Himalayan Shilajit: Ancient Rasayana for Stamina, Cellular Vitality & Immunity',
    slug: 'himalayan-shilajit-authenticity-health-benefits',
    excerpt: 'Everything you need to know about genuine gold-grade Himalayan Shilajit resin: fulvic acid concentration, purity verification, and safe daily usage.',
    featured_image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    category: 'Superfoods',
    author: 'Nature\'s Mud Botanical Specialists',
    tags: JSON.stringify(['shilajit', 'himalayan shilajit', 'fulvic acid', 'stamina nepal', 'ayurvedic energy']),
    content: `Exuding slowly from high-altitude Himalayan cliff crevices above 16,000 feet, **Shilajit** is formed over centuries through the microbial decomposition of rare medicinal plants.

### The Power of Fulvic Acid & 84+ Trace Minerals
Pure Shilajit resin is the world’s richest natural source of **Fulvic Acid**—a powerful electrolyte that enhances cell-wall permeability, transporting nutrients directly into mitochondria for heightened ATP energy production.

### How to Take Shilajit Resin:
Dissolve a pea-sized amount (300–500mg) in warm spring water, herbal tea, or warm country milk in the morning.`,
    is_published: 1,
    published_at: new Date('2024-12-02T08:00:00Z'),
  },
  {
    title: 'Roasted Makhana (Foxnuts): The Ultimate Protein-Rich Super Snack for Toddlers & Mothers',
    slug: 'roasted-makhana-foxnuts-snack-toddlers-mothers',
    excerpt: 'Crunchy, light, and loaded with calcium: discover why roasted makhana is the premier healthy snack for toddlers, pregnant mothers, and weight-conscious families.',
    featured_image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&q=80',
    category: 'Snacks',
    author: 'Nature\'s Mud Healthy Kitchen',
    tags: JSON.stringify(['makhana benefits', 'foxnuts', 'healthy snacking nepal', 'toddler snacks', 'pregnancy snacks']),
    content: `When hunger strikes between meals, processed potato chips and salted biscuits introduce dangerous trans fats and excess sodium. **Organic Foxnuts (Phool Makhana)** offer a guilt-free alternative.

### Key Nutritional Highlights:
- **High Plant Protein:** 9.7g of bioavailable protein per 100g.
- **High Calcium & Magnesium:** Essential for growing toddler bones and maternal muscle relaxation.
- **Zero Cholesterol & Low Glycemic Index:** Safe for diabetic and hypertensive family members.`,
    is_published: 1,
    published_at: new Date('2024-11-25T08:00:00Z'),
  },
  {
    title: 'Pure Himalayan Saffron (Kesar) During Pregnancy: Real Benefits, Safe Usage & Authentic Sourcing',
    slug: 'saffron-kesar-during-pregnancy-facts-benefits',
    excerpt: 'Separating ancient folklore from clinical facts: how a gentle pinch of pure red saffron strands improves maternal digestion, mood, and peaceful sleep.',
    featured_image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80',
    category: 'Mothercare',
    author: 'Nature\'s Mud Maternal Wellness Team',
    tags: JSON.stringify(['saffron pregnancy', 'kesar benefits', 'himalayan saffron', 'mothercare', 'pregnancy wellness']),
    content: `Saffron (*Crocus sativus*) is the world’s most precious spice. Used for millennia in Himalayan traditional medicine, a delicate pinch of authentic red saffron strands offers remarkable benefits during the second and third trimesters of pregnancy.

### True Health Benefits During Pregnancy:
1. **Digestive Soothing:** Eases bloating and cramps by coating digestive tissues.
2. **Mood Elevation:** Crocin and safranal promote serotonin release, soothing pregnancy mood swings.
3. **Restful Sleep:** Mild natural sedative properties calm restless legs at bedtime.

### Safe Usage Dosage:
Use only 2–3 fine strands steeped in warm milk once daily starting from the 5th month of pregnancy onward.`,
    is_published: 1,
    published_at: new Date('2024-11-18T08:00:00Z'),
  },
  {
    title: 'The Super Seed Trifecta: Pumpkin, Sunflower & Flaxseeds for Hormonal Balance & Digestion',
    slug: 'pumpkin-sunflower-flaxseed-daily-benefits',
    excerpt: 'Harness the power of seed cycling. How adding raw pumpkin, sunflower, and sprouted flaxseeds to your daily meals balances hormones and improves skin glow.',
    featured_image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&q=80',
    category: 'Superfoods',
    author: 'Nature\'s Mud Seed Nutrition Team',
    tags: JSON.stringify(['pumpkin seeds', 'flaxseeds', 'sunflower seeds', 'hormone balance', 'seed cycling']),
    content: `Tiny in size but colossal in nutrient density, seeds are the concentrated life force of plants. Incorporating a daily tablespoon of raw seeds transforms digestive health.

### Pumpkin Seeds (Zinc & Magnesium Powerhouses):
Crucial for immune cellular repair, deep sleep, and prostate wellness.

### Sunflower Seeds (Vitamin E & Selenium):
Powerful lipid-soluble antioxidants that protect skin cells against urban pollution.

### Flaxseeds (Lignans & Alpha-Linolenic Acid):
The premier plant source of soluble mucilage fiber for smooth intestinal motility.`,
    is_published: 1,
    published_at: new Date('2024-11-10T08:00:00Z'),
  },
  {
    title: 'From Farm to Pantry: The Truth About Chemical-Free Organic Living in Nepal',
    slug: 'farm-to-pantry-chemical-free-groceries-nepal',
    excerpt: 'Why Nature\'s Mud partners directly with organic growers across Nepal to eliminate synthetic pesticides, artificial dyes, and toxic food preservatives.',
    featured_image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    category: 'Lifestyle',
    author: 'Nature\'s Mud Founders',
    tags: JSON.stringify(['organic nepal', 'chemical free food', 'sustainable farming', 'healthy living kathmandu']),
    content: `In a modern food system flooded with ultra-processed convenience foods, preserving the purity of our daily pantry staples is an act of family health protection.

### The Nature’s Mud 4-Pillar Promise:
1. **Direct Farmer Partnerships:** Sourcing only from ethical growers who use compost and organic pest management.
2. **Sun-Dried & Cold-Pressed:** Avoiding destructive industrial heat processing.
3. **Zero Synthetic Preservatives:** No sulfur dioxide, artificial glazes, or petroleum-derived colorings.
4. **Eco-Conscious Packaging:** Preserving freshness while respecting our Himalayan environment.`,
    is_published: 1,
    published_at: new Date('2024-11-01T08:00:00Z'),
  },
];

const recipes = [
  {
    title: 'Himalayan Superfood Breakfast Bowl with Chia Seeds & Wild Honey',
    slug: 'himalayan-superfood-breakfast-bowl',
    excerpt: 'Start your morning with this nutrient-dense breakfast bowl featuring black chia seeds, wild Mustang honey, crushed walnuts, and antioxidant berries.',
    featured_image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&q=80',
    category: 'Breakfast',
    prep_time: 10,
    cook_time: 0,
    servings: 2,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '1/2 cup Nature\'s Mud Black Chia Seeds',
      '2 cups unsweetened almond milk or coconut milk',
      '1 tbsp Nature\'s Mud Raw Mustang Honey',
      '1/4 cup Nature\'s Mud Himalayan Raw Almonds (chopped)',
      '1/4 cup Nature\'s Mud Raw Walnut Halves (crushed)',
      '1/2 cup fresh strawberries and blueberries',
      '1 tsp pure vanilla extract',
    ]),
    instructions: JSON.stringify([
      'In a wide glass bowl, whisk together the chia seeds, almond milk, raw honey, and vanilla extract.',
      'Let the mixture rest for 10 minutes, stirring once to prevent clumping until it reaches a velvety pudding texture.',
      'Divide between two serving bowls.',
      'Generously top with freshly chopped almonds, crushed walnuts, and antioxidant-rich berries.',
      'Drizzle with an extra drop of raw honey and serve chilled.',
    ]),
    is_published: 1,
  },
  {
    title: 'Energizing Moringa & Spinach Green Smoothie with Raw Honey',
    slug: 'moringa-green-smoothie',
    excerpt: 'A revitalizing morning green smoothie packed with organic moringa leaf powder, ripe banana, and chia seeds for steady, non-caffeinated energy.',
    featured_image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80',
    category: 'Smoothies',
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '1 tsp Nature\'s Mud Organic Moringa Leaf Powder',
      '1 ripe banana (fresh or frozen)',
      '1 cup fresh baby spinach',
      '1/2 cup plain probiotic curd or Greek yogurt',
      '1/2 cup pure coconut water or cold spring water',
      '1 tbsp Nature\'s Mud Black Chia Seeds',
      '1 tsp Nature\'s Mud Raw Mustang Honey',
    ]),
    instructions: JSON.stringify([
      'Add the spinach, banana, moringa leaf powder, chia seeds, yogurt, and coconut water to a high-speed blender.',
      'Blend on high for 60 seconds until completely smooth and creamy green.',
      'Taste and stir in raw honey for natural balanced sweetness.',
      'Pour into a tall chilled glass and enjoy immediately for maximum antioxidant absorption.',
    ]),
    is_published: 1,
  },
  {
    title: 'Raw Cacao & Medjool Date Energy Truffles (No-Bake Snack)',
    slug: 'cacao-energy-bites',
    excerpt: 'Wholesome, guilt-free snack truffles loaded with raw cacao, plump Medjool dates, and crushed Himalayan almonds.',
    featured_image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    category: 'Snacks',
    prep_time: 15,
    cook_time: 0,
    servings: 12,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '1 cup Nature\'s Mud Medjool Dates (pitted)',
      '1 cup Nature\'s Mud Raw Himalayan Almonds',
      '2 tbsp pure Raw Cacao Powder',
      '1 tbsp cold-pressed coconut oil',
      '1 tsp pure vanilla extract',
      'Pinch of Himalayan pink salt',
      '1/4 cup unsweetened shredded coconut flakes for rolling',
    ]),
    instructions: JSON.stringify([
      'Pulse the raw almonds in a food processor until coarsely crumbed.',
      'Add pitted Medjool dates, cacao powder, coconut oil, vanilla, and pink salt. Process until a thick, pliable dough forms.',
      'Scoop tablespoons of dough and roll firmly between your palms into 12 even balls.',
      'Roll each truffle in shredded coconut flakes to coat evenly.',
      'Refrigerate for 25 minutes to set. Store in an airtight container for up to 2 weeks.',
    ]),
    is_published: 1,
  },
  {
    title: 'Sprouted Ragi & Sprouted Nut Baby Porridge (Ages 6+ Months)',
    slug: 'organic-baby-first-porridge-nut-powder',
    excerpt: 'Gentle, easy-to-digest first porridge for babies made with sprouted ragi flour, date powder sweetener, and micro-milled sweet almond powder.',
    featured_image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80',
    category: 'Baby Food',
    prep_time: 5,
    cook_time: 10,
    servings: 1,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '2 tbsp Nature\'s Mud Sprouted Ragi & Oats Baby Porridge Mix',
      '1 cup filtered water or warm breastmilk/formula',
      '1/4 tsp Nature\'s Mud Micro-Ground Almond & Cashew Nut Powder (7m+)',
      '1/2 tsp Nature\'s Mud Sun-Dried Date Powder',
      '1/2 tsp pure country ghee or virgin coconut oil',
    ]),
    instructions: JSON.stringify([
      'In a small non-stick pan, whisk the sprouted ragi porridge mix with 1 cup of water until completely free of lumps.',
      'Place on medium-low heat and cook for 6–8 minutes, stirring continuously as the porridge thickens smoothly.',
      'Turn off heat. Stir in the micro-ground nut powder, sun-dried date powder, and a tiny drop of pure ghee.',
      'Let cool to a comfortable lukewarm temperature before feeding your baby with a soft silicone spoon.',
    ]),
    is_published: 1,
  },
  {
    title: 'Traditional Nepali Gond & Himalayan Dry Fruit Ladoo for Postnatal Healing',
    slug: 'mothers-postpartum-gond-dry-fruit-ladoo',
    excerpt: 'Nutritious postpartum healing ladoos packed with edible gond (acacia gum), raw walnuts, almonds, foxnuts, and warming spices for new mothers.',
    featured_image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80',
    category: 'Mothercare',
    prep_time: 20,
    cook_time: 15,
    servings: 15,
    difficulty: 'Medium',
    ingredients: JSON.stringify([
      '1/2 cup Nature\'s Mud Edible Gond (Dink / Acacia Gum)',
      '1/2 cup Nature\'s Mud Raw Himalayan Walnuts',
      '1/2 cup Nature\'s Mud Himalayan Raw Almonds',
      '1 cup Nature\'s Mud Organic Makhana (Foxnuts)',
      '1/4 cup sprouted flaxseed and sesame seed blend',
      '1/2 cup pure Nepali cow ghee',
      '1 cup sun-dried date powder or organic jaggery powder',
      '1/2 tsp freshly ground nutmeg and green cardamom powder',
    ]),
    instructions: JSON.stringify([
      'Heat 2 tablespoons of ghee in a pan on medium heat. Fry the gond in small batches until it puffs up crisply like popcorn. Set aside to cool, then lightly crush with a rolling pin.',
      'In the same pan, lightly roast the almonds, walnuts, foxnuts, and seed blend until aromatic. Let cool and coarsely grind in a food processor.',
      'In a large mixing bowl, combine the crushed gond, ground nut-foxnut mixture, date powder, nutmeg, and cardamom.',
      'Pour the remaining warm melted ghee over the mixture and mix thoroughly.',
      'Shape into golf-ball-sized laddoos while still warm. Consume 1 ladoo daily with warm milk for postpartum vitality.',
    ]),
    is_published: 1,
  },
  {
    title: 'Crispy Turmeric Roasted Makhana (Foxnuts) & Seed Trail Mix',
    slug: 'roasted-foxnut-makhana-kids-trail-mix',
    excerpt: 'A crunchy, calcium-packed toddler and kids snack roasted in pure ghee with turmeric, pumpkin seeds, and sweet golden raisins.',
    featured_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    category: 'Snacks',
    prep_time: 5,
    cook_time: 8,
    servings: 4,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '3 cups Nature\'s Mud Organic Phool Makhana (Foxnuts)',
      '1/4 cup Nature\'s Mud Roasted Pumpkin Seeds',
      '1/4 cup Nature\'s Mud Golden Afghani Raisins (Kishmish)',
      '1 tbsp pure cow ghee or cold-pressed olive oil',
      '1/4 tsp organic turmeric powder',
      '1/4 tsp cumin powder',
      'Pinch of rock salt',
    ]),
    instructions: JSON.stringify([
      'Heat ghee in a heavy-bottomed wok on low flame.',
      'Add turmeric powder and cumin powder, letting the spices gently bloom for 10 seconds.',
      'Add the makhana and roast on low flame for 6–8 minutes, stirring frequently until crisp and easily crushed between your fingers.',
      'Remove from heat. Toss in the pumpkin seeds, raisins, and a pinch of rock salt.',
      'Let cool completely before serving as an ultra-healthy lunchbox or playtime crunch.',
    ]),
    is_published: 1,
  },
  {
    title: 'Anti-Inflammatory Golden Turmeric & Moringa Recovery Latte',
    slug: 'golden-turmeric-moringa-recovery-latte',
    excerpt: 'Soothe joints and boost cellular immunity with this Ayurvedic golden milk infusion of pure organic turmeric, moringa powder, and raw Mustang honey.',
    featured_image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    category: 'Drinks',
    prep_time: 5,
    cook_time: 5,
    servings: 1,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '1 cup warm whole milk, almond milk, or oat milk',
      '1/2 tsp organic turmeric powder (Besar)',
      '1/2 tsp Nature\'s Mud Organic Moringa Leaf Powder',
      '1 tsp Nature\'s Mud Raw Mustang Honey',
      '1/4 tsp ground cinnamon',
      'Pinch of black pepper (enhances turmeric absorption by 2000%)',
    ]),
    instructions: JSON.stringify([
      'Gently heat the milk in a small saucepan until steaming (do not boil).',
      'Whisk in the turmeric powder, moringa powder, cinnamon, and black pepper vigorously until frothy.',
      'Pour into your favorite mug.',
      'Allow the latte to cool slightly (to warm drinking temperature) before stirring in the raw Mustang honey to preserve active enzymes.',
      'Sip mindfully before bed for restorative sleep and anti-inflammatory wellness.',
    ]),
    is_published: 1,
  },
  {
    title: 'Silky Avocado, Banana & Soaked Chia Seed Puree (Ages 6+ Months)',
    slug: 'avocado-chia-seed-baby-puree',
    excerpt: 'A nutrient-dense first puree packed with healthy monounsaturated brain fats, potassium, and gentle omega-3 fiber for infant digestive ease.',
    featured_image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80',
    category: 'Baby Food',
    prep_time: 5,
    cook_time: 0,
    servings: 2,
    difficulty: 'Easy',
    ingredients: JSON.stringify([
      '1/2 ripe Haas avocado',
      '1/2 ripe organic banana',
      '1 tsp Nature\'s Mud Black Chia Seeds (pre-soaked in 2 tbsp water for 15 mins)',
      '2 tbsp warm breastmilk, formula, or boiled cooled water',
    ]),
    instructions: JSON.stringify([
      'Scoop the ripe avocado flesh and banana into a small baby food blender or mash thoroughly with a fork.',
      'Add the pre-soaked gelatinous chia seed gel and warm milk.',
      'Blend until completely silky and free of lumps.',
      'Serve fresh immediately to your baby for a creamy, naturally sweet, brain-fueling meal.',
    ]),
    is_published: 1,
  },
];

async function seedContent() {
  console.log('================================================================');
  console.log('🌱 SEEDING 14+ SEO BLOG POSTS & 8+ RECIPES INTO MYSQL DATABASE');
  console.log('================================================================\n');

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root_secret',
    database: 'natures_mud',
  });

  // 1. Seed Blog Posts
  console.log(`[1/2] Seeding ${blogPosts.length} SEO Blog Articles...`);
  for (const post of blogPosts) {
    await connection.execute(`
      INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        featured_image = VALUES(featured_image),
        author = VALUES(author),
        category = VALUES(category),
        tags = VALUES(tags),
        is_published = VALUES(is_published),
        published_at = VALUES(published_at),
        updated_at = NOW()
    `, [
      post.title,
      post.slug,
      post.excerpt,
      post.content,
      post.featured_image,
      post.author,
      post.category,
      post.tags,
      post.is_published,
      post.published_at,
    ]);
    console.log(`  ✓ Blog: "${post.title.substring(0, 50)}..."`);
  }

  // 2. Seed Recipes
  console.log(`\n[2/2] Seeding ${recipes.length} Step-by-Step Recipes...`);
  for (const rec of recipes) {
    await connection.execute(`
      INSERT INTO recipes (title, slug, excerpt, content, featured_image, category, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        featured_image = VALUES(featured_image),
        category = VALUES(category),
        prep_time = VALUES(prep_time),
        cook_time = VALUES(cook_time),
        servings = VALUES(servings),
        difficulty = VALUES(difficulty),
        ingredients = VALUES(ingredients),
        instructions = VALUES(instructions),
        is_published = VALUES(is_published),
        updated_at = NOW()
    `, [
      rec.title,
      rec.slug,
      rec.excerpt,
      rec.excerpt,
      rec.featured_image,
      rec.category,
      rec.prep_time,
      rec.cook_time,
      rec.servings,
      rec.difficulty,
      rec.ingredients,
      rec.instructions,
      rec.is_published,
    ]);
    console.log(`  ✓ Recipe: "${rec.title.substring(0, 50)}..."`);
  }

  const [blogCount] = await connection.execute('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1');
  const [recipeCount] = await connection.execute('SELECT COUNT(*) as count FROM recipes WHERE is_published = 1');

  console.log('\n================================================================');
  console.log(`✅ DATABASE SEEDED SUCCESSFULLY!`);
  console.log(`  Total Active Blogs in MySQL: ${blogCount[0].count}`);
  console.log(`  Total Active Recipes in MySQL: ${recipeCount[0].count}`);
  console.log('================================================================');

  await connection.end();
}

seedContent().catch((err) => {
  console.error('Error seeding content:', err);
  process.exit(1);
});
