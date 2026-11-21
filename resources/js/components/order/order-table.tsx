import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatRupiah, getStatusBadgeClass } from '@/lib/utils';

import { Order, OrderTableProps } from '@/types';
import { useState } from 'react';
import { CustomPagination } from '../custom-pagination';
import ModalDetailOrder from './modal-order';
import { Button } from '../ui/button';

export default function OrderTable({visitPage, orders}:OrderTableProps){
    const { current_page, last_page, from, to, total } = orders;
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>()
    
    return(
        <>
            <div className={`overflow-x-auto`}>
                <Table className={`border min-w-full`}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell >
                                        <p>#{order.invoice_number}</p>
                                        <p>{formatDate(order.created_at)}</p>
                                    </TableCell>
                                    <TableCell>
                                        {order.customer ? (
                                            <>
                                                <p>{order.customer?.name}</p>
                                                <p>{order.customer?.phone}</p>
                                            </>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {formatRupiah(order.total_amount ?? 0)}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClass(
                                            order.status
                                        )}`}
                                        >
                                        {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button type="button" onClick={() => setSelectedOrder(order)}>Detail</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No orders found.
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

            <ModalDetailOrder 
                selectedOrder={selectedOrder}
                handleCloseDetail={() => setSelectedOrder(undefined)}
            />
        </>
    )
}