"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getRefundHistory, RefundHistoryItem } from "@/lib/api/sales-history";
import { ArrowLeft, Search } from "lucide-react";

export default function RefundHistoryPage() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const [data, setData] = useState<RefundHistoryItem[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadData();
    }, [page, search]);

    const loadData = async () => {
        setLoading(true);
        const res = await getRefundHistory(page, 20, search || undefined);
        if (res) {
            setData(res.data ?? []);
            if (res.meta) setMeta(res.meta);
        } else {
            setData([]);
        }
        setLoading(false);
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
                        {t("sales_history.refund_history.title")}
                    </h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 max-w-5xl mx-auto w-full">
                <div className="bg-white border border-gray-300 shadow-sm rounded p-3 mb-4 flex flex-wrap gap-2 items-center">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder={t("sales_history.refund.search_placeholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setPage(1)}
                        className="flex-1 min-w-[180px] h-9 border border-gray-300 px-3 rounded outline-none focus:border-blue-600"
                    />
                    <button
                        onClick={() => setPage(1)}
                        className="h-9 bg-blue-600 text-white px-4 rounded text-sm font-bold uppercase"
                    >
                        {t("sales_history.refund.search_btn")}
                    </button>
                </div>

                <div className="bg-white border border-gray-300 shadow-sm rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.refund_history.invoice")}</th>
                                <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.refund_history.date_refunded")}</th>
                                <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.refund_history.refunded_by")}</th>
                                <th className="p-2 text-xs font-bold uppercase text-gray-600">{t("sales_history.refund_history.customer")}</th>
                                <th className="p-2 text-xs font-bold uppercase text-gray-600 text-right">{t("sales_history.refund_history.amount")}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                        {t("sales_history.refund_history.loading")}
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                        {t("sales_history.refund_history.no_records")}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-2 font-mono font-bold">#{row.sale_id} / {row.ticket_number}</td>
                                        <td className="p-2 text-gray-700">{new Date(row.refunded_at).toLocaleString()}</td>
                                        <td className="p-2 font-medium">{row.refunded_by || "—"}</td>
                                        <td className="p-2">{row.customer_name || t("sales_history.table.guest")}</td>
                                        <td className="p-2 text-right font-mono font-bold text-red-600">-{row.final_amount.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {meta.total_pages > 1 && (
                        <div className="p-2 border-t border-gray-200 flex justify-between items-center text-xs">
                            <span className="text-gray-600">
                                {t("sales_history.table.total_records")}: {meta.total_items}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-3 py-1 border border-gray-400 rounded font-bold disabled:opacity-50"
                                >
                                    {t("sales_history.table.prev")}
                                </button>
                                <span className="px-2 py-1 font-mono">
                                    {page} / {meta.total_pages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                                    disabled={page >= meta.total_pages}
                                    className="px-3 py-1 border border-gray-400 rounded font-bold disabled:opacity-50"
                                >
                                    {t("sales_history.table.next")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
