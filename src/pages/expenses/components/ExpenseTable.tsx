"use client";

import React from "react";
import { Expense } from "@/lib/api/expenses";
import { Edit, Trash2 } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    expenses: Expense[];
    loading: boolean;
    meta: { current_page: number; total_items: number; per_page: number };
    onPageChange: (page: number) => void;
    onPerPageChange: (limit: number) => void;
    user: any;
    onEdit: (exp: Expense) => void;
    onDelete: (id: number) => void;
}

export default function ExpenseTable({ expenses, loading, meta, onPageChange, onPerPageChange, user, onEdit, onDelete }: Props) {
    const { t } = useSettings(); // Hook

    const canEdit = user && (user.permissions.includes("admin") || user.permissions.includes("edit-expense"));
    const canDelete = user && (user.permissions.includes("admin") || user.permissions.includes("delete-expense"));
    const showActions = canEdit || canDelete;

    const totalPages = Math.ceil(meta.total_items / meta.per_page);

    return (
        <div className="flex flex-col h-full print:hidden">
            <div className="flex-1 border border-gray-400 bg-white overflow-auto relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                        <span className="font-bold">{t("expense.table.loading")}</span>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-0 shadow-sm">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-12 text-center">
                                {t("expense.table.id")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24">
                                {t("expense.table.date")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                {t("expense.table.category")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                                {t("expense.table.desc")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                {t("expense.table.user")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-right text-xs font-bold uppercase w-24">
                                {t("expense.table.amount")}
                            </th>
                            {showActions && <th className="p-2 text-center text-xs font-bold uppercase w-24">
                                {t("expense.table.actions")}
                            </th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {expenses.length === 0 ? (
                            <tr><td colSpan={showActions ? 7 : 6} className="p-4 text-center text-gray-500 italic">
                                {t("expense.table.no_records")}
                            </td></tr>
                        ) : (
                            expenses.map((exp, idx) => (
                                <tr key={exp.id} className="hover:bg-blue-50 group">
                                    <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs">
                                        {idx + 1 + ((meta.current_page - 1) * meta.per_page)}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 whitespace-nowrap text-xs">
                                        {new Date(exp.date!).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 border-r border-gray-100">
                                        <span className="px-1 bg-gray-100 border border-gray-300 text-[10px] uppercase font-bold">{exp.category_name}</span>
                                    </td>
                                    <td className="p-2 border-r border-gray-100">{exp.description}</td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-gray-500">{exp.user_name}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-700">
                                        {exp.amount.toLocaleString()}
                                    </td>
                                    {showActions && (
                                        <td className="p-2 text-center flex items-center justify-center gap-2">
                                            {canEdit && (
                                                <button onClick={() => onEdit(exp)} title="Edit" className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => onDelete(exp.id!)} title="Delete" className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-2 flex items-center justify-between bg-white border border-gray-400 p-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase">{t("expense.table.show")}</span>
                    <input
                        type="number"
                        value={meta.per_page}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="w-16 h-7 border border-gray-400 px-1 text-center text-sm font-bold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={meta.current_page === 1}
                        onClick={() => onPageChange(meta.current_page - 1)}
                        className="px-3 py-1 bg-gray-200 border border-gray-400 text-xs font-bold hover:bg-gray-300 disabled:opacity-50"
                    >
                        {t("expense.table.prev")}
                    </button>
                    <span className="text-xs font-bold">
                        {t("expense.table.page")} {meta.current_page} {t("expense.table.of")} {totalPages || 1}
                    </span>
                    <button
                        disabled={meta.current_page >= totalPages}
                        onClick={() => onPageChange(meta.current_page + 1)}
                        className="px-3 py-1 bg-gray-200 border border-gray-400 text-xs font-bold hover:bg-gray-300 disabled:opacity-50"
                    >
                        {t("expense.table.next")}
                    </button>
                </div>
            </div>
        </div>
    );
}