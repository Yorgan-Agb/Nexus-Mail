import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation.ts";
import {
  login,
  register,
  logout,
  refreshAccessToken,
  profile,
} from "../services/auth.service.ts";
import { setRefreshTokenCookie } from "../lib/cookie.ts";
import { extractRefreshTokenFromReq } from "../lib/auth.ts";

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
  const newAccessToken = await refreshAccessToken(req);
  res.status(200).json({ accessToken: newAccessToken });
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = extractRefreshTokenFromReq(req);

  await logout(refreshToken);
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const profileUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = await profile(userId);
  res.status(200).json({ user });
};
