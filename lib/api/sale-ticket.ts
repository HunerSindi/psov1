// lib/api/sale.ts

const API_BASE = "http://127.0.0.1:8081";

// --- TYPES ---
export interface SaleReceipt {
    id: number;
    ticket_number: number;
    customer_id: number | null;
    user_id: number;
    cashier_name?: string;    // display name of the cashier (from backend)
    status: string;
    payment_type: string;
    total_amount: number;
    discount_type?: string;   // "amount" | "percent" (optional, from backend)
    discount_value: number;
    final_amount: number;
    paid_amount: number;
}

export interface SaleItem {
    id: number;
    item_id: number;
    item_name: string;
    unit_type: string;
    cost_price: number;
    price: number;
    quantity: number;
    discount_type?: string;   // "percent" | "amount"
    discount_value?: number;
    discount_start_date?: string;
    discount_end_date?: string;
    subtotal: number;
}

export interface SaleCustomer {
    id: number;
    name: string;
    balance: number;
}

export interface SaleResponse {
    customer: SaleCustomer | null;
    items: SaleItem[];
    receipt: SaleReceipt;
}

// --- API CALLS ---

// 1. Open/Get Ticket
export async function openTicket(ticketNo: number, userId: number = 1) {
    try {
        const res = await fetch(`${API_BASE}/sales/ticket`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticket_number: ticketNo, user_id: userId, customer_id: 0 })
        });
        if (!res.ok) throw new Error("Failed to open ticket");
        const json = await res.json();
        return json.data as SaleResponse;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// 2. Add Item via Barcode
export async function addItemToSale(saleId: number, barcode: string, unitType: string, qty: number = 1) {
    const res = await fetch(`${API_BASE}/sales/${saleId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, unit_type: unitType, quantity: qty })
    });
    return res.ok;
}

// 3. Update Item Quantity (Edit/Increase/Decrease)
export async function updateItemQuantity(itemId: number, newQty: number) {
    const res = await fetch(`${API_BASE}/sales/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty })
    });
    return res.ok;
}

// 3b. Update per-item discount (type + value)
export async function updateItemDiscount(
    itemId: number,
    discountValue: number,
    discountType: "percent" | "amount" = "amount"
) {
    const res = await fetch(`${API_BASE}/sales/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount_type: discountType, discount_value: discountValue })
    });
    return res.ok;
}

// 4. Assign Customer
export async function setSaleCustomer(saleId: number, customerId: number) {
    const res = await fetch(`${API_BASE}/sales/${saleId}/customer`, {
        method: "PUT", // or PUT depending on backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId })
    });
    return res.ok;
}

// 5. Apply Discount (amount or percent)
export async function applyDiscount(
    saleId: number,
    value: number,
    type: "amount" | "percent" = "amount"
) {
    const res = await fetch(`${API_BASE}/sales/${saleId}/discount`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount_type: type, discount_value: value })
    });
    return res.ok;
}

// 6. Pay (Cash or Loan)
// export async function paySale(saleId: number, type: "cash" | "loan", paidAmount?: number) {
//     const res = await fetch(`${API_BASE}/sales/${saleId}/pay/${type}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ paid_amount: paidAmount || 0 })
//     });
//     return res.ok;
// }
// Add these to your existing imports
export async function paySale(
    saleId: number,
    type: "cash" | "loan" | "installment",
    paidAmount: number,
    installmentDetails?: {
        count: number;
        days: number;
        added_fee?: number;
        start_date?: string;
    }
) {
    try {
        // Base payload
        const payload: any = {
            payment_type: type,
            paid_amount: paidAmount
        };

        // Add installment specific data
        if (type === "installment" && installmentDetails) {
            // Mapping fields to match your backend JSON requirement
            payload.count = installmentDetails.count;
            payload.interval_days = installmentDetails.days;
            payload.added_fee = installmentDetails.added_fee;
            payload.start_date = installmentDetails.start_date;

            // Usually for installment, 'amount' in payload represents the down_payment
            payload.down_payment = paidAmount;
        }

        // Dynamic URL: /pay/cash, /pay/loan, /pay/installment
        const res = await fetch(`${API_BASE}/sales/${saleId}/pay/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}