"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getInventory, InventoryItem } from "@/lib/api/inventory";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Local Components
import InventoryHeader from "./components/InventoryHeader";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import PrintInventory from "./components/PrintInventory";

function parsePage(s: string | null): number {
    if (s == null || s === "") return 1;
    const n = parseInt(s, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default function InventoryPage() {
    const { t } = useSettings(); // Hook
    const searchParams = useSearchParams();
    const router = useRouter();

    // --- State (initial from URL so back from define-item restores view) ---
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
    const [sortBy, setSortBy] = useState(() => searchParams.get("sort") ?? "");
    const [showLossesOnly, setShowLossesOnly] = useState(() => searchParams.get("losses") === "1");
    const [page, setPage] = useState(() => parsePage(searchParams.get("page")));
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 20;

    // Sync URL -> state when returning (e.g. back from define-item) so view is restored
    useEffect(() => {
        const pageFromUrl = parsePage(searchParams.get("page"));
        const searchFromUrl = searchParams.get("search") ?? "";
        const sortFromUrl = searchParams.get("sort") ?? "";
        const lossesFromUrl = searchParams.get("losses") === "1";
        setPage(pageFromUrl);
        setSearch(searchFromUrl);
        setSortBy(sortFromUrl);
        setShowLossesOnly(lossesFromUrl);
    }, [searchParams]);

    // --- Fetch with Debounce ---
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 20);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, sortBy, page, showLossesOnly]);

    const fetchData = async () => {
        setLoading(true);
        const data = await getInventory(search, page, pageSize, sortBy, showLossesOnly);

        if (data) {
            console.log(data)
            setItems(data.items || []);
            setTotalPages(Math.ceil(data.total_count / data.page_size));
        } else {
            setItems([]);
        }
        setLoading(false);
    };

    // Build inventory query string from given state (for URL sync and for return link to define-item)
    const buildInventoryQuery = useCallback(
        (overrides: { page?: number; search?: string; sort?: string; losses?: boolean } = {}) => {
            const p = new URLSearchParams();
            const pg = overrides.page ?? page;
            const sr = overrides.search ?? search;
            const so = overrides.sort ?? sortBy;
            const lo = overrides.losses ?? showLossesOnly;
            if (pg !== 1) p.set("page", String(pg));
            if (sr) p.set("search", sr);
            if (so) p.set("sort", so);
            if (lo) p.set("losses", "1");
            return p.toString();
        },
        [page, search, sortBy, showLossesOnly]
    );

    // --- Handlers ---
    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
        const q = buildInventoryQuery({ search: val, page: 1 });
        router.replace(q ? `/inventory?${q}` : "/inventory", { scroll: false });
    };

    const handleSort = (val: string) => {
        setSortBy(val);
        setPage(1);
        const q = buildInventoryQuery({ sort: val, page: 1 });
        router.replace(q ? `/inventory?${q}` : "/inventory", { scroll: false });
    };

    const handleShowLossesOnlyChange = (val: boolean) => {
        setShowLossesOnly(val);
        setPage(1);
        const q = buildInventoryQuery({ losses: val, page: 1 });
        router.replace(q ? `/inventory?${q}` : "/inventory", { scroll: false });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        const q = buildInventoryQuery({ page: newPage });
        router.replace(q ? `/inventory?${q}` : "/inventory", { scroll: false });
    };

    const printLabel = `${showLossesOnly ? t("inventory.filters.show_losses") + " | " : ""}${t("inventory.filters.sort_label")}: ${sortBy || t("inventory.filters.sort_default")} | ${t("inventory.filters.search_label")}: "${search}"`;

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
                        showLossesOnly={showLossesOnly}
                        onShowLossesOnlyChange={handleShowLossesOnlyChange}
                    />

                    <div className="flex-1 overflow-hidden mt-2">
                        <InventoryTable
                            items={items}
                            loading={loading}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onRefresh={fetchData}
                            returnQuery={buildInventoryQuery()}
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