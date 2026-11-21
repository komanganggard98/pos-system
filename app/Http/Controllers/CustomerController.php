<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\CustomerService;

class CustomerController extends Controller
{

    public function __construct(
        protected CustomerService $customerService
    ){

    }

    public function index(Request $request)
    {
        $customers = $this->customerService->getData($request, true, 'id', 'desc');
        return Inertia::render('customers/index', compact('customers'));
    }

    public function list(Request $request)
    {
        $request->merge(['limit' => 5]);
        $customers = $this->customerService->getData($request, false, 'name');
        return response()->json(['data' => $customers], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:customers,phone',
            'email' => 'nullable|email|unique:customers,email',
        ]);

        $customer = Customer::create($validated);
        
        if ($request->expectsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Customer created successfully',
                'data' => $customer
            ], 201);
        }

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:customers,phone,' . $customer->id,
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
        ]);

        $customer->update($validated);
        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
