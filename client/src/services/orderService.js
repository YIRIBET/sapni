const API_URL = import.meta.env.VITE_API_URL;

export async function getOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/diffusion-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch orders");

  const data = await res.json();

  return data.data;
}

export async function getOrdersbyCampaignActive() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/diffusion-orders/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch orders");

  const data = await res.json();

  return data.data;
}

export async function getOrderById(orderId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/diffusion-orders/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to get order");
  return await res.json();
}

export async function getOrdersByMediaType(mediaTypeId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/diffusion-orders/media-type/${mediaTypeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error fetching orders");
  return await res.json();
}

export async function createOrder(orderData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/diffusion-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return await res.json();
}

export async function updateOrder(orderId, orderData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/diffusion-orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return await res.json();
}

export async function deleteOrder(orderId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/diffusion-orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return await res.json();
}