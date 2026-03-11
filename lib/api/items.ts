// lib/api/items.ts

const API_BASE = "http://127.0.0.1:8081";

export interface Item {
    id?: number;
    name: string;
    unit_type: string;

    // Quantity / Alert
    current_quantity: number;
    alert_quantity: number;
    expiration_date?: string; // "YYYY-MM-DD"

    // Prices (Single)
    cost_price: number;
    single_price: number;
    wholesale_price: number;

    // Packet Info
    packet_cost_price: number;
    packet_price: number;
    packet_wholesale_price: number;
    packet_quantity: number; // How many packets in stock
    unit_per_packet: number; // How many items inside one packet

    // Barcodes
    barcodes: string[];

    // Optional: company and category (both can be null)
    company_id?: number | null;
    category_id?: number | null;
    // Optional discount
    discount_type?: string;
    discount_value?: number;
    discount_start_date?: string;
    discount_end_date?: string;
}

export interface ProductCategory {
    id: number;
    name: string;
}

/** GET product categories for define-item. Backend: see update_define_item_api.md */
export async function getProductCategories(): Promise<ProductCategory[]> {
    try {
        const res = await fetch(`${API_BASE}/items/categories`, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
    } catch (e) {
        console.error("getProductCategories", e);
        return [];
    }
}

/** POST create a product category. Backend: see update_define_item_api.md */
export async function createProductCategory(name: string): Promise<ProductCategory | null> {
    try {
        const res = await fetch(`${API_BASE}/items/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() }),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? json ?? null;
    } catch (e) {
        console.error("createProductCategory", e);
        return null;
    }
}

/** DELETE a product category. Backend: see update_define_item_api.md */
export async function deleteProductCategory(id: number): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/items/categories/${id}`, { method: "DELETE" });
        return res.ok;
    } catch (e) {
        console.error("deleteProductCategory", e);
        return false;
    }
}

// GET ITEM BY BARCODE
export async function getItemByBarcode(barcode: string) {
    try {
        const response = await fetch(`${API_BASE}/items/barcode/${barcode}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        if (response.status === 404) return null; // Not found is valid, return null
        if (!response.ok) throw new Error("Failed to fetch item");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Item error:", error);
        return null;
    }
}

// CREATE ITEM
export async function createItem(itemData: Item) {
    try {
        const response = await fetch(`${API_BASE}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) throw new Error("Failed to create item");
        return await response.json();
    } catch (error) {
        console.error("Create Item error:", error);
        return null;
    }
}

// UPDATE ITEM
export async function updateItem(id: number, itemData: Item) {
    try {
        const response = await fetch(`${API_BASE}/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemData)
        });

        console.log(response);

        if (!response.ok) throw new Error("Failed to update item");
        return await response.json();
    } catch (error) {
        console.error("Update Item error:", error);
        return null;
    }
}