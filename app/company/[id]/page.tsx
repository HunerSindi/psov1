"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCompanyTransactions, getCompany, Transaction, Company } from "@/lib/api/companies";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

export default function CompanyTransactionsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t, dir } = useSettings();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    useEffect(() => {
        if (id) {
            loadData(Number(id));
        }
    }, [id, page]);

    const loadData = async (compId: number) => {
        setLoading(true);
        if (!company) {
            const c = await getCompany(compId);
            setCompany(c);
        }

        const res = await getCompanyTransactions(compId, page, limit);
        if (res) {
            setTransactions(res.data);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">

            {/* Classic Header */}
            <div className="bg-blue-700 border-b border-blue-900 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/company")}
                        className="text-white font-bold hover:text-gray-200 uppercase text-sm flex items-center gap-1"
                    >
                        <span className="text-xl pb-1">
                            {dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}
                        </span>
                        {t("company.back")}
                    </button>
                    <div className="h-6 w-px bg-white/40"></div>
                    <h1 className="font-bold text-white uppercase tracking-tight">
                        {t("company.statement_title")}
                    </h1>
                </div>
                {company && (
                    <div className="text-right text-white">
                        <div className="text-xs opacity-75">Company</div>
                        <div className="font-bold">{company.name}</div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 max-w-5xl mx-auto w-full">

                <div className="bg-white border border-gray-400 flex flex-col min-h-[500px]">

                    {/* Table */}
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-400">
                            <tr>
                                <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-16 text-center">
                                    {t("company.table.id")}
                                </th>
                                <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                    {t("company.table.date")}
                                </th>
                                <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                                    {t("company.table.description")}
                                </th>
                                <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32 text-right">
                                    {t("company.table.debit")}
                                </th>
                                <th className="p-2 text-xs font-bold uppercase w-32 text-right">
                                    {t("company.table.credit")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">
                                    {t("company.table.loading_history")}
                                </td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">
                                    {t("company.table.no_history")}
                                </td></tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-blue-50">
                                        <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">{t.id}</td>
                                        <td className="p-2 border-r border-gray-100 text-xs font-mono">
                                            {new Date(t.created_at).toLocaleDateString()}
                                            <span className="text-gray-400 ml-1">{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="p-2 border-r border-gray-100">{t.description}</td>

                                        {/* Debit (Positive) */}
                                        <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">
                                            {t.amount > 0 ? t.amount.toLocaleString() : "-"}
                                        </td>

                                        {/* Credit (Negative) */}
                                        <td className="p-2 text-right font-mono font-bold text-green-600">
                                            {t.amount < 0 ? Math.abs(t.amount).toLocaleString() : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-auto border-t border-gray-400 p-2 bg-gray-50 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600">
                            {t("company.table.page")} {page} {t("company.table.of")} {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold disabled:opacity-50">
                                {t("company.table.prev")}
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold disabled:opacity-50">
                                {t("company.table.next")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}