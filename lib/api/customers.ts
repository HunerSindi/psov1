const API_BASE = "http://127.0.0.1:8081";

export interface Customer {
    id?: number;
    name: string;
    name2?: string;
    phone: string;
    address: string;
    balance?: number;
    initial_balance?: number;
    active?: boolean;
}

export interface CustomerResponse {
    data: Customer[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
}

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    created_at: string;
}

export interface TransactionResponse {
    data: Transaction[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
}

// GET ALL (With Filters)
export async function getCustomers(
    search = "",
    page = 1,
    limit = 10,
    min_balance = "",
    max_balance = "",
    sort = ""
): Promise<CustomerResponse | null> {
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString()
        });
        if (min_balance) params.append("min_balance", min_balance);
        if (max_balance) params.append("max_balance", max_balance);
        if (sort) params.append("sort", sort);

        const res = await fetch(`${API_BASE}/customers?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return {
            data: json.data.data || [],
            meta: json.data.meta || { page: 1, limit: 10, total: 0 }
        };
    } catch (e) {
        return null;
    }
}

// GET SINGLE
export async function getCustomerById(id: number): Promise<Customer | null> {
    try {
        const res = await fetch(`${API_BASE}/customers/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (e) { return null; }
}

// CREATE
export async function createCustomer(data: Customer) {
    const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.ok;
}

// UPDATE INFO
export async function updateCustomer(id: number, data: Customer) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.ok;
}

// UPDATE BALANCE
export async function updateCustomerBalance(id: number, amount: number, description: string) {
    // Note: Added description to match transaction logic if backend supports it
    // Or just amount if backend only takes amount
    const res = await fetch(`${API_BASE}/customers/${id}/pay`, {
        method: "POST", // Usually POST for transactions
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description })
    });
    return res.ok;
}

// DELETE
export async function deleteCustomer(id: number) {
    const res = await fetch(`${API_BASE}/customers/${id}`, { method: "DELETE" });
    return res.ok;
}

// GET TRANSACTIONS
export async function getCustomerTransactions(id: number, page = 1, limit = 10): Promise<TransactionResponse | null> {
    try {
        const res = await fetch(`${API_BASE}/customers/${id}/transactions?page=${page}&limit=${limit}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        return {
            data: json.data.data || [],
            meta: json.data.meta || { page: 1, limit: 10, total: 0 }
        };
    } catch (e) { return null; }
}