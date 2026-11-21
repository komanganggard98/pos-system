<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('discount_id')->nullable()->constrained('discounts')->restrictOnDelete();
            $table->integer('quantity');
            $table->decimal('price_before_discount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_before_discount', 15, 2);
            $table->decimal('total_after_discount', 15, 2);
            $table->string('snapshot_product_name');
            $table->json('snapshot_discount_details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_products');
    }
};
