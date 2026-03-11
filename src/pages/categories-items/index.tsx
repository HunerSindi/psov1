"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getProductCategories, deleteProductCategory, type ProductCategory } from "@/lib/api/items";
import CategoriesItemHeader from "./CategoriesItemHeader";

export default function CategoriesItemsPage() {
    const { t } = useSettings();
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        const data = await getProductCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleDelete = async (cat: ProductCategory) => {
        if (!confirm(t("define_item.categories_items_delete_confirm" as any))) return;
        setDeletingId(cat.id);
        const ok = await deleteProductCategory(cat.id);
        setDeletingId(null);
        if (ok) await loadCategories();
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">
            <CategoriesItemHeader count={categories.length} />

            <div className="flex-1 overflow-y-auto p-4 w-full">
                {loading ? (
                    <p className="text-sm text-gray-500">{t("define_item.categories_items_loading" as any)}</p>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-gray-500">{t("define_item.categories_items_empty" as any)}</p>
                ) : (
                    <ul className="grid grid-cols-4 gap-3 w-full">
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="flex items-center justify-between gap-2 bg-white border border-gray-400 shadow-sm px-4 py-3"
                            >
                                <span className="text-sm font-medium text-gray-800 truncate min-w-0">{cat.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(cat)}
                                    disabled={deletingId !== null}
                                    className="shrink-0 p-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={t("define_item.categories_items_delete" as any)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
