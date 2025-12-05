import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import { getAllTags } from "../controllers/tag.controller.ts";

export const tagRouter = Router();

tagRouter.get("/", checkAuth, getAllTags);
