"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function LoanTotals({ receipt }: Props) {
    const { t } = useSettings();

    // Calculations
    const subtotal = receipt.final_amount + receipt.discount_value;
    const finalInvoiceTotal = receipt.final_amount;
    const paidNow = receipt.paid_amount;
    const remainingOnInvoice = finalInvoiceTotal - paidNow;

    // NOTE: If your API returns the customer's TOTAL balance (old + new), use it here.
    // Otherwise, this just shows the debt from THIS specific invoice.
    // const currentCustomerBalance = receipt.customer_balance || 0; 

    return (
        <div className="flex justify-end font-sans text-black">
            <div className="w-80 border-2 border-black bg-gray-50 text-sm shadow-sm">

                {/* Subtotal */}
                <div className="p-2 border-b border-gray-300 flex justify-between">
                    <span>{t("sale_ticket.totals.label_subtotal") || "Subtotal"}:</span>
                    <span className="font-bold">{subtotal.toLocaleString()}</span>
                </div>

                {/* Discount */}
                {receipt.discount_value > 0 && (
                    <div className="p-2 border-b border-gray-300 flex justify-between text-red-600 bg-red-50">
                        <span>{t("sale_ticket.totals.discount") || "Discount"}:</span>
                        <span className="font-bold">-{receipt.discount_value.toLocaleString()}</span>
                    </div>
                )}

                {/* Net Total */}
                <div className="p-2 border-b border-gray-300 flex justify-between font-bold bg-gray-100">
                    <span>{t("sale_ticket.print.net_total") || "Net Total"}:</span>
                    <span>{finalInvoiceTotal.toLocaleString()}</span>
                </div>

                {/* Paid Now */}
                <div className="p-2 border-b border-gray-300 flex justify-between">
                    <span>{t("sale_ticket.print.paid_now") || "Paid Now"}:</span>
                    <span className="font-bold">{paidNow.toLocaleString()}</span>
                </div>

                {/* Added to Debt (Orange) */}
                <div className="p-2 border-b border-black flex justify-between bg-orange-50 text-orange-900 font-bold">
                    <span>{t("sale_ticket.print.added_to_debt") || "Added to Debt"}:</span>
                    <span>{remainingOnInvoice.toLocaleString()}</span>
                </div>

                {/* Total Balance (Black) */}
                {/* Only show this if you have the data, otherwise you can remove it or show the current invoice debt */}
                <div className="p-3 flex justify-between text-lg font-bold uppercase bg-black text-white">
                    <span className="text-xs self-center">
                        {t("sale_ticket.print.total_balance") || "Balance Due"}:
                    </span>
                    {/* Assuming remaining on this invoice is the balance for now */}
                    <span>{remainingOnInvoice.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}