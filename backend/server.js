import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { messageQueue } from "./queues/messageQueue.js"; 
import { messageWorker } from "./queues/messageWorker.js";

import connectDB from "./config/db.js";
import authRouter from "./router/auth.js";
import roomRouter from "./router/room.js";
import chatRouter from "./router/message.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send(`Combined REST + Socket Server running 🚀 on port ${process.env.PORT}`);
});

// Create ONE server that handles both
const server = http.createServer(app);

// SOCKET.IO SAME SERVER
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
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

    socket.on("aiLoadingTrue", (roomId) => {
        socket.to(roomId).emit("aiLoadingTrue");
    });

    socket.on("aiLoadingFalse", (roomId) => {
        socket.to(roomId).emit("aiLoadingFalse");
    });

    socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Run on port 5000 OR 5001 or any
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server (REST + Socket) running on port ${PORT}`);
});
