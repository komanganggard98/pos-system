import FormProduct from "@/components/product/form-product";
import { PageProps } from "@/types";
import { index } from "@/routes/products";
import { Head } from "@inertiajs/react";

export default function Create({}: PageProps) {
    return(
        <>
            <Head title="Create Product" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormProduct 
                    product={undefined}
                    method="post"
                />
            </div>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: index().url,
        },
        {
            title: 'Create Product',
        },
    ],
};