import { generateAiResponse } from "../config/chatbot.js";
import chatModel from "../models/message.js";

export const getMessages = async(req, res) => {
    try {
        const roomId = req.query.roomId;
        const chats = await chatModel.find({roomId});
        
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
        return res.status(200).json({success:true})

    } catch (error) {
        console.error("sendMessage failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const generateBotRes = async(req,res) =>{
    const {prompt, type} = req.body;
    const aiTypes = ['Gemini','Qwen','Deepseek','All']

    if (!aiTypes.includes(type)){
        console.error('Error:', "Invalid AI Type");
        return res.status(404).json({success: false, error: 'Invalid AI Type' });
    }

    if (type === 'All'){
        return res.status(200).json({success: true, response: "Still on development", message: "Still on development"})
    }

    try {
        const msgResponse = await generateAiResponse(prompt, type);
        
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