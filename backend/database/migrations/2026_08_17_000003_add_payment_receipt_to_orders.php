<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'receipt_image')) {
                $table->text('receipt_image')->nullable()->after('notes');
            }
            if (!Schema::hasColumn('orders', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('receipt_image');
            }
            if (!Schema::hasColumn('orders', 'is_valley')) {
                $table->boolean('is_valley')->default(true)->after('payment_reference');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['receipt_image', 'payment_reference', 'is_valley']);
        });
    }
};
