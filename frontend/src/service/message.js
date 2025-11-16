import axios from "axios"
import { getHttp } from "./http"

export const sendMessage = async(roomId, userId, content, isAiContext) => {
    try {
        const resp = await axios.post(
            getHttp() + "/api/chat/send",
            {roomId: roomId, userId: userId, content: content, isAiContext: isAiContext},
        );

        return {
            success: resp.data.success,
            message: resp.data.message || "send message success",
        };
    } catch (error) {
        console.error("send message error:", error);
        const message = error.response?.data?.message || "send message failed. Please try again.";

        return {success: false, message};
    }
}

export const getMessages = async(roomId) => {
    try {
        const resp = await axios.get(
            getHttp() + "/api/chat/all?roomId=" + roomId,
        );

        return {
            success: resp.data.success,
            chats: resp.data.chats,
            message: resp.data.message || "Get all messages success",
        };
    } catch (error) {
        console.error("Get all messages error:", error);
        const message = error.response?.data?.message || "Get all messages failed. Please try again.";

        return {success: false, message};
    }
}

export const generateAiResponse = async (prompt, type, roomId) => {
    try{
        const resp = await axios.post(
            getHttp() + "/api/chat/generateAi", {prompt, type, roomId}
        );

        return {
            success: resp.data.success,
            response: resp.data.response,
            message: resp.data.message || "Generated messages success",
        };
    }
    catch(err){
        console.error("Generate bot response error: ", err)
        return {success: false, message: err}
    }
}