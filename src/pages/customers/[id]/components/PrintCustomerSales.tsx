"use client";

import React from "react";
import { SaleHistoryItem } from "@/lib/api/sales-history";
import { Transaction } from "@/lib/api/customers";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    customerName: string;
    balance?: number;
    sales: SaleHistoryItem[];
    transactions: Transaction[];
}

const PAYMENT_LABELS: Record<string, "sales_history.filters.cash" | "sales_history.filters.loan" | "sales_history.filters.installment"> = {
    cash: "sales_history.filters.cash",
    loan: "sales_history.filters.loan",
    installment: "sales_history.filters.installment",
};
const PAYMENT_TYPE_FALLBACK = "sales_history.table.type" as const;

export default function PrintCustomerSales({ customerName, balance = 0, sales, transactions }: Props) {
    const { t, settings } = useSettings();
    const totalFinal = sales.reduce((acc, s) => acc + (s.final_amount || 0), 0);
    const totalPaid = sales.reduce((acc, s) => acc + (s.paid_amount || 0), 0);

    return (
        <div className="hidden print:block print-only-root absolute inset-0 w-full min-h-screen bg-white z-[9999] p-0 m-0">
            <style>{`
                @media print {
                    @page { size: A4; margin: 10mm; }
                    html, body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    .print-only-root, .print-only-root * { visibility: visible; }
                    .print-only-root { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; background: white !important; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            <div className="bg-white text-black font-sans">
                {/* Section 1: All sales */}
                <table className="w-full border-collapse font-sans text-black">
                    <thead>
                        <tr>
                            <th colSpan={8} className="w-full pb-4">
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
                            <th colSpan={8} className="text-center pb-2 border-b border-black">
                                <h1 className="text-xl font-bold uppercase">{t("customer.print_sales_title")}</h1>
                                <p className="text-sm font-bold mt-1">{customerName}</p>
                                {/* <p className="text-base font-bold mt-3 pt-3 border-t border-black">
                                    {t("customer.print_you_owe")}: <span className="font-mono">{Math.abs(balance).toLocaleString()}</span>
                                </p> */}
                            </th>
                        </tr>
                        <tr className="bg-gray-100 border border-black">
                            <th className="p-2 border-r border-black text-center text-[10px] uppercase w-12">{t("sales_history.table.ticket")}</th>
                            <th className="p-2 border-r border-black text-left text-[10px] uppercase w-24">{t("sales_history.table.date")}</th>
                            <th className="p-2 border-r border-black text-center text-[10px] uppercase w-20">{t("sales_history.table.type")}</th>
                            <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">{t("sales_history.table.status")}</th>
                            <th className="p-2 border-r border-black text-right text-[10px] uppercase w-20">{t("sales_history.table.total")}</th>
                            <th className="p-2 border-r border-black text-right text-[10px] uppercase w-16">{t("sales_history.table.disc")}</th>
                            <th className="p-2 border-r border-black text-right text-[10px] uppercase w-20">{t("sales_history.table.final")}</th>
                            <th className="p-2 text-right text-[10px] uppercase w-20">{t("sales_history.table.paid")}</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr className="border border-black font-bold bg-gray-50">
                            <td colSpan={4} className="text-right p-2 text-xs uppercase border-r border-black">{t("customer.print_total_sales")}:</td>
                            <td colSpan={2} className="text-right p-2 text-xs font-mono border-r border-black">{totalFinal.toLocaleString()}</td>
                            <td className="text-right p-2 text-xs uppercase border-r border-black">{t("customer.print_total_paid")}:</td>
                            <td className="text-right p-2 text-xs font-mono">{totalPaid.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                    <tbody className="text-[10px]">
                        {sales.map((s) => (
                            <tr key={s.id} className="border border-black">
                                <td className="p-2 border-r border-black text-center font-mono">#{s.id}</td>
                                <td className="p-2 border-r border-black font-mono">{new Date(s.date).toLocaleString()}</td>
                                <td className="p-2 border-r border-black text-center uppercase">{t(PAYMENT_LABELS[s.payment_type] ?? PAYMENT_TYPE_FALLBACK)}</td>
                                <td className="p-2 border-r border-black text-center uppercase">{s.status}</td>
                                <td className="p-2 border-r border-black text-right font-mono">{s.total_amount.toLocaleString()}</td>
                                <td className="p-2 border-r border-black text-right font-mono">{s.discount_value > 0 ? s.discount_value.toLocaleString() : "-"}</td>
                                <td className="p-2 border-r border-black text-right font-mono font-bold">{s.final_amount.toLocaleString()}</td>
                                <td className="p-2 text-right font-mono font-bold">{s.paid_amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Section 2: All transactions (ledger) */}
                <div className="mt-8 break-before-auto">
                    <h2 className="text-lg font-bold uppercase border-b border-black pb-2 mb-2">{t("customer.ledger_title")} – {customerName}</h2>
                    <table className="w-full border-collapse font-sans text-black border border-black">
                        <thead>
                            <tr className="bg-gray-100 border border-black">
                                <th className="p-2 border-r border-black text-center text-[10px] uppercase w-12">{t("customer.table.id")}</th>
                                <th className="p-2 border-r border-black text-left text-[10px] uppercase w-28">{t("customer.table.date")}</th>
                                <th className="p-2 border-r border-black text-left text-[10px] uppercase">{t("customer.table.desc")}</th>
                                <th className="p-2 border-r border-black text-right text-[10px] uppercase w-24">{t("customer.table.added")}</th>
                                <th className="p-2 text-right text-[10px] uppercase w-24">{t("customer.table.paid")}</th>
                            </tr>
                        </thead>
                        <tbody className="text-[10px]">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border border-black">
                                    <td className="p-2 border-r border-black text-center font-mono">{tx.id}</td>
                                    <td className="p-2 border-r border-black font-mono">{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 border-r border-black">{tx.description}</td>
                                    <td className="p-2 border-r border-black text-right font-mono">{tx.amount > 0 ? tx.amount.toLocaleString() : "-"}</td>
                                    <td className="p-2 text-right font-mono">{tx.amount < 0 ? Math.abs(tx.amount).toLocaleString() : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
