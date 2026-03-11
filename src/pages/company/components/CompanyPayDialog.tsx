"use client";

import { useState } from "react";
import { Company } from "@/lib/api/companies";
import { useSettings } from "@/lib/contexts/SettingsContext"; // 1. Import Hook

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, desc: string) => Promise<void>;
    company: Company | null;
}

export default function CompanyPayDialog({ isOpen, onClose, onSubmit, company }: Props) {
    const { t } = useSettings(); // 2. Get translation helper

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"debt" | "payment">("payment"); // payment = negative (Receive), debt = positive (Add Debt)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Logic: 
        // Payment (Receive) decreases balance (Negative) -> We calculate them
        // Debt increases balance (Positive) -> They calculate us
        let finalAmount = parseFloat(amount);

        if (type === "payment") {
            finalAmount = -Math.abs(finalAmount);
        } else {
            finalAmount = Math.abs(finalAmount);
        }

        await onSubmit(finalAmount, description);

        // Reset
        setAmount("");
        setDescription("");
        setLoading(false);
    };

    if (!isOpen || !company) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 w-full max-w-sm flex flex-col">
                {/* Header */}
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">
                        {t("company.dialogs.transaction_with")}: {company.name}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-4">

                    {/* Type Selector */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setType("payment")}
                            className={`flex-1 py-2 text-xs font-bold uppercase border transition-colors ${type === "payment"
                                    ? "bg-green-100 border-green-600 text-green-800"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {t("company.dialogs.type_receive")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("debt")}
                            className={`flex-1 py-2 text-xs font-bold uppercase border transition-colors ${type === "debt"
                                    ? "bg-red-100 border-red-600 text-red-800"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {t("company.dialogs.type_debt")}
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("company.dialogs.pay_label_amount")}
                        </label>
                        <input
                            autoFocus
                            type="number" step="0.01" required
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-lg font-mono outline-none focus:border-blue-600"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("company.dialogs.pay_label_desc")}
                        </label>
                        <input
                            type="text" required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600"
                            placeholder={
                                type === "payment"
                                    ? t("company.dialogs.placeholder_receive")
                                    : t("company.dialogs.placeholder_debt")
                            }
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 border-t border-gray-300 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white border border-gray-400 py-2 text-xs font-bold uppercase hover:bg-gray-200"
                        >
                            {t("company.dialogs.btn_cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-black border border-black py-2 text-xs font-bold uppercase text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? t("company.dialogs.btn_processing") : t("company.dialogs.btn_confirm")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}