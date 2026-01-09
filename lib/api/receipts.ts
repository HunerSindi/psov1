const API_BASE = "http://127.0.0.1:8081";

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
}

export interface Receipt {
    id: number;
    company_id: number;
    user_id: number;
    date: string;
    payment_type: "cash" | "loan";
    paid_amount: number;
    total_amount: number;
    final_amount: number;
    is_deleted: boolean;
}

// FIX: Export this missing type
export interface ReceiptItem {
    id: number;
    receipt_id: number;
    item_id: number;
    quantity: number;
    cost_price: number;
    packet_cost_price: number;
    single_price: number;
    wholesale_price: number;
    packet_price: number;
    packet_wholesale_price: number;
    packet_quantity: number;
    unit_per_packet: number;
    expiration_date: string;
    item_name: string;
    unit_type: string;
}

export interface ReceiptResponse {
    data: Receipt[];
    meta: PaginationMeta;
    status: string;
}

// 1. Get Receipts
export async function getReceipts(companyId?: number, page: number = 1): Promise<ReceiptResponse> {
    try {
        let url = `${API_BASE}/receipts?page=${page}&limit=20`;
        if (companyId) url += `&company_id=${companyId}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        return await res.json();
    } catch (e) {
        return {
            data: [],
            meta: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1 },
            status: "error"
        };
    }
}

// 2. Create Receipt
export async function createReceipt(data: { company_id: number, user_id: number, payment_type: string, paid_amount: number }) {
    const res = await fetch(`${API_BASE}/receipts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.ok;
}

// 3. Get Receipt Details
export async function getReceiptDetails(id: number) {
    try {
        const res = await fetch(`${API_BASE}/receipts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return json.data; // { items: [], receipt: {} }
    } catch (e) {
        return null;
    }
}

// 4. Add Item to Receipt
export async function addItemToReceipt(receiptId: number, itemData: any) {

    console.log(itemData);
    const res = await fetch(`${API_BASE}/receipts/${receiptId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
    });
    return res.ok;
}