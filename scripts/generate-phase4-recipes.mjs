import fs from 'fs';

const inv = JSON.parse(fs.readFileSync('scripts/phase4-raw-inventory.json', 'utf8'));
const allOldRecipeSlugs = inv.allUniqueRecSlugs || [];

const canonicalRecipes = [
  {
    id: 'r-himalayan-trail-mix-hiking',
    slug: 'healthy-trail-mix-recipe-for-hiking-nepal',
    title: 'Himalayan Superfood Trail Mix (For Hiking & Trekking)',
    metaTitle: 'Healthy Trail Mix Recipe for Hiking Nepal | NaturesMud',
    metaDescription: 'Easy 5-minute Himalayan trail mix recipe using Raw Almonds, Roasted Cashews, Pumpkin Seeds, Dried Blueberries, and Dehydrated Mango in Nepal.',
    excerpt: 'Nutrient-dense, non-melting trail mix packed with raw almonds, roasted cashews, pumpkin seeds, dried blueberries, and sun-dried mango slices for trekking in Nepal.',
    image: '/products/superfood-mix.jpg',
    category: 'Fitness & Gym',
    prepTime: 5,
    cookTime: 0,
    servings: 10,
    difficulty: 'Easy',
    calories: '245 kcal',
    ingredients: [
      '1 cup NaturesMud Raw Almonds (Rs. 750 / 200 GM)',
      '1 cup NaturesMud Roasted Cashew Nuts (Rs. 750 / 150 GM)',
      '1/2 cup NaturesMud Pumpkin Seeds (Rs. 650 / 300 GM)',
      '1/2 cup NaturesMud Dried Blueberries (Rs. 650 / 150 GM)',
      '1/2 cup NaturesMud Dehydrated Mango (diced, Rs. 595 / 100 GM)',
      '1/4 tsp NaturesMud Himalayan Pink Salt (Rs. 250 / 200 GM)'
    ],
    instructions: [
      'In a dry stainless steel mixing bowl, combine Raw Almonds, Roasted Cashew Nuts, and Pumpkin Seeds.',
      'Add diced Dehydrated Mango, Dried Blueberries, and a light pinch of Himalayan Pink Salt.',
      'Toss gently until all nuts, seeds, and dried fruits are evenly distributed.',
      'Portion into 50g airtight snack pouches or jars for trekking, office snacks, or school tiffins.'
    ],
    tags: ['trail mix recipe', 'hiking snacks nepal', 'trekking food nepal', 'healthy energy mix'],
    featured: true,
    productSlugs: ['superfood-trail-mix', 'raw-himalayan-almonds', 'pumpkin-seeds', 'dried-blueberries', 'dehydrated-mango']
  },
  {
    id: 'r-baby-sweet-potato-puree',
    slug: 'sweet-potato-puree-for-babies-simple-recipe-nepal',
    title: 'Silky Sweet Potato Puree for Babies (6+ Months)',
    metaTitle: 'Sweet Potato Puree Recipe for Babies Nepal | NaturesMud',
    metaDescription: 'Gentle 2-minute sweet potato puree recipe using NaturesMud Sweet Potato Powder (Rs. 510 / 100 GM). From 6 months, as advised by your pediatrician.',
    excerpt: 'Gentle, single-ingredient 2-minute baby puree made with pure Sweet Potato Powder and warm boiled water or milk. Suitable from 6 months, as advised by your pediatrician.',
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    category: 'Baby Food',
    prepTime: 2,
    cookTime: 2,
    servings: 1,
    difficulty: 'Easy',
    calories: '95 kcal',
    ingredients: [
      '1 tbsp (10g) NaturesMud Sweet Potato Powder (Rs. 510 / 100 GM)',
      '4 tbsp warm boiled drinking water, formula, or expressed breast milk',
      'Optional (for older infants): 1/4 tsp NaturesMud Dates Powder (Rs. 400 / 100 GM)'
    ],
    instructions: [
      'Pediatric Note: Introduce solid foods from 6 months, as advised by your pediatrician.',
      'In a clean, sterilized infant bowl or small saucepan, add 1 tablespoon of NaturesMud Sweet Potato Powder.',
      'Gradually whisk in warm boiled water or milk until completely lump-free.',
      'Warm gently for 1 to 2 minutes while stirring until smooth and creamy. Test temperature on your wrist before serving.'
    ],
    tags: ['baby food recipe nepal', 'sweet potato puree for babies', 'weaning food nepal', 'lito recipe'],
    featured: true,
    productSlugs: ['sweet-potato-powder', 'dates-powder', 'banana-powder', 'carrot-powder']
  },
  {
    id: 'r-chia-seed-pudding-master',
    slug: 'chia-seed-pudding-recipe',
    title: 'Creamy Chia Seed Pudding (With Dried Fruits & Dates Powder)',
    metaTitle: 'Creamy Chia Seed Pudding Recipe in Nepal | NaturesMud',
    metaDescription: 'Make 5-minute creamy chia seed pudding with NaturesMud Chia Seeds (Rs. 495 / 300 GM), Dates Powder, Dried Blueberries, and Raw Almonds.',
    excerpt: 'The classic 5-minute make-ahead breakfast pudding prepared with Chia Seeds, milk, Dates Powder, Dried Blueberries, and crushed Raw Almonds.',
    image: '/images/recipes/chia-seed-pudding-recipe.jpg',
    category: 'Breakfast',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    calories: '210 kcal',
    ingredients: [
      '3 tbsp (30g) NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '1 cup (240ml) warm or chilled milk (dairy, almond, or oat milk)',
      '1 tbsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '2 tbsp NaturesMud Dried Blueberries (Rs. 650 / 150 GM)',
      '2 tbsp chopped NaturesMud Dehydrated Mango (Rs. 595 / 100 GM)',
      '1 tbsp crushed NaturesMud Raw Almonds (Rs. 750 / 200 GM)'
    ],
    instructions: [
      'In a glass jar or bowl, whisk milk and NaturesMud Dates Powder until dissolved.',
      'Add NaturesMud Chia Seeds and stir briskly for 45 seconds so no dry clumps remain.',
      'Let rest for 5 minutes, then stir a second time to keep the seeds evenly suspended.',
      'Cover and refrigerate for at least 2 hours (or overnight) until thick and spoonable.',
      'Top with Dried Blueberries, chopped Dehydrated Mango, and crushed Raw Almonds before serving.'
    ],
    tags: ['chia seed pudding recipe', 'chia pudding nepal', 'healthy breakfast', 'dates powder recipes'],
    featured: true,
    productSlugs: ['chia-seeds', 'dates-powder', 'dried-blueberries', 'dehydrated-mango', 'raw-himalayan-almonds']
  },
  {
    id: 'r-sweetpotato-pancakes-powder',
    slug: 'fluffy-sweet-potato-pancakes-powder-recipe',
    title: 'Fluffy Sweet Potato Pancakes (Using Sweet Potato Powder)',
    metaTitle: 'Fluffy Sweet Potato Powder Pancakes Recipe | NaturesMud',
    metaDescription: '10-minute fluffy pancakes made with NaturesMud Sweet Potato Powder, Dates Powder, and Extra Virgin Coconut Oil. Zero refined white sugar.',
    excerpt: 'Golden, fluffy 10-minute breakfast pancakes naturally sweetened with Sweet Potato Powder and Dates Powder, cooked in Extra Virgin Coconut Oil.',
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    category: 'Breakfast',
    prepTime: 3,
    cookTime: 7,
    servings: 3,
    difficulty: 'Easy',
    calories: '230 kcal',
    ingredients: [
      '1/3 cup NaturesMud Sweet Potato Powder (Rs. 510 / 100 GM)',
      '2/3 cup whole wheat flour or ground rolled oats',
      '1.5 tbsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1 egg (or 1 tbsp NaturesMud Chia Seeds soaked in 3 tbsp water)',
      '3/4 cup milk',
      '1 tbsp NaturesMud Cold-Pressed Extra Virgin Coconut Oil (Rs. 650 / 180 ML)',
      '1 tsp baking powder & 1/4 tsp ground cinnamon'
    ],
    instructions: [
      'In a mixing bowl, whisk together Sweet Potato Powder, whole wheat flour, baking powder, and cinnamon.',
      'In a separate bowl, whisk milk, egg (or soaked chia gel), melted Extra Virgin Coconut Oil, and Dates Powder.',
      'Fold wet ingredients into dry ingredients and let the batter rest for 3 minutes to hydrate.',
      'Cook 1/4-cup portions on a lightly greased pan over medium-low heat for 2 minutes per side until golden.',
      'Serve warm topped with sliced bananas and crushed NaturesMud Roasted Almonds.'
    ],
    tags: ['sweet potato pancakes', 'sweet potato powder recipes', 'sugar free pancakes', 'breakfast nepal'],
    featured: true,
    productSlugs: ['sweet-potato-powder', 'dates-powder', 'virgin-coconut-oil-180ml', 'chia-seeds', 'roasted-almonds']
  },
  {
    id: 'r-beetroot-smoothie-stamina',
    slug: 'high-nitrate-beetroot-smoothie-powder-recipe',
    title: 'Beetroot & Berry Stamina Smoothie (Using Beetroot Powder)',
    metaTitle: 'Beetroot Powder Pre-Workout Smoothie Recipe | NaturesMud',
    metaDescription: '3-minute pre-workout beetroot smoothie with NaturesMud Beetroot Powder (Rs. 430 / 100 GM), Dried Blueberries, Chia Seeds, and banana.',
    excerpt: 'Refreshing 3-minute ruby-red smoothie made with NaturesMud Beetroot Powder, ripe banana, Dried Blueberries, and soaked Chia Seeds for gym and running days.',
    image: '/images/blog/himalayan-beetroot-nitric-oxide-stamina.jpg',
    category: 'Fitness & Gym',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    calories: '185 kcal',
    ingredients: [
      '1 tsp (5g) NaturesMud Beetroot Powder (Rs. 430 / 100 GM)',
      '1 ripe banana',
      '2 tbsp NaturesMud Dried Blueberries (Rs. 650 / 150 GM)',
      '1 tbsp NaturesMud Chia Seeds (soaked, Rs. 495 / 300 GM)',
      '1 cup chilled water, coconut water, or milk',
      '1 tsp fresh lime juice'
    ],
    instructions: [
      'Place the banana, Dried Blueberries, NaturesMud Beetroot Powder, soaked Chia Seeds, and water or milk into a blender.',
      'Blend on high speed for 45 to 60 seconds until smooth and vibrant ruby-red.',
      'Add fresh lime juice and pulse briefly.',
      'Enjoy 30 to 45 minutes before morning runs, gym training, or hikes.'
    ],
    tags: ['beetroot smoothie', 'beetroot powder recipe', 'pre workout drink nepal', 'smoothie recipe'],
    featured: true,
    productSlugs: ['beetroot-powder', 'dried-blueberries', 'chia-seeds']
  },
  {
    id: 'r-dates-caramel-smoothie',
    slug: 'creamy-caramel-dates-powder-smoothie-recipe',
    title: 'Creamy Caramel Dates Smoothie (Using Dates Powder)',
    metaTitle: 'Creamy Dates Powder Smoothie Recipe Nepal | NaturesMud',
    metaDescription: 'Rich 3-minute sugar-free caramel smoothie made with NaturesMud Dates Powder (Rs. 400 / 100 GM), Roasted Cashew Nuts, Chia Seeds, and banana.',
    excerpt: 'A velvety, naturally sweetened caramel smoothie blended with NaturesMud Dates Powder, Roasted Cashew Nuts, Chia Seeds, and chilled milk.',
    image: '/products/dates-powder-100g.jpg',
    category: 'Smoothies & Drinks',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    calories: '260 kcal',
    ingredients: [
      '1.5 tbsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1 ripe banana (chilled or frozen)',
      '1 cup cold milk',
      '1 tbsp NaturesMud Roasted Cashew Nuts (Rs. 750 / 150 GM)',
      '1 tbsp NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '1/4 tsp ground cinnamon'
    ],
    instructions: [
      'Add banana, NaturesMud Dates Powder, Roasted Cashew Nuts, Chia Seeds, and cinnamon to a blender.',
      'Pour in cold milk and blend on high for 60 seconds until creamy and frothy.',
      'Pour into a tall glass and garnish with crushed cashews and a light dusting of Dates Powder.'
    ],
    tags: ['dates smoothie', 'dates powder recipes', 'healthy smoothie nepal', 'sugar free smoothie'],
    featured: true,
    productSlugs: ['dates-powder', 'roasted-cashewnuts', 'chia-seeds']
  },
  {
    id: 'r-homemade-granola-superfood',
    slug: 'homemade-superfood-granola-nuts-seeds-nepal',
    title: 'Crunchy Homemade Granola With Nuts, Seeds & Dried Fruits',
    metaTitle: 'Homemade Granola Recipe With Nuts & Seeds | NaturesMud',
    metaDescription: 'Bake crunchy sugar-free granola at home using NaturesMud Raw Almonds, Pumpkin Seeds, Sunflower Seeds, Dates Powder, and Extra Virgin Coconut Oil.',
    excerpt: 'Cluster-rich homemade granola baked with rolled oats, Raw Almonds, Pumpkin Seeds, Sunflower Seeds, Dates Powder, and Extra Virgin Coconut Oil.',
    image: '/products/superfood-mix.jpg',
    category: 'Breakfast',
    prepTime: 5,
    cookTime: 20,
    servings: 8,
    difficulty: 'Easy',
    calories: '275 kcal',
    ingredients: [
      '3 cups rolled oats',
      '1/2 cup NaturesMud Raw Almonds (chopped, Rs. 750 / 200 GM)',
      '1/2 cup NaturesMud Premium Cashew Nuts (chopped, Rs. 750 / 200 GM)',
      '1/2 cup NaturesMud Pumpkin Seeds (Rs. 650 / 300 GM)',
      '1/4 cup NaturesMud Sunflower Seeds (Rs. 450 / 250 GM)',
      '1/3 cup NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1/3 cup NaturesMud Cold-Pressed Extra Virgin Coconut Oil (melted, Rs. 1,750 / 500 ML)',
      '1/2 cup NaturesMud Dried Cranberries & Dehydrated Mango (chopped)',
      '1/4 tsp NaturesMud Himalayan Pink Salt'
    ],
    instructions: [
      'In a large bowl, toss rolled oats, chopped Raw Almonds, Cashew Nuts, Pumpkin Seeds, Sunflower Seeds, Dates Powder, and Pink Salt.',
      'Pour in melted Extra Virgin Coconut Oil and 2 tablespoons of warm water; mix until every oat flake is coated.',
      'Press evenly onto a parchment-lined baking tray and bake at 160°C for 20 minutes until golden.',
      'Cool completely for 30 minutes to form crunchy clusters, then fold in Dried Cranberries and chopped Dehydrated Mango.'
    ],
    tags: ['homemade granola recipe', 'healthy granola nepal', 'nuts and seeds granola', 'breakfast'],
    featured: true,
    productSlugs: ['raw-himalayan-almonds', 'premium-cashewnuts', 'pumpkin-seeds', 'sunflower-seeds', 'dates-powder', 'virgin-coconut-oil-500ml', 'dried-cranberries']
  },
  {
    id: 'r-energy-balls-dates-nuts',
    slug: 'no-bake-healthy-energy-balls-dates-powder-recipe',
    title: 'No-Bake Healthy Energy Balls (With Dates Powder & Nuts)',
    metaTitle: 'No-Bake Dates Powder & Nut Energy Balls | NaturesMud',
    metaDescription: '10-minute no-bake energy bites made with NaturesMud Dates Powder, Raw Almonds, Roasted Cashews, Chia Seeds, and Extra Virgin Coconut Oil.',
    excerpt: 'Quick 10-minute no-bake energy bites made with Dates Powder, crushed Raw Almonds, Roasted Cashews, Chia Seeds, and Extra Virgin Coconut Oil.',
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    category: 'Healthy Snack',
    prepTime: 10,
    cookTime: 0,
    servings: 12,
    difficulty: 'Easy',
    calories: '135 kcal',
    ingredients: [
      '1 cup rolled oats (pulsed into coarse flour)',
      '1/2 cup NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1/4 cup NaturesMud Raw Almonds (finely crushed, Rs. 750 / 200 GM)',
      '1/4 cup NaturesMud Roasted Cashew Nuts (crushed, Rs. 750 / 150 GM)',
      '2 tbsp NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '2 tbsp NaturesMud Pumpkin Seeds (Rs. 650 / 300 GM)',
      '2 tbsp NaturesMud Cold-Pressed Extra Virgin Coconut Oil (Rs. 650 / 180 ML)',
      '2 to 3 tbsp warm milk or water to bind'
    ],
    instructions: [
      'Combine coarse oat flour, NaturesMud Dates Powder, crushed Raw Almonds, Roasted Cashew Nuts, Chia Seeds, and Pumpkin Seeds in a bowl.',
      'Add melted Extra Virgin Coconut Oil and 2 tablespoons of warm water; knead into a firm, pliable dough.',
      'Roll 1-tablespoon portions between your palms into 12 bite-sized energy balls.',
      'Refrigerate for 20 minutes to set and store in an airtight jar for up to 2 weeks.'
    ],
    tags: ['energy balls recipe', 'dates powder laddoo', 'no bake energy bites', 'healthy office snacks nepal'],
    featured: true,
    productSlugs: ['dates-powder', 'raw-himalayan-almonds', 'roasted-cashewnuts', 'chia-seeds', 'pumpkin-seeds', 'virgin-coconut-oil-180ml']
  },
  {
    id: 'r-chia-overnight-oats-nepal',
    slug: 'creamy-chia-seed-overnight-oats-recipe-nepal',
    title: 'Creamy Chia Seed Overnight Oats (Easy 3-Minute Breakfast)',
    metaTitle: 'Chia Seed Overnight Oats Recipe in Nepal | NaturesMud',
    metaDescription: 'Prepare 3-minute overnight oats with NaturesMud Chia Seeds, Dates Powder, Raw Almonds, and Dehydrated Mango for busy mornings in Nepal.',
    excerpt: 'Make-ahead creamy overnight oats sweetened with NaturesMud Dates Powder and topped with sliced Raw Almonds and Dehydrated Mango.',
    image: '/images/recipes/oatmeal-bowl-daily-routine.jpg',
    category: 'Breakfast',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    calories: '290 kcal',
    ingredients: [
      '1/2 cup rolled oats',
      '1 tbsp NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '1 tbsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '2/3 cup milk',
      '2 tbsp plain curd (dahi)',
      '1 tbsp sliced NaturesMud Raw Almonds (Rs. 750 / 200 GM)',
      '1 tbsp diced NaturesMud Dehydrated Mango (Rs. 595 / 100 GM)'
    ],
    instructions: [
      'In a clean glass jar, combine rolled oats, NaturesMud Chia Seeds, Dates Powder, milk, and dahi.',
      'Stir thoroughly for 30 seconds so the Chia Seeds and Dates Powder disperse evenly.',
      'Seal the jar and refrigerate overnight (or at least 5 hours).',
      'In the morning, top with sliced Raw Almonds and diced Dehydrated Mango before serving.'
    ],
    tags: ['overnight oats with chia seeds', 'chia overnight oats nepal', 'healthy breakfast prep'],
    featured: true,
    productSlugs: ['chia-seeds', 'dates-powder', 'raw-himalayan-almonds', 'dehydrated-mango']
  },
  {
    id: 'r-sweetpotato-porridge-100g',
    slug: '5-minute-sweet-potato-dates-baby-porridge-100g',
    title: '5-Minute Sweet Potato & Dates Weaning Porridge (6+ Months)',
    metaTitle: 'Sweet Potato & Dates Baby Porridge Recipe | NaturesMud',
    metaDescription: '5-minute warm baby porridge made with NaturesMud Sweet Potato Powder and Dates Powder. Suitable from 6 months, as advised by your pediatrician.',
    excerpt: 'Warm, velvety weaning porridge made with NaturesMud Sweet Potato Powder and a gentle touch of Dates Powder. Suitable from 6 months, as advised by your pediatrician.',
    image: '/products/sweet-potato-powder-100g.jpg',
    category: 'Baby Food',
    prepTime: 2,
    cookTime: 3,
    servings: 1,
    difficulty: 'Easy',
    calories: '120 kcal',
    ingredients: [
      '2 tbsp NaturesMud Sweet Potato Powder (Rs. 510 / 100 GM)',
      '1/2 tsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1/2 cup warm water, formula, or milk',
      '1/2 tsp pure cow ghee (optional for older infants)'
    ],
    instructions: [
      'Pediatric Note: Introduce solid foods from 6 months, as advised by your pediatrician.',
      'Whisk 2 tablespoons of NaturesMud Sweet Potato Powder into 1/2 cup of lukewarm water or milk in a small saucepan until smooth.',
      'Simmer on low heat for 2 to 3 minutes while stirring continuously until creamy.',
      'Remove from heat, stir in 1/2 teaspoon of NaturesMud Dates Powder, and cool to lukewarm temperature before feeding.'
    ],
    tags: ['baby food', 'sweet potato powder porridge', 'dates powder baby food', 'weaning recipe nepal'],
    featured: true,
    productSlugs: ['sweet-potato-powder', 'dates-powder', 'banana-powder', 'carrot-powder']
  },
  {
    id: 'r-dates-kheer-100g',
    slug: 'sugar-free-dates-powder-makhana-kheer-100g',
    title: 'Traditional Himalayan Makhana Kheer with Dates Powder',
    metaTitle: 'Makhana Kheer Recipe With Dates Powder | NaturesMud',
    metaDescription: 'Rich festive Makhana Kheer recipe made with NaturesMud Fox Nuts (Makhana), Dates Powder, Roasted Almonds, and Golden Raisins. Zero white sugar.',
    excerpt: 'Creamy festive Makhana Kheer slow-simmered with NaturesMud Fox Nuts (Makhana), whole milk, Dates Powder, Roasted Almonds, and Golden Raisins.',
    image: '/products/dates-powder-100g.jpg',
    category: 'Dessert & Festive',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    calories: '225 kcal',
    ingredients: [
      '1 pack (50g) NaturesMud Fox Nuts (Makhana) (Rs. 390 / 50 GM)',
      '1 liter full-cream milk',
      '4 tbsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '2 tbsp NaturesMud Roasted Almonds (sliced, Rs. 750 / 200 GM)',
      '2 tbsp NaturesMud Golden Raisins (Kismis) (Rs. 550 / 250 GM)',
      '4 crushed green cardamom pods & 1 tsp ghee'
    ],
    instructions: [
      'Lightly roast NaturesMud Fox Nuts (Makhana) in 1 teaspoon of ghee for 3 minutes until crisp, then coarsely crush half of them.',
      'Bring 1 liter of milk to a gentle boil in a heavy pan with crushed cardamom.',
      'Add the Makhana and simmer on low heat for 10 to 12 minutes until soft and thickened.',
      'Turn off the heat and stir in 4 tablespoons of NaturesMud Dates Powder until dissolved.',
      'Garnish with sliced Roasted Almonds and Golden Raisins. Serve warm or chilled.'
    ],
    tags: ['makhana kheer recipe', 'dates powder dessert', 'sugar free kheer nepal', 'festive sweets'],
    featured: true,
    productSlugs: ['fox-nuts-makhana', 'dates-powder', 'roasted-almonds', 'golden-raisins-kismis']
  },
  {
    id: 'r2',
    slug: 'moringa-green-smoothie',
    title: 'Morning Moringa Leaf, Banana & Chia Green Smoothie',
    metaTitle: 'Moringa Leaf Powder Green Smoothie Recipe | NaturesMud',
    metaDescription: '5-minute green smoothie recipe using NaturesMud Moringa Leaf Powder (Rs. 690 / 100 GM), Banana Powder or fresh banana, Chia Seeds, and Dates Powder.',
    excerpt: 'A balanced morning green smoothie made with NaturesMud Moringa Leaf Powder, ripe banana, plain dahi, Chia Seeds, and Dates Powder.',
    image: '/products/moringa-leaf-powder.jpg',
    category: 'Smoothies & Drinks',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    calories: '195 kcal',
    ingredients: [
      '1 tsp (3g) NaturesMud Moringa Leaf Powder (Rs. 690 / 100 GM)',
      '1 ripe banana (or 1.5 tbsp NaturesMud Banana Powder, Rs. 590 / 100 GM)',
      '1/2 cup plain curd (dahi) or milk',
      '1/2 cup chilled water',
      '1 tbsp NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '1 tsp NaturesMud Dates Powder (Rs. 400 / 100 GM)'
    ],
    instructions: [
      'Add banana, NaturesMud Moringa Leaf Powder, Chia Seeds, Dates Powder, dahi, and water to a blender.',
      'Blend on high speed for 45 seconds until smooth and emerald green.',
      'Pour into a chilled glass and serve immediately with breakfast.'
    ],
    tags: ['moringa smoothie recipe', 'moringa leaf powder nepal', 'green smoothie', 'morning drink'],
    featured: true,
    productSlugs: ['moringa-leaf-powder', 'banana-powder', 'chia-seeds', 'dates-powder']
  },
  {
    id: 'r12',
    slug: 'himalayan-barley-grass-morning-detox-water',
    title: 'Himalayan Barley Grass & Fresh Lemon Morning Green Drink',
    metaTitle: 'Barley Grass Powder Morning Drink Recipe | NaturesMud',
    metaDescription: '2-minute refreshing morning green drink made with NaturesMud Barley Grass Powder (Rs. 695 / 100 GM), lukewarm water, fresh lemon, and Pink Salt.',
    excerpt: 'A crisp 2-minute morning green drink whisked with NaturesMud Barley Grass Powder, fresh lemon juice, lukewarm water, and a pinch of Pink Salt.',
    image: '/products/barley-grass-powder.jpg',
    category: 'Smoothies & Drinks',
    prepTime: 2,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    calories: '35 kcal',
    ingredients: [
      '1 tsp (3g) NaturesMud Barley Grass Powder (Rs. 695 / 100 GM)',
      '250ml lukewarm or room-temperature drinking water',
      '1 tbsp freshly squeezed lemon or lime juice',
      '1 pinch NaturesMud Himalayan Pink Salt (Rs. 250 / 200 GM)'
    ],
    instructions: [
      'Place 1 teaspoon of NaturesMud Barley Grass Powder into a clean dry glass.',
      'Pour in 250ml of lukewarm water and stir briskly (or froth for 10 seconds) until dissolved.',
      'Stir in fresh lemon juice and a tiny pinch of Himalayan Pink Salt. Drink fresh in the morning.'
    ],
    tags: ['barley grass powder recipe', 'morning green drink', 'barley grass nepal'],
    featured: false,
    productSlugs: ['barley-grass-powder', 'himalayan-pink-salt', 'moringa-leaf-powder']
  },
  {
    id: 'r17',
    slug: 'flaxseed-chia-omega-mountain-crackers',
    title: 'Baked Flaxseed, Chia & Sunflower Seed Crackers with Pink Salt',
    metaTitle: 'Baked Flaxseed, Chia & Sunflower Crackers | NaturesMud',
    metaDescription: 'Crunchy homemade seed crackers baked with NaturesMud Flax Seeds, Chia Seeds, Sunflower Seeds, Pumpkin Seeds, and Himalayan Pink Salt.',
    excerpt: 'Crisp, flourless oven-baked seed crackers made with Flax Seeds, Chia Seeds, Sunflower Seeds, Pumpkin Seeds, and Himalayan Pink Salt.',
    image: '/products/chia-seeds.jpg',
    category: 'Healthy Snack',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    calories: '165 kcal',
    ingredients: [
      '1/2 cup NaturesMud Flax Seeds (Rs. 390 / 200 GM)',
      '1/3 cup NaturesMud Chia Seeds (Rs. 495 / 300 GM)',
      '1/4 cup NaturesMud Sunflower Seeds (Rs. 450 / 250 GM)',
      '1/4 cup NaturesMud Pumpkin Seeds (Rs. 650 / 300 GM)',
      '3/4 cup warm water',
      '1/2 tsp NaturesMud Himalayan Pink Salt (Rs. 250 / 200 GM)'
    ],
    instructions: [
      'In a bowl, mix NaturesMud Flax Seeds, Chia Seeds, Sunflower Seeds, Pumpkin Seeds, Himalayan Pink Salt, and warm water.',
      'Let stand for 15 minutes until the Chia and Flax Seeds absorb the water and form a thick gel binder.',
      'Spread thinly (about 3mm thick) onto a parchment-lined baking tray using the back of a spoon.',
      'Bake at 150°C for 30 minutes until crisp and golden, then cool and snap into crackers.'
    ],
    tags: ['seed crackers recipe', 'flaxseed crackers', 'chia seed crackers', 'healthy snacks nepal'],
    featured: false,
    productSlugs: ['flax-seeds', 'chia-seeds', 'sunflower-seeds', 'pumpkin-seeds', 'himalayan-pink-salt']
  },
  {
    id: 'r18',
    slug: 'natural-dates-powder-himalayan-masala-chai',
    title: 'Nepali Masala Chai Sweetened with Dates Powder',
    metaTitle: 'Dates Powder Masala Chai Recipe in Nepal | NaturesMud',
    metaDescription: 'Brew aromatic Nepali milk tea (chiya) sweetened naturally with NaturesMud Dates Powder (Rs. 400 / 100 GM) instead of refined white sugar.',
    excerpt: 'Rich, spiced Nepali milk chiya brewed with ginger, cardamom, and tea leaves, sweetened naturally with NaturesMud Dates Powder.',
    image: '/products/dates-powder-100g.jpg',
    category: 'Smoothies & Drinks',
    prepTime: 2,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    calories: '90 kcal',
    ingredients: [
      '1 cup water & 1 cup whole milk',
      '2 tsp Nepali black tea leaves',
      '1-inch crushed fresh ginger & 2 cracked cardamom pods',
      '2 tsp NaturesMud Dates Powder (Rs. 400 / 100 GM)'
    ],
    instructions: [
      'Simmer water with crushed ginger and cardamom pods for 2 minutes.',
      'Add black tea leaves and milk; bring to a gentle boil for 2 to 3 minutes.',
      'Turn off the heat, stir in NaturesMud Dates Powder for 15 seconds, and strain through a fine tea strainer into cups.'
    ],
    tags: ['dates powder tea', 'masala chai recipe nepal', 'sugar free chiya'],
    featured: false,
    productSlugs: ['dates-powder']
  },
  {
    id: 'r-moringa-guacamole',
    slug: 'high-chlorophyll-himalayan-moringa-avocado-guacamole',
    title: '2-Minute Instant Guacamole Using Freeze-Dried Avocado Powder',
    metaTitle: 'Instant Guacamole With Avocado Powder | NaturesMud',
    metaDescription: 'Whisk creamy guacamole in 2 minutes using NaturesMud Freeze-Dried Avocado Powder (Rs. 790 / 80 GM), Moringa Leaf Powder, lime, and Pink Salt.',
    excerpt: 'Make fresh, creamy avocado dip in 2 minutes anytime of year using NaturesMud Freeze-Dried Avocado Powder, lime juice, and Himalayan Pink Salt.',
    image: '/products/freeze-dried-avocado-powder.jpg',
    category: 'Healthy Snack',
    prepTime: 2,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    calories: '140 kcal',
    ingredients: [
      '3 tbsp NaturesMud Freeze-Dried Avocado Powder (Rs. 790 / 80 GM)',
      '1/4 tsp NaturesMud Moringa Leaf Powder (optional, Rs. 690 / 100 GM)',
      '3 to 4 tbsp cool water or plain Greek yogurt',
      '1 tbsp fresh lime juice',
      '1/4 tsp NaturesMud Himalayan Pink Salt (Rs. 250 / 200 GM)',
      '2 tbsp finely diced tomato, onion & fresh coriander'
    ],
    instructions: [
      'In a small bowl, whisk NaturesMud Freeze-Dried Avocado Powder with cool water (or yogurt) and fresh lime juice until thick and creamy.',
      'Season with Himalayan Pink Salt and an optional pinch of Moringa Leaf Powder.',
      'Fold in diced tomato, onion, and fresh coriander. Serve with toasted bread or seed crackers.'
    ],
    tags: ['avocado powder recipe', 'instant guacamole nepal', 'freeze dried avocado powder'],
    featured: true,
    productSlugs: ['freeze-dried-avocado-powder', 'moringa-leaf-powder', 'himalayan-pink-salt']
  },
  {
    id: 'r-mustard-oil-aloo-dum',
    slug: 'traditional-nepali-aloo-dum-cold-pressed-mustard-oil',
    title: 'Traditional Nepali Aloo Dum with Cold-Pressed Yellow Mustard Oil',
    metaTitle: 'Nepali Aloo Dum With Yellow Mustard Oil | NaturesMud',
    metaDescription: 'Authentic Nepali spiced Aloo Dum cooked in NaturesMud Pure & Natural Yellow Mustard Oil (Rs. 360 / 1 Ltr) and seasoned with Himalayan Pink Salt.',
    excerpt: 'Golden, aromatic Nepali Aloo Dum tempered with fenugreek seeds in NaturesMud Pure & Natural Yellow Mustard Oil and Himalayan Pink Salt.',
    image: '/products/yellow-mustard-oil.jpg',
    category: 'Savory & Bowls',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    calories: '215 kcal',
    ingredients: [
      '500g boiled baby potatoes (peeled and halved)',
      '2 tbsp NaturesMud Pure & Natural Yellow Mustard Oil (Rs. 360 / 1 Ltr)',
      '1/2 tsp fenugreek seeds (methi) & 1/2 tsp cumin seeds',
      '1 tsp ginger-garlic paste & 2 pureed tomatoes',
      '1/2 tsp turmeric, 1 tsp cumin-coriander powder & 1/2 tsp chili powder',
      '1 tsp NaturesMud Himalayan Pink Salt (Rs. 250 / 200 GM)',
      '1/4 tsp NaturesMud Pure Himalayan Black Salt (Bire Noon) (Rs. 220 / 200 GM)'
    ],
    instructions: [
      'Heat NaturesMud Pure & Natural Yellow Mustard Oil in a heavy pan until lightly shimmering.',
      'Temper fenugreek and cumin seeds, then pan-sear the boiled potatoes for 4 minutes until golden on the edges.',
      'Add ginger-garlic paste, turmeric, cumin-coriander powder, and tomato puree; cook for 5 minutes until oil separates.',
      'Season with Himalayan Pink Salt and a finishing pinch of Bire Noon, garnish with fresh coriander, and serve hot with chiura or roti.'
    ],
    tags: ['nepali aloo dum', 'yellow mustard oil recipe', 'tori ko tel cooking', 'savory nepal'],
    featured: false,
    productSlugs: ['pure-natural-yellow-mustard-oil', 'himalayan-pink-salt', 'pure-himalayan-black-salt-bire-noon']
  },
  {
    id: 'r-black-salt-fruit-chaat',
    slug: 'himalayan-seasonal-fruit-chaat-dates-bire-noon',
    title: 'Himalayan Seasonal Fruit Chaat with Dates Powder & Bire Noon',
    metaTitle: 'Fruit Chaat Recipe With Bire Noon & Dates | NaturesMud',
    metaDescription: '5-minute tangy Himalayan fruit chaat tossed with NaturesMud Pure Himalayan Black Salt (Bire Noon), Dates Powder, Dried Cranberries, and Dehydrated Papaya.',
    excerpt: 'Sweet, tangy, and savory fruit bowl featuring fresh seasonal fruits, Dried Cranberries, Dehydrated Papaya, Dates Powder, and pungent Bire Noon.',
    image: '/products/black-salt.jpg',
    category: 'Healthy Snack',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    calories: '150 kcal',
    ingredients: [
      '1 cup diced fresh apple, banana, and pomegranate',
      '2 tbsp NaturesMud Dried Cranberries (Rs. 415 / 150 GM)',
      '2 tbsp NaturesMud Dehydrated Sweet Papaya (diced, Rs. 395 / 125 GM)',
      '1/2 tsp NaturesMud Pure Himalayan Black Salt (Bire Noon) (Rs. 220 / 200 GM)',
      '1 tsp NaturesMud Dates Powder (Rs. 400 / 100 GM)',
      '1 tbsp fresh lime juice & 1/4 tsp roasted cumin powder'
    ],
    instructions: [
      'In a serving bowl, combine diced fresh fruits with NaturesMud Dried Cranberries and Dehydrated Sweet Papaya.',
      'Sprinkle with Pure Himalayan Black Salt (Bire Noon), Dates Powder, roasted cumin, and fresh lime juice.',
      'Toss gently and serve immediately as a refreshing afternoon snack.'
    ],
    tags: ['fruit chaat recipe', 'bire noon recipes', 'black salt nepal', 'healthy snack'],
    featured: false,
    productSlugs: ['pure-himalayan-black-salt-bire-noon', 'dates-powder', 'dried-cranberries', 'dehydrated-papaya']
  }
];

const canonicalSlugSet = new Set(canonicalRecipes.map(r => r.slug));

function pickTargetRecipe(oldSlug) {
  const s = oldSlug.toLowerCase();
  if (s.includes('baby') || s.includes('infant') || s.includes('weaning') || s.includes('toddler') || s.includes('sheera') || s.includes('khichdi')) {
    return s.includes('puree') || s.includes('mash')
      ? '/recipes/sweet-potato-puree-for-babies-simple-recipe-nepal'
      : '/recipes/5-minute-sweet-potato-dates-baby-porridge-100g';
  }
  if (s.includes('pancake') || s.includes('waffle') || s.includes('french-toast') || s.includes('muffin') || s.includes('tortilla')) {
    return '/recipes/fluffy-sweet-potato-pancakes-powder-recipe';
  }
  if (s.includes('beetroot') || s.includes('nitric') || s.includes('preworkout') || s.includes('pre-workout') || s.includes('slushie') || s.includes('red-velvet')) {
    return '/recipes/high-nitrate-beetroot-smoothie-powder-recipe';
  }
  if (s.includes('kheer') || s.includes('halwa') || s.includes('barfi') || s.includes('makhana')) {
    return '/recipes/sugar-free-dates-powder-makhana-kheer-100g';
  }
  if (s.includes('laddu') || s.includes('laddoo') || s.includes('gundpak') || s.includes('bites') || s.includes('balls') || s.includes('bombs') || s.includes('bars') || s.includes('cups')) {
    return '/recipes/no-bake-healthy-energy-balls-dates-powder-recipe';
  }
  if (s.includes('granola') || s.includes('trail') || s.includes('spiced-roasted-almonds') || s.includes('pilaf')) {
    return s.includes('granola')
      ? '/recipes/homemade-superfood-granola-nuts-seeds-nepal'
      : '/recipes/healthy-trail-mix-recipe-for-hiking-nepal';
  }
  if (s.includes('overnight') || s.includes('oat') || s.includes('muesli') || s.includes('quinoa') || s.includes('crisp')) {
    return '/recipes/creamy-chia-seed-overnight-oats-recipe-nepal';
  }
  if (s.includes('chia') || s.includes('parfait') || s.includes('pudding') || s.includes('jam')) {
    return '/recipes/chia-seed-pudding-recipe';
  }
  if (s.includes('moringa')) {
    return s.includes('guacamole') || s.includes('avocado')
      ? '/recipes/high-chlorophyll-himalayan-moringa-avocado-guacamole'
      : '/recipes/moringa-green-smoothie';
  }
  if (s.includes('barley-grass')) {
    return '/recipes/himalayan-barley-grass-morning-detox-water';
  }
  if (s.includes('cracker') || s.includes('roti') || s.includes('flax') || s.includes('pumpkin-seed')) {
    return '/recipes/flaxseed-chia-omega-mountain-crackers';
  }
  if (s.includes('chai') || s.includes('tea') || s.includes('milk') || s.includes('shilajit') || s.includes('haldi') || s.includes('turmeric') || s.includes('matcha') || s.includes('honey')) {
    return '/recipes/natural-dates-powder-himalayan-masala-chai';
  }
  if (s.includes('mustard-oil') || s.includes('aloo') || s.includes('puri') || s.includes('soup') || s.includes('tofu')) {
    return '/recipes/traditional-nepali-aloo-dum-cold-pressed-mustard-oil';
  }
  if (s.includes('black-salt') || s.includes('bire-noon') || s.includes('pink-salt') || s.includes('chaat') || s.includes('raita') || s.includes('chaas') || s.includes('salad') || s.includes('papaya') || s.includes('pineapple')) {
    return '/recipes/himalayan-seasonal-fruit-chaat-dates-bire-noon';
  }
  if (s.includes('avocado') || s.includes('dip') || s.includes('hummus') || s.includes('pesto')) {
    return '/recipes/high-chlorophyll-himalayan-moringa-avocado-guacamole';
  }
  return '/recipes/creamy-caramel-dates-powder-smoothie-recipe';
}

const recipeRedirectMap = {};
for (const slug of allOldRecipeSlugs) {
  if (!canonicalSlugSet.has(slug)) {
    recipeRedirectMap[slug] = pickTargetRecipe(slug);
  }
}

const outputTs = `import { Recipe } from '@/lib/types';

export interface ExtendedRecipe extends Recipe {
  metaTitle?: string;
  metaDescription?: string;
  calories?: string;
  productSlugs?: string[];
}

export const recipes: ExtendedRecipe[] = ${JSON.stringify(canonicalRecipes, null, 2)};

export const RECIPE_REDIRECT_MAP: Record<string, string> = ${JSON.stringify(recipeRedirectMap, null, 2)};

export function getRecipeBySlug(slug: string): ExtendedRecipe | undefined {
  return recipes.find((r) => r.slug === slug || r.id === slug);
}
`;

fs.writeFileSync('lib/data/recipes.ts', outputTs, 'utf8');
console.log('Generated lib/data/recipes.ts with', canonicalRecipes.length, 'canonical recipes and', Object.keys(recipeRedirectMap).length, 'redirects.');
