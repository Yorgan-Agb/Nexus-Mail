import { Router } from "express";
import { healthCheck } from "../controllers/main.controller.ts";

export const router = Router();

router.get("/health", healthCheck);
