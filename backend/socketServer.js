import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { messageQueue } from "./queues/messageQueue.js"; 
import { messageWorker } from "./queues/messageWorker.js";

dotenv.config();

// Express app (used only for health check or future upgrades, no REST routes)
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
        console.log("user joined room", roomId);
        socket.join(roomId);
    });

    socket.on("sendMessage", async (msg) => {
        try {
            await messageQueue.add("new-message", msg);
            console.log("📥 Queued message:", msg.message);

            console.log("roomid", msg.roomId)
            io.to(msg.roomId).emit("receiveMessage", msg);
        } catch (e) {
            console.error("❌ Queue error:", e.message);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Health check
app.get("/", (req, res) => res.send("Socket server running ✅"));

// Start server
const PORT = process.env.SOCKET_PORT || 5001;
server.listen(PORT, () => {
  console.log(`⚡ Socket.io server running on port ${PORT}`);
});