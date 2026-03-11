"use client";

import { useEffect, useState } from "react";
import { getStockValuation, StockValuationData } from "@/lib/api/analytics_stock";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Components
import StockHeader from "./components/StockHeader";
import StockView from "./components/StockView";
import PrintStockReport from "./components/PrintStockReport";

export default function StockValuationPage() {
    const [data, setData] = useState<StockValuationData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getStockValuation();
        if (res) {
            setData(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>

            <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden print:hidden">


                <StockHeader
                    onPrintClick={() => window.print()}
                    onRefreshClick={fetchData}
                    loading={loading}
                />

                <div className="flex-1 p-4 overflow-y-auto">
                    <StockView data={data} loading={loading} />
                </div>
            </div>
            <PrintStockReport data={data} />
        </div>

    );
}