<?php

namespace App\Services;
use App\Models\Discount;
use Illuminate\Support\Facades\{DB};

class DiscountService {

    public function getData($request = [], $isPaginate = false, $orderBy = 'id', $orderType = 'asc'){
        $search = $request['search'] ?? null;
        $withProduct = $request['with_product'] ?? false;
        $withProductCount = $request['with_product_count'] ?? false;
        $isActive = isset($request['is_active']) ? $request['is_active'] : null;

        $discounts = Discount::query()
        ->when($search, function($q) use($search){
            $q->where('name','like', "%$search%");
        })
        ->when($withProduct, function($q){
            $q->withProduct();
        })
        ->when($withProductCount, function($q){
            $q->withProductCount();
        })
        ->when($isActive != null, function($q){
            $q->activated();
        })
        ->orderBy($orderBy, $orderType)
        ->when($isPaginate, fn($q) => $q->paginate(config('app.data_per_page')), fn ($q) => $q->get());
    
        return $discounts;
    }

    public function store($validated){
        DB::transaction(function () use ($validated) {
            $discount = Discount::create($validated);
            $discount->products()->sync($validated['product_ids']);
        });
    }

    public function update($discount, $validated){
        DB::transaction(function () use ($discount, $validated) {
            $discount->update($validated);
            $discount->products()->sync($validated['product_ids']);
        });
    }

}