"use client";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    returnId: number;
}

export default function ReturnHeader({ returnId }: Props) {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-red-700 border-b border-red-900 h-13 px-3 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="font-bold hover:text-gray-200 uppercase text-sm flex items-center gap-1"
                >
                    {dir === 'rtl' ? <>&rarr;</> : <ArrowLeft size={16} />}
                    {t("returns.back")}
                </button>
                <div className="h-6 w-px bg-white/40"></div>
                <h1 className="font-bold uppercase tracking-tight">
                    {t("returns.title")}
                </h1>
            </div>
            <div className="text-right">
                <div className="text-xs opacity-80 uppercase">{t("returns.ticket_id")}</div>
                <div className="font-mono font-bold text-lg leading-none">
                    {returnId === 0 ? t("returns.new") : `#${returnId}`}
                </div>
            </div>
        </div>
    );
}