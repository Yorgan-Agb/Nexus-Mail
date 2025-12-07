import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import { getAllFolders } from "../controllers/folder.controller.ts";

export const folderRouter = Router();

folderRouter.get("/", checkAuth, getAllFolders);
