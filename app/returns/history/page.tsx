"use client";

import { useEffect, useState } from "react";
import { getReturnsList } from "@/lib/api/returns";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Import Components
import ReturnHistoryHeader from "./components/ReturnHistoryHeader";
import ReturnHistoryFilter from "./components/ReturnHistoryFilter";
import ReturnHistoryTable from "./components/ReturnHistoryTable";
import PrintReturnHistory from "./components/PrintReturnHistory";

export default function ReturnsHistoryPage() {
    const { t } = useSettings(); // Hook

    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    const loadData = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: page.toString(),
            limit: "20",
            search: search,
            sort: "desc"
        });

        const res = await getReturnsList(params.toString());
        if (res) {
            // FIX: Default to [] if res.data is null
            setData(res.data || []);
            setMeta(res.meta);
        } else {
            // Optional: If res is null (error), ensure data is empty
            setData([]);
        }
        setLoading(false);
    };

    // Calculate total refund for visible page
    const pageTotalRefund = data.reduce((acc, curr) => acc + curr.total_refund, 0);

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">

            {/* 1. Header */}
            <ReturnHistoryHeader />

            <div className="flex-1 flex overflow-hidden p-2 gap-2">
                {/* 2. Main Content */}
                <div className="flex-4 max-w-7xl mx-auto w-full flex flex-col gap-2 overflow-hidden print:hidden">

                    {/* Filter */}
                    <ReturnHistoryFilter
                        search={search}
                        onSearchChange={(v) => { setSearch(v); setPage(1); }}
                    />

                    {/* Table */}
                    <ReturnHistoryTable
                        data={data}
                        loading={loading}
                        meta={meta}
                        onPageChange={setPage}
                    />
                </div>
                {/* Right Side: Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit print:hidden">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("return_history.actions.reports_title")}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black"
                        >
                            <Printer size={18} />
                            {t("return_history.actions.print_list")}
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-yellow-700 mb-1">
                            {t("return_history.actions.page_total")}
                        </h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {pageTotalRefund.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("return_history.actions.visible_rows")}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Hidden Print View */}
            <PrintReturnHistory data={data} />
        </div>
    );
}