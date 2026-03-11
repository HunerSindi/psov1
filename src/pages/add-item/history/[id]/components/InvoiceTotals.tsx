"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function InvoiceTotals({ receipt }: Props) {
    const { t } = useSettings();
    const subtotal = receipt.final_amount + receipt.discount_value;

    return (
        <div className="flex justify-end">
            <div className="w-64 border border-gray-400 bg-gray-50 text-sm">

                {/* Subtotal */}
                <div className="flex justify-between p-2 border-b border-gray-300">
                    <span className="text-gray-600 font-bold uppercase text-xs">
                        {t("sales_history.detail.subtotal")}:
                    </span>
                    <span>{subtotal.toLocaleString()}</span>
                </div>

                {/* Discount */}
                {receipt.discount_value > 0 && (
                    <div className="flex justify-between p-2 border-b border-gray-300 bg-red-50 text-red-700">
                        <span className="font-bold uppercase text-xs">
                            {t("sales_history.detail.discount")}:
                        </span>
                        <span>- {receipt.discount_value.toLocaleString()}</span>
                    </div>
                )}

                {/* Final Total */}
                <div className="flex justify-between p-3 bg-black text-white font-bold text-lg">
                    <span className="uppercase text-xs self-center">
                        {t("sales_history.detail.final_total")}:
                    </span>
                    <span>{receipt.final_amount.toLocaleString()}</span>
                </div>

                {/* Paid */}
                <div className="flex justify-between p-2 bg-gray-200 border-t border-gray-400 font-bold text-gray-700">
                    <span className="uppercase text-xs self-center">
                        {t("sales_history.detail.paid")}:
                    </span>
                    <span>{receipt.paid_amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}