import { NotFoundError, UnauthorizedError } from "../lib/error.ts";
import { prisma } from "../models/index.ts";
import { Prisma } from "../models/index.ts";
import type {
  ChangeProfileInput,
  ChangePasswordInput,
} from "../validations/user.validation.ts";
import argon2 from "argon2";

export const profile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      birthdate: true,
      credit_ai: true,
    },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const changeProfile = async (
  userId: number,
  data: ChangeProfileInput
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (data.email && data.email !== user.email) {
    const isEmailTaken = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (isEmailTaken) {
      throw new UnauthorizedError("Email is already taken");
    }
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      birthdate: true,
      credit_ai: true,
    },
  });

  return updatedUser;
};

export const changePassword = async (
  userId: number,
  data: ChangePasswordInput
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordValid = await argon2.verify(
    user.password,
    data.currentPassword
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }
  const hashedNewPassword = await argon2.hash(data.newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      birthdate: true,
      credit_ai: true,
    },
  });

  return updatedUser;
};

export const deleteAccount = async (userId: number) => {
  try {
    await prisma.refreshToken.deleteMany({
      where: { userId: userId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
    }
    throw error;
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};
