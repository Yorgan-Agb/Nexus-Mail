import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import {
  getAllFolders,
  getFolderById,
  createNewFolder,
} from "../controllers/folder.controller.ts";

export const folderRouter = Router();

folderRouter.get("/", checkAuth, getAllFolders);
folderRouter.get("/:type", checkAuth, getFolderById);
folderRouter.post("/new", checkAuth, createNewFolder);
