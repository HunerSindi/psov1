export interface Item {
    id?: number;
    name: string;
    unit_type: string;
    current_quantity: number;
    alert_quantity: number;
    expiration_date: string;
    cost_price: number;
    single_price: number;
    wholesale_price: number;
    packet_cost_price: number;
    packet_price: number;
    packet_wholesale_price: number;
    packet_quantity: number;
    unit_per_packet: number;
    barcodes: string[];
    // Optional: which company this product is from; category of this product
    company_id?: number | null;
    category_id?: number | null;
    // Optional discount
    discount_type?: string;
    discount_value?: number;
    discount_start_date?: string;
    discount_end_date?: string;
}

export const UNIT_TYPES = [
    "single",
    "single-wholesale",
    "single-packet",
    "single-packet-wholesale",
    "kg",
    "cm",
    "m",
];