const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCampaings() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/campaigns`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }); 
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    return await res.json();
}
