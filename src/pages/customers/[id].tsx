"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerTransactions, getCustomerById, Customer, Transaction } from "@/lib/api/customers";
import { getSalesHistory, SaleHistoryItem, SalesFilters } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";
import HistoryTable from "@/app/add-item/history/components/HistoryTable";
import PrintCustomerSales from "./[id]/components/PrintCustomerSales";
import { Printer } from "lucide-react";

const HISTORY_LIMIT_OPTIONS = [20, 100, 1000, 10000, 100000];

export default function CustomerHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [historyData, setHistoryData] = useState<SaleHistoryItem[]>([]);
    const [historyMeta, setHistoryMeta] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyLimit, setHistoryLimit] = useState(20);
    const [historyPaymentType, setHistoryPaymentType] = useState<string>("all");

    useEffect(() => {
        if (id) loadData(Number(id));
    }, [id, page]);

    const loadData = async (cid: number) => {
        setLoading(true);
        try {
            const [c, res] = await Promise.all([
                getCustomerById(cid),
                getCustomerTransactions(cid, page, 20)
            ]);
            setCustomer(c ?? null);
            if (res) {
                setTransactions(res.data);
                setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
            }
        } catch {
            setCustomer(null);
        }
        setLoading(false);
    };

    // Use route param for customer_id so we always send it (API may not return id in customer body)
    const customerIdParam = id ? Number(id) : undefined;

    const historyFilters: SalesFilters = {
        customer_id: customerIdParam ?? undefined,
        payment_type: historyPaymentType !== "all" ? historyPaymentType : undefined,
    };

    useEffect(() => {
        if (customerIdParam == null || isNaN(customerIdParam)) return;
        let cancelled = false;
        setHistoryLoading(true);
        getSalesHistory(historyPage, historyLimit, { ...historyFilters, customer_id: customerIdParam })
            .then((res) => {
                if (cancelled || !res) return;
                setHistoryData(res.data);
                setHistoryMeta({
                    current_page: res.meta.current_page,
                    total_pages: res.meta.total_pages,
                    total_items: res.meta.total_items,
                });
            })
            .finally(() => { if (!cancelled) setHistoryLoading(false); });
        return () => { cancelled = true; };
    }, [customerIdParam, historyPage, historyLimit, historyPaymentType]);

    const customerDisplayName = customer?.name ?? (id ? `#${id}` : "");

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col print:bg-white">
            <div className="bg-blue-600 h-13 p-3 flex justify-between items-center sticky top-0 z-30 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/customers")} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                        <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                        {t("customer.back")}
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <h1 className="font-bold text-white uppercase tracking-tight">
                        {t("customer.ledger_title")}
                    </h1>
                </div>
                <div className="text-right text-white">
                    <div className="text-xs opacity-75">{t("customer.account")}</div>
                    <div className="font-bold">{customerDisplayName}</div>
                </div>
            </div>

            <PrintCustomerSales customerName={customerDisplayName} balance={customer?.balance} sales={historyData} transactions={transactions} />

            <div className="flex-1 flex overflow-hidden p-4 gap-4 print:hidden">
                {/* Left: Ledger */}
                <div className="flex-[1] min-w-0 flex flex-col max-w-md">
                    <div className="bg-white border border-gray-400 flex flex-col flex-1 min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-400">
                                <tr>
                                    <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-16 text-center">{t("customer.table.id")}</th>
                                    <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">{t("customer.table.date")}</th>
                                    <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">{t("customer.table.desc")}</th>
                                    <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32 text-right">{t("customer.table.added")}</th>
                                    <th className="p-2 text-xs font-bold uppercase w-32 text-right">{t("customer.table.paid")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {loading ? <tr><td colSpan={5} className="p-8 text-center">{t("customer.table.loading")}</td></tr> :
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-blue-50">
                                            <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">{tx.id}</td>
                                            <td className="p-2 border-r border-gray-100 text-xs font-mono">{new Date(tx.created_at).toLocaleDateString()}</td>
                                            <td className="p-2 border-r border-gray-100">{tx.description}</td>
                                            <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">{tx.amount > 0 ? tx.amount.toLocaleString() : "-"}</td>
                                            <td className="p-2 text-right font-mono font-bold text-green-600">{tx.amount < 0 ? Math.abs(tx.amount).toLocaleString() : "-"}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="mt-auto border-t border-gray-400 p-2 bg-gray-50 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-600">{t("customer.table.page")} {page} {t("customer.table.of")} {totalPages}</span>
                            <div className="flex gap-1">
                                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold disabled:opacity-50">{t("customer.table.prev")}</button>
                                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold disabled:opacity-50">{t("customer.table.next")}</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sales history for this customer (2/3 width) */}
                <div className="flex-[2] min-w-0 flex flex-col min-h-0">
                    <div className="shrink-0 mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-bold uppercase text-gray-700">{t("customer.sales_history_title")}</h2>
                        {id && (
                            <span className="text-xs text-gray-500">({t("customer.filtered_by")}: {customerDisplayName})</span>
                        )}
                        {/* Filters + limit + print */}
                        <div className="flex flex-wrap items-center gap-2 ml-auto print:hidden">
                            <label className="text-[10px] font-bold uppercase text-gray-600">{t("sales_history.filters.payment_type")}</label>
                            <select
                                value={historyPaymentType}
                                onChange={(e) => { setHistoryPaymentType(e.target.value); setHistoryPage(1); }}
                                className="h-8 border border-gray-400 px-2 text-xs bg-white min-w-[100px]"
                            >
                                <option value="all">{t("sales_history.filters.all_types")}</option>
                                <option value="cash">{t("sales_history.filters.cash")}</option>
                                <option value="loan">{t("sales_history.filters.loan")}</option>
                                <option value="installment">{t("sales_history.filters.installment")}</option>
                            </select>
                            <label className="text-[10px] font-bold uppercase text-gray-600">{t("sales_history.filters.show_rows")}</label>
                            <select
                                value={historyLimit}
                                onChange={(e) => { setHistoryLimit(Number(e.target.value)); setHistoryPage(1); }}
                                className="h-8 border border-gray-400 px-2 text-xs font-bold bg-white"
                            >
                                {HISTORY_LIMIT_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => window.print()}
                                className="h-8 flex items-center gap-1.5 bg-black text-white px-3 text-xs font-bold uppercase border border-black hover:bg-gray-800"
                            >
                                <Printer size={14} />
                                {t("customer.actions.print_list")}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col bg-white">
                        <HistoryTable
                            data={historyData}
                            loading={historyLoading}
                            meta={historyMeta}
                            onPageChange={setHistoryPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}