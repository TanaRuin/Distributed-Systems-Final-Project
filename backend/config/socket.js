import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { messageQueue } from "../queues/messageQueue.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React port
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("sendMessage", async (msg) => {
    // Add to queue
    await messageQueue.add("new-message", msg);

    console.log("📥 Queued message:", msg.message);

    // Emit to clients immediately
    io.emit("receiveMessage", msg);
  });
});


export {io, app, server}
