const API_URL = import.meta.env.VITE_API_URL;

export async function fetchEvidence() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch evidence records");

  const json = await res.json();
  return json.data || [];
}

export async function createEvidence(evidenceData) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/evidence-records`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(evidenceData)
    });
    if (!res.ok) throw new Error("Failed to create evidence record");
    return await res.json();
}

export async function updateEvidence(evidenceId, evidenceData) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/evidence-records/${evidenceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(evidenceData)
    });
    if (!res.ok) throw new Error("Failed to update evidence record");
    return await res.json();
}

export async function deleteEvidence(evidenceId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/evidence-records/${evidenceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to delete evidence record");
    return await res.json();
}

//filtros
export async function fetchCountUserEvidence() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records/count/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user evidence count");

  const json = await res.json();
    return json.data?.total || [];
}

export async function fetchCountByMediaChannel() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records/count/media-channel`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch media channel count");

  const json = await res.json();
  return json.data || [];
}

export async function fetchCountsByMediaType() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records/counts/media-type`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch media type counts");

  const json = await res.json();
  return json.data || [];
}

export async function fetchCountsByStatus() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records/counts/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch status counts");

  const json = await res.json();
  return json.data.rows || [];
}

export async function fetchProgressByOrder() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evidence-records/progress/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch order progress");

  const json = await res.json();
  return json.data || [];
}