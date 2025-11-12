import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code : { type: String, required: true },
    participants: { type: [mongoose.Schema.Types.ObjectId], ref: "user", required: true },
  }, 
  { timestamps: true }
);

const roomModel = mongoose.models.room || mongoose.model('room', roomSchema);

export default roomModel;
