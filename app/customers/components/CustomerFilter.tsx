"use client";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    search: string; onSearchChange: (v: string) => void;
    minBal: string; onMinChange: (v: string) => void;
    maxBal: string; onMaxChange: (v: string) => void;
    sort: string; onSortChange: (v: string) => void;
}

export default function CustomerFilter({
    search, onSearchChange,
    minBal, onMinChange,
    maxBal, onMaxChange,
    sort, onSortChange
}: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-gray-100 border-b border-gray-400 p-2 flex flex-wrap gap-3 items-end">
            <div className="flex flex-col flex-1 min-w-[150px]">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("customer.filters.search_label")}</label>
                <input type="text" placeholder={t("customer.filters.search_placeholder")} value={search} onChange={e => onSearchChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-sm w-full outline-none focus:border-blue-600" />
            </div>
            <div className="flex flex-col w-24">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("customer.filters.min_debt")}</label>
                <input type="number" placeholder="0" value={minBal} onChange={e => onMinChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-sm w-full outline-none focus:border-blue-600" />
            </div>
            <div className="flex flex-col w-24">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("customer.filters.max_debt")}</label>
                <input type="number" placeholder="Max" value={maxBal} onChange={e => onMaxChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-sm w-full outline-none focus:border-blue-600" />
            </div>
            <div className="flex flex-col w-32">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("customer.filters.sort_by")}</label>
                <select value={sort} onChange={e => onSortChange(e.target.value)} className="h-8 border border-gray-400 px-1 text-sm bg-white outline-none">
                    <option value="">{t("customer.filters.newest")}</option>
                    <option value="oldest">{t("customer.filters.oldest")}</option>
                </select>
            </div>
        </div>
    );
}