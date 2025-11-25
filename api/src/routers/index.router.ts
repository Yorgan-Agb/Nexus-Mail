import { Router } from "express";
import { healthCheck } from "../controllers/main.controller.ts";
import { authRouter } from "./auth.router.ts";

export const router = Router();

router.get("/health", healthCheck);

router.use("/auth", authRouter);
