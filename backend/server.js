import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ REST DB connected");

// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from REST API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ REST API running on port ${PORT}`));
