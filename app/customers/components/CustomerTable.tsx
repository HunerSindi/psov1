"use client";
import { Customer } from "@/lib/api/customers";
import { Edit, Trash2, Eye, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    customers: Customer[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onEdit: (c: Customer) => void;
    onDelete: (id: number) => void;
    onPay: (c: Customer) => void;
}

export default function CustomerTable({
    customers, loading, page, totalPages, onPageChange,
    onEdit, onDelete, onPay
}: Props) {
    const router = useRouter();
    const { t } = useSettings();

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400">
            <div className="flex-1 overflow-auto relative">
                {loading && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center font-bold">
                    {t("customer.table.loading")}
                </div>}

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-0 shadow-sm">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-12 text-center">{t("customer.table.id")}</th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">{t("customer.table.name")}</th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">{t("customer.table.nickname")}</th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">{t("customer.table.phone")}</th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-20 text-center">{t("customer.table.status")}</th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-28 text-right">{t("customer.table.balance")}</th>
                            <th className="p-2 text-center text-xs font-bold uppercase w-32">{t("customer.table.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {customers.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-gray-500 italic">{t("customer.table.no_data")}</td></tr> :
                            customers.map((c) => (
                                <tr key={c.id} className="hover:bg-blue-50 group">
                                    <td className="p-2 border-r border-gray-100 text-center text-gray-500 font-mono">{c.id}</td>
                                    <td className="p-2 border-r border-gray-100 font-bold text-gray-800">{c.name}</td>
                                    <td className="p-2 border-r border-gray-100 text-gray-600">{c.name2 || "-"}</td>
                                    <td className="p-2 border-r border-gray-100 font-mono text-xs">{c.phone}</td>
                                    <td className="p-2 border-r border-gray-100 text-center">
                                        <span className={`text-[10px] uppercase font-bold px-1 border ${c.active ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                            {c.active ? t("customer.table.active") : t("customer.table.inactive")}
                                        </span>
                                    </td>
                                    <td className={`p-2 border-r border-gray-100 text-right font-mono font-bold ${(c.balance || 0) > 0 ? "text-red-600" : "text-green-600"}`}>
                                        {(c.balance || 0).toLocaleString()}
                                    </td>
                                    <td className="p-2 text-center flex items-center justify-center gap-2">
                                        <button onClick={() => router.push(`/customers/${c.id}`)} className="text-gray-600 hover:text-black"><Eye size={16} /></button>
                                        <button onClick={() => onPay(c)} className="text-green-600 hover:text-green-800"><DollarSign size={16} /></button>
                                        <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                        <button onClick={() => onDelete(c.id!)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="border-t border-gray-400 p-2 bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600">{t("customer.table.total_pages")}: {totalPages}</span>
                <div className="flex gap-1">
                    <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">{t("customer.table.prev")}</button>
                    <span className="px-3 py-1 text-xs font-bold bg-white border border-gray-400">{page}</span>
                    <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">{t("customer.table.next")}</button>
                </div>
            </div>
        </div>
    );
}