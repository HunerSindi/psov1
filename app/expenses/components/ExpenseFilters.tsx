"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface FilterProps {
    filters: any;
    setFilters: (f: any) => void;
    onSearch: () => void;
}

export default function ExpenseFilters({ filters, setFilters, onSearch }: FilterProps) {
    const { t } = useSettings(); // Hook

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white border border-gray-400 p-2 flex flex-wrap gap-2 items-end mb-2 print:hidden">

            {/* Date Range */}
            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600">
                    {t("expense.filters.start_date")}
                </label>
                <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleChange}
                    className="border border-gray-400 h-8 px-2 text-sm w-36"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase text-gray-600">
                    {t("expense.filters.end_date")}
                </label>
                <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleChange}
                    className="border border-gray-400 h-8 px-2 text-sm w-36"
                />
            </div>

            {/* Text Search */}
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase text-gray-600">
                    {t("expense.filters.search_label")}
                </label>
                <input
                    type="text"
                    name="search"
                    placeholder={t("expense.filters.search_placeholder")}
                    value={filters.search}
                    onChange={handleChange}
                    className="border border-gray-400 h-8 px-2 text-sm w-full"
                />
            </div>

            {/* Buttons */}
            <button
                onClick={onSearch}
                className="h-8 bg-blue-700 text-white px-4 text-sm font-bold uppercase hover:bg-blue-800"
            >
                {t("expense.filters.btn_filter")}
            </button>
            <button
                onClick={() => setFilters({ start_date: "", end_date: "", search: "" })}
                className="h-8 bg-gray-200 text-gray-700 px-3 text-sm font-bold uppercase border border-gray-400 hover:bg-gray-300"
            >
                {t("expense.filters.btn_clear")}
            </button>
        </div>
    );
}