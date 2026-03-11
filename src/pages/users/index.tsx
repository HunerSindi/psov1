"use client";

import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, User } from "@/lib/api/users";
import { UserPlus } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Local Components
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";

export default function UsersPage() {
    const { t } = useSettings(); // Hook

    // --- State ---
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // --- Init ---
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    };

    // --- Actions ---
    const handleOpenCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        // Localized Confirm
        if (confirm(t("users.form.confirm_delete"))) {
            await deleteUser(id);
            loadUsers();
        }
    };

    const handleFormSubmit = async (formData: User) => {
        if (editingUser && editingUser.id) {
            await updateUser(editingUser.id, formData);
        } else {
            await createUser(formData);
        }
        setIsModalOpen(false);
        loadUsers();
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">

            {/* 1. Header */}
            <UserHeader />

            {/* 2. Main Content Layout */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2">

                {/* Left: User Table */}
                <div className="flex-[4] flex flex-col h-full overflow-hidden">
                    <UserTable
                        users={users}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Right: Sidebar Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("users.sidebar.management")}
                        </h3>
                        <button
                            onClick={handleOpenCreate}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors"
                        >
                            <UserPlus size={18} />
                            {t("users.sidebar.add_employee")}
                        </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-blue-700 mb-1">
                            {t("users.sidebar.total_staff")}
                        </h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {users.length}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("users.sidebar.active_inactive_desc")}
                        </p>
                    </div>
                </div>

            </div>

            {/* 3. Modal Dialog */}
            <UserFormDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
                isEditing={!!editingUser}
            />

        </div>
    );
}