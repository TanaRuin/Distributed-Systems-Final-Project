import express from "express";
import { generateBotRes, getMessages, sendMessage } from "../controller/message.js";

const chatRouter = express.Router();

chatRouter.get("/all", getMessages);
chatRouter.post("/send", sendMessage);
chatRouter.post('/generateAi', generateBotRes);

export default chatRouter;
