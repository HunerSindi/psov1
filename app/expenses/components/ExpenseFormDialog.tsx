"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/lib/api/expenses";
import { ExpenseCategory } from "@/lib/api/expense-categories";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Expense>) => Promise<void>;
    initialData?: Expense | null;
    categories: ExpenseCategory[];
    isEditing: boolean;
}

export default function ExpenseFormDialog({ isOpen, onClose, onSubmit, initialData, categories, isEditing }: Props) {
    const { t } = useSettings(); // Hook
    const [formData, setFormData] = useState({
        category_id: "",
        amount: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                category_id: initialData.category_id.toString(),
                amount: initialData.amount.toString(),
                description: initialData.description
            });
        } else if (isOpen) {
            setFormData({ category_id: "", amount: "", description: "" });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({
            category_id: Number(formData.category_id),
            amount: Number(formData.amount),
            description: formData.description
        });
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:hidden">
            <div className="bg-white border-2 border-gray-600 shadow-xl w-full max-w-md flex flex-col">

                {/* Header */}
                <div className="bg-gray-100 border-b border-gray-400 p-3 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 uppercase">
                        {isEditing
                            ? `${t("expense.form.edit_title")} #${initialData?.id}`
                            : t("expense.form.create_title")
                        }
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-600 font-bold px-2">X</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("expense.form.label_category")}
                        </label>
                        <select
                            required
                            className="w-full border border-gray-400 p-2 text-sm bg-white focus:border-blue-600 outline-none"
                            value={formData.category_id}
                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="" disabled>{t("expense.form.select_category")}</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("expense.form.label_amount")}
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            placeholder="0.00"
                            className="w-full border border-gray-400 p-2 text-sm font-mono focus:border-blue-600 outline-none"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("expense.form.label_desc")}
                        </label>
                        <textarea
                            rows={3}
                            required
                            placeholder={t("expense.form.placeholder_desc")}
                            className="w-full border border-gray-400 p-2 text-sm focus:border-blue-600 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 border border-gray-400 py-2 text-sm font-bold uppercase hover:bg-gray-300 text-gray-700"
                        >
                            {t("expense.form.btn_cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-black border border-black py-2 text-sm font-bold uppercase text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading
                                ? t("expense.form.btn_saving")
                                : t("expense.form.btn_save")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}