import { Worker } from "bullmq";
import Redis from "ioredis";
import chatModel from "../models/chat.js";
import connectDB from "../config/db.js";

connectDB();

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

export const messageWorker = new Worker(
  "messages",
  async (job) => {
    const { senderId, senderName, roomId, message, isAI } = job.data;

    await chatModel.create({
      roomId,
      senderId,
      message,
      isAI
    });

    console.log("💾 Stored message:", message);
  },
  { connection: redis }
);
