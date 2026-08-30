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
    "price": 350,
    "compareAtPrice": 350,
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
