// lib/api/sales-history.ts

const API_BASE = "http://127.0.0.1:8081";

export interface InstallmentDetails {
    added_fee: number;
    down_payment: number;
    remaining_amount: number;
    count: number;
    start_date: string;
    is_fully_paid: boolean;
}

export interface SaleHistoryItem {
    id: number;
    ticket_number: number;
    date: string;
    status: string;
    payment_type: "cash" | "loan" | "installment"; // Added installment
    discount_type: string;
    discount_value: number;
    total_amount: number; // Original Total
    final_amount: number; // After discount
    paid_amount: number;  // What they actually paid (down payment + cash)
    user_id: number;
    user_name: string;
    customer_id: number | null;
    customer_name: string;
    customer_phone: string;
    installment_details?: InstallmentDetails; // Optional, only if type is installment
}

export interface SalesHistoryResponse {
    data: SaleHistoryItem[];
    meta: {
        current_page: number;
        per_page: number;
        total_items: number;
        total_pages: number;
    };
}

export interface SalesFilters {
    search?: string;        // For Name, Phone, Ticket
    payment_type?: string;  // cash, loan, installment
    min_amount?: string;
    max_amount?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;         // For pagination size (20, 100, 500)
}

export async function getSalesHistory(
    page: number = 1,
    limit: number = 20,
    filters: SalesFilters = {}
) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString()); // Use the dynamic limit

        if (filters.search) params.append("search", filters.search);
        if (filters.payment_type && filters.payment_type !== "all") params.append("payment_type", filters.payment_type);
        if (filters.min_amount) params.append("min_amount", filters.min_amount);
        if (filters.max_amount) params.append("max_amount", filters.max_amount);
        if (filters.start_date) params.append("start_date", filters.start_date);
        if (filters.end_date) params.append("end_date", filters.end_date);

        const res = await fetch(`${API_BASE}/sales/history?${params.toString()}`, {
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch history");
        return await res.json() as SalesHistoryResponse;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Add to lib/api/sales-history.ts

export interface SaleDetail {
    receipt: {
        id: number;
        ticket_number: number;
        date: string;
        status: string;
        payment_type: string;
        discount_value: number;
        total_amount: number;
        final_amount: number;
        paid_amount: number;
        user_name: string;
        customer_name: string | null;
    };
    items: {
        id: number;
        item_name: string;
        unit_type: string;
        price: number;
        quantity: number;
        subtotal: number;
    }[];
}

export async function getSaleDetail(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:8081/sales/${id}`, {
            cache: "no-store"
        });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return json.data as SaleDetail;
    } catch (e) {
        return null;
    }
}