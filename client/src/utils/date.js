export const formatDate = (dateString) => {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("es-MX", {
    timeZone: "UTC", 
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.slice(0, 5);
};

export const formatUTCDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("es-MX", {
    timeZone: "Etc/GMT+2",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};