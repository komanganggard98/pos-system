<?php

namespace App\Http\Controllers;

use App\Services\{
    ProductService,
    DiscountService,
};
use Inertia\Inertia;
use Illuminate\Http\Request;

class PosController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected DiscountService $discountService,
    )
    {}

    public function index(Request $request)
    {   
        $products = $this->productService->getData(['is_active' => true, 'search' => $request['product'] ?? null], true, 'name');
        $discounts = $this->discountService->getData(['is_active' => true, 'with_product' => true], false, 'id','desc');

        return Inertia::render('pos/index', [
            'products' => $products,
            'discounts' => $discounts,
            'filter' => $request->search,
            'status' => session('status')
        ]);
    }
}
