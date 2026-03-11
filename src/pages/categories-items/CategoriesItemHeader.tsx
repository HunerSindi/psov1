"use client";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface CategoriesItemHeaderProps {
    /** Optional count of categories to show in the header */
    count?: number;
}

export default function CategoriesItemHeader({ count }: CategoriesItemHeaderProps) {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    const handleBack = () => navigate("/define-item");

    return (
        <div className="bg-blue-600 h-13 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-2 transition-colors"
                >
                    <span className="text-lg pb-1">
                        {dir === "rtl" ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("define_item.back" as any)}
                </button>

                <div className="h-6 w-px bg-blue-400" aria-hidden />

                <h1 className="font-bold text-white uppercase tracking-tight text-lg">
                    {t("define_item.categories_items_title" as any)}
                </h1>
            </div>

            {count !== undefined && (
                <div className="text-xs text-blue-200 font-mono uppercase tabular-nums">
                    {count} {count === 1 ? t("define_item.categories_items_category" as any) : t("define_item.categories_items_categories" as any)}
                </div>
            )}
        </div>
    );
}
