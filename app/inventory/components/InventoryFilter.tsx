"use client";

import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    search: string;
    onSearchChange: (val: string) => void;
    sortBy: string;
    onSortChange: (val: string) => void;
}

export default function InventoryFilter({ search, onSearchChange, sortBy, onSortChange }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-white border border-b border-gray-400 p-2 flex flex-wrap gap-4 items-end">

            {/* Search Input */}
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("inventory.filters.search_label")}
                </label>
                <input
                    type="text"
                    placeholder={t("inventory.filters.search_placeholder")}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none w-full"
                />
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col w-64">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("inventory.filters.sort_label")}
                </label>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="h-8 border border-gray-400 px-2 text-sm bg-white focus:border-blue-600 outline-none"
                >
                    <option value="">{t("inventory.filters.sort_default")}</option>
                    <option value="quantity_desc">{t("inventory.filters.sort_high_stock")}</option>
                    <option value="expiry_asc">{t("inventory.filters.sort_exp_soon")}</option>
                    <option value="expiry_desc">{t("inventory.filters.sort_exp_late")}</option>
                </select>
            </div>

        </div>
    );
}