"use client";

import { useState, useEffect } from "react";
import { Company } from "@/lib/api/companies";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Company) => Promise<void>;
    initialData?: Company | null;
    isEditing: boolean;
}

export default function CompanyFormDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
    const { t } = useSettings();
    const [formData, setFormData] = useState<Company>({
        name: "", phone: "", address: "", initial_balance: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                phone: initialData.phone,
                address: initialData.address,
                initial_balance: 0
            });
        } else if (isOpen) {
            setFormData({ name: "", phone: "", address: "", initial_balance: 0 });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 w-full max-w-md flex flex-col">

                {/* Header */}
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">
                        {isEditing ? t("company.form.edit_title") : t("company.form.create_title")}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-4">

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("company.form.label_name")}
                        </label>
                        <input
                            autoFocus
                            type="text" required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("company.form.label_phone")}
                        </label>
                        <input
                            type="text" required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("company.form.label_address")}
                        </label>
                        <textarea
                            rows={2}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600"
                        />
                    </div>

                    {!isEditing && (
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                                {t("company.form.label_balance")}
                            </label>
                            <input
                                type="number" step="0.01"
                                value={formData.initial_balance}
                                onChange={e => setFormData({ ...formData, initial_balance: parseFloat(e.target.value) })}
                                className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                {t("company.form.balance_hint")}
                            </p>
                        </div>
                    )}

                </form>

                {/* Footer Actions */}
                <div className="flex gap-2 border-t border-gray-300 p-3 bg-gray-100">
                    <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-400 py-2 text-xs font-bold uppercase hover:bg-gray-200">
                        {t("company.form.btn_cancel")}
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-700 border border-blue-800 py-2 text-xs font-bold uppercase text-white hover:bg-blue-800 disabled:opacity-50">
                        {loading ? t("company.form.btn_saving") : t("company.form.btn_save")}
                    </button>
                </div>
            </div>
        </div>
    );
}