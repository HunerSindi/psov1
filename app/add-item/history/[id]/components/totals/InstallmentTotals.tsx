"use client";
import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function InstallmentTotals({ receipt }: { receipt: SaleDetail['receipt'] }) {
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
                    {/* If you have installment schedule info in the API, render it here */}
                </div>
            </div>
        </div>
    );
}