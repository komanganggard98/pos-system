<?php

namespace App\Services;
use App\Models\{Payment, Order, Product, Discount};
use Illuminate\Support\Facades\{DB, Auth};
use Illuminate\Support\{Str};
use Illuminate\Validation\ValidationException;

class PaymentService {

    public function handleCheckout($validated)
    {
        return DB::transaction(function () use ($validated) {
            $subtotalOrder = 0;
            $preparedItems = [];

            // Kunci baris produk (lockForUpdate) agar stok aman dari transaksi bersamaan
            foreach ($validated['items'] as $itemInput) {
                $product = Product::lockForUpdate()->findOrFail($itemInput['product_id']);

                if (!$product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => "Product {$product->name} is currently inactive.",
                    ]);
                }

                if ($product->stock < $itemInput['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for {$product->name} ({$product->stock} remaining).",
                    ]);
                }

                $lineTotalBefore = $product->price * $itemInput['quantity'];
                $subtotalOrder += $lineTotalBefore;

                $preparedItems[] = [
                    'product'      => $product,
                    'quantity'     => $itemInput['quantity'],
                    'price_before' => $product->price,
                    'total_before' => $lineTotalBefore,
                ];
            }

            // Validasi Syarat Promo Diskon (> 1 juta & produk tertentu)
            $discount = null;
            $eligibleProductIds = [];

            if (!empty($validated['discount_id'])) {
                $discount = Discount::with('products:id')
                    ->where('is_active', true)
                    ->find($validated['discount_id']);

                if (!$discount) {
                    throw ValidationException::withMessages([
                        'discount_id' => 'This promotion could not be found or is no longer available.',
                    ]);
                    
                }

                if ($subtotalOrder <= $discount->min_amount) {
                    throw ValidationException::withMessages([
                        'discount_id' => 'Total purchase does not meet the minimum promo requirement (> Rp ' . number_format($discount->min_amount, 0, ',', '.') . ').',
                    ]);
                    
                }

                $eligibleProductIds = $discount->products->pluck('id')->toArray();
            }

            // Buat Header Transaksi (orders)
            $invoiceNumber = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

            $order = Order::create([
                'invoice_number'  => $invoiceNumber,
                'customer_id'     => $validated['customer_id'] ?? null,
                'created_by'      => Auth::id(),
                'subtotal'        => $subtotalOrder,
                'discount_amount' => 0,
                'total_amount'    => $subtotalOrder,
                'status'          => 'pending',
            ]);

            $totalDiscountOrder = 0;
            $hasEligibleItem = false;

            // 4. Simpan Snapshot ke order_products & Kurangi Stok
            foreach ($preparedItems as $item) {
                $product = $item['product'];
                $lineDiscount = 0;
                $appliedDiscountId = null;
                $snapshotDiscount = null;

                if ($discount && in_array($product->id, $eligibleProductIds)) {
                    $hasEligibleItem = true;
                    $appliedDiscountId = $discount->id;

                    if ($discount->type === 'percentage') {
                        $lineDiscount = $item['total_before'] * ($discount->value / 100);
                    } else {
                        $lineDiscount = min($item['total_before'], $discount->value * $item['quantity']);
                    }

                    $snapshotDiscount = [
                        'id'         => $discount->id,
                        'name'       => $discount->name,
                        'type'       => $discount->type,
                        'value'      => $discount->value,
                        'min_amount' => $discount->min_amount,
                    ];
                }

                $lineTotalAfter = $item['total_before'] - $lineDiscount;
                $totalDiscountOrder += $lineDiscount;

                $order->orderProducts()->create([
                    'product_id'                => $product->id,
                    'discount_id'               => $appliedDiscountId,
                    'quantity'                  => $item['quantity'],
                    'price_before_discount'     => $item['price_before'],
                    'discount_amount'           => $lineDiscount,
                    'total_before_discount'     => $item['total_before'],
                    'total_after_discount'      => $lineTotalAfter,
                    'snapshot_product_name'     => $product->name,
                    'snapshot_discount_details' => $snapshotDiscount,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            if ($discount && !$hasEligibleItem) {
                throw ValidationException::withMessages([
                    'discount_id' => 'No products in the cart are eligible for this promo.',
                ]);
                
            }

            $finalTotal = max(0, $subtotalOrder - $totalDiscountOrder);
            $order->update([
                'discount_amount' => $totalDiscountOrder,
                'total_amount'    => $finalTotal,
            ]);

            // 5. Proses Pembayaran 
            $cashReceived = (float) $validated['cash_received'];

            if ($cashReceived < $finalTotal) {
                throw ValidationException::withMessages([
                    'cash_received' => 'Cash received is less than the total amount.',
                ]);
                
            }

            $paidAt = now();
            $order->payments()->create([
                'amount'        => $finalTotal,
                'cash_received' => $cashReceived,
                'cash_change'   => $cashReceived - $finalTotal,
                'status'        => 'paid',
                'paid_at'       => $paidAt,
            ]);

            $order->update([
                'status'  => 'paid',
                'paid_at' => $paidAt,
            ]);

            return [
                'change' => $cashReceived - $finalTotal,
            ];

        });

    }

}