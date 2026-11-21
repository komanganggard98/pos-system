import { Order, PaginatedData, User } from ".";

interface DashboardFilters {
    cashiers_id?: string | number;
    status?: string;
    start_date?: string;
    end_date?: string;
}

export type DashboardProps = {
    stats: {
        total_revenue: number;
        total_orders: number;
        total_discount: number;
        low_stock_count: number;
    };
    orders: PaginatedData<Order>;
    cashiers: User[];
    filters: DashboardFilters;
}
