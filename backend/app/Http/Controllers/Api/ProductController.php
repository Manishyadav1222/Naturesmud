<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'products_v1_' . md5(serialize($request->all()));
        
        $products = Cache::remember($cacheKey, 10, function () use ($request) {
            return Product::query()
                ->select([
                    'id', 'category_id', 'name', 'slug', 'sku', 'short_description',
                    'price', 'compare_at_price', 'stock_quantity', 'is_active',
                    'is_featured', 'is_best_seller', 'is_new', 'weight', 'unit',
                    'rating_avg', 'rating_count', 'views_count', 'sold_count',
                    'images', 'created_at'
                ])
                ->with('category:id,name,slug')
                ->when($request->category, fn ($q) => $q->whereHas('category', fn ($q) => $q->where('slug', $request->category)))
                ->when($request->q, fn ($q) => $q->where('name', 'like', "%{$request->q}%"))
                ->when($request->featured, fn ($q) => $q->where('is_featured', true))
                ->when($request->best_seller, fn ($q) => $q->where('is_best_seller', true))
                ->when($request->sort, function ($q) use ($request) {
                    match ($request->sort) {
                        'price_asc' => $q->orderBy('price'),
                        'price_desc' => $q->orderByDesc('price'),
                        'rating' => $q->orderByDesc('rating_avg'),
                        'newest' => $q->orderByDesc('created_at'),
                        default => $q->orderByDesc('sold_count'),
                    };
                }, fn ($q) => $q->orderByDesc('sold_count'))
                ->where('is_active', true)
                ->paginate($request->per_page ?? 40);
        });

        return response()->json($products);
    }

    public function show($product)
    {
        $item = $product instanceof Product 
            ? $product 
            : (is_numeric($product)
                ? Product::where('id', $product)->first()
                : Product::where('slug', $product)->first());

        if (!$item && !($product instanceof Product)) {
            $item = Product::where('id', (string)$product)->orWhere('slug', (string)$product)->first();
        }

        if (!$item) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $item->load('category:id,name,slug', 'reviews.user:id,name,avatar');
        $item->increment('views_count');

        return response()->json($item);
    }

    public function related($product)
    {
        $item = $product instanceof Product 
            ? $product 
            : (is_numeric($product)
                ? Product::where('id', $product)->first()
                : Product::where('slug', $product)->first());

        if (!$item && !($product instanceof Product)) {
            $item = Product::where('id', (string)$product)->orWhere('slug', (string)$product)->first();
        }

        if (!$item) {
            return response()->json([]);
        }

        $cacheKey = "related_prod_{$item->category_id}_{$item->id}";
        
        $related = Cache::remember($cacheKey, 30, function () use ($item) {
            return Product::where('category_id', $item->category_id)
                ->where('id', '!=', $item->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->take(4)
                ->get();
        });

        return response()->json($related);
    }
}