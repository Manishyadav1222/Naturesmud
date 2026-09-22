import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/utils';

export const products: Product[] = [
  {
    "id": "1010",
    "slug": "makhana-fox-nuts",
    "dbId": 1010,
    "name": "Makhana (Fox Nuts)",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 250,
    "compareAtPrice": 250,
    "mrp": 250,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/products/nm-makhana-jar.jpeg",
    "images": [
      "/products/nm-makhana-jar.jpeg",
      "/products/fox-nuts-jar-2k.jpg"
    ],
    "description": "Premium Himalayan Fox Nuts (Makhana). A healthy, crunchy, and lightweight snack loaded with antioxidants, calcium, and protein. Enjoy guilt-free snacking with these beautifully puffed lotus seeds.",
    "shortDescription": "Crunchy and lightweight Himalayan Fox Nuts (Makhana) for healthy snacking.",
    "badges": [
      "new"
    ],
    "stock": 100,
    "weight": "60 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Fox Nuts (Makhana)"
    ],
    "benefits": [
      "Rich in calcium for bone health",
      "Low in calories and high in protein",
      "Great source of antioxidants"
    ],
    "nutrition": [],
    "usage": "Roast lightly with a pinch of pink salt for a perfect evening snack.",
    "storage": "Store in an airtight container to maintain crispness.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "makhana",
      "fox-nuts",
      "snack",
      "healthy"
    ]
  },
  {
    "id": "1",
    "slug": "dehydrated-mango",
    "dbId": 1,
    "name": "Dehydrated Mango",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 595,
    "compareAtPrice": 595,
    "mrp": 595,
    "rating": 4.9,
    "reviewCount": 68,
    "image": "/products/nm-mango-pouch.jpeg",
    "images": [
      "/products/nm-mango-pouch.jpeg",
      "/products/nm-mango-prod.jpeg",
      "/products/dehydrated-mango-poster.jpg",
      "/products/authentic-dehydrated-mango.jpg",
      "/products/mango.jpg"
    ],
    "description": "Golden, intensely flavorful naturally dried mango slices sourced directly from the Tarai lowlands of Nepal. Gently dehydrated at low temperatures with 0 additives and 0 preservatives—pure tropical sweetness packed with Vitamins A & C.",
    "shortDescription": "Pure naturally dried sweet mango slices with 0 additives and 0 preservatives in a Standup Ziplock Pouch.",
    "badges": [
      "bestseller"
    ],
    "stock": 120,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Pure Himalayan Mango (0 Additives, 0 Preservatives)"
    ],
    "benefits": [
      "Explosive tropical flavor from 100% natural fruit sugars",
      "Packed with natural Vitamin C and Vitamin A for skin & immunity",
      "Healthy lunchbox and office snack with zero artificial coloring",
      "Gently dehydrated below 42°C to preserve natural enzymes"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "310 kcal / 100g"
      },
      {
        "label": "Vitamin C",
        "value": "120% DV"
      },
      {
        "label": "Vitamin A",
        "value": "85% DV"
      },
      {
        "label": "Dietary Fiber",
        "value": "5g"
      },
      {
        "label": "Natural Fruit Sugar",
        "value": "62g"
      }
    ],
    "usage": "Enjoy directly from the pouch as an energizing snack, chop into morning yogurt bowls, or steep in water for fruit infusions.",
    "storage": "Reseal the ziplock tightly after opening. Store in a cool, dry place.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "mango",
      "dehydrated-mango",
      "dried-fruits",
      "healthy-snack",
      "sugar-free"
    ]
  },
  {
    "id": "157",
    "slug": "dehydrated-pineapple",
    "dbId": 157,
    "name": "Dehydrated Pineapple",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 495,
    "compareAtPrice": 495,
    "mrp": 495,
    "rating": 4.9,
    "reviewCount": 45,
    "image": "/products/nm-pineapple-pouch.jpeg",
    "images": [
      "/products/nm-pineapple-pouch.jpeg",
      "/products/nm-pineapple-design.jpeg",
      "/products/authentic-dehydrated-pineapple.jpg",
      "/products/dehydrated-pineapple.jpg"
    ],
    "description": "Tangy-sweet pineapple slices harvested from sun-drenched terraced hills and slowly dehydrated. Packed with natural bromelain digestive enzyme, vitamin C, and manganese for anti-inflammatory wellness.",
    "shortDescription": "Tangy-sweet dehydrated pineapple rings rich in natural bromelain enzyme in a Standup Ziplock Pouch.",
    "badges": [
      "organic"
    ],
    "stock": 95,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Pure Dehydrated Pineapple Slices"
    ],
    "benefits": [
      "Natural Bromelain enzyme supports healthy protein digestion",
      "High in Vitamin C to fortify immune mucosal defense",
      "Chewy, tangy-sweet tropical flavor with zero syrup baths",
      "Guilt-free digestive snack after heavy meals"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "290 kcal / 100g"
      },
      {
        "label": "Vitamin C",
        "value": "110% DV"
      },
      {
        "label": "Bromelain",
        "value": "Active"
      },
      {
        "label": "Dietary Fiber",
        "value": "4.5g"
      }
    ],
    "usage": "Snack straight from the pouch, chop into granola, or add to festive cakes and trail mixes.",
    "storage": "Store sealed in a dry pantry away from moisture.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "pineapple",
      "dehydrated-pineapple",
      "dried-fruits",
      "bromelain",
      "digestive-health"
    ]
  },
  {
    "id": "3",
    "slug": "dehydrated-apple",
    "dbId": 3,
    "name": "Dehydrated Apple",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 510,
    "compareAtPrice": 510,
    "mrp": 510,
    "rating": 4.8,
    "reviewCount": 42,
    "image": "/products/nm-apple-pouch.jpeg",
    "images": [
      "/products/nm-apple-pouch.jpeg",
      "/products/nm-apple-design.jpeg",
      "/products/dehydrated-apple-poster.jpg",
      "/products/authentic-dehydrated-apple.jpg",
      "/products/apple.jpg"
    ],
    "description": "Crisp and naturally sweet dehydrated apple rings from high-altitude Himalayan orchards in Jumla and Mustang. Packed with soluble pectin fiber, quercetin, and polyphenols for cardiovascular health and gut digestion.",
    "shortDescription": "Pectin-rich crispy dehydrated apple rings with zero added sugar in a Standup Ziplock Pouch.",
    "badges": [
      "organic"
    ],
    "stock": 85,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Pure Mountain Apple Slices (Unsulfured)"
    ],
    "benefits": [
      "High in Pectin soluble fiber to nourish beneficial gut flora",
      "Natural Quercetin antioxidant for lung and heart health",
      "Satisfies sweet tooth naturally without refined sugars",
      "Great toddler-friendly healthy snack"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "243 kcal / 100g"
      },
      {
        "label": "Dietary Fiber",
        "value": "8.7g"
      },
      {
        "label": "Potassium",
        "value": "450mg"
      },
      {
        "label": "Vitamin C",
        "value": "20% DV"
      }
    ],
    "usage": "Enjoy as a crunchy snack, dip in warm cinnamon tea, or crumble over morning oatmeal.",
    "storage": "Keep zip pouch sealed in a cool, dry area.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "apple",
      "dehydrated-apple",
      "dried-fruits",
      "fiber",
      "pectin"
    ]
  },
  {
    "id": "156",
    "slug": "dehydrated-coconut-chips",
    "dbId": 156,
    "name": "Dehydrated Coconut Chips",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 495,
    "compareAtPrice": 495,
    "mrp": 495,
    "rating": 4.8,
    "reviewCount": 36,
    "image": "/products/dehydrated-coconut-chips.jpg",
    "images": [
      "/products/dehydrated-coconut-chips.jpg",
      "/products/dehydrated-coconut-chips-100g.jpg",
      "/products/coconut-chips-pouch.jpg"
    ],
    "description": "Gently dehydrated whole coconut flakes rich in medium-chain triglycerides (MCTs) and dietary fiber. A keto-friendly, crunchy whole-food snack that provides sustained cellular energy, aids digestion, and supports everyday vitality.",
    "shortDescription": "Crunchy dehydrated coconut flakes rich in clean MCT healthy fats in a Standup Ziplock Pouch.",
    "badges": [
      "new",
      "organic",
      "keto"
    ],
    "stock": 90,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Pure Dehydrated Coconut Meat Flakes"
    ],
    "benefits": [
      "Natural energy boost powered by clean medium-chain triglycerides (MCTs)",
      "Heart healthy natural fats supporting cardiovascular wellness",
      "High in insoluble dietary fiber that aids gut digestion",
      "Supports natural immune system vitality",
      "Rich in healthy plant fats with zero added sugar, preservatives, or palm oil"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "560 kcal / 100g"
      },
      {
        "label": "MCT Healthy Fats",
        "value": "48g"
      },
      {
        "label": "Dietary Fiber",
        "value": "14g"
      },
      {
        "label": "Protein",
        "value": "6.5g"
      }
    ],
    "usage": "Munch directly as a keto snack, toss on smoothie bowls, or mix into homemade trail mix.",
    "storage": "Airtight dry storage away from direct sunlight.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "coconut-chips",
      "mct",
      "keto-snack",
      "dried-fruits",
      "healthy-fats"
    ]
  },
  {
    "id": "22",
    "slug": "dehydrated-papaya",
    "dbId": 22,
    "name": "Dehydrated Papaya",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 395,
    "compareAtPrice": 395,
    "mrp": 395,
    "rating": 4.9,
    "reviewCount": 54,
    "image": "/products/nm-papaya-flat.jpeg",
    "images": [
      "/products/nm-papaya-flat.jpeg",
      "/products/papaya-2.jpg"
    ],
    "description": "Chewy, naturally sweet papaya spears gently dehydrated below 42°C to preserve live digestive enzymes (papain), vitamin C, and fiber. 0 additives, 0 preservatives, and no artificial colors.",
    "shortDescription": "Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking in an 80g Standup Ziplock Pouch.",
    "badges": [
      "bestseller"
    ],
    "stock": 115,
    "weight": "80 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Natural Dehydrated Papaya Slices"
    ],
    "benefits": [
      "Contains active Papain enzyme for smooth protein breakdown",
      "High in Vitamin C and Carotenoids to bolster immunity",
      "Satisfies sugar cravings naturally with zero artificial sugar",
      "Rich in gut-friendly dietary fiber"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "280 kcal / 100g"
      },
      {
        "label": "Vitamin C",
        "value": "140% DV"
      },
      {
        "label": "Dietary Fiber",
        "value": "6g"
      },
      {
        "label": "Papain",
        "value": "Bioactive"
      }
    ],
    "usage": "Snack straight from the pouch, toss over morning cereals, or chop into trail mixes.",
    "storage": "Seal zip-lock tightly after opening.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "papaya",
      "dehydrated-papaya",
      "dried-fruits",
      "digestive-health",
      "sugar-free"
    ]
  },
  {
    "id": "4",
    "slug": "dried-blueberries",
    "dbId": 4,
    "name": "Dried Blueberries",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 650,
    "compareAtPrice": 650,
    "mrp": 650,
    "rating": 5,
    "reviewCount": 78,
    "image": "/products/nm-blueberry-jar.jpeg",
    "images": [
      "/products/nm-blueberry-jar.jpeg",
      "/products/nm-blueberry-purple.jpeg",
      "/products/nm-blueberry-shoot.jpeg",
      "/products/blueberries-brain-power.jpg",
      "/products/blueberries.jpg",
      "/products/blueberries-2.jpg"
    ],
    "description": "Whole wild alpine berries harvested at high Himalayan altitudes. Naturally rich in dark-violet Anthocyanins to support screen-weary eyes, promote sharp mental focus, and deliver powerful antioxidant protection.",
    "shortDescription": "Wild alpine anthocyanin berries for brain focus, memory & screen-fatigue eye defense in a Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 80,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Wild Himalayan Dried Blueberries (Pure Whole Fruit)"
    ],
    "benefits": [
      "Dense Anthocyanins support mental clarity, memory, and cognitive sharpness",
      "Nourishes eye vitality and eases digital screen strain naturally",
      "One of nature's highest ORAC antioxidant-rated wild mountain berries",
      "Pure alpine harvest full of deep natural berry goodness"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "290 kcal / 100g"
      },
      {
        "label": "Anthocyanins",
        "value": "High Potency"
      },
      {
        "label": "Dietary Fiber",
        "value": "7.8g"
      },
      {
        "label": "Vitamin K",
        "value": "35% DV"
      }
    ],
    "usage": "Eat 1 handful daily, blend into morning smoothies, or layer into overnight chia seed pudding.",
    "storage": "Store in airtight glass jar in a cool, dark cabinet.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "blueberries",
      "dried-blueberries",
      "brain-food",
      "antioxidants",
      "eye-health"
    ]
  },
  {
    "id": "155",
    "slug": "dried-cranberries",
    "dbId": 155,
    "name": "Dried Cranberries",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 415,
    "compareAtPrice": 415,
    "mrp": 415,
    "rating": 4.8,
    "reviewCount": 49,
    "image": "/products/nm-cranberry-jar.jpeg",
    "images": [
      "/products/nm-cranberry-jar.jpeg",
      "/products/cranberries-glowing-jar.jpg",
      "/products/cranberries-infographic.jpg",
      "/products/cranberries-prevent-uti.jpg",
      "/products/cranberries-2.jpg"
    ],
    "description": "Plump, ruby-red whole dried cranberries bursting with natural tart-sweet flavor and rich in Type-A Proanthocyanidins (PACs). Revered for supporting daily urinary tract vitality, active antioxidant defense, and whole-body wellness.",
    "shortDescription": "Antioxidant-dense whole dried cranberries for urinary tract and cellular wellness in a Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 95,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Premium Whole Dried Ruby Cranberries (Pure Fruit Goodness)"
    ],
    "benefits": [
      "Rich in Type-A PACs that promote natural urinary tract balance and comfort",
      "Packed with potent flavonoids and natural antioxidants for radiant wellness",
      "High in Vitamin C, Vitamin E, and protective dietary fiber",
      "Delicious natural sweet-tart flavor, perfect for smoothies, bowls, and healthy snacking"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "308 kcal / 100g"
      },
      {
        "label": "Proanthocyanidins",
        "value": "High"
      },
      {
        "label": "Dietary Fiber",
        "value": "5.3g"
      },
      {
        "label": "Vitamin C",
        "value": "45% DV"
      }
    ],
    "usage": "Mix into salads, oatmeal, baking recipes, or enjoy straight as an afternoon immunity snack.",
    "storage": "Keep sealed in its glass jar in a dry place.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "cranberries",
      "dried-cranberries",
      "urinary-health",
      "antioxidants",
      "dried-fruits"
    ]
  },
  {
    "id": "6",
    "slug": "dates-powder",
    "dbId": 6,
    "name": "Dates Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 400,
    "compareAtPrice": 400,
    "mrp": 400,
    "rating": 4.9,
    "reviewCount": 84,
    "image": "/products/nm-dates-jar.jpeg",
    "images": [
      "/products/nm-dates-jar.jpeg",
      "/products/dates-powder-jar-2k.jpg",
      "/products/dates-powder-health-poster.jpg",
      "/products/dates-powder-product-shot.jpg",
      "/products/dates-powder-100g.jpg"
    ],
    "description": "100% pure dehydrated date powder made by slowly drying and micro-grinding whole premium dates. The healthiest, unrefined natural sweetener alternative to white table sugar for children, toddlers, and fitness enthusiasts. Loaded with natural potassium, magnesium, iron, and fiber without spiking blood sugar aggressively.",
    "shortDescription": "100% unrefined natural sweetener made from whole dehydrated dates — 0% white sugar in a Glass Jar.",
    "badges": [
      "bestseller",
      "natural-sweetener"
    ],
    "stock": 150,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Dehydrated Whole Dates (0% Refined Sugar, 0% Preservatives)"
    ],
    "benefits": [
      "1:1 Natural replacement for refined white sugar in recipes",
      "Natural source of iron (2.5mg/100g) to combat fatigue and anemia",
      "Rich in potassium and magnesium for muscle & nerve health",
      "Pediatrician recommended natural sweetener for babies 8m+",
      "Zero preservatives, 100% vegan and unbleached"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "315 kcal / 100g"
      },
      {
        "label": "Natural Sugars",
        "value": "66g"
      },
      {
        "label": "Dietary Fiber",
        "value": "8g"
      },
      {
        "label": "Potassium",
        "value": "650mg"
      },
      {
        "label": "Iron",
        "value": "2.5mg"
      }
    ],
    "usage": "Use 1:1 in place of white sugar in tea, milk, infant porridge, kheer, cakes, cookies, and smoothie bowls.",
    "storage": "Keep in an airtight jar in a cool, dry location.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "dates",
      "dates-powder",
      "natural-sweetener",
      "sugar-free",
      "baby-food",
      "powders"
    ]
  },
  {
    "id": "5",
    "slug": "beetroot-powder",
    "dbId": 5,
    "name": "Beetroot Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 430,
    "compareAtPrice": 430,
    "mrp": 430,
    "rating": 4.9,
    "reviewCount": 62,
    "image": "/products/nm-beetroot-jar.jpeg",
    "images": [
      "/products/nm-beetroot-jar.jpeg",
      "/products/nm-beetroot-ad1.jpeg",
      "/products/nm-beetroot-ad2.jpeg",
      "/products/beetroot-glass-jar.jpg",
      "/products/beetroot-poster-2k.jpg",
      "/products/beetroot-vital-blood.jpg",
      "/products/beetroot-powder-100g.jpg"
    ],
    "description": "Cold-dehydrated and finely milled from pesticide-free Nepali red beetroots. Naturally rich in dietary nitrates, betalains, and folate that convert into nitric oxide in the bloodstream to boost oxygen delivery, lower blood pressure, and enhance endurance for athletes.",
    "shortDescription": "Natural dietary nitrate booster for glowing skin, blood stamina & cardiac health in a Glass Jar.",
    "badges": [
      "organic",
      "bestseller"
    ],
    "stock": 120,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Dehydrated Red Beetroots (Beta vulgaris)"
    ],
    "benefits": [
      "Boosts nitric oxide production for athletic stamina and vascular pump",
      "Supports healthy blood pressure and cardiovascular flow",
      "Natural food colorant for baking, rotis, and baby pancakes",
      "Promotes liver detoxification and glowing skin complexion"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "310 kcal / 100g"
      },
      {
        "label": "Dietary Nitrates",
        "value": "High Natural"
      },
      {
        "label": "Protein",
        "value": "11g"
      },
      {
        "label": "Folate",
        "value": "80% DV"
      },
      {
        "label": "Potassium",
        "value": "900mg"
      }
    ],
    "usage": "Mix 1 teaspoon into pre-workout drinks, yogurt, fresh citrus juice, or knead into dough for vibrant pink rotis.",
    "storage": "Store sealed in a dry pantry; use dry spoons only.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "beetroot",
      "beetroot-powder",
      "pre-workout",
      "nitric-oxide",
      "stamina",
      "powders"
    ]
  },
  {
    "id": "14",
    "slug": "himalayan-pink-salt",
    "dbId": 14,
    "name": "Himalayan Pink Salt",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 250,
    "compareAtPrice": 250,
    "mrp": 250,
    "rating": 4.8,
    "reviewCount": 46,
    "image": "/products/nm-pink-salt-jar.jpeg",
    "images": [
      "/products/nm-pink-salt-jar.jpeg",
      "/products/client-authentic-label-1.jpg",
      "/products/pink-salt-crystals.jpg",
      "/products/pink-salt-moss.jpg"
    ],
    "description": "Unrefined ancient Himalayan pink rock salt crystallized over 250 million years ago. Packed with 84+ bioavailable ionic trace minerals including magnesium, calcium, and potassium with zero microplastics, chemical bleaches, or anti-caking agents.",
    "shortDescription": "Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a 200g Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 200,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Himalayan Pink Rock Salt Crystals"
    ],
    "benefits": [
      "Contains 84+ essential trace minerals for cellular electrolyte balance",
      "Free from industrial bleaching and synthetic anti-caking agents",
      "Smooth, delicate mineral flavor enhances culinary dishes",
      "Supports healthy hydration when added to morning warm water"
    ],
    "nutrition": [
      {
        "label": "Sodium Chloride",
        "value": "98%"
      },
      {
        "label": "Trace Minerals",
        "value": "84+ Minerals"
      },
      {
        "label": "Iron & Magnesium",
        "value": "Naturally Present"
      },
      {
        "label": "Chemical Additives",
        "value": "0%"
      }
    ],
    "usage": "Use as a daily seasoning for cooking, salads, detox electrolyte drinks, or bath soaks.",
    "storage": "Store in a sealed glass jar in a dry location.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "pink-salt",
      "rock-salt",
      "himalayan-salt",
      "electrolytes",
      "minerals",
      "salts-spices"
    ]
  },
  {
    "id": "15",
    "slug": "pure-himalayan-black-salt-bire-noon",
    "dbId": 15,
    "name": "Himalayan Black Salt (Bire Noon)",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 220,
    "compareAtPrice": 220,
    "mrp": 220,
    "rating": 4.9,
    "reviewCount": 51,
    "image": "/products/himalayan-black-salt-digestive.jpg",
    "images": [
      "/products/himalayan-black-salt-digestive.jpg",
      "/products/client-authentic-label-2.jpg",
      "/products/black-salt.jpg"
    ],
    "description": "Authentic volcanic mineral-dense Himalayan Black Salt (Bire Noon / Kala Namak). Mined from ancient pristine salt veins, it is revered in Ayurvedic medicine for kindling digestive fire (Agni), relieving bloating, indigestion, and heartburn.",
    "shortDescription": "Volcanic sulfur-rich Himalayan black salt for Ayurvedic digestion and gut wellness in a 200g Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 180,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Himalayan Black Salt (Kala Namak / Bire Noon) with active sulfur compounds and iron minerals"
    ],
    "benefits": [
      "Stimulates digestive fire (Agni) and eases gastric discomfort",
      "Naturally lower sodium profile than industrial table salt",
      "Packed with active sulfur compounds and bioavailable iron",
      "Essential for authentic chaats, fruit salads, and Ayurvedic chaas"
    ],
    "nutrition": [
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
    "usage": "Pinch into morning warm water with lemon, fresh fruit salads, buttermilk chaas, or homemade raitas.",
    "storage": "Store in an airtight glass jar away from humidity.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "black-salt",
      "bire-noon",
      "kala-namak",
      "digestion",
      "ayurveda",
      "mineral-salt",
      "salts-spices"
    ]
  },
  {
    "id": "7",
    "slug": "chia-seeds",
    "dbId": 7,
    "name": "Organic Chia Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 495,
    "compareAtPrice": 495,
    "mrp": 495,
    "rating": 4.9,
    "reviewCount": 65,
    "image": "/products/nm-chia-jar.jpeg",
    "images": [
      "/products/nm-chia-jar.jpeg",
      "/products/nm-chia-ad.jpeg",
      "/products/nm-chia-ad2.jpeg",
      "/products/nm-chia-display.jpeg",
      "/products/nm-chia-studio.jpeg",
      "/images/posters/chia-power.jpg",
      "/products/chia-seeds.jpg"
    ],
    "description": "Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein. Hydrophilic seeds that expand up to 10x in liquids to support steady hydration, weight balance, and gut motility.",
    "shortDescription": "Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein in a 300g Plastic Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 110,
    "weight": "300 GM",
    "packing": "Plastic Jar",
    "ingredients": [
      "100% Pure Organic Black Chia Seeds (Salvia hispanica)"
    ],
    "benefits": [
      "Exceptional Plant Omega-3 (ALA) for cardiovascular and brain health",
      "Dense soluble mucilage fiber keeps gut digestion smooth and regular",
      "High calcium and magnesium for strong bones and teeth",
      "Provides sustained satiety and hydration for active lifestyles"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "486 kcal / 100g"
      },
      {
        "label": "Omega-3 ALA",
        "value": "17.8g / 100g"
      },
      {
        "label": "Dietary Fiber",
        "value": "34.4g"
      },
      {
        "label": "Protein",
        "value": "16.5g"
      },
      {
        "label": "Calcium",
        "value": "631mg"
      }
    ],
    "usage": "Soak 1 tbsp in water, milk, or fresh juice for 15 minutes. Add to puddings, smoothies, yogurt, or oatmeal.",
    "storage": "Store sealed in a cool, dry place away from heat.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "chia-seeds",
      "seeds",
      "omega-3",
      "weight-management",
      "fiber",
      "superfood"
    ]
  },
  {
    "id": "8",
    "slug": "pumpkin-seeds",
    "dbId": 8,
    "name": "Raw Pumpkin Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 520,
    "compareAtPrice": 520,
    "mrp": 520,
    "rating": 4.9,
    "reviewCount": 57,
    "image": "/images/posters/pure-pumpkin-seeds.jpg",
    "images": [
      "/images/posters/pure-pumpkin-seeds.jpg",
      "/products/pumpkin-seeds.jpg",
      "/products/pumpkin-seeds-product-shot.jpg",
      "/products/pumpkin-seeds-2.jpg"
    ],
    "description": "Raw AAA-grade dark-green pumpkin seed kernels (pepitas). One of the richest dietary sources of natural bioavailable Zinc, Magnesium, Tryptophan, and antioxidants for deep sleep, prostate health, and immune defense.",
    "shortDescription": "Zinc, magnesium, and tryptophan rich raw pumpkin seeds for prostate wellness, deep sleep, and hair vitality in a 300g Plastic Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 105,
    "weight": "300 GM",
    "packing": "Plastic Jar",
    "ingredients": [
      "100% Pure Raw Green Pumpkin Seed Kernels (Pepitas)"
    ],
    "benefits": [
      "High natural Zinc supports testosterone, prostate, and immune vitality",
      "Rich in Magnesium to soothe nerves, reduce muscle cramps, and promote deep sleep",
      "Natural source of L-Tryptophan for serotonin and melatonin synthesis",
      "Crunchy, nutrient-dense snack with zero added oils or sodium"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "559 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "30g"
      },
      {
        "label": "Zinc",
        "value": "7.8mg (71% DV)"
      },
      {
        "label": "Magnesium",
        "value": "592mg (148% DV)"
      },
      {
        "label": "Healthy Fats",
        "value": "49g"
      }
    ],
    "usage": "Eat 1–2 tablespoons raw daily, toss onto green salads, roast gently with pink salt, or blend into seed butters.",
    "storage": "Keep container tightly sealed in a cool, dry place.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "pumpkin-seeds",
      "seeds",
      "zinc",
      "magnesium",
      "sleep",
      "immunity"
    ]
  },
  {
    "id": "161",
    "slug": "premium-cashewnuts",
    "dbId": 161,
    "name": "Premium Cashew Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 53,
    "image": "/products/nm-cashew-jar1.jpeg",
    "images": [
      "/products/nm-cashew-jar1.jpeg",
      "/products/nm-cashew-jar2.jpeg",
      "/products/authentic-cashewnuts-roasted.jpg",
      "/products/cashewnuts-roasted.jpg"
    ],
    "description": "Handpicked whole jumbo W240 grade cashew nuts, delightfully sweet, buttery, and crunch-packed. Rich in copper, magnesium, plant protein, and heart-healthy oleic acid for bone strength, energy metabolism, and cardiac wellness.",
    "shortDescription": "Jumbo whole grade cashewnuts with a rich buttery crunch and heart-healthy fats in a 200g Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 100,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Whole Jumbo Cashew Nuts (Grade W240)"
    ],
    "benefits": [
      "Rich in Copper & Magnesium for strong bones and connective tissue",
      "High in plant-based protein and heart-healthy monounsaturated fats",
      "Naturally creamy texture ideal for plant-based korma, gravies, and desserts",
      "Hand-selected for consistent jumbo size and sweetness"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "553 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "18.2g"
      },
      {
        "label": "Healthy Fats",
        "value": "43.8g"
      },
      {
        "label": "Magnesium",
        "value": "292mg"
      },
      {
        "label": "Copper",
        "value": "2.2mg (244% DV)"
      }
    ],
    "usage": "Snack raw, blend into rich creamy gravies, or chop over festive kheer and halwa.",
    "storage": "Store in an airtight glass jar away from moisture.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "cashewnuts",
      "cashew",
      "nuts",
      "healthy-fats",
      "protein",
      "kaju"
    ]
  },
  {
    "id": "11",
    "slug": "roasted-cashewnuts",
    "dbId": 11,
    "name": "Roasted Himalayan Cashew Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.8,
    "reviewCount": 39,
    "image": "/products/nm-cashew-jar1.jpeg",
    "images": [
      "/products/nm-cashew-jar1.jpeg",
      "/products/nm-cashew-jar2.jpeg",
      "/products/authentic-cashewnuts-roasted.jpg",
      "/products/cashewnuts-roasted.jpg"
    ],
    "description": "Artisan slow-roasted golden cashew nuts roasted without added oils or synthetic flavor enhancers. Delicate toasty aroma with an irresistible crisp snap, delivering pure wholesome nut satisfaction.",
    "shortDescription": "Dry-roasted crunchy cashews packed with minerals and natural savory flavor in a 150g Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 85,
    "weight": "150 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Slow-Roasted Whole Cashew Nuts (Oil-Free)"
    ],
    "benefits": [
      "Dry-roasted without refined palm oil or trans fats",
      "Delivers an intensely rich, crunchy nutty flavor profile",
      "Dense in essential minerals to power afternoon productivity",
      "Clean premium snack for guests, parties, and tea time"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "574 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "17.5g"
      },
      {
        "label": "Healthy Fats",
        "value": "46.4g"
      },
      {
        "label": "Iron",
        "value": "6.7mg"
      }
    ],
    "usage": "Enjoy directly from the jar during tea time or as a nutritious evening snack.",
    "storage": "Keep glass jar firmly closed to retain crispness.",
    "isFeatured": false,
    "isBestSeller": true,
    "tags": [
      "roasted-cashews",
      "roasted-kaju",
      "nuts",
      "crispy-snack",
      "oil-free"
    ]
  },
  {
    "id": "9",
    "slug": "roasted-almonds",
    "dbId": 9,
    "name": "Roasted Himalayan Almonds",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 66,
    "image": "/products/nm-almond-jar.jpeg",
    "images": [
      "/products/nm-almond-jar.jpeg",
      "/products/authentic-almonds.jpg",
      "/products/almonds.jpg",
      "/products/almonds-2.jpg"
    ],
    "description": "Crispy slow-roasted mountain almonds sealed in a glass jar for maximum crunch and flavor. Exceptionally rich in Vitamin E, plant protein, dietary fiber, and heart-protective monounsaturated fatty acids.",
    "shortDescription": "Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 200g Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 120,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Slow-Roasted Himalayan Almonds (Oil-Free)"
    ],
    "benefits": [
      "Rich in natural Vitamin E (alpha-tocopherol) for skin hydration and anti-aging",
      "Plant protein and fiber provide sustained focus and appetite control",
      "Supports healthy cholesterol levels and cardiovascular resilience",
      "Slow-roasted to golden perfection with zero added oils"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "579 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "21.2g"
      },
      {
        "label": "Vitamin E",
        "value": "25.6mg (171% DV)"
      },
      {
        "label": "Dietary Fiber",
        "value": "12.5g"
      },
      {
        "label": "Monounsaturated Fats",
        "value": "31.5g"
      }
    ],
    "usage": "Enjoy a handful as a crunchy mid-morning snack, chop over oatmeal, or pair with fresh fruit.",
    "storage": "Keep lid tightly closed to maintain crisp roasted texture.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "roasted-almonds",
      "almonds",
      "badam",
      "nuts",
      "vitamin-e",
      "protein"
    ]
  },
  {
    "id": "10",
    "slug": "raw-himalayan-almonds",
    "dbId": 10,
    "name": "Raw Himalayan Almonds",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 59,
    "image": "/products/nm-almond-jar.jpeg",
    "images": [
      "/products/nm-almond-jar.jpeg",
      "/products/authentic-almonds.jpg",
      "/products/almonds.jpg"
    ],
    "description": "Unpasteurized, premium raw almonds harvested from pristine mountain orchards. Ideal for soaking overnight (badam pani) to activate live digestive enzymes, making fresh almond milk, and fueling daily cognitive memory.",
    "shortDescription": "Raw unpasteurized mountain almonds for morning soaking and brain memory fuel in a 200g Glass Jar.",
    "badges": [
      "organic",
      "popular"
    ],
    "stock": 130,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Raw Himalayan Whole Almonds"
    ],
    "benefits": [
      "Unpasteurized raw state preserves vital enzymes and nutrient cofactors",
      "Traditional Ayurvedic morning brain tonic when soaked and peeled",
      "High in Riboflavin and L-Carnitine for cognitive neural vitality",
      "Zero fumigation or chemical bleaching treatments"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "576 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "21.1g"
      },
      {
        "label": "Vitamin E",
        "value": "26mg"
      },
      {
        "label": "Magnesium",
        "value": "270mg"
      },
      {
        "label": "Fiber",
        "value": "12.2g"
      }
    ],
    "usage": "Soak 6–8 almonds overnight in water, peel in the morning, and consume before breakfast.",
    "storage": "Keep sealed in a cool, dark cupboard.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "raw-almonds",
      "almonds",
      "badam",
      "nuts",
      "brain-fuel",
      "superfood"
    ]
  },
  {
    "id": "162",
    "slug": "premium-pistachios",
    "dbId": 162,
    "name": "Premium Roasted Pistachios",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 820,
    "compareAtPrice": 820,
    "mrp": 820,
    "rating": 4.9,
    "reviewCount": 44,
    "image": "/products/pistachios.jpg",
    "images": [
      "/products/pistachios.jpg"
    ],
    "description": "Vibrant green naturally opened premium pistachios packed in a glass jar. Rich in lutein, zeaxanthin, vitamin B6, and potassium to support eye protection, blood sugar balance, and cardiovascular health.",
    "shortDescription": "Lightly roasted mountain pistachios rich in lutein, zeaxanthin, and plant protein in a 200g Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 80,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Premium Naturally Opened Whole Pistachios"
    ],
    "benefits": [
      "Highest concentration of Lutein & Zeaxanthin among nuts for macular eye defense",
      "Packed with Vitamin B6 to support energy metabolism and neurotransmitter health",
      "Complete amino acid profile for clean plant protein fueling",
      "Delightfully nutty flavor with natural vibrant green kernels"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "562 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "20g"
      },
      {
        "label": "Vitamin B6",
        "value": "1.7mg (131% DV)"
      },
      {
        "label": "Potassium",
        "value": "1025mg"
      },
      {
        "label": "Dietary Fiber",
        "value": "10.6g"
      }
    ],
    "usage": "Snack directly, toss onto Mediterranean salads, or garnish festive desserts and kheer.",
    "storage": "Store in an airtight glass container in a cool spot.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "pistachios",
      "pista",
      "nuts",
      "eye-health",
      "vitamin-b6",
      "healthy-snack"
    ]
  },
  {
    "id": "12",
    "slug": "superfood-trail-mix",
    "dbId": 12,
    "name": "Superfood Trail Mix (Nuts & Seeds)",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 790,
    "compareAtPrice": 790,
    "mrp": 790,
    "rating": 5,
    "reviewCount": 92,
    "image": "/products/superfood-mix.jpg",
    "images": [
      "/products/superfood-mix.jpg",
      "/products/superfood-mix-2.jpg"
    ],
    "description": "The ultimate energy blend of premium whole cashews, mountain almonds, raw pumpkin seeds, black chia seeds, dried cranberries, and wild blueberries. Crafted for high-altitude trekking endurance, gym workouts, and clean afternoon focus.",
    "shortDescription": "Energy-dense blend of whole almonds, cashews, pumpkin seeds, berries, and chia in a 200g Glass Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 140,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "Himalayan Almonds",
      "Jumbo Cashews",
      "Raw Pumpkin Seeds",
      "Chia Seeds",
      "Dried Blueberries",
      "Whole Dried Cranberries"
    ],
    "benefits": [
      "Perfect synergy of plant protein, healthy fats, fiber, and antioxidant berries",
      "Sustained physical stamina for trekking, sports, and busy workdays",
      "Zero added sugars, artificial flavorings, or inflammatory vegetable oils",
      "Loved by fitness enthusiasts, hikers, and growing children"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "495 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "16.8g"
      },
      {
        "label": "Healthy Fats",
        "value": "34.2g"
      },
      {
        "label": "Dietary Fiber",
        "value": "9.4g"
      },
      {
        "label": "Antioxidants",
        "value": "High ORAC"
      }
    ],
    "usage": "Eat 1–2 handfuls whenever energy drops, take on mountain treks, or top over breakfast yogurt bowls.",
    "storage": "Keep container sealed in a cool, dry place.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "trail-mix",
      "mix-dry-nuts",
      "nuts",
      "superfood-mix",
      "energy-snack",
      "trekking"
    ]
  },
  {
    "id": "159",
    "slug": "macadamia-nuts",
    "dbId": 159,
    "name": "Macadamia Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 1100,
    "compareAtPrice": 1100,
    "mrp": 1100,
    "rating": 4.9,
    "reviewCount": 31,
    "image": "/products/macadamia.jpg",
    "images": [
      "/products/macadamia.jpg"
    ],
    "description": "Velvety, rich whole macadamia kernels loaded with monounsaturated palmitoleic acid (Omega-7) and flavonoids for cellular anti-aging, brain health, and glowing skin. The queen of gourmet nuts with a melt-in-the-mouth texture.",
    "shortDescription": "Silky buttery macadamia nuts packed with monounsaturated palmitoleic acid in a 200g Glass Jar.",
    "badges": [
      "new",
      "organic"
    ],
    "stock": 65,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Raw Gourmet Macadamia Nut Kernels"
    ],
    "benefits": [
      "Rich in rare Palmitoleic Acid (Omega-7) for collagen synthesis and skin elasticity",
      "Highest healthy monounsaturated fat content of any nut for cardiac wellness",
      "Natural brain food with low carbohydrate profile, perfect for keto diets",
      "Luxurious buttery flavor without any added oils or salt"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "718 kcal / 100g"
      },
      {
        "label": "Healthy Monounsaturated Fats",
        "value": "75.8g"
      },
      {
        "label": "Omega-7 Fatty Acids",
        "value": "High"
      },
      {
        "label": "Protein",
        "value": "7.9g"
      },
      {
        "label": "Dietary Fiber",
        "value": "8.6g"
      }
    ],
    "usage": "Savor raw as a gourmet delicacy, chop into artisanal salads, or blend into velvety plant creams.",
    "storage": "Store sealed in glass jar in a cool pantry or refrigerator.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "macadamia",
      "macadamia-nuts",
      "omega-7",
      "gourmet-nuts",
      "keto",
      "healthy-fats"
    ]
  },
  {
    "id": "154",
    "slug": "virgin-coconut-oil-500ml",
    "dbId": 154,
    "name": "Cold-Pressed Extra Virgin Coconut Oil (500ml)",
    "category": "Oils",
    "categorySlug": "oils",
    "price": 1750,
    "compareAtPrice": 1750,
    "mrp": 1750,
    "rating": 5,
    "reviewCount": 88,
    "image": "/products/coconut-oil.jpg",
    "images": [
      "/products/coconut-oil.jpg",
      "/products/coconut-oil-product.jpg"
    ],
    "description": "Centrifuged and cold-pressed from fresh organic coconut milk without heat, bleach, or chemical deodorizers. Rich in 50%+ Lauric Acid for immune defense, clean cooking, baby body massage, and lustrous hair revitalization.",
    "shortDescription": "Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 500ml Glass Bottle.",
    "badges": [
      "bestseller",
      "cold-pressed"
    ],
    "stock": 95,
    "weight": "500 ML",
    "packing": "Glass Bottle",
    "ingredients": [
      "100% Pure Cold-Pressed Extra Virgin Coconut Oil (Zero Heat, Unrefined)"
    ],
    "benefits": [
      "Contains 50%+ Lauric Acid (monolaurin) to bolster antiviral & antibacterial defenses",
      "Medium-Chain Triglycerides (MCTs) burn cleanly for instant cellular energy",
      "Gentle, pure whole food moisturizer for baby massage and dry skin",
      "Deeply conditions hair follicles and prevents protein loss"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "862 kcal / 100ml"
      },
      {
        "label": "Lauric Acid (C12)",
        "value": "51.5%"
      },
      {
        "label": "Caprylic Acid (C8)",
        "value": "8.2%"
      },
      {
        "label": "Capric Acid (C10)",
        "value": "6.4%"
      },
      {
        "label": "Trans Fats & Cholesterol",
        "value": "0g"
      }
    ],
    "usage": "Use 1–2 tbsp for cooking, bulletproof morning coffee, daily oil pulling, hair conditioning, or baby skin massage.",
    "storage": "Store at room temperature. Solidifies below 24°C into pure white velvet.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "coconut-oil",
      "virgin-coconut-oil",
      "cold-pressed",
      "lauric-acid",
      "mct",
      "skincare",
      "oils"
    ]
  },
  {
    "id": "153",
    "slug": "virgin-coconut-oil-180ml",
    "dbId": 153,
    "name": "Cold-Pressed Extra Virgin Coconut Oil (200ml)",
    "category": "Oils",
    "categorySlug": "oils",
    "price": 650,
    "compareAtPrice": 650,
    "mrp": 650,
    "rating": 4.9,
    "reviewCount": 52,
    "image": "/products/coconut-oil-product.jpg",
    "images": [
      "/products/coconut-oil-product.jpg",
      "/products/coconut-oil.jpg"
    ],
    "description": "Compact handy glass jar of 100% raw cold-pressed extra virgin coconut oil. Perfectly sized for daily facial skincare, Ayurvedic morning oil pulling, desk moisturizer, travel, and infant skin nourishing.",
    "shortDescription": "Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 200ml Glass Bottle.",
    "badges": [
      "cold-pressed"
    ],
    "stock": 110,
    "weight": "200 ML",
    "packing": "Glass Bottle",
    "ingredients": [
      "100% Pure Cold-Pressed Extra Virgin Coconut Oil (Unrefined)"
    ],
    "benefits": [
      "Compact glass jar ideal for bathroom vanity, handbag, or travel",
      "Natural chemical-free facial moisturizer and eye makeup remover",
      "Ideal for morning Ayurvedic Gandusha (oil pulling) for oral hygiene",
      "Pure unrefined aroma with zero artificial fragrance"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "862 kcal / 100ml"
      },
      {
        "label": "Lauric Acid",
        "value": "50%+"
      },
      {
        "label": "MCT Fats",
        "value": "65%"
      },
      {
        "label": "Chemical Solvents",
        "value": "0%"
      }
    ],
    "usage": "Apply small dab to clean damp skin or hair tips, or swish 1 tbsp in mouth for 5–10 minutes for oil pulling.",
    "storage": "Store sealed at room temperature.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "coconut-oil-180ml",
      "virgin-coconut-oil",
      "cold-pressed",
      "skincare",
      "oil-pulling",
      "oils"
    ]
  },
  {
    "id": "27",
    "slug": "carrot-powder",
    "dbId": 27,
    "name": "Carrot Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 440,
    "compareAtPrice": 440,
    "mrp": 440,
    "rating": 4.8,
    "reviewCount": 38,
    "image": "/products/nm-carrot-jar.jpeg",
    "images": [
      "/products/nm-carrot-jar.jpeg",
      "/products/carrot-benefits-poster.jpg",
      "/products/carrot-powder-eye-health.jpg",
      "/products/carrot-powder-marble.jpg",
      "/products/carrot-powder-100g.jpg"
    ],
    "description": "Sun-dried and gently milled organic carrots harvested from fertile mid-hill farms of Nepal. Packed with beta-carotene (pro-vitamin A), lutein, and dietary fiber to protect eyes, support cell regeneration, and enhance everyday cooking with a mild natural sweetness.",
    "shortDescription": "Fine organic carrot powder rich in beta-carotene for infant feeding and healthy soups in a 100g Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 85,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Dehydrated Organic Carrots (Daucus carota)"
    ],
    "benefits": [
      "Loaded with Beta-Carotene (Pro-Vitamin A) for ocular health and night vision",
      "Easy to hide in kids’ meals for instant veggie nutrient density",
      "Rich in antioxidants that protect cellular vitality and skin radiance",
      "Sweet and gentle on sensitive infant stomachs"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "340 kcal / 100g"
      },
      {
        "label": "Vitamin A (Beta-Carotene)",
        "value": "850% DV"
      },
      {
        "label": "Dietary Fiber",
        "value": "12g"
      },
      {
        "label": "Potassium",
        "value": "1100mg"
      }
    ],
    "usage": "Stir into baby purees, soups, gravies, pancake batter, or morning smoothies.",
    "storage": "Store sealed in a dry pantry away from sunlight.",
    "isFeatured": false,
    "isBestSeller": false,
    "tags": [
      "carrot",
      "carrot-powder",
      "vitamin-a",
      "baby-food",
      "powders",
      "eye-health"
    ]
  },
  {
    "id": "24",
    "slug": "sweet-potato-powder",
    "dbId": 24,
    "name": "Sweet Potato Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 420,
    "compareAtPrice": 420,
    "mrp": 420,
    "rating": 5,
    "reviewCount": 96,
    "image": "/products/nm-sweet-potato-jar.jpeg",
    "images": [
      "/products/nm-sweet-potato-jar.jpeg",
      "/products/sweet-potato-jar-display.jpg",
      "/products/sweet-potato-product-poster.jpg",
      "/products/sweet-potato-creation-process.jpg",
      "/products/sweet-potato-powder-100g.jpg",
      "/products/sweet-potato-powder.jpg"
    ],
    "description": "100% pure organic dehydrated sweet potato powder milled from farm-fresh Nepali sweet potatoes. A nutrient-dense complex carbohydrate powerhouse packed with Vitamin A (beta-carotene), fiber, potassium, and minerals. Perfect for infant weaning porridge, baby cereals, pre-workout energy shakes, pancakes, and healthy baking with pure single-ingredient Himalayan goodness.",
    "shortDescription": "100% natural dehydrated sweet potato powder for baby food, smoothies & healthy baking in a 100g Glass Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 160,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Dehydrated Nepali Sweet Potato (Ipomoea batatas)"
    ],
    "benefits": [
      "Rich in natural Beta-Carotene (Vitamin A) supporting healthy visual and cellular development",
      "Gentle complex carbohydrates for baby weaning porridge (6M+)",
      "Sustained clean glycogen energy for fitness, running, and gym workouts",
      "High in prebiotic dietary fiber for smooth gut digestion",
      "100% pure single-ingredient, chemical-free and gluten-free"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "350 kcal / 100g"
      },
      {
        "label": "Carbohydrates",
        "value": "80g"
      },
      {
        "label": "Dietary Fiber",
        "value": "7.5g"
      },
      {
        "label": "Protein",
        "value": "4.2g"
      },
      {
        "label": "Vitamin A",
        "value": "720% DV"
      },
      {
        "label": "Potassium",
        "value": "950mg"
      }
    ],
    "usage": "Whisk 1–2 tablespoons into warm water, milk, oatmeal, baby porridge, pancake batter, or protein smoothies.",
    "storage": "Store in an airtight glass jar in a cool, dry place away from direct moisture.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "sweet-potato",
      "sweet-potato-powder",
      "baby-food",
      "pre-workout",
      "organic",
      "powders",
      "superfood"
    ]
  },
  {
    "id": "40",
    "slug": "pure-mountain-himalayan-shilajit-resin",
    "dbId": 40,
    "name": "Pure Mountain Shilajit Resin",
    "category": "Ayurveda",
    "categorySlug": "ayurveda",
    "price": 1995,
    "compareAtPrice": 1995,
    "mrp": 1995,
    "rating": 5,
    "reviewCount": 114,
    "image": "/products/nm-shilajit-jar.jpeg",
    "images": [
      "/products/nm-shilajit-jar.jpeg",
      "/products/shilajit.jpg"
    ],
    "description": "Gold-grade 100% pure Himalayan Shilajit resin, sustainably harvested from pristine Himalayan altitudes above 16,000 feet. Purified using traditional Ayurvedic triphala water decoction. Naturally concentrated with >75% fulvic acid and 84+ ionic trace minerals to support cellular mitochondrial energy, stamina, cognitive clarity, and vitality.",
    "shortDescription": "Authentic gold-grade Himalayan Shilajit resin with >75% fulvic acid for peak vitality in a 20g Glass Jar.",
    "badges": [
      "organic",
      "bestseller"
    ],
    "stock": 50,
    "weight": "20 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Purified Himalayan Shilajit Resin (Gold Grade, >75% Fulvic Acid)"
    ],
    "benefits": [
      "Boosts cellular ATP energy and mitochondrial oxygenation",
      "Supports healthy stamina and vitality in men and women",
      "Enhances cognitive memory, focus, and neuroprotective resilience",
      "Contains 84+ bioavailable ionic trace minerals for deep nourishment"
    ],
    "nutrition": [
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
    "usage": "Dissolve a pea-sized portion (300-500mg) in warm water, milk, or green tea once daily in the morning.",
    "storage": "Store in a cool dry place. Keep jar tightly closed to avoid drying out.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "shilajit",
      "ayurveda",
      "fulvic-acid",
      "vitality",
      "energy",
      "rasayana",
      "himalayan"
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string | number): Product | undefined {
  return products.find((p) => String(p.id) === String(id) || String(p.dbId) === String(id));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellerProducts(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export const categories = [
  {
    name: 'Dried Fruits',
    slug: 'dried-fruits',
    description: '100% pure sun-dried fruits with zero added sugar or sulfur dioxide',
    image: '/products/mango-pouch.jpeg',
    count: products.filter((p) => p.categorySlug === 'dried-fruits').length,
  },
  {
    name: 'Organic Powders',
    slug: 'powders',
    description: 'Micro-pulverized 100% organic vegetable & fruit superfood powders',
    image: '/products/sweet-potato-jar.jpeg',
    count: products.filter((p) => p.categorySlug === 'powders').length,
  },
  {
    name: 'Mountain Nuts',
    slug: 'nuts',
    description: 'Premium Himalayan almonds, walnuts, and mountain crunch',
    image: '/products/almond-jar.jpeg',
    count: products.filter((p) => p.categorySlug === 'nuts').length,
  },
  {
    name: 'Seeds & Salts',
    slug: 'seeds',
    description: 'Raw high-altitude superfood seeds and pure Himalayan rock salt',
    image: '/products/pumpkin-seeds.jpg',
    count: products.filter((p) => p.categorySlug === 'seeds').length,
  },
];

function formatProductWeight(val: any, fallbackWeight?: string): string {
  if (fallbackWeight && /[a-zA-Z]/.test(fallbackWeight)) {
    if (!val || /^\d+(\.\d+)?$/.test(String(val).trim())) {
      const num = val ? Math.round(Number(val)) : null;
      const unitMatch = fallbackWeight.match(/[a-zA-Z]+/);
      const unit = unitMatch ? ' ' + unitMatch[0].toUpperCase() : ' GM';
      return num ? `${num}${unit}` : fallbackWeight;
    }
  }
  if (!val) return fallbackWeight || '100 GM';
  const str = String(val).trim();
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${Math.round(Number(str))} GM`;
  }
  return str;
}

export function normalizeProduct(raw: any, fallback?: Product | null): Product {
  if (!raw) return (fallback || undefined) as unknown as Product;
  const slug = raw.slug || fallback?.slug || String(raw.id || '');
  const local = fallback || getProductBySlug(slug) || products.find((p) => String(p.id) === String(raw.id) || String(p.dbId) === String(raw.id));

  const rawCompare = Number(raw.compare_at_price || raw.compareAtPrice || 0);
  const rawPrice = Number(raw.price || 0);
  const localPrice = Number(local?.price || 0);
  const localCompare = Number(local?.compareAtPrice || local?.mrp || 0);

  const price = rawPrice > 0 ? rawPrice : (localPrice > 0 ? localPrice : Number(raw.mrp || local?.mrp || 0));
  const compareAtPrice = rawCompare > 0 ? (rawCompare >= price ? rawCompare : price) : (localCompare >= price ? localCompare : price);
  const mrp = Number(raw.mrp || local?.mrp || compareAtPrice || price);

  return {
    id: String(raw.id || local?.id || slug),
    dbId: typeof raw.id === 'number' ? raw.id : (local?.dbId || parseInt(raw.id, 10) || undefined),
    slug: slug,
    name: raw.name || local?.name || 'NaturesMud Product',
    category: typeof raw.category === 'object' && raw.category !== null ? raw.category.name : (raw.category || local?.category || 'Organic'),
    categorySlug: typeof raw.category === 'object' && raw.category !== null ? raw.category.slug : (raw.categorySlug || local?.categorySlug || 'organic'),
    price: price,
    compareAtPrice: compareAtPrice,
    mrp: mrp,
    rating: Number(raw.rating || local?.rating || 4.9),
    reviewCount: Number(raw.reviewCount || raw.reviews_count || local?.reviewCount || 24),
    image: resolveImageUrl(raw.image || local?.image || '/products/naturesmud-all-products-100g.jpg'),
    images: Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.map((img: any) => resolveImageUrl(typeof img === 'string' ? img : img.url || img.image_url))
      : (local?.images || [resolveImageUrl(raw.image || local?.image || '/products/naturesmud-all-products-100g.jpg')]),
    description: raw.description || local?.description || '',
    shortDescription: raw.shortDescription || raw.short_description || local?.shortDescription || '',
    badges: Array.isArray(raw.badges) ? raw.badges : (local?.badges || []),
    stock: typeof raw.stock === 'number' ? raw.stock : (local?.stock ?? 100),
    weight: formatProductWeight(raw.weight, local?.weight),
    packing: raw.packing || local?.packing || 'Standup Ziplock Pouch',
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : (local?.ingredients || []),
    benefits: Array.isArray(raw.benefits) ? raw.benefits : (local?.benefits || []),
    nutrition: Array.isArray(raw.nutrition) ? raw.nutrition : (local?.nutrition || []),
    usage: raw.usage || local?.usage || '',
    storage: raw.storage || local?.storage || '',
    isFeatured: Boolean(raw.isFeatured ?? raw.is_featured ?? local?.isFeatured),
    isBestSeller: Boolean(raw.isBestSeller ?? raw.is_bestseller ?? local?.isBestSeller),
    tags: Array.isArray(raw.tags) ? raw.tags : (local?.tags || []),
  };
}



