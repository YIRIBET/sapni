const API_URL = import.meta.env.VITE_API_URL;

export async function fetchClients() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch clients");
  return await res.json();
}

export async function createClient(clientData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return await res.json();
}

export async function updateClient(clientId, clientData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return await res.json();
}

export async function deleteClient(clientId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete client");
  return await res.json();
}