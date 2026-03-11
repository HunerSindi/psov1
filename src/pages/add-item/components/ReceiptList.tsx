"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, PaginationMeta } from "@/lib/api/receipts";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipts: Receipt[];
    meta: PaginationMeta;
    loading: boolean;
    title: string;
    onPageChange: (page: number) => void;
}

export default function ReceiptList({ receipts, meta, loading, title, onPageChange }: Props) {
    const navigate = useNavigate();
    const { t, dir } = useSettings();

    const handlePrev = () => {
        if (meta.current_page > 1) onPageChange(meta.current_page - 1);
    };

    const handleNext = () => {
        if (meta.current_page < meta.total_pages) onPageChange(meta.current_page + 1);
    };

    return (
        <div className="flex flex-col h-full border border-gray-300 bg-white shadow-sm rounded-sm">

            {/* Classic Header */}
            <div className="bg-gray-100 border-b border-gray-300 p-3 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h2>
                <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-300 px-2 py-0.5">
                    {t("add_item.total_items")}: {meta.total_items}
                </span>
            </div>

            {/* Classic Table */}
            <div className="flex-1 overflow-auto bg-white relative">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.id")}</th>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.date")}</th>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.type_label")}</th>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.total")}</th>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.paid")}</th>
                            <th className="border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 uppercase">{t("add_item.action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 italic border border-gray-300">
                                    {t("add_item.loading")}
                                </td>
                            </tr>
                        ) : receipts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 italic border border-gray-300">
                                    {t("add_item.no_receipts")}
                                </td>
                            </tr>
                        ) : (
                            receipts.map((r, index) => (
                                <tr
                                    key={r.id}
                                    className={`
                                        hover:bg-blue-50 transition-colors 
                                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                                    `}
                                >
                                    <td className="border border-gray-300 px-4 py-2 text-sm font-mono text-gray-600">
                                        #{r.id}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                                        {new Date(r.date).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 border uppercase ${r.payment_type === 'cash'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                            {r.payment_type === 'cash' ? t("add_item.cash") : t("add_item.loan")}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm font-bold text-gray-900 text-right">
                                        {r.final_amount.toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600 text-right">
                                        {r.paid_amount.toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => navigate(`/add-item/${r.id}`)}
                                            className="text-blue-700 hover:underline font-bold text-xs"
                                        >
                                            [ {t("add_item.open_btn")} ]
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-gray-100 border-t border-gray-300 p-2 flex justify-between items-center shrink-0">
                <div className="text-xs text-gray-600">
                    {t("add_item.showing_page")} <span className="font-bold">{meta.current_page}</span> {t("add_item.of")} <span className="font-bold">{meta.total_pages}</span>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={handlePrev}
                        disabled={meta.current_page === 1}
                        className="px-3 py-1 bg-white border border-gray-300 text-xs font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 rounded-sm flex items-center gap-1"
                    >
                        {dir === 'rtl' ? <>&gt;</> : <>&lt;</>} {t("add_item.prev")}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={meta.current_page === meta.total_pages}
                        className="px-3 py-1 bg-white border border-gray-300 text-xs font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 rounded-sm flex items-center gap-1"
                    >
                        {t("add_item.next")} {dir === 'rtl' ? <>&lt;</> : <>&gt;</>}
                    </button>
                </div>
            </div>
        </div>
    );
}