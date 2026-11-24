<?php

namespace App\Http\Controllers;

use App\Services\{OrderService, UserService};
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected UserService $userService
    ){

    }
    public function index(Request $request)
    {
        $orders = $this->orderService->getData($request, true, 'id','desc');
        $cashiers = $this->userService->getData(['role' => 'cashier'], false, 'name');
        
        return Inertia::render('orders/index', [
            'orders' => $orders,
            'cashiers' => $cashiers,
            'filters' => (object)[
                'cashiers_id' => $request->cashiers_id ?? '',
                'status' => $request->status ?? '',
                'start_date' => $request->start_date ?? '',
                'end_date' => $request->end_date ?? '',
            ]
        ]);

    }
}
