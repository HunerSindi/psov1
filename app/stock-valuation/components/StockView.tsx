"use client";

import { StockValuationData } from "@/lib/api/analytics_stock";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Package, DollarSign, TrendingUp, Layers } from "lucide-react";

interface Props {
    data: StockValuationData | null;
    loading: boolean;
}

export default function StockView({ data, loading }: Props) {
    const { t } = useSettings();

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-white border border-gray-400 text-gray-400 font-bold uppercase tracking-wider animate-pulse">
                Loading Data...
            </div>
        );
    }

    if (!data) return null;

    const { total_unique_items, total_stock_quantity, valuation } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">

            {/* 1. STOCK OVERVIEW */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm col-span-1 md:col-span-2 lg:col-span-3">
                <div className="bg-gray-100 border-b border-gray-300 p-3 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 uppercase flex items-center gap-2">
                        <Layers size={20} />
                        {t("stock_valuation.cards.stock_overview")}
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-8">
                    <div className="text-center">
                        <span className="text-sm font-bold text-gray-500 uppercase block mb-1">
                            {t("stock_valuation.labels.total_items")}
                        </span>
                        <span className="text-4xl font-bold text-gray-800">{total_unique_items.toLocaleString()}</span>
                    </div>
                    <div className="text-center border-l border-gray-200">
                        <span className="text-sm font-bold text-gray-500 uppercase block mb-1">
                            {t("stock_valuation.labels.total_quantity")}
                        </span>
                        <span className="text-4xl font-bold text-blue-600">{total_stock_quantity.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* 2. COST VALUE (ASSETS) */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm">
                <div className="bg-red-50 border-b border-red-100 p-3">
                    <h3 className="font-bold text-red-800 uppercase flex items-center gap-2">
                        <Package size={20} />
                        {t("stock_valuation.labels.cost_value")}
                    </h3>
                </div>
                <div className="p-6 text-center">
                    <span className="text-3xl font-bold text-red-700 font-mono">
                        {valuation.total_cost_value.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* 3. SALES VALUE (REVENUE) */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm">
                <div className="bg-green-50 border-b border-green-100 p-3">
                    <h3 className="font-bold text-green-800 uppercase flex items-center gap-2">
                        <TrendingUp size={20} />
                        {t("stock_valuation.labels.sales_value")}
                    </h3>
                </div>
                <div className="p-6 text-center">
                    <span className="text-3xl font-bold text-green-700 font-mono">
                        {valuation.total_sales_value.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* 4. POTENTIAL PROFIT */}
            <div className="bg-white border border-gray-400 p-0 shadow-sm">
                <div className="bg-yellow-50 border-b border-yellow-100 p-3">
                    <h3 className="font-bold text-yellow-800 uppercase flex items-center gap-2">
                        <DollarSign size={20} />
                        {t("stock_valuation.labels.potential_profit")}
                    </h3>
                </div>
                <div className="p-6 text-center">
                    <span className="text-3xl font-bold text-yellow-700 font-mono">
                        {valuation.potential_profit.toLocaleString()}
                    </span>
                </div>
            </div>

        </div>
    );
}