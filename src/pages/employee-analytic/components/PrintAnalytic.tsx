"use client";

import { EmployeeAnalytic, AnalyticMeta } from "@/lib/api/analytics";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    data: EmployeeAnalytic[];
    meta: AnalyticMeta;
}

export default function PrintAnalytic({ data, meta }: Props) {
    const { t, settings } = useSettings();

    // Calculate totals
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
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] p-0 m-0">
            <table className="w-full border-collapse font-sans text-black">
                {/* Header Image & Info */}
                <thead>
                    <tr>
                        <th colSpan={9} className="w-full pb-4">
                            {settings.headerA4 ? (
                                <img
                                    src={settings.headerA4}
                                    alt="Header"
                                    className="w-full h-auto object-contain max-h-[150px]"
                                />
                            ) : (
                                <div></div>
                            )}
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={9} className="text-left pb-4">
                            <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-end">
                                <div>
                                    <h1 className="text-2xl font-bold uppercase">{t("analytics.print.report_title")}</h1>
                                    <div className="text-sm">
                                        {t("analytics.print.generated_on")}: {new Date().toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="font-bold uppercase text-gray-600">{t("analytics.print.period")}</div>
                                    <div className="font-mono font-bold">
                                        {new Date(meta.start_date).toLocaleDateString()} - {new Date(meta.end_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>

                    {/* Columns */}
                    <tr className="border border-black bg-gray-100 text-[10px] uppercase">
                        <th className="p-1 border-r border-black text-left">{t("analytics.table.user")}</th>
                        <th className="p-1 border-r border-black text-center">{t("analytics.table.receipts")}</th>
                        <th className="p-1 border-r border-black text-right">{t("analytics.table.sales")}</th>
                        <th className="p-1 border-r border-black text-right">{t("analytics.table.collected")}</th>
                        <th className="p-1 border-r border-black text-right">{t("analytics.table.discount")}</th>
                        <th className="p-1 border-r border-black text-center">{t("analytics.table.refunds")}</th>
                        <th className="p-1 border-r border-black text-right">{t("analytics.table.refunded_amount")}</th>
                        <th className="p-1 border-r border-black text-right">{t("analytics.table.expenses")}</th>
                        <th className="p-1 text-right">{t("analytics.table.net_cash")}</th>
                    </tr>
                </thead>

                {/* Footer Totals */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50 text-[10px]">
                        <td className="p-1 border-r border-black text-right">{t("analytics.table.totals")}</td>
                        <td className="p-1 border-r border-black text-center">{totals.receipt_count}</td>
                        <td className="p-1 border-r border-black text-right">{totals.total_sales.toLocaleString()}</td>
                        <td className="p-1 border-r border-black text-right">{totals.total_collected.toLocaleString()}</td>
                        <td className="p-1 border-r border-black text-right">{totals.total_discount.toLocaleString()}</td>
                        <td className="p-1 border-r border-black text-center">{totals.refund_count}</td>
                        <td className="p-1 border-r border-black text-right">{totals.total_refunded.toLocaleString()}</td>
                        <td className="p-1 border-r border-black text-right">{totals.total_expenses.toLocaleString()}</td>
                        <td className="p-1 text-right">{totals.net_cash_in_hand.toLocaleString()}</td>
                    </tr>
                    {/* <tr>
                        <td colSpan={9} className="w-full pt-4">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr> */}
                </tfoot>

                {/* Body */}
                <tbody className="text-[10px]">
                    {data.map((item) => (
                        <tr key={item.user_id} className="border border-black">
                            <td className="p-1 border-r border-black font-bold">{item.user_name}</td>
                            <td className="p-1 border-r border-black text-center">{item.receipt_count}</td>
                            <td className="p-1 border-r border-black text-right">{item.total_sales.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right font-bold">{item.total_collected.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right">{item.total_discount.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-center">{item.refund_count}</td>
                            <td className="p-1 border-r border-black text-right">{item.total_refunded.toLocaleString()}</td>
                            <td className="p-1 border-r border-black text-right">{item.total_expenses.toLocaleString()}</td>
                            <td className="p-1 text-right font-bold">{item.net_cash_in_hand.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                @media print {
                    @page { margin: 10mm; size: A4 landscape; } /* Landscape might be better for many columns */
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}