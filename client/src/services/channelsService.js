const API_URL = import.meta.env.VITE_API_URL;

export async function fetchChannels() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/media-channels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch channels");
  return await res.json();
}

export async function fetchMediaChannels() {
  return fetchChannels();
}

export async function createChannel(channelData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/media-channels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(channelData),
  });
  if (!res.ok) throw new Error("Failed to create channel");
  return await res.json();
}

export async function updateChannel(channelId, channelData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/media-channels/${channelId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(channelData),
  });
  if (!res.ok) throw new Error("Failed to update channel");
  return await res.json();
}

export async function deleteChannel(channelId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/media-channels/${channelId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete channel");
  return await res.json();
}