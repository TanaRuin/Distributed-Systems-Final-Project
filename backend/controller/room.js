import roomModel from "../models/room.js";
import userModel from "../models/user.js";
import { redis } from "../queues/messageQueue.js";

function generateRandomString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export const createRoom = async(req, res) => {
    try {
        const {name, userId} = req.body;
        const roomCode = generateRandomString(6);

        const allData = await userModel.find({role: "AI"});
        let participantList = [userId];
        for (let i=0; i<allData.length; i++){
            participantList.push(allData[i]._id);
        }

        const room = await roomModel.create({
            name, 
            code: roomCode,
            participants: participantList,
        });

        await redis.del(`room-${userId}`);
        return res.status(200).json({ success: true, room });

    } catch (error) {
        console.error("createRoom failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const joinRoom = async (req, res) => {
    try {
        const { roomCode, userId } = req.body;

        const updatedRoom = await roomModel.findOneAndUpdate(
            { code: roomCode },
            { $addToSet: { participants: userId } }, 
            { new: true }
        );

        if (!updatedRoom) {
        return res.status(400).json({ success: false, message: 'Invalid room code' });
        }

        await redis.del(`room-${userId}`);
        return res.status(200).json({ success: true, room: updatedRoom });

    } catch (error) {
        console.error("joinRoom failed", error);
        return res.status(500).json({ success: false, message: "Please try again" });
    }
};


export const getRooms = async(req, res) => {
    try {
        const userId = req.query.userId;
        const cachedRooms = await redis.get(`room-${userId}`);
        if(cachedRooms){
            return res.status(200).json({
                success: true,
                rooms: JSON.parse(cachedRooms),
            });
        }

        const rooms = await roomModel.find({ participants: { $in: [userId] } });
        await redis.set(`room-${userId}`, JSON.stringify(rooms), "EX", 10);

        return res.status(200).json({ success: true, rooms });
    } catch (error) {
        console.error("getRooms failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}