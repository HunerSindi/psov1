"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getSalesByInvoiceNumber, refundInvoice, SaleHistoryItem } from "@/lib/api/sales-history";
import { Search, RotateCcw, ArrowLeft } from "lucide-react";

export default function RefundInvoicePage() {
    const navigate = useNavigate();
    const { t, dir } = useSettings();
    const [invoiceInput, setInvoiceInput] = useState("");
    const [results, setResults] = useState<SaleHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refundingId, setRefundingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSearch = async () => {
        const term = invoiceInput.trim();
        if (!term) return;
        setLoading(true);
        setMessage(null);
        const list = await getSalesByInvoiceNumber(term);
        setResults(list);
        setLoading(false);
        if (list.length === 0) setMessage({ type: "error", text: t("sales_history.refund.no_results") });
    };

    const handleRefund = async (sale: SaleHistoryItem) => {
        if (!confirm(t("sales_history.refund.confirm_refund"))) return;
        setRefundingId(sale.id);
        setMessage(null);
        const { ok, message: msg } = await refundInvoice(sale.id);
        setRefundingId(null);
        if (ok) {
            setMessage({ type: "success", text: t("sales_history.refund.success") });
            setResults((prev) => prev.filter((r) => r.id !== sale.id));
        } else {
            setMessage({ type: "error", text: msg || t("sales_history.refund.error") });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
            <header className="bg-blue-600 border-b border-gray-400 p-3 flex justify-between items-center shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="text-white font-bold hover:opacity-90 uppercase text-sm flex items-center gap-1"
                    >
                        <ArrowLeft size={18} />
                        {t("sales_history.back")}
                    </button>
                    <div className="h-5 w-px bg-white/50" />
                    <h1 className="font-bold text-white uppercase tracking-tight">
                        {t("sales_history.refund.title")}
                    </h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
                <div className="bg-white border border-gray-300 shadow-sm rounded p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-2">{t("sales_history.refund.select_invoice")}</p>
                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text"
                            placeholder={t("sales_history.refund.search_placeholder")}
                            value={invoiceInput}
                            onChange={(e) => setInvoiceInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1 min-w-[200px] h-10 border border-gray-400 px-3 rounded outline-none focus:border-blue-600"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="h-10 bg-blue-600 text-white px-4 rounded font-bold uppercase text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Search size={18} />
                            {loading ? "..." : t("sales_history.refund.search_btn")}
                        </button>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded border ${message.type === "success"
                            ? "bg-green-50 border-green-300 text-green-800"
                            : "bg-red-50 border-red-300 text-red-800"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {results.length > 0 && (
                    <div className="bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.table.ticket")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.table.date")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.table.customer")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.table.type")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600 text-right">{t("sales_history.table.disc")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600 text-right">{t("sales_history.table.final")}</th>
                                    <th className="p-2 text-xs font-bold uppercase text-gray-600 w-28 text-center">{t("sales_history.detail.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {results.map((sale) => (
                                    <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-2 font-mono font-bold">{sale.ticket_number}</td>
                                        <td className="p-2 text-gray-700">{new Date(sale.date).toLocaleString()}</td>
                                        <td className="p-2 font-medium">{sale.customer_name || t("sales_history.table.guest")}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${sale.payment_type === "cash" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                                {sale.payment_type}
                                            </span>
                                        </td>
                                        <td className="p-2 text-right font-mono">{sale.discount_value > 0 ? `-${sale.discount_value.toLocaleString()}` : "0"}</td>
                                        <td className="p-2 text-right font-mono font-bold">{sale.final_amount.toLocaleString()}</td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => handleRefund(sale)}
                                                disabled={refundingId !== null}
                                                className="h-8 px-3 bg-red-600 text-white rounded text-xs font-bold uppercase hover:bg-red-700 disabled:opacity-50 flex items-center gap-1 mx-auto"
                                            >
                                                <RotateCcw size={12} />
                                                {refundingId === sale.id ? "..." : t("sales_history.refund.refund_btn")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
