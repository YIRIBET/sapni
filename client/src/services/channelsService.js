const API_URL = import.meta.env.VITE_API_URL;

export async function fetchChannels() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/media-channels`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }); 
    if (!res.ok) throw new Error("Failed to fetch channels");
    return await res.json();
 }
