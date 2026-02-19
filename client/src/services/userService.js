const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUsers() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
}

export async function createUser(userData) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error("Failed to create user");
    return await res.json();
}

export async function updateUser(userId, userData) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error("Failed to update user");
    return await res.json();
}

export async function deleteUser(userId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
}