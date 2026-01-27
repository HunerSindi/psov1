const API_URL = "http://127.0.0.1:8081";

export interface StockValuationData {
    total_unique_items: number;
    total_stock_quantity: number;
    valuation: {
        total_cost_value: number;
        total_sales_value: number;
        potential_profit: number;
    };
}

export interface StockValuationResponse {
    data: StockValuationData;
    meta: {
        generated_at: string;
    };
}

export async function getStockValuation(): Promise<StockValuationResponse | null> {
    try {
        const res = await fetch(`${API_URL}/analytics/stock-valuation`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch stock valuation");

        const json = await res.json();
        return {
            data: json.data.data, // Access nested data correctly
            meta: json.data.meta
        };
    } catch (error) {
        console.error("Error fetching stock valuation:", error);
        return null;
    }
}