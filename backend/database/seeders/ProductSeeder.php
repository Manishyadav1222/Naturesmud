<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'slug')->toArray();

        $products = [
            // --- 1. Dehydrated Fruits ---
            [
                'name' => "Dehydrated Mango",
                'slug' => "dehydrated-mango",
                'category' => "dried-fruits",
                'price' => 395,
                'compare_at_price' => 395,
                'short_description' => "100% pure sun-dried sweet mango slices without added sugar or sulfur in a Standup Ziplock Pouch.",
                'stock_quantity' => 120,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Dehydrated Pineapple",
                'slug' => "dehydrated-pineapple",
                'category' => "dried-fruits",
                'price' => 495,
                'compare_at_price' => 495,
                'short_description' => "Tangy-sweet dehydrated pineapple rings rich in natural bromelain enzyme.",
                'stock_quantity' => 95,
                'is_featured' => true,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Dehydrated Apple",
                'slug' => "dehydrated-apple",
                'category' => "dried-fruits",
                'price' => 510,
                'compare_at_price' => 510,
                'short_description' => "Pectin-rich crispy dehydrated apple rings with zero added sugar in a Standup Ziplock Pouch.",
                'stock_quantity' => 85,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Dehydrated Coconut Chip",
                'slug' => "dehydrated-coconut-chips",
                'category' => "dried-fruits",
                'price' => 495,
                'compare_at_price' => 495,
                'short_description' => "Crunchy dehydrated coconut flakes rich in clean MCT healthy fats in a Standup Ziplock Pouch.",
                'stock_quantity' => 90,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Dehydrated Papaya",
                'slug' => "dehydrated-papaya",
                'category' => "dried-fruits",
                'price' => 395,
                'compare_at_price' => 395,
                'short_description' => "Enzyme-rich dehydrated sweet papaya slices for healthy gut digestion and snacking.",
                'stock_quantity' => 115,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            // --- 2. Dried Fruits & Berries ---
            [
                'name' => "Dried Blueberries",
                'slug' => "dried-blueberries",
                'category' => "dried-fruits",
                'price' => 650,
                'compare_at_price' => 650,
                'short_description' => "Wild alpine anthocyanin berries for brain focus, memory & screen-fatigue eye defense in a Glass Jar.",
                'stock_quantity' => 80,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Dried Cranberry",
                'slug' => "dried-cranberries",
                'category' => "dried-fruits",
                'price' => 415,
                'compare_at_price' => 415,
                'short_description' => "Antioxidant-dense whole dried cranberries for urinary tract and cellular wellness in a Glass Jar.",
                'stock_quantity' => 95,
                'is_featured' => true,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Dried Figs",
                'slug' => "dried-figs",
                'category' => "dried-fruits",
                'price' => 690,
                'compare_at_price' => 690,
                'short_description' => "Sweet chewy sun-dried figs loaded with dietary fiber, iron, and plant calcium in a 200g Glass Jar.",
                'stock_quantity' => 90,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 200,
            ],
            // --- 3. Nature's Powders & Essential Salts ---
            [
                'name' => "Dates Powder",
                'slug' => "dates-powder",
                'category' => "powders",
                'price' => 350,
                'compare_at_price' => 350,
                'short_description' => "100% unrefined natural sweetener made from whole dehydrated dates — 0% white sugar in a Glass Jar.",
                'stock_quantity' => 150,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Beetroot Powder",
                'slug' => "beetroot-powder",
                'category' => "powders",
                'price' => 430,
                'compare_at_price' => 430,
                'short_description' => "Natural dietary nitrate booster for glowing skin, blood stamina & cardiac health in a Glass Jar.",
                'stock_quantity' => 120,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Carrot Powder",
                'slug' => "carrot-powder",
                'category' => "powders",
                'price' => 490,
                'compare_at_price' => 490,
                'short_description' => "Fine organic carrot powder rich in beta-carotene for infant feeding and healthy soups in a 100g Glass Jar.",
                'stock_quantity' => 85,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Sweet Potato Powder",
                'slug' => "sweet-potato-powder",
                'category' => "powders",
                'price' => 510,
                'compare_at_price' => 510,
                'short_description' => "100% natural dehydrated sweet potato powder for baby food, smoothies & healthy baking in a 100g Glass Jar.",
                'stock_quantity' => 160,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Pink Salt",
                'slug' => "himalayan-pink-salt",
                'category' => "salts-spices",
                'price' => 180,
                'compare_at_price' => 180,
                'short_description' => "Pure unrefined pink rock salt with 84+ essential bio-available trace minerals in a Glass Jar.",
                'stock_quantity' => 200,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            [
                'name' => "Black Salt",
                'slug' => "pure-himalayan-black-salt-bire-noon",
                'category' => "salts-spices",
                'price' => 150,
                'compare_at_price' => 150,
                'short_description' => "Authentic volcanic trace-mineral rock salt with distinctive digestive benefits in a Glass Jar.",
                'stock_quantity' => 180,
                'is_featured' => true,
                'is_best_seller' => false,
                'weight' => 100,
            ],
            // --- 4. Premium Nuts & Mixes ---
            [
                'name' => "Almond",
                'slug' => "raw-himalayan-almonds",
                'category' => "nuts",
                'price' => 750,
                'compare_at_price' => 750,
                'short_description' => "Raw unpasteurized mountain almonds for morning soaking and brain memory fuel in a 200g Glass Jar.",
                'stock_quantity' => 130,
                'is_featured' => true,
                'is_best_seller' => false,
                'weight' => 200,
            ],
            [
                'name' => "Roasted Almond",
                'slug' => "roasted-almonds",
                'category' => "nuts",
                'price' => 750,
                'compare_at_price' => 750,
                'short_description' => "Slow-roasted crispy mountain almonds packed with Vitamin E and clean protein in a 100g Glass Jar.",
                'stock_quantity' => 120,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 100,
            ],
            [
                'name' => "Premium Cashewnut",
                'slug' => "premium-cashewnuts",
                'category' => "nuts",
                'price' => 750,
                'compare_at_price' => 750,
                'short_description' => "Jumbo whole grade cashewnuts with a rich buttery crunch and heart-healthy fats in a 200g Glass Jar.",
                'stock_quantity' => 100,
                'is_featured' => true,
                'is_best_seller' => false,
                'weight' => 200,
            ],
            [
                'name' => "Roasted Cashewnut",
                'slug' => "roasted-cashewnuts",
                'category' => "nuts",
                'price' => 750,
                'compare_at_price' => 750,
                'short_description' => "Dry-roasted crunchy cashews packed with minerals and natural savory flavor in a 150g Glass Jar.",
                'stock_quantity' => 85,
                'is_featured' => false,
                'is_best_seller' => true,
                'weight' => 150,
            ],
            [
                'name' => "Pistachio",
                'slug' => "premium-pistachios",
                'category' => "nuts",
                'price' => 895,
                'compare_at_price' => 895,
                'short_description' => "Antioxidant-rich whole pistachios for eye health, cardiac protection & guilt-free snacking in a 150g Glass Jar.",
                'stock_quantity' => 80,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 150,
            ],
            [
                'name' => "Mix dry Nuts",
                'slug' => "superfood-trail-mix",
                'category' => "nuts",
                'price' => 690,
                'compare_at_price' => 690,
                'short_description' => "Ultimate energy blend of whole mountain nuts, raw seeds & antioxidant berries in a 300g Plastic Jar.",
                'stock_quantity' => 140,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 300,
            ],
            [
                'name' => "Macademia Nuts",
                'slug' => "macadamia-nuts",
                'category' => "nuts",
                'price' => 850,
                'compare_at_price' => 850,
                'short_description' => "Buttery gourmet macadamias high in rare Omega-7 fats for brain & skin wellness in a 150g Glass Jar.",
                'stock_quantity' => 65,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 150,
            ],
            // --- 5. Organic Seeds & Premier Oils ---
            [
                'name' => "Chia Seeds",
                'slug' => "chia-seeds",
                'category' => "seeds",
                'price' => 495,
                'compare_at_price' => 495,
                'short_description' => "Omega-3 and soluble fiber powerhouse for weight balance, gut health & endurance in a 300g Plastic Jar.",
                'stock_quantity' => 110,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 300,
            ],
            [
                'name' => "Pumpkin Seeds",
                'slug' => "pumpkin-seeds",
                'category' => "seeds",
                'price' => 650,
                'compare_at_price' => 650,
                'short_description' => "Raw zinc and magnesium rich pepitas for immune strength, sleep quality & hormone balance in a 300g Plastic Jar.",
                'stock_quantity' => 105,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 300,
            ],
            [
                'name' => "Coconut oil",
                'slug' => "virgin-coconut-oil-500ml",
                'category' => "oils",
                'price' => 1750,
                'compare_at_price' => 1750,
                'short_description' => "Raw unrefined virgin coconut oil rich in Lauric Acid for cooking, skin & baby care in a 500ml Glass Jar.",
                'stock_quantity' => 95,
                'is_featured' => true,
                'is_best_seller' => true,
                'weight' => 500,
            ],
            [
                'name' => "Coconut oil",
                'slug' => "virgin-coconut-oil-180ml",
                'category' => "oils",
                'price' => 650,
                'compare_at_price' => 650,
                'short_description' => "Compact glass jar of pure unrefined virgin coconut oil for skincare, travel & oil pulling in a 180ml Glass Jar.",
                'stock_quantity' => 110,
                'is_featured' => false,
                'is_best_seller' => false,
                'weight' => 180,
            ],
        ];

        foreach ($products as $p) {
            $catSlug = $p['category'];
            $catId = $categories[$catSlug] ?? null;

            if (!$catId) {
                $category = Category::firstOrCreate(
                    ['slug' => $catSlug],
                    [
                        'name' => ucwords(str_replace('-', ' ', $catSlug)),
                        'description' => "Premium quality {$catSlug} sourced from Nepal.",
                        'is_active' => true,
                    ]
                );
                $catId = $category->id;
                $categories[$catSlug] = $catId;
            }

            Product::updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'name' => $p['name'],
                    'category_id' => $catId,
                    'price' => $p['price'],
                    'compare_at_price' => $p['compare_at_price'] ?? null,
                    'short_description' => $p['short_description'],
                    'stock_quantity' => $p['stock_quantity'],
                    'is_featured' => $p['is_featured'],
                    'is_best_seller' => $p['is_best_seller'],
                    'weight' => $p['weight'],
                    'is_active' => true,
                ]
            );
        }

        // Deactivate or remove any products not in the active 25 list
        $activeSlugs = array_column($products, 'slug');
        Product::whereNotIn('slug', $activeSlugs)->update(['is_active' => false]);
    }
}
