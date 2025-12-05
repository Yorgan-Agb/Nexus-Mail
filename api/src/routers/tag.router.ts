import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import { getAllTags, addNewTags } from "../controllers/tag.controller.ts";

export const tagRouter = Router();

tagRouter.get("/", checkAuth, getAllTags);
tagRouter.post("/new", checkAuth, addNewTags);
