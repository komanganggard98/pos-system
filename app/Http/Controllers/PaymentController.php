<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PaymentService;
use Illuminate\Validation\ValidationException;
use Throwable;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ){

    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_id'      => 'nullable|exists:customers,id',
            'discount_id'      => 'nullable|exists:discounts,id',
            'cash_received'    => 'required|numeric|min:0',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);

        try{
            $result = $this->paymentService->handleCheckout($validated);
        }catch (ValidationException $e) {
            // Mengembalikan error validasi ke Inertia / form dengan jelas
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (Throwable $th) {
            report($th);
            return redirect()->back()->withErrors([
                'checkout' => 'An error occurred while processing the transaction: ' . $th->getMessage(),
            ]);
        }

        return redirect()->back()->with(
            'success',
            'Cash transaction successful! Change: Rp ' . number_format($result['change'], 0, ',', '.')
        );
    }
}
