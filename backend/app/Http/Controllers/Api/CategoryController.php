<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Cache::remember('categories_active_v1', 300, function () {
            return Category::withCount('products')->where('is_active', true)->orderBy('sort_order')->get();
        });

        return response()->json($categories);
    }

    public function show(Category $category)
    {
        return response()->json(
            $category->load('products')
        );
    }
}