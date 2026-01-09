// lib/api/inventory.ts

const API_BASE = "http://127.0.0.1:8081";

export interface InventoryItem {
    id: number;
    name: string;
    barcodes: string[];
    unit_type: string;
    cost_price: number;
    single_price: number;
    wholesale_price: number;
    packet_price: number;
    current_quantity: number;
    alert_quantity: number;
    expiration_date: string | null;
}

export interface InventoryResponse {
    items: InventoryItem[];
    total_count: number;
    page_size: number;
}

// Updated Fetch Function
export async function getInventory(
    search: string,
    page: number,
    limit: number,
    sort_by: string
): Promise<InventoryResponse | null> {
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            page_size: limit.toString(),
            sort_by
        });

        const res = await fetch(`${API_BASE}/items?${params.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function deleteItem(id: number): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/items/${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (e) {
        console.error("Delete Error:", e);
        return false;
    }
}