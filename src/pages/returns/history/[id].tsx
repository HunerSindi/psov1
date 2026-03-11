"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReturnDetails, ReturnDetail } from "@/lib/api/returns";
import { Printer } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Import Components
import ReturnDetailHeader from "./[id]/components/ReturnDetailHeader";
import ReturnDetailInfo from "./[id]/components/ReturnDetailInfo";
import ReturnDetailTable from "./[id]/components/ReturnDetailTable";
import PrintReturnDetail from "./[id]/components/PrintReturnDetail";

export default function ReturnDetailPage() {
    const { id } = useParams();
    const { t } = useSettings(); // Hook
    const [detail, setDetail] = useState<ReturnDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getReturnDetails(Number(id)).then((data) => {
                setDetail(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
                <ReturnDetailHeader id={Number(id)} />
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-gray-500 font-bold uppercase animate-pulse">
                        {t("return_history.detail.loading")}
                    </span>
                </div>
            </div>
        );
    }

    if (!detail) return null;

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">

            {/* 1. Header */}
            <ReturnDetailHeader id={detail.return_info.id} />

            {/* 2. Main Content */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2">
                <div className="flex-4 overflow-y-auto print:hidden">
                    <div className="mx-auto flex flex-col gap-0 h-full">

                        {/* Meta Info */}
                        <ReturnDetailInfo info={detail.return_info} />

                        {/* Table */}
                        <div className="flex-1 min-h-[400px]">
                            <ReturnDetailTable
                                items={detail.items}
                                info={detail.return_info}
                            />
                        </div>
                    </div>
                </div>
                {/* Right Side: Actions */}
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit print:hidden">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("return_history.actions.reports_title")}
                        </h3>
                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black"
                        >
                            <Printer size={18} />
                            {t("return_history.actions.print_list")}
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3">
                        <h3 className="text-xs font-bold uppercase text-yellow-700 mb-1">
                            {t("return_history.actions.page_total")}
                        </h3>
                        <div className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1 mb-1">
                            {detail.return_info.total_refund.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-500">
                            {t("return_history.actions.visible_rows")}
                        </p>
                    </div>
                </div>

            </div>

            {/* 3. Hidden Print View */}
            <PrintReturnDetail data={detail} />
        </div>
    );
}