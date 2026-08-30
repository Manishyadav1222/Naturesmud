const fs = require('fs');
const path = require('path');

// 1. Update blogs-database.ts
const blogPath = path.join(__dirname, '..', 'lib', 'data', 'blogs-database.ts');
let blogContent = fs.readFileSync(blogPath, 'utf8');

const chiaPuddingBlog = {
  id: 'b-chia-seed-pudding-recipe-master-guide',
  title: 'Chia Seed Pudding Recipe: The Ultimate 5-Minute Healthy Make-Ahead Breakfast',
  slug: 'chia-seed-pudding-recipe',
  excerpt: 'Learn how to make the perfect creamy chia seed pudding in just 5 minutes. Includes exact seed-to-milk ratios, vegan substitutions, meal-prep storage tips, and healthy superfood toppings.',
  category: 'Recipes & DIY',
  date: '2026-08-30',
  author: "Nature's Mud Culinary Nutrition Team",
  readTime: '6 min read',
  image: '/images/blog/chia-seed-pudding-recipe.jpg',
  featured: true,
  tags: ['chia seed pudding recipe', 'chia pudding', 'healthy breakfast', 'how to make chia pudding', 'chia seeds nepal', 'clean eating kathmandu', 'dates powder recipes', 'overnight chia pudding'],
  keyTakeaways: [
    'Golden Ratio: Use 1 part chia seeds to 4 parts liquid (e.g., 4 tablespoons chia seeds to 1 cup milk) for the ultimate creamy, tapioca-style pudding.',
    'The 5-Minute Stir Trick: Whisk thoroughly once, wait 5 minutes for seeds to start gelling, then whisk a second time to prevent clumping at the bottom.',
    '100% Naturally Sweetened: Sweeten cleanly with Nature\'s Mud Natural Dates Powder or Raw Mountain Honey instead of refined white sugar.',
    'Meal Prep Friendly: Stays fresh, thick, and delicious in airtight glass mason jars in the refrigerator for up to 5–7 days.',
    'Nutrient Powerhouse: Delivers 5.2g plant protein, 7.8g prebiotic dietary fiber, and over 3,200mg Omega-3 ALA per serving.'
  ],
  content: [
    "### Introduction: The Ultimate Zero-Cooking Superfood Breakfast",
    "If you are looking for a breakfast that takes less than five minutes of active prep, requires zero morning cooking, and keeps you energized, full, and focused until lunch, **Chia Seed Pudding** is the undisputed champion of clean eating.",
    "When tiny chia seeds are soaked in liquid, their soluble mucilaginous fiber absorbs up to 10 to 12 times their weight in moisture. Within hours, they transform any milk—dairy, almond, coconut, or oat—into a rich, velvety pudding with a satisfying texture reminiscent of traditional tapioca.",
    "Packed with plant-based Omega-3 fatty acids (alpha-linolenic acid), prebiotic dietary fiber, calcium, iron, and magnesium, this recipe is 100% gluten-free, naturally sweetened, and tailor-made for busy professionals, students, fitness enthusiasts, and growing families across Nepal.",
    "",
    "### Quick Recipe Summary",
    "Here is everything you need to know at a glance before starting your prep:",
    "- **Prep Time:** 5 minutes",
    "- **Chill Time:** 2–4 hours (or overnight for best results)",
    "- **Total Time:** 2 hours 5 minutes",
    "- **Servings:** 2 portions (approx. 200g per serving)",
    "- **Dietary Profile:** 100% Vegetarian, Gluten-Free, Refined Sugar-Free, Dairy-Free / Vegan adaptable",
    "",
    "### Ingredients You Will Need",
    "Making the world's best chia pudding requires just 3 foundational ingredients, plus your favorite wholesome toppings:",
    "",
    "#### Base Pudding Ingredients:",
    "- **4 tbsp (approx. 40g)** [Nature's Mud Premium Organic Black Chia Seeds](/products/chia-seeds)",
    "- **1 cup (240ml)** Milk of your choice (Unsweetened almond milk, creamy coconut milk, oat milk, or farm-fresh dairy milk)",
    "- **1 to 1.5 tbsp** [Nature's Mud Natural Dates Powder](/products/dates-powder-100g) (or 1 tbsp [Raw Himalayan Honey](/products/raw-honey))",
    "- **1/2 tsp** Pure vanilla extract (optional, for bakery-style aroma)",
    "- **Pinch (1/8 tsp)** [Nature's Mud Himalayan Pink Rock Salt](/products/pink-salt) (balances sweetness and enhances rich flavors)",
    "",
    "#### Wholesome Crunchy & Fruity Toppings:",
    "- **2 tbsp** [Nature's Mud Wild Dried Blueberries](/products/dried-blueberries-100g) (rich in anthocyanins)",
    "- **2 tbsp** [Nature's Mud Sun-Dried Mango Slices](/products/dehydrated-mango) (chopped into bite-sized ribbons)",
    "- **1 tbsp** [Nature's Mud Raw Himalayan Almonds](/products/almonds) & [Roasted Cashewnuts](/products/cashewnuts-roasted) (crushed for crunch)",
    "- **1 tsp** [Nature's Mud Organic Pumpkin Seeds](/products/pumpkin-seeds) (for zinc and healthy fats)",
    "",
    "### Step-by-Step Instructions",
    "Follow these 4 foolproof steps for the silkiest, clump-free chia pudding every single time:",
    "",
    "#### Step 1: Combine the Base in a Glass Jar",
    "In a medium mixing bowl or directly inside a 500ml glass mason jar, add the milk, vanilla extract, pinch of pink salt, and **Nature's Mud Dates Powder** (or raw honey). Whisk vigorously until the sweetener is completely dissolved.",
    "",
    "#### Step 2: Add Chia Seeds & Whisk Thoroughly",
    "Add the 4 tablespoons of **Nature's Mud Organic Chia Seeds**. Use a small wire whisk or fork to mix vigorously for 30 to 45 seconds, making sure all seeds are submerged and separated from one another.",
    "",
    "#### Step 3: The Critical 5-Minute Second Stir (Pro Tip)",
    "Let the mixture sit on the kitchen counter undisturbed for **5 minutes**. As the seeds begin to absorb liquid and form a light gel halo, whisk vigorously a second time for 30 seconds. *This crucial step prevents the heavier seeds from settling to the bottom and forming a solid cemented clump.*",
    "",
    "#### Step 4: Seal, Chill, and Hydrate",
    "Cover the mason jar tightly with its lid and place it in the refrigerator for at least **2 to 4 hours**, or ideally overnight (6 to 8 hours). When ready, stir well with a spoon, scoop into serving bowls or glass cups, and layer generously with dried blueberries, mango slices, crushed almonds, and pumpkin seeds.",
    "",
    "### How the Recipe Should Look & Feel",
    "When properly hydrated, your chia seed pudding should look and feel:",
    "- **Texture:** Thick, spoonable, and cohesive like classic rice pudding or tapioca custard. It should hold its shape on a spoon without sliding off like a liquid.",
    "- **Consistency:** Uniform and smooth without watery liquid pools floating on top or hard seed clumps stuck at the bottom.",
    "- **Taste:** Creamy, delicately sweet with comforting caramel undertones from the dates powder and a satisfying gentle poppy crunch from the hydrated seeds.",
    "",
    "### Ingredient Substitutions & Flavor Variations",
    "Customize your chia pudding based on your dietary preferences and pantry staples:",
    "- **Plant-Based / Vegan Milk:** Almond milk produces a light, nutty pudding. Canned coconut milk creates an ultra-thick, decadent dessert-like custard. Oat milk delivers smooth, naturally sweet comfort.",
    "- **Sweetener Options:** Replace dates powder with 100% pure raw mountain honey, pure maple syrup, or half a mashed ripe banana for a fruity twist.",
    "- **Chocolate Energy Pudding:** Whisk in 1 tablespoon of unsweetened raw cacao powder and 1 extra teaspoon of dates powder for an antioxidant-packed chocolate breakfast.",
    "- **Ruby Beetroot Stamina Pudding:** Whisk in 1 teaspoon of [Nature's Mud Pure Himalayan Beetroot Powder](/products/beetroot-powder-100g) for an electric pink color, earthy sweet flavor, and natural nitric oxide energy boost.",
    "- **Golden Turmeric Anti-Inflammatory Pudding:** Add 1/2 tsp organic turmeric powder, 1/4 tsp cinnamon, and a pinch of black pepper.",
    "",
    "### How to Store It & How Long Does It Last?",
    "- **Refrigeration:** Store chia seed pudding in an airtight glass container or sealed mason jar at 2°C to 5°C. It will stay completely fresh, creamy, and safe to eat for **5 to 7 days**.",
    "- **Meal Prep Strategy:** Make a triple batch on Sunday evening (divided into 5 individual small glass jars) for a Grab-and-Go breakfast throughout the entire work week.",
    "- **Topping Timing:** Always add fresh nuts, granola, and dried fruits *right before serving* to maintain maximum crunch and avoid sogginess.",
    "- **Freezer Friendly?** Yes! You can freeze chia pudding in freezer-safe jars for up to 2 months. Thaw overnight in the refrigerator before enjoying.",
    "",
    "### Common Mistakes & How to Avoid Them",
    "1. **Skipping the 5-Minute Second Stir:** If you put the jar straight into the fridge after one quick stir, seeds will sink to the bottom and create a dense rubbery layer. Always do the second stir after 5 minutes.",
    "2. **Incorrect Liquid-to-Seed Ratio:** Using too much milk results in a runny soup; using too little creates a dry, overly stiff paste. Stick to the **1:4 ratio** (1/4 cup chia to 1 cup liquid).",
    "3. **Using Sub-Standard Raw Seeds:** Low-grade bulk chia often contains dirt, stems, or old oxidized seeds that fail to gel properly. Always choose clean, hygienically packed, fresh whole chia seeds.",
    "4. **Adding Crunchy Toppings Too Early:** Adding nuts or toasted granola before refrigeration causes them to absorb moisture and turn limp. Keep toppings separate until the moment you eat.",
    "",
    "### Accurate Nutrition Information (Per Serving)",
    "*Calculated for 1 serving (recipe yields 2 servings using unsweetened almond milk and 1 tbsp dates powder):*",
    "- **Calories:** 165 kcal",
    "- **Protein:** 5.2 g",
    "- **Dietary Fiber:** 7.8 g (Prebiotic Soluble & Insoluble)",
    "- **Total Fat:** 8.5 g (Healthy Omega-3 ALA: 3,200 mg)",
    "- **Net Carbohydrates:** 7.5 g",
    "- **Natural Sugar:** 4.2 g (from whole dates powder, zero added refined sugars)",
    "- **Calcium:** 220 mg (22% Daily Value)",
    "- **Magnesium:** 78 mg (20% Daily Value)",
    "- **Iron:** 1.8 mg (10% Daily Value)",
    "",
    "### Frequently Asked Questions",
    "",
    "#### Can I make chia pudding overnight?",
    "Yes, in fact, overnight is the ideal method! Allowing chia seeds to chill for 6 to 8 hours ensures 100% full hydration of the soluble fiber matrix, giving you the creamiest, most digestible texture possible.",
    "",
    "#### Can I use plant-based milk?",
    "Absolutely. Chia pudding works magnificently with almond milk, oat milk, coconut milk, soy milk, or cashew milk. Creamier milks (like coconut or oat) yield a richer, thicker custard.",
    "",
    "#### Can I add dried fruit?",
    "Yes! Adding chopped sun-dried mango, dried blueberries, cranberries, or raisins adds wonderful chewy texture and natural fruit sweetness without requiring any processed white sugar.",
    "",
    "#### How long does chia pudding last in the fridge?",
    "Stored in an airtight glass mason jar in the refrigerator, chia pudding maintains peak freshness, flavor, and nutritional potency for 5 to 7 days.",
    "",
    "### Nature's Mud Ingredient Recommendation",
    "For the cleanest taste, highest omega-3 density, and guaranteed silky gelling action, use genuine, laboratory-tested ingredients from **Nature's Mud Nepal**:",
    "- **[Nature's Mud Organic Black Chia Seeds (100g / 250g Jar)](/products/chia-seeds):** Premium graded whole black chia seeds rich in soluble mucilage fiber and omega-3 ALA.",
    "- **[Nature's Mud 100% Natural Dates Powder (100g Jar)](/products/dates-powder-100g):** Pure sun-dried Arabian dates finely milled into a versatile, nutrient-rich caramel sweetener.",
    "- **[Nature's Mud Wild Dried Blueberries](/products/dried-blueberries-100g):** Plump, antioxidant-dense dried berries for vibrant breakfast topping.",
    "- **[Nature's Mud Sun-Dried Mango Slices](/products/dehydrated-mango):** 100% pure sun-dried tropical mango slices with zero added sulfur or sugar.",
    "- **[Nature's Mud Raw Himalayan Almonds & Walnuts](/products/almonds):** Premium mountain nuts loaded with vitamin E, brain-healthy fats, and satisfying morning crunch.",
    "",
    "### Related Healthy Himalayan Recipes",
    "- [Creamy Chia Seed Overnight Oats](/recipes/creamy-chia-seed-overnight-oats-recipe-nepal)",
    "- [Fluffy Sweet Potato Pancakes (Using Sweet Potato Powder)](/recipes/fluffy-sweet-potato-pancakes-powder-recipe)",
    "- [High-Nitrate Beetroot Stamina Smoothie](/recipes/high-nitrate-beetroot-smoothie-powder-recipe)",
    "- [Crunchy Homemade Superfood Granola With Nuts & Seeds](/recipes/homemade-superfood-granola-nuts-seeds-nepal)",
    "- [No-Bake Date & Nut Energy Balls](/recipes/no-bake-healthy-energy-balls-dates-powder-recipe)",
    "",
    "### Final Tips for Chia Pudding Perfection",
    "1. **Adjust Thickness Easily:** If your pudding is too thick after chilling, stir in 1–2 tablespoons of milk. If it is too thin, stir in 1 teaspoon of chia seeds and let sit for 15 minutes.",
    "2. **Kid-Friendly Parfait:** Layer chia pudding with Greek yogurt, fruit puree, and dates powder in clear glasses for an exciting, nutrient-packed after-school dessert.",
    "3. **Hydration Bonus:** Because chia seeds hold substantial water, eating chia pudding actively helps maintain cellular hydration and smooth digestive regularity throughout the day."
  ],
  faqs: [
    {
      q: 'Can I make chia pudding overnight?',
      a: 'Yes, overnight chilling (6 to 8 hours) is the optimal method for complete seed hydration and maximum creaminess.'
    },
    {
      q: 'Can I use plant-based milk?',
      a: 'Yes, almond milk, oat milk, coconut milk, and soy milk all work perfectly and create delicious dairy-free vegan chia pudding.'
    },
    {
      q: 'Can I add dried fruit?',
      a: 'Yes, topping with wild dried blueberries, sun-dried mango, cranberries, or raisins provides rich natural sweetness, antioxidants, and chewy texture.'
    },
    {
      q: 'How long does chia pudding last in the fridge?',
      a: 'In an airtight sealed glass jar, chia pudding stays completely fresh and delicious for 5 to 7 days.'
    }
  ]
};

// Insert at top of allBlogPosts
const blogInsertPos = blogContent.indexOf('export const allBlogPosts: ExtendedBlogPost[] = [');
if (blogInsertPos !== -1) {
  const afterBracket = blogInsertPos + 'export const allBlogPosts: ExtendedBlogPost[] = [\n'.length;
  const blogJsonCode = '  ' + JSON.stringify(chiaPuddingBlog, null, 2) + ',\n';
  blogContent = blogContent.slice(0, afterBracket) + blogJsonCode + blogContent.slice(afterBracket);
  fs.writeFileSync(blogPath, blogContent, 'utf8');
  console.log('✅ Added Chia Seed Pudding Recipe blog to allBlogPosts in blogs-database.ts');
}

// 2. Update recipes.ts
const recipePath = path.join(__dirname, '..', 'lib', 'data', 'recipes.ts');
let recipeContent = fs.readFileSync(recipePath, 'utf8');

const chiaPuddingRecipe = {
  id: 'r-chia-seed-pudding-master',
  slug: 'chia-seed-pudding-recipe',
  title: 'Creamy Chia Seed Pudding (With Dried Fruits & Dates Powder)',
  excerpt: 'The ultimate 5-minute make-ahead breakfast pudding made with organic chia seeds, almond milk, dates powder, wild blueberries, and raw mountain almonds.',
  image: '/images/recipes/chia-seed-pudding-recipe.jpg',
  category: 'Breakfast',
  prepTime: 5,
  cookTime: 0,
  servings: 2,
  difficulty: 'Easy',
  ingredients: [
    "4 tbsp (40g) Nature's Mud Organic Black Chia Seeds",
    '1 cup (240ml) almond milk, oat milk, or fresh dairy milk',
    "1.5 tbsp Nature's Mud Natural Dates Powder (or Raw Mountain Honey)",
    '1/2 tsp vanilla extract',
    "Pinch of Nature's Mud Himalayan Pink Salt",
    "2 tbsp Nature's Mud Wild Dried Blueberries",
    "2 tbsp chopped Nature's Mud Sun-Dried Mango Slices",
    "1 tbsp crushed Nature's Mud Raw Himalayan Almonds & Pumpkin Seeds"
  ],
  instructions: [
    "In a mason jar or bowl, whisk milk, dates powder, vanilla extract, and a pinch of pink salt until dissolved.",
    "Add Nature's Mud chia seeds and whisk vigorously for 45 seconds to separate all seeds.",
    "Let sit for 5 minutes, then whisk a second time to prevent seeds from sinking to the bottom.",
    "Cover and refrigerate for 2 to 4 hours (or overnight) until thick, creamy, and spoonable.",
    "Serve chilled, topped with wild blueberries, sun-dried mango, and crushed almonds."
  ],
  tags: ['chia seed pudding recipe', 'chia pudding', 'healthy breakfast', 'vegan pudding', 'dates powder recipes'],
  featured: true
};

const recipeInsertPos = recipeContent.indexOf('export const recipes: Recipe[] = [');
if (recipeInsertPos !== -1) {
  const afterBracket = recipeInsertPos + 'export const recipes: Recipe[] = [\n'.length;
  const recipeJsonCode = '  ' + JSON.stringify(chiaPuddingRecipe, null, 2) + ',\n';
  recipeContent = recipeContent.slice(0, afterBracket) + recipeJsonCode + recipeContent.slice(afterBracket);
  fs.writeFileSync(recipePath, recipeContent, 'utf8');
  console.log('✅ Added Chia Seed Pudding Recipe to recipes.ts');
}
