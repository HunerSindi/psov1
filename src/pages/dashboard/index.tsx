"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Local Imports
import { MENU_ITEMS } from "./config/menuItems";
import TopBar, { User } from "./TopBar";
import MenuGrid from "./MenuGrid";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 1. Check for logged in user
        const storedUser = localStorage.getItem("pos_user");

        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
        setMounted(true);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("pos_user");
        navigate("/login");
    };

    if (!mounted || !user) return null;

    // 2. Filter Menu Items
    const visibleItems = MENU_ITEMS.filter((item) => {
        // ALLOW if permission is empty string "" (Public Access)
        if (!item.permission || item.permission === "") return true;

        // ALLOW if user is admin
        if (user.permissions.includes("admin")) return true;

        // ALLOW if user has the specific permission
        return user.permissions.includes(item.permission);
    });
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            {/* Top Bar Widget */}
            <TopBar user={user} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 px-2 pt-1 max-w-[1600px] mx-auto w-full">
                {/* Grid Widget */}
                <MenuGrid items={visibleItems} />

            </main>
        </div>
    );
}