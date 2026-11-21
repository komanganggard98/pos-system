import { EditDiscountProps, PageProps, Product } from "@/types";
import { index } from "@/routes/discounts";
import { Head } from "@inertiajs/react";
import FormDiscount from "@/components/discount/form-discount";

export default function Edit({discount, products}: EditDiscountProps) {
    return(
        <>
            <Head title="Edit Discount" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormDiscount 
                    discount={discount}
                    products={products}
                    method="put"
                />
            </div>
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Discounts',
            href: index().url,
        },
        {
            title: 'Edit Discount',
        },
    ],
};