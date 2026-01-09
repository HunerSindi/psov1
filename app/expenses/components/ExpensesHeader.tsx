"use client";

import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    user: any | null;
    onAddClick: () => void;
}

export default function ExpensesHeader({ user, onAddClick }: Props) {
    const router = useRouter();
    const { t, dir } = useSettings(); // Hook

    // Permission Check
    const canAdd = user && (user.permissions.includes("admin") || user.permissions.includes("add-expense"));

    return (
        <div className="bg-blue-600 border-b border-gray-400 px-3 h-13 flex justify-between items-center sticky top-0 z-30 print:hidden">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/")}
                    className="text-white font-bold uppercase text-sm flex items-center gap-1"
                >
                    <span className="text-xl pb-1">
                        {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                    </span>
                    {t("expense.back")}
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                    <h1 className="text-white font-bold uppercase">
                        {t("expense.title")}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2">

                <button
                    onClick={onAddClick}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold uppercase px-4 py-2 border border-blue-900 transition-colors shadow-sm"
                >
                    {t("expense.actions.add_new")}
                </button>

            </div>
        </div>
    );
}