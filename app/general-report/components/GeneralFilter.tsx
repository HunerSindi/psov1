"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    onFilter: (start: string, end: string) => void;
}

export default function GeneralFilter({ onFilter }: Props) {
    const { t } = useSettings();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearch = () => {
        onFilter(startDate, endDate);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        onFilter("", "");
    };

    return (
        <div className="bg-white border border-gray-400 p-3 flex flex-wrap gap-4 items-end shadow-sm">
            {/* Start Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-600">
                    {t("analytics_general.filters.from")}
                </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 p-2 text-sm focus:outline-none focus:border-blue-500 h-10"
                />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-600">
                    {t("analytics_general.filters.to")}
                </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 p-2 text-sm focus:outline-none focus:border-blue-500 h-10"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleSearch}
                    className="h-10 px-4 bg-blue-600 text-white font-bold text-xs uppercase flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Search size={16} />
                    {t("analytics_general.filters.filter")}
                </button>
                <button
                    onClick={handleReset}
                    className="h-10 px-4 bg-gray-100 text-gray-700 border border-gray-300 font-bold text-xs uppercase flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw size={16} />
                    {t("analytics_general.filters.reset")}
                </button>
            </div>
        </div>
    );
}