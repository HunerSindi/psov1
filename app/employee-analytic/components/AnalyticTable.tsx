"use client";

import { EmployeeAnalytic } from "@/lib/api/analytics";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    data: EmployeeAnalytic[];
    loading: boolean;
}

export default function AnalyticTable({ data, loading }: Props) {
    const { t } = useSettings();

    // Calculate totals for footer
    const totals = data.reduce((acc, item) => ({
        receipt_count: acc.receipt_count + item.receipt_count,
        total_sales: acc.total_sales + item.total_sales,
        total_collected: acc.total_collected + item.total_collected,
        total_discount: acc.total_discount + item.total_discount,
        refund_count: acc.refund_count + item.refund_count,
        total_refunded: acc.total_refunded + item.total_refunded,
        total_expenses: acc.total_expenses + item.total_expenses,
        net_cash_in_hand: acc.net_cash_in_hand + item.net_cash_in_hand,
    }), {
        receipt_count: 0, total_sales: 0, total_collected: 0, total_discount: 0,
        refund_count: 0, total_refunded: 0, total_expenses: 0, net_cash_in_hand: 0
    });

    return (
        // Added 'h-full' and 'min-h-0' and 'flex flex-col' to ensure it takes exactly the space available and scrolls internally
        <div className="bg-white border border-gray-400 h-full flex flex-col min-h-0 shadow-sm relative">

            {/* Scrollable Container */}
            <div className="flex-1 overflow-auto">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-bold text-sm uppercase bg-white px-4 py-2 border shadow">Loading...</span>
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10 shadow-sm text-xs font-bold uppercase text-gray-700">
                        <tr>
                            <th className="p-2 border-r border-gray-300 w-48">{t("analytics.table.user")}</th>
                            <th className="p-2 border-r border-gray-300 text-center w-20">{t("analytics.table.receipts")}</th>
                            <th className="p-2 border-r border-gray-300 text-right">{t("analytics.table.sales")}</th>
                            <th className="p-2 border-r border-gray-300 text-right bg-green-50 text-green-800">{t("analytics.table.collected")}</th>
                            <th className="p-2 border-r border-gray-300 text-right text-red-600">{t("analytics.table.discount")}</th>
                            <th className="p-2 border-r border-gray-300 text-center w-24">{t("analytics.table.refunds")}</th>
                            <th className="p-2 border-r border-gray-300 text-right text-red-600">{t("analytics.table.refunded_amount")}</th>
                            <th className="p-2 border-r border-gray-300 text-right text-orange-600">{t("analytics.table.expenses")}</th>
                            <th className="p-2 text-right bg-blue-50 text-blue-900">{t("analytics.table.net_cash")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {data.length === 0 ? (
                            <tr><td colSpan={9} className="p-8 text-center text-gray-500 italic">{t("analytics.table.no_data")}</td></tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.user_id} className="hover:bg-blue-50">
                                    <td className="p-2 border-r border-gray-100 font-bold">{item.user_name}</td>
                                    <td className="p-2 border-r border-gray-100 text-center">{item.receipt_count}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono">{item.total_sales.toLocaleString()}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-green-700">{item.total_collected.toLocaleString()}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono text-red-500">{item.total_discount.toLocaleString()}</td>
                                    <td className="p-2 border-r border-gray-100 text-center">{item.refund_count}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono text-red-500">{item.total_refunded.toLocaleString()}</td>
                                    <td className="p-2 border-r border-gray-100 text-right font-mono text-orange-600">{item.total_expenses.toLocaleString()}</td>
                                    <td className="p-2 text-right font-mono font-bold text-blue-800 bg-blue-50/30">{item.net_cash_in_hand.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {data.length > 0 && (
                        <tfoot className="bg-gray-100 border-t-2 border-gray-400 font-bold text-xs uppercase sticky bottom-0 z-10">
                            <tr>
                                <td className="p-2 border-r border-gray-400 text-right">{t("analytics.table.totals")}</td>
                                <td className="p-2 border-r border-gray-400 text-center">{totals.receipt_count}</td>
                                <td className="p-2 border-r border-gray-400 text-right">{totals.total_sales.toLocaleString()}</td>
                                <td className="p-2 border-r border-gray-400 text-right text-green-800">{totals.total_collected.toLocaleString()}</td>
                                <td className="p-2 border-r border-gray-400 text-right text-red-600">{totals.total_discount.toLocaleString()}</td>
                                <td className="p-2 border-r border-gray-400 text-center">{totals.refund_count}</td>
                                <td className="p-2 border-r border-gray-400 text-right text-red-600">{totals.total_refunded.toLocaleString()}</td>
                                <td className="p-2 border-r border-gray-400 text-right text-orange-600">{totals.total_expenses.toLocaleString()}</td>
                                <td className="p-2 text-right bg-blue-100 text-blue-900">{totals.net_cash_in_hand.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}