"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function SaleHeader() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <header className="bg-blue-600 h-13 px-5 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="text-white font-bold flex items-center gap-2 transition-colors uppercase text-sm"
                >
                    <span className="text-lg pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("add_item.back")}
                </button>
                <div className="h-6 w-px bg-blue-400"></div>
                <h1 className="font-bold text-white tracking-wide uppercase">
                    {t("add_item.main_title")}
                </h1>
            </div>
        </header>
    );
}