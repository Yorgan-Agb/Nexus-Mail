import type { RegisterInput } from "../validations/auth.validation.ts";
import { prisma } from "../models/index.ts";
import argon2 from "argon2";

export const register = async (data: RegisterInput) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (isUserExist) {
    throw new Error("User already exists");
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
