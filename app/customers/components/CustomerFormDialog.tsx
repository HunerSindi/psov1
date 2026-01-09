"use client";
import { useState, useEffect } from "react";
import { Customer } from "@/lib/api/customers";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    isOpen: boolean; onClose: () => void; onSubmit: (data: Customer) => Promise<void>;
    initialData?: Customer | null; isEditing: boolean;
}

export default function CustomerFormDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
    const { t } = useSettings();
    const [form, setForm] = useState<Customer>({ name: "", name2: "", phone: "", address: "", initial_balance: 0, active: true });

    useEffect(() => {
        if (isOpen) {
            if (initialData) setForm({ ...initialData, initial_balance: 0 });
            else setForm({ name: "", name2: "", phone: "", address: "", initial_balance: 0, active: true });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSubmit(form); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 w-full max-w-md flex flex-col">
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">{isEditing ? t("customer.form.edit_title") : t("customer.form.create_title")}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.form.label_name")}</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-400 p-2 text-sm outline-none" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.form.label_nickname")}</label><input value={form.name2} onChange={e => setForm({ ...form, name2: e.target.value })} className="w-full border border-gray-400 p-2 text-sm outline-none" /></div>
                    </div>
                    <div><label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.form.label_phone")}</label><input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-400 p-2 text-sm outline-none" /></div>
                    <div><label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.form.label_address")}</label><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-400 p-2 text-sm outline-none" rows={2} /></div>
                    {!isEditing && <div><label className="block text-xs font-bold uppercase text-gray-600 mb-1">{t("customer.form.label_balance")}</label><input type="number" step="any" value={form.initial_balance} onChange={e => setForm({ ...form, initial_balance: parseFloat(e.target.value) })} className="w-full border border-gray-400 p-2 text-sm outline-none bg-white" /></div>}
                    {isEditing && <div className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /><label className="text-sm font-bold text-gray-700">{t("customer.form.label_active")}</label></div>}
                    <div className="flex gap-2 border-t border-gray-300 pt-3"><button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-400 py-2 text-xs font-bold uppercase hover:bg-gray-200">{t("customer.form.btn_cancel")}</button><button type="submit" className="flex-1 bg-blue-700 border border-blue-800 py-2 text-xs font-bold uppercase text-white hover:bg-blue-800">{t("customer.form.btn_save")}</button></div>
                </form>
            </div>
        </div>
    );
}