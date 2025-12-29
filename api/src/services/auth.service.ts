import type { RegisterInput } from "../validations/auth.validation.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/error.ts";
import {
  generateAccessToken,
  extractRefreshTokenFromReq,
  generateRefreshToken,
} from "../lib/auth.ts";
import type { Request } from "express";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: RegisterInput) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (isUserExist) {
    throw new ConflictError("User already exists");
  }
  const hashedPassword = await argon2.hash(data.password);

  const newUser = await prisma.user.create({
    data: {
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      password: hashedPassword,
      birthdate: new Date(data.birthdate),
    },
  });
  const defaultFolders = [
    {
      name: "Inbox",
      type: "inbox",
      userId: newUser.id,
    },
    {
      name: "Spam",
      type: "spam",
      userId: newUser.id,
    },
    {
      name: "Sent",
      type: "sent",
      userId: newUser.id,
    },
    {
      name: "Drafts",
      type: "drafts",
      userId: newUser.id,
    },
    {
      name: "Trash",
      type: "trash",
      userId: newUser.id,
    },
  ];
  await prisma.folder.createMany({
    data: defaultFolders,
  });
};

export const refreshAccessToken = async (req: Request) => {
  const extractToken = extractRefreshTokenFromReq(req);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: extractToken },
  });
  if (!storedToken) {
    throw new UnauthorizedError("Refresh token not found");
  }
  if (storedToken.expire_at < new Date()) {
    throw new UnauthorizedError("Refresh token expired");
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
  return newAccessToken;
};

export const login = async (
  email: string,
  password: string,
  userAgent: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundError("User does not exist");
  }
  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid mail or password");
  }
  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      user_agent: userAgent,
      expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      last_used_at: new Date(Date.now()),
    },
  });
  return { accessToken: token, refreshToken };
};

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};
