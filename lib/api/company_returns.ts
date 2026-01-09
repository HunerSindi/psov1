const API_BASE = "http://127.0.0.1:8081"; // Or your correct port 8081

export interface CompanyReturn {
    id: number;
    company_id?: number;
    company_name: string;
    user_name: string;
    total_refund_amount: number;
    deduct_from_balance: boolean;
    note: string;
    created_at: string;
    items?: ReturnItem[];
}

export interface ReturnItem {
    id: number;
    item_name: string;
    quantity: number;
    unit_type: string;
    refund_price_per_unit: number;
    total_price: number;
}

export interface ReturnResponse {
    data: CompanyReturn[];
    meta: {
        current_page: number;
        per_page: number;
        total_items: number;
    };
}

// 1. GET LIST
export async function getCompanyReturns(page = 1, limit = 20, companyId = "", sort = "desc") {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort: sort
        });
        if (companyId) params.append("company_id", companyId);

        const res = await fetch(`${API_BASE}/company-returns?${params}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json() as ReturnResponse;
    } catch (e) { return null; }
}

// 2. CREATE TICKET
export async function createCompanyReturn(data: { company_id: number, user_id: number, deduct_from_balance: boolean, note: string }) {
    try {
        const res = await fetch(`${API_BASE}/company-returns`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (e) { return false; }
}

// 3. DELETE TICKET
export async function deleteCompanyReturn(id: number) {
    try {
        const res = await fetch(`${API_BASE}/company-returns/${id}`, { method: "DELETE" });
        return res.ok;
    } catch (e) { return false; }
}

// 4. GET SINGLE TICKET (For Details Page)
export async function getCompanyReturnById(id: number) {
    try {
        const res = await fetch(`${API_BASE}/company-returns/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json() as CompanyReturn;
    } catch (e) { return null; }
}

// 5. ADD ITEM TO TICKET
export async function addItemToReturn(ticketId: number, data: { item_id: number, quantity: number, unit_type: string, refund_price_per_unit: number }) {
    try {
        const res = await fetch(`${API_BASE}/company-returns/${ticketId}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (e) { return false; }
}

// 6. DELETE ITEM FROM TICKET
export async function deleteItemFromReturn(ticketId: number, itemId: number) {
    try {
        // Assuming endpoint format based on your style
        const res = await fetch(`${API_BASE}/company-returns/items/${itemId}`, { method: "DELETE" });
        return res.ok;
    } catch (e) { return false; }
}