"use client";

import React from "react";
import { Company } from "@/lib/api/companies";
import { useSettings } from "@/lib/contexts/SettingsContext"; // 1. Import Hook

interface Props {
    companies: Company[];
}

export default function PrintCompanyList({ companies }: Props) {
    const { t, settings } = useSettings(); // 2. Get translation helper

    return (
        // Changed 'fixed' to 'absolute' to allow scrolling/multipage printing
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-0 m-0">

            <style>{`
                @media print {
                    @page { size: A4; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; }
                    /* Ensures table header repeats on new pages */
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            <table className="w-full border-collapse font-sans text-black">
                {/* Header */}
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
                        <th colSpan={5} className="text-center pb-4 border-b border-black">
                            {/* TRANSLATED TITLE */}
                            <h1 className="text-xl font-bold uppercase">
                                {t("company.title")}
                            </h1>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        {/* TRANSLATED COLUMNS */}
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-10">
                            {t("company.table.id")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase">
                            {t("company.table.name")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-32">
                            {t("company.table.phone")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase">
                            {t("company.table.address")}
                        </th>
                        <th className="p-2 text-right text-[10px] uppercase w-24">
                            {t("company.table.balance")}
                        </th>
                    </tr>
                </thead>

                {/* Footer */}
                {/* <tfoot>
                    <tr>
                        <td colSpan={5} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr>
                </tfoot> */}

                {/* Body */}
                <tbody className="text-[10px]">
                    {companies.map((c) => (
                        <tr key={c.id} className="border border-black">
                            <td className="p-2 border border-black text-center font-mono">{c.id}</td>
                            <td className="p-2 border border-black font-bold">{c.name}</td>
                            <td className="p-2 border border-black font-mono">{c.phone}</td>
                            <td className="p-2 border border-black">{c.address}</td>
                            <td className="p-2 text-right font-bold font-mono">
                                {c.balance?.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}