"use client";

import React from "react";
import { SaleResponse } from "@/lib/api/sale-ticket";
import { useSettings } from "@/lib/contexts/SettingsContext";

export const POS_LOAN_ID = "pos-loan-template-hidden";

export default function PrintLoanPOS({ data }: { data: SaleResponse }) {
    const { t, dir, settings } = useSettings();

    if (!data) return null;
    const { receipt, items, customer } = data;

    // --- CALCULATIONS ---
    const finalAmount = receipt.final_amount; // Total after discount
    const discount = receipt.discount_value || 0;
    const subtotal = finalAmount + discount; // Total before discount
    const paidNow = receipt.paid_amount || 0; // Down payment
    const remainingDebt = finalAmount - paidNow; // Amount added to debt
    const totalCustomerBalance = customer?.balance || 0; // Current total balance from API

    return (
        <div
            id={POS_LOAN_ID}
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
                fontSize: "24px", // Adjusted for legibility
                fontWeight: "900", // Bold for thermal printer
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
                    <div className="flex justify-center mb-2">
                        {settings.headerPos && (
                            <img src={settings.headerPos} alt="Logo" className="w-full h-70 grayscale" />
                        )}
                    </div>
                </div>

                {/* --- INFO --- */}
                <div className="mb-2 text-lg font-bold">
                    <div className="flex justify-between mb-1">
                        <span>{t("sale_ticket.pos.ticket_no")}: <span className="text-xl">#{receipt.id}</span></span>
                        <span>{new Date().toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>

                    <div className="flex justify-between border-b-[3px] border-black border-dashed mt-1 pb-1">
                        <span>{t("sale_ticket.pos.customer")}: <span className="text-xl">{customer?.name || t("sale_ticket.pos.guest")}</span></span>
                        <span>{t("sale_ticket.pos.cashier")}: <span className="text-xl">{receipt.cashier_name || `#${receipt.user_id}`}</span></span>
                    </div>
                </div>

                {/* --- TABLE (4 Columns) --- */}
                <table className="w-full text-left border-collapse border-4 border-black mb-2">
                    <thead>
                        <tr className="">
                            <th className="border-4 border-black py-1 px-1 text-start w-[40%] text-lg font-black">
                                {t("sale_ticket.pos.item")}
                            </th>
                            <th className="border-4 border-black py-1 px-1 text-center w-[20%] text-lg font-black">
                                {t("sale_ticket.pos.price")}
                            </th>
                            <th className="border-4 border-black py-1 px-1 text-center w-[15%] text-lg font-black">
                                {t("sale_ticket.pos.qty")}
                            </th>
                            <th className="border-4 border-black py-1 px-1 text-end w-[25%] text-lg font-black">
                                {t("sale_ticket.pos.total")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-bold">
                        {items.map((item, i) => (
                            <tr key={i}>
                                <td className="border-4 border-black py-1 px-1 align-middle text-start">
                                    <div className="leading-tight">{item.item_name}</div>
                                    {item.unit_type !== 'single' && (
                                        <div className="text-xs font-normal">({item.unit_type})</div>
                                    )}
                                </td>
                                <td className="border-4 border-black py-1 px-1 text-center align-middle">
                                    {item.price.toLocaleString()}
                                </td>
                                <td className="border-4 border-black py-1 px-1 text-center align-middle">
                                    {item.quantity}
                                </td>
                                <td className="border-4 border-black py-1 px-1 text-end align-middle font-black">
                                    {item.subtotal.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- LOAN SUMMARY --- */}
                <div className="flex flex-col gap-1 text-xl font-bold">

                    {/* Subtotal & Discount */}
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

                    {/* Net Total */}
                    <div className="flex justify-between border-b-[2px] border-black border-dashed pb-1">
                        <span>{t("sale_ticket.print.net_total")}:</span>
                        <span>{finalAmount.toLocaleString()}</span>
                    </div>

                    {/* Paid Now */}
                    <div className="flex justify-between border-b-[2px] border-black border-dashed pb-1">
                        <span>{t("sale_ticket.print.paid_now")}:</span>
                        <span>{paidNow.toLocaleString()}</span>
                    </div>

                    {/* Added to Debt (Highlighted) */}
                    <div className="flex justify-between border-b-[2px] border-black border-dashed pb-1 mt-1">
                        <span>{t("sale_ticket.print.added_to_debt")}:</span>
                        <span className="font-black text-2xl">{remainingDebt.toLocaleString()}</span>
                    </div>

                    {/* Total Customer Balance Box */}
                    <div className="mt-2 text-center text-black border-[3px] border-black p-2">
                        <div className="text-lg uppercase font-bold">{t("sale_ticket.print.total_balance")}</div>
                        <div className="text-4xl font-black tracking-tighter">
                            {(totalCustomerBalance + remainingDebt).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="text-center border-t-[2px] border-black border-dashed pt-2 mt-2">
                    <p className="text-lg font-bold mb-1">{t("sale_ticket.pos.thank_you")}</p>
                    <p className="text-[18px] font-bold p-2">KASHIRO POS</p>
                </div>

            </div>
        </div>
    );
}