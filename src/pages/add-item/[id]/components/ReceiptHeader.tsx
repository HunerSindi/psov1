"use client";

import { useNavigate } from "react-router-dom";
import { Receipt } from "@/lib/api/receipts";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: Receipt | null;
}

export default function ReceiptHeader({ receipt }: Props) {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 border-b border-blue-800 px-4 h-13 flex justify-between items-center sticky top-0 z-30 shadow-md">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/add-item")}
                    className="text-white text-xs font-bold uppercase hover:text-gray-200 hover:underline transition-all flex items-center gap-1"
                >
                    <span className="text-lg pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("add_item.back")}
                </button>

                <div className="h-6 w-px bg-white/30"></div>

                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-lg text-white uppercase tracking-tight">
                        #{receipt?.id}
                    </h1>

                    {/* Payment Status Badge */}
                    {receipt && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border shadow-sm ${receipt.payment_type === 'cash'
                            ? 'bg-green-100 text-green-900 border-green-700'
                            : 'bg-yellow-100 text-yellow-900 border-yellow-700'
                            }`}>
                            {receipt.payment_type === 'cash' ? t("add_item.cash") : t("add_item.loan")}
                        </span>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: Total Display */}
            <div className="text-right flex items-center gap-2 justify-center">
                <span className="text-blue-100 text-[10px] uppercase font-bold tracking-wider leading-none mb-1">
                    {t("add_item.total_amount")}
                </span>
                <span className="text-2xl font-bold text-white font-mono leading-none drop-shadow-sm">
                    {receipt?.final_amount?.toLocaleString() || "0"}
                </span>
            </div>
        </div>
    );
}