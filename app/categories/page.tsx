"use client";

import { useEffect, useState } from "react";
import {
    getExpenseCategories,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    ExpenseCategory
} from "@/lib/api/expense-categories";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Local Components
import CategoryHeader from "./components/CategoryHeader";
import CategoryTable from "./components/CategoryTable";
import CategoryDialog from "./components/CategoryDialog";
import PrintCategoryList from "./components/PrintCategoryList";

export default function ExpenseCategoriesPage() {
    const { t } = useSettings(); // Hook

    // --- State ---
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

    // --- Init ---
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getExpenseCategories();
        setCategories(data);
        setLoading(false);
    };

    // --- Handlers ---
    const handleOpenCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cat: ExpenseCategory) => {
        setEditingCategory(cat);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        // Translated Confirm
        if (confirm(t("expense_category.form.delete_confirm"))) {
            await deleteExpenseCategory(id);
            loadData();
        }
    };

    const handleFormSubmit = async (name: string) => {
        if (editingCategory && editingCategory.id) {
            await updateExpenseCategory(editingCategory.id, name);
        } else {
            await createExpenseCategory(name);
        }
        setIsModalOpen(false);
        loadData();
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans">

            <CategoryHeader
                onAddClick={handleOpenCreate}
                onPrintClick={() => window.print()}
            />

            <div className="flex-1 p-3 mx-auto w-full flex flex-col overflow-hidden">
                <CategoryTable
                    categories={categories}
                    loading={loading}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                />
            </div>

            <CategoryDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingCategory}
                isEditing={!!editingCategory}
            />

            <PrintCategoryList categories={categories} />
        </div>
    );
}