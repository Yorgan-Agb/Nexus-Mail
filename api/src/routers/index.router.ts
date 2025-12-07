import { Router } from "express";
import { healthCheck } from "../controllers/main.controller.ts";
import { authRouter } from "./auth.router.ts";
import { userRouter } from "./user.router.ts";
import { tagRouter } from "./tag.router.ts";

export const router = Router();

router.get("/health", healthCheck);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/tags", tagRouter);
