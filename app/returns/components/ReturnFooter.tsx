"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    itemCount: number;
    totalAmount: number;
}

export default function ReturnFooter({ itemCount, totalAmount }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-gray-100 border-t border-gray-400 p-4 flex justify-between items-center shrink-0">
            <div className="text-xs text-gray-500 font-bold uppercase">
                {t("returns.footer.total_items")}: {itemCount}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold uppercase text-gray-600">
                    {t("returns.footer.total_refund")}:
                </span>
                <span className="text-2xl font-bold font-mono text-red-600 bg-white px-3 py-1 border border-gray-300 shadow-sm">
                    {totalAmount.toLocaleString()}
                </span>
            </div>
        </div>
    );
}