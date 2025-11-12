import express from "express";
import { getMessages, sendMessage } from "../controller/message.js";

const chatRouter = express.Router();

chatRouter.get("/all", getMessages);
chatRouter.post("/send", sendMessage);

export default chatRouter;
