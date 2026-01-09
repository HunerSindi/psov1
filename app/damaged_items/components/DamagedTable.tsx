"use client";
import { DamagedItem } from "@/lib/api/damaged_items";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Edit, Trash2 } from "lucide-react";

interface Props {
    items: DamagedItem[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onEdit: (item: DamagedItem) => void;
    onDelete: (id: number) => void;
}

export default function DamagedTable({ items, loading, page, totalPages, onPageChange, onEdit, onDelete }: Props) {
    const { t } = useSettings();

    if (loading) return <div className="p-4 text-center text-gray-500 uppercase text-xs font-bold">Loading...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto border border-gray-400">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-10">{t("damaged_items.table.id")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("damaged_items.table.item")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("damaged_items.table.user")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-16 text-center">{t("damaged_items.table.qty")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-20">{t("damaged_items.table.unit")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-right">{t("damaged_items.table.cost")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-right">{t("damaged_items.table.total_loss")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("damaged_items.table.reason")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-32">{t("damaged_items.table.date")}</th>
                            <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-20 text-center">{t("damaged_items.table.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.length === 0 ? (
                            <tr><td colSpan={10} className="p-4 text-center text-xs text-gray-400 uppercase italic">No records found</td></tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-red-50 group">
                                    <td className="p-2 text-xs font-mono text-gray-500 border-r">{item.id}</td>
                                    <td className="p-2 text-xs font-bold text-gray-800 border-r">{item.item_name}</td>
                                    <td className="p-2 text-xs text-gray-600 border-r">{item.user_name}</td>
                                    <td className="p-2 text-xs font-bold text-center border-r">{item.quantity}</td>
                                    <td className="p-2 text-xs text-gray-600 border-r">{item.unit_type}</td>
                                    <td className="p-2 text-xs text-right font-mono border-r">{item.cost_price_snapshot?.toLocaleString()}</td>
                                    <td className="p-2 text-xs text-right font-bold text-red-700 font-mono border-r">{item.total_loss?.toLocaleString()}</td>
                                    <td className="p-2 text-xs text-gray-600 border-r truncate max-w-[150px]">{item.reason}</td>
                                    <td className="p-2 text-[10px] text-gray-500 font-mono border-r">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-2 text-center flex justify-center gap-2">
                                        <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(item.id!)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-2 bg-gray-50 border-t border-gray-400 flex justify-end gap-2">
                    <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">Prev</button>
                    <span className="px-3 py-1 text-xs font-bold">{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
}