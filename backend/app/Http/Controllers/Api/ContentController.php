<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\BlogPost;
use App\Models\Page;
use App\Models\Recipe;

class ContentController extends Controller
{
    public function banners()
    {
        return response()->json(
            Banner::where('is_active', true)->orderBy('sort_order')->get()
        );
    }

    public function blogPosts(\Illuminate\Http\Request $request)
    {
        return response()->json(
            BlogPost::where('is_published', true)
                ->when($request->category, fn ($q) => $q->where('category', $request->category))
                ->latest('published_at')
                ->paginate($request->per_page ?? 12)
        );
    }

    public function blogPost(BlogPost $post)
    {
        abort_unless($post->is_published, 404);
        $post->increment('views_count');

        return response()->json($post);
    }

    public function recipes(\Illuminate\Http\Request $request)
    {
        return response()->json(
            Recipe::where('is_published', true)
                ->when($request->category, fn ($q) => $q->where('category', $request->category))
                ->latest()
                ->paginate($request->per_page ?? 12)
        );
    }

    public function recipe(Recipe $recipe)
    {
        abort_unless($recipe->is_published, 404);

        return response()->json($recipe);
    }

    public function page(string $slug)
    {
        $page = Page::where('slug', $slug)->where('is_published', true)->firstOrFail();

        return response()->json($page);
    }
}