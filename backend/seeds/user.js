import mongoose from "mongoose";
import chatModel from "../models/user.js"; 
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

dotenv.config();


const seedUsers = async () => {
  try {
    connectDB();

    // await chatModel.deleteMany({});
    // console.log("🧹 Cleared old records");

    const pass = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Alice",
        email: "alice@example.com",
        password: pass,
        role: "human"
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password: pass,
        role: "human"
      },
      {
        name: "ChatGPT",
        email: "ai@openai.com",
        password: pass,
        role: "AI"
      }
    ];

    await chatModel.insertMany(users);
    console.log("Database seeded successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

seedUsers();
