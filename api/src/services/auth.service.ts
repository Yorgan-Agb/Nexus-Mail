import type { RegisterInput } from "../validations/auth.validation.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";
import { ConflictError, NotFoundError } from "../lib/error.ts";
import {
  generateAccessToken,
  extractRefreshTokenFromReq,
  generateRefreshToken,
} from "../lib/auth.ts";

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
    throw new ConflictError("Invalid mail or password");
  }
  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      user_agent: userAgent,
      expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return { accessToken: token, refreshToken };
};
