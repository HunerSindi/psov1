"use client";

import React from "react";
import { SaleResponse } from "@/lib/api/sale-ticket";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function PrintLoan({ data }: { data: SaleResponse }) {
    const { t, settings } = useSettings();

    if (!data) return null;
    const { receipt, items, customer } = data;

    // Calculations
    const finalInvoiceTotal = receipt.final_amount;
    const discount = receipt.discount_value || 0;
    const subtotal = finalInvoiceTotal + discount;
    const paidNow = receipt.paid_amount || 0;
    const remainingOnInvoice = finalInvoiceTotal - paidNow;
    const currentCustomerBalance = customer?.balance || 0;

    // Helper for Units
    const getUnitLabel = (type: string) => {
        if (type.includes("packet")) return t("sale_ticket.topbar.unit_packet");
        if (type.includes("wholesale")) return t("sale_ticket.topbar.unit_wholesale");
        return t("sale_ticket.topbar.unit_single");
    };

    return (
        // FIX 1: Add 'print-target-loan' class here
        <div className="hidden print-target-loan font-sans text-black">

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th colSpan={6} className="w-full pb-4">
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
                </thead>
                <tbody>
                    <tr>
                        <td className="align-top py-4 px-8">
                            {/* Header Info */}
                            <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold uppercase">
                                        {t("sale_ticket.print.credit_invoice")}
                                    </h1>
                                    <div className="text-sm mt-2">
                                        {t("sale_ticket.print.invoice_no")}: <span className="font-mono font-bold">#{receipt.id}</span>
                                    </div>
                                    <div className="text-sm">
                                        {t("sale_ticket.totals.label_date")}: <span className="font-mono">{new Date().toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold uppercase text-gray-600">
                                        {t("sale_ticket.print.bill_to")}
                                    </div>
                                    <div className="text-xl font-bold">{customer?.name}</div>
                                    <div className="text-sm font-mono">{customer?.id}</div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full text-left border-collapse mb-8">
                                <thead className="bg-gray-100 border-y-2 border-black">
                                    <tr>
                                        <th className="py-2 px-1 text-xs font-bold uppercase">
                                            {t("sale_ticket.table.headers.desc")}
                                        </th>
                                        <th className="py-2 px-1 text-xs font-bold uppercase text-center w-16">
                                            {t("sale_ticket.table.headers.unit")}
                                        </th>
                                        <th className="py-2 px-1 text-xs font-bold uppercase text-right w-24">
                                            {t("sale_ticket.table.headers.price")}
                                        </th>
                                        <th className="py-2 px-1 text-xs font-bold uppercase text-center w-16">
                                            {t("sale_ticket.table.headers.qty")}
                                        </th>
                                        <th className="py-2 px-1 text-xs font-bold uppercase text-right w-24">
                                            {t("sale_ticket.table.headers.total")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-300">
                                            <td className="py-2 px-1 font-bold">{item.item_name}</td>
                                            <td className="py-2 px-1 text-center uppercase text-xs">
                                                {getUnitLabel(item.unit_type)}
                                            </td>
                                            <td className="py-2 px-1 text-right font-mono">{item.price.toLocaleString()}</td>
                                            <td className="py-2 px-1 text-center font-bold">{item.quantity}</td>
                                            <td className="py-2 px-1 text-right font-mono font-bold">{item.subtotal.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Account Summary */}
                            <div className="flex justify-end">
                                <div className="w-80 border-2 border-black bg-gray-50 text-sm">
                                    <div className="p-2 border-b border-gray-300 flex justify-between">
                                        <span>{t("sale_ticket.totals.label_subtotal")}:</span>
                                        <span className="font-bold">{subtotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="p-2 border-b border-gray-300 flex justify-between text-red-600 bg-red-50">
                                            <span>{t("sale_ticket.totals.discount")}:</span>
                                            <span className="font-bold">-{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="p-2 border-b border-gray-300 flex justify-between font-bold bg-gray-100">
                                        <span>{t("sale_ticket.print.net_total")}:</span>
                                        <span>{finalInvoiceTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="p-2 border-b border-gray-300 flex justify-between">
                                        <span>{t("sale_ticket.print.paid_now")}:</span>
                                        <span className="font-bold">{paidNow.toLocaleString()}</span>
                                    </div>
                                    <div className="p-2 border-b border-black flex justify-between bg-orange-50 text-orange-900 font-bold">
                                        <span>{t("sale_ticket.print.added_to_debt")}:</span>
                                        <span>{remainingOnInvoice.toLocaleString()}</span>
                                    </div>
                                    <div className="p-3 flex justify-between text-lg font-bold uppercase bg-black text-white">
                                        <span className="text-xs self-center">
                                            {t("sale_ticket.print.total_balance")}:
                                        </span>
                                        <span>{(currentCustomerBalance + remainingOnInvoice).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="w-full pt-4">
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
            </table>

            {/* FIX 2: Updated CSS to use body.mode-loan logic */}
            <style>{`
                @media print {
                    /* Default: Hide everything */
                    body * { visibility: hidden; }

                    /* ONLY show this specific component when class 'mode-loan' is on body */
                    body.mode-loan .print-target-loan,
                    body.mode-loan .print-target-loan * {
                        visibility: visible;
                    }

                    body.mode-loan .print-target-loan {
                        display: block !important;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: white;
                        z-index: 9999;
                        padding: 0;
                        margin: 0;
                    }
                    @page { size: A4; margin: 10mm; }
                }
            `}</style>
        </div>
    );
}