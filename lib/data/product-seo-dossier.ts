export interface ProductVariantLink {
  slug: string;
  label: string;
  weight: string;
  price: number;
  badge?: string;
}

export interface ProductComparisonRow {
  feature: string;
  naturesMud: string;
  typicalMarket: string;
}

export interface ProductFaqItem {
  q: string;
  a: string;
}

export interface ProductSeoDossier {
  slug: string;
  /** Max 60 chars: "{Label name} Price in Nepal | {benefit} | NaturesMud" */
  seoTitle: string;
  /** Max 155 chars: weight, price, delivery, one differentiator */
  metaDescription: string;
  nepaliNameDevanagari: string;
  nepaliNameRoman: string;
  originBelt: string;
  shelfLife: string;
  whatItIs: string;
  nepaliKitchenUses: string[];
  whoItSuits: string;
  monsoonStorage: string;
  comparisonTitle: string;
  comparisonRows: ProductComparisonRow[];
  faqs: ProductFaqItem[];
  complementarySlugs: string[];
  variantGroupTitle?: string;
  variants?: ProductVariantLink[];
}

export const PRODUCT_SEO_DOSSIERS: Record<string, ProductSeoDossier> = {
  'banana-powder': {
    slug: 'banana-powder',
    seoTitle: 'Banana Powder Price in Nepal | Baby Lito | NaturesMud',
    metaDescription: 'Buy Banana Powder (100 GM) at Rs. 650 in Nepal. 100% pure dehydrated banana with 0 added sugar for baby lito/jaulo & smoothies. Fast Kathmandu delivery.',
    nepaliNameDevanagari: 'केरा पाउडर',
    nepaliNameRoman: 'Kera Powder (Raw / Ripe Banana Powder)',
    originBelt: 'Chitwan & Nawalpur Terai Lowlands (150m–300m)',
    shelfLife: '12 months when sealed in a cool, dry cupboard',
    whatItIs:
      'NaturesMud Banana Powder is milled from 100% whole Nepali bananas harvested in the fertile alluvial plains of Chitwan and Nawalpur. Each batch is peeled by hand, thinly sliced, gently dehydrated in closed sanitary chambers below 45°C, and cold-milled into a fine, creamy flour. It contains zero maltodextrin, zero added white sugar, zero milk solids, and zero chemical preservatives.',
    nepaliKitchenUses: [
      'Infant Weaning Porridge (Lito / Jaulo): Whisk 1 to 1.5 teaspoons (5g–8g) into warm cooked rice jaulo, suji kheer, or ragi porridge after turning off the stove (from 6 months, as advised by your pediatrician).',
      'Morning Milk & Smoothie Thickener: Blend 1 tablespoon (10g) into warm milk, curd (dahi), or peanut-butter shakes for natural banana sweetness and potassium.',
      'Soft Roti & Pancake Batter: Mix 2 tablespoons into whole-wheat atta or oat batter to make naturally soft, lightly sweet banana pancakes for school tiffin.',
      'Post-Workout Shake Base: Combine 1 tablespoon with Roasted Almond paste and Dates Powder in milk or water for clean carbohydrate replenishment.',
    ],
    whoItSuits:
      'Suits infants starting solid foods (from 6 months, as advised by your pediatrician), toddlers needing calorie-dense tiffin meals, gym-goers seeking clean carbohydrates, and busy families wanting instant banana nutrition without fruit spoilage.',
    monsoonStorage:
      'Dehydrated banana powder is naturally hygroscopic (absorbs moisture from humid air). During Nepal’s monsoon months (Ashadh–Bhadra), keep the inner seal closed, tighten the glass jar lid immediately after scooping, always use a bone-dry steel spoon, and store away from stove steam.',
    comparisonTitle: 'NaturesMud Banana Powder vs Commercial Baby Cereal Mixes',
    comparisonRows: [
      {
        feature: 'Ingredients',
        naturesMud: '100% Pure Dehydrated Banana (Single Ingredient)',
        typicalMarket: 'Refined wheat flour, white sugar, maltodextrin & artificial banana flavor',
      },
      {
        feature: 'Added Refined Sugar',
        naturesMud: '0% Added Sugar (Natural fruit sugars only)',
        typicalMarket: 'Up to 25%–35% added sucrose or glucose syrup',
      },
      {
        feature: 'Preservatives & Fillers',
        naturesMud: '0% Preservatives, 0% Anti-caking chemicals',
        typicalMarket: 'Synthetic stabilizers and shelf-life extenders',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Banana Powder (केरा पाउडर) in Nepal?',
        a: 'NaturesMud Banana Powder (100 GM Glass Jar) costs Rs. 650 in Nepal (Rs. 650 per 100g). We deliver within 24–48 hours in Kathmandu Valley and 2–5 days across Nepal.',
      },
      {
        q: 'Can I give this Banana Powder to my 6-month-old baby (बच्चाको लिटोमा)?',
        a: 'Yes, it is 100% single-ingredient dehydrated banana with 0 added sugar and 0 preservatives, making it suitable for baby weaning porridges (lito/jaulo) from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'Kasari prayog garne? Does Banana Powder need to be cooked?',
        a: 'You can stir 1 teaspoon directly into warm milk, yogurt, or freshly cooked jaulo, or cook it gently for 2–3 minutes in water/milk to make a smooth porridge.',
      },
      {
        q: 'Why does pure Banana Powder sometimes clump in humid weather?',
        a: 'Because we use 0% chemical anti-caking agents (no silicon dioxide or starch fillers), natural fruit sugars can clump if exposed to humid monsoon air. Simply break any soft clump with a dry spoon.',
      },
      {
        q: 'How many servings are in one 100 GM jar of Banana Powder?',
        a: 'One 100 GM jar provides approximately 15 to 20 infant porridge servings (5g–6g per meal) or 10 adult smoothie servings (10g each).',
      },
    ],
    complementarySlugs: ['dates-powder', 'sweet-potato-powder', 'freeze-dried-avocado-powder'],
  },

  'moringa-leaf-powder': {
    slug: 'moringa-leaf-powder',
    seoTitle: 'Moringa Leaf Powder Price in Nepal | 100g | NaturesMud',
    metaDescription: 'Buy Moringa Leaf Powder (100 GM) at Rs. 690 in Nepal. 100% shade-dried Sajiwan/Sahijan leaves, 0 fillers. Fast delivery in Kathmandu, Pokhara & Nepal.',
    nepaliNameDevanagari: 'सजिवन / सहिजन पातको पाउडर (शीतलचिनी)',
    nepaliNameRoman: 'Sajiwan / Sahijan Paat Powder (Moringa Oleifera)',
    originBelt: 'Chitwan, Sarlahi & Mid-Hill River Valleys (200m–900m)',
    shelfLife: '12 months in an opaque or cupboard-stored airtight jar',
    whatItIs:
      'NaturesMud Moringa Leaf Powder is made exclusively from tender, hand-stripped green leaves of Moringa oleifera (known in Nepal as Sajiwan / सजिवन or Sahijan / सहिजन, and locally in parts of the hills as Shitalchini). We discard woody stems and stalks, gently shade-dry the washed leaves at low temperatures so chlorophyll turns vibrant emerald green rather than brown, and micro-mill them into a fine leaf powder.',
    nepaliKitchenUses: [
      'Everyday Dal & Tarkari Finisher: Stir 1/2 to 1 teaspoon (3g–5g) into cooked kalo dal, yellow mung dal, or mixed vegetable tarkari right before serving so heat does not dull its green nutrients.',
      'Morning Warm Lemon-Moringa Water: Whisk 1/2 teaspoon into a glass of lukewarm water with a squeeze of fresh lemon and a pinch of Himalayan Pink Salt.',
      'Green Roti & Paratha Dough: Knead 1 tablespoon into 2 cups of whole-wheat atta to prepare mineral-rich green rotis for the whole family.',
      'Savory Mohi (Buttermilk) & Curd: Blend 1/2 teaspoon into afternoon mohi or dahi with roasted jeera and Bire Noon.',
    ],
    whoItSuits:
      'Ideal for adults, working professionals, vegetarians seeking plant-based iron, calcium, and amino acids, elders wanting easy leafy-green nutrition without chewing fibrous greens, and families fortifying daily dal and roti.',
    monsoonStorage:
      'Chlorophyll and plant polyphenols are sensitive to direct sunlight and humidity. Store your Moringa Leaf Powder jar inside a dark kitchen cabinet away from windows and stove heat, and keep the lid tightly closed during monsoon months.',
    comparisonTitle: 'NaturesMud Moringa Leaf Powder vs Stem-Mixed Commercial Powders',
    comparisonRows: [
      {
        feature: 'Plant Part Used',
        naturesMud: '100% Tender Green Leaves Only (Stems discarded)',
        typicalMarket: 'Crushed stalks, petioles & yellowing old leaves',
      },
      {
        feature: 'Drying Method & Color',
        naturesMud: 'Controlled shade-drying -> Vibrant emerald green',
        typicalMarket: 'Harsh open sun-drying -> Dull brownish-olive color',
      },
      {
        feature: 'Additives',
        naturesMud: '0% Fillers, 0% Artificial Green Dye',
        typicalMarket: 'Often diluted with grain flour or maltodextrin',
      },
    ],
    faqs: [
      {
        q: 'What is Moringa called in Nepali and what is its price in Nepal?',
        a: 'Moringa is called Sajiwan (सजिवन) or Sahijan (सहिजन) in Nepali (also referred to locally as Shitalchini / शीतलचिनी). NaturesMud Moringa Leaf Powder (100 GM) is priced at Rs. 690 in Nepal.',
      },
      {
        q: 'How much Moringa Leaf Powder should I take daily (दैनिक कति खाने)?',
        a: 'Start with 1/2 teaspoon (about 2.5g) per day for the first week, then use 1 teaspoon (5g) daily mixed into warm water, dal, soup, or roti dough.',
      },
      {
        q: 'Why is NaturesMud Moringa Powder bright green instead of brown?',
        a: 'We harvest young green leaves and dry them gently in shaded sanitary trays away from scorching UV sunlight, preserving natural chlorophyll and leaf nutrients.',
      },
      {
        q: 'Does Moringa Leaf Powder taste bitter?',
        a: 'Pure moringa leaf has a mild, earthy, spinach-like flavor with a slight peppery finish. Mixing it into lemon water, dal, or smoothies balances the earthy taste naturally.',
      },
      {
        q: 'Can children eat Moringa Leaf Powder?',
        a: 'For older children, a small pinch (1/4 tsp) kneaded into roti dough or stirred into dal is an easy way to add leafy greens. For infants (6M+), consult your pediatrician first.',
      },
    ],
    complementarySlugs: ['beetroot-powder', 'chia-seeds', 'flax-seeds'],
  },

  'freeze-dried-avocado-powder': {
    slug: 'freeze-dried-avocado-powder',
    seoTitle: 'Freeze Dried Avocado Powder Price in Nepal | NaturesMud',
    metaDescription: 'Buy Freeze Dried Avocado Powder (80 GM) at Rs. 790 in Nepal. 100% pure Hass avocado, rich in healthy fats for baby lito & smoothies. Fast Nepal delivery.',
    nepaliNameDevanagari: 'फ्रिज-ड्राइड एभोकाडो पाउडर',
    nepaliNameRoman: 'Avocado Powder (Pure Fruit Pulp Powder)',
    originBelt: 'Eastern & Mid-Hill Orchards of Nepal (Dhankuta, Ilam & Kavre — 1,000m–1,600m)',
    shelfLife: '9–12 months when kept sealed in a cool, dark cupboard',
    whatItIs:
      'NaturesMud Freeze Dried Avocado Powder is crafted from 100% ripe, buttery avocado pulp harvested from hill orchards in Nepal. Because fresh avocados contain healthy monounsaturated oils that turn rancid under high-heat drying, we use gentle freeze-drying (lyophilization) followed by cold milling. Every 80 GM jar contains pure whole avocado pulp with 0 dairy creamer, 0 maltodextrin, 0 sugar, and 0 preservatives.',
    nepaliKitchenUses: [
      'Nutrient-Dense Baby Weaning (Lito / Jaulo): Stir 1 teaspoon (5g) into warm rice jaulo, mashed potato, or banana porridge right before feeding (from 6 months, as advised by your pediatrician).',
      'Instant Creamy Smoothie & Lassi: Blend 1 tablespoon (10g) with milk, yogurt (dahi), and Dates Powder for a rich avocado shake even when fresh avocados are out of season.',
      'Quick Guacamole & Toast Spread: Whisk 2 tablespoons of powder with 1.5 tablespoons of lukewarm water, lemon juice, and a pinch of Himalayan Pink Salt.',
      'Chapati & Pancake Softener: Add 1 tablespoon to whole-wheat dough to enrich family rotis with plant-based monounsaturated fats.',
    ],
    whoItSuits:
      'Designed for parents preparing calorie- and healthy-fat-rich weaning meals (from 6 months, as advised by your pediatrician), smoothie lovers tired of bruised or unripe market avocados, and trekkers or travelers needing shelf-stable healthy fats.',
    monsoonStorage:
      'Because pure avocado powder is rich in natural fruit oils, heat and humidity can affect its freshness. Keep the jar tightly closed in the coolest cupboard of your kitchen—or in the refrigerator door during peak summer/monsoon—and always use a dry spoon.',
    comparisonTitle: 'NaturesMud Freeze Dried Avocado Powder vs Commercial Avocado Drink Mixes',
    comparisonRows: [
      {
        feature: 'Composition',
        naturesMud: '100% Pure Freeze-Dried Avocado Pulp',
        typicalMarket: 'Non-dairy creamer, corn syrup solids, green food coloring & 5% avocado flavor',
      },
      {
        feature: 'Drying Technology',
        naturesMud: 'Sub-zero Freeze Drying (protects delicate oleic fats)',
        typicalMarket: 'High-heat spray drying with starch carriers',
      },
      {
        feature: 'Zero-Waste Convenience',
        naturesMud: 'Ready in 10 seconds — zero brown spots or spoiled fruit',
        typicalMarket: 'Fresh avocados bruise quickly or ripen unevenly',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Freeze Dried Avocado Powder (एभोकाडो पाउडर) in Nepal?',
        a: 'NaturesMud Freeze Dried Avocado Powder (80 GM Glass Jar) is priced at Rs. 790 in Nepal (equivalent to Rs. 988 per 100g). We deliver across Kathmandu Valley in 24–48 hours and nationwide.',
      },
      {
        q: 'Is Freeze Dried Avocado Powder safe for 6-month+ babies?',
        a: 'Yes! Because it contains 100% pure avocado pulp with 0 added sugar, 0 salt, and 0 dairy fillers, it is ideal for mixing into baby jaulo, lito, or fruit purees from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'Why is the pack weight 80 GM instead of 100 GM?',
        a: 'Freeze-dried avocado pulp is lighter and fluffier by volume than dense root powders like beetroot or sweet potato, so our standard glass jar holds 80 GM net weight of pure avocado powder.',
      },
      {
        q: 'How do I reconstitute Avocado Powder into a paste?',
        a: 'Mix 2 parts Avocado Powder with 1.5 parts lukewarm water (plus a drop of lemon juice if desired) and stir for 30 seconds until smooth and creamy.',
      },
      {
        q: 'Does it contain milk powder, sugar, or artificial green color?',
        a: 'No. It contains 0% milk powder, 0% added sugar, 0% maltodextrin, and 0% artificial dyes—only pure freeze-dried avocado.',
      },
    ],
    complementarySlugs: ['banana-powder', 'sweet-potato-powder', 'dates-powder'],
  },

  'strawberry-powder': {
    slug: 'strawberry-powder',
    seoTitle: 'Freeze Dried Strawberry Powder Price in Nepal | NaturesMud',
    metaDescription: 'Buy Freeze Dried Strawberry Powder (80 GM) at Rs. 1,395 in Nepal. 100% real hill strawberries, 0 sugar, 0 artificial color. Fast Kathmandu & Nepal.',
    nepaliNameDevanagari: 'फ्रिज-ड्राइड स्ट्रबेरी पाउडर',
    nepaliNameRoman: 'Strawberry Powder (100% Real Berry Powder)',
    originBelt: 'Kakani & Nuwakot Hill Farms (1,800m–2,100m)',
    shelfLife: '12 months in a tightly sealed jar away from humidity',
    whatItIs:
      'NaturesMud Freeze Dried Strawberry Powder is made from sun-ripened hill strawberries grown in the cool terraced farms of Kakani and Nuwakot. Over 800g of fresh ripe strawberries are gently freeze-dried and cold-milled to produce a single 80 GM jar of fragrant, ruby-pink berry powder. It contains 0% added white sugar, 0% artificial pink dye (Red 40 / Carmine), and 0% synthetic strawberry essence.',
    nepaliKitchenUses: [
      'Real Strawberry Milk for Kids: Whisk 1 teaspoon (5g) of Strawberry Powder + 1 teaspoon of Dates Powder into a glass of warm or chilled milk to replace artificial strawberry syrups.',
      'Dahi (Yogurt), Chia Pudding & Oats: Swirl 1 teaspoon into plain homemade dahi, overnight Chia Seeds pudding, or morning oatmeal for natural berry tang and Vitamin C.',
      'Baby Porridge & Fruit Puree (6M+): Add 1/2 to 1 teaspoon into cooked apple puree, suji kheer, or rice lito (from 6 months, as advised by your pediatrician).',
      'Natural Frosting, Lassi & Baking: Use as a 100% natural pink food color and real berry flavoring for birthday cake frosting, lassi, and homemade ice cream.',
    ],
    whoItSuits:
      'Perfect for parents replacing artificial pink milk powders and sugary syrups, home bakers wanting natural berry color and flavor, smoothie lovers, and infants (from 6 months, as advised by your pediatrician).',
    monsoonStorage:
      'Freeze-dried berry powders absorb atmospheric moisture rapidly on contact with humid air. Open the jar only briefly, scoop with a completely dry spoon, reseal firmly right away, and store in a cool, dry place.',
    comparisonTitle: 'NaturesMud Freeze Dried Strawberry Powder vs Flavored Strawberry Milk Mixes',
    comparisonRows: [
      {
        feature: 'Real Fruit Content',
        naturesMud: '100% Real Freeze-Dried Strawberries (~10x fresh weight concentration)',
        typicalMarket: '0%–2% fruit; mostly refined sugar, maltodextrin & artificial flavor',
      },
      {
        feature: 'Color & Aroma',
        naturesMud: 'Natural ruby-pink anthocyanin pigment & real berry aroma',
        typicalMarket: 'Synthetic coal-tar red dye & artificial ester fragrance',
      },
      {
        feature: 'Added Sugar',
        naturesMud: '0% Added Sugar (naturally tangy-sweet)',
        typicalMarket: '70%+ refined white sugar per spoon',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Freeze Dried Strawberry Powder (स्ट्रबेरी पाउडर) in Nepal?',
        a: 'NaturesMud Freeze Dried Strawberry Powder (80 GM Glass Jar) is Rs. 1,395 in Nepal (Rs. 1,744 per 100g). Because freeze-drying removes ~90% water from fresh berries, each 80 GM jar concentrates roughly 800g of fresh strawberries.',
      },
      {
        q: 'Why does pure Strawberry Powder taste slightly tangy?',
        a: 'Real strawberries are naturally both sweet and tangy! Unlike commercial mixes loaded with 70% white sugar, our powder has 0% added sugar. Pair it with 1 teaspoon of NaturesMud Dates Powder for a sweeter strawberry milk.',
      },
      {
        q: 'Can I give Freeze Dried Strawberry Powder to my baby?',
        a: 'Yes, it is 100% pure fruit with 0 preservatives or artificial dyes, suitable for introducing berry flavors into baby porridge or yogurt from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'How do I prevent Strawberry Powder from hardening in the jar?',
        a: 'Freeze-dried berries have zero moisture and zero chemical anti-caking agents, so they pull humidity from the air. Never hold the open jar over steaming milk/porridge, and close the lid immediately after scooping.',
      },
      {
        q: 'Can I use this for cake icing and baking?',
        a: 'Absolutely. Sift 1–2 tablespoons into buttercream, whipped cream, or macaron batter for vibrant natural pink color and authentic strawberry flavor without watering down your recipe.',
      },
    ],
    complementarySlugs: ['dates-powder', 'banana-powder', 'chia-seeds'],
  },

  'dry-figs-anjeer': {
    slug: 'dry-figs-anjeer',
    seoTitle: 'Dry Figs (Anjeer) Price in Nepal | 200g | NaturesMud',
    metaDescription: 'Buy Dry Figs / Anjeer (200 GM) at Rs. 850 in Nepal. Naturally sun-dried whole figs rich in dietary fiber, iron & calcium. 0 sulfur, fast Nepal delivery.',
    nepaliNameDevanagari: 'अन्जीर (सुकेको अन्जीर)',
    nepaliNameRoman: 'Sukeko Anjeer (Whole Dried Figs)',
    originBelt: 'Selected Mountain & Highland Fig Orchards',
    shelfLife: '9–12 months in an airtight container; refrigerate in peak summer',
    whatItIs:
      'NaturesMud Dry Figs (Anjeer) are plump, sun-dried whole figs packed with crunchy natural seeds and rich honey-like fruit sweetness. Unlike bleached market figs treated with sulphur dioxide gas or dipped in glucose syrup for artificial shine, our Anjeer rings are naturally dried and hand-graded into 200 GM packs with 0 added sugar and 0 preservatives.',
    nepaliKitchenUses: [
      'Morning Soaked Anjeer Ritual: Soak 2 whole Dry Figs overnight in half a cup of water along with 4–5 Raw Almonds. Eat the soft figs in the morning and drink the mineral-rich soaking water.',
      'Warm Anjeer Milk (Kheer / Doodh): Simmer 2 chopped figs in a cup of milk with a pinch of cardamom for a warming evening drink during Kathmandu winters.',
      'Festive Dry-Fruit Laddoos & Barfi: Grind soaked Anjeer with Roasted Cashews, Almonds, and Pumpkin Seeds to bind 100% sugar-free festive energy balls.',
      'Porridge & Oatmeal Topping: Dice 1–2 figs over morning oats, dalia, or dahi for natural soluble fiber and crunchy seed texture.',
    ],
    whoItSuits:
      'Ideal for adults, expectant and nursing mothers seeking dietary iron and calcium from whole foods, elders wanting gentle dietary fiber for regular digestion, and families buying clean Dashain/Tihar dry-fruit gifts.',
    monsoonStorage:
      'Whole dried figs contain natural fruit sugars that can crystallize on the surface ("sugaring") or soften in high humidity. Store in a tightly sealed jar in a cool cupboard, or place in the refrigerator during hot, humid monsoon months.',
    comparisonTitle: 'NaturesMud Dry Figs (Anjeer) vs Bleached Commercial Market Figs',
    comparisonRows: [
      {
        feature: 'Chemical Bleaching',
        naturesMud: '0% Sulphur Dioxide / 0% Hydrogen Peroxide (Natural golden-brown)',
        typicalMarket: 'Often bleached chalk-white with sulphur fumes',
      },
      {
        feature: 'Added Glucose Coating',
        naturesMud: '0% Added Sugar or Syrup Glaze',
        typicalMarket: 'Coated in glucose syrup to add artificial weight',
      },
      {
        feature: 'Texture & Seeds',
        naturesMud: 'Soft, meaty flesh packed with nutrient-rich fig seeds',
        typicalMarket: 'Often overly dry, woody, or stale from open-sack storage',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dry Figs (Anjeer / अन्जीर) in Nepal?',
        a: 'NaturesMud Dry Figs (Anjeer) 200 GM pack costs Rs. 850 in Nepal (which equals Rs. 425 per 100g). We deliver across Kathmandu, Pokhara, Chitwan, and all 77 districts.',
      },
      {
        q: 'How many pieces of Anjeer should I eat per day (दैनिक कति ओटा अन्जीर खाने)?',
        a: 'Most adults enjoy 2 to 3 soaked Dry Figs per day—typically soaked overnight in water and eaten first thing in the morning.',
      },
      {
        q: 'Why should Anjeer be soaked overnight in water?',
        a: 'Soaking rehydrates the soluble fiber and softens the outer skin, making the fig gentler on morning digestion and easier to chew.',
      },
      {
        q: 'Is white powder on dried figs normal or mold?',
        a: 'A light dusty white frost on dried figs over time is natural fruit-sugar crystallization ("sugaring"), not mold. Keeping the pack sealed in the fridge during warm months prevents sugar crystallization.',
      },
      {
        q: 'How many whole figs are in a 200 GM pack?',
        a: 'Depending on individual fruit size, a 200 GM pack contains approximately 18 to 24 whole dried fig rings (enough for 9–12 days at 2 figs per day).',
      },
    ],
    complementarySlugs: ['raw-himalayan-almonds', 'premium-pistachio-roasted-salted', 'dates-powder'],
  },

  'makhana-fox-nuts': {
    slug: 'makhana-fox-nuts',
    seoTitle: 'Makhana (Fox Nuts) Price in Nepal | 50g Jar | NaturesMud',
    metaDescription: 'Buy Makhana / Fox Nuts (50 GM) at Rs. 390 in Nepal. Hand-graded crunchy puffed lotus seeds for healthy roasting, kheer & baby porridge. Fast Nepal.',
    nepaliNameDevanagari: 'मखाना (कमलको फूलेको दाना)',
    nepaliNameRoman: 'Makhana / Phool Makhana (Puffed Lotus Seeds)',
    originBelt: 'Mithila / Terai Wetland Ponds & Artisanal Popping Hubs',
    shelfLife: '9–12 months in an airtight container',
    whatItIs:
      'NaturesMud Makhana (Fox Nuts) are hand-graded, large-size puffed lotus seeds (Euryale ferox) harvested from clean wetland ponds in the Mithila/Terai belt and traditionally popped over earthen ovens. Naturally low in fat and rich in plant protein, calcium, and phosphorus, our 50 GM jar contains crisp, unbleached whole puffs with zero palm oil, zero artificial seasoning, and zero preservatives.',
    nepaliKitchenUses: [
      '5-Minute Ghee-Roasted Evening Snack: Dry-roast a handful of Makhana in a pan with 1/2 teaspoon of cow ghee or Virgin Coconut Oil, a pinch of turmeric, and Himalayan Black Salt (Bire Noon) until crisp.',
      'Homemade Baby Makhana Powder (6M+): Dry-roast plain Makhana until brittle, cool completely, and grind in a mixer to make a calcium-rich powder for baby lito/kheer (from 6 months, as advised by your pediatrician).',
      'Festive Makhana Kheer (Fast / Vrat Recipe): Simmer crushed roasted Makhana in milk with chopped Cashews, Almonds, and Dates Powder for Navratri, Teej, or Ekadashi fasting.',
      'Matar-Makhana Tarkari: Add toasted Makhana to green pea and tomato gravy for a festive Nepali dinner curry.',
    ],
    whoItSuits:
      'Loved by health-conscious office snackers replacing fried chips and Kurkure, fasting (vrat) observers, elders needing a light evening snack, and parents grinding homemade makhana cereal for babies (from 6 months, as advised by your pediatrician).',
    monsoonStorage:
      'Puffed lotus seeds lose their crunch quickly if left exposed to humid air. Keep the jar tightly closed at all times; if the puffs ever absorb monsoon moisture, simply dry-roast them in a pan for 2–3 minutes to restore 100% crispness.',
    comparisonTitle: 'NaturesMud Makhana (Fox Nuts) vs Fried Packet Snacks',
    comparisonRows: [
      {
        feature: 'Fat & Oil Content',
        naturesMud: 'Unfried whole lotus puffs (<0.5g natural fat per 100g)',
        typicalMarket: 'Deep-fried in refined palmolein oil (30g+ fat per 100g)',
      },
      {
        feature: 'Grade & Shell Fragments',
        naturesMud: 'Hand-sorted large white puffs with black shell fragments removed',
        typicalMarket: 'Small, crushed pieces mixed with hard unpopped shell bits',
      },
      {
        feature: 'Sodium & MSG',
        naturesMud: '0% Added Salt, 0% MSG (season it yourself at home)',
        typicalMarket: 'High sodium, maltodextrin & artificial flavor enhancers',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Makhana (मखाना / Fox Nuts) in Nepal?',
        a: 'NaturesMud Makhana (Fox Nuts) 50 GM jar is priced at Rs. 390 in Nepal (equivalent to Rs. 780 per 100g). Because puffed lotus seeds are ultra-lightweight like popcorn, 50 GM fills a full jar.',
      },
      {
        q: 'Can I eat Makhana straight from the jar or should I roast it?',
        a: 'You can eat them straight, but dry-roasting Makhana in a pan on low heat for 3–4 minutes (with or without a drop of ghee/coconut oil and Pink Salt) makes them extra crunchy and nutty.',
      },
      {
        q: 'How do I make Makhana lito for a 6-month+ baby?',
        a: 'Dry-roast Makhana on low heat until crisp, let cool, grind into a fine powder, and cook 1–2 teaspoons in water or milk for 3 minutes (suitable from 6 months, as advised by your pediatrician).',
      },
      {
        q: 'Why is a 50 GM jar of Makhana so large in volume?',
        a: 'Makhana is a puffed seed filled with air pockets, so 50 GM by weight has the same volume as 200 GM–250 GM of dense nuts like almonds or cashews.',
      },
      {
        q: 'Is Makhana suitable for Ekadashi, Teej, and Navratri fasting (व्रत)?',
        a: 'Yes, Makhana is a non-cereal aquatic seed traditionally eaten during Hindu fasting days (vrat) roasted in pure ghee with Sendha/Pink Salt or cooked as Makhana Kheer.',
      },
    ],
    complementarySlugs: ['himalayan-pink-salt', 'virgin-coconut-oil-180ml', 'roasted-almonds'],
  },

  'dehydrated-mango': {
    slug: 'dehydrated-mango',
    seoTitle: 'Dehydrated Mango Price in Nepal | 0% Sugar | NaturesMud',
    metaDescription: 'Buy Dehydrated Mango (100 GM) at Rs. 595 in Nepal. 100% ripe Nepali mango slices with 0 added sugar & 0 sulfur dioxide. Fast Kathmandu & Nepal delivery.',
    nepaliNameDevanagari: 'डिहाइड्रेटेड आँप (सुकेको पाकेको आँप)',
    nepaliNameRoman: 'Sukeko Aamp (0% Added Sugar Dried Mango Slices)',
    originBelt: 'Saptari, Siraha & Chitwan Mango Orchards (100m–250m)',
    shelfLife: '9 months in its resealable airtight pouch',
    whatItIs:
      'NaturesMud Dehydrated Mango is made from tree-ripened sweet Nepali mangoes harvested at peak summer sweetness from Terai orchards. Each mango is hand-peeled, sliced into thick cheeks, and slowly dehydrated at low temperatures. Unlike imported supermarket dried mango that is boiled in white sugar syrup and gassed with sulphur dioxide (E220), our mango slices have 0% added sugar, 0% sulphur, and 0% preservatives.',
    nepaliKitchenUses: [
      'Clean Office & School Tiffin Snack: Enjoy 3–4 chewy mango slices straight from the pouch to satisfy afternoon sweet cravings without refined candy.',
      'Himalayan Trekking & Running Fuel: Pack the lightweight 100 GM pouch in your daypack for fast, natural fruit energy on mountain trails.',
      'Overnight Yogurt & Oatmeal Infusion: Chop 2 slices into plain dahi or overnight oats so the mango rehydrates into plump, juicy fruit bites by morning.',
      'Homemade Trail Mix & Granola: Dice and toss with Raw Almonds, Cashews, and Dehydrated Coconut Chips.',
    ],
    whoItSuits:
      'Perfect for children, students, trekkers, fitness enthusiasts, and anyone who loves the taste of ripe Nepali summer mangoes year-round without refined sugar coatings.',
    monsoonStorage:
      'Because our mango slices contain zero sulphur preservatives, keep the ziplock pouch sealed tightly after opening. During warm and humid monsoon months, storing the opened pouch in the refrigerator keeps the slices firm and prevents darkening.',
    comparisonTitle: 'NaturesMud Dehydrated Mango vs Imported Candied Dried Mango',
    comparisonRows: [
      {
        feature: 'Sugar Coating',
        naturesMud: '0% Added Sugar (100% pure fruit only)',
        typicalMarket: '30%–45% refined white cane sugar syrup coating',
      },
      {
        feature: 'Sulphur Dioxide (E220)',
        naturesMud: '0% Sulphur Dioxide (Natural deep amber-gold color)',
        typicalMarket: 'Treated with SO2 preservative for neon-yellow color',
      },
      {
        feature: 'Fruit Origin',
        naturesMud: 'Ripe Nepali Terai orchard mangoes',
        typicalMarket: 'Mass-produced industrial starch-candied slabs',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dehydrated Mango (सुकेको आँप) in Nepal?',
        a: 'NaturesMud Dehydrated Mango (100 GM Pouch) costs Rs. 595 in Nepal (Rs. 595 per 100g). Approximately 800g–1kg of fresh ripe mangoes go into making a single 100 GM pack.',
      },
      {
        q: 'Why is NaturesMud Dehydrated Mango deep amber-orange instead of bright neon yellow?',
        a: 'Bright neon-yellow dried mango sold in supermarkets is treated with sulphur dioxide (E220) bleach and sugar syrup. Because we use 0% sulphur and 0% sugar, our ripe mango slices turn a natural rich amber-gold as they dry.',
      },
      {
        q: 'Does it have any added sugar or salt?',
        a: 'None at all. The ingredients list is simply 100% ripe mango. All sweetness comes naturally from the fruit itself.',
      },
      {
        q: 'Can kids eat Dehydrated Mango in their school tiffin?',
        a: 'Yes, it is a favorite chewy fruit snack for school-age children (for toddlers, cut into small bite-sized strips).',
      },
      {
        q: 'How should I store the pouch after opening?',
        a: 'Press the ziplock seal shut firmly after each use and store in a cool cupboard or refrigerator away from heat and moisture.',
      },
    ],
    complementarySlugs: ['dehydrated-pineapple', 'dehydrated-apple', 'dehydrated-papaya'],
  },

  'dehydrated-pineapple': {
    slug: 'dehydrated-pineapple',
    seoTitle: 'Dehydrated Pineapple Price in Nepal | 100g | NaturesMud',
    metaDescription: 'Buy Dehydrated Pineapple (100 GM) at Rs. 495 in Nepal. Pure sun-ripened pineapple rings with 0 added sugar & 0 sulfur. Fast Kathmandu & Nepal delivery.',
    nepaliNameDevanagari: 'डिहाइड्रेटेड भुइँकटहर (सुकेको भुइँकटहर)',
    nepaliNameRoman: 'Sukeko Bhuikatahar (0% Added Sugar Pineapple Rings)',
    originBelt: 'Jhapa, Morang & Chitwan Foothill Farms (150m–500m)',
    shelfLife: '9 months in a sealed airtight pouch',
    whatItIs:
      'NaturesMud Dehydrated Pineapple is crafted from sweet, aromatic Nepali pineapples grown in Jhapa, Morang, and Chitwan. Peeled, cored, and sliced into golden rings, the fruit is gently dehydrated at low temperatures to retain natural bromelain enzymes, Vitamin C, and tropical tang—with 0% added sugar, 0% sulphur dioxide, and 0% artificial preservatives.',
    nepaliKitchenUses: [
      'Post-Meal Chew: Enjoy 1–2 golden pineapple rings after a heavy meal for a refreshing, naturally tangy fruit finish.',
      'Tropical Herbal Tea & Detox Water Infuser: Drop 1 dehydrated pineapple ring into hot green tea, black tea, or a water bottle for natural pineapple aroma.',
      'Yogurt Bowls & Chia Pudding: Snip a ring into small triangles with kitchen scissors and stir into morning dahi or Chia Seeds pudding.',
      'Trekking & Gym Energy Bite: Carry in your backpack for quick natural fruit carbohydrates and manganese during hikes.',
    ],
    whoItSuits:
      'Suits fruit lovers, trekkers, tea enthusiasts, office workers wanting a tangy 0-sugar desk snack, and families avoiding sugar-crystallized market pineapple cubes.',
    monsoonStorage:
      'Natural pineapple sugars attract moisture in humid weather. Reseal the ziplock pouch completely after taking a ring, and refrigerate the pouch during hot monsoon weeks to keep the rings chewy and bright.',
    comparisonTitle: 'NaturesMud Dehydrated Pineapple vs Candied Pineapple Cubes',
    comparisonRows: [
      {
        feature: 'Processing Method',
        naturesMud: 'Whole fruit rings gently air-dehydrated at low heat',
        typicalMarket: 'Boiled in heavy refined sugar syrup & diced into cubes',
      },
      {
        feature: 'Added Sugar & Citric Acid',
        naturesMud: '0% Added Sugar, 0% Artificial Citric Acid coating',
        typicalMarket: 'Up to 50% added refined sugar by weight',
      },
      {
        feature: 'Preservatives',
        naturesMud: '0% Sulphur Dioxide (SO2 Free)',
        typicalMarket: 'Preserved with sodium metabisulfite / SO2',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dehydrated Pineapple (सुकेको भुइँकटहर) in Nepal?',
        a: 'NaturesMud Dehydrated Pineapple (100 GM Pouch) is priced at Rs. 495 in Nepal (Rs. 495 per 100g), with fast delivery in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Are these candied pineapple cubes or real dehydrated fruit rings?',
        a: 'These are 100% real dehydrated pineapple rings/slices with zero added sugar—not the sugar-boiled candied cubes commonly sold in baking shops.',
      },
      {
        q: 'Why does pure Dehydrated Pineapple have a concentrated sweet-tart bite?',
        a: 'When water is gently removed from ripe pineapple, both its natural fruit sugars and tropical fruit acids concentrate, giving a bold, chewy sweet-tart flavor.',
      },
      {
        q: 'Can I rehydrate Dehydrated Pineapple in water or tea?',
        a: 'Yes! Stepping 1 ring in warm water or herbal tea for 5–10 minutes softens the fruit and infuses the drink with natural tropical sweetness.',
      },
      {
        q: 'Does it contain any preservatives or artificial color?',
        a: 'No—0% sulphur dioxide, 0% artificial yellow dye, and 0% added sugar.',
      },
    ],
    complementarySlugs: ['dehydrated-mango', 'dehydrated-apple', 'dehydrated-coconut-chips'],
  },

  'dehydrated-apple': {
    slug: 'dehydrated-apple',
    seoTitle: 'Dehydrated Apple Price in Nepal | Himalayan | NaturesMud',
    metaDescription: 'Buy Dehydrated Apple (100 GM) at Rs. 510 in Nepal. Crisp Himalayan apple rings from Mustang & Jumla with 0 added sugar & 0 preservatives. Fast Nepal delivery.',
    nepaliNameDevanagari: 'डिहाइड्रेटेड हिमाली स्याउ (स्याउको सुकुटी)',
    nepaliNameRoman: 'Syau ko Sukuti / Sukeko Syau (Himalayan Apple Rings)',
    originBelt: 'Mustang & Jumla High-Altitude Orchards (2,500m–3,000m)',
    shelfLife: '9–12 months in a tightly sealed pouch',
    whatItIs:
      'NaturesMud Dehydrated Apple (traditionally loved in Nepal as Syau ko Sukuti / स्याउको सुकुटी) is made from crisp, high-altitude apples grown in the cold mountain orchards of Mustang and Jumla. Cored and sliced into thin rings with their pectin-rich skin intact, they are gently dehydrated in hygienic closed chambers with 0% added sugar and 0% sulphur bleaching.',
    nepaliKitchenUses: [
      'Classic Himalayan Trail & Desk Snack: Munch crisp-chewy apple rings straight from the pouch during office hours, road trips, or treks.',
      'Warm Cinnamon Apple Oats / Dalia: Simmer 3–4 chopped apple rings with rolled oats, milk, a pinch of cinnamon, and Dates Powder for a cozy breakfast.',
      'Spiced Apple Kahwa / Herbal Tea: Steep 2 apple rings with a small piece of cinnamon and ginger in hot water for a soothing mountain apple tea.',
      'Toddler Finger Food & Tiffin: Pack in school tiffin boxes as a clean, mess-free fruit snack instead of packaged biscuits.',
    ],
    whoItSuits:
      'Ideal for school children, office professionals, trekkers, elders, and anyone wanting authentic Mustang/Jumla apple nutrition year-round.',
    monsoonStorage:
      'Keep the ziplock pouch tightly sealed after opening so the apple rings do not absorb ambient monsoon humidity. Store in a cool, dry cupboard.',
    comparisonTitle: 'NaturesMud Dehydrated Apple vs Roadside Open-Dried Apple Sukuti',
    comparisonRows: [
      {
        feature: 'Drying Hygiene',
        naturesMud: 'Closed sanitary dehydrators (Protected from dust & insects)',
        typicalMarket: 'Often dried on open rooftops exposed to windborne dust & flies',
      },
      {
        feature: 'Sulphur Bleaching',
        naturesMud: '0% Sulphur Dioxide (Natural warm cream-ivory color)',
        typicalMarket: 'Sometimes treated with metabisulfite to stay paper-white',
      },
      {
        feature: 'Ingredients',
        naturesMud: '100% High-Altitude Nepali Apples (Skin-on for pectin fiber)',
        typicalMarket: 'Variable grade apples, occasionally sugar-dipped',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dehydrated Apple (स्याउको सुकुटी) in Nepal?',
        a: 'NaturesMud Dehydrated Apple (100 GM Pouch) costs Rs. 510 in Nepal (Rs. 510 per 100g). About 900g–1kg of fresh Himalayan apples are dehydrated to make one 100 GM pouch.',
      },
      {
        q: 'Where are the apples sourced from?',
        a: 'We source crisp mountain apples from high-altitude orchards in Mustang and Jumla, where cold nights and bright alpine sun create dense natural sweetness.',
      },
      {
        q: 'Why is the apple skin left on the rings?',
        a: 'Apple skin contains a high concentration of natural pectin (soluble dietary fiber) and polyphenols, so we wash the apples thoroughly and slice them skin-on.',
      },
      {
        q: 'Are these apple rings fried like chips or air-dehydrated?',
        a: 'They are 100% air-dehydrated at low temperature with zero oil, zero frying, and zero added sugar.',
      },
      {
        q: 'How can I soften Dehydrated Apple rings for younger kids or elders?',
        a: 'Soak the rings in warm water, warm milk, or simmering oatmeal for 5 minutes until tender and plump.',
      },
    ],
    complementarySlugs: ['dehydrated-mango', 'dehydrated-pineapple', 'dried-cranberries'],
  },

  'dehydrated-coconut-chips': {
    slug: 'dehydrated-coconut-chips',
    seoTitle: 'Dehydrated Coconut Chips Price in Nepal | 100g | NaturesMud',
    metaDescription: 'Buy Dehydrated Coconut Chips (100 GM) at Rs. 475 in Nepal. Crisp mature coconut flakes with 0 added sugar, 0 oil frying & 0 sulfur. Fast Nepal delivery.',
    nepaliNameDevanagari: 'डिहाइड्रेटेड नरिवल चिप्स (सुकेको नरिवल)',
    nepaliNameRoman: 'Sukeko Nariwal Chips (Pure Coconut Flakes)',
    originBelt: 'Eastern Terai Coconut Groves (Jhapa & Morang)',
    shelfLife: '9 months in a cool, dry cupboard',
    whatItIs:
      'NaturesMud Dehydrated Coconut Chips are shaved ribbons of fresh, mature white coconut meat gently dehydrated to a light, nutty crunch. Free from refined sugar glaze, chemical whiteners, or oil roasting, these 100% pure coconut flakes retain their natural Medium-Chain Triglycerides (MCTs), dietary fiber, and clean tropical aroma.',
    nepaliKitchenUses: [
      'Crunchy Smoothie Bowl & Dahi Topper: Sprinkle 1–2 tablespoons over morning yogurt (dahi), Chia Seeds pudding, or banana smoothie bowls.',
      'Kheer, Halwa & Sel Roti Garnish: Add to rice kheer, suji halwa, or festive sweet batters without having to crack and grate a whole dry coconut (gadi).',
      'Keto & Low-Carb Desk Snack: Eat straight from the pack as a satisfying, zero-sugar, high-MCT snack between meals.',
      'Homemade South-Asian Coconut Chutney: Soak 1/2 cup of Coconut Chips in warm water for 15 minutes, then grind with green chilies, roasted chana, and Himalayan Pink Salt.',
    ],
    whoItSuits:
      'Great for busy Nepali home cooks wanting ready-to-use pure coconut without grating hard dry copra, keto/low-carb snackers, trekkers, and smoothie bowl fans.',
    monsoonStorage:
      'Coconut meat is naturally rich in Lauric Acid oils. Keep the pouch sealed tightly away from heat and sunlight; storing in the fridge during hot monsoon weather preserves its crisp texture and fresh aroma.',
    comparisonTitle: 'NaturesMud Dehydrated Coconut Chips vs Desiccated Market Coconut Powder',
    comparisonRows: [
      {
        feature: 'Oil & Nutrient Integrity',
        naturesMud: 'Whole shaved ribbons from fresh coconut meat (Full MCT oil intact)',
        typicalMarket: 'Often leftover byproduct after coconut milk/oil extraction',
      },
      {
        feature: 'Bleaching & Sulphur',
        naturesMud: '0% Sulphur Dioxide, 0% Chlorine Bleaching',
        typicalMarket: 'Frequently bleached bright white with metabisulfite',
      },
      {
        feature: 'Added Sweeteners',
        naturesMud: '0% Added Sugar (Naturally mildly sweet)',
        typicalMarket: 'Often coated in icing sugar or glucose',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dehydrated Coconut Chips (सुकेको नरिवल चिप्स) in Nepal?',
        a: 'NaturesMud Dehydrated Coconut Chips (100 GM Pack) costs Rs. 475 in Nepal (Rs. 475 per 100g), with fast delivery in Kathmandu Valley and across Nepal.',
      },
      {
        q: 'Are these Coconut Chips sweetened or salted?',
        a: 'Neither! They are 100% pure unsweetened, unsalted mature coconut ribbons—just natural coconut flavor and crunch.',
      },
      {
        q: 'Can I toast these Coconut Chips at home?',
        a: 'Yes, tossing them in a dry pan on low heat for 60–90 seconds turns them golden-brown and brings out an intense toasted coconut aroma for desserts and granola.',
      },
      {
        q: 'How is this different from whole dry coconut (सूखा नरिवल / गडी) sold in markets?',
        a: 'Whole market dry copra is often smoke-dried or stored in humid sacks where mold can develop inside the shell. Our Coconut Chips are hygienically shaved from fresh white kernels and dehydrated cleanly so every piece is ready to eat.',
      },
      {
        q: 'Can I blend these chips with warm water to make quick coconut milk?',
        a: 'Yes! Blend 1/2 cup of Coconut Chips with 1.5 cups of warm water for 2 minutes and strain through a clean cloth for fresh homemade coconut milk.',
      },
    ],
    complementarySlugs: ['virgin-coconut-oil-500ml', 'chia-seeds', 'dried-cranberries'],
  },

  'dehydrated-papaya': {
    slug: 'dehydrated-papaya',
    seoTitle: 'Dehydrated Papaya Price in Nepal | 80g | NaturesMud',
    metaDescription: 'Buy Dehydrated Papaya (80 GM) at Rs. 450 in Nepal. Ripe Terai papaya spears gently dried with 0 added sugar & 0 preservatives. Fast Kathmandu & Nepal.',
    nepaliNameDevanagari: 'डिहाइड्रेटेड मेवा (सुकेको पाकेको मेवा)',
    nepaliNameRoman: 'Sukeko Mewa (Pure Dehydrated Papaya Spears)',
    originBelt: 'Chitwan, Nawalpur & Dhading Lowland Farms (150m–400m)',
    shelfLife: '9 months in a sealed airtight pouch',
    whatItIs:
      'NaturesMud Dehydrated Papaya is made from tree-ripened red-orange papayas grown in Chitwan and Nawalpur. Washed, seeded, and cut into spears, the fruit is gently dehydrated below 45°C to retain natural carotenoids (beta-carotene and lycopene), dietary fiber, and natural papain fruit enzymes—with 0% added sugar, 0% artificial color, and 0% preservatives.',
    nepaliKitchenUses: [
      'After-Meal Digestive Fruit Bite: Chew 2–3 pieces of Dehydrated Papaya after lunch or dinner as a light, naturally sweet whole-fruit bite.',
      'Morning Porridge & Muesli Mix-In: Snip into small pieces and stir into warm oats, dalia, or yogurt bowls.',
      'Hiking & Travel Fruit Pack: Carry in your bag when traveling—enjoy ripe papaya nutrition without carrying heavy, easily bruised fresh fruit.',
      'Warm Fruit Compote: Simmer chopped Dehydrated Papaya and Dehydrated Apple in a little water with cardamom for a warm winter fruit topping.',
    ],
    whoItSuits:
      'Suits adults, seniors, travelers, and families looking for a gentle, fiber-rich whole-fruit snack without refined sugar.',
    monsoonStorage:
      'Reseal the pouch tightly after each use. Store in a cool, dry cupboard away from direct sunlight, or refrigerate after opening during humid monsoon months.',
    comparisonTitle: 'NaturesMud Dehydrated Papaya vs Tutti-Frutti / Candied Papaya',
    comparisonRows: [
      {
        feature: 'What It Actually Is',
        naturesMud: '100% Ripe Red-Orange Papaya Fruit Spears',
        typicalMarket: 'Unripe raw papaya boiled in 60% sugar syrup + synthetic red/green dyes',
      },
      {
        feature: 'Added Sugar',
        naturesMud: '0% Added Sugar',
        typicalMarket: 'Loaded with refined white sugar & glucose',
      },
      {
        feature: 'Preservatives',
        naturesMud: '0% Sodium Benzoate, 0% Sulphur Dioxide',
        typicalMarket: 'Chemical preservatives & artificial flavoring',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dehydrated Papaya (सुकेको मेवा) in Nepal?',
        a: 'NaturesMud Dehydrated Papaya (80 GM Pouch) is priced at Rs. 450 in Nepal (equivalent to Rs. 562.50 per 100g). We deliver across Kathmandu Valley and nationwide.',
      },
      {
        q: 'Why is the pack weight 80 GM?',
        a: 'Fresh papaya is nearly 88%–90% water, so roughly 750g–800g of fresh peeled papaya spears dehydrate down into a single 80 GM pouch.',
      },
      {
        q: 'Does Dehydrated Papaya have a strong smell?',
        a: 'Because we select ripe, sweet red-orange papayas and dehydrate them cleanly at low temperatures, the spears have a mild, pleasant melon-like sweetness.',
      },
      {
        q: 'Is this the same as candied papaya cubes used in fruit cake?',
        a: 'No! Bakery tutti-frutti is unripe papaya boiled in white sugar and artificial food dye. NaturesMud Dehydrated Papaya is 100% pure ripe fruit with 0 added sugar and 0 dye.',
      },
      {
        q: 'Should pregnant women eat Dehydrated Papaya?',
        a: 'Even though our papaya is made from ripe fruit, pregnant women are traditionally advised to consult their obstetrician/doctor before consuming concentrated papaya products.',
      },
    ],
    complementarySlugs: ['dehydrated-mango', 'dehydrated-pineapple', 'dry-figs-anjeer'],
  },

  'dried-blueberries': {
    slug: 'dried-blueberries',
    seoTitle: 'Dried Blueberries Price in Nepal | 100g Jar | NaturesMud',
    metaDescription: 'Buy Dried Blueberries (100 GM) at Rs. 650 in Nepal. Plump whole dried blueberries rich in anthocyanins for oats, yogurt & snacking. Fast Nepal delivery.',
    nepaliNameDevanagari: 'ड्राइड ब्लुबेरी (सुकेको ब्लुबेरी)',
    nepaliNameRoman: 'Sukeko Blueberry (Whole Dried Blueberries)',
    originBelt: 'Selected Cool-Climate Berry Farms',
    shelfLife: '12 months in an airtight glass jar',
    whatItIs:
      'NaturesMud Dried Blueberries are plump, whole dark-blue berries gently dehydrated to lock in their deep purple-blue anthocyanin pigments, dietary fiber, and tangy-sweet berry flavor. Packed in a 100 GM jar with zero artificial colors, zero sulphur dioxide, and zero synthetic preservatives, they bring convenient whole-berry nutrition to Nepali kitchens year-round.',
    nepaliKitchenUses: [
      'Overnight Chia & Oats Topping: Spoon 1 tablespoon (15g) of Dried Blueberries over overnight Chia Seeds pudding, rolled oats, or Greek yogurt (dahi).',
      'Student & Office Brain-Break Snack: Combine 10–12 Dried Blueberries with 5 Raw Almonds and 2 Walnuts/Cashews for a mid-afternoon study or screen-work snack.',
      'Blueberry Pancakes & Muffins: Fold whole berries directly into whole-wheat pancake batter, banana bread, or muffin mix.',
      'Toddler & Kid Berry Mix: Serve alongside Dehydrated Apple rings and Roasted Cashews in school tiffin boxes.',
    ],
    whoItSuits:
      'Ideal for students, software/office professionals spending long hours on screens, children, home bakers, and breakfast bowl lovers.',
    monsoonStorage:
      'Keep the glass jar lid screwed on tightly after use. Store in a cool, dry cupboard away from direct sunlight; refrigerating during hot summer and monsoon months keeps the berries plump.',
    comparisonTitle: 'NaturesMud Dried Blueberries vs Artificial Berry Snacks',
    comparisonRows: [
      {
        feature: 'Whole Berry Integrity',
        naturesMud: '100% Whole Dried Blueberries (Real skins & seeds intact)',
        typicalMarket: 'Often blueberry-flavored sugar gummies or dyed raisins',
      },
      {
        feature: 'Preservatives & Dyes',
        naturesMud: '0% Artificial Blue/Purple Dye, 0% Sulphur Dioxide',
        typicalMarket: 'Preserved with sorbates or coated in hydrogenated oil',
      },
      {
        feature: 'Packaging',
        naturesMud: 'Hygienic Airtight Jar protecting berries from crushing',
        typicalMarket: 'Thin plastic packets where berries get mashed',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dried Blueberries (ब्लुबेरी) in Nepal?',
        a: 'NaturesMud Dried Blueberries (100 GM Jar) is priced at Rs. 650 in Nepal (Rs. 650 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'How many Dried Blueberries should I eat daily?',
        a: 'A typical daily serving is 1 tablespoon (about 15g to 20g, or 15–20 berries) eaten as a snack or mixed into morning oats, yogurt, or trail mix.',
      },
      {
        q: 'Are these real whole blueberries or black currants/raisins?',
        a: 'They are 100% real whole blueberries (Vaccinium species) with their characteristic crown scar and deep indigo-purple anthocyanin skin—not black raisins.',
      },
      {
        q: 'Can I use Dried Blueberries in baking and porridge?',
        a: 'Yes! When simmered in warm oatmeal or baked into muffins, the dried berries plump up and release rich berry flavor.',
      },
      {
        q: 'How long does one 100 GM jar last?',
        a: 'At 1 tablespoon (15g) per day, one 100 GM jar provides about 6 to 7 daily servings.',
      },
    ],
    complementarySlugs: ['dried-cranberries', 'chia-seeds', 'raw-himalayan-almonds'],
  },

  'dried-cranberries': {
    slug: 'dried-cranberries',
    seoTitle: 'Dried Cranberries Price in Nepal | 100g Jar | NaturesMud',
    metaDescription: 'Buy Dried Cranberries (100 GM) at Rs. 415 in Nepal. Ruby-red whole dried cranberries for trail mixes, salads, oats & snacking. Fast Kathmandu & Nepal.',
    nepaliNameDevanagari: 'ड्राइड क्र्यानबेरी (सुकेको क्र्यानबेरी)',
    nepaliNameRoman: 'Sukeko Cranberry (Whole Ruby Dried Cranberries)',
    originBelt: 'Selected Cool-Climate Berry Farms',
    shelfLife: '12 months in an airtight glass jar',
    whatItIs:
      'NaturesMud Dried Cranberries are ruby-red dried berries prized for their bright, tangy-sweet flavor and natural proanthocyanidin polyphenols. Packed in a clean 100 GM jar with zero artificial red food coloring and zero sulphur dioxide preservatives, they add a vibrant tart contrast to nuts, seeds, salads, and breakfast bowls.',
    nepaliKitchenUses: [
      'Homemade Nut & Berry Trail Mix: Toss Dried Cranberries with Raw Almonds, Roasted Cashews, Pumpkin Seeds, and Pistachios for an instant desk or trekking mix.',
      'Morning Oatmeal, Muesli & Dahi: Stir 1 tablespoon into warm porridge, cornflakes, or plain dahi for a lively ruby-red fruit burst.',
      'Green Salads & Pulao Garnish: Sprinkle over fresh cucumber-carrot salads or festive Kashmiri/Nepali dry-fruit pulao.',
      'Home Baking (Cookies & Granola Bars): Mix into oat cookies, flapjacks, or dark chocolate bark.',
    ],
    whoItSuits:
      'Popular with women, office professionals, trekkers, home bakers, and families building custom dry-fruit and seed mixes at home.',
    monsoonStorage:
      'Store in the tightly sealed jar in a cool, dry cabinet away from stove heat. In humid monsoon weather, keep the lid closed tightly or store in the fridge door.',
    comparisonTitle: 'NaturesMud Dried Cranberries vs Dyed Market Berry Mixes',
    comparisonRows: [
      {
        feature: 'Berry Authenticity',
        naturesMud: 'Real Ruby Dried Cranberries (Natural tart-sweet profile)',
        typicalMarket: 'Often red-dyed papaya bits or cheap candied cherries sold as cranberries',
      },
      {
        feature: 'Artificial Dyes & SO2',
        naturesMud: '0% Artificial Red Dye (Allura Red free), 0% Sulphur Dioxide',
        typicalMarket: 'Frequently colored with synthetic red dyes',
      },
      {
        feature: 'Freshness Packaging',
        naturesMud: 'Sealed 100 GM Glass Jar for moisture protection',
        typicalMarket: 'Loose open bins exposed to dust and humidity',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dried Cranberries (क्र्यानबेरी) in Nepal?',
        a: 'NaturesMud Dried Cranberries (100 GM Jar) costs Rs. 415 in Nepal (Rs. 415 per 100g). We offer 24–48 hour delivery in Kathmandu Valley and courier shipping across Nepal.',
      },
      {
        q: 'How do Dried Cranberries taste compared to Dried Blueberries?',
        a: 'Dried Cranberries have a brighter, tangier tart-sweet bite, whereas Dried Blueberries are milder and more floral-sweet. Many customers enjoy mixing both with almonds and pumpkin seeds.',
      },
      {
        q: 'How much Dried Cranberry should I eat per day?',
        a: 'A standard daily portion is 1 to 1.5 tablespoons (15g–20g) eaten as a snack or added to oats, yogurt, or salads.',
      },
      {
        q: 'Are there any artificial red colors or sulphur preservatives?',
        a: 'No. The ruby color comes naturally from cranberry skin pigments (anthocyanins), with 0% artificial dyes and 0% sulphur dioxide.',
      },
      {
        q: 'Can children eat Dried Cranberries?',
        a: 'Yes, school-age kids love their tangy-sweet flavor in trail mix, oatmeal, and homemade cookies (for very young toddlers, chop finely).',
      },
    ],
    complementarySlugs: ['dried-blueberries', 'pumpkin-seeds', 'superfood-trail-mix'],
  },

  'dates-powder': {
    slug: 'dates-powder',
    seoTitle: 'Dates Powder Price in Nepal | Natural Sweetener | NaturesMud',
    metaDescription: 'Buy Dates Powder (100 GM) at Rs. 400 in Nepal. Pure dry dates (Khajur) sweetener for baby lito, milk & tea. 0 refined white sugar. Fast Nepal delivery.',
    nepaliNameDevanagari: 'खजुर पाउडर (छोकडा पाउडर)',
    nepaliNameRoman: 'Khajur / Chhokada Powder (100% Whole Dry Dates Sweetener)',
    originBelt: 'Selected Sun-Cured Dry Dates (Milled in Kathmandu)',
    shelfLife: '12 months in a dry, airtight glass jar',
    whatItIs:
      'NaturesMud Dates Powder (Khajur / Chhokada Powder) is a 100% whole-fruit natural sweetener made by pitting, gently dehydrating, and cold-milling whole dry dates into a free-flowing caramel-brown powder. Unlike refined white table sugar—which is chemically bleached with sulphur and stripped of all minerals—our Dates Powder retains the whole date’s natural dietary fiber, iron, potassium, and caramel aroma with 0% anti-caking chemicals.',
    nepaliKitchenUses: [
      'Refined-Sugar Replacement for Baby Porridge: Stir 1 teaspoon (5g) into cooked rice lito, ragi porridge, suji kheer, or banana mash after cooking (for infants from 6 months, as advised by your pediatrician).',
      'Kids’ Warm Milk & Malted Drinks: Add 1 to 2 teaspoons to warm milk alongside Banana Powder, Strawberry Powder, or Beetroot Powder.',
      'Everyday Halwa, Kheer & Baking: Replace white sugar 1:1 in gajar ko halwa, rice kheer, oat cookies, and whole-wheat cakes.',
      'Morning Oatmeal & Dahi Sweetener: Sprinkle over plain dahi, muesli, or chia pudding for gentle whole-fruit sweetness.',
    ],
    whoItSuits:
      'Essential for parents eliminating refined white sugar from baby and toddler meals (from 6 months, as advised by your pediatrician), health-conscious families, and home bakers.',
    monsoonStorage:
      'Because Dates Powder is 100% pure fruit with 0% chemical anti-caking agents, humidity can cause soft clumping. Always use a dry spoon, never shake the jar directly over steaming pots, and tighten the lid immediately.',
    comparisonTitle: 'NaturesMud Dates Powder vs Refined White Sugar',
    comparisonRows: [
      {
        feature: 'Processing & Bleaching',
        naturesMud: '100% Whole Dehydrated Dates (Cold-milled, unbleached)',
        typicalMarket: 'Chemically refined & sulphur-bleached sucrose crystals',
      },
      {
        feature: 'Fiber & Micronutrients',
        naturesMud: 'Retains natural date fiber (~7g/100g), iron, potassium & magnesium',
        typicalMarket: 'Zero fiber, zero iron, zero vitamins (empty calories)',
      },
      {
        feature: 'Anti-Caking Additives',
        naturesMud: '0% Maltodextrin, 0% Silicon Dioxide',
        typicalMarket: 'Cheap date powders are often cut with 30% starch/flour',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Dates Powder (खजुर पाउडर) in Nepal?',
        a: 'NaturesMud Dates Powder (100 GM Glass Jar) costs Rs. 400 in Nepal (Rs. 400 per 100g). We deliver in 24–48 hours across Kathmandu Valley and nationwide.',
      },
      {
        q: 'Can I use Dates Powder for my 6-month+ baby instead of white sugar?',
        a: 'Yes! Pediatric nutrition guidelines recommend avoiding refined white sugar for babies. NaturesMud Dates Powder is 100% whole fruit (0 additives), suitable for gently sweetening baby porridge from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'Does Dates Powder dissolve completely like white sugar in tea?',
        a: 'Because it is made from 100% whole ground dates (including natural fruit fiber) rather than refined crystals, it blends smoothly into milk, porridge, kheer, smoothies, and baking, and leaves a tiny trace of natural fruit fiber at the bottom of clear black tea.',
      },
      {
        q: 'How much Dates Powder equals 1 spoon of white sugar?',
        a: 'Use a 1:1 ratio by volume—1 teaspoon of Dates Powder replaces 1 teaspoon of white sugar with a rich, warm caramel note.',
      },
      {
        q: 'What if the Dates Powder forms soft lumps during monsoon?',
        a: 'Pure date sugar naturally absorbs air moisture because we add 0% chemical anti-caking agents. Simply press the soft lump with the back of a dry spoon or pulse briefly in a dry mixer.',
      },
    ],
    complementarySlugs: ['banana-powder', 'sweet-potato-powder', 'strawberry-powder'],
  },

  'beetroot-powder': {
    slug: 'beetroot-powder',
    seoTitle: 'Beetroot Powder Price in Nepal | 100g Jar | NaturesMud',
    metaDescription: 'Buy Beetroot Powder (100 GM) at Rs. 430 in Nepal. 100% pure cold-milled Nepali beetroot (Chukandar) for stamina drinks, rotis & smoothies. Fast delivery.',
    nepaliNameDevanagari: 'चुकन्दर पाउडर',
    nepaliNameRoman: 'Chukandar Powder (100% Pure Red Beetroot Powder)',
    originBelt: 'Kavre, Bhaktapur & Chitwan Farms (300m–1,500m)',
    shelfLife: '12 months in a tightly sealed glass jar away from light',
    whatItIs:
      'NaturesMud Beetroot Powder is cold-milled from 100% deep-crimson Nepali beetroots (Chukandar). Roughly 1 kilogram of fresh washed beetroots is thinly sliced, dehydrated below 42°C in closed sanitary trays to protect heat-sensitive betalain pigments and dietary nitrates, and ground into an ultra-fine ruby powder—with 0% added sugar, 0% artificial red dye, and 0% preservatives.',
    nepaliKitchenUses: [
      'Pre-Workout Stamina & Running Drink: Whisk 1 teaspoon (5g) into 250ml of cold water with a squeeze of lemon and a pinch of Himalayan Pink Salt 30–45 minutes before gym or running.',
      'Pink Chapati, Puri & Momo Wrappers: Knead 1 tablespoon into whole-wheat atta or flour to make vibrant crimson rotis, puris, or vegetable momo wrappers that kids love.',
      'Baby & Toddler Porridge (6M+): Stir 1/4 to 1/2 teaspoon into cooked rice jaulo, dal soup, or mashed potato (from 6 months, as advised by your pediatrician).',
      'Morning Smoothie & Curd Raita: Blend 1 teaspoon into banana-berry smoothies or swirl into plain dahi for a colourful beetroot raita.',
    ],
    whoItSuits:
      'Favored by runners, gym athletes, trekkers, parents making colourful nutrient-rich rotis and baby meals (from 6 months, as advised by your pediatrician), and natural skin/hair mask enthusiasts.',
    monsoonStorage:
      'Beetroot contains natural root sugars that pull moisture from humid air. Keep the glass jar tightly closed in a cool, dark cupboard away from stove steam, and always scoop with a dry spoon.',
    comparisonTitle: 'NaturesMud Beetroot Powder vs Boiled Fresh Beetroot / Dyed Powders',
    comparisonRows: [
      {
        feature: 'Nutrient & Nitrate Retention',
        naturesMud: 'Low-temp dehydrated (<42°C) — preserves water-soluble nitrates & betalains',
        typicalMarket: 'Boiling beetroot in water leaches out up to 40% of water-soluble nutrients',
      },
      {
        feature: 'Purity & Color',
        naturesMud: '100% Pure Beetroot (Zero synthetic Carmine or Red 40 dye)',
        typicalMarket: 'Cosmetic-grade or cheap powders often mixed with starch & red dye',
      },
      {
        feature: 'Kitchen Prep Time',
        naturesMud: '10 seconds — zero peeling, grating, or red-stained hands',
        typicalMarket: '20 minutes of washing, peeling, grating, and cleanup',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Beetroot Powder (चुकन्दर पाउडर) in Nepal?',
        a: 'NaturesMud Beetroot Powder (100 GM Glass Jar) costs Rs. 430 in Nepal (Rs. 430 per 100g). Each jar is made from nearly 1 kg of fresh beetroots.',
      },
      {
        q: 'Is NaturesMud Beetroot Powder edible food-grade or only for face packs?',
        a: 'It is 100% pure culinary food-grade Beetroot Powder meant for drinking, cooking, and baby weaning—and because it has 0 additives, it is also completely safe for natural DIY lip balms and face masks.',
      },
      {
        q: 'How do I take Beetroot Powder before gym or running?',
        a: 'Mix 1 level teaspoon (5g) in a glass of water or lemon water 30–45 minutes before exercise for natural dietary nitrates.',
      },
      {
        q: 'Can I give Beetroot Powder to my baby (बच्चाको लिटोमा)?',
        a: 'Yes, start with a small pinch (1/4 teaspoon) stirred into warm dal, rice jaulo, or vegetable puree from 6 months, as advised by your pediatrician.',
      },
      {
        q: 'Why does my Beetroot Powder turn slightly darker if left open?',
        a: 'Natural betalain pigments in pure beetroot react to humidity and UV light because we add 0% chemical stabilizers. Keep the lid tightly sealed in a dark cupboard.',
      },
    ],
    complementarySlugs: ['carrot-powder', 'moringa-leaf-powder', 'dates-powder'],
  },

  'himalayan-pink-salt': {
    slug: 'himalayan-pink-salt',
    seoTitle: 'Himalayan Pink Salt Price in Nepal | 200g | NaturesMud',
    metaDescription: 'Buy Himalayan Pink Salt / Sindhe Noon (200 GM) at Rs. 250 in Nepal. Unrefined rock salt with natural trace minerals & 0 anti-caking chemicals. Fast.',
    nepaliNameDevanagari: 'हिमाली गुलाबी नुन (सिधे नुन / सेन्धा नमक)',
    nepaliNameRoman: 'Sindhe Noon / Sendha Namak (Himalayan Pink Rock Salt)',
    originBelt: 'Ancient Himalayan Pre-Cambrian Salt Beds',
    shelfLife: '24+ months when kept dry in its airtight glass jar',
    whatItIs:
      'NaturesMud Himalayan Pink Salt (known in Nepali households as Sindhe Noon / सिधे नुन) is unrefined crystalline rock salt crushed into fine culinary granules. Unlike heavily bleached industrial table salt treated with chemical anti-caking agents (such as sodium ferrocyanide or aluminum silicate), our Pink Salt is 100% unbleached and naturally tinted pink by trace iron, potassium, calcium, and magnesium minerals.',
    nepaliKitchenUses: [
      'Everyday Dal, Tarkari & Soup Seasoning: Use in place of refined white salt in daily Nepali dal, vegetable tarkari, and curries for a cleaner, rounder mineral taste.',
      'Morning Lemon-Electrolyte Hydration: Dissolve 1/4 teaspoon in a glass of lukewarm lemon water first thing in the morning or after sweating on treks/runs.',
      'Fasting (Vrat / Ekadashi) Meals: Because Sindhe Noon is pure rock salt, it is the traditional salt used for Ekadashi, Teej, and Navratri fasting dishes like roasted Makhana and आलू फ्राई.',
      'Warm Gargle & Steam Rinse: Dissolve 1/2 teaspoon in a cup of warm water for a soothing traditional salt-water throat gargle during seasonal weather changes.',
    ],
    whoItSuits:
      'Suits every Nepali kitchen upgrading from bleached refined salt, fasting (vrat) observers, athletes/trekkers making homemade electrolyte water, and clean-eating households.',
    monsoonStorage:
      'Salt naturally draws moisture from humid monsoon air. Keep the glass jar lid tightly closed and store away from stove steam; adding a few dry raw rice grains inside a salt shaker also keeps it free-flowing.',
    comparisonTitle: 'NaturesMud Himalayan Pink Salt vs Refined Industrial Table Salt',
    comparisonRows: [
      {
        feature: 'Refining & Bleaching',
        naturesMud: '100% Unrefined, Unbleached Natural Rock Salt',
        typicalMarket: 'Chemically refined at high heat & bleached white',
      },
      {
        feature: 'Anti-Caking Chemicals',
        naturesMud: '0% Anti-Caking Agents (Zero ferrocyanide / silicate)',
        typicalMarket: 'Contains synthetic free-flow chemicals',
      },
      {
        feature: 'Mineral Profile',
        naturesMud: 'Sodium chloride + natural trace iron, potassium, calcium & magnesium',
        typicalMarket: 'Stripped of natural trace minerals',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Himalayan Pink Salt (सिधे नुन) in Nepal?',
        a: 'NaturesMud Himalayan Pink Salt (200 GM Glass Jar) costs Rs. 250 in Nepal (Rs. 125 per 100g). We deliver across Kathmandu Valley and all 77 districts.',
      },
      {
        q: 'What is the difference between Sindhe Noon (Pink Salt) and Bire Noon (Black Salt)?',
        a: 'Sindhe Noon (Pink Salt) has a clean, mild salty taste ideal for everyday cooking and fasting (vrat), while Bire Noon (Black Salt) is kiln-fired with herbs and has a tangy, sulfurous aroma best for fruit salads, nimbu pani, and chutneys.',
      },
      {
        q: 'Does Himalayan Pink Salt contain naturally occurring iodine?',
        a: 'Unrefined Pink Rock Salt contains only trace natural iodine—it is not artificially iodized like commercial packet salt. If your doctor recommends iodized salt for thyroid/pregnancy needs, follow your doctor’s advice.',
      },
      {
        q: 'Can I use this Pink Salt during Ekadashi or Navratri fasting?',
        a: 'Yes, Sindhe Noon (Sendha Namak) is the authentic rock salt traditionally permitted during Hindu fasting days.',
      },
      {
        q: 'Is it fine grain or coarse crystals?',
        a: 'It is finely ground for effortless dissolving in daily cooking, salads, and lemon water.',
      },
    ],
    complementarySlugs: ['pure-himalayan-black-salt-bire-noon', 'makhana-fox-nuts', 'chia-seeds'],
    variantGroupTitle: 'Choose Himalayan Salt Type',
    variants: [
      {
        slug: 'himalayan-pink-salt',
        label: 'Himalayan Pink Salt (Sindhe Noon)',
        weight: '200 GM',
        price: 250,
        badge: 'Everyday Cooking & Fasting',
      },
      {
        slug: 'pure-himalayan-black-salt-bire-noon',
        label: 'Himalayan Black Salt (Bire Noon)',
        weight: '200 GM',
        price: 220,
        badge: 'Fruit Salad, Nimbu Pani & Chutney',
      },
    ],
  },

  'pure-himalayan-black-salt-bire-noon': {
    slug: 'pure-himalayan-black-salt-bire-noon',
    seoTitle: 'Himalayan Black Salt (Bire Noon) Price in Nepal | NaturesMud',
    metaDescription: 'Buy Himalayan Black Salt / Bire Noon (200 GM) at Rs. 220 in Nepal. Authentic Ayurvedic rock salt for fruit salad, nimbu pani & chutneys. Fast Nepal.',
    nepaliNameDevanagari: 'हिमाली बिरे नुन (काला नमक)',
    nepaliNameRoman: 'Bire Noon / Kala Namak (Himalayan Black Salt)',
    originBelt: 'Himalayan Rock Salt Kiln-Fired in Traditional Earthen Pots',
    shelfLife: '24+ months in a tightly sealed glass jar',
    whatItIs:
      'NaturesMud Himalayan Black Salt (beloved across Nepal as Bire Noon / बिरे नुन) is traditional mineral rock salt kiln-cured with natural charcoal and myrobalan seeds (harro/barro), then ground into a pinkish-purple powder. Its distinctive savory, umami aroma comes from natural iron sulfide and sulfur compounds, with 0% chemical flow-agents or synthetic additives.',
    nepaliKitchenUses: [
      'Classic Nepali Fruit Chaat & Cucumber Salad: Sprinkle a pinch of Bire Noon and chili flakes over sliced cucumber (kakro), guava (amba), orange (suntala), or pomelo (bhogate).',
      'Refreshing Nimbu Pani, Jaljeera & Mohi: Whisk 1/4 teaspoon into chilled lemon water, spiced buttermilk (mohi), or watermelon juice after meals.',
      'Traditional Golbheda (Tomato) & Mint Achar: Season roasted tomato chutney, dhaniya-pudina achar, and chatpate for authentic Nepali street-style tang.',
      'Vegan Egg-Style Tofu Scramble: Because natural sulfur compounds give Bire Noon an egg-like aroma, a pinch transforms turmeric-tofu scrambles.',
    ],
    whoItSuits:
      'A staple for every Nepali home kitchen, fruit-salad and achar lovers, summer beverage makers, and plant-based cooks.',
    monsoonStorage:
      'Keep the glass jar tightly sealed in a dry cupboard. Because Bire Noon contains zero chemical anti-caking agents, always use a dry spoon during humid monsoon months.',
    comparisonTitle: 'NaturesMud Bire Noon vs Adulterated Market Black Salt',
    comparisonRows: [
      {
        feature: 'Authenticity',
        naturesMud: '100% Traditional Kiln-Cured Himalayan Black Rock Salt',
        typicalMarket: 'Often common white salt dyed purple-grey with synthetic color',
      },
      {
        feature: 'Aroma & Color',
        naturesMud: 'Deep violet-grey crystals -> Grinding turns pale pinkish-grey with rich aroma',
        typicalMarket: 'Harsh chemical smell or flat salty taste',
      },
      {
        feature: 'Additives',
        naturesMud: '0% Anti-Caking Chemicals, 0% Artificial Dyes',
        typicalMarket: 'Mixed with industrial flow agents',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Himalayan Black Salt (बिरे नुन / Bire Noon) in Nepal?',
        a: 'NaturesMud Himalayan Black Salt (Bire Noon 200 GM Glass Jar) costs Rs. 220 in Nepal (Rs. 110 per 100g). We deliver across Kathmandu Valley and nationwide.',
      },
      {
        q: 'Why does Bire Noon look pinkish-purple when ground into powder?',
        a: 'Whole Bire Noon rock crystals look dark violet-black, but when finely ground into powder, authentic Bire Noon naturally turns a light pinkish-purple shade.',
      },
      {
        q: 'Why does Bire Noon have a distinctive savory smell?',
        a: 'Traditional kiln-curing creates natural iron sulfide and trace sulfur compounds, giving Bire Noon its signature savory aroma that pairs wonderfully with lemon, fruit, and dahi.',
      },
      {
        q: 'How is Bire Noon traditionally used in Nepali households?',
        a: 'In Nepali tradition, a pinch of Bire Noon in warm lemon water, ajwain (jwano) water, or buttermilk (mohi) is enjoyed after heavy meals.',
      },
      {
        q: 'Does it contain any artificial coloring?',
        a: 'No—0% artificial dye and 0% anti-caking chemicals.',
      },
    ],
    complementarySlugs: ['himalayan-pink-salt', 'makhana-fox-nuts', 'dehydrated-pineapple'],
    variantGroupTitle: 'Choose Himalayan Salt Type',
    variants: [
      {
        slug: 'himalayan-pink-salt',
        label: 'Himalayan Pink Salt (Sindhe Noon)',
        weight: '200 GM',
        price: 250,
        badge: 'Everyday Cooking & Fasting',
      },
      {
        slug: 'pure-himalayan-black-salt-bire-noon',
        label: 'Himalayan Black Salt (Bire Noon)',
        weight: '200 GM',
        price: 220,
        badge: 'Fruit Salad, Nimbu Pani & Chutney',
      },
    ],
  },

  'chia-seeds': {
    slug: 'chia-seeds',
    seoTitle: 'Chia Seeds Price in Nepal | 300g Pack | NaturesMud',
    metaDescription: 'Buy Chia Seeds (300 GM) at Rs. 495 in Nepal (Rs. 165/100g). Clean AAA-grade black chia seeds rich in plant Omega-3 & fiber. Fast Kathmandu & Nepal.',
    nepaliNameDevanagari: 'चिया सिड्स',
    nepaliNameRoman: 'Chia Seeds (Cleaned Black Salvia Hispanica Seeds)',
    originBelt: 'Mid-Hill Terraced Farms (800m–1,600m)',
    shelfLife: '18 months in an airtight container',
    whatItIs:
      'NaturesMud Chia Seeds (300 GM value pack) are triple-cleaned, high-swell black chia seeds (Salvia hispanica) free from dust, stones, and immature brown weeds. When soaked in water or milk for 15 minutes, each seed forms a thick, translucent soluble-fiber gel coat, delivering plant-based Omega-3 (ALA), dietary fiber, calcium, and magnesium.',
    nepaliKitchenUses: [
      'Morning Soaked Lemon-Chia Water: Soak 1 tablespoon (12g) of Chia Seeds in a glass of water for 20 minutes (or overnight), then add fresh lemon juice and a pinch of Himalayan Pink Salt.',
      'Creamy Overnight Chia Pudding: Stir 2 tablespoons of Chia Seeds into 1 cup of milk or dahi with 1 teaspoon of Dates Powder and top with Dried Blueberries or Mango.',
      'Smoothie & Lassi Thickener: Blend 1 tablespoon into fruit smoothies, mango lassi, or protein shakes.',
      'Oatmeal & Roti Dough Booster: Mix 1 tablespoon into morning oats or whole-wheat chapati dough for extra soluble fiber.',
    ],
    whoItSuits:
      'Ideal for adults, fitness enthusiasts, office workers seeking sustained morning fullness and soluble fiber, and vegetarians looking for plant Omega-3.',
    monsoonStorage:
      'Because Chia Seeds absorb up to 10–12 times their weight in liquid, even a drop of water inside the pack will cause them to gel. Always scoop with a completely dry spoon and seal tightly.',
    comparisonTitle: 'NaturesMud Chia Seeds (Rs. 165 / 100g) vs Uncleaned Market Seeds',
    comparisonRows: [
      {
        feature: 'Price per 100g Value',
        naturesMud: 'Rs. 165 per 100g (Rs. 495 for a full 300 GM pack)',
        typicalMarket: 'Often Rs. 250–350 per 100g in small 100g packets',
      },
      {
        feature: 'Seed Purity & Swell Ratio',
        naturesMud: '99.9% Triple-cleaned mature black/mottled seeds (High gel swell)',
        typicalMarket: 'Mixed with grit, dust & immature brown dead seeds that don’t gel',
      },
      {
        feature: 'Chemicals',
        naturesMud: '0% Fumigation Residue, 0% Preservatives',
        typicalMarket: 'Bulk warehouse sacks exposed to moisture',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Chia Seeds (चिया सिड्स) in Nepal?',
        a: 'NaturesMud Chia Seeds (300 GM Pack) costs Rs. 495 in Nepal—which works out to just Rs. 165 per 100g, making it one of the best-value clean chia seed packs in Nepal.',
      },
      {
        q: 'How do I eat Chia Seeds safely (चिया सिड्स कसरी खाने)?',
        a: 'Always soak 1 tablespoon of Chia Seeds in at least 1 glass (250ml) of water or milk for 15–20 minutes until they form a soft gel before drinking. Never swallow dry spoonfuls of chia seeds followed by water.',
      },
      {
        q: 'Are Chia Seeds and Tukmaria / Babari ko Biu (Basil Seeds) the same?',
        a: 'No. Tukmaria (sweet basil seeds) are jet-black, tear-shaped seeds that swell instantly in 2 minutes. True Chia Seeds are oval with grey/black mottling, take 15–20 minutes to gel, and contain significantly higher Omega-3 fatty acids.',
      },
      {
        q: 'How much Chia Seeds should I take per day?',
        a: '1 to 2 tablespoons (12g to 24g) per day soaked in water, milk, yogurt, or oats is the standard daily serving for adults.',
      },
      {
        q: 'How long does one 300 GM pack of Chia Seeds last?',
        a: 'At 1 tablespoon (12g) per day, one 300 GM pack provides 25 daily servings (nearly a full month).',
      },
    ],
    complementarySlugs: ['flax-seeds', 'pumpkin-seeds', 'dried-blueberries'],
  },

  'pumpkin-seeds': {
    slug: 'pumpkin-seeds',
    seoTitle: 'Pumpkin Seeds Price in Nepal | 300g Pack | NaturesMud',
    metaDescription: 'Buy Pumpkin Seeds (300 GM) at Rs. 650 in Nepal (Rs. 217/100g). Raw AAA-grade green pepitas rich in zinc, magnesium & plant protein. Fast Nepal delivery.',
    nepaliNameDevanagari: 'फर्सीको बिया (हरियो फर्सीको दाना)',
    nepaliNameRoman: 'Pharsi ko Biya / Green Pumpkin Seeds (Pepitas)',
    originBelt: 'Hill & Valley Farms (Hull-less Green Pepita Kernels)',
    shelfLife: '12 months in an airtight container; refrigerate in summer/monsoon',
    whatItIs:
      'NaturesMud Pumpkin Seeds (300 GM value pack) are AA/AAA-grade, hull-less emerald-green pumpkin seed kernels (pepitas). Unfried, unsalted, and unbleached, they are one of nature’s richest whole-food sources of dietary magnesium, zinc, iron, and plant protein (30g protein per 100g).',
    nepaliKitchenUses: [
      'Daily Handful or Light Pan-Toast: Eat 1–2 tablespoons (20g) raw, or dry-roast in a pan for 2 minutes until they pop and turn nutty.',
      'Morning Oats, Dahi & Salad Crunch: Scatter over morning oatmeal, curd bowls, cucumber salads, or avocado toast.',
      'Homemade Seed Butter & Pesto: Blend toasted Pumpkin Seeds with garlic, coriander/basil, lemon juice, and olive/coconut oil for a dairy-free green chutney.',
      'Baby & Toddler Nut/Seed Powder (8M+): Dry-roast and grind into a fine powder with Almonds and Makhana to fortify toddler porridge (as advised by your pediatrician).',
    ],
    whoItSuits:
      'Ideal for men and women seeking natural dietary zinc and magnesium, gym-goers wanting plant protein, students, and families building daily seed-cycling or trail-mix jars.',
    monsoonStorage:
      'Raw pumpkin seeds contain delicate polyunsaturated oils that can turn rancid if stored in hot kitchens. Keep the pack tightly sealed in a cool cupboard or inside the refrigerator during warm summer and monsoon months.',
    comparisonTitle: 'NaturesMud Green Pumpkin Seeds (Rs. 217 / 100g) vs Market Packets',
    comparisonRows: [
      {
        feature: 'Price per 100g Value',
        naturesMud: 'Rs. 217 per 100g (Rs. 650 for a generous 300 GM pack)',
        typicalMarket: 'Often Rs. 280–350 per 100g in small 100g pouches',
      },
      {
        feature: 'Kernel Grade & Freshness',
        naturesMud: 'Plump, whole dark-green AA kernels (Zero rancid oil smell)',
        typicalMarket: 'Broken yellow-faded fragments from old stock',
      },
      {
        feature: 'Oil & Salt',
        naturesMud: '100% Raw & Unsalted (Zero palm oil roasting)',
        typicalMarket: 'Often oil-fried with excess sodium',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Pumpkin Seeds (फर्सीको बिया) in Nepal?',
        a: 'NaturesMud Pumpkin Seeds (300 GM Pack) costs Rs. 650 in Nepal—just Rs. 217 per 100g. We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Should I eat Pumpkin Seeds raw, soaked, or roasted?',
        a: 'You can eat them raw straight from the pack, soak them for 4–6 hours, or lightly dry-roast them in a pan on low heat for 2–3 minutes until slightly puffed and aromatic.',
      },
      {
        q: 'How much Pumpkin Seeds should I eat per day?',
        a: 'A daily serving of 1 to 2 tablespoons (about 15g to 25g) provides a rich boost of natural magnesium, zinc, and plant protein.',
      },
      {
        q: 'Why are these Pumpkin Seeds green without white shells?',
        a: 'These are hull-less green pepita kernels—so there is no hard white outer shell to peel, and 100% of the seed is edible.',
      },
      {
        q: 'How do I keep Pumpkin Seeds fresh for months?',
        a: 'Seal the pack tightly after each use and store in a cool, dark place or in the refrigerator to protect their natural seed oils.',
      },
    ],
    complementarySlugs: ['chia-seeds', 'flax-seeds', 'dried-cranberries'],
  },

  'premium-cashewnuts': {
    slug: 'premium-cashewnuts',
    seoTitle: 'Premium Cashew Nuts Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Premium Cashew Nuts / Kaju (200 GM) at Rs. 750 in Nepal. Whole raw white W240/W320 cashews for snacking, kheer, baby paste & gifting. Fast delivery.',
    nepaliNameDevanagari: 'काजु (प्रिमियम काँचो काजु)',
    nepaliNameRoman: 'Kaju (Whole Raw White Cashew Kernels)',
    originBelt: 'Hand-Graded Whole Ivory Cashew Kernels (Packed in Kathmandu)',
    shelfLife: '9–12 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Premium Cashew Nuts (200 GM Glass Jar) are whole, ivory-white raw cashew kernels (W240/W320 grade) selected for their plump size, creamy texture, and natural mild sweetness. Unfried, unsalted, and unbleached, they are versatile for both raw snacking and traditional Nepali cooking, kheer, and baby nut pastes.',
    nepaliKitchenUses: [
      'Everyday Clean Snacking & Soaking: Enjoy 6–8 whole raw cashews with morning tea, or soak for 2 hours to blend into creamy dairy-free cashew milk.',
      'Festive Kheer, Halwa & Pulao: Lightly golden-roast in a spoon of cow ghee for rice kheer, gajar halwa, suji halwa, and celebratory pulao.',
      'Homemade Baby Nut Powder (6M+): Dry-roast gently and grind with Raw Almonds and Makhana into a fine powder to enrich baby lito/jaulo (from 6 months, as advised by your pediatrician).',
      'Rich Paneer & Vegetable Gravy Base: Soak 8–10 cashews in warm water for 15 minutes and blend into a silky paste for shahi paneer or mushroom curry.',
    ],
    whoItSuits:
      'Ideal for families who prefer unsalted, unroasted whole cashews for versatile kitchen cooking, baby food preparation, puja/festive offerings, and clean snacking.',
    monsoonStorage:
      'Whole cashews absorb moisture quickly in humid monsoon weather. Always screw the glass jar lid shut tightly after use, and store in a cool cupboard or refrigerator.',
    comparisonTitle: 'NaturesMud Premium Raw Cashews (200 GM) vs Loose Market Kaju',
    comparisonRows: [
      {
        feature: 'Kernel Grade',
        naturesMud: 'Whole, unbroken W240/W320 ivory kernels',
        typicalMarket: 'Mixed broken splits, scorched pieces & stale stock',
      },
      {
        feature: 'Chemical Bleaching',
        naturesMud: '0% Chlorine / Sulphur Bleaching (Natural warm ivory)',
        typicalMarket: 'Sometimes chemically whitened to mask age',
      },
      {
        feature: 'Packaging',
        naturesMud: 'Airtight 200 GM Glass Jar locking in crunch',
        typicalMarket: 'Thin plastic bags prone to weevil insects & humidity',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Premium Cashew Nuts (काजु / Kaju) in Nepal?',
        a: 'NaturesMud Premium Cashew Nuts (200 GM Glass Jar) is priced at Rs. 750 in Nepal (Rs. 375 per 100g). We deliver in 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'What is the difference between Premium Cashew Nuts (200 GM) and Roasted Cashew Nuts (150 GM)?',
        a: 'Premium Cashew Nuts (200 GM, Rs. 750) are raw, unsalted whole white cashews ideal for cooking, kheer, baby nut powder, and raw snacking. Roasted Cashew Nuts (150 GM, Rs. 750) are slow dry-roasted and lightly seasoned with Himalayan Pink Salt for ready-to-eat crunchy snacking.',
      },
      {
        q: 'Can I use these cashews to make baby lito powder?',
        a: 'Yes! Because these are 100% raw and unsalted, they are the right choice for dry-roasting at home and grinding into nut powder for babies (from 6 months, as advised by your pediatrician; introduce tree nuts carefully).',
      },
      {
        q: 'Are these whole cashews or broken pieces?',
        a: 'Every jar contains hand-sorted whole cashew kernels.',
      },
      {
        q: 'Do you offer bulk or gift hampers for Dashain, Tihar, and Bhai Tika?',
        a: 'Yes, our glass-jar cashews, almonds, pistachios, and figs are a top choice for Bhai Tika masala and corporate gift hampers.',
      },
    ],
    complementarySlugs: ['raw-himalayan-almonds', 'premium-pistachio-roasted-salted', 'dry-figs-anjeer'],
    variantGroupTitle: 'Choose Cashew Style',
    variants: [
      {
        slug: 'premium-cashewnuts',
        label: 'Raw Whole Cashew Nuts',
        weight: '200 GM',
        price: 750,
        badge: 'Raw & Unsalted (Cooking / Baby Paste / Snacking)',
      },
      {
        slug: 'roasted-cashewnuts',
        label: 'Roasted Cashew Nuts',
        weight: '150 GM',
        price: 750,
        badge: 'Dry-Roasted with Pink Salt (Ready Snack)',
      },
    ],
  },

  'roasted-cashewnuts': {
    slug: 'roasted-cashewnuts',
    seoTitle: 'Roasted Cashew Nuts Price in Nepal | 150g Jar | NaturesMud',
    metaDescription: 'Buy Roasted Cashew Nuts (150 GM) at Rs. 750 in Nepal. Slow dry-roasted whole cashews seasoned with Himalayan pink salt, 0 oil frying. Fast Nepal delivery.',
    nepaliNameDevanagari: 'रोस्टेड काजु (भुटेको काजु)',
    nepaliNameRoman: 'Bhuteko Kaju (Dry-Roasted & Lightly Salted Cashews)',
    originBelt: 'Small-Batch Dry-Roasted in Kathmandu with Himalayan Pink Salt',
    shelfLife: '9 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Roasted Cashew Nuts (150 GM Glass Jar) are plump whole cashew kernels slow dry-roasted in small batches without a single drop of refined palm or vegetable oil, then lightly dusted with pure Himalayan Pink Salt. Because moisture is driven out during slow roasting, each kernel has a deep golden crunch and rich nutty aroma.',
    nepaliKitchenUses: [
      'Ready-to-Eat Tea-Time & Office Snack: Enjoy 6–8 crunchy roasted cashews straight from the glass jar alongside afternoon chiya or black coffee.',
      'Hospitality & Guest Serving Tray: Serve to guests during Dashain, Tihar, family gatherings, or evening get-togethers without any kitchen prep.',
      'Crunchy Salad & Pulao Topper: Scatter whole or halved roasted cashews over vegetable pulao, fried rice, or noodle bowls right before serving.',
      'Trekking & Travel Energy Jar: Pack in your car or rucksack for instant protein and healthy monounsaturated fats on the road.',
    ],
    whoItSuits:
      'Designed for snack lovers who want a crispy, savory roasted cashew without unhealthy deep-frying in palm oil, as well as festive gift buyers.',
    monsoonStorage:
      'Roasted nuts pull moisture from humid air faster than raw nuts. Close the glass jar lid tightly immediately after serving to keep the cashews crisp.',
    comparisonTitle: 'NaturesMud Dry-Roasted Cashews vs Commercial Oil-Fried Salted Cashews',
    comparisonRows: [
      {
        feature: 'Roasting Method',
        naturesMud: '100% Oil-Free Slow Dry Roasting',
        typicalMarket: 'Deep-fried in reused palmolein or cottonseed oil',
      },
      {
        feature: 'Salt Used',
        naturesMud: 'Lightly dusted with unrefined Himalayan Pink Salt',
        typicalMarket: 'Coated in heavy refined white salt & maltodextrin',
      },
      {
        feature: 'Aftertaste',
        naturesMud: 'Clean, sweet-nutty crunch with zero greasy fingers',
        typicalMarket: 'Greasy oil film and rancid aftertaste',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Roasted Cashew Nuts (रोस्टेड काजु) in Nepal?',
        a: 'NaturesMud Roasted Cashew Nuts (150 GM Glass Jar) costs Rs. 750 in Nepal (Rs. 500 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across Nepal.',
      },
      {
        q: 'Why is the Roasted Cashew jar 150 GM while Raw Cashews are 200 GM at Rs. 750?',
        a: 'Slow dry-roasting removes natural kernel moisture and requires small-batch artisanal roasting and hand-grading of whole unbroken kernels, yielding 150 GM of ready-to-eat roasted cashews.',
      },
      {
        q: 'Are these cashews fried in oil or butter?',
        a: 'No! They are 100% dry-roasted without any oil, butter, or ghee—so they are never greasy.',
      },
      {
        q: 'What kind of salt is used on these cashews?',
        a: 'We use only a light dusting of pure unrefined Himalayan Pink Salt (Sindhe Noon).',
      },
      {
        q: 'Should I choose Raw or Roasted Cashews for baby food?',
        a: 'For babies (6M+), choose our Raw Whole Cashew Nuts (200 GM) since they have 0% added salt. Choose Roasted Cashew Nuts (150 GM) for adult and family snacking.',
      },
    ],
    complementarySlugs: ['premium-cashewnuts', 'roasted-almonds', 'premium-pistachio-roasted-salted'],
    variantGroupTitle: 'Choose Cashew Style',
    variants: [
      {
        slug: 'premium-cashewnuts',
        label: 'Raw Whole Cashew Nuts',
        weight: '200 GM',
        price: 750,
        badge: 'Raw & Unsalted (Cooking / Baby Paste / Snacking)',
      },
      {
        slug: 'roasted-cashewnuts',
        label: 'Roasted Cashew Nuts',
        weight: '150 GM',
        price: 750,
        badge: 'Dry-Roasted with Pink Salt (Ready Snack)',
      },
    ],
  },

  'roasted-almonds': {
    slug: 'roasted-almonds',
    seoTitle: 'Roasted Almonds Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Roasted Almonds / Badam (200 GM) at Rs. 750 in Nepal. Slow dry-roasted crunchy almonds with Himalayan pink salt, 0 oil frying. Fast Nepal delivery.',
    nepaliNameDevanagari: 'रोस्टेड बदाम (भुटेको बदाम)',
    nepaliNameRoman: 'Bhuteko Badam (Oil-Free Dry-Roasted Almonds)',
    originBelt: 'Small-Batch Dry-Roasted in Kathmandu',
    shelfLife: '9–12 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Roasted Almonds (200 GM Glass Jar) are plump, whole sweet almonds slow dry-roasted without a drop of cooking oil and lightly seasoned with pure Himalayan Pink Salt. Dry-roasting transforms the dense raw kernel into a crisp, aromatic snack while preserving natural Vitamin E, plant protein, magnesium, and monounsaturated fats.',
    nepaliKitchenUses: [
      '4 PM Office Desk & Study Snack: Keep the glass jar on your work desk and eat 8–10 crunchy Roasted Almonds instead of biscuits or fried namkeen.',
      'Pre-Gym & Trekking Pocket Fuel: Pair a handful of Roasted Almonds with 2 slices of Dehydrated Mango or Dried Cranberries before a workout or hike.',
      'Chopped Oatmeal & Ice-Cream Crunch: Coarsely chop 4–5 roasted almonds over morning porridge, dahi, or desserts.',
      'Festive Bhai Tika & Gift Hamper Staple: Ready to serve straight from the glass jar during Tihar and family celebrations.',
    ],
    whoItSuits:
      'Perfect for professionals, students, trekkers, and anyone who prefers the deep, nutty crunch of roasted almonds ready to eat straight from the jar.',
    monsoonStorage:
      'Keep the glass jar tightly closed after taking a handful so monsoon humidity does not soften the roasted crunch.',
    comparisonTitle: 'NaturesMud Dry-Roasted Almonds vs Oil-Fried Packet Almonds',
    comparisonRows: [
      {
        feature: 'Roasting Process',
        naturesMud: 'Slow Oil-Free Dry Roasting (0% added vegetable/palm oil)',
        typicalMarket: 'Fried in refined palm oil with artificial smoke flavor',
      },
      {
        feature: 'Seasoning',
        naturesMud: 'Lightly seasoned with pure Himalayan Pink Salt',
        typicalMarket: 'Heavy refined sodium and MSG flavour enhancers',
      },
      {
        feature: 'Kernel Quality',
        naturesMud: '100% Sweet Whole Kernels (Zero bitter kernels)',
        typicalMarket: 'Mixed sizes with chipped skins',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Roasted Almonds (रोस्टेड बदाम) in Nepal?',
        a: 'NaturesMud Roasted Almonds (200 GM Glass Jar) costs Rs. 750 in Nepal (Rs. 375 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Should I buy Raw Almonds or Roasted Almonds?',
        a: 'Buy Raw Almonds (Rs. 750 / 200 GM) if you want to soak them overnight in water (भिजाएको बदाम) and peel the skin in the morning, or grind them for baby food. Buy Roasted Almonds (Rs. 750 / 200 GM) if you want a crunchy, ready-to-eat snack straight from the jar.',
      },
      {
        q: 'Are these almonds roasted in oil?',
        a: 'No—they are 100% dry-roasted in hot air without any oil, butter, or ghee.',
      },
      {
        q: 'How many Roasted Almonds should I eat per day?',
        a: 'A healthy daily portion is 8 to 12 almonds (about 15g–20g) per day.',
      },
      {
        q: 'How do I keep them crunchy during the rainy season?',
        a: 'Always close the airtight glass jar lid immediately after taking your portion and store away from kitchen steam.',
      },
    ],
    complementarySlugs: ['raw-himalayan-almonds', 'roasted-cashewnuts', 'dried-blueberries'],
    variantGroupTitle: 'Choose Almond Style',
    variants: [
      {
        slug: 'raw-himalayan-almonds',
        label: 'Raw Almonds (Unroasted)',
        weight: '200 GM',
        price: 750,
        badge: 'Best for Overnight Soaking & Baby Paste',
      },
      {
        slug: 'roasted-almonds',
        label: 'Roasted Almonds (Dry-Roasted)',
        weight: '200 GM',
        price: 750,
        badge: 'Best for Crunchy Desk & Tea-Time Snacking',
      },
    ],
  },

  'raw-himalayan-almonds': {
    slug: 'raw-himalayan-almonds',
    seoTitle: 'Raw Almonds Price in Nepal | 200g Glass Jar | NaturesMud',
    metaDescription: 'Buy Raw Almonds / Badam (200 GM) at Rs. 750 in Nepal. Unroasted sweet whole almonds for overnight soaking, kids, badam milk & gifting. Fast Nepal delivery.',
    nepaliNameDevanagari: 'काँचो बदाम (प्रिमियम आलमण्ड)',
    nepaliNameRoman: 'Kancho Badam (100% Raw Unroasted Sweet Almonds)',
    originBelt: 'Hand-Graded Whole Sweet Almond Kernels (Packed in Kathmandu)',
    shelfLife: '12 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Raw Almonds (200 GM Glass Jar) are 100% unroasted, unsalted, whole sweet almond kernels packed in an airtight glass jar. Because they are completely raw and unpasteurized by chemical steam, they swell plumply when soaked overnight in water—making them the gold standard for morning soaked badam, homemade almond milk, and baby nut powder.',
    nepaliKitchenUses: [
      'Morning Soaked Badam Ritual (भिजाएको बदाम): Soak 5–8 Raw Almonds in clean water overnight. In the morning, slip off the brown skin and eat on an empty stomach for Vitamin E, magnesium, and plant protein.',
      'Warm Saffron-Badam Doodh for Kids & Elders: Blanch 6 soaked almonds, grind into a smooth paste with a splash of milk, and simmer in 1 cup of milk with Dates Powder and cardamom.',
      'Homemade Baby Badam Powder (6M+): Dry-roast gently at home and grind into a fine powder to stir into infant lito, jaulo, or suji kheer (from 6 months, as advised by your pediatrician).',
      'Homemade Almond Butter & Halwa: Roast and blend into 100% pure almond butter or traditional badam ko halwa.',
    ],
    whoItSuits:
      'Essential for students, children, pregnant/nursing mothers, elders practicing the morning soaked-almond habit, and parents making homemade baby nut powder.',
    monsoonStorage:
      'Keep the glass jar tightly sealed in a cool, dark cupboard. During hot and humid monsoon months, storing raw nuts in the refrigerator keeps their natural Vitamin E oils fresh for over a year.',
    comparisonTitle: 'NaturesMud Raw Almonds vs Loose Open-Sack Market Badam',
    comparisonRows: [
      {
        feature: 'Sweet Kernel Guarantee',
        naturesMud: '100% Sweet Almond Variety (Non-bitter, uniform whole kernels)',
        typicalMarket: 'Often contains shriveled, chipped, or bitter kernels',
      },
      {
        feature: 'Soaking Performance',
        naturesMud: 'Raw & unheated — plumps up crisp and white when soaked overnight',
        typicalMarket: 'Old warehouse stock often turns soggy or smells stale',
      },
      {
        feature: 'Packaging Hygiene',
        naturesMud: 'Sealed 200 GM Airtight Glass Jar',
        typicalMarket: 'Sold from open gunny sacks exposed to dust & humidity',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Raw Almonds (काँचो बदाम / Badam) in Nepal?',
        a: 'NaturesMud Raw Almonds (200 GM Glass Jar) costs Rs. 750 in Nepal (Rs. 375 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Why do Nepali families soak Raw Almonds overnight and peel the skin?',
        a: 'Brown almond skin contains natural tannins and phytic acid. Soaking Raw Almonds in water for 8 hours softens the kernel and makes it easy to slip off the skin so nutrients are easier to digest.',
      },
      {
        q: 'How many Raw Almonds are in one 200 GM jar?',
        a: 'One 200 GM jar contains approximately 160 to 180 whole almond kernels—enough for about 25 to 30 days at 6 almonds per day.',
      },
      {
        q: 'Can I use these Raw Almonds for a 6-month+ baby?',
        a: 'Yes! Never give whole nuts to babies or young toddlers (choking hazard). Instead, soak and grind into a smooth paste, or dry-roast and mill into a fine powder to stir into baby lito (from 6 months, as advised by your pediatrician).',
      },
      {
        q: 'What is the difference between Raw Almonds and Roasted Almonds?',
        a: 'Raw Almonds are unheated and unsalted (best for overnight soaking, peeling, and cooking), while Roasted Almonds are slow dry-roasted with a touch of Himalayan Pink Salt for crunchy ready-to-eat snacking.',
      },
    ],
    complementarySlugs: ['roasted-almonds', 'premium-cashewnuts', 'dry-figs-anjeer'],
    variantGroupTitle: 'Choose Almond Style',
    variants: [
      {
        slug: 'raw-himalayan-almonds',
        label: 'Raw Almonds (Unroasted)',
        weight: '200 GM',
        price: 750,
        badge: 'Best for Overnight Soaking & Baby Paste',
      },
      {
        slug: 'roasted-almonds',
        label: 'Roasted Almonds (Dry-Roasted)',
        weight: '200 GM',
        price: 750,
        badge: 'Best for Crunchy Desk & Tea-Time Snacking',
      },
    ],
  },

  'superfood-trail-mix': {
    slug: 'superfood-trail-mix',
    seoTitle: 'Superfood Trail Mix Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Superfood Trail Mix (200 GM) at Rs. 790 in Nepal. Balanced blend of almonds, cashews, pistachios, pumpkin seeds & berries. 0 added sugar. Fast.',
    nepaliNameDevanagari: 'सुपरफुड ट्रेल मिक्स (नट्स र सिड्स मिक्स)',
    nepaliNameRoman: 'Superfood Trail Mix (Nuts, Seeds & Berries Blend)',
    originBelt: 'Hand-Blended in Kathmandu from Whole Nuts, Seeds & Berries',
    shelfLife: '9 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Superfood Trail Mix (200 GM Glass Jar) is a balanced, ready-to-eat daily nutrition blend combining whole Almonds, Cashew Nuts, Pistachios, Green Pumpkin Seeds, Flax/Chia Seeds, and tangy Dried Cranberries & Blueberries. Unlike cheap market trail mixes padded out with 60% salted peanuts, fried sev, or candied papaya cubes, every spoonful of our mix is 100% premium nuts, seeds, and real berries.',
    nepaliKitchenUses: [
      '11 AM or 4 PM Office Desk Fuel: Eat 2 tablespoons (25g–30g) straight from the jar to power through long work meetings without a sugar crash.',
      'Himalayan Trekking & Cycling Mix: Carry in your backpack on Annapurna, Langtang, or Shivapuri hikes for sustained protein, healthy fats, and berry carbohydrates.',
      'Instant Morning Oatmeal & Dahi Topper: Spoon over plain dahi, muesli, or warm oats to add 6+ nuts, seeds, and berries in one step.',
      'Healthy Travel & Flight Snack: Keep in your handbag or car console when traveling across Nepal.',
    ],
    whoItSuits:
      'Built for busy professionals, trekkers, runners, students, and anyone who wants a single jar delivering almonds, cashews, seeds, and berries together.',
    monsoonStorage:
      'Because the mix combines crunchy nuts/seeds with chewy dried berries, keep the glass jar tightly closed in a cool, dry place away from sunlight.',
    comparisonTitle: 'NaturesMud Superfood Trail Mix vs Cheap Commercial Mixed Packets',
    comparisonRows: [
      {
        feature: 'Primary Ingredients',
        naturesMud: 'Almonds, Cashews, Pistachios, Pumpkin Seeds, Cranberries & Blueberries',
        typicalMarket: 'Padded with 50%–70% cheap peanuts, corn flakes & sugar-candied cubes',
      },
      {
        feature: 'Oil & Sugar',
        naturesMud: '0% Oil Frying, 0% Refined Sugar Coating',
        typicalMarket: 'Coated in palm oil, glucose syrup & excess sodium',
      },
      {
        feature: 'Freshness',
        naturesMud: 'Small-batch packed in an airtight 200 GM Glass Jar',
        typicalMarket: 'Mass-packed in nitrogen pouches that go stale once opened',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Superfood Trail Mix in Nepal?',
        a: 'NaturesMud Superfood Trail Mix (200 GM Glass Jar) is priced at Rs. 790 in Nepal (Rs. 395 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Does this Trail Mix contain cheap peanuts or fried noodles?',
        a: 'No! We use 0% peanuts and 0% fried snacks—only whole almonds, cashews, pistachios, green pumpkin seeds, superfood seeds, and real dried berries.',
      },
      {
        q: 'How much Trail Mix should I eat per day?',
        a: 'A satisfying daily serving is 1 small handful (about 25g to 30g, or 2 tablespoons) between meals or before a workout.',
      },
      {
        q: 'Is it sweetened or heavily salted?',
        a: 'It is unsweetened (natural tart-sweetness comes from the dried cranberries and blueberries) and free from heavy salt or MSG.',
      },
      {
        q: 'Can I gift this jar for Dashain, Tihar, or corporate wellness?',
        a: 'Yes, the 200 GM glass jar shows the colourful layers of nuts, green seeds, and ruby berries clearly, making it a popular festive and corporate gift.',
      },
    ],
    complementarySlugs: ['raw-himalayan-almonds', 'pumpkin-seeds', 'dried-cranberries'],
  },

  'macadamia-nuts': {
    slug: 'macadamia-nuts',
    seoTitle: 'Macadamia Nuts Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Macadamia Nuts (200 GM) at Rs. 1,100 in Nepal (Rs. 550/100g). Creamy whole macadamia kernels rich in monounsaturated fats. Fast Kathmandu & Nepal.',
    nepaliNameDevanagari: 'म्याकाडामिया नट्स (हाडे बदाम)',
    nepaliNameRoman: 'Macadamia Nuts (Whole Creamy Kernels)',
    originBelt: 'Mid-Hill Orchards of Nepal (Kavre, Syangja & Palpa — 900m–1,500m)',
    shelfLife: '9 months in its airtight glass jar; refrigerate in warm weather',
    whatItIs:
      'NaturesMud Macadamia Nuts (200 GM) are plump, creamy, ivory-white macadamia kernels harvested and cracked cleanly from hard shells. Known for their rich, buttery crunch and high concentration of heart-friendly monounsaturated fatty acids (palmitoleic and oleic acids) with very low carbohydrates, they are one of the most prized gourmet nuts grown in Nepal’s mid-hills.',
    nepaliKitchenUses: [
      'Gourmet Keto & Low-Carb Snack: Enjoy 4–6 whole Macadamia Nuts straight from the pack for clean, buttery satiety.',
      'Light Pan-Toasted Tea Accompaniment: Toast gently in a dry pan for 2 minutes with a tiny pinch of Himalayan Pink Salt to bring out a rich, buttery aroma.',
      'Homemade Macadamia Nut Butter: Blend toasted Macadamia kernels in a food processor for 4 minutes until they turn into silky macadamia butter.',
      'Festive Cookies & Dark Chocolate Bark: Fold chopped macadamias into white/dark chocolate bark or oat cookies.',
    ],
    whoItSuits:
      'Suits gourmet nut lovers, ketogenic/low-carb eaters, trekkers needing calorie-dense clean fuel, and families looking for a luxury Dashain/Tihar gift.',
    monsoonStorage:
      'Macadamia kernels have the highest natural oil content of any tree nut (>70% healthy fats). Keep tightly sealed away from heat and sunlight, and store in the refrigerator during warm summer and monsoon months.',
    comparisonTitle: 'NaturesMud Shelled Macadamia Kernels vs In-Shell Market Macadamias',
    comparisonRows: [
      {
        feature: 'Edible Weight Value',
        naturesMud: '100% Shelled Edible Kernels (200 GM net kernel weight)',
        typicalMarket: 'In-shell macadamias are ~65% rock-hard shell weight you throw away',
      },
      {
        feature: 'Convenience',
        naturesMud: 'Ready to eat immediately — no special metal cracker needed',
        typicalMarket: 'Requires a heavy screw-cracker or hammer to open',
      },
      {
        feature: 'Freshness',
        naturesMud: 'Hand-sorted creamy white kernels with zero rancid nuts',
        typicalMarket: 'Hidden moldy or shriveled kernels inside closed shells',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Macadamia Nuts (म्याकाडामिया नट्स) in Nepal?',
        a: 'NaturesMud Shelled Macadamia Nuts (200 GM Pack) costs Rs. 1,100 in Nepal (Rs. 550 per 100g of 100% edible kernel). We deliver across Kathmandu Valley and nationwide.',
      },
      {
        q: 'Are these Macadamia Nuts already shelled or in the hard shell?',
        a: 'They are 100% shelled, ready-to-eat whole and half kernels—so you get 200 GM of pure edible nut without paying for heavy shell weight or struggling to crack them.',
      },
      {
        q: 'How many Macadamia Nuts should I eat per day?',
        a: 'Because macadamias are rich and calorie-dense, 5 to 8 kernels (about 15g–20g) per day is an ideal serving.',
      },
      {
        q: 'Do Macadamia Nuts grow in Nepal?',
        a: 'Yes! Macadamia trees thrive in Nepal’s mid-hill districts such as Palpa, Syangja, Kavre, and Dhading between 900m and 1,500m altitude.',
      },
      {
        q: 'How should I store shelled Macadamia Nuts?',
        a: 'Seal tightly after each use and store in a cool cupboard or inside the refrigerator to keep their buttery oils fresh.',
      },
    ],
    complementarySlugs: ['premium-pistachio-roasted-salted', 'raw-himalayan-almonds', 'premium-cashewnuts'],
  },

  'virgin-coconut-oil-500ml': {
    slug: 'virgin-coconut-oil-500ml',
    seoTitle: 'Extra Virgin Coconut Oil 500ml Price in Nepal | NaturesMud',
    metaDescription: 'Buy Extra Virgin Coconut Oil (500 ML) at Rs. 1,750 in Nepal. 100% cold-pressed unrefined oil for cooking, baby massage, hair & oil pulling. Fast delivery.',
    nepaliNameDevanagari: 'भर्जिन नरिवलको तेल (५०० ml)',
    nepaliNameRoman: 'Cold-Pressed Extra Virgin Nariwal ko Tel (500 ML Family Jar)',
    originBelt: 'Cold-Pressed from Fresh Mature Coconut Milk (0% Heat / 0% Hexane)',
    shelfLife: '18 months in a cool cupboard away from direct sunlight',
    whatItIs:
      'NaturesMud Extra Virgin Coconut Oil (500 ML Family Value Jar) is cold-extracted from fresh, mature white coconut milk without heat, chemical hexane solvents, bleaching, or deodorizing. Crystal-clear above 24°C and snow-white when solidified in cooler Kathmandu winters, it retains ~50% natural Lauric Acid and Medium-Chain Triglycerides (MCTs) with a delicate, fresh coconut aroma.',
    nepaliKitchenUses: [
      'Clean Everyday Cooking, Baking & Bulletproof Coffee: Use 1 teaspoon to 1 tablespoon for sautéing vegetables, frying eggs/pancakes, or blending into morning black coffee for MCT energy.',
      'Gentle Baby Massage (तेल मालिस) & Skin Care: Warm a small spoonful between your palms for daily infant skin massage, diaper-area soothing, and cradle-cap care.',
      'Morning Ayurvedic Oil Pulling (Gandusha): Swish 1 tablespoon in your mouth for 5–10 minutes on an empty stomach before brushing, then spit into a bin and rinse with warm water.',
      'Deep Hair & Scalp Conditioning: Massage slightly warmed oil into scalp and hair lengths 1 hour before washing.',
    ],
    whoItSuits:
      'The economical 500 ML family jar suits households using virgin coconut oil daily across kitchen cooking, baby massage, oil pulling, and hair/skin care.',
    monsoonStorage:
      'Always use a clean, dry spoon so water droplets do not enter the jar. Note that pure virgin coconut oil naturally solidifies into a snow-white butter below 24°C (winter) and melts crystal-clear above 25°C (summer)—this phase change is the hallmark of unrefined purity.',
    comparisonTitle: 'NaturesMud Cold-Pressed Extra Virgin Coconut Oil vs Refined / Copra Hair Oil',
    comparisonRows: [
      {
        feature: 'Extraction Source',
        naturesMud: 'Cold-pressed from fresh white coconut milk (Edible & cosmetic grade)',
        typicalMarket: 'Expeller-pressed from smoke-dried copra, then bleached & deodorized',
      },
      {
        feature: 'Chemical Solvents & Mineral Oil',
        naturesMud: '0% Hexane, 0% Paraffin/Mineral Oil, 0% Synthetic Perfume',
        typicalMarket: 'Commercial hair oils often contain 50%+ liquid paraffin (mineral oil)',
      },
      {
        feature: 'Size Value Comparison',
        naturesMud: '500 ML Family Jar at Rs. 1,750 (Rs. 350 / 100ml)',
        typicalMarket: '180 ML Trial Jar at Rs. 650 (Rs. 361 / 100ml)',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Extra Virgin Coconut Oil (500ml) in Nepal?',
        a: 'NaturesMud Extra Virgin Coconut Oil (500 ML Family Jar) costs Rs. 1,750 in Nepal (Rs. 350 per 100ml). We also offer a 180 ML jar at Rs. 650 for travel or trial.',
      },
      {
        q: 'Is this Coconut Oil edible for cooking as well as safe for baby massage?',
        a: 'Yes! Because it is 100% pure cold-pressed food-grade Extra Virgin Coconut Oil with 0 additives or perfumes, you can use the exact same jar for cooking, oil pulling, baby massage, and hair care.',
      },
      {
        q: 'Why did my Coconut Oil turn solid white in winter?',
        a: 'Pure unrefined coconut oil has a natural melting point of 24°C (76°F). In cool Kathmandu weather it solidifies into a soft white butter, and in warm weather it turns crystal-clear liquid. Place the jar in a bowl of warm water for 5 minutes if you prefer it liquid in winter.',
      },
      {
        q: 'Can I add a drop of Virgin Coconut Oil to my baby’s lito/jaulo?',
        a: 'Yes, many parents stir 1/4 to 1/2 teaspoon of food-grade Virgin Coconut Oil or cow ghee into warm baby porridge for healthy fats (from 6 months, as advised by your pediatrician).',
      },
      {
        q: 'Should I choose the 500 ML jar or the 180 ML jar?',
        a: 'Choose the 500 ML jar (Rs. 1,750) for daily family cooking, baby massage, or oil pulling (better per-100ml value). Choose the 180 ML jar (Rs. 650) for travel, skincare table use, or first-time trial.',
      },
    ],
    complementarySlugs: ['dehydrated-coconut-chips', 'chia-seeds', 'banana-powder'],
    variantGroupTitle: 'Select Jar Size (D12 Pack Size Selector)',
    variants: [
      {
        slug: 'virgin-coconut-oil-180ml',
        label: '180 ML Trial / Travel Jar',
        weight: '180 ML',
        price: 650,
        badge: 'Rs. 361 / 100ml · Compact Size',
      },
      {
        slug: 'virgin-coconut-oil-500ml',
        label: '500 ML Family Value Jar',
        weight: '500 ML',
        price: 1750,
        badge: 'Rs. 350 / 100ml · Best Value',
      },
    ],
  },

  'virgin-coconut-oil-180ml': {
    slug: 'virgin-coconut-oil-180ml',
    seoTitle: 'Extra Virgin Coconut Oil 180ml Price in Nepal | NaturesMud',
    metaDescription: 'Buy Extra Virgin Coconut Oil (180 ML) at Rs. 650 in Nepal. Cold-pressed unrefined coconut oil for baby massage, skin, hair & keto coffee. Fast delivery.',
    nepaliNameDevanagari: 'भर्जिन नरिवलको तेल (१८० ml)',
    nepaliNameRoman: 'Cold-Pressed Extra Virgin Nariwal ko Tel (180 ML Compact Jar)',
    originBelt: 'Cold-Pressed from Fresh Mature Coconut Milk (0% Heat / 0% Hexane)',
    shelfLife: '18 months in a cool cupboard away from direct sunlight',
    whatItIs:
      'NaturesMud Extra Virgin Coconut Oil (180 ML Compact Jar) contains the exact same 100% cold-pressed, unrefined virgin coconut oil extracted from fresh coconut milk—packed in a convenient 180 ML jar ideal for baby massage tables, vanity/skincare use, travel bags, or first-time tasting before upgrading to the 500 ML family jar.',
    nepaliKitchenUses: [
      'Daily Baby Massage & Nursery Table Jar: Keep this compact 180 ML jar solely in the bedroom/nursery for hygienic daily baby skin massage and moisturizing.',
      'Natural Makeup Remover & Night Moisturizer: Warm 3–4 drops between fingertips to dissolve waterproof makeup and nourish dry winter skin in Kathmandu.',
      'Morning Oil Pulling & Lip Care: Swish 1 teaspoon for morning oral hygiene or dab onto chapped lips.',
      'Travel-Size Keto Coffee & Cooking Oil: Easy to pack for trips, treks, or hostel kitchens.',
    ],
    whoItSuits:
      'Perfect for new parents wanting a dedicated nursery jar for baby massage, individuals using virgin coconut oil for skin/hair care, travelers, and first-time buyers.',
    monsoonStorage:
      'Keep the lid tightly closed and use a clean, dry spoon so bathroom or kitchen humidity does not enter the oil.',
    comparisonTitle: 'NaturesMud 180 ML Compact Jar vs 500 ML Family Jar',
    comparisonRows: [
      {
        feature: 'Oil Purity',
        naturesMud: '100% Cold-Pressed Extra Virgin Coconut Oil (Identical purity in both jars)',
        typicalMarket: 'Commercial small bottles often mix mineral oil & synthetic fragrance',
      },
      {
        feature: 'Best Use Case',
        naturesMud: '180 ML (Rs. 650) for Baby Nursery, Skincare Vanity & Travel',
        typicalMarket: '500 ML (Rs. 1,750) for Daily Kitchen Cooking & Family Use',
      },
      {
        feature: 'Additives',
        naturesMud: '0% Preservatives, 0% Bleaching, 0% Paraffin',
        typicalMarket: 'Refined, bleached, deodorized (RBD) copra oil',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Extra Virgin Coconut Oil (180ml) in Nepal?',
        a: 'NaturesMud Extra Virgin Coconut Oil (180 ML Jar) is priced at Rs. 650 in Nepal (Rs. 361 per 100ml). Need a larger size? Switch to our 500 ML Family Jar (Rs. 1,750) using the size selector above.',
      },
      {
        q: 'Is the oil inside the 180 ML jar the exact same as the 500 ML jar?',
        a: 'Yes! Both jars contain the exact same 100% cold-pressed, food-grade Extra Virgin Coconut Oil. Many families buy the 500 ML jar for the kitchen and the 180 ML jar for the baby massage/dressing table.',
      },
      {
        q: 'Is it safe for newborn and infant skin massage?',
        a: 'Yes, because it is cold-pressed from fresh coconut milk with 0% mineral oil, 0% hexane, and 0% artificial perfume, it is gentle for baby skin massage.',
      },
      {
        q: 'Can I eat or cook with this 180 ML jar?',
        a: 'Absolutely—it is 100% culinary food-grade Extra Virgin Coconut Oil.',
      },
      {
        q: 'Why does it solidify in cold weather?',
        a: 'Unrefined virgin coconut oil naturally solidifies below 24°C and melts above 25°C without losing any nutritional value.',
      },
    ],
    complementarySlugs: ['virgin-coconut-oil-500ml', 'banana-powder', 'sweet-potato-powder'],
    variantGroupTitle: 'Select Jar Size (D12 Pack Size Selector)',
    variants: [
      {
        slug: 'virgin-coconut-oil-180ml',
        label: '180 ML Trial / Travel Jar',
        weight: '180 ML',
        price: 650,
        badge: 'Rs. 361 / 100ml · Compact Size',
      },
      {
        slug: 'virgin-coconut-oil-500ml',
        label: '500 ML Family Value Jar',
        weight: '500 ML',
        price: 1750,
        badge: 'Rs. 350 / 100ml · Best Value',
      },
    ],
  },

  'carrot-powder': {
    slug: 'carrot-powder',
    seoTitle: 'Carrot Powder Price in Nepal | 100g Jar | NaturesMud',
    metaDescription: 'Buy Carrot Powder / Gajar Powder (100 GM) at Rs. 490 in Nepal. 100% pure dehydrated Nepali carrots rich in beta-carotene for baby lito, soups & rotis.',
    nepaliNameDevanagari: 'गाजर पाउडर',
    nepaliNameRoman: 'Gajar Powder (100% Pure Dehydrated Carrot Powder)',
    originBelt: 'Chitwan, Kavre & Bhaktapur Farms (250m–1,400m)',
    shelfLife: '12 months in a cool, dark cupboard',
    whatItIs:
      'NaturesMud Carrot Powder is cold-milled from 100% sweet, orange Nepali carrots harvested at peak winter maturity. Nearly 900g of washed carrots are sliced, gently dehydrated below 45°C to protect natural beta-carotene (pro-vitamin A) and lutein, and ground into a bright orange powder—with 0% added sugar, 0% starch fillers, and 0% artificial color.',
    nepaliKitchenUses: [
      'Baby Weaning Jaulo & Lito (6M+): Stir 1 teaspoon (5g) into simmering rice jaulo, mung dal soup, or suji porridge with a drop of ghee/coconut oil so fat-soluble beta-carotene absorbs well (from 6 months, as advised by your pediatrician).',
      'Golden-Orange Chapati & Paratha: Knead 1 tablespoon into whole-wheat atta to make soft, beta-carotene-rich orange rotis for school tiffin.',
      'Quick Carrot Soup & Dal Thickener: Whisk 1 tablespoon into vegetable soup, thukpa broth, or yellow dal.',
      'Instant Gajar Halwa & Kheer Boost: Add 2 tablespoons to simmering milk with Dates Powder and cardamom for a quick carrot milk/kheer.',
    ],
    whoItSuits:
      'Ideal for infants starting weaning meals (from 6 months, as advised by your pediatrician), picky-eater toddlers who refuse cooked vegetable pieces, students, and busy home cooks.',
    monsoonStorage:
      'Natural carrot sugars absorb humidity if left open. Keep the glass jar lid tightly closed in a dark cupboard away from sunlight and stove steam, and always use a dry spoon.',
    comparisonTitle: 'NaturesMud Carrot Powder vs Out-of-Season Market Carrots',
    comparisonRows: [
      {
        feature: 'Ingredient Purity',
        naturesMud: '100% Pure Winter Carrots (~9x fresh weight concentration)',
        typicalMarket: 'Monsoon market carrots are often watery, fibrous, or cold-stored',
      },
      {
        feature: 'Prep Time for Baby Lito',
        naturesMud: 'Ready in 1 minute — no peeling, steaming, or mashing',
        typicalMarket: '20 minutes of washing, peeling, pressure-cooking & puréeing',
      },
      {
        feature: 'Additives',
        naturesMud: '0% Maltodextrin, 0% Orange Food Dye, 0% Preservatives',
        typicalMarket: 'Commercial soup mixes contain MSG, cornstarch & high sodium',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Carrot Powder (गाजर पाउडर) in Nepal?',
        a: 'NaturesMud Carrot Powder (100 GM Glass Jar) costs Rs. 490 in Nepal (Rs. 490 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Can I give Carrot Powder to my 6-month-old baby?',
        a: 'Yes! It is 100% single-ingredient carrot with 0 salt, 0 sugar, and 0 preservatives. Cook 1/2 to 1 teaspoon in baby jaulo, lito, or dal soup for 2 minutes (suitable from 6 months, as advised by your pediatrician).',
      },
      {
        q: 'Why should I add a drop of ghee or coconut oil when cooking Carrot Powder?',
        a: 'Carrots are rich in beta-carotene (pro-vitamin A), which is a fat-soluble nutrient. Cooking with a tiny drop of ghee or Virgin Coconut Oil helps the body absorb beta-carotene effectively.',
      },
      {
        q: 'How many fresh carrots go into one 100 GM jar?',
        a: 'Fresh carrots are ~88% water, so roughly 850g to 900g of fresh Nepali carrots are dehydrated and milled to fill a single 100 GM jar.',
      },
      {
        q: 'Does it contain any salt, sugar, or cornstarch?',
        a: 'No—0% salt, 0% added sugar, and 0% starch fillers.',
      },
    ],
    complementarySlugs: ['sweet-potato-powder', 'beetroot-powder', 'banana-powder'],
  },

  'sweet-potato-powder': {
    slug: 'sweet-potato-powder',
    seoTitle: 'Sweet Potato Powder Price in Nepal | 100g | NaturesMud',
    metaDescription: 'Buy Sweet Potato Powder / Sakharkhanda Powder (100 GM) at Rs. 510 in Nepal. 100% pure root flour for baby lito, pancakes & gym shakes. Fast Nepal delivery.',
    nepaliNameDevanagari: 'सखरखण्ड पाउडर',
    nepaliNameRoman: 'Sakharkhanda Powder (100% Pure Sweet Potato Flour)',
    originBelt: 'Chitwan, Nawalpur & Makwanpur Farms (200m–800m)',
    shelfLife: '12 months in a cool, dry cupboard',
    whatItIs:
      'NaturesMud Sweet Potato Powder is made from 100% farm-fresh Nepali sweet potatoes (Sakharkhanda / सखरखण्ड). Washed, peeled, thinly sliced, gently dehydrated at low temperatures, and cold-milled into a smooth, naturally sweet root flour, it delivers complex low-glycemic carbohydrates, dietary fiber, and beta-carotene with 0% added sugar and 0% preservatives.',
    nepaliKitchenUses: [
      'Wholesome Baby Weaning Porridge (6M+): Cook 1 to 1.5 teaspoons (6g–8g) in water or milk for 3 minutes with a drop of ghee to make a silky, comforting sweet potato porridge (from 6 months, as advised by your pediatrician).',
      'Pre-Workout & Mass-Gainer Shake: Blend 1–2 tablespoons with milk, Banana Powder, and peanut/almond butter for clean complex carbohydrates instead of synthetic maltodextrin mass gainers.',
      'Soft Roti, Pancake & Waffle Flour: Replace 20% of wheat flour with Sweet Potato Powder for naturally soft, lightly sweet rotis and kids’ pancakes.',
      'Fasting (Maghe Sankranti / Ekadashi) Kheer & Halwa: Roast 2 tablespoons in a spoon of ghee and simmer with milk and Dates Powder.',
    ],
    whoItSuits:
      'Loved by parents preparing nutritious first weaning meals (from 6 months, as advised by your pediatrician), gym athletes wanting clean complex carbs, and families enjoying Sakharkhanda year-round.',
    monsoonStorage:
      'Keep the glass jar tightly sealed in a cool, dry cupboard and always use a dry spoon during humid monsoon months.',
    comparisonTitle: 'NaturesMud Sweet Potato Powder vs Synthetic Maltodextrin Carbs',
    comparisonRows: [
      {
        feature: 'Carbohydrate Quality',
        naturesMud: '100% Whole Root Complex Carbs + Natural Prebiotic Fiber',
        typicalMarket: 'Ultra-processed corn maltodextrin that spikes blood sugar',
      },
      {
        feature: 'Baby Weaning Convenience',
        naturesMud: 'Cooks into smooth porridge in 3 minutes (Zero stringy fibers)',
        typicalMarket: 'Boiling whole sweet potatoes takes 25 minutes & leaves coarse strings',
      },
      {
        feature: 'Additives',
        naturesMud: '0% Added Sugar, 0% Preservatives, 0% Artificial Flavor',
        typicalMarket: 'Commercial mixes contain sucrose & synthetic flavors',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Sweet Potato Powder (सखरखण्ड पाउडर) in Nepal?',
        a: 'NaturesMud Sweet Potato Powder (100 GM Glass Jar) costs Rs. 510 in Nepal (Rs. 510 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'How do I cook Sweet Potato Powder for a 6-month+ baby?',
        a: 'Whisk 1 teaspoon of Sweet Potato Powder into 1/2 cup of cold water or milk (so there are no lumps), then simmer on low heat for 2–3 minutes while stirring until smooth and creamy (from 6 months, as advised by your pediatrician).',
      },
      {
        q: 'Why do babies love Sweet Potato Porridge?',
        a: 'Sweet potato has a mild, naturally sweet flavor and creamy texture without any fibrous strings, making it one of the easiest first solid foods for infants.',
      },
      {
        q: 'Can gym-goers use Sweet Potato Powder in protein shakes?',
        a: 'Yes! Adding 1–2 tablespoons to your post-workout or pre-workout shake provides clean, slow-digesting complex carbohydrates without refined sugar.',
      },
      {
        q: 'Does it contain any wheat (maida/atta) or added sugar?',
        a: 'No—it is naturally gluten-free and contains 100% pure dehydrated sweet potato with 0 added sugar.',
      },
    ],
    complementarySlugs: ['banana-powder', 'carrot-powder', 'dates-powder'],
  },

  'pure-mountain-himalayan-shilajit-resin': {
    slug: 'pure-mountain-himalayan-shilajit-resin',
    seoTitle: 'Pure Himalayan Shilajit Resin Price in Nepal | NaturesMud',
    metaDescription: 'Buy Pure Himalayan Shilajit Resin (20 GM) at Rs. 1,995 in Nepal. High-altitude purified resin from Dolpa & Mustang (~80 daily servings). Fast Nepal.',
    nepaliNameDevanagari: 'शुद्ध हिमाली शिलाजीत रेजिन',
    nepaliNameRoman: 'Shuddha Himali Shilajit Resin (20 GM Glass Jar)',
    originBelt: 'High-Altitude Alpine Rock Cliffs of Dolpa, Mugu & Mustang (3,000m–4,200m)',
    shelfLife: '24 months in its airtight dark glass jar',
    whatItIs:
      'NaturesMud Pure Himalayan Shilajit Resin (20 GM Glass Jar) is authentic, semi-solid mineral pitch collected from high-altitude rock crevices in the Nepal Himalayas (Dolpa, Mugu, and Mustang) and traditionally purified using clean spring water filtration and gentle sun/low-heat concentration (`Surya Tapi` / water-only extraction) without chemical solvents. It is a thick, glossy brownish-black resin rich in naturally occurring fulvic acid, humic substances, and trace alpine minerals.',
    nepaliKitchenUses: [
      'Morning Warm Water Ritual: Dissolve a pea-sized drop (approx. 250mg, about the size of a grain of rice/small pea) in a glass of lukewarm water (not boiling) and drink on an empty stomach.',
      'Traditional Warm Milk Preparation: Stir a pea-sized portion (250mg) into a cup of warm milk in the morning or evening.',
      'Solubility Purity Check at Home: Drop a rice-grain portion into warm water—authentic Shilajit resin dissolves completely into a golden-brown liquid within 2 minutes without leaving sandy grit at the bottom.',
      'High-Altitude Trekking & Physical Recovery: Used traditionally across the Himalaya by mountaineers and active adults.',
    ],
    whoItSuits:
      'Intended strictly for adults (men and women 18+) seeking traditional Himalayan mineral resin. Not for children, and not for pregnant or nursing women unless advised by a qualified physician.',
    monsoonStorage:
      'Pure Shilajit resin responds to temperature: in cold winter weather it becomes firm and brittle like glass, while in warm monsoon/summer weather it becomes softer and more viscous. Keep the lid tightly closed in a cool cupboard at room temperature (do not refrigerate).',
    comparisonTitle: 'NaturesMud Pure Shilajit Resin vs Adulterated Capsules & Powders',
    comparisonRows: [
      {
        feature: 'Physical Form',
        naturesMud: '100% Pure Semi-Solid Resin (Traditional least-processed form)',
        typicalMarket: 'Dry powders or capsules often diluted with maltodextrin or charcoal',
      },
      {
        feature: 'Price per Gram & Servings',
        naturesMud: 'Rs. 1,995 for 20 GM (~80 daily servings of 250mg = Rs. 25/day)',
        typicalMarket: 'Overpriced 10g jars or cheap Rs. 500 boiled molasses fakes',
      },
      {
        feature: 'Water Solubility Test',
        naturesMud: 'Dissolves 100% in warm water with zero sandy residue',
        typicalMarket: 'Leaves gritty rock dust or smells like burnt sugar',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Pure Himalayan Shilajit Resin (शिलाजीत) in Nepal?',
        a: 'NaturesMud Pure Himalayan Shilajit Resin (20 GM Glass Jar) is priced at Rs. 1,995 in Nepal (Rs. 99.75 per gram). At a standard daily serving of 250mg, one 20 GM jar lasts approximately 80 days.',
      },
      {
        q: 'How much Shilajit Resin should I take per day (दैनिक कति मात्रा खाने)?',
        a: 'Take a small rice-grain to pea-sized portion (approximately 200mg to 250mg) once daily dissolved in lukewarm water or warm milk.',
      },
      {
        q: 'How can I verify the purity of Shilajit Resin at home?',
        a: '1) Solubility test: A pea-sized drop dissolves completely in warm water into a reddish-black/golden liquid with zero sand at the bottom. 2) Temperature test: It hardens when cold and softens in warm hands. 3) Flame test: Pure Shilajit does not catch fire like candle wax or sugar; it bubbles and turns to ash.',
      },
      {
        q: 'Do you have a third-party lab report (COA) for heavy metals?',
        a: 'Our Shilajit is water-purified and filtered in small batches. If you require batch documentation before ordering, message us on WhatsApp (+977-9713888002).',
      },
      {
        q: 'Who should avoid taking Shilajit?',
        a: 'Children, pregnant or breastfeeding women, and individuals with gout, high uric acid, or iron-overload conditions (hemochromatosis) should avoid Shilajit or consult their physician before use.',
      },
    ],
    complementarySlugs: ['raw-himalayan-almonds', 'premium-pistachio-roasted-salted', 'moringa-leaf-powder'],
  },

  'flax-seeds': {
    slug: 'flax-seeds',
    seoTitle: 'Flax Seeds (Alash) Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Flax Seeds / Alash (200 GM) at Rs. 570 in Nepal. Clean whole brown flax seeds rich in plant Omega-3, lignans & fiber for chhop, smoothies & rotis.',
    nepaliNameDevanagari: 'आलस (अर्ग्यानिक आलसको दाना)',
    nepaliNameRoman: 'Alash / Alas ko Dana (Whole Brown Flax Seeds)',
    originBelt: 'Terai & Mid-Hill Winter Harvests (Chitwan, Dang & Kavre)',
    shelfLife: '12 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Flax Seeds (loved across Nepal as Alash / आलस) are triple-cleaned, glossy brown whole flax seeds packed in a 200 GM glass jar. Completely free from stones, soil grit, and chaff, Alash is a traditional Nepali superfood celebrated for its high plant-based Omega-3 fatty acids (ALA), soluble and insoluble mucilage fiber, and plant lignans.',
    nepaliKitchenUses: [
      'Traditional Nepali Alash ko Chhop (आलसको छोप): Dry-roast Flax Seeds in an iron pan until they crackle, then pound or grind with roasted garlic, timur (Sichuan pepper), dry red chili, and Himalayan Black Salt (Bire Noon) to serve with rice, dal, or boiled potatoes.',
      'Freshly Ground Morning Omega-3 Booster: Lightly toast and grind 1 tablespoon of Flax Seeds into a coarse meal to stir into warm oats, dahi, or smoothies (grinding unlocks Omega-3 inside the hard seed coat).',
      'High-Fiber Chapati & Bread Dough: Add 1–2 tablespoons of ground roasted Alash into whole-wheat atta for soft, nutty rotis.',
      'Vegan Egg Replacer for Baking: Mix 1 tablespoon of ground Flax Seeds with 3 tablespoons of warm water and let sit for 5 minutes until gelatinous to replace 1 egg in cakes or pancakes.',
    ],
    whoItSuits:
      'Ideal for Nepali households making authentic stone-free Alash ko Chhop, vegetarians seeking plant Omega-3, adults wanting daily soluble fiber, and home bakers.',
    monsoonStorage:
      'Whole flax seeds stay fresh for up to 12 months in their sealed glass jar because the outer seed hull protects the delicate Omega-3 oils. Once you roast and grind them into powder, consume the ground powder within 1–2 weeks.',
    comparisonTitle: 'NaturesMud Triple-Cleaned Flax Seeds vs Loose Market Alash',
    comparisonRows: [
      {
        feature: 'Stone & Grit Removal',
        naturesMud: '100% Triple-Cleaned (Zero tiny stones that chip teeth in Chhop)',
        typicalMarket: 'Loose market Alash often contains soil clods, grit & weed seeds',
      },
      {
        feature: 'Seed Quality',
        naturesMud: 'Plump, glossy, oil-rich brown seeds from fresh harvest',
        typicalMarket: 'Dull, shriveled seeds with rancid oil taste',
      },
      {
        feature: 'Packaging',
        naturesMud: '200 GM Airtight Glass Jar',
        typicalMarket: 'Open plastic packets',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Flax Seeds (आलस / Alash) in Nepal?',
        a: 'NaturesMud Flax Seeds (Alash 200 GM Glass Jar) costs Rs. 570 in Nepal (Rs. 285 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Should I eat Flax Seeds (आलस) whole or ground?',
        a: 'Whole flax seeds have a tough outer shell that can pass through digestion unbroken. For maximum Omega-3 and lignan absorption, lightly dry-roast the seeds until they pop and grind them into a powder (like Alash ko Chhop) or chew thoroughly.',
      },
      {
        q: 'Do I need to wash or pick stones out of NaturesMud Flax Seeds?',
        a: 'No! Our Flax Seeds are already triple-cleaned and sorted so you can dry-roast them directly from the glass jar without worrying about gritty stones.',
      },
      {
        q: 'How much Flax Seeds should I eat daily?',
        a: '1 tablespoon (about 10g to 12g) of roasted and ground Flax Seeds per day is the ideal daily portion.',
      },
      {
        q: 'How do I make quick Nepali Alash ko Chhop at home?',
        a: 'Dry-roast 1/2 cup of NaturesMud Flax Seeds on medium-low heat for 3–4 minutes until they crackle and smell nutty. Cool completely, then pulse in a dry grinder with 1/2 tsp Bire Noon, roasted chili, and a pinch of timur.',
      },
    ],
    complementarySlugs: ['chia-seeds', 'pumpkin-seeds', 'pure-himalayan-black-salt-bire-noon'],
  },

  'premium-pistachio-roasted-salted': {
    slug: 'premium-pistachio-roasted-salted',
    seoTitle: 'Premium Pistachio Price in Nepal | 200g Jar | NaturesMud',
    metaDescription: 'Buy Premium Pistachio Roasted & Salted / Pista (200 GM) at Rs. 1,250 in Nepal. Naturally open-shell jumbo pistachios with Himalayan pink salt. Fast.',
    nepaliNameDevanagari: 'प्रिमियम पिस्ता (रोस्टेड तथा साल्टेड)',
    nepaliNameRoman: 'Pista (Roasted & Lightly Salted Jumbo Pistachios)',
    originBelt: 'Hand-Selected Jumbo Open-Shell Pistachios (Roasted in Small Batches)',
    shelfLife: '9–12 months in its airtight glass jar',
    whatItIs:
      'NaturesMud Premium Pistachio Roasted & Salted (200 GM Glass Jar) features naturally split, jumbo emerald-green pistachio nuts slow-roasted without oil and lightly seasoned with pure Himalayan Pink Salt. Rich in Vitamin B6, potassium, plant protein, and lutein/zeaxanthin carotenoids, every jar is hand-screened to minimize closed uncracked shells.',
    nepaliKitchenUses: [
      'Mindful Shell-Crack Evening Snack: Crack open 15–20 pistachios with afternoon tea—the act of shelling naturally paces your snacking.',
      'Festive Kheer, Kulfi & Barfi Garnish: Sliver the emerald-green kernels over rice kheer, badam milk, rasmalai, or gajar halwa.',
      'Bhai Tika Masala & Dashain/Tihar Gift Jar: A centerpiece nut jar for Bhai Tika gift trays and wedding/corporate hampers.',
      'Pista Milk & Lassi Blend: Blend shelled pistachios with warm milk, cardamom, and Dates Powder for a rich green pista shake.',
    ],
    whoItSuits:
      'Perfect for pistachio lovers, festive Bhai Tika / Dashain gift shoppers, families wanting oil-free roasted nuts, and dessert makers.',
    monsoonStorage:
      'Open-shell pistachios lose their crispness quickly if exposed to monsoon humidity. Keep the glass jar lid screwed on tightly right after serving.',
    comparisonTitle: 'NaturesMud Jumbo Pistachios vs Bleached Commercial Market Pista',
    comparisonRows: [
      {
        feature: 'Shell & Kernel Quality',
        naturesMud: 'Naturally tree-split jumbo shells with emerald-green kernels (Unbleached)',
        typicalMarket: 'Chemically bleached white shells with many closed uncracked nuts',
      },
      {
        feature: 'Roasting & Salt',
        naturesMud: 'Oil-free dry roasting with light Himalayan Pink Salt',
        typicalMarket: 'Heavily encrusted in refined industrial salt',
      },
      {
        feature: 'Packaging',
        naturesMud: '200 GM Airtight Glass Jar locking in roast crunch',
        typicalMarket: 'Loose sacks that go soft in Kathmandu humidity',
      },
    ],
    faqs: [
      {
        q: 'What is the price of Premium Pistachio Roasted & Salted (पिस्ता / Pista) in Nepal?',
        a: 'NaturesMud Premium Pistachio Roasted & Salted (200 GM Glass Jar) is priced at Rs. 1,250 in Nepal (Rs. 625 per 100g). We deliver within 24–48 hours in Kathmandu Valley and across all 77 districts.',
      },
      {
        q: 'Are the pistachio shells easy to open?',
        a: 'Yes! We select naturally tree-split jumbo pistachios and screen out unsplit closed shells so nearly every pistachio opens effortlessly by hand.',
      },
      {
        q: 'Are these pistachios bleached white or dyed green?',
        a: 'Neither. The outer shell has its natural warm ivory-cream tone (0% peroxide bleaching), and the inner kernel is naturally green from chlorophyll and lutein.',
      },
      {
        q: 'How many pistachios are in one daily serving?',
        a: 'A standard daily serving is about 25 to 30 pistachios (roughly 28g–30g in shell).',
      },
      {
        q: 'Can I use these pistachios in sweet kheer and desserts?',
        a: 'Yes—because they are only lightly seasoned with Himalayan Pink Salt, shelling and chopping the kernels works beautifully as a garnish for kheer, halwa, and kulfi.',
      },
    ],
    complementarySlugs: ['macadamia-nuts', 'raw-himalayan-almonds', 'dry-figs-anjeer'],
  },
};

export function getProductDossier(
  slug: string,
  liveProduct?: { price?: number; weight?: string; name?: string; official_label_name?: string } | null
): ProductSeoDossier | undefined {
  let base: ProductSeoDossier | undefined = undefined;

  // Prioritize decoupled JSON file from content/products/<slug>.json on server
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(process.cwd(), 'content', 'products', `${slug}.json`);
      if (fs.existsSync(jsonPath)) {
        base = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    } catch {
      // Fallback to compiled object
    }
  }

  if (!base) {
    base = PRODUCT_SEO_DOSSIERS[slug];
  }

  if (!base) return undefined;
  if (!liveProduct || (!liveProduct.price && !liveProduct.weight)) return base;

  const price = Number(liveProduct.price || 0);
  const weight = liveProduct.weight || '100 GM';
  const unitPrice = price > 0 ? formatUnitPrice(price, weight) : '';

  const updatedFaqs = base.faqs.map((faq, idx) => {
    if (idx === 0 && price > 0 && /price/i.test(faq.q)) {
      const label = liveProduct.official_label_name || liveProduct.name || 'This product';
      return {
        ...faq,
        a: `NaturesMud ${label} (${weight}) is priced at Rs. ${price.toLocaleString()} in Nepal (${unitPrice}). We deliver within 24–48 hours in Kathmandu Valley and 2–5 days across all 77 districts of Nepal.`,
      };
    }
    return faq;
  });

  return {
    ...base,
    faqs: updatedFaqs,
  };
}

export interface ProductNepaliLayer {
  headingNp: string;
  summaryNp: string;
  usesNp: string[];
  storageNp: string;
}

export const TOP_10_NEPALI_LAYERS: Record<string, ProductNepaliLayer> = {
  'sweet-potato-powder': {
    headingNp: 'सखरखण्ड पाउडर (Sweet Potato Powder — १०० ग्राम सिसाको जार | रु. ५१०)',
    summaryNp:
      'नेचर्स मड (NaturesMud) को सखरखण्ड पाउडर १००% शुद्ध नेपाली सखरखण्डलाई केलाएर, कम तापक्रममा सुकाएर पिँधिएको एकल-सामग्री (Single-Ingredient) खाद्य पाउडर हो। यसमा चिनी, नुन, रंग वा कुनै पनि प्रिजर्भेटिभ मिसाइएको छैन।',
    usesNp: [
      'शिशुको लिटो र जाउलो (६ महिना पूरा भएपछि, बालरोग विशेषज्ञको सल्लाह अनुसार — from 6 months, as advised by your pediatrician): १ देखि १.५ चिया चम्चा पाउडर मनतातो पानी वा दूधमा घोलेर २–३ मिनेट पकाउनुहोस्।',
      'रोटी र प्यानकेक: गहुँको पिठो वा ओट्सको घोलमा २ चम्चा सखरखण्ड पाउडर मिसाएर नरम र पोषिलो खाजा बनाउनुहोस्।',
      'स्मूदी र खीर: दूध वा दहीको स्मूदीलाई बाक्लो र स्वादिष्ट बनाउन १ चम्चा मिसाउनुहोस्।',
    ],
    storageNp:
      'बर्खायाम (असार–भदौ) मा ओस पस्न नदिन सधैँ सुख्खा चम्चा मात्र प्रयोग गर्नुहोस् र प्रयोग पछि सिसाको जारको बिर्को कसेर बन्द गर्नुहोस्।',
  },
  'dates-powder': {
    headingNp: 'खजुर पाउडर (Dates Powder — १०० ग्राम सिसाको जार | रु. ४००)',
    summaryNp:
      'नेचर्स मड खजुर पाउडर १००% शुद्ध सुकेको खजुरबाट तयार पारिएको प्राकृतिक गुलियो पाउडर हो। सेतो चिनीको सट्टामा शिशुको खाना, दूध, खीर र बेकिङमा प्रयोग गर्न यो उत्तम विकल्प हो।',
    usesNp: [
      'शिशुको लिटो र खीरमा प्राकृतिक गुलियो (६ महिना पूरा भएपछि, बालरोग विशेषज्ञको सल्लाह अनुसार — from 6 months, as advised by your pediatrician): पाकेको लिटो, जाउलो वा हलुवामा १/२ देखि १ चम्चा मिसाउनुहोस्।',
      'तातो दूध र ओट्स: बिहानको ओटमिल वा मनतातो दूधमा १ चम्चा खजुर पाउडर घोलेर पिउनुहोस्।',
      'घरायसी केक र लड्डु: सेतो चिनीको बदलामा १:१ को अनुपातमा प्रयोग गर्नुहोस्।',
    ],
    storageNp:
      'खजुरमा प्राकृतिक मिठास हुने भएकाले हावाको ओसले डल्लो पर्न सक्छ; सधैँ सुख्खा चम्चा प्रयोग गरी चिसो र सुख्खा ठाउँमा राख्नुहोस्।',
  },
  'banana-powder': {
    headingNp: 'केरा पाउडर (Banana Powder — १०० ग्राम सिसाको जार | रु. ६५०)',
    summaryNp:
      'चितवन र नवलपुरका ताजा केरालाई सफा गरी कम तापक्रममा सुकाएर बनाइएको १००% शुद्ध केरा पाउडर। यसमा कुनै पनि कृत्रिम बास्ना, चिनी वा मिल्क पाउडर मिसाइएको छैन।',
    usesNp: [
      'शिशुको लिटो र प्युरी (६ महिना पूरा भएपछि, बालरोग विशेषज्ञको सल्लाह अनुसार — from 6 months, as advised by your pediatrician): १ चम्चा केरा पाउडर मनतातो दूध वा पाकेको जाउलोमा मिसाउनुहोस्।',
      'ब्रेकफास्ट शेक र स्मूदी: १ चम्चा केरा पाउडर, १ चम्चा खजुर पाउडर र १ गिलास दूध ब्ल्यान्ड गरी पोषिलो शेक बनाउनुहोस्।',
      'प्यानकेक र टिफिन: बच्चाको स्कुल टिफिनको लागि गहुँ वा ओट्सको प्यानकेकमा मिसाउनुहोस्।',
    ],
    storageNp:
      'प्रत्येक पटक प्रयोग गरेपछि सिसाको जारको बिर्को राम्ररी बन्द गरी घाम नलाग्ने सुख्खा दराजमा राख्नुहोस्।',
  },
  'carrot-powder': {
    headingNp: 'गाजर पाउडर (Carrot Powder — १०० ग्राम सिसाको जार | रु. ४९०)',
    summaryNp:
      'नेपाली ताजा गाजरलाई कम तापक्रममा डिहाइड्रेट गरी तयार पारिएको १००% शुद्ध गाजर पाउडर। प्राकृतिक बिटा-क्यारोटिन (भिटामिन ए को स्रोत) र फाइबरले भरिपूर्ण।',
    usesNp: [
      'शिशुको जाउलो र सुप (६ महिना पूरा भएपछि, बालरोग विशेषज्ञको सल्लाह अनुसार — from 6 months, as advised by your pediatrician): मुगीको दाल र चामलको जाउलोमा १ चिया चम्चा गाजर पाउडर मिसाउनुहोस्।',
      'गहुँको रोटी र पराठा: पिठो मुछ्दा १–२ चम्चा गाजर पाउडर मिसाएर रंगीन र पोषिलो रोटी बनाउनुहोस्।',
      'दही र स्मूदी: दही वा फलफूलको स्मूदीमा १ चम्चा मिसाउनुहोस्।',
    ],
    storageNp:
      'रङ र पोषण जोगाउन सिसाको जारलाई प्रत्यक्ष घाम र चुल्होको बाफबाट टाढा राख्नुहोस्।',
  },
  'freeze-dried-avocado-powder': {
    headingNp: 'फ्रिज-ड्राइ एभोकाडो पाउडर (Freeze Dried Avocado Powder — ८० ग्राम सिसाको जार | रु. ७९०)',
    summaryNp:
      'नेपालका पहाडी भेगमा फलेका पाकेका एभोकाडोलाई अत्याधुनिक फ्रिज-ड्राइ (Freeze-Dried) प्रविधिबाट सुकाएर बनाइएको १००% शुद्ध पाउडर। स्वस्थकर मोनोअनस्याचुरेटेड फ्याट र फाइबरको प्राकृतिक स्रोत।',
    usesNp: [
      'शिशुको खानामा स्वस्थ फ्याट (६ महिना पूरा भएपछि, बालरोग विशेषज्ञको सल्लाह अनुसार — from 6 months, as advised by your pediatrician): पाकेको लिटो, जाउलो वा सखरखण्ड प्युरीमा १ चिया चम्चा मिसाउनुहोस्।',
      'तुरुन्तै बन्ने ग्वाकामोले (Guacamole): २ चम्चा एभोकाडो पाउडरमा २–३ चम्चा मनतातो पानी, कागतीको रस र सिधे नुन मिसाएर टोस्टमा दल्नुहोस्।',
      'ग्रिन स्मूदी: दूध, केरा र चिया सिड्ससँग ब्ल्यान्ड गरी क्रिमी स्मूदी बनाउनुहोस्।',
    ],
    storageNp:
      'एभोकाडोमा प्राकृतिक तेल हुने हुँदा जार खोलेपछि बिर्को कसेर राख्नुहोस् र गर्मी तथा बर्खामा फ्रिजमा राख्दा अझ ताजा रहन्छ।',
  },
  'beetroot-powder': {
    headingNp: 'चुकन्दर पाउडर (Beetroot Powder — १०० ग्राम सिसाको जार | रु. ४३०)',
    summaryNp:
      'ताजा रातो चुकन्दरलाई कम तापक्रममा सुकाएर पिँधिएको १००% शुद्ध चुकन्दर पाउडर। प्राकृतिक डाइटरी नाइट्रेट, बेटालेन र आइरनको स्रोत — कुनै कृत्रिम रङ वा चिनी बिना।',
    usesNp: [
      'व्यायाम वा दौड अघिको पेय (Pre-Workout Drink): १ चिया चम्चा (५ ग्राम) चुकन्दर पाउडर १ गिलास मनतातो पानी र कागतीको रसमा घोलेर पिउनुहोस्।',
      'गुलाबी रोटी र पुरी: गहुँको पिठोमा १–२ चम्चा मिसाएर बच्चा र परिवारको लागि आकर्षक रातो/गुलाबी रोटी बनाउनुहोस्।',
      'दही रायता र स्मूदी: दही वा फलफूलको स्मूदीमा १ चिया चम्चा मिसाउनुहोस्।',
    ],
    storageNp:
      'चुकन्दर पाउडरले हावाको ओस छिटो तान्ने हुँदा सधैँ सुख्खा चम्चा प्रयोग गर्नुहोस् र बिर्को कसेर राख्नुहोस्।',
  },
  'moringa-leaf-powder': {
    headingNp: 'सजिवन / सहिजन पातको पाउडर — शीतलचिनी / मोरिङ्गा (Moringa Leaf Powder — १०० ग्राम सिसाको जार | रु. ६९०)',
    summaryNp:
      'नेपालमा सजिवन वा सहिजन (स्थानीय रूपमा शीतलचिनी) भनिने मोरिङ्गाका कलिला हरिया पातहरूलाई छहारीमा सुकाएर (Shade-Dried) तयार पारिएको १००% शुद्ध पाउडर। यसमा डाँठ नमिसाई पात मात्र पिँधिएको छ।',
    usesNp: [
      'बिहानको मनतातो पानीमा: १/२ देखि १ चिया चम्चा सजिवन (मोरिङ्गा) पाउडर मनतातो पानी र २ थोपा कागतीको रसमा घोलेर पिउनुहोस्।',
      'दाल, तरकारी र सुपमा: पाकिसकेको दाल, क्वाँटी वा तरकारी पस्कनु अघि १ चिया चम्चा माथिबाट छर्केर मिसाउनुहोस्।',
      'मोही र ग्रिन स्मूदी: दिउँसोको मोही (छाछ) मा थोरै बिरे नुन र १/२ चम्चा मोरिङ्गा पाउडर मिसाएर पिउनुहोस्।',
    ],
    storageNp:
      'हरियो क्लोरोफिल र पोषण जोगाउन जारलाई घाम नपर्ने चिसो र अँध्यारो दराजमा बन्द गरी राख्नुहोस्।',
  },
  'strawberry-powder': {
    headingNp: 'फ्रिज-ड्राइ स्ट्रबेरी पाउडर (Freeze Dried Strawberry Powder — ८० ग्राम सिसाको जार | रु. १,३९५)',
    summaryNp:
      'पाकेका ताजा स्ट्रबेरीलाई सब-जिरो फ्रिज-ड्राइ प्रविधिबाट सुकाएर बनाइएको १००% शुद्ध फलफूलको पाउडर। बजारका चिनी र कृत्रिम गुलाबी रङ मिसाइएका पाउडर भन्दा पूर्णतः फरक र प्राकृतिक।',
    usesNp: [
      'स्ट्रबेरी दूध र मिल्कशेक: १ गिलास दूधमा १ चम्चा स्ट्रबेरी पाउडर र १ चम्चा खजुर पाउडर मिसाएर बच्चाको लागि शुद्ध स्ट्रबेरी मिल्क बनाउनुहोस्।',
      'दही, ओट्स र चिया पुडिङ: बिहानको दही वा ओट्समा १ चम्चा मिसाएर प्राकृतिक बास्ना र भिटामिन सी प्राप्त गर्नुहोस्।',
      'केक र फ्रस्टिङ: केकको क्रिम वा आइसिङमा प्राकृतिक गुलाबी रङ र स्ट्रबेरी स्वाद दिन प्रयोग गर्नुहोस्।',
    ],
    storageNp:
      'फ्रिज-ड्राइ पाउडर निकै हलुका र ओस तान्ने प्रकृतिको हुने हुँदा प्रयोग लगत्तै बिर्को कसेर बन्द गर्नुहोस्।',
  },
  'chia-seeds': {
    headingNp: 'चिया सिड्स (Chia Seeds — ३०० ग्राम सिसाको जार | रु. ४९५ — प्रति १०० ग्राम मात्र रु. १६५)',
    summaryNp:
      'नेचर्स मडको ३०० ग्राम सिसाको जारमा उपलब्ध १००% शुद्ध, नभुटेको कालो चिया सिड्स। प्लान्ट ओमेगा-३ (ALA), घुलनशील फाइबर, क्याल्सियम र प्रोटिनको उत्कृष्ट स्रोत।',
    usesNp: [
      'बिहानको कागती-चिया सिड्स पानी: १ चम्चा चिया सिड्स १ गिलास पानीमा १५–२० मिनेट भिजाएर कागतीको रस मिसाई पिउनुहोस्।',
      'ओभरनाइट चिया पुडिङ: ३ चम्चा चिया सिड्स १ कप दूध र १ चम्चा खजुर पाउडरमा मिसाएर रातभरि फ्रिजमा राख्नुहोस् र बिहान फलफूलसँग खानुहोस्।',
      'मोही, दही र सलाद: भिजाएको चिया सिड्स दही वा फलफूलमा मिसाएर खानुहोस्। (नोट: चिया सिड्स सधैँ पानी वा तरलमा भिजाएर मात्र खानुहोस्)।',
    ],
    storageNp:
      'सिसाको एयरटाइट जारमा ओस नपर्ने गरी राख्दा १८ महिनासम्म सुरक्षित रहन्छ।',
  },
  'pumpkin-seeds': {
    headingNp: 'फर्सीको बिया (Pumpkin Seeds — ३०० ग्राम सिसाको जार | रु. ६५० — प्रति १०० ग्राम रु. २१६.६७)',
    summaryNp:
      'बोक्रा छोडाइएको १००% शुद्ध काँचो हरियो फर्सीको बिया (AAA Grade Pepitas)। प्राकृतिक जिंक (Zinc), म्याग्नेसियम, आइरन र प्लान्ट प्रोटिनले भरिपूर्ण।',
    usesNp: [
      'दैनिक खाजा: दिनमा १ मुठी (२०–३० ग्राम) काँचो वा हल्का तावामा सेकाएर चपाएर खानुहोस्।',
      'ओट्स, सलाद र दहीमा: बिहानको ओटमिल, मुएस्ली वा सलादमाथि छर्केर कुरमुरे बनाउनुहोस्।',
      'अचार र छोप: हल्का भुटेर लसुन र सिधे नुनसँग पिँधी स्वादिष्ट छोप बनाउनुहोस्।',
    ],
    storageNp:
      'बर्खा र गर्मीमा प्राकृतिक तेल ताजा राख्न सिसाको जारको बिर्को कसेर चिसो ठाउँमा राख्नुहोस्।',
  },
  'raw-himalayan-almonds': {
    headingNp: 'काँचो बदाम (Raw Almonds — २०० ग्राम सिसाको जार | रु. ७५० — प्रति १०० ग्राम रु. ३७५)',
    summaryNp:
      'रातभरि पानीमा भिजाएर खान र घरायसी बदामको दूध बनाउन उपयुक्त १००% शुद्ध काँचो बदाम। भिटामिन ई, प्रोटिन र स्वस्थकर चिल्लो पदार्थको प्राकृतिक स्रोत।',
    usesNp: [
      'भिजाएको बदाम (बिहानको बानी): राति ६–८ दाना बदाम सफा पानीमा भिजाउनुहोस् र बिहान बोक्रा छोडाएर खानुहोस्।',
      'बदामको दूध र खीर: भिजाएको बदाम पिँधेर खीर, हलुवा वा बच्चाको लिटोमा मिसाउनुहोस्।',
      'चाडपर्व र भाइटीका मसला: दशैँ, तिहार र भाइटीकाको उपहार तथा मसलाको लागि उत्तम।',
    ],
    storageNp:
      'प्लास्टिकको प्याकेटमा बदाम छिटो ढुसी पर्ने हुँदा सधैँ नेचर्स मडको एयरटाइट सिसाको जारमा बन्द गरी राख्नुहोस्।',
  },
  'virgin-coconut-oil-500ml': {
    headingNp: 'एक्स्ट्रा भर्जिन नरिवलको तेल (Extra Virgin Coconut Oil — ५०० मिलि रु. १,७५० | १८० मिलि रु. ६५०)',
    summaryNp:
      'ताजा नरिवलको दूधबाट बिना ताप (Cold-Pressed) र बिना रसायन निकालिएको १००% शुद्ध, अनरिफाइन्ड एक्स्ट्रा भर्जिन नरिवलको तेल। खाना पकाउन, शिशुको मालिस गर्न र कपाल/छालाको हेरचाहका लागि उपयुक्त।',
    usesNp: [
      'शिशुको मालिस र छालाको हेरचाह: कुनै केमिकल वा मिनरल आयल नभएको हुँदा नवजात शिशु र बच्चाको शरीर मालिस गर्न सुरक्षित।',
      'भान्सा र बेकिङ: अण्डा, प्यानकेक, हलुवा पकाउन वा बिहानको ब्ल्याक कफीमा १ चम्चा मिसाउन।',
      'आयुर्वेदिक आयल पुलिङ (गण्डूष) र कपालमा: बिहान १ चम्चा तेल मुखमा राखी कुल्ला गर्न र कपालको जरामा लगाउन।',
    ],
    storageNp:
      'शुद्ध नरिवलको तेल २४ डिग्री सेल्सियस भन्दा कम तापक्रम (जाडोयाम) मा प्राकृतिक रूपमै जम्छ र गर्मीमा पग्लिन्छ — यो शुद्धताको चिन्ह हो।',
  },
};

export function getNepaliLayer(slug: string): ProductNepaliLayer | undefined {
  return TOP_10_NEPALI_LAYERS[slug];
}

export function formatUnitPrice(price: number, weightStr?: string): string {
  if (!weightStr) return `Rs. ${price} / 100g`;
  const match = weightStr.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
  if (!match) return `Rs. ${price} / 100g`;
  const qty = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (!qty || qty <= 0) return `Rs. ${price} / 100g`;

  if (unit === 'ML') {
    const per100ml = Math.round((price / qty) * 100 * 100) / 100;
    return `Rs. ${per100ml.toLocaleString()} / 100ml`;
  }
  if (unit === 'KG') {
    const per100g = Math.round((price / (qty * 10)) * 100) / 100;
    return `Rs. ${per100g.toLocaleString()} / 100g`;
  }
  // For Shilajit (20 GM), show both per 1g and per 10g/100g clearly
  if (qty <= 25) {
    const per1g = (price / qty).toFixed(2).replace(/\.00$/, '');
    const per10g = Math.round((price / qty) * 10);
    return `Rs. ${per1g} / 1g (Rs. ${per10g.toLocaleString()} / 10g)`;
  }
  const per100g = Math.round((price / qty) * 100 * 100) / 100;
  return `Rs. ${per100g.toLocaleString()} / 100g`;
}
