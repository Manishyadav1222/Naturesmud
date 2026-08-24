<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReelController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public
    Route::get('banners', [ContentController::class, 'banners']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/related/{product}', [ProductController::class, 'related']);
    Route::get('products/{product}', [ProductController::class, 'show']);
    
    Route::get('debug/{product}', function ($product) {
        $model = new \App\Models\Product;
        $result = $model->resolveRouteBinding($product);
        return response()->json([
            'param' => $product,
            'result' => $result
        ]);
    });
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);
    Route::get('blogs', [ContentController::class, 'blogPosts']);
    Route::get('blogs/{post}', [ContentController::class, 'blogPost']);
    Route::get('recipes', [ContentController::class, 'recipes']);
    Route::get('recipes/{recipe}', [ContentController::class, 'recipe']);
    Route::get('pages/{slug}', [ContentController::class, 'page']);
    Route::get('reels', [ReelController::class, 'index']);

    Route::post('newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::post('newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
    Route::post('orders/track', [OrderController::class, 'track']);

    // Auth
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    // Public order placement & status checks (guest checkout supported)
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{orderNumber}/status', [OrderController::class, 'status']);
    Route::get('orders/lookup/{orderNumber}', [OrderController::class, 'lookup']);

    // Authenticated
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('me', [AuthController::class, 'updateProfile']);

        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('orders/{orderNumber}/cancel', [OrderController::class, 'cancel']);

        Route::get('wishlist', [WishlistController::class, 'index']);
        Route::post('wishlist', [WishlistController::class, 'store']);
        Route::delete('wishlist/{product}', [WishlistController::class, 'destroy']);
    });
});
