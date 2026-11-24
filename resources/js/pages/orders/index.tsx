import { Head, Link, router } from '@inertiajs/react';
import { IndexOrderProps } from '@/types';
import { index } from '@/routes/orders';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderFilter from '@/components/order/order-filter';
import OrderTable from '@/components/order/order-table';

export default function Index({orders, cashiers, filters}: IndexOrderProps) {
    const visitPage = (page: number) => {
        router.get(index(), { page }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Orders" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Transactions & Orders
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor all POS sales history, applied discounts, and payment statuses.
                    </p>
                </div>

                <OrderFilter 
                    cashiers={cashiers}
                    filters={filters}
                />

                <OrderTable 
                    visitPage={visitPage}
                    orders={orders}
                />
            </div>

        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Orders',
            href: index().url,
        },
    ],
};

                                    