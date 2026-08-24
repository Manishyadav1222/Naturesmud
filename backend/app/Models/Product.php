<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'short_description',
        'price',
        'compare_at_price',
        'cost_price',
        'stock_quantity',
        'low_stock_threshold',
        'is_active',
        'is_featured',
        'is_best_seller',
        'is_new',
        'weight',
        'unit',
        'images',
        'ingredients',
        'nutrition_facts',
        'benefits',
        'usage_instructions',
        'storage_instructions',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'rating_avg',
        'rating_count',
        'views_count',
        'sold_count',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_new' => 'boolean',
            'images' => 'array',
            'ingredients' => 'array',
            'nutrition_facts' => 'array',
            'benefits' => 'array',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'category' => $this->category?->name,
        ];
    }

    protected $appends = ['image_url', 'images_list'];

    public function resolveRouteBinding($value, $field = null)
    {
        if (is_numeric($value)) {
            $product = $this->where('id', $value)->first();
            if ($product) return $product;
        }

        $product = $this->where('slug', $value)->first();
        if ($product) return $product;

        $product = $this->where('name', 'like', '%' . str_replace('-', ' ', $value) . '%')->first();
        if ($product) return $product;

        return $this->where('id', $value)->orWhere('slug', $value)->first();
    }

    public function getImageUrlAttribute(): string
    {
        // 1. Check if images JSON array exists in database
        if (!empty($this->images)) {
            $imgs = is_array($this->images) ? $this->images : json_decode($this->images, true);
            if (!empty($imgs[0])) {
                if (is_string($imgs[0]) && !empty($imgs[0])) {
                    return $imgs[0];
                }
                if (is_array($imgs[0])) {
                    $url = $imgs[0]['url'] ?? $imgs[0]['secure_url'] ?? $imgs[0]['path'] ?? null;
                    if ($url && is_string($url)) {
                        return $url;
                    }
                }
            }
        }

        // 2. Fallback to product slug image mapping
        $slugMap = [
            'dried-cranberries' => '/products/cranberries.jpg',
            'immunity-shield-superfood-mix' => '/products/superfood-mix.jpg',
            'organic-pumpkin-seeds' => '/products/pumpkin-seeds.jpg',
            'premium-roasted-almonds' => '/products/almonds.jpg',
            'himalayan-walnuts' => '/products/walnuts.jpg',
            'raw-himalayan-almonds' => '/products/raw-almonds.jpg',
            'mustard-seeds' => '/products/mustard-seeds.jpg',
            'chia-seeds' => '/products/chia-seeds.jpg',
            'yarsagumba-powder' => '/products/yarsagumba.jpg',
            'raw-honey' => '/products/honey.jpg',
            'turmeric-powder' => '/products/turmeric.jpg',
            'ginger-powder' => '/products/ginger.jpg',
            'dried-apricots' => '/products/apricots.jpg',
            'dried-apples' => '/products/apples.jpg',
            'flaxseed-crackers' => '/products/flaxseed.jpg',
            'himalayan-trail-mix' => '/products/trail-mix.jpg',
            'dried-blueberries' => '/products/blueberries.jpg',
            'beetroot-powder' => '/products/beetroot.jpg',
            'dates-powder' => '/products/dates.jpg',
            'dehydrated-apple' => '/products/dehydrated-apple.jpg',
            'premium-coconut-oil' => '/products/coconut-oil.jpg',
            'dehydrated-papaya' => '/products/papaya.jpg',
            'himalayan-pink-salt' => '/products/pink-salt.jpg',
        ];

        return $slugMap[$this->slug] ?? "/products/{$this->slug}.jpg";
    }

    public function getImagesListAttribute(): array
    {
        if (!empty($this->images)) {
            $imgs = is_array($this->images) ? $this->images : json_decode($this->images, true);
            if (!empty($imgs) && is_array($imgs)) {
                $list = [];
                foreach ($imgs as $img) {
                    if (is_string($img) && !empty($img)) {
                        $list[] = $img;
                    } elseif (is_array($img)) {
                        $url = $img['url'] ?? $img['secure_url'] ?? $img['path'] ?? null;
                        if ($url && is_string($url)) {
                            $list[] = $url;
                        }
                    }
                }
                if (!empty($list)) {
                    return $list;
                }
            }
        }

        return [$this->image_url];
    }
}