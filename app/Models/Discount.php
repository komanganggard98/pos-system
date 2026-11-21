<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'min_amount',
        'value',
        'type',
        'is_active',
    ];

    protected $casts = [
        'min_amount' => 'decimal:2',
        'value' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function scopeWithProduct($query){
        return $query->with('products:id,name,sku');
    }

    public function scopeWithProductCount($query){
        return $query->withCount('products');
    }

    public function scopeActivated($query){
        return $query->where('is_active', true);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'discount_products');
    }

    public function orderProducts(): HasMany
    {
        return $this->hasMany(OrderProduct::class);
    }
}
