export const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatUTCDate = (dateString) =>
  new Date(dateString).toLocaleString("es-MX", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, 
  });