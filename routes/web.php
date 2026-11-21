<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    CustomerController,
    DiscountController,
    OrderController,
    PaymentController,
    ProductController,
    PosController,
    UserController,
    DashboardController
};

Route::inertia('/', 'welcome')->middleware('redirect.role.home')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Halaman Dashboard khusus Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    Route::resource('products', ProductController::class);
    Route::prefix('products')->as('products.')->group(function () {
        Route::get('/list', [ProductController::class, 'list'])->name('list');
    });

    Route::prefix('pos')->as('pos.')->middleware(['role:cashier'])->group(function () {
        Route::get('/', [PosController::class, 'index'])->name('index');
    });

    Route::prefix('payments')->as('payments.')->group(function () {
        Route::post('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
    });

    Route::resource('discounts', DiscountController::class);

    Route::prefix('customers')->as('customers.')->group(function(){
        Route::get('/index', [CustomerController::class, 'index'])->name('index');
        Route::get('/list', [CustomerController::class, 'list'])->name('list');
        Route::post('/', [CustomerController::class, 'store'])->name('store');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('orders')->as('orders.')->group(function(){
        Route::get('/', [OrderController::class, 'index'])->name('index');
    });
    
    Route::resource('users', UserController::class);
});


require __DIR__.'/settings.php';
