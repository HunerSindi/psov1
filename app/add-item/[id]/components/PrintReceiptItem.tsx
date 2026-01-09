"use client";

import React from "react";
import { ReceiptItem } from "@/lib/api/receipts";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: ReceiptItem[];
}

export default function PrintReceiptItem({ items }: Props) {
    const { t, settings } = useSettings();

    // Helper: Convert 0 to "-"
    const fmt = (val: number, isCurrency = false) => {
        if (!val || val === 0) return <span>-</span>;
        return isCurrency ? val.toLocaleString() : val;
    };

    return (
        <>
            <div className="hidden print:block w-full font-sans text-black">
                <table className="w-full border-collapse">

                    {/* REPEATING HEADER IMAGE */}
                    <thead>
                        <tr>
                            <th colSpan={11} className="w-full pb-4">
                                {settings.headerA4 ? (
                                    <img
                                        src={settings.headerA4}
                                        alt="Header"
                                        className="w-full h-auto max-h-[150px]"
                                    />
                                ) : (
                                    <div></div>
                                )}
                            </th>
                        </tr>
                        {/* Column Headers */}
                        <tr className="border border-black">
                            <th className="text-left text-[10px] uppercase p-1 border-r border-black w-10">{t("add_item.print_id")}</th>
                            <th className="text-left text-[10px] uppercase p-1 border-r border-black">{t("add_item.print_name")}</th>
                            <th className="text-center text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_qty")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_pkt_cost")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_cost")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_price")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_whl")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_pkt_price")}</th>
                            <th className="text-right text-[10px] uppercase p-1 border-r border-black w-16">{t("add_item.print_pkt_whl")}</th>
                            <th className="text-center text-[10px] uppercase p-1 border-r border-black w-20">{t("add_item.print_expire")}</th>
                            <th className="text-center text-[10px] uppercase p-1 w-16">{t("add_item.print_type")}</th>
                        </tr>
                    </thead>

                    {/* REPEATING FOOTER IMAGE */}
                    <tfoot>
                        <tr>
                            <td colSpan={11} className="w-full pt-4">
                                {settings.footerA4 ? (
                                    <img
                                        src={settings.footerA4}
                                        alt="Header"
                                        className="w-full h-auto max-h-[100px]"
                                    />
                                ) : (
                                    <div></div>
                                )}
                            </td>
                        </tr>
                    </tfoot>

                    {/* DATA BODY */}
                    <tbody className="text-[10px]">
                        {items.map((item, idx) => (
                            <tr key={item.id} className="border border-black">
                                <td className="p-1 border-r border-black text-center">{idx + 1}</td>
                                <td className="p-1 border-r border-black font-bold">{item.item_name}</td>
                                <td className="p-1 border-r border-black text-center">{fmt(item.quantity)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.packet_cost_price, true)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.cost_price, true)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.single_price, true)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.wholesale_price, true)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.packet_price, true)}</td>
                                <td className="p-1 border-r border-black text-right">{fmt(item.packet_wholesale_price, true)}</td>
                                <td className="p-1 border-r border-black text-center">{item.expiration_date}</td>
                                <td className="p-1 text-center text-[8px] uppercase">{item.unit_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 5mm; 
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}