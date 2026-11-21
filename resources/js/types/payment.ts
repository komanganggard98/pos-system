
export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

export type Payment = {
    id: number;
    order_id: number;
    amount: number;
    status:string;
    paid_at: string | null;
    cash_received:number;
    cash_change:number;
};
