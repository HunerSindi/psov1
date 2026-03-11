"use client";

import { StockValuationData } from "@/lib/api/analytics_stock";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    data: StockValuationData | null;
}

export default function PrintStockReport({ data }: Props) {
    const { t, settings } = useSettings();

    if (!data) return null;

    const { total_unique_items, total_stock_quantity, valuation } = data;

    return (
        <div className="hidden print:block font-sans bg-white text-black">

            {/* Header */}
            <div className="w-full border-b-2 border-black mb-6 pb-4">
                {settings.headerA4 ? (
                    <img
                        src={settings.headerA4}
                        alt="Header"
                        className="w-full h-auto max-h-[150px] mb-4"
                    />
                ) : (
                    <div className="h-4"></div>
                )}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">{t("stock_valuation.print.header")}</h1>
                        <p className="text-sm mt-1">
                            {t("stock_valuation.print.generated_on")}: <span className="font-mono font-bold">{new Date().toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">

                {/* Overview Section */}
                <div className="border border-black">
                    <div className="bg-gray-100 p-2 border-b border-black font-bold uppercase text-sm">
                        {t("stock_valuation.cards.stock_overview")}
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <PrintRow label={t("stock_valuation.labels.total_items")} value={total_unique_items} isInt />
                        <PrintRow label={t("stock_valuation.labels.total_quantity")} value={total_stock_quantity} isInt />
                    </div>
                </div>

                {/* Valuation Section */}
                <div className="border border-black">
                    <div className="bg-gray-100 p-2 border-b border-black font-bold uppercase text-sm">
                        {t("stock_valuation.cards.valuation")}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("stock_valuation.labels.cost_value")} value={valuation.total_cost_value} />
                        <PrintRow label={t("stock_valuation.labels.sales_value")} value={valuation.total_sales_value} />
                        <div className="border-t border-black my-2"></div>
                        <PrintRow label={t("stock_valuation.labels.potential_profit")} value={valuation.potential_profit} bold />
                    </div>
                </div>

            </div>
        </div>
    );
}

function PrintRow({ label, value, bold = false, isInt = false }: { label: string, value: number, bold?: boolean, isInt?: boolean }) {
    return (
        <div className={`flex justify-between mb-1 ${bold ? 'font-bold text-black text-lg' : 'text-gray-800'}`}>
            <span className="text-sm">{label}</span>
            <span className="font-mono">{isInt ? value.toLocaleString() : value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
    );
}