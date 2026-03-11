"use client";
import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
    showCostProfit?: boolean;
    totalCost?: number;
    totalProfit?: number;
}

export default function InstallmentTotals({ receipt, showCostProfit, totalCost, totalProfit }: Props) {
    const { t } = useSettings();

    return (
        <div className="flex justify-end mt-4">
            <div className="w-72 border border-blue-400 bg-white text-sm">
                <div className="bg-blue-600 text-white p-2 text-center font-bold uppercase tracking-wider text-xs">
                    Installment Summary
                </div>
                <div className="p-3 space-y-2">
                    <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                        <span className="text-gray-600 font-bold">Total Price:</span>
                        <span className="text-lg">{receipt.final_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-800">
                        <span className="font-bold">Down Payment:</span>
                        <span className="font-mono font-bold">{receipt.paid_amount.toLocaleString()}</span>
                    </div>
                    {showCostProfit && totalCost != null && (
                        <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
                            <span className="text-gray-600 font-bold">{t("sales_history.detail.total_cost")}:</span>
                            <span className="font-mono">{(totalCost ?? 0).toLocaleString()}</span>
                        </div>
                    )}
                    {showCostProfit && totalProfit != null && (
                        <div className="flex justify-between text-green-700 font-bold">
                            <span>{t("sales_history.detail.total_profit")}:</span>
                            <span className="font-mono">{(totalProfit ?? 0).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}