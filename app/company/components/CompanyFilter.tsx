"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    search: string;
    onSearchChange: (val: string) => void;
    status: string;
    onStatusChange: (val: string) => void;
}

export default function CompanyFilter({ search, onSearchChange, status, onStatusChange }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-white border border-gray-400 p-2 flex flex-wrap gap-4 items-end">

            {/* Search Input */}
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("company.filters.search_label")}
                </label>
                <input
                    type="text"
                    placeholder={t("company.filters.search_placeholder")}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8 border border-gray-400 px-2 text-sm focus:border-blue-600 outline-none w-full"
                />
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col w-48">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">
                    {t("company.filters.status_label")}
                </label>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="h-8 border border-gray-400 px-2 text-sm bg-white focus:border-blue-600 outline-none"
                >
                    <option value="">{t("company.filters.all")}</option>
                    <option value="debt">{t("company.filters.debt")}</option>
                    <option value="credit">{t("company.filters.credit")}</option>
                </select>
            </div>
        </div>
    );
}