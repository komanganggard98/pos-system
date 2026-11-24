import { formatRupiah } from "@/lib/utils";
import { ModalPaymentType } from "@/types";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from '@/components/ui/label';
import { Input } from "../ui/input";
import Modal from '@mui/material/Modal';


export default function ModalPayment({
    isCheckoutOpen,
    setIsCheckoutOpen,
    handleCheckoutSubmit,
    calculation,
    cashReceived,
    setCashReceived,
    cashChange,
    isSubmitting
}: ModalPaymentType){
    return(
        <Modal
            open={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
        >
            <div className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl outline-none dark:border-neutral-800 dark:bg-neutral-950">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 id="checkout-modal-title" className="text-lg font-bold">
                            Transaction Payment
                        </h2>
                        <p id="checkout-modal-description" className="sr-only">
                            Complete your transaction.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCheckoutOpen(false)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleCheckoutSubmit}>
                    <div className="space-y-5 overflow-auto max-h-[70vh] p-2">
                        {/* Total Amount Due */}
                        <div className="rounded-xl bg-primary/10 p-4 text-center">
                            <span className="text-xs font-medium uppercase tracking-wider text-primary">
                                Total Amount Due
                            </span>
                            <p className="mt-1 text-2xl font-extrabold text-primary">
                                {formatRupiah(calculation.total)}
                            </p>
                        </div>

                        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-neutral-800">
                            <div>
                                <Label htmlFor="cash_received">Cash Received (IDR)</Label>
                                <Input
                                    id="cash_received"
                                    type="number"
                                    min={calculation.total}
                                    required
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    className="mt-1.5"
                                />
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {[calculation.total, 50000, 100000, 500000, 1000000].map((nominal, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCashReceived(String(nominal))}
                                        className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
                                    >
                                        {idx === 0 ? 'Exact Cash' : formatRupiah(nominal)}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm dark:border-neutral-800">
                                <span className="text-gray-500">Change:</span>
                                <span className="text-base font-bold text-emerald-600">
                                    {formatRupiah(cashChange)}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-row gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCheckoutOpen(false)}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {isSubmitting
                                    ? 'Processing...'
                                    : 'Complete Payment'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}