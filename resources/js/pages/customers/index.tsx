import { Head, router } from '@inertiajs/react';
import { IndexCustomerProps } from '@/types';
import { index } from '@/routes/customers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomPagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Search, TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { useLiveSearch } from '@/hooks/use-live-search';

export default function Index({customers, status, filter}: IndexCustomerProps) {
    const {search, setSearch} = useLiveSearch({
        initialValue:filter,
        url:index.url(),
        only:['customers'],
    })

    const { current_page, last_page, from, to, total } = customers;
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
            <Head title="customers" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <div className={`mb-4 flex md:flex-row flex-col md:items-center md:justify-between gap-2`}>

                    <div className={`relative mb-5 md:w-80`}>
                        <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}>
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
            
                        <Input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className={`overflow-x-auto`}>
                    <Table className={`border min-w-full`}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length > 0 ? (
                                customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell >
                                            {customer.name}
                                        </TableCell>
                                        <TableCell>
                                            {customer.phone}
                                        </TableCell>
                                        <TableCell>
                                            {customer.email}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {last_page > 1 && (
                        <CustomPagination 
                            current_page={current_page}
                            last_page={last_page}
                            from={from}
                            to={to}
                            total={total}
                            visitPage={visitPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'customers',
            href: index().url,
        },
    ],
};

                                    