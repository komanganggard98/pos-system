import { Customer, Discount, PageProps, PaginatedData, Product } from ".";

export type PosProps = PageProps<{
    products: PaginatedData<Product>,
    discounts: Discount[],
    filter?: string
}>