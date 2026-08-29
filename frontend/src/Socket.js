import { io } from "socket.io-client";
import { getSocketUrl } from "./utils/apiConfig";

const BACKEND_URL = getSocketUrl();

console.log(`[Socket] Connecting to: ${BACKEND_URL}`);

const socket = io(BACKEND_URL, {
	withCredentials: true,
	transports: ["polling", "websocket"],
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
