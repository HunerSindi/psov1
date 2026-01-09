"use client";
import React from "react";
import { DamagedItem } from "@/lib/api/damaged_items";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: DamagedItem[];
}

export default function PrintDamagedList({ items }: Props) {
    const { t, settings } = useSettings();
    const totalLoss = items.reduce((acc, i) => acc + (i.total_loss || 0), 0);

    return (
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-0 m-0">
            <style jsx global>{`
                @media print {
                    @page { size: A4; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            <table className="w-full border-collapse font-sans text-black">
                <thead>
                    <tr>
                        <th colSpan={7} className="w-full pb-4">
                            {settings.headerA4 && (
                                <img src={settings.headerA4} alt="Header" className="w-full h-auto max-h-[150px]" />
                            )}
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={7} className="text-center pb-4 border-b border-black">
                            <h1 className="text-xl font-bold uppercase">{t("damaged_items.title")}</h1>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-10">{t("damaged_items.table.id")}</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase">{t("damaged_items.table.item")}</th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">{t("damaged_items.table.qty")}</th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-20">{t("damaged_items.table.unit")}</th>
                        <th className="p-2 border-r border-black text-right text-[10px] uppercase w-24">{t("damaged_items.table.cost")}</th>
                        <th className="p-2 border-r border-black text-right text-[10px] uppercase w-24">{t("damaged_items.table.total_loss")}</th>
                        <th className="p-2 text-left text-[10px] uppercase">{t("damaged_items.table.reason")}</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={5} className="text-right p-2 text-xs uppercase border-r border-black">Total Loss:</td>
                        <td className="text-right p-2 text-xs">{totalLoss.toLocaleString()}</td>
                        <td></td>
                    </tr>
                </tfoot>
                <tbody className="text-[10px]">
                    {items.map((item) => (
                        <tr key={item.id} className="border border-black">
                            <td className="p-2 border-r border-black text-center">{item.id}</td>
                            <td className="p-2 border-r border-black font-bold">{item.item_name}</td>
                            <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                            <td className="p-2 border-r border-black text-center">{item.unit_type}</td>
                            <td className="p-2 border-r border-black text-right">{item.cost_price_snapshot?.toLocaleString()}</td>
                            <td className="p-2 border-r border-black text-right font-bold">{item.total_loss?.toLocaleString()}</td>
                            <td className="p-2">{item.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}