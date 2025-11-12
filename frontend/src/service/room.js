import axios from "axios"
import { getHttp } from "./http"
import { getUserData } from "./auth";

export const getAllRooms = async() => {
    try {
        const user = getUserData();
        const resp = await axios.get(
            getHttp() + "/api/room/all?userId=" + user._id,
        );

        return {
            success: resp.data.success,
            rooms: resp.data.rooms,
            message: resp.data.message || "Get all rooms success",
        };
    } catch (error) {
        console.error("Get all rooms error:", error);
        const message = error.response?.data?.message || "Get all rooms failed. Please try again.";

        return {success: false, message};
    }
}

export const createRoom = async(name) => {
    try {
        const user = getUserData();
        const resp = await axios.post(
            getHttp() + "/api/room/create",
            {name: name, userId: user._id},
        );

        return {
            success: resp.data.success,
            message: resp.data.message || "Create room success",
        };
    } catch (error) {
        console.error("Create room error:", error);
        const message = error.response?.data?.message || "Create room failed. Please try again.";

        return {success: false, message};
    }
}

export const joinRoom = async(roomCode) => {
    try {
        const user = getUserData();
        const resp = await axios.put(
            getHttp() + "/api/room/join",
            {roomCode: roomCode, userId: user._id},
        );

        return {
            success: resp.data.success,
            message: resp.data.message || "Join room success",
            roomId: resp.data.roomId
        };
    } catch (error) {
        console.error("Join room error:", error);
        const message = error.response?.data?.message || "Join room failed. Please try again.";

        return {success: false, message};
    }
}