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

    const { revenue, costs, profit, total_orders } = data;

    return (
        <div className="hidden print:block font-sans bg-white  text-black">

            {/* 1. Header with Logo */}
            <div className="w-full  border-b-2 border-black ">
                {settings.headerA4 ? (
                    <img
                        src={settings.headerA4}
                        alt="Header"
                        className="w-full h-auto max-h-[150px]"
                    />
                ) : (
                    <div></div>
                )}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">{t("analytics_general.print.report_title")}</h1>
                        <p className="text-sm mt-1">
                            {t("analytics_general.print.generated_on")}: <span className="font-mono font-bold">{new Date().toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm uppercase font-bold text-gray-600">{t("analytics_general.print.period")}</p>
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
                        {t("analytics_general.cards.revenue_title")}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.sales_revenue")} value={revenue.sales_revenue} />
                        <PrintRow label={t("analytics_general.labels.installment_fees")} value={revenue.installment_fees} />
                        <div className="border-t border-black my-2"></div>
                        <PrintRow label={t("analytics_general.labels.total_revenue")} value={revenue.total_revenue} bold />
                    </div>
                </div>

                {/* Costs Section */}
                <div className="border border-black">
                    <div className="bg-gray-100 p-2 border-b border-black font-bold uppercase text-sm">
                        {t("analytics_general.cards.costs_title")}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.cogs")} value={costs.cogs} />
                        <PrintRow label={t("analytics_general.labels.discounts_given")} value={costs.discounts_given} />
                        <PrintRow label={t("analytics_general.labels.operating_expenses")} value={costs.operating_expenses} />
                    </div>
                </div>

                {/* Profit Section */}
                <div className="border-2 border-black">
                    <div className="bg-black text-white p-2 font-bold uppercase text-sm">
                        {t("analytics_general.cards.profit_title")}
                    </div>
                    <div className="p-4">
                        <PrintRow label={t("analytics_general.labels.gross_profit")} value={profit.gross_profit} />
                        <div className="border-t border-dashed border-gray-400 my-2"></div>
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>{t("analytics_general.labels.net_profit")}</span>
                            <span className="font-mono">{profit.net_profit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Orders Count */}
                <div className="flex justify-between items-center p-2 border border-gray-400 bg-gray-50 text-sm">
                    <span className="uppercase font-bold">{t("analytics_general.cards.orders")}</span>
                    <span className="font-bold">{total_orders}</span>
                </div>

            </div>

            {/* 3. Footer
            <div className="fixed bottom-0 left-0 w-full p-8">
                <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
            </div> */}
        </div>
    );
}

function PrintRow({ label, value, bold = false }: { label: string, value: number, bold?: boolean }) {
    return (
        <div className={`flex justify-between mb-1 ${bold ? 'font-bold text-black' : 'text-gray-800'}`}>
            <span className="text-sm">{label}</span>
            <span className="font-mono">{value.toLocaleString()}</span>
        </div>
    );
}