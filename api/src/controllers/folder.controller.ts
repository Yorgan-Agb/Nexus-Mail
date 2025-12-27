import type { Request, Response } from "express";
import { UnauthorizedError } from "../lib/error.ts";
import { decodeAccessToken, extractAccessTokenFromReq } from "../lib/auth.ts";
import { allUserFolders, uniqueFolder } from "../services/folder.service.ts";

export const getAllFolders = async (req: Request, res: Response) => {
  const userId = req.userId;
  const folders = await allUserFolders(userId);
  res.status(200).json({ folders });
};

export const getFolderById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const folder = await uniqueFolder(userId);
  res.status(200).json({ folder });
};
