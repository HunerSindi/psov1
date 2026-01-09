"use client";

import React from "react";
import { SaleResponse } from "@/lib/api/sale-ticket";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Import translation hook

export default function PrintCashA4({ data }: { data: SaleResponse }) {
    const { t, settings } = useSettings();

    if (!data) return null;
    const { receipt, items, customer } = data;

    // Helper to Translate Units for Print
    const getUnitLabel = (type: string) => {
        if (type.includes("packet")) return t("sale_ticket.topbar.unit_packet");
        if (type.includes("wholesale")) return t("sale_ticket.topbar.unit_wholesale");
        return t("sale_ticket.topbar.unit_single");
    };

    // Calculate Totals
    const finalAmount = receipt.final_amount;
    const discount = receipt.discount_value;
    const subtotal = finalAmount + discount;

    return (
        // The div itself has no padding; margins are handled by @page CSS below
        <div className="hidden print-target-cash-a4 font-sans text-black">

            <table className="w-full border-collapse">

                {/* --- HEADER SECTION --- */}
                <thead>
                    {/* 1. Logo Image */}
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

                    {/* 2. Invoice Details Row (LOCALIZED) */}
                    <tr>
                        <th colSpan={6} className="text-left pb-2 font-normal">
                            <div className="flex justify-between items-end border-b border-black pb-2 mb-2">
                                <div>
                                    <h1 className="text-xl font-bold uppercase">
                                        {t("sale_ticket.header.title")} #{receipt.id}
                                    </h1>
                                    <div className="text-xs mt-1">
                                        {t("sale_ticket.totals.label_date")}: <b>{new Date().toLocaleString()}</b>
                                    </div>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                    <div>
                                        {t("sale_ticket.totals.label_customer")}: <b>{customer?.name || t("sale_ticket.topbar.guest_customer")}</b>
                                    </div>
                                    <div>
                                        {t("sale_ticket.totals.label_ticket_id")}: <b>#{receipt.id}</b>
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>

                    {/* 3. Column Headers */}
                    <tr className="border border-black bg-gray-100">
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-10">
                            {t("sale_ticket.table.headers.hash")}
                        </th>
                        <th className="p-2 border border-black text-left text-[10px] uppercase">
                            {t("sale_ticket.table.headers.desc")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-16">
                            {t("sale_ticket.table.headers.unit")}
                        </th>
                        <th className="p-2 border border-black text-right text-[10px] uppercase w-20">
                            {t("sale_ticket.table.headers.price")}
                        </th>
                        <th className="p-2 border border-black text-center text-[10px] uppercase w-16">
                            {t("sale_ticket.table.headers.qty")}
                        </th>
                        <th className="p-2 text-right text-[10px] uppercase w-24">
                            {t("sale_ticket.table.headers.total")}
                        </th>
                    </tr>
                </thead>

                {/* --- FOOTER SECTION --- */}
                <tfoot>
                    {/* This empty row adds space between the items and the totals */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

                    {/* Subtotal Row */}
                    <tr className="text-xs">
                        <td colSpan={5} className="text-right p-1 font-bold">{t("sale_ticket.totals.label_subtotal")}:</td>
                        <td className="text-right p-1">{subtotal.toLocaleString()}</td>
                    </tr>

                    {/* Discount Row (only shows if discount > 0) */}
                    {discount > 0 && (
                        <tr className="text-xs text-red-600">
                            <td colSpan={5} className="text-right p-1 font-bold">{t("sale_ticket.totals.discount")}:</td>
                            <td className="text-right p-1">- {discount.toLocaleString()}</td>
                        </tr>
                    )}

                    {/* Grand Total Row (highlighted) */}
                    <tr className="text-sm font-bold bg-gray-100 border-t-2 border-b-2 border-black">
                        <td colSpan={5} className="text-right p-2">{t("sale_ticket.totals.total_payable")}:</td>
                        <td className="text-right p-2 text-base">{finalAmount.toLocaleString()}</td>
                    </tr>

                    {/* Footer Image */}
                    <tr>
                        <td colSpan={6} className="w-full pt-4">
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

                {/* --- BODY SECTION --- */}
                <tbody className="text-[10px]">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border border-black">
                            <td className="p-2 border border-black text-center font-mono">{idx + 1}</td>
                            <td className="p-2 border border-black font-bold">{item.item_name}</td>
                            <td className="p-2 border border-black text-center uppercase text-[9px]">{getUnitLabel(item.unit_type)}</td>
                            <td className="p-2 border border-black text-right font-mono">{item.price.toLocaleString()}</td>
                            <td className="p-2 border border-black text-center font-bold">{item.quantity}</td>
                            <td className="p-2 border border-black text-right font-bold font-mono">{item.subtotal.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx global>{`
                @media print {
                    /* Default: Hide everything */
                    body * { visibility: hidden; }

                    /* ONLY show this specific component when class matches */
                    body.mode-cash-a4 .print-target-cash-a4,
                    body.mode-cash-a4 .print-target-cash-a4 * {
                        visibility: visible;
                    }

                    body.mode-cash-a4 .print-target-cash-a4 {
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