import { formatDate, formatRupiah, getStatusBadgeClass } from "@/lib/utils";
import { ModalDetailOrderProps } from "@/types";
import Modal from "@mui/material/Modal";
import { Button } from "../ui/button";
import { PhoneIcon, UserIcon } from "lucide-react";

export default function ModalDetailOrder({selectedOrder, handleCloseDetail}:ModalDetailOrderProps){
    return(
        <Modal
            open={Boolean(selectedOrder)}
            onClose={handleCloseDetail}
        >
            <div className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl outline-none dark:border-neutral-600 dark:bg-neutral-900">
                {selectedOrder && (
                    <div className="space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                            <div>
                                <h2
                                    id="order-detail-modal-title"
                                    className="text-sm "
                                >
                                    #{selectedOrder.invoice_number}
                                </h2>
                                <p
                                    id="order-detail-modal-description"
                                    className="text-xs text-muted-foreground"
                                >
                                    Created at {formatDate(selectedOrder.created_at)}
                                </p>
                            </div>
                            <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs  capitalize ${getStatusBadgeClass(
                                selectedOrder.status
                            )}`}
                            >
                            {selectedOrder.status}
                            </span>
                        </div>

                        {/* Informasi Utama */}
                        <div className="grid grid-cols-1 gap-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3.5 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-xs">Customer</p>
                                <p className="text-xs flex gap-1 items-center">
                                    <UserIcon className={`w-2`}/>{selectedOrder.customer?.name || "-"}
                                </p>
                                <p className="text-xs flex gap-1 items-center">
                                    <PhoneIcon className={`w-2`}/>{selectedOrder.customer?.phone || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs">Cashier</p>
                                <p className="font-semibold">
                                    {selectedOrder.cashier?.name || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs">Discount</p>
                                <p className="font-semibold">
                                    {formatRupiah(selectedOrder.discount_amount ?? 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs">Total</p>
                                <p className="text-base font-bold ">
                                    {formatRupiah(selectedOrder.total_amount ?? 0)}
                                </p>
                            </div>
                        </div>

                        {/* Riwayat Pembayaran */}
                        <div>
                            <h3 className="mb-2 text-sm ">
                                Payment History ({selectedOrder.payments?.length ?? 0})
                            </h3>

                            {selectedOrder.payments && selectedOrder.payments.length > 0 ? (
                            <div className="space-y-2.5 overflow-y-auto">
                                {selectedOrder.payments.map((pay) => (
                                <div
                                    key={`modal_payment_${pay.id}`}
                                    className="rounded-lg border dark:bg-neutral-800 p-3 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[11px]  capitalize ${getStatusBadgeClass(
                                            pay.status
                                            )}`}
                                        >
                                            {pay.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                                        <p>
                                            <span className="">Nominal:</span>{" "}
                                            <span className="font-semibold">
                                            {formatRupiah(pay.amount)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="">Payment Order ID:</span>{" "}
                                            <span className="font-semibold">
                                            {pay.order_id}
                                            </span>
                                        </p>
                                        <p className="sm:col-span-2">
                                            <span className="">Paid at:</span>{" "}
                                            <span className="font-semibold">
                                                {" "}{formatDate(pay.paid_at)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-muted-foreground">
                                No payment data available for this order.
                            </p>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="mt-5 flex justify-center">
                            <Button
                                type="button"
                                onClick={handleCloseDetail}
                                className="w-full"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}