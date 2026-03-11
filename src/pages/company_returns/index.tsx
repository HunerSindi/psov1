"use client";
import { useEffect, useState } from "react";
import { getCompanyReturns, createCompanyReturn, deleteCompanyReturn, CompanyReturn } from "@/lib/api/company_returns";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Components
import TicketListTable from "./components/TicketListTable";
import CreateTicketSidebar from "./components/CreateTicketSidebar";

export default function CompanyReturnsPage() {
    const { t, dir } = useSettings();
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<CompanyReturn[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        const res = await getCompanyReturns(page, 50);
        if (res) setTickets(res.data);
    };

    const handleCreate = async (data: any) => {
        const success = await createCompanyReturn(data);
        if (success) loadData();
        else alert("Failed to create ticket");
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this ticket?")) {
            await deleteCompanyReturn(id);
            loadData();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-purple-700 h-13 p-3 flex justify-between items-center sticky top-0 z-30 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="text-white font-bold hover:text-black uppercase text-sm flex items-center gap-1">
                        <span className="text-xl pb-1">{dir === 'rtl' ? <>&rarr;</> : <>&larr;</>}</span>
                        {t("company_return.back")}
                    </button>
                    <div className="h-6 w-px bg-purple-400"></div>
                    <h1 className="font-bold text-white uppercase tracking-tight">
                        {t("company_return.title")}
                    </h1>
                </div>
            </div>

            {/* Main Content: Left Table | Right Sidebar */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2">

                {/* Left: Table */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* You could add filters here similar to Damaged Items */}
                    <TicketListTable tickets={tickets} onDelete={handleDelete} />
                </div>

                {/* Right: Create Sidebar */}
                <CreateTicketSidebar onSubmit={handleCreate} />
            </div>
        </div>
    );
}