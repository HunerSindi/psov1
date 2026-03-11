"use client";

import React from "react";
import { User } from "@/lib/api/users";
import { Edit, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

interface Props {
    users: User[];
    loading: boolean;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {
    const { t } = useSettings(); // Hook

    return (
        <div className="bg-white border border-gray-400 flex-1 overflow-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-12 text-center">
                            {t("users.table.id")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-48">
                            {t("users.table.name")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-32">
                            {t("users.table.phone")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase w-20 text-center">
                            {t("users.table.status")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-xs font-bold uppercase">
                            {t("users.table.permissions")}
                        </th>
                        <th className="p-2 text-center text-xs font-bold uppercase w-24">
                            {t("users.table.actions")}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {loading ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">
                            {t("users.table.loading")}
                        </td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">
                            {t("users.table.no_users")}
                        </td></tr>
                    ) : (
                        users.map((user, idx) => (
                            <tr key={user.id} className="hover:bg-blue-50 group">
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500 text-xs font-mono">
                                    {user.id}
                                </td>
                                <td className="p-2 border-r border-gray-100 font-bold text-gray-800">
                                    {user.name}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-xs font-mono">
                                    {user.phone}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-center">
                                    {user.active ? (
                                        <div className="flex justify-center text-green-700" title={t("users.table.active")}>
                                            <ShieldCheck size={16} />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center text-red-500" title={t("users.table.inactive")}>
                                            <ShieldAlert size={16} />
                                        </div>
                                    )}
                                </td>
                                <td className="p-2 border-r border-gray-100 text-[10px] text-gray-500 leading-tight">
                                    {user.permissions.length > 0
                                        ? user.permissions.join(", ")
                                        : <span className="italic text-gray-300">{t("users.table.no_access")}</span>
                                    }
                                </td>
                                <td className="p-2 text-center flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id!)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}