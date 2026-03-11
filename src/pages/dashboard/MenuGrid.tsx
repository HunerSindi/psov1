"use client";

import { Link } from "react-router-dom";
import { MenuItem } from "./config/menuItems";
import { useSettings } from "@/lib/contexts/SettingsContext";

// --- Internal Component: Single Card ---
function MenuCard({ item }: { item: MenuItem }) {
    const { t } = useSettings();

    const isDone = item.isFinished;

    const containerStyle = isDone
        ? "bg-white border-gray-400 hover:bg-blue-50 hover:border-blue-700 text-gray-800"
        : "bg-gray-100 border-gray-300 border-dashed text-gray-500 ";

    const translatedLabel = item.transKey
        ? t(`dashboard_menu.${item.transKey}` as any)
        : item.transKey;

    return (
        <Link
            to={item.href}
            className={`
                relative group flex flex-col items-center justify-start text-center
                border 
                p-2 h-32 gap-1   /* CHANGED: Smaller padding, shorter height (h-40 -> h-32), less gap */
                transition-colors duration-100
                ${containerStyle}
            `}
        >
            {/* Icon Area */}
            {/* CHANGED: Reduced top margin (mt-4 -> mt-2) and wrapper padding */}
            <div className="mt-3 p-2 border border-gray-200 bg-white rounded-sm group-hover:border-blue-300 transition-colors">
                <img
                    src={item.imageSrc}
                    alt={translatedLabel}
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/64x64/f1f5f9/64748b?text=IMG";
                    }}
                    /* CHANGED: Smaller icon size (w-12 -> w-10) */
                    className={`w-10 h-10 object-contain ${!isDone && 'grayscale opacity-50'}`}
                />
            </div>

            {/* Label Area */}
            <div className="w-full border-t border-gray-200 pt-1 mt-auto">
                {/* CHANGED: Smaller text (text-sm -> text-xs) */}
                <h2 className="text-xs font-bold uppercase tracking-tight leading-tight">
                    {translatedLabel}
                </h2>
            </div>
        </Link>
    );
}

// --- Main Component: Grid ---
export default function MenuGrid({ items }: { items: MenuItem[] }) {
    const { t } = useSettings();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 border border-gray-400 bg-gray-50">
                <p className="text-sm font-bold text-gray-600 uppercase">
                    {t("dashboard_menu.no_access" as any)}
                </p>
                <p className="text-xs text-gray-500">
                    {t("dashboard_menu.contact_admin" as any)}
                </p>
            </div>
        );
    }

    return (
        /* Optional: You can change grid-cols-2 to grid-cols-3 on mobile if you want them really packed */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2">
            {items.map((item, index) => (
                <MenuCard key={index} item={item} />
            ))}
        </div>
    );
}