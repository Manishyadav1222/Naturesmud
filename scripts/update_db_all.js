const https = require('https');
const ftp = require('basic-ftp');
const fs = require('fs');

async function updateDbAll() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  try {
    $pdo = new PDO('mysql:host=localhost;dbname=kathma13_natures_mud;charset=utf8mb4', 'kathma13_muduser', '2*5Qt7iSrB7-Uz');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Update products table images (both primary and secondary as requested)
    $roastedImgs = json_encode(['/products/roasted-almonds-v2.jpg', '/products/roasted-almonds-v2.jpg']);
    $rawAlmondImgs = json_encode(['/products/nm-almond-jar-v2.jpg', '/products/nm-almond-jar-v2.jpg']);
    $avoImgs = json_encode(['/products/avocado-powder-v2.jpg', '/products/avocado-powder-v2.jpg']);
    $strawImgs = json_encode(['/products/strawberry-powder-v2.jpg', '/products/strawberry-powder-v2.jpg']);

    $stmt1 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'roasted-almonds'");
    $stmt1->execute([$roastedImgs]);
    echo "Roasted almonds updated: " . $stmt1->rowCount() . "\\n";

    $stmt2 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'raw-himalayan-almonds'");
    $stmt2->execute([$rawAlmondImgs]);
    echo "Raw almonds updated: " . $stmt2->rowCount() . "\\n";

    $stmt3 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'freeze-dried-avocado-powder'");
    $stmt3->execute([$avoImgs]);
    echo "Avocado powder updated: " . $stmt3->rowCount() . "\\n";

    $stmt4 = $pdo->prepare("UPDATE products SET images = ?, is_featured = 1, is_best_seller = 1 WHERE slug = 'strawberry-powder'");
    $stmt4->execute([$strawImgs]);
    echo "Strawberry powder updated: " . $stmt4->rowCount() . "\\n";

    $stmt5 = $pdo->prepare("UPDATE products SET is_featured = 0, is_best_seller = 0 WHERE slug = 'dry-figs-anjeer'");
    $stmt5->execute();

    // 2. Insert the 3 new blog posts into blog_posts table
    $blogs = [
      [
        'title' => 'Freeze-Dried Avocado Powder: The Himalayan Heart-Healthy Superfood Revolution in Nepal',
        'slug' => 'freeze-dried-avocado-powder-benefits-recipes-nepal',
        'excerpt' => 'Discover the pure butter-rich nutrition of Himalayan avocados preserved with advanced sub-zero freeze-drying. Packed with oleic acid healthy fats, potassium, lutein, and prebiotic fiber for instant guacamole, keto smoothies, and baby weaning.',
        'content' => json_encode([
          '### What Is Freeze-Dried Avocado Powder & How Is It Made?',
          'Avocado is revered globally as nature\\\'s most nutrient-dense whole fruit. However, urban families in Nepal face a persistent frustration: fresh avocados spoil rapidly, bruise in transit, and remain perfectly ripe for only a narrow window of hours.',
          'NaturesMud Freeze-Dried Avocado Powder solves this completely. Harvested at peak maturity from organic mountain orchards in Nepal, fresh avocado flesh is flash-frozen at sub-zero temperatures (-40°C) and placed under deep vacuum sublimation drying. In this process, water moisture evaporates directly from ice to vapor without heat. The cellular structure, monounsaturated lipids, natural emerald color, and delicate buttery aroma remain 100% intact.',
          '### Nutritional Powerhouse: Oleic Acid, Potassium & Lutein',
          'Unlike refined cooking oils or chemically processed plant powders, single-ingredient freeze-dried avocado delivers complete whole-food matrices: Monounsaturated Fatty Acids (Oleic Acid) for arterial flexibility, High Bioavailable Potassium (980mg per 100g) for blood pressure equilibrium, and Lutein & Zeaxanthin for blue light retinal protection.',
          '### 4 Delicious Daily Recipes',
          '1. 30-Second Himalayan Guacamole: Whisk 2 tbsp avocado powder with 3 tbsp warm water, lime juice, chopped tomato, cilantro, and Himalayan pink salt.\\n2. Morning Green Goddess Smoothie: Blend 1 tbsp avocado powder with almond milk, frozen banana, and chia seeds.\\n3. Creamy Salad Crema: Blend with plain yogurt, lemon, and black pepper.\\n4. Keto Coffee Booster: Whisk 1 tsp into morning black coffee for sustained energy.'
        ]),
        'featured_image' => '/products/avocado-powder-v2.jpg',
        'author' => 'NaturesMud Clinical Nutrition Council',
        'category' => 'Nutrition & Superfoods',
        'tags' => json_encode(['avocado', 'freeze-dried', 'healthy-fats', 'keto', 'nepal']),
      ],
      [
        'title' => 'Pure Freeze-Dried Strawberry Powder: Nature\\\'s Vitamin C & Antioxidant Powerhouse in Kathmandu',
        'slug' => 'freeze-dried-strawberry-powder-antioxidant-skin-health-nepal',
        'excerpt' => 'Whole ripe Himalayan strawberries freeze-dried with zero added sugar and zero artificial food coloring. Boost natural collagen synthesis, strengthen cellular immunity, and create luscious ruby smoothie bowls and healthy bakery treats.',
        'content' => json_encode([
          '### What Is Freeze-Dried Strawberry Powder?',
          'Fresh strawberries are celebrated for their luscious berry fragrance and concentrated micronutrient density. NaturesMud Freeze-Dried Strawberry Powder captures the very soul of the fruit at the peak of harvest.',
          'Concentrated at an incredible 10:1 ratio, just 10 grams of powder provides the nutritional equivalent of 100 grams of fresh whole strawberries, with zero added sugar, zero artificial colors (no Red 40), and zero synthetic preservatives.',
          '### Skin Radiance, Anti-Aging & Collagen Biosynthesis',
          'Vitamin C is the essential biological cofactor required by enzymes to cross-link collagen fibrils into a firm, elastic extracellular dermal matrix. The natural Vitamin C in whole strawberry powder is synergistically bound to bioflavonoids, improving cellular retention and absorption while ellagic acid protects against UV-induced collagen breakdown.',
          '### 4 Creative Ways to Enjoy Strawberry Powder Daily',
          '1. Antioxidant Pink Breakfast Bowl: Stir 1 tbsp into Greek yogurt or warm oatmeal with chia seeds and almonds.\\n2. Natural Berry Milkshake for Kids: Whisk 1 tbsp strawberry powder and 1 tsp Dates Powder into whole milk.\\n3. Gourmet Bakery Frosting: Sift 2 tbsp into cream cheese frosting for natural pink color and tart berry flavor.\\n4. Pre-Workout Hydration Berry Tonic: Shake 1 tsp into cold water with lemon.'
        ]),
        'featured_image' => '/products/strawberry-powder-v2.jpg',
        'author' => 'NaturesMud Clinical Nutrition Council',
        'category' => 'Superfoods & Beauty',
        'tags' => json_encode(['strawberry', 'freeze-dried', 'vitamin-c', 'antioxidants', 'collagen']),
      ],
      [
        'title' => 'Raw Green Banana Powder: The Gut Microbiome & Prebiotic Resistant Starch Miracle of Nepal',
        'slug' => 'raw-green-banana-powder-resistant-starch-gut-health-nepal',
        'excerpt' => 'Harness the therapeutic power of Himalayan green bananas. Rich in Type-2 Resistant Starch (RS2), this prebiotic flour nourishes beneficial gut bacteria, heals leaky gut, stabilizes insulin sensitivity, and provides soothing infant nutrition.',
        'content' => json_encode([
          '### What Is Raw Green Banana Powder & Resistant Starch?',
          'Before a banana ripens, its carbohydrate matrix exists in a remarkably different biological state known as Type-2 Resistant Starch (RS2).',
          'NaturesMud Raw Green Banana Powder is crafted from carefully selected, unripe organic green bananas harvested across Nepal. Sliced and gently dehydrated at low temperatures without heat-gelatinization, the powder locks in maximum active prebiotic starch that travels completely intact into the large intestine where your microbiome awaits.',
          '### How It Heals Leaky Gut, Bloating & Constipation',
          'In the colon, probiotic bacteria ferment resistant starch into Short-Chain Fatty Acids (SCFAs) — predominantly butyrate. Butyrate repairs tight junctions in the gut lining, stops chronic bloating, and promotes natural bowel regularity.',
          '### Traditional Infant Weaning & Tummy Soothing (6+ Months)',
          'In Nepal, green banana flour has been revered for generations as a soothing, hypoallergenic first weaning food (Sattu / Khichdi alternative). Cook 1 tbsp with half a cup of water into a velvety porridge and add Dates Powder for gentle mineral energy.'
        ]),
        'featured_image' => '/products/banana-powder.jpg',
        'author' => 'NaturesMud Clinical Nutrition Council',
        'category' => 'Gut Health & Digestion',
        'tags' => json_encode(['banana-powder', 'resistant-starch', 'gut-health', 'prebiotics', 'baby-food']),
      ]
    ];

    $blogStmt = $pdo->prepare("
      INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        featured_image = VALUES(featured_image),
        author = VALUES(author),
        category = VALUES(category),
        tags = VALUES(tags),
        is_published = 1,
        updated_at = NOW()
    ");

    foreach ($blogs as $b) {
      $blogStmt->execute([
        $b['title'],
        $b['slug'],
        $b['excerpt'],
        $b['content'],
        $b['featured_image'],
        $b['author'],
        $b['category'],
        $b['tags']
      ]);
      echo "Blog inserted/updated: " . $b['slug'] . "\\n";
    }

    echo "All DB updates completed successfully!\\n";
  } catch(Exception $e) {
    echo "DB Error: " . $e->getMessage() . "\\n";
  }
  `;

  fs.writeFileSync('update_db_all.php', php);
  await client.uploadFrom('update_db_all.php', '/api.naturesmud.shop/public/update_db_all.php');

  https.get('https://api.naturesmud.shop/update_db_all.php', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Result:\n' + d);
      await client.remove('/api.naturesmud.shop/public/update_db_all.php');
      client.close();
      fs.unlinkSync('update_db_all.php');
    });
  });
}

updateDbAll().catch(console.error);
