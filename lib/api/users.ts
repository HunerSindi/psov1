// lib/api/users.ts

export interface User {
    id?: number;
    name: string;
    phone: string;
    pin_code?: string;
    permissions: string[];
    active?: boolean;
}

const API_BASE = "http://127.0.0.1:8081";

// GET ALL EMPLOYEES
export async function getUsers() {
    try {
        const response = await fetch(`${API_BASE}/users/staff`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store" // Ensures we always get fresh data
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Users error:", error);
        return null;
    }
}

// CREATE NEW EMPLOYEE
export async function createUser(userData: User) {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Create User error:", error);
        return null;
    }
}

// UPDATE EMPLOYEE
export async function updateUser(id: number, userData: User) {
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: "PUT", // or PATCH depending on your backend
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update User error:", error);
        return null;
    }
}

// DELETE EMPLOYEE
export async function deleteUser(id: number) {
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        // Some backends return empty body on delete, so we handle that:
        // If content-length is 0, just return true
        if (response.headers.get("Content-Length") === "0") {
            return true;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete User error:", error);
        return null;
    }
}