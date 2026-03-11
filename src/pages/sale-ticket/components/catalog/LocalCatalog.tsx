"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/local-db";
import { Settings, Calculator, LayoutGrid } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Sub-components
import LocalCategorySidebar from "./LocalCategorySidebar";
import LocalItemGrid from "./LocalItemGrid";
import PriceCalculator from "./PriceCalculator";

interface Props {
    saleId: number | undefined;
    onRefresh: () => void;
    onRefocusBarcode?: () => void;
    ticketTotalIqd?: number;
}

const MAIN_TAB_STORAGE = "pos_catalog_main_tab";

type MainTab = "categories" | "calculator";

function getStoredMainTab(): MainTab {
    if (typeof window === "undefined") return "categories";
    const stored = localStorage.getItem(MAIN_TAB_STORAGE);
    return stored === "calculator" ? "calculator" : "categories";
}

export default function LocalCatalog({ saleId, onRefresh, onRefocusBarcode, ticketTotalIqd = 0 }: Props) {
    const { t } = useSettings();
    const [mainTab, setMainTab] = useState<MainTab>(getStoredMainTab);
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    const setMainTabAndStore = (tab: MainTab) => {
        setMainTab(tab);
        localStorage.setItem(MAIN_TAB_STORAGE, tab);
    };

    // Fetch categories
    const categories = useLiveQuery(() => db.categories.toArray());

    // Auto-select first category on load
    useEffect(() => {
        if (categories && categories.length > 0 && selectedCatId === null) {
            setSelectedCatId(categories[0].id!);
        }
    }, [categories, selectedCatId]);

    return (
        <div className="flex flex-col h-full bg-white  relative">

            {/* Main tabs: Local categories | Price calculator */}
            <div className="flex border-b border-gray-400  shrink-0">
                <button
                    type="button"
                    onClick={() => { setMainTabAndStore("categories"); onRefocusBarcode?.(); }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold uppercase ${mainTab === "categories" ? "bg-gray-200 border-b-2 border-black -mb-px" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                    <LayoutGrid size={12} />
                    {t("sale_ticket.catalog.tab_local_categories")}
                </button>
                <button
                    type="button"
                    onClick={() => { setMainTabAndStore("calculator"); onRefocusBarcode?.(); }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold uppercase ${mainTab === "calculator" ? "bg-gray-200 border-b-2 border-black -mb-px" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                    <Calculator size={12} />
                    {t("sale_ticket.catalog.tab_price_calculator")}
                </button>
            </div>

            {mainTab === "calculator" ? (
                <div className="flex-1 overflow-auto min-h-0">
                    <PriceCalculator ticketTotalIqd={ticketTotalIqd} onRefocusBarcode={onRefocusBarcode} />
                </div>
            ) : (
                <>
                    {/* Header / Edit Toggle */}
                    <div className="flex justify-between items-center bg-gray-100 border-b border-gray-400 px-2 py-1 mb-1 shrink-0">
                        <span className="text-[10px] font-bold uppercase text-gray-600">{t("sale_ticket.catalog.quick_access")}</span>
                        <button
                            onClick={() => { setEditMode(!editMode); onRefocusBarcode?.(); }}
                            className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase border ${editMode
                                ? "bg-yellow-300 border-yellow-600 text-black animate-pulse"
                                : "bg-white border-gray-400 text-gray-500 hover:text-black"
                                }`}
                        >
                            <Settings size={10} />
                            {editMode ? t("sale_ticket.catalog.done") : t("sale_ticket.catalog.manage")}
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex overflow-hidden gap-1">

                        {/* LEFT: Items Grid (Takes available space) */}
                        <div className="flex-1 overflow-hidden h-full bg-gray-50 border border-gray-300">
                            {selectedCatId ? (
                                <LocalItemGrid
                                    categoryId={selectedCatId}
                                    saleId={saleId}
                                    onRefresh={onRefresh}
                                    editMode={editMode}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs uppercase">
                                    {categories?.length === 0 ? t("sale_ticket.catalog.no_cats") : t("sale_ticket.catalog.select_cat")}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Categories Sidebar (Fixed width) */}
                        <div className="w-24 flex-shrink-0 h-full overflow-hidden bg-white border border-gray-300">
                        <LocalCategorySidebar
                            categories={categories || []}
                            selectedId={selectedCatId}
                            onSelect={(id) => { setSelectedCatId(id); onRefocusBarcode?.(); }}
                            editMode={editMode}
                        />
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}