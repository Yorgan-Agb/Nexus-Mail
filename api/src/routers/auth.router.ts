import { Router } from "express";
import { registerUser, login } from "../controllers/auth.controller.ts";
export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
