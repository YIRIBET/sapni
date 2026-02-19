const API_URL = import.meta.env.VITE_API_URL;

export async function fetchClients() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/clients`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch clients");
    return await res.json();
}
