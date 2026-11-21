<?php

namespace App\Services;
use App\Models\Order;

class OrderService {

    public function getData($request = [], bool $isPaginate = false, string $orderBy = 'id', string $orderType = 'asc')
    {
        $cashiersId  = $request['cashiers_id'] ?? null;
        $startDate   = $request['start_date'] ?? null;
        $endDate     = $request['end_date'] ?? null;
        $status      = $request['status'] ?? null;
        $onlyQuery    = $request['only_query'] ?? null;

        // Whitelist kolom sorting untuk mencegah SQL Injection
        $allowedOrderBy   = ['id', 'invoice_number', 'subtotal', 'discount_amount', 'total_amount', 'status', 'paid_at', 'created_at'];
        $safeOrderBy      = in_array($orderBy, $allowedOrderBy) ? $orderBy : 'id';
        $safeOrderType    = strtolower($orderType) === 'desc' ? 'desc' : 'asc';

        $query = Order::query()
            ->with(['customer:id,name,phone', 'cashier:id,name', 'payments', 'orderProducts'])
            // Filter Kasir
            ->when($cashiersId, function ($q) use ($cashiersId) {
                $q->whereIn('created_by', (array) $cashiersId);
            })
            // Filter Status Order ('pending', 'paid', 'cancelled')
            ->when($status, function ($q) use ($status) {
                $q->whereIn('status', (array) $status);
            })
            // Filter Rentang Tanggal Transaksi
            ->when($startDate, function ($q) use ($startDate) {
                $q->whereDate('created_at', '>=', $startDate);
            })
            ->when($endDate, function ($q) use ($endDate) {
                $q->whereDate('created_at', '<=', $endDate);
            })
            ->orderBy($safeOrderBy, $safeOrderType);

        if($onlyQuery){
            return $query;
        }

        if ($isPaginate) {
            return $query->paginate(config('app.data_per_page', 15))->withQueryString();
        }

        return $query->get();
    }

}