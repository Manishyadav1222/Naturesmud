import type { Product, Category } from '../../types';

export const categories: Category[] = [
  {
    "id": "1",
    "slug": "wild-honey",
    "name": "Wild Himalayan Honey",
    "description": "Rare multi-floral honey harvested from 3,500m+ cliffs by traditional Gurung honey hunters.",
    "image": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400",
    "productCount": 12,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "2",
    "slug": "shilajit",
    "name": "Pure Shilajit",
    "description": "Authentic 40-day Surya Tapi purified Shilajit resin from 4,000m+ altitudes with 60%+ fulvic acid.",
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    "productCount": 8,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "3",
    "slug": "superfoods",
    "name": "Superfoods & Powders",
    "description": "Nutrient-dense organic powders: moringa, chia, spirulina, wheatgrass, and more.",
    "image": "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400",
    "productCount": 15,
    "isActive": true,
    "sortOrder": 3
  },
  {
    "id": "4",
    "slug": "herbal-teas",
    "name": "Herbal Teas & Infusions",
    "description": "Hand-blended Himalayan herbal teas for wellness, digestion, and relaxation.",
    "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400",
    "productCount": 10,
    "isActive": true,
    "sortOrder": 4
  },
  {
    "id": "5",
    "slug": "baby-mother",
    "name": "Baby & Mother Care",
    "description": "Wholesome organic essentials for your little one's purest start.",
    "image": "https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=400",
    "productCount": 8,
    "isActive": true,
    "sortOrder": 5
  },
  {
    "id": "6",
    "slug": "natural-sweeteners",
    "name": "Natural Sweeteners",
    "description": "Healthy alternatives to refined sugar: dates powder, jaggery, coconut sugar.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    "productCount": 6,
    "isActive": true,
    "sortOrder": 6
  },
  {
    "id": "7",
    "slug": "nuts-seeds",
    "name": "Nuts & Seeds",
    "description": "Premium Himalayan walnuts, almonds, pumpkin seeds, and more.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    "productCount": 10,
    "isActive": true,
    "sortOrder": 7
  },
  {
    "id": "8",
    "slug": "wellness-kits",
    "name": "Wellness Kits & Combos",
    "description": "Curated bundles for immunity, energy, digestion, and daily vitality.",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    "productCount": 5,
    "isActive": true,
    "sortOrder": 8
  }
];

export const products: Product[] = [
  {
    "id": "prod-dates-powder",
    "slug": "dates-powder",
    "name": "Sun-Dried Dates Powder",
    "description": "100% pure sun-dried Arabian dates finely pulverized into mineral-rich organic sweetener. Zero added refined sugar, zero preservatives. Ideal for baby weaning food, porridge, milkshakes, and healthy baking.",
    "shortDescription": "100% natural date sugar substitute. Rich in potassium, iron & dietary fiber.",
    "price": 400,
    "compareAtPrice": 450,
    "image": "/products/dates-powder-100g.jpg",
    "images": [
      "/products/dates-powder-100g.jpg",
      "/products/dates-powder-jar-2k.jpg",
      "/products/dates-powder-product-shot.jpg",
      "/products/dates-powder.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "bestseller",
      "organic",
      "sugar-free"
    ],
    "ingredients": [
      "100% Premium Sun-Dried Dates (Pitted & Milled)"
    ],
    "benefits": [
      "Natural sugar replacement for babies & diabetics",
      "High dietary fiber promotes smooth digestion",
      "Rich in natural iron, magnesium & potassium",
      "Zero preservatives or artificial additives"
    ],
    "nutrition": [
      {
        "label": "Energy",
        "value": "277 kcal"
      },
      {
        "label": "Carbohydrates",
        "value": "75g"
      },
      {
        "label": "Dietary Fiber",
        "value": "7g"
      },
      {
        "label": "Potassium",
        "value": "656mg"
      },
      {
        "label": "Iron",
        "value": "1.2mg"
      }
    ],
    "usage": "Add 1-2 teaspoons to warm milk, oatmeal, baby porridge, or desserts as a healthy natural sweetener.",
    "storage": "Keep airtight in a cool, dry place. Reseal after use.",
    "stock": 85,
    "rating": 4.9,
    "reviewCount": 184,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "dates",
      "powder",
      "baby-food",
      "sugar-free",
      "natural",
      "nepal"
    ],
    "metaTitle": "Dates Powder Nepal | Pure Natural Sweetener Rs. 400",
    "metaDescription": "Pure sun-dried dates powder in Nepal. Zero chemicals, 100% wholefood baby sweetener. Free shipping over Rs. 3,000.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-chia-seeds",
    "slug": "chia-seeds",
    "name": "Himalayan Organic Chia Seeds",
    "description": "High-altitude organic black and white chia seeds loaded with Omega-3 ALA fatty acids, plant protein, and soluble dietary fiber. Expands into a soothing gel for smooth satiety and active digestion.",
    "shortDescription": "Triple-cleaned organic chia seeds. 5x calcium of milk, 3x antioxidant power.",
    "price": 495,
    "compareAtPrice": 550,
    "image": "/products/chia-seeds.jpg",
    "images": [
      "/products/chia-seeds.jpg",
      "/products/chia-power.jpg",
      "/images/posters/chia-power.jpg"
    ],
    "weight": "250g",
    "category": "Nuts & Seeds",
    "categorySlug": "nuts-seeds",
    "badges": [
      "bestseller",
      "organic",
      "omega-3"
    ],
    "ingredients": [
      "100% Organic Whole Chia Seeds (Salvia hispanica)"
    ],
    "benefits": [
      "Rich in Omega-3 fatty acids for cardiovascular health",
      "Absorbs 10-12x water weight for extended hydration",
      "High plant protein & dietary fiber for weight management"
    ],
    "nutrition": [
      {
        "label": "Protein",
        "value": "16.5g"
      },
      {
        "label": "Fiber",
        "value": "34.4g"
      },
      {
        "label": "Omega-3",
        "value": "17.8g"
      },
      {
        "label": "Calcium",
        "value": "631mg"
      }
    ],
    "usage": "Soak 1 tablespoon in water, juice, or yogurt for 15 minutes before consumption.",
    "storage": "Store in a cool, dry place away from sunlight.",
    "stock": 120,
    "rating": 4.9,
    "reviewCount": 210,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "chia",
      "seeds",
      "omega3",
      "fiber",
      "organic",
      "superfood"
    ],
    "metaTitle": "Organic Chia Seeds Nepal Rs. 495",
    "metaDescription": "Buy high-altitude organic chia seeds in Nepal. Free shipping over Rs. 3,000.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-beetroot-powder",
    "slug": "beetroot-powder",
    "name": "Earth's Ritual Beetroot Powder",
    "description": "Freeze-dried mountain beetroot powder providing natural dietary nitrates for nitric oxide production, athletic endurance, and hemoglobin enhancement.",
    "shortDescription": "Pure nitric oxide booster & natural blood builder. 100g.",
    "price": 430,
    "compareAtPrice": 490,
    "image": "/products/beetroot-powder-100g.jpg",
    "images": [
      "/products/beetroot-powder-100g.jpg",
      "/products/beetroot-poster-2k.jpg",
      "/products/beetroot-glass-jar.jpg",
      "/products/beetroot-powder.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "organic",
      "pre-workout"
    ],
    "ingredients": [
      "100% Whole Organic Beetroot (Beta vulgaris)"
    ],
    "benefits": [
      "Natural dietary nitrates elevate stamina & blood flow",
      "Supports healthy blood pressure and cardiovascular fitness",
      "Rich in betaine and natural antioxidant pigments"
    ],
    "nutrition": [
      {
        "label": "Dietary Nitrates",
        "value": "250mg"
      },
      {
        "label": "Iron",
        "value": "1.8mg"
      },
      {
        "label": "Folate",
        "value": "109µg"
      }
    ],
    "usage": "Mix 1 teaspoon in 200ml water, smoothie, or juice 30 minutes before workout or breakfast.",
    "storage": "Store in an airtight container in a cool, dry place.",
    "stock": 60,
    "rating": 4.8,
    "reviewCount": 95,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "beetroot",
      "preworkout",
      "nitric-oxide",
      "blood-builder"
    ],
    "metaTitle": "Earth's Ritual Beetroot Powder Rs. 430",
    "metaDescription": "Pure mountain beetroot powder for athletic stamina and heart wellness.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-apple-crisp",
    "slug": "apple-crisp",
    "name": "Mountain Dehydrated Apple Crisp",
    "description": "Sun-dehydrated crisp mountain apple slices. Absolutely zero added oil, sugar, or preservatives. Pure crunch and natural fructose.",
    "shortDescription": "100% crispy dehydrated Himalayan apples. Zero oil, zero sugar.",
    "price": 510,
    "compareAtPrice": 580,
    "image": "https://naturesmud.shop/images/posters/mountain-apple-crisp.jpg",
    "images": [
      "https://naturesmud.shop/images/posters/mountain-apple-crisp.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "zero-oil",
      "crispy"
    ],
    "ingredients": [
      "100% Mountain Red Apples"
    ],
    "benefits": [
      "Healthy snack for children and clean eaters",
      "Rich in polyphenols and apple pectin fiber",
      "Zero trans-fats, zero palm oil"
    ],
    "nutrition": [
      {
        "label": "Pectin Fiber",
        "value": "4.2g"
      },
      {
        "label": "Vitamin C",
        "value": "8.5mg"
      }
    ],
    "usage": "Enjoy straight from the pouch or top on cereals and salads.",
    "storage": "Reseal tightly to preserve crunchiness.",
    "stock": 50,
    "rating": 4.9,
    "reviewCount": 78,
    "isFeatured": true,
    "isBestSeller": false,
    "isNew": true,
    "tags": [
      "apple",
      "crisps",
      "snacks",
      "healthy"
    ],
    "metaTitle": "Mountain Apple Crisp Rs. 510",
    "metaDescription": "Crispy dehydrated Himalayan apple chips.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-dehydrated-coconut-chips",
    "slug": "dehydrated-coconut-chips",
    "name": "Dehydrated Coconut Chips",
    "description": "Gently dehydrated whole coconut flakes rich in medium-chain triglycerides (MCTs) and dietary fiber. A keto-friendly, crunchy whole-food snack providing sustained cellular energy, digestion support, and healthy fats.",
    "shortDescription": "100% pure crunchy dehydrated coconut chips rich in clean MCT healthy fats in a Standup Ziplock Pouch.",
    "price": 495,
    "compareAtPrice": 495,
    "image": "/products/dehydrated-coconut-chips.jpg",
    "images": [
      "/products/dehydrated-coconut-chips.jpg",
      "/products/dehydrated-coconut-chips-100g.jpg",
      "/products/coconut-chips-pouch.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "new",
      "organic",
      "keto"
    ],
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
    "stock": 90,
    "rating": 4.8,
    "reviewCount": 36,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": true,
    "tags": [
      "coconut-chips",
      "mct",
      "keto-snack",
      "dried-fruits",
      "healthy-fats"
    ],
    "metaTitle": "Dehydrated Coconut Chips Rs. 495",
    "metaDescription": "Pure dehydrated crunchy coconut chips in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-04T00:00:00Z"
  },
  {
    "id": "prod-roasted-cashews",
    "slug": "roasted-cashews",
    "name": "Royal Roasted Cashews",
    "description": "Slow-roasted jumbo king cashews seasoned with pink Himalayan rock salt. Crunchy, creamy, and rich in heart-healthy monounsaturated fats.",
    "shortDescription": "Jumbo slow-roasted cashews with pink salt. 150g.",
    "price": 750,
    "compareAtPrice": 850,
    "image": "https://naturesmud.shop/images/posters/premium-harvest-cashew.jpg",
    "images": [
      "https://naturesmud.shop/images/posters/premium-harvest-cashew.jpg"
    ],
    "weight": "150g",
    "category": "Nuts & Seeds",
    "categorySlug": "nuts-seeds",
    "badges": [
      "keto",
      "premium"
    ],
    "ingredients": [
      "Jumbo Cashew Nuts (W240), Himalayan Pink Salt"
    ],
    "benefits": [
      "Packed with zinc, copper, and magnesium",
      "Supports healthy cholesterol balance",
      "High satiety healthy snack"
    ],
    "nutrition": [
      {
        "label": "Protein",
        "value": "18g"
      },
      {
        "label": "Healthy Fats",
        "value": "44g"
      },
      {
        "label": "Magnesium",
        "value": "292mg"
      }
    ],
    "usage": "Enjoy 10-12 nuts daily as an energizing snack.",
    "storage": "Keep airtight to preserve freshness.",
    "stock": 70,
    "rating": 5,
    "reviewCount": 112,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "cashews",
      "roasted",
      "nuts",
      "keto"
    ],
    "metaTitle": "Royal Roasted Cashews Rs. 750",
    "metaDescription": "Slow roasted jumbo cashews with Himalayan salt.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-pumpkin-seeds",
    "slug": "pumpkin-seeds",
    "name": "Pure Mountain Pumpkin Seeds",
    "description": "Raw, unsalted high-altitude pumpkin seeds rich in zinc, magnesium, and tryptophan for prostate health, deep sleep, and immune strength.",
    "shortDescription": "Raw AAA pumpkin seeds. High zinc & plant protein. 300g.",
    "price": 520,
    "compareAtPrice": 600,
    "image": "/products/pumpkin-seeds.jpg",
    "images": [
      "/products/pumpkin-seeds.jpg",
      "/images/posters/pure-pumpkin-seeds.jpg",
      "/products/pumpkin-seeds-product-shot.jpg",
      "/products/pumpkin-seeds-2.jpg"
    ],
    "weight": "300g",
    "category": "Nuts & Seeds",
    "categorySlug": "nuts-seeds",
    "badges": [
      "zinc-boost",
      "raw"
    ],
    "ingredients": [
      "100% Raw Shelled Pumpkin Seeds (Pepitas)"
    ],
    "benefits": [
      "Natural zinc boosts immunity & cellular repair",
      "Tryptophan supports restful sleep cycles",
      "Excellent source of plant-based protein"
    ],
    "nutrition": [
      {
        "label": "Protein",
        "value": "30g"
      },
      {
        "label": "Zinc",
        "value": "7.8mg"
      },
      {
        "label": "Magnesium",
        "value": "592mg"
      }
    ],
    "usage": "Eat raw, roast lightly, or add to smoothies and breakfast bowls.",
    "storage": "Store in a cool, dry place.",
    "stock": 90,
    "rating": 4.9,
    "reviewCount": 134,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "pumpkin-seeds",
      "zinc",
      "sleep",
      "protein"
    ],
    "metaTitle": "Pure Mountain Pumpkin Seeds Rs. 520",
    "metaDescription": "Raw protein & zinc rich pumpkin seeds in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-cranberries",
    "slug": "cranberries",
    "name": "Ruby Cranberries Delight",
    "description": "Sun-kissed whole ruby cranberries bursting with natural tart-sweet flavor and rich in proanthocyanidins (PACs) for urinary tract wellness and antioxidant vitality.",
    "shortDescription": "Whole dried cranberries for urinary vitality & antioxidant protection. 100g.",
    "price": 415,
    "compareAtPrice": 475,
    "image": "https://naturesmud.shop/images/posters/ruby-cranberries-delight.jpg",
    "images": [
      "https://naturesmud.shop/images/posters/ruby-cranberries-delight.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "antioxidant",
      "uti-health"
    ],
    "ingredients": [
      "Whole Dried Cranberries (Vaccinium macrocarpon)"
    ],
    "benefits": [
      "Rich in Type-A PACs that promote natural urinary tract wellness",
      "Vibrant antioxidants combat oxidative stress",
      "Delicious natural tart-sweet flavor profile"
    ],
    "nutrition": [
      {
        "label": "Antioxidants",
        "value": "High PACs"
      },
      {
        "label": "Vitamin C",
        "value": "13.3mg"
      }
    ],
    "usage": "Snack directly or mix into oats, yogurt, and trail mixes.",
    "storage": "Store in a cool, dry location.",
    "stock": 80,
    "rating": 4.8,
    "reviewCount": 67,
    "isFeatured": true,
    "isBestSeller": false,
    "isNew": true,
    "tags": [
      "cranberries",
      "uti",
      "antioxidant",
      "berries"
    ],
    "metaTitle": "Ruby Cranberries Delight Rs. 415",
    "metaDescription": "Whole sun-kissed cranberries in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-sweet-potato-powder",
    "slug": "sweet-potato-powder",
    "name": "Sweet Potato Powder",
    "description": "100% pure organic dehydrated sweet potato powder from Nepali mountain farms. Rich in beta-carotene, prebiotic fiber, and clean energy.",
    "shortDescription": "Dehydrated sweet potato powder for baby food & smoothies. 100g.",
    "price": 510,
    "compareAtPrice": 510,
    "image": "/products/sweet-potato-powder-100g.jpg",
    "images": [
      "/products/sweet-potato-powder-100g.jpg",
      "/images/posters/sweet-vibes.jpg",
      "/products/sweet-potato-jar-display.jpg",
      "/products/sweet-potato-powder.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "bestseller",
      "organic"
    ],
    "ingredients": [
      "100% Dehydrated Nepali Sweet Potato"
    ],
    "benefits": [
      "Natural Beta-Carotene Vitamin A for eye vitality",
      "Gentle complex carbs for baby porridge",
      "Clean sustained fitness energy"
    ],
    "nutrition": [
      {
        "label": "Vitamin A",
        "value": "720% DV"
      },
      {
        "label": "Dietary Fiber",
        "value": "7.5g"
      }
    ],
    "usage": "Mix 1-2 tablespoons into warm milk, oats, or smoothies.",
    "storage": "Keep sealed in a dry location.",
    "stock": 100,
    "rating": 5,
    "reviewCount": 96,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "sweet-potato",
      "powders",
      "baby-food"
    ],
    "metaTitle": "Sweet Potato Powder Rs. 510",
    "metaDescription": "Pure sweet potato powder in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-carrot-powder",
    "slug": "carrot-powder",
    "name": "Carrot Powder",
    "description": "Sun-dried and gently milled organic carrot powder rich in beta-carotene and dietary fiber for eye protection and everyday nutrition.",
    "shortDescription": "Pure organic carrot powder rich in beta-carotene. 100g.",
    "price": 490,
    "compareAtPrice": 490,
    "image": "/products/carrot-powder-100g.jpg",
    "images": [
      "/products/carrot-powder-100g.jpg",
      "/products/carrot-powder-poster.jpg",
      "/products/carrot-powder-marble.jpg",
      "/products/carrot-powder.jpg"
    ],
    "weight": "100g",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "organic"
    ],
    "ingredients": [
      "100% Dehydrated Organic Carrots"
    ],
    "benefits": [
      "Loaded with Beta-Carotene Pro-Vitamin A",
      "Easy to blend into kids meals and soups",
      "Rich in natural antioxidants"
    ],
    "nutrition": [
      {
        "label": "Vitamin A",
        "value": "850% DV"
      },
      {
        "label": "Fiber",
        "value": "12g"
      }
    ],
    "usage": "Stir into baby purees, soups, or smoothies.",
    "storage": "Store in a dry location.",
    "stock": 85,
    "rating": 4.8,
    "reviewCount": 38,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": true,
    "tags": [
      "carrot",
      "carrot-powder",
      "vitamin-a"
    ],
    "metaTitle": "Carrot Powder Rs. 490",
    "metaDescription": "Organic carrot powder in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-pink-salt",
    "slug": "himalayan-pink-salt",
    "name": "Himalayan Pink Salt",
    "description": "Unrefined ancient Himalayan pink rock salt with 84+ bioavailable ionic trace minerals for cellular electrolyte balance.",
    "shortDescription": "Pure unrefined pink rock salt with 84+ minerals. 100g.",
    "price": 250,
    "compareAtPrice": 250,
    "image": "/products/pink-salt.jpg",
    "images": [
      "/products/pink-salt.jpg",
      "/products/pink-salt-jar.jpg",
      "/products/pink-salt-crystals.jpg",
      "/products/client-authentic-label-1.jpg"
    ],
    "weight": "100g",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "badges": [
      "organic"
    ],
    "ingredients": [
      "100% Pure Himalayan Pink Salt Crystals"
    ],
    "benefits": [
      "Contains 84+ essential trace minerals",
      "Zero bleaches or anti-caking agents",
      "Supports healthy hydration and electrolytes"
    ],
    "nutrition": [
      {
        "label": "Sodium Chloride",
        "value": "98%"
      },
      {
        "label": "Trace Minerals",
        "value": "84+ Minerals"
      }
    ],
    "usage": "Use as daily seasoning for cooking or detox drinks.",
    "storage": "Store in a dry location.",
    "stock": 150,
    "rating": 4.8,
    "reviewCount": 46,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "pink-salt",
      "salt",
      "minerals"
    ],
    "metaTitle": "Himalayan Pink Salt Rs. 250",
    "metaDescription": "Pure Himalayan pink salt in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-black-salt",
    "slug": "pure-himalayan-black-salt-bire-noon",
    "name": "Himalayan Black Salt (Bire Noon)",
    "description": "Authentic volcanic mineral-dense Himalayan Black Salt (Bire Noon). Revered in Ayurvedic tradition for digestive fire and gut wellness.",
    "shortDescription": "Volcanic sulfur-rich Himalayan black salt. 100g.",
    "price": 220,
    "compareAtPrice": 220,
    "image": "/products/himalayan-black-salt-digestive.jpg",
    "images": [
      "/products/himalayan-black-salt-digestive.jpg",
      "/products/black-salt.jpg",
      "/products/client-authentic-label-2.jpg"
    ],
    "weight": "100g",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "badges": [
      "ayurvedic"
    ],
    "ingredients": [
      "100% Pure Himalayan Black Salt (Bire Noon)"
    ],
    "benefits": [
      "Stimulates digestive fire (Agni) and eases bloating",
      "Naturally lower sodium than table salt",
      "Rich in active sulfur compounds and iron"
    ],
    "nutrition": [
      {
        "label": "Sodium Chloride",
        "value": "90%"
      },
      {
        "label": "Iron & Sulfur",
        "value": "Naturally Present"
      }
    ],
    "usage": "Use in chaats, fruits, salads, or warm water digestive drinks.",
    "storage": "Keep sealed in a dry place.",
    "stock": 140,
    "rating": 4.9,
    "reviewCount": 51,
    "isFeatured": true,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "black-salt",
      "bire-noon",
      "digestive"
    ],
    "metaTitle": "Himalayan Black Salt Rs. 220",
    "metaDescription": "Authentic Bire Noon black salt in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "prod-blueberries",
    "slug": "dried-blueberries",
    "name": "Dried Blueberries",
    "description": "Whole wild alpine berries harvested at high Himalayan altitudes. Naturally rich in dark-violet Anthocyanins to support screen-weary eyes and sharp focus.",
    "shortDescription": "Wild alpine anthocyanin berries for daily focus & eye defense. 100g.",
    "price": 650,
    "compareAtPrice": 650,
    "image": "/products/dried-blueberries-100g.jpg",
    "images": [
      "/products/dried-blueberries-100g.jpg",
      "/products/blueberries-brain-power.jpg",
      "/products/dried-blueberries-orchard.jpg",
      "/products/blueberries-2.jpg"
    ],
    "weight": "100g",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "badges": [
      "bestseller",
      "wild-harvest"
    ],
    "ingredients": [
      "100% Wild Himalayan Dried Blueberries"
    ],
    "benefits": [
      "Dense Anthocyanins support mental focus and memory",
      "Nourishes eye vitality against screen strain",
      "One of nature's highest antioxidant berries"
    ],
    "nutrition": [
      {
        "label": "Anthocyanins",
        "value": "High Potency"
      },
      {
        "label": "Fiber",
        "value": "7.8g"
      }
    ],
    "usage": "Snack daily or blend into morning smoothies and bowls.",
    "storage": "Keep sealed in a dry place.",
    "stock": 80,
    "rating": 5,
    "reviewCount": 78,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "blueberries",
      "antioxidants",
      "eye-health"
    ],
    "metaTitle": "Dried Blueberries Rs. 650",
    "metaDescription": "Wild Himalayan dried blueberries in Nepal.",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2026-09-02T00:00:00Z"
  },
  {
    "id": "1",
    "slug": "wild-himalayan-honey-500g",
    "name": "Wild Himalayan Honey 500g",
    "description": "Our flagship wild honey is harvested by traditional Gurung honey hunters who scale 300ft cliffs in the Annapurna region. This rare multi-floral honey contains nectar from 100+ wildflower species including rhododendron, wild cherry, and medicinal herbs found only above 3,500m. Each batch is raw, unfiltered, and cold-extracted to preserve 200+ natural enzymes, antioxidants, and pollen. The flavor profile is complex — floral front notes with woody undertones and a subtle medicinal finish. Perfect for daily wellness, culinary use, or as a premium gift.",
    "shortDescription": "Rare multi-floral honey from 3,500m+ cliffs. Raw, unfiltered, 100+ wildflower essences.",
    "price": 395,
    "compareAtPrice": 395,
    "image": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600",
    "images": [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600"
    ],
    "weight": "100 GM",
    "category": "Wild Himalayan Honey",
    "categorySlug": "wild-honey",
    "badges": [
      "bestseller",
      "organic",
      "raw"
    ],
    "ingredients": [
      "100% Raw Wild Himalayan Multi-floral Honey"
    ],
    "benefits": [
      "Boosts immunity with natural antioxidants and enzymes",
      "Soothes sore throat and cough naturally",
      "Supports digestive health with prebiotic properties",
      "Natural energy source with low glycemic impact",
      "Promotes wound healing when applied topically",
      "Rich in trace minerals from high-altitude flora"
    ],
    "nutrition": [
      {
        "label": "Energy",
        "value": "304 kcal"
      },
      {
        "label": "Carbohydrates",
        "value": "82.4g"
      },
      {
        "label": "Sugars",
        "value": "82.1g"
      },
      {
        "label": "Protein",
        "value": "0.3g"
      },
      {
        "label": "Fat",
        "value": "0g"
      },
      {
        "label": "Fiber",
        "value": "0.2g"
      },
      {
        "label": "Vitamin C",
        "value": "0.5mg"
      },
      {
        "label": "Calcium",
        "value": "6mg"
      },
      {
        "label": "Iron",
        "value": "0.4mg"
      }
    ],
    "usage": "Take 1-2 teaspoons daily on empty stomach, mix in warm (not boiling) water, drizzle over yogurt/toast, or use as natural sweetener in recipes. Do not heat above 40°C to preserve enzymes.",
    "storage": "Store in a cool, dry place away from direct sunlight. Crystallization is natural — place jar in warm water to liquefy. Best within 24 months of harvest.",
    "stock": 47,
    "rating": 4.9,
    "reviewCount": 342,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "honey",
      "wild",
      "himalayan",
      "raw",
      "organic",
      "immunity",
      "gift"
    ],
    "metaTitle": "Wild Himalayan Honey 500g | Raw Multi-floral Honey from 3500m+ Cliffs",
    "metaDescription": "Buy authentic wild Himalayan honey harvested by Gurung honey hunters. 100+ wildflower essences, raw, unfiltered, enzyme-rich. Free shipping on orders above Rs. 3,000.",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 395
  },
  {
    "id": "2",
    "slug": "wild-himalayan-honey-250g",
    "name": "Wild Himalayan Honey 250g",
    "description": "Smaller jar of our flagship wild honey — perfect for first-time buyers or gifting. Same rare multi-floral honey harvested from 3,500m+ cliffs by traditional Gurung honey hunters. Raw, unfiltered, cold-extracted to preserve 200+ natural enzymes.",
    "shortDescription": "Rare multi-floral honey from 3,500m+ cliffs. 250g starter size.",
    "price": 750,
    "compareAtPrice": 750,
    "image": "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600",
    "images": [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600"
    ],
    "weight": "200 GM",
    "category": "Wild Himalayan Honey",
    "categorySlug": "wild-honey",
    "badges": [
      "organic",
      "raw"
    ],
    "ingredients": [
      "100% Raw Wild Himalayan Multi-floral Honey"
    ],
    "benefits": [
      "Boosts immunity with natural antioxidants and enzymes",
      "Soothes sore throat and cough naturally",
      "Supports digestive health with prebiotic properties",
      "Natural energy source with low glycemic impact"
    ],
    "nutrition": [
      {
        "label": "Energy",
        "value": "304 kcal"
      },
      {
        "label": "Carbohydrates",
        "value": "82.4g"
      },
      {
        "label": "Sugars",
        "value": "82.1g"
      },
      {
        "label": "Protein",
        "value": "0.3g"
      }
    ],
    "usage": "Take 1-2 teaspoons daily on empty stomach, mix in warm (not boiling) water, or use as natural sweetener.",
    "storage": "Store in a cool, dry place away from direct sunlight. Crystallization is natural.",
    "stock": 89,
    "rating": 4.8,
    "reviewCount": 156,
    "isFeatured": true,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "honey",
      "wild",
      "himalayan",
      "raw",
      "organic",
      "starter"
    ],
    "createdAt": "2024-02-01T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 750
  },
  {
    "id": "3",
    "slug": "pure-shilajit-resin-20g",
    "name": "Pure Shilajit Resin 20g",
    "description": "The gold standard of Shilajit. Harvested from 4,000m+ altitudes in the Nepalese Himalayas, purified through the ancient 40-day Surya Tapi (sun-drying) method in copper vessels. This process concentrates fulvic acid to 60%+ and preserves 85+ trace minerals in their most bioavailable ionic form. Each batch is third-party lab tested for heavy metals, purity, and potency. The resin is glossy, blackish-brown, with a distinct bittersweet taste and earthy aroma — hallmarks of authenticity.",
    "shortDescription": "40-day Surya Tapi purified resin from 4,000m+. 60%+ fulvic acid, 85+ minerals.",
    "price": 510,
    "compareAtPrice": 510,
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
    ],
    "weight": "100 GM",
    "category": "Pure Shilajit",
    "categorySlug": "shilajit",
    "badges": [
      "bestseller",
      "superfood",
      "lab-tested"
    ],
    "ingredients": [
      "100% Purified Himalayan Shilajit Resin (Asphaltum punjabianum)"
    ],
    "benefits": [
      "Enhances mitochondrial energy production (ATP)",
      "Supports testosterone and reproductive health",
      "Improves cognitive function and memory",
      "Powerful adaptogen for stress resilience",
      "Supports bone and joint health",
      "Enhances nutrient absorption (fulvic acid)",
      "Natural detoxifier for heavy metals"
    ],
    "nutrition": [
      {
        "label": "Fulvic Acid",
        "value": "60%+"
      },
      {
        "label": "Humic Acid",
        "value": "12%+"
      },
      {
        "label": "Trace Minerals",
        "value": "85+"
      },
      {
        "label": "Iron",
        "value": "High"
      },
      {
        "label": "Magnesium",
        "value": "High"
      },
      {
        "label": "Zinc",
        "value": "Moderate"
      },
      {
        "label": "Selenium",
        "value": "Present"
      }
    ],
    "usage": "Dissolve a pea-sized portion (250-500mg) in warm water, milk, or tea. Take once daily, preferably morning on empty stomach. Start with smaller amount and gradually increase. Do not heat above 60°C.",
    "storage": "Store in cool, dry place. Keep jar tightly sealed. Resin may harden in cold — warm jar in hands before use. Best within 36 months.",
    "stock": 32,
    "rating": 4.9,
    "reviewCount": 287,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "shilajit",
      "resin",
      "fulvic-acid",
      "energy",
      "testosterone",
      "adaptogen",
      "superfood"
    ],
    "metaTitle": "Pure Shilajit Resin 20g | 40-Day Surya Tapi Purified | 60%+ Fulvic Acid",
    "metaDescription": "Authentic Himalayan Shilajit resin, 40-day sun purified. 60%+ fulvic acid, 85+ trace minerals. Lab tested. Free shipping on orders above Rs. 3,000.",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 510
  },
  {
    "id": "4",
    "slug": "pure-shilajit-resin-10g",
    "name": "Pure Shilajit Resin 10g",
    "description": "Starter size of our premium 40-day Surya Tapi purified Shilajit resin. Perfect for first-time users to experience the benefits before committing to a larger jar. Same 60%+ fulvic acid potency.",
    "shortDescription": "40-day Surya Tapi purified resin. 10g starter size.",
    "price": 650,
    "compareAtPrice": 650,
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
    ],
    "weight": "100 GM",
    "category": "Pure Shilajit",
    "categorySlug": "shilajit",
    "badges": [
      "superfood",
      "lab-tested"
    ],
    "ingredients": [
      "100% Purified Himalayan Shilajit Resin (Asphaltum punjabianum)"
    ],
    "benefits": [
      "Enhances mitochondrial energy production (ATP)",
      "Supports testosterone and reproductive health",
      "Improves cognitive function and memory",
      "Powerful adaptogen for stress resilience"
    ],
    "nutrition": [
      {
        "label": "Fulvic Acid",
        "value": "60%+"
      },
      {
        "label": "Trace Minerals",
        "value": "85+"
      }
    ],
    "usage": "Dissolve a pea-sized portion (250-500mg) in warm water or milk. Take once daily, morning on empty stomach.",
    "storage": "Store in cool, dry place. Keep jar tightly sealed.",
    "stock": 56,
    "rating": 4.8,
    "reviewCount": 98,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "shilajit",
      "resin",
      "starter",
      "fulvic-acid"
    ],
    "createdAt": "2024-02-15T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 650
  },
  {
    "id": "5",
    "slug": "organic-moringa-powder-200g",
    "name": "Organic Moringa Powder 200g",
    "description": "Known as the \"Miracle Tree,\" our moringa is grown at 1,200m altitude in nutrient-rich Himalayan foothill soil. Leaves are shade-dried at low temperatures to preserve maximum nutrition. Each batch tests at 25%+ protein, 90+ nutrients, 46 antioxidants, and 36 anti-inflammatory compounds. Vibrant green color indicates freshness and chlorophyll content.",
    "shortDescription": "Nutrient-dense superfood from Himalayan foothills. 90+ nutrients, 46 antioxidants.",
    "price": 430,
    "compareAtPrice": 430,
    "image": "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600",
    "images": [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600"
    ],
    "weight": "100 GM",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "organic",
      "superfood"
    ],
    "ingredients": [
      "100% Organic Moringa Oleifera Leaf Powder"
    ],
    "benefits": [
      "Complete plant protein with all 9 essential amino acids",
      "Rich in iron, calcium, vitamins A, C, E, K",
      "Powerful antioxidant and anti-inflammatory",
      "Supports healthy blood sugar levels",
      "Boosts natural energy without caffeine",
      "Promotes healthy skin and hair"
    ],
    "nutrition": [
      {
        "label": "Protein",
        "value": "25g"
      },
      {
        "label": "Fiber",
        "value": "19g"
      },
      {
        "label": "Iron",
        "value": "28mg (156% DV)"
      },
      {
        "label": "Calcium",
        "value": "1850mg (142% DV)"
      },
      {
        "label": "Vitamin A",
        "value": "378% DV"
      },
      {
        "label": "Vitamin C",
        "value": "17mg (19% DV)"
      },
      {
        "label": "Potassium",
        "value": "1324mg"
      }
    ],
    "usage": "Add 1-2 teaspoons to smoothies, juices, soups, or sprinkle on salads. Start with 1/2 tsp daily and increase gradually. Can be mixed with honey for a nutrient paste.",
    "storage": "Store in cool, dry place. Reseal pouch after each use. Keep away from moisture. Best within 18 months.",
    "stock": 124,
    "rating": 4.7,
    "reviewCount": 187,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": false,
    "tags": [
      "moringa",
      "superfood",
      "powder",
      "protein",
      "iron",
      "organic",
      "vegan"
    ],
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 430
  },
  {
    "id": "6",
    "slug": "organic-chia-seeds-500g",
    "name": "Organic Chia Seeds 500g",
    "description": "Premium black chia seeds grown in the fertile Himalayan foothills without pesticides. These tiny seeds are nutritional powerhouses — rich in omega-3 fatty acids (ALA), fiber, protein, and essential minerals. They absorb 10x their weight in liquid, forming a gel that supports hydration and digestive health. Perfect for puddings, smoothies, baking, or as an egg substitute.",
    "shortDescription": "Omega-3 rich superfood from Himalayan foothills. High fiber, complete protein.",
    "price": 495,
    "compareAtPrice": 495,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
    ],
    "weight": "100 GM",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "organic",
      "superfood"
    ],
    "ingredients": [
      "100% Organic Black Chia Seeds (Salvia hispanica)"
    ],
    "benefits": [
      "Richest plant source of omega-3 (ALA)",
      "High fiber for digestive health and satiety",
      "Complete protein with all essential amino acids",
      "Rich in calcium, magnesium, phosphorus",
      "Supports hydration (absorbs 10x water)",
      "Natural thickener for recipes"
    ],
    "nutrition": [
      {
        "label": "Omega-3 (ALA)",
        "value": "17.8g"
      },
      {
        "label": "Fiber",
        "value": "34.4g"
      },
      {
        "label": "Protein",
        "value": "16.5g"
      },
      {
        "label": "Calcium",
        "value": "631mg (49% DV)"
      },
      {
        "label": "Iron",
        "value": "7.7mg (43% DV)"
      },
      {
        "label": "Magnesium",
        "value": "335mg (80% DV)"
      }
    ],
    "usage": "Soak 1-2 tbsp in water/milk for 15-20 mins to make chia gel. Add to smoothies, overnight oats, yogurt, or use as egg substitute (1 tbsp chia + 3 tbsp water = 1 egg).",
    "storage": "Store in cool, dry place in airtight container. Best within 24 months.",
    "stock": 156,
    "rating": 4.6,
    "reviewCount": 203,
    "isFeatured": true,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "chia",
      "seeds",
      "omega3",
      "fiber",
      "protein",
      "organic",
      "vegan",
      "keto"
    ],
    "createdAt": "2024-01-25T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 350
  },
  {
    "id": "7",
    "slug": "organic-dates-powder-300g",
    "name": "Organic Dates Powder 300g",
    "description": "Nature's perfect 1:1 sugar replacement. Made from 100% organic dates dried and ground at low temperatures — no additives, no fillers, just pure fruit. Rich caramel flavor with notes of toffee and butterscotch. Low glycemic index, high fiber, and packed with potassium, magnesium, and antioxidants. Perfect for baking, smoothies, coffee, or anywhere you'd use sugar.",
    "shortDescription": "1:1 natural sugar replacement. Low GI, high fiber, caramel flavor.",
    "price": 415,
    "compareAtPrice": 415,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
    ],
    "weight": "100 GM",
    "category": "Natural Sweeteners",
    "categorySlug": "natural-sweeteners",
    "badges": [
      "organic",
      "new"
    ],
    "ingredients": [
      "100% Organic Deglet Noor Dates Powder"
    ],
    "benefits": [
      "1:1 replacement for refined sugar in recipes",
      "Low glycemic index (42 vs 65 for sugar)",
      "High in fiber (8g per 100g)",
      "Rich in potassium, magnesium, B vitamins",
      "Natural caramel/toffee flavor profile",
      "Suitable for diabetics in moderation"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "282 kcal"
      },
      {
        "label": "Total Sugars",
        "value": "63g"
      },
      {
        "label": "Fiber",
        "value": "8g"
      },
      {
        "label": "Potassium",
        "value": "656mg"
      },
      {
        "label": "Magnesium",
        "value": "54mg"
      },
      {
        "label": "Vitamin B6",
        "value": "0.2mg"
      }
    ],
    "usage": "Replace sugar 1:1 in baking, smoothies, coffee, tea, oatmeal. May need slight liquid adjustment in recipes due to fiber content. Excellent in energy balls and raw desserts.",
    "storage": "Store in airtight container in cool, dry place. May clump naturally — break up with fork. Best within 12 months.",
    "stock": 78,
    "rating": 4.8,
    "reviewCount": 134,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "dates",
      "powder",
      "sweetener",
      "sugar-free",
      "low-gi",
      "baking",
      "organic",
      "vegan"
    ],
    "createdAt": "2024-11-01T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 415
  },
  {
    "id": "8",
    "slug": "baby-massage-oil-100ml",
    "name": "Baby Massage Oil 100ml",
    "description": "Gentle blend of cold-pressed Himalayan apricot kernel oil, sesame oil, and a touch of wild lavender. Specially formulated for newborn's delicate skin — pure, non-comedogenic, and free from mineral oil, parabens, and synthetic fragrances. Supports healthy skin barrier hydration and promotes relaxation through gentle touch.",
    "shortDescription": "Pure botanical blend for newborn massage. Apricot, sesame, lavender.",
    "price": 1424,
    "compareAtPrice": 1499,
    "image": "https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=600",
    "images": [
      "https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=600"
    ],
    "weight": "100ml glass bottle with pump",
    "category": "Baby & Mother Care",
    "categorySlug": "baby-mother",
    "badges": [
      "organic",
      "new"
    ],
    "ingredients": [
      "Organic Apricot Kernel Oil (Prunus armeniaca)",
      "Organic Sesame Oil (Sesamum indicum)",
      "Organic Wild Lavender Essential Oil (Lavandula angustifolia) - 0.1%",
      "Vitamin E (Natural Tocopherol)"
    ],
    "benefits": [
      "Strengthens skin barrier and prevents moisture loss",
      "Improves blood circulation and muscle tone",
      "Promotes deeper, longer sleep",
      "Reduces colic and digestive discomfort",
      "Supports parent-baby bonding",
      "Gentle botanical formula — suitable for delicate skin"
    ],
    "nutrition": [],
    "usage": "Warm a few drops between palms. Gently massage baby's body using long strokes. Best after bath when skin is slightly damp. Use daily for optimal results. Patch test before first use.",
    "storage": "Store at room temperature. Use within 6 months of opening. Keep away from direct sunlight.",
    "stock": 43,
    "rating": 4.9,
    "reviewCount": 89,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "baby",
      "massage",
      "oil",
      "organic",
      "gentle-formula",
      "newborn",
      "gift"
    ],
    "createdAt": "2024-11-10T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z"
  },
  {
    "id": "9",
    "slug": "himalayan-herbal-tea-immunity-50g",
    "name": "Immunity Herbal Tea 50g",
    "description": "Hand-blended by Himalayan herbalists using tulsi (holy basil), guduchi, turmeric, ginger, black pepper, and wild honey essence. This caffeine-free infusion supports immune resilience, respiratory health, and stress adaptation. Each herb is sourced from specific altitudes where its medicinal compounds peak. The blend follows traditional Ayurvedic ratios for synergistic effect.",
    "shortDescription": "Ayurvedic immune blend with tulsi, guduchi, turmeric, ginger. Caffeine-free.",
    "price": 664,
    "compareAtPrice": 699,
    "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600",
    "images": [
      "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600"
    ],
    "weight": "50g loose leaf (approx. 25 cups)",
    "category": "Herbal Teas & Infusions",
    "categorySlug": "herbal-teas",
    "badges": [
      "organic"
    ],
    "ingredients": [
      "Organic Tulsi/Holy Basil (Ocimum sanctum) - 30%",
      "Organic Guduchi/Giloy (Tinospora cordifolia) - 20%",
      "Organic Turmeric (Curcuma longa) - 15%",
      "Organic Ginger (Zingiber officinale) - 15%",
      "Organic Black Pepper (Piper nigrum) - 5%",
      "Wild Honey Essence - 15%"
    ],
    "benefits": [
      "Supports immune system function",
      "Promotes respiratory health",
      "Adaptogenic stress support",
      "Anti-inflammatory and antioxidant",
      "Aids digestion and metabolism",
      "Caffeine-free — anytime drink"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "<5 kcal per cup"
      },
      {
        "label": "Caffeine",
        "value": "0mg"
      }
    ],
    "usage": "Steep 1 tsp (2g) in 200ml hot water (95°C) for 3-5 minutes. Strain and enjoy. Add wild honey if desired. Drink 1-2 cups daily. Can be cold-brewed overnight.",
    "storage": "Store in airtight container away from light, heat, and moisture. Best within 18 months.",
    "stock": 92,
    "rating": 4.7,
    "reviewCount": 167,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "tea",
      "herbal",
      "immunity",
      "tulsi",
      "guduchi",
      "turmeric",
      "caffeine-free",
      "ayurvedic"
    ],
    "createdAt": "2024-02-10T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z"
  },
  {
    "id": "10",
    "slug": "morning-vitality-bundle",
    "name": "Morning Vitality Ritual Bundle",
    "description": "Curated 4-product combo to start your day the Himalayan way. Includes: Wild Himalayan Honey 250g, Organic Turmeric Latte Mix 100g, Organic Amla Powder 100g, and Himalayan Green Tea 50g. Save 5% vs buying individually. Perfect gift for wellness enthusiasts or your own morning upgrade.",
    "shortDescription": "4-product morning wellness bundle. Honey, turmeric latte, amla, green tea. Save 5%.",
    "price": 180,
    "compareAtPrice": 180,
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
    "images": [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
    ],
    "weight": "100 GM",
    "category": "Wellness Kits & Combos",
    "categorySlug": "wellness-kits",
    "badges": [
      "bestseller",
      "new"
    ],
    "ingredients": [
      "Wild Himalayan Honey 250g",
      "Organic Turmeric Latte Mix 100g (turmeric, ginger, cinnamon, black pepper, cardamom)",
      "Organic Amla/Indian Gooseberry Powder 100g",
      "Himalayan Green Tea 50g (high-altitude camellia sinensis)"
    ],
    "benefits": [
      "Complete morning antioxidant protocol",
      "Supports immunity, digestion, energy",
      "Convenient — all essentials in one box",
      "Beautiful gift packaging included",
      "19% savings vs individual purchase",
      "30-day supply for one person"
    ],
    "nutrition": [],
    "usage": "Morning ritual: 1) Warm water with 1 tsp honey + 1/2 tsp amla powder. 2) Turmeric latte with milk of choice. 3) Green tea mid-morning. Adjust to preference.",
    "storage": "Store each product per individual instructions. Keep bundle box in cool, dry place.",
    "stock": 28,
    "rating": 4.8,
    "reviewCount": 76,
    "isFeatured": true,
    "isBestSeller": true,
    "isNew": true,
    "tags": [
      "bundle",
      "morning",
      "ritual",
      "wellness",
      "gift",
      "immunity",
      "energy",
      "starter"
    ],
    "createdAt": "2024-11-15T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 180
  },
  {
    "id": "11",
    "slug": "himalayan-walnuts-250g",
    "name": "Himalayan Walnuts 250g",
    "description": "Premium walnuts from wild-growing trees at 2,000-3,000m in the Karnali region. The cold climate and mineral-rich soil produce exceptionally flavorful kernels with high oil content (65%+). Hand-shelled to preserve whole halves. Rich in omega-3, antioxidants, and melatonin for brain health and sleep quality.",
    "shortDescription": "Wild-grown from 2,000-3,000m. High omega-3, hand-shelled whole halves.",
    "price": 495,
    "compareAtPrice": 495,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "images": [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
    ],
    "weight": "300 GM",
    "category": "Nuts & Seeds",
    "categorySlug": "nuts-seeds",
    "badges": [
      "organic"
    ],
    "ingredients": [
      "100% Raw Himalayan Walnut Kernels (Juglans regia)"
    ],
    "benefits": [
      "Highest plant omega-3 (ALA) of any nut",
      "Supports brain health and cognitive function",
      "Natural melatonin for sleep quality",
      "Rich in polyphenols and antioxidants",
      "Supports heart health and cholesterol",
      "Anti-inflammatory properties"
    ],
    "nutrition": [
      {
        "label": "Omega-3 (ALA)",
        "value": "9.1g"
      },
      {
        "label": "Protein",
        "value": "15.2g"
      },
      {
        "label": "Fat",
        "value": "65.2g"
      },
      {
        "label": "Fiber",
        "value": "6.7g"
      },
      {
        "label": "Magnesium",
        "value": "158mg"
      },
      {
        "label": "Vitamin E",
        "value": "0.7mg"
      }
    ],
    "usage": "Eat raw as snack (6-8 halves daily), add to oatmeal, salads, baking, or make walnut butter. Soak overnight for easier digestion.",
    "storage": "Store in refrigerator or freezer for maximum freshness (high oil content). Best within 12 months.",
    "stock": 67,
    "rating": 4.6,
    "reviewCount": 112,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "walnuts",
      "nuts",
      "omega3",
      "brain-health",
      "organic",
      "wild-grown",
      "keto"
    ],
    "createdAt": "2024-03-01T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z",
    "mrp": 495
  },
  {
    "id": "12",
    "slug": "organic-spirulina-powder-100g",
    "name": "Organic Spirulina Powder 100g",
    "description": "Blue-green algae cultivated in pristine Himalayan spring water at 1,500m altitude. Our spirulina tests at 65%+ protein, rich in phycocyanin (the blue antioxidant), B12, iron, and chlorophyll. Grown in closed bioreactors to ensure purity — no heavy metals, microcystins, or contaminants. Intense blue-green color indicates high phycocyanin content.",
    "shortDescription": "65%+ protein superfood. High phycocyanin, B12, iron. Purity tested.",
    "price": 1329,
    "compareAtPrice": 1399,
    "image": "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600",
    "images": [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600"
    ],
    "weight": "100g resealable pouch",
    "category": "Superfoods & Powders",
    "categorySlug": "superfoods",
    "badges": [
      "organic",
      "superfood"
    ],
    "ingredients": [
      "100% Organic Spirulina (Arthrospira platensis)"
    ],
    "benefits": [
      "Complete protein (65%+) with all essential amino acids",
      "Rich in bioavailable iron and B12 (vegan source)",
      "Powerful antioxidant phycocyanin",
      "Supports detoxification and heavy metal binding",
      "Boosts energy and endurance",
      "Supports immune function"
    ],
    "nutrition": [
      {
        "label": "Protein",
        "value": "65g"
      },
      {
        "label": "Iron",
        "value": "28.5mg (158% DV)"
      },
      {
        "label": "Vitamin B12",
        "value": "120µg (5000% DV)"
      },
      {
        "label": "Phycocyanin",
        "value": "12-15%"
      },
      {
        "label": "Chlorophyll",
        "value": "1.1%"
      },
      {
        "label": "GLA (Omega-6)",
        "value": "1.3g"
      }
    ],
    "usage": "Start with 1/2 tsp daily in smoothie, juice, or water. Gradually increase to 1-2 tsp. Best taken morning or pre-workout. Can stain — rinse immediately.",
    "storage": "Store in cool, dry, dark place. Reseal tightly. Avoid moisture. Best within 24 months.",
    "stock": 45,
    "rating": 4.7,
    "reviewCount": 143,
    "isFeatured": false,
    "isBestSeller": false,
    "isNew": false,
    "tags": [
      "spirulina",
      "blue-green-algae",
      "protein",
      "b12",
      "iron",
      "vegan",
      "detox",
      "superfood"
    ],
    "createdAt": "2024-02-20T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z"
  }
];

export function getFeaturedProducts(limit = 8): Product[] {
  const featured = products.filter((p) => p.isFeatured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export function getBestSellers(limit = 10): Product[] {
  const bestSellers = products.filter((p) => p.isBestSeller);
  return (bestSellers.length > 0 ? bestSellers : products).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  const newArrivals = products.filter((p) => p.isNew);
  return (newArrivals.length > 0 ? newArrivals : products).slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

