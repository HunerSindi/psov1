"use client";

import { useState, useEffect } from "react";
import { SaleResponse, applyDiscount, paySale } from "@/lib/api/sale-ticket";
import { Printer, CreditCard, User, CalendarClock } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

import LoanDialog from "./dialogs/LoanDialog";
import InstallmentDialog from "./dialogs/InstallmentDialog";

interface Props {
    saleData: SaleResponse | null;
    onRefresh: () => void;
    onPrintRequest: (mode: "cash-a4" | "cash-pos" | "loan" | "loan-pos" | "install") => void; // Updated Type
    onPaymentSuccess: (data: SaleResponse) => void;
}

export default function TotalsSection({ saleData, onRefresh, onPrintRequest, onPaymentSuccess }: Props) {
    const { t } = useSettings();
    const [discountInput, setDiscountInput] = useState("");
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [isInstallOpen, setIsInstallOpen] = useState(false);

    useEffect(() => {
        if (saleData) setDiscountInput(saleData.receipt.discount_value.toString());
    }, [saleData]);

    const handleApplyDiscount = async () => {
        if (!saleData) return;
        await applyDiscount(saleData.receipt.id, parseFloat(discountInput) || 0);
        onRefresh();
    };

    const processPayment = async (type: "cash" | "loan" | "installment", data: any, printMode?: "cash-a4" | "cash-pos" | "loan" | "loan-pos" | "install") => {
        if (!saleData) return;

        if (type !== "cash" && !saleData.customer) {
            alert(t("sale_ticket.totals.alert_select_cust"));
            return;
        }

        let paidNowAmount = 0;
        if (type === "cash") paidNowAmount = data.amount;
        else if (type === "loan") paidNowAmount = data.amount || 0;
        else if (type === "installment") paidNowAmount = data.down_payment || 0;

        // 1. Call Payment API
        let success = false;
        if (type === "installment") {
            success = await paySale(saleData.receipt.id, "installment", data.down_payment, {
                count: data.count, days: data.days, added_fee: data.fee, start_date: data.date
            });
        } else {
            success = await paySale(saleData.receipt.id, type, data.amount);
        }

        if (success) {
            setIsLoanOpen(false);
            setIsInstallOpen(false);

            // 2. Prepare Data for Printing
            const dataForPrint = {
                ...saleData,
                receipt: {
                    ...saleData.receipt,
                    paid_amount: paidNowAmount
                }
            };

            // 3. Send Snapshot to Parent
            onPaymentSuccess(dataForPrint);

            // 4. Request Print ONLY if requested
            // --- FIX IS HERE ---
            if (printMode) {
                onPrintRequest(printMode);
            }
            // Removed automatic fallbacks for loan/install
            // Now "Confirm" button (undefined printMode) will simply save and close.

            // 5. Refresh the live data
            onRefresh();
        } else {
            alert(t("sale_ticket.totals.alert_payment_fail"));
        }
    };

    if (!saleData) return null;

    return (
        <div className="flex flex-col gap-2 font-sans text-black">
            {/* Info Row & Totals - Unchanged */}
            <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-400">
                <div className="text-xs font-bold text-gray-500 uppercase">
                    {t("sale_ticket.totals.items_count")} <span className="text-black">{saleData.items.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                        {t("sale_ticket.totals.discount")}
                    </span>
                    <input type="number" className="w-16 h-6 border border-gray-400 text-right px-1 text-xs outline-none focus:border-blue-600"
                        value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} onBlur={handleApplyDiscount} onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()} />
                </div>
            </div>

            <div className="bg-black text-white p-3 text-center border border-black shadow-sm">
                <div className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("sale_ticket.totals.total_payable")}
                </div>
                <div className="text-4xl font-bold font-mono tracking-tighter">{saleData.receipt.final_amount.toLocaleString()}</div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, undefined)}
                        className="h-10 bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-xs border border-green-800 flex items-center justify-center gap-2 rounded"
                    >
                        <CreditCard size={16} /> {t("sale_ticket.totals.btn_cash")}
                    </button>

                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, "cash-a4")}
                        className="h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase text-xs border border-green-900 flex items-center justify-center gap-2 rounded"
                    >
                        <Printer size={16} /> {t("sale_ticket.totals.btn_cash_a4")}
                    </button>

                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, "cash-pos")}
                        className="h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase text-xs border border-green-900 flex items-center justify-center gap-2 rounded"
                    >
                        <Printer size={16} /> {t("sale_ticket.totals.btn_cash_pos")}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => setIsLoanOpen(true)} className="h-10 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs border border-orange-700 flex items-center justify-center gap-2 rounded">
                        <User size={16} /> {t("sale_ticket.totals.btn_loan")}
                    </button>
                    {/* <button onClick={() => setIsInstallOpen(true)} className="h-10 bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase text-xs border border-purple-900 flex items-center justify-center gap-2 rounded">
                        <CalendarClock size={16} /> {t("sale_ticket.totals.btn_installment")}
                    </button> */}
                </div>
            </div>

            <LoanDialog
                isOpen={isLoanOpen}
                onClose={() => setIsLoanOpen(false)}
                totalAmount={saleData.receipt.final_amount}
                onConfirm={(amount, printMode) => {
                    let mode: "loan" | "loan-pos" | undefined = undefined;
                    if (printMode === "a4") mode = "loan";
                    if (printMode === "pos") mode = "loan-pos";

                    processPayment("loan", { amount }, mode as any);
                }}
            />

            <InstallmentDialog
                isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} totalAmount={saleData.receipt.final_amount}
                onConfirm={(data, print) => processPayment("installment", data, print ? "install" as any : undefined)}
            />
        </div>
    );
}