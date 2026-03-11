"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// API Imports
import { getExpenses, createExpense, updateExpense, deleteExpense, Expense } from "@/lib/api/expenses";
import { getExpenseCategories, ExpenseCategory } from "@/lib/api/expense-categories";

// Local Component Imports
import ExpensesHeader from "./components/ExpensesHeader";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseFormDialog from "./components/ExpenseFormDialog";
import PrintExpenseSheet from "./components/PrintExpenseSheet";

export default function ExpensesPage() {
    const navigate = useNavigate();
    const { t } = useSettings(); // Hook

    // --- STATE ---
    const [user, setUser] = useState<any | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Filters State
    const [filters, setFilters] = useState({ start_date: "", end_date: "", search: "" });

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 20,
        total_items: 0
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        const storedUser = localStorage.getItem("pos_user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
        loadCategories();
        setMounted(true);
    }, [navigate]);

    useEffect(() => {
        if (mounted) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.per_page, mounted]);

    const loadCategories = async () => {
        const cats = await getExpenseCategories();
        setCategories(cats);
    };

    const loadData = async () => {
        setLoading(true);
        const query = {
            ...filters,
            page: pagination.page,
            per_page: pagination.per_page
        };

        const { data, meta } = await getExpenses(query);

        setExpenses(data);

        // Update local state
        setPagination(prev => ({
            ...prev,
            page: meta.current_page,
            total_items: meta.total_items,
            per_page: Number(meta.per_page)
        }));
        setLoading(false);
    };

    // --- HANDLERS ---
    const handleFilterSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        loadData();
    };

    const handleAddClick = () => {
        setEditingExpense(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (exp: Expense) => {
        setEditingExpense(exp);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (id: number) => {
        // Localized Confirm
        if (confirm(t("expense.form.delete_confirm"))) {
            const success = await deleteExpense(id);
            if (success) loadData();
        }
    };

    const handleFormSubmit = async (formData: Partial<Expense>) => {
        if (!user) return;

        const payload: Expense = {
            user_id: user.id,
            category_id: formData.category_id!,
            amount: formData.amount!,
            description: formData.description || ""
        };

        let success = false;
        if (editingExpense && editingExpense.id) {
            success = await updateExpense(editingExpense.id, payload);
        } else {
            success = await createExpense(payload);
        }

        if (success) {
            setIsDialogOpen(false);
            loadData();
        } else {
            alert("Operation failed.");
        }
    };

    if (!mounted || !user) return null;

    // Calculate total of currently visible rows
    const currentTotal = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans ">

            <ExpensesHeader
                user={user}
                onAddClick={handleAddClick}
            />

            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">

                {/* Left Side: Filter & Table */}
                <div className="flex-[4] flex flex-col h-full overflow-hidden print:hidden">
                    <ExpenseFilters
                        filters={filters}
                        setFilters={setFilters}
                        onSearch={handleFilterSearch}
                    />

                    <div className="flex-1 overflow-hidden">
                        <ExpenseTable
                            expenses={expenses}
                            loading={loading}
                            meta={{
                                current_page: pagination.page,
                                total_items: pagination.total_items,
                                per_page: pagination.per_page
                            }}
                            onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
                            onPerPageChange={(l) => setPagination(prev => ({ ...prev, per_page: l, page: 1 }))}
                            user={user}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit print:hidden">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("expense.actions.sidebar_title")}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black"
                        >
                            <Printer size={18} />
                            {t("expense.actions.print_list")}
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-yellow-700 mb-1">
                            {t("expense.actions.page_total")}
                        </h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {currentTotal.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("expense.actions.visible_rows")}
                        </p>
                    </div>
                </div>
            </div>

            <ExpenseFormDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleFormSubmit}
                categories={categories}
                initialData={editingExpense}
                isEditing={!!editingExpense}
            />

            <PrintExpenseSheet
                expenses={expenses}
                totalAmount={currentTotal}
                dateRange={{ from: filters.start_date, to: filters.end_date }}
            />
        </div>
    );
}