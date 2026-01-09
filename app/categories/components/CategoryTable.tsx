"use client";

import React from "react";
import { ExpenseCategory } from "@/lib/api/expense-categories";
import { Edit, Trash2 } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    categories: ExpenseCategory[];
    loading: boolean;
    onEdit: (cat: ExpenseCategory) => void;
    onDelete: (id: number) => void;
}

export default function CategoryTable({ categories, loading, onEdit, onDelete }: Props) {
    const { t } = useSettings(); // Hook

    return (
        <div className="bg-white border border-gray-400 flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-16 text-center">
                            {t("expense_category.table.id")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                            {t("expense_category.table.name")}
                        </th>
                        <th className="p-2 text-center text-xs font-bold uppercase w-24">
                            {t("expense_category.table.actions")}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {loading ? (
                        <tr><td colSpan={3} className="p-8 text-center text-gray-500 italic">
                            {t("expense_category.table.loading")}
                        </td></tr>
                    ) : categories.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-gray-500 italic">
                            {t("expense_category.table.no_data")}
                        </td></tr>
                    ) : (
                        categories.map((cat, idx) => (
                            <tr key={cat.id} className="hover:bg-blue-50 group">
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">
                                    {idx + 1}
                                </td>
                                <td className="p-2 border-r border-gray-100 font-bold text-gray-800">
                                    {cat.name}
                                </td>
                                <td className="p-2 text-center flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat.id!)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}