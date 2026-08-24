<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\BlogPost;
use App\Models\Page;
use App\Models\Recipe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // Banners
        Banner::updateOrCreate(
            ['title' => 'Organic Superfoods from the Himalayas'],
            [
                'subtitle' => '100% natural, no additives. Proudly made in Nepal.',
                'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
                'link' => '/products',
                'position' => 'home',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        // Blog posts
        $blogs = [
            [
                'title' => 'The Power of Himalayan Superfoods',
                'slug' => 'power-of-himalayan-superfoods',
                'excerpt' => 'Discover why superfoods grown at high altitudes pack more nutrients.',
                'category' => 'Nutrition',
                'tags' => ['superfoods', 'nutrition', 'himalayas'],
            ],
            [
                'title' => '5 Healthy Breakfast Ideas with Chia Seeds',
                'slug' => 'healthy-breakfast-ideas-chia-seeds',
                'excerpt' => 'Start your day right with these quick and delicious chia seed recipes.',
                'category' => 'Health Tips',
                'tags' => ['breakfast', 'chia', 'recipes'],
            ],
            [
                'title' => 'Why Raw Honey is Better Than Processed Sugar',
                'slug' => 'raw-honey-vs-processed-sugar',
                'excerpt' => 'The natural sweetness of raw honey and its health benefits.',
                'category' => 'Lifestyle',
                'tags' => ['honey', 'sugar', 'health'],
            ],
        ];

        foreach ($blogs as $blog) {
            BlogPost::updateOrCreate(
                ['slug' => $blog['slug']],
                [
                    'title' => $blog['title'],
                    'excerpt' => $blog['excerpt'],
                    'content' => "<p>{$blog['excerpt']}</p><p>At Nature's Mud, we believe in the power of natural food. Our products are sourced directly from farmers across Nepal, ensuring the highest quality and freshness.</p>",
                    'featured_image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
                    'author' => 'Nature\'s Mud Team',
                    'category' => $blog['category'],
                    'tags' => $blog['tags'],
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(1, 30)),
                    'meta_title' => $blog['title'] . ' | Nature\'s Mud Blog',
                    'meta_description' => $blog['excerpt'],
                ]
            );
        }

        // Recipes
        $recipes = [
            [
                'title' => 'Creamy Chia Seed Pudding',
                'slug' => 'creamy-chia-seed-pudding',
                'category' => 'Breakfast',
                'prep_time' => 10,
                'cook_time' => 0,
                'servings' => 2,
                'difficulty' => 'easy',
                'ingredients' => ['3 tbsp chia seeds', '1 cup almond milk', '1 tbsp raw honey', 'Fresh fruits for topping'],
                'instructions' => ['Mix chia seeds and almond milk in a bowl.', 'Add honey and stir well.', 'Refrigerate for at least 4 hours or overnight.', 'Top with fresh fruits and serve.'],
            ],
            [
                'title' => 'Himalayan Trail Mix Energy Bites',
                'slug' => 'himalayan-trail-mix-energy-bites',
                'category' => 'Snacks',
                'prep_time' => 15,
                'cook_time' => 0,
                'servings' => 12,
                'difficulty' => 'easy',
                'ingredients' => ['1 cup trail mix', '1/2 cup dates', '2 tbsp peanut butter', '1 tbsp honey'],
                'instructions' => ['Blend trail mix until coarse.', 'Add dates, peanut butter, and honey.', 'Blend until sticky.', 'Roll into balls and refrigerate.'],
            ],
            [
                'title' => 'Golden Turmeric Smoothie',
                'slug' => 'golden-turmeric-smoothie',
                'category' => 'Smoothies',
                'prep_time' => 5,
                'cook_time' => 0,
                'servings' => 1,
                'difficulty' => 'easy',
                'ingredients' => ['1 banana', '1 cup coconut milk', '1 tsp turmeric powder', '1/2 tsp ginger powder', '1 tsp honey'],
                'instructions' => ['Add all ingredients to a blender.', 'Blend until smooth.', 'Pour into a glass and enjoy.'],
            ],
        ];

        foreach ($recipes as $recipe) {
            Recipe::updateOrCreate(
                ['slug' => $recipe['slug']],
                [
                    'title' => $recipe['title'],
                    'excerpt' => "A delicious {$recipe['category']} recipe using Nature's Mud products.",
                    'content' => "<p>{$recipe['title']} — a healthy and delicious recipe.</p>",
                    'featured_image' => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
                    'category' => $recipe['category'],
                    'prep_time' => $recipe['prep_time'],
                    'cook_time' => $recipe['cook_time'],
                    'servings' => $recipe['servings'],
                    'difficulty' => $recipe['difficulty'],
                    'ingredients' => $recipe['ingredients'],
                    'instructions' => $recipe['instructions'],
                    'nutrition' => ['calories' => '200 kcal', 'protein' => '5g', 'carbs' => '30g', 'fat' => '8g'],
                    'is_published' => true,
                    'meta_title' => $recipe['title'] . ' | Nature\'s Mud Recipes',
                    'meta_description' => "A delicious {$recipe['category']} recipe using Nature's Mud products.",
                ]
            );
        }

        // Pages
        $pages = [
            ['title' => 'About Us', 'slug' => 'about', 'content' => '<p>Nature\'s Mud is a Nepal-based organic food brand.</p>'],
            ['title' => 'Privacy Policy', 'slug' => 'privacy-policy', 'content' => '<p>Our privacy policy.</p>'],
            ['title' => 'Terms & Conditions', 'slug' => 'terms', 'content' => '<p>Our terms and conditions.</p>'],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                [
                    'title' => $page['title'],
                    'content' => $page['content'],
                    'is_published' => true,
                    'meta_title' => $page['title'] . ' | Nature\'s Mud',
                    'meta_description' => $page['title'],
                ]
            );
        }
    }
}