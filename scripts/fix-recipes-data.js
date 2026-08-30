const fs = require('fs');
const path = require('path');

const recipesFilePath = path.join(__dirname, '..', 'lib', 'data', 'recipes.ts');
let content = fs.readFileSync(recipesFilePath, 'utf8');

// Replace all external unsplash URLs with thematic authentic local image paths
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1511690743698-d9d85f2fbf38\?[^'"]+/g, '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1553530666-ba11a7da3888\?[^'"]+/g, '/images/blog/himalayan-beetroot-nitric-oxide-stamina.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1596870230751-ebdfce98ec42\?[^'"]+/g, '/images/blog/purity-wellness-rakhi-chia-almonds.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1517838277536-f5f99be501cd\?[^'"]+/g, '/products/superfood-mix.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1604329760661-e71dc83f8f26\?[^'"]+/g, '/images/blog/himalayan-shilajit-ayurveda-biohacking.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1488477181946-6428a0291777\?[^'"]+/g, '/images/recipes/beetroot-smoothie-bowl.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1544787219-7f47ccb76574\?[^'"]+/g, '/products/raw-honey.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1584776296944-ab6fb57b0bdd\?[^'"]+/g, '/products/pumpkin-seeds.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1512621776951-a57141f2eefd\?[^'"]+/g, '/products/authentic-dehydrated-mango.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1517282009859-f000ec3b26fe\?[^'"]+/g, '/images/blog/healthy-rakshabandhan-superfood-rangoli.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1528207776546-365bb710ee93\?[^'"]+/g, '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1546069901-ba9599a7e63c\?[^'"]+/g, '/images/recipes/oatmeal-bowl-daily-routine.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1514733670139-4d87a1941d55\?[^'"]+/g, '/products/almonds-2.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1585672840462-85e839e38dc0\?[^'"]+/g, '/products/walnuts.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1505253758473-96b3015f27eb\?[^'"]+/g, '/products/chia-seeds.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1555252333-9f8e92e65df9\?[^'"]+/g, '/images/recipes/sweet-potato-stirred-smoothie.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1508746829417-e6f548d8d6ed\?[^'"]+/g, '/products/dates-powder-100g.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1576092768241-dec231879fc3\?[^'"]+/g, '/products/shilajit.jpg');
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1550258987-190a2d41a8ba\?[^'"]+/g, '/products/authentic-dehydrated-mango.jpg');

// Any remaining unsplash
content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s'"]+/g, '/products/superfood-mix.jpg');

// New high-priority recipe items
const newRecipes = [
  {
    id: 'r-sweetpotato-pancakes-powder',
    slug: 'fluffy-sweet-potato-pancakes-powder-recipe',
    title: 'Fluffy Sweet Potato Pancakes (Using Sweet Potato Powder)',
    excerpt: 'Golden, fluffy 10-minute pancakes naturally sweetened with organic sweet potato powder and dates powder. 100% sugar-free breakfast for babies & families.',
    image: '/images/blog/himalayan-baby-nutrition-sweet-potato.jpg',
    category: 'Breakfast',
    prepTime: 3,
    cookTime: 7,
    servings: 3,
    difficulty: 'Easy',
    ingredients: [
      "1/3 cup Nature's Mud Organic Sweet Potato Powder (100g Jar)",
      '2/3 cup whole wheat flour or ground rolled oats',
      "1 tbsp Nature's Mud Natural Dates Powder",
      '1 egg (or 1 chia egg: 1 tbsp chia + 3 tbsp water)',
      '3/4 cup milk or almond milk',
      "1 tbsp melted Nature's Mud Cold-Pressed Virgin Coconut Oil",
      '1 tsp baking powder & 1/2 tsp cinnamon'
    ],
    instructions: [
      "In a bowl, whisk sweet potato powder, whole wheat flour, baking powder, and cinnamon.",
      "In another bowl, whisk egg, milk, melted coconut oil, and dates powder.",
      "Combine wet and dry ingredients and let the batter rest for 3 minutes to hydrate.",
      "Pour 1/4-cup scoops onto a medium-hot greased tawa and cook for 2 minutes per side until golden.",
      "Serve warm with raw Himalayan honey and sliced mountain almonds."
    ],
    tags: ['sweet potato pancakes', 'sweet potato powder recipes', 'baby food', 'sugar free pancakes'],
    featured: true
  },
  {
    id: 'r-beetroot-smoothie-stamina',
    slug: 'high-nitrate-beetroot-smoothie-powder-recipe',
    title: 'High-Nitrate Beetroot Stamina Smoothie (Using Beetroot Powder)',
    excerpt: 'Boost running stamina, muscle blood flow, and skin radiance with concentrated dietary nitrates from pure Himalayan beetroot powder.',
    image: '/images/blog/himalayan-beetroot-nitric-oxide-stamina.jpg',
    category: 'Fitness & Gym',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      "1 tsp (5g) Nature's Mud Pure Himalayan Beetroot Powder",
      '1 ripe banana (frozen)',
      "2 tbsp Nature's Mud Wild Dried Blueberries (rehydrated)",
      "1 tbsp Nature's Mud Premium Black Chia Seeds (soaked)",
      '1 cup coconut water or almond milk',
      '1 tbsp fresh lime juice'
    ],
    instructions: [
      "Add banana, softened wild blueberries, beetroot powder, soaked chia seeds, and coconut water to a blender.",
      "Blend on high for 45 to 60 seconds until silky electric ruby-red.",
      "Squeeze in fresh lime juice and pulse for 5 seconds.",
      "Drink 30–45 minutes prior to gym training or trekking for sustained vascular oxygen flow."
    ],
    tags: ['beetroot smoothie', 'beetroot powder recipe', 'nitric oxide', 'pre workout drink'],
    featured: true
  },
  {
    id: 'r-dates-caramel-smoothie',
    slug: 'creamy-caramel-dates-powder-smoothie-recipe',
    title: 'Creamy Caramel Dates Smoothie (Using Dates Powder)',
    excerpt: 'A velvety, sugar-free caramel smoothie with whole dates powder, roasted cashews, and bananas for lasting afternoon energy.',
    image: '/products/dates-powder-100g.jpg',
    category: 'Smoothies & Drinks',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      "1.5 tbsp Nature's Mud Natural Dates Powder",
      '1 frozen banana',
      '1 cup chilled milk or oat milk',
      "1 tbsp Nature's Mud Roasted Cashewnuts or peanut butter",
      "1 tbsp Nature's Mud Black Chia Seeds",
      '1/4 tsp ground cinnamon'
    ],
    instructions: [
      "Add frozen banana, dates powder, roasted cashews, chia seeds, and cinnamon to a blender.",
      "Pour in cold milk and blend on high for 60 seconds until rich and creamy.",
      "Pour into a chilled glass and top with crushed cashews and a dusting of dates powder."
    ],
    tags: ['dates smoothie', 'dates powder recipes', 'healthy smoothie', 'caramel smoothie'],
    featured: true
  },
  {
    id: 'r-homemade-granola-superfood',
    slug: 'homemade-superfood-granola-nuts-seeds-nepal',
    title: 'Crunchy Homemade Granola With Nuts, Seeds & Dried Fruits',
    excerpt: 'Crispy, cluster-rich, 100% sugar-free homemade granola baked with rolled oats, mountain almonds, pumpkin seeds, dates powder, and coconut oil.',
    image: '/images/combos/superfood-lineup.jpg',
    category: 'Breakfast',
    prepTime: 5,
    cookTime: 20,
    servings: 8,
    difficulty: 'Easy',
    ingredients: [
      '3 cups rolled oats',
      "1/2 cup Nature's Mud Raw Himalayan Almonds (chopped)",
      "1/2 cup Nature's Mud Raw Walnuts (chopped)",
      "1/2 cup Nature's Mud Organic Pumpkin Seeds",
      "1/4 cup Nature's Mud Black Chia Seeds",
      "1/3 cup Nature's Mud Natural Dates Powder",
      "1/3 cup Nature's Mud Virgin Coconut Oil (melted)",
      "1/4 cup Nature's Mud Raw Mountain Honey",
      "1/2 cup Nature's Mud Sun-Dried Mango & Dried Blueberries"
    ],
    instructions: [
      "Toss oats, nuts, seeds, dates powder, cinnamon, and pink salt with melted coconut oil and honey.",
      "Press firmly into an even compact layer on a baking sheet lined with parchment paper.",
      "Bake at 160°C (320°F) for 20–22 minutes until golden-brown.",
      "Let cool completely undisturbed for 45 minutes to form crunchy clusters.",
      "Break into clusters, toss with dried mango and blueberries, and store in an airtight glass jar."
    ],
    tags: ['homemade granola recipe', 'healthy granola', 'granola nepal', 'clean breakfast cereal'],
    featured: true
  },
  {
    id: 'r-energy-balls-dates-nuts',
    slug: 'no-bake-healthy-energy-balls-dates-powder-recipe',
    title: 'No-Bake Healthy Energy Balls (With Dates Powder & Nuts)',
    excerpt: 'Delicious 10-minute no-bake energy balls made with dates powder, raw mountain nuts, chia seeds, and coconut oil. Sugar-free clean snack for office & workouts.',
    image: '/images/blog/purity-wellness-rakhi-chia-almonds.jpg',
    category: 'Healthy Snack',
    prepTime: 10,
    cookTime: 0,
    servings: 12,
    difficulty: 'Easy',
    ingredients: [
      '1 cup rolled oats (pulsed into coarse flour)',
      "1/2 cup Nature's Mud Natural Dates Powder",
      "1/4 cup Nature's Mud Raw Mountain Almonds (crushed)",
      "1/4 cup Nature's Mud Roasted Cashewnuts (crushed)",
      "2 tbsp Nature's Mud Black Chia Seeds",
      "2 tbsp Nature's Mud Organic Pumpkin Seeds",
      "2 tbsp Nature's Mud Virgin Coconut Oil",
      '2 tbsp warm water or raw honey to bind'
    ],
    instructions: [
      "In a bowl, mix rolled oat flour, dates powder, crushed nuts, chia seeds, and pumpkin seeds.",
      "Add melted coconut oil and warm water. Knead by hand into a sticky dough.",
      "Roll 1-tablespoon portions into firm bite-sized balls.",
      "Chill in the refrigerator for 20 minutes to set. Store in an airtight glass jar for up to 3 weeks."
    ],
    tags: ['energy balls recipe', 'healthy energy balls', 'no bake energy bites', 'clean office snacks'],
    featured: true
  },
  {
    id: 'r-chia-overnight-oats-nepal',
    slug: 'creamy-chia-seed-overnight-oats-recipe-nepal',
    title: 'Creamy Chia Seed Overnight Oats (Easy 3-Minute Breakfast)',
    excerpt: 'Make-ahead creamy chia overnight oats naturally sweetened with dates powder, curd, sliced mountain almonds, and sun-dried mango. Zero morning cooking.',
    image: '/images/recipes/oatmeal-bowl-daily-routine.jpg',
    category: 'Breakfast',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup rolled oats',
      "1 tbsp Nature's Mud Premium Black Chia Seeds",
      "1 tbsp Nature's Mud Natural Dates Powder",
      '2/3 cup milk or almond milk',
      '2 tbsp fresh curd (dahi)',
      "1 tbsp sliced Nature's Mud Raw Almonds",
      "1 tbsp chopped Nature's Mud Sun-Dried Mango Slices"
    ],
    instructions: [
      "In a 300ml glass jar, combine oats, chia seeds, dates powder, cinnamon, milk, and curd.",
      "Whisk vigorously with a fork for 30 seconds until completely mixed.",
      "Seal the jar and refrigerate overnight (at least 6 hours).",
      "In the morning, top with sliced almonds, sun-dried mango, and blueberries. Enjoy chilled!"
    ],
    tags: ['overnight oats with chia seeds', 'chia overnight oats', 'healthy breakfast prep', 'sugar free overnight oats'],
    featured: true
  }
];

// Insert new recipes at the beginning of recipes array
const newRecipesCode = newRecipes.map(r => `  ${JSON.stringify(r, null, 2)},`).join('\n');
const insertPos = content.indexOf('export const recipes: Recipe[] = [');
if (insertPos !== -1) {
  const afterBracket = insertPos + 'export const recipes: Recipe[] = [\n'.length;
  content = content.slice(0, afterBracket) + newRecipesCode + '\n' + content.slice(afterBracket);
}

fs.writeFileSync(recipesFilePath, content, 'utf8');
console.log('✅ Successfully updated lib/data/recipes.ts with local images and 6 new master recipes!');
