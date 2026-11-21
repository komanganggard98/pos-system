import React, { useState } from 'react';
import { Form } from '@inertiajs/react';
import { ImagePlus, X, Package, DollarSign, Hash, Layers } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {index, store, update} from "@/routes/products";
import { Textarea } from '../ui/textarea';
import { ProductFormType } from '@/types';

export default function FormProduct({
    method = 'post',
    product,
    cancelHref = index().url,
}: ProductFormType) {

    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.image ? `/storage/${product?.image}` : null
    );
    const [isActive, setIsActive] = useState<boolean>(
        product?.is_active ?? true
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {

            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file format. Please upload an image in JPG, JPEG, or PNG format.');
                e.target.value = ''; // Reset input file
                return;
            }

            const maxSizeInBytes = 2 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                alert('Image size is too large! Maximum file size is 2MB.');
                e.target.value = ''; // Reset input file
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <Form
            {...(method === 'put' && product?.id) ? {...update.form(product?.id)} : {...store.form()}}
            encType="multipart/form-data"
            className="mx-auto w-full"
        >
            {({processing, errors}) => (
                <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            <div className="rounded-xl border bg-sidebar p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Product Information
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* Product Name */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Product Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            defaultValue={product?.name ?? ''}
                                            placeholder="e.g., Wireless Mechanical Keyboard"
                                        />
                                        <InputError message={errors?.name} />
                                    </div>

                                    {/* SKU / Barcode */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="sku" className="text-sm font-medium">
                                            SKU / Barcode
                                        </Label>
                                        <div className="relative">
                                            <Hash className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="sku"
                                                type="text"
                                                name="sku"
                                                tabIndex={2}
                                                defaultValue={product?.sku ?? ''}
                                                placeholder="e.g., PRD-00123"
                                                className="pl-9"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Optional unique identifier for POS barcode scanning.
                                        </p>
                                        <InputError message={errors?.sku} />
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            tabIndex={3}
                                            defaultValue={product?.description ?? ''}
                                            placeholder="Enter product details, specifications, or notes..."
                                        />
                                        <InputError message={errors?.description} />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Inventory Card */}
                            <div className="rounded-xl border border-gray-200 bg-sidebar p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Pricing & Inventory
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* Selling Price */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="price" className="text-sm font-medium">
                                            Selling Price <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-gray-500">
                                                Rp
                                            </span>
                                            <Input
                                                id="price"
                                                type="number"
                                                name="price"
                                                step="0.01"
                                                min="0"
                                                required
                                                tabIndex={4}
                                                defaultValue={product?.price ?? ''}
                                                placeholder="0"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors?.price} />
                                    </div>

                                    {/* Stock Quantity */}
                                    <div className="">
                                        <Label htmlFor="stock" className="text-sm font-medium">
                                            Stock Quantity <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Layers className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="stock"
                                                type="number"
                                                name="stock"
                                                min="0"
                                                required
                                                tabIndex={5}
                                                defaultValue={product?.stock ?? 0}
                                                placeholder="0"
                                                className="pl-9"
                                            />
                                        </div>
                                        <InputError message={errors?.stock} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media & Status (Takes 1/3 width on desktop) */}
                        <div className="space-y-6">
                            {/* Product Image Upload Card */}
                            <div className="rounded-xl border border-gray-200 bg-sidebar p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                                    Product Image
                                </h2>

                                {imagePreview ? (
                                    <div className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-700">
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="aspect-square w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 rounded-full gap-4 text-white shadow-md transition bg-red-700 focus:outline-none border p-1.5 flex items-center justify-center hover:cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image"
                                        className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-primary hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                                    >
                                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                                            <ImagePlus className="h-6 w-6" />
                                        </div>
                                        <span className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Click to upload image
                                        </span>
                                        <span className="mt-1 text-xs text-gray-500">
                                            PNG, JPG or JPEG (max. 2MB)
                                        </span>
                                    </label>
                                )}

                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <InputError message={errors?.image} className="mt-2" />
                            </div>

                            {/* Availability Status Card */}
                            <div className="rounded-xl border border-gray-200 bg-sidebar p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                                    Visibility Status
                                </h2>

                                <label className="flex cursor-pointer items-start gap-3">
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
                                    <div className="space-y-0.5">
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                                            Active in POS Catalog
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            Enable this so cashiers can select this product during checkout.
                                        </span>
                                    </div>
                                </label>
                                <InputError message={errors?.is_active} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-6 flex flex-col-reverse items-center justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row dark:border-neutral-800">
                        <a href={cancelHref} className="w-full sm:w-auto">
                            <Button type="button" variant={`outline`} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </a>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={processing}
                        >
                            {product?.id ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

