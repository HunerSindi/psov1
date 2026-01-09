"use client";

import { SaleHistoryItem } from "@/lib/api/sales-history";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    data: SaleHistoryItem[];
    loading: boolean;
    meta: { current_page: number; total_pages: number; total_items: number };
    onPageChange: (page: number) => void;
}

export default function HistoryTable({ data, loading, meta, onPageChange }: Props) {
    const router = useRouter();
    const { t } = useSettings(); // Hook

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400 shadow-sm">

            {/* Table Area (Scrollable) */}
            <div className="flex-1 overflow-auto relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-bold text-sm uppercase bg-white px-4 py-2 border shadow">
                            {t("sales_history.table.loading")}
                        </span>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-16 text-center">
                                {t("sales_history.table.ticket")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                {t("sales_history.table.date")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                                {t("sales_history.table.customer")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-center">
                                {t("sales_history.table.type")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-center">
                                {t("sales_history.table.status")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-24">
                                {t("sales_history.table.total")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-20">
                                {t("sales_history.table.disc")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-24">
                                {t("sales_history.table.final")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-24">
                                {t("sales_history.table.paid")}
                            </th>
                            <th className="p-2 text-xs font-bold uppercase text-center w-12">
                                {t("sales_history.table.act")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500 italic">
                                    {t("sales_history.table.no_records")}
                                </td>
                            </tr>
                        ) : (
                            data.map((sale, idx) => (
                                <tr key={sale.id} className="hover:bg-blue-50 group transition-colors">
                                    <td className="p-2 border-r border-gray-100 font-mono text-xs text-center text-gray-500">
                                        #{sale.id}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs whitespace-nowrap text-gray-700">
                                        {new Date(sale.date).toLocaleDateString()} <span className="text-gray-400 text-[10px]">{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs">
                                        {sale.customer_name || t("sales_history.table.guest")}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-center">
                                        {/* Translated Type Badge */}
                                        <span className={`px-1.5 py-0.5 border text-[10px] uppercase font-bold rounded-sm ${sale.payment_type === 'installment' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                            sale.payment_type === 'cash' ? 'bg-green-50 border-green-200 text-green-700' :
                                                'bg-orange-50 border-orange-200 text-orange-700'
                                            }`}>
                                            {sale.payment_type === 'cash' ? t("sales_history.filters.cash") :
                                                sale.payment_type === 'loan' ? t("sales_history.filters.loan") :
                                                    t("sales_history.filters.installment")}
                                        </span>
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-center">
                                        <span className={`px-1 border text-[10px] uppercase font-bold ${sale.status === 'finished' ? 'text-gray-600 border-gray-200' : 'bg-red-50 border-red-200 text-red-700'
                                            }`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-right text-gray-400">
                                        {sale.total_amount.toLocaleString()}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-right text-red-400">
                                        {sale.discount_value > 0 ? sale.discount_value.toLocaleString() : "-"}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-right font-bold text-black">
                                        {sale.final_amount.toLocaleString()}
                                    </td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-right font-bold text-blue-700">
                                        {sale.paid_amount.toLocaleString()}
                                    </td>

                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => router.push(`/add-item/history/${sale.id}`)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
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
            <div className="border-t border-gray-400 p-2 bg-gray-100 flex justify-between items-center shrink-0 z-20">
                <span className="text-xs font-bold text-gray-600">
                    {t("sales_history.table.total_records")}: {meta.total_items}
                </span>
                <div className="flex gap-1 items-center">
                    <button
                        disabled={meta.current_page <= 1}
                        onClick={() => onPageChange(meta.current_page - 1)}
                        className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                        {t("sales_history.table.prev")}
                    </button>
                    <span className="px-3 py-1 text-xs font-bold flex items-center bg-white border border-gray-300 h-full">
                        {meta.current_page} / {meta.total_pages || 1}
                    </span>
                    <button
                        disabled={meta.current_page >= meta.total_pages}
                        onClick={() => onPageChange(meta.current_page + 1)}
                        className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                        {t("sales_history.table.next")}
                    </button>
                </div>
            </div>
        </div>
    );
}