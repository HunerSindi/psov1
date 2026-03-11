"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InventoryItem, deleteItem } from "@/lib/api/inventory";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Edit, Trash2, Tag } from "lucide-react";

interface Props {
    items: InventoryItem[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onRefresh: () => void;
    returnQuery?: string; // preserve page/filters when opening define-item so Back restores view
}

export default function InventoryTable({ items, loading, page, totalPages, onPageChange, onRefresh, returnQuery }: Props) {
    const { t } = useSettings();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleEdit = (barcode: string) => {
        const base = `/define-item?scan=${encodeURIComponent(barcode)}&from=inventory`;
        const url = returnQuery ? `${base}&${returnQuery}` : base;
        navigate(url);
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t("inventory.actions.confirm_delete") || "Are you sure you want to delete this item?")) return;

        setDeletingId(id);
        const success = await deleteItem(id);
        if (success) {
            onRefresh(); // Reload data
        } else {
            alert("Failed to delete item");
        }
        setDeletingId(null);
    };

    // --- HELPER TO TRANSLATE UNITS ---
    const getUnitLabel = (type: string) => {
        switch (type) {
            case "single": return t("define_item.unit_single");
            case "single-wholesale": return t("define_item.unit_wholesale");
            case "single-packet": return t("define_item.unit_packet");
            case "single-packet-wholesale": return t("define_item.unit_packet_wholesale");
            case "kg": return t("define_item.unit_kg");
            case "cm": return t("define_item.unit_cm");
            case "m": return t("define_item.unit_m");
            default: return type;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400">
            {/* Table Area */}
            <div className="flex-1 overflow-auto relative min-h-0">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <span className="font-bold text-sm uppercase animate-pulse">
                            {t("inventory.table.loading")}
                        </span>
                    </div>
                )}

                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-20 shadow-sm">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-12 text-center">
                                {t("inventory.table.id")}
                            </th>

                            {/* NEW: Barcode Column */}
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                {t("inventory.table.barcode") || "Barcode"}
                            </th>

                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase min-w-[50px]">
                                {t("inventory.table.name")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-center">
                                {t("inventory.table.unit")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-20">
                                {t("inventory.table.cost")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-20">
                                {t("inventory.table.sell_price")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-20">
                                {t("inventory.table.whl_price")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-20">
                                {t("inventory.table.pkt_price")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-center w-20">
                                {t("inventory.table.stock")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-center">
                                {t("inventory.table.expiry")}
                            </th>

                            {/* NEW: Actions Column */}
                            <th className="p-2 text-xs font-bold uppercase w-24 text-center sticky right-0 bg-gray-100 z-30 shadow-l">
                                {t("inventory.table.actions") || "Actions"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {items.length === 0 ? (
                            <tr><td colSpan={11} className="p-8 text-center text-gray-500 italic">
                                {t("inventory.table.no_data")}
                            </td></tr>
                        ) : (
                            items.map((item) => {
                                const isLowStock = (item.current_quantity || 0) <= (item.alert_quantity || 0);
                                const primaryBarcode = item.barcodes && item.barcodes.length > 0 ? item.barcodes[0] : "---";
                                const allBarcodes = item.barcodes ? item.barcodes.join("\n") : "";

                                return (
                                    <tr key={item.id} className="hover:bg-blue-50 group">
                                        <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">{item.id}</td>

                                        {/* BARCODE COLUMN with TOOLTIP */}
                                        <td className="p-2 border-r border-gray-100 font-mono text-xs text-gray-600 relative group/barcode cursor-help">
                                            <div className="flex items-center gap-1">
                                                <Tag size={10} className="text-gray-400" />
                                                <span className="truncate max-w-[100px]">{primaryBarcode}</span>
                                            </div>

                                            {/* Tooltip on Hover */}
                                            {item.barcodes && item.barcodes.length > 1 && (
                                                <div className="absolute left-0 top-full mt-1 hidden group-hover/barcode:block bg-black text-white text-[10px] p-2 rounded z-50 whitespace-pre shadow-lg min-w-[120px]">
                                                    <div className="font-bold border-b border-gray-600 mb-1 pb-1">All Barcodes:</div>
                                                    {allBarcodes}
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-2 border-r border-gray-100 font-bold text-gray-800">{item.name}</td>

                                        <td className="p-2 border-r border-gray-100 text-center text-[10px] font-bold uppercase">
                                            {getUnitLabel(item.unit_type)}
                                        </td>

                                        <td className="p-2 border-r border-gray-100 text-right font-mono text-gray-700">
                                            {(item.cost_price ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-black">
                                            {(item.single_price ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono text-gray-700">
                                            {(item.wholesale_price ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono text-gray-700">
                                            {(item.packet_price ?? 0).toLocaleString()}
                                        </td>

                                        <td className={`p-2 border-r border-gray-100 text-center font-bold ${isLowStock ? "text-red-600 bg-red-50" : "text-green-700"}`}>
                                            {item.current_quantity || 0}
                                        </td>
                                        <td className="p-2 border-r border-gray-100 text-center text-xs font-mono">
                                            {item.expiration_date || "-"}
                                        </td>

                                        {/* ACTION COLUMN */}
                                        <td className="p-2 text-center sticky right-0 bg-white group-hover:bg-blue-50">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(primaryBarcode)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded"
                                                    title="Edit Item"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deletingId === item.id}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded disabled:opacity-50"
                                                    title="Delete Item"
                                                >
                                                    {deletingId === item.id ? (
                                                        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin block"></span>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t border-gray-400 p-2 bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600">
                    {t("inventory.table.total_pages")}: {totalPages}
                </span>
                <div className="flex gap-1">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
                    >
                        {t("inventory.table.prev")}
                    </button>
                    <span className="px-3 py-1 text-xs font-bold flex items-center bg-white border border-gray-400">
                        {page}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
                    >
                        {t("inventory.table.next")}
                    </button>
                </div>
            </div>
        </div>
    );
}