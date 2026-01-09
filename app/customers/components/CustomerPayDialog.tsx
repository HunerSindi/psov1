"use client";
import { useState } from "react";
import { Customer } from "@/lib/api/customers";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, desc: string) => Promise<void>;
    customer: Customer | null;
}

export default function CustomerPayDialog({ isOpen, onClose, onSubmit, customer }: Props) {
    const { t } = useSettings();
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState<"pay" | "charge">("pay");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let final = parseFloat(amount);
        if (type === "pay") final = -Math.abs(final);
        else final = Math.abs(final);

        await onSubmit(final, desc);
        setAmount(""); setDesc(""); setLoading(false);
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 w-full max-w-sm flex flex-col">
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">{t("customer.dialogs.transaction_with")}: {customer.name}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-4">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setType("pay")} className={`flex-1 py-2 text-xs font-bold uppercase border ${type === "pay" ? "bg-green-100 border-green-600 text-green-800" : "bg-white border-gray-400 text-gray-500"}`}>{t("customer.dialogs.type_receive")}</button>
                        <button type="button" onClick={() => setType("charge")} className={`flex-1 py-2 text-xs font-bold uppercase border ${type === "charge" ? "bg-red-100 border-red-600 text-red-800" : "bg-white border-gray-400 text-gray-500"}`}>{t("customer.dialogs.type_debt")}</button>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.dialogs.label_amount")}</label>
                        <input autoFocus type="number" step="any" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-gray-400 p-2 text-lg font-mono outline-none focus:border-blue-600" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.dialogs.label_note")}</label>
                        <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600" placeholder={t("customer.dialogs.placeholder_note")} />
                    </div>
                    <div className="flex gap-2 border-t border-gray-300 pt-3">
                        <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-400 py-2 text-xs font-bold uppercase hover:bg-gray-200">{t("customer.form.btn_cancel")}</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-black border border-black py-2 text-xs font-bold uppercase text-white hover:bg-gray-800 disabled:opacity-50">{loading ? t("customer.dialogs.btn_wait") : t("customer.dialogs.btn_confirm")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}