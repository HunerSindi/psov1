"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";

interface ReturnItem {
    item_name: string;
    unit_type: string;
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    restocked: boolean;
}

interface Props {
    items: ReturnItem[];
}

export default function ReturnTable({ items }: Props) {
    const { t } = useSettings();

    // Helper to translate unit types
    const getUnitLabel = (unit: string) => {
        if (unit.includes("packet")) return t("returns.sidebar.packet");
        if (unit.includes("wholesale")) return t("returns.sidebar.wholesale");
        return t("returns.sidebar.single");
    };

    return (
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-10 text-center">
                            {t("returns.table.id")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                            {t("returns.table.item")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-center">
                            {t("returns.table.unit")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-16 text-center">
                            {t("returns.table.qty")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-right">
                            {t("returns.table.price")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-24 text-right">
                            {t("returns.table.total")}
                        </th>
                        <th className="p-2 text-xs font-bold uppercase w-16 text-center">
                            {t("returns.table.stocked")}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                                {t("returns.table.empty")}
                            </td>
                        </tr>
                    ) : (
                        items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-red-50 transition-colors">
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500">
                                    {idx + 1}
                                </td>
                                <td className="p-2 border-r border-gray-100 font-bold">
                                    {item.item_name}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-center text-xs uppercase">
                                    {getUnitLabel(item.unit_type)}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-center font-bold">
                                    {item.quantity}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-right font-mono">
                                    {item.price_per_unit.toLocaleString()}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">
                                    {item.total_amount.toLocaleString()}
                                </td>
                                <td className="p-2 text-center text-xs">
                                    {item.restocked
                                        ? <span className="text-green-600 font-bold">{t("returns.table.yes")}</span>
                                        : <span className="text-red-400">{t("returns.table.no")}</span>
                                    }
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}