// lib/api/auth.ts

export async function loginUser(pin_code: string) {
    try {
        const response = await fetch("http://127.0.0.1:8081/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pin_code })
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // This catches network errors (e.g. server offline)
        console.error("Network or parsing error:", error);
        return null;
    }
}