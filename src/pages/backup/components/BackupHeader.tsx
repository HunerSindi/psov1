"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function BackupHeader() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 h-13 border-b border-gray-400 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="text-white font-bold hover:text-black transition-colors uppercase text-sm flex items-center gap-1"
                >
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <ArrowLeft size={16} />}
                    </span>
                    {t("backup.back")}
                </button>
                <div className="h-6 w-px bg-gray-300 opacity-50"></div>
                <div className="flex items-center gap-2 text-white">
                    <ShieldCheck size={20} />
                    <h1 className="font-bold uppercase tracking-tight">
                        {t("backup.title")}
                    </h1>
                </div>
            </div>
        </div>
    );
}