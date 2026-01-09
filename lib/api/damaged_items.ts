const API_BASE = "http://127.0.0.1:8081";

export interface DamagedItem {
    id?: number;
    item_id: number;
    item_name?: string;
    user_id: number;
    user_name?: string;
    quantity: number;
    unit_type: string; // "single" | "single-packet"
    cost_price_snapshot?: number;
    total_loss?: number;
    reason: string;
    created_at?: string;
}

export interface DamagedResponse {
    data: DamagedItem[];
    meta: {
        current_page: number;
        per_page: number;
        total_items: number;
    };
}

// GET LIST
export async function getDamagedItems(search: string = "", page: number = 1, limit: number = 15, startDate: string = "", endDate: string = "") {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search,
            start_date: startDate,
            end_date: endDate
        });

        const res = await fetch(`${API_BASE}/damaged-items?${params}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed");
        return await res.json() as DamagedResponse;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// CREATE
export async function createDamagedItem(data: DamagedItem) {
    try {
        const res = await fetch(`${API_BASE}/damaged-items`, {
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
export async function updateDamagedItem(id: number, data: Partial<DamagedItem>) {
    try {
        const res = await fetch(`${API_BASE}/damaged-items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quantity: data.quantity,
                unit_type: data.unit_type,
                reason: data.reason
            })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// DELETE
export async function deleteDamagedItem(id: number) {
    try {
        const res = await fetch(`${API_BASE}/damaged-items/${id}`, {
            method: "DELETE"
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}