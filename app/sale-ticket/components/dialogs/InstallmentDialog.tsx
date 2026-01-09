"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Check } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // 1. Import Hook

interface Props {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: (data: { down_payment: number, fee: number, count: number, days: number, date: string }, print: boolean) => void;
}

export default function InstallmentDialog({ isOpen, onClose, totalAmount, onConfirm }: Props) {
    const { t } = useSettings(); // 2. Get translation helper

    const [downPayment, setDownPayment] = useState("0");
    const [fee, setFee] = useState("0");
    const [count, setCount] = useState(2);
    const [days, setDays] = useState(30);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (print: boolean) => {
        // Safe parsing
        const dpVal = parseFloat(downPayment);
        const feeVal = parseFloat(fee);

        onConfirm({
            down_payment: isNaN(dpVal) ? 0 : dpVal,
            fee: isNaN(feeVal) ? 0 : feeVal,
            count: count,
            days: days,
            date: date
        }, print);
    };

    const finalTotal = totalAmount + (parseFloat(fee) || 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-sm border-2 border-purple-700 rounded-none p-0 gap-0">
                <DialogHeader className="bg-purple-700 p-3 text-white">
                    <DialogTitle className="text-sm font-bold uppercase tracking-wide">
                        {t("sale_ticket.dialogs.installment.title")}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 bg-white flex flex-col gap-3">

                    {/* Totals Summary */}
                    <div className="bg-gray-50 border border-gray-300 p-2 text-center mb-1">
                        <div className="flex justify-between text-xs text-gray-500 uppercase font-bold">
                            <span>
                                {t("sale_ticket.dialogs.installment.base")}: {totalAmount.toLocaleString()}
                            </span>
                            <span>
                                {t("sale_ticket.dialogs.installment.fee_summary")}: {(parseFloat(fee) || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="text-xl font-bold font-mono border-t border-gray-300 mt-1 pt-1 text-purple-900">
                            {t("sale_ticket.dialogs.installment.total")}: {finalTotal.toLocaleString()}
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Down Payment */}
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">
                                {t("sale_ticket.dialogs.installment.down_payment")}
                            </label>
                            <input
                                type="number"
                                value={downPayment}
                                onChange={e => setDownPayment(e.target.value)}
                                onFocus={e => e.target.select()}
                                className="w-full h-8 border border-gray-400 px-2 text-sm text-center font-bold focus:border-purple-600 outline-none"
                            />
                        </div>

                        {/* Added Fee */}
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">
                                {t("sale_ticket.dialogs.installment.added_fee")}
                            </label>
                            <input
                                type="number"
                                value={fee}
                                onChange={e => setFee(e.target.value)}
                                onFocus={e => e.target.select()}
                                className="w-full h-8 border border-gray-400 px-2 text-sm text-center font-bold focus:border-purple-600 outline-none"
                            />
                        </div>

                        {/* Count */}
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">
                                {t("sale_ticket.dialogs.installment.count")}
                            </label>
                            <input
                                type="number"
                                min="2"
                                value={count}
                                onChange={e => setCount(Number(e.target.value))}
                                className="w-full h-8 border border-gray-400 px-2 text-sm text-center font-bold outline-none"
                            />
                        </div>

                        {/* Interval */}
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">
                                {t("sale_ticket.dialogs.installment.interval")}
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={days}
                                onChange={e => setDays(Number(e.target.value))}
                                className="w-full h-8 border border-gray-400 px-2 text-sm text-center font-bold outline-none"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500">
                            {t("sale_ticket.dialogs.installment.start_date")}
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full h-8 border border-gray-400 px-2 text-sm outline-none uppercase font-mono"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        <button
                            onClick={() => handleSubmit(false)}
                            className="h-9 bg-gray-200 border border-gray-400 text-xs font-bold uppercase hover:bg-gray-300 flex items-center justify-center gap-1"
                        >
                            <Check size={14} /> {t("sale_ticket.dialogs.installment.btn_save")}
                        </button>

                        {/* Uncomment if you want print button later
                        <button onClick={() => handleSubmit(true)} className="h-9 bg-purple-700 text-white border border-purple-900 text-xs font-bold uppercase hover:bg-purple-800 flex items-center justify-center gap-1">
                            <Printer size={14} /> {t("sale_ticket.dialogs.installment.btn_save_print")}
                        </button> 
                        */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}