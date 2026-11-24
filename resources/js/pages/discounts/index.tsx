import { Head, router } from '@inertiajs/react';
import { IndexDiscountProps } from '@/types';
import { index, create, edit, destroy } from '@/routes/discounts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomPagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Search, TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';
import { useLiveSearch } from '@/hooks/use-live-search';

export default function Index({discounts, filter}: IndexDiscountProps) {
    const {search, setSearch} = useLiveSearch({
        initialValue:filter,
        url:index.url(),
        only:['discounts'],
    })

    const { current_page, last_page, from, to, total } = discounts;
    const visitPage = (page: number) => {
        router.get(index(), { page }, { preserveState: true, replace: true });
    }

    const handleDelete = (discountId: number) => {
        if (confirm('Are you sure you want to delete this discount?')) {
            destroy.delete(discountId);
        }
    }

    return (
        <>
            <Head title="Discounts" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <div className={`mb-4 flex md:flex-row flex-col md:items-center md:justify-between gap-2`}>
                    <div>
                        <a href={create().url}>
                            <Button type="button">
                                Create Discount
                            </Button>
                        </a>
                    </div>

                    <div className={`relative mb-5 md:w-80`}>
                        <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}>
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
            
                        <Input
                            type="text"
                            placeholder="Search discounts..."
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
                                <TableHead>Discount Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Min Transaction</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.data.length > 0 ? (
                                discounts.data.map((discount) => (
                                    <TableRow key={discount.id}>
                                        <TableCell >
                                            <p className="font-medium">{discount.name}</p>
                                            <p className={`text-sm text-muted-foreground`}>
                                                Discount: {discount.value ?? 0}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {discount.type === 'percentage' ? '%' : 'Rp.'}
                                        </TableCell>
                                        <TableCell>{formatRupiah(discount.min_amount)}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-end items-center gap-2`}>
                                                <a href={edit(discount.id).url}>
                                                    <Button type="button">
                                                        Edit discount
                                                    </Button>
                                                </a>
                                                {discount.products_count > 0 && (
                                                    <Button type="button"
                                                        variant={`destructive`}
                                                        onClick={() => handleDelete(discount.id)}
                                                    >
                                                        <TrashIcon className={`h-4 w-4`} />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No discounts found.
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
            title: 'Discounts',
            href: index().url,
        },
    ],
};

                                    