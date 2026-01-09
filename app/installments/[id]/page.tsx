"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInstallmentItems, payInstallmentItem, InstallmentItem } from "@/lib/api/installments";
import { ArrowLeft, CheckCircle, DollarSign } from "lucide-react";
import PayItemDialog from "../components/PayItemDialog";

export default function InstallmentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [items, setItems] = useState<InstallmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Pay Dialog State
    const [payItem, setPayItem] = useState<InstallmentItem | null>(null);

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        const data = await getInstallmentItems(Number(id));
        setItems(data || []);
        setLoading(false);
    };

    const handlePaySubmit = async (amount: number) => {
        if (payItem) {
            const success = await payInstallmentItem(payItem.id, amount);
            if (success) {
                alert("Payment Recorded!");
                setPayItem(null);
                loadData();
            } else {
                alert("Payment Failed");
            }
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans">
            <div className="bg-blue-700 border-b border-blue-900 p-3 flex justify-between items-center text-white sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="font-bold hover:text-gray-200 uppercase text-xs flex items-center gap-1">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="h-6 w-px bg-white/40"></div>
                    <h1 className="font-bold uppercase tracking-tight text-lg">Plan Details #{id}</h1>
                </div>
            </div>

            <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
                <div className="bg-white border border-gray-400 flex flex-col">
                    <div className="p-3 bg-gray-50 border-b border-gray-300">
                        <h2 className="text-sm font-bold uppercase text-gray-700">Installment Schedule</h2>
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-400">
                                <tr>
                                    <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-12 text-center">#</th>
                                    <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-32">Due Date</th>
                                    <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase text-right w-32">Amount</th>
                                    <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-center">Status</th>
                                    <th className="p-2 text-[10px] font-bold uppercase w-24 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {loading ? <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr> :
                                    items.map((item) => (
                                        <tr key={item.id} className={item.is_paid ? "bg-green-50" : "hover:bg-blue-50"}>
                                            <td className="p-2 border-r border-gray-100 text-center font-mono">{item.sequence_number}</td>
                                            <td className="p-2 border-r border-gray-100 font-bold text-xs">{item.due_date}</td>
                                            <td className="p-2 border-r border-gray-100 text-right font-mono font-bold">
                                                {item.amount.toLocaleString()}
                                            </td>
                                            <td className="p-2 border-r border-gray-100 text-center">
                                                {item.is_paid
                                                    ? <span className="text-green-700 font-bold text-xs flex items-center justify-center gap-1"><CheckCircle size={14} /> PAID</span>
                                                    : <span className="text-red-600 font-bold text-xs">UNPAID</span>
                                                }
                                            </td>
                                            <td className="p-2 text-center">
                                                {!item.is_paid && (
                                                    <button
                                                        onClick={() => setPayItem(item)}
                                                        className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase hover:bg-gray-800 flex items-center justify-center gap-1 mx-auto"
                                                    >
                                                        <DollarSign size={12} /> PAY
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pay Dialog */}
            {payItem && (
                <PayItemDialog
                    isOpen={!!payItem}
                    onClose={() => setPayItem(null)}
                    totalDue={payItem.amount}
                    onSubmit={handlePaySubmit}
                />
            )}
        </div>
    );
}