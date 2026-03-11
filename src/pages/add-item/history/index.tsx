"use client";

import { useEffect, useState } from "react";
import { getSalesHistory, SaleHistoryItem, SalesFilters } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Import Local Components
import HistoryHeader from "./components/HistoryHeader";
import HistoryFilter from "./components/HistoryFilter";
import HistoryTable from "./components/HistoryTable";
import PrintHistoryList from "./components/PrintHistoryList";
import { Printer } from "lucide-react";

export default function SalesHistoryPage() {
    const { t } = useSettings(); // Hook

    // --- State ---
    const [data, setData] = useState<SaleHistoryItem[]>([]);
    const [meta, setMeta] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState<SalesFilters>({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // --- Fetch ---
    const fetchData = async () => {
        setLoading(true);
        const res = await getSalesHistory(page, limit, filters);
        if (res) {
            setData(res.data);
            setMeta(res.meta);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, filters]);

    // --- Handlers ---
    const handleSearch = (newFilters: SalesFilters) => {
        if (newFilters.limit && newFilters.limit !== limit) {
            setLimit(newFilters.limit);
        }
        setFilters(newFilters);
        setPage(1);
    };

    // Calculate Total for visible page
    const currentTotal = data.reduce((acc, item) => acc + item.final_amount, 0);

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">

            {/* Hidden Print Component */}
            <PrintHistoryList
                data={data}
                totalAmount={currentTotal}
                filters={filters}
            />

            {/* 1. Header (Fixed Top) */}
            <HistoryHeader
                totalAmount={currentTotal}
                onPrint={() => window.print()}
            />

            {/* 2. Main Layout (Flex Fill) */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">

                {/* Left Column: Table & Filters */}
                <div className="flex-[4] flex flex-col h-full min-h-0">

                    {/* Filters (Fixed Height) */}
                    <div className="shrink-0">
                        <HistoryFilter onSearch={handleSearch} currentLimit={limit} />
                    </div>

                    {/* Table (Flex Grow + Scroll) */}
                    <div className="flex-1 min-h-0">
                        <HistoryTable
                            data={data}
                            loading={loading}
                            meta={meta}
                            onPageChange={setPage}
                        />
                    </div>
                </div>

                {/* Right Side: Sidebar (Fixed Width) */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-full overflow-y-auto">

                    {/* Print Button Widget */}
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("sales_history.sidebar.actions")}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black shadow-sm transition-transform active:scale-95"
                        >
                            <Printer size={18} />
                            {t("sales_history.sidebar.print_list")}
                        </button>
                    </div>

                    {/* Total Summary Widget */}
                    <div className="bg-yellow-50 border border-yellow-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-yellow-700 mb-1">
                            {t("sales_history.sidebar.page_total")}
                        </h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {currentTotal.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("sales_history.sidebar.visible_rows_desc")}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}