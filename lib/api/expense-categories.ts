// lib/api/expense-categories.ts

const API_BASE = "http://127.0.0.1:8081";

export interface ExpenseCategory {
    id?: number;
    name: string;
}

// GET ALL
export async function getExpenseCategories() {
    try {
        const res = await fetch(`${API_BASE}/expenses/categories`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return json.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

// CREATE
export async function createExpenseCategory(name: string) {
    try {
        const res = await fetch(`${API_BASE}/expenses/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// UPDATE
export async function updateExpenseCategory(id: number, name: string) {
    try {
        const res = await fetch(`${API_BASE}/expenses/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// DELETE
export async function deleteExpenseCategory(id: number) {
    try {
        const res = await fetch(`${API_BASE}/expenses/categories/${id}`, {
            method: "DELETE"
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}