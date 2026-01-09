// lib/api/refunds.ts

const API_BASE = "http://127.0.0.1:8081";

export interface RefundItem {
    id: number;
    sale_item_id: number;
    item_name: string; // Assuming backend sends this, or we map it
    quantity: number;
    refund_amount: number; // calculated subtotal for this refund line
}

export interface RefundTicket {
    id: number;
    sales_receipt_id: number;
    total_refund: number;
    note: string;
    date: string;
}

export interface RefundResponse {
    items: RefundItem[];
    refund: RefundTicket;
}

// 1. Create or Get Refund Ticket
export async function createRefundTicket(salesReceiptId: number, userId: number = 1) {
    try {
        const res = await fetch(`${API_BASE}/refunds/ticket`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sales_receipt_id: salesReceiptId, user_id: userId })
        });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return json.data as RefundResponse;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// 2. Add Item to Refund
export async function addRefundItem(refundId: number, saleItemId: number, quantity: number) {
    try {
        const res = await fetch(`${API_BASE}/refunds/${refundId}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sale_item_id: saleItemId,
                quantity: quantity,
                restock: true
            })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// 3. Update Note
export async function updateRefundNote(refundId: number, note: string) {
    try {
        // Assuming PUT based on typical REST, change to POST if needed
        const res = await fetch(`${API_BASE}/refunds/${refundId}/note`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}