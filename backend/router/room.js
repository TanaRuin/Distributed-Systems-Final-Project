import express from "express";
import { createRoom, getRooms, joinRoom } from "../controller/room.js";

const roomRouter = express.Router();

roomRouter.post("/create", createRoom);
roomRouter.put("/join", joinRoom);
roomRouter.get("/all", getRooms);

export default roomRouter;
