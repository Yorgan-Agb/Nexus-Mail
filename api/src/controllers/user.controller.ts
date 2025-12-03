import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import {
  profile,
  changeProfile,
  changePassword,
  deleteAccount,
} from "../services/user.service.ts";
import { UnauthorizedError, ForbiddenError } from "../lib/error.ts";
import {
  changePasswordSchema,
  changeProfileSchema,
} from "../validations/user.validation.ts";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      birthdate: true,
      credit_ai: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const role = req.userRole;
  if (role !== "admin") {
    throw new ForbiddenError("Access denied");
  }
  res.status(200).json({ users });
};

export const profileUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = await profile(userId);
  res.status(200).json({ user });
};

export const changeProfileUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const userData = changeProfileSchema.parse(req.body);
  const updatedUser = await changeProfile(userId, userData);
  res.status(200).json({ user: updatedUser });
};

export const changePasswordUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const userData = changePasswordSchema.parse(req.body);
  const updatedUser = await changePassword(userId, userData);
  res.status(200).json({ user: updatedUser });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  await deleteAccount(userId);
  res.status(200).json({ message: "User account deleted successfully" });
};
