const API_BASE = "http://127.0.0.1:8081";

export interface Company {
    id?: number;
    name: string;
    phone: string;
    address: string;
    balance?: number;
    initial_balance?: number;
}

export interface CompanyResponse {
    data: Company[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
}

export interface Transaction {
    id: number;
    company_id: number;
    amount: number;
    description: string;
    created_at: string;
    created_by: string | null;
}

export interface TransactionResponse {
    data: Transaction[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
}


export async function getCompanies(
    search = "",
    page = 1,
    limit = 10,
    status = "",
    min_balance = "",
    max_balance = ""
): Promise<CompanyResponse | null> {
    try {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString()
        });

        if (status) params.append("status", status);
        if (min_balance) params.append("min_balance", min_balance);
        if (max_balance) params.append("max_balance", max_balance);

        const response = await fetch(`${API_BASE}/companies?${params.toString()}`, {
            cache: "no-store"
        });

        if (!response.ok) throw new Error("Failed");

        // Your API wraps data inside data.data
        const json = await response.json();
        return {
            data: json.data.data || [],
            meta: json.data.meta || { page: 1, limit: 10, total: 0 }
        };
    } catch (error) {
        console.error("Get Companies error:", error);
        return null;
    }
}

// ... create, update, delete remain similar
export async function createCompany(company: Company) {
    // ... (same as before)
    const response = await fetch(`${API_BASE}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company)
    });
    return response.ok;
}

export async function updateCompany(id: number, company: Company) {
    const response = await fetch(`${API_BASE}/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: company.name, phone: company.phone, address: company.address })
    });
    return response.ok;
}

export async function deleteCompany(id: number) {
    const response = await fetch(`${API_BASE}/companies/${id}`, { method: "DELETE" });
    return response.ok;
}

// NEW: Pay Company
export async function payCompany(id: number, amount: number, description: string) {
    try {
        const response = await fetch(`${API_BASE}/companies/${id}/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, description })
        });
        return response.ok;
    } catch (error) {
        console.error("Pay Company error:", error);
        return false;
    }
}

// NEW: Get Transactions
export async function getCompanyTransactions(id: number, page = 1, limit = 10): Promise<TransactionResponse | null> {
    try {
        const response = await fetch(`${API_BASE}/companies/${id}/transactions?page=${page}&limit=${limit}`, {
            cache: "no-store"
        });
        if (!response.ok) throw new Error("Failed");
        const json = await response.json();
        return {
            data: json.data.data || [],
            meta: json.data.meta || { page: 1, limit: 10, total: 0 }
        };
    } catch (error) {
        console.error("Get Transactions error:", error);
        return null;
    }
}

// NEW: Get Single Company (For the details page header)
export async function getCompany(id: number): Promise<Company | null> {
    try {
        // Assuming your API supports getting a single company. 
        // If not, we might have to filter from the list or just show ID.
        // For now, let's assume this endpoint exists or we use the list search.
        const response = await fetch(`${API_BASE}/companies/${id}`);
        if (!response.ok) return null;
        const json = await response.json();
        return json.data;
    } catch (e) { return null; }
}