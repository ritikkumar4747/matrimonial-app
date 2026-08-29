const isLocalhost = typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168."));

const fallbackBaseUrl = isLocalhost
  ? "http://localhost:5000"
  : "https://matrimonial-app-pu7b.onrender.com";

const envBaseUrl = typeof import.meta !== "undefined" && import.meta.env
  ? import.meta.env.VITE_API_URL
  : undefined;

const normalizeBase = (url) => (url ? url.replace(/\/+$/, "") : "");

const API_BASE_URL = normalizeBase(envBaseUrl || fallbackBaseUrl);

export const getApiBaseUrl = () => API_BASE_URL;
export const getApiUrl = () => `${API_BASE_URL}/api`;
export const getSocketUrl = () => API_BASE_URL;
export const getAssetUrl = (path = "") => {
  // If path is already a full URL (from Cloudinary), return as-is
  if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }
  // Otherwise, prepend base URL
  return path ? `${API_BASE_URL}${path}` : "";
};
