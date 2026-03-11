"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

export default function InventoryHeader() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 border-b border-gray-400 p-3 h-13 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="text-white font-bold hover:text-black transition-colors uppercase text-sm flex items-center gap-1"
                >
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("inventory.back")}
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">
                    {t("inventory.title")}
                </h1>
            </div>
        </div>
    );
}