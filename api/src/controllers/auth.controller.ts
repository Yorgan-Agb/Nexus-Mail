import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation.ts";
import { login, register } from "../services/auth.service.ts";
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

// Extraire le refresh token depuis la requête
// Décoder et vérifier le refresh token (JWT valide ?)
// Vérifier que le token existe en BDD et n'est pas expiré
// Générer un nouveau access token
// (Optionnel) Générer un nouveau refresh token
// Mettre à jour lastUsedAt du refresh token en BDD
// Retourner le(s) nouveau(x) token(s)

export const tokenRefresh = async (req: Request, res: Response) => {
  const extractToken = req.cookies["refreshToken"];
  extractRefreshTokenFromReq(extractToken);
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
  const newAccessToken = generateAccessToken;
};
