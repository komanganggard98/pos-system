<?php

namespace App\Services;
use App\Models\Customer;

class CustomerService {

    public function getData($request = [], $isPaginate = false, $orderBy = 'id', $orderType = 'asc'){
        $search = $request['search'] ?? null;

        $customers = Customer::query()
        ->when($search, function($q) use($search){
            $q
            ->where('name','like', "%$search%")
            ->orWhere('phone', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
        })
        ->orderBy($orderBy, $orderType)
        ->when($isPaginate, fn($q) => $q->paginate(config('app.data_per_page')), fn ($q) => $q->get());
    
        return $customers;
    }

}