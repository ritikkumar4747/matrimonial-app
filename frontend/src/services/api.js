import axios from "axios";

// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_BACKEND_URL || (
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://your-production-backend.com" // Will be set via .env
);

const API = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
