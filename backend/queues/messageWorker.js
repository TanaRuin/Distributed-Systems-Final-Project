import { Worker } from "bullmq";
import Redis from "ioredis";
import chatModel from "../models/message.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

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
    let { senderId, roomId, message, isAiContext } = job.data;

    if (message === '' && isAiContext) message = "No content generated"
    await chatModel.create({
      roomId,
      senderId,
      message,
      isAiContext
    });

    const timestamp = Date.now();
    console.log("message_dequeued: ", timestamp);
  },
  { connection: redis }
);