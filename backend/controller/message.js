import { generateAiResponse } from "../config/chatbot.js";
import { getLeaderResponse } from "../config/leaderOrchestrator.js";
import chatModel from "../models/message.js";
import { redis } from "../queues/messageQueue.js";

export const getMessages = async(req, res) => {
    try {
        const roomId = req.query.roomId;
        const cachedMsg = await redis.get(`chat-${roomId}`);
        if (cachedMsg) {
            return res.status(200).json({
                success: true,
                chats: JSON.parse(cachedMsg),
            });
        }

        const chats = await chatModel.find({roomId});
        
        await redis.set(`chat-${roomId}`, JSON.stringify(chats), "EX", 10);
        return res.status(200).json({success:true, chats})

    } catch (error) {
        console.error("getMessages failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const sendMessage = async(req, res) => {
    try {
        const {roomId, userId, content, isAiContext} = req.body;
        await chatModel.create({
            roomId,
            senderId: userId,
            message: content,
            isAiContext
        })
        await redis.del(`chat-${roomId}`);
        return res.status(200).json({success:true})

    } catch (error) {
        console.error("sendMessage failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const generateBotRes = async(req,res) =>{
    const {prompt, type, roomId} = req.body;
    const aiTypes = ['llama3','qwen2', 'mistral','All']

    if (!aiTypes.includes(type)){
        console.error('Error:', "Invalid AI Type");
        return res.status(404).json({success: false, error: 'Invalid AI Type' });
    }

    const history = await chatModel
            .find({ roomId, isAiContext: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

    const contextLines = history
        .reverse()
        .map(h => h.message)
        .join("\n");

    const finalPrompt =
        `Use this as context for your prompt if needed\n` +
        `${contextLines}\n` +
        `${prompt}`;
    

    if (type === 'All'){
        try {
            const chosen = await getLeaderResponse(finalPrompt);
            console.log("chosen", chosen)

            return res.status(200).json({
                success: true,
                response: chosen.response,
                message: "Leader-selected AI response."
            });
        } catch (err) {
            console.error("Leader error:", err);
            return res.status(500).json({ success: false, error: "Leader election failed." });
        }
    }

    try {
        const msgResponse = await generateAiResponse(finalPrompt, type);
        
        if (msgResponse === ""){
            console.error('AI API Error:', err.response?.data || err.message);
            return res.status(500).json({success: false, error: 'Failed to generate content' });
        }

        return res.status(200).json({
            success: true,
            response: msgResponse,
            message: "Chat generated successfully."
        });
      } 
      catch (err) {
        console.error('AI API Error:', err.response?.data || err.message);
        return res.status(500).json({success: false, error: 'Failed to generate content' });
      }
}