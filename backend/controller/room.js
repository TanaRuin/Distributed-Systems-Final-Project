import roomModel from "../models/room.js";

function generateRandomString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export const createRoom = async(req, res) => {
    try {
        const {name, userId} = req.body;
        const roomCode = generateRandomString(6);

        const room = await roomModel.create({
            name, 
            code: roomCode,
            participants: [userId],
        });
        return res.status(200).json({ success: true, room });

    } catch (error) {
        console.error("createRoom failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const joinRoom = async(req, res) => {
    try {
        const {roomCode, userId} = req.body;

        const existing = await roomModel.findOne({ code: roomCode });
        if(!existing){ 
            return res.status(400).json({success:false, message:'Invalid room code'})
        }

        const filter = { code: roomCode };
        const update = { $push: { participants: userId } };
        await roomModel.findOneAndUpdate(filter, update);

        return res.status(200).json({ success: true, roomId: existing._id });

    } catch (error) {
        console.error("joinRoom failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}

export const getRooms = async(req, res) => {
    try {
        const userId = req.query.userId;
        const rooms = await roomModel.find({ participants: { $in: [userId] } });
        return res.status(200).json({ success: true, rooms });
    } catch (error) {
        console.error("getRooms failed", error);
        return res.status(500).json({success:false, message:"Please try again"});
    }
}