"use client";

import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function DefineHeader() {
    const router = useRouter();
    const { t, dir } = useSettings();

    return (
        <div className="bg-blue-600 h-13 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/")}
                    className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    {/* Direction-aware Arrow */}
                    <span className="text-lg pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("define_item.back")}
                </button>

                <div className="h-6 w-px bg-blue-400"></div>

                <h1 className="font-bold text-white uppercase tracking-tight text-lg">
                    {t("define_item.title")}
                </h1>
            </div>

            <div className="text-xs text-blue-200 font-mono uppercase">
                {/* Optional: Add Version or User info here */}
            </div>
        </div>
    );
}