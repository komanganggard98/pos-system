<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderProduct extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'discount_id',
        'quantity',
        'price_before_discount',
        'discount_amount',
        'total_before_discount',
        'total_after_discount',
        'snapshot_product_name',
        'snapshot_discount_details',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_before_discount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_before_discount' => 'decimal:2',
        'total_after_discount' => 'decimal:2',
        'snapshot_discount_details' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function discount(): BelongsTo
    {
        return $this->belongsTo(Discount::class)->withTrashed();
    }
}
