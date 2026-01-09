"use client";

import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/contexts/SettingsContext"; // 1. Import Hook

export default function SaleCartHeader() {
    const router = useRouter();
    const { t, dir } = useSettings(); // 2. Get helpers

    return (
        <header className="bg-blue-600 h-13 px-5 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/")}
                    className="text-white font-bold flex items-center gap-2 transition-colors hover:text-black"
                >
                    {/* Direction-aware Arrow */}
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {/* TRANSLATED: Back Button */}
                    {t("sale_ticket.header.back")}
                </button>
                <div className="h-6 w-px bg-blue-400"></div>
                <h1 className="font-bold text-white tracking-wide uppercase">
                    {/* TRANSLATED: Title */}
                    {t("sale_ticket.header.title")}
                </h1>
            </div>
        </header>
    );
}