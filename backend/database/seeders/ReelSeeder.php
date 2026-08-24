<?php

namespace Database\Seeders;

use App\Models\Reel;
use Illuminate\Database\Seeder;

class ReelSeeder extends Seeder
{
    public function run(): void
    {
        $reels = [
            [
                'title' => 'Natural Energy For Your Day',
                'description' => 'Dates Powder — sustained energy fuel, no added sugar. Pre-workout power! ⚡',
                'video_url' => '/videos/dates-powder-energy.mp4',
                'cover_image' => '/products/dates-powder.jpg',
                'product_name' => 'Dates Powder',
                'product_url' => '/products/dates-powder',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'The Purity of the Mountains in Every Bite',
                'description' => 'Premium Dehydrated Apple — 100% natural, no preservatives 🍎',
                'video_url' => '/videos/apple-mountains.mp4',
                'cover_image' => '/products/papaya.jpg',
                'product_name' => 'Dehydrated Apple',
                'product_url' => '/products/dehydrated-apple',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Coconut Oil — Pure & Cold-Pressed',
                'description' => 'From farm to jar — extra virgin coconut oil for cooking, skin & hair 🥥',
                'video_url' => '/videos/coconut-oil-ad.mp4',
                'cover_image' => '/products/coconut-oil.jpg',
                'product_name' => 'Premium Coconut Oil',
                'product_url' => '/products/premium-coconut-oil',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Stress Defense — Antioxidants to Control Cortisol',
                'description' => 'Dried Blueberries — little berries, big goodness. No preservatives 💜',
                'video_url' => '/videos/blueberries-stress.mp4',
                'cover_image' => '/products/blueberries.jpg',
                'product_name' => 'Dried Blueberries',
                'product_url' => '/products/dried-blueberries',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Brain Fuel — Vitamin E & Protein for Mental Clarity',
                'description' => 'Premium Almonds — 100% natural, raw & unroasted. Nutritious superfood 🧠',
                'video_url' => '/videos/almonds-brain.mp4',
                'cover_image' => '/products/almonds.jpg',
                'product_name' => 'Premium Roasted Almonds',
                'product_url' => '/products/premium-roasted-almonds',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => "Nature's Antibiotic — High in Bacteria-Fighting PACs",
                'description' => 'Dried Cranberries — tangy, sweet & naturally good. Boosts immunity ❤️',
                'video_url' => '/videos/cranberries-antibiotic.mp4',
                'cover_image' => '/products/cranberries.jpg',
                'product_name' => 'Dried Cranberries',
                'product_url' => '/products/dried-cranberries',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'title' => 'Superfood Nutrient Master — The Whole Family Loves It',
                'description' => 'Beetroot Powder — enhances blood flow, athletic stamina & immunity 🌿',
                'video_url' => '/videos/beetroot-family.mp4',
                'cover_image' => '/products/beetroot-powder.jpg',
                'product_name' => 'Beetroot Powder',
                'product_url' => '/products/beetroot-powder',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'title' => 'Choose Natural — Ditch the Sugar',
                'description' => 'Dates Powder — your natural sweetener with polyphenol antioxidants 🍯',
                'video_url' => '/videos/sugar-free-choice.mp4',
                'cover_image' => '/products/dates-powder.jpg',
                'product_name' => 'Dates Powder',
                'product_url' => '/products/dates-powder',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'title' => 'Crunchy Goodness — Straight from the Himalayas',
                'description' => 'Premium Almonds — naturally crunchy, protein-packed superfood 🥜',
                'video_url' => '/videos/almonds.mp4',
                'cover_image' => '/products/almonds-2.jpg',
                'product_name' => 'Premium Roasted Almonds',
                'product_url' => '/products/premium-roasted-almonds',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'title' => 'Crisp, Sweet & Pure — Orchard Fresh',
                'description' => 'Dehydrated apple slices — nature\'s candy, no additives 🍏',
                'video_url' => '/videos/apple.mp4',
                'cover_image' => '/products/papaya.jpg',
                'product_name' => 'Dehydrated Apple',
                'product_url' => '/products/dehydrated-apple',
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'title' => 'Berry Antioxidant Boost',
                'description' => 'Wild blueberries — tiny but mighty in antioxidants 💙',
                'video_url' => '/videos/blueberries.mp4',
                'cover_image' => '/products/blueberries-2.jpg',
                'product_name' => 'Dried Blueberries',
                'product_url' => '/products/dried-blueberries',
                'is_active' => true,
                'sort_order' => 11,
            ],
            [
                'title' => 'Cold-Pressed Purity in Every Drop',
                'description' => 'Pure coconut oil — extracted fresh without heat 🥥',
                'video_url' => '/videos/coconut-oil.mp4',
                'cover_image' => '/products/coconut-oil.jpg',
                'product_name' => 'Premium Coconut Oil',
                'product_url' => '/products/premium-coconut-oil',
                'is_active' => true,
                'sort_order' => 12,
            ],
            [
                'title' => 'Tangy Superfruit for Daily Immunity',
                'description' => 'Cranberries — tart, tangy and packed with PACs 🍒',
                'video_url' => '/videos/cranberries.mp4',
                'cover_image' => '/products/cranberries-2.jpg',
                'product_name' => 'Dried Cranberries',
                'product_url' => '/products/dried-cranberries',
                'is_active' => true,
                'sort_order' => 13,
            ],
            [
                'title' => 'Naturally Sweet — No Refined Sugar',
                'description' => 'Dates powder — the ultimate natural sweetness for your recipes 🍯',
                'video_url' => '/videos/dates-powder-energy.mp4',
                'cover_image' => '/products/dates-powder.jpg',
                'product_name' => 'Dates Powder',
                'product_url' => '/products/dates-powder',
                'is_active' => true,
                'sort_order' => 14,
            ],
        ];

        foreach ($reels as $reel) {
            Reel::updateOrCreate(['title' => $reel['title']], $reel);
        }

        // Remove stale reels that are no longer in the seeder (e.g. old placeholder/test reels)
        $validTitles = collect($reels)->pluck('title');
        Reel::whereNotIn('title', $validTitles)->delete();
    }
}
