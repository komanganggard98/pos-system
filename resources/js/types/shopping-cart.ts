import React from "react";
import { CartItem } from "./cart";
import { Discount } from "./discount";
import { Customer } from "./customer";

export type CalculationType = {
    subtotal: number;
    discountAmount: number;
    total: number;
    discountWarning: string | null;
}

export type ShoppingCartFormType = {
    cart:CartItem[],
    setCart:React.Dispatch<React.SetStateAction<CartItem[]>>,
    selectedDiscountId:string,
    setSelectedDiscountId:React.Dispatch<React.SetStateAction<string>>,
    selectedCustomerId:string,
    setSelectedCustomerId:React.Dispatch<React.SetStateAction<string>>,
    discounts:Discount[],
    calculation:CalculationType,
    handleContinueToPayment: () => void
}


export type ModalPaymentType = {
    isCheckoutOpen:boolean,
    setIsCheckoutOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleCheckoutSubmit: (e: React.FormEvent<Element>) => void,
    calculation: CalculationType,
    cashReceived:string,
    setCashReceived: React.Dispatch<React.SetStateAction<string>>,
    cashChange:number,
    isSubmitting:boolean
}

export type ModalNewCustomerType = {
    errorMessage:string | null,
    show:boolean,
    handleQuickCreate:(e: React.FormEvent<Element>) => Promise<void>,
    handleClose:() => void,
    isSaving:boolean
}