import type { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation.ts";
import { register } from "../services/auth.service.ts";

export const registerUser = async (req: Request, res: Response) => {
  const userData = registerSchema.parse(req.body);
  await register(userData);
  res.status(201).json({ message: "User registered successfully" });
};
