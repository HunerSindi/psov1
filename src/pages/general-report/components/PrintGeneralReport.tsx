"use client";

import { GeneralData, GeneralMeta } from "@/lib/api/analytics_general";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    data: GeneralData | null;
    meta: GeneralMeta;
}

export default function PrintGeneralReport({ data, meta }: Props) {
    const { t, settings } = useSettings();

    if (!data) return null;

    const { revenue_breakdown, costs_breakdown, profit_summary, total_orders } = data;

    return (
        <div className="hidden print:block font-sans bg-white text-black">

            {/* 1. Header with Logo */}
            <div className="w-full border-b-2 border-black mb-6 pb-4">
                {settings.headerA4 ? (
                    <img
                        src={settings.headerA4}
                        alt="Header"
                        className="w-full h-auto max-h-[150px] mb-4"
                    />
                ) : (
                    <div className="h-4"></div>
                )}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">{t("analytics_general.print.report_title") || "General Financial Report"}</h1>
                        <p className="text-sm mt-1">
                            {t("analytics_general.print.generated_on") || "Generated on"}: <span className="font-mono font-bold">{new Date().toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm uppercase font-bold text-gray-600">{t("analytics_general.print.period") || "Period"}</p>
                        <p className="font-mono font-bold text-lg">
                            {new Date(meta.start_date).toLocaleDateString()} — {new Date(meta.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Content Tables */}
            <div className="space-y-6">

                {/* Revenue Section */}
                <div className="border border-black">
                    <div className="bg-gray-100 p-2 border-b border-black font-bold uppercase text-sm">
                        {t("analytics_general.cards.revenue_title") || "Revenue"}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.gross_sales") || "Gross Sales"} value={revenue_breakdown.gross_sales} />
                        <PrintRow label={t("analytics_general.labels.loan_sales") || " (Includes Loan Sales)"} value={revenue_breakdown.loan_sales} italic />
                        <PrintRow label={t("analytics_general.labels.refunds") || "Refunds"} value={-revenue_breakdown.refunds} />
                        <PrintRow label={t("analytics_general.labels.installment_fees") || "Installment Fees"} value={revenue_breakdown.installment_fees} />
                        <div className="border-t border-black my-2"></div>
                        <PrintRow label={t("analytics_general.labels.net_revenue") || "Net Revenue"} value={revenue_breakdown.net_revenue} bold />
                    </div>
                </div>

                {/* Costs Section */}
                <div className="border border-black">
                    <div className="bg-gray-100 p-2 border-b border-black font-bold uppercase text-sm">
                        {t("analytics_general.cards.costs_title") || "Costs"}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.gross_cogs") || "Gross COGS"} value={costs_breakdown.gross_cogs} />
                        <PrintRow label={t("analytics_general.labels.returned_cogs") || "Returned Items Cost"} value={-costs_breakdown.returned_cogs} />
                        <div className="border-t border-dashed border-gray-400 my-1"></div>
                        <PrintRow label={t("analytics_general.labels.net_cogs") || "Net COGS"} value={costs_breakdown.net_cogs} bold />

                        <div className="h-4"></div>
                        <PrintRow label={t("analytics_general.labels.operating_expenses") || "Operating Expenses"} value={costs_breakdown.operating_expenses} />
                        <PrintRow label={t("analytics_general.labels.discounts_given") || "Discounts Given"} value={costs_breakdown.discounts_given} />
                    </div>
                </div>

                {/* Profit Section */}
                <div className="border-2 border-black">
                    <div className="bg-black text-white p-2 font-bold uppercase text-sm">
                        {t("analytics_general.cards.profit_title") || "Profit"}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.gross_profit") || "Gross Profit"} value={profit_summary.gross_profit} />
                        <div className="border-t border-dashed border-gray-400 my-2"></div>
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>{t("analytics_general.labels.net_profit") || "Net Profit"}</span>
                            <span className="font-mono">{profit_summary.net_profit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Orders Count */}
                <div className="flex justify-between items-center p-2 border border-gray-400 bg-gray-50 text-sm">
                    <span className="uppercase font-bold">{t("analytics_general.cards.orders") || "Total Orders"}</span>
                    <span className="font-bold">{total_orders}</span>
                </div>

            </div>
        </div>
    );
}

function PrintRow({ label, value, bold = false, italic = false }: { label: string, value: number, bold?: boolean, italic?: boolean }) {
    return (
        <div className={`flex justify-between mb-1 ${bold ? 'font-bold text-black' : 'text-gray-800'} ${italic ? 'italic text-gray-500 text-xs pl-4' : ''}`}>
            <span className="text-sm">{label}</span>
            <span className="font-mono">{value.toLocaleString()}</span>
        </div>
    );
}