import FormProduct from "@/components/product/form-product";
import { PageProps, Product } from "@/types";
import { index } from "@/routes/products";
import { Head } from "@inertiajs/react";

export default function Edit({product}: PageProps<{ product: Product }>) {
    return(
        <>
            <Head title="Edit Product" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormProduct 
                    product={product}
                    method="put"
                />
            </div>
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index().url,
        },
        {
            title: 'Edit Product',
        },
    ],
};