"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    data: any[];
}

export default function PrintReturnHistory({ data }: Props) {
    const { t, settings } = useSettings();
    const totalRefundsOnPage = data.reduce((acc, curr) => acc + curr.total_refund, 0);

    return (
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] top-0 left-0">
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
                        <th colSpan={5} className="text-center pb-2 border-b border-black">
                            <h1 className="text-lg font-bold uppercase">{t("return_history.print.header_title")}</h1>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-1 border-r border-black text-left text-[10px] uppercase w-12">
                            {t("return_history.table.id")}
                        </th>
                        <th className="p-1 border-r border-black text-left text-[10px] uppercase w-32">
                            {t("return_history.table.date")}
                        </th>
                        <th className="p-1 border-r border-black text-left text-[10px] uppercase">
                            {t("return_history.table.employee")}
                        </th>
                        <th className="p-1 border-r border-black text-left text-[10px] uppercase">
                            {t("return_history.table.note")}
                        </th>
                        <th className="p-1 text-right text-[10px] uppercase w-24">
                            {t("return_history.table.refund")}
                        </th>
                    </tr>
                </thead>

                {/* Footer */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={4} className="text-right p-1 text-[10px] uppercase border-r border-black">
                            {t("return_history.print.page_refund")}
                        </td>
                        <td className="text-right p-1 text-[10px]">{totalRefundsOnPage.toLocaleString()}</td>
                    </tr>
                    {/* <tr><td colSpan={5} className="pt-4"><img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[80px]" /></td></tr> */}
                </tfoot>

                {/* Body */}
                <tbody className="text-[10px]">
                    {data.map((row) => (
                        <tr key={row.id} className="border border-black">
                            <td className="p-1 border-r border-black text-center">{row.id}</td>
                            <td className="p-1 border-r border-black">{new Date(row.created_at).toLocaleDateString()}</td>
                            <td className="p-1 border-r border-black">{row.employee_name}</td>
                            <td className="p-1 border-r border-black">{row.note}</td>
                            <td className="p-1 text-right font-bold">{row.total_refund.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}