import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation.ts";
import { login, register, logout } from "../services/auth.service.ts";
import { setRefreshTokenCookie } from "../lib/cookie.ts";
import { prisma } from "../models/index.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  extractRefreshTokenFromReq,
} from "../lib/auth.ts";
import { NotFoundError } from "../lib/error.ts";
import e from "express";

export const registerUser = async (req: Request, res: Response) => {
  const userData = registerSchema.parse(req.body);
  await register(userData);
  res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const userAgent = req.headers["user-agent"] || "";
  const { accessToken, refreshToken } = await login(email, password, userAgent);
  setRefreshTokenCookie(res, refreshToken);
  res.status(200).json({ accessToken, refreshToken });
};

export const tokenRefresh = async (req: Request, res: Response) => {
  const extractToken = extractRefreshTokenFromReq(req);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: extractToken },
  });
  if (!storedToken) {
    throw new NotFoundError("Refresh token not found");
  }
  if (storedToken.expire_at < new Date()) {
    throw new NotFoundError("Refresh token expired");
  }
  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const newAccessToken = generateAccessToken(user);

  await prisma.refreshToken.update({
    where: { token: extractToken },
    data: {
      last_used_at: new Date(Date.now()),
    },
  });
  res.status(200).json({ accessToken: newAccessToken });
};

export const logoutUser = async (req: Request, res: Response) => {
  console.log("req.cookies:", req.cookies);
  console.log("req.body:", req.body);
  const refreshToken = extractRefreshTokenFromReq(req);
  console.log("Extracted refreshToken:", refreshToken);
  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
  await logout(refreshToken);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
