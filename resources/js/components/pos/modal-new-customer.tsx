import { ModalNewCustomerType } from "@/types";
import { CheckCircle2, Mail, Phone, User } from "lucide-react";
import Modal from '@mui/material/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';


export default function ModalNewCustomer({
    errorMessage,
    show,
    handleQuickCreate,
    handleClose,
    isSaving
}: ModalNewCustomerType){
    return(
        <Modal
            open={show}
            onClose={handleClose}
        >
            <div className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6  shadow-xl outline-none dark:border-neutral-800 dark:bg-neutral-950">                
                <form onSubmit={handleQuickCreate} className="space-y-3.5">
                    {errorMessage && (
                        <p className="rounded bg-red-50 p-2 text-xs text-red-600">
                            {errorMessage}
                        </p>
                    )}

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone">
                            Phone <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder={`e.g, 08123717813`}
                                className="pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="name"
                                name="name"
                                type={'text'}
                                placeholder={`Customer Name`}
                                className="pl-9"
                                required
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="email"
                                name="email"
                                type={'email'}
                                placeholder="Customer Email"
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="w-full"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {isSaving ? 'Processing...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}