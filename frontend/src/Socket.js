import { io } from "socket.io-client";

// Detect environment - only use localhost if actually on a local machine
const isLocalhost = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || 
   window.location.hostname === "127.0.0.1" ||
   window.location.hostname.startsWith("192.168."));

const BACKEND_URL = isLocalhost 
  ? "http://localhost:5000" 
  : "https://matrimonial-app-production-d5ac.up.railway.app"; // Production Railway URL

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
