import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.ts";
import { tokenRefresh } from "../controllers/auth.controller.ts";
import { checkAuth } from "../middlewares/auth.middleware.ts";

export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", tokenRefresh);
authRouter.post("/logout", logoutUser);
