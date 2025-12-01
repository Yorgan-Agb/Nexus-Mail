import { NotFoundError } from "../lib/error.ts";
import { prisma } from "../models/index.ts";
import type { ChangeProfileInput } from "../validations/user.validation.ts";
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
