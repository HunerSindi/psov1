"use client";

import { useState, useEffect } from "react";
import { ExpenseCategory } from "@/lib/api/expense-categories";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    initialData?: ExpenseCategory | null;
    isEditing: boolean;
}

export default function CategoryDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
    const { t } = useSettings(); // Hook

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
        } else {
            setName("");
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(name);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 shadow-none w-full max-w-sm flex flex-col">
                {/* Classic Window Header */}
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">
                        {isEditing
                            ? t("expense_category.form.edit_title")
                            : t("expense_category.form.create_title")
                        }
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-gray-50">
                    <div className="mb-4">
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("expense_category.form.label_name")}
                        </label>
                        <input
                            autoFocus
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white rounded-none"
                            placeholder={t("expense_category.form.placeholder_name")}
                        />
                    </div>

                    <div className="flex gap-2 border-t border-gray-300 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white border border-gray-400 py-1.5 text-xs font-bold uppercase hover:bg-gray-100 text-gray-700"
                        >
                            {t("expense_category.form.btn_cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-700 border border-blue-800 py-1.5 text-xs font-bold uppercase text-white hover:bg-blue-800"
                        >
                            {loading
                                ? t("expense_category.form.btn_saving")
                                : t("expense_category.form.btn_save")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}