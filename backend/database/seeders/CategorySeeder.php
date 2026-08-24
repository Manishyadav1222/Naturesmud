<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Nuts', 'Seeds', 'Superfoods', 'Powders', 'Dried Fruits', 'Healthy Snacks', 'Spices',
        ];

        foreach ($categories as $index => $name) {
            Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => "Premium quality {$name} sourced from Nepal.",
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}