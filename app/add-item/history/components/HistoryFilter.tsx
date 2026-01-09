"use client";

import { useState } from "react";
import { SalesFilters } from "@/lib/api/sales-history";
import { Search, Filter, RotateCcw } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    onSearch: (filters: SalesFilters) => void;
    currentLimit: number;
}

export default function HistoryFilter({ onSearch, currentLimit }: Props) {
    const { t } = useSettings();

    // Local state for inputs
    const [filters, setFilters] = useState<SalesFilters>({});
    const [localLimit, setLocalLimit] = useState(currentLimit);

    const handleChange = (field: keyof SalesFilters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        onSearch({ ...filters, limit: localLimit });
    };

    const handleReset = () => {
        setFilters({});
        setLocalLimit(20);
        onSearch({ limit: 20 });
    };

    return (
        <div className="bg-white border border-gray-400 p-3 mb-2 flex flex-col md:flex-row flex-wrap gap-3 items-end print:hidden shadow-sm">

            {/* 1. General Search */}
            <div className="flex flex-col w-full md:w-48">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("sales_history.filters.search_label")}
                </label>
                <div className="relative">
                    <Search className="absolute left-2 top-2 text-gray-400" size={14} />
                    <input
                        type="text"
                        className="w-full h-9 border border-gray-400 pl-7 pr-2 text-sm focus:border-blue-600 outline-none"
                        placeholder={t("sales_history.filters.search_placeholder")}
                        value={filters.search || ""}
                        onChange={e => handleChange("search", e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
            </div>

            {/* 2. Payment Type */}
            <div className="flex flex-col w-32">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("sales_history.filters.payment_type")}
                </label>
                <select
                    className="w-full h-9 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none bg-white"
                    value={filters.payment_type || "all"}
                    onChange={e => handleChange("payment_type", e.target.value)}
                >
                    <option value="all">{t("sales_history.filters.all_types")}</option>
                    <option value="cash">{t("sales_history.filters.cash")}</option>
                    <option value="installment">{t("sales_history.filters.installment")}</option>
                    <option value="loan">{t("sales_history.filters.loan")}</option>
                </select>
            </div>

            {/* 3. Date Range */}
            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("sales_history.filters.from")}
                </label>
                <input type="date" className="h-9 border border-gray-400 px-2 text-sm"
                    value={filters.start_date || ""} onChange={e => handleChange("start_date", e.target.value)} />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("sales_history.filters.to")}
                </label>
                <input type="date" className="h-9 border border-gray-400 px-2 text-sm"
                    value={filters.end_date || ""} onChange={e => handleChange("end_date", e.target.value)} />
            </div>

            {/* 4. List Size (Limit) */}
            <div className="flex flex-col w-24">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("sales_history.filters.show_rows")}
                </label>
                <select
                    className="w-full h-9 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none bg-white font-bold"
                    value={localLimit}
                    onChange={e => setLocalLimit(Number(e.target.value))}
                >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-1 ml-auto">
                <button onClick={handleSearch} className="h-9 bg-blue-700 text-white px-4 text-xs font-bold uppercase border border-blue-900 hover:bg-blue-800 flex items-center gap-2">
                    <Filter size={14} /> {t("sales_history.filters.btn_filter")}
                </button>
                <button onClick={handleReset} className="h-9 bg-gray-200 text-gray-700 px-3 text-xs font-bold uppercase border border-gray-400 hover:bg-gray-300 flex items-center gap-2">
                    <RotateCcw size={14} /> {t("sales_history.filters.btn_reset")}
                </button>
            </div>
        </div>
    );
}