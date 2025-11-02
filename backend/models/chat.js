import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
  }, 
  { timestamps: true }
);

const chatModel = mongoose.models.chat || mongoose.model('chat', chatSchema);

export default chatModel;
