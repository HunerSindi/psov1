"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function SettingsHeader({ onSave }: { onSave: () => void }) {
    const router = useRouter();
    const { t } = useSettings();

    return (
        <div className="bg-blue-600 border-b border-gray-400 p-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push("/")} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                    <ArrowLeft size={16} /> {t("dashboard")}
                </button>
                <div className="h-6 w-px bg-white/40"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">{t("settings")}</h1>
            </div>
            <button
                onClick={onSave}
                className="bg-white text-blue-900 px-4 py-1.5 text-xs font-bold uppercase border border-white hover:bg-gray-100 flex items-center gap-2"
            >
                <Save size={16} /> {t("save")}
            </button>
        </div>
    );
}