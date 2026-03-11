"use client";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function DamagedHeader() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-red-700 h-13 p-3 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/")} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                    <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                    {t("damaged_items.back")}
                </button>
                <div className="h-6 w-px bg-red-400"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">
                    {t("damaged_items.title")}
                </h1>
            </div>
        </div>
    );
}