"use client";

import { useEffect, useState } from "react";
import { getEmployeeAnalytics, EmployeeAnalytic, AnalyticMeta } from "@/lib/api/analytics";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Components
import AnalyticHeader from "./components/AnalyticHeader";
import AnalyticFilter from "./components/AnalyticFilter";
import AnalyticTable from "./components/AnalyticTable";
import PrintAnalytic from "./components/PrintAnalytic";

export default function EmployeeAnalyticsPage() {
    const { t } = useSettings();

    const [data, setData] = useState<EmployeeAnalytic[]>([]);
    const [meta, setMeta] = useState<AnalyticMeta>({ start_date: "", end_date: "" });
    const [loading, setLoading] = useState(true);

    // --- FIX IS HERE ---
    // Pass empty strings so it loads "All Data" (or backend default) instead of "Today"
    useEffect(() => {
        fetchData("", "");
    }, []);

    const fetchData = async (start: string, end: string) => {
        setLoading(true);
        const res = await getEmployeeAnalytics(start, end);
        if (res) {
            setData(res.data);
            setMeta(res.meta);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">

            {/* Header */}
            <AnalyticHeader />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">

                {/* Left: Table & Filters */}
                <div className="flex-[4] flex flex-col h-full min-h-0">
                    <div className="shrink-0 mb-2">
                        <AnalyticFilter onFilter={fetchData} />
                    </div>

                    <div className="flex-1 min-h-0">
                        <AnalyticTable data={data} loading={loading} />
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">{t("analytics.actions.title")}</h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors"
                        >
                            <Printer size={18} />
                            {t("analytics.actions.print")}
                        </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-blue-700 mb-1">{t("analytics.print.net_total")}</h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {data.reduce((acc, i) => acc + i.net_cash_in_hand, 0).toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-500">{t("analytics.actions.net_cash_desc")}</p>
                    </div>
                </div>

            </div>

            {/* Print Component (Hidden from screen) */}
            <PrintAnalytic data={data} meta={meta} />

        </div>
    );
}