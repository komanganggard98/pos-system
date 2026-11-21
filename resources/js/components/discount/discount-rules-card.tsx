import React, { useState } from 'react';
import { Tag, Percent, DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

export interface DiscountEntity {
    id?: number;
    name?: string;
    description?: string | null;
    type?: 'percentage' | 'price';
    value?: number | string;
    min_amount?: number | string;
    is_active?: boolean;
    products?: { id: number }[];
}

interface Props {
    discount?: DiscountEntity;
    errors?: Record<string, string>;
}

export default function DiscountRulesCard({ discount = {}, errors = {} }: Props) {
    const [type, setType] = useState<'percentage' | 'price'>(
        discount?.type ?? 'percentage'
    );
    const [valueInput, setValueInput] = useState<string>(
        discount?.value ? String(discount.value) : '20'
    );

    const [isActive, setIsActive] = useState<boolean>(
        discount?.is_active ?? true
    );

    return (
        <div className="space-y-6">
            {/* General Promo Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                    <Tag className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Promotion Details
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">
                            Promo Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoFocus
                            defaultValue={discount?.name ?? ''}
                            placeholder="e.g., Special 20% Off Orders > 1M"
                        />
                        <InputError message={errors?.name} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            defaultValue={discount?.description ?? ''}
                            placeholder="Terms and conditions notes for cashiers..."
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        <InputError message={errors?.description} />
                    </div>
                </div>
            </div>

            {/* Discount Value & Conditions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                    <Percent className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Discount Value & Conditions
                    </h2>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label>Discount Type</Label>
                        <input type="hidden" name="type" value={type} />
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('percentage')}
                                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold transition ${
                                    type === 'percentage'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-neutral-700'
                                }`}
                            >
                                <Percent className="h-4 w-4 hidden md:inline" />
                                Percentage (%)
                            </button>

                            <button
                                type="button"
                                onClick={() => setType('price')}
                                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold transition ${
                                    type === 'price'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-neutral-700'
                                }`}
                            >
                                <DollarSign className="h-4 w-4 hidden md:inline" />
                                Fixed Amount (Rp)
                            </button>
                        </div>
                        <InputError message={errors?.type} />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="value">
                                Discount Amount <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                {type === 'price' && (
                                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-gray-500">
                                        Rp
                                    </span>
                                )}
                                <Input
                                    id="value"
                                    name="value"
                                    type="number"
                                    min="1"
                                    max={type === 'percentage' ? '100' : undefined}
                                    step="0.01"
                                    required
                                    value={valueInput}
                                    onChange={(e) => setValueInput(e.target.value)}
                                    placeholder={type === 'percentage' ? '20' : '50000'}
                                    className={`${type === 'price' ? 'pl-9' : 'pr-9'}`}
                                />
                                {type === 'percentage' && (
                                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-bold text-gray-500">
                                        %
                                    </span>
                                )}
                            </div>

                            {type === 'percentage' && (
                                <div className="flex gap-2 pt-1">
                                    {[10, 20, 50].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setValueInput(String(preset))}
                                            className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300"
                                        >
                                            {preset}%
                                        </button>
                                    ))}
                                </div>
                            )}
                            <InputError message={errors?.value} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="min_amount">
                                Minimum Order Spend <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-gray-500">
                                    Rp
                                </span>
                                <Input
                                    id="min_amount"
                                    name="min_amount"
                                    type="number"
                                    min="0"
                                    required
                                    defaultValue={discount?.min_amount ?? '1000000'}
                                    placeholder="1000000"
                                    className="pl-9"
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Applies when cart total exceeds this amount.
                            </p>
                            <InputError message={errors?.min_amount} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Status Card */}
            <div className="rounded-xl border border-gray-200 bg-sidebar p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                    Active Discount
                </h2>

                <label className="flex items-center cursor-pointer gap-3">
                    <input
                        type="hidden"
                        name="is_active"
                        value={isActive ? '1' : '0'}
                    />
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="block text-xs text-gray-500">
                        Turn on to activate this discount.
                    </span>
                </label>
                <InputError message={errors?.is_active} className="mt-2" />
            </div>
        </div>
    )
}

