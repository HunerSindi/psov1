"use client";

import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    onAddClick: () => void;
    onPrintClick: () => void;
}

export default function CategoryHeader({ onAddClick, onPrintClick }: Props) {
    const router = useRouter();
    const { t, dir } = useSettings(); // Hook

    return (
        <div className="bg-blue-600 border-b border-gray-400 p-3 h-13 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/")}
                    className="text-white font-bold hover:text-black transition-colors uppercase text-sm flex items-center gap-1"
                >
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("expense_category.back")}
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="font-bold text-white uppercase tracking-tight">
                    {t("expense_category.title")}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrintClick}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase px-3 py-2 border border-gray-400 flex items-center gap-2"
                >
                    <Printer size={14} />
                    {t("expense_category.actions.print")}
                </button>
                <button
                    onClick={onAddClick}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase px-4 py-2 border border-black"
                >
                    {t("expense_category.actions.add_new")}
                </button>
            </div>
        </div>
    );
}