"use client";

import { useSearchParams, useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function DefineHeader() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t, dir } = useSettings();

    const handleBack = () => {
        const from = searchParams.get("from");
        if (from === "inventory") {
            const p = new URLSearchParams();
            const page = searchParams.get("page");
            const search = searchParams.get("search");
            const sort = searchParams.get("sort");
            const losses = searchParams.get("losses");
            if (page) p.set("page", page);
            if (search) p.set("search", search);
            if (sort) p.set("sort", sort);
            if (losses) p.set("losses", losses);
            const q = p.toString();
            navigate(q ? `/inventory?${q}` : "/inventory");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="bg-blue-600 h-13 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
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