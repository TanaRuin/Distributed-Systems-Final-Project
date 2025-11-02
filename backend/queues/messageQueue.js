import { Queue } from "bullmq";
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,        // ✅ required by BullMQ
  enableReadyCheck: false            // ✅ avoid waiting check inside Docker
});

export const messageQueue = new Queue("messages", {
  connection: redis,
});
