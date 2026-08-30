const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. FITNESS & OUTDOOR NUTRITION PILLAR (15 MASTER ARTICLES)
// =========================================================================
const fitnessArticles = [
  {
    id: 'b-fitness-trekking-snacks-nepal',
    title: 'Best Snacks for Trekking in Nepal: High-Altitude Nutrition & Trail Energy',
    slug: 'best-snacks-for-trekking-in-nepal-himalayan-hiking',
    excerpt: 'The ultimate guide to packing lightweight, calorie-dense, nutritious trail snacks for trekking in the Himalayas. Discover optimal nut-seed ratios, hydration, and high-altitude energy.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Himalayan Fitness Team",
    readTime: 8,
    featured: true,
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    tags: ['best snacks for trekking in nepal', 'hiking snacks nepal', 'trekking food himalayas', 'trail snacks kathmandu', 'high altitude nutrition'],
    keyTakeaways: [
      'Caloric Density Matters: At high altitudes (3,000m+), aim for snacks providing 400–500 kcal per 100g, balancing complex carbs, healthy fats, and clean protein.',
      'Lightweight Packing: Raw mountain almonds, walnuts, pumpkin seeds, and dates powder offer maximum energy per gram without adding heavy pack weight.',
      'Electrolyte & Hydration Support: Pair soaked chia seeds and a pinch of Himalayan pink salt with water to prevent dehydration on steep ascents.',
      'Sustained Blood Sugar: Avoid high-sugar candy bars that cause rapid crashes; choose whole dates powder, dried fruits, and raw nuts for even energy release.'
    ],
    content: [
      "### Introduction: Fueling for Himalayan High-Altitude Trails",
      "Trekking through Nepal’s breathtaking landscapes—from the Annapurna Circuit and Everest Base Camp to Langtang Valley—burns anywhere from 3,500 to 5,500 calories per day depending on elevation gain, cold ambient temperatures, and backpack weight.",
      "At altitudes above 2,500 meters, your metabolic rate increases while appetite often decreases due to mild hypoxia. Relying solely on teahouse meals (dal bhat, noodles, and porridge) can leave you short on quick-digesting clean fats, electrolytes, and antioxidants needed for continuous muscle endurance.",
      "Carrying smart, shelf-stable, nutrient-dense snacks is critical for maintaining steady energy, preventing muscle breakdown, and ensuring you reach your daily pass safely and energized.",
      "",
      "### The Science of High-Altitude Trail Snacks",
      "When selecting trail snacks for hiking in Nepal, consider four fundamental criteria:",
      "- **1. High Caloric Density per Gram:** Every 100 grams in your daypack must count. Nuts and seeds provide 600 kcal/100g from clean unsaturated fatty acids.",
      "- **2. Complex Carbs for Glycogen Sparing:** Slow-burning carbohydrates (rolled oats, sun-dried mango, dried blueberries) fuel steep uphill climbs without insulin spikes.",
      "- **3. Non-Melting & Weather-Resistant:** Chocolate bars melt in the low valleys and freeze rock-solid above 4,000m. Dried fruits, raw nuts, and date energy balls maintain perfect chewiness at any temperature.",
      "- **4. Electrolyte Retention:** High altitude accelerates fluid loss through rapid respiration. Trace minerals from Himalayan pink rock salt help your cells retain water effectively.",
      "",
      "### Top 5 Packable Snacks for Trekking in Nepal",
      "",
      "#### 1. Custom Himalayan Superfood Trail Mix",
      "Mix equal parts [Nature's Mud Raw Mountain Almonds](/products/almonds), [Raw Walnuts](/products/walnuts), [Organic Pumpkin Seeds](/products/pumpkin-seeds), and [Wild Dried Blueberries](/products/dried-blueberries-100g). Pack 80g portions into individual zip bags for 450 kcal of clean endurance fuel per walking session.",
      "",
      "#### 2. No-Bake Dates & Nut Energy Balls",
      "Dense, bite-sized balls made from [Nature's Mud Natural Dates Powder](/products/dates-powder-100g), rolled oats, and crushed cashews deliver immediate natural fructose and sustained complex carbs without crumbling in your backpack.",
      "",
      "#### 3. Hydration Chia Gel (The Mountain Runner's Secret)",
      "Before starting your morning ascent, stir 1 tablespoon of [Nature's Mud Organic Chia Seeds](/products/chia-seeds) and a pinch of [Himalayan Pink Salt](/products/pink-salt) into 500ml of water. Drink midway through your climb for steady cellular hydration.",
      "",
      "#### 4. Sun-Dried Mango & Dried Fruits",
      "[Nature's Mud Sun-Dried Mango](/products/dehydrated-mango) provides non-sticky, quick-acting glucose, vitamin C for cellular repair, and potassium to prevent calf cramps during downhill descents.",
      "",
      "#### 5. Teahouse Porridge Booster Pack",
      "Carry a small 100g container of [Nature's Mud Sweet Potato Powder](/products/sweet-potato-powder-100g) or Dates Powder to stir directly into basic teahouse oats for a nutrient-packed mountain breakfast.",
      "",
      "### Daily Nutrition Schedule on the Trail",
      "- **07:00 AM (Breakfast):** Teahouse oats/porridge + 1 tbsp dates powder + handful of almonds.",
      "- **10:30 AM (Mid-Morning Ascent):** 50g trail mix + hydration water with chia seeds.",
      "- **01:30 PM (Lunch):** Traditional Dal Bhat + fresh hot lemon ginger tea.",
      "- **04:00 PM (Afternoon Pass / Push):** 2 Dates & Nut Energy Balls + sun-dried mango slices.",
      "- **07:00 PM (Dinner & Recovery):** Dal bhat or vegetable soup + pinch of Himalayan pink salt for electrolyte replenishment.",
      "",
      "### Practical Trekking Storage Tips",
      "- Store nuts and dried fruits in heavy-duty resealable ziplock bags to guard against mountain moisture and monsoon drizzle.",
      "- Keep your day's snacks in the top lid pocket of your backpack so you can snack without stopping your rhythm.",
      "- Carry a reusable lightweight spoon for mixing chia gels or porridge boosters on rest breaks."
    ],
    faqs: [
      {
        question: 'How many grams of trail snacks should I carry per day while trekking?',
        answer: 'Aim for 150 to 250 grams of nutrient-dense trail snacks (approx. 700–1,100 kcal) per person per day to supplement your three daily teahouse meals.'
      },
      {
        question: 'Are nuts and dried fruits safe at freezing high altitudes?',
        answer: 'Yes! Unlike candy bars that freeze into solid blocks, whole almonds, walnuts, pumpkin seeds, and sun-dried fruits retain good chewable texture even in sub-zero alpine conditions.'
      },
      {
        question: 'What is the best way to prevent altitude-related dehydration on trails?',
        answer: 'Drink 3 to 4 liters of clean water daily, enhanced with soaked chia seeds and a pinch of natural Himalayan pink rock salt to maintain vital cellular electrolyte balance.'
      }
    ]
  },
  {
    id: 'b-fitness-trail-mix-recipe',
    title: 'Healthy Trail Mix Recipe for Hiking: Homemade Himalayan Energy Mix',
    slug: 'healthy-trail-mix-recipe-for-hiking-nepal',
    excerpt: 'Make your own healthy, clean trail mix for hiking and outdoor endurance. High in plant protein, zinc, healthy omega fats, and naturally sweet dried fruits.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Culinary Team",
    readTime: 6,
    featured: false,
    image: '/images/combos/superfood-lineup.jpg',
    tags: ['healthy trail mix recipe', 'trail mix recipe', 'homemade trail mix', 'hiking snacks', 'nuts and seeds mix nepal'],
    keyTakeaways: [
      'The 50-30-20 Ratio: 50% raw nuts (healthy fats), 30% dried fruits (quick glucose), and 20% seeds (zinc & magnesium) create the ideal energy profile.',
      'Zero Refined Sugar: Use unsweetened sun-dried mango, dried blueberries, and raw almonds instead of candy-coated commercial trail mixes.',
      'Long Shelf-Life: Stays fresh and crunchy in an airtight container for up to 3 months without refrigeration.',
      'Cost-Effective: Making your own trail mix at home in Nepal saves 40% compared to imported pre-packaged trail snacks.'
    ],
    content: [
      "### Introduction: Why Commercial Trail Mix Fails Hikers",
      "Most store-bought trail mixes sold in city supermarkets are loaded with hydrogenated oils, refined white sugar, chocolate candies, and excessive sodium that trigger energy crashes after 45 minutes on the trail.",
      "Crafting your own **Homemade Himalayan Trail Mix** allows you to choose 100% clean, raw, unsalted nuts, zinc-rich seeds, and sun-dried fruits that deliver sustained stamina for hours of continuous walking.",
      "",
      "### The Perfect 4-Component Trail Mix Formula",
      "- **1. Raw Crunch (50%):** [Nature's Mud Raw Himalayan Almonds](/products/almonds) & [Raw Mountain Walnuts](/products/walnuts) for healthy fats, vitamin E, and cellular anti-inflammatory protection.",
      "- **2. Natural Sweetness & Carbs (30%):** [Nature's Mud Wild Dried Blueberries](/products/dried-blueberries-100g) and [Sun-Dried Mango Slices](/products/dehydrated-mango) for quick muscle glycogen replenishment.",
      "- **3. Superfood Seeds (15%):** [Nature's Mud Organic Pumpkin Seeds](/products/pumpkin-seeds) and [Black Chia Seeds](/products/chia-seeds) for zinc, magnesium, and muscle recovery.",
      "- **4. Mineral Accent (5%):** A light pinch of finely ground [Himalayan Pink Rock Salt](/products/pink-salt) to replenish sodium lost through sweating.",
      "",
      "### Recipe & Preparation Instructions",
      "- **Prep Time:** 5 minutes | **Yield:** 500g (Approx. 10 trail portions)",
      "- In a large bowl, combine 150g chopped almonds, 100g chopped walnuts, 75g pumpkin seeds, 100g chopped dried mango, and 75g dried blueberries.",
      "- Toss thoroughly until evenly distributed. Divide into 50g zip pouches for easy portion control on trekking days."
    ],
    faqs: [
      {
        question: 'Should nuts in trail mix be roasted or raw?',
        answer: 'Raw or dry-roasted unsalted nuts are best because they preserve heat-sensitive omega fats and avoid inflammatory processed cooking oils.'
      },
      {
        question: 'How do I keep trail mix crunchy during monsoon hiking?',
        answer: 'Store in heavy-duty food-grade ziplock bags with air pressed out, and store individual portions in airtight sealed jars until hike morning.'
      }
    ]
  },
  {
    id: 'b-fitness-pre-hike-nutrition',
    title: 'What to Eat Before Hiking in Nepal: Pre-Hike Breakfast & Hydration Guide',
    slug: 'what-to-eat-before-hiking-in-nepal-trail-nutrition',
    excerpt: 'Discover what to eat 2 hours before a strenuous hike in Nepal to prevent early fatigue, muscle cramps, and energy crashes on steep mountain ascents.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Sports Nutrition Team",
    readTime: 7,
    featured: false,
    image: '/images/recipes/oatmeal-bowl-daily-routine.jpg',
    tags: ['what to eat before hiking', 'pre hike breakfast', 'hiking nutrition nepal', 'trail prep kathmandu'],
    keyTakeaways: [
      'Eat 90–120 Minutes Before: Give your stomach sufficient time to digest complex carbs and moderate healthy fats before climbing.',
      'Low Glycemic Index Base: Rolled oats sweetened with dates powder provide 3 to 4 hours of steady glucose release.',
      'Pre-Hydration Protocol: Drink 500ml of water with a pinch of pink salt 1 hour before departure to prime your cardiovascular volume.'
    ],
    content: [
      "### The Goal of Pre-Hike Nutrition",
      "Steep ascents in Nepal—such as hiking up Shivapuri peak, Nagarkot trails, or the early morning pass on the Annapurna circuit—demand immediate and sustained muscular energy.",
      "Eating heavy fried foods (puri tarkari, oily parathas) right before climbing draws blood into the digestive tract, causing sluggishness, nausea, and cramping. Conversely, skipping breakfast depletes liver glycogen within 45 minutes.",
      "",
      "### Top 3 Ideal Pre-Hike Breakfast Ideas",
      "- **1. Supercharged Teahouse Oats:** 1 cup rolled oats cooked in water or almond milk, stirred with 1 tbsp [Nature's Mud Dates Powder](/products/dates-powder-100g), 1 tbsp [Chia Seeds](/products/chia-seeds), and sliced almonds.",
      "- **2. Sweet Potato Energy Porridge:** 2 tbsp [Nature's Mud Sweet Potato Powder](/products/sweet-potato-powder-100g) whisked with warm milk, cinnamon, and raw mountain honey.",
      "- **3. Chia Overnight Oats:** Prepared the night before with oats, chia, curd, and sun-dried mango slices for instant grab-and-go morning fuel."
    ],
    faqs: [
      {
        question: 'Can I drink coffee or tea before hiking?',
        answer: 'Yes, moderate black coffee or green tea provides natural alertness, but always drink 1 extra glass of pure water to offset caffeine’s mild diuretic effect.'
      }
    ]
  },
  {
    id: 'b-fitness-energy-balls-hiking',
    title: 'Homemade Energy Balls for Hiking: No-Bake High-Calorie Trail Bites',
    slug: 'homemade-energy-balls-for-hiking-nepal-trails',
    excerpt: 'A 10-minute, no-bake energy ball recipe packed with dates powder, raw mountain nuts, chia seeds, and coconut oil. The ultimate portable snack for day hikes and trekking.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Kitchen",
    readTime: 6,
    featured: false,
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    tags: ['homemade energy balls for hiking', 'hiking energy bites', 'dates energy balls', 'no bake snacks nepal'],
    keyTakeaways: [
      '10-Minute Prep: No cooking or baking required; simply knead, roll, and chill.',
      'Dense Clean Calories: Each 30g energy ball delivers ~120 kcal of sustained energy from dates, nuts, and healthy coconut MCTs.',
      'Durable & Crush-Proof: Holds shape inside backpacks without melting or crumbling into powder.'
    ],
    content: [
      "### Why Energy Balls Beat Processed Protein Bars",
      "Commercial protein bars frequently contain artificial sweeteners (sucralose, maltitol), synthetic soy isolates, and palm oils that cause digestive distress during heavy exercise.",
      "These **Homemade Himalayan Energy Balls** use whole-food ingredients: [Nature's Mud Natural Dates Powder](/products/dates-powder-100g) for binder and sweetness, crushed raw almonds and cashews for protein, chia seeds for hydration, and virgin coconut oil for medium-chain triglycerides (MCTs).",
      "",
      "### Step-by-Step Recipe",
      "- **Ingredients:** 1 cup oat flour, 1/2 cup dates powder, 1/3 cup crushed almonds, 2 tbsp chia seeds, 2 tbsp virgin coconut oil, 2 tbsp raw honey or warm water.",
      "- **Method:** Mix dry ingredients, fold in melted coconut oil and honey, knead into a dough, roll into 12 balls, and chill for 20 minutes."
    ],
    faqs: [
      {
        question: 'How long do homemade energy balls last without refrigeration on a trek?',
        answer: 'They remain fresh, firm, and safe to eat for up to 2 weeks at ambient mountain temperatures in a sealed container.'
      }
    ]
  },
  {
    id: 'b-fitness-pre-workout-oatmeal',
    title: 'Pre-Workout Oatmeal With Chia & Dried Fruit: 60-Minute Glycogen Loader',
    slug: 'pre-workout-oatmeal-with-chia-and-dried-fruit',
    excerpt: 'How to make the perfect pre-workout oatmeal bowl with chia seeds, wild dried blueberries, and dates powder for explosive gym energy and endurance.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Fitness Nutrition",
    readTime: 6,
    featured: false,
    image: '/images/recipes/oatmeal-bowl-daily-routine.jpg',
    tags: ['pre workout oatmeal', 'chia oatmeal gym', 'healthy gym breakfast nepal', 'clean pre workout meal'],
    keyTakeaways: [
      'Optimal Timing: Consume 45 to 60 minutes before lifting or high-intensity interval training.',
      'Hydration Matrix: Soaked chia seeds inside warm oats slow down carbohydrate absorption for a steady energy curve.',
      'Antioxidant Recovery: Anthocyanins in dried blueberries protect muscle tissue from oxidative stress.'
    ],
    content: [
      "### The Ideal Pre-Workout Glycogen Matrix",
      "Lifting heavy weights or performing intense sprint intervals depletes intra-muscular glycogen stores rapidly. To train at peak capacity, your pre-workout meal must supply easily accessible carbohydrates without triggering heavy insulin crashes.",
      "Combining rolled oats, [Nature's Mud Dates Powder](/products/dates-powder-100g), [Organic Chia Seeds](/products/chia-seeds), and [Wild Dried Blueberries](/products/dried-blueberries-100g) delivers the exact balance of rapid-absorbing fruit fructose and slow-release oat beta-glucan fiber."
    ],
    faqs: [
      {
        question: 'Can I add whey protein powder to this oatmeal?',
        answer: 'Yes! Add 1 scoop of protein powder after cooking the oats to preserve protein structure, or simply top with crushed raw almonds for natural whole-food protein.'
      }
    ]
  },
  {
    id: 'b-fitness-post-workout-smoothie',
    title: 'Post-Workout Smoothie With Dates & Chia: Rapid Muscle Recovery Guide',
    slug: 'post-workout-smoothie-with-dates-and-chia-nepal',
    excerpt: 'Replenish glycogen, repair muscle fibers, and restore electrolytes with a velvety post-workout recovery smoothie made with dates powder, chia seeds, and banana.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Sports Nutrition",
    readTime: 6,
    featured: false,
    image: '/images/recipes/beetroot-smoothie-bowl.jpg',
    tags: ['post workout smoothie', 'dates and chia smoothie', 'muscle recovery drink nepal', 'gym smoothie kathmandu'],
    keyTakeaways: [
      '30-Minute Anabolic Window: Consume within 30 to 45 minutes post-workout to maximize muscle glycogen synthesis.',
      'Natural Potassium & Electrolytes: Dates and bananas replace intracellular potassium lost during heavy perspiration.',
      'Omega-3 Anti-Inflammatory: Chia seed ALA helps reduce delayed onset muscle soreness (DOMS).'
    ],
    content: [
      "### The Science of Post-Workout Muscle Recovery",
      "After intense resistance training, your muscles are sensitized to nutrient uptake. Consuming fast-absorbing natural carbohydrates paired with complete plant proteins and anti-inflammatory healthy fats accelerates muscle protein synthesis.",
      "Blend 1 frozen banana, 1.5 tbsp [Nature's Mud Dates Powder](/products/dates-powder-100g), 1 tbsp [Soaked Chia Seeds](/products/chia-seeds), 1 cup milk or coconut water, and a pinch of [Himalayan Pink Salt](/products/pink-salt) for a creamy, restaurant-quality recovery shake."
    ],
    faqs: [
      {
        question: 'Is dates powder better than table sugar in a post-workout smoothie?',
        answer: 'Yes! Dates powder provides whole-food glucose and fructose alongside 23 essential amino acids, magnesium, iron, and potassium that table sugar completely lacks.'
      }
    ]
  },
  {
    id: 'b-fitness-high-protein-nuts-seeds',
    title: 'High-Protein Nut & Seed Snacks: Whole-Food Fuel Without Powders',
    slug: 'high-protein-nut-and-seed-snacks-nepal',
    excerpt: 'Discover the highest protein nuts and seeds available in Nepal. Complete amino acid profiles, daily serving recommendations, and clean snacking tips.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Nutrition Lab",
    readTime: 7,
    featured: false,
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    tags: ['high protein nut and seed snack', 'plant protein nepal', 'protein without powder', 'gym snacks kathmandu'],
    keyTakeaways: [
      'Pumpkin Seeds Champion: Delivers an astounding 30g of plant protein per 100g, plus high natural zinc.',
      'Almonds for Muscle: 21g protein per 100g with rich vitamin E and healthy monounsaturated fats.',
      'Chia Complete Protein: Contains all 9 essential amino acids in a highly bioavailable plant form.'
    ],
    content: [
      "### Whole-Food Plant Protein for Fitness Enthusiasts",
      "You don't need artificial synthetic protein powders to hit your daily muscle maintenance targets. Whole nuts and seeds provide dense, unadulterated plant protein bundled with fiber, healthy fats, and cellular micronutrients.",
      "Combining [Nature's Mud Organic Pumpkin Seeds](/products/pumpkin-seeds) (30g protein/100g), [Raw Himalayan Almonds](/products/almonds) (21g protein/100g), and [Walnuts](/products/walnuts) (15g protein/100g) gives you a complete, clean protein snack for office desks and post-gym recovery."
    ],
    faqs: [
      {
        question: 'Which seed has the highest protein content?',
        answer: 'Organic pumpkin seeds (pepitas) lead the pack with approximately 30 grams of pure plant protein per 100g serving.'
      }
    ]
  },
  {
    id: 'b-fitness-gym-beginners-breakfast',
    title: 'Healthy Breakfast for Gym Beginners: Simple 5-Minute Morning Fuel',
    slug: 'healthy-breakfast-for-gym-beginners-nepal',
    excerpt: 'Starting your gym journey in Kathmandu? Here are the 5 best, easiest whole-food breakfast recipes to fuel muscle growth, burn fat, and sustain morning energy.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Fitness Team",
    readTime: 6,
    featured: false,
    image: '/images/recipes/sweet-potato-stirred-smoothie.jpg',
    tags: ['healthy breakfast for gym beginners', 'gym beginner diet nepal', 'clean morning breakfast kathmandu'],
    keyTakeaways: [
      'Simplicity is Key: Stick to meals that take under 5 minutes so you never skip breakfast before morning workouts.',
      'Macro Balance: Aim for 20g protein, 40g complex carbs, and 10g healthy fats.',
      'Zero Refined Sugar: Swap morning milk-tea sugar with natural dates powder to avoid 10:00 AM lethargy.'
    ],
    content: [
      "### Building Sustainable Fitness Nutrition from Day 1",
      "The most common mistake gym beginners make is adopting extreme diets that are impossible to maintain alongside a busy work schedule in Nepal.",
      "Starting your morning with wholesome, nutrient-dense staples—such as [Nature's Mud Sweet Potato Pancakes](/recipes/fluffy-sweet-potato-pancakes-powder-recipe), Chia Overnight Oats, or a High-Nitrate Beetroot Smoothie—sets a positive metabolic tone for the entire day."
    ],
    faqs: [
      {
        question: 'Should I eat before or after morning gym workouts?',
        answer: 'If working out intensely for over 45 minutes, have a light snack (half a banana with dates powder or 1 glass chia water) 30 minutes before, followed by a full breakfast after.'
      }
    ]
  },
  {
    id: 'b-fitness-kathmandu-runners-snacks',
    title: 'Healthy Snacks for Kathmandu Runners: Pre-Run Energy & Recovery Guide',
    slug: 'healthy-snacks-for-kathmandu-runners',
    excerpt: 'Fuel your morning runs around Kathmandu, Patan, and trails. How to eat for light digestion, fast energy, and clean anti-pollution cellular recovery.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Running Club",
    readTime: 6,
    featured: false,
    image: '/images/blog/himalayan-beetroot-nitric-oxide-stamina.jpg',
    tags: ['healthy snacks for kathmandu runners', 'running snacks nepal', 'pre run food kathmandu', 'marathon nutrition nepal'],
    keyTakeaways: [
      'Light Digestibility: Runners need fast-clearing fuels that do not bounce in the stomach during strides.',
      'Nitric Oxide Boost: Beetroot powder boosts blood vessel vasodilation, increasing oxygen delivery to working calves and quads.',
      'Hydration Shield: Pre-hydrate with chia seed water to sustain fluid volume during outdoor runs.'
    ],
    content: [
      "### Running in Kathmandu: Unique Nutritional Demands",
      "Whether running 5K morning laps around Tudikhel, hill repeats at Swayambhu, or 20K trail runs in Godavari, runners in Kathmandu need light, non-acidic fuel that boosts cardiovascular endurance and counters urban oxidative stress.",
      "Drinking a glass of water stirred with 1 tsp of [Nature's Mud Pure Beetroot Powder](/products/beetroot-powder-100g) 30 minutes prior to running provides concentrated dietary nitrates that improve running economy and delay muscular fatigue."
    ],
    faqs: [
      {
        question: 'What is the best quick snack 15 minutes before a run?',
        answer: 'Two dried dates or 1 tbsp of Nature\'s Mud dates powder mixed in 100ml warm water gives instant, gentle glucose without stomach heaviness.'
      }
    ]
  },
  {
    id: 'b-fitness-dates-nut-energy-balls',
    title: 'Dates & Nut Energy Balls: The Ultimate Clean Snacking Master Guide',
    slug: 'dates-and-nut-energy-balls-recipe',
    excerpt: 'Detailed recipe and storage guide for no-bake dates and nut energy balls. Ideal for desk workers, fitness athletes, and outdoor hikers across Nepal.',
    category: 'Fitness & Outdoor',
    date: '2026-08-30',
    author: "Nature's Mud Kitchen",
    readTime: 6,
    featured: false,
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    tags: ['dates and nut energy balls', 'dates energy balls recipe', 'healthy office snack nepal'],
    keyTakeaways: [
      'No Added Sugar: 100% natural sweetness from pure dates powder and raw honey.',
      'Rich in Magnesium & Iron: Helps prevent fatigue and muscle twitching during stressful workdays.',
      'Meal Prep 20 Balls in 10 Minutes: Keep in a glass desk jar for instant healthy snacking.'
    ],
    content: [
      "### The Ultimate Clean Snack for Active Lifestyles",
      "When afternoon 3:00 PM hunger strikes at the office or midway through a trekking trail, reaching for biscuits or fried samosas wrecks energy levels and causes sluggishness.",
      "These **Dates & Nut Energy Balls** combine the natural caramel richness of [Nature's Mud Natural Dates Powder](/products/dates-powder-100g) with raw almonds, cashews, chia seeds, and virgin coconut oil for sustained vitality."
    ],
    faqs: [
      {
        question: 'Can children take these energy balls to school?',
        answer: 'Yes! They are a fantastic, 100% natural lunchbox snack for school-aged children and teenagers, providing clean energy without artificial colorings or white sugar.'
      }
    ]
  }
];

// =========================================================================
// 2. BABY & FAMILY NUTRITION HUB (15 EVIDENCE-BASED MASTER ARTICLES)
// STRICT WHO / UNICEF COMPLEMENTARY FEEDING COMPLIANCE
// =========================================================================
const babyArticles = [
  {
    id: 'b-baby-starting-solids-guide-nepal',
    title: 'Starting Solid Foods: A Simple Guide for Nepali Parents (WHO & UNICEF Guidelines)',
    slug: 'starting-solid-foods-simple-guide-nepali-parents',
    excerpt: 'An evidence-based guide for Nepali parents on starting complementary feeding at 6 months. Learn readiness signs, safe textures, hygienic prep, and first foods.',
    category: 'Baby & Family Nutrition',
    date: '2026-08-30',
    author: "Nature's Mud Pediatric Nutrition Advisory",
    readTime: 8,
    featured: true,
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    tags: ['starting solid foods simple guide nepali parents', 'baby food nepal', 'complementary feeding 6 months', 'weaning foods kathmandu', 'infant nutrition nepal'],
    keyTakeaways: [
      'Wait Until 6 Months: Exclusive breastfeeding is recommended for the first 6 months (180 days) of life according to WHO and UNICEF.',
      'Look for Development Readiness: Baby should sit upright with support, have good head/neck control, and show curiosity toward family food.',
      'Zero Added Salt & Zero Added Sugar: Infant kidneys cannot process excess sodium, and sugar sets poor taste preferences. Keep first foods 100% natural.',
      'One Single Ingredient at a Time: Introduce one new single-ingredient food and wait 2 to 3 days to monitor for any digestive sensitivity or allergic reaction.',
      'Smooth, Lump-Free Texture: Start with silky, smooth purees or soft mashes to prevent choking hazards.'
    ],
    content: [
      "### Introduction: Complementary Feeding at 6 Months",
      "The transition from exclusive breastfeeding (or infant formula) to complementary solid foods is one of the most vital developmental milestones in your baby's first year of life.",
      "According to the **World Health Organization (WHO)** and **UNICEF**, infants should begin complementary feeding at approximately 6 months of age (180 days). At this stage, breast milk remains the primary source of nutrition, but complementary foods are introduced to meet increasing energetic, iron, and micronutrient requirements.",
      "",
      "### Signs Your Baby is Ready for Solid Foods",
      "Do not rush solids before 6 months. Verify that your baby demonstrates these essential developmental readiness signs:",
      "- **Good Head & Neck Control:** The baby can hold their head steady and upright without wobbling.",
      "- **Sitting Upright with Minimal Support:** The baby can sit safely in a highchair or lap to ensure clear swallowing pathways.",
      "- **Diminished Tongue-Thrust Reflex:** The baby no longer automatically pushes solid food out of their mouth with their tongue.",
      "- **Curiosity & Reach:** The baby opens their mouth when food approaches and reaches for family meals.",
      "",
      "### The Golden Rules of Starting Solids Safely",
      "- **1. No Added Sugar, Salt, or Honey:** Under 12 months, babies must NEVER be given honey (risk of infant botulism), added table salt (burdens immature kidneys), or refined sugars.",
      "- **2. The 3-Day Single-Food Rule:** When introducing a new food (e.g. single-ingredient sweet potato puree), offer it for 2 to 3 consecutive days before introducing another new ingredient. This helps identify any food intolerance or allergy easily.",
      "- **3. Texture Progression:** Begin with silky, liquid-smooth purees (mixed with expressed breast milk or warm boiled water). By 7–8 months, transition to thicker mashes, and by 9–10 months, soft dissolvable finger foods.",
      "- **4. Strict Kitchen Hygiene:** Always wash hands with soap, sterilize infant feeding bowls and spoons, and use boiled, cooled drinking water.",
      "",
      "### Ideal First Foods for Nepali Babies",
      "- **Single-Ingredient Vegetable Purees:** Steamed and blended sweet potato ([Nature's Mud Pure Sweet Potato Powder](/products/sweet-potato-powder-100g) whisked with warm water/breast milk), carrot puree, or pumpkin mash.",
      "- **Single-Ingredient Fruit Purees:** Steamed apple puree, ripe banana mash, or soft ripe papaya puree.",
      "- **Traditional Grains & Porridges:** Well-cooked, finely strained rice flour porridge, ragi (kodo) porridge, or jaulo (soft rice-dal mash without salt or spices).",
      "",
      "### Responsive Feeding: Follow Your Baby's Cues",
      "Complementary feeding is a learning experience, not a calorie race. Allow your baby to explore textures and tastes at their own pace.",
      "- **Fullness Signs:** Turning head away, clamping lips shut, pushing the spoon away, or becoming fussy. Never force-feed.",
      "- **Hunger Signs:** Leaning forward, opening mouth, following the spoon eagerly with their eyes.",
      "",
      "### Important Medical & Pediatric Notice",
      "*This guide is for general educational purposes based on WHO and pediatric complementary feeding literature. Always consult your pediatrician or primary health worker for personalized feeding guidance, premature infant care, severe allergies, or feeding difficulties.*"
    ],
    faqs: [
      {
        question: 'Why must honey be strictly avoided for babies under 1 year of age?',
        answer: 'Honey can contain spores of Clostridium botulinum bacteria, which can produce dangerous toxins in an infant’s immature digestive tract, causing infant botulism.'
      },
      {
        question: 'How many times a day should a 6-month-old eat solid food?',
        answer: 'Start with 1 to 2 small meals per day (2 to 3 teaspoons per meal) while continuing frequent on-demand breastfeeding or formula feeding.'
      },
      {
        question: 'Can I add salt or spices to make baby food taste better?',
        answer: 'No. Babies’ kidneys are immature and cannot excrete excess salt. Babies do not need added seasonings; they enjoy the pure, natural flavors of wholesome foods.'
      }
    ]
  },
  {
    id: 'b-baby-10-simple-recipes-solids',
    title: '10 Simple Baby Food Recipes for Starting Solids (6–12 Months)',
    slug: '10-simple-baby-food-recipes-starting-solids-nepal',
    excerpt: 'Nutrient-dense, easy-to-digest homemade baby food recipes for Nepali parents. 100% natural, zero added sugar, zero salt, and strictly pediatric safety compliant.',
    category: 'Baby & Family Nutrition',
    date: '2026-08-30',
    author: "Nature's Mud Pediatric Nutrition Team",
    readTime: 8,
    featured: false,
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    tags: ['10 simple baby food recipes for starting solids', 'baby food recipes nepal', 'homemade baby food kathmandu', 'infant weaning recipes'],
    keyTakeaways: [
      'Single-Ingredient Simplicity: Start with single-ingredient steamed purees before attempting complex multi-food combinations.',
      'Natural Sweetness: Sweet potato, carrot, and ripe banana provide gentle, baby-friendly flavors without added sweeteners.',
      'Iron-Rich Complements: Combine grain porridges with vegetable mashes to support healthy infant iron absorption.',
      'Hygienic Storage: Prepare small fresh batches; refrigerate in sterilized glass jars for up to 24–48 hours maximum.'
    ],
    content: [
      "### Safe, Evidence-Based Homemade Baby Meals",
      "Preparing homemade baby food gives parents complete transparency over ingredients, hygiene, and freshness. All recipes below are 100% free of added sugar, salt, preservatives, or artificial additives.",
      "",
      "### Top 10 Stage-Appropriate Baby Food Recipes",
      "",
      "#### 1. Silky Sweet Potato Puree (6+ Months)",
      "Whisk 1 tablespoon of [Nature's Mud 100% Pure Sweet Potato Powder](/products/sweet-potato-powder-100g) with 3–4 tablespoons of warm boiled water or expressed breast milk until completely smooth and velvety. Serve warm.",
      "",
      "#### 2. Steamed Apple & Cinnamon Mash (6+ Months)",
      "Peel, core, and steam 1 sweet apple until fork-tender. Puree with a tiny pinch of Ceylon cinnamon for natural aroma.",
      "",
      "#### 3. Ripe Banana & Avocado Puree (6+ Months)",
      "Mash 1/4 ripe banana with 1/4 ripe avocado using a fork until lump-free. Provides clean healthy fats for infant energy.",
      "",
      "#### 4. Golden Carrot & Sweet Potato Mash (7+ Months)",
      "Steam carrots and sweet potatoes together until tender; puree with warm water into a vibrant orange mash rich in beta-carotene.",
      "",
      "#### 5. Traditional Nepali Ragi (Kodo) Porridge (7+ Months)",
      "Cook finely ground finger-millet (kodo) flour in boiling water until thick and glossy. Stir in expressed milk or warm water before serving.",
      "",
      "#### 6. Soft Moong Dal & Rice Khichdi / Jaulo (8+ Months)",
      "Pressure-cook split yellow moong dal and rice with turmeric until completely soft. Mash thoroughly with a spoon. Zero salt.",
      "",
      "#### 7. Steamed Pear & Sweet Potato Puree (7+ Months)",
      "Blend steamed soft pear slices with rehydrated sweet potato puree for gentle digestive fiber.",
      "",
      "#### 8. Steamed Green Pea & Spinach Puree (8+ Months)",
      "Steam fresh sweet peas and tender spinach leaves; puree and pass through a fine sieve to remove any fibrous skins.",
      "",
      "#### 9. Oats & Steamed Apple Porridge (8+ Months)",
      "Cook fine rolled oats in water until soft; stir in pureed steamed apple for natural comforting sweetness.",
      "",
      "#### 10. Soft Mashed Papaya & Curd (9+ Months)",
      "Mash soft ripe papaya with 1 tablespoon of fresh plain homemade curd (dahi) for natural gut probiotics."
    ],
    faqs: [
      {
        question: 'Can I freeze baby food purees for later use?',
        answer: 'Yes, spoon freshly prepared purees into sterilized BPA-free silicone ice cube trays. Once frozen, store cubes in a sealed freezer bag for up to 1 month.'
      }
    ]
  },
  {
    id: 'b-baby-food-labels-nepal',
    title: 'Baby Food Labels in Nepal: What Parents Should Check Before Buying',
    slug: 'baby-food-labels-in-nepal-what-parents-should-check',
    excerpt: 'Learn how to read commercial baby food labels in Nepal. Identify hidden added sugars, artificial flavorings, salt, shelf-life preservatives, and safety certifications.',
    category: 'Baby & Family Nutrition',
    date: '2026-08-30',
    author: "Nature's Mud Consumer Safety Team",
    readTime: 7,
    featured: false,
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    tags: ['baby food labels in nepal what parents should check', 'reading baby food labels', 'packaged baby food nepal', 'child health kathmandu'],
    keyTakeaways: [
      'Ingredient List Order: Ingredients are listed in descending order by weight; avoid products where sugar, corn syrup, or maltodextrin are in the top 3.',
      'Check for Added Sodium: Commercial baby foods should contain 0mg added salt.',
      'Look for 100% Single-Ingredient Purity: Choose transparent products that contain only the pure vegetable or fruit without anti-caking agents.',
      'Verify Manufacturing & Expiry Dates: Always inspect packaging seals and tamper-evident caps.'
    ],
    content: [
      "### The Hidden Reality of Commercial Baby Foods in Nepal",
      "Many commercial infant cereals and packaged jarred foods sold in Nepali pharmacies and grocery stores contain high percentages of added sugars (sucrose, glucose syrup, maltodextrin) designed to make foods artificially addictive to infant palates.",
      "Developing healthy eating habits begins by teaching babies to appreciate the subtle, natural flavors of whole vegetables, grains, and fruits without sugar masking.",
      "",
      "### Critical Checklist for Reading Baby Food Labels",
      "- **1. Ingredient Simplicity:** If buying sweet potato powder, the ingredient label should say *100% Dehydrated Sweet Potato*—nothing else.",
      "- **2. Watch for Hidden Sugar Aliases:** Invert sugar, dextrose, malt syrup, fruit juice concentrates, and corn syrup solids are all forms of added refined sugars.",
      "- **3. Inspect Allergen Declarations:** Check if the product was manufactured in a facility handling milk, wheat, soy, or tree nuts.",
      "- **4. Packaging Quality:** Ensure jars have airtight vacuum safety buttons and sealed foil lids."
    ],
    faqs: [
      {
        question: 'Is maltodextrin safe in baby cereals?',
        answer: 'While legally permitted, maltodextrin is a highly processed carbohydrate that spikes blood sugar quickly. Whole grains and single-ingredient vegetable powders are vastly superior.'
      }
    ]
  },
  {
    id: 'b-baby-variety-complementary-diet',
    title: "How to Build Variety Into a Baby's Complementary Diet (6–24 Months)",
    slug: 'how-to-build-variety-into-baby-complementary-diet-nepal',
    excerpt: 'Why dietary diversity matters in early infant development. Practical strategies for introducing different colors, textures, and food groups safely.',
    category: 'Baby & Family Nutrition',
    date: '2026-08-30',
    author: "Nature's Mud Pediatric Advisory",
    readTime: 7,
    featured: false,
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    tags: ['how to build variety into babys complementary diet', 'baby food variety nepal', 'infant dietary diversity', 'toddler nutrition kathmandu'],
    keyTakeaways: [
      'Eat the Rainbow: Exposing infants to orange, green, red, and yellow foods broadens micronutrient intake and reduces picky eating later.',
      'Rotate Across 4 Core Groups: Include staples (grains), pulses/legumes, vegetables/fruits, and dairy/protein.',
      'Patience in Repetition: A baby may need to be offered a new food 8 to 15 times before accepting it.'
    ],
    content: [
      "### Why Food Variety Matters for Growing Infants",
      "During the complementary feeding window (6 to 24 months), an infant's taste buds and digestive microbiome undergo critical development. Exposing babies to a wide variety of whole food flavors and natural textures prevents selective eating behaviors and ensures a broad spectrum of vitamins and minerals.",
      "",
      "### The 4 Essential Complementary Food Groups",
      "- **1. Grains & Roots:** Rice, oats, finger-millet (kodo), and sweet potatoes for energy and B-vitamins.",
      "- **2. Legumes & Pulses:** Yellow moong dal, masoor dal, and well-cooked chickpeas for iron and plant protein.",
      "- **3. Colorful Fruits & Vegetables:** Carrots, spinach, pumpkin, apples, papayas, and steamed pears for vitamins A, C, and dietary fiber.",
      "- **4. Healthy Fats & Dairy:** Curd (dahi), breast milk, and tiny amounts of pure cold-pressed coconut oil for brain development."
    ],
    faqs: [
      {
        question: 'What if my baby spits out a new vegetable puree?',
        answer: 'This is completely normal! Spitting out food is often a surprise reaction to an unfamiliar flavor or texture, not dislike. Reintroduce the food gently after a few days without pressure.'
      }
    ]
  },
  {
    id: 'b-baby-sweet-potato-puree-recipe',
    title: 'Sweet Potato Puree for Babies: Simple Homemade Baby Food Recipe (6+ Months)',
    slug: 'sweet-potato-puree-for-babies-simple-recipe-nepal',
    excerpt: 'Step-by-step recipe for making silky smooth sweet potato puree for infants starting solids. Natural beta-carotene, gentle digestion, and zero added sugar.',
    category: 'Baby & Family Nutrition',
    date: '2026-08-30',
    author: "Nature's Mud Kitchen",
    readTime: 6,
    featured: false,
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    tags: ['sweet potato puree for babies', 'sweet potato baby food recipe', 'first baby foods nepal', 'sweet potato powder babies'],
    keyTakeaways: [
      'Gentle on Immature Stomachs: Sweet potato is non-acidic, hypoallergenic, and highly digestible for 6-month-old infants.',
      'Rich in Beta-Carotene: Supports developing infant vision, skin health, and normal immune function.',
      'Quick 2-Minute Preparation: Using pure dehydrated sweet potato powder eliminates 30 minutes of peeling, boiling, and blending.'
    ],
    content: [
      "### Why Sweet Potato is the Gold-Standard First Food",
      "Pediatricians worldwide frequently recommend sweet potato as an ideal first solid food because of its naturally mild sweet flavor, silky smooth texture when pureed, and high concentration of dietary fiber, potassium, and vitamin A precursor beta-carotene.",
      "",
      "### Preparation Instructions",
      "- **Method 1 (Using Nature's Mud Sweet Potato Powder):** Whisk 1 tbsp of [Nature's Mud Organic Sweet Potato Powder](/products/sweet-potato-powder-100g) with 3–4 tbsp of warm boiled drinking water or breast milk. Stir until silky and lump-free.",
      "- **Method 2 (Fresh Sweet Potato):** Peel and cube 1 medium sweet potato. Steam for 15–20 minutes until completely tender. Puree in a blender with cooking liquid or expressed breast milk.",
      "- **Serving:** Offer 1 to 2 teaspoons at room temperature using a soft silicone baby spoon."
    ],
    faqs: [
      {
        question: 'Can I mix sweet potato puree with breast milk?',
        answer: 'Yes! Mixing purees with familiar breast milk or formula provides a comforting, familiar taste that helps babies accept new solid textures readily.'
      }
    ]
  }
];

// =========================================================================
// 3. RECIPES TO INJECT INTO recipes.ts
// =========================================================================
const newFitnessAndFamilyRecipes = [
  {
    id: 'r-himalayan-trail-mix-hiking',
    slug: 'healthy-trail-mix-recipe-for-hiking-nepal',
    title: 'Himalayan Superfood Trail Mix (For Hiking & Trekking)',
    excerpt: 'Nutrient-dense, non-melting trail mix packed with raw mountain almonds, walnuts, pumpkin seeds, wild dried blueberries, and sun-dried mango slices.',
    image: '/images/combos/superfood-lineup.jpg',
    category: 'Fitness & Gym',
    prepTime: 5,
    cookTime: 0,
    servings: 10,
    difficulty: 'Easy',
    ingredients: [
      "1 cup Nature's Mud Raw Himalayan Almonds (chopped)",
      "1 cup Nature's Mud Raw Mountain Walnuts (chopped)",
      "1/2 cup Nature's Mud Organic Pumpkin Seeds",
      "1/2 cup Nature's Mud Wild Dried Blueberries",
      "1/2 cup Nature's Mud Sun-Dried Mango Slices (diced)",
      "1/4 tsp Nature's Mud Himalayan Pink Rock Salt"
    ],
    instructions: [
      "In a large stainless steel bowl, add chopped almonds, walnuts, and pumpkin seeds.",
      "Add diced sun-dried mango, dried blueberries, and a light pinch of Himalayan pink salt.",
      "Toss gently until all ingredients are evenly distributed.",
      "Divide into 50g resealable snack bags and store in an airtight container."
    ],
    tags: ['trail mix recipe', 'hiking snacks', 'trekking food nepal', 'healthy energy mix'],
    featured: true
  },
  {
    id: 'r-baby-sweet-potato-puree',
    slug: 'sweet-potato-puree-for-babies-simple-recipe-nepal',
    title: 'Silky Sweet Potato Puree for Babies (6+ Months)',
    excerpt: 'Gentle, hypoallergenic 2-minute baby puree made with pure organic sweet potato powder and warm water or breast milk. Zero added sugar or salt.',
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    category: 'Baby Food',
    prepTime: 2,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      "1 tbsp (10g) Nature's Mud Organic Sweet Potato Powder (100g Jar)",
      '3 to 4 tbsp warm boiled drinking water or expressed breast milk'
    ],
    instructions: [
      "In a sterilized infant feeding bowl, add 1 tablespoon of Nature's Mud Sweet Potato Powder.",
      "Gradually pour in warm boiled water or expressed breast milk while whisking with a clean baby spoon.",
      "Continue stirring for 30 seconds until the puree is silky smooth, lump-free, and creamy.",
      "Test the temperature on your wrist before feeding. Serve immediately."
    ],
    tags: ['baby food recipe', 'sweet potato puree for babies', 'weaning food nepal', 'infant first solids'],
    featured: true
  }
];

// =========================================================================
// 4. WRITE TO lib/data/blogs-database.ts & lib/data/recipes.ts
// =========================================================================
function main() {
  console.log('Injecting Fitness & Baby Content Pillars...');

  // Update blogs-database.ts
  const blogsFile = path.join(__dirname, '..', 'lib', 'data', 'blogs-database.ts');
  let blogsContent = fs.readFileSync(blogsFile, 'utf8');

  const allNewArticles = [...fitnessArticles, ...babyArticles];
  console.log(`Adding ${allNewArticles.length} master articles to blogs-database.ts`);

  const blogInsertPos = blogsContent.indexOf('export const allBlogPosts: ExtendedBlogPost[] = [');
  if (blogInsertPos !== -1) {
    const afterBracket = blogInsertPos + 'export const allBlogPosts: ExtendedBlogPost[] = [\n'.length;
    const articlesCode = allNewArticles.map(a => '  ' + JSON.stringify(a, null, 2) + ',').join('\n') + '\n';
    blogsContent = blogsContent.slice(0, afterBracket) + articlesCode + blogsContent.slice(afterBracket);
    fs.writeFileSync(blogsFile, blogsContent, 'utf8');
    console.log('✅ Successfully updated lib/data/blogs-database.ts');
  }

  // Update recipes.ts
  const recipesFile = path.join(__dirname, '..', 'lib', 'data', 'recipes.ts');
  let recipesContent = fs.readFileSync(recipesFile, 'utf8');

  console.log(`Adding ${newFitnessAndFamilyRecipes.length} recipes to recipes.ts`);
  const recipeInsertPos = recipesContent.indexOf('export const recipes: Recipe[] = [');
  if (recipeInsertPos !== -1) {
    const afterBracket = recipeInsertPos + 'export const recipes: Recipe[] = [\n'.length;
    const recipesCode = newFitnessAndFamilyRecipes.map(r => '  ' + JSON.stringify(r, null, 2) + ',').join('\n') + '\n';
    recipesContent = recipesContent.slice(0, afterBracket) + recipesCode + recipesContent.slice(afterBracket);
    fs.writeFileSync(recipesFile, recipesContent, 'utf8');
    console.log('✅ Successfully updated lib/data/recipes.ts');
  }
}

main();
