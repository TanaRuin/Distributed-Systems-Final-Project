import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app, server } from "./config/socket.js";
import "./queues/messageWorker.js"; 

dotenv.config();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API running with ESM + Docker hot reload 🚀");
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
