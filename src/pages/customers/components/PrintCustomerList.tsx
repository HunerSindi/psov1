"use client";
import React from "react";
import { Customer } from "@/lib/api/customers";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    customers: Customer[];
}

export default function PrintCustomerList({ customers }: Props) {
    const { t, settings } = useSettings();
    const totalBalance = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

    return (
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-0 m-0">
            <style>{`
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
                        <th colSpan={7} className="text-center pb-4 border-b border-black">
                            <h1 className="text-xl font-bold uppercase">{t("customer.title")}</h1>
                        </th>
                    </tr>
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-10">{t("customer.table.id")}</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase">{t("customer.table.name")}</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase w-24">{t("customer.table.nickname")}</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase w-24">{t("customer.table.phone")}</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase">{t("customer.table.address")}</th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">{t("customer.table.status")}</th>
                        <th className="p-2 text-right text-[10px] uppercase w-24">{t("customer.table.balance")}</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={6} className="text-right p-2 text-xs uppercase border-r border-black">{t("customer.table.total_balance")}:</td>
                        <td className="text-right p-2 text-xs">{totalBalance.toLocaleString()}</td>
                    </tr>
                    {/* <tr>
                        <td colSpan={7} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr> */}
                </tfoot>
                <tbody className="text-[10px]">
                    {customers.map((c) => (
                        <tr key={c.id} className="border border-black">
                            <td className="p-2 border-r border-black text-center">{c.id}</td>
                            <td className="p-2 border-r border-black font-bold">{c.name}</td>
                            <td className="p-2 border-r border-black">{c.name2 || "-"}</td>
                            <td className="p-2 border-r border-black font-mono">{c.phone}</td>
                            <td className="p-2 border-r border-black truncate max-w-[150px]">{c.address}</td>
                            <td className="p-2 border-r border-black text-center uppercase">
                                {c.active ? t("customer.table.active") : t("customer.table.inactive")}
                            </td>
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