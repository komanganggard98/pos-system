import { Customer, PageProps, PaginatedData, User } from '.';
import { Payment } from './payment';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export type OrderProductItem = {
    id: number;
    order_id: number;
    product_id: number;
    discount_id: number | null;
    quantity: number;
    price_before_discount: number;
    discount_amount: number;
    total_before_discount: number;
    total_after_discount: number;
    snapshot_product_name: string;
    snapshot_discount_details: Record<string, any> | null;
};

export type Order = {
    id: number;
    invoice_number: string;
    customer_id: number | null;
    created_by: number;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    status: OrderStatus;
    paid_at: string | null;
    created_at: string;
    updated_at: string;

    // Relasi opsional (dimuat melalui Eloquent `with`)
    customer?: Customer;
    cashier?: Pick<User, 'id' | 'name'> | null;
    payments?: Payment[];
    order_products?: OrderProductItem[];
};

export type ActiveFilters = {
    cashiers_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
};

export type IndexOrderProps = PageProps<{
    orders: PaginatedData<Order>;
    cashiers: Pick<User, 'id' | 'name'>[];
    filters: ActiveFilters;
}>;

export type OrderFilterProps = {
    cashiers: Pick<User, 'id' | 'name'>[];
    filters: ActiveFilters;
};

export type ModalDetailOrderProps = {
    selectedOrder?: Order,
    handleCloseDetail: () => void,
}

export type OrderTableProps = {
    visitPage:(page: number) => void, 
    orders:PaginatedData<Order>
}