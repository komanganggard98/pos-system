import { CreateDiscountProps } from "@/types";
import { index } from "@/routes/discounts";
import { Head } from "@inertiajs/react";
import FormDiscount from "@/components/discount/form-discount";

export default function Create({products}: CreateDiscountProps) {
    return(
        <>
            <Head title="Create Discount" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormDiscount 
                    products={products}
                    method="post"
                />
            </div>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Discounts',
            href: index().url,
        },
        {
            title: 'Create Discount',
        },
    ],
};