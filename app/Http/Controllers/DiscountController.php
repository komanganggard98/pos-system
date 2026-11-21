<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\{DiscountService, ProductService};
class DiscountController extends Controller
{
    public function __construct(
        protected DiscountService $discountService,
        protected ProductService $productService,
    )
    {}

    public function index(Request $request)
    {
        $request->merge(['with_product' => true]);
        $discounts = $this->discountService->getData($request, true, 'id', 'desc');
        return Inertia::render('discounts/index', [
            'discounts' => $discounts,
            'filter' => $request->search
        ]);
    }

    public function create(Request $request)
    {
        $request->merge(['limit' => 5, 'is_active' => true]);
        $products = $this->productService->getData($request, false, 'id', 'desc');
        return Inertia::render('discounts/create',compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'min_amount' => 'required|numeric|min:0',
            'value' => 'required|numeric|min:0',
            'type' => 'required|in:price,percentage',
            'is_active' => 'boolean',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ]);

        $this->discountService->store($validated);
        return redirect()->route('discounts.index')->with('success', 'Promo created successfully.');
    }

    public function edit(Discount $discount, Request $request)
    {
        $discount->load('products:id,name,sku');
        $request->merge(['limit' => 5, 'is_active' => true]);
        $products = $this->productService->getData($request, false, 'id', 'desc');
        return Inertia::render('discounts/edit', [
            'discount' => $discount,
            'products' => $products,
        ]);
    }
    
    public function update(Request $request, Discount $discount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'min_amount' => 'required|numeric|min:0',
            'value' => 'required|numeric|min:0',
            'type' => 'required|in:price,percentage',
            'is_active' => 'boolean',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ]);

        $this->discountService->update($discount, $validated);
        return redirect()->route('discounts.index')->with('success', 'Promo updated successfully.');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete(); // Soft Delete
        return redirect()->route('discounts.index')->with('success', 'Promo deleted successfully.');
    }
}
