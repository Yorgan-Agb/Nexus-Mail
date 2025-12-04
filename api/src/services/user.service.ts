import { NotFoundError, UnauthorizedError } from "../lib/error.ts";
import { prisma } from "../models/index.ts";
import type {
  ChangeProfileInput,
  ChangePasswordInput,
} from "../validations/user.validation.ts";
import argon2 from "argon2";

export const profile = async (userId: string) => {
  const parseId = Number(userId);
  const user = await prisma.user.findUnique({
    where: { id: parseId },
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
  userId: string,
  data: ChangeProfileInput
) => {
  const parseId = Number(userId);
  const user = await prisma.user.findUnique({
    where: { id: parseId },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseId },
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
  userId: string,
  data: ChangePasswordInput
) => {
  const parseId = Number(userId);
  const user = await prisma.user.findUnique({
    where: { id: parseId },
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
    where: { id: parseId },
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

export const deleteAccount = async (userId: string) => {
  const parseId = Number(userId);
  const user = await prisma.user.findUnique({
    where: { id: parseId },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  await prisma.refreshToken.deleteMany({
    where: { userId: parseId },
  });

  await prisma.user.delete({
    where: { id: parseId },
  });
};
