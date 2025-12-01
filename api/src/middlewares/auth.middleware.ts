import type { Request, Response, NextFunction } from "express";
import { decodeAccessToken, extractAccessTokenFromReq } from "../lib/auth.ts";
import { UnauthorizedError } from "../lib/error.ts";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractAccessTokenFromReq(req);
    const decoded = decodeAccessToken(token);

    req.userId = decoded.userId;
    req.userRole = decoded.userRole;

    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthorized"));
  }
};
