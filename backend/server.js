import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./router/auth.js";
import roomRouter from "./router/room.js";
import chatRouter from "./router/message.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,            
}));

connectDB();

app.get("/", (req, res) => {
  res.send("API running with ESM + Docker hot reload 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
