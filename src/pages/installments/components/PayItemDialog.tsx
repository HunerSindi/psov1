"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => Promise<void>;
    totalDue: number;
}

export default function PayItemDialog({ isOpen, onClose, onSubmit, totalDue }: Props) {
    const [amount, setAmount] = useState(totalDue.toString());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(parseFloat(amount) || 0);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-xs border-2 border-green-700 rounded-none p-0 gap-0">
                <DialogHeader className="bg-green-700 p-2 text-white">
                    <DialogTitle className="text-xs font-bold uppercase">Settle Installment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-3">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500">Amount to Pay</label>
                        <input autoFocus type="number" step="any" className="w-full h-9 border border-gray-400 px-2 text-lg font-mono font-bold text-center outline-none focus:border-green-600"
                            value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="flex-1 h-8 bg-gray-200 text-xs font-bold border border-gray-400">CANCEL</button>
                        <button type="submit" disabled={loading} className="flex-1 h-8 bg-green-600 text-white text-xs font-bold border border-green-800 hover:bg-green-700">
                            {loading ? "..." : "CONFIRM"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}