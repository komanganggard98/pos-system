import { Head, router } from '@inertiajs/react';
import { IndexProductProps } from '@/types/product';
import { index, create, edit, destroy } from '@/routes/products';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomPagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Search, TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLiveSearch } from '@/hooks/use-live-search';
import { formatRupiah } from '@/lib/utils';

export default function Index({products, status, filter}: IndexProductProps) {
    const {search, setSearch} = useLiveSearch({
        initialValue:filter,
        url:index.url(),
        only:['products'],
    })

    const { current_page, last_page, from, to, total, data } = products;
    
    const visitPage = (page: number) => {
        router.get(index(), { page }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only:['products'],
        });
    }

    const handleDelete = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(destroy(productId).url, {
                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <Head title="Products" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <div className={`mb-4 flex md:flex-row flex-col md:items-center md:justify-between gap-2`}>
                    <div>
                        <a href={create().url}>
                            <Button type="button">
                                Create Product
                            </Button>
                        </a>
                    </div>
                    <div className={`relative mb-5 md:w-80`}>
                        <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}>
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
            
                        <Input
                            type="text"
                            placeholder="Search products..."
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
                                <TableHead>Product Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell >
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">SKU: {product.sku ?? '-'}</p>
                                            <p className={`text-sm text-muted-foreground`}>
                                                Total Ordered: {product.order_products_count ?? 0}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {formatRupiah(product.price)}
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-end items-center gap-2`}>
                                                <a href={edit(product.id).url}>
                                                    <Button type="button">
                                                        Edit Product
                                                    </Button>
                                                </a>
                                                {(product.order_products_count === 0) && (
                                                    <Button type="button"
                                                        variant={`destructive`}
                                                        onClick={() => handleDelete(product.id)}
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
                                        No products found.
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
            title: 'Products',
            href: index().url,
        },
    ],
};

                                    