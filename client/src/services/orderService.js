const API_URL = import.meta.env.VITE_API_URL;

export async function getOrders() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/diffusion-orders/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }); 
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
 }
