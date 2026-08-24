<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'featured_image',
        'category', 'prep_time', 'cook_time', 'servings', 'difficulty',
        'ingredients', 'instructions', 'nutrition', 'is_published',
        'meta_title', 'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'instructions' => 'array',
            'nutrition' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}