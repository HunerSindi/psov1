"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function CashTotals({ receipt }: Props) {
    const { t } = useSettings();
    const finalAmount = receipt.final_amount;
    const discount = receipt.discount_value;
    const subtotal = finalAmount + discount;

    console.log(finalAmount)

    return (
        <div className="font-sans text-black mt-2">

            {/* Summary Table */}
            <div className="flex ">
                <table className="w-full  ">
                    <tbody>
                        {/* Subtotal */}
                        <tr className="text-xs">
                            <td className="text-right p-1 font-bold">{t("sale_ticket.totals.label_subtotal")}:</td>
                            <td className="text-right p-1 w-32">{subtotal.toLocaleString()}</td>
                        </tr>

                        {/* Discount */}
                        {discount > 0 && (
                            <tr className="text-xs text-red-600">
                                <td className="text-right p-1 font-bold">{t("sale_ticket.totals.discount")}:</td>
                                <td className="text-right p-1 w-32">- {discount.toLocaleString()}</td>
                            </tr>
                        )}

                        {/* Grand Total */}
                        <tr className="text-sm font-bold bg-gray-100 border-t-2 border-b-2 border-black">
                            <td className="text-right p-2">{t("sale_ticket.totals.total_payable")}:</td>
                            <td className="text-right p-2 text-base w-32">{finalAmount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>
    );
}