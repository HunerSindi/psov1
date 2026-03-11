"use client";
import { CompanyReturn } from "@/lib/api/company_returns";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";

interface Props {
    tickets: CompanyReturn[];
    onDelete: (id: number) => void;
}

export default function TicketListTable({ tickets, onDelete }: Props) {
    const { t } = useSettings();
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-auto border border-gray-400 bg-white">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-12 text-center">{t("company_return.table.id")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("company_return.table.company")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-32">{t("company_return.table.user")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-right">{t("company_return.table.amount")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-20 text-center">{t("company_return.table.deduct")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600">{t("company_return.table.note")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-32">{t("company_return.table.date")}</th>
                        <th className="p-2 border-b border-gray-400 text-[10px] font-bold uppercase text-gray-600 w-24 text-center">{t("company_return.table.actions")}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {tickets.length === 0 ? (
                        <tr><td colSpan={8} className="p-6 text-center text-xs text-gray-400 uppercase italic">No tickets found</td></tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-blue-50 group">
                                <td className="p-2 text-xs font-mono text-center border-r">{ticket.id}</td>
                                <td className="p-2 text-xs font-bold text-gray-800 border-r">{ticket.company_name}</td>
                                <td className="p-2 text-xs text-gray-600 border-r">{ticket.user_name}</td>
                                <td className="p-2 text-xs font-bold font-mono text-right text-green-700 border-r">
                                    {ticket.total_refund_amount.toLocaleString()}
                                </td>
                                <td className="p-2 text-center border-r">
                                    <span className={`text-[10px] font-bold uppercase px-1 ${ticket.deduct_from_balance ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                        {ticket.deduct_from_balance ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td className="p-2 text-xs text-gray-600 border-r truncate max-w-[150px]">{ticket.note}</td>
                                <td className="p-2 text-[10px] text-gray-500 font-mono border-r">
                                    {ticket.created_at}
                                </td>
                                <td className="p-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => navigate(`/company_returns/${ticket.id}`)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(ticket.id)}
                                        className="text-red-400 hover:text-red-600"
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