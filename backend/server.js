import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import dailyMatchRoutes from "./routes/dailyMatchRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import successStoryRoutes from "./routes/successStoryRoutes.js";
import icebreakerRoutes from "./routes/icebreakerRoutes.js";
import profileStrengthRoutes from "./routes/profileStrengthRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration - support both local and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL // Set in production: https://your-app.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/daily-match", dailyMatchRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/success-stories", successStoryRoutes);
app.use("/api/icebreakers", icebreakerRoutes);
app.use("/api/profile-strength", profileStrengthRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

/* SOCKET (OPTIONAL REAL-TIME) */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`[Socket] User connected with ID: ${socket.id}`);

  socket.on("sendMessage", (msg) => {
    socket.broadcast.emit("receiveMessage", msg);
  });

  socket.on("register", (userId) => {
    if (userId) {
      socket.join(userId);
      socket.data.userId = userId;
      console.log(`[Socket] User ${userId} registered, socket room joined`);
    }
  });

  socket.on("call:offer", ({ to, from, offer, callType }) => {
    console.log(`[Call] call:offer received - from: ${from}, to: ${to}, type: ${callType}`);
    if (to) {
      console.log(`[Call] Relaying offer to room: ${to}`);
      io.to(to).emit("call:offer", { from, offer, callType });
    } else {
      console.warn(`[Call] Invalid 'to' field in call:offer`);
    }
  });

  socket.on("call:answer", ({ to, from, answer }) => {
    console.log(`[Call] call:answer received - from: ${from}, to: ${to}`);
    if (to) {
      console.log(`[Call] Relaying answer to room: ${to}`);
      io.to(to).emit("call:answer", { from, answer });
    }
  });

  socket.on("call:ice", ({ to, from, candidate }) => {
    if (to) io.to(to).emit("call:ice", { from, candidate });
  });

  socket.on("call:reject", ({ to, from }) => {
    console.log(`[Call] call:reject received - from: ${from}, to: ${to}`);
    if (to) io.to(to).emit("call:reject", { from });
  });

  socket.on("call:end", ({ to, from }) => {
    console.log(`[Call] call:end received - from: ${from}, to: ${to}`);
    if (to) io.to(to).emit("call:end", { from });
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
