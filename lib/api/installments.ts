const API_BASE = "http://127.0.0.1:8081";

// --- TYPES ---

export interface DueItem {
    id: number;
    installment_id: number; // The parent plan ID
    customer_name: string;
    phone: string;
    due_date: string;
    amount: number;
    status: "overdue" | "upcoming" | "paid";
}

export interface InstallmentPlan {
    id: number;
    customer_name: string;
    customer_name_2: string;
    customer_phone: string;
    total_plan_value: number;
    remaining_amount: number;
    start_date: string;
    installment_count: number;
    is_fully_paid: boolean;
}

export interface InstallmentItem {
    id: number;
    sequence_number: number;
    due_date: string;
    amount: number;
    is_paid: boolean;
}

// --- FETCHERS ---

// 1. Get Warnings (Due/Overdue)
export async function getDueInstallments(status: "overdue" | "upcoming", days = 7, page = 1, search = "") {
    try {
        const params = new URLSearchParams({
            status,
            page: page.toString(),
            limit: "15",
            search
        });
        if (status === "upcoming") params.append("days", days.toString());

        const res = await fetch(`${API_BASE}/installments/due?${params}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json(); // returns { data: { data: [], meta: {} } }
    } catch (e) { return null; }
}

// 2. Get All Plans (List)
export async function getInstallments(
    page = 1, search = "", min = "", max = "", startFrom = "", startTo = ""
) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: "15",
            search
        });
        if (min) params.append("min_amount", min);
        if (max) params.append("max_amount", max);
        if (startFrom) params.append("start_date_from", startFrom);
        if (startTo) params.append("start_date_to", startTo);

        const res = await fetch(`${API_BASE}/installments?${params}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
}

// 3. Get Plan Items (Details)
export async function getInstallmentItems(planId: number) {
    try {
        const res = await fetch(`${API_BASE}/installments/${planId}/items`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data; // returns InstallmentItem[]
    } catch (e) { return []; }
}

// 4. Pay Specific Item
export async function payInstallmentItem(itemId: number, amount: number) {
    try {
        const res = await fetch(`${API_BASE}/installments/items/${itemId}/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid_amount: amount })
        });
        return res.ok;
    } catch (e) { return false; }
}