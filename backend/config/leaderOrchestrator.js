import Redis from "ioredis";
import { generateAiResponse } from "./chatbot.js";
import { redis } from "../queues/messageQueue.js";

// key for leader election
const LEADER_KEY = "ai_leader";
const TTL = 4000;

// AI candidates
const AI_MODELS = ['Gemini', 'Qwen', 'Deepseek'];

function scoreResponse(text) {
    // simple scoring: longer & richer response is better
    return text.length;
}

async function electLeader(aiResults) {
    let leader = null;

    for (const result of aiResults) {
        if (!leader || result.score > leader.score) {
            leader = result;
        }
    }

    return leader;
}

async function trySetLeader(leaderName) {
    return redis.set(LEADER_KEY, leaderName, "PX", TTL);
}

export async function getLeaderResponse(prompt) {
    const cachedLeader = await redis.get(LEADER_KEY);

    if (cachedLeader) {
        try {
            const response = await generateAiResponse(prompt, cachedLeader);

            return {
                model: cachedLeader,
                response,
                score: scoreResponse(response)
            };
        } catch (err) {
            console.error(`Cached leader ${cachedLeader} failed. Re-electing leader...`);
            // FALL THROUGH to full election
        }
    }

    // Step 1 — query all AIs in parallel
    const promises = AI_MODELS.map(async (model) => {
        try {
            const response = await generateAiResponse(prompt, model);

            return {
                model,
                response,
                score: scoreResponse(response)
            };
        } catch {
            return {
                model,
                response: "",
                score: 0
            };
        }
    });

    const results = await Promise.all(promises);

    // Step 2 — elect the leader
    const leader = await electLeader(results);

    // Step 3 — persist leader into Redis
    await trySetLeader(leader.model);

    return leader;
}
