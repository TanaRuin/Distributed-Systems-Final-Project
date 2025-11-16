import express from "express";
import { getAllAiUser, getUser, login, register } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", getUser);
authRouter.get("/aiuser", getAllAiUser);

export default authRouter;
