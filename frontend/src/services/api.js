import axios from "axios";

// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_BACKEND_URL || (
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://matrimonial-app-production-d5ac.up.railway.app" // Fallback to actual Railway URL
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
