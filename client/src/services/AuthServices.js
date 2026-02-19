const API_URL = import.meta.env.VITE_API_URL;

export async function loginService(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();

  const jwtToken = data.token?.token || data.token;
  if (!jwtToken) throw new Error("Token no recibido");

  // Decodificar JWT
  const payload = JSON.parse(atob(jwtToken.split(".")[1]));

  const role = payload.role?.toUpperCase().replace(" ", "_"); 
  const userId = payload.id;
  console.log("Decoded JWT Payload:", payload);

  // Guardar en localStorage
  localStorage.setItem("token", jwtToken);
  localStorage.setItem("userRole", role);
  localStorage.setItem("userId", userId);

  return { token: jwtToken, role, userId };
}