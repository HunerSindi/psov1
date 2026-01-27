const API_URL = "http://127.0.0.1:8081";

// --- New Types based on updated JSON response ---

export interface CostsBreakdown {
    discounts_given: number;
    gross_cogs: number;
    net_cogs: number;
    operating_expenses: number;
    returned_cogs: number;
}

export interface ProfitSummary {
    gross_profit: number;
    net_profit: number;
}

export interface RevenueBreakdown {
    gross_sales: number;
    installment_fees: number;
    loan_sales: number;
    net_revenue: number;
    refunds: number;
}

export interface GeneralData {
    costs_breakdown: CostsBreakdown;
    profit_summary: ProfitSummary;
    revenue_breakdown: RevenueBreakdown;
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