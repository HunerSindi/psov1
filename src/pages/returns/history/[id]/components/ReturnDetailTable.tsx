"use client";

import { ReturnItem, ReturnInfo } from "@/lib/api/returns";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    items: ReturnItem[];
    info: ReturnInfo;
}

export default function ReturnDetailTable({ items, info }: Props) {
    const { t } = useSettings();

    // Helper to translate unit types
    const getUnitLabel = (unit: string) => {
        if (unit.includes("packet")) return t("returns.sidebar.packet");
        if (unit.includes("wholesale")) return t("returns.sidebar.wholesale");
        return t("returns.sidebar.single");
    };

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400">
            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-10 text-center">
                                {t("return_history.table.id")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">
                                {t("return_history.detail.items_desc")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-center">
                                {t("return_history.detail.unit")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-16 text-center">
                                {t("return_history.detail.qty")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">
                                {t("return_history.detail.price")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">
                                {t("return_history.detail.total")}
                            </th>
                            <th className="p-2 text-[10px] font-bold uppercase w-16 text-center">
                                {t("return_history.detail.restock")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-red-50">
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs">{idx + 1}</td>
                                <td className="p-2 border-r border-gray-100 font-bold">{item.item_name}</td>
                                <td className="p-2 border-r border-gray-100 text-center uppercase text-xs">
                                    {getUnitLabel(item.unit_type)}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-center font-bold">{item.quantity}</td>
                                <td className="p-2 border-r border-gray-100 text-right font-mono text-xs">{item.price_per_unit.toLocaleString()}</td>
                                <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">{item.total_amount.toLocaleString()}</td>
                                <td className={`p-2 text-center text-[10px] font-bold uppercase ${item.restocked ? "text-green-600" : "text-red-400"}`}>
                                    {item.restocked ? t("return_history.detail.yes") : t("return_history.detail.no")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Footer */}
            <div className="bg-red-50 border-t border-gray-400 p-3 flex justify-end">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase text-red-800">
                        {t("return_history.detail.total_refund")}
                    </span>
                    <span className="text-xl font-bold font-mono text-red-700 bg-white px-2 py-1 border border-red-200">
                        {info.total_refund.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}