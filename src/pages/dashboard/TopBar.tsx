"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Import logout icon

// Shared User Type
export interface User {
    id: number;
    name: string;
    permissions: string[];
}

interface TopBarProps {
    user: User;
    onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
    const navigate = useNavigate(); // Initialize router
    const isAdmin = user.permissions.includes("admin");

    return (
        <header className="bg-blue-600 h-13 px-6 flex justify-between items-center sticky top-0 z-20">
            {/* User Info Section */}
            <div className="w-48 text-sm mt-1 flex items-center gap-2">
                <span className="font-semibold text-white uppercase">
                    {user.name}
                </span>
                <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isAdmin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                        }`}
                >
                    {isAdmin ? "Admin" : "User"}
                </span>
            </div>

            {/* Clickable Title */}
            <h1
                className="text-l font-bold text-white tracking-tight cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/developer")}
            >
                KASHIRO
            </h1>

            {/* Icon-only Logout Button */}
            <div className="w-48 flex flex-row-reverse">
                <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}