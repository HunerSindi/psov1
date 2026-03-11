"use client";

import React from "react";
import { SaleResponse } from "@/lib/api/sale-ticket";
import { useSettings } from "@/lib/contexts/SettingsContext";

export const POS_RECEIPT_ID = "pos-receipt-template-hidden";

export default function PrintCashPOS({ data }: { data: SaleResponse }) {
    const { t, dir, settings } = useSettings();

    if (!data) return null;
    const { receipt, items, customer } = data;

    // Totals Logic
    const finalAmount = receipt.final_amount;
    const discount = receipt.discount_value || 0;
    const subtotal = finalAmount + discount;

    return (
        <div
            id={POS_RECEIPT_ID}
            dir={dir}
            style={{
                width: "576px", // Standard 80mm
                backgroundColor: "#ffffff",
                color: "#000000",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -1000,
                fontFamily: "'NRT', 'Courier New', Courier, monospace",
                fontSize: "32px", // Professional readable size
                fontWeight: "900", // Bold for thermal printer visibility
                lineHeight: "1.2",
            }}
            className="p-3"
        >
            {/* Load NRT Font */}
            <style>{`
                @font-face {
                    font-family: 'NRT';
                    src: url('/font/noto-b.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'NRT';
                    src: url('/font/noto-b.ttf') format('truetype');
                    font-weight: bold;
                    font-style: normal;
                }
            `}</style>

            <div className="flex flex-col gap-2">

                {/* --- HEADER --- */}
                <div className="text-center border-b-[3px] border-black pb-3 mb-2 border-dashed">
                    {/* Logo */}
                    <div className="flex justify-center mb-2">
                        {settings.headerPos && (
                            <img src={settings.headerPos} alt="Logo" className="w-full h-70 grayscale" />
                        )}
                    </div>
                    {/* 
                    <p className="text-3xl font-bold">{t("sale_ticket.pos.address")}</p>
                    <p className="text-2xl font-bold">{t("sale_ticket.pos.phone")}</p> */}
                </div>

                {/* --- INFO --- */}
                <div className="mb-2 text-xl font-bold">
                    <div className="flex justify-between mb-1">
                        <span>{t("sale_ticket.pos.ticket_no")}: <span className="text-2xl">#{receipt.id}</span></span>
                        <span>{new Date().toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>

                    <div className="flex justify-between border-b-[3px] border-black border-dashed mt-1 pb-1">
                        <span>{t("sale_ticket.pos.customer")}: <span className="text-xl">{customer?.name || t("sale_ticket.pos.guest")}</span></span>
                        <span>{t("sale_ticket.pos.cashier")}: <span className="text-xl">{receipt.cashier_name || `#${receipt.user_id}`}</span></span>
                    </div>
                </div>

                {/* --- TABLE (4 Columns: Item | Price | Qty | Sum) --- */}
                <table className="w-full text-left border-collapse border-4 border-black mb-2">
                    <thead>
                        <tr className="">
                            {/* Item Name */}
                            <th className="border-4 border-black py-1 px-1 text-start w-[40%] text-lg font-black">
                                {t("sale_ticket.pos.item")}
                            </th>
                            {/* Unit Price (e.g., 250) */}
                            <th className="border-4 border-black py-1 px-1 text-center w-[20%] text-lg font-black">
                                {t("sale_ticket.pos.price")}
                            </th>
                            {/* Quantity (e.g., 5) */}
                            <th className="border-4 border-black py-1 px-1 text-center w-[15%] text-lg font-black">
                                {t("sale_ticket.pos.qty")}
                            </th>
                            {/* Sum Total (e.g., 1,250) */}
                            <th className="border-4 border-black py-1 px-1 text-end w-[25%] text-lg font-black">
                                {t("sale_ticket.pos.total")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-bold">
                        {items.map((item, i) => (
                            <tr key={i}>
                                {/* Column 1: Item Name */}
                                <td className="border-4 border-black py-1 px-1 align-middle text-start">
                                    <div className="leading-tight">{item.item_name}</div>
                                    {item.unit_type !== 'single' && (
                                        <div className="text-xs font-normal">({item.unit_type})</div>
                                    )}
                                </td>

                                {/* Column 2: Unit Price */}
                                <td className="border-4 border-black py-1 px-1 text-center align-middle">
                                    {item.price.toLocaleString()}
                                </td>

                                {/* Column 3: Quantity */}
                                <td className="border-4 border-black py-1 px-1 text-center align-middle">
                                    {item.quantity}
                                </td>

                                {/* Column 4: Sum (Price * Qty) */}
                                <td className="border-4 border-black py-1 px-1 text-end align-middle font-black">
                                    {item.subtotal.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- TOTALS --- */}
                <div className="flex flex-col gap-1 text-xl font-bold">
                    <div className="flex justify-between border-b-[2px] border-black border-dashed pb-1">
                        <span>{t("sale_ticket.pos.subtotal")}:</span>
                        <span>{subtotal.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between border-b-[2px] border-black border-dashed pb-1">
                            <span>{t("sale_ticket.pos.discount")}:</span>
                            <span>-{discount.toLocaleString()}</span>
                        </div>
                    )}

                    {/* Grand Total Box */}
                    <div className=" mt-1 text-center text-black">
                        <div className="text-xl uppercase font-bold">{t("sale_ticket.pos.grand_total")}</div>
                        <div className="text-5xl font-black tracking-tighter">{finalAmount.toLocaleString()}</div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="text-center border-t-[2px] border-black border-dashed pt-2">
                    <p className="text-xl font-bold mb-1">{t("sale_ticket.pos.thank_you")}</p>
                    <p className="text-[18px] font-bold p-2">KASHIRO POS</p>

                    {/* Fake Barcode
                    <div className="mt-2 flex justify-center">
                        <div className="flex gap-1 h-12 bg-white p-1 border border-transparent">
                            {[...Array(25)].map((_, i) => (
                                <div key={i} className="bg-black" style={{ width: Math.random() > 0.5 ? '2px' : '5px' }}></div>
                            ))}
                        </div>
                    </div> */}
                    {/* <p className="text-lg font-bold">#{receipt.ticket_number}</p> */}
                </div>

            </div>
        </div>
    );
}