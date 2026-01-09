"use client";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    search: string; onSearchChange: (v: string) => void;
    startDate: string; onStartChange: (v: string) => void;
    endDate: string; onEndChange: (v: string) => void;
}

export default function DamagedFilter({
    search, onSearchChange,
    startDate, onStartChange,
    endDate, onEndChange
}: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-gray-100 border-b border-gray-400 p-2 flex flex-wrap gap-3 items-end">
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("damaged_items.filters.search_label")}</label>
                <input type="text" placeholder={t("damaged_items.filters.search_placeholder")} value={search} onChange={e => onSearchChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-sm w-full outline-none focus:border-red-600" />
            </div>
            <div className="flex flex-col w-32">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("damaged_items.filters.start_date")}</label>
                <input type="date" value={startDate} onChange={e => onStartChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-xs w-full outline-none focus:border-red-600 uppercase" />
            </div>
            <div className="flex flex-col w-32">
                <label className="text-[10px] font-bold uppercase text-gray-600 mb-1">{t("damaged_items.filters.end_date")}</label>
                <input type="date" value={endDate} onChange={e => onEndChange(e.target.value)} className="h-8 border border-gray-400 px-2 text-xs w-full outline-none focus:border-red-600 uppercase" />
            </div>
        </div>
    );
}