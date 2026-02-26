// app/users/config/permissions.ts

// This list defines the actual string stored in the database
export const ALL_PERMISSIONS = [
    // --- Pages / Main Access ---
    "define_item",
    "add_item",
    "sale_ticket",
    "sale_history",
    "users",
    "inventory",
    "companies",
    "customers", // Fixed plural
    "categories",
    "expense",
    "return_item",
    "return_item_history",
    "refund_invoice",
    "refund_invoice_history",
    "installments_warning",
    "installments_list",
    "cashier_report",
    "general_report",
    "backup",
    "settings", // Fixed singular/plural
    "company_returns",
    // --- Specific Actions (Granular) ---
    // Sale Ticket Specifics
    "sale_ticket.cash_pos",
    "sale_ticket.cash_a4",
    "sale_ticket.loan",
    "sale_ticket.installment",

    // Items Specifics (Example if you want granular item control later)
    // "items.delete", 
    // "items.edit_price"
];

// Optional: Helper structure for UI grouping
export const PERMISSION_GROUPS = {
    pages: [
        "define_item", "add_item", "sale_ticket", "sale_history",
        "users", "inventory", "companies", "customers", "categories",
        "company_returns",
        "expense", "return_item", "return_item_history", "refund_invoice", "refund_invoice_history",
        "installments_warning", "installments_list",
        "cashier_report", "general_report", "backup", "settings"
    ],
    actions: [
        "sale_ticket.cash_pos",
        "sale_ticket.cash_a4",
        "sale_ticket.loan",
        "sale_ticket.installment"
    ]
};