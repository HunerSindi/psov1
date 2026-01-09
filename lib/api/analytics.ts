// lib/api/analytics.ts

const API_URL = "http://127.0.0.1:8081";

export interface EmployeeAnalytic {
    user_id: number;
    user_name: string;
    receipt_count: number;
    total_sales: number;
    total_collected: number;
    total_discount: number;
    refund_count: number;
    total_refunded: number;
    total_expenses: number;
    net_cash_in_hand: number;
}

export interface AnalyticMeta {
    start_date: string;
    end_date: string;
}

export interface AnalyticResponse {
    data: EmployeeAnalytic[];
    meta: AnalyticMeta;
}

export async function getEmployeeAnalytics(startDate?: string, endDate?: string): Promise<AnalyticResponse | null> {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const res = await fetch(`${API_URL}/analytics/employees?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const json = await res.json();

        // Structure based on your provided JSON
        return {
            data: json.data.data,
            meta: json.data.meta
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return null;
    }
}