import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.ts";

export const userRouter = Router();

userRouter.get("/", getAllUsers);
