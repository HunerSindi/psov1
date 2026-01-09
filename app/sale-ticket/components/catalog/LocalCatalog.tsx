"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/local-db";
import { Settings } from "lucide-react";

// Sub-components
import LocalCategorySidebar from "./LocalCategorySidebar";
import LocalItemGrid from "./LocalItemGrid";

interface Props {
    saleId: number | undefined;
    onRefresh: () => void;
}

export default function LocalCatalog({ saleId, onRefresh }: Props) {
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Fetch categories
    const categories = useLiveQuery(() => db.categories.toArray());

    // Auto-select first category on load
    useEffect(() => {
        if (categories && categories.length > 0 && selectedCatId === null) {
            setSelectedCatId(categories[0].id!);
        }
    }, [categories, selectedCatId]);

    return (
        <div className="flex flex-col h-full bg-white border border-gray-400 p-1 relative">

            {/* Header / Edit Toggle */}
            <div className="flex justify-between items-center bg-gray-100 border-b border-gray-400 px-2 py-1 mb-1 shrink-0">
                <span className="text-[10px] font-bold uppercase text-gray-600">Quick Access</span>
                <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase border ${editMode
                        ? "bg-yellow-300 border-yellow-600 text-black animate-pulse"
                        : "bg-white border-gray-400 text-gray-500 hover:text-black"
                        }`}
                >
                    <Settings size={10} />
                    {editMode ? "Done" : "Manage"}
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
                            {categories?.length === 0 ? "No Categories" : "Select a category"}
                        </div>
                    )}
                </div>

                {/* RIGHT: Categories Sidebar (Fixed width) */}
                <div className="w-24 flex-shrink-0 h-full overflow-hidden bg-white border border-gray-300">
                    <LocalCategorySidebar
                        categories={categories || []}
                        selectedId={selectedCatId}
                        onSelect={setSelectedCatId}
                        editMode={editMode}
                    />
                </div>

            </div>
        </div>
    );
}