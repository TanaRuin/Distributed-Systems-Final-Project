import { generateAiResponse } from "./chatbot.js";
import { redis } from "../queues/messageQueue.js";

// key for leader election
const LEADER_KEY = "ai_leader";
const TTL = 4000;

// AI candidates
const AI_MODELS = ['llama3', 'qwen2', 'mistral'];

async function scoreResponse(text, question) {
    const prompt = `Given this response: "${text}"
            And this question: "${question}"

            Rate how well the response answers the question.
            Return ONLY a number between 0 and 1. No words, no explanation.
            `;
    
    const response = await generateAiResponse(prompt, "Gemini");
    
    const raw = response.trim();
    const float = parseFloat(raw);

    return isNaN(float) ? 0 : float;
}

async function electLeader(aiResults) {
    console.log("ai results", aiResults)

    let leader = null;

    for (const result of aiResults) {
        if (!leader || result.score > leader.score) {
            leader = result;
        }
    }

    return leader;
}

async function trySetLeader(leaderName) {
    return redis.set(LEADER_KEY, leaderName, "PX", TTL, "NX");
}

export async function getLeaderResponse(prompt) {
    const cachedLeader = await redis.get(LEADER_KEY);

    if (cachedLeader) {
        try {
            const response = await generateAiResponse(prompt, cachedLeader);

            return {
                model: cachedLeader,
                response,
                score: await scoreResponse(response, prompt)
            };
        } catch (err) {
            console.error(`Cached leader ${cachedLeader} failed. Re-electing leader...`);
            // FALL THROUGH to full election
        }
    }

    const results = [];

    for (const model of AI_MODELS) {
        try {
            const response = await generateAiResponse(prompt, model);
            console.log("model", model, "response", response);

            results.push({
                model,
                response,
                score: await scoreResponse(response, prompt)
            });

        } catch (err) {
            console.error(err);
            results.push({
                model,
                response: "",
                score: 0
            });
        }
    }

    // Step 2 — elect the leader
    const leader = await electLeader(results);

    // Step 3 — persist leader into Redis
    await trySetLeader(leader.model);

    return leader;
}
