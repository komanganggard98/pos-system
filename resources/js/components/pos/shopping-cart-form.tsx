import { formatRupiah } from "@/lib/utils";
import { Customer, ShoppingCartFormType } from "@/types";
import { CartItem } from "@/types/cart";
import { AlertCircle, ChevronDown, ChevronUp, CreditCard, Minus, Plus, ShoppingCart, Tag, Trash2, User } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import CustomerSelector from "./customer-selector";


export default function ShoppingCartForm({
    cart,
    setCart,
    selectedDiscountId,
    selectedCustomerId,
    setSelectedDiscountId,
    setSelectedCustomerId,
    discounts,
    calculation,
    handleContinueToPayment
}: ShoppingCartFormType){
    const [show, setShow] = useState<boolean>(true)
    // Ubah Kuantitas Item
    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === productId) {
                        const newQty = item.quantity + delta;
                        if (newQty > item.product.stock) {
                            alert(`Stok maksimal hanya ${item.product.stock}.`);
                            return item;
                        }
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    // Hapus Item dari Keranjang
    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    return(
        <div className={`flex w-full flex-col border-t border-gray-200 bg-white lg:w-[400px] lg:border-l xl:w-[440px] dark:border-neutral-800 dark:bg-neutral-900 ${!show ? 'lg:fixed bottom-0 right-0' : 'lg:border-t-0'}`}>

            <Button onClick={() => setShow(!show)} type="button" variant={`ghost`} size={`sm`} className="flex justify-center w-full border-b rounded-none">
                {!show ? <ChevronUp className="h-14" /> : <ChevronDown className="h-15"/>}
            </Button>

            {!show && (
                <div className="flex justify-between py-4 px-2 gap-2">
                    <div className="flex items-centre gap-2">
                        <ShoppingCart className=""/> <span>Cart</span> <span className="rounded-2xl flex items-center justify-center w-6 h-6 text-xs bg-primary text-white dark:text-black">{cart.length}</span>
                    </div>
                    <p className="font-semibold text-lg">{formatRupiah(calculation.total)}</p>
                </div>
            )}

            {show && (
                <>
                    {/* Header Keranjang */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                Cart
                            </h2>
                        </div>
                        {cart.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setCart([])}
                                className="text-xs font-medium text-red-600 hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Pilihan Customer & Promo Diskon */}
                    <div className="space-y-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                        {/* Customer Select */}
                        <CustomerSelector 
                            selectedCustomerId={selectedCustomerId}
                            onSelect={(val:string) => setSelectedCustomerId(val)}
                        />

                        {/* Discount Select */}
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 shrink-0 text-gray-400" />
                            <select
                                value={selectedDiscountId}
                                onChange={(e) => setSelectedDiscountId(e.target.value)}
                                className="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200"
                            >
                                <option value="">-- Without discount promo --</option>
                                {discounts.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name} ({d.type === 'percentage' ? `${+d.value}%` : formatRupiah(Number(d.value))} - Min. &gt;{formatRupiah(Number(d.min_amount))})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Peringatan Validasi Syarat Diskon */}
                        {calculation.discountWarning && (
                            <div className="flex items-start gap-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{calculation.discountWarning}</span>
                            </div>
                        )}
                    </div>


            
                    {/* Daftar Item Keranjang */}
                    <div className="flex-1 overflow-y-auto px-5 py-3">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center py-10 text-center text-gray-400">
                                <ShoppingCart className="mb-2 h-10 w-10 opacity-40" />
                                <p className="text-sm">Add items to cart</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                                {cart.map((item) => {
                                    let price_after_discount = null
                                    if(discounts.length > 0 && selectedDiscountId){
                                        const discount = discounts.find((d) => +d.id === +selectedDiscountId)
                                        if(discount){
                                            const eligibleIds = (discount.products ?? []).map((p) => p.id);
                                            if(eligibleIds.includes(item.product.id)){
                                                const lineTotal = Number(item.product.price) * item.quantity;
                                                let total_discount = 0
                                                if (discount.type === 'percentage') {
                                                    total_discount = lineTotal * (Number(discount.value) / 100);
                                                } else {
                                                    total_discount = Math.min(lineTotal, Number(discount.value) * item.quantity);
                                                }

                                                price_after_discount = lineTotal - total_discount
                                            }
                                            
                                        }
                                    }

                                    return(
                                    <div key={item.product.id} className="flex items-center justify-between gap-3 py-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatRupiah(Number(item.product.price))}
                                            </p>
                                            <hr />
                                            <p className={`text-xs text-gray-500 ${price_after_discount !== null ? 'line-through' : ''}`}>
                                                {formatRupiah(Number(item.product.price) * item.quantity)}
                                            </p>

                                            {(price_after_discount !== null) && (
                                                <p className="text-xs text-gray-500">
                                                    {formatRupiah(Number(price_after_discount))}
                                                </p>
                                            )}
                                        </div>

                                        {/* Kontrol Kuantitas */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )
                                }
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ringkasan Total & Tombol Checkout */}
                    <div className="border-t border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>{formatRupiah(calculation.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600">
                                <span>Discount</span>
                                <span>- {formatRupiah(calculation.discountAmount)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900 dark:border-neutral-800 dark:text-white">
                                <span>Total Payment</span>
                                <span className="text-primary">{formatRupiah(calculation.total)}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={cart.length === 0 || Boolean(calculation.discountWarning)}
                            onClick={() => handleContinueToPayment()}
                            className="mt-4 h-11 w-full text-base font-semibold"
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}