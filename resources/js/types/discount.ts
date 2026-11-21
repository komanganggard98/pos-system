import { PageProps, PaginatedData, Product } from ".";

export type Discount = {
    id: number,
    name: string,
    min_amount: number,
    value: number,
    type: 'price' | 'percentage',
    products?: Product[],
}

// 2. Tipe khusus untuk Form Create (membuang field otomatis dari database)
export type DiscountFormData = Omit<Discount, 'id' | 'created_at' | 'updated_at'>;

// 3. (Opsional) Jika satu komponen form dipakai untuk Create DAN Edit
export type DiscountUpsertForm = Partial<Pick<Discount, 'id'>> & DiscountFormData;

export type IndexDiscountProps = PageProps<{
    discounts: PaginatedData<Discount & {products_count: number}>;
    filter?:string
}>;

export type CreateDiscountProps = PageProps<{
    products: Product[];
}>;

export type EditDiscountProps = PageProps<{
    discount: Discount;
    products: Product[];
}>;


export type DiscountFormType = {
    method: 'post' | 'put',
    products: Product[],
    discount?: DiscountUpsertForm,
    cancelHref?: string;
}