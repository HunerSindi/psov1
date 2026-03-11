import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Ensure you have Shadcn Dialog installed
import { Company } from "@/lib/api/companies";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    companies: Company[];
    onSubmit: (data: { company_id: number; payment_type: string; paid_amount: number }) => Promise<void>;
    loading: boolean;
}

export default function CreateReceiptDialog({ isOpen, onClose, companies, onSubmit, loading }: Props) {
    const [companyId, setCompanyId] = useState<number | "">("");
    const [paymentType, setPaymentType] = useState("cash");
    const [paidAmount, setPaidAmount] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        await onSubmit({
            company_id: Number(companyId),
            payment_type: paymentType,
            paid_amount: Number(paidAmount),
        });

        // Reset local state if needed, or parent handles close
        setPaidAmount(0);
        setCompanyId("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Create New Receipt</DialogTitle>
                    <DialogDescription>
                        Select a company to start a new transaction.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* 1. Company Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                            required
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={companyId}
                            onChange={(e) => setCompanyId(Number(e.target.value))}
                        >
                            <option value="">-- Select Company --</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Payment Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                            >
                                <option value="cash">Cash</option>
                                <option value="loan">Loan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !companyId}
                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Receipt"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}