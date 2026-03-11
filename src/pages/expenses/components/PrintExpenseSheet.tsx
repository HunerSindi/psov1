"use client";

import React from "react";
import { Expense } from "@/lib/api/expenses";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    expenses: Expense[];
    totalAmount: number;
    dateRange: { from: string; to: string };
}

export default function PrintExpenseSheet({ expenses, totalAmount, dateRange }: Props) {
    const { t, settings } = useSettings(); // Hook

    const fmt = (num: number) => num.toLocaleString(undefined, { minimumFractionDigits: 0 });
    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString() : "-";

    return (
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0">
            <table className="w-full border-collapse font-sans text-black">

                {/* --- HEADER --- */}
                <thead>
                    <tr>
                        <th colSpan={5} className="w-full pb-4">
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
                        <th colSpan={5} className="text-center pb-2">
                            <h1 className="text-xl uppercase font-bold">{t("expense.table.print_title")}</h1>
                            <p className="text-xs font-normal">
                                {t("expense.table.print_period")} {dateRange.from || t("expense.table.start")} - {dateRange.to || t("expense.table.now")}
                            </p>
                        </th>
                    </tr>
                    <tr className="border border-black bg-gray-100">
                        <th className="text-left text-[10px] uppercase p-1 border-r border-black w-12">
                            {t("expense.table.id")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-1 border-r border-black w-24">
                            {t("expense.table.date")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-1 border-r border-black w-32">
                            {t("expense.table.category")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-1 border-r border-black">
                            {t("expense.table.desc")}
                        </th>
                        <th className="text-right text-[10px] uppercase p-1 border-r border-black w-24">
                            {t("expense.table.amount")}
                        </th>
                    </tr>
                </thead>

                {/* --- FOOTER --- */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-100">
                        <td colSpan={4} className="text-right p-2 text-xs uppercase border-r border-black">
                            {t("expense.table.total_expenses")}
                        </td>
                        <td className="text-right p-2 text-xs">{fmt(totalAmount)}</td>
                    </tr>
                    {/* <tr>
                        <td colSpan={5} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr> */}
                </tfoot>

                {/* --- BODY --- */}
                <tbody className="text-[10px]">
                    {expenses.map((exp, idx) => (
                        <tr key={exp.id} className="border border-black">
                            <td className="p-1 border-r border-black text-center">{idx + 1}</td>
                            <td className="p-1 border-r border-black">{fmtDate(exp.date)}</td>
                            <td className="p-1 border-r border-black font-semibold">{exp.category_name}</td>
                            <td className="p-1 border-r border-black">{exp.description}</td>
                            <td className="p-1 border-r border-black text-right font-mono">{fmt(exp.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                @media print {
                    @page { margin: 5mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}