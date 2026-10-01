import { Product } from '@/lib/types';
import { resolveImageUrl } from '@/lib/utils';

export const products: Product[] = [
  {
    "id": "168",
    "dbId": 168,
    "slug": "banana-powder",
    "name": "Pure Banana Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 590,
    "compareAtPrice": 650,
    "rating": 4.9,
    "reviewCount": 28,
    "image": "/products/banana-powder.jpg",
    "images": [
      "/products/banana-powder.jpg",
      "/products/posters/banana-powder-ad-2k.jpg",
      "/products/posters/banana-powder-scene-1.jpg",
      "/products/posters/banana-powder-scene-2.jpg"
    ],
    "description": "Nature's Mud Pure Banana Powder is crafted from 100% naturally ripened and sun-dried bananas. Packed with natural potassium, dietary fiber, and essential vitamins. Zero added sugar, zero preservatives, zero artificial additives. Perfectly suited for baby porridge, weaning, morning smoothies, pancake batters, oatmeal, and quick healthy energy drinks.",
    "shortDescription": "100% Natural & Pure Himalayan Banana Powder. Natural energy booster, supports digestion and child growth.",
    "badges": [
      "new",
      "featured"
    ],
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 650,
    "ingredients": [
      "100% Pure & Natural Himalayan Bananas"
    ],
    "benefits": [
      "Natural Energy Booster for active children & fitness lovers",
      "Supports healthy digestion and gentle gut motility",
      "Rich in dietary potassium and natural vitamins",
      "Zero added sugars, zero chemicals, zero preservatives",
      "Ideal wholesome weaning food for babies & toddlers"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "346 kcal / 100g"
      },
      {
        "label": "Potassium",
        "value": "1,150 mg"
      },
      {
        "label": "Carbohydrates",
        "value": "88g"
      },
      {
        "label": "Dietary Fiber",
        "value": "6.8g"
      },
      {
        "label": "Protein",
        "value": "3.9g"
      }
    ],
    "usage": "Mix 1-2 scoops into warm milk, oatmeal, porridge, smoothies, or baking recipes.",
    "storage": "Store in a cool, dry place. Seal lid tightly after every use to prevent moisture clumping.",
    "isFeatured": true,
    "isBestSeller": false,
    "tags": [
      "banana",
      "banana-powder",
      "energy",
      "baby-food",
      "superfood",
      "powders"
    ]
  },
  {
    "id": "169",
    "dbId": 169,
    "slug": "moringa-leaf-powder",
    "name": "Organic Moringa Leaf Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 690,
    "compareAtPrice": 750,
    "rating": 4.9,
    "reviewCount": 36,
    "image": "/products/moringa-leaf-powder.jpg",
    "images": [
      "/products/moringa-leaf-powder.jpg",
      "/products/posters/moringa-leaf-advertising-2k.jpg",
      "/products/posters/moringa-leaf-social-template-2k.jpg",
      "/products/posters/moringa-powder-leaves-2k.jpg",
      "/products/posters/moringa-powder-jar-2k.jpg"
    ],
    "description": "Handpicked from shade-dried organic Himalayan Moringa oleifera leaves, Nature's Mud Pure Moringa Leaf Powder is nature's most nutrient-rich miracle tree food. Packed with 90+ nutrients, 46 antioxidants, and all 9 essential amino acids. 100% natural, kosher, gluten-free, and additive-free. Enhances natural vitality, skin radiance, and immune defense.",
    "shortDescription": "Pure Natural Leaf Moringa Powder. Himalayan superfood powerhouse delivering pure, real nutrition in every scoop.",
    "badges": [
      "new",
      "featured",
      "organic"
    ],
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 750,
    "ingredients": [
      "100% Pure Organic Moringa Oleifera Leaves"
    ],
    "benefits": [
      "Over 90 bio-available nutrients and 46 natural antioxidants",
      "Rich in iron, plant-based calcium, and Vitamin A & C",
      "Natural detoxifier supporting metabolic and liver vitality",
      "100% Natural, Kosher, Gluten-Free, and zero additives",
      "Boosts immune resilience and sustained cellular energy"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "305 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "27g"
      },
      {
        "label": "Iron",
        "value": "28.2 mg (156% DV)"
      },
      {
        "label": "Calcium",
        "value": "2,003 mg (200% DV)"
      },
      {
        "label": "Dietary Fiber",
        "value": "19.2g"
      }
    ],
    "usage": "Stir 1 teaspoon (3-5g) into warm water with lemon, green tea, fresh juice, or your daily morning smoothie.",
    "storage": "Keep tightly sealed in a cool, dark and dry place away from direct sunlight.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "moringa",
      "moringa-powder",
      "immunity",
      "detox",
      "superfood",
      "powders"
    ]
  },
  {
    "id": "170",
    "dbId": 170,
    "slug": "freeze-dried-avocado-powder",
    "name": "Freeze Dried Avocado Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 790,
    "compareAtPrice": 790,
    "rating": 5,
    "reviewCount": 24,
    "image": "/products/avocado-powder.jpg",
    "images": [
      "/products/avocado-powder.jpg",
      "/products/avocado-powder-square.jpg",
      "/products/nm-avocado-powder-new.jpg",
      "/products/freeze-dried-avocado-powder.jpg"
    ],
    "description": "Proudly harvested and crafted in Nepal! Nature's Mud Freeze Dried Avocado Powder preserves the rich buttery texture and heart-healthy monounsaturated fats of fresh avocados. Processed with advanced gentle freeze-drying technology to preserve raw cellular nutrients, natural potassium, Vitamin E, and dietary fiber. 100% natural, no sugar, no preservatives.",
    "shortDescription": "Single-origin Product of Nepal. Real fruit lasting goodness, slow freeze-dried to perfection with nutrient-dense healthy fats.",
    "badges": [
      "new",
      "featured",
      "nepal"
    ],
    "stock": 50,
    "weight": "80 GM",
    "packing": "Glass Jar",
    "mrp": 790,
    "ingredients": [
      "100% Pure Freeze-Dried Fresh Himalayan Avocados"
    ],
    "benefits": [
      "Proud Product of Nepal 🇳🇵 crafted from premium mountain avocados",
      "Rich in heart-healthy monounsaturated fatty acids (Omega-9)",
      "Nutrient-dense with high dietary fiber and active enzymes",
      "Slow dried to perfection to protect raw antioxidants & Vitamin E",
      "Effortless gourmet avocado crema, keto shakes, dressings & dips"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "580 kcal / 100g"
      },
      {
        "label": "Healthy Fats",
        "value": "52g (Monounsaturated)"
      },
      {
        "label": "Dietary Fiber",
        "value": "28g"
      },
      {
        "label": "Potassium",
        "value": "980 mg"
      },
      {
        "label": "Vitamin E",
        "value": "4.5 mg"
      }
    ],
    "usage": "Whisk 2 tablespoons with warm water and lemon juice for instant guacamole or avocado toast, or add into keto smoothies.",
    "storage": "Reseal ziplock immediately after opening. Store in a cool, dry pantry.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "avocado",
      "avocado-powder",
      "freeze-dried",
      "healthy-fats",
      "keto",
      "powders",
      "nepal"
    ]
  },
  {
    "id": "171",
    "dbId": 171,
    "slug": "strawberry-powder",
    "name": "Pure Natural Strawberry Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 1395,
    "compareAtPrice": 1395,
    "rating": 4.9,
    "reviewCount": 31,
    "image": "/products/strawberry-powder.jpg",
    "images": [
      "/products/strawberry-powder.jpg",
      "/products/strawberry-powder-square.jpg",
      "/products/nm-strawberry-powder-new.jpg"
    ],
    "description": "Indulge in the pure aroma and vibrant ruby color of whole Himalayan strawberries. Nature's Mud Strawberry Powder delivers pure goodness from ripe strawberries gently dehydrated at low temperatures to protect natural polyphenols, Vitamin C, and luscious berry flavor. 100% natural, rich in nutrients, zero artificial color, zero synthetic flavor.",
    "shortDescription": "Pure Goodness from Strawberries for a brighter, healthier tomorrow. High Vitamin C & anthocyanin antioxidants.",
    "badges": [
      "new",
      "featured"
    ],
    "stock": 50,
    "weight": "80 GM",
    "packing": "Glass Jar",
    "mrp": 1395,
    "ingredients": [
      "100% Pure Whole Natural Strawberries"
    ],
    "benefits": [
      "Potent antioxidant defense rich in natural Vitamin C and anthocyanins",
      "Supports glowing skin, collagen synthesis, and immune health",
      "100% whole real fruit with authentic luscious berry aroma",
      "No artificial colors, no preservatives, no added refined sugar",
      "Sensational in smoothie bowls, chia puddings, ice creams, and yogurt"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "325 kcal / 100g"
      },
      {
        "label": "Vitamin C",
        "value": "310 mg (340% DV)"
      },
      {
        "label": "Carbohydrates",
        "value": "75g"
      },
      {
        "label": "Dietary Fiber",
        "value": "14g"
      },
      {
        "label": "Natural Sugars",
        "value": "Pure Fruit Sugar (0g Added)"
      }
    ],
    "usage": "Blend 1-2 teaspoons into your yogurt bowls, pancake mixes, herbal teas, or post-workout berry protein shakes.",
    "storage": "Keep lid tightly sealed in a dry, cool area away from heat and moisture.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "strawberry",
      "strawberry-powder",
      "antioxidant",
      "vitamin-c",
      "superfood",
      "powders"
    ]
  },
  {
    "id": "172",
    "dbId": 172,
    "slug": "dry-figs-anjeer",
    "name": "Premium Dry Figs (Anjeer)",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 850,
    "compareAtPrice": 990,
    "rating": 5,
    "reviewCount": 42,
    "image": "/products/dry-figs-anjeer.jpg",
    "images": [
      "/products/dry-figs-anjeer.jpg",
      "/products/posters/dry-figs-advertisement-2k.jpg",
      "/products/posters/dry-figs-product-photo-2k.jpg",
      "/products/posters/dry-figs-flat-lay-2k.jpg",
      "/products/dried-figs.jpg"
    ],
    "description": "Nature's Mud Premium Dry Figs (Anjeer) are hand-selected, plump, sun-ripened mountain figs with a delightfully chewy texture and natural honeyed sweetness. Renowned in Ayurveda for their exceptional soluble fiber, iron, calcium, and digestive wellness qualities. 100% natural, chemical-free, unsulphured, and packed in luxury protective jars.",
    "shortDescription": "100% Natural Premium Quality Dry Figs (Anjeer). Rich in fiber & minerals, nature's goodness in every bite.",
    "badges": [
      "new",
      "featured",
      "premium"
    ],
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 990,
    "ingredients": [
      "100% Selected Sun-Dried Natural Figs (Anjeer)"
    ],
    "benefits": [
      "Superior soluble and insoluble dietary fiber for smooth digestive health",
      "Rich source of natural iron to support healthy hemoglobin levels",
      "High in bone-strengthening calcium and potassium for heart vitality",
      "100% Natural, unsulphured, and free from preservatives",
      "Natural stamina food recommended for morning soaking rituals"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "249 kcal / 100g"
      },
      {
        "label": "Dietary Fiber",
        "value": "9.8g (39% DV)"
      },
      {
        "label": "Calcium",
        "value": "162 mg (16% DV)"
      },
      {
        "label": "Iron",
        "value": "2.0 mg (11% DV)"
      },
      {
        "label": "Potassium",
        "value": "680 mg (14% DV)"
      }
    ],
    "usage": "Eat 2-3 dried figs directly as a premium snack, or soak overnight in water and consume in the morning for optimal gut health.",
    "storage": "Store in an airtight jar in a cool, dry place or refrigerate for maximum freshness.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "figs",
      "anjeer",
      "dry-figs",
      "fiber",
      "calcium",
      "dried-fruits",
      "premium"
    ]
  },
  {
    "id": "166",
    "dbId": 166,
    "slug": "makhana-fox-nuts",
    "name": "Makhana (Fox Nuts)",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 390,
    "compareAtPrice": 500,
    "rating": 4.8,
    "reviewCount": 12,
    "image": "/products/nm-makhana-jar.jpeg",
    "images": [
      "/products/nm-makhana-jar.jpeg",
      "/products/posters/makhana-fox-nuts-surrounded-2k.jpg",
      "/products/fox-nuts-jar-2k.jpg"
    ],
    "description": "Premium Himalayan Fox Nuts (Makhana). A healthy, crunchy, and lightweight snack loaded with antioxidants, calcium, and protein. Enjoy guilt-free snacking with these beautifully puffed lotus seeds.",
    "shortDescription": "Crunchy and lightweight Himalayan Fox Nuts (Makhana) for healthy snacking.",
    "badges": [
      "new"
    ],
    "stock": 50,
    "weight": "50 GM",
    "packing": "Glass Jar",
    "mrp": 500,
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
    "dbId": 1,
    "slug": "dehydrated-mango",
    "name": "Dehydrated Mango",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 595,
    "compareAtPrice": 597,
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "mrp": 595,
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
    "dbId": 157,
    "slug": "dehydrated-pineapple",
    "name": "Dehydrated Pineapple",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 495,
    "compareAtPrice": 495,
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "mrp": 495,
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
    "dbId": 3,
    "slug": "dehydrated-apple",
    "name": "Dehydrated Apple",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 510,
    "compareAtPrice": 510,
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "mrp": 510,
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
    "isFeatured": true,
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
    "dbId": 156,
    "slug": "dehydrated-coconut-chips",
    "name": "Dehydrated Coconut Chips",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 475,
    "compareAtPrice": 500,
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Standup Ziplock Pouch",
    "mrp": 495,
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
    "isFeatured": true,
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
    "dbId": 22,
    "slug": "dehydrated-papaya",
    "name": "Dehydrated Papaya",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 395,
    "compareAtPrice": 395,
    "rating": 4.9,
    "reviewCount": 54,
    "image": "/products/nm-papaya-flat.jpeg",
    "images": [
      "/products/nm-papaya-flat.jpeg",
      "/products/posters/papaya-pouch-fruit-2k.jpg",
      "/products/posters/papaya-orange-bg-2k.jpg",
      "/products/posters/papaya-social-template-2k.jpg",
      "/products/papaya-2.jpg"
    ],
    "description": "Chewy, naturally sweet papaya spears gently dehydrated below 42°C to preserve live digestive enzymes (papain), vitamin C, and fiber. 0 additives, 0 preservatives, and no artificial colors.",
    "shortDescription": "Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking in a 90g Standup Ziplock Pouch.",
    "badges": [
      "bestseller"
    ],
    "stock": 50,
    "weight": "90 GM",
    "packing": "Standup Ziplock Pouch",
    "mrp": 395,
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
    "dbId": 4,
    "slug": "dried-blueberries",
    "name": "Dried Blueberries",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 650,
    "compareAtPrice": 650,
    "rating": 5,
    "reviewCount": 78,
    "image": "/products/nm-blueberry-jar.jpeg",
    "images": [
      "/products/nm-blueberry-jar.jpeg",
      "/products/posters/blueberries-flowers-2k.jpg",
      "/products/posters/blueberries-jar-2k.jpg",
      "/products/posters/blueberries-surrounded-2k.jpg",
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 650,
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
    "dbId": 155,
    "slug": "dried-cranberries",
    "name": "Dried Cranberries",
    "category": "Dried Fruits",
    "categorySlug": "dried-fruits",
    "price": 415,
    "compareAtPrice": 415,
    "rating": 4.8,
    "reviewCount": 49,
    "image": "/products/nm-cranberry-jar.jpeg",
    "images": [
      "/products/nm-cranberry-jar.jpeg",
      "/products/posters/cranberries-juice-splash-2k.jpg",
      "/products/posters/cranberries-roses-flat-2k.jpg",
      "/products/posters/cranberries-social-template-2k.jpg",
      "/products/posters/cranberries-jar-bg-2k.jpg",
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 415,
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
    "dbId": 6,
    "slug": "dates-powder",
    "name": "Dates Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 400,
    "compareAtPrice": 400,
    "rating": 4.9,
    "reviewCount": 84,
    "image": "/products/nm-dates-jar.jpeg",
    "images": [
      "/products/nm-dates-jar.jpeg",
      "/products/posters/dates-powder-on-wood-2k.jpg",
      "/products/posters/dates-powder-roses-2k.jpg",
      "/products/posters/dates-powder-social-2k.jpg",
      "/products/posters/dates-powder-jar-2k.jpg",
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 400,
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
    "dbId": 5,
    "slug": "beetroot-powder",
    "name": "Beetroot Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 430,
    "compareAtPrice": 430,
    "rating": 4.9,
    "reviewCount": 62,
    "image": "/products/nm-beetroot-jar.jpeg",
    "images": [
      "/products/nm-beetroot-jar.jpeg",
      "/products/posters/beetroot-powder-explosion-2k.jpg",
      "/products/posters/beetroot-powder-social-2k.jpg",
      "/products/posters/beetroot-powder-studio-2k.jpg",
      "/products/posters/beetroot-powder-flat-2k.jpg",
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 430,
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
    "dbId": 14,
    "slug": "himalayan-pink-salt",
    "name": "Himalayan Pink Salt",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 250,
    "compareAtPrice": 250,
    "rating": 4.8,
    "reviewCount": 46,
    "image": "/products/nm-pink-salt-jar.jpeg",
    "images": [
      "/products/nm-pink-salt-jar.jpeg",
      "/products/posters/pink-salt-crystals-roses-2k.jpg",
      "/products/posters/pink-salt-flat-2k.jpg",
      "/products/client-authentic-label-1.jpg",
      "/products/pink-salt-crystals.jpg",
      "/products/pink-salt-moss.jpg"
    ],
    "description": "Unrefined ancient Himalayan pink rock salt crystallized over 250 million years ago. Packed with 84+ bioavailable ionic trace minerals including magnesium, calcium, and potassium with zero microplastics, chemical bleaches, or anti-caking agents.",
    "shortDescription": "Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a 200g Glass Jar.",
    "badges": [
      "organic"
    ],
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 250,
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
    "isFeatured": true,
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
    "dbId": 15,
    "slug": "pure-himalayan-black-salt-bire-noon",
    "name": "Himalayan Black Salt (Bire Noon)",
    "category": "Salts & Spices",
    "categorySlug": "salts-spices",
    "price": 220,
    "compareAtPrice": 220,
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
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 220,
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
    "dbId": 7,
    "slug": "chia-seeds",
    "name": "Organic Chia Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 495,
    "compareAtPrice": 495,
    "rating": 4.9,
    "reviewCount": 65,
    "image": "/products/nm-chia-jar.jpeg",
    "images": [
      "/products/nm-chia-jar.jpeg",
      "/products/posters/chia-seeds-flowers-2k.jpg",
      "/products/posters/chia-seeds-purple-2k.jpg",
      "/products/posters/chia-seeds-swirl-2k.jpg",
      "/products/nm-chia-ad.jpeg",
      "/products/nm-chia-ad2.jpeg",
      "/products/nm-chia-display.jpeg",
      "/products/nm-chia-studio.jpeg",
      "/products/chia-seeds.jpg"
    ],
    "description": "Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein. Hydrophilic seeds that expand up to 10x in liquids to support steady hydration, weight balance, and gut motility.",
    "shortDescription": "Whole organic black chia seeds loaded with plant-based Omega-3 ALA, soluble fiber, calcium, and clean plant protein in a 300g Plastic Jar.",
    "badges": [
      "bestseller",
      "organic"
    ],
    "stock": 50,
    "weight": "300 GM",
    "packing": "Plastic Jar",
    "mrp": 495,
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
    "dbId": 8,
    "slug": "pumpkin-seeds",
    "name": "Raw Pumpkin Seeds",
    "category": "Seeds",
    "categorySlug": "seeds",
    "price": 650,
    "compareAtPrice": 650,
    "rating": 4.9,
    "reviewCount": 57,
    "image": "/images/posters/pure-pumpkin-seeds.jpg",
    "images": [
      "/images/posters/pure-pumpkin-seeds.jpg",
      "/products/posters/pumpkin-seeds-ad-2k.jpg",
      "/products/posters/pumpkin-seeds-flat-lay-2k.jpg",
      "/products/posters/pumpkin-seeds-social-2k.jpg",
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
    "stock": 50,
    "weight": "300 GM",
    "packing": "Plastic Jar",
    "mrp": 650,
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
    "dbId": 161,
    "slug": "premium-cashewnuts",
    "name": "Premium Cashew Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "rating": 4.9,
    "reviewCount": 53,
    "image": "/products/nm-cashew-new-jar.jpg",
    "images": [
      "/products/nm-cashew-new-jar.jpg",
      "/products/nm-cashew-jar2.jpeg",
      "/products/authentic-cashewnuts-roasted.jpg",
      "/products/cashewnuts-roasted.jpg"
    ],
    "description": "Handpicked whole jumbo W240 grade cashew nuts, delightfully sweet, buttery, and crunch-packed. Rich in copper, magnesium, plant protein, and heart-healthy oleic acid for bone strength, energy metabolism, and cardiac wellness.",
    "shortDescription": "Jumbo whole grade cashewnuts with a rich buttery crunch and heart-healthy fats in a 200g Glass Jar.",
    "badges": [
      "popular"
    ],
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 750,
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
    "dbId": 11,
    "slug": "roasted-cashewnuts",
    "name": "Roasted Himalayan Cashew Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "rating": 4.8,
    "reviewCount": 39,
    "image": "/products/nm-roasted-cashew-new.jpg",
    "images": [
      "/products/nm-roasted-cashew-new.jpg",
      "/products/posters/cashews-cream-bg-2k.jpg",
      "/products/posters/cashews-tropical-leaves-2k.jpg",
      "/products/nm-cashew-jar2.jpeg",
      "/products/authentic-cashewnuts-roasted.jpg",
      "/products/cashewnuts-roasted.jpg"
    ],
    "description": "Artisan slow-roasted golden cashew nuts roasted without added oils or synthetic flavor enhancers. Delicate toasty aroma with an irresistible crisp snap, delivering pure wholesome nut satisfaction.",
    "shortDescription": "Dry-roasted crunchy cashews packed with minerals and natural savory flavor in a 150g Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 50,
    "weight": "150 GM",
    "packing": "Glass Jar",
    "mrp": 750,
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
    "isFeatured": true,
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
    "dbId": 9,
    "slug": "roasted-almonds",
    "name": "Roasted Himalayan Almonds",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
    "rating": 4.9,
    "reviewCount": 66,
    "image": "/products/nm-almond-jar.jpeg",
    "images": [
      "/products/nm-almond-jar.jpeg",
      "/products/posters/almonds-explosion-2k.jpg",
      "/products/posters/almonds-surrounded-2k.jpg",
      "/products/authentic-almonds.jpg",
      "/products/almonds.jpg",
      "/products/almonds-2.jpg"
    ],
    "description": "Crispy slow-roasted mountain almonds sealed in a glass jar for maximum crunch and flavor. Exceptionally rich in Vitamin E, plant protein, dietary fiber, and heart-protective monounsaturated fatty acids.",
    "shortDescription": "Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 200g Glass Jar.",
    "badges": [
      "bestseller"
    ],
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 750,
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
    "dbId": 10,
    "slug": "raw-himalayan-almonds",
    "name": "Raw Himalayan Almonds",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 750,
    "compareAtPrice": 750,
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
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 750,
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
    "isFeatured": false,
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
    "dbId": 162,
    "slug": "premium-pistachios",
    "name": "Premium Roasted Pistachios",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 820,
    "compareAtPrice": 820,
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
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 820,
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
    "isFeatured": true,
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
    "dbId": 12,
    "slug": "superfood-trail-mix",
    "name": "Superfood Trail Mix (Nuts & Seeds)",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 790,
    "compareAtPrice": 790,
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
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 790,
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
    "dbId": 159,
    "slug": "macadamia-nuts",
    "name": "Macadamia Nuts",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 1100,
    "compareAtPrice": 1100,
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
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 1100,
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
    "isFeatured": true,
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
    "dbId": 154,
    "slug": "virgin-coconut-oil-500ml",
    "name": "Cold-Pressed Extra Virgin Coconut Oil (500ml)",
    "category": "Oils",
    "categorySlug": "oils",
    "price": 1750,
    "compareAtPrice": 1750,
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
    "stock": 50,
    "weight": "500 ML",
    "packing": "Glass Bottle",
    "mrp": 1750,
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
    "dbId": 153,
    "slug": "virgin-coconut-oil-180ml",
    "name": "Cold-Pressed Extra Virgin Coconut Oil (180 GM)",
    "category": "Oils",
    "categorySlug": "oils",
    "price": 650,
    "compareAtPrice": 650,
    "rating": 4.9,
    "reviewCount": 52,
    "image": "/products/coconut-oil.jpg",
    "images": [
      "/products/coconut-oil.jpg",
      "/products/coconut-oil-product.jpg"
    ],
    "description": "Compact handy glass jar of 100% raw cold-pressed extra virgin coconut oil. Perfectly sized for daily facial skincare, Ayurvedic morning oil pulling, desk moisturizer, travel, and infant skin nourishing.",
    "shortDescription": "Raw unrefined wood cold-pressed extra virgin coconut oil rich in Lauric acid in a 180 GM Glass Bottle.",
    "badges": [
      "cold-pressed"
    ],
    "stock": 50,
    "weight": "180 GM",
    "packing": "Glass Bottle",
    "mrp": 650,
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
    "isFeatured": true,
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
    "dbId": 27,
    "slug": "carrot-powder",
    "name": "Carrot Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 490,
    "compareAtPrice": 550,
    "rating": 4.8,
    "reviewCount": 38,
    "image": "/products/nm-carrot-jar.jpeg",
    "images": [
      "/products/nm-carrot-jar.jpeg",
      "/products/posters/carrot-powder-explosion-2k.jpg",
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 440,
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
    "isFeatured": true,
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
    "dbId": 24,
    "slug": "sweet-potato-powder",
    "name": "Sweet Potato Powder",
    "category": "Powders",
    "categorySlug": "powders",
    "price": 510,
    "compareAtPrice": 600,
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
    "stock": 50,
    "weight": "100 GM",
    "packing": "Glass Jar",
    "mrp": 420,
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
    "dbId": 40,
    "slug": "pure-mountain-himalayan-shilajit-resin",
    "name": "Pure Mountain Shilajit Resin",
    "category": "Ayurveda",
    "categorySlug": "ayurveda",
    "price": 1995,
    "compareAtPrice": 1995,
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
    "mrp": 1995,
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
  },
  {
    "id": "8",
    "slug": "premium-coconut-oil",
    "name": "Raw Pumpkin Seeds",
    "categorySlug": "seeds-mix",
    "price": 650,
    "compareAtPrice": 650,
    "rating": 5,
    "reviewCount": 18,
    "image": "/products/pumpkin-seeds.jpg",
    "images": [
      "/products/pumpkin-seeds.jpg",
      "/products/pumpkin-seeds-2.jpg",
      "/products/pumpkin-seeds-product-shot.jpg"
    ],
    "description": "Raw AAA-grade dark-green pumpkin seed kernels (pepitas). One of the richest dietary sources of natural bioavailable Zinc, Magnesium, Tryptophan, and antioxidants for deep sleep, prostate health, and immune defense.",
    "shortDescription": "Raw zinc and magnesium rich pepitas for immune strength, sleep quality & hormone balance in a 300g Plastic Jar.",
    "badges": [
      "organic",
      "bestseller"
    ],
    "stock": 50,
    "weight": "300.00",
    "ingredients": [
      "Premium Coconut Oil"
    ],
    "benefits": [
      "100% Natural",
      "Rich in nutrients",
      "No artificial colors",
      "No added sugar"
    ],
    "nutrition": [
      {
        "label": "Energy",
        "value": "350 kcal"
      },
      {
        "label": "Protein",
        "value": "4g"
      }
    ],
    "storage": "Keep in an airtight container away from direct sunlight.",
    "isFeatured": true,
    "category": "Seeds",
    "usage": "Add 1-2 teaspoons to warm water, milk, smoothies, or recipes.",
    "isBestSeller": false,
    "tags": [
      "premium-coconut-oil"
    ]
  },
  {
    "id": "18",
    "slug": "flaxseed-crackers",
    "name": "Raw Almond",
    "categorySlug": "superfood-powders",
    "price": 570,
    "compareAtPrice": 600,
    "rating": 5,
    "reviewCount": 18,
    "image": "/products/flax-seeds.jpg",
    "images": [
      "/products/flax-seeds.jpg"
    ],
    "description": "Whole raw brown flax seeds loaded with dietary soluble and insoluble fiber.",
    "shortDescription": "Whole raw flax seeds packed with lignans, alpha-linolenic acid (Omega-3) & fiber.",
    "badges": [
      "organic",
      "bestseller"
    ],
    "stock": 50,
    "weight": "200.00",
    "ingredients": [
      "Flaxseed Crackers"
    ],
    "benefits": [
      "100% Natural",
      "Rich in nutrients",
      "No artificial colors",
      "No added sugar"
    ],
    "nutrition": [
      {
        "label": "Energy",
        "value": "350 kcal"
      },
      {
        "label": "Protein",
        "value": "4g"
      }
    ],
    "storage": "Keep in an airtight container away from direct sunlight.",
    "isFeatured": false,
    "category": "Powders",
    "usage": "Add 1-2 teaspoons to warm water, milk, smoothies, or recipes.",
    "isBestSeller": false,
    "tags": [
      "flaxseed-crackers"
    ]
  },
  {
    "id": "200",
    "dbId": 200,
    "slug": "premium-pistachio-roasted-salted",
    "name": "Premium Pistachio Roasted & Salted",
    "category": "Nuts",
    "categorySlug": "nuts",
    "price": 1250,
    "compareAtPrice": 1400,
    "rating": 4.9,
    "reviewCount": 31,
    "image": "/products/nm-pistachio-jar.jpg",
    "images": [
      "/products/nm-pistachio-jar.jpg",
      "/products/pistachios.jpg"
    ],
    "description": "Handpicked premium Afghan & Himalayan pistachios, slow-roasted to a perfect golden crunch and lightly seasoned with pure Himalayan pink salt. Naturally rich in Vitamin B6, potassium, antioxidants, and heart-healthy monounsaturated fats. Each kernel is carefully shelled-open for freshness and packed in an airtight glass jar to preserve crispness.",
    "shortDescription": "Crunchy roasted & salted pistachios packed with antioxidants, Vitamin B6 & healthy fats in a 200g Glass Jar.",
    "badges": [
      "popular",
      "bestseller"
    ],
    "stock": 50,
    "weight": "200 GM",
    "packing": "Glass Jar",
    "mrp": 1400,
    "ingredients": [
      "100% Premium Pistachio Nuts (Roasted)",
      "Himalayan Pink Salt (trace)"
    ],
    "benefits": [
      "Rich in Vitamin B6 for nerve function and immune health",
      "High in potassium and antioxidants for heart wellness",
      "One of the lowest-calorie nuts with the highest protein content",
      "Natural lutein and zeaxanthin for sharp eye health",
      "Slow-roasted without oils — crispy, light, and wholesome"
    ],
    "nutrition": [
      {
        "label": "Calories",
        "value": "562 kcal / 100g"
      },
      {
        "label": "Protein",
        "value": "20.6g"
      },
      {
        "label": "Healthy Fats",
        "value": "45.3g"
      },
      {
        "label": "Dietary Fiber",
        "value": "10.6g"
      },
      {
        "label": "Potassium",
        "value": "1025mg"
      },
      {
        "label": "Vitamin B6",
        "value": "85% DV"
      }
    ],
    "usage": "Snack straight from the jar, sprinkle over yogurt, desserts, or Middle Eastern rice dishes. Perfect as a trail mix base.",
    "storage": "Store in an airtight glass jar in a cool, dry place away from moisture and direct sunlight.",
    "isFeatured": true,
    "isBestSeller": true,
    "tags": [
      "pistachio",
      "pistachios",
      "roasted-nuts",
      "salted-nuts",
      "nuts",
      "healthy-snack",
      "pista",
      "antioxidant",
      "heart-health"
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

function formatProductWeight(val: any, rawUnit?: string, fallbackWeight?: string): string {
  if (val !== undefined && val !== null && String(val).trim() !== '') {
    const str = String(val).trim();
    if (/^\d+(\.\d+)?$/.test(str)) {
      const num = Math.round(Number(str));
      const u = rawUnit ? String(rawUnit).trim().toUpperCase() : '';
      if (u === 'G' || u === 'GM' || u === 'GRAM' || u === 'GRAMS') return `${num} GM`;
      if (u === 'KG') return `${num} KG`;
      if (u === 'ML') return `${num} ML`;
      if (u === 'L' || u === 'LTR') return `${num} L`;
      if (u) return `${num} ${u}`;
      if (fallbackWeight) {
        const match = fallbackWeight.match(/[a-zA-Z]+/);
        if (match) return `${num} ${match[0].toUpperCase()}`;
      }
      return `${num} GM`;
    }
    return str;
  }
  return fallbackWeight || '100 GM';
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

  const rawImages = Array.isArray(raw.images) && raw.images.length > 0
    ? raw.images.map((img: any) => resolveImageUrl(typeof img === 'string' ? img : (img.url || img.image_url || img.path || ''))).filter(Boolean)
    : (raw.image ? [resolveImageUrl(raw.image)] : (local?.images || [resolveImageUrl('/products/naturesmud-all-products-100g.jpg')]));

  const rawPrimaryImage = resolveImageUrl(raw.image || (rawImages.length > 0 ? rawImages[0] : null) || local?.image || '/products/naturesmud-all-products-100g.jpg');

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
    rating: Number(raw.rating || raw.rating_avg || local?.rating || 4.9),
    reviewCount: Number(raw.reviewCount || raw.rating_count || raw.reviews_count || local?.reviewCount || 24),
    image: rawPrimaryImage,
    images: rawImages.length > 0 ? rawImages : [rawPrimaryImage],
    description: raw.description || local?.description || '',
    shortDescription: raw.shortDescription || raw.short_description || local?.shortDescription || '',
    badges: Array.isArray(raw.badges) ? raw.badges : (local?.badges || []),
    stock: raw.stock !== undefined ? Number(raw.stock) : (raw.stock_quantity !== undefined ? Number(raw.stock_quantity) : (local?.stock ?? 100)),
    weight: formatProductWeight(raw.weight, raw.unit, local?.weight),
    packing: raw.packing || local?.packing || 'Standup Ziplock Pouch',
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : (local?.ingredients || []),
    benefits: Array.isArray(raw.benefits) ? raw.benefits : (local?.benefits || []),
    nutrition: Array.isArray(raw.nutrition) ? raw.nutrition : (local?.nutrition || []),
    usage: raw.usage || local?.usage || '',
    storage: raw.storage || local?.storage || '',
    isFeatured: (raw.isFeatured !== undefined || raw.is_featured !== undefined)
      ? Boolean(
          raw.isFeatured === true ||
          raw.isFeatured === 1 ||
          raw.isFeatured === '1' ||
          raw.isFeatured === 'true' ||
          raw.is_featured === true ||
          raw.is_featured === 1 ||
          raw.is_featured === '1' ||
          raw.is_featured === 'true'
        )
      : Boolean(local?.isFeatured),
    isBestSeller: Boolean(raw.isBestSeller ?? raw.is_bestseller ?? local?.isBestSeller),
    isActive: (raw.isActive !== undefined || raw.is_active !== undefined || raw.status !== undefined)
      ? (
          raw.isActive !== undefined
            ? Boolean(raw.isActive === true || raw.isActive === 1 || raw.isActive === '1' || raw.isActive === 'true')
            : raw.is_active !== undefined
            ? (Number(raw.is_active) === 1 || raw.is_active === true || raw.is_active === '1')
            : String(raw.status).trim().toUpperCase() === 'ACTIVE'
        )
      : true,
    isPublished: (raw.isPublished !== undefined || raw.is_active !== undefined)
      ? (
          raw.isPublished !== undefined
            ? Boolean(raw.isPublished === true || raw.isPublished === 1 || raw.isPublished === '1' || raw.isPublished === 'true')
            : (Number(raw.is_active) === 1 || raw.is_active === true || raw.is_active === '1')
        )
      : true,
    tags: Array.isArray(raw.tags) ? raw.tags : (local?.tags || []),
  };
}



