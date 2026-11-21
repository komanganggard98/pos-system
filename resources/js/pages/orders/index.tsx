import { Head, Link, router } from '@inertiajs/react';
import { IndexOrderProps } from '@/types';
import { index } from '@/routes/orders';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import OrderFilter from '@/components/order/order-filter';
import OrderTable from '@/components/order/order-table';

export default function Index({orders, cashiers, status, filters}: IndexOrderProps) {
    const visitPage = (page: number) => {
        router.get(index(), { page }, { preserveState: true, replace: true });
    }

    useEffect(() => {
        if (status) {
            alert(status);
        }
    }, [status]);

    return (
        <>
            <Head title="Orders" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Transactions & Orders
                        </h1>
                        <p className="text-sm text-gray-500">
                            Monitor all POS sales history, applied discounts, and payment statuses.
                        </p>
                    </div>

                    <Link href="/pos">
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            New POS Order
                        </Button>
                    </Link>
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

                                    