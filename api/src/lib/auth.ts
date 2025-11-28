import { UnauthorizedError } from "./error.ts";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config } from "../../config.ts";
import type { User } from "../models/index.ts";

export const generateAccessToken = (user: User) => {
  const payload = {
    userId: user.id,
    userRole: user.role,
  };
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "1h",
  });
  return accessToken;
};

export const generateRefreshToken = (user: User) => {
  const payload = {
    userId: user.id,
    userRole: user.role,
  };
  const refreshToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "24h",
  });
  return refreshToken;
};

export interface UserPayload extends JwtPayload {
  userId: string;
  userRole: string;
}

export const decodeRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

export const extractRefreshTokenFromReq = (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization header missing or malformed");
  }
  const refreshToken = authHeader.split(" ")[1];
  return refreshToken;
};
