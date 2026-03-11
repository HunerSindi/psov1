"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function DetailHeader() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 h-13 border-b border-gray-400 p-3 flex justify-between items-center sticky top-0 print:hidden z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white font-bold hover:text-black transition-colors uppercase text-sm flex items-center gap-1"
                >
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("sales_history.back")}
                </button>
                <div className="h-6 w-px bg-gray-300 opacity-50"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">
                    {t("sales_history.detail.title")}
                </h1>
            </div>
        </div>
    );
}