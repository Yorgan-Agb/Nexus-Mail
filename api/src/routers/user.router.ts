import { Router } from "express";
import {
  getAllUsers,
  profileUser,
  changeProfileUser,
} from "../controllers/user.controller.ts";
import { checkAuth } from "../middlewares/auth.middleware.ts";

export const userRouter = Router();

userRouter.get("/", checkAuth, getAllUsers);
userRouter.get("/me", checkAuth, profileUser);
userRouter.put("/me", checkAuth, changeProfileUser);
