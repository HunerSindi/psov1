"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInstallments, InstallmentPlan } from "@/lib/api/installments";
import { Eye, ArrowLeft, Search } from "lucide-react";

export default function InstallmentsListPage() {
    const router = useRouter();
    const [data, setData] = useState<InstallmentPlan[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [search, setSearch] = useState("");
    const [minAmt, setMinAmt] = useState("");
    const [maxAmt, setMaxAmt] = useState("");
    const [startFrom, setStartFrom] = useState("");
    const [startTo, setStartTo] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15 });

    useEffect(() => {
        // Debounce
        const t = setTimeout(loadData, 300);
        return () => clearTimeout(t);
    }, [search, minAmt, maxAmt, startFrom, startTo, page]);

    const loadData = async () => {
        setLoading(true);
        const res = await getInstallments(page, search, minAmt, maxAmt, startFrom, startTo);
        if (res && res.data) {
            setData(res.data.data);
            setMeta(res.data.meta);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans">
            <div className="bg-white border-b border-gray-400 p-3 flex items-center gap-4 sticky top-0 z-30">
                <button onClick={() => router.push("/")} className="font-bold text-gray-600 uppercase text-xs flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="font-bold uppercase text-lg text-gray-800">All Installment Plans</h1>
            </div>

            <div className="flex-1 p-2 max-w-7xl mx-auto w-full flex flex-col gap-2 overflow-hidden">

                {/* Filters */}
                <div className="bg-white border border-gray-400 p-2 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Search</label>
                        <div className="flex border border-gray-400 items-center px-2 bg-white">
                            <Search size={14} className="text-gray-400" />
                            <input className="h-8 flex-1 outline-none text-xs px-2" placeholder="Name, Phone..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-24">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Min Total</label>
                        <input type="number" className="h-8 w-full border border-gray-400 px-2 text-xs" placeholder="0" value={minAmt} onChange={e => setMinAmt(e.target.value)} />
                    </div>
                    <div className="w-24">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Max Total</label>
                        <input type="number" className="h-8 w-full border border-gray-400 px-2 text-xs" placeholder="Max" value={maxAmt} onChange={e => setMaxAmt(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500">Start Date From</label>
                        <input type="date" className="h-8 border border-gray-400 px-2 text-xs" value={startFrom} onChange={e => setStartFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500">Start Date To</label>
                        <input type="date" className="h-8 border border-gray-400 px-2 text-xs" value={startTo} onChange={e => setStartTo(e.target.value)} />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 bg-white border border-gray-400 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-400 sticky top-0">
                            <tr>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-12 text-center">ID</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">Customer</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24">Start Date</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">Total Plan</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">Remaining</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-16 text-center">Count</th>
                                <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-20 text-center">Status</th>
                                <th className="p-2 text-[10px] font-bold uppercase w-16 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-xs">
                            {loading ? <tr><td colSpan={8} className="p-8 text-center text-gray-500">Loading...</td></tr> :
                                data.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50 group">
                                        <td className="p-2 border-r border-gray-100 text-center text-gray-500">{p.id}</td>
                                        <td className="p-2 border-r border-gray-100">
                                            <div className="font-bold text-gray-800">{p.customer_name}</div>
                                            <div className="text-[10px] text-gray-500">{p.customer_phone}</div>
                                        </td>
                                        <td className="p-2 border-r border-gray-100">{p.start_date}</td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono">{p.total_plan_value.toLocaleString()}</td>
                                        <td className="p-2 border-r border-gray-100 text-right font-mono font-bold text-red-600">{p.remaining_amount.toLocaleString()}</td>
                                        <td className="p-2 border-r border-gray-100 text-center">{p.installment_count}</td>
                                        <td className="p-2 border-r border-gray-100 text-center">
                                            {p.is_fully_paid
                                                ? <span className="bg-green-100 text-green-700 px-1 border border-green-200">PAID</span>
                                                : <span className="bg-yellow-100 text-yellow-700 px-1 border border-yellow-200">ACTIVE</span>
                                            }
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => router.push(`/installments/${p.id}`)}
                                                className="text-blue-600 hover:text-black"
                                            >
                                                <Eye size={16} />
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