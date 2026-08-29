<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->string('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_new')->default(false);
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('unit')->default('g');
            $table->json('images')->nullable();
            $table->json('ingredients')->nullable();
            $table->json('nutrition_facts')->nullable();
            $table->json('benefits')->nullable();
            $table->text('usage_instructions')->nullable();
            $table->text('storage_instructions')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->integer('rating_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->integer('sold_count')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'is_featured']);
            $table->index(['is_active', 'is_best_seller']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};