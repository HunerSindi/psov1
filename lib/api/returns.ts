const API_BASE = "http://127.0.0.1:8081";

// --- Types ---
export interface ReturnItem {
    item_name: string;
    unit_type: string;
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    restocked: boolean;
}

export interface ReturnInfo {
    id: number;
    employee?: string; // or employee_name based on history/detail variance
    employee_name?: string;
    total_refund: number;
    note: string | null;
    created_at: string;
}

export interface ReturnDetail {
    items: ReturnItem[];
    return_info: ReturnInfo;
}

// --- Functions ---

// 1. Initialize Return Session
export async function initReturn(user_id: number) {
    try {
        const res = await fetch(`${API_BASE}/returns`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        });
        const json = await res.json();
        return json.data; // Returns { id: number, ... }
    } catch (e) { console.error(e); return null; }
}

// 2. Add Item to Return
export async function addReturnItem(returnId: number, payload: any) {
    // If returnId is 0, we use a different URL or just let backend handle it 
    // BUT your prompt said: POST /returns/items with body { return_id: 0 ... }

    // Assuming the URL is constant: /returns/items
    const res = await fetch(`${API_BASE}/returns/items`, { // Note: changed URL based on your prompt
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            return_id: returnId,
            ...payload
        })
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data; // Should return { return_id: 55, ... }
}

// 3. Get Return Details (For active session AND history detail)
export async function getReturnDetails(id: number): Promise<ReturnDetail | null> {
    try {
        const res = await fetch(`${API_BASE}/returns/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (e) { return null; }
}

// 4. Get Returns History (List)
export async function getReturnsList(params: string) {
    try {
        const res = await fetch(`${API_BASE}/returns?${params}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        // Structure: { data: { data: [], meta: {} } }
        return json.data;
    } catch (e) { return null; }
}