"use client";

import React from "react";
import { ReceiptItem } from "@/lib/api/receipts";
import { Printer } from "lucide-react";
import PrintReceiptItem from "./PrintReceiptItem";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: ReceiptItem[];
}

export default function ReceiptItemsTable({ items }: Props) {
    const { t } = useSettings();

    // Helper: 0 -> "-"
    const fmt = (val: number, isCurrency = false) => {
        if (!val || val === 0) return <span className="text-gray-300">-</span>;
        return isCurrency ? val.toLocaleString() : val;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        // Root is h-full to fill the parent wrapper from the Page component
        <div className="flex flex-col h-full font-sans border border-gray-400 bg-white">

            {/* --- CONTROLS (Fixed at top of table) --- */}
            <div className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-400 shrink-0 print:hidden">
                <h3 className="font-bold text-sm uppercase text-gray-800 tracking-wide">
                    {t("add_item.items_title")} ({items.length})
                </h3>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase hover:bg-gray-800 transition-colors rounded-none"
                >
                    <Printer size={14} />
                    {t("add_item.print")}
                </button>
            </div>

            {/* --- SCREEN VIEW (Scrollable Area) --- */}
            <div className="flex-1 overflow-auto bg-white relative print:hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-center w-10">#</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.item_name_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-center">{t("add_item.unit_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-center bg-yellow-50">{t("add_item.qty_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-center bg-blue-50">{t("add_item.pkt_qty_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.cost_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.price_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.whl_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.pkt_cost_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.pkt_price_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-right">{t("add_item.pkt_whl_label")}</th>
                            <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 uppercase text-center">{t("add_item.expires_label")}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="p-10 text-center italic text-gray-500 border border-gray-300">
                                    {t("add_item.no_items_added")}
                                </td>
                            </tr>
                        ) : (
                            items.map((item, idx) => (
                                <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="border border-gray-300 px-2 py-1 text-center text-gray-500 font-mono text-xs">
                                        {idx + 1}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 font-medium text-gray-800">
                                        {item.item_name}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center text-xs uppercase">
                                        {item.unit_type}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center font-bold bg-yellow-50/30">
                                        {fmt(item.quantity)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center font-bold text-blue-700 bg-blue-50/30">
                                        {fmt(item.packet_quantity)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">
                                        {fmt(item.cost_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono font-bold">
                                        {fmt(item.single_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">
                                        {fmt(item.wholesale_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">
                                        {fmt(item.packet_cost_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">
                                        {fmt(item.packet_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">
                                        {fmt(item.packet_wholesale_price, true)}
                                    </td>
                                    <td className="border border-gray-300 px-2 py-1 text-center text-xs text-gray-600">
                                        {item.expiration_date}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PRINT COMPONENT (Hidden from screen) --- */}
            <PrintReceiptItem items={items} />

        </div>
    );
}