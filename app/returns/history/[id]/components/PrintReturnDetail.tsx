"use client";

import React from "react";
import { ReturnDetail } from "@/lib/api/returns";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    data: ReturnDetail;
}

export default function PrintReturnDetail({ data }: Props) {
    const { t, settings } = useSettings();
    const { return_info, items } = data;

    // Helper to translate unit types
    const getUnitLabel = (unit: string) => {
        if (unit.includes("packet")) return t("returns.sidebar.packet");
        if (unit.includes("wholesale")) return t("returns.sidebar.wholesale");
        return t("returns.sidebar.single");
    };

    return (
        <div className="hidden print:block fixed inset-0 w-screen h-screen bg-white z-[9999] top-0 left-0">
            <style jsx global>{` @media print { @page { size: A4; margin: 10mm; } body { -webkit-print-color-adjust: exact; } } `}</style>

            <table className="w-full border-collapse font-sans text-black">
                {/* Header */}
                <thead>
                    <tr>
                        <th colSpan={5} className="pb-4">
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
                    <tr>
                        <th colSpan={5} className="text-left pb-4 font-normal">
                            <div className="flex justify-between items-end border-b border-black pb-2">
                                <div>
                                    <h1 className="text-xl font-bold uppercase">
                                        {t("return_history.detail.print_receipt_title")} #{return_info.id}
                                    </h1>
                                    <div className="text-xs mt-1">
                                        {t("return_history.table.employee")}: <b>{return_info.employee || return_info.employee_name}</b>
                                    </div>
                                </div>
                                <div className="text-right text-xs">
                                    <div>
                                        {t("return_history.table.date")}: <b>{new Date(return_info.created_at).toLocaleDateString()}</b>
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase">
                            {t("return_history.detail.items_desc")}
                        </th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">
                            {t("return_history.detail.unit")}
                        </th>
                        <th className="p-2 border-r border-black text-right text-[10px] uppercase w-20">
                            {t("return_history.detail.price")}
                        </th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">
                            {t("return_history.detail.qty")}
                        </th>
                        <th className="p-2 text-right text-[10px] uppercase w-24">
                            {t("return_history.detail.total")}
                        </th>
                    </tr>
                </thead>

                {/* Footer */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={4} className="text-right p-2 text-xs uppercase border-r border-black">
                            {t("return_history.detail.total_refund")}
                        </td>
                        <td className="text-right p-2 text-xs">{return_info.total_refund.toLocaleString()}</td>
                    </tr>
                    {/* <tr><td colSpan={5} className="pt-4"><img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" /></td></tr> */}
                </tfoot>

                {/* Body */}
                <tbody className="text-[10px]">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border border-black">
                            <td className="p-2 border-r border-black font-bold">{item.item_name}</td>
                            <td className="p-2 border-r border-black text-center uppercase">
                                {getUnitLabel(item.unit_type)}
                            </td>
                            <td className="p-2 border-r border-black text-right">{item.price_per_unit.toLocaleString()}</td>
                            <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                            <td className="p-2 text-right font-bold">{item.total_amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}