import mongoose from "mongoose";
import roomModel from "../models/room.js";    
import userModel from "../models/user.js";     
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const seedRooms = async () => {
  try {
    connectDB();

    const users = await userModel.find({});
    
    // await roomModel.deleteMany({});
    // console.log("🧹 Old rooms deleted");

    const rooms = [
      {
        name: "General Chat",
        code: "CHAT123",
        participants: [users[0]._id, users[1]._id]
      },
      {
        name: "AI Support",
        code: "AI123",
        participants: [users[1]._id, users[2]._id] 
      }
    ];

    await roomModel.insertMany(rooms);
    console.log("Rooms seeded successfully");

    mongoose.connection.close();
  } catch (err) {
    console.error("Room seed failed:", err);
  }
};

seedRooms();
