"use client";

import React from "react";
import { InventoryItem } from "@/lib/api/inventory";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    items: InventoryItem[];
    filterText: string;
}

export default function PrintInventory({ items, filterText }: Props) {
    const { t, settings } = useSettings();

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
        <div className="hidden print:block fixed inset-0 w-screen h-screen bg-white z-[9999] top-0 left-0">
            <style jsx global>{`
                @media print {
                    @page { size: A4 landscape; margin: 5mm; } 
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>

            <table className="w-full border-collapse font-sans text-black">
                {/* Header */}
                <thead>
                    <tr>
                        <th colSpan={9} className="w-full pb-4">
                            {settings.headerA4 ? (
                                <img
                                    src={settings.headerA4}
                                    alt="Header"
                                    className="w-full h-auto object-contain max-h-[150px]"
                                />
                            ) : (
                                <div></div>
                            )}
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={9} className="text-center pb-4">
                            <h1 className="text-xl font-bold uppercase">{t("inventory.table.print_title")}</h1>
                            <p className="text-xs font-normal text-gray-600">{filterText}</p>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-1 border-r border-black text-center text-[9px] uppercase w-10">{t("inventory.table.id")}</th>
                        <th className="p-1 border-r border-black text-left text-[9px] uppercase">{t("inventory.table.name")}</th>
                        <th className="p-1 border-r border-black text-center text-[9px] uppercase w-16">{t("inventory.table.unit")}</th>
                        <th className="p-1 border-r border-black text-right text-[9px] uppercase w-16">{t("inventory.table.cost")}</th>
                        <th className="p-1 border-r border-black text-right text-[9px] uppercase w-16">{t("inventory.table.sell_price")}</th>
                        <th className="p-1 border-r border-black text-right text-[9px] uppercase w-16">{t("inventory.table.whl_price")}</th>
                        <th className="p-1 border-r border-black text-right text-[9px] uppercase w-16">{t("inventory.table.pkt_price")}</th>
                        <th className="p-1 border-r border-black text-center text-[9px] uppercase w-12">{t("inventory.table.stock")}</th>
                        <th className="p-1 text-center text-[9px] uppercase w-20">{t("inventory.table.expiry")}</th>
                    </tr>
                </thead>

                {/* Footer */}
                {/* <tfoot>
                    <tr>
                        <td colSpan={9} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr>
                </tfoot> */}

                {/* Body */}
                <tbody className="text-[9px]">
                    {items.map((item, idx) => (
                        <tr key={item.id} className="border border-black">
                            <td className="p-1 border-r border-black text-center">{item.id}</td>
                            <td className="p-1 border-r border-black font-bold truncate max-w-[150px]">{item.name}</td>

                            {/* TRANSLATED UNIT */}
                            <td className="p-1 border-r border-black text-center uppercase">
                                {getUnitLabel(item.unit_type)}
                            </td>

                            <td className="p-1 border-r border-black text-right">{item.cost_price?.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right">{item.single_price?.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right">{item.wholesale_price?.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right">{item.packet_price?.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-center font-bold">{item.current_quantity}</td>
                            <td className="p-1 text-center">{item.expiration_date || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}