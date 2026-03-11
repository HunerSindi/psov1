"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Check, Receipt } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    // Updated: Accept 'a4' or 'pos' or undefined
    onConfirm: (amount: number, printMode?: "a4" | "pos") => void;
}

export default function LoanDialog({ isOpen, onClose, totalAmount, onConfirm }: Props) {
    const { t } = useSettings();
    const [paidInput, setPaidInput] = useState("0");

    const handleSubmit = (printMode?: "a4" | "pos") => {
        let valueToSend = parseFloat(paidInput);
        if (isNaN(valueToSend)) {
            valueToSend = 0;
        }
        onConfirm(valueToSend, printMode);
        setPaidInput("0");
    };

    const remaining = totalAmount - (parseFloat(paidInput) || 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-sm border-2 border-orange-500 rounded-none p-0 gap-0">
                <DialogHeader className="bg-orange-600 p-3 text-white">
                    <DialogTitle className="text-sm font-bold uppercase tracking-wide">
                        {t("sale_ticket.dialogs.loan.title")}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 bg-white flex flex-col gap-4">
                    <div className="text-center">
                        <span className="text-xs text-gray-500 uppercase font-bold">
                            {t("sale_ticket.dialogs.loan.total_invoice")}
                        </span>
                        <div className="text-2xl font-bold font-mono">{totalAmount.toLocaleString()}</div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-orange-700">
                            {t("sale_ticket.dialogs.loan.down_payment")}
                        </label>
                        <input
                            type="number"
                            autoFocus
                            value={paidInput}
                            onChange={(e) => setPaidInput(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full h-10 border-2 border-orange-400 px-2 text-lg font-bold font-mono outline-none focus:bg-orange-50 text-center"
                            placeholder="0"
                        />
                        <div className="text-[10px] text-gray-500 text-center mt-1">
                            {t("sale_ticket.dialogs.loan.remaining_debt")}: {remaining.toLocaleString()}
                        </div>
                    </div>

                    {/* --- 3 BUTTONS LAYOUT --- */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {/* 1. Save Only */}
                        <button
                            onClick={() => handleSubmit(undefined)}
                            className="h-10 bg-gray-200 border border-gray-400 text-[10px] font-bold uppercase hover:bg-gray-300 flex flex-col items-center justify-center leading-none gap-1"
                        >
                            <Check size={14} />
                            {t("sale_ticket.dialogs.loan.confirm")}
                        </button>

                        {/* 2. Print A4 (Browser) */}
                        <button
                            onClick={() => handleSubmit("a4")}
                            className="h-10 bg-orange-600 text-white border border-orange-800 text-[10px] font-bold uppercase hover:bg-orange-700 flex flex-col items-center justify-center leading-none gap-1"
                        >
                            <Printer size={14} />
                            A4
                        </button>

                        {/* 3. Print POS (Thermal) */}
                        <button
                            onClick={() => handleSubmit("pos")}
                            className="h-10 bg-black text-white border border-gray-800 text-[10px] font-bold uppercase hover:bg-gray-800 flex flex-col items-center justify-center leading-none gap-1"
                        >
                            <Receipt size={14} />
                            POS
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}