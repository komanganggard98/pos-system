import { useState } from 'react';
import { Search, Check, Package, Info, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { useLiveSearch } from '@/hooks/use-live-search';
import { create } from '@/routes/discounts';
import { DiscountUpsertForm, Product } from '@/types';

interface Props {
    discount?:DiscountUpsertForm
    products: Product[];
    defaultSelectedIds?: number[];
    error?: string;
}

export default function DiscountProductSelector({
    discount,
    products,
    defaultSelectedIds = [],
    error,
}: Props) {

    const {search, setSearch} = useLiveSearch({
        url:create.url(),
        only:['products'],
    })

    const [selectedIds, setSelectedIds] = useState<number[]>(defaultSelectedIds);

    const formatRupiah = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const toggleProduct = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleAllFiltered = () => {
        const filteredIds = products.map((p) => p.id);
        const allSelected = filteredIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
        }
    };

    return (
        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Hidden inputs agar <Form> otomatis mengirim array product_ids[] */}
            {selectedIds.map((id) => (
                <input key={id} type="hidden" name="product_ids[]" value={id} />
            ))}

            {discount && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 mb-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Selected Products ({discount?.products?.length})
                            </h3>
                        </div>
                    </div>

                    {discount?.products?.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-4 text-center text-xs text-gray-500 dark:border-neutral-800 dark:bg-neutral-800/30">
                            No products selected yet. Select products from the list below.
                        </div>
                    ) : (
                        <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                            {discount?.products?.map((product) => (
                                <span
                                    key={product.id}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 py-1 pr-2 pl-3 text-xs font-medium text-primary"
                                >
                                    <span className="max-w-[180px] truncate">
                                        {product.sku ? `[${product.sku}] ` : ''}
                                        {product.name}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mb-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                            Eligible Products <span className="text-red-500">*</span>
                        </h2>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {selectedIds.length} selected
                    </span>
                </div>
                <InputError message={error} className="mt-2" />
            </div>

            <div className="mb-3 space-y-2">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product name or SKU..."
                        className="h-9 pl-9 text-sm"
                    />
                </div>

                {products.length > 0 && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={toggleAllFiltered}
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            Select / Deselect All ({products.length})
                        </button>
                    </div>
                )}
            </div>

            <div className=" flex-1 space-y-2 overflow-y-auto pr-1">
                {products.length === 0 ? (
                    <p className="py-8 text-center text-xs text-gray-500">
                        No matching products found.
                    </p>
                ) : (
                    products.map((item) => {
                        const isChecked = selectedIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleProduct(item.id)}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                                    isChecked
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                }`}
                            >
                                <div className="min-w-0 pr-2">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.sku ? `${item.sku} • ` : ''}
                                        {formatRupiah(Number(item.price))}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                        isChecked
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                                    }`}
                                >
                                    {isChecked && <Check className="h-3.5 w-3.5" />}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50/70 p-3 text-xs text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                    Only checked products will receive the discount when the order total exceeds the minimum spend.
                </span>
            </div>
        </div>
    );
}
