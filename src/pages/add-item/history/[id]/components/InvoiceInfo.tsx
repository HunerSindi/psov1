"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function InvoiceInfo({ receipt }: Props) {
    const { t } = useSettings();

    return (
        <div className="flex justify-between items-start border border-gray-400 bg-gray-50 p-4 mb-2 font-sans">
            {/* Left Side */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 uppercase mb-1">
                    {t("sales_history.detail.invoice_no")} {receipt.id}
                </h2>
                <div className="text-xs text-gray-600 space-y-1">
                    <p>
                        {t("sales_history.detail.ticket_no")}: <span className="font-mono font-bold text-black">{receipt.ticket_number}</span>
                    </p>
                    <p>
                        {t("sales_history.detail.date")}: <span className="font-bold">{new Date(receipt.date).toLocaleString()}</span>
                    </p>
                    <p>
                        {t("sales_history.detail.cashier")}: <span className="uppercase font-bold">{receipt.user_name}</span>
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
                <div className="mb-2">
                    <h3 className="text-[10px] font-bold uppercase text-gray-500">
                        {t("sales_history.detail.customer")}
                    </h3>
                    <p className="text-lg font-bold text-black leading-tight">
                        {receipt.customer_name || t("sales_history.detail.guest")}
                    </p>
                </div>
                <div>
                    <span className={`px-2 py-1 border text-xs font-bold uppercase ${receipt.payment_type === 'cash' ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-orange-100 text-orange-800 border-orange-300'
                        }`}>
                        {/* You can localize these strings too if needed */}
                        {receipt.payment_type}
                    </span>
                </div>
            </div>
        </div>
    );
}