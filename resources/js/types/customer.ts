import { PageProps, PaginatedData, Product } from ".";

export type Customer = {
    id: number,
    name: string,
    phone: string,
    email?:string
}

export type IndexCustomerProps = PageProps<{
    customers: PaginatedData<Customer>;
    filter?:string
}>;
