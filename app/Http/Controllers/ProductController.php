<?php

namespace App\Http\Controllers;

use App\Models\{Product};
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ){}

    public function index(Request $request)
    {
        $request->merge(['with_order_count' => true]);
        $products = $this->productService->getData($request, true, 'id', 'desc');
        return Inertia::render('products/index', [
            'products' => $products,
            'filter' => $request->search
        ]);
    }

    public function list(Request $request){
        $request->merge(['limit' => 5, 'is_active' => true]);
        $products = $this->productService->getData($request, false, 'id', 'desc');
        return response()->json(['products' => $products]);
    }

    public function create()
    {
        return Inertia::render('products/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|unique:products,sku',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_active' => 'boolean',
            'discounts' => 'nullable|array',
            'discounts.*' => 'exists:discounts,id', // Validate each discount ID
        ]);

        $this->productService->store($request, $validated);
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load('discounts');
        return Inertia::render('products/edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_active' => 'boolean',
            'discounts' => 'nullable|array',
            'discounts.*' => 'exists:discounts,id',
        ]);

        $this->productService->update($product, $request, $validated);
        return redirect()->route('products.index')->with(['message' => 'Product updated successfully']);
    }

    public function destroy(Product $product)
    {
        // Menggunakan Soft Delete sehingga riwayat order tetap aman
        $product->delete();
        return redirect()->route('products.index')->with(['message' => 'Product deactivated/deleted successfully']);
    }
}
