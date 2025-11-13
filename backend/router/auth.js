import express from "express";
import { getUser, login, register } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", getUser);

export default authRouter;
