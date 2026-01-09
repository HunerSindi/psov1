"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function LoanInfo({ receipt }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-white p-4 mb-4 border-b-2 border-black font-sans text-black">
            <div className="flex justify-between items-end">
                {/* Left: Invoice Details */}
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wide">
                        {t("sale_ticket.print.credit_invoice") || "CREDIT INVOICE"}
                    </h1>
                    <div className="text-sm mt-2 text-gray-800">
                        {t("sale_ticket.print.invoice_no") || "Invoice No"}: <span className="font-mono font-bold text-black">#{receipt.id}</span>
                    </div>
                    <div className="text-sm text-gray-800">
                        {t("sale_ticket.totals.label_date") || "Date"}: <span className="font-mono">{new Date(receipt.date).toLocaleString()}</span>
                    </div>
                </div>

                {/* Right: Bill To */}
                <div className="text-right">
                    <div className="text-xs font-bold uppercase text-gray-500 mb-1">
                        {t("sale_ticket.print.bill_to") || "BILL TO"}
                    </div>
                    <div className="text-xl font-bold text-black">
                        {receipt.customer_name || "Guest"}
                    </div>
                    {/* If you have customer ID or Phone, show it here */}
                    {/* {receipt.customer_id && (
                        <div className="text-sm font-mono text-gray-600">ID: {receipt.customer_id}</div>
                    )} */}
                </div>
            </div>
        </div>
    );
}