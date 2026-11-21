<?php

namespace App\Services;
use App\Models\Product;
use Illuminate\Support\Facades\{Storage, DB};

class ProductService {

    public function getData($request = [], $isPaginate = false, $orderBy = 'id', $orderType = 'asc'){
        $search = $request['search'] ?? null;
        $limit = $request['limit'] ?? null;
        $withOrderCount = $request['with_order_count'] ?? false;
        $isActive = isset($request['is_active']) ? $request['is_active'] : null;

        $products = Product::query()
        ->when($search, function($q) use($search){
            $q
            ->where('name','like',"%$search%")
            ->orWhere('sku','like',"%$search%" );
        })
        ->when($withOrderCount, function($q){
            $q->withOrderCount();
        })
        ->when($isActive != null, function($q){
            $q->activated();
        })
        ->orderBy($orderBy, $orderType)
        ->when($limit !== null, function($q) use($limit){
            $q->limit($limit);
        })
        ->when($isPaginate, fn($q) => $q->paginate(config('app.data_per_page')), fn ($q) => $q->get());
    
        return $products;
    }

    public function store($request, $validated){
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        DB::transaction(function () use ($validated) {
            $product = Product::create($validated);
            $product->discounts()->sync($validated['discounts'] ?? []); // Sync discounts if provided
        });
    }

    public function update($product, $request, $validated){
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        DB::transaction(function () use ($product, $validated) {
            $product->update($validated);
            $product->discounts()->sync($validated['discounts'] ?? []);
        });
    }

}