import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      birthdate: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.status(200).json(users);
};
