import type { Request, Response } from "express";
import { UnauthorizedError } from "../lib/error.ts";
import { decodeAccessToken, extractAccessTokenFromReq } from "../lib/auth.ts";
import { allUserFolders, getById } from "../services/folder.service.ts";

export const getAllFolders = async (req: Request, res: Response) => {
  const userId = req.userId;
  const token = extractAccessTokenFromReq(req);
  const decoded = decodeAccessToken(token);
  if (decoded.userId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const folders = await allUserFolders(userId);

  res.status(200).json({ folders });
};

export const getFolderById = async (req: Request, res: Response) => {};
