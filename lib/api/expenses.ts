// lib/api/expenses.ts

const API_BASE = "http://127.0.0.1:8081";

export interface Expense {
    id?: number;
    user_id: number;
    user_name?: string; // Read-only from GET
    category_id: number;
    category_name?: string; // Read-only from GET
    amount: number;
    description: string;
    date?: string; // ISO String from server
}

export async function getExpenses(params: Record<string, any> = {}) {
    try {
        // Build Query String
        const searchParams = new URLSearchParams();

        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== "") {
                searchParams.append(key, params[key]);
            }
        });

        const res = await fetch(`${API_BASE}/expenses?${searchParams.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch expenses");

        const json = await res.json();
        // Return object containing data AND meta for pagination
        return {
            data: json.data || [],
            meta: json.meta || { current_page: 1, total_items: 0, per_page: 20 }
        };
    } catch (e) {
        console.error(e);
        return { data: [], meta: { current_page: 1, total_items: 0, per_page: 20 } };
    }
}

// CREATE
export async function createExpense(data: Expense) {
    try {
        const res = await fetch(`${API_BASE}/expenses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// UPDATE
export async function updateExpense(id: number, data: Expense) {
    try {
        const res = await fetch(`${API_BASE}/expenses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// DELETE
export async function deleteExpense(id: number) {
    try {
        const res = await fetch(`${API_BASE}/expenses/${id}`, {
            method: "DELETE"
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}