"use client";

import { GeneralData } from "@/lib/api/analytics_general";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";

interface Props {
    data: GeneralData | null;
    loading: boolean;
}

export default function GeneralView({ data, loading }: Props) {
    const { t } = useSettings();

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-white border border-gray-400 text-gray-400 font-bold uppercase tracking-wider animate-pulse">
                Loading Data...
            </div>
        );
    }

    if (!data) return null;

    const { revenue, costs, profit, total_orders } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">

            {/* 1. REVENUE CARD */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm">
                <div className="bg-green-50 border-b border-green-100 p-3 flex justify-between items-center">
                    <h3 className="font-bold text-green-800 uppercase flex items-center gap-2">
                        <TrendingUp size={20} />
                        {t("analytics_general.cards.revenue_title")}
                    </h3>
                </div>
                <div className="p-4 space-y-3">
                    <Row label={t("analytics_general.labels.sales_revenue")} value={revenue.sales_revenue} />
                    <Row label={t("analytics_general.labels.installment_fees")} value={revenue.installment_fees} />
                    <div className="h-px bg-gray-200 my-2"></div>
                    <Row
                        label={t("analytics_general.labels.total_revenue")}
                        value={revenue.total_revenue}
                        isTotal
                        colorClass="text-green-700"
                    />
                </div>
            </div>

            {/* 2. COSTS CARD */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm">
                <div className="bg-red-50 border-b border-red-100 p-3 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 uppercase flex items-center gap-2">
                        <TrendingDown size={20} />
                        {t("analytics_general.cards.costs_title")}
                    </h3>
                </div>
                <div className="p-4 space-y-3">
                    <Row label={t("analytics_general.labels.cogs")} value={costs.cogs} />
                    <Row label={t("analytics_general.labels.discounts_given")} value={costs.discounts_given} />
                    <Row label={t("analytics_general.labels.operating_expenses")} value={costs.operating_expenses} />
                </div>
            </div>

            {/* 3. PROFIT CARD (Full Width) */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm md:col-span-2">
                <div className="bg-yellow-50 border-b border-yellow-100 p-3 flex justify-between items-center">
                    <h3 className="font-bold text-yellow-800 uppercase flex items-center gap-2">
                        <DollarSign size={20} />
                        {t("analytics_general.cards.profit_title")}
                    </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Gross */}
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center">
                        <span className="text-sm font-bold text-gray-500 uppercase">
                            {t("analytics_general.labels.gross_profit")}
                        </span>
                        <div className="text-3xl font-bold text-gray-800 mt-1">
                            {profit.gross_profit.toLocaleString()}
                        </div>
                    </div>
                    {/* Right: Net (Highlighted) */}
                    <div className="bg-blue-50 p-4 border border-blue-200 text-center">
                        <span className="text-sm font-bold text-blue-600 uppercase">
                            {t("analytics_general.labels.net_profit")}
                        </span>
                        <div className="text-3xl font-bold text-blue-900 mt-1">
                            {profit.net_profit.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. ORDERS SUMMARY (Small) */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between md:col-span-2 border border-black shadow-sm">
                <div className="flex items-center gap-3">
                    <ShoppingCart size={24} className="text-gray-400" />
                    <span className="font-bold uppercase tracking-wider">{t("analytics_general.cards.orders")}</span>
                </div>
                <span className="text-2xl font-bold">{total_orders}</span>
            </div>

        </div>
    );
}

// Helper Row Component
function Row({ label, value, isTotal = false, colorClass = "text-gray-900" }: { label: string, value: number, isTotal?: boolean, colorClass?: string }) {
    return (
        <div className={`flex justify-between items-center ${isTotal ? "font-bold text-lg" : "text-sm text-gray-600"}`}>
            <span>{label}</span>
            <span className={`font-mono ${colorClass}`}>{value.toLocaleString()}</span>
        </div>
    );
}