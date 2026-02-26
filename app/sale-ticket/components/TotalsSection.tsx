"use client";

import { useState, useEffect, useRef } from "react";
import { SaleResponse, applyDiscount, paySale } from "@/lib/api/sale-ticket";
import { Printer, CreditCard, User, Delete, Percent, Check } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

import LoanDialog from "./dialogs/LoanDialog";
import InstallmentDialog from "./dialogs/InstallmentDialog";

interface Props {
    saleData: SaleResponse | null;
    onRefresh: () => void;
    onPrintRequest: (mode: "cash-a4" | "cash-pos" | "loan" | "loan-pos" | "install") => void;
    onPaymentSuccess: (data: SaleResponse) => void;
}

export default function TotalsSection({ saleData, onRefresh, onPrintRequest, onPaymentSuccess }: Props) {
    const { t } = useSettings();
    const [discountInput, setDiscountInput] = useState("");

    // Dialog States
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [isInstallOpen, setIsInstallOpen] = useState(false);

    // Keypad State
    const [isKeypadOpen, setIsKeypadOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Track input for event listeners
    const discountInputRef = useRef(discountInput);

    // 1. Sync State with Ref
    useEffect(() => {
        discountInputRef.current = discountInput;
    }, [discountInput]);

    // 2. Sync input with DB data
    useEffect(() => {
        if (saleData) {
            setDiscountInput(saleData.receipt.discount_value.toString());
        }
    }, [saleData]);

    // 3. Handle Outside Click (Auto Submit)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isKeypadOpen && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                handleApplyDiscount(undefined, discountInputRef.current);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isKeypadOpen]);

    const handleApplyDiscount = async (specificValue?: number, valueFromRef?: string) => {
        if (!saleData) return;

        // 1. Determine the raw number
        let rawValue = specificValue;
        if (rawValue === undefined) {
            const stringVal = valueFromRef !== undefined ? valueFromRef : discountInput;
            rawValue = stringVal === "" ? 0 : parseFloat(stringVal);
        }

        // 2. CAP LOGIC: If Discount > Total Amount, set it to Total Amount
        const totalAmount = saleData.receipt.total_amount;
        if (rawValue > totalAmount) {
            rawValue = totalAmount;
        }

        // 3. Apply
        await applyDiscount(saleData.receipt.id, rawValue || 0);

        setIsKeypadOpen(false);
        onRefresh();
    };

    // --- KEYPAD LOGIC ---
    const handleKeypadClick = (key: string) => {
        if (!saleData) return;

        if (key === "C") {
            setDiscountInput("");
        } else if (key === "DEL") {
            setDiscountInput((prev) => prev.length > 0 ? prev.slice(0, -1) : "");
        } else if (key === "%") {
            // Calculate % of Original Total
            const percentage = parseFloat(discountInput) || 0;
            const originalTotal = saleData.receipt.total_amount;
            let calculatedDiscount = (percentage / 100) * originalTotal;

            // CAP LOGIC FOR PERCENTAGE
            if (calculatedDiscount > originalTotal) {
                calculatedDiscount = originalTotal;
            }

            const fixedDiscount = parseFloat(calculatedDiscount.toFixed(2));
            setDiscountInput(fixedDiscount.toString());

            // Submit immediately
            handleApplyDiscount(fixedDiscount);
        } else if (key === "ENTER") {
            handleApplyDiscount();
        } else {
            // Number Logic
            setDiscountInput((prev) => {
                if (key === "." && prev.includes(".")) return prev;
                if (prev === "") return key;
                if (prev === "0" && key !== ".") return key;
                return prev + key;
            });
        }
    };

    const handleOpenKeypad = () => {
        if (!isKeypadOpen) {
            setDiscountInput(""); // Clear on open
            setIsKeypadOpen(true);
        }
    };

    // Payment Logic (Unchanged)
    const processPayment = async (type: "cash" | "loan" | "installment", data: any, printMode?: "cash-a4" | "cash-pos" | "loan" | "loan-pos" | "install") => {
        if (!saleData) return;

        if (type !== "cash" && !saleData.customer) {
            alert(t("sale_ticket.totals.alert_select_cust"));
            return;
        }

        let paidNowAmount = 0;
        if (type === "cash") paidNowAmount = data.amount;
        else if (type === "loan") paidNowAmount = data.amount || 0;
        else if (type === "installment") paidNowAmount = data.down_payment || 0;

        let success = false;
        if (type === "installment") {
            success = await paySale(saleData.receipt.id, "installment", data.down_payment, {
                count: data.count, days: data.days, added_fee: data.fee, start_date: data.date
            });
        } else {
            success = await paySale(saleData.receipt.id, type, data.amount);
        }

        if (success) {
            setIsLoanOpen(false);
            setIsInstallOpen(false);
            const dataForPrint = {
                ...saleData,
                receipt: { ...saleData.receipt, paid_amount: paidNowAmount }
            };
            onPaymentSuccess(dataForPrint);
            if (printMode) onPrintRequest(printMode);
            onRefresh();
        } else {
            alert(t("sale_ticket.totals.alert_payment_fail"));
        }
    };

    if (!saleData) return null;

    return (
        <div className="flex flex-col gap-2 font-sans text-black">
            {/* Info Row & Totals */}
            <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-400">
                <div className="text-xs font-bold text-gray-500 uppercase">
                    {t("sale_ticket.totals.items_count")} <span className="text-black">{saleData.items.length}</span>
                </div>

                {/* DISCOUNT WRAPPER */}
                <div className="flex items-center gap-1 relative" ref={wrapperRef}>
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                        {t("sale_ticket.totals.discount")}
                    </span>
                    <input
                        type="number"
                        className="w-20 h-7 border border-gray-400 text-right px-1 text-sm outline-none focus:border-blue-600 font-mono font-bold"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        onClick={handleOpenKeypad}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                        placeholder="0"
                    />

                    {/* KEYPAD POPUP */}
                    {isKeypadOpen && (
                        <div className="absolute bottom-full right-0 mb-2 w-70 bg-white border border-gray-400 shadow-xl z-999 animate-in fade-in zoom-in-95">
                            <div className="bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 border-b border-gray-300 text-center uppercase tracking-wider">
                                {t("sale_ticket.totals.discount")}
                            </div>

                            {/* UPDATED LAYOUT */}
                            <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50" dir="ltr">
                                {["1", "2", "3", "%"].map((key) => (
                                    <KeypadButton key={key} val={key} onClick={handleKeypadClick} isAction={key === "%"} />
                                ))}
                                {["4", "5", "6", "DEL"].map((key) => (
                                    <KeypadButton key={key} val={key} onClick={handleKeypadClick} isAction={key === "DEL"} />
                                ))}
                                {["7", "8", "9", "C"].map((key) => (
                                    <KeypadButton key={key} val={key} onClick={handleKeypadClick} isAction={key === "C"} />
                                ))}
                                {["0", ".", "ENTER"].map((key) => (
                                    <KeypadButton
                                        key={key}
                                        val={key}
                                        onClick={handleKeypadClick}
                                        isAction={key === "ENTER"}
                                        colSpan={key === "ENTER" ? 2 : 1}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtotal / Discount / Total breakdown */}
            <div className="bg-gray-50 border border-gray-400 p-2 space-y-1 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-gray-600">{t("sale_ticket.totals.label_subtotal")}</span>
                    <span className="font-mono font-bold">{saleData.receipt.total_amount.toLocaleString()}</span>
                </div>
                {saleData.receipt.discount_value > 0 && (
                    <div className="flex justify-between items-center text-red-700">
                        <span className="text-xs font-bold uppercase">{t("sale_ticket.totals.discount")}</span>
                        <span className="font-mono font-bold">-{saleData.receipt.discount_value.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="bg-black text-white p-3 text-center border border-black shadow-sm">
                <div className="text-[10px] uppercase tracking-widest text-gray-400">
                    {t("sale_ticket.totals.total_payable")}
                </div>
                <div className="text-4xl font-bold font-mono tracking-tighter">{saleData.receipt.final_amount.toLocaleString()}</div>
            </div>

            {/* Payment Buttons */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, undefined)}
                        className="h-10 bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-xs border border-green-800 flex items-center justify-center gap-2 rounded"
                    >
                        <CreditCard size={16} /> {t("sale_ticket.totals.btn_cash")}
                    </button>
                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, "cash-a4")}
                        className="h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase text-xs border border-green-900 flex items-center justify-center gap-2 rounded"
                    >
                        <Printer size={16} /> {t("sale_ticket.totals.btn_cash_a4")}
                    </button>
                    <button
                        onClick={() => processPayment("cash", { amount: saleData.receipt.final_amount }, "cash-pos")}
                        className="h-10 bg-green-700 hover:bg-green-800 text-white font-bold uppercase text-xs border border-green-900 flex items-center justify-center gap-2 rounded"
                    >
                        <Printer size={16} /> {t("sale_ticket.totals.btn_cash_pos")}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => setIsLoanOpen(true)} className="h-10 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs border border-orange-700 flex items-center justify-center gap-2 rounded">
                        <User size={16} /> {t("sale_ticket.totals.btn_loan")}
                    </button>
                </div>
            </div>

            <LoanDialog
                isOpen={isLoanOpen}
                onClose={() => setIsLoanOpen(false)}
                totalAmount={saleData.receipt.final_amount}
                onConfirm={(amount, printMode) => {
                    let mode: "loan" | "loan-pos" | undefined = undefined;
                    if (printMode === "a4") mode = "loan";
                    if (printMode === "pos") mode = "loan-pos";
                    processPayment("loan", { amount }, mode as any);
                }}
            />

            <InstallmentDialog
                isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} totalAmount={saleData.receipt.final_amount}
                onConfirm={(data, print) => processPayment("installment", data, print ? "install" as any : undefined)}
            />
        </div>
    );
}

function KeypadButton({ val, onClick, isAction = false, colSpan = 1 }: { val: string, onClick: (val: string) => void, isAction?: boolean, colSpan?: number }) {
    const content = val === "DEL" ? <Delete size={20} /> : val === "ENTER" ? <Check size={20} /> : val === "%" ? <Percent size={20} /> : val;
    return (
        <button
            onClick={() => onClick(val)}
            className={`
                h-14 flex items-center justify-center font-bold text-lg transition-colors border
                ${isAction
                    ? val === "ENTER" ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
                        : val === "C" ? "bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300"
                    : "bg-white hover:bg-gray-100 text-black border-gray-300"
                }
                active:scale-95
                ${colSpan === 2 ? "col-span-2" : "col-span-1"}
            `}
        >
            {content}
        </button>
    );
}