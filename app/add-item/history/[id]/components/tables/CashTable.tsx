"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: SaleDetail['items'];
}

export default function CashTable({ items }: Props) {
    const { t } = useSettings();

    // Helper for Units
    const getUnitLabel = (type: string) => {
        if (type.includes("packet")) return t("sale_ticket.topbar.unit_packet") || "Packet";
        if (type.includes("wholesale")) return t("sale_ticket.topbar.unit_wholesale") || "Wholesale";
        return t("sale_ticket.topbar.unit_single") || "Single";
    };

    return (
        <div className="font-sans text-black bg-white">
            <table className="w-full border-collapse">
                {/* Headers */}
                <thead className="border border-black bg-gray-100">
                    <tr>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-10">
                            {t("sale_ticket.table.headers.hash")}
                        </th>
                        <th className="p-2 border border-black text-left text-[10px] uppercase">
                            {t("sale_ticket.table.headers.desc")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-16">
                            {t("sale_ticket.table.headers.unit")}
                        </th>
                        <th className="p-2 border border-black text-right text-[10px] uppercase w-20">
                            {t("sale_ticket.table.headers.price")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-16">
                            {t("sale_ticket.table.headers.qty")}
                        </th>
                        <th className="p-2 text-right text-[10px] uppercase w-24 border border-black">
                            {t("sale_ticket.table.headers.total")}
                        </th>
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="text-[10px]">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border border-black">
                            <td className="p-2 border border-black text-center font-mono">{idx + 1}</td>
                            <td className="p-2 border border-black font-bold">{item.item_name}</td>
                            <td className="p-2 border border-black text-center uppercase text-[9px]">
                                {getUnitLabel(item.unit_type)}
                            </td>
                            <td className="p-2 border border-black text-right font-mono">{item.price.toLocaleString()}</td>
                            <td className="p-2 border border-black text-center font-bold">{item.quantity}</td>
                            <td className="p-2 border border-black text-right font-bold font-mono">{item.subtotal.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}