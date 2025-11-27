import type { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation.ts";
import { register } from "../services/auth.service.ts";

export const registerUser = async (req: Request, res: Response) => {
  const userData = registerSchema.parse(req.body);
  await register(userData);
  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Login endpoint" });
};
