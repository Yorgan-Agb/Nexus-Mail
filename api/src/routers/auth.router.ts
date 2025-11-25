import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.ts";
export const authRouter = Router();

authRouter.post("/register", registerUser);
