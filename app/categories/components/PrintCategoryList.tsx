"use client";

import React from "react";
import { ExpenseCategory } from "@/lib/api/expense-categories";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    categories: ExpenseCategory[];
}

export default function PrintCategoryList({ categories }: Props) {
    const { t, settings } = useSettings(); // Hook

    return (
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 m-0">
            <table className="w-full font-sans text-black">

                {/* Header Image */}
                <thead>
                    <tr>
                        <th colSpan={2} className="w-full pb-4">
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
                        <th colSpan={2} className="pb-4 text-center">
                            <h1 className="text-xl font-bold uppercase">
                                {t("expense_category.table.print_header")}
                            </h1>
                        </th>
                    </tr>

                    {/* Column Headers */}
                    <tr className="border border-black bg-gray-100">
                        <th className="text-center text-[10px] uppercase p-2 border-r border-black w-16">
                            {t("expense_category.table.id")}
                        </th>
                        <th className="text-left text-[10px] uppercase p-2 border-r border-black">
                            {t("expense_category.table.name")}
                        </th>
                    </tr>
                </thead>

                {/* Footer Image */}
                {/* <tfoot>
                    <tr>
                        <td colSpan={2} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr>
                </tfoot> */}

                {/* Body */}
                <tbody className="text-[10px]">
                    {categories.map((cat, idx) => (
                        <tr key={cat.id} className="border border-black">
                            <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                            <td className="p-2 border-r border-black font-bold uppercase">{cat.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx global>{`
                @media print {
                    @page { margin: 5mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}