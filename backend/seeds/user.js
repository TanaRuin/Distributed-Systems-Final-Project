import mongoose from "mongoose";
import chatModel from "../models/user.js"; 
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();


const seedUsers = async () => {
  try {
    connectDB();

    // await chatModel.deleteMany({});
    // console.log("🧹 Cleared old records");

    const users = [
      {
        name: "Alice",
        email: "alice@example.com",
        password: "hashedpassword1",
        role: "human"
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password: "hashedpassword2",
        role: "human"
      },
      {
        name: "ChatGPT",
        email: "ai@openai.com",
        password: "nopasswordneeded",
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
