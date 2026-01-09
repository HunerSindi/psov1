"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDueInstallments, DueItem } from "@/lib/api/installments";
import { Eye, ArrowLeft, AlertTriangle, CalendarClock } from "lucide-react";

export default function WarningInstallmentsPage() {
    const router = useRouter();
    // Initialize with empty array
    const [data, setData] = useState<DueItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [status, setStatus] = useState<"overdue" | "upcoming">("overdue");
    const [days, setDays] = useState(7);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15 });

    useEffect(() => {
        loadData();
    }, [status, days, search, page]);

    const loadData = async () => {
        setLoading(true);
        const res = await getDueInstallments(status, days, page, search);

        // Safety Check: Ensure we are accessing the correct data structure
        if (res && res.data && Array.isArray(res.data.data)) {
            setData(res.data.data);
            setMeta(res.data.meta);
        } else {
            setData([]); // Fallback to empty array
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans">
            {/* Header */}
            <div className="bg-red-800 border-b border-red-900 p-3 flex justify-between items-center text-white sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/")} className="font-bold hover:text-gray-300 uppercase text-xs flex items-center gap-1">
                        <ArrowLeft size={16} /> Dashboard
                    </button>
                    <div className="h-6 w-px bg-white/40"></div>
                    <h1 className="font-bold uppercase tracking-tight text-lg">Due Payments Monitor</h1>
                </div>
            </div>

            <div className="flex-1 p-2 max-w-6xl mx-auto w-full flex flex-col gap-2 overflow-hidden">

                {/* Controls */}
                <div className="bg-white border border-gray-400 p-2 flex flex-wrap gap-4 items-center">

                    {/* Status Tabs */}
                    <div className="flex bg-gray-100 p-1 border border-gray-300 gap-1">
                        <button
                            onClick={() => { setStatus("overdue"); setPage(1); }}
                            className={`px-3 py-1 text-[10px] font-bold uppercase flex items-center gap-2 border ${status === "overdue" ? "bg-red-600 text-white border-red-800" : "bg-white text-gray-500 border-gray-300"}`}
                        >
                            <AlertTriangle size={12} /> Overdue
                        </button>
                        <button
                            onClick={() => { setStatus("upcoming"); setPage(1); }}
                            className={`px-3 py-1 text-[10px] font-bold uppercase flex items-center gap-2 border ${status === "upcoming" ? "bg-orange-500 text-white border-orange-700" : "bg-white text-gray-500 border-gray-300"}`}
                        >
                            <CalendarClock size={12} /> Upcoming
                        </button>
                    </div>

                    {/* Days Selector (Only for Upcoming) */}
                    {status === "upcoming" && (
                        <select className="h-8 border border-gray-400 text-xs px-2 bg-white" value={days} onChange={e => setDays(Number(e.target.value))}>
                            <option value={7}>Next 7 Days</option>
                            <option value={30}>Next 30 Days</option>
                        </select>
                    )}

                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text" placeholder="Search Customer..."
                            className="h-8 border border-gray-400 px-2 text-xs w-full outline-none focus:border-black"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 bg-white border border-gray-400 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-400 sticky top-0">
                            <tr>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-12 text-center">ID</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">Customer</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-32">Phone</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24">Due Date</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">Amount</th>
                                <th className="p-2 text-[10px] font-bold uppercase w-16 text-center">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs">
                            {loading ? <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr> :
                                (data || []).length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">No due items found.</td></tr> :
                                    (data || []).map((item) => (
                                        <tr key={item.id} className="hover:bg-red-50 group">
                                            <td className="p-2 border-r border-gray-100 text-center text-gray-500">{item.id}</td>
                                            <td className="p-2 border-r border-gray-100 font-bold text-gray-800">{item.customer_name}</td>
                                            <td className="p-2 border-r border-gray-100 font-mono">{item.phone}</td>
                                            <td className={`p-2 border-r border-gray-100 font-bold ${status === "overdue" ? "text-red-600" : "text-orange-600"}`}>
                                                {new Date(item.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-2 border-r border-gray-100 text-right font-mono font-bold">
                                                {item.amount.toLocaleString()}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => router.push(`/installments/${item.installment_id}`)}
                                                    className="text-blue-600 hover:text-blue-800 bg-blue-50 p-1 rounded-sm border border-blue-200"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}