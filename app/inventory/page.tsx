"use client";

import { useEffect, useState } from "react";
import { getInventory, InventoryItem } from "@/lib/api/inventory";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Local Components
import InventoryHeader from "./components/InventoryHeader";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import PrintInventory from "./components/PrintInventory";

export default function InventoryPage() {
    const { t } = useSettings(); // Hook

    // --- State ---
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 20;

    // --- Fetch with Debounce ---
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 20);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, sortBy, page]);

    const fetchData = async () => {
        setLoading(true);
        const data = await getInventory(search, page, pageSize, sortBy);

        if (data) {
            console.log(data)
            setItems(data.items || []);
            setTotalPages(Math.ceil(data.total_count / data.page_size));
        } else {
            setItems([]);
        }
        setLoading(false);
    };

    // --- Handlers ---
    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const handleSort = (val: string) => {
        setSortBy(val);
        setPage(1);
    };

    const printLabel = `${t("inventory.filters.sort_label")}: ${sortBy || t("inventory.filters.sort_default")} | ${t("inventory.filters.search_label")}: "${search}"`;

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">

            {/* 1. Header */}
            <div className="print:hidden">
                <InventoryHeader />
            </div>

            {/* 2. Main Layout */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">

                {/* Left: Table & Filters */}
                <div className="flex-[4] flex flex-col h-full overflow-hidden">
                    <InventoryFilter
                        search={search}
                        onSearchChange={handleSearch}
                        sortBy={sortBy}
                        onSortChange={handleSort}
                    />

                    <div className="flex-1 overflow-hidden mt-2">
                        <InventoryTable
                            items={items}
                            loading={loading}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("inventory.actions.reports_title")}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors"
                        >
                            <Printer size={18} />
                            {t("inventory.actions.print_list")}
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-yellow-700 mb-1">
                            {t("inventory.actions.page_info")}
                        </h3>
                        <div className="text-sm font-bold text-gray-900 border-b border-black pb-1 mb-1">
                            {items.length} {t("inventory.table.items_loaded")}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("inventory.table.viewing_page")} {page} {t("inventory.table.of")} {totalPages}
                        </p>
                    </div>
                </div>

            </div>

            {/* 3. Hidden Print Component */}
            <PrintInventory items={items} filterText={printLabel} />
        </div>
    );
}