import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/utils';

export const products: Product[] = [
  {
    "id": "1",
    "slug": "dehydrated-mango",
    "dbId": 1,
    "name": "Dehydrated Mango",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 395,
    "compareAtPrice": 395,
    "mrp": 395,
    "rating": 4.9,
    "reviewCount": 68,
    "image": "/products/authentic-dehydrated-mango.jpg",
    "images": [
      "/products/authentic-dehydrated-mango.jpg",
      "/products/dehydrated-mango.jpg",
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
    "image": "/products/authentic-dehydrated-pineapple.jpg",
    "images": [
      "/products/authentic-dehydrated-pineapple.jpg",
      "/products/dehydrated-pineapple.jpg",
      "/products/pineapple.jpg"
    ],
    "description": "Tangy-sweet pineapple slices harvested from sun-drenched terraced hills and slowly dehydrated. Packed with natural bromelain digestive enzyme, vitamin C, and manganese for anti-inflammatory wellness.",
    "shortDescription": "Tangy-sweet dehydrated pineapple rings rich in natural bromelain enzyme.",
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
    "image": "/products/authentic-dehydrated-apple.jpg",
    "images": [
      "/products/authentic-dehydrated-apple.jpg",
      "/products/dehydrated-apple.jpg",
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
    "id": "158",
    "slug": "dehydrated-coconut-chips",
    "dbId": 158,
    "name": "Dehydrated Coconut Chip",
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
      "/products/coconut-oil-product.jpg"
    ],
    "description": "Gently dehydrated whole coconut flakes rich in medium-chain triglycerides (MCTs) and dietary fiber. A keto-friendly, crunchy whole-food snack that provides sustained cellular energy and supports healthy metabolism.",
    "shortDescription": "Crunchy dehydrated coconut flakes rich in clean MCT healthy fats in a Standup Ziplock Pouch.",
    "badges": [
      "new",
      "organic"
    ],
    "stock": 90,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "ingredients": [
      "100% Pure Dehydrated Coconut Meat Flakes"
    ],
    "benefits": [
      "Loaded with MCTs for quick ketone energy and mental focus",
      "High in insoluble fiber for colon wellness and satiety",
      "Keto-friendly and low glycemic whole-food snack",
      "Zero added sugars, artificial flavors, or palm oil"
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
    "image": "/products/papaya.jpg",
    "images": [
      "/products/papaya.jpg",
      "/products/papaya-2.jpg",
      "/products/dehydrated-mango.jpg"
    ],
    "description": "Chewy, naturally sweet papaya spears gently dehydrated below 42°C to preserve live digestive enzymes (papain), vitamin C, and fiber. 0 additives, 0 preservatives, and no artificial colors.",
    "shortDescription": "Enzyme-rich dehydrated sweet papaya slices with 0 additives and 0 preservatives for healthy gut digestion and snacking.",
    "badges": [
      "bestseller"
    ],
    "stock": 115,
    "weight": "100 GM",
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
    "image": "/products/dried-blueberries-100g.jpg",
    "images": [
      "/products/dried-blueberries-100g.jpg",
      "/products/blueberries.jpg",
      "/products/blueberries-2.jpg",
      "/products/blueberries-brain-power.jpg"
    ],
    "description": "Wild alpine berries foraged at 3,200m in pristine Himalayan frontiers. Densely concentrated in dark-violet Anthocyanins to shield eyes against smartphone screen fatigue, enhance memory, and protect against cellular oxidation.",
    "shortDescription": "Wild alpine anthocyanin berries for brain focus, memory & screen-fatigue eye defense in a Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 80,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Wild Himalayan Dried Blueberries (0 Additives, 0 Preservatives)"
    ],
    "benefits": [
      "Dense Anthocyanins cross blood-brain barrier for cognitive sharpness",
      "Eases digital screen eye strain and ocular micro-circulation",
      "One of nature's highest ORAC antioxidant-rated super berries",
      "Pure alpine harvest free from pesticide sprays"
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
    "id": "7",
    "slug": "dried-cranberries",
    "dbId": 7,
    "name": "Dried Cranberry",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 415,
    "compareAtPrice": 415,
    "mrp": 415,
    "rating": 4.8,
    "reviewCount": 49,
    "image": "/products/cranberries.jpg",
    "images": [
      "/products/cranberries.jpg",
      "/products/cranberries-2.jpg",
      "/products/cranberries-glowing-jar.jpg"
    ],
    "description": "Plump, ruby-red whole dried cranberries rich in Type-A Proanthocyanidins (PACs). Clinically recognized for supporting urinary tract health, cardiovascular function, and cellular defense against oxidative stress.",
    "shortDescription": "Antioxidant-dense whole dried cranberries for urinary tract and cellular wellness in a Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 95,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Premium Whole Dried Cranberries (0 Additives, 0 Preservatives)"
    ],
    "benefits": [
      "Rich in Type-A PACs that prevent bacterial adhesion in urinary tract",
      "Boosts cardiovascular endothelial function and blood flow",
      "High in Vitamin C, Vitamin E, and trace minerals",
      "Delicious sweet-tart balance without artificial preservatives"
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
    "price": 350,
    "compareAtPrice": 350,
    "mrp": 350,
    "rating": 4.9,
    "reviewCount": 84,
    "image": "/products/dates-powder-100g.jpg",
    "images": [
      "/products/dates-powder-100g.jpg",
      "/products/dates-powder.jpg",
      "/products/dates-powder-product-shot.jpg"
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
    "image": "/products/beetroot-powder-100g.jpg",
    "images": [
      "/products/beetroot-powder-100g.jpg",
      "/products/beetroot-powder.jpg",
      "/products/beetroot-glass-jar.jpg",
      "/products/beetroot-poster-2k.jpg"
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
    "id": "10",
    "slug": "himalayan-pink-salt",
    "dbId": 10,
    "name": "Pink Salt",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 180,
    "compareAtPrice": 180,
    "mrp": 180,
    "rating": 4.8,
    "reviewCount": 46,
    "image": "/products/pink-salt.jpg",
    "images": [
      "/products/pink-salt.jpg",
      "/products/pink-salt-crystals.jpg",
      "/products/pink-salt-moss.jpg"
    ],
    "description": "Unrefined ancient Himalayan pink rock salt crystallized over 250 million years ago. Packed with 84+ bioavailable ionic trace minerals including magnesium, calcium, and potassium with zero microplastics, chemical bleaches, or anti-caking agents.",
    "shortDescription": "Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 200,
    "weight": "100 GM",
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
    "id": "159",
    "slug": "pure-himalayan-black-salt-bire-noon",
    "dbId": 159,
    "name": "Black Salt",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 150,
    "compareAtPrice": 150,
    "mrp": 150,
    "rating": 4.9,
    "reviewCount": 51,
    "image": "/products/himalayan-black-salt-digestive.jpg",
    "images": [
      "/products/himalayan-black-salt-digestive.jpg",
      "/products/black-salt.jpg"
    ],
    "description": "Authentic volcanic mineral-dense Himalayan Black Salt (Bire Noon / Kala Namak). Mined from ancient pristine salt veins, it is revered in Ayurvedic medicine for kindling digestive fire (Agni), relieving bloating, indigestion, and heartburn.",
    "shortDescription": "Authentic volcanic trace-mineral rock salt with distinctive digestive benefits in a Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 180,
    "weight": "100 GM",
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
    "id": "11",
    "slug": "chia-seeds",
    "dbId": 11,
    "name": "Chia Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 495,
    "compareAtPrice": 495,
    "mrp": 495,
    "rating": 4.9,
    "reviewCount": 65,
    "image": "/products/chia-seeds.jpg",
    "images": [
      "/products/chia-seeds.jpg",
      "/products/superfood-mix.jpg"
    ],
    "description": "Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein. Hydrophilic seeds that expand up to 10x in liquids to support steady hydration, weight balance, and gut motility.",
    "shortDescription": "Omega-3 and soluble fiber powerhouse for weight balance, gut health & endurance in a 300g Plastic Jar.",
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
    "id": "160",
    "slug": "pumpkin-seeds",
    "dbId": 160,
    "name": "Pumpkin Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 650,
    "compareAtPrice": 650,
    "mrp": 650,
    "rating": 4.9,
    "reviewCount": 57,
    "image": "/products/pumpkin-seeds.jpg",
    "images": [
      "/products/pumpkin-seeds.jpg",
      "/products/pumpkin-seeds-2.jpg",
      "/products/pumpkin-seeds-product-shot.jpg"
    ],
    "description": "Raw AAA-grade dark-green pumpkin seed kernels (pepitas). One of the richest dietary sources of natural bioavailable Zinc, Magnesium, Tryptophan, and antioxidants for deep sleep, prostate health, and immune defense.",
    "shortDescription": "Raw zinc and magnesium rich pepitas for immune strength, sleep quality & hormone balance in a 300g Plastic Jar.",
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
    "id": "14",
    "slug": "premium-cashewnuts",
    "dbId": 14,
    "name": "Premium Cashewnut",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 53,
    "image": "/products/cashewnuts.jpg",
    "images": [
      "/products/cashewnuts.jpg",
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
    "id": "161",
    "slug": "roasted-cashewnuts",
    "dbId": 161,
    "name": "Roasted Cashewnut",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.8,
    "reviewCount": 39,
    "image": "/products/authentic-cashewnuts-roasted.jpg",
    "images": [
      "/products/authentic-cashewnuts-roasted.jpg",
      "/products/cashewnuts-roasted.jpg",
      "/products/cashews-roasted.jpg"
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
    "id": "16",
    "slug": "dried-figs",
    "dbId": 16,
    "name": "Dried Figs",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 690,
    "compareAtPrice": 690,
    "mrp": 690,
    "rating": 4.9,
    "reviewCount": 48,
    "image": "/products/figs.jpg",
    "images": [
      "/products/figs.jpg",
      "/products/superfood-mix.jpg"
    ],
    "description": "Naturally sun-ripened whole dried figs (Anjeer) rich in bioavailable calcium, dietary fiber, iron, and potassium. Promotes bone mineral density, healthy hemoglobin levels, and smooth gastrointestinal regularity.",
    "shortDescription": "Sweet chewy sun-dried figs loaded with dietary fiber, iron, and plant calcium in a 200g Glass Jar.",
    "badges": [
      "organic",
      "bestseller"
    ],
    "stock": 90,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Sun-Dried Whole Figs (Anjeer)"
    ],
    "benefits": [
      "High in Plant Calcium for strong bone and joint integrity",
      "Dense dietary fiber relieves constipation and promotes colon wellness",
      "Natural Iron to boost hemoglobin and active stamina",
      "Chewy honey-sweet texture with zero sulfur processing"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "249 kcal / 100g"
      },
      {
        "label": "Calcium",
        "value": "162mg (16% DV)"
      },
      {
        "label": "Dietary Fiber",
        "value": "9.8g"
      },
      {
        "label": "Iron",
        "value": "2.0mg"
      },
      {
        "label": "Potassium",
        "value": "680mg"
      }
    ],
    "usage": "Soak 2 figs in water overnight and consume first thing in the morning for gut detox, or chop into cereals.",
    "storage": "Store sealed in its glass jar in a cool, dry place.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "figs",
      "anjeer",
      "dried-figs",
      "calcium",
      "iron",
      "gut-health",
      "dried-fruits"
    ]
  },
  {
    "id": "17",
    "slug": "roasted-almonds",
    "dbId": 17,
    "name": "Roasted Almond",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 66,
    "image": "/products/almonds-2.jpg",
    "images": [
      "/products/almonds-2.jpg",
      "/products/almonds.jpg"
    ],
    "description": "Crispy slow-roasted mountain almonds sealed in a glass jar for maximum crunch and flavor. Exceptionally rich in Vitamin E, plant protein, dietary fiber, and heart-protective monounsaturated fatty acids.",
    "shortDescription": "Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 100g Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 120,
    "weight": "100 GM",
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
    "id": "2",
    "slug": "raw-himalayan-almonds",
    "dbId": 2,
    "name": "Almond",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "mrp": 750,
    "rating": 4.9,
    "reviewCount": 59,
    "image": "/products/authentic-almonds.jpg",
    "images": [
      "/products/authentic-almonds.jpg",
      "/products/almonds.jpg",
      "/products/almonds-2.jpg"
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
    "id": "19",
    "slug": "premium-pistachios",
    "dbId": 19,
    "name": "Pistachio",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 895,
    "compareAtPrice": 895,
    "mrp": 895,
    "rating": 4.9,
    "reviewCount": 44,
    "image": "/products/pistachios.jpg",
    "images": [
      "/products/pistachios.jpg",
      "/products/superfood-mix.jpg"
    ],
    "description": "Vibrant green naturally opened premium pistachios packed in a glass jar. Rich in lutein, zeaxanthin, vitamin B6, and potassium to support eye protection, blood sugar balance, and cardiovascular health.",
    "shortDescription": "Antioxidant-rich whole pistachios for eye health, cardiac protection & guilt-free snacking in a 150g Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 80,
    "weight": "150 GM",
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
    "id": "20",
    "slug": "superfood-trail-mix",
    "dbId": 20,
    "name": "Mix dry Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 690,
    "compareAtPrice": 690,
    "mrp": 690,
    "rating": 5,
    "reviewCount": 92,
    "image": "/products/superfood-mix.jpg",
    "images": [
      "/products/superfood-mix.jpg",
      "/products/superfood-mix-2.jpg"
    ],
    "description": "The ultimate energy blend of premium whole cashews, mountain almonds, raw pumpkin seeds, black chia seeds, dried cranberries, and wild blueberries. Crafted for high-altitude trekking endurance, gym workouts, and clean afternoon focus.",
    "shortDescription": "Ultimate energy blend of whole mountain nuts, raw seeds & antioxidant berries in a 300g Plastic Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 140,
    "weight": "300 GM",
    "packing": "Plastic Jar",
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
    "id": "21",
    "slug": "macadamia-nuts",
    "dbId": 21,
    "name": "Macademia Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 850,
    "compareAtPrice": 850,
    "mrp": 850,
    "rating": 4.9,
    "reviewCount": 31,
    "image": "/products/macadamia.jpg",
    "images": [
      "/products/macadamia.jpg",
      "/products/superfood-mix-2.jpg"
    ],
    "description": "Velvety, rich whole macadamia kernels loaded with monounsaturated palmitoleic acid (Omega-7) and flavonoids for cellular anti-aging, brain health, and glowing skin. The queen of gourmet nuts with a melt-in-the-mouth texture.",
    "shortDescription": "Buttery gourmet macadamias high in rare Omega-7 fats for brain & skin wellness in a 150g Glass Jar.",
    "badges": [
      "new",
      "organic"
    ],
    "stock": 65,
    "weight": "150 GM",
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
    "id": "162",
    "slug": "virgin-coconut-oil-500ml",
    "dbId": 162,
    "name": "Coconut oil",
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
      "/products/coconut-oil-product.jpg",
      "/products/coconut-oil-dripping.jpg"
    ],
    "description": "Centrifuged and cold-pressed from fresh organic coconut milk without heat, bleach, or chemical deodorizers. Rich in 50%+ Lauric Acid for immune defense, clean cooking, baby body massage, and lustrous hair revitalization.",
    "shortDescription": "Raw unrefined virgin coconut oil rich in Lauric Acid for cooking, skin & baby care in a 500ml Glass Jar.",
    "badges": [
      "bestseller",
      "cold-pressed"
    ],
    "stock": 95,
    "weight": "500ml",
    "packing": "Glass Jar",
    "ingredients": [
      "100% Pure Cold-Pressed Extra Virgin Coconut Oil (Zero Heat, Unrefined)"
    ],
    "benefits": [
      "Contains 50%+ Lauric Acid (monolaurin) to bolster antiviral & antibacterial defenses",
      "Medium-Chain Triglycerides (MCTs) burn cleanly for instant cellular energy",
      "Hypoallergenic moisturizer for infant baby massage and sensitive skin",
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
    "id": "164",
    "slug": "virgin-coconut-oil-180ml",
    "dbId": 164,
    "name": "Coconut oil",
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
      "/products/coconut-oil.jpg",
      "/products/coconut-oil-dripping.jpg"
    ],
    "description": "Compact handy glass jar of 100% raw cold-pressed extra virgin coconut oil. Perfectly sized for daily facial skincare, Ayurvedic morning oil pulling, desk moisturizer, travel, and infant skin nourishing.",
    "shortDescription": "Compact glass jar of pure unrefined virgin coconut oil for skincare, travel & oil pulling in a 180ml Glass Jar.",
    "badges": [
      "cold-pressed"
    ],
    "stock": 110,
    "weight": "180ml",
    "packing": "Glass Jar",
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
    "price": 490,
    "compareAtPrice": 490,
    "mrp": 490,
    "rating": 4.8,
    "reviewCount": 38,
    "image": "/products/carrot-powder-marble.jpg",
    "images": [
      "/products/carrot-powder-marble.jpg",
      "/products/carrot-benefits-poster.jpg",
      "/products/carrot-powder-eye-health.jpg",
      "/products/carrot-powder.jpg"
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
    "price": 510,
    "compareAtPrice": 510,
    "mrp": 510,
    "rating": 5,
    "reviewCount": 96,
    "image": "/products/sweet-potato-powder-100g.jpg",
    "images": [
      "/products/sweet-potato-powder-100g.jpg",
      "/products/sweet-potato-powder.jpg",
      "/products/sweet-potato-jar-display.jpg",
      "/products/sweet-potato-creation-process.jpg"
    ],
    "description": "100% pure organic dehydrated sweet potato powder milled from farm-fresh Nepali sweet potatoes. A nutrient-dense complex carbohydrate powerhouse packed with Vitamin A (beta-carotene), fiber, potassium, and minerals. Perfect for infant weaning porridge, baby cereals, pre-workout energy shakes, pancakes, and healthy baking without any added sugars, preservatives, or artificial additives.",
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
      "Rich in Vitamin A (Beta-Carotene) for infant eyesight and skin health",
      "Gentle complex carbohydrates for baby weaning porridge (6M+)",
      "Sustained clean glycogen energy for fitness, running, and gym workouts",
      "High in prebiotic dietary fiber for smooth gut digestion",
      "Zero added sugar, 100% chemical-free and gluten-free"
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
    image: '/products/authentic-dehydrated-mango.jpg',
    count: products.filter((p) => p.categorySlug === 'dried-fruits').length,
  },
  {
    name: 'Organic Powders',
    slug: 'powders',
    description: 'Micro-pulverized 100% organic vegetable & fruit superfood powders',
    image: '/products/sweet-potato-powder-100g.jpg',
    count: products.filter((p) => p.categorySlug === 'powders').length,
  },
  {
    name: 'Mountain Nuts',
    slug: 'nuts',
    description: 'Premium Himalayan almonds, walnuts, and mountain crunch',
    image: '/products/authentic-almonds.jpg',
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

export function normalizeProduct(raw: any, fallback?: Product | null): Product {
  if (!raw) return (fallback || undefined) as unknown as Product;
  const slug = raw.slug || fallback?.slug || String(raw.id || '');
  const local = fallback || getProductBySlug(slug) || products.find((p) => String(p.id) === String(raw.id) || String(p.dbId) === String(raw.id));

  const rawCompare = Number(raw.compare_at_price || raw.compareAtPrice || 0);
  const rawPrice = Number(raw.price || 0);
  const localPrice = Number(local?.price || 0);
  const localCompare = Number(local?.compareAtPrice || 0);

  const price = rawPrice > 0 ? rawPrice : (localPrice > 0 ? localPrice : Number(raw.mrp || local?.mrp || 0));
  const compareAtPrice = rawCompare > price ? rawCompare : (localCompare > price ? localCompare : price);
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
    weight: raw.weight || local?.weight || '100 GM',
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
