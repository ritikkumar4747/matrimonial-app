import { io } from "socket.io-client";

// Detect environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://matrimonial-app-production-d5ac.up.railway.app"); // Fallback to actual Railway URL

console.log(`[Socket] Connecting to: ${BACKEND_URL}`);

const socket = io(BACKEND_URL, {
	withCredentials: true,
	transports: ["websocket", "polling"],
	autoConnect: true,
	reconnection: true,
	reconnectionAttempts: 10,
	reconnectionDelay: 500
});

socket.on("connect", () => {
	console.log(`[Socket] Connected with ID: ${socket.id}`);
});

socket.on("connect_error", (error) => {
	console.error(`[Socket] Connection error:`, error);
});

export default socket;
