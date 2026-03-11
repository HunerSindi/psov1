"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function ReturnHistoryFilter({ search, onSearchChange }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-gray-100 border border-gray-400 p-1 flex gap-2 items-center print:hidden">
            <label className="text-[10px] font-bold uppercase text-gray-600 pl-1">
                {t("return_history.filters.search_label")}
            </label>
            <input
                type="text"
                placeholder={t("return_history.filters.search_placeholder")}
                className="h-7 border border-gray-400 px-2 text-xs w-64 outline-none focus:border-blue-600 rounded-none focus:bg-white transition-colors"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
            />
        </div>
    );
}