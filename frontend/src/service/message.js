import axios from "axios"
import { getHttp } from "./http"

export const sendMessage = async(roomId, userId, content) => {

    return await axios.post(
        getHttp() + "/api/chat/send",
        {roomId: roomId, userId: userId, content: content},
    );
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