<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\{OrderService, UserService};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected UserService $userService
    ){
        
    }

    public function index(Request $request): Response
    {
        $filters = [
            'cashiers_id' => $request->input('cashiers_id', ''),
            'status'      => $request->input('status', ''),
            'start_date'  => $request->input('start_date', ''),
            'end_date'    => $request->input('end_date', ''),
        ];

        $payload = array_merge($filters ,['only_query' => true]);
        $ordersQuery = $this->orderService->getData($payload, false, 'id','desc');
        $summarySource = (clone $ordersQuery);

        $stats = [
            'total_revenue' => (float) (clone $summarySource)->sum('total_amount'),
            'total_orders'  => (int) (clone $summarySource)->count(),
            'total_discount'=> (float) (clone $summarySource)->sum('discount_amount'),
            'low_stock_count'=> (int) Product::query()
                ->where('is_active', true)
                ->where('stock', '<=', 10)
                ->count(),
        ];

        $orders = $ordersQuery->paginate(10)->withQueryString();
        $cashiers = $this->userService->getData(['role' => 'cashier', false,'name']);

        return Inertia::render('dashboard', [
            'stats'    => $stats,
            'orders'   => $orders,
            'cashiers' => $cashiers,
            'filters'  => $filters,
        ]);
    }
}