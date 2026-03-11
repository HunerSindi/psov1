"use client";

import { ReturnInfo } from "@/lib/api/returns";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    info: ReturnInfo;
}

export default function ReturnDetailInfo({ info }: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-white border border-gray-400 p-3 mb-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">
                    {t("return_history.detail.created_date")}
                </label>
                <div className="text-sm font-bold text-gray-800 font-mono">
                    {new Date(info.created_at).toLocaleString()}
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">
                    {t("return_history.detail.processed_by")}
                </label>
                <div className="text-sm font-bold text-gray-800">
                    {info.employee || info.employee_name || t("return_history.table.unknown")}
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">
                    {t("return_history.detail.note_label")}
                </label>
                <div className="text-sm text-gray-600 italic">
                    {info.note || t("return_history.detail.no_notes")}
                </div>
            </div>
        </div>
    );
}