"use client";

import { useEffect, useState } from "react";
import { getGeneralAnalytics, GeneralData, GeneralMeta } from "@/lib/api/analytics_general";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Local Components
import GeneralHeader from "./components/GeneralHeader";
import GeneralFilter from "./components/GeneralFilter";
import GeneralView from "./components/GeneralView";
import PrintGeneralReport from "./components/PrintGeneralReport";

export default function GeneralReportPage() {
    const { t } = useSettings();

    const [data, setData] = useState<GeneralData | null>(null);
    const [meta, setMeta] = useState<GeneralMeta>({ start_date: "", end_date: "" });
    const [loading, setLoading] = useState(true);

    // Initial fetch (load all time/default backend range)
    useEffect(() => {
        fetchData("", "");
    }, []);

    const fetchData = async (start: string, end: string) => {
        setLoading(true);
        const res = await getGeneralAnalytics(start, end);
        if (res) {
            setData(res.data);
            setMeta(res.meta);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">

            {/* Hidden Print Component */}
            <PrintGeneralReport data={data} meta={meta} />

            {/* Header */}
            <GeneralHeader />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">

                {/* Left: Dashboard & Filters */}
                <div className="flex-[4] flex flex-col h-full min-h-0">

                    {/* Filter Section */}
                    <div className="shrink-0 mb-2">
                        <GeneralFilter onFilter={fetchData} />
                    </div>

                    {/* Dashboard View (Scrollable) */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <GeneralView data={data} loading={loading} />
                    </div>
                </div>

                {/* Right: Sidebar Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("analytics_general.title") || "Actions"}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors shadow-sm active:scale-95"
                        >
                            <Printer size={18} />
                            {t("analytics_general.actions.print")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}