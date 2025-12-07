import { decodeAccessToken, extractAccessTokenFromReq } from "../lib/auth.ts";
import type { Request, Response } from "express";
import { allMails, getMailById } from "../services/mail.service.ts";
import { UnauthorizedError } from "../lib/error.ts";

export const getAllMails = async (req: Request, res: Response) => {
  const userId = req.userId;
  const token = extractAccessTokenFromReq(req);
  const decoded = decodeAccessToken(token);
  if (decoded.userId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const mails = await allMails(userId);

  res.status(200).json({ mails });
};

export const getOneMail = async (req: Request, res: Response) => {
  const userId = req.userId;
  const mailId = Number(req.params.id);
  const token = extractAccessTokenFromReq(req);
  const decoded = decodeAccessToken(token);
  if (decoded.userId !== userId) {
    throw new UnauthorizedError("Unauthorized");
  }
  const mail = await getMailById(userId, mailId);

  res.status(200).json({ mail });
};
