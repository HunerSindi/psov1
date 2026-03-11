"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: SaleDetail['items'];
    showCostProfit?: boolean;
}

export default function LoanTable({ items, showCostProfit }: Props) {
    const { t } = useSettings();

    // Helper for Units
    const getUnitLabel = (type: string) => {
        if (type.includes("packet")) return t("sale_ticket.topbar.unit_packet") || "Packet";
        if (type.includes("wholesale")) return t("sale_ticket.topbar.unit_wholesale") || "Wholesale";
        return t("sale_ticket.topbar.unit_single") || "Single";
    };

    return (
        <div className="bg-white mb-6 font-sans">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-y-2 border-black">
                    <tr>
                        <th className="py-2 px-1 text-xs font-bold uppercase text-black">
                            {t("sale_ticket.table.headers.desc")}
                        </th>
                        <th className="py-2 px-1 text-xs font-bold uppercase text-center w-16 text-black">
                            {t("sale_ticket.table.headers.unit")}
                        </th>
                        <th className="py-2 px-1 text-xs font-bold uppercase text-right w-24 text-black">
                            {t("sale_ticket.table.headers.price")}
                        </th>
                        <th className="py-2 px-1 text-xs font-bold uppercase text-center w-16 text-black">
                            {t("sale_ticket.table.headers.qty")}
                        </th>
                        <th className="py-2 px-1 text-xs font-bold uppercase text-right w-28 text-black">
                            {t("sale_ticket.table.headers.total")}
                        </th>
                        {showCostProfit && (
                            <>
                                <th className="py-2 px-1 text-xs font-bold uppercase text-right w-24 text-black">
                                    {t("sales_history.detail.cost")}
                                </th>
                                <th className="py-2 px-1 text-xs font-bold uppercase text-right w-24 text-black">
                                    {t("sales_history.detail.profit")}
                                </th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="text-sm text-black">
                    {items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300 last:border-0 hover:bg-gray-50">
                            <td className="py-3 px-1 font-bold">{item.item_name}</td>
                            <td className="py-3 px-1 text-center uppercase text-xs">
                                {getUnitLabel(item.unit_type)}
                            </td>
                            <td className="py-3 px-1 text-right font-mono">{item.price.toLocaleString()}</td>
                            <td className="py-3 px-1 text-center font-bold">{item.quantity}</td>
                            <td className="py-3 px-1 text-right font-mono font-bold">{item.subtotal.toLocaleString()}</td>
                            {showCostProfit && (
                                <>
                                    <td className="py-3 px-1 text-right font-mono">{(item.cost ?? 0).toLocaleString()}</td>
                                    <td className="py-3 px-1 text-right font-mono text-green-700">{(item.profit ?? 0).toLocaleString()}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}