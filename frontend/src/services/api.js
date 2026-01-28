import axios from "axios";

// Dynamic API URL based on environment
// Only use localhost if actually running on 127.0.0.1 or localhost dev machine
const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || 
   window.location.hostname === "127.0.0.1" ||
   window.location.hostname.startsWith("192.168."));

const API_URL = isLocalhost 
  ? "http://localhost:5000" 
  : "https://matrimonial-app-production-d5ac.up.railway.app"; // Production Railway URL

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
