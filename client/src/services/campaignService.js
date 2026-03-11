const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCampaings() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/campaigns/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return await res.json();
}

export async function createCampaing(campaignData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/campaigns/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw new Error("Failed to create campaign");
  return await res.json();
}

export async function updateCampaing(campaignId, campaignData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw new Error("Failed to update campaign");
  return await res.json();
}

export async function deleteCampaing(campaignId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/campaigns/${campaignId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete campaign");
  return await res.json();
}