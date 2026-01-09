"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCustomerTransactions, getCustomerById, Customer, Transaction } from "@/lib/api/customers";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function CustomerHistory() {
    const { id } = useParams();
    const router = useRouter();
    const { t, dir } = useSettings();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (id) loadData(Number(id));
    }, [id, page]);

    const loadData = async (cid: number) => {
        setLoading(true);
        if (!customer) { const c = await getCustomerById(cid); setCustomer(c); }
        const res = await getCustomerTransactions(cid, page, 20);
        if (res) {
            setTransactions(res.data);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <div className="bg-blue-700 border-b border-blue-900 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/customers")} className="text-white font-bold hover:text-gray-200 uppercase text-sm flex items-center gap-1">
                        <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                        {t("customer.back")}
                    </button>
                    <div className="h-6 w-px bg-white/40"></div>
                    <h1 className="font-bold text-white uppercase tracking-tight">{t("customer.ledger_title")}</h1>
                </div>
                {customer && <div className="text-right text-white"><div className="text-xs opacity-75">{t("customer.account")}</div><div className="font-bold">{customer.name}</div></div>}
            </div>
            <div className="flex-1 p-4 max-w-5xl mx-auto w-full">
                <div className="bg-white border border-gray-400 flex flex-col min-h-[500px]">
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
                                transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50">
                                        <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">{t.id}</td>
                                        <td className="p-2 border-r border-gray-100 text-xs font-mono">{new Date(t.created_at).toLocaleDateString()}</td>
                                        <td className="p-2 border-r border-gray-100">{t.description}</td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">{t.amount > 0 ? t.amount.toLocaleString() : "-"}</td>
                                        <td className="p-2 text-right font-mono font-bold text-green-600">{t.amount < 0 ? Math.abs(t.amount).toLocaleString() : "-"}</td>
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
        </div>
    );
}