import { Router } from "express";
import {
  getAllUsers,
  profileUser,
  changeProfileUser,
  changePasswordUser,
  deleteUser,
} from "../controllers/user.controller.ts";
import { checkAuth } from "../middlewares/auth.middleware.ts";

export const userRouter = Router();

userRouter.get("/", checkAuth, getAllUsers);
userRouter.get("/me", checkAuth, profileUser);
userRouter.patch("/me", checkAuth, changeProfileUser);
userRouter.patch("/me/password", checkAuth, changePasswordUser);
userRouter.delete("/me", checkAuth, deleteUser);
