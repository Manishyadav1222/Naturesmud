<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // High-performance composite B-Tree indexes for all sorting and filter paths
            $table->index(['is_active', 'sold_count'], 'idx_products_active_sold_count');
            $table->index(['is_active', 'price'], 'idx_products_active_price');
            $table->index(['is_active', 'rating_avg'], 'idx_products_active_rating');
            $table->index(['is_active', 'created_at'], 'idx_products_active_created');
            $table->index(['is_active', 'views_count'], 'idx_products_active_views');
            $table->index(['category_id', 'is_active', 'sold_count'], 'idx_products_cat_active_sold');
            $table->index(['category_id', 'is_active', 'price'], 'idx_products_cat_active_price');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index(['created_at'], 'idx_orders_created_at');
            $table->index(['status', 'created_at'], 'idx_orders_status_created');
            $table->index(['payment_status', 'created_at'], 'idx_orders_paystatus_created');
            $table->index(['user_id', 'created_at'], 'idx_orders_user_created');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_active_sold_count');
            $table->dropIndex('idx_products_active_price');
            $table->dropIndex('idx_products_active_rating');
            $table->dropIndex('idx_products_active_created');
            $table->dropIndex('idx_products_active_views');
            $table->dropIndex('idx_products_cat_active_sold');
            $table->dropIndex('idx_products_cat_active_price');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_created_at');
            $table->dropIndex('idx_orders_status_created');
            $table->dropIndex('idx_orders_paystatus_created');
            $table->dropIndex('idx_orders_user_created');
        });
    }
};
