"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    data: any[];
    loading: boolean;
    meta: { page: number; total: number; limit: number };
    onPageChange: (page: number) => void;
}

export default function ReturnHistoryTable({ data, loading, meta, onPageChange }: Props) {
    const router = useRouter();
    const { t } = useSettings();

    return (
        <div className="bg-white border border-gray-400 flex-1 flex flex-col overflow-hidden print:hidden">
            {/* Table Container */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-12 text-center">
                                {t("return_history.table.id")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-32">
                                {t("return_history.table.date")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-40">
                                {t("return_history.table.employee")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">
                                {t("return_history.table.note")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">
                                {t("return_history.table.refund")}
                            </th>
                            <th className="p-2 text-[10px] font-bold uppercase w-16 text-center">
                                {t("return_history.table.view")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-xs">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">
                                {t("return_history.table.loading")}
                            </td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">
                                {t("return_history.table.no_records")}
                            </td></tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="hover:bg-blue-50 group">
                                    <td className="p-1 border-r border-gray-100 font-mono text-center text-gray-500">{row.id}</td>
                                    <td className="p-1 border-r border-gray-100 font-mono">
                                        {new Date(row.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="p-1 border-r border-gray-100 font-bold text-gray-800">
                                        {row.employee_name || t("return_history.table.unknown")}
                                    </td>
                                    <td className="p-1 border-r border-gray-100 text-gray-500 italic truncate max-w-xs">
                                        {row.note || "-"}
                                    </td>
                                    <td className="p-1 border-r border-gray-100 text-right font-mono font-bold text-red-600">
                                        {row.total_refund.toLocaleString()}
                                    </td>
                                    <td className="p-1 text-center">
                                        <button
                                            onClick={() => router.push(`/returns/history/${row.id}`)}
                                            className="text-blue-600 hover:text-black flex justify-center w-full"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-between items-center bg-white border-t border-gray-400 p-1 px-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {t("return_history.table.records")}: {meta.total}
                </span>
                <div className="flex gap-1">
                    <button
                        disabled={meta.page <= 1}
                        onClick={() => onPageChange(meta.page - 1)}
                        className="px-2 py-0.5 bg-gray-100 border border-gray-400 text-[10px] font-bold uppercase hover:bg-gray-200 disabled:opacity-50"
                    >
                        {t("return_history.table.prev")}
                    </button>
                    <span className="px-3 py-0.5 text-[10px] font-bold border border-gray-200 min-w-[24px] text-center">
                        {meta.page}
                    </span>
                    <button
                        disabled={meta.page * meta.limit >= meta.total}
                        onClick={() => onPageChange(meta.page + 1)}
                        className="px-2 py-0.5 bg-gray-100 border border-gray-400 text-[10px] font-bold uppercase hover:bg-gray-200 disabled:opacity-50"
                    >
                        {t("return_history.table.next")}
                    </button>
                </div>
            </div>
        </div>
    );
}