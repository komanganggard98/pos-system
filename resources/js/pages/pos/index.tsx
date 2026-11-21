import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Search,
    Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CalculationType, PosProps, Product } from '@/types';
import { useLiveSearch } from '@/hooks/use-live-search';
import { index } from '@/routes/pos';
import { CustomPagination } from '@/components/custom-pagination';
import { CartItem } from '@/types/cart';
import ShoppingCartForm from '@/components/pos/shopping-cart-form';
import ModalPayment from '@/components/pos/modal-payment';
import { formatRupiah } from '@/lib/utils';
import { checkout } from '@/routes/payments';

export default function Index({ products, discounts = [], filter = '' }: PosProps) {
    // State Pencarian & Keranjang
    const {search, setSearch} = useLiveSearch({
        paramName:'product',
        initialValue:filter,
        url:index.url(),
        only:['products'],
    })

    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [selectedDiscountId, setSelectedDiscountId] = useState<string>('');

    // State Products
    const { current_page, last_page, from, to, total } = products;
    const visitPage = (page: number) => {
        router.get(index(), { page }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only:['products'],
        });
    }
    
    // State Modal Checkout & Pembayaran
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [cashReceived, setCashReceived] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Tambah Produk ke Keranjang
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;

        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert(`Stok maksimal untuk ${product.name} hanya ${product.stock}.`);
                    return prev;
                }
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // Kalkulasi Subtotal, Validasi Diskon Bersyarat, & Total Akhir
    const calculation:CalculationType = useMemo(() => {
        const subtotal = cart.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
        );

        let discountAmount = 0;
        let discountWarning: string | null = null;

        if (selectedDiscountId) {
            const discount = discounts.find((d) => d.id === Number(selectedDiscountId));
            if (discount) {
                const eligibleIds = (discount.products ?? []).map((p) => p.id);
                const eligibleItems = cart.filter((item) =>
                    eligibleIds.includes(item.product.id)
                );

                if (subtotal <= Number(discount.min_amount)) {
                    discountWarning = `Minimal total belanja harus lebih dari ${formatRupiah(Number(discount.min_amount))}`;
                } else if (eligibleItems.length === 0) {
                    discountWarning = `Tidak ada produk yang termasuk dalam promo "${discount.name}"`;
                } else {
                    eligibleItems.forEach((item) => {
                        const lineTotal = Number(item.product.price) * item.quantity;
                        if (discount.type === 'percentage') {
                            discountAmount += lineTotal * (Number(discount.value) / 100);
                        } else {
                            discountAmount += Math.min(lineTotal, Number(discount.value) * item.quantity);
                        }
                    });
                }
            }
        }

        const total = Math.max(0, subtotal - discountAmount);
        return { subtotal, discountAmount, total, discountWarning };
    }, [cart, selectedDiscountId, discounts]);

    // Hitung Kembalian Cash
    const cashChange:number = useMemo(() => {
        const received = Number(cashReceived) || 0;
        return Math.max(0, received - calculation.total);
    }, [cashReceived, calculation.total]);

    const handleContinueToPayment = () => {
        setCashReceived(String(calculation.total));
        setIsCheckoutOpen(true);
    }

    // Proses Submit Order & Pembayaran
    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0 || calculation.discountWarning) return;

        if (Number(cashReceived) < calculation.total) {
            alert('Uang tunai yang diterima kurang dari total tagihan.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            checkout.url(),
            {
                customer_id: selectedCustomerId || null,
                discount_id: selectedDiscountId || null,
                cash_received: Number(cashReceived),
                items: cart.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
            },
            {
                preserveScroll: true,
                onError: (validationErrors) => {
                    const messages = Object.values(validationErrors).filter(Boolean);
                    const firstMessage = messages[0] ? String(messages[0]) : "An error occurred while processing your checkout.";
                    alert(firstMessage)
                },
                onSuccess: () => {
                    setIsCheckoutOpen(false);
                    setCart([]);
                    setSelectedDiscountId("");
                    setSelectedCustomerId("");
                    setCashReceived("");
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <>
        <Head title="Point of Sale" />
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50 lg:flex-row dark:bg-neutral-950">
            {/* PANEL KIRI: Katalog Produk */}
            <div className="flex flex-1 flex-col overflow-hidden p-4 lg:p-6">
                {/* Header & Search Bar */}
                <div className={`relative mb-5 md:w-80`}>
                    <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}>
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
        
                    <Input
                        type="text"
                        placeholder="Cari nama produk atau SKU..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Grid Produk */}
                <div className="flex-1 overflow-y-auto pr-1">
                    {products.data.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center dark:border-neutral-800 dark:bg-neutral-900">
                            <Package className="h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                Produk tidak ditemukan
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 mb-5">
                                {products.data.map((product) => {
                                    const inCart = cart.find((c) => c.product.id === product.id);
                                    const isOutOfStock = product.stock <= 0;

                                    return (
                                        <button
                                            key={product.id}
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => addToCart(product)}
                                            className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition dark:bg-neutral-900 ${
                                                isOutOfStock
                                                    ? 'cursor-not-allowed border-gray-200 opacity-55 dark:border-neutral-800'
                                                    : 'border-gray-200 hover:border-primary hover:shadow-md dark:border-neutral-800'
                                            }`}
                                        >
                                            {/* Gambar Produk */}
                                            <div className="relative aspect-square w-full bg-gray-100 dark:bg-neutral-800">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                        <Package className="h-10 w-10" />
                                                    </div>
                                                )}

                                                {/* Badge Stok */}
                                                <span
                                                    className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-xs font-medium ${
                                                        isOutOfStock
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-black/65 text-white backdrop-blur-xs'
                                                    }`}
                                                >
                                                    {isOutOfStock ? 'Habis' : `Stok: ${product.stock}`}
                                                </span>

                                                {/* Badge Jumlah di Keranjang */}
                                                {inCart && (
                                                    <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow">
                                                        {inCart.quantity}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info Produk */}
                                            <div className="flex flex-1 flex-col justify-between p-3">
                                                <div>
                                                    {product.sku && (
                                                        <span className="text-[11px] font-medium text-gray-400">
                                                            {product.sku}
                                                        </span>
                                                    )}
                                                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                        {product.name}
                                                    </h3>
                                                </div>
                                                <p className="mt-2 text-sm font-bold text-primary">
                                                    {formatRupiah(Number(product.price))}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {last_page > 1 && (
                                <CustomPagination 
                                    current_page={current_page}
                                    last_page={last_page}
                                    from={from}
                                    to={to}
                                    total={total}
                                    visitPage={visitPage}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* PANEL KANAN: Keranjang Belanja & Ringkasan */}
            <ShoppingCartForm 
                cart={cart}
                setCart={setCart}
                selectedDiscountId={selectedDiscountId}
                setSelectedDiscountId={setSelectedDiscountId}
                selectedCustomerId={selectedCustomerId}
                setSelectedCustomerId={setSelectedCustomerId}
                discounts={discounts}
                calculation={calculation}
                handleContinueToPayment={handleContinueToPayment}
            />

            {/* MODAL PEMBAYARAN (CHECKOUT) */}
            <ModalPayment 
                isCheckoutOpen={isCheckoutOpen}
                setIsCheckoutOpen={setIsCheckoutOpen}
                handleCheckoutSubmit={handleCheckoutSubmit}
                calculation={calculation}
                cashReceived={cashReceived}
                setCashReceived={setCashReceived}
                cashChange={cashChange}
                isSubmitting={isSubmitting}
            />

        </div>
        </>
    );
}

Index.layout = {
    breadcrumb: [
        {
            title: 'Point of Sale', 
        }
    ]
}
