const API_URL = "http://127.0.0.1:8081";

// --- Types based on your JSON response ---

export interface GeneralCosts {
    cogs: number;
    discounts_given: number;
    operating_expenses: number;
}

export interface GeneralProfit {
    gross_profit: number;
    net_profit: number;
}

export interface GeneralRevenue {
    installment_fees: number;
    sales_revenue: number;
    total_revenue: number;
}

export interface GeneralData {
    costs: GeneralCosts;
    profit: GeneralProfit;
    revenue: GeneralRevenue;
    total_orders: number;
}

export interface GeneralMeta {
    start_date: string;
    end_date: string;
}

export interface GeneralReportResponse {
    data: GeneralData;
    meta: GeneralMeta;
}

// --- API Function ---

export async function getGeneralAnalytics(startDate?: string, endDate?: string): Promise<GeneralReportResponse | null> {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const res = await fetch(`${API_URL}/analytics/general?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch general analytics");

        const json = await res.json();

        // Mapping the response structure:
        // json.data.data -> The actual metrics
        // json.data.meta -> The date range info
        return {
            data: json.data.data,
            meta: json.data.meta
        };
    } catch (error) {
        console.error("Error fetching general analytics:", error);
        return null;
    }
}