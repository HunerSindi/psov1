"use client";

import React from "react";
import { SaleHistoryItem } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Import hook

interface Props {
    data: SaleHistoryItem[];
    totalAmount: number;
    filters: any;
}

export default function PrintHistoryList({ data, totalAmount, filters }: Props) {
    const { t, settings } = useSettings(); // Hook

    const sumFinal = data.reduce((acc, item) => acc + Number(item.final_amount || 0), 0);
    const sumPaid = data.reduce((acc, item) => acc + Number(item.paid_amount || 0), 0);

    return (
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-9999 p-0 m-0">
            <table className="w-full border-collapse font-sans text-black">

                {/* Header Image - Will repeat on new pages if browser supports it */}
                <thead>
                    <tr>
                        <th colSpan={9} className="w-full pb-4">
                            {/* 2. DYNAMIC HEADER A4 */}
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

                    {/* Columns */}
                    <tr className="border border-black bg-gray-100">
                        <th className="text-left text-[10px] uppercase p-2 border-r border-black w-10">
                            {t("sales_history.table.ticket")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-2 border-r border-black w-24">
                            {t("sales_history.table.date")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-2 border-r border-black">
                            {t("sales_history.table.customer")}
                        </th>
                        <th className="text-center text-[10px] uppercase p-2 border-r border-black w-16">
                            {t("sales_history.table.type")}
                        </th>
                        <th className="text-right text-[10px] uppercase p-2 border-r border-black w-20">
                            {t("sales_history.table.total")}
                        </th>
                        <th className="text-right text-[10px] uppercase p-2 border-r border-black w-16">
                            {t("sales_history.table.disc")}
                        </th>
                        <th className="text-right text-[10px] uppercase p-2 border-r border-black w-24">
                            {t("sales_history.table.final")}
                        </th>
                        <th className="text-right text-[10px] uppercase p-2 w-24">
                            {t("sales_history.table.paid")}
                        </th>
                    </tr>
                </thead>

                {/* Footer Totals (At the end of the table) */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={6} className="text-right p-2 text-xs uppercase border-r border-black">
                            {t("sales_history.print.totals_for_list")}:
                        </td>
                        <td className="text-right p-2 text-xs border-r border-black">
                            {sumFinal.toLocaleString()}
                        </td>
                        <td className="text-right p-2 text-xs">
                            {sumPaid.toLocaleString()}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={9} className="w-full pt-4">
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

                {/* Body */}
                <tbody className="text-[10px]">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="border border-black avoid-break">
                            <td className="p-2 border-r border-black font-mono text-center">{idx + 1}</td>
                            <td className="p-2 border-r border-black whitespace-nowrap">
                                {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="p-2 border-r border-black">
                                <div className="font-bold">{item.customer_name || t("sales_history.table.guest")}</div>
                                {item.customer_phone && <div className="text-[8px]">{item.customer_phone}</div>}
                            </td>
                            <td className="p-2 border-r border-black text-center uppercase text-[9px]">
                                {/* Translate payment type manually or use mapping */}
                                {item.payment_type === 'cash' ? t("sales_history.filters.cash") :
                                    item.payment_type === 'loan' ? t("sales_history.filters.loan") :
                                        t("sales_history.filters.installment")}
                            </td>

                            <td className="p-2 border-r border-black text-right text-gray-500">
                                {Number(item.total_amount).toLocaleString()}
                            </td>
                            <td className="p-2 border-r border-black text-right text-red-600">
                                {Number(item.discount_value) > 0 ? Number(item.discount_value).toLocaleString() : "-"}
                            </td>
                            <td className="p-2 border-r border-black text-right font-bold">
                                {Number(item.final_amount).toLocaleString()}
                            </td>
                            <td className="p-2 text-right">
                                {Number(item.paid_amount).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                @media print {
                    @page { margin: 10mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                    /* Prevent page breaks inside rows */
                    tr { page-break-inside: avoid; }
                    /* Ensure header repeats */
                    thead { display: table-header-group; } 
                    tfoot { display: table-footer-group; }
                }
            `}</style>
        </div>
    );
}