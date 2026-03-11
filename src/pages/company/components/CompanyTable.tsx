"use client";

import React from "react";
import { Company } from "@/lib/api/companies";
import { Edit, Trash2, Eye, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    companies: Company[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    onEdit: (c: Company) => void;
    onDelete: (id: number) => void;
    onPay: (c: Company) => void;
    permissions: { canEdit: boolean; canDelete: boolean; canPay: boolean };
}

export default function CompanyTable({
    companies, loading, page, totalPages, onPageChange,
    onEdit, onDelete, onPay, permissions
}: Props) {
    const navigate = useNavigate();
    const { t } = useSettings();

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400">
            <div className="flex-1 overflow-auto relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <span className="font-bold text-sm uppercase animate-pulse">
                            {t("company.table.loading")}
                        </span>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-0">
                        <tr>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-12 text-center">
                                {t("company.table.id")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                                {t("company.table.name")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                                {t("company.table.phone")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-48">
                                {t("company.table.address")}
                            </th>
                            <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase text-right w-32">
                                {t("company.table.balance")}
                            </th>
                            <th className="p-2 text-center text-xs font-bold uppercase w-40">
                                {t("company.table.actions")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {companies.length === 0 && !loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">{t("company.table.no_data")}</td></tr>
                        ) : (
                            companies.map((c) => (
                                <tr key={c.id} className="hover:bg-blue-50 group">
                                    <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">{c.id}</td>
                                    <td className="p-2 border-r border-gray-100 font-bold text-gray-800">{c.name}</td>
                                    <td className="p-2 border-r border-gray-100 text-xs font-mono">{c.phone}</td>
                                    <td className="p-2 border-r border-gray-100 text-xs text-gray-500 truncate max-w-xs">{c.address}</td>
                                    <td className={`p-2 border-r border-gray-100 text-right font-mono font-bold ${(c.balance || 0) > 0 ? "text-green-600" : (c.balance || 0) < 0 ? "text-red-600" : "text-gray-400"
                                        }`}>
                                        {(c.balance || 0).toLocaleString()}
                                    </td>
                                    <td className="p-2 text-center flex items-center justify-center gap-2">
                                        <button onClick={() => navigate(`/company/${c.id}`)} title="History" className="text-gray-600 hover:text-black">
                                            <Eye size={16} />
                                        </button>

                                        {permissions.canPay && (
                                            <button onClick={() => onPay(c)} title="Pay/Debt" className="text-green-600 hover:text-green-800">
                                                <DollarSign size={16} />
                                            </button>
                                        )}

                                        {permissions.canEdit && (
                                            <button onClick={() => onEdit(c)} title="Edit" className="text-blue-600 hover:text-blue-800">
                                                <Edit size={16} />
                                            </button>
                                        )}

                                        {permissions.canDelete && (
                                            <button onClick={() => onDelete(c.id!)} title="Delete" className="text-red-600 hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <div className="border-t border-gray-400 p-2 bg-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600">
                    {t("company.table.total_pages")}: {totalPages}
                </span>
                <div className="flex gap-1">
                    <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">
                        {t("company.table.prev")}
                    </button>
                    <span className="px-3 py-1 text-xs font-bold bg-white border border-gray-400">{page}</span>
                    <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold hover:bg-gray-100 disabled:opacity-50">
                        {t("company.table.next")}
                    </button>
                </div>
            </div>
        </div>
    );
}