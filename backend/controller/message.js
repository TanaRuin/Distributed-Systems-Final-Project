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
        const {roomId, userId, content} = req.body;
        await chatModel.create({
            roomId,
            senderId: userId,
            message: content,
        })
        return res.status(200).json({success:true})

    } catch (error) {
        console.error("sendMessage failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}