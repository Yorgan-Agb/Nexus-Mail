import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import { UnauthorizedError, ForbiddenError } from "../lib/error.ts";
import { decodeAccessToken, extractAccessTokenFromReq } from "../lib/auth.ts";
import { allTags, addTags } from "../services/tag.service.ts";
import {
  createTagSchema,
  createTagsSchema,
} from "../validations/tag.validation.ts";

export const getAllTags = async (req: Request, res: Response) => {
  const userId = req.userId;
  const token = extractAccessTokenFromReq(req);
  const decoded = decodeAccessToken(token);
  if (decoded.userId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const tags = await allTags(userId);

  res.status(200).json({ tags });
};

export const addNewTags = async (req: Request, res: Response) => {
  const userId = req.userId;
  const tagData = createTagsSchema.parse(req.body);
  const createdTags = await addTags(userId, tagData);
  res.status(201).json({ tags: createdTags });
};
