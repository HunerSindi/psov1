"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/api/users";
// Import the new structure
import { PERMISSION_GROUPS } from "../config/permissions";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: User) => Promise<void>;
    initialData?: User | null;
    isEditing: boolean;
}

export default function UserFormDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
    const { t } = useSettings();

    const [formData, setFormData] = useState<User>({
        name: "", phone: "", pin_code: "", permissions: [], active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                phone: initialData.phone,
                pin_code: "",
                permissions: initialData.permissions || [],
                active: initialData.active
            });
        } else if (isOpen) {
            setFormData({ name: "", phone: "", pin_code: "", permissions: [], active: true });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    const togglePermission = (perm: string) => {
        setFormData(prev => {
            const has = prev.permissions.includes(perm);
            return {
                ...prev,
                permissions: has
                    ? prev.permissions.filter(p => p !== perm)
                    : [...prev.permissions, perm]
            };
        });
    };

    // Helper to render a group of checkboxes
    const renderPermissionGroup = (title: string, perms: string[]) => (
        <div className="mb-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-gray-200 pb-1">
                {title}
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {perms.map(perm => {
                    // CONSTRUCT THE KEY
                    const permissionKey = `permissions.${perm}`;

                    return (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                className="w-4 h-4 accent-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs font-medium text-gray-700 select-none">
                                {/* 
                                    FIX: Cast to 'any' to bypass strict type checking for dynamic keys 
                                */}
                                {t(permissionKey as any) || perm}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white border-2 border-gray-600 w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl rounded-sm">

                {/* Header */}
                <div className="bg-gray-100 border-b border-gray-300 p-3 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800 tracking-wide">
                        {isEditing
                            ? `${t("users.form.edit_title")}: ${initialData?.name}`
                            : t("users.form.create_title")
                        }
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-600 font-bold px-2 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 bg-white flex flex-col gap-6">

                    {/* Basic Info Section */}
                    <div className="bg-gray-50 p-3 border border-gray-200 rounded-sm space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    {t("users.form.label_name")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-600 transition-colors bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    {t("users.form.label_phone")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-600 transition-colors bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    {t("users.form.label_pin")} {isEditing && <span className="text-[9px] lowercase font-normal text-gray-400">({t("users.form.pin_hint")})</span>}
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required={!isEditing}
                                    value={formData.pin_code}
                                    onChange={e => setFormData({ ...formData, pin_code: e.target.value })}
                                    className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-blue-600 font-mono tracking-widest bg-white"
                                    placeholder={t("users.form.pin_placeholder")}
                                />
                            </div>
                            {/* <div className="flex items-center gap-2 pb-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                    <span className="ml-2 text-xs font-bold text-gray-700 uppercase">{t("users.form.account_active")}</span>
                                </label>
                            </div> */}
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="border border-gray-300 rounded-sm overflow-hidden">
                        <div className="bg-gray-100 p-2 border-b border-gray-300 font-bold text-xs uppercase text-gray-700">
                            {/* Cast to any to fix TS error */}
                            {t("users.form.access_permissions" as any)}
                        </div>

                        <div className="p-4 bg-white max-h-[300px] overflow-y-auto">
                            {/* Group 1: Page Access */}
                            {renderPermissionGroup(
                                // Fix: cast string to any
                                t("users.permissions.group_pages" as any) || "Page Access",
                                PERMISSION_GROUPS.pages
                            )}

                            {/* Group 2: Action Access */}
                            {renderPermissionGroup(
                                // Fix: cast string to any
                                t("users.permissions.group_actions" as any) || "Action Privileges",
                                PERMISSION_GROUPS.actions
                            )}
                        </div>
                    </div>

                </form>

                {/* Footer Actions */}
                <div className="flex gap-3 border-t border-gray-300 p-4 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 text-xs font-bold uppercase border border-gray-400 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        {t("users.form.btn_cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 text-xs font-bold uppercase bg-black text-white border border-black hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {loading ? t("users.form.btn_saving") : t("users.form.btn_save")}
                    </button>
                </div>
            </div>
        </div>
    );
}