"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyReturnById, addItemToReturn, deleteItemFromReturn, CompanyReturn } from "@/lib/api/company_returns";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Trash2 } from "lucide-react";

import AddItemPanel from "./[id]/components/AddItemPanel";

export default function CompanyReturnDetails() {
    const { id } = useParams(); // Get Ticket ID
    const { t, dir } = useSettings();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<CompanyReturn | null>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        const res = await getCompanyReturnById(Number(id));
        if (res) setTicket(res);
    };

    const handleAddItem = async (data: any) => {
        const success = await addItemToReturn(Number(id), data);
        if (success) loadData();
        else alert("Failed to add item");
    };

    const handleDeleteItem = async (itemId: number) => {
        if (confirm("Remove this item?")) {
            await deleteItemFromReturn(Number(id), itemId);
            loadData();
        }
    };

    if (!ticket) return <div className="p-10 text-center uppercase font-bold text-gray-500">Loading Ticket...</div>;

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-purple-800 h-13 p-3 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                        <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                        {t("company_return.back")}
                    </button>
                    <div className="h-6 w-px bg-purple-500"></div>
                    <div className="text-white">
                        <h1 className="font-bold uppercase text-sm">{t("company_return.details_title")} #{ticket.id}</h1>
                        <p className="text-[10px] opacity-80">{ticket.company_name} | {ticket.created_at}</p>
                    </div>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded text-white font-mono font-bold">
                    Total: {(ticket.total_refund_amount || 0).toLocaleString()}
                </div>
            </div>

            {/* Add Item Bar */}
            <AddItemPanel onAddItem={handleAddItem} />

            {/* Items Table */}
            <div className="flex-1 overflow-auto p-4">
                <div className="bg-white border border-gray-400">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-12 text-center">{t("company_return.table.id")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("company_return.table.item")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-center">{t("company_return.form.qty")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-center">{t("company_return.form.unit")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-32 text-right">{t("company_return.table.unit_price")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-32 text-right">{t("company_return.table.total")}</th>
                                <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-16 text-center">{t("company_return.table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ticket.items && ticket.items.length > 0 ? (
                                ticket.items.map((item, idx) => {
                                    // SAFE CALCULATION: If API doesn't return total_price, calculate it
                                    const unitPrice = item.refund_price_per_unit || 0;
                                    const qty = item.quantity || 0;
                                    const total = item.total_price ?? (unitPrice * qty);

                                    return (
                                        <tr key={item.id || idx} className="hover:bg-purple-50">
                                            <td className="p-2 text-xs text-center border-r">{idx + 1}</td>
                                            <td className="p-2 text-xs font-bold border-r">{item.item_name}</td>
                                            <td className="p-2 text-xs text-center font-bold border-r">{qty}</td>
                                            <td className="p-2 text-xs text-center text-gray-600 border-r">{item.unit_type}</td>
                                            <td className="p-2 text-xs text-right font-mono border-r">{unitPrice.toLocaleString()}</td>
                                            <td className="p-2 text-xs text-right font-bold font-mono border-r">{total.toLocaleString()}</td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-xs text-gray-400 italic uppercase">
                                        No items added yet. Scan barcode above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}