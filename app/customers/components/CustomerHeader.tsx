"use client";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function CustomerHeader() {
    const router = useRouter();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 h-13 p-3 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push("/")} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                    <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                    {t("customer.back")}
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">
                    {t("customer.title")}
                </h1>
            </div>
        </div>
    );
}