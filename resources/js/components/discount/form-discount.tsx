import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {index, store, update} from "@/routes/discounts";
import DiscountRulesCard from './discount-rules-card';
import DiscountProductSelector from './discount-product-selector';
import { DiscountFormType, Product } from '@/types';

export default function FormDiscount({
    method = 'post',
    products,
    discount,
    cancelHref = index().url,
}: DiscountFormType) {
    return (
        <Form
            {...(method === 'put' && discount?.id) ? {...update.form(discount?.id)} : {...store.form()}}
            encType="multipart/form-data"
            className="mx-auto w-full"
        >
            {({processing, errors}) => (
                <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <DiscountRulesCard errors={errors} discount={discount} />
                        </div>

                        <div className="lg:col-span-5">
                            <DiscountProductSelector
                                discount={discount}
                                products={products}
                                defaultSelectedIds={discount?.products?.map((p:Product) => p.id)}
                                error={errors.product_ids}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse items-center justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row dark:border-neutral-800">
                        <a href={cancelHref} className="w-full sm:w-auto">
                            <Button type="button" variant={`outline`} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </a>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto"
                        >
                            {processing ? 'Saving...' : 'Create Discount'}
                        </Button>
                    </div>

                </>
            )}
        </Form>
    );
}

