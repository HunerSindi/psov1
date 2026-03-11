"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Filter as FilterIcon, RotateCcw } from "lucide-react";

interface Props {
    onFilter: (start: string, end: string) => void;
}

export default function Filter({ onFilter }: Props) {
    const { t } = useSettings();

    // START EMPTY (No default date)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSearch = () => {
        onFilter(startDate, endDate);
    };

    const handleReset = () => {
        // Reset to empty
        setStartDate("");
        setEndDate("");
        // Pass empty strings to clear filter in parent
        onFilter("", "");
    };

    return (
        <div className="bg-white border border-gray-400 p-3 flex flex-wrap gap-4 items-end print:hidden shadow-sm">

            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("analytics.filters.from")}
                </label>
                {/* Changed to datetime-local */}
                <input
                    type="datetime-local"
                    className="h-9 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("analytics.filters.to")}
                </label>
                {/* Changed to datetime-local */}
                <input
                    type="datetime-local"
                    className="h-9 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div className="flex gap-2 pb-0.5">
                <button
                    onClick={handleSearch}
                    className="h-9 bg-blue-700 text-white px-4 text-xs font-bold uppercase border border-blue-900 hover:bg-blue-800 flex items-center gap-2"
                >
                    <FilterIcon size={14} /> {t("analytics.filters.filter")}
                </button>
                <button
                    onClick={handleReset}
                    className="h-9 bg-gray-200 text-gray-700 px-3 text-xs font-bold uppercase border border-gray-400 hover:bg-gray-300 flex items-center gap-2"
                >
                    <RotateCcw size={14} /> {t("analytics.filters.reset")}
                </button>
            </div>
        </div>
    );
}