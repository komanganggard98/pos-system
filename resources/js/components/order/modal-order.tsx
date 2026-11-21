import { formatDate, formatRupiah, getStatusBadgeClass } from "@/lib/utils";
import { ModalDetailOrderProps } from "@/types";
import Modal from "@mui/material/Modal";
import { Button } from "../ui/button";

export default function ModalDetailOrder({selectedOrder, handleCloseDetail}:ModalDetailOrderProps){
    return(
        <Modal
            open={Boolean(selectedOrder)}
            onClose={handleCloseDetail}
        >
            <div className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl outline-none dark:border-neutral-800 dark:bg-neutral-950">
                {selectedOrder && (
                    <div className="space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                            <div>
                                <h2
                                    id="order-detail-modal-title"
                                    className="text-sm "
                                >
                                    Detail Order #{selectedOrder.invoice_number}
                                </h2>
                                <p
                                    id="order-detail-modal-description"
                                    className="text-xs text-slate-500"
                                >
                                    Created at {formatDate(selectedOrder.created_at)}
                                </p>
                            </div>
                            <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClass(
                                selectedOrder.status
                            )}`}
                            >
                            {selectedOrder.status}
                            </span>
                        </div>

                        {/* Informasi Utama */}
                        <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-3.5 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-slate-500">Customer</p>
                                <p className="font-medium text-slate-800">
                                    {selectedOrder.customer?.name || "-"}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {selectedOrder.customer?.phone || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Cashier</p>
                                <p className="font-medium text-slate-800">
                                    {selectedOrder.cashier?.name || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Discount</p>
                                <p className="font-medium text-slate-800">
                                    {formatRupiah(selectedOrder.discount_amount ?? 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Total</p>
                                <p className="text-base font-bold text-slate-900">
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
                            <div className="space-y-2.5">
                                {selectedOrder.payments.map((pay) => (
                                <div
                                    key={`modal_payment_${pay.id}`}
                                    className="rounded-lg border border-slate-200 p-3 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${getStatusBadgeClass(
                                            pay.status
                                            )}`}
                                        >
                                            {pay.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-1 gap-1 text-slate-600 sm:grid-cols-2">
                                        <p>
                                            <span className="text-slate-400">Nominal:</span>{" "}
                                            <span className="font-semibold text-slate-800">
                                            {formatRupiah(pay.amount)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">Payment Order ID:</span>{" "}
                                            <span className="font-medium text-slate-700">
                                            {pay.order_id}
                                            </span>
                                        </p>
                                        <p className="sm:col-span-2">
                                            <span className="text-slate-400">Paid at:</span>{" "}
                                            <span className="font-medium text-slate-700">
                                                {formatDate(pay.paid_at)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
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