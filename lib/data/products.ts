import { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    slug: 'sweet-potato-powder',
    name: 'Organic Sweet Potato Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 380,
    compareAtPrice: 450,
    rating: 4.9,
    reviewCount: 52,
    image: '/products/sweet-potato-powder-100g.jpg',
    images: [
      '/products/sweet-potato-powder-100g.jpg',
      '/products/naturesmud-all-products-100g.jpg',
      '/products/sweet-potato-powder.jpg',
    ],
    description: '100% pure organic dehydrated sweet potato powder milled from farm-fresh Nepali sweet potatoes. A nutrient-dense complex carbohydrate powerhouse packed with Vitamin A (beta-carotene), fiber, potassium, and minerals. Perfect for infant weaning porridge, baby cereals, pre-workout energy shakes, pancakes, and healthy baking without any added sugars, preservatives, or artificial additives.',
    shortDescription: '100% natural dehydrated sweet potato powder for baby food, smoothies & healthy baking.',
    badges: ['bestseller', 'organic'],
    stock: 120,
    weight: '100g',
    ingredients: ['100% Pure Dehydrated Nepali Sweet Potato'],
    benefits: [
      'Rich in Vitamin A (Beta-Carotene) for eyesight and skin',
      'Gentle complex carbohydrates for baby weaning porridge',
      'Sustained clean energy for fitness and gym workouts',
      'High in dietary fiber for smooth gut digestion',
      'Zero added sugar, 100% chemical-free and gluten-free'
    ],
    nutrition: [
      { label: 'Calories', value: '350 kcal / 100g' },
      { label: 'Carbohydrates', value: '80g' },
      { label: 'Dietary Fiber', value: '7.5g' },
      { label: 'Protein', value: '4.2g' },
      { label: 'Vitamin A', value: '720% DV' },
      { label: 'Potassium', value: '950mg' },
    ],
    usage: 'Add 1–2 tablespoons to warm milk, oatmeal, baby porridge, pancake batter, soup, or post-workout protein smoothies.',
    storage: 'Store in an airtight container in a cool, dry place away from direct moisture.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['sweet-potato', 'powder', 'baby-food', 'pre-workout', 'organic', 'superfood'],
  },
  {
    id: '2',
    slug: 'dates-powder',
    name: 'Natural Dates Powder Sweetener',
    category: 'Powders',
    categorySlug: 'powders',
    price: 390,
    compareAtPrice: 480,
    rating: 4.9,
    reviewCount: 64,
    image: '/products/dates-powder-100g.jpg',
    images: [
      '/products/dates-powder-100g.jpg',
      '/products/naturesmud-all-products-100g.jpg',
      '/products/dates-powder.jpg',
    ],
    description: '100% pure dehydrated date powder made by slowly drying and micro-grinding whole premium dates. The healthiest, unrefined natural sweetener alternative to white table sugar for children, toddlers, and fitness enthusiasts. Loaded with natural potassium, magnesium, iron, and fiber without spiking blood sugar aggressively.',
    shortDescription: '100% unrefined natural sweetener made from whole dehydrated dates — 0% white sugar.',
    badges: ['bestseller', 'natural-sweetener'],
    stock: 140,
    weight: '100g',
    ingredients: ['100% Pure Dehydrated Whole Dates'],
    benefits: [
      '1:1 Natural replacement for refined white sugar in recipes',
      'Natural source of iron to combat fatigue and anemia',
      'Rich in potassium and magnesium for muscle & nerve health',
      'Pediatrician recommended natural sweetener for babies 8m+',
      'Zero preservatives, 100% vegan and unbleached'
    ],
    nutrition: [
      { label: 'Calories', value: '315 kcal / 100g' },
      { label: 'Natural Sugars', value: '66g' },
      { label: 'Dietary Fiber', value: '8g' },
      { label: 'Potassium', value: '650mg' },
      { label: 'Iron', value: '2.5mg' },
    ],
    usage: 'Use 1:1 in place of white sugar in tea, milk, infant porridge, kheer, cakes, cookies, and smoothie bowls.',
    storage: 'Keep in an airtight jar in a cool, dry location.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['dates', 'powder', 'natural-sweetener', 'sugar-free', 'baby-food'],
  },
  {
    id: '3',
    slug: 'beetroot-powder',
    name: 'Pure Himalayan Beetroot Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 380,
    compareAtPrice: 460,
    rating: 4.8,
    reviewCount: 41,
    image: '/products/beetroot-powder-100g.jpg',
    images: [
      '/products/beetroot-powder-100g.jpg',
      '/products/naturesmud-all-products-100g.jpg',
      '/products/beetroot-powder.jpg',
    ],
    description: 'Cold-dehydrated and finely milled from pesticide-free Nepali red beetroots. Naturally rich in dietary nitrates, betalains, and folate that convert into nitric oxide to boost blood circulation, lower blood pressure, and enhance endurance for athletes.',
    shortDescription: 'Natural dietary nitrate booster for glowing skin, blood stamina & cardiac health.',
    badges: ['organic'],
    stock: 95,
    weight: '100g',
    ingredients: ['100% Dehydrated Red Beetroots'],
    benefits: [
      'Boosts nitric oxide production for athletic stamina',
      'Supports healthy blood pressure and cardiovascular flow',
      'Natural food colorant for baking, rotis, and pancakes',
      'Promotes liver detoxification and glowing complexion'
    ],
    nutrition: [
      { label: 'Calories', value: '310 kcal / 100g' },
      { label: 'Protein', value: '11g' },
      { label: 'Dietary Nitrates', value: 'High' },
      { label: 'Folate', value: '80% DV' },
    ],
    usage: 'Mix 1 teaspoon into pre-workout drinks, yogurt, fresh juice, or mix into flour for pink puris and rotis.',
    storage: 'Airtight dry container, avoid wet spoons.',
    isFeatured: true,
    isBestSeller: false,
    tags: ['beetroot', 'powder', 'pre-workout', 'nitric-oxide', 'stamina'],
  },
  {
    id: '4',
    slug: 'carrot-powder',
    name: 'Organic Carrot Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 350,
    compareAtPrice: 420,
    rating: 4.8,
    reviewCount: 33,
    image: '/products/carrot-powder.jpg',
    images: [
      '/products/carrot-powder.jpg',
      '/products/naturesmud-all-products-100g.jpg',
      '/products/sweet-potato-powder-100g.jpg',
    ],
    description: 'Sun-dried and gently ground organic carrots harvested from the fertile soils of Nepal. Packed with beta-carotene, lutein, and dietary fiber to protect eyes, support cell regeneration, and enhance everyday cooking with a mild natural sweetness.',
    shortDescription: 'Fine organic carrot powder rich in beta-carotene for infant feeding and healthy soups.',
    badges: ['organic'],
    stock: 85,
    weight: '100g',
    ingredients: ['100% Dehydrated Organic Carrots'],
    benefits: [
      'Loaded with Beta-Carotene (Pro-Vitamin A) for ocular health',
      'Easy to hide in kids’ meals for nutrient density',
      'Rich in antioxidants that protect cellular health',
      'Sweet and gentle on sensitive stomachs'
    ],
    nutrition: [
      { label: 'Calories', value: '340 kcal / 100g' },
      { label: 'Vitamin A', value: '850% DV' },
      { label: 'Dietary Fiber', value: '12g' },
    ],
    usage: 'Stir into baby purees, soups, gravies, baked goods, or morning oats.',
    storage: 'Store sealed in a dry pantry.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['carrot', 'powder', 'vitamin-a', 'baby-food'],
  },
  {
    id: '5',
    slug: 'dehydrated-papaya',
    name: 'Dehydrated Sweet Papaya Slices',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 250,
    compareAtPrice: 320,
    rating: 4.9,
    reviewCount: 47,
    image: '/products/papaya.jpg',
    images: [
      '/products/papaya.jpg',
      '/products/papaya-2.jpg',
    ],
    description: 'Chewy, naturally sweet papaya spears dehydrated at gentle temperatures to retain live digestive enzymes (papain), vitamin C, and fiber. Free from sulfur dioxide, artificial colors, and added sugar.',
    shortDescription: 'Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking.',
    badges: ['bestseller'],
    stock: 110,
    weight: '100g',
    ingredients: ['100% Natural Dehydrated Papaya Slices'],
    benefits: [
      'Contains natural Papain enzyme for smooth digestion',
      'High in Vitamin C to bolster immune defenses',
      'Satisfies sugar cravings naturally with zero artificial sugar',
      'Rich in carotenoids and gut-friendly fiber'
    ],
    nutrition: [
      { label: 'Calories', value: '280 kcal / 100g' },
      { label: 'Vitamin C', value: '140% DV' },
      { label: 'Dietary Fiber', value: '6g' },
    ],
    usage: 'Snack straight from the pouch, toss over morning cereals, or chop into trail mixes.',
    storage: 'Seal zip-lock tightly after opening.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['papaya', 'dehydrated-fruit', 'digestive-health', 'sugar-free'],
  },
  {
    id: '6',
    slug: 'dehydrated-mango',
    name: 'Sun-Dried Himalayan Mango Slices',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 280,
    compareAtPrice: 350,
    rating: 5.0,
    reviewCount: 58,
    image: '/products/dehydrated-mango.jpg',
    images: [
      '/products/dehydrated-mango.jpg',
      '/products/papaya.jpg',
    ],
    description: 'Golden, intensely flavorful sun-dried mango slices made from tree-ripened Nepali mangoes. No added sugar, sulfur, or preservatives—just pure tropical sunshine packed with vitamins A & C.',
    shortDescription: '100% pure sun-dried sweet mango slices without added sugar or sulfur.',
    badges: ['bestseller'],
    stock: 130,
    weight: '100g',
    ingredients: ['100% Sun-Dried Himalayan Mango'],
    benefits: [
      'Explosive tropical flavor from 100% natural fruit sugars',
      'Packed with natural Vitamin C and Vitamin A',
      'Healthy school lunchbox snack for kids',
      'Zero preservatives and zero artificial coloring'
    ],
    nutrition: [
      { label: 'Calories', value: '310 kcal / 100g' },
      { label: 'Vitamin C', value: '120% DV' },
      { label: 'Dietary Fiber', value: '5g' },
    ],
    usage: 'Enjoy as a sweet energizing snack, steep in cold water for infused water, or chop into salads.',
    storage: 'Airtight container in a cool spot.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['mango', 'dried-fruit', 'healthy-snack', 'sun-dried'],
  },
  {
    id: '7',
    slug: 'dehydrated-pineapple',
    name: 'Dehydrated Himalayan Pineapple',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 320,
    compareAtPrice: 390,
    rating: 4.8,
    reviewCount: 39,
    image: '/products/dehydrated-pineapple.jpg',
    images: [
      '/products/dehydrated-pineapple.jpg',
      '/products/dehydrated-mango.jpg',
    ],
    description: 'Naturally tangy and sweet dehydrated pineapple rings and flowers. Preserves the powerful anti-inflammatory enzyme Bromelain, supporting joint recovery, muscle soreness relief, and digestion.',
    shortDescription: 'Chewy bromelain-rich dehydrated pineapple rings for joint recovery and digestion.',
    badges: ['organic'],
    stock: 80,
    weight: '100g',
    ingredients: ['100% Natural Dehydrated Pineapple'],
    benefits: [
      'Rich in Bromelain enzyme to reduce post-workout inflammation',
      'Supports healthy digestion and nutrient breakdown',
      'Tangy, refreshing flavor without added sugar'
    ],
    nutrition: [
      { label: 'Calories', value: '290 kcal / 100g' },
      { label: 'Bromelain', value: 'High' },
      { label: 'Vitamin C', value: '95% DV' },
    ],
    usage: 'Snack as-is, add to herbal teas, or pair with roasted nuts.',
    storage: 'Keep bag sealed in a cool pantry.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['pineapple', 'dehydrated-fruit', 'bromelain', 'anti-inflammatory'],
  },
  {
    id: '8',
    slug: 'dehydrated-apple',
    name: 'Dehydrated Himalayan Apple Rings',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 320,
    compareAtPrice: 390,
    rating: 4.8,
    reviewCount: 36,
    image: '/products/dehydrated-apple.jpg',
    images: [
      '/products/dehydrated-apple.jpg',
      '/products/papaya.jpg',
    ],
    description: 'Crisp and aromatic dehydrated apple slices handpicked from high-altitude Himalayan mountain orchards. Rich in pectin fiber and quercetin antioxidants for cardiovascular and gut health.',
    shortDescription: 'Crisp, aromatic high-altitude mountain apple rings with zero added sugar.',
    badges: ['organic'],
    stock: 90,
    weight: '100g',
    ingredients: ['100% High-Altitude Himalayan Apples'],
    benefits: [
      'Rich in soluble Pectin fiber for gut prebiotic health',
      'Quercetin antioxidants for lung and heart health',
      'Guilt-free crunchy mountain snack'
    ],
    nutrition: [
      { label: 'Calories', value: '260 kcal / 100g' },
      { label: 'Dietary Fiber', value: '9g' },
    ],
    usage: 'Snack straight from the bag, pair with peanut butter, or simmer with cinnamon.',
    storage: 'Cool, dry location in a sealed container.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['apple', 'dehydrated-fruit', 'pectin', 'himalayan'],
  },
  {
    id: '9',
    slug: 'dried-blueberries',
    name: 'Wild Dried Himalayan Blueberries',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 650,
    compareAtPrice: 780,
    rating: 4.9,
    reviewCount: 62,
    image: '/products/dried-blueberries-100g.jpg',
    images: [
      '/products/dried-blueberries-100g.jpg',
      '/products/naturesmud-all-products-100g.jpg',
      '/products/blueberries.jpg',
      '/products/blueberries-2.jpg',
    ],
    description: 'Wild, hand-foraged Himalayan blueberries gently sun-dried to preserve their dark purple anthocyanins. Known as the ultimate brain berry, supporting memory, cognitive focus, and ocular vitality.',
    shortDescription: 'Anthocyanin-rich wild mountain berries for brain memory and eye health.',
    badges: ['bestseller', 'superfood'],
    stock: 115,
    weight: '100g',
    ingredients: ['100% Wild Himalayan Blueberries'],
    benefits: [
      'Exceptional ORAC antioxidant score for cellular longevity',
      'Supports cognitive clarity, memory, and eye protection',
      'Low glycemic index fruit snack'
    ],
    nutrition: [
      { label: 'Calories', value: '315 kcal / 100g' },
      { label: 'Anthocyanins', value: 'Extremely High' },
      { label: 'Vitamin K', value: '36% DV' },
    ],
    usage: 'Toss into morning yogurt, oatmeal, smoothies, or eat by the handful.',
    storage: 'Keep refrigerated after opening for optimal chewiness.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['blueberries', 'antioxidants', 'brain-food', 'superfood'],
  },
  {
    id: '10',
    slug: 'dried-cranberries',
    name: 'Whole Dried Cranberries',
    category: 'Dried Fruits',
    categorySlug: 'dried-fruits',
    price: 380,
    compareAtPrice: 460,
    rating: 4.7,
    reviewCount: 44,
    image: '/products/cranberries.jpg',
    images: [
      '/products/cranberries.jpg',
      '/products/cranberries-2.jpg',
    ],
    description: 'Plump and juicy dried cranberries bursting with proanthocyanidins (PACs). Clinically proven to support urinary tract wellness, oral health, and cardiovascular circulation.',
    shortDescription: 'Plump, antioxidant-rich whole cranberries for urinary and immune wellness.',
    badges: ['popular'],
    stock: 105,
    weight: '100g',
    ingredients: ['Whole Dried Cranberries'],
    benefits: [
      'Rich in Type-A PACs that protect urinary tract health',
      'Supports healthy blood vessels and gum health',
      'Tart and sweet flavor profile for baking and snacking'
    ],
    nutrition: [
      { label: 'Calories', value: '308 kcal / 100g' },
      { label: 'Vitamin C', value: '25% DV' },
      { label: 'Fiber', value: '5.3g' },
    ],
    usage: 'Add to granola, green salads, muffins, or enjoy as a daily snack.',
    storage: 'Airtight container in a dry cupboard.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['cranberries', 'dried-fruit', 'uti-health', 'antioxidants'],
  },
  {
    id: '11',
    slug: 'roasted-almonds',
    name: 'Premium Roasted Himalayan Almonds',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 360,
    compareAtPrice: 440,
    rating: 4.9,
    reviewCount: 70,
    image: '/products/almonds.jpg',
    images: [
      '/products/almonds.jpg',
      '/products/almonds-2.jpg',
    ],
    description: 'Slow dry-roasted mountain almonds lightly seasoned with pure Himalayan pink salt. High in plant-based protein, Vitamin E, and magnesium for muscle recovery and radiant skin.',
    shortDescription: 'Slow dry-roasted crunchy Himalayan almonds packed with Vitamin E and protein.',
    badges: ['bestseller'],
    stock: 135,
    weight: '100g',
    ingredients: ['Roasted Himalayan Almonds', 'Himalayan Pink Rock Salt'],
    benefits: [
      'High in Vitamin E for cellular anti-aging and skin glow',
      'Packed with 6g of plant protein per serving',
      'Rich in Magnesium for muscle relaxation and sleep'
    ],
    nutrition: [
      { label: 'Calories', value: '579 kcal / 100g' },
      { label: 'Protein', value: '21g' },
      { label: 'Healthy Fats', value: '49g' },
      { label: 'Vitamin E', value: '130% DV' },
    ],
    usage: 'The perfect on-the-go snack, pre-workout protein boost, or salad topper.',
    storage: 'Airtight glass jar in a cool, dry place.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['almonds', 'nuts', 'roasted', 'protein', 'vitamin-e'],
  },
  {
    id: '12',
    slug: 'himalayan-walnuts',
    name: 'Raw Himalayan Walnuts',
    category: 'Nuts',
    categorySlug: 'nuts',
    price: 390,
    compareAtPrice: 480,
    rating: 4.9,
    reviewCount: 55,
    image: '/products/walnuts.jpg',
    images: [
      '/products/walnuts.jpg',
      '/products/almonds.jpg',
    ],
    description: 'Brain-shaped raw walnut halves ethically foraged from organic mountain orchards in Jumla and Mustang. Packed with plant Omega-3 (ALA) and polyphenols to support memory and focus.',
    shortDescription: 'Brain-boosting raw Himalayan walnut halves loaded with plant Omega-3.',
    badges: ['organic', 'bestseller'],
    stock: 110,
    weight: '100g',
    ingredients: ['100% Raw Himalayan Walnut Halves'],
    benefits: [
      'Highest plant Omega-3 (ALA) of any tree nut',
      'Improves cognitive function and mental clarity',
      'Promotes heart health and arterial flexibility'
    ],
    nutrition: [
      { label: 'Calories', value: '654 kcal / 100g' },
      { label: 'Omega-3 ALA', value: '9.1g' },
      { label: 'Protein', value: '15g' },
    ],
    usage: 'Eat 4–5 walnut halves daily, chop into warm breakfast oats, or blend into smoothies.',
    storage: 'Refrigerate in a sealed glass container to preserve natural mountain oils.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['walnuts', 'nuts', 'omega-3', 'brain-food', 'himalayan'],
  },
  {
    id: '13',
    slug: 'pumpkin-seeds',
    name: 'Organic Himalayan Pumpkin Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 280,
    compareAtPrice: 350,
    rating: 4.8,
    reviewCount: 48,
    image: '/products/pumpkin-seeds.jpg',
    images: [
      '/products/pumpkin-seeds.jpg',
      '/products/pumpkin-seeds-2.jpg',
    ],
    description: 'AAA-grade dark green raw pepitas (pumpkin seeds) harvested from organic heirloom squash. An incredible source of bioavailable Zinc, Magnesium, Tryptophan, and plant phytosterols.',
    shortDescription: 'Bioavailable zinc and magnesium powerhouse for prostate, heart, and sleep health.',
    badges: ['organic'],
    stock: 125,
    weight: '100g',
    ingredients: ['100% Raw Organic Pumpkin Seeds (Pepitas)'],
    benefits: [
      'Exceptional natural Zinc content for immune and hormonal health',
      'Tryptophan amino acid promotes deep, restorative sleep',
      'Supports prostate and urinary wellness in men'
    ],
    nutrition: [
      { label: 'Calories', value: '559 kcal / 100g' },
      { label: 'Zinc', value: '70% DV' },
      { label: 'Magnesium', value: '140% DV' },
      { label: 'Protein', value: '30g' },
    ],
    usage: 'Sprinkle over avocado toast, salads, soups, or lightly roast with Himalayan pink salt.',
    storage: 'Keep in an airtight jar away from heat.',
    isFeatured: true,
    isBestSeller: false,
    tags: ['pumpkin-seeds', 'seeds', 'zinc', 'magnesium', 'sleep'],
  },
  {
    id: '14',
    slug: 'chia-seeds',
    name: 'Premium Black Chia Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 250,
    compareAtPrice: 320,
    rating: 4.9,
    reviewCount: 65,
    image: '/products/chia-seeds.jpg',
    images: [
      '/products/chia-seeds.jpg',
      '/products/pumpkin-seeds.jpg',
    ],
    description: 'Pure, raw black chia seeds loaded with soluble dietary fiber, Omega-3 fatty acids, and calcium. Absorbs 10x its weight in water to create a soothing gel that promotes sustained hydration and gut regularity.',
    shortDescription: 'Super-hydrating soluble fiber and plant Omega-3 seeds for weight balance and digestion.',
    badges: ['bestseller'],
    stock: 160,
    weight: '100g',
    ingredients: ['100% Raw Black Chia Seeds'],
    benefits: [
      'Absorbs water to prolong athletic hydration and satiety',
      'Over 34g of dietary fiber per 100g for smooth elimination',
      'High in plant calcium for strong bones'
    ],
    nutrition: [
      { label: 'Calories', value: '486 kcal / 100g' },
      { label: 'Fiber', value: '34.4g' },
      { label: 'Omega-3', value: '17.8g' },
      { label: 'Calcium', value: '63% DV' },
    ],
    usage: 'Soak 1 tablespoon in water, milk, or juice for 15 minutes before consuming. Perfect in puddings and smoothies.',
    storage: 'Store dry in an airtight container.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['chia-seeds', 'seeds', 'fiber', 'weight-loss', 'hydration'],
  },
  {
    id: '15',
    slug: 'flax-seeds',
    name: 'Organic Golden Flax Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 200,
    compareAtPrice: 260,
    rating: 4.7,
    reviewCount: 31,
    image: '/products/flax-seeds.jpg',
    images: [
      '/products/flax-seeds.jpg',
      '/products/chia-seeds.jpg',
    ],
    description: 'Organically grown golden flax seeds loaded with lignans (plant estrogen balancers) and soluble mucilage fiber. Excellent for cardiovascular wellness, hormonal equilibrium, and smooth digestion.',
    shortDescription: 'Lignan-rich golden flax seeds for hormonal balance and healthy blood pressure.',
    badges: ['organic'],
    stock: 90,
    weight: '100g',
    ingredients: ['100% Organic Golden Flax Seeds'],
    benefits: [
      'Highest source of dietary lignans for hormone balance',
      'Mucilage fiber soothes stomach lining',
      'Helps maintain healthy cholesterol levels'
    ],
    nutrition: [
      { label: 'Calories', value: '534 kcal / 100g' },
      { label: 'Fiber', value: '27.3g' },
      { label: 'Omega-3 ALA', value: '22.8g' },
    ],
    usage: 'Grind freshly before adding to smoothies, dough, rotis, or warm cereal for maximum nutrient absorption.',
    storage: 'Keep in an airtight jar in a dark cupboard.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['flax-seeds', 'seeds', 'lignans', 'hormone-balance'],
  },
  {
    id: '16',
    slug: 'sunflower-seeds',
    name: 'Organic Sunflower Seeds',
    category: 'Seeds',
    categorySlug: 'seeds',
    price: 240,
    compareAtPrice: 300,
    rating: 4.7,
    reviewCount: 29,
    image: '/products/sunflower-seeds.jpg',
    images: [
      '/products/sunflower-seeds.jpg',
      '/products/pumpkin-seeds.jpg',
    ],
    description: 'Raw, shelled sunflower seed kernels packed with Vitamin E, Selenium, and B-complex vitamins. Promotes thyroid health, cellular protection, and radiant skin.',
    shortDescription: 'Crunchy sunflower seed kernels packed with selenium and Vitamin E.',
    badges: ['organic'],
    stock: 80,
    weight: '100g',
    ingredients: ['100% Raw Shelled Sunflower Seeds'],
    benefits: [
      'High in Selenium for optimal thyroid support',
      'Potent Vitamin E content defends against oxidative stress',
      'Delicious nutty crunch for salads and baking'
    ],
    nutrition: [
      { label: 'Calories', value: '584 kcal / 100g' },
      { label: 'Vitamin E', value: '170% DV' },
      { label: 'Selenium', value: '75% DV' },
    ],
    usage: 'Sprinkle over breakfast bowls, bake into bread, or blend into homemade sunflower seed butter.',
    storage: 'Cool, dry storage in a sealed pouch.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['sunflower-seeds', 'seeds', 'selenium', 'vitamin-e'],
  },
  {
    id: '17',
    slug: 'raw-honey',
    name: 'Mustang Raw Wild Honey',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 380,
    compareAtPrice: 480,
    rating: 5.0,
    reviewCount: 88,
    image: '/products/honey.jpg',
    images: [
      '/products/honey.jpg',
      '/products/raw-honey.jpg',
    ],
    description: '100% pure, unheated, and unfiltered raw mountain honey harvested from wild Himalayan bee hives in Mustang and Rolwaling at 3,000+ meters altitude. Retains all natural pollen, propolis, live enzymes, and antibacterial bioflavonoids.',
    shortDescription: 'Unheated, unfiltered wild multifloral mountain honey from high-altitude Mustang cliffs.',
    badges: ['bestseller', 'raw', 'organic'],
    stock: 100,
    weight: '100g',
    ingredients: ['100% Pure Raw Unfiltered Himalayan Wild Honey'],
    benefits: [
      'Natural antibiotic, antibacterial, and antifungal properties',
      'Soothes sore throats, coughs, and seasonal allergies',
      'Rich in bee pollen and active enzymes',
      'Never ultra-filtered or heated above natural hive temperatures'
    ],
    nutrition: [
      { label: 'Calories', value: '304 kcal / 100g' },
      { label: 'Natural Sugars', value: '82g' },
      { label: 'Active Enzymes', value: 'Live' },
    ],
    usage: 'Take 1 spoonful daily on an empty stomach, or stir into warm (never boiling) water or herbal teas.',
    storage: 'Store at room temperature. Natural crystallization is proof of purity—warm gently to liquefy.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['honey', 'raw-honey', 'mustang', 'antibacterial', 'immunity'],
  },
  {
    id: '18',
    slug: 'himalayan-pink-salt',
    name: 'Ancient Himalayan Pink Rock Salt',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 150,
    compareAtPrice: 200,
    rating: 4.9,
    reviewCount: 50,
    image: '/products/pink-salt.jpg',
    images: [
      '/products/pink-salt.jpg',
      '/products/honey.jpg',
    ],
    description: 'Unrefined, mineral-rich Himalayan pink salt mined from ancient pristine seabeds. Contains 84 essential trace minerals (iron, magnesium, potassium, calcium) with zero anti-caking microplastics or bleach.',
    shortDescription: 'Pure unrefined mountain crystal salt containing 84 essential trace minerals.',
    badges: ['organic'],
    stock: 200,
    weight: '100g',
    ingredients: ['100% Pure Himalayan Pink Rock Salt'],
    benefits: [
      'Contains 84 natural ionic trace minerals',
      'Supports optimal cellular electrolyte and fluid balance',
      'Free from chemical bleaches, microplastics, and anti-caking agents'
    ],
    nutrition: [
      { label: 'Sodium Chloride', value: '98%' },
      { label: 'Trace Minerals', value: '84 Minerals' },
    ],
    usage: 'Use in everyday cooking, morning sole water for electrolytes, or relaxing mineral bath soaks.',
    storage: 'Store in a dry glass jar.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['pink-salt', 'electrolytes', 'minerals', 'himalayan'],
  },
  {
    id: '19',
    slug: 'virgin-coconut-oil',
    name: 'Cold-Pressed Virgin Coconut Oil',
    category: 'Oils',
    categorySlug: 'oils',
    price: 290,
    compareAtPrice: 350,
    rating: 4.9,
    reviewCount: 46,
    image: '/products/coconut-oil.jpg',
    images: [
      '/products/coconut-oil.jpg',
      '/products/honey.jpg',
    ],
    description: 'Centrifuged extra virgin raw coconut oil extracted from fresh organic coconut meat without chemical refining or heat. Loaded with Medium Chain Triglycerides (MCTs) like Lauric Acid for metabolism, brain fuel, and Ayurvedic oil pulling.',
    shortDescription: 'Centrifuged raw extra-virgin coconut oil rich in Lauric Acid and MCTs.',
    badges: ['organic', 'cold-pressed'],
    stock: 90,
    weight: '100ml',
    ingredients: ['100% Pure Cold-Pressed Virgin Coconut Oil'],
    benefits: [
      'Rich in Lauric Acid for immune defense and gut health',
      'MCT fats provide instant clean ketone brain energy',
      'Ideal for Ayurvedic daily oil pulling (Kavala Graha) and hair vitality'
    ],
    nutrition: [
      { label: 'Calories', value: '862 kcal / 100g' },
      { label: 'MCT Lauric Acid', value: '50%' },
    ],
    usage: 'Use 1 tablespoon for morning oil pulling, cooking, bulletproof coffee, or apply directly to hair and skin.',
    storage: 'Keep at room temperature. Solidifies below 24°C naturally.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['coconut-oil', 'cold-pressed', 'mct', 'oil-pulling'],
  },
  {
    id: '20',
    slug: 'cold-pressed-mustard-oil',
    name: 'Traditional Cold-Pressed Mustard Oil',
    category: 'Oils',
    categorySlug: 'oils',
    price: 220,
    compareAtPrice: 280,
    rating: 4.8,
    reviewCount: 37,
    image: '/products/coconut-oil.jpg',
    images: [
      '/products/coconut-oil.jpg',
      '/products/pink-salt.jpg',
    ],
    description: 'Traditional wooden kolhu (cold-pressed) yellow mustard oil from organic Nepali mountain mustard seeds. Pungent, unrefined, and rich in Monounsaturated Fatty Acids (MUFA) and natural antioxidants.',
    shortDescription: 'Traditional wooden kolhu pressed mustard oil with rich pungent aroma and zero chemicals.',
    badges: ['cold-pressed'],
    stock: 110,
    weight: '100ml',
    ingredients: ['100% Pure Cold-Pressed Nepali Mustard Oil'],
    benefits: [
      'Wooden kolhu extracted to keep delicate fatty acids undamaged',
      'High smoke point ideal for authentic Nepali cooking',
      'Traditional body massage oil for muscle warmth and circulation'
    ],
    nutrition: [
      { label: 'Calories', value: '884 kcal / 100g' },
      { label: 'MUFA & PUFA', value: 'Healthy Fats' },
    ],
    usage: 'Use in authentic Nepali curries, pickles, or traditional winter body massage.',
    storage: 'Store in dark bottle away from direct sunlight.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['mustard-oil', 'cold-pressed', 'ayurveda', 'cooking-oil'],
  },
  {
    id: '21',
    slug: 'superfood-trail-mix',
    name: 'Himalayan Superfood Energy Trail Mix',
    category: 'Superfoods',
    categorySlug: 'superfoods',
    price: 380,
    compareAtPrice: 460,
    rating: 4.9,
    reviewCount: 53,
    image: '/products/superfood-mix.jpg',
    images: [
      '/products/superfood-mix.jpg',
      '/products/superfood-mix-2.jpg',
    ],
    description: 'Artisanal powerhouse blend of roasted almonds, Himalayan walnuts, raw pumpkin seeds, chia seeds, dehydrated papaya, wild blueberries, and cranberries. The ultimate clean energy snack for trekking, gym, and busy work days.',
    shortDescription: 'Powerhouse snack blend of roasted mountain nuts, seeds, and dehydrated fruits.',
    badges: ['bestseller'],
    stock: 140,
    weight: '100g',
    ingredients: [
      'Roasted Himalayan Almonds',
      'Raw Himalayan Walnuts',
      'Organic Pumpkin Seeds',
      'Chia Seeds',
      'Dehydrated Sweet Papaya',
      'Wild Blueberries',
      'Dried Cranberries'
    ],
    benefits: [
      'Balanced ratio of healthy plant fats, clean protein, and fiber',
      'Sustained energy without sudden sugar crashes',
      'Convenient pocket snack for hiking, office, and travel'
    ],
    nutrition: [
      { label: 'Calories', value: '495 kcal / 100g' },
      { label: 'Protein', value: '16g' },
      { label: 'Dietary Fiber', value: '11g' },
    ],
    usage: 'Eat straight from the pack, toss into morning cereal, or pack for outdoor treks.',
    storage: 'Keep pouch sealed in a cool, dry place.',
    isFeatured: true,
    isBestSeller: true,
    tags: ['trail-mix', 'superfood', 'energy-snack', 'nuts-and-seeds'],
  },
  {
    id: '22',
    slug: 'moringa-powder',
    name: 'Organic Himalayan Moringa Leaf Powder',
    category: 'Powders',
    categorySlug: 'powders',
    price: 350,
    compareAtPrice: 420,
    rating: 4.8,
    reviewCount: 35,
    image: '/products/sweet-potato-powder.jpg',
    images: [
      '/products/sweet-potato-powder.jpg',
      '/products/beetroot-powder.jpg',
    ],
    description: 'Shade-dried and micro-milled organic Moringa Oleifera leaves from the pristine Himalayan foothills. Known as the "Miracle Tree," containing 7x more Vitamin C than oranges and 4x more Calcium than milk.',
    shortDescription: 'The "Miracle Tree" superfood powder packed with plant iron, calcium, and 46 antioxidants.',
    badges: ['organic', 'superfood'],
    stock: 75,
    weight: '100g',
    ingredients: ['100% Pure Organic Moringa Leaf Powder'],
    benefits: [
      'Over 90 nutrients and 46 bioactive antioxidants',
      'Rich plant-based Iron and Calcium for daily vitality',
      'Supports healthy blood sugar and immune resilience'
    ],
    nutrition: [
      { label: 'Calories', value: '205 kcal / 100g' },
      { label: 'Protein', value: '27g' },
      { label: 'Iron', value: '150% DV' },
      { label: 'Calcium', value: '200% DV' },
    ],
    usage: 'Whisk 1/2 teaspoon into warm lemon water, green smoothies, or dahl soup.',
    storage: 'Airtight container protected from light.',
    isFeatured: false,
    isBestSeller: false,
    tags: ['moringa', 'powder', 'miracle-tree', 'immunity', 'green-superfood'],
  },
  {
    id: "23",
    slug: "barley-grass-powder",
    name: "Organic Barley Grass Powder",
    category: "Powders",
    categorySlug: "powders",
    price: 380,
    compareAtPrice: 450,
    rating: 4.7,
    reviewCount: 28,
    image: "/products/sweet-potato-powder.jpg",
    images: [
      "/products/sweet-potato-powder.jpg",
      "/products/beetroot-powder.jpg"
    ],
    description: "Tender young organic barley grass shoots harvested at nutritional peak, cold-dehydrated and micro-ground. Rich in chlorophyll and live enzymes for cellular detoxification and alkaline pH balance.",
    shortDescription: "Chlorophyll-rich green powder for morning alkaline detox and cellular vitality.",
    badges: ["organic"],
    stock: 70,
    weight: "100g",
    ingredients: [
      "100% Pure Organic Young Barley Grass"
    ],
    benefits: [
      "Rich in natural Chlorophyll to cleanse blood and tissues",
      "Helps maintain an alkaline bodily pH balance",
      "Natural digestive enzymes support nutrient absorption"
    ],
    nutrition: [
      {
            "label": "Calories",
            "value": "240 kcal / 100g"
      },
      {
            "label": "Chlorophyll",
            "value": "580mg / 100g"
      },
      {
            "label": "Dietary Fiber",
            "value": "38g"
      },
      {
            "label": "Protein",
            "value": "24g"
      }
    ],
    usage: "Whisk 1 teaspoon into cold water, fresh lime juice, or green smoothies.",
    storage: "Store in an airtight container protected from direct light.",
    isFeatured: false,
    isBestSeller: false,
    tags: ["barley-grass","powder","chlorophyll","alkaline","green-superfood"],
  },
  {
    id: "24",
    slug: "pure-himalayan-black-salt-bire-noon",
    name: "Pure Himalayan Black Salt (Bire Noon) (200g)",
    category: "Salts & Spices",
    categorySlug: "salts-spices",
    price: 150,
    compareAtPrice: 190,
    rating: 4.9,
    reviewCount: 38,
    image: "/products/himalayan-black-salt-digestive.jpg",
    images: [
      "/products/himalayan-black-salt-digestive.jpg",
      "/products/black-salt.jpg"
    ],
    description: "Authentic, mineral-dense Himalayan Black Salt (Bire Noon), mined from ancient salt ranges. Revered in Ayurvedic medicine for stimulating digestive agni, relieving gas, bloating, and heartburn while adding a distinct savory umami aroma to salads, chaats, and raitas.",
    shortDescription: "Authentic volcanic trace-mineral rock salt with distinctive digestive benefits.",
    badges: ["ayurvedic","organic"],
    stock: 120,
    weight: "200g",
    ingredients: [
      "100% Pure Himalayan Black Salt (Kala Namak / Bire Noon) with natural iron sulfides and trace minerals"
    ],
    benefits: [
      "Stimulates digestive fire (Agni) and eases gastric discomfort",
      "Naturally lower sodium profile than industrial table salt",
      "Packed with active sulfur compounds and iron minerals",
      "Essential for authentic chaats, pickles, raitas, and Ayurvedic chaas"
    ],
    nutrition: [
      {
            "label": "Sodium Chloride",
            "value": "88-92%"
      },
      {
            "label": "Iron & Sulfur Minerals",
            "value": "High Trace"
      },
      {
            "label": "Additives / Anti-caking Agents",
            "value": "0%"
      }
    ],
    usage: "Pinch into morning warm water, fresh fruit salads, buttermilk chaas, or homemade snacks.",
    storage: "Store in an airtight glass jar in a dry pantry away from moisture.",
    isFeatured: true,
    isBestSeller: false,
    tags: ["black-salt","bire-noon","kala-namak","digestion","ayurveda","mineral-salt"],
  },
  {
    id: "25",
    slug: "baby-first-weaning-superfood-trio",
    name: "Baby First Weaning Superfood Trio Pack (3 x 100g)",
    category: "Superfoods",
    categorySlug: "superfoods",
    price: 999,
    compareAtPrice: 1250,
    rating: 5,
    reviewCount: 64,
    image: "/images/combos/baby-weaning-combo.jpg",
    images: [
      "/images/combos/baby-weaning-combo.jpg",
      "/products/sweet-potato-powder.jpg",
      "/products/dates-powder-100g.jpg",
      "/products/carrot-benefits-poster.jpg"
    ],
    description: "The complete pediatric nutrition bundle for babies starting solid foods (6M+). Contains 100% Organic Sweet Potato Powder (100g) for gut motility, Natural Dates Powder (100g) as an unrefined iron-rich sweetener, and Organic Carrot Powder (100g) for Pro-Vitamin A eye and immune support. Zero chemicals, zero preservatives, zero refined sugar.",
    shortDescription: "Organic Sweet Potato, Dates & Carrot Powders for healthy infant growth and brain development.",
    badges: ["bestseller","baby-safe","organic"],
    stock: 85,
    weight: "300g (3 x 100g)",
    ingredients: [
      "100% Organic Solar-Dehydrated Sweet Potato Powder (100g)",
      "100% Unrefined Dried Dates Powder (100g)",
      "100% Organic Dehydrated Mountain Carrot Powder (100g)"
    ],
    benefits: [
      "Easy 2-minute wholesome infant cereal and porridge preparation",
      "Provides natural non-heme iron, potassium, and Pro-Vitamin A beta carotene",
      "100% sugar-free healthy weaning for babies aged 6 months and beyond",
      "Supports healthy digestion and soft, regular bowel movements"
    ],
    nutrition: [
      {
            "label": "Pro-Vitamin A (Beta Carotene)",
            "value": "High"
      },
      {
            "label": "Iron & Potassium",
            "value": "100% Natural Plant Source"
      },
      {
            "label": "Refined Sugar",
            "value": "0g"
      },
      {
            "label": "Preservatives",
            "value": "0%"
      }
    ],
    usage: "Mix 1-2 tsp with warm boiled water, breast milk, ragi porridge, or khichdi.",
    storage: "Keep jars tightly sealed in a cool, dry place. Reseal immediately after spooning.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["baby-food","weaning","sweet-potato","dates-powder","carrot-powder","combo","infant-nutrition"],
  },
  {
    id: "26",
    slug: "athletic-stamina-nitric-oxide-duo",
    name: "Athletic Stamina & Nitric Oxide Duo Pack",
    category: "Superfoods",
    categorySlug: "superfoods",
    price: 849,
    compareAtPrice: 1050,
    rating: 4.9,
    reviewCount: 51,
    image: "/images/combos/sports-nutrition-combo.jpg",
    images: [
      "/images/combos/sports-nutrition-combo.jpg",
      "/products/beetroot-poster-2k.jpg",
      "/products/chia-seeds.jpg"
    ],
    description: "Engineered for runners, gym athletes, trekkers, and fitness enthusiasts. Combines Pure Himalayan Beetroot Powder (100g) for dietary nitrates and vasodilation pump with Premium Black Chia Seeds (100g) for prolonged cellular hydration and complete plant Omega-3 fatty acids.",
    shortDescription: "Pre-workout beetroot nitric oxide pump + endurance hydration chia seeds.",
    badges: ["sports-performance","bestseller"],
    stock: 90,
    weight: "200g (2 x 100g)",
    ingredients: [
      "100% Pure Himalayan Beetroot Powder (100g)",
      "100% Premium Raw Black Chia Seeds (100g)"
    ],
    benefits: [
      "Increases blood flow and oxygen delivery to working muscles via nitric oxide",
      "Hydrophilic chia seeds retain 12x their weight in water for cellular hydration",
      "Natural stamina booster without artificial caffeine or pre-workout jitters",
      "Accelerates post-training muscle recovery and reduces oxidative soreness"
    ],
    nutrition: [
      {
            "label": "Dietary Nitrates",
            "value": "Concentrated Natural Source"
      },
      {
            "label": "Plant Omega-3 (ALA)",
            "value": "5000mg per 28g Chia"
      },
      {
            "label": "Electrolytes & Potassium",
            "value": "Rich"
      }
    ],
    usage: "Take 1 tsp Beetroot Powder + 1 tbsp Chia Seeds in 300ml cold water or juice 45 mins before workout.",
    storage: "Store in a dry gym bag or pantry away from direct heat.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["fitness","pre-workout","beetroot","chia-seeds","endurance","combo","nitric-oxide"],
  },
  {
    id: "27",
    slug: "womens-vitality-hormone-balance-pack",
    name: "Women's Vitality & Hormone Balance Pack (3 x 100g)",
    category: "Superfoods",
    categorySlug: "superfoods",
    price: 799,
    compareAtPrice: 980,
    rating: 4.9,
    reviewCount: 47,
    image: "/images/combos/wellness-pack.jpg",
    images: [
      "/images/combos/wellness-pack.jpg",
      "/products/flax-seeds.jpg",
      "/products/pumpkin-seeds.jpg",
      "/products/cranberries.jpg"
    ],
    description: "Specially formulated for women navigating PCOS, menstrual health, and maternal recovery. Includes Golden Flax Seeds (100g) for plant lignans and estrogen modulation, Himalayan Pumpkin Seeds (100g) for zinc and progesterone support, and Whole Dried Cranberries (100g) for urinary tract protection.",
    shortDescription: "Targeted women's health pack: Flax Seeds, Pumpkin Seeds & Whole Dried Cranberries.",
    badges: ["bestseller","organic"],
    stock: 75,
    weight: "300g (3 x 100g)",
    ingredients: [
      "100% Organic Golden Flax Seeds (100g)",
      "100% Raw Himalayan Pumpkin Seeds (100g)",
      "Whole Dried Cranberries with PACs (100g)"
    ],
    benefits: [
      "Supports natural estrogen and progesterone balance via seed cycling",
      "Bioavailable zinc promotes glowing skin and strong hair roots",
      "Clinically recognized PAC antioxidants defend bladder health",
      "High in plant Omega-3 and magnesium for stress relief"
    ],
    nutrition: [
      {
            "label": "Dietary Lignans",
            "value": "Highest Plant Source"
      },
      {
            "label": "Zinc & Magnesium",
            "value": "Over 100% DV"
      },
      {
            "label": "Type-A PACs",
            "value": "High"
      }
    ],
    usage: "Incorporate 1 tbsp flax/pumpkin seeds into breakfast oats daily; snack on cranberries or blend into smoothies.",
    storage: "Cool, dark pantry or refrigerated container.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["womens-health","pcos","seed-cycling","combo","flax-seeds","pumpkin-seeds","cranberries"],
  },
  {
    id: "28",
    slug: "himalayan-superfood-lineup-pack",
    name: "Himalayan Superfood Complete Lineup Pack (5 x 100g)",
    category: "Superfoods",
    categorySlug: "superfoods",
    price: 1850,
    compareAtPrice: 2400,
    rating: 5,
    reviewCount: 92,
    image: "/images/combos/superfood-lineup.jpg",
    images: [
      "/images/combos/superfood-lineup.jpg",
      "/images/combos/organic-powders-poster.jpg",
      "/images/combos/lineup-wood.jpg"
    ],
    description: "The flagship Nature's Mud grand wellness bundle. Features our 5 most celebrated products: Sweet Potato Powder (100g), Dates Powder (100g), Wild Dried Himalayan Blueberries (100g), Whole Dried Cranberries (100g), and Himalayan Pumpkin Seeds (100g).",
    shortDescription: "The ultimate all-in-one Himalayan superfood pantry starter collection.",
    badges: ["bestseller","superfood"],
    stock: 60,
    weight: "500g (5 x 100g)",
    ingredients: [
      "Organic Sweet Potato Powder (100g)",
      "Natural Dates Powder Sweetener (100g)",
      "Wild Dried Himalayan Blueberries (100g)",
      "Whole Dried Cranberries (100g)",
      "Organic Himalayan Pumpkin Seeds (100g)"
    ],
    benefits: [
      "Comprehensive whole-family daily superfood nutrition",
      "Saves over 20% compared to purchasing individual jars",
      "Ideal gift for mindful parents, athletes, and wellness seekers",
      "100% natural, unrefined, and sustainably harvested"
    ],
    nutrition: [
      {
            "label": "Antioxidants",
            "value": "Extreme High"
      },
      {
            "label": "Clean Micronutrients",
            "value": "Full Spectrum"
      },
      {
            "label": "Preservatives / Chemicals",
            "value": "0%"
      }
    ],
    usage: "Use across morning smoothies, breakfast bowls, baking, and healthy snacking.",
    storage: "Store jars in a cool, dry place away from moisture.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["combo","grand-pack","superfoods","family-pack","blueberries","cranberries","sweet-potato"],
  },
  {
    id: "29",
    slug: "pure-mountain-himalayan-shilajit-resin",
    name: "Pure Mountain Himalayan Shilajit Resin (Gold Grade 20g)",
    category: "Ayurvedic Herb",
    categorySlug: "ayurveda",
    price: 1650,
    compareAtPrice: 2100,
    rating: 5,
    reviewCount: 114,
    image: "/products/shilajit.jpg",
    images: [
      "/products/shilajit.jpg"
    ],
    description: "Gold-grade 100% pure Himalayan Shilajit resin, sustainably harvested from pristine Himalayan altitudes above 16,000 feet. Purified using traditional Ayurvedic triphala water decoction. Naturally concentrated with >75% fulvic acid and 84+ ionic trace minerals to support cellular mitochondrial energy, stamina, cognitive clarity, and vitality.",
    shortDescription: "Authentic gold-grade Himalayan Shilajit resin with >75% fulvic acid for peak vitality.",
    badges: ["ayurvedic","superfood","bestseller"],
    stock: 50,
    weight: "20g Glass Jar",
    ingredients: [
      "100% Pure Purified Himalayan Shilajit Resin (Gold Grade, >75% Fulvic Acid)"
    ],
    benefits: [
      "Boosts cellular ATP energy and mitochondrial oxygenation",
      "Supports healthy testosterone levels and reproductive stamina in men and women",
      "Enhances cognitive memory, focus, and neuroprotective resilience",
      "Contains 84+ bioavailable ionic trace minerals for deep cellular nourishment"
    ],
    nutrition: [
      {
            "label": "Fulvic Acid",
            "value": ">75%"
      },
      {
            "label": "Ionic Trace Minerals",
            "value": "84+"
      },
      {
            "label": "Heavy Metal Tested",
            "value": "Safety Certified"
      }
    ],
    usage: "Dissolve a pea-sized portion (300-500mg) in warm water, milk, or green tea once daily in the morning.",
    storage: "Store in a cool dry place. Keep jar tightly closed to avoid drying out.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["shilajit", "ayurveda", "fulvic-acid", "vitality", "energy", "rasayana", "himalayan"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function normalizeProduct(product: any, fallback?: Product | null): Product {
  if (!product && fallback) return fallback;
  if (!product) return fallback as Product;

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? (product.category.name || fallback?.category || 'Organic')
      : typeof product.category === 'string' && product.category.trim().length > 0
      ? product.category
      : fallback?.category || 'Organic';

  const categorySlug =
    typeof product.category === 'object' && product.category !== null
      ? (product.category.slug || product.categorySlug || fallback?.categorySlug || 'organic')
      : product.categorySlug ||
        (typeof product.category === 'string'
          ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : fallback?.categorySlug || 'organic');

  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : fallback?.images && fallback.images.length > 0
      ? fallback.images
      : [fallback?.image || '/products/naturesmud-all-products-100g.jpg'];

  const mainImage =
    product.image || (rawImages.length > 0 ? rawImages[0] : fallback?.image || '/products/naturesmud-all-products-100g.jpg');

  return {
    ...fallback,
    ...product,
    id: String(product.id || fallback?.id || ''),
    slug: String(product.slug || fallback?.slug || ''),
    name: String(product.name || fallback?.name || ''),
    category: categoryName,
    categorySlug: categorySlug,
    price: Number(product.price ?? fallback?.price ?? 0),
    compareAtPrice:
      product.compareAtPrice !== undefined
        ? Number(product.compareAtPrice)
        : product.compare_at_price !== undefined
        ? Number(product.compare_at_price)
        : fallback?.compareAtPrice,
    rating: Number(product.rating ?? fallback?.rating ?? 5),
    reviewCount: Number(product.reviewCount ?? product.review_count ?? fallback?.reviewCount ?? 0),
    image: mainImage,
    images: rawImages,
    description: String(product.description || fallback?.description || ''),
    shortDescription: String(product.shortDescription || product.short_description || fallback?.shortDescription || ''),
    badges: Array.isArray(product.badges) ? product.badges : fallback?.badges || [],
    stock: Number(product.stock ?? fallback?.stock ?? 100),
    weight: String(product.weight || fallback?.weight || '100g'),
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : fallback?.ingredients || [],
    benefits: Array.isArray(product.benefits) ? product.benefits : fallback?.benefits || [],
    nutrition: Array.isArray(product.nutrition) ? product.nutrition : fallback?.nutrition || [],
    usage: String(product.usage || fallback?.usage || ''),
    storage: String(product.storage || fallback?.storage || ''),
    isFeatured: Boolean(product.isFeatured ?? product.is_featured ?? fallback?.isFeatured ?? false),
    isBestSeller: Boolean(product.isBestSeller ?? product.is_bestseller ?? product.is_best_seller ?? fallback?.isBestSeller ?? false),
    tags: Array.isArray(product.tags) ? product.tags : fallback?.tags || [],
  };
}

