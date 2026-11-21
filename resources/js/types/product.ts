import { PageProps, PaginatedData } from ".";

export type Product = {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number; 
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Tipe khusus untuk Form Create (membuang field otomatis dari database)
export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

// (Opsional) Jika satu komponen form dipakai untuk Create DAN Edit
export type ProductUpsertForm = Partial<Pick<Product, 'id'>> & ProductFormData;

export type IndexProductProps = PageProps<{
    products: PaginatedData<Product & {order_products_count: number}>;
    filter?:string
}>;

export type ProductFormType = {
    method: "post" | "put";
    product?: ProductUpsertForm;
    cancelHref?: string;
}